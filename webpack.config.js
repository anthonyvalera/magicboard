var webpack = require('webpack');
var path = require('path');

var config = {
  entry: [path.resolve(__dirname, 'src/App.jsx'), path.resolve(__dirname, 'src/styles.scss')],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.scss$/,
      use: [{
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        },
        {
          loader: "sass-loader"
        }
      ]
    }]
  }
};

module.exports = config;