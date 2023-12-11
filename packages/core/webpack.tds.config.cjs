'use strict';

const path = require('path');

const tdConfig = {
  entry: {
    tds: './src/td/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'blast.[name].cjs',
    library: {
      type: 'commonjs-static',
    },
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.tds.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = tdConfig;
