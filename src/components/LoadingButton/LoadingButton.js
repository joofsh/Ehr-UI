import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { FontIcon, LoadingSpinner } from 'src/components';

export default class LoadingButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    className: PropTypes.string,
    bsStyle: PropTypes.string,
    handleClick: PropTypes.func,
    icon: PropTypes.string,
    type: PropTypes.string,
    text: PropTypes.string
  };

  render() {
    let {
      disabled,
      type,
      isLoading,
      handleClick,
      icon,
      text,
      bsStyle,
      className
    } = this.props;
    let _icon;

    if (icon) {
      _icon = <FontIcon type={icon}/>;
    }

    require('./LoadingButton.scss');
    return (
      <Button
        className={className || ''}
        type={ type || 'button'}
        bsStyle={bsStyle || 'primary'}
        disabled={disabled}
        onClick={!disabled ? handleClick : null}
        active
      >
      {isLoading ? <LoadingSpinner/> : _icon } {text || 'Submit'}
    </Button>);
  }
}
