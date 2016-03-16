#!/usr/bin/env node

require('dotenv').config();
require('../server/server.babel');
var path = require('path');
var rootDir = path.resolve(__dirname, '..');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING
global.__DISABLE_CSR__ = false;  // <----- DISABLES CLIENT SIDE RENDERING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

if (__DEVELOPMENT__) {
  if (!require('piping')({
    hook: true,
    ignore: /(\/\.|~$|\.json|\.scss$)/i
  })) {
    return;
  }
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
 var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(
  require('../config/webpack-isomorphic-tools'))
  .development(__DEVELOPMENT__)
  .server(rootDir, function() {
    require('../src/server');
  });
