import React from 'react';
import {Box} from 'ink';
import {useSpringBoot} from './hooks/useSpringBoot.js';
import {useActions} from './hooks/useActions.js';
import {useTerminal} from './hooks/useTerminal.js';
import LogViewer from './components/LogViewer.js';
import ActionBar from './components/ActionBar.js';
import {useLogs} from './hooks/useLogs.js';
import {useSpringDevTools} from './hooks/useSpringDevTools.js';
import ReadmeViewer from './components/ReadmeViewer.js';
import {ResourceConfig} from './types.js';

type Props = {
	readme: string;
	config?: Partial<ResourceConfig>;
};

export default function App({readme, config}: Props) {
	const {terminalHeight, logHeight, quitApp} = useTerminal();

	const {restartMode, triggerFile} = useSpringDevTools();
	const {
		logs,
		status,
		restart,
		cleanRestart,
		stop,
		clearLogs,
		addNewLineInLog,
	} = useSpringBoot(restartMode, triggerFile, config);

	const {filteredLogs, handleSearch, searchQuery, isSearchApplied} =
		useLogs(logs);

	const {searching, stopSearch, showingHelp} = useActions({
		onQuit: () => {
			stop(quitApp);
		},
		onClear: clearLogs,
		onRestart: restart,
		onCleanRestart: cleanRestart,
		onNewLine: addNewLineInLog,
		isSearchApplied,
		handleSearch,
		restartMode,
	});

	return (
		<Box flexDirection="column" height={terminalHeight} width="100%">
			<Box height={logHeight} overflow="hidden">
				{showingHelp ? (
					<ReadmeViewer readme={readme} height={logHeight} />
				) : (
					<LogViewer logs={filteredLogs} height={logHeight} />
				)}
			</Box>

			<ActionBar
				showingHelp={showingHelp}
				searching={searching}
				searchQuery={searchQuery}
				isSearchApplied={isSearchApplied}
				stopSearch={stopSearch}
				status={status}
				onSearch={handleSearch}
				restartMode={restartMode}
			/>
		</Box>
	);
}
