import React from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import SliderMonitor from 'redux-slider-monitor';

const DevTools = createDevTools(
  <DockMonitor
    defaultIsVisible={false}
    toggleVisibilityKey="ctrl-h"
    defaultSize={0.22}
    changePositionKey="ctrl-q"
  >
    <SliderMonitor keyboardEnabled />
  </DockMonitor>
);

export default DevTools;
