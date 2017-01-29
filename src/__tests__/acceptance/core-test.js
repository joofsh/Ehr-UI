import 'babel-polyfill';
require('src/__tests__/mocks/mockGoogleAPI');

import expect from 'expect';
import React from 'react';
import { mount } from 'enzyme';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from 'reducers/store';
import routes from 'src/routes';
import ApiClient from 'src/utils/api';
import { push } from 'react-router-redux';
import { resources } from 'src/__tests__/mocks/mockData';
import testFacade from 'src/__tests__/facade';
import superAgentMockConfig from 'src/__tests__/superagent-mock-config';
import { type, pause, click } from 'src/__tests__/testHelper';

let store, history, facade, wrapper;

let request = require('superagent');
require('superagent-mock')(request, superAgentMockConfig);

function appComponent() {
  return (<Provider store={store}>
    <div>
      <Router history={history}>
        {routes()}
      </Router>
    </div>
  </Provider>);
}

// TODO(jd): Fix authentication
function authenticate() {
  let user = { id: 5, username: 'foo', role: 'advocate' };

  store.dispatch({
    type: 'RECEIVE_AUTHENTICATE_SUCCESS',
    payload: { user }
  });
}

function visit(path = '/') {
  store.dispatch(push(path));
}

function currentURL() {
  return global.location.pathname;
}

function setupApp(authed = false) {
  store = configureStore({}, new ApiClient());
  visit('/');
  history = { ...browserHistory };
  syncHistoryWithStore(history, store);

  wrapper = mount(appComponent());
  if (authed) {
    authenticate();
  }
}

describe('Acceptance - App', () => {
  beforeEach(() => {
    setupApp(true);
  });

  afterEach(() => {
    store = undefined;
    wrapper = undefined;
  });

  it('loads homepage & resources', async (done) => {
    // Homepage
    visit('/');
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.banner-title').text()).toEqual('A Simpler Way to Find Help');

    // Resources
    wrapper.find('a.btn-primary').simulate('click');
    visit('/resources');
    await pause();

    expect(currentURL()).toEqual('/resources');
    expect(wrapper.find('.resource-map-wrapper').length).toEqual(1);
    expect(wrapper.find('.list-group-item').length).toEqual(resources.length);
    done();
  });

  it('renders login', async (done) => {
    visit('/login');
    await pause();

    facade = testFacade.login(wrapper);
    expect(currentURL()).toBe('/login');
    expect(facade.inputs.identifier.length).toExist();
    expect(facade.inputs.password.length).toExist();
    type('joofsh', facade.inputs.identifier);
    type('test', facade.inputs.password);
    expect(facade.submit.length).toExist();
    facade.form.simulate('submit');
    await pause();

    expect(currentURL()).toBe('/');
    expect(store.getState().session.user.id).toExist();
    done();
  });

  it('renders questions', async (done) => {
    visit('/questions');
    await pause();

    expect(currentURL()).toBe('/questions');
    expect(wrapper.find('.questionForm').length).toBe(2);
    done();
  });

  it('renders tags', async (done) => {
    visit('/tags');
    await pause();

    facade = testFacade.tags(wrapper);
    expect(facade.tags.length).toBe(5);
    done();
  });

  it('renders resources and resource', async (done) => {
    visit('/resources');
    await pause();

    facade = testFacade.resources(wrapper);
    expect(currentURL()).toBe('/resources');
    expect(facade.resourceListItems.length).toBe(resources.length);
    expect(facade.firstResource.container.node.href).toMatch(
      new RegExp(`/resources/${resources[0].id}`)
    );
    expect(facade.firstResource.title).toBe(resources[0].title);
    expect(facade.map.length).toExist();
    click(facade.firstResource.container);
    visit(facade.firstResource.container.node.href);
    await pause();

    facade = testFacade.resource(wrapper);
    expect(currentURL()).toBe(`/resources/${resources[0].id}`);
    expect(facade.description).toBe(`${resources[0].description}\n`);
    done();
  });
});
