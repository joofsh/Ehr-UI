import React, { Component, PropTypes } from 'react';
import { FontIcon } from 'src/components';
import { connect } from 'react-redux';

export class SearchBar extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    updateSearchValue: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.updateSearchValue(event.target.value);
  }

  render() {
    let { name, value, placeholder } = this.props;

    require('./SearchBar.scss');
    return (<div className="searchBar">
      <FontIcon type="search"/>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder || ''}
        className="form-control"
        onChange={this.handleChange}
      />
    </div>);
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    updateSearchValue: (value) => {
      dispatch({
        type: 'UPDATE_SEARCH_VALUE',
        payload: {
          name: ownProps.name,
          value
        }
      });
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(SearchBar);
