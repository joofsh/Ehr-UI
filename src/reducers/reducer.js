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
  // Extend redux-form plugin to automatically reset form
  // when cancelling edit mode
  form: formReducer.plugin({
    userForm: (state, action) => {
      switch (action.type) {
        case 'TOGGLE_EDIT_USER':
          return undefined;
        default:
          return state;
      }
    },
    resourceForm: (state, action) => {
      switch (action.type) {
        case 'TOGGLE_EDIT_RESOURCE':
          return undefined;
        default:
          return state;
      }
    }
  }),
  routing: routeReducer
};
