import React, { Component, PropTypes } from 'react';
import { FormGroup } from 'src/components';

export default class AddressForm extends Component {
  static propTypes = {
    street: PropTypes.object.isRequired,
    city: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    zipcode: PropTypes.object.isRequired,
    isEditing: PropTypes.bool
  };

  render() {
    let { street, city, state, zipcode, isEditing } = this.props;

    require('./AddressForm.scss');
    return (<div>
      <FormGroup {...street} label="Street" isEditing={isEditing}/>
      <FormGroup {...city} label="City" isEditing={isEditing}/>
      <FormGroup {...state} label="State" isEditing={isEditing}/>
      <FormGroup {...zipcode} label="Zipcode" isEditing={isEditing}/>
    </div>);
  }
}
