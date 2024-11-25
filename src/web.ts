/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2018-2024 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import type {HPlugin} from '@famibee/skynovel_esm/web';
const hPlg: HPlugin = {};
import h from './plugin.json';
for (const nm in h) hPlg[nm] = await import(`./plugin/${nm}/index.ts`);

const {SysWeb} = await import('@famibee/skynovel_esm/web');
new SysWeb(hPlg);	// 拡張機能で【(hPlg);】置換するので触らない
