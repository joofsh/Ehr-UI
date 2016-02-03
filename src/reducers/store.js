import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducer';
import { DevTools } from 'src/containers';
import thunk from 'redux-thunk';
import apiMiddleware from './middleware/api';
import createLogger from 'redux-logger';

function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

export default function configureStore(initialState = {}, client) {
  const middleware = [apiMiddleware(client), thunk];

  if (__CLIENT__ && __DEVELOPMENT__) {
    middleware.push(createLogger());
  }

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      DevTools.instrument()
    )(createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(createStore);
  }


  const store = finalCreateStore(rootReducer, initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer'));
    });
  }

  return store;
}
