import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import SliderMonitor from 'redux-slider-monitor';

const SLIDER = false;

const DevTools = createDevTools(
  <DockMonitor
    defaultIsVisible={false}
    toggleVisibilityKey='ctrl-h'
    defaultSize={0.22}
    changePositionKey='ctrl-q'>
    {SLIDER ? <SliderMonitor keyboardEnabled /> :
      <LogMonitor theme='solarized' />}
  </DockMonitor>
);


export default  DevTools;

