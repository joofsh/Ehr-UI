const initialState = {
  user: null,
  error: null
};

export default function session(state = initialState, action = {}) {
  switch (action.type) {
    case 'CLEAR_SESSION_USER':
      return {
        ...state,
        user: null
      };
    case 'INVALIDATE_CURRENT_USER':
        return {
        ...state,
        user: null
      }
    case 'RECEIVE_AUTHENTICATE_SUCCESS':
      return {
        ...state,
        user: action.response
      };
    default:
      return state;
  }
}
