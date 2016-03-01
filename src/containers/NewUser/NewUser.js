import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import apiUtil from 'src/utils/api';
import { UserForm } from 'src/components';
import { pushPath } from 'redux-simple-router';

export class NewUser extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    const {
      handleSubmit,
    } = this.props;

    return (<div className="container-newUser container">
      <h2>Create a New User:</h2>
      <div className="row">
        <UserForm
          formTitle='New User'
          isEditing={true}
          onSubmit={handleSubmit}
          tagSearchResults={[]}
        />
      </div>
    </div>);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (user) => {
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
