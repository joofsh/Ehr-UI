import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';
import configureStore from 'reducers/store';
import routes from './routes';
import ApiClient from 'src/utils/api';
import { DevTools } from 'src/containers';
import LogMonitor from 'redux-devtools-log-monitor';
import ReactGA from 'react-ga';

global.__CLIENT__ = true;

// TODO: reimplement boostrap only via bootstrap-loader
//global.jQuery = require('jquery'); // load jquery
//require('bootstrap-loader'); // load bootstrap css & js

const initializeState = Object.assign({}, global.__INITIAL_STATE__);
const store = configureStore(initializeState, new ApiClient());
const history = createHistory();

syncReduxAndRouter(history, store);

const dest = document.getElementById('root');
const devToolDest = document.getElementById('devtools');

const gaTrackingId = global.__INITIAL_PROPS__.googleAnalayticsTrackingId;

ReactGA.initialize(gaTrackingId, { debug: __DEVELOPMENT__ });

let logPageView = () => {
  ReactGA.pageview(global.location.pathname);
};

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history} onUpdate={logPageView}>
        {routes()}
      </Router>

    </div>
  </Provider>,
  dest
);

if (__DEVELOPMENT__) {
  global.React = React;
  global.store = store;

  if (!dest || !dest.firstChild || !dest.firstChild.attributes ||
      !dest.firstChild.attributes['data-react-checksum']) {
    console.error(`Server-side React render was discarded. Make sure that your
                  initial render does not contain any client-side code.`);
  }
}

if (__DEVELOPMENT__) {
  if (__DEVTOOLS__) {
    ReactDOM.render(
      <DevTools store={store} monitor={LogMonitor}/>,
      devToolDest
    );
  } else {
    console.log('-- DEVTOOL Disabled --');
  }
}

console.log('Client code loaded!');
