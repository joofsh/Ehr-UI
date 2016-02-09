import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { UserForm, ToggleButton } from 'src/components';
import stringUtil from 'src/utils/string';
import _forOwn from 'lodash/forOwn';
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
    updateUser: PropTypes.func.isRequired,
    toggleEditUser: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  componentWillMount() {
    this.props.fetchUser(+this.props.params.id);
  }

  updateUser = (user) => {
    let _user = Object.assign({}, user, { user_id: this.props.user.id });
    this.props.updateUser(_user);
  };

  render() {
    let { user, isEditing, toggleEditUser } = this.props;

    require('./User.scss');
    return (<div className="container-user container">
      <div className="row">
        <h1 className="col-xs-12">
          {user.name}
          <ToggleButton
            className="pull-right"
            onClick={toggleEditUser}
            isActive={isEditing}
            inactiveText="Edit"
            activeText="Cancel"
          />
        </h1>
        <UserForm
          customFields={FIELDS}
          initialValues={user}
          fields={FIELDS.map(field => field.name)}
          isEditing={isEditing}
          onSubmit={this.props.updateUser}
          groupClassName=""
        />
      </div>
    </div>);
  }
}

// TODO: Fix SSR of initial values into UserForm.
// See bug for more details:
// https://github.com/erikras/redux-form/issues/97
// https://github.com/erikras/redux-form/issues/621

function updateUserAction(user, userId) {
  return {
    type: 'CALL_API',
    url: `/api/users/${userId}`,
    method: 'put',
    data: user
  };
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
    },
    updateUser: (userId) => {
      return (user) => {

        return dispatch(updateUserAction({ user }, userId)).then(response => {
          dispatch({ type: 'RECEIVE_UPDATE_USER', response });
          return Promise.resolve();
        }, response => {
          let error = { _error: 'We were unable to update this user.' };

          _forOwn(response.body.errors, (field, key) => {
            error[key] = stringUtil.capitalize(field[0]);
          });
          return Promise.reject(error);
        });
      };
    }
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    updateUser: dispatchProps.updateUser(+ownProps.params.id)
  });
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(User);
