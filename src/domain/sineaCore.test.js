import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDailyEntry, reconcileOfflineBatch, summarizeCalmSessions,
  countStudentLicenses, suppressSmallGroup, PLAN_KINDS} from './sineaCore.js';

const sample={studentId:'demo-1',modality:'AEE individual',participation:4,activity:'Leitura com pictogramas'};
test('registro pedagógico exige campos mínimos e escala de 1 a 5',()=>{
  assert.equal(validateDailyEntry(sample).valid,true);
  assert.equal(validateDailyEntry({...sample,participation:0}).valid,false);
  assert.equal(validateDailyEntry({...sample,participation:6}).valid,false);
  assert.equal(validateDailyEntry({...sample,activity:' '}).valid,false);
  assert.deepEqual(PLAN_KINDS,['PEI','PDI','PAEE']);
});
test('sincronização offline é idempotente e não duplica eventos',()=>{
  const event={clientMutationId:'12345678',entityId:'demo-1',baseVersion:0,payload:{activity:'A'}};
  const state=reconcileOfflineBatch([event],[event]);
  assert.equal(state.duplicates.length,1);assert.equal(state.accepted.length,0);
});
test('chave idempotente reutilizada com payload diferente gera conflito',()=>{
  const event={clientMutationId:'12345678',entityId:'demo-1',baseVersion:0,payload:{activity:'A'}};
  const result=reconcileOfflineBatch([event],[{...event,payload:{activity:'B'}}]);
  assert.equal(result.conflicts[0].reason,'idempotency_key_reused');
});
test('edição offline concorrente NÃO sobrescreve o histórico',()=>{
  const persisted={clientMutationId:'oldkey123',entityId:'plan-1',version:3,baseVersion:2,payload:{}};
  const change={clientMutationId:'newkey123',entityId:'plan-1',baseVersion:2,payload:{status:'updated'}};
  const result=reconcileOfflineBatch([persisted],[change]);
  assert.equal(result.accepted.length,0);
  assert.equal(result.conflicts[0].reason,'version_conflict');
});
test('Canto da Calma somente sugere itens após amostra mínima e revisão humana',()=>{
  const rows=[
    {outcome:'melhorou',items:['fone','tapete']},
    {outcome:'melhorou',items:['fone']},
    {outcome:'piorou',items:['fone']},
    {outcome:'melhorou',items:['fone','fone']}
  ];
  const out=summarizeCalmSessions(rows,3);
  assert.deepEqual(out.candidates,[{id:'fone',count:3,requiresProfessionalConfirmation:true}]);
  assert.equal(out.improvementObserved,3);
});
test('uma licença por estudante ativo mesmo com múltiplos profissionais',()=>{
  const roles=[{studentId:'a',active:true},{studentId:'a',active:true},{studentId:'b',active:true},{studentId:'c',active:false}];
  assert.equal(countStudentLicenses(roles),2);
});
test('pequenos grupos são suprimidos na estatística',()=>{
  assert.equal(suppressSmallGroup(3),null);
  assert.equal(suppressSmallGroup(10),10);
  assert.throws(()=>suppressSmallGroup(-2));
});
