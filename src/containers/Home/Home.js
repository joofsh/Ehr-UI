import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

export class Home extends Component {
  render() {
    require('./Home.scss');
    return (<div className="container-home container-fluid">
      <div className="banner-image">
        <div className="banner-titleWrapper">
          <h2 className="banner-title">A Simpler Way To Find Help</h2>
        </div>
      </div>
      <h3 className="subtitle">Find The Right Resources For You</h3>
      <div className="call-to-action">
        <Link to="/resources" className="btn btn-primary btn-lg">
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
