// app.json holds all static config. This file only exists to let EAS Build
// override googleServicesFile via file-type secrets (GOOGLE_SERVICES_JSON /
// GOOGLE_SERVICE_INFO_PLIST) so the credentials never have to be committed
// to git. The env vars are set by `eas secret:create --type file` and are
// automatically injected as paths on the EAS build worker.
//
// Local dev: env vars are unset → falls back to the local files that already
// exist alongside this file (and remain gitignored).

module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? config.android?.googleServicesFile,
  },
  ios: {
    ...config.ios,
    googleServicesFile:
      process.env.GOOGLE_SERVICE_INFO_PLIST ?? config.ios?.googleServicesFile,
  },
});
