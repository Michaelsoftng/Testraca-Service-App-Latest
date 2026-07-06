// FirebaseCoreInternal (Swift) depends on GoogleUtilities, which does not
// define modules. CocoaPods requires `use_modular_headers!` (or per-pod
// `:modular_headers => true`) so it generates module maps that allow Swift
// pods to import non-modular Objective-C pods as static libraries.
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MARKER = '# [with-ios-modular-headers]';

module.exports = function withIosModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile'
      );

      if (!fs.existsSync(podfilePath)) {
        console.warn('[with-ios-modular-headers] Podfile not found, skipping.');
        return config;
      }

      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (podfile.includes(MARKER)) {
        return config; // idempotent
      }

      // Insert use_modular_headers! after the platform line so it applies
      // globally before any target or pod declarations.
      const platformMatch = podfile.match(/^platform :ios,.*$/m);
      if (!platformMatch) {
        console.warn('[with-ios-modular-headers] Could not find platform line, skipping.');
        return config;
      }

      const insertAfter = platformMatch.index + platformMatch[0].length;
      const injection = `\n${MARKER}\nuse_modular_headers!`;

      podfile =
        podfile.slice(0, insertAfter) +
        injection +
        podfile.slice(insertAfter);

      fs.writeFileSync(podfilePath, podfile);
      console.log('[with-ios-modular-headers] Podfile patched — use_modular_headers! added.');

      return config;
    },
  ]);
};
