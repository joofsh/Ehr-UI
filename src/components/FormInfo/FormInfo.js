import React, { Component, PropTypes } from 'react';

export default class FormInfo extends Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    labelClassName: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    valueClassName: PropTypes.string.isRequired,
    value: PropTypes.node
  }

  static defaultProps = {
    type: 'string',
    labelClassName: 'col-xs-3',
    valueClassName: 'col-xs-9'
  }

  getValue() {
    let { type, value } = this.props;
    let content;

    if (value) {
      if (type === 'url') {
        content = <a target="_blank" href={value}>{value}</a>;
      } else {
        content = value;
      }
    }
    return content;
  }

  render() {
    let {
      className,
      label,
      labelClassName,
      valueClassName
    } = this.props;

    return (<div className={`form-group ${className}`}>
      <label className={`control-label ${labelClassName}`}>{label}</label>
      <span className={`form-control-static ${valueClassName}`}>{this.getValue() || 'None'}</span>
    </div>);
  }
}
