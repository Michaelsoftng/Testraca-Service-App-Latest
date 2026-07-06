const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

const defaultResolveRequest = resolver.resolveRequest;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo")
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
  resolveRequest: (context, moduleName, platform) => {
    const remapped = moduleName === "event-target-shim/index" ? "event-target-shim" : moduleName;

    if (defaultResolveRequest) {
      return defaultResolveRequest(context, remapped, platform);
    }

    return context.resolveRequest(context, remapped, platform);
  }
};

module.exports = withNativeWind(config, { input: "./global.css" });
