import { buildResource } from './resource';
import _forOwn from 'lodash/forOwn';

export const initialState = {
  responses: [],
  resources: {},
  currentQuestionId: null,
  selectedChoiceId: null,
  submitting: false,
  hasAnsweredAllQuestions: false,
  resourcesLastUpdated: null,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  let nextQuestionId, resources;

  switch (action.type) {
    case 'SET_CURRENT_WIZARD_QUESTION':
      return {
        ...state,
        errors: null,
        currentQuestionId: action.payload.question && action.payload.question.id
      };
    case 'RESET_WIZARD':
      return {
        ...state,
        responses: [],
        currentQuestionId: null,
        selectedChoiceId: null,
        submitting: false,
        hasAnsweredAllQuestions: false
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
        responses: state.responses.concat(action.payload.response),
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
        hasAnsweredAllQuestions: !nextQuestionId,
        currentQuestionId: nextQuestionId
      };

    case 'RECEIVE_PERSONALIZED_RESOURCES_SUCCESS':
      resources = {};

      _forOwn(action.payload.resources, (_resources, tag) => {
        resources[tag] = _resources.map(resource =>
          buildResource(resource)
        );
      });

      return {
        ...state,
        resources,
        resourcesLastUpdated: Date.now()
      };
    default:
      return state;
  }
}
