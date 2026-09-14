import React from 'react';
import {Text} from 'ink';
import ScrollableLines from './ScrollableLines.js';

type Props = {
	readme: string;
	height: number;
};

export default function ReadmeViewer({readme, height}: Props) {
	const lines = readme.split(/\r?\n/);

	return (
		<ScrollableLines
			lines={lines}
			height={height}
			renderLine={(line, index) => (
				<Text wrap="truncate" key={`${index}-${line}`}>
					{line}
				</Text>
			)}
		/>
	);
}
