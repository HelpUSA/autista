import test from 'node:test';import assert from 'node:assert/strict';
import {createAnnouncementDraft,approveAnnouncement,publishAnnouncement,acknowledgeAnnouncement,
 createFamilySummary,sanitizeFamilyPush,validateFamilyChannel} from './familyCommunication.js';
const creator={subject:'teacher-1',tenantId:'tenant-1',schoolId:'school-1',role:'aee'};
const reviewer={subject:'coord-1',tenantId:'tenant-1',schoolId:'school-1',role:'coordenacao'};
const sample={id:'a1',tenantId:'tenant-1',schoolId:'school-1',title:'Reunião',body:'Revisão de metas'};
test('comunicado requer revisão de segundo profissional e escopo da escola',()=>{
 const draft=createAnnouncementDraft(sample,creator);
 assert.equal(draft.state,'draft');
 assert.throws(()=>approveAnnouncement(draft,creator,1));
 const approved=approveAnnouncement(draft,reviewer,1);
 const published=publishAnnouncement(approved,reviewer,2);
 assert.equal(published.state,'published');
 assert.deepEqual(published.history.map(x=>x.action),['approved','published']);
 assert.equal(draft.state,'draft');
});
test('coordenador de outra escola não autoriza comunicado',()=>{
 const draft=createAnnouncementDraft(sample,creator);
 assert.throws(()=>approveAnnouncement(draft,{...reviewer,schoolId:'other'},1));
});
test('confirmação de leitura exige responsável verificado e é idempotente',()=>{
 const doc=publishAnnouncement(approveAnnouncement(createAnnouncementDraft(sample,creator),reviewer,1),reviewer,2);
 const guardian={subject:'guardian-1'};
 const scope={guardian,studentId:'student-1',
  guardianships:[{tenantId:'tenant-1',studentId:'student-1',guardianSubject:'guardian-1',status:'verified'}]};
 const first=acknowledgeAnnouncement(doc,scope);
 assert.equal(first.created,true);
 const repeated=acknowledgeAnnouncement(doc,{...scope,existing:first.acknowledgments});
 assert.equal(repeated.created,false);
 assert.equal(repeated.acknowledgments.length,1);
 assert.throws(()=>acknowledgeAnnouncement(doc,{...scope,guardianships:[]}));
 assert.throws(()=>acknowledgeAnnouncement(doc,{...scope,guardian:{subject:'stranger'}}));
});
test('resumo destinado à família exige docente e não é publicação automática',()=>{
 const input={recordId:'r1',studentId:'s1',tenantId:'tenant-1',summary:'Leitura com cartões visuais'};
 const note=createFamilySummary(input,creator);
 assert.equal(note.status,'awaiting_publication');
 assert.equal(note.visibility,'verified_family_only');
 assert.throws(()=>createFamilySummary(input,{...creator,role:'secretaria'}));
});
test('push permanece genérico sem nome, diagnóstico ou prontuário',()=>{
 const result=sanitizeFamilyPush({studentName:'FULANO',diagnosis:'TEA',report:'SEGREDO'});
 assert.equal(JSON.stringify(result).includes('FULANO'),false);
 assert.equal(JSON.stringify(result).includes('SEGREDO'),false);
});
test('canal escolar exige tipo conhecido',()=>{
 assert.equal(validateFamilyChannel({id:'c1',tenantId:'t1',kind:'aee',state:'active'}),true);
 assert.equal(validateFamilyChannel({id:'c1',tenantId:'t1',kind:'clinical_record',state:'active'}),false);
});
