/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2024-2024 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import type {ElectronAPI} from '@electron-toolkit/preload'
const etkAPI = (window as any).etkAPI as ElectronAPI;

import type {HPlugin} from '@famibee/skynovel_esm/app';
const hPlg: HPlugin = {};
import h from '../plugin.json';


window.addEventListener('DOMContentLoaded', async ()=> {

console.log(`fn:renderer.ts line:22 etkAPI:%o h:%o hPlg:%o`, etkAPI, h, hPlg);

	// for (const nm in h) hPlg[nm] = await import(`./plugin/${nm}/index.ts`);
		// 有効にすると「send IPC」が効かなくなる
	const {SNApp} = await import('@famibee/skynovel_esm/app');
	new SNApp;
	// // new SNApp(hPlg);	// 拡張機能で【(hPlg);】置換するので触らない

console.log(`fn:renderer.ts line:31 ===`);

	function replaceText(sel: string, txt: string): void {
		const el = document.querySelector<HTMLElement>(sel);
		if (el) el.innerText = txt;
	}
	const ver = etkAPI.process.versions
	replaceText('.electron-version', `Electron v${ver.electron}`);
	replaceText('.chrome-version', `Chromium v${ver.chrome}`);
	replaceText('.node-version', `Node v${ver.node}`);

	const hdlIpcBtn = document.getElementById('ipcHandler');
	if (hdlIpcBtn) hdlIpcBtn.addEventListener('click', ()=> {
		etkAPI.ipcRenderer.send('ping');
	});
console.log(`fn:renderer.ts line:42 == END ==`);

});
