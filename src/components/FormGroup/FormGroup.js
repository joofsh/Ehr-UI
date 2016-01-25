import React, { Component } from 'react';
import { Input } from 'react-bootstrap';
import stringUtil from 'utils/string';

export default class FormGroup extends Component {
  inputChildren() {
    if (this.props.type === 'select') {
      let children = [];
      let { defaultOption, options } = this.props;

      if (defaultOption) {
        children.push(<option key={0} value=''disabled>{defaultOption}</option>);
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
    return <div className='form-group'>
      <label htmlFor={this.props.name}>
        {this.props.title}
        <Input
          type={this.props.type || 'text'}
          id={this.props.name}
          placeholder={this.props.placeholder || `Enter ${this.props.title}`}
          {...this.props}
          children={this.inputChildren()}/>
      </label>
    </div>
  }
};

