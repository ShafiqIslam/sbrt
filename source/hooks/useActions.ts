import {useInput} from 'ink';
import {useState} from 'react';

type UseActionsOptions = {
	onQuit: () => void;
	onClear: () => void;
	onRestart: () => void;
	isSearchApplied: boolean;
	handleSearch: (searchQuery: string) => void;
};

export const ACTIONS = [
	{key: '(ctrl,shift)? ↑↓', label: 'Scroll'},
	{key: 'r', label: 'Restart'},
	{key: 'c', label: 'Clear'},
	{key: 'q', label: 'Quit'},
];

export function useActions({
	onQuit,
	onClear,
	onRestart,
	handleSearch,
	isSearchApplied,
}: UseActionsOptions) {
	const [searching, setSearching] = useState(false);

	const startSearch = () => {
		setSearching(true);
	};

	const stopSearch = () => {
		setSearching(false);
	};

	const clearSearch = () => {
		handleSearch('');
		stopSearch();
	};

	useInput((input, key) => {
		if (isSearchApplied && key.escape) {
			clearSearch();
			return;
		}

		if (searching) {
			return;
		}

		if (input === '/') {
			startSearch();
			return;
		}

		switch (input) {
			case 'q':
				onQuit();
				break;
			case 'c':
				onClear();
				break;
			case 'r':
				onRestart();
				break;
		}
	});

	return {
		searching,
		stopSearch,
	};
}
