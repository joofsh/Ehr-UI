import _findIndex from 'lodash/findIndex';

const initialState = {
  isFetching: false,
  didInvalidate: false,
  isEditing: false,
  resources: []
};

export default function reducer(state = initialState, action = {}) {
  let _resources;
  let index;

  switch (action.type) {
    case 'REQUEST_RESOURCES':
      return {
        ...state,
        isFetching: true
      };
    case 'RECEIVE_RESOURCE_SUCCESS':
      _resources = state.resources.slice();
      index = _findIndex(_resources, r => r.id === action.response.id);
      if (index) {
        _resources[index] = action.response;
      } else {
        _resources.concat(action.response);
      }

      return {
        ...state,
        isFetching: false,
        resources: state.resources.concat(action.response)
      };
    case 'RECEIVE_RESOURCES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        resources: action.response.resources,
        lastUpdated: Date.now()
      };
    case 'TOGGLE_EDIT_RESOURCE':
      return {
        ...state,
        isEditing: !state.isEditing
      };
    case 'RECEIVE_UPDATE_RESOURCE_SUCCESS':
      _resources = state.resources.slice();
      index = _findIndex(_resources, r => r.id === action.response.id);
      _resources[index] = action.response;

      return {
        ...state,
        resources: _resources,
        isEditing: false
      };
    default:
      return state;
  }
}
