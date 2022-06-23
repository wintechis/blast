const path = require('path');
const {ProvidePlugin} = require('webpack');
const {DefinePlugin} = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devServer: {
    https: true,
    port: 3000,
    static: path.join(__dirname, ''),
    watchFiles: [
      'index.html',
      'style.css',
      'dist/app.js',
      'src/**/*.js',
      '../../src/**/*.js',
      '../../src/**/*.ts',
    ],
  },
  optimization: {
    minimize: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    library: {
      name: 'blast',
      type: 'umd2',
    },
    globalObject: 'this',
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
  externals: {
    coffeeScript: 'coffee-script',
    vm2: 'vm2',
  },
};
