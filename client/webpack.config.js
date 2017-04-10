var webpack = require('webpack');
var path =require('path');
var config = {
  entry: [
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  output: {
    path: path.join(__dirname ,'../server/public/js/build'),
    filename: 'build.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.less']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        plugins: [['import', {'libraryName': 'antd', 'style': true}]],
        presets: ['es2015', 'react', 'stage-0', 'stage-1']
      }
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    }]
  },
  devServer: {
    host: '127.0.0.1',
    port: 9999,
    proxy: {
      '/monitor/*': {
        target: 'http://127.0.0.1:12000'
      }
    }
  },
};

module.exports = config;
