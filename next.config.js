const path = require('path');

module.exports = {
    reactStrictMode: true,
    webpack: (config) => {
      // this will override the experiments
      config.experiments = { topLevelAwait: true, asyncWebAssembly: true };
      // this will just update topLevelAwait property of config.experiments
      // config.experiments.topLevelAwait = true 
      return config;
    },
  };