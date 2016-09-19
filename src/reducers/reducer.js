import { routeReducer } from 'redux-simple-router';
import { reducer as formReducer } from 'redux-form';

import question from './question';
import resource from './resource';
import search from './search';
import session from './session';
import tag from './tag';
import user from './user';
import wizard from './wizard';

export default {
  question,
  resource,
  search,
  session,
  tag,
  user,
  wizard,
  form: formReducer,
  routing: routeReducer
};
