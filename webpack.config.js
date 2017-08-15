const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'aws-cognito-wrapper',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
  stats: {
    colors: true,
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
  node: {
    __dirname: true,
  },
  target: 'node',
  devtool: 'source-map',
};
