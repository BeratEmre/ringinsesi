// plugins/targetSdk35.js
module.exports = function withTargetSdk35(config) {
  return {
    ...config,
    android: {
      ...config.android,
      buildProperties: {
        targetSdkVersion: 35
      }
    }
  };
};
