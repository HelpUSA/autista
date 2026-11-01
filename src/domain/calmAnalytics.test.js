import test from 'node:test';
import assert from 'node:assert/strict';
import {validateCalmSession,summarizeCalmObservations} from './calmAnalytics.js';
const sample={studentId:'student',professionalId:'prof',entryScale:4,exitScale:2,
  durationSeconds:210,outcome:'melhorou',returnedToActivity:'sim',
  purpose:'regulation',items:['fone'],notes:'Estudante preferiu fone abafador.'};
test('Canto da Calma aceita somente registro de acolhimento completo',()=>{
  assert.equal(validateCalmSession(sample).valid,true);
  assert.deepEqual(validateCalmSession({...sample,purpose:'punishment'}).errors,['somente_acolhimento']);
  assert.equal(validateCalmSession({...sample,entryScale:6}).valid,false);
  assert.equal(validateCalmSession({...sample,notes:'Foi castigo'}).valid,false);
});
test('indicadores dependem de observações válidas, nunca de diagnóstico automático',()=>{
  const out=summarizeCalmObservations([sample,sample,sample]);
  assert.equal(out.sessions,3); assert.equal(out.improved,3);
  assert.equal(out.meanMinutes,3.5);
  assert.deepEqual(out.candidateItems,[{item:'fone',count:3,requiresConfirmation:true}]);
  assert.equal(out.notClinicalAdvice,true);
});
test('baixa amostra não cria recomendação automática',()=>{
  assert.deepEqual(summarizeCalmObservations([sample]).candidateItems,[]);
});
