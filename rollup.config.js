import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import replace from '@rollup/plugin-replace';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';

import pkg from './package.json';

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.module,
			format: 'es',
			sourcemap: true
		}
	],
	plugins: [
		replace({
			"process.env.NODE_ENV": JSON.stringify("development"),
			preventAssignment: true
		}),
		external(),
		postcss({
			modules: true,
			plugins: [
				require('postcss-inline-svg'),
				require('postcss-svgo')
			]
		}),
		url(),
		svgr(),
		babel({
			exclude: 'node_modules/**',
			externalHelpers: true
		}),
		resolve({
			preferBuiltins: true
		}),
		nodePolyfills(),
		commonjs({
			include: /node_modules/,
			requireReturnsDefault: false,
			preventAssignment: true
		})
	]
};
