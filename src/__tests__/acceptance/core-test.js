global.__TEST__  = true;
global.__DEVELOPMENT = false;

import expect from 'expect';
import TestUtils, { renderIntoDocument } from 'react-addons-test-utils';
import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';
import configureStore from 'reducers/store';
import routes from 'src/routes';
import ApiClient from 'src/utils/api';
import { pushPath } from 'redux-simple-router';

let store, history, renderer, result;

function app() {
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
    renderer = renderIntoDocument(app());
    visit('/');
  });

  it('loads', () => {
    let app = TestUtils.findRenderedDOMComponentWithClass(renderer, 'app');
    expect(app).toExist();
  });

  it('renders homepage', () => {
    let app = TestUtils.findRenderedDOMComponentWithClass(renderer, 'app');
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
});
