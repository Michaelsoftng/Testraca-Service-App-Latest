module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      './babel/nativewind-no-worklets',
    ],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};