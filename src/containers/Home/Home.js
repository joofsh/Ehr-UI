import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

export class Home extends Component {
  render() {
    require('./Home.scss')
    return <div className="container-home container">
      <div className="row">
        <Link to="/clients/new" className="col-lg-3 col-md-4 col-sm-6 col-xs-12 toolkit">
          <i className="fa fa-user"/>
          Create new Client Profile
        </Link>
      </div>
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
