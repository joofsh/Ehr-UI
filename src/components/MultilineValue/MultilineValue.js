import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class MultilineValue extends Component {
  static propTypes = {
    value: PropTypes.string,

    // A number that determines after how many new lines we truncate the content
    // trunate=1 means we only show 1 line
    truncate: PropTypes.number,

    // If we do truncate, then show a "See More" link. This prop is the string url
    // to more details
    seeMoreLink: PropTypes.string,
  };

  render() {
    let { value, seeMoreLink, truncate } = this.props;
    let _value = (value || '').split('\n').filter((v) => v.length);
    let isTruncating = truncate && _value.length > truncate;

    if (isTruncating) {
      _value = _value.slice(0, truncate);
    }

    require('./MultilineValue.scss');
    return (<span className="MultilineValue">
      {_value.map((val, i) => (
        <span key={i}>{val}<br/></span>
      ))}
      {isTruncating && <div className="seeMoreLink-wrapper">
        <Link to={seeMoreLink}>See More</Link>
      </div>}
    </span>);
  }
}
