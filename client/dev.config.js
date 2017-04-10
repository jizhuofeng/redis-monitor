var webpack = require('webpack');
var path =require('path');
var config = {
  entry: [
    './index.js'
  ],
  output: {
    path: path.join(__dirname ,'../server/public/js/build'),
    //使用本系统静态资源地址（ip端口必须和server启动地址一致）
    publicPath: "http://127.0.0.1:12000/js/build/",
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
    host: 'localhost',
    port: 9999,
    proxy: {
      '/mointor/*': {
        target: 'http://127.0.0.1:12000'
      }
    }
  },
};

module.exports = config;
