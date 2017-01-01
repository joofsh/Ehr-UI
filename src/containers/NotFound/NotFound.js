import React, { Component } from 'react';
import Helmet from 'react-helmet';

export class NotFound extends Component {
  render() {
    return (<div className="container-notFound container">
      <Helmet title="Not Found"/>
      <h1>Not Found</h1>
    </div>);
  }
}

export default NotFound;
