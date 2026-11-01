import test from 'node:test';
import assert from 'node:assert/strict';
import {authorizeSinea,OPERATIONS as P} from './accessPolicy.js';

const student={id:'s1',tenantId:'rede-a',schoolId:'esc-a'};
function actor(role,{tenantId='rede-a',schoolId='esc-a',assignedStudentIds=['s1']}={}) {
  return {subject:'oidc-verified-demo',memberships:[{role,status:'active',tenantId,schoolId,assignedStudentIds}]};
}
const may=(user,action,st=student,tenantId='rede-a')=>
  authorizeSinea({actor:user,action,student:st,tenantId});

test('AEE atribuído acessa planos e laudos do seu estudante',()=>{
  assert.equal(may(actor('aee'),P.STUDENT_CLINICAL),true);
  assert.equal(may(actor('aee'),P.PLAN_EDIT),true);
});
test('AEE NÃO acessa estudante não vinculado',()=>{
  assert.equal(may(actor('aee'),P.STUDENT_CLINICAL,{...student,id:'s2'}),false);
});
test('Regente visualiza plano pedagógico mas não laudos',()=>{
  assert.equal(may(actor('regente'),P.STUDENT_PEDAGOGICAL),true);
  assert.equal(may(actor('regente'),P.STUDENT_CLINICAL),false);
});
test('Mediador registra rotina e Canto, mas não altera planos nem lê laudos',()=>{
  assert.equal(may(actor('mediador'),P.CALM_CREATE),true);
  assert.equal(may(actor('mediador'),P.RECORD_CREATE),true);
  assert.equal(may(actor('mediador'),P.PLAN_EDIT),false);
  assert.equal(may(actor('mediador'),P.STUDENT_CLINICAL),false);
});
test('Coordenação possui escopo escolar, não médico',()=>{
  assert.equal(may(actor('coordenacao',{assignedStudentIds:[]}),P.PLAN_READ),true);
  assert.equal(may(actor('coordenacao',{schoolId:'esc-b'}),P.PLAN_READ),false);
  assert.equal(may(actor('coordenacao'),P.STUDENT_CLINICAL),false);
});
test('Secretaria apenas agregados, nunca acesso nominal automático',()=>{
  assert.equal(may(actor('secretaria'),P.STUDENT_PEDAGOGICAL),false);
  assert.equal(may(actor('secretaria'),P.STUDENT_CLINICAL),false);
  assert.equal(may(actor('secretaria'),P.AGGREGATES,null),true);
});
test('Evoluce suporta produtos, mas não consulta estudantes',()=>{
  assert.equal(may(actor('consultor_evoluce'),P.PROJECT_PLANNING,null),true);
  assert.equal(may(actor('especialista'),P.AGENT_CURATION,null),true);
  assert.equal(may(actor('admin_evoluce'),P.TENANT_ADMIN,null),true);
  for (const role of ['consultor_evoluce','especialista','admin_evoluce']) {
    assert.equal(may(actor(role),P.STUDENT_PEDAGOGICAL),false);
    assert.equal(may(actor(role),P.STUDENT_CLINICAL),false);
  }
});
test('Isolamento obrigatório entre redes e vínculos revogados',()=>{
  assert.equal(may(actor('aee'),P.PLAN_READ,{...student,tenantId:'rede-b'}),false);
  assert.equal(may(actor('aee',{tenantId:'rede-b'}),P.PLAN_READ),false);
  assert.equal(may({subject:'x',memberships:[{...actor('aee').memberships[0],status:'revoked'}]},P.PLAN_READ),false);
});
test('Negar por padrão em operações desconhecidas ou sem identidade',()=>{
  assert.equal(may(actor('aee'),'student.dump'),false);
  assert.equal(may({subject:'',memberships:actor('aee').memberships},P.PLAN_READ),false);
  assert.equal(may(actor('aee'),P.PLAN_READ,null),false);
});
