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
    case 'REQUEST_AUTHENTICATE':
      return {
        ...state,
        error: null
      };
    case 'RECEIVE_AUTHENTICATE_ERROR':
      return {
        ...state,
        error: `Login Failed: ${action.error.statusText}`
      };
    case 'RECEIVE_AUTHENTICATE_SUCCESS':
      return {
        ...state,
        user: action.response
      };
    default:
      return state;
  }
}
