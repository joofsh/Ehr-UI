import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import {
  AddressForm,
  FormGroup,
  LoadingButton,
  FormGroupTag
} from 'src/components';

export class ResourceForm extends Component {
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
        languages,
        note,
        tags,
        address
      },
      authedStaff,
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
        autoComplete="off"
        noValidate
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
              <FormGroup {...description} isEditing={isEditing} type="textarea"/>
              <FormGroup
                {...category}
                isEditing={isEditing}
                type="select"
                multiple
                name="Categories"
              >
                <option disabled value="">Select categories</option>
                <option value="Housing">Housing</option>
                <option value="Physical Health">Physical Health</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Substance Abuse">Substance Abuse</option>
                <option value="Education">Education</option>
                <option value="Employment">Employment</option>
                <option value="Legal">Legal</option>
              </FormGroup>
              <FormGroup {...operating_hours} isEditing={isEditing} type="textarea"/>
              <FormGroup {...languages} isEditing={isEditing}/>
              <FormGroup
                {...note}
                label="Tips"
                type="textarea"
                isEditing={isEditing}
                placeholder="Any Additional Comments"
              />
              {authedStaff && <FormGroupTag
                {...tags}
                title="Tags"
                isEditing={isEditing}
                searchResults={tagSearchResults}
              />}
            </div>
          </fieldset>
        </div>
        <div className="row">
          <fieldset className={fieldSetClassName}>
            <legend>Contact Information</legend>
            <div className="col-md-9 col-offset-3">
              <FormGroup {...phone} isEditing={isEditing} type="phone"/>
              <FormGroup {...email} isEditing={isEditing} type="email"/>
              <FormGroup {...url} title="Website" isEditing={isEditing} type="url"/>
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
          <div className="errorWrapper pull-right">
            { error && <p className="text-danger error">{error}</p>}
          </div>
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
