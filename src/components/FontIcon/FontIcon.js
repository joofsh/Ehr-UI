import React, { Component, PropTypes } from 'react';

export default class FontIcon extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string
  };

  static defaultProps = {
    className: '',
    style: {},
    title: ''
  }

  render() {
    return (<i
      className={`fa fa-${this.props.type} ${this.props.className}`}
      style={this.props.style}
      title={this.props.title}
    />);
  }
}
