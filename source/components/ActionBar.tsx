import React, {useState} from 'react';
import {Box, Text} from 'ink';
import TextInput from 'ink-text-input';
import StatusBadge from './StatusBadge.js';
import {ACTION_KEYS, ACTIONS} from '../consts.js';
import {RestartMode, Status} from '../types.js';
import RestartModeBadge from './RestartModeBadge.js';

type Props = {
	showingHelp: boolean;
	status: Status;
	onSearch: (query: string) => void;
	searching: boolean;
	isSearchApplied: boolean;
	searchQuery: string | undefined;
	stopSearch: () => void;
	restartMode: RestartMode;
};

export default function ActionBar({
	showingHelp,
	status,
	onSearch,
	searching,
	isSearchApplied,
	searchQuery,
	stopSearch,
	restartMode,
}: Props) {
	const [query, setQuery] = useState('');

	const handleSubmit = (value: string) => {
		onSearch(value);
		stopSearch();
		setQuery('');
	};

	const actions = ACTIONS.filter(action => {
		if (showingHelp) {
			return action.inHelpMode;
		}

		if (!action.inLogMode) {
			return false;
		}

		if (action.key !== ACTION_KEYS.restart) {
			return true;
		}

		return restartMode === 'MANUAL';
	});

	return (
		<Box
			height={2}
			borderStyle="single"
			borderBottom={false}
			borderLeft={false}
			borderRight={false}
			alignItems="center"
		>
			<Box paddingLeft={1}>
				<StatusBadge status={status} />
				<Box marginX={1}></Box>
				<RestartModeBadge mode={restartMode} />
			</Box>

			<Box flexGrow={1} justifyContent="center">
				{actions.map((action, index) => (
					<React.Fragment key={action.label}>
						{index > 0 && (
							<Box marginX={1}>
								<Text dimColor>│</Text>
							</Box>
						)}

						<Box>
							<Text inverse bold>
								{` ${action.key} `}
							</Text>
							<Text dimColor> {action.label}</Text>
						</Box>
					</React.Fragment>
				))}
			</Box>

			<Box width={24} paddingRight={1} justifyContent="flex-end">
				<Box marginRight={1}>
					<Text>🔍</Text>
				</Box>

				{searching ? (
					<Box width={18} overflow="hidden">
						<TextInput
							value={query}
							onChange={setQuery}
							onSubmit={handleSubmit}
						/>
					</Box>
				) : (
					<>
						{isSearchApplied ? (
							<Text>{searchQuery}</Text>
						) : (
							<Text dimColor>Press {ACTION_KEYS.search} to search</Text>
						)}
					</>
				)}
			</Box>
		</Box>
	);
}
