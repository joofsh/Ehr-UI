import React, { Component, PropTypes } from 'react';

export default class MultilineValue extends Component {
  static propTypes = {
    value: PropTypes.string
  };

  render() {
    let { value } = this.props;

    return (<span>
      {(value || '').split('\n').map((val, i) => (
        <span key={i}>{val}<br/></span>
      ))}
    </span>);
  }
}
