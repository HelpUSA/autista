/**
 * SINEA / domínio educacional: regras puras reutilizáveis no web e no mobile.
 * Este arquivo não grava nem envia dados sensíveis; integração depende de API autenticada.
 */
export const TRACKABLE_ROLES = Object.freeze([
  'aee','regente','mediador','coordenacao','secretaria','especialista',
  'consultor_evoluce','admin_evoluce'
]);

export const PLAN_KINDS = Object.freeze(['PEI','PDI','PAEE']);
export const PARTICIPATION_MIN = 1;
export const PARTICIPATION_MAX = 5;

export function validateDailyEntry(input) {
  if (!input || typeof input !== 'object') return {valid:false,error:'Registro inválido'};
  if (!input.studentId || typeof input.studentId !== 'string') return {valid:false,error:'Estudante obrigatório'};
  if (!input.modality || typeof input.modality !== 'string') return {valid:false,error:'Modalidade obrigatória'};
  if (!Number.isInteger(input.participation) || input.participation < 1 || input.participation > 5) {
    return {valid:false,error:'Participação deve estar entre 1 e 5'};
  }
  if (!input.activity || typeof input.activity !== 'string' || input.activity.trim().length < 3) {
    return {valid:false,error:'Descreva a atividade'};
  }
  if (input.activity.length > 5000) return {valid:false,error:'Descrição extensa'};
  if (input.observations && input.observations.length > 3000) return {valid:false,error:'Observação extensa'};
  return {valid:true};
}

/** Método seguro de convergência: mutações imutáveis e idempotentes.
 * Não faz last-write-wins para alteração de prontuário, plano ou evidência.
 * Conflitos exigem revisão humana, nunca descarte silencioso.
 */
export function reconcileOfflineBatch(existing = [], incoming = []) {
  if (!Array.isArray(existing) || !Array.isArray(incoming)) throw new Error('Lotes inválidos');
  const seen=new Map();
  const accepted=[];
  const duplicates=[];
  const conflicts=[];
  for (const event of existing) {
    if (!event.clientMutationId) throw new Error('Evento persistido sem identificador idempotente');
    seen.set(event.clientMutationId,event);
  }
  for (const event of incoming) {
    if (!event || typeof event.clientMutationId !== 'string' || event.clientMutationId.length < 8 ||
        typeof event.entityId !== 'string' || !Number.isInteger(event.baseVersion) || event.baseVersion < 0) {
      conflicts.push({event,reason:'evento_invalido'});
      continue;
    }
    const prior=seen.get(event.clientMutationId);
    if (prior) {
      if (JSON.stringify(prior.payload) === JSON.stringify(event.payload) && prior.entityId===event.entityId) {
        duplicates.push(event);
      } else {
        conflicts.push({event,reason:'idempotency_key_reused'});
      }
      continue;
    }
    const target=existing.find(e=>e.entityId===event.entityId);
    if (target && Number.isInteger(target.version) && target.version !== event.baseVersion) {
      conflicts.push({event,reason:'version_conflict'});
      continue;
    }
    accepted.push(event);
    seen.set(event.clientMutationId,event);
  }
  return {accepted,duplicates,conflicts};
}

/** Frequência exploratória, NÃO recomendação clínica, e apenas com revisão da equipe. */
export function summarizeCalmSessions(sessions = [], minimumObservations = 3) {
  if (!Array.isArray(sessions)) throw new Error('Sessões inválidas');
  const successes=sessions.filter(s=>s.outcome==='melhorou' && Array.isArray(s.items));
  const counts=new Map();
  for (const session of successes) {
    for (const item of new Set(session.items)) counts.set(item,(counts.get(item)??0)+1);
  }
  const candidateItems=[...counts.entries()]
    .filter(([,n])=>n>=minimumObservations)
    .sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]))
    .map(([id,count])=>({id,count,requiresProfessionalConfirmation:true}));
  return {
    totalSessions:sessions.length,
    improvementObserved:successes.length,
    candidates:candidateItems
  };
}

/** Garante que licença significa um assento por estudante ativo, e não por profissional. */
export function countStudentLicenses(assignments = []) {
  if (!Array.isArray(assignments)) throw new Error('Vínculos inválidos');
  return new Set(assignments.filter(a=>a && a.active===true && a.studentId).map(a=>a.studentId)).size;
}

/** Supressão mínima como salvaguarda ilustrativa, não prova de anonimização. */
export function suppressSmallGroup(count, min=10) {
  if (!Number.isInteger(count)||count<0||!Number.isInteger(min)||min<1) throw new Error('Contagem inválida');
  return count < min ? null : count;
}
