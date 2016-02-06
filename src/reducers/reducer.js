import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import { reducer as formReducer } from 'redux-form';

import user from './user';
import session from './session';
import client from './client';

export default combineReducers({
  user,
  session,
  client,
  form: formReducer,
  routing: routeReducer
});
