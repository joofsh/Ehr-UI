import React from 'react';
import { IndexRoute, Route } from 'react-router';

import {
  App,
  Healthcheck,
  Home,
  Login,
  Shelters,
  Users,
  User,
  NewUser,
  NewClient,
  NotFound,
  Resources,
  Resource,
  NewResource,
  ClientQuestions,
  ClientResources,
  Questions
} from './containers';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/healthcheck" component={Healthcheck}/>

      <Route path="/clients/new" component={NewClient}/>
      <Route path="/clients/:id" component={User}/>
      <Route path="/clients/:id/questions" component={ClientQuestions}/>
      <Route path="/clients/:id/resources" component={ClientResources}/>

      <Route path="/users" component={Users} />
      <Route path="/users/new" component={NewUser}/>
      <Route path="/users/:id" component={User}/>
      <Route path="/users" component={Users} />

      <Route path="/resources/new" component={NewResource}/>
      <Route path="/resources" component={Resources}>
        <Route path="/resources/:id" component={Resource}/>
      </Route>

      <Route path="/questions/new" component={NewResource}/>
      <Route path="/questions" component={Questions}>
        <Route path="/questions/:id" component={Resource}/>
      </Route>

      <Route path="/shelters" component={Shelters}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
};
