'use strict';

const path = require('path');
const {ProvidePlugin} = require('webpack');
const {DefinePlugin} = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const browserConfig = {
  entry: {
    browser: './src/wot/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'blast.[name].js',
    chunkFormat: 'module',
    library: {
      type: 'module',
    },
  },
  devtool: 'inline-cheap-module-source-map',
  experiments: {
    outputModule: true,
  },
  mode: 'production',
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
    extensions: ['.ts', '.js'],
    alias: {
      BluetoothAdapter$: path.resolve(
        __dirname,
        './src/wot/bindings/binding-bluetooth/WebBluetoothAdapter.ts'
      ),
      HidAdapter$: path.resolve(
        __dirname,
        './src/wot/bindings/binding-hid/WebHidAdapter.ts'
      ),
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
              configFile: 'tsconfig.web.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = browserConfig;
