// Note: We specifically want to return the state via a function
// so that the state is "copied" and never persists between requests
export const initialState = () => {
  return {
    firstQuestion: null,
    user: null,
    isModalActive: false,
    // null means no response, true is success, false is error
    newsletterSignupSuccess: null,
    isSubmittingNewsletterSignup: false,
    error: null
  };
}

export function buildUser(user = {}) {
  return {
    ...user,
    isGuest() {
      return this.role === 'guest';
    },
    isStaff() {
      return ['staff', 'advocate', 'admin'].indexOf(this.role) >= 0;
    }
  };
}

export default function session(state = initialState(), action = {}) {
  switch (action.type) {
    case 'CLEAR_SESSION_USER':
      return {
        ...state,
        user: null
      };
    case 'RECEIVE_FIRST_QUESTION_SUCCESS':
      return {
        ...state,
        firstQuestion: action.payload.questions[0]
      };

    case 'REQUEST_NEWSLETTER_SIGNUP':
      return {
        ...state,
        isSubmittingNewsletterSignup: true,
        newsletterSignupSuccess: null
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
    case 'RECEIVE_NEWSLETTER_SIGNUP_SUCCESS':
      return {
        ...state,
        isSubmittingNewsletterSignup: false,
        newsletterSignupSuccess: true
      };
    case 'RECEIVE_NEWSLETTER_SIGNUP_ERROR':
      return {
        ...state,
        isSubmittingNewsletterSignup: false,
        newsletterSignupSuccess: false
      };
    // This is the 2nd stage of a successful newsletter
    // signup submit
    case 'COMPLETE_NEWSLETTER_SIGNUP_SUCCESS':
      return {
        ...state,
        isModalActive: false,
        isSubmittingNewsletterSignup: false,
        newsletterSignupSuccess: null
      };
    case 'RECEIVE_HEALTHCHECK':
      return {
        ...state,
        healthcheck: action.payload
      };
    case 'HIDE_MODAL':
      return {
        ...state,
        isModalActive: false
      };
    case 'SHOW_MODAL':
      return {
        ...state,
        isModalActive: true
      };
    default:
      return state;
  }
}
