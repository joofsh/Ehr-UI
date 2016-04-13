import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import {
  AddressForm,
  FormGroup,
  LoadingButton,
  FormGroupTag
} from 'src/components';

export default class ResourceForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    submitting: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isTogglingPublishState: PropTypes.bool,
    handleTogglePublishState: PropTypes.func,
    tagSearchResults: PropTypes.array.isRequired,
    authedStaff: PropTypes.bool,
    published: PropTypes.bool,
    className: PropTypes.string,
    fieldSetClassName: PropTypes.string,
    formTitle: PropTypes.string,
    error: PropTypes.string
  };

  constructor() {
    super();
    this.handleTogglePublishState = this.handleTogglePublishState.bind(this);
  }

  withPublishInfo() {
    // Show publishing information if the user is an authed staff
    // and we have access to publishing information
    return this.props.published !== undefined && !!this.props.authedStaff;
  }

  handleTogglePublishState() {
    this.props.handleTogglePublishState(!this.props.published);
  }

  publishState() {
    return this.props.published ? 'Published' : 'Unpublished';
  }
  render() {
    let {
      fields: {
        title,
        description,
        category,
        email,
        phone,
        url,
        operating_hours,
        tags,
        address
      },
      published,
      isTogglingPublishState,
      formTitle,
      handleSubmit,
      submitting,
      isEditing,
      className,
      fieldSetClassName,
      tagSearchResults,
      error
    } = this.props;

    require('./ResourceForm.scss');
    return (
      <form
        onSubmit={handleSubmit}
        className={`${className || ''} form-horizontal resourceForm`}
      >
        <div className="row">
          <fieldset className={fieldSetClassName}>
            <legend>
              <h2>
                {formTitle}
                {this.withPublishInfo() &&
                  <small className="publishState">[{this.publishState()}]</small>}
              </h2>
            </legend>
            <div className="col-md-9 col-offset-3">
              <FormGroup {...title} isEditing={isEditing}/>
              <FormGroup {...description} isEditing={isEditing} textArea/>
              <FormGroup
                {...category}
                isEditing={isEditing}
                type="select"
                defaultValue=""
              >
                <option disabled value="">Select A Category</option>
                <option value="housing">Housing</option>
                <option value="medical">Medical</option>
                <option value="mental-health">Mental Health</option>
                <option value="education">Education</option>
                <option value="employment">Employment</option>
                <option value="legal">Legal</option>
              </FormGroup>
              <FormGroup {...operating_hours} isEditing={isEditing}/>
              <FormGroup {...phone} isEditing={isEditing} type="phone"/>
              <FormGroup {...email} isEditing={isEditing} type="email"/>
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
          <fieldset className={fieldSetClassName}>
            <legend>Address</legend>
            <div className="col-md-9 col-offset-3">
              <AddressForm {...address} isEditing={isEditing}/>
            </div>
          </fieldset>
        </div>

        <div className="form-group col-xs-12">
          { error && <p className="text-danger pull-right error">{error}</p>}
          {isEditing ?
            <LoadingButton
              type="submit"
              text="Submit"
              icon="paper-plane"
              isLoading={submitting}
              disabled={submitting}
              className="btn-success btn-lg pull-right"
            /> : (this.withPublishInfo() &&
              <span className="pull-right publish-toggle">
                Current State: <span className="publishState">{this.publishState()}</span>
                <LoadingButton
                  text={published ? 'Unpublish' : 'Publish'}
                  isLoading={isTogglingPublishState}
                  disabled={isTogglingPublishState}
                  bsStyle={published ? 'default' : 'danger'}
                  handleClick={this.handleTogglePublishState}
                />
              </span>
            )
          }
        </div>
      </form>);
  }
}

export default reduxForm({
  form: 'resourceForm',
  fields: [
    'title',
    'description',
    'category',
    'email',
    'phone',
    'url',
    'operating_hours',
    'population_served',
    'tags',
    'languages',
    'note',

    'address.street',
    'address.city',
    'address.state',
    'address.zipcode',

  ]
})(ResourceForm);
