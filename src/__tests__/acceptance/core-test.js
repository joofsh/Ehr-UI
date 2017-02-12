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
import { resources, questions } from 'src/__tests__/mocks/mockData';
import testFacade from 'src/__tests__/facade';
import superAgentMockConfig from 'src/__tests__/superagent-mock-config';
import { asyncTest, type, pause, click } from 'src/__tests__/testHelper';

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

  store.dispatch({
    type: 'RECEIVE_FIRST_QUESTION_SUCCESS',
    payload: { questions: [questions[0]] }
  });

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

  it('loads homepage & resources', asyncTest(async () => {
    // Homepage
    visit('/');
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.banner-title').text()).toInclude('Find resources');
    expect(wrapper.find('.question').text()).toInclude(questions[0].stem);
    expect(wrapper.find('.question').text()).toInclude(questions[0].choices[0].stem);

    // Resources
    wrapper.find('a.all').simulate('click');
    visit('/resources');
    await pause();

    expect(currentURL()).toEqual('/resources');
    expect(wrapper.find('.resource-map-wrapper').length).toEqual(1);
    expect(wrapper.find('.list-group-item').length).toEqual(resources.length);
  }));

  it('loads hompage & question wizard', asyncTest(async () => {
    visit('/');
    let button = wrapper.find('.btn-success').first();
    expect(button.node.attributes.disabled).toExist();
    wrapper.find('.QuestionWizardChoice').first().simulate('click');
    await pause();

    button = wrapper.find('.btn-success').first();
    expect(button.node.attributes.disabled).toNotExist();
    wrapper.find('.btn-success').simulate('click');

    await pause();
    console.log(currentURL());
    expect(currentURL()).toEqual('/wizard');
    expect(wrapper.find('.question-stem').exists()).toBe(true);
    wrapper.find('.QuestionWizardChoice').first().simulate('click');

    await pause();
    wrapper.find('.btn-success').simulate('click');
  }));

  it('renders login', asyncTest(async () => {
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
  }));

  it('renders questions', asyncTest(async () => {
    visit('/questions');
    await pause();

    expect(currentURL()).toBe('/questions');
    expect(wrapper.find('.questionForm').length).toBe(2);
  }));

  it('renders tags', asyncTest(async () => {
    visit('/tags');
    await pause();

    facade = testFacade.tags(wrapper);
    expect(facade.tags.length).toBe(5);
  }));

  it('renders resources and resource', asyncTest(async () => {
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
  }));
});
