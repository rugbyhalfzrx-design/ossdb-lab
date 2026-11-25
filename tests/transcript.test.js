const assert=require('node:assert/strict');global.window=global;require('../lessons.js');require('../simulator.js');
(function transcriptTests(assert,L,AdminLab){
 const get=id=>L.admin.find(t=>t[0]===id),run=id=>new AdminLab(get(id)).run(get(id)[4]);
 for(const t of L.admin){const r=run(t[0]);assert(r.ok,t[0]);assert(Array.isArray(r.notes),t[0]);assert(!/単発コマンド演習|模擬出力|（模擬）|simulated/.test(r.text),t[0]+' '+r.text)}
 assert.equal(run('a16').text,'');assert(run('a16').notes.length);assert.equal(run('a111').text,'');assert.equal(run('a08').text,'');assert(run('a49').text.includes('server started'));assert(!run('a49').text.includes('ログ出力先'));assert(run('a64').text.includes('(1 row)'));assert(run('a56').text.includes('List of schemas'));assert(run('a02').text.includes('(2 rows)'));assert(run('a113').text.includes('Sato'));assert.equal(run('a45').text,'localhost:5432 - accepting connections');
 const lab=new AdminLab(get('a01'));assert(lab.run('psql -d lab').ok);assert(lab.run('\\o result.txt').ok);assert.equal(lab.run('SHOW port;').text,'');assert(lab.run('\\o').ok);assert(lab.run('SHOW port;').text.includes('5432'));assert(lab.run('\\timing on').ok);assert(lab.run('SHOW port;').text.includes('Time:'));assert(lab.run('\\timing off').ok);assert(!lab.run('SHOW port;').text.includes('Time:'));
})(assert,LESSONS,AdminLab);
console.log('All administration transcripts and output-state tests passed.');
