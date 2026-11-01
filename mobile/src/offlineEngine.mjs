/**
 * Fila offline SINEA — domínio puro, independente do storage.
 * NUNCA persista operações/identificadores de crianças em AsyncStorage ou texto aberto.
 * No app nativo o adaptador deve ser cifrado (SQLCipher etc.) e protegidos por PIN/biometria.
 */
const allowedKinds=new Set(['daily_record','calm_session']);
function check(ok,msg){if(!ok)throw new Error(msg);}
function uuid(value){return typeof value==='string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);}
export function enqueueEncryptedMutation(queue,entry,{encryptedStorageReady=false}={}){
  check(encryptedStorageReady,'Armazenamento seguro obrigatório; nenhuma fila persistente permitida');
  check(Array.isArray(queue),'Fila inválida');
  check(uuid(entry?.clientMutationId)&&uuid(entry?.entityId)&&uuid(entry?.tenantId),'IDs inválidos');
  check(allowedKinds.has(entry?.entityKind),'Tipo de operação inválido');
  check(Number.isInteger(entry?.baseVersion)&&entry.baseVersion>=0,'Versão inválida');
  check(typeof entry?.payloadHash==='string' && /^[a-f0-9]{64}$/i.test(entry.payloadHash),
    'Hash do conteúdo obrigatório');
  check(typeof entry?.encryptedPayload==='string' && entry.encryptedPayload.startsWith('enc:v1:'),
    'Conteúdo deve estar criptografado pelo adaptador nativo');
  check(!queue.some(x=>x.clientMutationId===entry.clientMutationId),
    'Identificador idempotente já utilizado');
  // Nunca extrair payload em claro neste motor; somente transporte cifrado.
  const {clientMutationId,entityId,tenantId,entityKind,baseVersion,payloadHash,encryptedPayload}=entry;
  return [...queue,{clientMutationId,entityId,tenantId,entityKind,baseVersion,payloadHash,
    encryptedPayload,status:'queued',attempts:0,createdAt:new Date().toISOString()}];
}
export function nextBatch(queue,max=20){
  check(Number.isInteger(max)&&max>0&&max<=100,'Tamanho inválido');
  return queue.filter(x=>x.status==='queued').slice(0,max).map(x=>({...x,status:'syncing',attempts:x.attempts+1}));
}
export function applySyncResults(queue,responses){
  check(Array.isArray(queue)&&Array.isArray(responses),'Lotes inválidos');
  const byId=new Map(responses.map(r=>[r.clientMutationId,r]));
  return queue.map(item=>{
    const result=byId.get(item.clientMutationId);
    if(!result)return item;
    check(['applied','already_applied','conflict','retry'].includes(result.state),
      'Resposta do servidor não reconhecida');
    if(result.state==='applied'||result.state==='already_applied')
      return {...item,status:'acknowledged',serverVersion:result.version??null,
        encryptedPayload:null};
    if(result.state==='conflict')
      return {...item,status:'conflict',conflictCode:result.code??'version_conflict'};
    return {...item,status:'queued'};
  });
}
export function requireRemoteWipe(clearEncryptedStore,deviceRevoked) {
  if(!deviceRevoked)return false;
  check(typeof clearEncryptedStore==='function','Mecanismo de apagamento obrigatório');
  clearEncryptedStore();
  return true;
}
