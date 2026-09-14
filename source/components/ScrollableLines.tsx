import React, {useEffect, useMemo, useState} from 'react';
import {Box, useInput} from 'ink';

type Props = {
	lines: string[];
	height: number;
	renderLine?: (line: string, index: number) => React.ReactNode;
	follow?: boolean;
};

export default function ScrollableLines({
	lines,
	height,
	follow = false,
	renderLine = line => line,
}: Props) {
	const [scrollTop, setScrollTop] = useState(
		follow ? Math.max(0, lines.length - height) : 0,
	);
	const [following, setFollowing] = useState(follow);

	const maxScrollTop = Math.max(0, lines.length - height);

	useEffect(() => {
		if (following) {
			setScrollTop(maxScrollTop);
		}
	}, [lines.length, height, maxScrollTop, following]);

	const visibleLines = useMemo(
		() => lines.slice(scrollTop, scrollTop + height),
		[lines, scrollTop, height],
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

		if (key.pageUp || (key.upArrow && key.shift)) {
			scrollUp(height - 2);
		}

		if (key.pageDown || (key.downArrow && key.shift)) {
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
	});

	return (
		<Box flexDirection="column" height={height} overflow="hidden">
			{visibleLines.map((line, index) => (
				<Box key={`${scrollTop + index}-${line}`} height={1}>
					{renderLine(line, scrollTop + index)}
				</Box>
			))}
		</Box>
	);
}
