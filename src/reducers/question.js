import _findIndex from 'lodash/findIndex';
import _remove from 'lodash/remove';
import _find from 'lodash/find';

export const initialState = {
  isFetching: false,
  lastUpdated: null,
  questions: []
};

export function buildQuestion(question) {
  return {
    isEditing: false,
    ...question
  };
}

export default function reducer(state = initialState, action = {}) {
  let _questions, _question, index;

  switch (action.type) {
    case 'REQUEST_QUESTIONS':
      return {
        ...state,
        isFetching: true
      };
    case 'RECEIVE_QUESTIONS_SUCCESS':
      _questions = state.questions.slice();

      action.payload.questions.forEach(question => {
        index = _findIndex(_questions, q => q.id === question.id);

        _question = buildQuestion(question);

        if (index >= 0) {
          _questions[index] = _question;
        } else {
          _questions.push(_question);
        }
      });

      return {
        ...state,
        isFetching: false,
        questions: _questions,
        lastUpdated: Date.now()
      };
    case 'ADD_EMPTY_QUESTION':
      _questions = state.questions.slice();
      index = _findIndex(_questions, q => !q.id);

      // Ensure no other stub question already exists.
      // For simplicity we only allow 1 stub question at a time
      if (index < 0) {

        // Set all other questions as not editing
        _questions = _questions.map(q => {
          _question = Object.assign({}, q);
          _question.isEditing = false;
          return _question;
        });

        _questions.push({
          stem: null,
          order: null,
          choices: [{ stem: null }],
          isEditing: true
        });
      }

      return {
        ...state,
        questions: _questions
      };
    case 'TOGGLE_EDIT_QUESTION':
      _questions = state.questions.slice();
      index = action.payload.questionIndex;

      // set all other questions as not editing
      for (let i = 0; i < _questions.length; i++) {
        if (i === index) {
          _questions[index].isEditing = !_questions[index].isEditing;
        } else {
          _questions[i].isEditing = false;
        }
      }

      return {
        ...state,
        questions: _questions
      };
    case 'RECEIVE_NEW_QUESTION_SUCCESS':
      _questions = state.questions.slice();
      index = _findIndex(_questions, q => q.isEditing && !q.id);

      _question = buildQuestion(action.payload.question);

      if (index >= 0) {
        _questions[index] = _question;
      } else {
        _questions.push(_question);
      }

      return {
        ...state,
        questions: _questions
      };
    case 'RECEIVE_QUESTION_SUCCESS':
      _questions = state.questions.slice();
      index = _findIndex(_questions, q => q.id === action.payload.question.id);

      _question = buildQuestion(action.payload.question);

      if (index >= 0) {
        _questions[index] = _question;
      } else {
        _questions.push(_question);
      }

      return {
        ...state,
        questions: _questions
      };
    case 'RECEIVE_DELETE_QUESTION_SUCCESS':
      _questions = state.questions.slice();

      _remove(_questions, (question, i) => {
        let val;
        if (action.payload.questionId) {
          val = question.id === action.payload.questionId;
        } else {
          val = i === action.payload.questionIndex;
        }
        return val;
      });

      return {
        ...state,
        questions: _questions
      };
    case 'REMOVE_QUESTION_CHOICE':
      _questions = state.questions.slice();
      _question = _find(_questions, (_, qIndex) => qIndex === action.payload.questionIndex);

      if (_question) {
        _remove(_question.choices, (_, cIndex) => cIndex === action.payload.choiceIndex);
      }

      return {
        ...state,
        questions: _questions
      };
    default:
      return state;
  }
}
