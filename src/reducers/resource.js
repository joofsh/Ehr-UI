import _findIndex from 'lodash/findIndex';

export const initialState = {
  isFetching: false,
  didInvalidate: false,
  isEditing: false,
  isTogglingPublishState: false,
  lastUpdated: null,
  resources: []
};

export function buildResource(resource) {
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
    case 'RECEIVE_RESOURCE_SUCCESS':
      _resources = state.resources.slice();
      _resource = buildResource(action.payload);
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
      _resources = state.resources.slice();

      action.payload.resources.forEach(resource => {
        index = _findIndex(_resources, r => r.id === resource.id);

        _resource = buildResource(resource);

        if (index >= 0) {
          _resources[index] = _resource;
        } else {
          _resources.push(_resource);
        }
      });

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
      index = _findIndex(_resources, r => r.id === action.payload.id);

      if (index >= 0) {
        _resources[index] = buildResource(action.payload);
      }

      return {
        ...state,
        resources: _resources,
        isEditing: false,
        isTogglingPublishState: false
      };
    case 'SWITCH_MARKER_VISIBILITY':
      _resources = state.resources.slice();
      index = _findIndex(_resources, r => r.id === action.payload.id);
      if (index >= 0) {
        _resources[index].isMapInfoVisible = action.payload.visibility;
      }
      return {
        ...state,
        resources: _resources
      };
    case 'IS_TOGGLING_PUBLISHED_STATE':
      return {
        ...state,
        isTogglingPublishState: true
      };
    default:
      return state;
  }
}
