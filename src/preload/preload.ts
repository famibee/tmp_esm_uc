/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2024-2024 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {to_app} from '@famibee/skynovel_esm/preload';

import {contextBridge} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('etkAPI', electronAPI);
		contextBridge.exposeInMainWorld('to_app', to_app);
	} catch (e) {
		console.error(e);
	}
}
else {
	// @ts-ignore (define in dts)
	window.etkAPI = electronAPI;
	// @ts-ignore (define in dts)
	window.to_app = to_app;
}
