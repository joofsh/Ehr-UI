import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import favicon from 'serve-favicon';
import session from 'express-session';

import { syncReduxAndRouter } from 'redux-simple-router';
import ReactDOM from 'react-dom/server';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import { createLocation } from 'history';
import { Provider } from 'react-redux';

import apiUtil from './utils/api';
import bodyParser from 'body-parser';
import config from '../config';
import Html from './helpers/Html';
import Server from './helpers/Server';
import configureStore from './reducers/store';
import _routes from './routes';

const app = express();
const port = config.port;

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

const API_URL = 'http://' + config.apiHost + ':' + config.apiPort + '/' + config.apiVersion;
const proxy = httpProxy.createProxyServer({
  target: API_URL,
  ws: false
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  if (req.session.user) {
    console.info('setting Authnorization header:', req.session.user);
    proxyReq.setHeader('Authorization', 'Bearer ' + req.session.user.token);
  }
});

// Session
app.use(session({
  name: 'session',
  secret: 'my secret token',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2592000 }
}));

// Proxy to API
app.use('/api', (req, res) => {
  console.info('--- API Proxy request received: ', req.originalUrl);
  proxy.web(req, res);
});

app.use(bodyParser.json());

app.post('/authorize', function(req, res) {
  apiUtil.post('/api/authorize', req.body).then(resp => {
    req.session.user = resp.user;
    console.info('updated session after authorize: ', req.session);
    let user = Server.filterSessionForClient(req.session).user;
    res.status = resp.status;
    res.send(user);
  }).catch(err => {
    res.status(err.response.status);
    res.send(err.response);
  });
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
  let sessionForClient = Server.filterSessionForClient(req.session);

  const initialState = {
    session: {
      user: sessionForClient.user || null
    }
  };
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

  const location = createLocation(req.originalUrl);
  const routes = _routes();
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    console.info("--- Handling request: ", req.url);

    function getReduxPromise() {
      let comp = renderProps.components[renderProps.components.length - 1];
      console.log('getting redux promise for component {',
                  comp.displayName, '}. FetchData: ', !!comp.fetchData);
      return (comp.fetchData ? comp.fetchData({ store }): Promise.resolve());
    };

    if (error) {
      res.status(500);
      hydrateOnClient();
    } else {

      getReduxPromise().then(() => {
        const component = (
          <Provider store={store}>
            <div>
              <RoutingContext {...renderProps} />
            </div>
          </Provider>
        );

        res.send('<!doctype html>\n' +
                 ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()}
                                         component={component}
                                         store={store}/>));
      }).catch((error) => {
        console.error('Rendering error:', error);
        console.error(error.stack);
      });
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
