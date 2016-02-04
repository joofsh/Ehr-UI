import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { UserForm } from 'src/components';
import { connect } from 'react-redux';
import ApiClient from 'src/utils/api';
import { FormGroup, LoadingSpinner } from 'src/components';
import { pushPath } from 'redux-simple-router';
import stringUtil from 'src/utils/string';
import _forOwn from 'lodash/forOwn';

const FIELDS = [
  { name: 'first_name' },
  { name: 'last_name' },
  { name: 'gender', type: 'select', title: 'Gender Identity',
    options: ['I Identify as Male', 'I Identify as Female', 'Other'],
    defaultOption: 'Select Gender Identity', defaultValue: '' },
  { name: 'race', type: 'select', options: ['Caucasion', 'Black', 'Asian'],
    defaultOption: 'Select Race', defaultValue: '' },
  { name: 'birthdate', title: 'Date of Birth', type: 'date' },
  { name: 'language' }
]

export class NewClient extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { onSubmit } = this.props;

    return <div className="newClient-container container">
      <h2>New Client Profile</h2>
      <div className="row">
        <UserForm
          onSubmit={onSubmit}
          userFields={FIELDS}
          fields={FIELDS.map(field => field.name)}
          groupClassName="col-lg-6 col-md-12"
        />
      </div>
    </div>
  }
}

function submitClient(client) {
  return {
    type: 'CALL_API',
    url: '/api/users',
    method: 'post',
    data: client
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (client) => {
      client.role = 'client';
      client.advocate_id = store.getState().session.user.id;

      return dispatch(submitClient({ user: client })).then(user => {
        dispatch({type: 'RECEIVE_ADD_USER', user });
        dispatch(pushPath(`/users/${user.id}`));
        return Promise.resolve();
      }, (response) => {
        let error = { _error: 'We were unable to create this client.' };

        _forOwn(response.body.errors, (field, key) => {
          error[key] = stringUtil.capitalize(field[0]);
        });
        return Promise.reject(error);
      });
    }
  };
}

function mapStateToProps(state) {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewClient);
