import React from 'react';
import expect from 'expect';
import { createRenderer } from 'react-addons-test-utils';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

describe('Component - LoadingSpinner', () => {
  it('works', () => {
    let renderer = createRenderer();
    renderer.render(<LoadingSpinner absolute large center/>);
    let result = renderer.getRenderOutput();
    expect(result.type).toBe('i');
    expect(result.props.className)
      .toBe('fa fa-spinner fa-pulse LoadingSpinner absolute large center');
  });
});
