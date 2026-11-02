import test from 'node:test';import assert from 'node:assert/strict';
import {FIRE_LOCALES,fireTopics,fireTasks} from './content.mjs';
import {createFireLesson,advanceFireLesson} from './lessonState.mjs';
test('cinco trilhas concluem seis passos em todos os três idiomas',()=>{
 for(const locale of FIRE_LOCALES)for(const {id:topic} of fireTopics()){
  const tasks=fireTasks(locale).filter(t=>t.topic===topic);
  let state=createFireLesson(topic);
  assert.equal(tasks.length,6);
  for(let i=0;i<tasks.length;i++){
   const wrong=tasks[i].options.find(o=>o.id!==tasks[i].answer);
   state=advanceFireLesson(state,{type:'CHOOSE',id:wrong.id},tasks);
   assert.equal(state.status,'active');
   assert.strictEqual(advanceFireLesson(state,{type:'NEXT'},tasks),state);
   state=advanceFireLesson(state,{type:'CHOOSE',id:tasks[i].answer},tasks);
   assert.equal(state.status,'correct');
   state=advanceFireLesson(state,{type:'NEXT'},tasks);
   assert.equal(state.index,Math.min(i+1,tasks.length-1));
  }
  assert.equal(state.status,'finished');
  assert.strictEqual(advanceFireLesson(state,{type:'NEXT'},tasks),state);
  const restarted=advanceFireLesson(state,{type:'RESTART'},tasks);
  assert.equal(restarted.index,0);assert.equal(restarted.status,'active');
 }
});
test('pausa impede resposta e avanço; resposta concluída não é sobrescrita',()=>{
 const tasks=fireTasks('en-US').filter(t=>t.topic==='colors');
 let state=advanceFireLesson(createFireLesson('colors'),{type:'TOGGLE_PAUSE'},tasks);
 assert.equal(state.paused,true);
 assert.strictEqual(advanceFireLesson(state,{type:'CHOOSE',id:tasks[0].answer},tasks),state);
 state=advanceFireLesson(state,{type:'TOGGLE_PAUSE'},tasks);
 state=advanceFireLesson(state,{type:'CHOOSE',id:tasks[0].answer},tasks);
 assert.equal(state.status,'correct');
 const wrong=tasks[0].options.find(o=>o.id!==tasks[0].answer).id;
 assert.strictEqual(advanceFireLesson(state,{type:'CHOOSE',id:wrong},tasks),state);
});
test('respostas e estados inválidos falham sem abrir acesso a novos conteúdos',()=>{
 const tasks=fireTasks('en-US').filter(t=>t.topic==='colors');
 const state=createFireLesson('colors');
 assert.strictEqual(advanceFireLesson(state,{type:'CHOOSE',id:'invalid'},tasks),state);
 assert.strictEqual(advanceFireLesson(state,{type:'NEXT'},tasks),state);
 assert.strictEqual(advanceFireLesson(state,{type:'CHOOSE',id:tasks[0].answer},[]),state);
 assert.strictEqual(advanceFireLesson(state,{type:'UNKNOWN'},tasks),state);
 assert.throws(()=>createFireLesson('__proto__'));
});
