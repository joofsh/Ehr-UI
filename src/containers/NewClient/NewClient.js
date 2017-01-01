import React, { Component, PropTypes } from 'react';
import { UserForm } from 'src/components';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';
import string from 'src/utils/string';
import _forOwn from 'lodash/forOwn';
import Helmet from 'react-helmet';
<Helmet title=""/>

export class NewClient extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { onSubmit } = this.props;

    return (<div className="newClient-container container">
      <Helmet title="New Client"/>
      <div className="row">
        <UserForm
          formTitle="Create Client Profile"
          isEditing
          onSubmit={onSubmit}
        />
      </div>
    </div>);
  }
}

function submitClientAction(client) {
  return {
    type: 'CALL_API',
    url: '/api/users',
    method: 'post',
    data: client
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (userId) => {
      return (client) => {
        let _client = Object.assign({}, client, {
          role: 'client',
          advocate_id: userId
        });

        let data = {
          user: _client
        };

        return dispatch(submitClientAction(data)).then(user => {
          dispatch({ type: 'RECEIVE_ADD_USER', user });
          dispatch(pushPath(`/users/${user.id}`));
          return Promise.resolve();
        }, response => {
          let error = { _error: 'We were unable to create this client.' };

          _forOwn(response.body.errors, (field, key) => {
            error[key] = string.capitalize(field[0]);
          });
          return Promise.reject(error);
        });
      };
    }
  };
}

function mapStateToProps(state) {
  return {
    currentUserId: state.session.user.id
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    onSubmit: dispatchProps.onSubmit(stateProps.currentUserId)
  });
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(NewClient);
