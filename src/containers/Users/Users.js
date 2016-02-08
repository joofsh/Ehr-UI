import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { LoadingSpinner } from 'src/components';
import moment from 'moment';

global.moment = moment;

function fetchUsers() {
  return {
    type: 'CALL_API',
    method: 'get',
    url: '/api/users',
    successType: 'RECEIVE_USERS'
  };
}

const COLUMNS = [
  { name: 'id', title: 'ID' },
  { name: 'name', title: 'Name' },
  { name: 'username', title: 'Username' },
  { name: 'email', title: 'Email' },
];

export class Users extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchUsers());
  }

  static propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    refreshUsers: PropTypes.func.isRequired,
    lastUpdated: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    children: PropTypes.object
  };

  componentDidMount() {
    this.props.fetchUsers();
  }

  lastUpdated() {
    return moment(this.props.lastUpdated).fromNow();
  }

  renderNewUserLink() {
    // TODO: Figure out better way to know when to hide link
    // Disabled for now
    // return this.props.location.pathname !== '/users/new';
  }

  renderUsers() {
    return !this.props.children;
  }

  render() {
    require('./Users.scss');

    if (this.props.isFetching) {
      return <LoadingSpinner large absolute center/>;
    }

    return (<div className="container-users container">
      { this.renderNewUserLink() &&
        <Link to="/users/new" className="btn btn-primary">
          Add User
        </Link>}
      {this.renderUsers() && <div>
        <div className="pull-right refresh">
          <a href="#" onClick={this.props.refreshUsers}>
            <i className="fa fa-refresh"/>
          </a>
          Last Update: {this.lastUpdated()}
        </div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              {COLUMNS.map((column, i) => {
                return <th key={i}>{column.title}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {this.props.users.map(user => {
              return (<tr key={user.id}>
                {COLUMNS.map((column, i) => {
                  return (<td key={i}>
                    <Link to={`/users/${user.id}`}>
                      {user[column.name]}
                    </Link>
                  </td>);
                })}
              </tr>);
            })}
          </tbody>
        </Table>
      </div>}
      {this.props.children}
    </div>);
  }
}


function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: () => {
      dispatch((dispatch, getState) => {

        // Only fetch users if not already fetched
        if (getState().user.lastUpdated) {
          return;
        }

        dispatch({ type: 'REQUEST_USERS' });
        dispatch(fetchUsers());
      });
    },
    refreshUsers: () => {
      dispatch((dispatch) => {
        dispatch({ type: 'REQUEST_USERS' });
        dispatch(fetchUsers());
      });
    }
  };
}

function mapStateToProps(state) {
  return state.user;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
