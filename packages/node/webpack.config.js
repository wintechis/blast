import {resolve} from 'path';
import nodeExternals from 'webpack-node-externals'

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
    ],
  },
  target: 'node',
  externals: [
    nodeExternals({
      modulesFromFile: true,
    }),
  ],
};
