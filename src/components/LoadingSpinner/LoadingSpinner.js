import React, { Component } from 'react';

export default class LoadingSpinner extends Component {
  render() {
    require('./LoadingSpinner.scss');
    return <i className='fa fa-spinner fa-pulse LoadingSpinner'/>;
  }
}
