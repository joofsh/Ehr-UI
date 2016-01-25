import React from 'react';
import { IndexRoute, Route } from 'react-router';

import {
  App,
  Home,
  Login,
  Shelters,
  Users,
  User,
  NewUser
} from './containers';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="users" component={Users}>
        <Route path="/users/new" component={NewUser}/>
        <Route path="/users/:id" component={User}/>
      </Route>
      <Route path="/shelters" component={Shelters}/>
    </Route>
  );
}
