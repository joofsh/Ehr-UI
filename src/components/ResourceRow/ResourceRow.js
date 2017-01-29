import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { MultilineValue } from 'src/components';

export default class ResourceRow extends Component {
  static propTypes = {
    displayTags: PropTypes.bool.isRequired,
    description: PropTypes.string,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    tags: PropTypes.array
  };

  render() {
    let {
      description,
      displayTags,
      id,
      tags,
      title
    } = this.props;

    require('./ResourceRow.scss');
    return (<Link className="list-group-item" to={`/resources/${id}`}>
      <h4>{title}</h4>
      <MultilineValue value={description}/>

      {displayTags && <div className="tag-group">{tags.map((tag, i) => (
        <span key={i} className="tokenized-tag">{tag.name}</span>
      ))}</div>}
    </Link>);
  }
}
