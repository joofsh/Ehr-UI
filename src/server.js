/* eslint-disable no-param-reassign */
const newrelic = require('newrelic');

import express from 'express';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import favicon from 'serve-favicon';
import session from 'cookie-session';
import superagent from 'superagent';

import ReactDOM from 'react-dom/server';
import React from 'react';
import { match, RouterContext } from 'react-router';
import { createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
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

// Force SSL
app.use((req, res, next) => {
  if (!req.secure && !__DEVELOPMENT__) {
    let host = req.get('Host');
    if (!/^www/.test(host)) {
      host = `www.${host}`;
    }

    return res.redirect(301, ['https://', host, req.url].join(''));
  }
  next();
});

const API_URL = `http://${config.apiHost}:${config.apiPort}`;
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
  name: 'DCRSession',
  secret: config.sessionSecretKey,
  resave: false,
  proxy: true,
  saveUninitialized: true,
  httpOnly: true,
  maxAge: 2592000000 // 30 days
}));

// Proxy to API
app.use('/api', (req, res) => {
  console.info('--- API Proxy request received: ', req.originalUrl);
  proxy.web(req, res);
});

app.use(bodyParser.json());

app.post('/authorize', (req, res) => {
  const client = new ApiClient(req);
  client.post('/api/users/authorize', { data: req.body }).then(resp => {
    req.session.user = resp;
    let user = Server.filterSessionForClient(req.session).user;
    res.status = resp.status;
    res.send(user);
  }, err => {
    res.status(err.status);
    res.send(err.body);
  });
});

app.post('/users/guests', (req, res) => {
  const client = new ApiClient(req);
  client.post('/api/users/guests').then(resp => {
    req.session.user = resp;
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

app.post('/newsletter', (req, res) => {
  let url = `https://us14.api.mailchimp.com/3.0/lists/${config.newsletterListId}/members/`;
  superagent.
    post(url).
    send({
      email_address: req.body.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: req.body.firstName,
        LNAME: req.body.lastName
      }
    }).
    set('Authorization', `BASIC ${config.mailchimpApiKey}`).
    end((err, _res) => {
      // Mailchimp returns a 400 if the email already exists
      // on the mailing list. We want to absorb these errors
      if (_res.status === 400 || _res.status === 200) {
        res.status(200);
        res.send({});
      } else {
        console.error('Error Mailchimp:', err.message);
        res.status(_res.status);
        res.send({ error: err.message });
      }
    });
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

  const client = new ApiClient(req);
  const memoryHistory = createMemoryHistory(req.originalUrl);
  const store = configureStore({ session: sessionForClient }, client);
  const routes = _routes();
  const history = syncHistoryWithStore(memoryHistory, store);

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

  match({ history, routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    console.info('--- Handling request: ', req.url);
    newrelic.setTransactionName(req.url.substring(1));

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
              <RouterContext {...renderProps} />
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
          console.info('Server 403 response. Redirecting to login');
          res.redirect('/login');
        } else if (resp.status === 404) {
          console.info('Server 404 response. Redirecting to not_found');
          res.redirect('/not_found');
        } else {
          hydrateOnClient();
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
