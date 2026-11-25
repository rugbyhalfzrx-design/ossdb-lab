const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');const F=Object.fromEntries(['index.html','app.js','lessons.js','simulator.js','sql-practice.js','blocks.js','options.js'].map(p=>[p,fs.readFileSync(path.join(__dirname,'..',p),'utf8')]));
const check=(v,m)=>assert.ok(v,m);
const t=(function testBottom(F,check){
 function el(tag='div'){return {tag,value:'',hidden:false,children:[],style:{},dataset:{},attributes:{},classList:{toggle(){}},_text:'',get textContent(){return this._text+this.children.map(x=>x.textContent).join('')},set textContent(s){this._text=String(s);this.children=[]},get options(){return this.children.flatMap(c=>c.tag==='optgroup'?c.children:[c]).filter(x=>x.tag==='option')},append(...x){this.children.push(...x)},replaceChildren(...x){this._text='';this.children=x},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this['on'+k]=f},dispatchEvent(e){this['on'+e.type]?.(e)},scrollIntoView(){this.scrolled=true},focus(){},querySelector(s){return this.nodes[s.slice(6,-1)]}}}
 const w={},elements=Object.fromEntries([...F["index.html"].matchAll(/\bid="([^"]+)"/g)].map(x=>[x[1],el()]));for(const g of ["admin","sql"]){elements[g+"Blocks"].nodes=Object.fromEntries(["bank","selected","panel","show","hide","undo","clear"].map(n=>[n,el()]));}elements.quizFilter.value="all";
 const doc={getElementById:id=>{if(!elements[id])throw Error("missing element "+id);return elements[id]},querySelectorAll:()=>[],createElement:el},storage={data:{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=v},removeItem(k){delete this.data[k]}};
 for(const p of ["lessons.js","simulator.js","sql-practice.js","blocks.js"])new Function("window","document",F[p])(w,doc);
 new Function("window","document","localStorage","location","navigator","Event","confirm",F["app.js"])(w,doc,storage,{protocol:"http:"},{},class{constructor(type){this.type=type}},()=>true);
 const choose=(g,id)=>{elements[g+"Select"].value=String(w.LESSONS[g].findIndex(t=>t[0]===id));elements[g+"Select"].onchange()};
 const advance=g=>{const prev=Number(elements[g+"Select"].value);elements[g+"NextBottom"].onclick();check(Number(elements[g+"Select"].value)===(prev+1)%w.LESSONS[g].length,g+" advances");check(elements[g+"NextBottom"].hidden&&elements[g+"Explanation"].hidden,g+" hides after next");check(elements[g+"Task"].scrolled,g+" scrolls to task")};
 check(elements.adminNextBottom.hidden&&elements.sqlNextBottom.hidden,"initial hide");
 choose("admin","a50");elements.adminAnswer.onclick();check(!elements.adminNextBottom.hidden,"answer reveals");advance("admin");
 choose("admin","a50");elements.command.value=w.LESSONS.admin.find(t=>t[0]==="a50")[4];elements.commandForm.onsubmit({preventDefault(){}});check(!elements.adminNextBottom.hidden&&elements.adminFeedback.textContent==="正解！","correct reveals");advance("admin");
 choose("sql","s01");elements.sqlAnswer.onclick();check(!elements.sqlNextBottom.hidden,"sql answer reveals");advance("sql");
 choose("sql",w.LESSONS.sql.at(-1)[0]);elements.sqlAnswer.onclick();advance("sql");check(Number(elements.sqlSelect.value)===0,"wrap");
 const prev=Number(elements.adminSelect.value);elements.adminNext.onclick();check(Number(elements.adminSelect.value)===(prev+1)%w.LESSONS.admin.length,"top next");
 check(JSON.parse(storage.data["ossdb-lab-progress-v1"]).includes("a50"),"progress saved");
 return {elements,w,choose,advance};
})(F,check);
(async()=>{t.choose('sql','s01');t.elements.practiceSQL.onclick();t.elements.sqlInput.value='SELECT * FROM users;';await t.elements.runSQL.onclick();check(!t.elements.sqlNextBottom.hidden&&t.elements.sqlFeedback.textContent.startsWith('正解！'),'SQL correct reveals');t.advance('sql');console.log('Bottom navigation tests passed.');})().catch(e=>{console.error(e);process.exitCode=1});
