import {useCallback, useEffect, useState} from 'react';
import {useApp, useStdout} from 'ink';

export function useTerminal() {
	const {stdout} = useStdout();
	const {exit} = useApp();

	const [quitByUser, setQuitByUser] = useState(false);

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
		if (!quitByUser) return;

		exit();
		cleanup();
	}, [quitByUser, cleanup, exit]);

	const quitApp = useCallback(() => {
		setQuitByUser(true);
	}, [setQuitByUser]);

	return {
		cleanup,
		terminalHeight,
		actionBarHeight,
		logHeight,
		quitApp,
	};
}
