const path = require("path");
const webpack = require("webpack");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
module.exports = {
    plugins: [
        new webpack.DllReferencePlugin({
          manifest: path.join(__dirname, "../dist/dll/vendor-manifest.json")
        }),
        new AddAssetHtmlPlugin({
          filepath: require.resolve(
            path.join(__dirname, "../dist/dll/dll.vendor.js")
          )
        }),
       
      ],
}