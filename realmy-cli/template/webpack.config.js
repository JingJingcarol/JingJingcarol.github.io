const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const argv = require("yargs").argv;
const merge = require("webpack-merge");
const mode = argv.mode;
const baseConfig = {
    mode: mode,
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              
              "css-loader"
            ]
          },
          {
            test: /\.png$/,
            use: [
              {
                loader: "url-loader",
                options: {
                  limit: 8192
                }
              }
            ]
          }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./src/index.html")
        }),
        new MiniCssExtractPlugin()
    ]  
}

const envConfig = require(`./config/webpack.${mode}.js`);

module.exports = merge(baseConfig, envConfig);