import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Input, ButtonInput } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import apiUtil from 'utils/api';
import { FormGroup, LoadingSpinner } from 'components';

export class NewUser extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {
      fields: { first_name, last_name, role, username, email },
      handleSubmit,
      submitting
    } = this.props;

    return <form onSubmit={handleSubmit}>
      <h2>Create a New User:</h2>
      <FormGroup title='Username' {...username} />
      <FormGroup title='First Name' {...first_name} />
      <FormGroup title='Last Name' {...last_name }/>
      <FormGroup title='Email' {...email }/>
      <select {...role} defaultValue=''>
        <option disabled value=''>Select Role:</option>
        <option value='patient'>Patient</option>
        <option value='therapist'>Therapist</option>
      </select>
      <ButtonInput type='submit' value='Submit' bsStyle='success'
        disabled={submitting} onClick={handleSubmit}>
        {submitting ? <LoadingSpinner/> : ''}
        Submit
      </ButtonInput>
    </form>;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (user) => {
      dispatch({ type: 'REQUEST_ADD_USER' })

      return apiUtil.post('/api/users', { user })
        .then(user => {
          dispatch({ type: 'RECEIVE_ADD_USER', user });
        });
    }
  };
}

NewUser = reduxForm({
  form: 'newUser',
  fields: ['first_name', 'last_name', 'role', 'username', 'email']
},
  null,
  mapDispatchToProps
)(NewUser);

export default NewUser;
