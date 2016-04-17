import TestUtils from 'react-addons-test-utils';
import _find from 'lodash/find';

function getClasses(component, klass) {
  return TestUtils.scryRenderedDOMComponentsWithClass(component, klass);
}

function getClass(component, klass) {
  return TestUtils.findRenderedDOMComponentWithClass(component, klass);
}

function getTags(component, tag) {
  return TestUtils.scryRenderedDOMComponentsWithTag(component, tag);
}

function getTag(component, tag) {
  return TestUtils.findRenderedDOMComponentWithTag(component, tag);
}

function base(component) {
  return {
    currentURL: component.props.store.getState().routing.path
  };
}

export default {
  homepage: (component) => {
    return Object.assign({}, base(component), {
      app: getClass(component, 'app'),
      banner: getClass(component, 'banner-image'),
      title: getClass(component, 'banner-title'),
      callToAction: getClass(component, 'btn-primary')
    });
  },

  login: (component) => {
    return Object.assign({}, base(component), {
      inputs: getTags(component, 'input'),
      submit: getClass(component, 'btn')
    });
  },

  resources: (component) => {
    let resourceListItems = getClasses(component, 'list-group-item');
    let firstResource = resourceListItems[0];
    return Object.assign({}, base(component), {
      map: getClass(component, 'resource-map'),
      resourceListItems,
      firstResource: {
        container: firstResource,
        title: firstResource.querySelector('h4').innerHTML
      }
    });
  },

  resource: (component) => {
    let staticValues = getClasses(component, 'form-control-static');
    let description = _find(staticValues, (e) => e.getAttribute('name') == 'description');

    return Object.assign({}, base(component), {
      title: getTag(component, 'h2'),
      description: description.querySelector('span').innerHTML,
      publishStatus: getTags(component, 'small')
    });
  },

  newResource: (component) => {
    return Object.assign({}, base(component), {
      form: getClass(component, 'resourceForm'),
      inputs: getTags(component, 'input'),
      submitButton: getClass('form-group')
    });
  }
};
