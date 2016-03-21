import React, { Component, PropTypes } from 'react';

export default class MaxHeightContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  render() {
    let { className, children } = this.props;

    require('./MaxHeightContainer.scss');
    return (<div className={`max-height-container ${className}`}>
      {children}
    </div>);
  }
}
