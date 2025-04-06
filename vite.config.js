import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		watch: false,
		silent: true,
		verbose: false,
		reporters: [
			'default',
		],
		include: [
			'**/test/**/*.test.js',
		],
		exclude: [...configDefaults.exclude, '**/build/**', '**/src/public'],
		coverage: {
			enabled: true,
			reporters: ['lcov'],
			reportsDirectory: './coverage',
			thresholds: {
				lines: 100,
				statements: 100,
				branches: 100,
				functions: 100,
				perFile: true,
				autoUpdate: true,
			},
			include: ['**/src/**/*.js'],
			exclude: [...configDefaults.coverage.exclude, '**/build/**', '**/src/public', 'src/server.js'],
		},
		bail: 1,
	},
});
