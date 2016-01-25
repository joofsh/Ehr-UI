import React, { Component, PropTypes } from 'react';
import { LoadingSpinner, FormGroup } from 'components';
import { ButtonInput } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import apiUtil from 'utils/api';
import { pushPath } from 'redux-simple-router';

export class Login extends Component {
  //static propTypes = {
    //fields: PropTypes.object.isRequired,
    //handleSubmit: PropTypes.func.isRequired,
    //resetForm: PropTypes.func.isRequired,
    //submitting: PropTypes.bool.isRequired,
    //error: PropTypes.string
  //};

  render() {
    const {
      fields: { identifier, password },
      handleSubmit,
      submitting,
      errorMessage,
      bar
    } = this.props;

    require('./Login.scss');
    return <div className="container-login container">
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
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

      return apiUtil.post('/authorize', login)
        .then(user => {
          dispatch({ type: 'RECEIVE_AUTHENTICATE_SUCCESS', response: user });
          dispatch(pushPath('/'));
        }).catch(error => {
          dispatch({ type: 'RECEIVE_AUTHENTICATE_ERROR', error: error.response });
        });
    }
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.session.error
  };
};


export default reduxForm({
  form: 'login',
  fields: ['identifier', 'password']
},
  mapStateToProps,
  mapDispatchToProps
)(Login);
