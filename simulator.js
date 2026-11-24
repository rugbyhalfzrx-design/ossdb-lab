/* Stateful teaching simulator, NOT a real shell or PostgreSQL server. */
window.AdminLab = class {
 constructor(task){this.reset(task)}
 reset(task){this.mode=task[6]||'shell';this.database='lab';this.running=task[7]!=='stopped';this.dbs=new Set(['postgres','lab','template0','template1']);this.files=new Set();this.clusters=new Set(['/var/lib/postgresql/data']);if(['a15','a18','a19'].includes(task[0]))this.dbs.add('backup_lab');if(task[0]==='a18')this.files.add('lab.sql');if(task[0]==='a19')this.files.add('lab.dump');}
 get prompt(){return this.mode==='psql'?`${this.database}=#`:'$'}
 normalize(s){return s.trim().replace(/\s+/g,' ').replace(/;$/,'').trim()}
 matches(input,task){const c=this.normalize(input),a=this.normalize(task[4]);if(c.toLowerCase()===a.toLowerCase())return true;const alias={'\\l':['\\list'],'\\q':['\\quit'],'\\c postgres':['\\connect postgres'],'psql -U postgres -d lab':['psql -d lab -U postgres','psql -U postgres lab'],'pg_dump -d lab -f lab.sql':['pg_dump lab -f lab.sql','pg_dump -f lab.sql lab','pg_dump lab > lab.sql'],'pg_dump -Fc -d lab -f lab.dump':['pg_dump -Fc lab -f lab.dump','pg_dump -F c -d lab -f lab.dump','pg_dump -d lab -Fc -f lab.dump'],'pg_ctl -D /var/lib/postgresql/data stop -m fast':['pg_ctl stop -D /var/lib/postgresql/data -m fast']};return (alias[a]||[]).some(x=>x.toLowerCase()===c.toLowerCase())}
 run(input){const c=this.normalize(input);let m;const ok=text=>({ok:true,text}),err=text=>({ok:false,text});if(!c)return err('');
 if(this.mode==='psql'){
  if(/^\\(?:q|quit)$/.test(c)){this.mode='shell';return ok('psql を終了しました。')}
  if(!this.running)return err('接続が切断されています。\\q で終了してください。');
  if((m=c.match(/^\\(?:c|connect) (\S+)$/))){if(!this.dbs.has(m[1]))return err(`FATAL: database "${m[1]}" does not exist`);this.database=m[1];return ok(`You are now connected to database "${m[1]}" as user "postgres".`)}
  if(c==='\\?'||c==='\\h')return ok('\\dt  tables\n\\d [name]  relations / details\n\\ds  sequences\n\\l  databases\n\\du  roles\n\\c DB  connect\n\\q  quit');
  if(c==='\\l'||c==='\\list')return ok('Name       | Owner\n'+[...this.dbs].map(x=>x.padEnd(10)+' | postgres').join('\n'));
  if(c==='\\du')return ok('Role name | Attributes\npostgres  | Superuser, Create role, Create DB, Replication, Bypass RLS');
  if(['\\dt','\\d','\\ds'].includes(c)){if(this.database!=='lab')return ok('Did not find any relations.');return ok('Schema | Name          | Type\n'+(c==='\\ds'?'public | users_id_seq  | sequence': 'public | users         | table\npublic | orders        | table'+(c==='\\d'?'\npublic | users_id_seq  | sequence\npublic | active_users  | view':'')))}
  if(c==='\\d users'&&this.database==='lab')return ok('Table "public.users"\nColumn | Type    | Modifiers\nid     | integer | not null default nextval(\'users_id_seq\'::regclass)\nname   | text    | not null\nage    | integer |\nIndexes:\n  "users_pkey" PRIMARY KEY, btree (id)');
  if((m=c.match(/^show (port|config_file|hba_file|data_directory|shared_buffers)$/i))){const k=m[1].toLowerCase();const vals={port:'5432',config_file:'/var/lib/postgresql/data/postgresql.conf',hba_file:'/var/lib/postgresql/data/pg_hba.conf',data_directory:'/var/lib/postgresql/data',shared_buffers:'128MB'};return ok(k+'\n'+vals[k]+'\n(1 row)')}
  if(/^(vacuum|analyze) users$/i.test(c)&&this.database==='lab')return ok(c.split(' ')[0].toUpperCase());
  if(/^select version\(\)$/i.test(c))return ok('PostgreSQL 16 (simulated)');
  return err('この模擬psqlでは未対応のコマンドです。本物のSQLは「SQL実践」で試せます。');
 }
 if(c==='help')return ok('psql, initdb, pg_ctl, createdb, dropdb, pg_dump, pg_restore, pg_dumpall, pg_basebackup, ls');
 if(c==='ls')return ok([...this.files].join('  ')||'(ファイルなし)');
 if(/^initdb -D \S+$/.test(c)){const d=c.split(' ')[2];if(this.clusters.has(d))return err('initdb: directory already exists and is not empty');this.clusters.add(d);return ok('Success. You can now start the database server using:\npg_ctl -D '+d+' -l logfile start')}
 if(c.startsWith('pg_ctl ')){const parts=c.split(' ');const i=parts.indexOf('-D');const d=parts[i+1];if(i<0||!this.clusters.has(d))return err('pg_ctl: data directory not found');if(d!=='/var/lib/postgresql/data')return err('この模擬環境で起動管理できるクラスタは /var/lib/postgresql/data です。');const cmd=parts.find(x=>['status','start','stop','reload','restart'].includes(x));if(cmd==='status')return ok(this.running?'pg_ctl: server is running (PID: 1234)':'pg_ctl: no server running');if(cmd==='start'){if(this.running)return err('pg_ctl: server is already running');this.running=true;return ok('waiting for server to start.... done\nserver started')};if(!this.running)return err('pg_ctl: no server running');if(cmd==='stop'){if(parts.includes('-m')&&!['smart','fast','immediate'].includes(parts[parts.indexOf('-m')+1]))return err('invalid shutdown mode');this.running=false;return ok('waiting for server to shut down.... done\nserver stopped')};if(cmd==='reload')return ok('server signaled');if(cmd==='restart')return ok('server stopped\nserver started');return err('pg_ctl: unsupported action')}
 if(!this.running)return err('接続エラー: サーバーが停止しています。');
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
