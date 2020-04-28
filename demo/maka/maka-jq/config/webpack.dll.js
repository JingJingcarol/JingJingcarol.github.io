
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    vendor: ["underscore","jquery","localforage","toastr"]
  },
  output: {
    path: path.join(__dirname, "../dist/dll/"),
    filename: "dll.[name].js",
    library:'[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      name:'[name]_[hash]',
      path: path.join(__dirname, "../dist/dll/[name]-manifest.json")
    }),
  ]
};

