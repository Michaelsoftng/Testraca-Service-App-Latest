// Both expo-notifications and @react-native-firebase/messaging declare
// <meta-data> entries for the FCM default channel and notification color.
// Gradle's manifest merger rejects duplicate attributes unless the app-level
// manifest declares `tools:replace` on the winning entry.
//
// ROOT CAUSE: Expo's prebuild runs withAndroidManifest in multiple passes.
// Our previous plugin only patched EXISTING entries (correct when running
// after expo-notifications) but expo-notifications can re-add the entries in
// a LATER pass after Phase 2 already patched the file — losing tools:replace.
//
// FIX: Phase 1 now PRE-CREATES the entries with tools:replace if they are not
// yet present. expo-notifications' addMetaDataItemToMainApplication only sets
// android:value / android:resource on a matching existing entry — it never
// removes other attributes. So tools:replace survives whether we run before
// or after expo-notifications in any pass.
//
// Phase 2 (withDangerousMod) is kept as a final-pass belt-and-suspenders
// guard that patches the serialised file on disk.

const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FCM_CHANNEL_META = 'com.google.firebase.messaging.default_notification_channel_id';
const FCM_COLOR_META   = 'com.google.firebase.messaging.default_notification_color';
const TOOLS_NS         = 'http://schemas.android.com/tools';

const CHANNEL_VALUE  = 'labtraca-default';
const COLOR_RESOURCE = '@color/notification_icon_color';

// ─── Phase 1: withAndroidManifest ────────────────────────────────────────────
function fixWithAndroidManifest(config) {
  return withAndroidManifest(config, (config) => {
    const { manifest } = config.modResults;

    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = TOOLS_NS;
    }

    const application = manifest.application?.[0];
    if (!application) return config;

    if (!application['meta-data']) {
      application['meta-data'] = [];
    }

    // ── channel_id ────────────────────────────────────────────────────────
    // If the entry already exists (expo-notifications ran before us in this
    // pass), add tools:replace to it. If it doesn't exist yet (we're running
    // first), pre-create it — expo-notifications will later update
    // android:value via addMetaDataItemToMainApplication which only sets the
    // value/resource attribute and preserves everything else (including our
    // tools:replace).
    const channelEntry = application['meta-data'].find(
      item => item.$?.['android:name'] === FCM_CHANNEL_META,
    );
    if (channelEntry) {
      channelEntry.$['tools:replace'] = 'android:value';
      console.log('[with-firebase-messaging-manifest-fix] Phase 1: channel_id — patched existing entry');
    } else {
      application['meta-data'].push({
        $: {
          'android:name':  FCM_CHANNEL_META,
          'android:value': CHANNEL_VALUE,
          'tools:replace': 'android:value',
        },
      });
      console.log('[with-firebase-messaging-manifest-fix] Phase 1: channel_id — pre-created entry with tools:replace');
    }

    // ── notification_color ────────────────────────────────────────────────
    const colorEntry = application['meta-data'].find(
      item => item.$?.['android:name'] === FCM_COLOR_META,
    );
    if (colorEntry) {
      colorEntry.$['tools:replace'] = 'android:resource';
      console.log('[with-firebase-messaging-manifest-fix] Phase 1: color — patched existing entry');
    } else {
      application['meta-data'].push({
        $: {
          'android:name':     FCM_COLOR_META,
          'android:resource': COLOR_RESOURCE,
          'tools:replace':    'android:resource',
        },
      });
      console.log('[with-firebase-messaging-manifest-fix] Phase 1: color — pre-created entry with tools:replace');
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
