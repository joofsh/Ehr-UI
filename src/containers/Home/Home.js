import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import {
  LoadingSpinner,
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
    handleNewsletterSignup: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    isModalActive: PropTypes.bool.isRequired,
    isRegisteringGuest: PropTypes.bool.isRequired,
    newsletterSignupSuccess: PropTypes.bool,
    selectChoice: PropTypes.func.isRequired,
    selectedChoiceId: PropTypes.number,
    showModal: PropTypes.func.isRequired,
    submitAnswer: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
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
      isRegisteringGuest,
      newsletterSignupSuccess,
      selectChoice,
      selectedChoiceId,
      showModal,
      submitting
    } = this.props;

    let homepageLogoImage = require('../App/dcr_resources_1.png');

    require('./Home.scss');
    return (<div className="container-home container-fluid">
      <div className="banner-image">
        <div className="col-lg-12 banner-section">
          <div className="row">
            <div className="col-md-6">
              <img src={homepageLogoImage} className="logo-main"/>
            </div>
            <div className="col-md-6">
              {/* <Link to="/advocates" className="btn btn-primary  btn-brand btn-lg pull-right cta-advocate">
                Social Workers
              </Link> */}
            </div>
          </div>
          <div className="row row-mainContent">
            <div className="col-md-offset-2 col-md-8">
              <div className="banner-title-wrapper">
                <h2 className="banner-title">
                  Resources for you in under 5 minutes
                </h2>
              </div>
              {firstQuestion && <Question
                {...firstQuestion}
                className="first-question"
                selectChoice={selectChoice}
                selectedChoiceId={selectedChoiceId}
                submitAnswer={this.submitAnswer}
                submitting={submitting}
               />}
                {/*<div className="banner-question clearfix">
                <h3 className="question-prompt">Are you ready to find resources in under 5 minutes?</h3>
                <Link className="questionChoice" to="/resources">
                  No, show me all resources
                </Link>
                <a className="questionChoice pull-right" onClick={registerGuest} href="#">
                  Yes, let's begin
                  {isRegisteringGuest ?
                    <LoadingSpinner className="cta-arrow"/> :
                    <FontIcon className="cta-arrow" type="long-arrow-right"/>}
                </a>
              </div>*/}
            </div>
          </div>
        </div>
      </div>
      <div className="cta-2nd">
        <Link to="/resources" className="btn btn-primary btn-lg">
          View All Resources
        </Link>
        <div className="newsletterModalLink">
          <a href="#" onClick={showModal}>Sign up for our newsletter</a>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 legal-disclaimer">
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
          submitting={submitting}
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
    isRegisteringGuest: state.session.isRegisteringGuest,
    isModalActive: state.session.isModalActive,
    newsletterSignupSuccess: state.session.newsletterSignupSuccess,
    selectedChoiceId: state.wizard.selectedChoiceId,
    submitting: state.session.isSubmittingNewsletterSignup || state.wizard.submitting,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
