import TestUtils from 'react-addons-test-utils';

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

export default {
  resources: (component) => {
    let resourceListItems = getClasses(component, 'list-group-item');
    let firstResource = resourceListItems[0];
    return {
      map: getClass(component, 'resource-map'),
      resourceListItems,
      firstResource: {
        container: firstResource,
        title: firstResource.querySelector('h5').innerHTML
      }
    };
  }
};
