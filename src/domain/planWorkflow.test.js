import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlanDraft,revisePlan,submitForReview,approvePlan,recordGoalEvidence}
  from './planWorkflow.js';

const author={subject:'prof-aee'};
const reviewer={subject:'coord'};
const seed={id:'plan-01',studentId:'student-01',kind:'PEI',schoolYear:2026,
  nextReviewOn:'2026-12-10',goals:[{id:'goal-01',area:'Comunicação',
    description:'Solicitar recursos de comunicação com apoio visual',
    responsibleId:'prof-aee',dueOn:'2026-12-10'}]};
test('PEI/PDI/PAEE podem ser criados como rascunho versionado',()=>{
  for (const kind of ['PEI','PDI','PAEE']) {
    const draft=createPlanDraft({...seed,kind},author);
    assert.equal(draft.version,1); assert.equal(draft.status,'draft');
  }
});
test('dados inválidos e metas duplicadas são recusados',()=>{
  assert.throws(()=>createPlanDraft({...seed,kind:'clinico'},author));
  assert.throws(()=>createPlanDraft({...seed,goals:[seed.goals[0],seed.goals[0]]},author));
});
test('revisão imutável aumenta versão e detecta conflito concorrente',()=>{
  const draft=createPlanDraft(seed,author);
  const changed=revisePlan(draft,{nextReviewOn:'2026-12-20'},1,author);
  assert.equal(draft.nextReviewOn,'2026-12-10');
  assert.equal(changed.version,2);
  assert.throws(()=>revisePlan(changed,{nextReviewOn:'2026-12-30'},1,author),/Conflito/);
});
test('aprovação exige revisão e segundo profissional',()=>{
  const draft=createPlanDraft(seed,author);
  const submitted=submitForReview(draft,1,author);
  assert.throws(()=>approvePlan(submitted,2,author),/segundo profissional/);
  const approved=approvePlan(submitted,2,reviewer);
  assert.equal(approved.status,'approved');
  assert.equal(approved.approvedBy,'coord');
  assert.throws(()=>revisePlan(approved,{nextReviewOn:'2026-12-20'},approved.version,author));
});
test('meta não recebe percentual sem rubrica e evidência humana',()=>{
  const plan=approvePlan(submitForReview(createPlanDraft(seed,author),1,author),2,reviewer);
  assert.throws(()=>recordGoalEvidence(plan,'goal-01',{progress:80,description:'Observou comunicação independente'},plan.version,author));
  const changed=recordGoalEvidence(plan,'goal-01',{progress:80,rubric:'Observação em sala',description:'Utilizou cartões de comunicação em quatro situações'},plan.version,author);
  assert.equal(changed.goals[0].progress,80);
  assert.equal(plan.goals[0].progress,null);
  assert.equal(changed.history.at(-1).action,'goal_evidence');
});
