import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import apiUtil from 'src/utils/api';
import { user as userFields } from 'src/utils/formFields';
import { Form } from 'src/components';
import { pushPath } from 'redux-simple-router';

export class NewUser extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {
      handleSubmit,
      submitting,
    } = this.props;

    return (<div className="container-newUser container">
      <h2>Create a New User:</h2>
      <div className="row">
        <Form
          handleSubmit={handleSubmit}
          customFields={userFields}
          fields={userFields.map(f => f.name)}
          submitting={submitting}
          groupClassName="col-lg-6 col-md-12"
        />
      </div>
    </div>);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (user) => {
      dispatch({ type: 'REQUEST_ADD_USER' });

      return apiUtil.post('/api/users', { user })
        .then(response => {
          dispatch({ type: 'RECEIVE_ADD_USER', response });
          dispatch(pushPath(`/users/${user.id}`));
        });
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NewUser);
