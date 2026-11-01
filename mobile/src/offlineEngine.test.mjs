import test from 'node:test';import assert from 'node:assert/strict';
import {enqueueEncryptedMutation,nextBatch,applySyncResults,requireRemoteWipe} from './offlineEngine.mjs';
const event={clientMutationId:'11111111-1111-4111-8111-111111111111',
 entityId:'22222222-2222-4222-8222-222222222222',
 tenantId:'33333333-3333-4333-8333-333333333333',
 entityKind:'daily_record',baseVersion:0,payloadHash:'a'.repeat(64),
 encryptedPayload:'enc:v1:opaque-ciphertext'};
test('fila offline falha fechada quando armazenamento cifrado não existe',()=>{
 assert.throws(()=>enqueueEncryptedMutation([],event),/Armazenamento seguro/);
 assert.throws(()=>enqueueEncryptedMutation([],{...event,encryptedPayload:'plaintext'},{encryptedStorageReady:true}),/criptografado/);
});
test('fila gera operações imutáveis sem permitir mutação idempotente repetida',()=>{
 const a=enqueueEncryptedMutation([],event,{encryptedStorageReady:true});
 assert.equal(a[0].status,'queued');
 assert.throws(()=>enqueueEncryptedMutation(a,event,{encryptedStorageReady:true}));
 assert.equal(a[0].encryptedPayload,'enc:v1:opaque-ciphertext');
});
test('ACK elimina payload do estado e conflito mantém operação para revisão',()=>{
 const a=enqueueEncryptedMutation([],event,{encryptedStorageReady:true});
 const ack=applySyncResults(a,[{clientMutationId:event.clientMutationId,state:'applied',version:1}]);
 assert.equal(ack[0].encryptedPayload,null);assert.equal(ack[0].status,'acknowledged');
 const conflict=applySyncResults(a,[{clientMutationId:event.clientMutationId,state:'conflict'}]);
 assert.equal(conflict[0].status,'conflict');
 assert.equal(conflict[0].encryptedPayload,a[0].encryptedPayload);
 assert.equal(a[0].status,'queued');
});
test('lotes e apagamento remoto exigem política explícita',()=>{
 const a=enqueueEncryptedMutation([],event,{encryptedStorageReady:true});
 assert.equal(nextBatch(a,20).length,1);
 assert.throws(()=>nextBatch(a,0));
 let wiped=false;
 assert.equal(requireRemoteWipe(()=>{wiped=true;},false),false);
 assert.equal(requireRemoteWipe(()=>{wiped=true;},true),true);
 assert.equal(wiped,true);
});
