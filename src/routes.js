import React from 'react';
import { Router, Route } from 'react-router';

import {
  App,
  Login,
  Users,
  User,
  NewUser
} from './containers';

export default () => {
  return (
    <Route path="/" component={App}>
      <Route path="/login" component={Login}/>
      <Route path="users" component={Users}>
        <Route path="/users/new" component={NewUser}/>
        <Route path="/users/:id" component={User}/>
      </Route>
    </Route>
  );
}
