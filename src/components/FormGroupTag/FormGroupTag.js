import React, { Component, PropTypes } from 'react';
import string from 'src/utils/string';
import TagsInput from 'react-tagsinput';
import { Tokenizer } from 'react-typeahead';
import _remove from 'lodash/remove';

export default class FormGroupTag extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    initialValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    isEditing: PropTypes.bool,
    title: PropTypes.string,
    labelClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    defaultOption: PropTypes.string,
    searchResults: PropTypes.array,
    error: PropTypes.string
  };
  constructor() {
    super();
    this.onTokenAdd = this.onTokenAdd.bind(this);
    this.onTokenRemove = this.onTokenRemove.bind(this);
  }

  label() {
    let { title, name } = this.props;

    return title || string.titleize(name);
  }

  isEditing() {
    let { isEditing } = this.props;

    return isEditing === undefined ? true : isEditing;
  }

  onTokenAdd(newValue) {
    let { onChange, value } = this.props;
    onChange(value.concat(newValue));
  }

  onTokenRemove(removedValue) {
    let { onChange, value } = this.props;
    _remove(value, v => v === removedValue);
    onChange(value);
  }

  render() {
    let {
      value,
      initialValue,
      placeholder,
      labelClassName,
      wrapperClassName,
      searchResults,
      onChange,
      ...rest
    } = this.props;
    let content;
    let _values = value || initialValue;

    if (this.isEditing()) {
      content = (
        <div>
        <Tokenizer
          options={searchResults}
          onTokenAdd={this.onTokenAdd}
          onTokenRemove={this.onTokenRemove}
          values={this.props.value}
          defaultSelected={_values}
          placeholder='Add a Tag'
          inputProps={{
            ...rest,
            autoComplete: 'off',
          }}
          customClasses={{
            input: 'form-control',
            results: 'typeahead-list',
            listItem: 'typeahead-listItem',
            hover: 'typeahead-listItem--hover'
          }}
        />
        </div>);
    } else {
      content = (
        <p className="form-control-static">
          {_values.length ? _values.map((_value, i) => (
            <span className="tokenized-tag" key={i}>{_value}</span>
          )) : <span>None</span>}
        </p>);
    }

    require('./FormGroupTag.scss');
    return (
      <div className="form-group formGroupTag">
        <label htmlFor={this.label()} className={`control-label ${labelClassName || 'col-xs-3'}`}>
          <span>{this.label()}</span>
        </label>
        <div className={wrapperClassName || 'col-xs-9'}>
          {content}
        </div>
      </div>);
  }
}
