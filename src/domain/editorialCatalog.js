/**
 * Catálogo e licenciamento da editora separados de prontuários e identidades.
 * BNCC é metadado validado por editor humano, não classificador de IA.
 */
const stages=new Set(['infantil','fundamental_i','fundamental_ii','medio']);
function guard(ok,msg){if(!ok)throw new Error(msg);}
export function createEditorialMaterial(input,editor){
  guard(editor?.role==='editor' && editor.subject,'Editor autorizado obrigatório');
  guard(typeof input?.id==='string'&&input.id,'ID de material obrigatório');
  guard(typeof input?.title==='string'&&input.title.trim(),'Título obrigatório');
  guard(stages.has(input.stage),'Etapa escolar inválida');
  guard(typeof input.edition==='string'&&input.edition.trim(),'Edição obrigatória');
  guard(typeof input.copyrightOwner==='string'&&input.copyrightOwner.trim(),
    'Titular dos direitos obrigatório');
  return {id:input.id,title:input.title,edition:input.edition,stage:input.stage,
    copyrightOwner:input.copyrightOwner,sourceReferences:input.sourceReferences??[],
    bnccCodes:[],status:'draft',reviewedBy:null,version:1};
}
export function approveBnccMappings(material,codes,reviewer){
  guard(reviewer?.role==='pedagogical_reviewer'&&reviewer.subject,'Revisão pedagógica necessária');
  guard(material.status==='draft' && Array.isArray(codes),'Estado inválido');
  guard(codes.every(c=>typeof c.code==='string' && c.code.trim() &&
    typeof c.justification==='string'&&c.justification.trim().length>=10 &&
    typeof c.curriculumEdition==='string'&&c.curriculumEdition.trim()),
    'Mapeamento BNCC necessita edição e justificativa humana');
  guard(new Set(codes.map(c=>c.code)).size===codes.length,'Código repetido');
  return {...material,bnccCodes:structuredClone(codes),reviewedBy:reviewer.subject,
    status:'approved',version:material.version+1};
}
export function mayUseMaterial(material,license,{tenantId,at='2026-11-01'}){
  if(material?.status!=='approved' || !license || license.materialId!==material.id ||
    license.tenantId!==tenantId || license.status!=='active')return false;
  if(typeof at!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(at))return false;
  return (!license.startsOn||at>=license.startsOn) && (!license.endsOn||at<=license.endsOn);
}
export function independentPlanningAccess(actor,license){
  return Boolean(actor?.role==='consultor_evoluce' && actor.subject &&
    license?.mode==='planning_only' && license.status==='active' &&
    !('students' in (actor??{})));
}
