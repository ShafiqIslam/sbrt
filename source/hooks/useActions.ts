import {useInput} from 'ink';
import {useState} from 'react';
import {RestartMode} from '../types.js';
import {ACTION_KEYS} from '../consts.js';

type UseActionsOptions = {
	onQuit: () => void;
	onClear: () => void;
	onRestart: () => void;
	onCleanRestart: () => void;
	restartMode: RestartMode;
	isSearchApplied: boolean;
	handleSearch: (searchQuery: string) => void;
};

export function useActions({
	onQuit,
	onClear,
	onRestart,
	onCleanRestart,
	handleSearch,
	isSearchApplied,
	restartMode,
}: UseActionsOptions) {
	const [searching, setSearching] = useState(false);
	const [showingHelp, setShowingHelp] = useState(false);

	const startSearch = () => {
		setSearching(true);
	};

	const stopSearch = () => {
		setSearching(false);
	};

	const openHelp = () => {
		setShowingHelp(true);
	};

	const closeHelp = () => {
		setShowingHelp(false);
	};

	const clearSearch = () => {
		handleSearch('');
		stopSearch();
	};

	const restart = () => {
		if (restartMode === 'MANUAL') {
			onRestart();
		}
	};

	useInput((input, key) => {
		if (isSearchApplied && key.escape) {
			clearSearch();
			return;
		}

		if (showingHelp && key.escape) {
			closeHelp();
			return;
		}

		if (searching) {
			return;
		}

		switch (input) {
			case ACTION_KEYS.search:
				startSearch();
				break;
			case ACTION_KEYS.quit:
				onQuit();
				break;
			case ACTION_KEYS.clear:
				onClear();
				break;
			case ACTION_KEYS.restart:
				restart();
				break;
			case ACTION_KEYS.cleanRestart:
				onCleanRestart();
				break;
			case ACTION_KEYS.help:
				openHelp();
				break;
		}
	});

	return {
		searching,
		stopSearch,
		showingHelp,
	};
}
