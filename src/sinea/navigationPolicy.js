/**
 * Segregação de telas apenas para o protótipo.
 * NÃO é autenticação, autorização real, nem substitui o RBAC/RLS do servidor.
 * Falha fechada para papéis, telas e rotas desconhecidos.
 */
export const DEMO_SCREENS=Object.freeze([
 'home','students','studentDetail','record','plans','dashboard',
 'family','routine','activities','calm','support'
]);
export const DEMO_ROLES=Object.freeze({
 aee:['home','students','studentDetail','record','plans','family','routine','activities','calm','support'],
 mediador:['home','students','studentDetail','record','family','routine','activities','calm'],
 coordenacao:['home','students','studentDetail','record','plans','dashboard','family','routine','activities','calm','support'],
 secretaria:['dashboard'],
 familia:['home','students','studentDetail','plans','family','routine','activities','calm']
});
export function canOpenDemoScreen(role,screen){
 return Boolean(DEMO_ROLES[role]?.includes(screen));
}
export function landingDemoScreen(role){
 return role==='secretaria'?'dashboard':canOpenDemoScreen(role,'home')?'home':null;
}
export function resolveDemoScreen(role,requested){
 if(canOpenDemoScreen(role,requested))return requested;
 return landingDemoScreen(role);
}
export function visibleDemoNavigation(role,items){
 return items.filter(item=>canOpenDemoScreen(role,item[0]));
}
export function studentVisibleToDemoRole(role,studentId,fictionalStudentIds){
 if(!canOpenDemoScreen(role,'studentDetail')||!fictionalStudentIds.includes(studentId))return false;
 return role!=='familia'||fictionalStudentIds[0]===studentId;
}
