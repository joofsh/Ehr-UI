import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { DataTable, LoadingSpinner } from 'src/components';
import moment from 'moment';
import Helmet from 'react-helmet';

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
  { key: 'id', title: 'ID' },
  { key: 'name', type: 'internalLink', linkBase: '/users/' },
  { key: 'username' },
  { key: 'email' }
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

  render() {
    let { isFetching, users } = this.props;

    require('./Users.scss');

    if (isFetching) {
      return <LoadingSpinner large absolute center/>;
    }

    return (<div className="container-users container">
      <Helmet title="Clients"/>
      { this.renderNewUserLink() &&
        <Link to="/users/new" className="btn btn-primary">
          Add User
        </Link>}
      <div className="col-xs-12">
        <div className="pull-right refresh">
          <a href="#" onClick={this.props.refreshUsers}>
            <i className="fa fa-refresh"/>
          </a>
          Last Update: {this.lastUpdated()}
        </div>
        <DataTable
          columns={COLUMNS}
          data={users}
        />
      </div>
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
