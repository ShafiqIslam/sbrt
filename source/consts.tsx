import {Action, ResourceConfig, RestartMode} from './types.js';

export const LOGS_MAX_LINES = 5000;
export const SBRT_LOG_PREFIX = '[SBRT]';
export const ACTION_KEYS = {
	search: '/',
	restart: 'r',
	cleanRestart: 'R',
	clear: 'c',
	help: '?',
	closeHelp: 'esc',
	quit: 'q',
};
export const ACTIONS: Action[] = [
	{key: '(ctrl,shift)? ↑↓', label: 'Scroll', inHelpMode: true, inLogMode: true},
	{
		key: ACTION_KEYS.restart,
		label: 'Restart',
		inHelpMode: false,
		inLogMode: true,
	},
	{
		key: ACTION_KEYS.cleanRestart,
		label: 'Clean Start',
		inHelpMode: false,
		inLogMode: true,
	},
	{key: ACTION_KEYS.clear, label: 'Clear', inHelpMode: false, inLogMode: true},
	{key: ACTION_KEYS.help, label: 'Help', inHelpMode: false, inLogMode: true},
	{
		key: ACTION_KEYS.closeHelp,
		label: 'Close Help',
		inHelpMode: true,
		inLogMode: false,
	},
	{key: ACTION_KEYS.quit, label: 'Quit', inHelpMode: true, inLogMode: true},
];
export const LOG_LEVEL_COLOR: Record<string, string> = {
	TRACE: 'gray',
	DEBUG: 'blue',
	INFO: 'green',
	WARN: 'yellow',
	WARNING: 'yellow',
	ERROR: 'red',
	FATAL: 'red',
};

export const RESTART_MODE_COLORS: Record<RestartMode, string> = {
	AUTO: 'green',
	MANUAL: 'yellow',
	UNAVAILABLE: 'gray',
};

export const DEFAULT_RESOURCE_CONFIG: ResourceConfig = {
	java: {
		initialMemoryMb: 512,
		maxMemoryMb: 2048,
	},
};
