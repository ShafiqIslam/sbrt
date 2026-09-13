import {useEffect, useRef, useState} from 'react';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {spawn, type ChildProcess} from 'node:child_process';

type Status =
	| 'STARTING'
	| 'RUNNING'
	| 'STOPPING'
	| 'STOPPED'
	| 'ERROR'
	| string;

export function useSpringBoot() {
	const [logs, setLogs] = useState<string[]>([]);
	const [status, setStatus] = useState<Status>('STARTING');
	const [stopped, setStopped] = useState(false);

	const processRef = useRef<ChildProcess | undefined>();

	useEffect(() => {
		const child = spawn('./mvnw', ['spring-boot:run'], {
			cwd: process.cwd(),
			stdio: ['ignore', 'pipe', 'pipe'],
		});

		processRef.current = child;

		const handleOutput = (data: Buffer) => {
			const lines = data.toString().split(/\r?\n/).filter(Boolean);

			if (lines.length === 0) {
				return;
			}

			setLogs(previous => [...previous, ...lines].slice(-5000));
		};

		child.stdout?.on('data', handleOutput);
		child.stderr?.on('data', handleOutput);

		child.on('spawn', () => {
			setStatus('RUNNING');
		});

		child.on('error', error => {
			setStatus('ERROR');

			setLogs(previous => [
				...previous,
				`✗ Failed to start Spring Boot: ${error.message}`,
			]);
		});

		child.on('close', code => {
			processRef.current = undefined;

			setStatus(code === 0 ? 'STOPPED' : `EXITED ${code ?? ''}`.trim());
			setStopped(true);
		});

		return () => {
			if (processRef.current) {
				processRef.current.kill('SIGTERM');
				processRef.current = undefined;
			}
		};
	}, []);

	const stop = () => {
		const child = processRef.current;

		if (!child) {
			return;
		}

		setStatus('STOPPING');
		child.kill('SIGTERM');
	};

	const restart = () => {
		const triggerFile = join(
			process.cwd(),
			'src/main/resources/.restart.trigger',
		);

		try {
			writeFileSync(triggerFile, new Date().toISOString());

			setLogs(previous => [...previous, '→ Restart requested']);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);

			setLogs(previous => [...previous, `✗ Restart failed: ${message}`]);
		}
	};

	const clearLogs = () => {
		setLogs([]);
	};

	return {
		logs,
		status,
		stopped,
		stop,
		restart,
		clearLogs,
	};
}
