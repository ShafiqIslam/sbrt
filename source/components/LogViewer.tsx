import React, {useEffect, useMemo, useState} from 'react';
import {Box, useInput} from 'ink';
import LogLine from './LogLine.js';

type Props = {
	logs: string[];
	height: number;
};

export default function LogViewer({logs, height}: Props) {
	const [scrollTop, setScrollTop] = useState(Math.max(0, logs.length - height));

	const [following, setFollowing] = useState(true);

	const maxScrollTop = Math.max(0, logs.length - height);

	/*
	 * Follow new logs when we're at the bottom.
	 */
	useEffect(() => {
		if (following) {
			setScrollTop(Math.max(0, logs.length - height));
		}
	}, [logs.length, height, following]);

	const visibleLogs = useMemo(
		() => logs.slice(scrollTop, scrollTop + height),
		[logs, scrollTop, height],
	);

	const scrollUp = (amount: number) => {
		setFollowing(false);

		setScrollTop(previous => Math.max(0, previous - amount));
	};

	const scrollDown = (amount: number) => {
		setScrollTop(previous => {
			const next = Math.min(maxScrollTop, previous + amount);

			if (next === maxScrollTop) {
				setFollowing(true);
			}

			return next;
		});
	};

	useInput((_, key) => {
		if (key.upArrow) {
			scrollUp(1);
		}

		if (key.downArrow) {
			scrollDown(1);
		}

		if (key.pageUp) {
			scrollUp(height - 2);
		}

		if (key.pageDown) {
			scrollDown(height - 2);
		}

		if (key.upArrow && key.ctrl) {
			setFollowing(false);
			setScrollTop(0);
		}

		if (key.downArrow && key.ctrl) {
			setScrollTop(maxScrollTop);
			setFollowing(true);
		}

		if (key.upArrow && key.shift) {
			scrollUp(height - 2);
		}

		if (key.downArrow && key.shift) {
			scrollDown(height - 2);
		}
	});

	return (
		<Box flexDirection="column" height={height} overflow="hidden">
			{visibleLogs.map((line, index) => (
				<Box key={`${scrollTop + index}-${line}`}>
					<LogLine line={line} />
				</Box>
			))}
		</Box>
	);
}
