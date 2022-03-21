const path = require('path');
const {ProvidePlugin} = require('webpack');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
  mode: 'development',
  plugins: [
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  resolve: {
    fallback: {
      'fs': false,
    },
  },
};
