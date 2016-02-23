import React from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import DiffMonitor from 'redux-devtools-diff-monitor';

const DevTools = createDevTools(
  <DockMonitor
    defaultIsVisible={false}
    toggleVisibilityKey="ctrl-h"
    defaultSize={0.22}
    changePositionKey="ctrl-q"
  >
    <DiffMonitor theme="solarized"/>
  </DockMonitor>
);

export default DevTools;
