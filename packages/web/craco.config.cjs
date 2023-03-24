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
    },
    plugins: [
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
};
