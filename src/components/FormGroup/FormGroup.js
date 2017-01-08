import React, { Component, PropTypes } from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControlStatic from 'react-bootstrap/lib/FormControlStatic';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import string from 'src/utils/string';
import _isArray from 'lodash/isArray';

import { MultilineValue } from 'src/components';

export default class _FormGroup extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    initialValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array
    ]),
    isEditing: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    type: PropTypes.string,
    labelClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    defaultOption: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.node),
    error: PropTypes.string,
    inline: PropTypes.bool,
    className: PropTypes.string
  };

  getInputValue() {
    let { value, initialValue } = this.props;
    let _value;

    if (value === null || value === undefined) {
      _value = initialValue;
    } else {
      _value = value;
    }

    return _value;
  }

  getStaticValue() {
    let { value, initialValue, type } = this.props;
    let _value = value || initialValue;
    let content;

    if (type === 'url' && _value) {
      content = <a target="_blank" href={_value}>{_value}</a>;
    } else if (type === 'textarea' && _value) {
      content = <MultilineValue value={_value}/>;
    } else if (type === 'hashLink' && _value) {
      content = <a href={`#${_value}`}>{_value}</a>;
    } else if (_isArray(_value)) {
      content = <span>{_value.join(', ') || 'None'}</span>;
    } else {
      content = <span>{_value || 'None'}</span>;
    }
    return content;
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

  type() {
    let { type } = this.props;
    let val;

    if (type === 'hashLink' || type === undefined) {
      val = 'text';
    } else {
      val = type;
    }

    return val;
  }

  render() {
    let {
      name,
      placeholder,
      error,
      labelClassName,
      wrapperClassName,
      children,
    } = this.props;
    let content;

    if (this.isEditing()) {
      content = (
        <FormControl
          value={this.getInputValue()}
          label={this.label()}
          type={this.type()}
          id={name}
          placeholder={placeholder || `Enter ${this.label()}`}
          bsStyle={error ? 'error' : null}
          help={error}
          children={children}
          className={wrapperClassName || 'col-xs-9'}
        />);
    } else {
      content = (
        <FormControlStatic
          name={name}
          label={this.label()}
          labelClassName={labelClassName || 'col-xs-3'}
          wrapperClassName={wrapperClassName || 'col-xs-9'}
          value={this.getStaticValue()}
        />
      );
    }


    require('./FormGroup.scss');
    return (<FormGroup>
      <ControlLabel className={labelClassName || 'col-xs-3'}>
        {this.label()}
      </ControlLabel>
      <div className={wrapperClassName || 'col-xs-9'}>
        {content}
      </div>
    </FormGroup>);
  }
}
