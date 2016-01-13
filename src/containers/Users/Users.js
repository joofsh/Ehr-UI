import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import apiUtil from '../../utils/api';
import { LoadingSpinner } from '../../components';

const COLUMNS = [
  {key: 1, name: 'id', title: 'ID' },
  {key: 2, name: 'name', title: 'Name' },
  {key: 3, name: 'username', title: 'Username' },
  {key: 4, name: 'email', title: 'Email' },
];

export class Users extends Component {
  componentWillMount() {
    this.props.onLoad();
  }

  render() {
    if (this.props.isFetching) {
      return <LoadingSpinner/>;
    }

    return <div className="container-users">
      <Link to="/users/new" className="btn btn-primary">
        Add User
      </Link>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            {COLUMNS.map(column => {
              return <th key={column.key}>{column.title}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {this.props.users.map(user => {
            return <tr key={user.key}>
              {COLUMNS.map(column => {
                return <td key={column.key}>
                  <Link to={`/users/${user.id}`}>
                    {user[column.name]}
                  </Link>
                </td>
              })}
            </tr>
          })}
        </tbody>
      </Table>
      {this.props.children}
    </div>
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onLoad: () => {
      dispatch((dispatch, getState) => {

        // Only fetch users if not already fetched
        if (getState().user.lastUpdated) {
          return;
        }

        dispatch({ type: 'REQUEST_USERS' });
        return apiUtil.get('/api/users')
          .then(resp => {
            dispatch({ type: 'RECEIVE_USERS', users: resp.users });
          });
      });
    }
  };
}

function mapStateToProps(state) {
  window.store = state;
  return state.user;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users)
