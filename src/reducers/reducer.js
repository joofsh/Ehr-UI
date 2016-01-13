import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import {reducer as formReducer} from 'redux-form';

import user from './user';

export default combineReducers({
  user,
  form: formReducer,
  routing: routeReducer
});

