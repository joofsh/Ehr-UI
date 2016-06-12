import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { pushPath } from 'redux-simple-router';
import { connect } from 'react-redux';
import { LoadingSpinner, FontIcon } from 'src/components';

export class Home extends Component {
  static propTypes = {
    registerGuest: PropTypes.func.isRequired,
    isRegisteringGuest: PropTypes.bool.isRequired
  };

  render() {
    let {
      isRegisteringGuest,
      registerGuest
    } = this.props;

    require('./Home.scss');
    return (<div className="container-home container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="banner-image">
            <div className="col-lg-6">
              <h2 className="banner-title">A Simpler Way To Find Help</h2>
            </div>
            <div className="col-lg-3 col-lg-offset-2">
              <div className="banner-question clearfix" onClick={registerGuest}>
                  <h3>Are you looking for personalized resources?</h3>
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
      <h3 className="subtitle">Seeking Our Collection of Resources?</h3>
      <div className="cta-2nd">
        <Link to="/resources" className="btn btn-primary btn-lg">
          View All Resources
        </Link>
      </div>
    </div>);
  }
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
    registerGuest: () => {
      dispatch({ type: 'REQUEST_REGISTER_GUEST' });
      dispatch(registerGuestAction()).then((guest) => {
        dispatch({ type: 'RECEIVE_AUTHENTICATE_SUCCESS', payload: { user: guest } });
        dispatch(pushPath('/wizard'));
      });
    }
  };
}

function mapStateToProps(state) {
  return {
    isRegisteringGuest: state.session.isRegisteringGuest
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
