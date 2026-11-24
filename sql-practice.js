/* Mobile-friendly SQL input. Width is folded only for ASCII forms. */
(()=>{'use strict';
function width(s){return String(s).replace(/[\uFF01-\uFF5E]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0)).replace(/\u3000/g,' ').replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"')}
function normalize(s){s=width(s);let out='',i=0;
 while(i<s.length){const ch=s[i];
  if(s.startsWith('--',i)){let j=s.indexOf('\n',i);if(j<0)j=s.length;out+=s.slice(i,j);i=j;continue}
  if(s.startsWith('/*',i)){let j=i+2,depth=1;while(j<s.length&&depth){if(s.startsWith('/*',j)){depth++;j+=2}else if(s.startsWith('*/',j)){depth--;j+=2}else j++}out+=s.slice(i,j);i=j;continue}
  if(ch==="'"||ch==='"'){let j=i+1;const esc=ch==="'"&&i>0&&/[eE]/.test(s[i-1])&&(i===1||!/[\w$]/.test(s[i-2]));while(j<s.length){if(esc&&s[j]==='\\'){j+=2;continue}if(s[j]===ch){if(s[j+1]===ch){j+=2;continue}j++;break}j++}out+=s.slice(i,j);i=j;continue}
  if(ch==='$'){const m=s.slice(i).match(/^\$(?:[A-Za-z_][A-Za-z_0-9]*)?\$/);if(m){const end=s.indexOf(m[0],i+m[0].length),j=end<0?s.length:end+m[0].length;out+=s.slice(i,j);i=j;continue}}
  if(ch===':'&&s[i-1]!==':'&&s[i+1]!==':'&&(/^\s*$/.test(s.slice(i+1))||/^\s*(?:SELECT|WITH|INSERT|UPDATE|DELETE|BEGIN|START|ROLLBACK|COMMIT|CREATE|ALTER|DROP|TRUNCATE|GRANT|REVOKE|VACUUM|ANALYZE|SHOW|SET|EXPLAIN)\b/i.test(s.slice(i+1))))out+=';';else out+=ch;i++;
 }return out.trim()}
function command(s){return width(s).replace(/[¥￥]/g,'\\').trim().replace(/[;:]\s*$/,'').trim()}
function tokens(s){const re=/'(?:''|[^'])*'|"(?:""|[^"])*"|[a-zA-Z_][a-zA-Z_0-9]*|\d+(?:\.\d+)?|>=|<=|<>|!=|[^\s]/g;const ts=(normalize(s).match(re)||[]).map(t=>/^[a-zA-Z_]/.test(t)?t.toLowerCase():t);while(ts.at(-1)===';')ts.pop();return ts}
window.SQLPractice={normalize,command,matches:(a,b)=>JSON.stringify(tokens(a))===JSON.stringify(tokens(b))};
})();
