import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

export class Home extends Component {
  render() {
    return <div className="container-home">
      <h1>Select a service:</h1>
      <Link to="/shelters">
        Shelters
      </Link>
    </div>;
  }
};

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
