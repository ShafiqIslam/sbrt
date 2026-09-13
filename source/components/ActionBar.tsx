import React, {useState} from 'react';
import {Box, Text} from 'ink';
import TextInput from 'ink-text-input';

import StatusTag from './StatusTag.js';

type Props = {
	actions: {key: string; label: string}[];
	status: string;
	onSearch: (query: string) => void;
	searching: boolean;
	isSearchApplied: boolean;
	searchQuery: string | undefined;
	stopSearch: () => void;
};

export default function ActionBar({
	actions,
	status,
	onSearch,
	searching,
	isSearchApplied,
	searchQuery,
	stopSearch,
}: Props) {
	const [query, setQuery] = useState('');

	const handleSubmit = (value: string) => {
		onSearch(value);
		stopSearch();
		setQuery('');
	};

	return (
		<Box
			height={2}
			borderStyle="single"
			borderBottom={false}
			borderLeft={false}
			borderRight={false}
			alignItems="center"
		>
			<Box width={20} paddingLeft={1}>
				<StatusTag status={status} />
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
							<Text dimColor>Press / to search</Text>
						)}
					</>
				)}
			</Box>
		</Box>
	);
}
