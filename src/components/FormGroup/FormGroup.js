import React, { Component, PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import { FormControls } from 'react-bootstrap';
import stringUtil from 'src/utils/string';


export default class FormGroup extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    initialValue: PropTypes.string,
    value: PropTypes.string,
    isEditing: PropTypes.bool,
    title: PropTypes.string,
    type: PropTypes.string,
    defaultOption: PropTypes.string,
    options: PropTypes.array,
    error: PropTypes.string
  };

  inputChildren() {
    let children;
    if (this.props.type === 'select') {
      children = [];
      let { defaultOption, options } = this.props;

      if (defaultOption) {
        children.push(<option key={0} value="" disabled>{defaultOption}</option>);
      }

      options.map((option, key) => {
        children.push(
          <option value={option} key={key + 1}>{stringUtil.capitalize(option)}</option>
        );
      });
    }

    return children;
  }
  render() {
    let { title, type, name, placeholder, error, isEditing, initialValue, value } = this.props;
    let formGroup;

    if (name === 'first_name') {
      console.log(this.props);
    }
    require('./FormGroup.scss');
    let label = title || stringUtil.titleize(name);

    let _isEditing = isEditing === undefined ? true : isEditing;

    if (_isEditing) {
      formGroup = (
        <Input
          {...this.props}
          label={label}
          type={type || 'text'}
          id={name}
          placeholder={placeholder || `Enter ${label}`}
          children={this.inputChildren()}
          bsStyle={error ? 'error' : null}
          help={error}
        />
      );
    } else {
      formGroup = (
        <FormControls.Static
          name={name}
          label={label}
          labelClassName="col-xs-2"
          wrapperClassName="col-xs-10"
          value={value || initialValue || 'None'}
        />
      );
    }

    return formGroup;
  }
}
