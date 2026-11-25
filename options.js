/* PostgreSQL 14 standard command-line tools: selected study options */
window.OPTION_REFERENCE={
  "data": {
    "pg_ctl": [
      [
        "-D",
        "--pgdata",
        "保存先",
        "操作対象のDBクラスタのデータディレクトリを指定。PGDATAが設定済みなら省略可能。",
        "pg_ctl -D /var/lib/postgresql/data status"
      ],
      [
        "-w",
        "--wait",
        "完了待ち",
        "起動・停止・再起動の完了を待つ。標準動作なので通常は省略可能。バッチでも明示することがある。",
        "pg_ctl -w start"
      ],
      [
        "-W",
        "--no-wait",
        "待たない",
        "起動などを指示したら完了を待たずに戻る。後続SQLの前に別途接続可能か確認する。",
        "pg_ctl -W start"
      ],
      [
        "-t",
        "--timeout",
        "待機時間",
        "完了を待つ上限を秒で指定。PGCTLTIMEOUT未設定なら既定60秒。時間切れでもサーバー側の処理が続く場合がある。",
        "pg_ctl -t 30 start"
      ],
      [
        "-l",
        "--log",
        "起動ログ",
        "サーバーの出力を指定ファイルに追記する。起動失敗の原因調査に便利。",
        "pg_ctl -l server.log start"
      ],
      [
        "-m",
        "--mode",
        "停止方法",
        "smart（接続終了を待つ）、fast（接続を切って安全に停止・既定）、immediate（強制停止・次回復旧処理）を選ぶ。",
        "pg_ctl stop -m fast"
      ],
      [
        "-s",
        "--silent",
        "表示を抑える",
        "通常の進行メッセージを減らす。エラーは表示する。",
        "pg_ctl -s status"
      ],
      [
        "-o",
        "--options",
        "サーバー起動オプション",
        "postgresへ起動オプションを渡す。例では一時的にポートを5433にする。",
        "pg_ctl -o '-p 5433' start"
      ]
    ],
    "psql": [
      [
        "-d",
        "--dbname",
        "DB名",
        "接続したいデータベースを指定。",
        "psql -d lab"
      ],
      [
        "-U",
        "--username",
        "DBユーザー",
        "接続時に使用するDBロール名を指定。",
        "psql -U postgres -d lab"
      ],
      [
        "-h",
        "--host",
        "接続先",
        "DBサーバーのホスト名またはIPアドレスなどを指定。",
        "psql -h localhost -d lab"
      ],
      [
        "-p",
        "--port",
        "ポート番号",
        "接続するポートを指定。標準は通常5432。",
        "psql -p 5432 -d lab"
      ],
      [
        "-c",
        "--command",
        "単発実行",
        "SQLや1つのメタコマンドを実行して終了。件数確認などのバッチに便利。",
        "psql -d lab -c 'SELECT COUNT(*) FROM users;'"
      ],
      [
        "-f",
        "--file",
        "SQLファイル",
        "ファイル内のSQLを実行して終了。初期化・移行・定期処理に使う。",
        "psql -d lab -f setup.sql"
      ],
      [
        "-v",
        "--set / --variable",
        "変数設定",
        "psqlの変数を設定。ON_ERROR_STOP=1ならSQLエラー時に処理を止める。",
        "psql -v ON_ERROR_STOP=1 -d lab -f setup.sql"
      ],
      [
        "-w",
        "--no-password",
        "パスワード入力なし",
        "パスワードを対話入力しない。認証情報が必要なら.pgpassなどを安全に設定する。",
        "psql -w -d lab"
      ],
      [
        "-W",
        "--password",
        "パスワード入力",
        "接続前にパスワード入力を促す。",
        "psql -W -d lab"
      ],
      [
        "-X",
        "--no-psqlrc",
        "初期設定を読まない",
        "個人のpsql設定の影響を避ける。バッチや復元の再現性向上に便利。",
        "psql -X -d lab -f setup.sql"
      ],
      [
        "-o",
        "--output",
        "結果出力先",
        "問い合わせ結果を指定ファイルに書き出す。",
        "psql -d lab -o result.txt -c 'SELECT * FROM users;'"
      ],
      [
        "-A",
        "--no-align",
        "整形なし",
        "表の幅を揃えない形式で出力。機械処理しやすくする。",
        "psql -A -d lab -c 'SELECT * FROM users;'"
      ],
      [
        "-t",
        "--tuples-only",
        "行だけ",
        "列名や件数などを省いて値を出す。シェル変数へ結果を取り込むときに便利。",
        "psql -At -d lab -c 'SELECT COUNT(*) FROM users;'"
      ],
      [
        "-F",
        "--field-separator",
        "区切り文字",
        "非整列出力の列の区切り文字を指定する。CSVなら--csvも検討する。",
        "psql -A -F '|' -d lab -c 'SELECT * FROM users;'"
      ],
      [
        "-1",
        "--single-transaction",
        "一括トランザクション",
        "-c/-fの処理全体を1つのトランザクションで囲む。ON_ERROR_STOP=1を併用すると失敗時に取り消せる。",
        "psql -1 -v ON_ERROR_STOP=1 -d lab -f setup.sql"
      ],
      [
        "-V",
        "--version",
        "クライアント版",
        "手元のpsqlの版を表示。DBサーバー版とは別。",
        "psql -V"
      ]
    ],
    "pg_dump": [
      [
        "-d",
        "--dbname",
        "対象DB",
        "バックアップするDB名。",
        "pg_dump -d lab -f lab.sql"
      ],
      [
        "-f",
        "--file",
        "出力先",
        "バックアップを保存するファイル名またはディレクトリ名。",
        "pg_dump -d lab -f lab.sql"
      ],
      [
        "-F",
        "--format",
        "形式選択",
        "p=SQL（既定）、c=カスタム、d=ディレクトリ、t=tar。SQL形式はpsql、他はpg_restoreで復元。",
        "pg_dump -Fc -d lab -f lab.dump"
      ],
      [
        "-Fp",
        "--format=plain",
        "SQL形式",
        "SQL文として出力。中身をテキストで読める。",
        "pg_dump -Fp -d lab -f lab.sql"
      ],
      [
        "-Fc",
        "--format=custom",
        "カスタム形式",
        "復元時に対象を選びやすい専用形式。通常は圧縮される。",
        "pg_dump -Fc -d lab -f lab.dump"
      ],
      [
        "-Fd",
        "--format=directory",
        "ディレクトリ形式",
        "複数ファイルで保存。並列ダンプに対応。出力先は存在しないディレクトリを指定。",
        "pg_dump -Fd -d lab -f labdir"
      ],
      [
        "-Ft",
        "--format=tar",
        "tar形式",
        "tarアーカイブで保存する。",
        "pg_dump -Ft -d lab -f lab.tar"
      ],
      [
        "-s",
        "--schema-only",
        "定義だけ",
        "CREATE TABLEなどの構造のみ保存。行データは含まない。",
        "pg_dump -s -d lab -f schema.sql"
      ],
      [
        "-a",
        "--data-only",
        "データだけ",
        "表の行やシーケンス値などのデータを保存。定義は含まない。",
        "pg_dump -a -d lab -f data.sql"
      ],
      [
        "-t",
        "--table",
        "表指定",
        "特定のテーブルなどに絞る。関連オブジェクトの依存関係に注意。",
        "pg_dump -t users -d lab -f users.sql"
      ],
      [
        "-n",
        "--schema",
        "スキーマ指定",
        "指定したスキーマに絞ってバックアップする。",
        "pg_dump -n public -d lab -f public.sql"
      ],
      [
        "-j",
        "--jobs",
        "並列処理",
        "複数の作業でバックアップする。pg_dumpではディレクトリ形式のみ対応。",
        "pg_dump -Fd -j 4 -d lab -f labdir"
      ],
      [
        "-v",
        "--verbose",
        "詳細表示",
        "処理の進み具合などを標準エラー出力へ表示する。",
        "pg_dump -v -d lab -f lab.sql"
      ],
      [
        "-h",
        "--host",
        "接続先",
        "バックアップ元DBのホスト。",
        "pg_dump -h localhost -d lab -f lab.sql"
      ],
      [
        "-p",
        "--port",
        "ポート",
        "バックアップ元DBのポート。",
        "pg_dump -p 5432 -d lab -f lab.sql"
      ],
      [
        "-U",
        "--username",
        "DBユーザー",
        "バックアップに使用するDBユーザー。必要な読取権限を持つこと。",
        "pg_dump -U postgres -d lab -f lab.sql"
      ]
    ],
    "pg_restore": [
      [
        "-d",
        "--dbname",
        "復元先DB",
        "復元するDBを指定。通常は先に復元先DBを用意する。",
        "pg_restore -d backup_lab lab.dump"
      ],
      [
        "-l",
        "--list",
        "目次表示",
        "アーカイブの内容一覧を確認するだけ。まだ復元しない。",
        "pg_restore -l lab.dump"
      ],
      [
        "-L",
        "--use-list",
        "目次から選択",
        "編集した目次ファイルで復元対象と順序を指定する。",
        "pg_restore -L selected.list -d backup_lab lab.dump"
      ],
      [
        "-t",
        "--table",
        "表指定",
        "指定した表などを復元対象にする。依存するオブジェクトは別途確認。",
        "pg_restore -t users -d backup_lab lab.dump"
      ],
      [
        "-s",
        "--schema-only",
        "定義だけ",
        "データを入れず、構造のみを復元する。",
        "pg_restore -s -d backup_lab lab.dump"
      ],
      [
        "-a",
        "--data-only",
        "データだけ",
        "既存の表にデータなどを復元する。",
        "pg_restore -a -d backup_lab lab.dump"
      ],
      [
        "-j",
        "--jobs",
        "並列復元",
        "複数作業で復元時間短縮を図る。カスタム・ディレクトリ形式に対応。",
        "pg_restore -j 4 -d backup_lab lab.dump"
      ],
      [
        "-e",
        "--exit-on-error",
        "エラーで停止",
        "SQLエラー時に処理を中止する。以前に確定した変更は別。",
        "pg_restore -e -d backup_lab lab.dump"
      ],
      [
        "-c",
        "--clean",
        "既存を削除",
        "復元対象の既存オブジェクトを先にDROPする。既存データが消えるため注意。",
        "pg_restore -c -d backup_lab lab.dump"
      ],
      [
        "-C",
        "--create",
        "DBも作る",
        "バックアップに記録された名前のDBを作って復元する。-dは最初の接続先。",
        "pg_restore -C -d postgres lab.dump"
      ],
      [
        "-f",
        "--file",
        "SQL出力",
        "復元用SQLなどをファイルへ出力する。DBへ直接復元する指定ではない。",
        "pg_restore -f restore.sql lab.dump"
      ]
    ],
    "pg_dumpall": [
      [
        "-f",
        "--file",
        "出力ファイル",
        "クラスタ内全DBとグローバルオブジェクトをSQL形式で保存する。",
        "pg_dumpall -f all.sql"
      ],
      [
        "-g",
        "--globals-only",
        "共有情報のみ",
        "ロール・表領域など、クラスタ共通の情報だけを保存する。",
        "pg_dumpall -g -f globals.sql"
      ],
      [
        "-r",
        "--roles-only",
        "ロールのみ",
        "ロール情報だけ保存する。機密情報の保管に注意。",
        "pg_dumpall -r -f roles.sql"
      ],
      [
        "-s",
        "--schema-only",
        "定義のみ",
        "データを含まず定義を出力する。",
        "pg_dumpall -s -f schemas.sql"
      ],
      [
        "-a",
        "--data-only",
        "データのみ",
        "定義を含まずデータを出力する。",
        "pg_dumpall -a -f data.sql"
      ]
    ],
    "pg_basebackup": [
      [
        "-D",
        "--pgdata",
        "保存先",
        "物理バックアップの保存先を指定。既存なら空のディレクトリが必要。",
        "pg_basebackup -D /tmp/basebackup"
      ],
      [
        "-X",
        "--wal-method",
        "WAL取得方法",
        "stream（既定、同時受信）、fetch（最後に取得）、none（含めない）を選ぶ。復旧に必要なWALを確保すること。",
        "pg_basebackup -D /tmp/basebackup -X stream"
      ],
      [
        "-F",
        "--format",
        "保存形式",
        "p=通常のディレクトリ形式（既定）、t=tar形式。pg_dumpの形式指定とは異なる。",
        "pg_basebackup -D /tmp/basebackup -Ft"
      ],
      [
        "-P",
        "--progress",
        "進捗表示",
        "バックアップの進行状況を表示する。",
        "pg_basebackup -D /tmp/basebackup -P"
      ],
      [
        "-R",
        "--write-recovery-conf",
        "レプリカ設定",
        "スタンバイ用の設定を作成する。PG12以降ではstandby.signalなどを作成。",
        "pg_basebackup -D /tmp/basebackup -R"
      ],
      [
        "-h",
        "--host",
        "接続先",
        "バックアップ元のホストを指定する。",
        "pg_basebackup -h localhost -D /tmp/basebackup"
      ],
      [
        "-U",
        "--username",
        "DBユーザー",
        "バックアップ接続に利用するロール。REPLICATION権限などが必要。",
        "pg_basebackup -U postgres -D /tmp/basebackup"
      ]
    ],
    "vacuumdb": [
      [
        "-d",
        "--dbname",
        "対象DB",
        "保守対象のDBを指定。",
        "vacuumdb -d lab"
      ],
      [
        "-t",
        "--table",
        "対象表",
        "保守対象を特定の表に絞る。",
        "vacuumdb -d lab -t users"
      ],
      [
        "-z",
        "--analyze",
        "VACUUM＋ANALYZE",
        "不要領域を再利用できるようにし、検索方法を選ぶ統計も更新する。",
        "vacuumdb -d lab -z"
      ],
      [
        "-Z",
        "--analyze-only",
        "ANALYZEだけ",
        "統計情報のみ更新。VACUUMはしない。",
        "vacuumdb -d lab -Z"
      ],
      [
        "-f",
        "--full",
        "VACUUM FULL",
        "表を書き直して不要領域をOSに返す。強いロックが必要なので計画保守向け。",
        "vacuumdb -d lab -f"
      ],
      [
        "-a",
        "--all",
        "全DB",
        "クラスタ内の接続可能なDBをまとめて保守する。",
        "vacuumdb -a"
      ],
      [
        "-j",
        "--jobs",
        "並列処理",
        "複数の接続で複数の表を保守する。負荷に注意。",
        "vacuumdb -d lab -j 2"
      ]
    ],
    "initdb": [
      [
        "-D",
        "--pgdata",
        "保存先",
        "新しいクラスタのデータディレクトリを指定する。",
        "initdb -D /tmp/newpg"
      ],
      [
        "-E",
        "--encoding",
        "文字コード",
        "新しいクラスタの標準文字コードを設定する。",
        "initdb -D /tmp/newpg -E UTF8"
      ],
      [
        "-U",
        "--username",
        "管理ロール名",
        "初期のDBスーパーユーザー名を指定する。OSユーザー名とは別。",
        "initdb -D /tmp/newpg -U postgres"
      ],
      [
        "-W",
        "--pwprompt",
        "パスワード入力",
        "初期管理ロールのパスワードを対話入力する。",
        "initdb -D /tmp/newpg -W"
      ],
      [
        "-A",
        "--auth",
        "認証方式",
        "初期のpg_hba.confの認証方法を指定。セキュリティ要件に応じて選ぶ。",
        "initdb -D /tmp/newpg -A scram-sha-256 -W"
      ],
      [
        "--locale",
        "--locale",
        "ロケール",
        "文字の並び順や分類などの初期設定。OSで使えるロケールを指定する。",
        "initdb -D /tmp/newpg --locale=C"
      ]
    ],
    "pg_isready": [
      [
        "-h",
        "--host",
        "接続先",
        "受付状態を調べるサーバーを指定。",
        "pg_isready -h localhost"
      ],
      [
        "-p",
        "--port",
        "ポート",
        "確認するポート番号を指定する。",
        "pg_isready -p 5432"
      ],
      [
        "-d",
        "--dbname",
        "DB名",
        "接続確認に使うDB名。正しいDB名でなくてもサーバーの状態は判別できる場合がある。",
        "pg_isready -d lab"
      ],
      [
        "-U",
        "--username",
        "ユーザー",
        "接続確認時のDBユーザー名。",
        "pg_isready -U postgres"
      ],
      [
        "-t",
        "--timeout",
        "待ち時間",
        "接続を待つ最大秒数。既定3秒。",
        "pg_isready -t 5"
      ],
      [
        "-q",
        "--quiet",
        "表示しない",
        "メッセージを出さず終了コードで判断する。0=受付可、1=拒否、2=応答なし、3=試行なし。",
        "pg_isready -q"
      ]
    ],
    "createdb": [
      [
        "-T",
        "--template",
        "テンプレート",
        "どのDBをひな形として新しいDBを作るか指定。",
        "createdb -T template0 backup_lab"
      ],
      [
        "-O",
        "--owner",
        "所有者",
        "作成したDBの所有ロールを指定。",
        "createdb -O postgres backup_lab"
      ],
      [
        "-E",
        "--encoding",
        "文字コード",
        "作成するDBの文字コードを指定。テンプレートとの整合性が必要。",
        "createdb -T template0 -E UTF8 backup_lab"
      ]
    ],
    "dropdb": [
      [
        "-i",
        "--interactive",
        "確認して削除",
        "削除前に確認を促す。削除したDBは通常元に戻せない。",
        "dropdb -i backup_lab"
      ],
      [
        "--if-exists",
        "--if-exists",
        "存在時のみ",
        "DBが存在しない場合をエラーにしない。",
        "dropdb --if-exists backup_lab"
      ]
    ],
    "createuser": [
      [
        "-P",
        "--pwprompt",
        "新ロールのパスワード",
        "新しく作るロールのパスワードを入力する。",
        "createuser -P trainee"
      ],
      [
        "-s",
        "--superuser",
        "管理者権限",
        "スーパーユーザーを作成する。通常のアプリ用ロールには付与しない。",
        "createuser -s trainee"
      ],
      [
        "-d",
        "--createdb",
        "DB作成権限",
        "新ロールにDBを作る権限を与える。",
        "createuser -d trainee"
      ],
      [
        "-D",
        "--no-createdb",
        "DB作成不可",
        "DB作成権限を与えない（既定）。",
        "createuser -D trainee"
      ]
    ],
    "dropuser": [
      [
        "-i",
        "--interactive",
        "確認して削除",
        "対象ロールを削除する前に確認を促す。所有物や権限の依存関係に注意。",
        "dropuser -i trainee"
      ],
      [
        "--if-exists",
        "--if-exists",
        "存在時のみ",
        "ロールが存在しない場合をエラーにしない。",
        "dropuser --if-exists trainee"
      ]
    ],
    "pg_resetwal": [
      [
        "-n",
        "--dry-run",
        "確認だけ",
        "変更せず予定内容を表示する。通常運用では使用しない障害復旧ツール。",
        "pg_resetwal -n /var/lib/postgresql/data"
      ]
    ],
    "pg_config": [
      [
        "--version",
        "--version",
        "インストール版",
        "ローカルに導入されたPostgreSQLの開発用情報から版を表示する。",
        "pg_config --version"
      ],
      [
        "--bindir",
        "--bindir",
        "実行ファイルの場所",
        "PostgreSQLの実行ファイルのディレクトリを確認する。",
        "pg_config --bindir"
      ]
    ]
  },
  "notes": {
    "pg_ctl": "-w は完了待ち、-W は待たない。psqlでは同じ文字でも意味が違います。PGDATA設定済みの例では-Dを省略しています。",
    "psql": "-d はDB名、-U はユーザー名。-w/-W はパスワード入力に関する指定です。",
    "pg_dump": "-s は定義のみ、-a はデータのみ。-F の後の p/c/d/t で形式を指定します。",
    "pg_restore": "-l は目次を表示、-L は目次ファイルを使う。-c は既存オブジェクト削除、-C はDB作成。",
    "vacuumdb": "-z はVACUUMとANALYZE、-Z はANALYZEだけ。大文字小文字で意味が変わります。",
    "pg_basebackup": "-D は物理バックアップの保存先。pg_ctl の -D は操作対象のデータディレクトリです。",
    "createuser": "-d はDB作成権限を付与、-D は付与しない。psql の -d は接続先DBです。"
  }
};
(function optionModule(){
'use strict';
const rows=window.OPTION_REFERENCE.data,notes=window.OPTION_REFERENCE.notes;
function search(group,query){const q=query.trim();const terms=q.split(/\s+/).filter(Boolean);return Object.entries(rows).filter(([cmd])=>group==='all'||group===cmd).flatMap(([cmd,list])=>list.filter(r=>terms.every(t=>{if(t.startsWith('-'))return [r[0],...r[1].split(/\s*\/\s*/)].some(x=>x===t);return [cmd,...r].join(' ').toLowerCase().includes(t.toLowerCase())})).map(row=>({cmd,row})))}
function mount(doc){
 const $=id=>doc.getElementById(id),mode=$('refOptionMode'),command=$('refCommandMode'),group=$('optionGroup'),query=$('optionSearch'),list=$('optionList');
 for(const cmd of Object.keys(rows)){const o=doc.createElement('option');o.value=cmd;o.textContent=cmd;group.append(o)}
 function render(){list.replaceChildren();const found=search(group.value||'all',query.value);$('optionCount').textContent=found.length+' 件';const note=notes[group.value];$('optionNote').hidden=!note;$('optionNote').textContent=note||'';if(!found.length){list.textContent='該当するオプションがありません。';return}let previous='';for(const {cmd,row:r} of found){if(cmd!==previous){const h=doc.createElement('h3');h.className='option-heading';h.textContent=cmd;list.append(h);previous=cmd}const d=doc.createElement('div');d.className='option-entry';const title=doc.createElement('strong');title.textContent=r[0]+'　'+r[2];const alias=doc.createElement('small');alias.textContent=r[1]===r[0]?'':r[1];const p=doc.createElement('p');p.textContent=r[3];const example=doc.createElement('code');example.textContent=r[4];d.append(title,alias,p,example);list.append(d)}}
 function toggle(on){$('commandReference').hidden=on;$('optionReference').hidden=!on;mode.setAttribute('aria-pressed',String(on));command.setAttribute('aria-pressed',String(!on));if(on)render()}
 mode.onclick=()=>toggle(true);command.onclick=()=>toggle(false);group.onchange=render;query.oninput=render;toggle(false);return{render,toggle};
}
window.OptionReference={search,mount};
})();
