import TestUtils from 'react-addons-test-utils';

export function asyncTest(fn) {
  return async (done) => {
    try {
      await fn();
      done();
    } catch (err) {
      done(err);
    }
  };
}

export function pause(ms = 0) {
  return new Promise((resolve) => {
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
  input.simulate('change', {
    // target: { value: value.substr(0, value.length - 1) }
  });
}
