import test from 'node:test';
import assert from 'node:assert/strict';
import {FIRE_LOCALES,FIRE_DEFAULT_LOCALE,fireTopics,fireTasks,fireRoutine,
 fireCommunicationCards,fireContentAudit,isFireAnswerCorrect,fireText} from './content.mjs';
test('inglês americano é o idioma inicial, com três idiomas completos',()=>{
 assert.equal(FIRE_DEFAULT_LOCALE,'en-US');
 assert.deepEqual(FIRE_LOCALES,['en-US','pt-BR','es-ES']);
 for(const r of fireContentAudit()){assert.deepEqual(r.missing,[],r.locale);assert.deepEqual(r.extra,[],r.locale);}
});
test('cada idioma tem 30 atividades com respostas únicas verificáveis',()=>{
 for(const locale of FIRE_LOCALES){
  const tasks=fireTasks(locale);
  assert.equal(tasks.length,30);
  assert.equal(new Set(tasks.map(t=>t.id)).size,30);
  for(const topic of fireTopics())assert.equal(tasks.filter(t=>t.topic===topic.id).length,6);
  for(const task of tasks){
   assert.equal(task.options.length,3);
   assert.equal(new Set(task.options.map(x=>x.id)).size,3);
   assert.equal(task.options.filter(x=>isFireAnswerCorrect(task,x.id)).length,1);
   assert.ok(task.prompt.trim().length>5);
   assert.ok(task.options.every(x=>x.text&&x.symbol));
  }
 }
});
test('cartões de comunicação e rotina são localizados e não armazenam nada',()=>{
 for(const locale of FIRE_LOCALES){
  assert.equal(fireCommunicationCards(locale).length,6);
  assert.equal(fireRoutine(locale).length,6);
  assert.ok(fireCommunicationCards(locale).every(x=>x.text.length>1));
  assert.ok(fireRoutine(locale).every(x=>x.text.length>1));
 }
});
test('enunciados e privacidade mudam com locale e fallback é inglês',()=>{
 assert.notEqual(fireText('en-US','welcome'),fireText('pt-BR','welcome'));
 assert.notEqual(fireText('pt-BR','welcome'),fireText('es-ES','welcome'));
 assert.equal(fireText('fr','welcome'),fireText('en-US','welcome'));
 assert.throws(()=>fireText('pt-BR','missing_translation'));
});
