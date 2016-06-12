import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class LoadingSpinner extends Component {
  static propTypes = {
    absolute: PropTypes.bool,
    large: PropTypes.bool,
    center: PropTypes.bool,
    className: PropTypes.string
  };

  render() {
    let { absolute, large, center, className } = this.props;
    let classes = classnames(
      ['fa',
        'fa-spinner',
        'fa-pulse',
        'LoadingSpinner',
        className
      ], {
        absolute,
        large,
        center
      });

    require('./LoadingSpinner.scss');
    return <i className={classes}/>;
  }
}
