import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';
import configureStore from 'reducers/store';
import routes from './routes';
import ApiClient from 'src/utils/api';
import { DevTools } from 'src/containers';
import LogMonitor from 'redux-devtools-log-monitor';

global.__CLIENT__ = true;

require('bootstrap-loader'); // load bootstrap css & js
require('font-awesome-webpack!./theme/font-awesome.config.js'); // load font-awesome

const initializeState = Object.assign({}, window.__INITIAL_STATE__);
const store = configureStore(initializeState, new ApiClient());
const history = createHistory();

syncReduxAndRouter(history, store);

const dest = document.getElementById('root');
const devToolDest = document.getElementById('devtools');

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        {routes()}
      </Router>
    </div>
  </Provider>,
  dest
);

if (__DEVELOPMENT__) {
  global.React = React;
  global.store = store;

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVELOPMENT__ && __DEVTOOLS__) {
  ReactDOM.render(
    <DevTools store={store} monitor={LogMonitor}/>,
    devToolDest
  );
}

console.log('Client code loaded!');
