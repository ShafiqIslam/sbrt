import React from 'react';
import {Text} from 'ink';

type Props = {
	status: string;
};

export default function StatusTag({status}: Props) {
	switch (status) {
		case 'RUNNING':
			return <Text color="green">● {status}</Text>;

		case 'STARTING':
			return <Text color="yellow">● {status}</Text>;

		case 'STOPPING':
			return <Text color="yellow">● {status}</Text>;

		case 'STOPPED':
			return <Text color="gray">● {status}</Text>;

		case 'ERROR':
			return <Text color="red">● {status}</Text>;

		default:
			return <Text color="yellow">● {status}</Text>;
	}
}
