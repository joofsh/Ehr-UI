import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import {reducer as formReducer} from 'redux-form';

import user from './user';
import session from './session';

export default combineReducers({
  user,
  session,
  form: formReducer,
  routing: routeReducer
});

