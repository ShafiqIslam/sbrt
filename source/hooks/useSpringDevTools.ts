import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {RestartMode} from '../types.js';

export function useSpringDevTools() {
	const envPath = join(process.cwd(), '.env');

	let restartEnabled = false;
	let triggerFile: string | undefined;

	if (existsSync(envPath)) {
		const env = readFileSync(envPath, 'utf8');

		const restartMatch = env.match(/^SPRING_DEVTOOLS_RESTART_ENABLED=(.*)$/m);
		restartEnabled = restartMatch?.[1]?.trim() === 'true';

		const trigMatch = env.match(/^SPRING_DEVTOOLS_RESTART_TRIGGER_FILE=(.*)$/m);
		triggerFile = trigMatch?.[1]?.trim() || undefined;
	}

	const restartMode: RestartMode = !restartEnabled
		? 'UNAVAILABLE'
		: triggerFile
		? 'MANUAL'
		: 'AUTO';

	return {
		restartMode,
		triggerFile,
	};
}
