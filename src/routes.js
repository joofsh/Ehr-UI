import React from 'react';
import { IndexRoute, Route } from 'react-router';

import {
  App,
  Home,
  Login,
  Shelters,
  Users,
  User,
  NewUser,
  NewClient,
  NotFound
} from './containers';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="clients">
        <Route path="/clients/new" component={NewClient}/>
      </Route>
      <Route path="users" component={Users}>
        <Route path="/users/new" component={NewUser}/>
        <Route path="/users/:id" component={User}/>
      </Route>
      <Route path="/shelters" component={Shelters}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
};
