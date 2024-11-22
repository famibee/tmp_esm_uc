/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2024-2024 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {defineConfig, externalizeDepsPlugin} from 'electron-vite'

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
		build: {
			rollupOptions: {
				input: {
					index: './src/main/main.ts',
				},
			},
		},
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
		build: {
			rollupOptions: {
				input: {
					preload: './src/preload/preload.ts',
				},
			},
		},
	},
	renderer: {},
});
