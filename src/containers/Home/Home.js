import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import {
  FontIcon,
  Modal,
  NewsletterSignupForm,
  Question
} from 'src/components';
import { submitAnswerAction } from 'src/actions';
import ReactGA from 'react-ga';

export function fetchFirstQuestionAction() {
  return {
    type: 'CALL_API',
    method: 'get',
    url: '/api/questions',
    params: { length: 1, order: 'wizard' },
    successType: 'RECEIVE_FIRST_QUESTION_SUCCESS'
  };
}

export class Home extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchFirstQuestionAction());
  }

  static propTypes = {
    fetchFirstQuestion: PropTypes.func.isRequired,
    firstQuestion: PropTypes.object,
    handleNewsletterSignup: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    isModalActive: PropTypes.bool.isRequired,
    isSubmittingModal: PropTypes.bool.isRequired,
    isSubmittingQuestion: PropTypes.bool.isRequired,
    newsletterSignupSuccess: PropTypes.bool,
    selectChoice: PropTypes.func.isRequired,
    selectedChoiceId: PropTypes.number,
    showModal: PropTypes.func.isRequired,
    submitAnswer: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchFirstQuestion();
  }

  submitAnswer = () => {
    let {
      firstQuestion,
      submitAnswer,
      selectedChoiceId
    } = this.props;

    submitAnswer(firstQuestion.id, selectedChoiceId);
  }

  render() {
    let {
      firstQuestion,
      handleNewsletterSignup,
      hideModal,
      isModalActive,
      isSubmittingModal,
      isSubmittingQuestion,
      newsletterSignupSuccess,
      selectChoice,
      selectedChoiceId,
      showModal,
    } = this.props;

    require('./Home.scss');
    return (<div className="container-home container-fluid">
      <div className="navbar">
        <div className="container">
          <div className="col-sm-12">
            <div className="navbar-brand">
              <div className="brand-logo">
              </div>
              <h1 className="sr-only">DC Resources</h1>
            </div>
              <Link
                to="/resources/new"
                className="btn btn-primary btn-brand pull-right cta-add-resource"
              >
                Add a Resource
              </Link>
            </div>
        </div>
      </div>
      <div className="container">
        <div className="col-lg-12 banner-section">
          <div className="row">
          </div>
          <div className="row row-mainContent">
            <div className="col-md-6">
              <h2 className="banner-title">
                Find Resources in 5 Minutes or Less
              </h2>
            </div>
            <div className="col-md-6">
              {firstQuestion && <Question
                {...firstQuestion}
                className="first-question"
                selectChoice={selectChoice}
                selectedChoiceId={selectedChoiceId}
                submitAnswer={this.submitAnswer}
                submitting={isSubmittingQuestion}
                enableKeybindings={!isModalActive}
              />}
            </div>
          </div>
        </div>
      </div>
      <div className="resource-row clearfix">
        <div className="container">
          <div className="col-md-6">
            <h3 className="resource-text">
              Want to see resources directly?
            </h3>
          </div>
          <div className="col-md-6 resource-buttons">
            <Link
              to={{ pathname: '/resources', query: { query: 'health' } }}
              title="Health Resources"
              className="btn health"
            >
              <FontIcon type="ambulance"/>
            </Link>
            <Link
              to={{ pathname: '/resources', query: { query: 'employment' } }}
              title="Employment Resources"
              className="btn employment"
            >
              <FontIcon type="briefcase"/>
            </Link>
            <Link
              to={{ pathname: '/resources', query: { query: 'housing' } }}
              title="Housing Resources"
              className="btn housing"
            >
              <FontIcon type="home"/>
            </Link>
            <Link
              to="/resources"
              title="All Resources"
              className="btn all"
            >
              <FontIcon type="plus"/>
            </Link>
          </div>
        </div>
      </div>
      <div className="col-lg-12 footer">
        <div className="footer-links">
          <Link to="/about-us">Learn More</Link>
          <a href="#" onClick={showModal}>Sign up for our newsletter</a>
        </div>
        <div className="legal-disclaimer">
          <p>
            Note: DC Resources values your privacy. All information is stored securely,
            temporarily, and anonymously. We will never ask for personally identifiable
            information such as name, address, or phone number.
          </p>
        </div>
      </div>

      <Modal show={isModalActive} title="Sign up for our newsletter" onHide={hideModal}>
        <NewsletterSignupForm
          onSubmit={handleNewsletterSignup}
          submitting={isSubmittingModal}
          success={newsletterSignupSuccess === true}
          withError={newsletterSignupSuccess === false}
        />
      </Modal>

    </div>);
  }
}

function newsletterSignupAction(user) {
  return {
    type: 'CALL_API',
    url: '/newsletter',
    method: 'post',
    redirectOnForbidden: false,
    data: user
  };
}

function registerGuestAction() {
  return {
    type: 'CALL_API',
    url: '/users/guests',
    method: 'post'
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchFirstQuestion() {
      dispatch((dispatch, getState) => {
        if (!getState().session.firstQuestion) {
          dispatch(fetchFirstQuestionAction());
        }
      });
    },
    handleNewsletterSignup: (user) => {
      dispatch({ type: 'REQUEST_NEWSLETTER_SIGNUP' });
      return dispatch(newsletterSignupAction(user)).then(() => {
        dispatch({ type: 'RECEIVE_NEWSLETTER_SIGNUP_SUCCESS' });
        global.setTimeout(() => {
          dispatch({ type: 'HIDE_MODAL' });
          // Need the 2nd nested setTimeout to give the modal sufficient
          // time to hide before resetting the form
          global.setTimeout(() => {
            dispatch({ type: 'COMPLETE_NEWSLETTER_SIGNUP_SUCCESS' });
          }, 500);
        }, 1000);
      }, () => {
        dispatch({ type: 'RECEIVE_NEWSLETTER_SIGNUP_ERROR' });
      });
    },
    selectChoice: (choiceId) => {
      dispatch({ type: 'SELECT_CHOICE', choiceId });
    },
    submitAnswer: (questionId, choiceId) => {
      dispatch({ type: 'REQUEST_REGISTER_GUEST' });
      return dispatch(registerGuestAction()).then((guest) => {
        dispatch({ type: 'RECEIVE_AUTHENTICATE_SUCCESS', payload: { user: guest } });
        dispatch({ type: 'REQUEST_ANSWER_SUBMIT' });

        let body = {
          question_id: questionId,
          choice_id: choiceId
        };

        return dispatch(submitAnswerAction(guest.id, body));
      }).then((response) => {
        dispatch({ type: 'RECEIVE_ANSWER_SUBMIT_SUCCESS', payload: { response } });
        dispatch(push('/wizard'));
      });
    },
    showModal: (event) => {
      event.preventDefault();
      dispatch({ type: 'SHOW_MODAL' });
      ReactGA.event({
        category: 'Newsletter',
        action: 'Open Subscribe Modal',
        label: 'Newsletter Modal'
      });
    },
    hideModal: () => dispatch({ type: 'HIDE_MODAL' })
  };
}

function mapStateToProps(state) {
  return {
    firstQuestion: state.session.firstQuestion,
    isModalActive: state.session.isModalActive,
    newsletterSignupSuccess: state.session.newsletterSignupSuccess,
    selectedChoiceId: state.wizard.selectedChoiceId,
    isSubmittingModal: state.session.isSubmittingNewsletterSignup,
    isSubmittingQuestion: state.wizard.submitting,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
