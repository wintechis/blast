'use strict';

const path = require('path');

const tdConfig = {
  entry: {
    tds: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'blast.tds.js',
    chunkFormat: 'module',
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
  mode: 'production',
  target: 'node',
};

module.exports = tdConfig;
