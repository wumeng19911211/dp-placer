const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  entry: './demo/main.js',
  output: {
    path: path.resolve(__dirname,'dist'),
    filename:'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: '/node_module/' },
      { test: /\.css$/, use: ['style-loader','css-loader'] },
      { test: /\.scss$/, use: ['style-loader','css-loader','sass-loader'] },
      { test: /\.vue$/, use: 'vue-loader' },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'demo/index.html'),
      filename: 'index.html'
    }),
    new VueLoaderPlugin()
  ]
}