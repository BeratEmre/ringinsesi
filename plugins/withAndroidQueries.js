const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidQueries(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    manifest.queries = manifest.queries || [{}];
    manifest.queries[0].intent = [
      { action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }], data: [{ $: { 'android:scheme': 'http' } }] },
      { action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }], data: [{ $: { 'android:scheme': 'https' } }] },
      { action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }], data: [{ $: { 'android:scheme': 'market' } }] },
    ];
    return config;
  });
};