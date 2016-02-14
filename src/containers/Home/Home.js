import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { FontIcon } from 'src/components';

export class Home extends Component {
  render() {
    require('./Home.scss');
    return (<div className="container-home container">
      <div className="row">
        <Link to="/clients/new" className="col-lg-3 col-md-4 col-sm-6 col-xs-12 toolkit">
          <FontIcon type="user"/>
          Create new Client Profile
        </Link>
        <Link to="/resources" className="col-lg-3 col-md-4 col-sm-6 col-xs-12 toolkit">
          <FontIcon type="folder-open"/>
          View Resources
        </Link>
      </div>
    </div>);
  }
}

function mapDispatchToProps() {
  return {};
}

function mapStateToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
