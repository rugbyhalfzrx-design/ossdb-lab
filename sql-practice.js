/* Mobile-friendly SQL input. Width is folded only for ASCII forms. */
(()=>{'use strict';
function width(s){return String(s).replace(/[\uFF01-\uFF5E]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0)).replace(/\u3000/g,' ').replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"')}
function normalize(s){return width(s).trim()}
function command(s){return width(s).replace(/[¥￥]/g,'\\').trim().replace(/;\s*$/,'').trim()}
function tokens(s){const re=/'(?:''|[^'])*'|"(?:""|[^"])*"|[a-zA-Z_][a-zA-Z_0-9]*|\d+(?:\.\d+)?|>=|<=|<>|!=|[^\s]/g;const ts=(normalize(s).match(re)||[]).map(t=>/^[a-zA-Z_]/.test(t)?t.toLowerCase():t);while(ts.at(-1)===';')ts.pop();return ts}
function requiredOperation(s,kind){const clean=normalize(s).replace(/'(?:''|[^'])*'|"(?:""|[^"])*"|--[^\n]*|\/\*[\s\S]*?\*\//g,' ');switch(kind){case 'upsert-update':return /^\s*insert\s+into\b[\s\S]*\bon\s+conflict\b[\s\S]*\bdo\s+update\s+set\b/i.test(clean);case 'upsert-nothing':return /^\s*insert\s+into\b[\s\S]*\bon\s+conflict\b[\s\S]*\bdo\s+nothing\b/i.test(clean);case 'truncate':return /^\s*truncate\s+(?:table\s+)?orders\b/i.test(clean);case 'truncate-rollback':return /^\s*begin\b[^;]*;\s*truncate\s+(?:table\s+)?orders\b[^;]*;\s*rollback\b\s*;?\s*$/i.test(clean);default:return true}}
window.SQLPractice={normalize,command,requiredOperation,matches:(a,b)=>JSON.stringify(tokens(a))===JSON.stringify(tokens(b))};
})();
