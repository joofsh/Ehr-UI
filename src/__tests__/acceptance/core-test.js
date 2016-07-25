require('src/__tests__/mocks/mockGoogleAPI');
import expect from 'expect';
import TestUtils, { renderIntoDocument } from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';
import configureStore from 'reducers/store';
import routes from 'src/routes';
import ApiClient from 'src/utils/api';
import { pushPath } from 'redux-simple-router';
import { resources } from 'src/__tests__/mocks/mockData';
import testFacade from 'src/__tests__/facade';
import superAgentMockConfig from 'src/__tests__/superagent-mock-config';

let store, history, renderer, dom, facade;

let request = require('superagent');
require('superagent-mock')(request, superAgentMockConfig);

function appComponent() {
  store = configureStore({}, new ApiClient());
  history = createHistory();

  syncReduxAndRouter(history, store);

  return (<Provider store={store}>
    <div>
      <Router history={history}>
        {routes()}
      </Router>
    </div>
  </Provider>);
}

function authenticate() {
  renderer.store.dispatch({
    type: 'RECEIVE_AUTHENTICATE_SUCCESS',
    payload: {
      user: { id: 5, username: 'foo', role: 'advocate' }
    }
  });
}

function visit(path = '/') {
  renderer.store.dispatch(pushPath(path));
}


describe('Acceptance - App', () => {
  beforeEach(() => {
    renderer = renderIntoDocument(appComponent());
    dom = ReactDOM.findDOMNode(renderer);
  });

  afterEach(() => {
    renderer = undefined;
    dom = undefined;
  });

  it('loads', (done) => {
    visit('/');
    expect(renderer).toExist();
    expect(dom).toExist();
    done();
  });

  it('renders homepage', (done) => {
    visit('/');

    facade = testFacade.homepage(renderer);
    expect(facade.currentURL).toBe('/');
    expect(facade.app).toExist();
    expect(facade.banner).toExist();
    expect(facade.title).toExist();
    expect(facade.callToAction).toExist();
    done();
  });

  it('renders login', (done) => {
    visit('/login');

    facade = testFacade.login(renderer);
    expect(facade.currentURL).toBe('/login');
    expect(facade.inputs.length).toBe(2);
    expect(facade.inputs[0].name).toBe('identifier');
    expect(facade.inputs[1].name).toBe('password');
    expect(facade.submit).toExist();
    done();
  });

  it('renders questions', (done) => {
    authenticate();
    visit('/questions');

    setTimeout(() => {
      console.log(dom);
      facade = testFacade.questions(renderer);
      expect(facade.questions.length).toBe(2);
      done();
    });
  });

  it('renders tags', (done) => {
    authenticate();
    visit('/tags');
    setTimeout(() => {
      facade = testFacade.tags(renderer);
      expect(facade.tags.length).toBe(5);
      done();
    });
  });

  it('renders resources and resource', (done) => {
    visit('/resources');

    setTimeout(() => {
      facade = testFacade.resources(renderer);
      expect(facade.currentURL).toBe('/resources');
      expect(facade.resourceListItems.length).toBe(resources.length);
      expect(facade.firstResource.container.href).toMatch(
        new RegExp(`/resources/${resources[0].id}`)
      );
      expect(facade.firstResource.title).toBe(resources[0].title);
      expect(facade.map).toExist();
      TestUtils.Simulate.click(facade.firstResource.container, { button: 0 });
    });

    setTimeout(() => {
      facade = testFacade.resource(renderer);
      expect(facade.currentURL).toBe(`/resources/${resources[0].id}`);
      expect(facade.description).toBe(resources[0].description);
      done();
    });
  });
});
