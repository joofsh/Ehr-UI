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
import testFacade from 'src/__tests__/facade'

let store, history, renderer, app, dom, facade;

// TODO: implement superagent mocking (if needed)
//import superAgentMockConfig from 'src/__tests__/superagent-mock-config';
//let request = require('superagent');
//require('superagent-mock')(request, superAgentMockConfig);

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

function visit(path = '/') {
  store.dispatch(pushPath(path));
}


describe('Acceptance - App', () => {
  beforeEach(() => {
    renderer = renderIntoDocument(appComponent());
    dom = ReactDOM.findDOMNode(renderer);
  });

  it('loads', () => {
    visit('/')
    app = TestUtils.findRenderedDOMComponentWithClass(renderer, 'app');
    expect(app).toExist();
  });

  it('renders homepage', () => {
    visit('/')
    app = TestUtils.findRenderedDOMComponentWithClass(renderer, 'app');
    let banner = TestUtils.findRenderedDOMComponentWithClass(renderer, 'banner-image');
    let title = TestUtils.findRenderedDOMComponentWithClass(renderer, 'banner-title');
    let callToAction = TestUtils.findRenderedDOMComponentWithClass(renderer, 'btn-primary');

    expect(app).toExist();
    expect(banner).toExist();
    expect(title).toExist();
    expect(callToAction).toExist();
  });

  it('renders login', () => {
    visit('/login');
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    let submit = TestUtils.findRenderedDOMComponentWithClass(renderer, 'btn');
    expect(inputs.length).toBe(2);
    expect(inputs[0].name).toBe('identifier');
    expect(inputs[1].name).toBe('password');
    expect(submit).toExist();
  });

  it('renders resources', () => {
    store.dispatch({
      type: 'RECEIVE_RESOURCES_SUCCESS',
      response: { resources }
    });

    visit('/resources');
    facade = testFacade.resources(renderer);
    expect(facade.resourceListItems.length).toBe(resources.length);
    expect(facade.firstResource.container.href).toMatch(new RegExp(`/resources/${resources[0].id}`));
    expect(facade.firstResource.title).toBe(resources[0].title);
    expect(facade.map).toExist();
    TestUtils.Simulate.click(facade.firstResource);
    // TODO: Fix click and routing testing
    //setTimeout(() => {
      //console.log('runs last acceptance test:', store.getState().routing.path);
      //expect(store.getState().routing.path).toBe(`/resources/${resources[0].id}`);
      //done();
    //}, 0);
  });
});
