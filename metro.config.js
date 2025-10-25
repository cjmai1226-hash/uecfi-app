// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);
// Include .db files as assets so the bundled SQLite database is packaged
config.resolver.assetExts = config.resolver.assetExts.concat(['db', 'wasm']);

module.exports = config;
