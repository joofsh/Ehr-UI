import _findIndex from 'lodash/findIndex';

export const initialState = {
  isFetching: false,
  didInvalidate: false,
  isEditing: false,
  resources: []
};

function buildResource(resource) {
  return {
    ...resource,
    isMapInfoVisible: false
  };
}

export default function reducer(state = initialState, action = {}) {
  let _resources, _resource, index;

  switch (action.type) {
    case 'REQUEST_RESOURCES':
      return {
        ...state,
        isFetching: true
      };
    case 'ADD_CLIENT_RESOURCES': // Add resources pulled in from client page
      _resources = state.resources.slice();
      action.response.resources.forEach(resource => {
        _resource = buildResource(resource);
        index = _findIndex(_resources, r => r.id === _resource.id);
        if (index >= 0) {
          _resources[index] = _resource;
        } else {
          _resources.push(_resource);
        }
      });

      return {
        ...state,
        isFetching: false,
        resources: _resources
      };
    case 'RECEIVE_RESOURCE_SUCCESS':
      _resources = state.resources.slice();
      _resource = buildResource(action.response);
      index = _findIndex(_resources, r => r.id === _resource.id);

      if (index >= 0) {
        _resources[index] = _resource;
      } else {
        _resources.push(_resource);
      }

      return {
        ...state,
        isFetching: false,
        resources: _resources
      };
    case 'RECEIVE_RESOURCES_SUCCESS':
      _resources = action.response.resources.map((r) => buildResource(r));
      return {
        ...state,
        isFetching: false,
        resources: _resources,
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

      if (index >= 0) {
        _resources[index] = action.response;
      }

      return {
        ...state,
        resources: _resources,
        isEditing: false
      };
    case 'SWITCH_MARKER_VISIBILITY':
      _resources = state.resources.slice();
      index =_findIndex(_resources, r => r.id === action.payload.id);
      if (index >= 0) {
        _resources[index].isMapInfoVisible = action.payload.visibility;
      }
      return {
        ...state,
        resources: _resources
      };
    default:
      return state;
  }
}
