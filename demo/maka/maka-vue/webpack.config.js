const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const argv = require("yargs").argv;
const merge = require("webpack-merge");
const mode = argv.mode;
const baseConfig = {
    mode: mode,
    // entry: './src/index.ts',
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              {
                loader:"css-loader",
                options: { importLoaders: 1 }
              }
              , 'postcss-loader'
            ]
          },
          {
            test: /\.(jpg|png|gif)$/,
            use: [
              // {
              //   loader: 'file-loader',
              // },
              {
                loader: "url-loader",
                options: {
                  outputPath: 'images/',
                  limit: 8192
                }
              }
            ]
          },
          {
            test: /\.(eot|svg|ttf|woff|woff2)\w*/,
            use:[
              {
                loader: 'url-loader',
                options: {
                  outputPath: 'font/',
                  limit: 8192
                }
              }
            ]
            
          },
          // {
          //   test: /\.json$/,
          //   loader: 'json-loader'
          // }
          {
            test: /\.vue$/,
            use: 'vue-loader',
            exclude: /node_modules/
          },
          {
            test: /\.tsx?$/,
            use:[{
              loader:'ts-loader',
              options: { appendTsxSuffixTo: [/\.vue$/] },
            }],
            
            exclude: /node_modules/
          }
        ]
    },
    plugins: [
        new CopyPlugin([
          './src/assets'
        ]),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./src/index.html")
        }),
        
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
    ],
    optimization:{
      splitChunks:{
        cacheGroups: {
            commons: {
                name: "vendor",  // 指定公共模块 bundle 的名称
                chunks: "initial",
                minChunks: 2
            }
          }
      },
      minimizer: [
        new TerserJSPlugin({}),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ,'.json','.vue'],
      alias: {
        '@': path.join(__dirname, "./")
      }
    }  
}

const envConfig = require(`./config/webpack.${mode}.js`);

module.exports = merge(baseConfig, envConfig);