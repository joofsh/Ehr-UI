import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class ClientQuestionChoice extends Component {
  constructor() {
    super();
    this.selectChoice = this.selectChoice.bind(this);
  }

  static propTypes = {
    id: PropTypes.number.isRequired,
    stem: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    selectChoice: PropTypes.func.isRequired,
    _error: PropTypes.string,
    selectedChoiceId: PropTypes.number
  };

  selectChoice() {
    this.props.selectChoice(this.props.id);
  }

  render() {
    let {
      stem,
      selected
    } = this.props;

    let classes = classnames({
      selected
    }, 'col-md-6', 'col-sx-12', 'choice');

    require('./QuestionWizardChoice.scss');
    return (
      <div
        className={classes}
        onClick={this.selectChoice}
      >
        {stem}
      </div>);
  }
}
