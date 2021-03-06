const webpack = require('webpack');
const path = require('path');
const babelConfig = require('babel-preset-cerebro-plugin');

const paths = require('./paths')

module.exports = {
  entry: {
    index: './src/index'
  },
  output: {
    path: paths.dist,
    libraryTarget: 'commonjs2',
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ]
  },
  target: 'electron-renderer',
  externals: ['nodobjc'],
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: babelConfig
      },
      exclude: (modulePath) => (
        modulePath.match(/node_modules/) && !modulePath.match(/node_modules[\/\\]cerebro-/)
      )
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        query: {
          modules: true
        }
      }]
    }, {
      test: /\.png$/,
      use: {
        loader: 'url-loader'
      }
    }]
  },
  plugins: [
    // Use react and ReactDOM flom global variables 
    // instead of adding them to each plugin separately
    new webpack.ProvidePlugin({
      'window.React': 'react',
      'window.ReactDOM': 'react-dom'
    })
  ]
};
