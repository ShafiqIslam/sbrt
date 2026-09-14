#!/usr/bin/env node

import React from 'react';
import {render} from 'ink';
import App from './app.js';
import {join} from 'node:path';
import {readFileSync, existsSync} from 'node:fs';
import {parse} from 'smol-toml';

const readme = readFileSync(
	join(import.meta.dirname, '..', 'readme.md'),
	'utf8',
);

const configPath = join(process.cwd(), '.sbrtrc');

const config = existsSync(configPath)
	? parse(readFileSync(configPath, 'utf8'))
	: undefined;

const {waitUntilExit} = render(<App readme={readme} config={config} />, {
	exitOnCtrlC: false,
});
await waitUntilExit();

console.log('sbrt exited!');
