// run gulp add-drivers to complete this config first
'use strict';

const path = require('path');
const {ProvidePlugin} = require('webpack');
const {DefinePlugin} = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const nodeConfig = {
  entry: {
    index: './src/wot/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'blast.node.js',
    chunkFormat: 'module',
    library: {
      type: 'module',
    },
  },
  devtool: 'source-map',
  experiments: {
    outputModule: true,
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      BluetoothAdapter$: path.resolve(
        __dirname,
        './src/wot/bindings/binding-bluetooth/NodeBluetoothAdapter.ts'
      ),
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
              configFile: 'tsconfig.node.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
  externals: {
    coffeeScript: 'coffee-script',
    vm2: 'vm2',
  },
};

const webConfig = {
  entry: {
    web: './src/wot/index.ts',
    tds: './src/td/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'blast.[name].js',
    chunkFormat: 'module',
    library: {
      type: 'module',
    },
  },
  devtool: 'source-map',
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
  externals: {
    coffeeScript: 'coffee-script',
    vm2: 'vm2',
  },
};

module.exports = [nodeConfig, webConfig];
