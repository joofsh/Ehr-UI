import { buildResource } from './resource';
import _forOwn from 'lodash/forOwn';

export const initialState = {
  isShowingProgressText: false,
  responses: [],
  resources: {},
  progressBarValue: 0, // percentage 0 to 100
  currentQuestionId: null,
  selectedChoiceId: null,
  submitting: false,
  hasAnsweredAllQuestions: false,
  resourcesLastUpdated: null,
  error: null
};

const PROGRESS_BAR_RESET_COUNT = 6;

export default function reducer(state = initialState, action = {}) {
  let nextQuestionId, modulo, progressBarValue, response, responses, resources,
    isFinishedFirstQuestionBlock;

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
        isShowingProgressText: false,
        currentQuestionId: null,
        hasAnsweredAllQuestions: false,
        progressBarValue: 0,
        responses: [],
        resources: [],
        selectedChoiceId: null,
        submitting: false,
      };
    case 'RESET_PROGRESS_BAR':
      return {
        ...state,
        progressBarValue: 0
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
      response = action.payload.response;
      responses = state.responses.concat(response);

      modulo = (responses.length) % PROGRESS_BAR_RESET_COUNT;

      isFinishedFirstQuestionBlock = modulo === 0 && state.responses.length;

      // Set bar to 100 initially, reset it on next question load
      if (isFinishedFirstQuestionBlock) {
        progressBarValue = 100;
      } else {
        progressBarValue = modulo / PROGRESS_BAR_RESET_COUNT * 100;
      }

      nextQuestionId = response.next_question && response.next_question.id;

      return {
        ...state,
        currentQuestionId: nextQuestionId,
        hasAnsweredAllQuestions: !nextQuestionId,
        isShowingProgressText: !!isFinishedFirstQuestionBlock,
        progressBarValue,
        responses,
        selectedChoiceId: null,
        submitting: false
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
