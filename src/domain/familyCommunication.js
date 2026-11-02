/**
 * Contratos puros de comunicação escolar (a API permanece fechada a dados reais).
 * Nunca interpretar este módulo como verificação de identidade ou envio persistente.
 */
const CHANNEL_KINDS=new Set(['pedagogical','aee','administrative']);
const STATES=new Set(['draft','approved','published','archived']);
function required(v,key){if(typeof v!=='string'||!v.trim())throw new Error(key+' obrigatório');return v.trim();}
function checkActor(actor){return required(actor?.subject,'Identidade verificada');}
function checkTenant(actor,tenantId){if(actor?.tenantId!==tenantId)throw new Error('Escopo de instituição divergente');}
export function createAnnouncementDraft({id,tenantId,schoolId,title,body,channel='pedagogical'},actor,at=new Date().toISOString()){
 const author=checkActor(actor);checkTenant(actor,tenantId);
 if(!['coordenacao','aee'].includes(actor.role))throw new Error('Papel não autorizado');
 if(!CHANNEL_KINDS.has(channel))throw new Error('Canal inválido');
 required(id,'Identificador');required(schoolId,'Escola');required(title,'Título');required(body,'Texto');
 if(body.length>10000)throw new Error('Comunicado muito extenso');
 return {id,tenantId,schoolId,title,body,channel,state:'draft',author,approvedBy:null,
  audience:'verified_guardians_only',version:1,createdAt:at,history:[]};
}
export function approveAnnouncement(draft,actor,expectedVersion,at=new Date().toISOString()){
 const reviewer=checkActor(actor);checkTenant(actor,draft.tenantId);
 if(actor.role!=='coordenacao'||actor.schoolId!==draft.schoolId)
  throw new Error('Aprovação restrita à coordenação da escola');
 if(reviewer===draft.author)throw new Error('Segundo profissional necessário');
 if(draft.version!==expectedVersion||draft.state!=='draft')throw new Error('Versão ou estado inválido');
 return {...draft,state:'approved',approvedBy:reviewer,version:expectedVersion+1,
  history:[...draft.history,{action:'approved',actor:reviewer,at}]};
}
export function publishAnnouncement(approved,actor,expectedVersion,at=new Date().toISOString()){
 const publisher=checkActor(actor);checkTenant(actor,approved.tenantId);
 if(actor.role!=='coordenacao'||approved.state!=='approved'||approved.version!==expectedVersion)
  throw new Error('Aprovação anterior obrigatória');
 if(actor.schoolId!==approved.schoolId)throw new Error('Instituição não autorizada');
 return {...approved,state:'published',version:expectedVersion+1,publishedAt:at,
  history:[...approved.history,{action:'published',actor:publisher,at}]};
}
export function acknowledgeAnnouncement(announcement,{guardian,studentId,guardianships,existing=[]},at=new Date().toISOString()){
 const subject=checkActor(guardian);
 if(announcement?.state!=='published')throw new Error('Comunicado não publicado');
 if(!Array.isArray(guardianships)||!guardianships.some(link=>
   link.tenantId===announcement.tenantId&&link.studentId===studentId&&
   link.guardianSubject===subject&&link.status==='verified'))
    throw new Error('Vínculo familiar não verificado');
 const key=announcement.id+'|'+studentId+'|'+subject;
 if(existing.some(e=>e.acknowledgmentKey===key))return {created:false,acknowledgments:existing};
 const entry={announcementId:announcement.id,tenantId:announcement.tenantId,studentId,
   guardianSubject:subject,acknowledgmentKey:key,receivedAt:at};
 return {created:true,acknowledgments:[...existing,entry]};
}
export function createFamilySummary({recordId,studentId,tenantId,summary},actor){
 const subject=checkActor(actor);checkTenant(actor,tenantId);
 if(!['aee','regente'].includes(actor.role))throw new Error('Somente docente vinculado pode revisar');
 required(recordId,'Registro');required(studentId,'Estudante');required(summary,'Resumo');
 if(summary.length>1500)throw new Error('Resumo extenso');
 return {recordId,studentId,tenantId,summary:summary.trim(),reviewedBy:subject,status:'awaiting_publication',
    visibility:'verified_family_only'};
}
export function sanitizeFamilyPush(_payload){
 return {title:'SINEA',body:'Abra o aplicativo para consultar uma atualização.',
  containsStudentInformation:false};
}
export function validateFamilyChannel(channel){
 return Boolean(channel?.id&&channel?.tenantId&&CHANNEL_KINDS.has(channel.kind)&&
   ['active','closed'].includes(channel.state));
}
