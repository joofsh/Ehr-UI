import React from 'react';
import expect from 'expect';
import { createRenderer } from 'react-addons-test-utils';
import ToggleButton from '../ToggleButton/ToggleButton';

describe('Component - ToggleButton', () => {
  it('works', () => {
    let renderer = createRenderer();
    let isActive = false;

    let onClick = () => {
      isActive = !isActive;
    }
    let activeText = "Active Stuff"
    let inactiveText = "Inactive stuff"

    function render() {
      renderer.render(
        <ToggleButton
          onClick={onClick}
          isActive={isActive}
          activeText={activeText}
          inactiveText={inactiveText}
          className="another-class"
        />);
      return renderer.getRenderOutput();
    }

    let result = render();
    expect(result.type.displayName).toBe('Button');
    expect(result.props.className)
      .toBe('toggleButton another-class');
    expect(result.props.bsStyle).toBe('primary');
    expect(result.props.children[1]).toBe(inactiveText);

    // Simulate click
    result.props.onClick();

    // Re-render and pull in new props
    result = render();
    expect(result.props.bsStyle).toBe('default');
    expect(result.props.children[1]).toBe(activeText);

  });
});
