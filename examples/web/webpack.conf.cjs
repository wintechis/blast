const path = require('path');
const {ProvidePlugin} = require('webpack');
const {DefinePlugin} = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: 'eval-source-map',
  devServer: {
    https: true,
    port: 3000,
    static: path.join(__dirname, ''),
    watchFiles: ['index.html', 'style.css', 'dist/app.js'],
  },
  experiments: {
    outputModule: true,
  },
  optimization: {
    minimize: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    library: {
      type: 'module',
    },
  },
  mode: 'development',
  plugins: [
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new DefinePlugin({
      'process.versions.node': JSON.stringify(process.versions.node),
    }),
    new NodePolyfillPlugin(),
  ],
  resolve: {
    fallback: {
      fs: false,
    },
  },
  target: 'web',
  externalsType: 'script',
  externals: {
    '@node-wot/core': [
      'https://cdn.jsdelivr.net/npm/@node-wot/browser-bundle@latest/dist/wot-bundle.min.js',
      'Wot',
    ],
  },
};
