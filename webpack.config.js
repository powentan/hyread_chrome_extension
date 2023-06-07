const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    "content-script": "./src/content_script.ts",
    "background": "./src/background.ts",
    "option": "./src/options.ts"
  },
  output: {
    path: path.resolve(__dirname, './build/dist'),
    filename: "[name]-bundle.js"
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src/'),
    ],
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};
