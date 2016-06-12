import React, { Component, PropTypes } from 'react';

export default class FontIcon extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  render() {
    return <i className={`fa fa-${this.props.type} ${this.props.className}`} />;
  }
}
