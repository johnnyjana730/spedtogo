const HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({fullPath: false, removeFullPathAutoPrefix: true});
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "[name]-bundle-[hash].js",
  },

  target: 'web',
  devServer: {
    port: '5001',
    static: {
      directory: path.join(__dirname, 'public')
},
    open: true,
    hot: true,
    liveReload: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    fallback: {
        "fs": false
    },
    alias: {
        'react-native$': 'react-native-web'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(react-native)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
           "presets": ["@babel/preset-env", ["@babel/preset-react", {
              "runtime": "automatic"
           }]],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
     {
          test: /\.(png|jpg|gif|svg)$/,
          use: [{
              loader: 'file-loader',
              options: {}
          }]
      },
    ],
  },

  plugins: [
    assetsPluginInstance, 
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html')
    })
  ],
  optimization: {
     minimizer: [
        new UglifyJsPlugin({
          test: /\.js(\?.*)?$/i,
        }),
      ],
  },
};