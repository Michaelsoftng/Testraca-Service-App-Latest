const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// fmt's FMT_STRING / FMT_COMPILE_STRING macros use consteval.  Apple Clang on
// the iOS 26 SDK (Xcode "latest" on EAS as of mid-2025) rejects several of
// these calls in ios/Pods/fmt/include/fmt/format-inl.h with:
//   "call to consteval function ... is not a constant expression"
// Setting FMT_USE_CONSTEVAL=0 makes fmt substitute constexpr instead of
// consteval, which Apple Clang accepts.
//
// RULES we discovered through failed builds:
//  1. CocoaPods forbids multiple post_install blocks — we must insert INTO
//     the existing one.
//  2. We must insert at the END of the block (just before its closing `end`),
//     because react_native_post_install() runs first and resets
//     OTHER_CPLUSPLUSFLAGS for many targets, overwriting any flag we set
//     before it.
//
// Strategy: locate `post_install do |installer|`, then scan FORWARD for the
// first unindented `\nend` (i.e. `end` at column 0).  Using lastIndexOf was
// fragile when other plugins (e.g. @react-native-firebase) append top-level
// blocks AFTER post_install, making lastIndexOf land outside the block and
// producing "undefined local variable or method `installer'" from CocoaPods.
const MARKER = '# [with-ios-fmt-fix]';
const POST_INSTALL_SIGNATURE = 'post_install do |installer|';

module.exports = function withIosFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      try {
        const podfilePath = path.join(
          config.modRequest.platformProjectRoot,
          'Podfile'
        );

        if (!fs.existsSync(podfilePath)) {
          console.warn('[with-ios-fmt-fix] Podfile not found, skipping.');
          return config;
        }

        let podfile = fs.readFileSync(podfilePath, 'utf8');

        if (podfile.includes(MARKER)) {
          return config; // idempotent — already patched
        }

        const blockStart = podfile.indexOf(POST_INSTALL_SIGNATURE);
        if (blockStart === -1) {
          console.warn('[with-ios-fmt-fix] No post_install do |installer| block found, skipping.');
          return config;
        }

        // Ruby to inject — indented 2 spaces to sit inside post_install do.
        const injection = `
  ${MARKER}
  # Applied at end of post_install so react_native_post_install() cannot
  # overwrite these settings.  FMT_USE_CONSTEVAL=0 stops fmt using consteval
  # in FMT_STRING / FMT_COMPILE_STRING, fixing Apple Clang iOS 26 SDK errors.
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |cfg|
      defs = cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS']
      case defs
      when Array
        unless defs.any? { |d| d.to_s.include?('FMT_USE_CONSTEVAL') }
          cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = defs + ['FMT_USE_CONSTEVAL=0']
        end
      when String
        unless defs.include?('FMT_USE_CONSTEVAL')
          cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = defs + ' FMT_USE_CONSTEVAL=0'
        end
      else
        cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = ['$(inherited)', 'FMT_USE_CONSTEVAL=0']
      end

      flags = cfg.build_settings['OTHER_CPLUSPLUSFLAGS'].to_s
      unless flags.include?('FMT_USE_CONSTEVAL')
        cfg.build_settings['OTHER_CPLUSPLUSFLAGS'] = (flags.empty? ? '$(inherited)' : flags) + ' -DFMT_USE_CONSTEVAL=0'
      end
    end
  end
`;

        // Scan forward from the post_install signature for its own closing `end`.
        // A top-level `end` is at column 0: it appears as `\nend` followed by
        // a newline or EOF (never `\nend` followed by another word character).
        // This correctly handles Podfiles where other plugins add blocks after
        // post_install (which broke the old lastIndexOf('\nend') approach).
        const searchFrom = blockStart + POST_INSTALL_SIGNATURE.length;
        const tail = podfile.substring(searchFrom);
        // Matches \nend at column 0, not \nend_something or \n  end (indented)
        const closingMatch = tail.match(/\nend(?=\n|$)/);
        if (!closingMatch) {
          console.warn('[with-ios-fmt-fix] Could not locate post_install closing end, skipping.');
          return config;
        }

        const insertPos = searchFrom + closingMatch.index;
        podfile =
          podfile.slice(0, insertPos) +
          injection +
          podfile.slice(insertPos);

        fs.writeFileSync(podfilePath, podfile);
        console.log('[with-ios-fmt-fix] Podfile patched — FMT_USE_CONSTEVAL=0 injected inside post_install.');
      } catch (err) {
        console.warn('[with-ios-fmt-fix] Podfile patch failed:', err.message);
      }

      return config;
    },
  ]);
};
