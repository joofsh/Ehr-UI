import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import { LoadingSpinner, Question } from 'src/components';
import { fetchQuestionsAction } from 'src/actions';
import { push } from 'react-router-redux';
import _find from 'lodash/find';
import Helmet from 'react-helmet';

function fetchInitialQuestionAction(state) {
  let userId;

  if (state.session.user.role === 'guest') {
    userId = state.session.user.id;
  }

  return {
    type: 'CALL_API',
    method: 'get',
    url: `/api/wizard/${userId}/current_question`,
    successType: ['RECEIVE_QUESTION_SUCCESS', 'RESET_WIZARD', 'SET_CURRENT_WIZARD_QUESTION']
  };
}

function submitAnswerAction(id, data) {
  return {
    type: 'CALL_API',
    method: 'put',
    url: `/api/wizard/${id}/responses`,
    errorType: 'RECEIVE_ANSWER_SUBMIT_ERROR',
    data
  };
}

export class QuestionWizard extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchInitialQuestionAction(store.getState()));
  }

  constructor() {
    super();
    this.submitAnswer = this.submitAnswer.bind(this);
  }

  static propTypes = {
    fetchInitialQuestion: PropTypes.func.isRequired,
    fetchQuestions: PropTypes.func.isRequired,
    isShowingProgressText: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    progressBarValue: PropTypes.number.isRequired,
    submitAnswer: PropTypes.func.isRequired,
    selectChoice: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    currentQuestion: PropTypes.object,
    selectedChoiceId: PropTypes.number,
    user: PropTypes.object,
    _error: PropTypes.string
  };

  componentDidMount() {
    this.props.fetchInitialQuestion();
    this.props.fetchQuestions();
  }

  progressTextClasses() {
    let className = ['progress-text'];

    if (this.props.isShowingProgressText) {
      className.push('visible');
    }

    return className.join(' ');
  }

  submitAnswer() {
    let {
      currentQuestion,
      submitAnswer,
      selectedChoiceId,
      user
    } = this.props;

    submitAnswer(currentQuestion.id, selectedChoiceId, user.id);
  }

  render() {
    let {
      currentQuestion,
      progressBarValue,
      selectChoice,
      selectedChoiceId,
      _error,
      submitting
    } = this.props;

    require('./QuestionWizard.scss');
    if (!currentQuestion) {
      return <LoadingSpinner large absolute center/>;
    }

    return (<div className="container-QuestionWizard container">
      <Helmet title="Question Wizard"/>
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <div className="answer-question-wrapper clearfix">
            <div className="progress-text-wrapper">
              <span className={this.progressTextClasses()}>
                Doing great! Keep answering questions to find better results
              </span>
            </div>
            <ProgressBar now={progressBarValue} bsStyle="success" striped active/>
            <div className="clearfix">
              <Link className="pull-right" to={`/my_resources`}>
                Skip To Resources &gt;
              </Link>
              <small>
                Please answer the following questions to
                help identify the best resources for you:
              </small>
            </div>
            <Question
              {...currentQuestion}
              error={_error}
              selectedChoiceId={selectedChoiceId}
              selectChoice={selectChoice}
              submitting={submitting}
              submitAnswer={this.submitAnswer}
            />
          </div>
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(state) {
  let currentQuestion = _find(state.question.questions, question => {
    return question.id === state.wizard.currentQuestionId;
  });

  return {
    currentQuestion,
    isShowingProgressText: state.wizard.isShowingProgressText,
    progressBarValue: state.wizard.progressBarValue,
    user: state.session.user,
    selectedChoiceId: state.wizard.selectedChoiceId,
    submitting: state.wizard.submitting,
    error: state.wizard.error,
    totalResponses: state.wizard.responses.length,
    totalQuestions: state.question.questions.length
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchInitialQuestion: () => {
      dispatch((dispatch, getState) => {
        dispatch(fetchInitialQuestionAction(getState()));
      });
    },
    fetchQuestions: () => {
      dispatch((dispatch, getState) => {
        if (getState().question.lastUpdated && getState().question.questions.length) {
          return;
        }

        dispatch({ type: 'REQUEST_QUESTIONS' });
        dispatch(fetchQuestionsAction());
      });
    },
    selectChoice: (choiceId) => {
      dispatch({ type: 'SELECT_CHOICE', choiceId });
    },
    submitAnswer: (questionId, choiceId, userId) => {
      dispatch((dispatch, getState) => {
        let body = {
          question_id: questionId,
          choice_id: choiceId
        };

        dispatch({ type: 'REQUEST_ANSWER_SUBMIT' });
        return dispatch(submitAnswerAction(userId, body)).then(response => {
          dispatch({ type: 'RECEIVE_ANSWER_SUBMIT_SUCCESS', payload: { response } });

          setTimeout(() => {
            if (!response.next_question) {
              dispatch(push(`/my_resources`));
            } else if (getState().wizard.progressBarValue === 100) {
              dispatch({ type: 'RESET_PROGRESS_BAR' });
            }
          }, 1000);
        });
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionWizard);
