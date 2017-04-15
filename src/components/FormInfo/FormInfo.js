import React, { Component, PropTypes } from 'react';
import _isString from 'lodash/isString';

import { MultilineValue } from 'src/components';

export default class FormInfo extends Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    labelClassName: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,

    // A number that determines after how many new lines we truncate the content
    // trunate=1 means we only show 1 line
    truncate: PropTypes.number,

    // If we do truncate, then show a "See More" link. This prop is the string url
    // to more details
    seeMoreLink: PropTypes.string,

    valueClassName: PropTypes.string.isRequired,
    value: PropTypes.node
  }

  static defaultProps = {
    type: 'string',
    labelClassName: 'col-xs-3',
    valueClassName: 'col-xs-9'
  }

  getValue() {
    let { type, value, seeMoreLink, truncate } = this.props;
    let content;

    if (value) {
      if (type === 'url') {
        content = <a target="_blank" href={value}>{value}</a>;
      } else if (_isString(value)) {
        content =
          (<MultilineValue
            value={value}
            truncate={truncate}
            seeMoreLink={seeMoreLink}
          />);
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
