const assert=require('node:assert/strict');global.window=global;require('../lessons.js');require('../sql-practice.js');require('../simulator.js');
const P=SQLPractice;
assert.equal(P.normalize("ＳＥＬＥＣＴ　＊　ＦＲＯＭ　ｕｓｅｒｓ："),"SELECT * FROM users;");
assert.equal(P.normalize("SELECT 'a:b', 1::integer:"),"SELECT 'a:b', 1::integer;");
assert.equal(P.normalize("SELECT ‘S％’："),"SELECT 'S%';");
assert.equal(P.normalize("begin: update users set age=99 where id=1: rollback:"),"begin; update users set age=99 where id=1; rollback;");
assert.equal(P.normalize("SELECT $$a:b$$:"),"SELECT $$a:b$$;");
assert.equal(P.normalize("SELECT 'Sato':"),"SELECT 'Sato';");
assert.equal(P.matches("select * from USERS:","SELECT * FROM users;"),true);
assert.equal(P.matches("SELECT 'SATO';","SELECT 'Sato';"),false);
assert.equal(P.command("￥ＤＴ："),"\\DT");
const mobile=s=>s.replace(/[A-Za-z0-9*;,=()<>%]/g,c=>String.fromCharCode((c===';'?':':c).charCodeAt(0)+0xFEE0)).replace(/ /g,'　');
for(const t of LESSONS.sql)assert(P.matches(mobile(t[4]),t[4]),t[0]);
for(const t of LESSONS.admin){const lab=new AdminLab(t);const input=P.command(mobile(t[4]).toUpperCase());assert(lab.matches(input,t),t[0]);assert(lab.run(t[4]).ok,t[0]);}
console.log('All 20 SQL and 26 administration mobile input checks passed.');
