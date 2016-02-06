import React, { Component, PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import { FormControls } from 'react-bootstrap';
import stringUtil from 'src/utils/string';


export default class FormGroup extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    placeholder: PropTypes.string,
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
    let { title, type, name, placeholder, error, isEditing } = this.props;
    let formGroup;

    require('./FormGroup.scss');
    title = title || stringUtil.titleize(name);

    if (isEditing) {
      formGroup = (
        <Input
          label={title}
          type={type || 'text'}
          id={name}
          placeholder={placeholder || `Enter ${title}`}
          children={this.inputChildren()}
          bsStyle={error ? 'error' : null}
          help={error}
          {...this.props}
        />
      );
    } else {
      formGroup = (
        <FormControls.Static
          label={title}
          labelClassName="col-xs-2"
          wrapperClassName="col-xs-10"
          {...this.props}
        />
      );
    }

    return formGroup;
  }
}
