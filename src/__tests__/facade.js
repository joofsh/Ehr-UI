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

function base(wrapper) {
  return {
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

  login: (wrapper) => {
    return Object.assign({}, base(wrapper), {
      inputs: {
        identifier: wrapper.find('#identifier'),
        password: wrapper.find('#password')
      },
      form: wrapper.find('form'),
      submit: wrapper.find('.btn-success')
    });
  },

  resources: (wrapper) => {
    let resourceListItems = wrapper.find('.list-group-item');
    let firstResource = resourceListItems.first();
    return Object.assign({}, base(wrapper), {
      map: wrapper.find('.resource-map'),
      resourceListItems,
      firstResource: {
        container: firstResource,
        title: firstResource.find('h4').text()
      }
    });
  },

  questions: (component) => {
    return Object.assign({}, base(component), {
      questions: getClasses(component, 'questionForm')
    });
  },

  tags: (wrapper) => {
    return Object.assign({}, base(wrapper), {
      tags: wrapper.find('.tagForm')
    });
  },

  resource: (wrapper) => {
    let staticValues = wrapper.find('.form-control-static');
    let description = _find(staticValues.nodes, (e) => e.getAttribute('name') === 'description');

    return Object.assign({}, base(wrapper), {
      title: wrapper.find('h2'),
      description: description.querySelector('span').innerText,
      publishStatus: wrapper.find('small')
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
