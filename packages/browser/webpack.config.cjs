'use strict';

const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const browserConfig = {
  entry: {
    browser: './src/index.ts',
  },
  output: {
      path: path.resolve(__dirname, './dist/'),
      filename: 'blast.browser.js',
      library: {
        type: 'module',
      },
      module: true,
    },
    experiments: {
      outputModule: true,
    },
  target: 'web',
  devtool: 'inline-cheap-module-source-map',
  mode: 'development',
  optimization: {
    minimize: false,
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      stream: require.resolve('readable-stream/lib/stream'),
    },
    fallback: {
      fs: false,
      process: require.resolve('process/browser'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = browserConfig;
