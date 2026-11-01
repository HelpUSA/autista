import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleRoutine, validateRoutine, describeRoutine, nextRoutineItem } from './visualRoutine.js';

test('rotina ilustrativa é válida, com IDs e horários ordenados', () => {
  assert.equal(validateRoutine(sampleRoutine),true);
  assert.equal(new Set(sampleRoutine.map(x=>x.id)).size,sampleRoutine.length);
});
test('rotina aceita etapas concluídas sem alterar os dados originais', () => {
  const view=describeRoutine(sampleRoutine,['r1']);
  assert.equal(view[0].completed,true);
  assert.equal(view[1].completed,false);
  assert.match(view[0].accessibilityLabel,/Concluído/);
  assert.equal(sampleRoutine[0].completed,undefined);
});
test('próxima atividade respeita conclusão e retorna nulo no fim', () => {
  assert.equal(nextRoutineItem(sampleRoutine,['r1']).id,'r2');
  assert.equal(nextRoutineItem(sampleRoutine,sampleRoutine.map(x=>x.id)),null);
});
test('rejeita horários malformados e duplicidade',()=>{
  assert.equal(validateRoutine([{id:'x',title:'Teste',time:'25:80'}]),false);
  assert.equal(validateRoutine([{id:'x',title:'A',time:'10:00'},{id:'x',title:'B',time:'11:00'}]),false);
  assert.equal(validateRoutine([{id:'a',title:'A',time:'11:00'},{id:'b',title:'B',time:'10:00'}]),false);
});
