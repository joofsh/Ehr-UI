import { routeReducer } from 'redux-simple-router';
import { reducer as formReducer } from 'redux-form';

import user from './user';
import session from './session';
import client from './client';
import resource from './resource';
import question from './question';

export default {
  user,
  session,
  client,
  resource,
  question,
  form: formReducer,
  routing: routeReducer
};
