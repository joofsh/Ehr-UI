import React, { Component } from 'react';
import { connect } from 'react-redux';
import stringUtil from 'src/utils/string';
import { UserForm } from 'src/components';
import { Button } from 'react-bootstrap';
import _find from 'lodash/find';

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
];

export class User extends Component {
  static fetchData({ store, params }) {
    return store.dispatch(fetchUser(+params.id));
  }

  componentDidMount() {
    this.props.fetchUser(+this.props.params.id);
  }

  render() {
    var { user, isEditing, toggleEditUser } = this.props;

    require('./User.scss');
    return <div className="container-user container">
      <div className="row">
        <h1>{user.name}</h1>
        <Button onClick={toggleEditUser} bsStyle='primary'>
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        <UserForm
          userFields={ FIELDS }
          initialValues={user}
          fields={FIELDS.map(field => field.name)}
          isEditing={isEditing}
          groupClassName="col-lg-6 col-md-12"
        />
      </div>
    </div>
  }
};

function mapStateToProps(state, ownProps) {
  let id = +ownProps.params.id;
  let user = _find(state.user.users, user => user.id === id);
  return {
    isEditing: state.user.isEditing,
    user
  };
};

function fetchUser(id) {
  return {
    type: 'CALL_API',
    method: 'get',
    url: `/api/users/${id}`,
    successType: 'RECEIVE_USER_SUCCESS'
  }
};

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchUser: () => {
      dispatch((dispatch, getState) => {
        let id = +ownProps.params.id;
        let user = _find(getState().user.users, user => user.id === id);

        // Only fetch user if not already fetched
        if (user) {
          return;
        }

        dispatch(fetchUser(id));
      });
    },
    toggleEditUser: () => {
      dispatch({ type: 'TOGGLE_EDIT_USER' });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
