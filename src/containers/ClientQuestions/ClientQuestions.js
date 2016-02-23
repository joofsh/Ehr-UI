import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { LoadingSpinner } from 'src/components';
import { pushPath } from 'redux-simple-router';
import _find from 'lodash/find';
import classnames from 'classnames';

function fetchClientQuestionsAction(id) {
  return {
    type: 'CALL_API',
    method: 'get',
    url: `/api/clients/${id}/questions`,
    successType: 'RECEIVE_CLIENT_QUESTIONS_SUCCESS'
  };
}

function submitAnswerAction(id, data) {
  return {
    type: 'CALL_API',
    method: 'put',
    url: `/api/clients/${id}/responses`,
    errorType: 'RECEIVE_ANSWER_SUBMIT_ERROR',
    data
  };
}

export class Choice extends Component {
  constructor() {
    super();
    this.selectChoice = this.selectChoice.bind(this);
  }

  static propTypes = {
    id: PropTypes.number.isRequired,
    stem: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    selectChoice: PropTypes.func.isRequired,
    _error: PropTypes.string,
    selectedChoiceId: PropTypes.number
  };

  selectChoice() {
    this.props.selectChoice(this.props.id);
  }

  render() {
    let {
      stem,
      selected
    } = this.props;

    let classes = classnames({
      selected
    }, 'col-md-6', 'col-sx-12', 'choice');

    return (
      <div
        className={classes}
        onClick={this.selectChoice}
      >
        {stem}
      </div>);
  }
}

export class ClientQuestions extends Component {
  static fetchData({ store, params }) {
    return store.dispatch(fetchClientQuestionsAction(+params.id));
  }

  constructor() {
    super();
    this.submitAnswer = this.submitAnswer.bind(this);
  }

  static propTypes = {
    fetchClientQuestions: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    submitAnswer: PropTypes.func.isRequired,
    selectChoice: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    currentQuestion: PropTypes.object,
    selectedChoiceId: PropTypes.number,
    client: PropTypes.object
  };

  componentWillMount() {
    this.props.fetchClientQuestions(+this.props.params.id);
  }

  submitAnswer() {
    let {
      submitAnswer,
      currentQuestion,
      selectedChoiceId,
      client
    } = this.props;

    submitAnswer(currentQuestion.id, selectedChoiceId, client.id);
  }

  render() {
    let {
      currentQuestion,
      selectChoice,
      selectedChoiceId,
      client,
      _error,
      submitting
    } = this.props;

    require('./ClientQuestions.scss');
    if (!currentQuestion) {
      return <LoadingSpinner large absolute center/>;
    }

    return (<div className="container-clientQuestions container">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <div className="answer-question-wrapper clearfix">
            <div className="clearfix">
              <h4 className="pull-left">
                {client.name}
              </h4>
              <Link className="pull-right" to={`/clients/${client.id}/resources`}>
                Skip To Resources &gt;
              </Link>
            </div>
            <p>
              Please answer the following questions to
              help identify the best resources for you:
            </p>
            <div className="col-xs-12 question">
              {currentQuestion.stem}
            </div>
            <div className="choices">
              {currentQuestion.choices.map(choice => {
                return (
                  <Choice
                    {...choice}
                    key={choice.id}
                    selected={selectedChoiceId === choice.id}
                    selectChoice={selectChoice}
                  />);
              })}
            </div>
          </div>
          <div className="pull-right submit-box">
            {_error && <p className="text-danger">{_error}</p>}
            {selectedChoiceId &&
              <button className="btn btn-success btn-lg pull-right"
                type="submit" disabled={submitting}
                onClick={this.submitAnswer}
              >
              {submitting ? <LoadingSpinner/> : <i className="fa fa-paper-plane"/> } Submit
            </button>}
          </div>
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(state) {
  let currentQuestion = _find(state.client.questions, question => {
    return question.id === state.client.currentQuestionId;
  });

  return {
    currentQuestion,
    client: state.client.client,
    selectedChoiceId: state.client.selectedChoiceId,
    submitting: state.client.submitting,
    error: state.client.error
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchClientQuestions: () => {
      dispatch((dispatch) => {
        // Only fetch question if not already fetched
        if (ownProps.currentQuestion) {
          return;
        }

        dispatch(fetchClientQuestionsAction(+ownProps.params.id));
      });
    },
    selectChoice: (choiceId) => {
      dispatch({ type: 'SELECT_CHOICE', choiceId });
    },
    submitAnswer: (questionId, choiceId, clientId) => {
      let body = {
        question_id: questionId,
        choice_id: choiceId
      };
      dispatch({ type: 'REQUEST_ANSWER_SUBMIT' });
      return dispatch(submitAnswerAction(clientId, body)).then(response => {

        dispatch({ type: 'RECEIVE_ANSWER_SUBMIT_SUCCESS', response });
        if (!response.next_question) {
          dispatch(pushPath(`/clients/${clientId}/resources`));
        }
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientQuestions);
