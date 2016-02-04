import React, { Component } from 'react';
import { connect } from 'react-redux';
import stringUtil from 'src/utils/string';
import _find from 'lodash/find';

const ATTRIBUTES = [
  'first_name',
  'last_name',
  'email',
  'role'
];

export class User extends Component {
  static fetchData({ store, params }) {
    return store.dispatch(fetchUser(+params.id));
  }

  componentDidMount() {
    this.props.fetchUser(+this.props.params.id);
  }

  render() {
    var { user } = this.props;

    require('./User.scss');
    return <div className="container-user container">
      <h1>{user.name}</h1>
      <dl className="row">
        {ATTRIBUTES.map((attr, key) => {
          return <div key={key}>
            <dt className="col-sm-2">{stringUtil.titleize(attr)}</dt>
            <dd className="col-sm-10">{user[attr]}</dd>
          </div>
        })}
      </dl>
    </div>
  }
};

function mapStateToProps(state, ownProps) {
  let id = +ownProps.params.id;
  let user = _find(state.user.users, user => user.id === id);
  return {
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
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
