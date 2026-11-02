import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const config=JSON.parse(readFileSync(new URL('./app.json',import.meta.url),'utf8'));
const app=readFileSync(new URL('./App.jsx',import.meta.url),'utf8');
const content=readFileSync(new URL('./content.mjs',import.meta.url),'utf8');
test('edição infantil é interna, sem aprovação para submissão',()=>{
 assert.equal(config.expo.extra.edition,'FIRE_INTERNAL_ONLY');
 assert.equal(config.expo.extra.storeSubmissionAuthorized,false);
 assert.equal(config.expo.extra.childrenDataEnabled,false);
 assert.equal(config.expo.extra.apiEnabled,false);
 assert.match(config.expo.android.package,/\.preview$/);
 assert.equal(config.expo.updates.enabled,false);
});
test('bloqueia rede e permissões sensíveis na configuração Android',()=>{
 const p=config.expo.android.blockedPermissions;
 for(const perm of ['INTERNET','ACCESS_NETWORK_STATE','CAMERA','RECORD_AUDIO',
 'ACCESS_FINE_LOCATION','READ_CONTACTS','POST_NOTIFICATIONS'])
   assert.ok(p.includes('android.permission.'+perm));
 assert.deepEqual(config.expo.android.permissions,[]);
});
test('edição Fire não importa telas escolares, storage, APIs nem telemetria',()=>{
 for(const source of [app,content]){
  for(const forbidden of [/\bfetch\s*\(/,/\bXMLHttpRequest\b/,/\bAsyncStorage\b/,
   /\baxios\b/,/\bexpo-location\b/,/\bexpo-camera\b/,/\bexpo-notifications\b/,
   /\bSineaAppV2\b/,/\bserver\/\b/,/\bhttp:\/\//,/\bhttps:\/\//]){
   assert.equal(forbidden.test(source),false,'Forbidden '+forbidden);
  }
 }
});
