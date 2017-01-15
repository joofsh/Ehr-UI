import TestUtils from 'react-addons-test-utils';

export function pause(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, ms);
  });
}

export function click(element) {
  TestUtils.Simulate.click(element, { button: 0 });
}

export function type(value, input) {
  input.simulate('change', { target: { value } });
}

export function backspace(input) {
  let value = wrapper.state().testDate;

  input.simulate('change', {
    target: { value: value.substr(0, value.length - 1) }
  });
}
