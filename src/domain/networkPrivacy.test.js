import test from 'node:test';
import assert from 'node:assert/strict';
import {suppressBreakdown,buildSafeReminder} from './networkPrivacy.js';

test('dados agregados não divulgam contagem de grupos pequenos nem o total dedutível',()=>{
 const x=suppressBreakdown([{label:'A',count:8},{label:'B',count:50},{label:'C',count:30}]);
 assert.equal(x.total,null);
 assert.equal(x.breakdown.filter(g=>g.suppressed).length,2);
 assert.equal(x.breakdown[0].count,null);
});
test('todos os grupos grandes podem ser agregados, ainda exigindo revisão estatística',()=>{
 const x=suppressBreakdown([{label:'A',count:20},{label:'B',count:30}]);
 assert.equal(x.total,50);
 assert.equal(x.disclosureReviewRequired,true);
});
test('notificação não inclui nome de criança, laudo ou outros detalhes',()=>{
 const n=buildSafeReminder({kind:'plan_review',deadline:'2026-11-10',studentName:'Fulano',diagnosis:'TEA'});
 assert.equal(JSON.stringify(n).includes('Fulano'),false);
 assert.equal(JSON.stringify(n).includes('TEA'),false);
 assert.equal(n.containsSensitiveDetails,false);
});
