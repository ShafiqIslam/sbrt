import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {spawn, type ChildProcess} from 'node:child_process';
import {ResourceConfig, RestartMode, Status} from '../types.js';
import {
	DEFAULT_RESOURCE_CONFIG,
	LOGS_MAX_LINES,
	SBRT_LOG_PREFIX,
} from '../consts.js';

export function useSpringBoot(
	restartMode: RestartMode,
	triggerFilePath: string | undefined,
	config: Partial<ResourceConfig> | undefined,
) {
	const [logs, setLogs] = useState<string[]>([]);
	const [status, setStatus] = useState<Status>('STARTING');

	const processRef = useRef<ChildProcess | undefined>();
	const restartingRef = useRef(false);

	const addLogs = useCallback((...lines: string[]) => {
		setLogs(previous => [...previous, ...lines].slice(-LOGS_MAX_LINES));
	}, []);

	const addUserLogs = useCallback(
		(...lines: string[]) => {
			const separator =
				'=============================================================================';
			const newLines = [separator, ...lines, separator];
			addLogs(...newLines.map(line => `${SBRT_LOG_PREFIX} ${line}`));
		},
		[addLogs],
	);

	const resourceConfig: ResourceConfig = useMemo(() => {
		return {
			java: {
				...DEFAULT_RESOURCE_CONFIG.java,
				...config?.java,
			},
		};
	}, [config]);

	const start = useCallback(() => {
		setStatus('STARTING');

		const jvmArguments = [
			`-Xms${resourceConfig.java.initialMemoryMb}m`,
			`-Xmx${resourceConfig.java.maxMemoryMb}m`,
		].join(' ');

		const child = spawn(
			'./mvnw',
			['spring-boot:run', `-Dspring-boot.run.jvmArguments=${jvmArguments}`],
			{
				cwd: process.cwd(),
				stdio: ['ignore', 'pipe', 'pipe'],
			},
		);

		addUserLogs(`→ Starting Spring Boot with JVM arguments: ${jvmArguments}`);

		processRef.current = child;

		const handleOutput = (data: Buffer) => {
			const lines = data.toString().split(/\r?\n/).filter(Boolean);

			if (lines.length > 0) {
				addLogs(...lines);
			}
		};

		child.stdout?.on('data', handleOutput);
		child.stderr?.on('data', handleOutput);

		child.on('spawn', () => {
			setStatus('RUNNING');
		});

		child.on('error', error => {
			setStatus('ERROR');
			addUserLogs(`✗ Failed to start Spring Boot: ${error.message}`);
		});

		child.on('close', code => {
			processRef.current = undefined;

			if (!restartingRef.current) {
				setStatus(`EXITED ${code ?? ''}`.trim());
			}
		});
	}, [addLogs, addUserLogs]);

	useEffect(() => {
		start();

		return () => {
			processRef.current?.kill('SIGTERM');
		};
	}, [start]);

	const stopAndWait = useCallback((): Promise<void> => {
		const child = processRef.current;

		if (!child) {
			return Promise.resolve();
		}

		setStatus('STOPPING');

		return new Promise(resolve => {
			const handleClose = () => {
				child.removeListener('close', handleClose);

				if (processRef.current === child) {
					processRef.current = undefined;
				}

				resolve();
			};

			child.once('close', handleClose);
			child.kill('SIGTERM');
		});
	}, []);

	const stop = useCallback(
		async (onStop: () => void) => {
			addUserLogs('→ Quit requested');
			await stopAndWait();
			onStop();
		},
		[stopAndWait, addUserLogs],
	);

	const restart = useCallback(() => {
		if (restartMode !== 'MANUAL') {
			addUserLogs('✗ Restart failed: restart is only available in MANUAL mode');
			return;
		}

		if (!triggerFilePath) {
			addUserLogs('✗ Restart failed: trigger file path is not defined');
			return;
		}

		const triggerFile = join(
			process.cwd(),
			`src/main/resources/${triggerFilePath}`,
		);

		try {
			writeFileSync(triggerFile, new Date().toISOString());

			addUserLogs('→ Restart requested');
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);

			addUserLogs(`✗ Restart failed: ${message}`);
		}
	}, [addUserLogs]);

	const clean = useCallback((): Promise<void> => {
		return new Promise(resolve => {
			setStatus('CLEANING');

			const child = spawn('./mvnw', ['clean'], {
				cwd: process.cwd(),
				stdio: ['ignore', 'pipe', 'pipe'],
			});

			const handleOutput = (data: Buffer) => {
				const lines = data.toString().split(/\r?\n/).filter(Boolean);

				if (lines.length > 0) {
					addLogs(...lines);
				}
			};

			child.stdout?.on('data', handleOutput);
			child.stderr?.on('data', handleOutput);

			child.on('close', code => {
				if (code !== 0) {
					addUserLogs(`✗ mvnw clean exited with code ${code ?? 'unknown'}`);
				}

				resolve();
			});

			child.on('error', error => {
				addUserLogs(`✗ Failed to run mvnw clean: ${error.message}`);
				resolve();
			});
		});
	}, [addLogs, addUserLogs]);

	const cleanRestart = useCallback(async () => {
		restartingRef.current = true;

		addUserLogs('→ Clean restart requested');

		await stopAndWait();
		await clean();

		restartingRef.current = false;

		start();
	}, [addUserLogs, clean, start, stopAndWait]);

	const clearLogs = () => {
		setLogs([]);
	};

	return {
		logs,
		status,
		stop,
		restart,
		cleanRestart,
		clearLogs,
	};
}
