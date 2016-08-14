import React, { Component, PropTypes } from 'react';
import string from 'src/utils/string';
import { Tokenizer } from 'react-typeahead';
import _remove from 'lodash/remove';

export default class FormGroupTag extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
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
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
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
    let { label, name } = this.props;
    let val;

    // Return label, even if null or false
    // A null label effectively disables it
    if (label !== undefined) {
      val = label;
    } else {
      val = string.titleize(name);
    }

    return val;
  }

  isEditing() {
    let { isEditing } = this.props;

    return isEditing === undefined ? true : isEditing;
  }

  onTokenAdd(newValue) {
    let _value = this.getInputValue();
    this.props.onChange(_value.concat(newValue));
  }

  getInputValue() {
    let { value, initialValue } = this.props;

    return value || initialValue || [];
  }

  onTokenRemove(removedValue) {
    let { onChange, value } = this.props;
    _remove(value, v => v === removedValue);
    onChange(value);
  }

  displayOption(option) {
    return option.name;
  }
  filterOption(inputValue, option) {
    return option.name.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
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
    let _values = value || initialValue || [];

    if (this.isEditing()) {
      content = (
        <div>
          <Tokenizer
            options={searchResults}
            onTokenAdd={this.onTokenAdd}
            onTokenRemove={this.onTokenRemove}
            values={this.getInputValue()}
            defaultSelected={_values}
            placeholder="Add a Tag"
            displayOption={this.displayOption}
            filterOption={this.filterOption}
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
      if (_values.length) {
        content = (
          <p className="form-control-static">
            {_values.map((_value, i) => (
              <span className="tokenized-tag" key={i}>{_value.name}</span>
              ))}
          </p>);
      } else {
        content = (
          <p className="form-control-static empty">
            <span>None</span>
          </p>
        );
      }
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
