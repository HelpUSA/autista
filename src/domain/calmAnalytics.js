/**
 * Observações do Canto da Calma: não são diagnóstico, punição nem classificação clínica.
 * Tendências NÃO devem produzir intervenções automáticas.
 */
const outcomes=new Set(['melhorou','igual','piorou']);
const returns=new Set(['sim','nao','parcialmente']);
function rating(x){return Number.isInteger(x) && x>=1 && x<=5;}
export function validateCalmSession(entry) {
  const errors=[];
  if (!entry?.studentId || !entry?.professionalId) errors.push('vinculos_obrigatorios');
  if (!rating(entry?.entryScale) || !rating(entry?.exitScale)) errors.push('escala_1_a_5');
  if (!outcomes.has(entry?.outcome)) errors.push('resultado_invalido');
  if (!returns.has(entry?.returnedToActivity)) errors.push('retorno_invalido');
  if (!Number.isInteger(entry?.durationSeconds) || entry.durationSeconds<0 || entry.durationSeconds>43200)
    errors.push('duracao_invalida');
  if (!Array.isArray(entry?.items) || !entry.items.every(i=>typeof i==='string' && i.length>0))
    errors.push('itens_invalidos');
  if (entry?.purpose && entry.purpose!=='regulation') errors.push('somente_acolhimento');
  const disallowed=/puni[cç][aã]o|castigo|isolamento punitivo/i;
  if (disallowed.test(String(entry?.notes ?? ''))) errors.push('rever_registro_sensivel');
  return {valid:errors.length===0,errors};
}
export function summarizeCalmObservations(sessions,referenceDate) {
  if (!Array.isArray(sessions)) throw new Error('Sessões inválidas');
  const counts=new Map();
  const valid=sessions.filter(s=>validateCalmSession(s).valid);
  const durations=valid.map(s=>s.durationSeconds);
  const improving=valid.filter(s=>s.outcome==='melhorou');
  for(const item of improving.flatMap(s=>[...new Set(s.items)]))
    counts.set(item,(counts.get(item)??0)+1);
  const candidates=[...counts.entries()].filter(([,n])=>n>=3).sort((a,b)=>b[1]-a[1])
    .map(([item,count])=>({item,count,requiresConfirmation:true}));
  const result={sessions:valid.length,improved:improving.length,
    meanMinutes:valid.length ? Math.round(durations.reduce((a,b)=>a+b,0)/valid.length/60*10)/10:null,
    candidateItems:candidates,source:'observacoes_profissionais',notClinicalAdvice:true};
  if(referenceDate && !/^\d{4}-\d{2}-\d{2}$/.test(referenceDate)) throw new Error('Data de referência inválida');
  return result;
}
