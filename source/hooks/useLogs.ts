import {useMemo, useState} from 'react';

export function useLogs(logs: string[]) {
	const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
	const [searching, setSearching] = useState(false);

	const handleSearch = (q: string) => {
		setSearchQuery(q);
	};

	const isSearchApplied = useMemo(() => {
		return searchQuery !== undefined && searchQuery !== '';
	}, [searchQuery]);

	const filteredLogs = useMemo(
		() =>
			isSearchApplied ? logs.filter(log => log.includes(searchQuery!)) : logs,
		[logs, searchQuery, isSearchApplied],
	);

	return {
		filteredLogs,
		searchQuery,
		handleSearch,
		searching,
		setSearching,
		isSearchApplied,
	};
}
