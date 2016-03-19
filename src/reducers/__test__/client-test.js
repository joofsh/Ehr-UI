import expect from 'expect';
import reducer, { initialState } from '../client';

let mockQuestions = [
  { id: 1, stem: 'question stem', choices: [{ id: 10, stem: 'ha' }, { id: 11, stem: 'fa' }] },
  { id: 2, stem: 'question stem', choices: [{ id: 12, stem: 'ha' }, { id: 13, stem: 'fa' }] },
  { id: 3, stem: 'question stem', choices: [{ id: 14, stem: 'ha' }, { id: 15, stem: 'fa' }] }
];

let mockClient = {
  id: 1,
  first_name: 'Bob'
};

let mockResources = [{ id: 5, title: 'fun' }];

let state;

describe('Client Reducer', () => {
  beforeEach(() => {
    state = reducer(initialState);
  });

  it('RECEIVE_CLIENT_SUCCESS', () => {
    expect(state.client).toNotExist();

    state = reducer(initialState, {
      type: 'RECEIVE_CLIENT_SUCCESS',
      response: mockClient
    });

    expect(state.client).toExist();
    expect(state.client.id).toBe(mockClient.id);
  });

  it('RECEIVE_CLIENT_QUESTIONS_SUCCESS', () => {
    expect(state.client).toNotExist();
    expect(state.questions.length).toBe(0);
    expect(state.currentQuestionId).toNotExist();

    state = reducer(initialState, {
      type: 'RECEIVE_CLIENT_QUESTIONS_SUCCESS',
      response: { questions: mockQuestions, client: mockClient }
    });

    expect(state.client).toExist();
    expect(state.questions.length).toBe(mockQuestions.length);
    expect(state.currentQuestionId).toBe(mockQuestions[0].id);
  });

  describe('SELECT_CHOICE', () => {
    beforeEach(() => {
      state = reducer(initialState, {
        type: 'RECEIVE_CLIENT_QUESTIONS_SUCCESS',
        response: { questions: mockQuestions, client: mockClient }
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
        type: 'RECEIVE_CLIENT_QUESTIONS_SUCCESS',
        response: { questions: mockQuestions, client: mockClient }
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

  it('RECEIVE_CLIENT_RESOURCES_SUCCESS', () => {
    expect(state.resources.length).toBe(0);
    state = reducer(state, {
      type: 'RECEIVE_CLIENT_RESOURCES_SUCCESS',
      response: { client: mockClient, resources: mockResources }
    });
    expect(state.resources.length).toBe(mockResources.length);
  });

});
