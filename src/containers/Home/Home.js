import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { LoadingSpinner, FontIcon, Modal, NewsletterSignupForm } from 'src/components';
import ReactGA from 'react-ga';

export class Home extends Component {
  static propTypes = {
    handleNewsletterSignup: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    isModalActive: PropTypes.bool.isRequired,
    isRegisteringGuest: PropTypes.bool.isRequired,
    newsletterSignupSuccess: PropTypes.bool,
    registerGuest: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    let {
      handleNewsletterSignup,
      hideModal,
      isModalActive,
      isRegisteringGuest,
      newsletterSignupSuccess,
      registerGuest,
      showModal,
      submitting
    } = this.props;

    require('./Home.scss');
    return (<div className="container-home container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="banner-image">
            <div className="col-md-6">
              <h2 className="banner-title">A Simpler Way to Find Help</h2>
            </div>
            <div className="col-md-3 col-md-offset-2">
              <div className="banner-question clearfix" onClick={registerGuest}>
                  <h3>Answer a few questions and find resources just for you</h3>
                  <h4 className="pull-right cta-wrapper">
                    <span className="cta-text">Let's Begin</span>
                    {isRegisteringGuest ?
                      <LoadingSpinner className="cta-arrow"/> :
                      <FontIcon className="cta-arrow" type="long-arrow-right"/>}
                  </h4>
              </div>
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
    registerGuest: () => {
      dispatch({ type: 'REQUEST_REGISTER_GUEST' });
      dispatch(registerGuestAction()).then((guest) => {
        dispatch({ type: 'RECEIVE_AUTHENTICATE_SUCCESS', payload: { user: guest } });
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
    isRegisteringGuest: state.session.isRegisteringGuest,
    isModalActive: state.session.isModalActive,
    newsletterSignupSuccess: state.session.newsletterSignupSuccess,
    submitting: state.session.isSubmittingNewsletterSignup
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
