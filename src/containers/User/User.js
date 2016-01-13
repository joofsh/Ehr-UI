import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    if (!user) { return; }
    return <div>
      <h1>{this.state.user.name}</h1>
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
