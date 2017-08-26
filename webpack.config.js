const webpack = require('webpack');
const path = require('path');

const config = {
  devtool: 'eval-source-map',
  entry: path.join(__dirname, '/app/index.js'),
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.[chunkhash].js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      include: path.resolve(__dirname, 'app'),
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  devServer: {
    contentBase: './public',
    colors: true,
    historyApiFallback: true,
    inline: true
  },
};

if (process.env.NODE_ENV === 'production') {
  config.devtool = false;
  config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ];
}

module.exports = config;
