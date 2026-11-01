import test from 'node:test';import assert from 'node:assert/strict';
import {prepareSafeLearningContext,reviewPedagogicalSuggestion} from './aiGuardrails.js';
test('IA recebe apenas lista permitida de dados pedagógicos pseudonimizados',()=>{
 const safe=prepareSafeLearningContext({studentName:'CRIANÇA',cpf:'123',school:'ESCOLA',
   medicalReport:'INTEGRA',lessonObjective:'Reconhecer figuras',preferredFormats:['cartões']});
 assert.equal(safe.pseudonymized,true);
 assert.equal(JSON.stringify(safe).includes('CRIANÇA'),false);
 assert.equal(JSON.stringify(safe).includes('INTEGRA'),false);
 assert.equal(JSON.stringify(safe).includes('ESCOLA'),false);
});
test('agente não aprova sugestões automaticamente nem sem fontes',()=>{
 const suggestion={objective:'Reconhecer figuras',adaptations:'Apresentar figuras grandes'};
 const reviewer={subject:'prof',role:'aee'};
 const approved=reviewPedagogicalSuggestion(suggestion,[{id:'fonte1',title:'Material validado'}],reviewer);
 assert.equal(approved.automaticallyApplied,false);
 assert.throws(()=>reviewPedagogicalSuggestion(suggestion,[],reviewer));
});
test('conteúdo clínico ou medicação são bloqueados no guardrail',()=>{
 assert.throws(()=>reviewPedagogicalSuggestion({objective:'Qualquer',adaptations:'Prescrever medicação'},[{id:'1',title:'Fonte'}],{subject:'p',role:'aee'}));
});
