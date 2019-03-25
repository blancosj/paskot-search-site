const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [
    './src/index.jsx'
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../public'),
    // publicPath: 'dist',
    filename: 'bundle-front.js',
  },
  module: {
    rules: [
      {
        test: /\.js|.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    })
  ]
}
