import React, { Component } from 'react';
import { Input } from 'react-bootstrap';

export default class FormGroup extends Component {
  render() {
    return <div className='form-group'>
      <label htmlFor={this.props.name}>
        {this.props.title}
      </label>
      <Input
        type={this.props.type || 'text'}
        id={this.props.name}
        placeholder={this.props.placeholder || `Enter ${this.props.title}`}
        {...this.props}
        children={null}
      />
    </div>
  }
};

