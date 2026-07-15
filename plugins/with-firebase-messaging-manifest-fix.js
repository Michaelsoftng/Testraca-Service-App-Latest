// Both expo-notifications and @react-native-firebase/messaging declare
// <meta-data> entries for the FCM default channel and notification color.
// Gradle's manifest merger rejects duplicate attributes unless the app-level
// manifest declares `tools:replace` on the winning entry.
//
// This plugin runs in TWO phases to cover all Expo plugin ordering scenarios:
//
//   Phase 1 — withAndroidManifest: operates on the in-memory parsed manifest
//   object. Because our plugin is registered LAST in app.json, this callback
//   runs after expo-notifications' withAndroidManifest has already inserted its
//   meta-data entries into the object. We add tools:replace directly.
//
//   Phase 2 — withDangerousMod: runs after ALL withAndroidManifest results are
//   flushed to disk. Acts as a belt-and-suspenders backup in case any plugin
//   re-writes the file after Phase 1 (e.g., via its own withDangerousMod).

const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FCM_CHANNEL_META = 'com.google.firebase.messaging.default_notification_channel_id';
const FCM_COLOR_META   = 'com.google.firebase.messaging.default_notification_color';
const TOOLS_NS         = 'http://schemas.android.com/tools';

// ─── Phase 1: withAndroidManifest ────────────────────────────────────────────
function fixWithAndroidManifest(config) {
  return withAndroidManifest(config, (config) => {
    const { manifest } = config.modResults;

    // Declare xmlns:tools on the root <manifest> element so the tools:replace
    // attributes below are valid XML when Expo serialises the manifest to disk.
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = TOOLS_NS;
    }

    const application = manifest.application?.[0];
    if (!application) return config;

    let channelFixed = false;
    let colorFixed   = false;

    for (const item of (application['meta-data'] ?? [])) {
      const name = item.$?.['android:name'];

      if (name === FCM_CHANNEL_META) {
        // android:value is a plain string → tools:replace="android:value"
        item.$['tools:replace'] = 'android:value';
        channelFixed = true;
      }
      if (name === FCM_COLOR_META) {
        // android:resource is a drawable/color ref → tools:replace="android:resource"
        item.$['tools:replace'] = 'android:resource';
        colorFixed = true;
      }
    }

    if (channelFixed || colorFixed) {
      console.log(
        '[with-firebase-messaging-manifest-fix] Phase 1: added tools:replace to',
        { channelFixed, colorFixed },
      );
    } else {
      console.warn(
        '[with-firebase-messaging-manifest-fix] Phase 1: FCM meta-data entries not yet present ' +
        'in manifest object — Phase 2 (withDangerousMod) will handle them.',
      );
    }

    return config;
  });
}

// ─── Phase 2: withDangerousMod ───────────────────────────────────────────────
function fixWithDangerousMod(config) {
  return withDangerousMod(config, [
    'android',
    (config) => {
      const manifestPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/AndroidManifest.xml',
      );

      if (!fs.existsSync(manifestPath)) {
        console.warn('[with-firebase-messaging-manifest-fix] Phase 2: manifest not found, skipping.');
        return config;
      }

      let content = fs.readFileSync(manifestPath, 'utf8');
      const original = content;

      // Ensure xmlns:tools is declared on <manifest …>
      if (!content.includes('xmlns:tools=')) {
        content = content.replace(
          /(<manifest\b)/,
          `$1 xmlns:tools="${TOOLS_NS}"`,
        );
      }

      // Add tools:replace to each FCM meta-data entry that is missing it.
      // Only patches entries that don't already have it (Phase 1 may have
      // already serialised the attribute into the file).
      content = patchMetaData(content, FCM_CHANNEL_META, 'android:value');
      content = patchMetaData(content, FCM_COLOR_META,   'android:resource');

      if (content !== original) {
        fs.writeFileSync(manifestPath, content, 'utf8');
        console.log('[with-firebase-messaging-manifest-fix] Phase 2: patched AndroidManifest.xml.');
      } else {
        console.log('[with-firebase-messaging-manifest-fix] Phase 2: no changes needed (Phase 1 already applied).');
      }

      return config;
    },
  ]);
}

/**
 * Finds every <meta-data> element whose android:name equals `targetName` and
 * inserts `tools:replace="<replaceAttr>"` before the self-closing `/>` if the
 * attribute is not already present.
 */
function patchMetaData(content, targetName, replaceAttr) {
  const nameAttr = `android:name="${targetName}"`;
  if (!content.includes(nameAttr)) return content;

  let result    = content;
  let searchPos = 0;

  while (searchPos < result.length) {
    const nameIdx = result.indexOf(nameAttr, searchPos);
    if (nameIdx === -1) break;

    // Walk backward to the opening of this <meta-data tag.
    const tagOpenIdx = result.lastIndexOf('<meta-data', nameIdx);
    if (tagOpenIdx === -1) { searchPos = nameIdx + nameAttr.length; continue; }

    // Walk forward to the self-closing />.
    const tagCloseIdx = result.indexOf('/>', nameIdx);
    if (tagCloseIdx === -1) { searchPos = nameIdx + nameAttr.length; continue; }

    // Sanity: no other tag should have opened between our tag open and close.
    const between = result.slice(tagOpenIdx + 1, tagCloseIdx);
    if (between.includes('<')) { searchPos = tagCloseIdx + 2; continue; }

    const tagContent = result.slice(tagOpenIdx, tagCloseIdx + 2);

    if (!tagContent.includes('tools:replace')) {
      const insertion = `\n            tools:replace="${replaceAttr}"`;
      result    = result.slice(0, tagCloseIdx) + insertion + result.slice(tagCloseIdx);
      searchPos = tagCloseIdx + insertion.length + 2;
    } else {
      searchPos = tagCloseIdx + 2;
    }
  }

  return result;
}

// ─── Export ───────────────────────────────────────────────────────────────────
module.exports = function withFirebaseMessagingManifestFix(config) {
  config = fixWithAndroidManifest(config);
  config = fixWithDangerousMod(config);
  return config;
};
