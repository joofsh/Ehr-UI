import React, { Component, PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import { FormControls } from 'react-bootstrap';
import string from 'src/utils/string';

export default class FormGroup extends Component {
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
    type: PropTypes.string,
    labelClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    defaultOption: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.node),
    error: PropTypes.string
  };

  getStaticValue() {
    let { value, initialValue, type } = this.props;
    let _value = value || initialValue;
    let content;

    if (type === 'url' && _value) {
      content = <a target="_blank" href={_value}>{_value}</a>;
    } else if (type == 'tags' && _value) {
    } else {
      content = <span>{_value || 'None'}</span>;
    }
    return content;
  }

  label() {
    let { title, name } = this.props;

    return title || string.titleize(name);
  }

  isEditing() {
    let { isEditing } = this.props;

    return isEditing === undefined ? true : isEditing;
  }

  render() {
    let {
      type,
      name,
      value,
      initialValue,
      placeholder,
      error,
      labelClassName,
      wrapperClassName,
      children
    } = this.props;
    let formGroup;

    if (this.isEditing()) {
      formGroup = (
        <Input
          {...this.props}
          label={this.label()}
          type={type || 'text'}
          id={name}
          placeholder={placeholder || `Enter ${this.label()}`}
          bsStyle={error ? 'error' : null}
          help={error}
          children={children}
          labelClassName={labelClassName || 'col-xs-3'}
          wrapperClassName={wrapperClassName || 'col-xs-9'}
        />);
    } else {
      formGroup = (
        <FormControls.Static
          name={name}
          label={this.label()}
          labelClassName="col-xs-3"
          wrapperClassName="col-xs-9"
          value={this.getStaticValue()}
        />
      );
    }

    require('./FormGroup.scss');
    return formGroup;
  }
}
