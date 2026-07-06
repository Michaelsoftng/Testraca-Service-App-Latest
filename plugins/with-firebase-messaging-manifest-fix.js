// expo-notifications and @react-native-firebase/messaging both inject a
// <meta-data android:name="com.google.firebase.messaging.default_notification_color">
// entry into AndroidManifest.xml, causing a Manifest merger conflict at Gradle build time.
//
// We use withDangerousMod (not withAndroidManifest) so the patch runs AFTER Expo has
// already flushed all withAndroidManifest results to disk — this guarantees we see the
// expo-notifications entry regardless of which modifier it uses internally.
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FCM_COLOR_META_DATA = 'com.google.firebase.messaging.default_notification_color';
const FCM_CHANNEL_META_DATA = 'com.google.firebase.messaging.default_notification_channel_id';
const TOOLS_NS = 'http://schemas.android.com/tools';

module.exports = function withFirebaseMessagingManifestFix(config) {
  return withDangerousMod(config, [
    'android',
    (config) => {
      const manifestPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/AndroidManifest.xml'
      );

      if (!fs.existsSync(manifestPath)) {
        console.warn('[with-firebase-messaging-manifest-fix] AndroidManifest.xml not found, skipping.');
        return config;
      }

      let manifest = fs.readFileSync(manifestPath, 'utf8');
      const original = manifest;

      // Ensure xmlns:tools is declared on the root <manifest> element
      if (!manifest.includes('xmlns:tools=')) {
        manifest = manifest.replace(
          /(<manifest\b)/,
          `$1 xmlns:tools="${TOOLS_NS}"`
        );
      }

      // Add tools:replace="android:resource" to each conflicting meta-data entry
      for (const targetName of [FCM_COLOR_META_DATA, FCM_CHANNEL_META_DATA]) {
        manifest = addToolsReplace(manifest, targetName);
      }

      if (manifest !== original) {
        fs.writeFileSync(manifestPath, manifest);
        console.log('[with-firebase-messaging-manifest-fix] Patched AndroidManifest.xml with tools:replace on FCM meta-data entries.');
      }

      return config;
    },
  ]);
};

function addToolsReplace(manifest, targetName) {
  const nameAttrFragment = `android:name="${targetName}"`;
  if (!manifest.includes(nameAttrFragment)) return manifest;

  let result = manifest;
  let searchPos = 0;

  while (searchPos < result.length) {
    const nameIdx = result.indexOf(nameAttrFragment, searchPos);
    if (nameIdx === -1) break;

    // Walk back to find the opening of the <meta-data tag
    const tagOpenIdx = result.lastIndexOf('<meta-data', nameIdx);
    if (tagOpenIdx === -1) { searchPos = nameIdx + 1; continue; }

    // Find the self-closing end />
    const tagCloseIdx = result.indexOf('/>', tagOpenIdx);
    if (tagCloseIdx === -1) { searchPos = nameIdx + 1; continue; }

    const tagContent = result.substring(tagOpenIdx, tagCloseIdx + 2);

    if (!tagContent.includes('tools:replace')) {
      const insertion = '\n            tools:replace="android:resource"';
      result =
        result.slice(0, tagCloseIdx) +
        insertion +
        result.slice(tagCloseIdx);
      searchPos = tagCloseIdx + insertion.length + 2;
    } else {
      searchPos = tagCloseIdx + 2;
    }
  }

  return result;
}
