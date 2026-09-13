import React from 'react';
import {Box} from 'ink';

import {useSpringBoot} from './hooks/useSpringBoot.js';
import {ACTIONS, useActions} from './hooks/useActions.js';
import {useTerminal} from './hooks/useTerminal.js';

import LogViewer from './components/LogViewer.js';
import ActionBar from './components/ActionBar.js';
import {useLogs} from './hooks/useLogs.js';

export default function App() {
	const {logs, status, stopped, restart, stop, clearLogs} = useSpringBoot();
	const {terminalHeight, logHeight} = useTerminal(stopped);
	const {filteredLogs, handleSearch, searchQuery, isSearchApplied} =
		useLogs(logs);

	const {searching, stopSearch} = useActions({
		onQuit: stop,
		onClear: clearLogs,
		onRestart: restart,
		isSearchApplied,
		handleSearch,
	});

	return (
		<Box flexDirection="column" height={terminalHeight} width="100%">
			<Box height={logHeight}>
				<LogViewer logs={filteredLogs} height={logHeight} />
			</Box>

			<ActionBar
				actions={ACTIONS}
				searching={searching}
				searchQuery={searchQuery}
				isSearchApplied={isSearchApplied}
				stopSearch={stopSearch}
				status={status}
				onSearch={handleSearch}
			/>
		</Box>
	);
}
