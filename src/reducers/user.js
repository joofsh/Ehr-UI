const initialState = {
  isFetching: false,
  didInvalidate: false,
  isEditing: false,
  users: []
};

export default function user(state = initialState, action = {}) {
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
    case 'RECEIVE_ADD_USER':
      return {
        ...state,
        isSubmittingUser: false,
        users: state.users.concat(action.user)
      };

    default:
      return state;
  }
}
