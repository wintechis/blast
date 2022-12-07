const PnpWebpackPlugin = require('pnp-webpack-plugin');
const {ProvidePlugin} = require('webpack');

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
      plugins: [PnpWebpackPlugin],
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
    plugins: [
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
};
