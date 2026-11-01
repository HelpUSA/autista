import test from 'node:test';import assert from 'node:assert/strict';
import {requestSchoolTransfer,approveSchoolTransfer,completeSchoolTransfer} from './studentTransfer.js';
const student={id:'s1',tenantId:'rede1',schoolId:'escola1'};
const a={subject:'coordenadora-origem',tenantId:'rede1',schoolId:'escola1',role:'coordenacao'};
const b={subject:'coordenadora-destino',tenantId:'rede1',schoolId:'escola2',role:'coordenacao'};
test('transferência válida preserva identidade do estudante e histórico de eventos',()=>{
  const request=requestSchoolTransfer({student,tenantId:'rede1',fromSchoolId:'escola1',toSchoolId:'escola2',reason:'Mudança de unidade escolar'},a);
  const approved=approveSchoolTransfer(request,b,1);
  const completed=completeSchoolTransfer(approved,b,2);
  assert.equal(completed.status,'completed');
  assert.equal(completed.studentId,student.id);
  assert.deepEqual(completed.events.map(e=>e.status),['requested','approved','completed']);
  assert.equal(student.schoolId,'escola1');
});
test('transferência entre redes não ocorre pelo fluxo de mesma rede',()=>{
  assert.throws(()=>requestSchoolTransfer({student,tenantId:'outra-rede',fromSchoolId:'escola1',toSchoolId:'escola2',reason:'Mudança de unidade escolar'},a));
});
test('origem não pode aprovar a própria transferência',()=>{
  const request=requestSchoolTransfer({student,tenantId:'rede1',fromSchoolId:'escola1',toSchoolId:'escola2',reason:'Mudança de unidade escolar'},a);
  assert.throws(()=>approveSchoolTransfer(request,a,1));
  assert.throws(()=>completeSchoolTransfer(request,b,1));
  assert.throws(()=>approveSchoolTransfer(request,b,9));
});
