import React, { Component, PropTypes} from 'react';
import { reduxForm } from 'redux-form';
import { FormGroup, LoadingSpinner } from 'src/components';
import _forOwn from 'lodash/forOwn';
import _find from 'lodash/find';
import stringUtil from 'src/utils/string';

export default class UserForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.string
  };

  formGroupFields() {
    const { fields, userFields, isEditing, groupClassName } = this.props;
    var formGroupFields = [];
    _forOwn(fields, (field, i) => {

      _forOwn(fields, (field, key) => {
        fields[key] = Object.assign({},
                                    field,
                                    _find(userFields, (f) => f.name === key));
      });

      formGroupFields.push(
        <FormGroup
          {...field}
          key={i}
          isEditing={isEditing}
          groupClassName={groupClassName}/>
      );
    });
    return formGroupFields;
  }
  render() {
    const {
      handleSubmit,
      submitting,
      error
    } = this.props;

    return <form onSubmit={handleSubmit}>
      { this.formGroupFields() }
      <div className='form-group col-xs-12'>
        { error && <p className="text-danger error">{error}</p>}
        <button className='btn btn-success btn-lg'
          type='submit' disabled={submitting}>
          {submitting ? <LoadingSpinner/> : <i className="fa fa-paper-plane"/> } Submit
        </button>
      </div>
    </form>;
  }
};

export default reduxForm({
  form: 'userForm'
},
)(UserForm);
