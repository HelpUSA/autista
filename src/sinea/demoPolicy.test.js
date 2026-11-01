import test from 'node:test';
import assert from 'node:assert/strict';
import { students, planGoals, planTypes } from './demoData.js';
import { canPreview, anonymizeNetworkCell, validateCalmDemo } from './demoPolicy.js';

test('protótipo usa IDs fictícios únicos e plano com metas observáveis',()=>{
  assert.equal(new Set(students.map(s=>s.id)).size, students.length);
  assert.deepEqual(planTypes, ['PEI','PDI','PAEE']);
  assert.ok(planGoals.every(goal=>goal.progress>=0 && goal.progress<=100 && goal.owner && goal.due));
});
test('perfil secretaria não recebe prévia do prontuário nominal',()=>{
  assert.equal(canPreview('secretaria','estudantes'),false);
  assert.equal(canPreview('secretaria','painel'),true);
  assert.equal(canPreview('aee','estudantes'),true);
  assert.equal(canPreview('desconhecido','painel'),false);
});
test('células muito pequenas são suprimidas do agregado',()=>{
  assert.equal(anonymizeNetworkCell(9),null);
  assert.equal(anonymizeNetworkCell(10),10);
  assert.throws(()=>anonymizeNetworkCell(-1));
});
test('registro demonstrativo de Canto da Calma exige escala válida',()=>{
  const sample={entry:4,exit:2,outcome:'melhorou',returned:'parcialmente',items:['fone'],elapsed:61};
  assert.equal(validateCalmDemo(sample),true);
  assert.equal(validateCalmDemo({...sample,entry:0}),false);
  assert.equal(validateCalmDemo({...sample,outcome:'punição'}),false);
});
