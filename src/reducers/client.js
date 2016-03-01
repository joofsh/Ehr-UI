const initialState = {
  client: null,
  questions: [],
  responses: [],
  resources: [],
  currentQuestionId: null,
  selectedChoiceId: null,
  submitting: false,
  hasAnsweredAllQuestions: false,
  _error: null
};

export default function reducer(state = initialState, action = {}) {
  let nextQuestionId;

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

    case 'RECEIVE_CLIENT_QUESTIONS_SUCCESS':
      return {
        ...state,
        questions: action.response.questions,
        client: action.response.client,
        currentQuestionId: action.response.questions[0].id
      };
    case 'SELECT_CHOICE':
      return {
        ...state,
        error: null,
        selectedChoiceId: action.choiceId
      };
    case 'REQUEST_ANSWER_SUBMIT':
      return {
        ...state,
        error: null,
        submitting: true,
      };
    case 'RECEIVE_ANSWER_SUBMIT_ERROR':
      return {
        ...state,
        submitting: false,
        error: 'We were unable to update this user. Please try again later.'
      };
    case 'RECEIVE_ANSWER_SUBMIT_SUCCESS':
      nextQuestionId = action.response.next_question && action.response.next_question.id;

      return {
        ...state,
        submitting: false,
        selectedChoiceId: null,
        responses: state.responses.concat(action.response.response),
        hasAnsweredAllQuestions: !!nextQuestionId,
        currentQuestionId: nextQuestionId
      };

    case 'RECEIVE_CLIENT_RESOURCES_SUCCESS':
      return {
        ...state,
        client: action.response.client,
        resources: action.response.resources
      };
    default:
      return state;
  }
}
