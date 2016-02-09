import React, { Component, PropTypes } from 'react';
import { FontIcon } from 'src/components';
import { Button } from 'react-bootstrap';

export default class ToggleButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    activeText: PropTypes.string.isRequired,
    inactiveText: PropTypes.string.isRequired,
    activeIcon: PropTypes.string,
    inactiveIcon: PropTypes.string,
    className: PropTypes.string
  };

  render() {
    let {
      onClick,
      isActive,
      inactiveText,
      activeText,
      activeIcon = 'ban',
      inactiveIcon = 'pencil',
      className
    } = this.props;

    require('./ToggleButton.scss');
    return (<Button
      className={`toggleButton ${className}`}
      onClick={onClick}
      bsStyle={isActive ? 'default' : 'primary'}
    >
      <FontIcon type={isActive ? activeIcon : inactiveIcon}/>
      {isActive ? activeText : inactiveText}
    </Button>);
  }
}
