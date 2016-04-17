import { routeReducer } from 'redux-simple-router';
import { reducer as formReducer } from 'redux-form';

import user from './user';
import session from './session';
import client from './client';
import resource from './resource';
import question from './question';
import tag from './tag';
import search from './search';

export default {
  user,
  session,
  client,
  resource,
  question,
  tag,
  search,
  // Extend redux-form plugin to automatically reset form
  // when cancelling edit mode
  form: formReducer.plugin({
    userForm: (state, action) => {
      switch(action.type) {
        case 'TOGGLE_EDIT_USER':
          return undefined;
        default:
          return state;
      }
    },
    resourceForm: (state, action) => {
      switch(action.type) {
        case 'TOGGLE_EDIT_RESOURCE':
          return undefined;
        default:
          return state;
      }
    }
  }),
  routing: routeReducer
};
