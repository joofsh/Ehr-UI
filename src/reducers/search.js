import _filter from 'lodash/filter';
import _some from 'lodash/some';
import _isArray from 'lodash/isArray';

export const initialState = {
  resourceFilter: ''
};

export default function reducer(state = initialState, action = {}) {
  let _state;

  switch (action.type) {
    case 'UPDATE_SEARCH_VALUE':
      _state = Object.assign(state, {});
      _state[action.payload.name] = action.payload.value;
      return {
        ..._state
      };
    default:
      return state;
  }
}


function compareValues(value, input) {
  return String(value).toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export function collectionFilter(collection, input = '', fields = []) {
  let inputs = input.split(/\s|-|\+/g);

  return _filter(collection, object => (
    _some(fields, field => {
      let fieldParts = field.split('.');

      // if the key is an array, we want to loop through the subobjects looking for
      // matching keys
      let result;
      if (_isArray(object[fieldParts[0]])) {
        result = _some(inputs, _input => {
          return _some(object[fieldParts[0]], subObject => {
            return compareValues(subObject[fieldParts[1]], _input);
          });
        });
      } else {
        result = _some(inputs, _input => {
          return compareValues(object[field], _input);
        });
      }
      return result;
    })
  ));
}
