import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from 'reducers/reducer';
import { DevTools } from 'containers';
import thunk from 'redux-thunk';

const middleware = [thunk];

let finalCreateStore;
if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
  const { persistState } = require('redux-devtools');
  const DevTools = require('../containers/DevTools/DevTools');

  finalCreateStore = compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  finalCreateStore = applyMiddleware(...middleware)(createStore);
}


export default function configureStore(initialState = {}) {
  const store = finalCreateStore(rootReducer, initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer'));
    });
  }

  return store;
}
