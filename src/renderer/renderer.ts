/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2024-2024 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import type {HPlugin} from '@famibee/skynovel_esm/app';
const hPlg: HPlugin = {};
import h from '../plugin.json';

globalThis.addEventListener('DOMContentLoaded', async ()=> {
	for (const nm in h) hPlg[nm] = await import(`../plugin/${nm}/index.ts`);
	const {SysApp} = await import('@famibee/skynovel_esm/app');
	new SysApp(hPlg);	// 拡張機能で【(hPlg);】置換するので触らない

}, {once: true, passive: true});
