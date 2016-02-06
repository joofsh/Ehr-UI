const initialState = {
  client: {},
};

export default function client(state = initialState, action = {}) {
  switch (action.type) {
    case 'REQUEST_ADD_CLIENT':
      return {
        ...state,
        errors: {}
      };
    case 'RECEIVE_CLIENT_SUCCESS':
      return {
        ...state,
        client: action.response
      };
    case 'RECIEVE_CLIENT_ERROR':
      return {
        ...state,
        isSubmittingClient: false,
        error: action.resposne
      };
    default:
      return state;
  }
}
