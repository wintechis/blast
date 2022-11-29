const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

module.exports = {
  eslint: {
    enable: false,
  },

  webpack: {
    resolve: {
      alias: {
        '@mui/styled-engine': '@mui/styled-engine-sc',
      },
      extensions: ['.js', '.ts'],
      plugins: [
        PnpWebpackPlugin,
      ],
    },
    resolveLoader: {
      plugins: [
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
  },
};
