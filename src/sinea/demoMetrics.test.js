import test from 'node:test';
import assert from 'node:assert/strict';
import {demoHomeMetrics,displayDemoNumber,visibleDemoAppointments,visibleDemoTasks} from './demoMetrics.js';
import {students,agenda,pending} from './demoData.js';
test('os contadores correspondem aos itens fictícios exibidos',()=>{
 const result=demoHomeMetrics('aee',students,agenda,pending);
 assert.equal(result.students,students.length);
 assert.equal(result.appointments,agenda.length);
 assert.equal(result.planReviews,pending.length);
});
test('perfil família só conta a sua simulação de estudante e compromissos',()=>{
 const result=demoHomeMetrics('familia',students,agenda,pending);
 assert.equal(result.students,1);
 assert.equal(result.appointments,agenda.filter(a=>a.studentId===students[0].id).length);
 assert.equal(result.planReviews,pending.filter(p=>p.studentId===students[0].id).length);
 assert.deepEqual(visibleDemoAppointments('secretaria',agenda,students),[]);
 assert.deepEqual(visibleDemoTasks('secretaria',pending,students),[]);
 assert.equal(demoHomeMetrics('secretaria',students,agenda,pending),null);
});
test('números seguem convenção regional sem expor dados reais',()=>{
 assert.equal(displayDemoNumber('pt-BR',1280),'1.280');
 assert.equal(displayDemoNumber('en-US',1280),'1,280');
 assert.equal(displayDemoNumber('es-ES',1280),'1280');
 assert.throws(()=>displayDemoNumber('pt-BR',-1));
});
