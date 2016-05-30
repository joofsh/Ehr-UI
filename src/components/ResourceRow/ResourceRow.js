import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceRow extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    tags: PropTypes.array
  };

  render() {
    let { id, title, tags } = this.props;
    return (<Link className="list-group-item" to={`/resources/${id}`}>
      <h4>{title}</h4>
      <div>{tags.map((tag, i) => (
        <span key={i} className="tokenized-tag">{tag.name}</span>
      ))}</div>
    </Link>);
  }
}
