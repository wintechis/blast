const path = require('path');
const {ProvidePlugin} = require('webpack');
const {DefinePlugin} = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: 'eval-source-map',
  optimization: {
    minimize: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js', library: {
      name: 'blast',
      type: 'umd2',
    },
    globalObject: 'this',
  },
  module: {
    parser: {
      javascript: {
        commonjsMagicComments: true,
      },
    },
    rules: [
      {
        test: require.resolve('../../lib/js-interpreter/acorn_interpreter.js'),
        use:
            'exports-loader?type=commonjs&exports=Interpreter',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsontd?$/,
        type: 'asset/source',
      },
    ],
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
      'fs': false,
    },
  },
  target: 'web',
  externals: {
    coffeeScript: 'coffee-script',
    vm2: 'vm2',
  },
};
