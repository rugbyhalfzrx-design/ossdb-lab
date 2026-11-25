const assert=require('node:assert/strict');global.window=global;require('../lessons.js');require('../sql-practice.js');require('../blocks.js');
(function addedTests(assert,L,P,B){
 for(const t of L.sql.filter(t=>/^s(76|77|78|79|80)$/.test(t[0]))){assert.equal(B.join(B.parts(t[4])),t[4]);assert(P.requiredOperation(t[4],t[7]),t[0]);assert(L.beginner[t[0]]&&L.usage[t[0]],t[0]+" explanations");assert(!P.matches("SELECT 1;",t[4]),t[0]+" wrong answer")}
 assert(!P.requiredOperation("SELECT * FROM orders;","upsert-nothing"));assert(!P.requiredOperation("UPDATE orders SET amount=2500 WHERE id=1;","upsert-update"));assert(!P.requiredOperation("DELETE FROM orders;","truncate"));assert(!P.requiredOperation("BEGIN; SELECT * FROM orders; ROLLBACK;","truncate-rollback"));assert(P.requiredOperation("truncate orders;","truncate"));assert(!P.requiredOperation("BEGIN; TRUNCATE TABLE orders; COMMIT;","truncate-rollback"));
 assert.equal(L.sql.length,80);assert.equal(L.quiz.length,240);assert.equal(new Set([...L.admin,...L.sql,...L.quiz].map(t=>t[0])).size,434);
})(assert,LESSONS,SQLPractice,CommandBlocks);
console.log('UPSERT/TRUNCATE practice and operation checks passed.');
