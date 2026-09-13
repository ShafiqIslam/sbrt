#!/usr/bin/env node

import React from 'react';
import {render} from 'ink';
import App from './app.js';

const {waitUntilExit} = render(<App />, {exitOnCtrlC: false});
await waitUntilExit();

console.log('sbrt exited!');
