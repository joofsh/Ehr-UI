export const initialState = {
  user: null,
  isRegisteringGuest: false,
  error: null
};

export default function session(state = initialState, action = {}) {
  switch (action.type) {
    case 'CLEAR_SESSION_USER':
      return {
        ...state,
        user: null
      };
    case 'REQUEST_REGISTER_GUEST':
      return {
        ...state,
        isRegisteringGuest: true
      };
    case 'INVALIDATE_CURRENT_USER':
      return {
        ...state,
        user: null
      };
    case 'RECEIVE_AUTHENTICATE_SUCCESS':
      return {
        ...state,
        isRegisteringGuest: false,
        user: action.payload.user
      };
    case 'RECEIVE_HEALTHCHECK':
      return {
        ...state,
        healthcheck: action.response
      };
    default:
      return state;
  }
}
