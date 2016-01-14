import React, { Component } from 'react';
import classnames from 'classnames';

export default class LoadingSpinner extends Component {
  render() {
    require('./LoadingSpinner.scss');
    var classes = classnames(
      ['fa',
        'fa-spinner',
        'fa-pulse',
        'LoadingSpinner'
      ], {
      absolute: this.props.absolute,
      large: this.props.large,
      center: this.props.center
    });

    return <i className={classes}/>;
  }
}
