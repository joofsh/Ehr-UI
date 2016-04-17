var path = require('path');
var webpack = require('webpack');
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');

var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(
  require('./config/webpack-isomorphic-tools.js')
);

var host = (process.env.HOST || 'localhost');
var port = parseInt(process.env.PORT) + 1 || 3002;

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
    'font-awesome-webpack!./src/theme/font-awesome.config.js',
    './src/client'
  ],
  progress: true,
  output: {
    path: '/',
    filename: 'bundle.js',
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(), // Must be commented out for eslint-loader
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __TEST__: false,
      __DEVTOOLS__: false
    }),
    webpackIsomorphicToolsPlugin.development()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
        include: path.join(__dirname, 'src')
      },

      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.(png|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  resolve: {
    root: path.resolve(__dirname),
    alias: {
      ehr: 'src',
      utils: 'src/utils',
      components: 'src/components',
      reducers: 'src/reducers',
      styles: 'src/styles',
      containers: 'src/containers'
    }
  },
  stats: {
    colors: true
  },
  eslint: {
    formatter: require('eslint-stylish-config/stylish'),
    fix: false
  }
};
