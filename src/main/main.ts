/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2018-2025 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

// electron メインプロセス
import {crashReporter, app, type BrowserWindow, Menu} from 'electron';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {electronApp, optimizer, is, platform} from '@electron-toolkit/utils';

// vite-plugin-electron は main を ESM(.js) で出力するため、
// electron-vite が自動注入していた __dirname / require を自前で用意する
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const {default: openAboutWindow} = require('about-window');

const package_json_dir = resolve(__dirname, '../../');
import pkg from '../../package.json' with {type: 'json'};
app.name = pkg.name;	// 非パッケージだと 'Electron' になる件対応
app.setPath('userData', app.getPath('appData') +'/'+ app.name);

// メニューの「このアプリについて」のデザイン
// electron-vite 固有の `?url&asset` クエリを廃止し、Node の実パスで解決する
const icon_path = resolve(__dirname, '../../doc/icon.png');
const css_path = resolve(__dirname, '../../src/main/about-window.css');


crashReporter.start({
	productName	: app.name,
	companyName	: pkg.publisher,
	submitURL	: pkg.homepage,
	compress	: true,
});
if (! app.requestSingleInstanceLock()) app.quit();

let guiWin: BrowserWindow | null = null;
app.on('second-instance', ()=> {
	if (! guiWin) return;

	if (guiWin.isMinimized()) guiWin.restore();
	guiWin.focus();
});
app.whenReady().then(async ()=> {
	// dev起動時の Electron Security Warning(CSPのunsafe-eval等)を抑制。
	// パッケージ後はどちらにせよ警告自体が出ないため is.dev 限定でOK。
	if (is.dev) process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

	// Set app user model id for windows
	electronApp.setAppUserModelId(pkg.appId);

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, win)=> optimizer.watchWindowShortcuts(win));

	const {appMain} = await import('@famibee/skynovel_esm/appMain');
	const w = guiWin = appMain.initRenderer(
		resolve(__dirname, '../preload/preload.mjs'),
		pkg.version,
	)
	.on('close', ()=> app.exit());

	// HMR for renderer base on vite-plugin-electron.
	// Load the remote URL for development or the local html file for production.
	const urlEr = process.env['VITE_DEV_SERVER_URL'];
	if (is.dev && urlEr) w.loadURL(urlEr);
	else w.loadFile(resolve(__dirname, '../renderer/index.html'));

	const isMac = platform.isMacOS;
	const wc = w.webContents;
	const menu = Menu.buildFromTemplate([{
		label: app.name,
		submenu: [
			{label: 'このアプリについて', click: ()=> openAboutWindow({
				icon_path,
				package_json_dir,
				copyright	: 'Copyright '+ pkg.appCopyright +' 2025',
				// description	: ' ',	// 詳細が不要ならコメントイン
				license		: '',
				use_version_info	: false,
				css_path,
			})},
			{type: 'separator'},
			{label: '設定', click: ()=> wc.send('fire', 'c'), accelerator: "CmdOrCtrl+,"},
			{label: '全画面/ウインドウモード切替', click: ()=> wc.send('fire', 'alt+enter'), accelerator: 'F11'},
			{label: 'ウインドウサイズを初期に戻す', click: ()=> wc.send('fire', 'Meta+0')},
			{type: 'separator'},
			{label: 'メッセージを消す', click: ()=> wc.send('fire', ' ')},
			{label: 'メッセージ履歴の表示', click: ()=> wc.send('fire', 'r')},
			{label: '次の選択肢・未読まで進む', click: ()=> wc.send('fire', 'f')},
			{label: '自動的に読み進む', click: ()=> wc.send('fire', 'a')},
			{type: 'separator'},
			{label: 'DevTools', click: ()=> wc.openDevTools(), accelerator: 'F12'},
			isMac ?{role: 'close'} :{role: 'quit'},
		],
	}]);
	Menu.setApplicationMenu(menu);
});
