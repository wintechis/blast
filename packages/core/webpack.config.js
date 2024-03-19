import {resolve} from 'path';
import BundleDeclarationsWebpackPlugin from 'bundle-declarations-webpack-plugin';

export default {
  entry: {
    core: './src/index.ts',
  },
  output: {
    path: resolve('./dist'),
    filename: 'index.cjs',
    library: {
      type: 'commonjs-static',
    },
  },
  devtool: 'inline-cheap-module-source-map',
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
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
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  plugins: [
    new BundleDeclarationsWebpackPlugin.BundleDeclarationsWebpackPlugin(),
  ],
  target: 'node',
  node: {
    __dirname: false,
  },
  // externals: ['node-hid', 'hci-socket'],
};
