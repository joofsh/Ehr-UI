import React, { Component } from 'react';
import { Input } from 'react-bootstrap';
import stringUtil from 'src/utils/string';

export default class FormGroup extends Component {
  inputChildren() {
    if (this.props.type === 'select') {
      let children = [];
      let { defaultOption, options } = this.props;

      if (defaultOption) {
        children.push(<option key={0} value='' disabled>{defaultOption}</option>);
      }

      options.map((option, key) => {
        children.push(<option value={option} key={key + 1}>{stringUtil.capitalize(option)}</option>);
      })
      return children;
    } else {
      return;
    }
  }
  render() {
    let { title, type, name, placeholder, error, formGroupClasses } = this.props;
    require('./FormGroup.scss');
    title = title || stringUtil.titleize(name);
    return (
        <Input
          wrapperClassName='input-with-help'
          label={title}
          type={type || 'text'}
          id={name}
          placeholder={placeholder || `Enter ${title}`}
          children={this.inputChildren()}
          bsStyle={error ? 'error' : null}
          help={error}
          {...this.props}/>
    );
  }
};

