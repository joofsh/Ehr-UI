import React, { Component } from 'react';
import { connect } from 'react-redux';
import stringUtil from 'utils/string';

const ATTRIBUTES = [
  'first_name',
  'last_name',
  'email',
  'role'
];

export class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  setUser() {
    var { users, params } = this.props;
    if (users.length) {
      const id = +params.id;
      const user = users.filter(user => user.id === id)[0];
      this.setState({ user });
    }
  }

  componentWillMount() {
    this.setUser();
  }
  componentDidUpdate(prevProps) {
    const prevId = prevProps.params.id;
    const newId = this.props.params.id;

    if (prevId !== newId || !prevProps.users.length) {
      this.setUser();
    }
  }

  render() {
    var { user } = this.state;

    require('./User.scss');
    return <div className="container-user container">
      <h1>{this.state.user.name}</h1>
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

function mapStateToProps(state) {
  return {
    users: state.user.users
  };
};

export default connect(
  mapStateToProps
)(User);
