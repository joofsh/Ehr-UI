import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { FormGroup, LoadingSpinner } from 'src/components';
import _forOwn from 'lodash/forOwn';
import _find from 'lodash/find';
import classnames from 'classnames';

export class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    submitting: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    customFields: PropTypes.array,
    className: PropTypes.string,
    groupClassName: PropTypes.string,
    error: PropTypes.string
  };

  formGroupFields() {
    let { fields, customFields, isEditing, groupClassName } = this.props;
    let formGroupFields = [];
    _forOwn(fields, (field, i) => {

      _forOwn(fields, (_field, key) => {
        fields[key] = Object.assign({},
                                    _field,
                                    _find(customFields, (f) => f.name === key));
      });

      formGroupFields.push(
        <FormGroup
          {...field}
          key={i}
          isEditing={isEditing}
          groupClassName={groupClassName}
        />
      );
    });
    return formGroupFields;
  }

  render() {
    let {
      handleSubmit,
      submitting,
      isEditing,
      className,
      error
    } = this.props;

    // Use form-horizontal styling in read-only mode
    let formClasses = classnames({
      'form-horizontal': !isEditing,
    },
      [className]
    );

    require('./Form.scss');
    return (<form onSubmit={handleSubmit} className={formClasses}>
      { this.formGroupFields() }
      <div className="form-group col-xs-12">
        { error && <p className="text-danger error">{error}</p>}
        {isEditing && <button className="btn btn-success btn-lg"
          type="submit" disabled={submitting}
        >
          {submitting ? <LoadingSpinner/> : <i className="fa fa-paper-plane"/> } Submit
        </button>}
      </div>
    </form>);
  }
}

export default reduxForm({
  form: 'customForm'
})(Form);
