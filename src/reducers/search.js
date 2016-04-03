import _filter from 'lodash/filter';
import _some from 'lodash/some';

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


export function collectionFilter(collection, value = '', fields = []) {
  let values = value.split(/\s|-|\+/g);

  return _filter(collection, object => (
    _some(fields, field => (
      _some(values, _value => (
        String(object[field]).toLowerCase().indexOf(_value.toLowerCase()) >= 0
      ))
    ))
  ));
}
