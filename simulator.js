/* Stateful teaching simulator, NOT a real shell or PostgreSQL server. */
window.AdminLab = class {
 constructor(task){this.reset(task)}
 reset(task){this.taskId=task[0];this.mode=task[6]||'shell';this.database='lab';this.osUser=task[7]==='os-original'?'ubuntu':'postgres';this.osStack=task[7]==='os-switched'?['ubuntu']:[];this.running=task[7]!=='stopped';this.enabled=task[7]!=='disabled';this.pgdata=task[7]==='pgdata'?'/var/lib/postgresql/data':'';this.dbs=new Set(['postgres','lab','template0','template1']);this.files=new Set(['query.sql']);this.roles=new Set(['postgres']);if(task[0]==='a42')this.roles.add('trainee');this.settings={statement_timeout:'0'};this.grants=new Set();if(["a89","a90","a91","a92"].includes(task[0]))this.roles.add('appuser');this.clusters=new Set(['/var/lib/postgresql/data']);if(['a15','a18','a19'].includes(task[0]))this.dbs.add('backup_lab');if(task[0]==='a18')this.files.add('lab.sql');if(task[0]==='a19')this.files.add('lab.dump');}
 get prompt(){return this.mode==='psql'?`${this.database}=#`:`${this.osUser}@lab:~$`}
 normalize(s){return s.trim().replace(/\s+/g,' ').replace(/;$/,'').trim()}
 matches(input,task){const c=this.normalize(input),a=this.normalize(task[4]);const eq=(x,y)=>task[6]==='psql'&&!y.startsWith('\\')?x.toLowerCase()===y.toLowerCase():x===y;if(eq(c,a))return true;if(a==='sudo -iu postgres'&&['sudo -i -u postgres','sudo -u postgres -i','sudo --login --user postgres'].includes(c))return true;if(a==='\\i query.sql'&&c==='\\include query.sql')return true;if(/^(?:sudo )?systemctl /.test(a)&&c.replace(/^sudo /,'')===a.replace(/^sudo /,''))return true;if(a.startsWith('pg_ctl -D ')&&c.startsWith('pg_ctl ')){const parse=s=>{const m=s.match(/^pg_ctl (?:(?:-D (\S+) (status|start|stop|reload|restart))|(?:(status|start|stop|reload|restart) -D (\S+)))(?: -m (smart|fast|immediate))?$/);return m?[(m[1]||m[4]),(m[2]||m[3]),m[5]||'fast'].join(' '):null};const p=parse(a);if(p&&p===parse(c))return true;}const alias={'pg_controldata /var/lib/postgresql/data':['pg_controldata -D /var/lib/postgresql/data'],'pg_resetwal -n /var/lib/postgresql/data':['pg_resetwal --dry-run /var/lib/postgresql/data','pg_resetwal -n -D /var/lib/postgresql/data'],'vacuumdb -d lab -z':['vacuumdb -z -d lab','vacuumdb -d lab --analyze'],'vacuumdb -d lab -t users':['vacuumdb -t users -d lab'],'pg_isready -p 5432':['pg_isready --port=5432'],'\\l':['\\list'],'\\q':['\\quit'],'\\c postgres':['\\connect postgres'],'psql -U postgres -d lab':['psql -d lab -U postgres','psql -U postgres lab'],'pg_dump -d lab -f lab.sql':['pg_dump lab -f lab.sql','pg_dump -f lab.sql lab','pg_dump lab > lab.sql'],'pg_dump -Fc -d lab -f lab.dump':['pg_dump -Fc lab -f lab.dump','pg_dump -F c -d lab -f lab.dump','pg_dump -d lab -Fc -f lab.dump'],'pg_ctl -D /var/lib/postgresql/data stop -m fast':['pg_ctl stop -D /var/lib/postgresql/data -m fast']};return (alias[a]||[]).some(x=>eq(c,x))}
 run(input){const c=this.normalize(input);let m;const ok=text=>({ok:true,text}),err=text=>({ok:false,text});if(!c)return err('');
 if(this.mode==='shell'){
  if(c==='whoami')return ok(this.osUser);
  if(['sudo -iu postgres','sudo -i -u postgres','sudo -u postgres -i','sudo --login --user postgres'].includes(c)){this.osStack.push(this.osUser);this.osUser='postgres';return ok('（OSユーザーをpostgresに切り替えました。DBには未接続です。）')}
  if(c==='exit'){if(!this.osStack.length)return err('元のシェルがないため、この模擬環境では終了しません。');this.osUser=this.osStack.pop();return ok('（元のOSユーザーに戻りました。）')}
 }
 if(this.mode==='psql'&&(m=c.match(/^\\(?:i|include) (\S+)$/))){if(!this.running)return err('接続が切断されています。');if(!this.files.has(m[1])||m[1]!=='query.sql')return err('psql: file not found or unsupported in this exercise');return ok(' name\n Sato\n(1 row)\n（query.sqlを実行：接続を維持）')}
 if(this.mode==='psql'&&c==='\\?')return ok('\\dt  tables\n\\d [name]  relations / details\n\\ds  sequences\n\\l  databases\n\\du  roles\n\\c DB  connect\n\\i FILE  execute SQL file\n\\q  quit');

 const models=window.LESSONS.adminModels||{};const model=models[c]||Object.entries(models).find(([key,v])=>v.mode==='psql'&&!key.startsWith('\\')&&key.toLowerCase()===c.toLowerCase())?.[1];
 if(model&&model.mode===this.mode&&(this.running||c==='psql --version')){
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
 }return ok(model.text+'\n（単発コマンド演習・模擬出力）');}

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
 if(c.startsWith('psql ')){const args=c.split(' '),i=args.indexOf('-d'),db=i>=0?args[i+1]:args.at(-1);if(!this.dbs.has(db))return err('FATAL: database does not exist');if(args.includes('-f')){const f=args[args.indexOf('-f')+1];if(!this.files.has(f)||!f.endsWith('.sql'))return err('psql: file not found or not plain SQL');return ok('SET\nCREATE TABLE\nCOPY 5\n（復元成功：模擬）')};this.mode='psql';this.database=db;return ok('psql (16, simulated)\nType "help" for help.')}
 if(c.startsWith('pg_dump ')){const args=c.split(' '),i=args.indexOf('-d'),db=i>=0?args[i+1]:args.find(x=>this.dbs.has(x)),f=args.includes('-f')?args[args.indexOf('-f')+1]:args.includes('>')?args[args.indexOf('>')+1]:null;if(!this.dbs.has(db)||!f)return err('pg_dump: この練習ではDB名と出力先を指定してください。');this.files.add(f);return ok('（成功：通常は出力なし）\n模擬バックアップ: '+f)}
 if((m=c.match(/^pg_restore -d (\w+) (\S+)$/))){if(!this.dbs.has(m[1])||!this.files.has(m[2])||!m[2].endsWith('.dump'))return err('pg_restore: database or archive not found');return ok('（復元成功：模擬）')}
 if((m=c.match(/^pg_dumpall -f (\S+)$/))){this.files.add(m[1]);return ok('模擬バックアップ: '+m[1])}
 if((m=c.match(/^pg_basebackup -D (\S+)$/))){this.files.add(m[1]);return ok('（ベースバックアップ成功：模擬）')}
 return err('この模擬シェルでは未対応です。help で対応コマンドを確認できます。');
 }
};
