const path = require('path')
module.exports = {
  entry: {
    src_2018_06_24: "./src/2018_06_24",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'].map(require.resolve)
          }
        }
      }
    ]
  }
};
