/**
 * Indicadores apenas de DEMONSTRAÇÃO; todos os dados devem ser sintéticos.
 * Deriva cartões da mesma agenda que a interface realmente mostra.
 * Não usar agregados locais para autorizar acesso a dados reais.
 */
export function visibleDemoAppointments(role,agenda,students){
  if(!Array.isArray(agenda)||!Array.isArray(students))return [];
  if(role==='secretaria')return [];
  const ids=role==='familia'?new Set(students.slice(0,1).map(s=>s.id)):new Set(students.map(s=>s.id));
  return agenda.filter(entry=>ids.has(entry.studentId));
}
export function visibleDemoTasks(role,pending,students){
  if(!Array.isArray(pending)||!Array.isArray(students)||role==='secretaria')return [];
  const ids=role==='familia'?new Set(students.slice(0,1).map(s=>s.id)):new Set(students.map(s=>s.id));
  return pending.filter(entry=>ids.has(entry.studentId));
}
export function demoHomeMetrics(role,students,agenda,pending){
  if(role==='secretaria')return null;
  const visibleStudents=role==='familia'?students.slice(0,1):students;
  return Object.freeze({
    students:visibleStudents.length,
    appointments:visibleDemoAppointments(role,agenda,students).length,
    planReviews:visibleDemoTasks(role,pending,students).length
  });
}
export function displayDemoNumber(locale,value){
  if(!Number.isFinite(value)||value<0)throw new Error('Indicador inválido');
  const supported=['pt-BR','en-US','es-ES'];
  return new Intl.NumberFormat(supported.includes(locale)?locale:'pt-BR',{maximumFractionDigits:0}).format(value);
}
