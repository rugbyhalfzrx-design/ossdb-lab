const assert=require('node:assert/strict');global.window=global;require('../lessons.js');require('../simulator.js');
for(const t of LESSONS.admin){const lab=new AdminLab(t);assert.equal(lab.run(t[4]).ok,true,t[0]);assert.equal(lab.matches(t[4],t),true,t[0]);}
const lab=new AdminLab(LESSONS.admin.find(t=>t[0]==='a01'));assert.equal(lab.run('psql -U postgres -d lab').ok,true);assert.equal(lab.mode,'psql');assert.equal(lab.run('\\dt').ok,true);assert.equal(lab.run('\\q').ok,true);assert.equal(lab.mode,'shell');assert.equal(lab.run('pg_ctl -D /var/lib/postgresql/data stop -m fast').ok,true);assert.equal(lab.run('psql -U postgres -d lab').ok,false);assert.equal(lab.run('pg_ctl -D /var/lib/postgresql/data start').ok,true);assert.equal(lab.run('pg_dump -d lab -f lab.sql').ok,true);assert.equal(lab.run('createdb backup_lab').ok,true);assert.equal(lab.run('psql -d backup_lab -f lab.sql').ok,true);assert.equal(lab.run('dropdb lab').ok,false);const all=Object.values(LESSONS).filter(Array.isArray).flat();assert.equal(new Set(all.map(x=>x[0])).size,all.length);for(const q of LESSONS.quiz){const c=Array.isArray(q[4])?q[4]:[q[4]];assert(c.length&&new Set(c).size===c.length&&c.every(i=>i>=0&&i<q[3].length),q[0]);}console.log(LESSONS.admin.length+' model commands, state transitions and data validation passed.');

const service=new AdminLab(LESSONS.admin.find(t=>t[0]==='a27'));
assert.equal(service.enabled,false);assert.equal(service.running,true);
assert(service.run('sudo systemctl stop postgresql').ok);assert.equal(service.running,false);
assert(service.run('sudo systemctl enable postgresql').ok);assert.equal(service.running,false);assert.equal(service.enabled,true);
assert(service.run('sudo systemctl start postgresql').ok);assert.equal(service.running,true);
assert(service.run('sudo systemctl disable postgresql').ok);assert.equal(service.running,true);assert.equal(service.enabled,false);
assert(service.run('export PGDATA=/var/lib/postgresql/data').ok);assert(service.run('pg_ctl status').ok);
assert.equal(service.run('pg_ctl -D /wrong status').ok,false);
assert.equal(service.matches('pg_ctl -d /var/lib/postgresql/data status',LESSONS.admin.find(t=>t[0]==='a10')),false);
assert(service.matches('pg_ctl -D /var/lib/postgresql/data stop',LESSONS.admin.find(t=>t[0]==='a13')));
assert(service.run('pg_ctl stop -m immediate').ok);assert.equal(service.running,false);

const extended=new AdminLab(LESSONS.admin.find(t=>t[0]==='a01'));
assert(extended.run('createuser trainee').ok);assert(extended.roles.has('trainee'));assert(extended.run('dropuser trainee').ok);assert(!extended.roles.has('trainee'));
assert(extended.run('pg_isready -p 5432').text.includes('exit: 0'));assert(extended.run('pg_ctl -D /var/lib/postgresql/data stop').ok);assert(extended.run('pg_isready -p 5432').text.includes('exit: 2'));
assert(!extended.run('pg_resetwal -f /var/lib/postgresql/data').ok);assert(extended.run('pg_resetwal -n /var/lib/postgresql/data').ok);
assert(extended.run('pg_ctl -D /var/lib/postgresql/data -l server.log start').ok);assert(extended.files.has('server.log'));
assert.equal(Object.keys(LESSONS.adminScope).length,13);

assert.equal(LESSONS.admin.length,114);assert.equal(LESSONS.sql.length,80);assert.equal(LESSONS.quiz.length,240);
