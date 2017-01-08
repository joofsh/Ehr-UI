import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import rootReducer from './reducer';
import { DevTools } from 'src/containers';
import thunk from 'redux-thunk';
import { persistState } from 'redux-devtools';
import apiMiddleware from './middleware/api';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import createLogger from 'redux-logger';

function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0) ? matches[1] : null;
}

export default function configureStore(initialState = {}, client) {
  const middleware = [routerMiddleware(browserHistory), apiMiddleware(client), thunk];


  if (__CLIENT__ && (__DEVELOPMENT__ || global.localStorage.getItem('logReduxActions'))) {
    middleware.push(createLogger());
  }

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      DevTools.instrument(),
      persistState(getDebugSessionKey())
    )(createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(createStore);
  }


  const store = finalCreateStore(combineReducers(rootReducer), initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('./reducer', () => {
      let nextReducer = combineReducers(require('./reducer').default);
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
