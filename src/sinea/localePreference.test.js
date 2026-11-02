import test from 'node:test';
import assert from 'node:assert/strict';
import {readLocalePreference,writeLocalePreference,localeStorageKey} from './localePreference.js';
test('somente idioma é gravado e carregado, sem perfis nem alunos',()=>{
 const entries=new Map();
 const s={getItem:k=>entries.get(k)??null,setItem:(k,v)=>entries.set(k,v)};
 assert.equal(readLocalePreference(s),'pt-BR');
 assert.equal(writeLocalePreference(s,'es-ES'),true);
 assert.equal(readLocalePreference(s),'es-ES');
 assert.deepEqual([...entries.keys()],[localeStorageKey()]);
});
test('preferências inválidas e bloqueio de storage não quebram a UI',()=>{
 const s={getItem:()=>{throw Error('denied')},setItem:()=>{throw Error('denied')}};
 assert.equal(readLocalePreference(s),'pt-BR');
 assert.equal(writeLocalePreference(s,'en-US'),false);
 assert.equal(readLocalePreference({getItem:()=>'unknown'}),'pt-BR');
 assert.equal(writeLocalePreference({setItem:()=>{}},'unknown'),true);
});
