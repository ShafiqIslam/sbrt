import React from 'react';
import {Text} from 'ink';

export default function LogLine({line}: {line: string}) {
	const match = line.match(/\b(TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL)\b/);

	if (!match || match.index === undefined) {
		return <Text wrap="truncate-end">{line}</Text>;
	}

	const before = line.slice(0, match.index);
	const level = match[1] ?? '';
	const after = line.slice(match.index + level.length);

	const levelColor: Record<string, string> = {
		TRACE: 'gray',
		DEBUG: 'blue',
		INFO: 'green',
		WARN: 'yellow',
		WARNING: 'yellow',
		ERROR: 'red',
		FATAL: 'red',
	};

	return (
		<Text wrap="truncate-end">
			{before}
			<Text color={level == '' ? 'white' : levelColor[level]} bold>
				{level}
			</Text>
			{after}
		</Text>
	);
}
