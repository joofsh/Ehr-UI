import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
import compression from 'compression';
import httpProxy from 'http-proxy';

import { syncReduxAndRouter } from 'redux-simple-router';
import ReactDOM from 'react-dom/server';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext, RoutingContext } from 'react-router';
import { createLocation } from 'history';
import { Provider } from 'react-redux';

import config from '../config';
import Html from './helpers/Html';
import configureStore from './reducers/store';
import _routes from './routes';

const app = express();
const port = config.port;

const proxy = httpProxy.createProxyServer({
  target: 'http://' + config.apiHost + ':' + config.apiPort + '/' + config.apiVersion,
  ws: false
});

// Proxy to API
app.use('/api', (req, res) => {
  console.info('--- API Proxy request received: ', req.originalUrl);
  proxy.web(req, res);
});

proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

app.use(handleRender);

function handleRender(req, res) {
  const initialState = {};
  const store = configureStore(initialState);

  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh();
  }

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  const location = createLocation(req.originalurl);
  const routes = _routes();
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    console.info("--- Handling request: ", req.url);

    if (error) {
      res.status(500);
      hydrateOnClient();
    } else {
      const component = (
        <Provider store={store}>
          <div>
            <RoutingContext {...renderProps} />
          </div>
        </Provider>
      );

      res.send('<!doctype html>\n' +
        ReactDOM.renderToString(
          <Html assets={webpackIsomorphicTools.assets()}
                component={component}
                store={store}/>));
    }
  });
}

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`===> 💻  Backend server listening on port ${port}`);
  }
});
