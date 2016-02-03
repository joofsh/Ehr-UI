import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Input, ButtonInput } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import apiUtil from 'src/utils/api';
import { UserForm } from 'src/components';
import { pushPath } from 'redux-simple-router'

export class NewUser extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {
      fields,
      handleSubmit,
      submitting,
    } = this.props;

    return <div className="container-newUser container">
      <h2>Create a New User:</h2>
      <div className="row">
        <UserForm
          handleSubmit={handleSubmit}
          fields={fields}
          submitting={submitting}
          groupClassName="col-lg-6 col-md-12"
        />
      </div>
    </div>;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (user) => {
      dispatch({ type: 'REQUEST_ADD_USER' })

      return apiUtil.post('/api/users', { user })
        .then(user => {
          dispatch({ type: 'RECEIVE_ADD_USER', response: user });
          dispatch(pushPath(`/users/${user.id}`));
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
