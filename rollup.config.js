import resolve from '@rollup/plugin-node-resolve';

export default [
    {
		input: 'src/main.js',
		output: [
			{ file: 'dist/network-receipt-printer.cjs', format: 'cjs' },
			{ file: 'dist/network-receipt-printer.mjs', format: 'es' }
		],
		plugins: [
			resolve()
		]
	}
];
