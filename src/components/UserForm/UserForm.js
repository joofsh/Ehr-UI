import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { AddressForm, FormGroup, LoadingSpinner } from 'src/components';

export class UserForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    submitting: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    formTitle: PropTypes.string,
    className: PropTypes.string,
    error: PropTypes.string
  };

  render() {
    let {
      fields: {
        first_name,
        last_name,
        gender,
        race,
        birthdate,
        language,
        mailing_address,
        home_address
      },
      formTitle,
      handleSubmit,
      submitting,
      isEditing,
      className,
      error
    } = this.props;

    require('./UserForm.scss');
    return (<form onSubmit={handleSubmit} noValidate className={`${className} form-horizontal`}>
      <div className="row">
        <fieldset className="col-xs-12 col-md-8 col-md-offset-2">
          <legend>{formTitle}</legend>
          <div className="col-md-9 col-offset-3">
            <FormGroup {...first_name} isEditing={isEditing}/>
            <FormGroup {...last_name} isEditing={isEditing}/>
            <FormGroup
              {...gender}
              isEditing={isEditing}
              type="select"
              defaultValue=""
            >
              <option disabled value="">Select Gender Identity</option>
              <option value="male">I Identify as Male</option>
              <option value="female">I Identify as Female</option>
              <option value="other">Other</option>
            </FormGroup>
            <FormGroup
              {...race}
              isEditing={isEditing}
              type="select"
              defaultValue=""
            >
              <option disabled value="">Select Race</option>
              <option value="Caucasion">Caucasion</option>
              <option value="Black">Black</option>
              <option value="Asian">Asian</option>
              <option value="other">Other</option>
            </FormGroup>
            <FormGroup {...birthdate} title="Birthday" isEditing={isEditing} type="date"/>
            <FormGroup {...language} isEditing={isEditing}/>
          </div>
        </fieldset>
      </div>
      <div className="row">
        <fieldset className="col-xs-12 col-md-6">
          <legend>Mailing Address</legend>
          <AddressForm {...mailing_address} isEditing={isEditing}/>
        </fieldset>
        <fieldset className="col-xs-12 col-md-6">
          <legend>Home Address</legend>
          <AddressForm {...home_address} isEditing={isEditing}/>
        </fieldset>
      </div>

      <div className="form-group col-xs-12">
        { error && <p className="text-danger error">{error}</p>}
        {isEditing && <button className="btn btn-success btn-lg pull-right"
          type="submit" disabled={submitting}
        >
          {submitting ? <LoadingSpinner/> : <i className="fa fa-paper-plane"/> } Submit
        </button>}
      </div>
    </form>);
  }
}

export default reduxForm({
  form: 'userForm',
  fields: [
    'first_name',
    'last_name',
    'gender',
    'race',
    'birthdate',
    'language',

    'mailing_address.street',
    'mailing_address.city',
    'mailing_address.state',
    'mailing_address.zipcode',

    'home_address.street',
    'home_address.city',
    'home_address.state',
    'home_address.zipcode'
  ]
})(UserForm);
