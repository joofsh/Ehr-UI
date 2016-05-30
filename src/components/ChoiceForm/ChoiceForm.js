import React, { Component, PropTypes } from 'react';
import {
  FormGroup,
  FormGroupTag,
  FontIcon,
} from 'src/components';

export default class ChoiceForm extends Component {
  static propTypes = {
    allTags: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    questionIndex: PropTypes.number.isRequired,
    removeChoice: PropTypes.func.isRequired,
    next_question_id: PropTypes.object.isRequired,
    tags: PropTypes.object.isRequired,
    stem: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired
  };

  constructor() {
    super();
    this.removeChoice = this.removeChoice.bind(this);
  }

  removeChoice() {
    let { removeChoice, index } = this.props;

    removeChoice(index);
  }

  render() {
    let {
      allTags,
      stem,
      next_question_id,
      tags,
      index,
      isEditing
    } = this.props;

    require('./ChoiceForm.scss');
    return (<div className="choiceForm clearfix">
      <div className="row">
        <div className="col-xs-12">
          <div className="col-xs-5">
            <FormGroup
              {...stem}
              name={`Choice ${index + 1}`}
              labelClassName="col-xs-3"
              wrapperClassName="col-xs-9"
              isEditing={isEditing}
            />
          </div>
          <div className="col-xs-3">
            <FormGroupTag
              {...tags}
              label="Tags"
              labelClassName="col-xs-2"
              wrapperClassName="col-xs-10"
              searchResults={allTags}
              isEditing={isEditing}
            />
          </div>
          <div className="col-xs-3">
            <FormGroup
              {...next_question_id}
              placeholder="ID"
              label="Follow Up Question ID:"
              labelClassName="col-xs-5 label--twoLine"
              wrapperClassName="col-xs-4"
              isEditing={isEditing}
            />
          </div>
          <div className="col-xs-1">
            {isEditing &&
              <button className="btn btn-warning" type="button" onClick={this.removeChoice}>
              <FontIcon type="trash"/>
            </button>}
          </div>
        </div>
      </div>
    </div>);
  }
}
