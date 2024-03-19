'use strict';

const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const browserConfig = {
  entry: {
    browser: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'blast.browser.js',
    chunkFormat: 'module',
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
  target: 'web',
  devtool: 'inline-cheap-module-source-map',
  mode: 'production',
  plugins: [new NodePolyfillPlugin()],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      stream: require.resolve('readable-stream/lib/stream'),
    },
    fallback: {
      fs: false,
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
