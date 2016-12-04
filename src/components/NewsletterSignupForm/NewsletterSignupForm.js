import React, { Component, PropTypes } from 'react';
import { LoadingSpinner, FontIcon, FormGroup } from 'src/components';
import { reduxForm } from 'redux-form';

export class NewsletterSignupForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    withError: PropTypes.bool.isRequired,
  };

  render() {
    let {
      fields: {
        firstName,
        lastName,
        email
      },
      handleSubmit,
      submitting,
      success,
      withError,
    } = this.props;

    if (success) {
      return <h3 className="newsletterSignupSuccess">Success!</h3>;
    }

    return (<form className="form-horizontal" onSubmit={handleSubmit}>
      <p>Sign up to hear updates on DC Resources</p>
      <FormGroup label="Email Address" {...email} type="email" required/>
      <FormGroup label="First Name" placeholder="Enter First Name" {...firstName}/>
      <FormGroup label="Last Name" placeholder="Enter Username or Email" {...lastName}/>

      {withError && <p className="text-danger error">
        We encountered an error while saving your information. Please try again later
      </p>}

      <button className="btn btn-success btn-block"
        disabled={submitting}
      >
        {submitting ? <LoadingSpinner/> : <FontIcon type="envelope"/> } Subscribe
      </button>

    </form>);
  }
}

export default reduxForm({
  form: 'newsletterSignup',
  fields: ['firstName', 'lastName', 'email']
})(NewsletterSignupForm);
