import React, { Component, PropTypes } from 'react';
import { LoadingSpinner, FormGroup } from 'src/components';
import { reduxForm } from 'redux-form';
import ApiClient from 'src/utils/api';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';

export class Login extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.string
  };

  render() {
    let {
      fields: { identifier, password },
      handleSubmit,
      submitting,
      error
    } = this.props;

    require('./Login.scss');
    return (<div className="container-login container">
      <Helmet title="Login"/>
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <h1>Login</h1>
          <form className="form-horizontal" onSubmit={handleSubmit}>
            <FormGroup label="Username" placeholder="Enter Username or Email" {...identifier}/>
            <FormGroup label="Password" {...password} type="password"/>
            {error && <p className="text-danger error">{error}</p>}
            <button className="btn btn-success btn-block"
              disabled={submitting}
            >
              {submitting ? <LoadingSpinner/> : <i className="fa fa-sign-in"/> } Submit
            </button>

          </form>
        </div>
      </div>
    </div>);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit(login) {
      return new Promise((resolve, reject) => {
        new ApiClient().post('/authorize', { data: login })
          .then(user => {
            dispatch({ type: 'RECEIVE_AUTHENTICATE_SUCCESS', payload: { user } });
            resolve(dispatch(push('/')));
          }, () => {
            reject(
              { _error: 'Login Failed. Please verify your username and password are correct' }
            );
          });
      });
    }
  };
}

function mapStateToProps() {
  return {};
}

export default reduxForm({
  form: 'login',
  fields: ['identifier', 'password']
},
  mapStateToProps,
  mapDispatchToProps
)(Login);
