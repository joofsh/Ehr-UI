import expect from 'expect';
import reducer, { initialState } from '../wizard';

let mockQuestions = [
  { id: 1, stem: 'question stem', choices: [{ id: 10, stem: 'ha' }, { id: 11, stem: 'fa' }] },
  { id: 2, stem: 'question stem', choices: [{ id: 12, stem: 'ha' }, { id: 13, stem: 'fa' }] },
  { id: 3, stem: 'question stem', choices: [{ id: 14, stem: 'ha' }, { id: 15, stem: 'fa' }] }
];

let mockUser = {
  id: 1,
  username: 'asdfklasdjfa'
};

let mockResources = [{ id: 5, title: 'fun' }];

let state;

describe('Wizard Reducer', () => {
  beforeEach(() => {
    state = reducer(initialState);
  });

  describe('SELECT_CHOICE', () => {
    beforeEach(() => {
      state = reducer(initialState, {
        type: 'SET_CURRENT_WIZARD_QUESTION',
        payload: { question: mockQuestions[0] }
      });
    });

    it('allows selecting choices', () => {
      expect(state.selectedChoiceId).toNotExist();

      state = reducer(state, { type: 'SELECT_CHOICE', choiceId: 10 });
      expect(state.selectedChoiceId).toBe(10);

      state = reducer(state, { type: 'SELECT_CHOICE', choiceId: 11 });
      expect(state.selectedChoiceId).toBe(11);
    });

    it('clears errors on select', () => {
      expect(state.error).toNotExist();
      state = reducer(state, { type: 'RECEIVE_ANSWER_SUBMIT_ERROR' });
      expect(state.error).toExist();

      state = reducer(state, { type: 'SELECT_CHOICE', choiceId: 11 });
      expect(state.error).toNotExist();
    });
  });

  describe('Select, submit & load next question', () => {
    beforeEach(() => {
      state = reducer(initialState, {
        type: 'SET_CURRENT_WIZARD_QUESTION',
        payload: { question: mockQuestions[0] }
      });
    });

    it('works', () => {
      // Select and submit first question
      state = reducer(state, { type: 'SELECT_CHOICE', choiceId: 10 });
      expect(state.selectedChoiceId).toBe(10);
      expect(state.submitting).toBe(false);

      state = reducer(state, { type: 'REQUEST_ANSWER_SUBMIT' });
      expect(state.submitting).toBe(true);

      state = reducer(state, {
        type: 'RECEIVE_ANSWER_SUBMIT_SUCCESS',
        response: { next_question: mockQuestions[1] }
      });
      expect(state.submitting).toBe(false);
      expect(state.selectedChoiceId).toNotExist();
      expect(state.currentQuestionId).toBe(mockQuestions[1].id);
      expect(state.hasAnsweredAllQuestions).toBe(false);

      // Select and submit second question
      state = reducer(state, { type: 'SELECT_CHOICE', choiceId: 12 });
      state = reducer(state, { type: 'REQUEST_ANSWER_SUBMIT' });
      state = reducer(state, { type: 'RECEIVE_ANSWER_SUBMIT_SUCCESS', response: {} });
      expect(state.selectedChoiceId).toNotExist();
      expect(state.hasAnsweredAllQuestions).toBe(true);
    });
  });

  it('RECEIVE_PERSONALIZED_RESOURCES_SUCCESS', () => {
    expect(state.resources.length).toBe(0);
    state = reducer(state, {
      type: 'RECEIVE_PERSONALIZED_RESOURCES_SUCCESS',
      payload: { user: mockUser, resources: mockResources }
    });
    expect(state.resources.length).toBe(mockResources.length);
  });

});
