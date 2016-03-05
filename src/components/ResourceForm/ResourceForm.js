import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { AddressForm, FormGroup, LoadingSpinner, FormGroupTag } from 'src/components';

export default class ResourceForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    submitting: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    tagSearchResults: PropTypes.array.isRequired,
    className: PropTypes.string,
    formTitle: PropTypes.string,
    error: PropTypes.string
  };

  render() {
    let {
      fields: {
        title,
        operating_hours,
        phone,
        url,
        tags,
        address
      },
      formTitle,
      handleSubmit,
      submitting,
      isEditing,
      className,
      tagSearchResults,
      error
    } = this.props;

    require('./ResourceForm.scss');
    return (<form onSubmit={handleSubmit} className={`${className} form-horizontal`}>
      <div className="row">
        <fieldset className="col-xs-12 col-md-8 col-md-offset-2">
          <legend>{formTitle}</legend>
          <div className="col-md-9 col-offset-3">
            <FormGroup {...title} isEditing={isEditing}/>
            <FormGroup {...operating_hours} isEditing={isEditing}/>
            <FormGroup {...phone} isEditing={isEditing} type="phone"/>
            <FormGroup {...url} title="Website" isEditing={isEditing} type="url"/>
            <FormGroupTag
              {...tags}
              title="Tags"
              isEditing={isEditing}
              searchResults={tagSearchResults}
            />
          </div>
        </fieldset>
      </div>
      <div className="row">
        <fieldset className="col-xs-12 col-md-8 col-md-offset-2">
          <legend>Address</legend>
          <div className="col-md-9 col-offset-3">
            <AddressForm {...address} isEditing={isEditing}/>
          </div>
        </fieldset>
      </div>

      <div className="form-group col-xs-12">
        { error && <p className="text-danger pull-right error">{error}</p>}
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
  form: 'resourceForm',
  fields: [
    'title',
    'operating_hours',
    'phone',
    'url',
    'tags',

    'address.street',
    'address.city',
    'address.state',
    'address.zipcode',

  ]
})(ResourceForm);
