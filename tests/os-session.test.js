const assert=require('node:assert/strict');global.window=global;require('../lessons.js');require('../simulator.js');
(function sessionTests(assert,L,AdminLab){
 const get=id=>L.admin.find(t=>t[0]===id),lab=new AdminLab(get('a111'));
 assert.equal(lab.prompt,'ubuntu@lab:~$');assert.equal(lab.run('whoami').text,'ubuntu');assert(lab.run('sudo -iu postgres').ok);assert.equal(lab.prompt,'postgres@lab:~$');assert.equal(lab.mode,'shell');assert.equal(lab.run('whoami').text,'postgres');
 assert(lab.run('psql -d lab').ok);assert.equal(lab.prompt,'lab=#');assert(lab.run('\\i query.sql').ok);assert.equal(lab.prompt,'lab=#');assert(!lab.run('\\i absent.sql').ok);assert(lab.run('\\q').ok);assert.equal(lab.prompt,'postgres@lab:~$');assert(lab.run('exit').ok);assert.equal(lab.prompt,'ubuntu@lab:~$');assert(lab.running);assert(lab.run('psql -d lab -f query.sql').ok);assert.equal(lab.mode,'shell');
 const ids=L.admin.map(t=>t[0]);assert(ids.indexOf('a111')<ids.indexOf('a112')&&ids.indexOf('a112')<ids.indexOf('a09'));assert.equal(ids.indexOf('a113'),ids.indexOf('a103')-1);assert.equal(ids.indexOf('a114'),ids.indexOf('a08')+1);for(let i=1;i<ids.length;i++)assert(Number(L.chapters.admin[ids[i]].slice(0,2))>=Number(L.chapters.admin[ids[i-1]].slice(0,2)),'chapter order');
})(assert,LESSONS,AdminLab);
console.log('OS user, psql file execution, session and chapter tests passed.');
