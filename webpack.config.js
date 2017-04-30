var webpack = require('webpack')
var path = require('path')

var BUILD_DIR = path.resolve(__dirname, 'dist')
var SRC_DIR = path.resolve(__dirname, 'src')

var config = {
  entry: SRC_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.css'],
    root: SRC_DIR,
  },
  module : {
    loaders : [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel?cacheDirectory',
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ],
  },
}

module.exports = config
