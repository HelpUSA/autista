/**
 * Fase 2 — regras para preparar contexto pseudonimizado e revisar saída RAG.
 * Não executa inferência, não envia dados externos e não aceita laudos integrais.
 */
const allowed = new Set(['schoolStage','classYear','lessonObjective',
  'communicationSupports','sensorySupports','learningGoals','preferredFormats']);
function plain(value) {return typeof value==='string' && value.trim().length>0 && value.length<=2000;}
export function prepareSafeLearningContext(input) {
  if(!input || typeof input!=='object')throw new Error('Contexto inválido');
  const output={};
  for(const key of allowed) {
    const value=input[key];
    if(value===undefined)continue;
    if(Array.isArray(value)) {
      if(!value.every(plain) || value.length>20)throw new Error('Contexto não autorizado');
      output[key]=value.map(v=>v.trim());
    } else if(plain(value)) output[key]=value.trim();
    else throw new Error('Contexto não autorizado');
  }
  if(!output.lessonObjective)throw new Error('Objetivo pedagógico é obrigatório');
  // No fields such as name/CPF/school/diagnosis/medical reports can pass.
  return Object.freeze({schemaVersion:1,pseudonymized:true,context:output});
}
export function reviewPedagogicalSuggestion(suggestion,sources,reviewer){
  if(!reviewer?.subject || !['aee','regente','especialista'].includes(reviewer.role))
    throw new Error('Revisor pedagógico obrigatório');
  if(!suggestion || typeof suggestion.objective!=='string' ||
    typeof suggestion.adaptations!=='string' || !suggestion.adaptations.trim())
    throw new Error('Sugestão incompleta');
  if(/prescrever|medica[cç][aã]o|dosagem|diagnosticar|laudo definitivo/i.test(suggestion.adaptations))
    throw new Error('Conteúdo clínico fora do escopo');
  if(!Array.isArray(sources)||sources.length===0||sources.some(s=>!s?.id||!s?.title))
    throw new Error('Fontes verificáveis obrigatórias');
  return {approvedForReview:true,automaticallyApplied:false,
    reviewer:reviewer.subject,sourceRefs:sources.map(s=>s.id),
    suggestedObjective:suggestion.objective};
}
