import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import {
  FormGroup,
  FontIcon,
  LoadingButton,
  ChoiceForm
} from 'src/components';

export class QuestionForm extends Component {
  static propTypes = {
    allTags: PropTypes.array.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    toggleEditQuestion: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    submitting: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    id: PropTypes.number,
    error: PropTypes.string,
  };

  constructor() {
    super();
    this.addChoice = this.addChoice.bind(this);
    this.removeChoice = this.removeChoice.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.toggleEditQuestion = this.toggleEditQuestion.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    let update = true;

    // If the current or next props are not editing, then
    // the component has not changed
    if ((!nextProps.isEditing && !this.props.isEditing) &&
      (nextProps.fields.choices.length === this.props.fields.choices.length)) {
      update = false;
    }

    return update;
  }


  addChoice() {
    this.props.fields.choices.addField({});
  }

  removeChoice(choiceIndex) {
    this.props.fields.choices.removeField(choiceIndex);
  }

  deleteQuestion() {
    this.props.deleteQuestion(this.props.id, this.props.index);
  }

  toggleEditQuestion() {
    this.props.toggleEditQuestion(this.props.index);
  }

  render() {
    let {
      allTags,
      fields: {
        order,
        category,
        stem,
        choices
      },
      id,
      index,
      submitting,
      handleSubmit,
      error,
      isEditing,
    } = this.props;

    require('./QuestionForm.scss');
    return (<form className="questionForm clearfix" onSubmit={handleSubmit} noValidate id={id}>
      <div className="row">
        <div className="col-lg-1 col-id col-xs-6">
          <div className="form-control-static">
            <b>ID:</b> {id || 'None'}
          </div>
        </div>
        <div className="col-lg-2 col-order col-xs-6">
          <FormGroup
            {...order}
            labelClassName="col-xs-4"
            wrapperClassName="col-xs-8"
            isEditing={isEditing}
          />
        </div>
        <div className="col-lg-1 col-category col-xs-12">
          <FormGroup
            {...category}
            type="select"
            label={false}
            wrapperClassName="col-xs-12"
            isEditing={isEditing}
          >
            <option value="General">General</option>
            <option value="Demographic">Demographic</option>
            <option value="Education">Education</option>
            <option value="Employment">Employment</option>
            <option value="Family">Family</option>
            <option value="Health">Health</option>
            <option value="Housing">Housing</option>
            <option value="Legal">Legal</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Substance Use">Substance Abuse</option>
            <option value="Initial">Initial</option>
          </FormGroup>
        </div>
        <div className="col-lg-5 col-stem col-xs-12">
          <FormGroup
            {...stem}
            labelClassName="col-xs-1"
            wrapperClassName="col-xs-11"
            isEditing={isEditing}
          />
        </div>
        <div className="col-lg-3 col-xs-12 buttons">
          {error && <p className="text-danger error">{error}</p>}
          {isEditing && <div>
            <LoadingButton
              type="submit"
              text="Save"
              icon="paper-plane"
              isLoading={submitting}
              disabled={submitting}
              className="btn-success pull-left"
            />
            <button type="button" className="btn btn-primary pull-left" onClick={this.addChoice}>
              <FontIcon type="plus"/> Choice
            </button>
          </div>}
          <button type="button" className="btn btn-danger pull-right"
            onClick={this.deleteQuestion}
          >
            <FontIcon type="trash"/>
          </button>
          <button type="button" className="btn btn-warning pull-right"
            onClick={this.toggleEditQuestion}
          >
            <FontIcon type="pencil"/>
          </button>
        </div>
      </div>
      <div className="row">
        {choices.map((choice, j) => (
          <ChoiceForm
            {...choice}
            key={j}
            index={j}
            removeChoice={this.removeChoice}
            questionIndex={index}
            allTags={allTags}
            initialValues={choice}
            isEditing={isEditing}
          />
        ))}
      </div>
    </form>);
  }
}

export default reduxForm({
  form: 'questionForm',
  fields: ['order', 'id', 'category', 'stem', 'choices[].id', 'choices[].stem',
           'choices[].next_question_id', 'choices[].tags']
})(QuestionForm);
