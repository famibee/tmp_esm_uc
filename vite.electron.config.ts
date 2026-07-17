/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2024-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

// electron-vite から Vite + vite-plugin-electron へ移行した設定。
// main / preload / renderer をこの1ファイルで面倒みる。
import {defineConfig} from 'vite';
import electron from 'vite-plugin-electron/simple';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {CustomHmr} from './src/CustomHmr';
import pkg from './package.json' with {type: 'json'};

// root: 'src/renderer' の影響を受けないよう、entry は絶対パスで指定する
const __dirname = dirname(fileURLToPath(import.meta.url));

// package.json の dependencies は bundle せず require/import 解決に任せる
// (electron-vite の externalizeDeps: true 相当)
// Rollup の external は既定で完全一致判定なので、
// import('@famibee/skynovel_esm/appMain') のようなサブパスも
// external 扱いにできるよう関数化する。
const externalPackages = [
	'electron',
	...Object.keys(pkg.dependencies ?? {}),
];
const external = (id: string) => externalPackages.some(
	name => id === name || id.startsWith(name + '/'),
);

// dev中の自動起動は、main/preload のうち実際に後から完了した方の onstart だけが使われる
// (mainはpreloadよりバンドルが大きく、完了順が不定になる)。
// デフォルトは cwd: server.config.root (= 'src/renderer') で `electron .` を
// 実行してしまうため、両方に同じ onstart を付けて起動先を明示的に上書きする。
let launched = false;
async function onstart({startup}: {startup: (argv?: string[]) => Promise<boolean>}) {
	if (launched) return; // main/preload 両方から呼ばれても二重起動しない
	launched = true;
	await startup([__dirname, '--no-sandbox']);
}

export default defineConfig({
	root: 'src/renderer',
	base: './',
	publicDir: '../../doc',
	build: {
		outDir: '../../out/renderer',
		target: 'esnext',
		emptyOutDir: true,
	},
	plugins: [
		CustomHmr(),
		electron({
			main: {
				// Shortcut of `build.lib.entry`
				entry: join(__dirname, 'src/main/main.ts'),
				onstart,
				vite: {
					build: {
						// outDir も相対パスだと root: 'src/renderer' 基準で解決されてしまうので絶対パス化
						outDir: join(__dirname, 'out/main'),
						target: 'esnext',
						rolldownOptions: {
							external,
							output: {
								format: 'es',
								// package.json "main": "out/main/index.js" と合わせる
								entryFileNames: 'index.js',
							},
						},
					},
				},
			},
			preload: {
				// Shortcut of `build.rolldownOptions.input`
				input: join(__dirname, 'src/preload/preload.ts'),
				onstart,
				vite: {
					build: {
						outDir: join(__dirname, 'out/preload'),
						target: 'esnext',
						rolldownOptions: {
							external,
							output: {
								format: 'es',
								entryFileNames: '[name].mjs',
							},
						},
					},
				},
			},
			// renderer は preload 経由の contextBridge のみで完結しているため未使用
		}),
	],
});
