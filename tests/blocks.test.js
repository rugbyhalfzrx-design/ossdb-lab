const assert=require('node:assert/strict');global.window=global;require('../lessons.js');require('../simulator.js');require('../sql-practice.js');require('../blocks.js');
(function blockTests(assert,LESSONS,AdminLab,SQLPractice,CommandBlocks){
 const B=CommandBlocks;
 for(const t of LESSONS.admin){const assembled=B.join(B.parts(t[4]));const lab=new AdminLab(t);assert(lab.matches(assembled,t),t[0]+' block command matching');assert(lab.run(assembled).ok,t[0]+' block command run')}
 for(const t of LESSONS.sql){const assembled=B.join(B.parts(t[4]));assert(SQLPractice.matches(assembled,t[4]),t[0]+' SQL block match');assert.equal(assembled,t[4],t[0]+' lossless SQL')}
 assert.equal(B.join(B.parts("psql -c 'SELECT version();'")),"psql -c 'SELECT version();'");
 assert.equal(B.join(B.parts("SELECT $$a;b c$$;")),"SELECT $$a;b c$$;");
 assert.equal(B.join(B.parts("SELECT 'it''s a test';")),"SELECT 'it''s a test';");
 const a=B.shuffled(['pg_ctl','-w','start'],()=>0.9999);assert(a.some((x,i)=>x.value!==['pg_ctl','-w','start'][i]));
 function el(){return{value:'',children:[],hidden:false,disabled:false,attrs:{},append(x){this.children.push(x)},replaceChildren(){this.children=[]},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this[k]=f}}}
 const input=el(),root=el(),nodes=Object.fromEntries(['bank','selected','panel','show','hide','undo','clear'].map(x=>[x,el()]));root.querySelector=s=>nodes[s.slice(6,-1)];const storage={v:{},getItem(k){return this.v[k]},setItem(k,v){this.v[k]=v}};
 const ui=B.create(input,root,storage,'test',{createElement:el},()=>0.999);
 assert(nodes.panel.hidden);ui.reset('pg_ctl -w start');nodes.show.onclick();assert(!nodes.panel.hidden);
 function click(v){const item=nodes.bank.children.find(x=>x.textContent===v);assert(item,'missing '+v);item.onclick()}
 click('pg_ctl');click('-w');click('start');assert.equal(input.value,'pg_ctl -w start');
 nodes.undo.onclick();assert.equal(input.value,'pg_ctl -w');click('start');
 nodes.selected.children[1].onclick();assert.equal(input.value,'pg_ctl start');nodes.hide.onclick();assert(nodes.panel.hidden);assert.equal(input.value,'pg_ctl start');nodes.show.onclick();assert(!nodes.panel.hidden);
 input.value='psql';input.input();assert.equal(nodes.selected.children.length,1);click('-w');assert.equal(input.value,'psql -w');
 nodes.clear.onclick();assert.equal(input.value,'');assert.equal(nodes.bank.children.length,3);
 ui.reset('SELECT SELECT;');click('SELECT');click('SELECT');click(';');assert.equal(input.value,'SELECT SELECT;');
 input.value='';ui.reset('pg_dump -d lab');assert.equal(nodes.bank.children.length,3);assert.equal(input.value,'');
 const second=B.create(el(),root,storage,'test',{createElement:el},()=>0.999);assert(second.visible());
})(assert,LESSONS,AdminLab,SQLPractice,CommandBlocks);
console.log('185 block round-trips and interaction checks passed.');
