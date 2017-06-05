import React, { Component, PropTypes } from 'react';
import { FontIcon } from 'src/components';
import _some from 'lodash/some';
import _find from 'lodash/find';

const TAG_ICON_MAPPING = {
  Emergency: {
    icon: 'exclamation-triangle',
    color: '#f56151'
  },
  Housing: {
    icon: 'home',
    color: '#ffbf00'
  },
  'Substance Abuse': {
    icon: 'medkit',
    color: '#f56151'
  },
  'Food Related': {
    icon: 'cutlery',
    color: '#3789cf'
  },
  ID: {
    icon: 'id-card',
    color: '#9f5eb4'
  },
  Transportation: {
    icon: 'bus',
    color: '#5cb85c'
  },
  'Social Security': {
    icon: 'building',
    color: '#ffbf00'
  },
  Therapy: {
    icon: 'life-ring',
    color: '#ffbf00'
  },
  Female: {
    icon: 'female',
    color: '#3789cf'
  },
  Education: {
    icon: 'book',
    color: '#3789cf'
  },
  'Returning Citizens': {
    icon: 'gavel',
    color: '#9f5eb4'
  },
  'Computer Literacy': {
    icon: 'laptop',
    color: '#9f5eb4'
  },
  Vocational: {
    icon: 'briefcase',
    color: '#ffbf00'
  },
  Children: {
    icon: 'child',
    color: '#4cae4c'
  },
  Male: {
    icon: 'male',
    color: '#ffbf00'
  },
  Family: {
    icon: 'users',
    color: '#3789cf'
  },
  'Faith-Based': {
    icon: 'sun-o',
    color: '#ffbf00'
  }
};

export default class TagIcons extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired
  };

  static defaultProps = {
    tags: []
  };

  tagsWithIcons() {
    return this.props.tags.map(tag => (
      // map tags to their icon info
      Object.assign({}, this.tagInfo(tag), { name: tag.name })
    )).reduce((icons, tag) => {
      if (tag.icon && !_some(icons, { icon: tag.icon })) {
        icons.push(tag);
      }
      return icons;
    }, []);
  }

  tagInfo(tag) {
    return _find(TAG_ICON_MAPPING, (iconInfo, key) => {
      return tag.name.match(key)
    });
  }

  render() {
    require('./TagIcons.scss');
    return (<div className="TagIcons">
      {this.tagsWithIcons().map(tag => {
        return (<FontIcon
          type={tag.icon}
          title={tag.name}
          style={{ color: tag.color }}
          className="large"
        />)
      })}
    </div>);
  }
}
