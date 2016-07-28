import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import {
  FormGroup,
  FontIcon,
  LoadingButton
} from 'src/components';

export class TagForm extends Component {
  static propTypes = {
    choices: PropTypes.array.isRequired,
    deleteTag: PropTypes.func.isRequired,
    error: PropTypes.string,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    id: PropTypes.number,
    index: PropTypes.number.isRequired,
    isEditing: PropTypes.bool.isRequired,
    resources: PropTypes.array.isRequired,
    submitting: PropTypes.bool.isRequired,
    toggleEditTag: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.deleteTag = this.deleteTag.bind(this);
    this.toggleEditTag = this.toggleEditTag.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    let update = true;

    // If the current or next props are not editing, then
    // the component has not changed
    if (!nextProps.isEditing && !this.props.isEditing) {
      update = false;
    }

    return update;
  }

  deleteTag() {
    this.props.deleteTag(this.props.id, this.props.index);
  }

  toggleEditTag() {
    this.props.toggleEditTag(this.props.index);
  }

  render() {
    let {
      choices,
      error,
      fields: {
        name,
        type,
        weight
      },
      handleSubmit,
      id,
      isEditing,
      resources,
      submitting
    } = this.props;

    require('./TagForm.scss');
    return (<form className="tagForm clearfix" onSubmit={handleSubmit} noValidate id={id}>
      <div className="row">
        <div className="col-lg-1 col-xs-6">
          <div className="form-control-static">
            <b>ID:</b> {id || 'None'}
          </div>
        </div>
        <div className="col-lg-3 col-order col-xs-6">
          <FormGroup
            {...name}
            labelClassName="col-xs-4"
            wrapperClassName="col-xs-8"
            isEditing={isEditing}
          />
        </div>
        <div className="col-lg-2 col-order col-xs-6">
          <FormGroup
            {...type}
            type="select"
            wrapperClassName="col-xs-9"
            labelClassName="col-xs-3"
            isEditing={isEditing}
          >
            <option value="Descriptor">Descriptor</option>
            <option value="Service">Service</option>
          </FormGroup>
        </div>
        <div className="col-lg-2 col-order col-xs-6">
          <FormGroup
            {...weight}
            labelClassName="col-xs-4"
            wrapperClassName="col-xs-8"
            isEditing={isEditing}
          />
        </div>
        <div className="col-lg-2 col-order col-xs-6">
          <FormGroup
            value={resources.length}
            name="Resources"
            labelClassName="col-xs-5"
            wrapperClassName="col-xs-7"
            isEditing={false}
          />
          <FormGroup
            value={choices.length}
            name="Choices"
            labelClassName="col-xs-5"
            wrapperClassName="col-xs-7"
            isEditing={false}
          />
        </div>
        <div className="col-lg-2 col-xs-12 buttons">
          <button type="button" className="btn btn-danger pull-right"
            onClick={this.deleteTag}
          >
            <FontIcon type="trash"/>
          </button>
          <button type="button" className="btn btn-warning pull-right"
            onClick={this.toggleEditTag}
          >
            <FontIcon type="pencil"/>
          </button>
          {isEditing && <div>
            <LoadingButton
              type="submit"
              text="Save"
              icon="paper-plane"
              isLoading={submitting}
              disabled={submitting}
              className="btn-success pull-left"
            />
          </div>}
        </div>
      </div>
      {error && <div className="row">
        <p className="text-danger error pull-right">{error}</p>
      </div>}
    </form>);
  }
}

export default reduxForm({
  form: 'tagForm',
  fields: ['id', 'name', 'type', 'weight']
})(TagForm);
