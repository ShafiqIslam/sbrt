export type RestartMode = 'AUTO' | 'MANUAL' | 'UNAVAILABLE';

export type Status =
	| 'STARTING'
	| 'RUNNING'
	| 'STOPPING'
	| 'STOPPED'
	| 'ERROR'
	| string;

export type Action = {
	key: string;
	label: string;
	inHelpMode: boolean;
	inLogMode: boolean;
};

export type ResourceConfig = {
	java: {
		initialMemoryMb: number;
		maxMemoryMb: number;
	};
};
