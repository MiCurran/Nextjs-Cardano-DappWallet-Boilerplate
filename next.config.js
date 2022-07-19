const path = require('path');

module.exports = {
    reactStrictMode: true,
    webpack: (config) => {
      config.experiments = { topLevelAwait: true, asyncWebAssembly: true };
      return config;
    },
  };