/**
 * Dados demonstrativos legados localizados sem modificar o registro de origem.
 * Nomes pessoais fictícios e códigos oficiais permanecem como dados, não tradução.
 */
const map={
  'Sala de recursos':['Resource room','Aula de recursos'],
  '4º ano A':['4th grade A','4.º grado A'],
  'Atendimento em grupo':['Group support session','Atención en grupo'],
  'Meta de leitura':['Reading goal','Objetivo de lectura'],
  'Registro de acompanhamento':['Follow-up record','Registro de seguimiento'],
  'Comunicação':['Communication','Comunicación'],
  'Prazo em 5 dias':['Due in 5 days','Plazo en 5 días'],
  'Pendente':['Pending','Pendiente'],
  '12 nov':['Nov 12','12 nov'],
  'Apoio visual':['Visual support','Apoyo visual'],
  'Rotina antecipada':['Predictable routine','Rutina anticipada'],
  'Pausas sensoriais':['Sensory breaks','Pausas sensoriales'],
  'Material concreto':['Hands-on materials','Material concreto'],
  'Instruções por etapas':['Step-by-step instructions','Instrucciones por etapas'],
  'Rotina visual':['Visual routine','Rutina visual'],
  'Antecipar transições':['Prepare for transitions','Anticipar transiciones'],
  'Comunicação alternativa':['Alternative communication','Comunicación alternativa'],
  'Deficiência intelectual':['Intellectual disability','Discapacidad intelectual'],
  'Deficiência física':['Physical disability','Discapacidad física'],
  'Deficiência auditiva':['Hearing disability','Discapacidad auditiva'],
  'Deficiência visual':['Visual disability','Discapacidad visual'],
  'Outros':['Other','Otros'],
  'PEI revisado com novas metas':['IEP updated with new goals','PEI revisado con nuevos objetivos'],
  'Transferência de escola':['School transfer','Traslado escolar'],
  'Ingresso no AEE':['Special education support started','Inicio del apoyo especializado'],
  '2026':['2026','2026'],
  '2025':['2025','2025'],
  '2024':['2024','2024'],
};
export function localizeDemo(locale,value){
 if(typeof value!=='string')return value;
 const index=locale==='en-US'?0:locale==='es-ES'?1:-1;
 if(index<0)return value;
 if(map[value])return map[value][index];
 const m=/^(\d+)º ano ([A-Z])$/.exec(value);
 if(m)return index===0?`${m[1]}${m[1]==='1'?'st':m[1]==='2'?'nd':m[1]==='3'?'rd':'th'} grade ${m[2]}`:`${m[1]}.º grado ${m[2]}`;
 return value;
}
export function demoTranslationsMissing(data){
 const terms=[
  ...data.students.flatMap(s=>[...s.tags,...s.needs,s.className]),
  ...data.agenda.map(x=>x.location),
  ...data.pending.flatMap(x=>[x.detail,x.deadline]),
  ...data.networkNeeds.map(x=>x.label),
  ...data.timeline.map(x=>x.title)
 ];
 return [...new Set(terms)].filter(s=>!map[s]&&!/^(\d+)º ano ([A-Z])$/.test(s)&&
   !['TEA','DI','2026','2025','2024'].includes(s));
}
