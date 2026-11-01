// SINEA — catálogo e registros EXCLUSIVAMENTE FICTÍCIOS para demonstração pública.
// Não representar pessoas reais ou permitir upload de prontuários nesta fase.
export const DEMO_NOTICE = 'Demonstração com dados fictícios. Não informe dados pessoais ou laudos reais.';

export const profiles = [
  { id: 'aee', label: 'Professor AEE', detail: 'Atendimento especializado' },
  { id: 'mediador', label: 'Mediador', detail: 'Apoio e acompanhamento' },
  { id: 'coordenacao', label: 'Coordenação', detail: 'Gestão da unidade' },
  { id: 'secretaria', label: 'Secretaria', detail: 'Indicadores agregados' }
];

export const students = [
  { id:'stu-01', initials:'LM', name:'Lucas Martins', age:8, className:'3º ano B',
    school:'EM Monteiro Lobato', tags:['TEA','Comunicação alternativa'],
    needs:['Apoio visual','Rotina antecipada','Pausas sensoriais'], historyYears:3, appointments:142,
    goalPercent:62, nextReview:'12 nov 2026' },
  { id:'stu-02', initials:'AC', name:'Ana Costa', age:9, className:'4º ano A',
    school:'EM Monteiro Lobato', tags:['DI'], needs:['Material concreto','Instruções por etapas'],
    historyYears:2, appointments:86, goalPercent:73, nextReview:'19 nov 2026' },
  { id:'stu-03', initials:'RL', name:'Rafael Lima', age:7, className:'2º ano A',
    school:'EM Monteiro Lobato', tags:['TEA'], needs:['Rotina visual','Antecipar transições'],
    historyYears:2, appointments:64, goalPercent:48, nextReview:'06 nov 2026' }
];

export const agenda = [
  { id:'a1', time:'08:00', studentId:'stu-01', title:'AEE individual', location:'Sala de recursos', status:'Concluído' },
  { id:'a2', time:'09:30', studentId:'stu-02', title:'Mediação em sala', location:'4º ano A', status:'Em andamento' },
  { id:'a3', time:'10:15', studentId:'stu-03', title:'AEE individual', location:'Sala de recursos', status:'Agendado' },
  { id:'a4', time:'11:00', studentId:'stu-01', title:'Comunicação alternativa', location:'Atendimento em grupo', status:'Agendado' }
];

export const pending = [
  { id:'p1', studentId:'stu-03', label:'Revisão do PEI', detail:'Meta de leitura', deadline:'Prazo em 5 dias' },
  { id:'p2', studentId:'stu-02', label:'Documento para conferência', detail:'Registro de acompanhamento', deadline:'Pendente' },
  { id:'p3', studentId:'stu-01', label:'Revisão de metas', detail:'Comunicação', deadline:'12 nov' }
];

export const documents = [
  { id:'doc1', title:'Laudo neurológico', format:'PDF', date:'mar 2026' },
  { id:'doc2', title:'Relatório psicopedagógico', format:'PDF', date:'ago 2026' },
  { id:'doc3', title:'Avaliação fonoaudiológica', format:'PDF', date:'jun 2026' }
];

export const timeline = [
  { id:'t1', year:'2026', title:'PEI revisado com novas metas', detail:'Sala de recursos · Equipe pedagógica' },
  { id:'t2', year:'2025', title:'Transferência de escola', detail:'EM Cecília Meireles → EM Monteiro Lobato · histórico preservado' },
  { id:'t3', year:'2024', title:'Ingresso no AEE', detail:'Início do acompanhamento educacional' }
];

export const planGoals = [
  { id:'g1', area:'Comunicação', title:'Expressar necessidades usando uma prancha de comunicação', progress:75, owner:'Professora AEE', due:'nov/26', color:'#0f9b8b' },
  { id:'g2', area:'Leitura', title:'Reconhecer sílabas simples em palavras do cotidiano', progress:50, owner:'Professor regente', due:'dez/26', color:'#3e84bf' },
  { id:'g3', area:'Interação', title:'Participar de atividades em grupo com apoios combinados', progress:60, owner:'Mediadora', due:'dez/26', color:'#9677c7' }
];

export const planTypes = ['PEI', 'PDI', 'PAEE'];

export const progressSeries = [
  { month:'Fev', pedag:28, cogn:38, func:49, socio:28 },
  { month:'Mar', pedag:34, cogn:44, func:54, socio:32 },
  { month:'Abr', pedag:40, cogn:48, func:57, socio:39 },
  { month:'Mai', pedag:41, cogn:50, func:60, socio:45 },
  { month:'Jun', pedag:43, cogn:53, func:62, socio:48 },
  { month:'Jul', pedag:47, cogn:57, func:65, socio:52 },
  { month:'Ago', pedag:51, cogn:59, func:68, socio:55 },
  { month:'Set', pedag:55, cogn:62, func:70, socio:58 },
  { month:'Out', pedag:58, cogn:64, func:71, socio:60 }
];

export const dimensions = [
  { name:'Pedagógico', value:58, change:21, color:'#0e9d8e' },
  { name:'Cognitivo', value:64, change:18, color:'#3482b8' },
  { name:'Funcional', value:71, change:12, color:'#8f75c7' },
  { name:'Socioemocional', value:60, change:24, color:'#eba64a' }
];

export const networkMetrics = [
  { label:'Unidades acompanhadas', value:'24', icon:'school' },
  { label:'Planos ativos', value:'1.280', icon:'plans' },
  { label:'Registros no período', value:'8.460', icon:'records' },
  { label:'Cobertura do AEE', value:'92%', icon:'coverage' }
];

export const networkMonthly = [
  {month:'Fev',count:580},{month:'Mar',count:690},{month:'Abr',count:740},
  {month:'Mai',count:810},{month:'Jun',count:840},{month:'Jul',count:910},
  {month:'Ago',count:1010},{month:'Set',count:1090},{month:'Out',count:1200}
];

export const networkNeeds = [
  {label:'TEA',percent:38,color:'#159f8c'},
  {label:'Deficiência intelectual',percent:24,color:'#478fc8'},
  {label:'Deficiência física',percent:12,color:'#f1b557'},
  {label:'Deficiência auditiva',percent:9,color:'#9e8bcf'},
  {label:'Deficiência visual',percent:7,color:'#e57b91'},
  {label:'Outros',percent:10,color:'#8492a8'}
];

export const calmItems = [
  {id:'fone',label:'Fone abafador',icon:'🎧'},
  {id:'bola',label:'Bolas sensoriais',icon:'🟠'},
  {id:'ampulheta',label:'Ampulheta visual',icon:'⌛'},
  {id:'almofada',label:'Almofada',icon:'🛋️'},
  {id:'cartoes',label:'Cartões comunicativos',icon:'💬'},
  {id:'cabana',label:'Cabana / espaço acolhedor',icon:'⛺'},
  {id:'timer',label:'Timer visual',icon:'⏳'},
  {id:'tapete',label:'Tapete',icon:'🧶'}
];
export const calmTriggers = ['Barulho','Mudança de rotina','Transição','Conflito','Cansaço','Outro / não identificado'];
