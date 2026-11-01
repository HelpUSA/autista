import { PLAN_KINDS } from './sineaCore.js';

function invariant(ok,message) { if (!ok) throw new Error(message); }
function verifiedActor(actor) {
  invariant(typeof actor?.subject === 'string' && actor.subject.trim().length > 0,
    'Responsável autenticado obrigatório');
  return actor.subject;
}
function validDate(value) { return typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(new Date(value + 'T00:00:00Z').getTime()); }
function checkGoal(goal) {
  invariant(goal?.id && typeof goal.id==='string', 'Meta precisa de identificador');
  invariant(typeof goal.area==='string' && goal.area.trim(), 'Área da meta obrigatória');
  invariant(typeof goal.description==='string' && goal.description.trim().length>=10,
    'Meta deve ser observável e suficientemente descrita');
  invariant(typeof goal.responsibleId==='string' && goal.responsibleId.trim(),
    'Meta deve possuir responsável');
  invariant(validDate(goal.dueOn),'Prazo da meta inválido');
}
function validatePlan(plan) {
  invariant(PLAN_KINDS.includes(plan?.kind), 'Tipo de plano inválido');
  invariant(typeof plan.studentId==='string' && plan.studentId, 'Estudante obrigatório');
  invariant(Number.isInteger(plan.schoolYear) && plan.schoolYear>=2000 && plan.schoolYear<=2150,
    'Ano letivo inválido');
  invariant(validDate(plan.nextReviewOn),'Data de revisão inválida');
  invariant(Array.isArray(plan.goals),'Metas inválidas');
  const ids=new Set();
  for(const goal of plan.goals) {
    checkGoal(goal);
    invariant(!ids.has(goal.id),'Identificador de meta repetido');
    ids.add(goal.id);
  }
}
function snapshot(plan) {return structuredClone(plan);}

export function createPlanDraft(input,actor,now=new Date().toISOString()) {
  const subject=verifiedActor(actor);
  const plan={id:input.id,studentId:input.studentId,kind:input.kind,
    schoolYear:input.schoolYear,nextReviewOn:input.nextReviewOn,
    goals:(input.goals??[]).map(g=>({...g,progress:null})),
    status:'draft',version:1,createdBy:subject,reviewedBy:null,approvedBy:null,
    createdAt:now,updatedAt:now,history:[]};
  invariant(typeof plan.id==='string' && plan.id, 'Identificador do plano obrigatório');
  validatePlan(plan);
  return plan;
}

export function revisePlan(plan,changes,expectedVersion,actor,now=new Date().toISOString()) {
  const subject=verifiedActor(actor);
  invariant(Number.isInteger(expectedVersion) && plan.version===expectedVersion,
    'Conflito de versão — revisão humana necessária');
  invariant(['draft','review'].includes(plan.status),'Plano aprovado não pode ser alterado sem nova versão formal');
  const allowed=new Set(['nextReviewOn','goals']);
  invariant(Object.keys(changes).every(key=>allowed.has(key)),'Alteração não autorizada');
  const draft=snapshot(plan);
  for(const [key,value] of Object.entries(changes)) draft[key]=snapshot(value);
  validatePlan(draft);
  draft.version++;
  draft.status='draft';
  draft.reviewedBy=null;
  draft.updatedAt=now;
  draft.history.push({version:draft.version,action:'revised',actor:subject,at:now});
  return draft;
}

export function submitForReview(plan,expectedVersion,actor,now=new Date().toISOString()) {
  const subject=verifiedActor(actor);
  invariant(plan.version===expectedVersion,'Conflito de versão');
  invariant(plan.status==='draft','Estado inválido');
  validatePlan(plan);
  invariant(plan.goals.length>0,'Plano sem metas não pode seguir para aprovação');
  const copy=snapshot(plan);
  copy.status='review';
  copy.version++;
  copy.updatedAt=now;
  copy.history.push({version:copy.version,action:'submitted',actor:subject,at:now});
  return copy;
}

export function approvePlan(plan,expectedVersion,actor,now=new Date().toISOString()) {
  const subject=verifiedActor(actor);
  invariant(plan.version===expectedVersion, 'Conflito de versão');
  invariant(plan.status==='review','Plano deve estar em revisão');
  invariant(subject!==plan.createdBy,'Aprovação requer segundo profissional');
  validatePlan(plan);
  invariant(plan.goals.length>0,'Plano sem metas');
  const copy=snapshot(plan);
  copy.status='approved';
  copy.approvedBy=subject;
  copy.approvedAt=now;
  copy.version++;
  copy.updatedAt=now;
  copy.history.push({version:copy.version,action:'approved',actor:subject,at:now});
  return copy;
}

export function recordGoalEvidence(plan,goalId,evidence,expectedVersion,actor,now=new Date().toISOString()) {
  const subject=verifiedActor(actor);
  invariant(plan.status==='approved','Evidência só pode ser vinculada ao plano aprovado');
  invariant(plan.version===expectedVersion,'Conflito de versão');
  const goal=plan.goals.find(g=>g.id===goalId);
  invariant(Boolean(goal),'Meta inexistente');
  invariant(typeof evidence?.description==='string' && evidence.description.trim().length>=10,
    'Descrever evidência observável');
  invariant(typeof evidence?.rubric==='string' && evidence.rubric.trim().length>=5,
    'Rubrica pedagógica obrigatória');
  invariant(Number.isInteger(evidence?.progress) && evidence.progress>=0 && evidence.progress<=100,
    'Percentual deve ser informado por profissional e estar entre 0 e 100');
  // Registro humano, não cálculo automático sobre diagnóstico, emoção ou comportamento.
  const copy=snapshot(plan);
  const item=copy.goals.find(g=>g.id===goalId);
  item.progress=evidence.progress;
  item.lastEvidence={description:evidence.description,rubric:evidence.rubric,actor:subject,at:now};
  copy.version++;
  copy.updatedAt=now;
  copy.history.push({version:copy.version,action:'goal_evidence',goalId,actor:subject,at:now});
  return copy;
}
