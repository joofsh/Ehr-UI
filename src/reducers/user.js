import _findIndex from 'lodash/findIndex';

export const initialState = {
  isFetching: false,
  didInvalidate: false,
  isEditing: false,
  lastUpdated: null,
  users: []
};

export default function reducer(state = initialState, action = {}) {
  let _users, index;

  switch (action.type) {
    case 'REQUEST_USERS':
      return {
        ...state,
        isFetching: true
      };
    case 'RECEIVE_USERS':
      return {
        ...state,
        isFetching: false,
        users: action.response.users,
        lastUpdated: Date.now()
      };
    case 'RECEIVE_USER_SUCCESS':
      return {
        ...state,
        users: state.users.concat(action.response)
      };
    case 'TOGGLE_EDIT_USER':
      return {
        ...state,
        isEditing: !state.isEditing
      };
    case 'RECEIVE_UPDATE_USER':
      _users = state.users.slice();
      index = _findIndex(_users, u => u.id === action.response.id);
      _users[index] = action.response;

      return {
        ...state,
        users: _users,
        isEditing: false
      };
    case 'RECEIVE_ADD_USER':
      return {
        ...state,
        users: state.users.concat(action.user)
      };

    default:
      return state;
  }
}
