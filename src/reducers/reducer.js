import { routeReducer } from 'redux-simple-router';
import { reducer as formReducer } from 'redux-form';

import user from './user';
import session from './session';
import client from './client';
import resource from './resource';
import question from './question';
import tag from './tag';

export default {
  user,
  session,
  client,
  resource,
  question,
  tag,
  form: formReducer,
  routing: routeReducer
};
