# OSS-DB Lab / Silver

スマートフォン向けの非公式OSS-DB Silver学習アプリ。HTML / CSS / JavaScriptのみで構成され、バックエンドやDBサーバーは不要。

## v2.2 の変更
- 運用110問・SQL75問・確認235問（420問）。設定・認証・バックアップ・DDL・制約・JSON PATH・DBオブジェクト・関数・トランザクションを補強。旧問題ID・保存キーを維持。
- 模試は公式10分野の重要度 4/4/2/5/5/7/7/13/2/1 に対応。確認問題に10分野の絞り込みと回答済・直近正解数を追加。
- 一部運用問題は単発模擬。公式12〜14基準と15以降の関数名の差に注意。合格保証はありません。

## v2.1 の変更（履歴）
- 全300問を維持し、運用管理は環境確認・起動・接続・確認・権限・設定・保守・バックアップ・停止・OS補足・障害対応の順に再構成。SQLは検索の基礎から集約・結合・関数・DDL・DML・トランザクションへ、確認問題は試験分野順に整理。
- 問題選択欄を章別に表示。問題ID・採点・進捗キー・試験範囲注釈・ランダム・復習・模試を維持。各問題の環境は独立し、状態は引き継がない。

## v2.0 の変更（履歴）
- 運用管理100問、SQL実践50問、確認150問（全300問）。新規運用問題は代表コマンドの単発模擬出力であり、実OSを操作しない。PostgreSQL専用SQLはSQLiteでは解答チェックを利用可能。
- 全モードにランダム・直近不正解の復習を追加。確認問題は分野別ランダム・複数選択、確認と模試の累積正答率を記録。50問模試は一般8・運用26・SQL16、終了後採点、時間制限なし。以前の正解記録は維持し、正答率は新規回答から計算。
- 公式範囲: https://oss-db.jp/outline/silver （PostgreSQL 12〜14基準の版差に注意）。非公式オリジナル問題、合格保証なし。

## v1.4 の変更（履歴）
- 運用管理11問・確認問題8問を追加。公式Silver Ver.3.0の範囲（S2.2、S2.5）を中心に、標準付属ツールとpg_ctlオプションを練習します。
- systemctlの8問を「試験範囲外・実務向け」、export/echoの2問を「関連知識」として課題名・問題画面・早見表に明記。既存のID・進捗は維持。
- pg_resetwal は -n の事前確認だけを模擬実行します。
- 参考： https://oss-db.jp/outline/silver / https://oss-db.jp/faq / https://www.postgresql.org/docs/16/app-pg-ctl.html

## v1.3 の変更（履歴）
- SQLエディタ直下に記号入力ボタン（;、\\、*、'、(、)）を追加。カーソル位置へ入力します。コロンによるセミコロン代用を廃止。
- 運用管理にsystemctl、停止モード、PGDATAなど14問を追加。Linuxのコマンド・オプションとpsqlメタコマンドは大小文字を区別します。既存の進捗IDは維持。

## v1.2 の変更（履歴）
- SQL実行ボタンでエンジンを自動起動。PostgreSQLが起動しない場合はSQLite（sql.js 1.13.0 asm.js、cdnjs）に切替。両者は別のDBで、文法・型・大小文字の挙動に違いがあります。起動不可の場合は解答チェック（SQL未実行）を表示します。
- SQLはWeb Worker内で実行。タイムアウト時はWorkerを停止し、再起動できます。
- ASCII全角文字を半角化、スマートクォートを変換、文末のコロンをセミコロンとして扱う。引用文字列の大小文字は維持し、PostgreSQLの :: キャストや文字列内のコロンは保持します。
- 運用管理では練習問題のコマンドの大小文字を無視して採点・模擬実行します。本物のLinuxやpsqlでは区別される場合があります。
- iPhone実機・実際のCDNからのエンジン起動は未確認。入力正規化の回帰テストを追加。

## v1.1 の変更
- 起動できないHTMLプレビュー向けに案内を常時表示し、JS起動成功時に消します。
- SQLの外部CDN起動に失敗した場合、解答チェックへ自動切替。手動でも選択可能。SQLは実行せず、模範解答のトークンを照合します（別解を不正解とする場合があります）。
- HTTPS公開版はService Workerで基本ファイルを保存し、初回の保存成功後にオフライン利用できる設計です。SQL実行エンジンはキャッシュ対象外。iPhoneのストレージ削除などで再取得が必要な場合があります。

## 使い方
- 運用管理：110問。Linuxシェルとpsqlを切り替える模擬ターミナルです。課題を切り替えると環境を初期化します。実際のOS、ファイル、PostgreSQLサーバーにアクセスしません。対応コマンドと代表的なオプションのみ実装しています。
- SQL実践：75問。PGlite 0.3.14（WebAssembly PostgreSQL）をjsDelivr CDNから読み込み、端末のメモリ内でSQLを実行します。初回起動には通信が必要です。問題選択・DB初期化で練習データを再作成します。実際のPostgreSQLと異なり、複数接続・サーバー管理等は対象外です。採点は練習データ上の結果照合であり、任意のSQLの意味的同値性を保証しません。複数列に同じ名前を使うSQLは採点が不正確なことがあります。
- 確認問題：235問。各問に解説があります。
- 早見表：検索可能。
- 進捗：localStorageに正解済みIDを記録（同じブラウザ・同じ公開URL）。データベースとターミナル状態は再読込で消えます。

## GitHub Pages で公開（無料の公開リポジトリ）
1. GitHubにログインし、`ossdb-lab` などの名前でPublicリポジトリを作成。
2. このZIPを解凍し、`index.html`, `style.css`, `lessons.js`, `simulator.js`, `sql-practice.js`, `app.js`, `sql-worker.js`, `icon.svg`, `icon.png`, `manifest.webmanifest`, `sw.js`, `README.md` をリポジトリのルートにアップロードしてコミット。
3. Settings → Pages → Build and deployment → Source: Deploy from a branch → main / (root) → Save。
4. Pagesに表示されたURLをiPhoneのSafariで開く。共有 → ホーム画面に追加。

静的ホスティングなので、EC2・RDSなどの契約は不要。リポジトリのソースは公開されるため、パスワード・本番DB情報・業務データを入れないでください。

ローカル確認：フォルダで `python -m http.server 8000` を実行し、PCのブラウザで http://localhost:8000 を開きます。単体HTML版も提供していますが、iPhoneの「ファイル」アプリによるHTMLプレビューではJavaScriptが実行されないことがあるためPagesを推奨。

## 改修する場所
| ファイル | 役割 |
|---|---|
| index.html | 画面の構造 |
| style.css | UI・スマホ表示 |
| lessons.js | 問題・ヒント・解答・SQL初期データ |
| simulator.js | 模擬ターミナルの実行ルールと状態管理 |
| sql-practice.js | 通信不要の模範解答照合（SQL実行なし） |
| sw.js / manifest.webmanifest | オフライン保存・Webアプリ設定 |
| app.js | UI、採点、進捗、PGlite接続 |
| icon.svg / icon.png | アイコン |
| tests/simulator.test.js | 全模範コマンドと基本状態遷移のテスト |
| build.py | 単体HTML版を生成（標準ライブラリのみ） |

問題データは配列で管理。新規問題には重複しないIDを付ける。既存IDは進捗に使われるので変更しない。

- `admin`: `[id, タイトル, 問題, ヒント, 解答コマンド, 解説, 'shell' または 'psql', オプション初期状態]`。新コマンドを追加する際は simulator.js の run / matches も実装。
- `sql`: `[id, タイトル, 問題, ヒント, 模範SQL, 順序を採点するか, 更新・DDL検証SQL(任意), 追加検証種別(任意)]`。
- `quiz`: `[id, タイトル, 問題, 選択肢配列, 正解の0始まりインデックス, 解説]`。

```js
['q19','設定','標準ポート番号は？',['3306','5432','8080','443'],1,'PostgreSQLのデフォルトは5432。']
```

## テストとビルド
```sh
node --check app.js
node tests/simulator.test.js
python build.py
```
単体HTML版は `ossdb-lab.html` として生成されます。分割版を改修した後に再生成してください。

## 既知の制限
管理コマンドは模擬。実機iPhone上での動作検証、およびCDNからPGliteをロードしてSQLを実行する結合試験は、この作成環境では未実施です。SQLは外部CDNに依存します。基本機能のPWAキャッシュは追加しましたが実機でのオフライン再起動は未検証です。同期・ログイン機能は未実装。

## 参考資料
- 公式試験範囲 https://oss-db.jp/outline/silver
- PostgreSQL 16 マニュアル https://www.postgresql.org/docs/16/
- PGlite https://pglite.dev/docs/
- GitHub Pages https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## v1.1 検証結果
Chromiumの390pxモバイル幅で単体HTMLを読み込み、管理26問、解答チェック20問、確認18問の模範解答と、CDN読み込み失敗時の切替、早見表検索を確認。進捗書き込みは模擬localStorageで確認。JS実行時エラーなし。実際の永続化、Service Workerのキャッシュ動作、iPhone実機、本物のPGlite起動は未検証。
