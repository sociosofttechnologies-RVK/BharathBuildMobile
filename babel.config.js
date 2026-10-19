module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // NativeWind v2 only needs its babel plugin. Reanimated's plugin must stay last.
    plugins: ["nativewind/babel", "react-native-reanimated/plugin"],
  };
};
