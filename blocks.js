(function blocksModule(){
'use strict';
// Preserve quoted strings, dollar-quoted SQL bodies, paths and case-sensitive options.
function parts(source){
 const result=[];let buf='',i=0;const flush=()=>{if(buf){result.push(buf);buf=''}};
 while(i<source.length){
  const c=source[i];
  if(/\s/.test(c)){flush();i++;continue}
  if(c===';'){flush();result.push(c);i++;continue}
  if(c==="'"||c==='"'){const quote=c;buf+=c;i++;while(i<source.length){const x=source[i++];buf+=x;if(x===quote){if(source[i]===quote){buf+=source[i++];continue}break}}continue}
  if(c==='$'){const m=source.slice(i).match(/^\$(?:[A-Za-z_][A-Za-z_0-9]*)?\$/);if(m){const end=source.indexOf(m[0],i+m[0].length);if(end>=0){const next=end+m[0].length;buf+=source.slice(i,next);i=next;continue}}}
  buf+=c;i++;
 }flush();return result;
}
function join(tokens,base=''){let s=base;for(const t of tokens){s+=t===';'||!s||/\s$/.test(s)?t:' '+t}return s}
function shuffled(tokens,random=Math.random){const a=tokens.map((value,id)=>({value,id}));for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}if(a.length>1&&a.every((x,i)=>x.value===tokens[i])){const j=a.findIndex(x=>x.value!==a[0].value);if(j>0)[a[0],a[j]]=[a[j],a[0]]}return a}
function create(input,root,storage,key,doc=document,random=Math.random){
 const bank=root.querySelector('[data-bank]'),selected=root.querySelector('[data-selected]'),panel=root.querySelector('[data-panel]'),show=root.querySelector('[data-show]'),hide=root.querySelector('[data-hide]'),undo=root.querySelector('[data-undo]'),clear=root.querySelector('[data-clear]');
 let visible=false,tiles=[],chosen=[],base='',last='',source='';
 try{visible=storage?.getItem(key)==='1'}catch{}
 function toggle(on){visible=on;panel.hidden=!on;show.setAttribute('aria-pressed',String(on));hide.setAttribute('aria-pressed',String(!on));try{storage?.setItem(key,on?'1':'0')}catch{}}
 function render(){
  bank.replaceChildren();selected.replaceChildren();
  if(!chosen.length){const p=doc.createElement('span');p.className='block-empty';p.textContent='選んだブロックがここに並びます';selected.append(p)}
  for(const id of chosen){const t=tiles.find(x=>x.id===id);const b=doc.createElement('button');b.type='button';b.className='chosen-block';b.textContent=t.value+' ×';b.setAttribute('aria-label',t.value+' を取り消す');b.onclick=()=>remove(id);selected.append(b)}
  for(const t of tiles){if(chosen.includes(t.id))continue;const b=doc.createElement('button');b.type='button';b.className='word-block';b.textContent=t.value;b.onclick=()=>add(t.id);bank.append(b)}
  undo.disabled=chosen.length===0;
 }
 function sync(){if(input.value!==last){base=input.value;chosen=[];last=input.value}}
 function write(){input.value=join(chosen.map(id=>tiles.find(t=>t.id===id).value),base);last=input.value;render()}
 function add(id){sync();if(chosen.includes(id)||!tiles.some(t=>t.id===id))return;chosen.push(id);write()}
 function remove(id){sync();chosen=chosen.filter(x=>x!==id);write()}
 function reset(answer){source=answer;tiles=shuffled(parts(answer),random);chosen=[];base=input.value;last=input.value;render()}
 input.addEventListener('input',()=>{sync();render()});
 show.onclick=()=>{sync();render();toggle(true)};hide.onclick=()=>toggle(false);
 undo.onclick=()=>{sync();chosen.pop();write()};
 clear.onclick=()=>{input.value='';reset(source)};
 toggle(visible);return{reset,sync:()=>{sync();render()},visible:()=>visible};
}
window.CommandBlocks={parts,join,shuffled,create};
})();
