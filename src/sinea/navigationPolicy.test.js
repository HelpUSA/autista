import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_ROLES,DEMO_SCREENS,canOpenDemoScreen,landingDemoScreen,
 resolveDemoScreen,visibleDemoNavigation,studentVisibleToDemoRole} from './navigationPolicy.js';
test('perfis demo não possuem acesso a telas não relacionadas',()=>{
 for(const [role,allowed] of Object.entries(DEMO_ROLES)){
   for(const screen of DEMO_SCREENS)assert.equal(canOpenDemoScreen(role,screen),allowed.includes(screen),role+' '+screen);
 }
});
test('Secretaria visualiza apenas painel e não acessa prontuário/diário/família',()=>{
 for(const screen of DEMO_SCREENS.filter(screen=>screen!=='dashboard'))assert.equal(canOpenDemoScreen('secretaria',screen),false);
 assert.equal(resolveDemoScreen('secretaria','home'),'dashboard');
});
test('família não navega para registrar, painel institucional ou suporte IA',()=>{
 for(const screen of ['record','dashboard','support'])assert.equal(canOpenDemoScreen('familia',screen),false);
 assert.equal(resolveDemoScreen('familia','record'),'home');
});
test('papel e tela desconhecidos negados sem lançamento de erro',()=>{
 assert.equal(canOpenDemoScreen('hacker','dashboard'),false);
 assert.equal(canOpenDemoScreen('__proto__','dashboard'),false);
 assert.equal(canOpenDemoScreen('aee','undefined-screen'),false);
 assert.equal(landingDemoScreen('admin'),null);
 assert.equal(resolveDemoScreen('admin','dashboard'),null);
});
test('links de navegação são filtrados pela política e não apenas CSS',()=>{
 assert.deepEqual(visibleDemoNavigation('secretaria',[['home',1],['dashboard',2],['record',3]]),[['dashboard',2]]);
 assert.deepEqual(visibleDemoNavigation('familia',[['family',1],['record',2],['plans',3]]),[['family',1],['plans',3]]);
});
test('família demonstra somente estudante fictício de vínculo simulado',()=>{
 const ids=['stu-01','stu-02','stu-03'];
 assert.equal(studentVisibleToDemoRole('familia','stu-01',ids),true);
 assert.equal(studentVisibleToDemoRole('familia','stu-02',ids),false);
 assert.equal(studentVisibleToDemoRole('aee','stu-02',ids),true);
 assert.equal(studentVisibleToDemoRole('secretaria','stu-01',ids),false);
 assert.equal(studentVisibleToDemoRole('aee','unknown',ids),false);
});
