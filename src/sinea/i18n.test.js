import test from 'node:test';import assert from 'node:assert/strict';
import {translationCoverage,translate,normalizeLocale,LANGUAGES,dictionaries} from './i18n.js';
test('SINEA possui português, inglês e espanhol sem chaves ausentes',()=>{
 assert.deepEqual(LANGUAGES.map(x=>x.id),['pt-BR','en-US','es-ES']);
 for(const [id,stats] of Object.entries(translationCoverage())){
   assert.equal(stats.missing.length,0,id+': '+stats.missing.join(','));
   assert.equal(stats.extra.length,0,id+': '+stats.extra.join(','));
 }
});
test('rótulos importantes mudam com idioma e ausência usa fallback pt',()=>{
 assert.equal(translate('pt-BR','family'),'Escola e família');
 assert.equal(translate('en-US','family'),'School & family');
 assert.equal(translate('es-ES','family'),'Escuela y familia');
 assert.equal(normalizeLocale('fr'),'pt-BR');
 assert.equal(translate('fr','plans'),dictionaries['pt-BR'].plans);
});
test('rótulos de segurança e confirmação estão nos três idiomas',()=>{
 for(const {id} of LANGUAGES){
  for(const key of ['demo','demoLocked','familyAccess','calmEthics','readConfirmed','language','privacy','copyright']){
    assert.ok(translate(id,key).length>10 || key==='language' || key==='privacy');
  }
 }
});
