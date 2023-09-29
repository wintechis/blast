'use strict';

const path = require('path');

const nodeConfig = {
  entry: {
    node: './src/wot/index.ts',
    hidHelpers: './src/wot/bindings/binding-hid/hidHelpers/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'blast.[name].js',
    chunkFormat: 'module',
    library: {
      type: 'module',
    },
  },
  devtool: 'eval-source-map',
  experiments: {
    outputModule: true,
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      BluetoothAdapter$: path.resolve(
        __dirname,
        './src/wot/bindings/binding-bluetooth/NodeBluetoothAdapter.ts'
      ),
      HidAdapter$: path.resolve(
        __dirname,
        './src/wot/bindings/binding-hid/NodeHidAdapter.ts'
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
  externals: ['node-hid'],
};

module.exports = nodeConfig;
