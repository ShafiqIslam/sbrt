import {useCallback, useEffect} from 'react';
import {useApp, useStdout} from 'ink';

export function useTerminal(stopped: boolean) {
	const {stdout} = useStdout();
	const {exit} = useApp();

	const cleanup = useCallback(() => {
		// Clear screen
		process.stdout.write('\x1b[2J');

		// Move cursor to top-left
		process.stdout.write('\x1b[H');

		// Leave the shell prompt on a fresh line
		process.stdout.write('\n');
	}, []);

	useEffect(() => {
		return () => {
			cleanup();
		};
	}, [cleanup]);

	const terminalHeight = stdout.rows ?? 24;

	const actionBarHeight = 2;

	const logHeight = Math.max(1, terminalHeight - actionBarHeight);

	useEffect(() => {
		if (!stopped) return;

		exit();
		cleanup();
	}, [stopped, cleanup, exit]);

	return {
		cleanup,
		terminalHeight,
		actionBarHeight,
		logHeight,
	};
}
