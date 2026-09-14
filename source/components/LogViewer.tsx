import React from 'react';
import LogLine from './LogLine.js';
import ScrollableLines from './ScrollableLines.js';
import {Box} from 'ink';

type Props = {
	logs: string[];
	height: number;
};

export default function LogViewer({logs, height}: Props) {
	return (
		<ScrollableLines
			lines={logs}
			height={height}
			follow
			renderLine={(line, index) => (
				<Box key={`${index}-${line}`}>
					<LogLine line={line} />
				</Box>
			)}
		/>
	);
}
