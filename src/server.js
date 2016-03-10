/* eslint-disable no-param-reassign */

import express from 'express';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import favicon from 'serve-favicon';
import session from 'express-session';

import ReactDOM from 'react-dom/server';
import React from 'react';
import { match, RoutingContext } from 'react-router';
import { createLocation } from 'history';
import { Provider } from 'react-redux';

import ApiClient from './utils/api';
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

// To server the static css & js in production
app.use(express.static(path.join(__dirname, '..', 'static')));

const API_URL = `http://${config.apiHost}:${config.apiPort}/${config.apiVersion}`;
console.log('API_URL: ', API_URL);

const proxy = httpProxy.createProxyServer({
  target: API_URL,
  ws: false
});

proxy.on('proxyReq', (proxyReq, req) => {
  if (req.session.user) {
    proxyReq.setHeader('Authorization', `Bearer ${req.session.user.token}`);
  }
});

// Session
app.use(session({
  name: 'session',
  //TODO: reimplement redis in production
  //store: new RedisStore(),
  secret: 'my secret token',
  resave: false,
  proxy: true,
  saveUninitialized: true,
  cookie: { maxAge: 2592000000 } // 30 days
}));

// Proxy to API
app.use('/api', (req, res) => {
  console.info('--- API Proxy request received: ', req.originalUrl);
  proxy.web(req, res);
});

app.use(bodyParser.json());

app.post('/authorize', (req, res) => {
  const client = new ApiClient(req);
  client.post('/api/authorize', { data: req.body }).then(resp => {
    req.session.user = resp.user;
    let user = Server.filterSessionForClient(req.session).user;
    res.status = resp.status;
    res.send(user);
  }, err => {
    res.status(err.status);
    res.send(err.body);
  });
});

app.put('/logout', (req, res) => {
  req.session.user = null;
  res.status(200);
  res.send({});
});

app.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/');
});


proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  json = { error: 'proxy_error', reason: error.message };
  res.end(JSON.stringify(json));
});

function handleRender(req, res) {
  let sessionForClient = Server.filterSessionForClient(req.session);

  const initialState = {
    session: {
      user: sessionForClient.user || null
    }
  };
  const client = new ApiClient(req);
  const store = configureStore(initialState, client);

  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh();
  }

  function hydrateOnClient() {
    res.send(`<!doctype html>
      ${ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>)}`);
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  const location = createLocation(req.originalUrl);
  const routes = _routes();
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    console.info('--- Handling request: ', req.url);

    function getReduxPromise() {
      let comp = renderProps.components[renderProps.components.length - 1];
      console.log('getting redux promise for component {',
                  comp.displayName, '}. FetchData: ', !!comp.fetchData);
      return (comp.fetchData ?
        comp.fetchData({ store, params: renderProps.params }) : Promise.resolve());
    }

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

        res.send(`<!doctype html>
                 ${ReactDOM.renderToString(
                  <Html assets={webpackIsomorphicTools.assets()}
                    component={component}
                    store={store}
                  />)}`);
      }, resp => {
        // TODO: conslidate this with redux state?
        // Not sure if this should be necessary or if the `pushState('/login')`
        // call should be able to handle this on SSR
        if (resp.status === 403) {
          req.session.user = null;
          res.redirect('/login');
        }
      }).catch((_error) => {
        console.error('Rendering error:', _error);
        console.error(_error.stack);
      });
    }
  });
}

app.use(handleRender);

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`===> 💻  Backend server listening on port ${port}`);
  }
});
