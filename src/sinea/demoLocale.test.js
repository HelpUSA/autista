import test from 'node:test';import assert from 'node:assert/strict';
import {localizeDemo,demoTranslationsMissing} from './demoLocale.js';
import * as data from './demoData.js';
test('campos da demonstração com texto não próprio foram revisados para EN/ES',()=>{
 assert.deepEqual(demoTranslationsMissing(data),[]);
});
test('idiomas traduzem needs e classificações mantendo nomes e IDs intactos',()=>{
 assert.equal(localizeDemo('en-US','Apoio visual'),'Visual support');
 assert.equal(localizeDemo('es-ES','Comunicação alternativa'),'Comunicación alternativa');
 assert.equal(localizeDemo('en-US','3º ano B'),'3rd grade B');
 assert.equal(localizeDemo('es-ES','4º ano A'),'4.º grado A');
 assert.equal(localizeDemo('pt-BR','Sala de recursos'),'Sala de recursos');
 assert.equal(localizeDemo('es-ES','Lucas Martins'),'Lucas Martins');
});
