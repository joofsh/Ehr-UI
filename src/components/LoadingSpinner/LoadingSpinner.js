import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class LoadingSpinner extends Component {
  static propTypes = {
    absolute: PropTypes.bool,
    large: PropTypes.bool,
    center: PropTypes.bool
  };

  render() {
    let { absolute, large, center } = this.props;
    let classes = classnames(
      ['fa',
        'fa-spinner',
        'fa-pulse',
        'LoadingSpinner'
      ], {
        absolute,
        large,
        center
      });

    require('./LoadingSpinner.scss');
    return <i className={classes}/>;
  }
}
