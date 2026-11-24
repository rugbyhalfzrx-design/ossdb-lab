/* Dedicated browser worker. No SQL is sent to a server. */
const PG='https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.3.14/dist/index.js';
const SQLITE='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-asm.js';
let kind,db,SQLite;
self.onmessage=async({data:m})=>{try{let result=null;
 if(m.action==='start'){
  kind=m.payload;
  if(kind==='postgres'){const {PGlite}=await import(PG);db=new PGlite();await db.waitReady;await db.exec('SELECT 1;')}
  else if(kind==='sqlite'){importScripts(SQLITE);SQLite=await initSqlJs();db=new SQLite.Database();db.exec('SELECT 1;')}
  else throw new Error('Unknown engine');
 }else if(m.action==='reset'){
  if(kind==='postgres'){try{await db.exec('ROLLBACK;')}catch{}await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; SET search_path TO public;');await db.exec(m.payload)}
  else if(kind==='sqlite'){db.close();db=new SQLite.Database();db.run('PRAGMA foreign_keys=ON;');db.exec(m.payload)}
  else throw new Error('Engine not ready');
 }else if(m.action==='exec'){
  if(kind==='postgres')result=await db.exec(m.payload);
  else if(kind==='sqlite'){const r=db.exec(m.payload);result=r.map(t=>({fields:t.columns.map(name=>({name})),rows:t.values.map(row=>Object.fromEntries(t.columns.map((name,i)=>[name,row[i]])))}));if(!result.length)result=[{fields:[],rows:[],affectedRows:db.getRowsModified()}]}
  else throw new Error('Engine not ready');
 }else throw new Error('Unknown action');
 self.postMessage({id:m.id,result});
 }catch(e){self.postMessage({id:m.id,error:String(e?.message||e)})}};
