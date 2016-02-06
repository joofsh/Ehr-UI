import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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

function fetchUser(id) {
  return {
    type: 'CALL_API',
    method: 'get',
    url: `/api/users/${id}`,
    successType: 'RECEIVE_USER_SUCCESS'
  };
}

export class User extends Component {
  static fetchData({ store, params }) {
    return store.dispatch(fetchUser(+params.id));
  }

  static propTypes = {
    fetchUser: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    toggleEditUser: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  componentDidMount() {
    this.props.fetchUser(+this.props.params.id);
  }

  render() {
    let { user, isEditing, toggleEditUser } = this.props;

    require('./User.scss');
    return (<div className="container-user container">
      <div className="row">
        <h1>{user.name}</h1>
        <Button onClick={toggleEditUser} bsStyle="primary">
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        <UserForm
          customFields={FIELDS}
          initialValues={user}
          fields={FIELDS.map(field => field.name)}
          isEditing={isEditing}
          groupClassName="col-lg-6 col-md-12"
        />
      </div>
    </div>);
  }
}

function mapStateToProps(state, ownProps) {
  let id = +ownProps.params.id;
  let user = _find(state.user.users, u => u.id === id);
  return {
    isEditing: state.user.isEditing,
    user
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchUser: () => {
      dispatch((dispatch, getState) => {
        let id = +ownProps.params.id;
        let user = _find(getState().user.users, u => u.id === id);

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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
