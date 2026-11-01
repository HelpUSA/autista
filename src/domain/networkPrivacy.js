/**
 * Supressão estatística preliminar. NÃO é anonimização completa; filtros,
 * séries temporais e exportações precisam de análise de reidentificação.
 */
export function suppressBreakdown(groups,minimum=10) {
  if (!Array.isArray(groups) || !Number.isInteger(minimum) || minimum<2)
    throw new Error('Agregação inválida');
  if (!groups.every(g=>typeof g.label==='string' && Number.isInteger(g.count) && g.count>=0))
    throw new Error('Contagens inválidas');
  const seen=new Set();
  for (const group of groups) {
    if(seen.has(group.label))throw new Error('Categoria duplicada');
    seen.add(group.label);
  }
  const suppressed=new Set(groups.filter(g=>g.count<minimum).map(g=>g.label));
  if (suppressed.size===1 && groups.length>1) {
    const next=groups.filter(g=>!suppressed.has(g.label)).sort((a,b)=>a.count-b.count)[0];
    if(next)suppressed.add(next.label);
  }
  // Nunca devolver total exato juntamente com valores suprimidos: permitiria deduzir.
  return {total:suppressed.size ? null : groups.reduce((n,g)=>n+g.count,0),
    breakdown:groups.map(g=>({label:g.label,count:suppressed.has(g.label)?null:g.count,
      suppressed:suppressed.has(g.label)})),
    disclosureReviewRequired:true};
}
export function buildSafeReminder({kind,deadline}) {
  if(!['plan_review','appointment','document_pending','calm_followup'].includes(kind))
    throw new Error('Tipo de notificação inválido');
  if(deadline && typeof deadline!=='string')throw new Error('Prazo inválido');
  // Nunca transmitir nome, diagnóstico, turma, condição ou descrição.
  return {title:'SINEA · Pendência de acompanhamento',
    body:'Abra o aplicativo para consultar uma tarefa autorizada.',
    kind,deadline:deadline??null,containsSensitiveDetails:false};
}
