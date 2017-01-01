var path = require('path');
var webpack = require('webpack');

module.exports = function (config) {
  config.set({

    browsers: ['PhantomJS'],

    singleRun: !!process.env.CONTINUOUS_INTEGRATION,

    frameworks: [ 'mocha' ],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    reporters: [ 'mocha' ],

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-phantomjs-launcher"),
      require("karma-sourcemap-loader")
    ],

    webpack: {
      devtool: 'inline-source-map',
      externals: {
        "jsdom": "window",
        "cheerio": "window",

        // These 2 are hacks to get around bugs
        // in older versions of enzyme
        "react/lib/ExecutionEnvironment": true,
        "react/lib/ReactContext": true
      },
      module: {
        loaders: [
          { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: {limit: 10240} },
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
          { test: /\.json$/, loader: 'json-loader' }
        ]
      },
      resolve: {
        root: path.resolve(__dirname),
        modulesDirectories: [
          '.',
          'node_modules'
        ],
        extensions: ['', '.json', '.js']
      },
      plugins: [
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: false,
          __TEST__: true,
          __DEVTOOLS__: false
        })
      ]
    },

    webpackServer: {
      noInfo: true
    }

  });
};
