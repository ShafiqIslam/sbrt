import React from 'react';
import {Text} from 'ink';
import {RestartMode} from '../types.js';
import {RESTART_MODE_COLORS} from '../consts.js';

type Props = {mode: RestartMode};

export default function RestartModeBadge({mode}: Props) {
	const color = RESTART_MODE_COLORS[mode] || 'yellow';

	return (
		<Text color={color} inverse>
			{` ${mode} `}
		</Text>
	);
}
