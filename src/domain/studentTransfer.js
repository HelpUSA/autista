/**
 * Transferências na mesma rede preservam identidade/histórico; não criam cópias
 * do prontuário. Compartilhamento entre redes exige fluxo jurídico separado.
 */
function check(condition,message){if(!condition)throw new Error(message);}
function actorId(actor){check(typeof actor?.subject==='string' && actor.subject,'Profissional obrigatório');return actor.subject;}
export function requestSchoolTransfer({student,fromSchoolId,toSchoolId,tenantId,reason},actor,at=new Date().toISOString()){
  const who=actorId(actor);
  check(student?.id && student.tenantId===tenantId,'Rede ou estudante inválido');
  check(student.schoolId===fromSchoolId && toSchoolId && fromSchoolId!==toSchoolId,'Escolas incompatíveis');
  check(actor.tenantId===tenantId && actor.schoolId===fromSchoolId &&
    actor.role==='coordenacao','Solicitante não autorizado');
  check(typeof reason==='string' && reason.trim().length>=10,'Justificativa necessária');
  return {id:null,tenantId,studentId:student.id,fromSchoolId,toSchoolId,
    requestedBy:who,requestedAt:at,approvedBy:null,completedAt:null,
    justification:reason,status:'requested',version:1,
    events:[{status:'requested',at,by:who}]};
}
export function approveSchoolTransfer(transfer,actor,expectedVersion,at=new Date().toISOString()){
  const who=actorId(actor);
  check(transfer.status==='requested' && transfer.version===expectedVersion,'Estado ou versão inválidos');
  check(actor.tenantId===transfer.tenantId && actor.schoolId===transfer.toSchoolId &&
    actor.role==='coordenacao' && who!==transfer.requestedBy,
    'Aprovação da escola destinatária necessária');
  return {...transfer,status:'approved',version:transfer.version+1,approvedBy:who,
    events:[...transfer.events,{status:'approved',at,by:who}]};
}
export function completeSchoolTransfer(transfer,actor,expectedVersion,at=new Date().toISOString()){
  const who=actorId(actor);
  check(transfer.status==='approved' && transfer.version===expectedVersion,
    'Transferência precisa estar aprovada e sem conflitos');
  check(actor.tenantId===transfer.tenantId && actor.schoolId===transfer.toSchoolId &&
    actor.role==='coordenacao','Destinatário não autorizado');
  return {...transfer,status:'completed',version:transfer.version+1,completedAt:at,
    events:[...transfer.events,{status:'completed',at,by:who}]};
}
