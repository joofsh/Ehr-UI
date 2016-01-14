import React, { Component, PropTypes } from 'react';
import { LoadingSpinner, FormGroup } from 'components';
import { ButtonInput } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import apiUtil from 'utils/api';

export class Login extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  render() {
    const {
      fields: { identifier, password },
      handleSubmit,
      submitting
    } = this.props;

    require('./Login.scss');
    return <div className="container-login container">
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <FormGroup title='Username' placeholder='Enter Username or Email' {...identifier}/>
            <FormGroup title='Password' {...password}/>
            <button className='btn btn-success btn-block'
              disabled={submitting} onClick={handleSubmit}>
              {submitting ? <LoadingSpinner/> : <i className="fa fa-sign-in"/> } Submit
            </button>

          </form>
        </div>
      </div>
    </div>
  }
};

function mapDispatchToProps(dispatch) {
  return {
    onSubmit(login) {
      dispatch({ type: 'REQUEST_AUTHENTICATE' });

      return apiUtil.post('/api/users/authorize', login)
        .then(user => {
          dispatch({ type: 'RECEIVE_AUTHENTICATE_SUCCES' })
        });
    }
  }
}


Login = reduxForm({
  form: 'login',
  fields: ['identifier', 'password']
},
  null,
  mapDispatchToProps
)(Login);

export default Login;
