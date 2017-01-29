import reducer, { initialState } from '../question';
import expect from 'expect';
import _filter from 'lodash/filter';

let mockQuestions = [
  { id: 1, stem: 'Who are you?', choices: [{ id: 1, stem: 'Yes' }, { id: 2, stem: 'no' }] },
  { id: 2, stem: 'How are you?', choices: [{ id: 1, stem: 'Yes' }, { id: 2, stem: 'no' }] },
  { id: 3, stem: 'What are you?', choices: [{ id: 1, stem: 'Yes' }, { id: 2, stem: 'no' }] }
];

let state;

describe('Question Reducer', () => {
  beforeEach(() => {
    state = reducer(initialState);
  });

  it('REQUEST_QUESTIONS', () => {
    state = reducer(state, { type: 'REQUEST_QUESTIONS' });
    expect(state.isFetching).toBe(true);
  });

  describe('RECEIVE_QUESTIONS_SUCCESS', () => {
    it('adds initial questions', () => {
      expect(state.questions.length).toBe(0);
      state = reducer(state, {
        type: 'RECEIVE_QUESTIONS_SUCCESS', payload: { questions: mockQuestions }
      });

      expect(state.questions.length).toBe(mockQuestions.length);
      expect(state.questions[0].id).toBe(mockQuestions[0].id);
    });

    it('adds more questions', () => {
      state = reducer(state, {
        type: 'RECEIVE_QUESTIONS_SUCCESS', payload: { questions: mockQuestions }
      });
      expect(state.questions.length).toBe(3);

      let newQuestions = [{ id: 4, stem: 'new' }, { id: 5, stem: 'newest' }];
      state = reducer(state, {
        type: 'RECEIVE_QUESTIONS_SUCCESS', payload: { questions: newQuestions }
      });

      expect(state.questions.length).toBe(mockQuestions.length + newQuestions.length);
      expect(state.questions[3].id).toBe(newQuestions[0].id);
    });
  });

  describe('ADD_EMPTY_QUESTION', () => {
    it('adds a stub question', () => {
      expect(state.questions.length).toBe(0);
      state = reducer(state, { type: 'ADD_EMPTY_QUESTION' });
      expect(state.questions.length).toBe(1);
      expect(state.questions[0].stem).toBe(null);
      expect(state.questions[0].order).toBe(null);
      expect(state.questions[0].isEditing).toBe(true);
      expect(state.questions[0].choices.length).toBe(1);
    });

    it('only adds one stub max', () => {
      expect(state.questions.length).toBe(0);
      state = reducer(state, { type: 'ADD_EMPTY_QUESTION' });
      state = reducer(state, { type: 'ADD_EMPTY_QUESTION' });
      state = reducer(state, { type: 'ADD_EMPTY_QUESTION' });

      expect(state.questions.length).toBe(1);
    });
  });

  describe('Update existing questions', () => {
    beforeEach(() => {
      state = reducer(state, {
        type: 'RECEIVE_QUESTIONS_SUCCESS', payload: { questions: mockQuestions }
      });
    });

    it('TOGGLE_EDIT_QUESTION', () => {
      expect(state.questions[0].isEditing).toBe(false);
      state = reducer(state, {
        type: 'TOGGLE_EDIT_QUESTION', payload: { questionIndex: 0 } });

      expect(state.questions[0].isEditing).toBe(true);
      expect(state.questions[1].isEditing).toBe(false);
      expect(state.questions[2].isEditing).toBe(false);

      state = reducer(state, {
        type: 'TOGGLE_EDIT_QUESTION', payload: { questionIndex: 1 } });

      // Ensure previous question's isEditing is set to false
      expect(state.questions[0].isEditing).toBe(false);
      expect(state.questions[1].isEditing).toBe(true);
      expect(state.questions[2].isEditing).toBe(false);

      state = reducer(state, {
        type: 'TOGGLE_EDIT_QUESTION', payload: { questionIndex: 1 } });

      // Ensure previous question's isEditing is set to false
      expect(state.questions[0].isEditing).toBe(false);
      expect(state.questions[1].isEditing).toBe(false);
      expect(state.questions[2].isEditing).toBe(false);
    });

    describe('RECEIVE_NEW_QUESTION_SUCCESS', () => {
      it('adds a new question directly', () => {
        let question = { id: 4, stem: 'Whats up?' };
        expect(state.questions.length).toBe(3);
        state = reducer(state, {
          type: 'RECEIVE_NEW_QUESTION_SUCCESS', payload: { question }
        });
        expect(state.questions.length).toBe(4);
      });

      it('saves new question to stub question', () => {
        let question = { id: 4, stem: 'Whats up?' };
        state = reducer(state, { type: 'ADD_EMPTY_QUESTION' });

        expect(state.questions.length).toBe(4);
        expect(state.questions[3].id).toBe(undefined);
        state = reducer(state, {
          type: 'RECEIVE_NEW_QUESTION_SUCCESS', payload: { question }
        });
        expect(state.questions.length).toBe(4);
        expect(state.questions[3].id).toBe(question.id);
      });
    });

    describe('RECEIVE_QUESTION_SUCCESS', () => {
      it('adds a new new question', () => {
        let question = { id: 4, stem: 'Whats up?' };
        expect(state.questions.length).toBe(3);

        state = reducer(state, {
          type: 'RECEIVE_QUESTION_SUCCESS', payload: { question }
        });
        expect(state.questions.length).toBe(4);
        expect(state.questions[3].id).toBe(question.id);
      });

      it('replaces existing question', () => {
        let question = { id: 1, stem: 'Whats up?' };
        expect(state.questions.length).toBe(3);
        expect(state.questions[0].id).toBe(question.id);
        expect(state.questions[0].stem).toNotBe(question.stem);

        state = reducer(state, {
          type: 'RECEIVE_QUESTION_SUCCESS', payload: { question }
        });
        expect(state.questions.length).toBe(3);
        expect(state.questions[0].stem).toBe(question.stem);
      });
    });

    describe('RECEIVE_DELETE_QUESTION_SUCCESS', () => {
      it('deletes a database question', () => {
        let questionId = state.questions[0].id;
        expect(state.questions.length).toBe(3);

        state = reducer(state, {
          type: 'RECEIVE_DELETE_QUESTION_SUCCESS', payload: { questionId }
        });
        expect(state.questions.length).toBe(2);
        expect(state.questions[0].id).toNotBe(questionId);
      });

      it('deletes unsaved question', () => {
        let questionIndex = 3;
        let savedQuestionsBefore = _filter(state.questions, q => !!q.id);

        state = reducer(state, { type: 'ADD_EMPTY_QUESTION' });
        expect(state.questions.length).toBe(4);
        expect(state.questions[questionIndex].id).toBe(undefined);

        state = reducer(state, {
          type: 'RECEIVE_DELETE_QUESTION_SUCCESS', payload: { questionIndex }
        });
        expect(state.questions.length).toBe(3);
        let savedQuestionsAfter = _filter(state.questions, q => !!q.id);
        expect(savedQuestionsBefore).toEqual(savedQuestionsAfter);
      });
    });

    it('REMOVE_QUESTION_CHOICE', () => {
      let questionIndex = 1;
      let choiceIndex = 0;
      let choice = state.questions[questionIndex].choices[choiceIndex];
      expect(state.questions[questionIndex].choices.length).toBe(2);

      state = reducer(state, {
        type: 'REMOVE_QUESTION_CHOICE', payload: { questionIndex, choiceIndex }
      });

      expect(state.questions[questionIndex].choices.length).toBe(1);
      expect(state.questions[questionIndex].choices[choiceIndex].id).toNotBe(choice.id);
    });
  });
});
