const HtmlPlugin = require("html-webpack-plugin");
const LinkTypePlugin = require("html-webpack-link-type-plugin")
  .HtmlWebpackLinkTypePlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: ["./src/index.js"],
  output: {
    filename: "bundle.js",
    path: __dirname + "/public",
    publicPath: "/"
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      title: "Star Chart",
      template: "src/index.html",
      inject: "body",
      files: {
        css: ["style.css"]
      }
    })
  ]
};
