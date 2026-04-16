const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Suppress the @firebase/auth React Native subpath export warning.
// Metro falls back to file-based resolution correctly — this is cosmetic only.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
