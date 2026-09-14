import React from 'react';
import {Text} from 'ink';
import {LOG_LEVEL_COLOR, SBRT_LOG_PREFIX} from '../consts.js';

type Props = {
	line: string;
};

export default function LogLine({line}: Props) {
	if (line.startsWith(SBRT_LOG_PREFIX)) {
		return (
			<Text color="cyan" bold wrap="truncate-end">
				{line}
			</Text>
		);
	}

	const match = line.match(/\b(TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL)\b/);

	if (!match || match.index === undefined) {
		return <Text wrap="truncate-end">{line}</Text>;
	}

	const before = line.slice(0, match.index);
	const level = match[1] ?? '';
	const after = line.slice(match.index + level.length);

	return (
		<Text wrap="truncate-end">
			{before}
			<Text color={level == '' ? 'white' : LOG_LEVEL_COLOR[level]} bold>
				{level}
			</Text>
			{after}
		</Text>
	);
}
