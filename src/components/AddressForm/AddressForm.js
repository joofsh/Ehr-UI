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
      <FormGroup {...street} title="Street" isEditing={isEditing}/>
      <FormGroup {...city} title="City" isEditing={isEditing}/>
      <FormGroup {...state} title="State" isEditing={isEditing}/>
      <FormGroup {...zipcode} title="Zipcode" isEditing={isEditing}/>
    </div>);
  }
}
