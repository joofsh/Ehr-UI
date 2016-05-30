import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchTagsAction } from 'src/actions';
import {
  FontIcon,
  LoadingSpinner,
  MaxHeightContainer,
  SearchBar,
  QuestionForm
} from 'src/components';

import { collectionFilter } from 'src/reducers/search';
import _remove from 'lodash/remove';

function fetchQuestions() {
  return {
    type: 'CALL_API',
    method: 'get',
    url: '/api/questions',
    params: { length: 10000 },
    successType: 'RECEIVE_QUESTIONS_SUCCESS'
  };
}

export class Questions extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchQuestions());
  }

  static propTypes = {
    fetchTags: PropTypes.func.isRequired,
    fetchQuestions: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    addEmptyQuestion: PropTypes.func.isRequired,
    toggleEditQuestion: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    allTags: PropTypes.array.isRequired,
    questions: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    params: PropTypes.object,
    children: PropTypes.node
  };

  componentDidMount() {
    this.props.fetchQuestions();
    this.props.fetchTags();
  }

  render() {
    let {
      allTags,
      children,
      handleSubmit,
      addEmptyQuestion,
      deleteQuestion,
      toggleEditQuestion,
      questions
    } = this.props;
    let content;

    if (this.props.isFetching) {
      content = <LoadingSpinner large absolute center/>;
    } else {
      content = (<div>
        <div className="row">
          <header className="col-xs-12 question-header">
            <h1>Manage Questions</h1>
          </header>
          <div className="col-xs-10">
            <SearchBar
              name="questionFilter"
              placeholder="Find a Question..."
            />
          </div>
          <div className="col-xs-2">
            <button className="btn btn-primary pull-right" onClick={addEmptyQuestion}>
              <FontIcon type="plus"/> Question
            </button>
          </div>
        </div>
        <div className="form-horizontal">
          {questions.map((question, i) => (
            <QuestionForm
              {...question}
              key={i}
              index={i}
              formKey={i.toString()}
              initialValues={question}
              onSubmit={handleSubmit}
              deleteQuestion={deleteQuestion}
              toggleEditQuestion={toggleEditQuestion}
              allTags={allTags}
            />
          ))}
        </div>
      </div>);
    }

    require('./Questions.scss');
    return (<div className="container container-questions">
      <div className="row">
        <MaxHeightContainer className="col-xs-12 pull-right">
          { children || content }
        </MaxHeightContainer>
      </div>
    </div>);
  }
}

function createOrUpdateQuestionAction(question) {
  let method;
  let url = '/api/questions';

  // Existing question
  if (question.id) {
    method = 'put';
    url = `${url}/${question.id}`;
  } else {
    method = 'post';
  }

  // Remove un-editable attributes
  let _question = Object.assign({}, question);
  delete _question.isEditing;
  delete _question.id;

  // remove choices without a stem
  _remove(_question.choices, choice => !choice.stem);

  // map tags to tag_pks
  _question.choices.forEach((choice, i) => {
    _question.choices[i].tag_pks = (choice.tags || []).map(t => t.id);
    delete _question.choices[i].tags;
  });

  return {
    type: 'CALL_API',
    url,
    method,
    data: { question: _question }
  };
}

function deleteQuestionAction(questionId) {
  return {
    type: 'CALL_API',
    url: `/api/questions/${questionId}`,
    method: 'del'
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTags: () => {
      dispatch((dispatch, getState) => {
        if (!getState().tag.lastUpdated) {
          dispatch(fetchTagsAction());
        }
      });
    },
    fetchQuestions: () => {
      dispatch((dispatch, getState) => {
        if (getState().question.lastUpdated && getState().question.questions.length) {
          return;
        }

        dispatch({ type: 'REQUEST_QUESTIONS' });
        dispatch(fetchQuestions());
      });
    },
    handleSubmit: (question, questionIndex) => {
      let action = createOrUpdateQuestionAction(question);
      return dispatch(action).then(response => {
        if (action.method === 'put') {
          dispatch({ type: 'RECEIVE_QUESTION_SUCCESS', payload: { question: response } });
        } else {
          dispatch({ type: 'RECEIVE_NEW_QUESTION_SUCCESS',
                   payload: { question: response, questionIndex } });
        }
        return Promise.resolve();
      }, () => {
        let error = { _error: 'We were unable to save this question.' };
        return Promise.reject(error);
      });
    },
    addEmptyQuestion: () => {
      return dispatch({ type: 'ADD_EMPTY_QUESTION' });
    },
    deleteQuestion: (questionId, questionIndex) => {
      let val;

      // If there is a questionId, delete the question from the database,
      // otherwise remove the unsaved question from the array by index
      if (questionId) {
        val = dispatch(deleteQuestionAction(questionId)).then(() => {
          dispatch({ type: 'RECEIVE_DELETE_QUESTION_SUCCESS',
                  payload: { questionId } });
        });
      } else {
        val = dispatch({ type: 'RECIEVE_DELETE_QUESTION_SUCCESS',
                       payload: { questionIndex } });
      }
      return val;
    },
    toggleEditQuestion: (questionIndex) => {
      dispatch({ type: 'TOGGLE_EDIT_QUESTION', payload: { questionIndex } });
    },
    removeChoice: (questionIndex, choiceIndex) => {
      dispatch({ type: 'REMOVE_QUESTION_CHOICE', payload: { questionIndex, choiceIndex } });
    }
  };
}

function mapStateToProps(state) {
  let questions = collectionFilter(state.question.questions,
                                   state.search.questionFilter,
                                  ['id', 'stem']);

  return {
    questions,
    allTags: state.tag.tags,
    isFetching: state.question.isFetching
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Questions);
