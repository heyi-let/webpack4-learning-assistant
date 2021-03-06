const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require('webpack');

module.exports = merge(common, {
  devtool: "source-map",
  devServer: {
    contentBase: "./dist",
    hot: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});
