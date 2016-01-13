import React from 'react';
import { Router, Route } from 'react-router';

import {
  App,
  Users,
  User,
  NewUser
} from './containers';

export default () => {
  return (
    <Route path="/" component={App}>
      <Route path="users" component={Users} willRenderChildrenAbove={true} >
        <Route path="/users/new" component={NewUser} />
        <Route path="/users/:id" component={User} />
      </Route>
    </Route>
  );
}
