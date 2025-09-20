# Change Log

## v2.18.2
- cjs テンプレ v2.18.6 相当
- fix(src/main/main.ts): システムメニュー名をアプリ名になど修正
- fix(doc/prj/script/sub.sn)
	- [grp se=] がファイル存在エラーにならない件修正
		- テンプレ修正（新旧）効果音ファイル名→音声ファイル名
	- [page key]指定を追加
- fix(doc/prj/frames/_submenu.sn): 不要な[page key]指定を削除
- fix(doc/prj/theme/ext_lang.sn): 多言語対応データ、ボタンの「強制スキップ」「自動読み進み」について追記
- fix: ライブラリ更新
	- Bootstrap v5.3.3 -> v5.3.8 に更新
	- fix(package.json): electron-builder を <26.0.15 指定し固定
		- 最新 electron-builder@26.0.20(beta) だとエラーになるため
		- ✅ v26.0.15 ok
		- ❌ v26.0.16 GH_TOKEN err
		- ❌ v26.0.17 nor using env "GH_TOKEN"
		- ❌ v26.0.18 Command failed: which python
		- ❌ v26.0.19 Command failed: which python
		- ❌ v26.0.20 Command failed: which python
-fix: 【 chk_exist_tw=true】削除
## v2.18.1 相当に更新（2025-05-11）
- fix: humane でエラーが出ていたのを修正
## v2.18.0
### 2025-01-10
- vite 6 系だと electron-vite によりバッチファイル系でエラーがわかりにくいのでしばし 5.4.11 で
### 2024-12-25
- electron-vite がサポートするまで、vite は 5 で
	- Vite 6 support · Issue #673 · alex8088/electron-vite https://github.com/alex8088/electron-vite/issues/673
### 2024-12-24
- vite の public フォルダではなく、既存の doc フォルダ名に合わせる
	- （既知の問題）ロード画面で画像ロード失敗する
### 2024-11-25
- web版でタイトル画面表示まで
### 2024-11-23
- Initial commit (ESM版として)
