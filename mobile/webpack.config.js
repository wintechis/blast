const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = [{
  mode: 'development',
  entry: ['./app.scss', './app.js'],
  output: {
    filename: 'bundle.js',
    library: 'app',
    libraryTarget: 'window',
    libraryExport: 'default',
  },
  devServer: {
    contentBase: 'target',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      domain: process.env.PROJECT_DOMAIN,
      inject: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'bundle.css',
            },
          },
          {loader: 'extract-loader'},
          {loader: 'css-loader'},
          {
            loader: path.resolve('fast-sass-loader.js'),
            options: {
              includePaths: ['./node_modules'],
            },
          },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-object-assign'],
        },
      },
    ],
  },
}];
