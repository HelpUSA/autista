import test from 'node:test';
import assert from 'node:assert/strict';
import { createHttpServer } from '../src/http.mjs';

const tenant='11111111-1111-4111-8111-111111111111';
const studentId='22222222-2222-4222-8222-222222222222';
const student={id:studentId,tenantId:tenant,schoolId:'school1'};
function repo(role='aee',assigned=true) {
  return {async withActor({subject,tenantId},fn){
    return fn({
      async getActor(){return {subject,memberships:[{tenantId,schoolId:'school1',
        assignedStudentIds:assigned?[studentId]:[],status:'active',role}]};},
      async getStudent(id){return tenantId===tenant && id===studentId?student:null;},
      async listPlans(){return [{id:'p1',kind:'PEI',version:1}]},
      async insertDailyRecord(){return {ok:true}},
      async insertCalmSession(){return {ok:true}}
    });
  }};
}
async function call(app,path,{method='GET',body=null,headers={}}={}){
  const server=createHttpServer(app);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port+path;
  try {
    const response=await fetch(url,{method,headers,body:body?JSON.stringify(body):undefined});
    return {status:response.status,data:await response.json(),headers:response.headers};
  }finally {await new Promise(resolve=>server.close(resolve));}
}
const api={verify:async token=>token==='good'?{subject:'subject',amr:['mfa']}:null,
  repository:repo()};
const path='/v1/students/'+studentId+'/plans';
const headers={authorization:'Bearer good','x-sinea-tenant-id':tenant};

test('healthz não expõe dados pessoais e retorna no-store',async()=>{
  const r=await call(api,'/healthz');
  assert.equal(r.status,200);
  assert.match(r.headers.get('cache-control'),/no-store/);
});
test('rejeita acesso sem bearer token',async()=>{
  const r=await call(api,path,{headers:{'x-sinea-tenant-id':tenant}});
  assert.equal(r.status,401);
});
test('rejeita token não verificado',async()=>{
  const r=await call(api,path,{headers:{...headers,authorization:'Bearer bad'}});
  assert.equal(r.status,401);
});
test('acesso a registros exige segundo fator de autenticação',async()=>{
  const r=await call({...api,verify:async()=>({subject:'subject',amr:[]})},path,{headers});
  assert.equal(r.status,403);
});
test('servidor não confia em tenant ou vínculos declarados pelo navegador',async()=>{
  const r=await call(api,path,{headers:{...headers,'x-sinea-tenant-id':'33333333-3333-4333-8333-333333333333'}});
  assert.equal(r.status,404);
  const noLink=await call({...api,repository:repo('aee',false)},path,{headers});
  assert.equal(noLink.status,403);
});
test('AEE pode consultar plano pedagógico com vínculo derivado do servidor',async()=>{
  const r=await call(api,path,{headers});
  assert.equal(r.status,200);
  assert.equal(r.data.plans[0].kind,'PEI');
});
test('Secretaria não consulta prontuário nominal',async()=>{
  const r=await call({...api,repository:repo('secretaria')},path,{headers});
  assert.equal(r.status,403);
});
test('gravações de alunos bloqueadas até liberação dos gates de segurança',async()=>{
  const r=await call(api,'/v1/students/'+studentId+'/daily-records',
    {method:'POST',headers,body:{studentId,activity:'Atividade',participation:4,modality:'AEE individual'}});
  assert.equal(r.status,503);
});
test('não aceita identificador de instituição arbitrário',async()=>{
  const r=await call(api,path,{headers:{...headers,'x-sinea-tenant-id':'tenant-a'}});
  assert.equal(r.status,400);
});
