/* eslint-disable import/no-extraneous-dependencies */
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { override, adjustStyleLoaders } = require('customize-cra');

module.exports = override(
    (config) => {
        // Remove the ModuleScopePlugin which throws when we try to import something
        // outside of src/.
        config.resolve.plugins.pop();
    
        // Resolve the path aliases.
        config.resolve.plugins.push(new TsconfigPathsPlugin());
    
        // Let Babel compile outside of src/.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const oneOfRule = config.module.rules.find((rule) => rule.oneOf);
        const tsRule = oneOfRule.oneOf.find((rule) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            rule.test.toString().includes("ts|tsx")
        );
        tsRule.include = undefined;
        tsRule.exclude = /node_modules/;
    
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    
        config.optimization.splitChunks = {
          cacheGroups: { default: false }
        };
        config.optimization.runtimeChunk = false;
    
        return config;
    },
    adjustStyleLoaders(({ use }) => {
        use.forEach((loader) => {
          if (/mini-css-extract-plugin/.test(loader.loader)) {
            loader.loader = require.resolve('style-loader');
            loader.options = {};
          }
        });
      })
);
