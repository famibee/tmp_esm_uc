/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2018-2025 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

// electron メインプロセス
import {crashReporter, app, BrowserWindow, Menu} from 'electron'
import {join} from 'path'
import {electronApp, optimizer, is, platform} from '@electron-toolkit/utils'

const pp_path = join(__dirname, '../../');
const pkg = require(pp_path +'package.json');
app.name = pkg.name;	// 非パッケージだと 'Electron' になる件対応
app.setPath('userData', app.getPath('appData') +'/'+ app.name);

crashReporter.start({
	productName	: app.name,
	companyName	: "電子演劇部",
	submitURL	: pkg.homepage,
	compress	: true,
});
if (! app.requestSingleInstanceLock()) app.quit();
app.on('window-all-closed', ()=> app.quit());

let guiWin: BrowserWindow | null = null;
app.on('second-instance', ()=> {
	if (! guiWin) return;

	if (guiWin.isMinimized()) guiWin.restore();
	guiWin.focus();
});
app.whenReady().then(async ()=> {
	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron');

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, win)=> {
		optimizer.watchWindowShortcuts(win);
	});

	const w = guiWin = (await import('@famibee/skynovel_esm/appMain')).appMain.initRenderer(
		join(__dirname, '../preload/preload.mjs'),
		pkg.version,
	);
	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	const urlEr = process.env['ELECTRON_RENDERER_URL'];
	if (is.dev && urlEr) w.loadURL(urlEr);
	else w.loadFile(join(__dirname, '../renderer/index.html'));
	// else w.loadFile('./index.html');		とかはダメ（2025/01/05）

	const isMac = platform.isMacOS;
	const menu = Menu.buildFromTemplate([{
		label: 'システム',
		submenu: [
			{label: 'このアプリについて', click: ()=> require('about-window').default({
				icon_path	: join(__dirname, '../renderer/icon.png'),
				package_json_dir	: pp_path,
				copyright	: 'Copyright '+ pkg.appCopyright +' 2025',
				homepage	: pkg.homepage,
				license		: '',
				use_version_info	: false,
			})},
			{type: 'separator'},
			{label: '設定', click: ()=> w.webContents.send('fire', 'c'), accelerator: "CmdOrCtrl+,"},
			{label: '全画面/ウインドウモード切替', click: ()=> w.webContents.send('fire', 'alt+enter'), accelerator: 'F11'},
			{label: 'ウインドウサイズを初期に戻す', click: ()=> w.webContents.send('fire', 'Meta+0')},
			{type: 'separator'},
			{label: 'メッセージを消す', click: ()=> w.webContents.send('fire', ' ')},
			{label: 'メッセージ履歴の表示', click: ()=> w.webContents.send('fire', 'r')},
			{label: '次の選択肢・未読まで進む', click: ()=> w.webContents.send('fire', 'f')},
			{label: '自動的に読み進む', click: ()=> w.webContents.send('fire', 'a')},
			{type: 'separator'},
			{label: 'DevTools', click: ()=> w.webContents.openDevTools(), accelerator: 'F12'},
			isMac ?{role: 'close'} :{role: 'quit'},
		],
	}]);
	Menu.setApplicationMenu(menu);
});
