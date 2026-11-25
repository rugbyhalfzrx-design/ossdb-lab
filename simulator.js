/* Stateful teaching simulator, NOT a real shell or PostgreSQL server. */
window.AdminLab = class {
 constructor(task){this.reset(task)}
 reset(task){this.taskId=task[0];this.mode=task[6]||'shell';this.database='lab';this.osUser=task[7]==='os-original'?'ubuntu':'postgres';this.osStack=task[7]==='os-switched'?['ubuntu']:[];this.running=task[7]!=='stopped';this.enabled=task[7]!=='disabled';this.pgdata=task[7]==='pgdata'?'/var/lib/postgresql/data':'';this.dbs=new Set(['postgres','lab','template0','template1']);this.files=new Set(['query.sql']);this.timing=false;this.outputFile=null;if(['a75','a110'].includes(task[0]))this.files.add('lab.dump');if(['a109','a110'].includes(task[0]))this.dbs.add('backup_lab');if(task[0]==='a109')this.files.add('lab.sql');this.roles=new Set(['postgres']);if(task[0]==='a42')this.roles.add('trainee');this.settings={statement_timeout:'0'};this.grants=new Set();if(["a89","a90","a91","a92"].includes(task[0]))this.roles.add('appuser');this.clusters=new Set(['/var/lib/postgresql/data']);if(['a15','a18','a19'].includes(task[0]))this.dbs.add('backup_lab');if(task[0]==='a18')this.files.add('lab.sql');if(task[0]==='a19')this.files.add('lab.dump');}
 get prompt(){return this.mode==='psql'?`${this.database}=#`:`${this.osUser}@lab:~$`}
 normalize(s){return s.trim().replace(/\s+/g,' ').replace(/;$/,'').trim()}
 matches(input,task){const c=this.normalize(input),a=this.normalize(task[4]);const eq=(x,y)=>task[6]==='psql'&&!y.startsWith('\\')?x.toLowerCase()===y.toLowerCase():x===y;if(eq(c,a))return true;if(a==='sudo -iu postgres'&&['sudo -i -u postgres','sudo -u postgres -i','sudo --login --user postgres'].includes(c))return true;if(a==='\\i query.sql'&&c==='\\include query.sql')return true;if(/^(?:sudo )?systemctl /.test(a)&&c.replace(/^sudo /,'')===a.replace(/^sudo /,''))return true;if(a.startsWith('pg_ctl -D ')&&c.startsWith('pg_ctl ')){const parse=s=>{const m=s.match(/^pg_ctl (?:(?:-D (\S+) (status|start|stop|reload|restart))|(?:(status|start|stop|reload|restart) -D (\S+)))(?: -m (smart|fast|immediate))?$/);return m?[(m[1]||m[4]),(m[2]||m[3]),m[5]||'fast'].join(' '):null};const p=parse(a);if(p&&p===parse(c))return true;}const alias={'pg_controldata /var/lib/postgresql/data':['pg_controldata -D /var/lib/postgresql/data'],'pg_resetwal -n /var/lib/postgresql/data':['pg_resetwal --dry-run /var/lib/postgresql/data','pg_resetwal -n -D /var/lib/postgresql/data'],'vacuumdb -d lab -z':['vacuumdb -z -d lab','vacuumdb -d lab --analyze'],'vacuumdb -d lab -t users':['vacuumdb -t users -d lab'],'pg_isready -p 5432':['pg_isready --port=5432'],'\\l':['\\list'],'\\q':['\\quit'],'\\c postgres':['\\connect postgres'],'psql -U postgres -d lab':['psql -d lab -U postgres','psql -U postgres lab'],'pg_dump -d lab -f lab.sql':['pg_dump lab -f lab.sql','pg_dump -f lab.sql lab','pg_dump lab > lab.sql'],'pg_dump -Fc -d lab -f lab.dump':['pg_dump -Fc lab -f lab.dump','pg_dump -F c -d lab -f lab.dump','pg_dump -d lab -Fc -f lab.dump'],'pg_ctl -D /var/lib/postgresql/data stop -m fast':['pg_ctl stop -D /var/lib/postgresql/data -m fast']};return (alias[a]||[]).some(x=>eq(c,x))}
 runRaw(input){const c=this.normalize(input);let m;const ok=text=>({ok:true,text}),err=text=>({ok:false,text});if(!c)return err('');
 if(this.mode==='shell'){
  if(c==='whoami')return ok(this.osUser);
  if(['sudo -iu postgres','sudo -i -u postgres','sudo -u postgres -i','sudo --login --user postgres'].includes(c)){this.osStack.push(this.osUser);this.osUser='postgres';return ok('（OSユーザーをpostgresに切り替えました。DBには未接続です。）')}
  if(c==='exit'){if(!this.osStack.length)return err('元のシェルがないため、この模擬環境では終了しません。');this.osUser=this.osStack.pop();return ok('（元のOSユーザーに戻りました。）')}
 }
 if(this.mode==='psql'&&(m=c.match(/^\\(?:i|include) (\S+)$/))){if(!this.running)return err('接続が切断されています。');if(!this.files.has(m[1])||m[1]!=='query.sql')return err('psql: file not found or unsupported in this exercise');return ok(' name\n Sato\n(1 row)\n（query.sqlを実行：接続を維持）')}
 if(this.mode==='psql'&&c==='\\timing off'){this.timing=false;return ok('Timing is off.')}
 if(this.mode==='psql'&&c==='\\o'){this.outputFile=null;return ok('')}
 if(this.mode==='psql'&&c==='\\?')return ok('\\dt  tables\n\\d [name]  relations / details\n\\ds  sequences\n\\l  databases\n\\du  roles\n\\c DB  connect\n\\i FILE  execute SQL file\n\\q  quit');

 const models=window.LESSONS.adminModels||{};const model=models[c]||Object.entries(models).find(([key,v])=>v.mode==='psql'&&!key.startsWith('\\')&&key.toLowerCase()===c.toLowerCase())?.[1];
 if(model&&model.mode===this.mode&&(this.running||c==='psql --version')){
 if((c==='pg_restore -l lab.dump'||c==='pg_restore -d backup_lab -t users lab.dump')&&!this.files.has('lab.dump'))return err('pg_restore: error: could not open input file "lab.dump": No such file or directory');
 if(c==='psql -v ON_ERROR_STOP=1 -d backup_lab -f lab.sql'&&(!this.dbs.has('backup_lab')||!this.files.has('lab.sql')))return err('psql: error: lab.sql: No such file or directory');
 if(c==='\\timing on')this.timing=true;
 if(c==='\\o result.txt'){this.outputFile='result.txt';this.files.add('result.txt')}
 switch(model.effect){
 case 'connect':this.mode='psql';this.database='lab';break;
 case 'file':this.files.add(c.split(' ').at(-1));break;
 case 'base':this.files.add('/tmp/basebackup');break;
 case 'roleadd':if(this.roles.has('appuser'))return err('role already exists');this.roles.add('appuser');break;
 case 'rolechange':if(!this.roles.has('appuser'))return err('role does not exist');break;
 case 'roledrop':if(!this.roles.delete('appuser'))return err('role does not exist');break;
 case 'grant':if(!this.roles.has('appuser'))return err('role does not exist');this.grants.add('appuser');break;
 case 'revoke':if(!this.roles.has('appuser'))return err('role does not exist');this.grants.delete('appuser');break;
 case 'setting':this.settings.statement_timeout=c.toLowerCase().startsWith('set ')?'5s':'0';break;
 }return ok(model.text);}

 if(this.mode==='psql'){
  if(/^\\(?:q|quit)$/.test(c)){this.mode='shell';return ok('psql を終了しました。')}
  if(!this.running)return err('接続が切断されています。\\q で終了してください。');
  if((m=c.match(/^\\(?:c|connect) (\S+)$/))){if(!this.dbs.has(m[1]))return err(`FATAL: database "${m[1]}" does not exist`);this.database=m[1];return ok(`You are now connected to database "${m[1]}" as user "postgres".`)}
  if(c==='\\?'||c==='\\h')return ok('\\dt  tables\n\\d [name]  relations / details\n\\ds  sequences\n\\l  databases\n\\du  roles\n\\c DB  connect\n\\q  quit');
  if(c==='\\l'||c==='\\list')return ok('Name       | Owner\n'+[...this.dbs].map(x=>x.padEnd(10)+' | postgres').join('\n'));
  if(c==='\\du')return ok('Role name | Attributes\npostgres  | Superuser, Create role, Create DB, Replication, Bypass RLS'+[...this.roles].filter(r=>r!=='postgres').map(r=>'\n'+r+' | Login').join(''));
  if(['\\dt','\\d','\\ds'].includes(c)){if(this.database!=='lab')return ok('Did not find any relations.');return ok('Schema | Name          | Type\n'+(c==='\\ds'?'public | users_id_seq  | sequence': 'public | users         | table\npublic | orders        | table'+(c==='\\d'?'\npublic | users_id_seq  | sequence\npublic | active_users  | view':'')))}
  if(c==='\\d users'&&this.database==='lab')return ok('Table "public.users"\nColumn | Type    | Modifiers\nid     | integer | not null default nextval(\'users_id_seq\'::regclass)\nname   | text    | not null\nage    | integer |\nIndexes:\n  "users_pkey" PRIMARY KEY, btree (id)');
  if((m=c.match(/^show (port|config_file|hba_file|data_directory|shared_buffers)$/i))){const k=m[1].toLowerCase();const vals={port:'5432',config_file:'/var/lib/postgresql/data/postgresql.conf',hba_file:'/var/lib/postgresql/data/pg_hba.conf',data_directory:'/var/lib/postgresql/data',shared_buffers:'128MB'};return ok(k+'\n'+vals[k]+'\n(1 row)')}
  if(/^(vacuum|analyze) users$/i.test(c)&&this.database==='lab')return ok(c.split(' ')[0].toUpperCase());
  if(/^select version\(\)$/i.test(c))return ok('PostgreSQL 16 (simulated)');
  return err('この模擬psqlでは未対応のコマンドです。本物のSQLは「SQL実践」で試せます。');
 }
 if(c==='help')return ok('sudo -iu postgres, whoami, exit, psql, initdb, pg_ctl, systemctl, export PGDATA, echo $PGDATA, unset PGDATA, createdb, dropdb, pg_dump, pg_restore, pg_dumpall, pg_basebackup, createuser, dropuser, pg_config, pg_controldata, pg_isready, pg_resetwal -n, vacuumdb, ls');
 if((m=c.match(/^export PGDATA=(\S+)$/))){this.pgdata=m[1];return ok('（環境変数を設定しました）')}
 if(c==='echo $PGDATA')return ok(this.pgdata||'（未設定）');
 if(c==='unset PGDATA'){this.pgdata='';return ok('（環境変数を解除しました）')}
 if((m=c.match(/^(?:sudo )?systemctl (enable|disable|is-enabled|start|stop|status|restart|reload) postgresql(?:\.service)?$/))){switch(m[1]){case 'enable':this.enabled=true;return ok('Created symlink. （自動起動：有効）');case 'disable':this.enabled=false;return ok('Removed symlink. （自動起動：無効）');case 'is-enabled':return ok(this.enabled?'enabled':'disabled');case 'status':return ok('postgresql.service (simulated)\nLoaded: '+(this.enabled?'enabled':'disabled')+'\nActive: '+(this.running?'active (running)':'inactive (dead)'));case 'start':this.running=true;return ok('（起動しました）');case 'stop':this.running=false;return ok('（停止しました）');case 'restart':this.running=true;return ok('（再起動しました）');case 'reload':return this.running?ok('（設定を再読み込みしました）'):err('サービスが停止しています。')}}
 if(c==='ls')return ok([...this.files].join('  ')||'(ファイルなし)');
 if(/^initdb -D \S+$/.test(c)){const d=c.split(' ')[2];if(this.clusters.has(d))return err('initdb: directory already exists and is not empty');this.clusters.add(d);return ok('Success. You can now start the database server using:\npg_ctl -D '+d+' -l logfile start')}
 if(c.startsWith('pg_ctl ')){const parts=c.split(' ');const i=parts.indexOf('-D');const d=i<0?this.pgdata:parts[i+1];if(!this.clusters.has(d))return err('pg_ctl: data directory not found');if(d!=='/var/lib/postgresql/data')return err('この模擬環境で起動管理できるクラスタは /var/lib/postgresql/data です。');const cmd=parts.find(x=>['status','start','stop','reload','restart'].includes(x));if(cmd==='status')return ok(this.running?'pg_ctl: server is running (PID: 1234)':'pg_ctl: no server running');if(cmd==='start'){if(this.running)return err('pg_ctl: server is already running');this.running=true;const li=parts.indexOf('-l');if(li>=0&&parts[li+1])this.files.add(parts[li+1]);return ok('waiting for server to start.... done\nserver started'+(li>=0?'\nログ出力先: '+parts[li+1]:''))};if(!this.running)return err('pg_ctl: no server running');if(cmd==='stop'){if(parts.includes('-m')&&!['smart','fast','immediate'].includes(parts[parts.indexOf('-m')+1]))return err('invalid shutdown mode');this.running=false;const mode=parts.includes('-m')?parts[parts.indexOf('-m')+1]:'fast';return ok((mode==='smart'?'既存接続の終了を待機（模擬：接続なし）\n':mode==='immediate'?'即時停止（次回起動時にリカバリ）\n':'未完了トランザクションをロールバック（模擬）\n')+'waiting for server to shut down.... done\nserver stopped')};if(cmd==='reload')return ok('server signaled');if(cmd==='restart')return ok('server stopped\nserver started');return err('pg_ctl: unsupported action')}
 if(c==='pg_config --version')return ok('PostgreSQL 16 (simulated)');
 if((m=c.match(/^pg_controldata (?:-D )?(\S+)$/)))return this.clusters.has(m[1])?ok('pg_control version number: 1300\nDatabase cluster state: '+(this.running?'in production':'shut down')+'\nLatest checkpoint location: 0/1500000 (simulated)'):err('data directory not found');
 if(/^pg_isready(?: -p 5432)?$/.test(c))return ok('localhost:5432 - '+(this.running?'accepting connections (exit: 0)':'no response (exit: 2)'));
 if(c.startsWith('pg_resetwal ')){if(!/^pg_resetwal (?:-n|--dry-run) (?:-D )?\/var\/lib\/postgresql\/data$/.test(c))return err('安全のため、この模擬環境では -n による事前確認のみ対応します。');if(this.running)return err('先にサーバーを停止してください。');return ok('変更予定のWAL・制御情報を表示（模擬）。変更は行っていません。')}
 if(!this.running)return err('接続エラー: サーバーが停止しています。');
 if((m=c.match(/^createuser (\w+)$/))){if(this.roles.has(m[1]))return err('role already exists');this.roles.add(m[1]);return ok('（ロール作成成功：模擬）')}
 if((m=c.match(/^dropuser (\w+)$/))){if(m[1]!=='trainee')return err('模擬環境では trainee のみ削除できます。');if(!this.roles.delete(m[1]))return err('role does not exist');return ok('（ロール削除成功：模擬）')}
 if(/^vacuumdb -d lab(?: -t users| -z| --analyze)?$/.test(c))return ok('（VACUUM'+(/ -z| --analyze/.test(c)?' ANALYZE':'')+' 成功：模擬）');
 if((m=c.match(/^createdb (\w+)$/))){if(this.dbs.has(m[1]))return err('database already exists');this.dbs.add(m[1]);return ok('（成功：通常は出力なし）')}
 if((m=c.match(/^dropdb (\w+)$/))){if(m[1]!=='backup_lab')return err('安全のため模擬環境では backup_lab のみ削除可能です。');if(!this.dbs.delete(m[1]))return err('database does not exist');return ok('（成功：通常は出力なし）')}
 if(c.startsWith('psql ')){const args=c.split(' '),i=args.indexOf('-d'),db=i>=0?args[i+1]:args.at(-1);if(!this.dbs.has(db))return err('FATAL: database does not exist');if(args.includes('-f')){const f=args[args.indexOf('-f')+1];if(!this.files.has(f)||!f.endsWith('.sql'))return err('psql: file not found or not plain SQL');return ok(f==='query.sql'?' name\n------\n Sato\n(1 row)':'SET\nCREATE TABLE\nCOPY 5')};this.mode='psql';this.database=db;return ok('psql (16, simulated)\nType "help" for help.')}
 if(c.startsWith('pg_dump ')){const args=c.split(' '),i=args.indexOf('-d'),db=i>=0?args[i+1]:args.find(x=>this.dbs.has(x)),f=args.includes('-f')?args[args.indexOf('-f')+1]:args.includes('>')?args[args.indexOf('>')+1]:null;if(!this.dbs.has(db)||!f)return err('pg_dump: この練習ではDB名と出力先を指定してください。');this.files.add(f);return ok('（成功：通常は出力なし）\n模擬バックアップ: '+f)}
 if((m=c.match(/^pg_restore -d (\w+) (\S+)$/))){if(!this.dbs.has(m[1])||!this.files.has(m[2])||!m[2].endsWith('.dump'))return err('pg_restore: database or archive not found');return ok('')}
 if((m=c.match(/^pg_dumpall -f (\S+)$/))){this.files.add(m[1]);return ok('模擬バックアップ: '+m[1])}
 if((m=c.match(/^pg_basebackup -D (\S+)$/))){this.files.add(m[1]);return ok('（ベースバックアップ成功：模擬）')}
 return err('この模擬シェルでは未対応です。help で対応コマンドを確認できます。');
 }
};


/* Transcript examples: display English command output separately from teaching notes.
   This is a deterministic simulator, not a live operating system. */
function labTable(headers,rows,title='',footer=true){
 const cols=headers.map((h,i)=>Math.max(String(h).length,...rows.map(r=>String(r[i]??'').length)));
 const line=r=>r.map((x,i)=>' '+String(x??'').padEnd(cols[i])+' ').join('|').trimEnd();
 const sep=cols.map(n=>'-'.repeat(n+2)).join('+');
 const body=[line(headers),sep,...rows.map(line)];
 if(title)body.unshift(title);
 if(footer)body.push('('+rows.length+' '+(rows.length===1?'row':'rows')+')');
 return body.join('\n');
}
const labVersion='PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc, 64-bit';
function sampleOutput(lab,c,r,before){
 if(!r.ok)return r;
 const note=[],add=t=>note.push(t);let out=r.text;
 const table=(h,rows,title='',footer=true)=>labTable(h,rows,title,footer);
 const one=(h,v)=>table([h],[[v]]);
 const quiet=t=>{out='';add(t)};
 const show=c.match(/^SHOW\s+(\w+)$/i);
 if(show&&show[1].toLowerCase()!=='all'){
 const key=show[1].toLowerCase(),values={data_directory:'/var/lib/postgresql/data',config_file:'/var/lib/postgresql/data/postgresql.conf',hba_file:'/var/lib/postgresql/data/pg_hba.conf',port:'5432',max_connections:'100',listen_addresses:'localhost',timezone:'Asia/Tokyo',search_path:'"$user", public',archive_mode:'on',archive_command:'cp %p /archive/%f',autovacuum:'on',log_directory:'log',logging_collector:'on',shared_buffers:'128MB'};
 if(key in values){out=one(key,values[key]);add('列名の下に現在の設定値が1行表示されます。環境によって値は異なります。')}
 }else if(/^SHOW ALL$/i.test(c)){out=table(['name','setting','description'],[['archive_mode','on','Allows archiving of WAL files.'],['max_connections','100','Sets the maximum number of concurrent connections.'],['port','5432','Sets the TCP port the server listens on.'],['shared_buffers','128MB','Sets the number of shared memory buffers used by the server.']]);add('実際には全設定項目が並びます。ここでは代表的な4項目だけ抜粋しています。')}
 else if(/^SELECT version\(\)$/i.test(c)||c==="psql -d lab -c 'SELECT version();'"){out=one('version',labVersion);add('接続先のサーバーのバージョン情報です。手元のpsqlのバージョンとは別です。')}
 else if(/^SELECT current_user$/i.test(c)){out=one('current_user','postgres');add('SQLを実行しているDBロール名です。whoamiはOSユーザー名を表示します。')}
 else if(/^SELECT pg_reload_conf\(\)$/i.test(c)){out=one('pg_reload_conf','t');add('tはtrue。設定再読込のシグナルを送れたことを示し、すべての設定が反映された保証ではありません。')}
 else if(/^SELECT name, setting FROM pg_settings/i.test(c)){out=table(['name','setting'],[['port','5432']])}
 else if(/^SELECT context FROM pg_settings/i.test(c)){out=one('context','postmaster');add('postmasterはサーバーの再起動が必要な設定を表します。')}
 else if(/^SELECT \* FROM pg_hba_file_rules$/i.test(c)){out=table(['rule_number','file_name','line_number','type','database','user_name','address','netmask','auth_method','options','error'],[['1','/var/lib/postgresql/data/pg_hba.conf','90','local','{all}','{all}','','','peer','',''],['2','/var/lib/postgresql/data/pg_hba.conf','92','host','{all}','{all}','127.0.0.1','255.255.255.255','scram-sha-256','','']]);add('PostgreSQL 16の表示例。errorが空ならその行に解析エラーがないことを示します。')}
 else if(/^SELECT table_name FROM information_schema.tables/i.test(c)){out=table(['table_name'],lab.database==='lab'?[['users'],['orders'],['active_users']]:[])}
 else if(/^SELECT datname FROM pg_catalog.pg_database/i.test(c)){out=table(['datname'],[...lab.dbs].map(x=>[x]))}
 else if(c==='\\dn'){out=table(['Name','Owner'],[['public','pg_database_owner']],'List of schemas')}
 else if(c==='\\dv'){out=table(['Schema','Name','Type','Owner'],lab.database==='lab'?[['public','active_users','view','postgres']]:[],'List of relations')}
 else if(c==='\\di'){out=table(['Schema','Name','Type','Owner','Table'],lab.database==='lab'?[['public','orders_pkey','index','postgres','orders'],['public','users_pkey','index','postgres','users']]:[],'List of relations');add('Name＝インデックス名、Table＝その索引が付いている表。users_pkeyはusersの主キー用の索引です。対象列は\\d usersで確認できます。');add('インデックスは検索のための索引です。\\diは一覧を確認するだけで、作成や検索の高速化は行いません。')}
 else if(c==='\\df'){out=table(['Schema','Name','Result data type','Argument data types','Type'],lab.database==='lab'?[['public','double_n','integer','n integer','func']]:[],'List of functions')}
 else if(c==='\\dp'){out=table(['Schema','Name','Type','Access privileges','Column privileges','Policies'],lab.database==='lab'?[['public','orders','table','','',''],['public','users','table',lab.grants.has('appuser')?'postgres=arwdDxt/postgres\nappuser=r/postgres':'','','']]:[],'Access privileges');add('rはSELECT権限。空欄は既定の権限設定を示します。')}
 else if(c==='\\dt'||c==='\\d'||c==='\\ds'){if(lab.database==='lab'){const rows=c==='\\ds'?[['public','users_id_seq','sequence','postgres']]:[['public','orders','table','postgres'],['public','users','table','postgres']];if(c==='\\d')rows.push(['public','active_users','view','postgres'],['public','users_id_seq','sequence','postgres']);out=table(['Schema','Name','Type','Owner'],rows,'List of relations')}}
 else if(c==='\\d users'&&lab.database==='lab'){out=table(['Column','Type','Collation','Nullable','Default'],[['id','integer','','not null',"nextval('users_id_seq'::regclass)"],['name','text','','not null',''],['age','integer','','','']],'Table "public.users"',false)+'\nIndexes:\n    "users_pkey" PRIMARY KEY, btree (id)';add('Nullableのnot nullはNULLを禁止。Indexesは主キーなどの索引情報です。')}
 else if(c==='\\l'||c==='\\list'||c==='\\l+'){const h=['Name','Owner','Encoding','Locale Provider','Collate','Ctype','ICU Locale','ICU Rules','Access privileges'];const rows=[...lab.dbs].map(x=>[x,'postgres','UTF8','libc','C.UTF-8','C.UTF-8','','','']);if(c==='\\l+'){h.push('Size','Tablespace','Description');rows.forEach(x=>x.push('8 MB','pg_default',''))}out=table(h,rows,'List of databases');if(c==='\\l+')add('サイズなどの詳細も表示します。サイズはこの学習環境の例です。')}
 else if(c==='\\du'){out=table(['Role name','Attributes'],[...lab.roles].map(x=>[x,x==='postgres'?'Superuser, Create role, Create DB, Replication, Bypass RLS':'']),'List of roles',false)}
 else if(c==='\\conninfo'){out='You are connected to database "'+lab.database+'" as user "postgres" via socket in "/var/run/postgresql" at port "5432".';add('現在の接続先・DBロール・接続方法を確認できます。TCP接続の場合は表示が異なります。')}
 else if(c==='\\h CREATE TABLE'){out='Command:     CREATE TABLE\nDescription: define a new table\nSyntax:\nCREATE [ [ GLOBAL | LOCAL ] { TEMPORARY | TEMP } | UNLOGGED ] TABLE [ IF NOT EXISTS ] table_name ( [\n    { column_name data_type [ column_constraint [ ... ] ] | table_constraint }\n    [, ... ]\n] )\nURL: https://www.postgresql.org/docs/16/sql-createtable.html';add('実際の構文ヘルプはさらに長いため、ここでは冒頭の要点を表示しています。')}
 else if(c==='\\?'){out='General\n  \\c[onnect] [DBNAME|- USER|- HOST|- PORT|-]\n  \\q                     quit psql\nHelp\n  \\?                     show help on backslash commands\n  \\h [NAME]              help on syntax of SQL commands\nInput/Output\n  \\i FILE                execute commands from file\n  \\o [FILE]              send query results to file\nInformational\n  \\d[S+]                 list tables, views, and sequences\n  \\dt[S+]                list tables\n  \\l[+]                  list databases\n  \\du[S+]                list roles';add('実際のヘルプの代表項目を抜粋しています。')}
 else if(/^\\(?:i|include) query\.sql$/.test(c)||c==='psql -d lab -f query.sql'){out=one('name','Sato');add(c.startsWith('\\')?'ファイルのSQLを実行後もpsqlに接続したままです。':'ファイルのSQLを実行後、自動的に接続を終了します。')}
 else if(c==='\\o result.txt'){quiet('以後の問い合わせ結果はresult.txtへ出力されます。画面へ戻すには引数なしの\\oを実行します。')}
 else if(c==='\\o'){quiet('問い合わせ結果の出力先がターミナルに戻りました。')}
 else if(/^\\(?:q|quit)$/.test(c)){quiet('psqlを終了してLinuxシェルに戻りました。DBサーバーは停止していません。')}
 else if(c==='sudo -iu postgres'||/^sudo .*(?:postgres)$/.test(c)&&!c.includes('systemctl')){quiet('OSユーザーがpostgresに変わりました。まだDBには接続していません。')}
 else if(c==='exit'){out='logout';add('元のOSユーザーに戻りました。DBサーバーは停止していません。')}
 else if(/^export PGDATA=/.test(c)||c==='unset PGDATA'){quiet('環境変数の設定・解除は成功しても通常メッセージを表示しません。echo $PGDATAで確認できます。')}
 else if(c==='echo $PGDATA'&&!lab.pgdata){out='';add('空行はPGDATAが未設定または空であることを示します。')}
 else if(/^pg_ctl /.test(c)){if(c.includes(' start')){out='waiting for server to start.... done\nserver started';if(c.includes(' -l '))add('サーバーのログは指定ファイルへ出力されます。画面にログの中身は出ません。')}else if(c.includes(' stop')){out='waiting for server to shut down.... done\nserver stopped';if(c.includes('-m immediate'))add('即時停止。次回起動時にリカバリが必要になります。');else if(c.includes('-m smart'))add('smartは既存接続の終了を待ちます。');else add('fastは既存接続を切断し、未確定トランザクションを取り消します。')}else if(c.includes(' restart')){out='waiting for server to shut down.... done\nserver stopped\nwaiting for server to start.... done\nserver started'}else if(c.includes(' status')&&lab.running){out='pg_ctl: server is running (PID: 1234)\n/usr/lib/postgresql/16/bin/postgres "-D" "/var/lib/postgresql/data"';add('PIDは動作中のサーバープロセスの番号です。')}}
 else if(/^pg_isready\b/.test(c)){out='localhost:5432 - '+(lab.running?'accepting connections':'no response');add('終了コード: '+(lab.running?'0（接続受付中）':'2（応答なし）')+'。実際の終了コードはシェルで echo $? などを使って確認します。')}
 else if(c==='pg_config --version'){out='PostgreSQL 16.0'}
 else if(c==='psql --version'){out='psql (PostgreSQL) 16.0'}
 else if(c.startsWith('pg_controldata ')){out='pg_control version number:            1300\nCatalog version number:               202307071\nDatabase cluster state:               '+(lab.running?'in production':'shut down')+'\nLatest checkpoint location:           0/1500000';add('制御ファイル情報の抜粋です。実際の値はクラスタによって異なります。')}
 else if(c.startsWith('pg_resetwal ')){out='Current pg_control values:\n\npg_control version number:            1300\nCatalog version number:               202307071\n\nValues to be changed:\n\nFirst log segment after reset:        000000010000000000000002';add('-nは事前確認のみ。実際のファイルは変更しません。出力は代表項目の抜粋です。')}
 else if(/^initdb -D /.test(c)){const dir=c.split(' ')[2];out='The files belonging to this database system will be owned by user "'+lab.osUser+'".\nThis user must also own the server process.\n\ncreating directory '+dir+' ... ok\ncreating subdirectories ... ok\nselecting default max_connections ... 100\nselecting default shared_buffers ... 128MB\ncreating configuration files ... ok\nrunning bootstrap script ... ok\nperforming post-bootstrap initialization ... ok\nsyncing data to disk ... ok\n\nSuccess. You can now start the database server using:\n\n    pg_ctl -D '+dir+' -l logfile start';add('初期化の主要メッセージを表示しています。クラスタ作成とサーバー起動は別の操作です。')}
 else if(c==='pg_restore -l lab.dump'){out=';\n; Archive created at 2026-01-01 00:00:00 UTC\n;     dbname: lab\n;     Format: CUSTOM\n;     Dumped from database version: 16.0\n;\n; Selected TOC Entries:\n;\n215; 1259 16384 TABLE public users postgres\n3340; 0 16384 TABLE DATA public users postgres\n3198; 2606 16388 CONSTRAINT public users users_pkey postgres';add('アーカイブの目次の例です。復元は実行していません。')}
 else if(/^pg_(?:dump(?:all)?|restore|basebackup)\b/.test(c)){quiet('詳細表示オプションなしでは成功しても通常メッセージは出ません。'+(c.startsWith('pg_restore')?'復元先DBで確認します。':'保存先のファイルを確認します。'))}
 else if(/^psql .* -f /.test(c)){out=out.replace(/\n（[^）]+）/g,'');add('SQLファイルの内容に応じてSET、CREATE TABLE、COPYなどの実行結果が表示されます。')}
 else if(c.startsWith('psql ')&&lab.mode==='psql'&&before==='shell'){out='psql (16.0)\nType "help" for help.';add('DBへの接続が完了しました。次のプロンプトはDB名になります。')}
 else if(/^(?:createuser|dropuser|createdb|dropdb|vacuumdb)\b/.test(c)){quiet('成功しても通常は何も表示されません。必要に応じて一覧や終了コードで確認します。')}
 else if(/^(?:sudo )?systemctl /.test(c)){const act=c.match(/systemctl (\S+)/)?.[1];if(act==='status'){out='● postgresql.service - PostgreSQL database server\n     Loaded: loaded (/etc/systemd/system/postgresql.service; '+(lab.enabled?'enabled':'disabled')+')\n     Active: '+(lab.running?'active (running)':'inactive (dead)');add('サービス名や表示内容はLinuxのディストリビューションによって異なります。')}else if(act==='enable'){out='Created symlink /etc/systemd/system/multi-user.target.wants/postgresql.service → /etc/systemd/system/postgresql.service.';add('次回OS起動時の自動起動を設定しました。現在の稼働状態は変わりません。')}else if(act==='disable'){out='Removed "/etc/systemd/system/multi-user.target.wants/postgresql.service".';add('自動起動を解除しました。現在の稼働状態は変わりません。')}else if(act!=='is-enabled')quiet('成功時は通常出力されません。systemctl status postgresqlで状態を確認できます。')}
 else if(/^COPY |^\\copy /i.test(c)){add('COPYの後の数字は読み書きした行数です。')}
 if(before==='psql'&&lab.outputFile&&/^(?:SELECT|SHOW)\b/i.test(c)){out='';add('問い合わせ結果は'+lab.outputFile+'へ出力されました。')}
 if(before==='psql'&&lab.timing&&/^(?:SELECT|SHOW|VACUUM|ANALYZE|SET|RESET|COPY)\b/i.test(c)&&!lab.outputFile)out+=(out?'\n':'')+'Time: 0.321 ms';
 return {ok:true,text:out,notes:note};
}
const rawRun=window.AdminLab.prototype.runRaw;
window.AdminLab.prototype.run=function(input){const before=this.mode,c=this.normalize(input),r=rawRun.call(this,input);return sampleOutput(this,c,r,before)};
