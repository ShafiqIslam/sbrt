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
	const match = line.match(
		/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})\s+(\[[^\]]+\])\s+\b(TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL)\b/,
	);

	const getNodeForJustText = (text: string) => {
		const matchLevelOnText = text.match(
			/\b(TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL)\b/,
		);

		if (!matchLevelOnText || matchLevelOnText.index === undefined) {
			return text;
		}

		const before = line.slice(0, matchLevelOnText.index);
		const level = matchLevelOnText[1] ?? '';
		const after = line.slice(matchLevelOnText.index + level.length);

		return (
			<>
				{before}
				<Text color={level == '' ? 'white' : LOG_LEVEL_COLOR[level]} bold>
					{level}
				</Text>
				{after}
			</>
		);
	};

	if (!match) {
		return <Text wrap="truncate-end">{getNodeForJustText(line)}</Text>;
	}
	const [, timestamp, thread, level] = match;
	const prefixEnd = match[0].length;
	const rest = line.slice(prefixEnd);

	return (
		<Text wrap="truncate-end">
			{' '}
			<Text color="magenta">{timestamp}</Text> <Text dimColor>{thread}</Text>{' '}
			<Text color={!level ? 'white' : LOG_LEVEL_COLOR[level]} bold>
				{' '}
				{level}{' '}
			</Text>{' '}
			{getNodeForJustText(rest)}{' '}
		</Text>
	);
}
