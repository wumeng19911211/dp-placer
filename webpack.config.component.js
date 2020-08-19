const path = require('path')
module.exports = {
  entry:'./component/DpPlacer.js',
  output: {
    path: path.resolve(__dirname,'lib'),
    filename: 'index.min.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules:[
      { test:/\.js$/, use:'babel-loader',exclude:/node_modules/},
      { test:/\.ts$/, use:'ts-loader', exclude:/node_modules/},
    ]
  },
  plugins:[
  ]
}