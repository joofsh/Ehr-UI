import apiUtil from 'utils/api';

const initialState = {
  isFetching: false,
  didInvalidate: false,
  isSubmittingUser: false,
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
        users: action.users,
        lastUpdated: Date.now()
      };
    case 'REQUEST_ADD_USER':
      return {
        ...state,
        isSubmittingUser: true
      };
    case 'RECEIVE_ADD_USER':
      return {
        ...state,
        isSubmittingUser: false,
        users: state.users.concat(action.user)
      };

    default:
      if (action.type.indexOf('@@') < 0) {
        console.warn('!! Default action triggered !! ', action.type);
      }
      return state;
  }
}
