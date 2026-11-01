
import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, BarChart3, BookOpen, CalendarDays, Check, ChevronRight,
  ClipboardList, FileText, GraduationCap, Heart, Home, LockKeyhole, Pause,
  Play, Plus, Search, ShieldCheck, Sparkles, Users, Wind
} from 'lucide-react';
import ActivityStudio from '../activities/ActivityStudio.jsx';
import { profiles, students, agenda, pending, documents, timeline, planGoals,
  planTypes, progressSeries, dimensions, networkMetrics, networkMonthly,
  networkNeeds, calmItems, calmTriggers, DEMO_NOTICE } from './demoData.js';
import { canPreview, validateCalmDemo } from './demoPolicy.js';

const cn = (...names) => names.filter(Boolean).join(' ');
const card = 'rounded-2xl bg-white border border-slate-200 shadow-sm';
const btn = 'min-h-11 rounded-xl px-4 py-2.5 font-semibold text-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-500';
const primary = btn + ' bg-teal-700 hover:bg-teal-800 text-white';
const secondary = btn + ' bg-white border border-teal-300 text-teal-800 hover:bg-teal-50';
const field = 'w-full min-h-11 rounded-xl border border-slate-300 bg-white text-slate-800 px-3 py-2 text-sm';
function Pill({ children, kind='teal' }) {
  const variants = {teal:'bg-teal-50 text-teal-900 border-teal-200',blue:'bg-blue-50 text-blue-900 border-blue-200',purple:'bg-violet-50 text-violet-900 border-violet-200',amber:'bg-amber-50 text-amber-900 border-amber-200',grey:'bg-slate-100 text-slate-700 border-slate-200'};
  return <span className={cn('inline-flex rounded-full border text-xs font-semibold px-2.5 py-1',variants[kind])}>{children}</span>;
}
function Tag({ name }) {return <Pill kind={name==='TEA'?'teal':name==='DI'?'blue':name.includes('Comunicação')?'purple':'grey'}>{name}</Pill>;}
function Avatar({ st }) {return <span aria-hidden="true" className="h-12 w-12 shrink-0 grid place-items-center rounded-xl text-teal-900 bg-teal-100 font-extrabold">{st.initials}</span>;}
function Heading({ overline,children,extra }) {return <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div>{overline&&<p className="uppercase text-xs font-bold text-teal-800 tracking-widest">{overline}</p>}<h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold text-[#10304b]">{children}</h1></div>{extra}</div>;}
function Meter({ value,color='#0b9d92' }) {return <div role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100" className="bg-slate-200 h-2.5 rounded-full overflow-hidden"><div style={{width:value+'%',backgroundColor:color}} className="h-full rounded-full"/></div>;}
function Stats({ values }) {return <div className={cn('grid gap-2 sm:gap-4',values.length===3?'grid-cols-3':'grid-cols-2 lg:grid-cols-4')}>{values.map(item=><div key={item.label} className={cn(card,'p-3 sm:p-5')}><div className="text-xs sm:text-sm text-slate-600 min-h-9">{item.label}</div><div className="mt-1 text-xl sm:text-3xl font-extrabold text-[#10304b]">{item.value}</div></div>)}</div>;}
function Login({ enter, activity }) {
  const [role,setRole]=useState('aee');
  return <main className="min-h-screen flex items-center justify-center bg-[#10304b] p-4">
    <div className="w-full max-w-md">
      <div className="flex items-center gap-3 text-white mb-5"><span className="bg-teal-600 rounded-2xl p-4"><GraduationCap size={30}/></span><div><p className="text-4xl font-black">SINEA</p><p className="text-xs text-slate-200">Sistema de Inteligência para Necessidades Educacionais e Aprendizagem</p></div></div>
      <p className="text-white mb-7 text-lg">Cada aluno, uma história.<br/><strong>Cada evolução, um dado que transforma.</strong></p>
      <section className={cn(card,'p-5 sm:p-7')}>
        <h1 className="text-xl font-extrabold text-[#10304b]">Explorar demonstração</h1>
        <p className="text-sm text-slate-600 mb-5 mt-1">Selecione um perfil fictício. Não há login real nesta versão.</p>
        <fieldset><legend className="text-sm font-bold text-slate-700 mb-2">Entrar como</legend>
          <div className="grid grid-cols-2 gap-2">{profiles.map(p=><button key={p.id} type="button" aria-pressed={role===p.id} onClick={()=>setRole(p.id)} className={cn('text-left rounded-xl border-2 p-3 min-h-20 focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-600',role===p.id?'border-teal-600 bg-teal-50':'border-slate-200 bg-white')}>
            <strong className="block text-sm text-[#10304b]">{p.label}</strong><span className="text-xs text-slate-600">{p.detail}</span></button>)}</div>
        </fieldset>
        <label className="block mt-5 mb-1 text-sm font-semibold text-slate-700">CPF ou matrícula</label>
        <input disabled className={cn(field,'bg-slate-100')} placeholder="Desativado na demonstração"/>
        <p className="text-xs mt-2 text-slate-500">Autenticação individual, segundo fator e biometria dependem de implementação segura.</p>
        <button type="button" onClick={()=>enter(role)} className={cn(primary,'w-full mt-4')}>Entrar na demonstração</button>
        <button type="button" className="w-full text-sm mt-3 py-2 underline text-teal-800" onClick={activity}>Explorar atividades acessíveis</button>
      </section>
      <p className="mt-5 text-center text-xs text-slate-200"><ShieldCheck size={15} className="inline mr-2"/>Acesso por perfil · Protótipo com dados fictícios</p>
    </div>
  </main>;
}
const nav=[{id:'inicio',title:'Início',icon:Home},{id:'estudantes',title:'Estudantes',icon:Users},{id:'registro',title:'Registrar',icon:Plus},{id:'planos',title:'Planos',icon:ClipboardList},{id:'painel',title:'Painel',icon:BarChart3}];
function Shell({ role,screen,setScreen,exit,children }) {
  return <div className="min-h-screen bg-[#f2f6f8] text-slate-800">
    <header className="bg-[#10304b] text-white"><div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex justify-between items-center gap-3">
      <div className="flex items-center gap-3"><span className="bg-teal-600 p-2.5 rounded-xl"><GraduationCap size={25}/></span><div><p className="text-2xl font-extrabold">SINEA</p><p className="text-xs text-slate-200">Educação inclusiva · Evoluce</p></div></div>
      <button type="button" onClick={exit} className="border border-white/30 rounded-lg py-2 px-3 text-xs sm:text-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2">Trocar perfil</button>
    </div></header>
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-32">
      <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 text-amber-950 p-3 text-xs sm:text-sm mb-5"><ShieldCheck size={16} className="inline mr-2"/>{DEMO_NOTICE} Não digite CPF, laudos ou dados reais. Controles de acesso visuais não substituem autorização no servidor.</div>
      {children}
    </main>
    <nav aria-label="Navegação principal" className="fixed z-30 bottom-0 inset-x-0 border-t border-slate-200 bg-white shadow-lg"><div className="mx-auto max-w-3xl grid grid-cols-5">
      {nav.map(item=>{const Icon=item.icon;const allow=canPreview(role,item.id); const active=screen===item.id||(screen==='prontuario'&&item.id==='estudantes');
        return <button key={item.id} type="button" aria-current={active?'page':undefined} disabled={!allow} onClick={()=>setScreen(item.id)} className={cn('py-2 min-h-[76px] flex flex-col items-center justify-center text-[11px] sm:text-xs font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-600',allow?'':'opacity-30',active?'text-teal-800':'text-slate-600')}>
          <span className={cn('grid place-items-center',item.id==='registro'?'w-12 h-12 bg-teal-600 text-white rounded-full -mt-5 border-4 border-white shadow':'w-9 h-9')}><Icon size={item.id==='registro'?25:22}/></span>{item.title}
        </button>;
      })}</div></nav>
  </div>;
}
function HomePage({ open }) {
  return <><div className="bg-[#10304b] text-white rounded-2xl p-6 mb-5"><p className="text-xs text-teal-200 font-semibold">AGENDA FICTÍCIA · 19 DE OUTUBRO DE 2026</p><h1 className="text-2xl sm:text-3xl font-black mt-2">Bom dia, Profª Marina!</h1><p className="text-sm text-slate-200 mt-1">EM Monteiro Lobato · Atendimento Educacional Especializado</p></div>
    <Stats values={[{label:'Estudantes acompanhados',value:'14'},{label:'Atendimentos hoje',value:'5'},{label:'Planos para revisar',value:'2'}]}/>
    <div className="grid lg:grid-cols-[2fr_1fr] gap-5 mt-7">
      <div><Heading overline="Agenda do profissional">Atendimentos</Heading><div className={cn(card,'divide-y divide-slate-100')}>
      {agenda.map(item=>{const st=students.find(s=>s.id===item.studentId);return <button type="button" key={item.id} onClick={()=>open(st.id)} className="flex gap-3 items-center text-left w-full p-4 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500">
        <span className="text-sm font-bold text-teal-800 shrink-0">{item.time}</span><Avatar st={st}/><span className="flex-1"><strong className="block text-sm text-[#10304b]">{st.name}</strong><span className="text-xs text-slate-600">{item.title} · {item.location}</span></span><ChevronRight size={18} className="text-slate-400"/></button>;})}
      </div></div>
      <div><Heading overline="Prazos">Pendências</Heading><div className={cn(card,'divide-y divide-slate-100')}>{pending.map(item=><button key={item.id} onClick={()=>open(item.studentId)} className="block p-4 w-full text-left hover:bg-teal-50"><p className="text-xs text-amber-700 font-bold">{item.deadline}</p><strong className="text-sm text-[#10304b]">{item.label}</strong><p className="text-xs text-slate-600">{students.find(s=>s.id===item.studentId).name} · {item.detail}</p></button>)}</div></div>
    </div></>;
}
function StudentsPage({open}) {
  const [term,setTerm]=useState('');
  const found=students.filter(s=>s.name.toLocaleLowerCase('pt-BR').includes(term.toLocaleLowerCase('pt-BR')));
  return <><Heading overline="Prontuário digital">Estudantes</Heading><label className="mb-5 flex gap-2 items-center bg-white border border-slate-300 p-3 rounded-xl max-w-xl"><Search size={18}/><span className="sr-only">Pesquisar estudante fictício</span><input className="w-full bg-transparent outline-none text-sm" placeholder="Pesquisar estudante demonstrativo" value={term} onChange={e=>setTerm(e.target.value)}/></label>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{found.map(st=><button key={st.id} type="button" onClick={()=>open(st.id)} className={cn(card,'text-left p-5 hover:border-teal-400 focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-500')}>
    <div className="flex items-center gap-3"><Avatar st={st}/><div><strong className="text-[#10304b]">{st.name}</strong><p className="text-xs text-slate-600">{st.age} anos · {st.className}</p></div></div>
    <div className="flex gap-2 flex-wrap my-4">{st.tags.map(tag=><Tag name={tag} key={tag}/>)}</div><Meter value={st.goalPercent}/><p className="text-xs text-slate-500 mt-2">{st.goalPercent}% de metas · exemplo</p><span className="mt-4 flex items-center text-teal-800 text-sm font-bold">Abrir prontuário <ChevronRight size={16}/></span>
  </button>)}</div></>;
}
function Plans({selectedStudent=students[0]}) {
  const [type,setType]=useState('PEI');
  return <><Heading overline="Metas observáveis">Planos individualizados</Heading><div className="flex flex-wrap gap-2 mb-5">{planTypes.map(item=><button key={item} type="button" aria-pressed={type===item} onClick={()=>setType(item)} className={type===item?primary:secondary}>{item}</button>)}</div>
  <div className={cn(card,'p-5 mb-4')}><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs text-slate-500">{type} 2026 (exemplo)</p><h3 className="text-xl font-extrabold text-[#10304b]">{selectedStudent.name}</h3></div><Pill>Em andamento</Pill></div>
    <p className="mt-4 text-sm font-bold text-[#10304b]">{selectedStudent.goalPercent}% das metas · próxima revisão {selectedStudent.nextReview}</p><Meter value={selectedStudent.goalPercent}/><p className="text-xs text-slate-500 mt-2">Progresso ilustrativo sujeito a rubrica e validação do professor.</p></div>
  <div className="grid lg:grid-cols-3 gap-3">{planGoals.map(goal=><div key={goal.id} className={cn(card,'p-5')}><p className="text-xs font-bold" style={{color:goal.color}}>{goal.area}</p><p className="font-semibold text-[#10304b] text-sm my-3 min-h-14">{goal.title}</p><div className="flex justify-between text-sm mb-2"><span className="text-slate-600">Progresso</span><strong>{goal.progress}%</strong></div><Meter value={goal.progress} color={goal.color}/><p className="text-xs text-slate-600 mt-4">{goal.owner} · {goal.due}</p></div>)}</div></>;
}
function Timeline() {return <div className={cn(card,'p-5')}><h3 className="text-lg font-extrabold text-[#10304b] mb-4">Trajetória escolar</h3><ol className="border-l-2 border-teal-300 ml-2 pl-5 space-y-5">{timeline.map(t=><li key={t.id}><p className="text-xs text-teal-700 font-bold">{t.year}</p><strong className="text-sm text-[#10304b]">{t.title}</strong><p className="text-sm text-slate-600">{t.detail}</p></li>)}</ol><p className="text-xs mt-5 text-slate-500">Transferência real de prontuário requer base jurídica, registro e autorização.</p></div>;}
function Evolution() {return <><Heading overline="Acompanhamento de metas">Evolução da aprendizagem</Heading>
  <div className={cn(card,'p-5 mb-5')}><p className="font-bold text-[#10304b] mb-2">Progresso mensal ilustrativo</p><div className="grid grid-cols-9 gap-2 items-end h-40" role="img" aria-label="Barras de progresso fictício crescentes de fevereiro a outubro">{progressSeries.map(m=><div key={m.month} className="h-full flex flex-col items-center justify-end gap-1"><div title={m.month+': '+m.pedag+'%'} className="w-full bg-teal-500 rounded-t" style={{height:m.pedag+'%'}}/><span className="text-[10px] text-slate-600">{m.month}</span></div>)}</div></div>
  <div className="grid sm:grid-cols-2 gap-3">{dimensions.map(d=><div key={d.name} className={cn(card,'p-5')}><p className="text-sm text-slate-700">{d.name}</p><p className="font-black text-[#10304b] text-3xl my-2">{d.value}% <span className="text-xs text-teal-700 font-semibold">+{d.change} pontos</span></p><Meter value={d.value} color={d.color}/></div>)}</div>
  <p className="mt-4 text-sm text-slate-600">Habilidades, dificuldades e sugestões são apresentados apenas como exemplos. Nenhuma inferência clínica é realizada.</p></>;
}
function LegacyRecordPreview({calm}) {return <><Heading overline="Registro diário">Registrar atendimento</Heading><div className={cn(card,'max-w-2xl p-5 sm:p-7')}>
  <p className="bg-amber-50 text-amber-900 border border-amber-200 rounded-xl p-4 text-sm mb-5">Formulário ilustrativo desativado. Não é permitido coletar registros, imagens, voz ou dados reais nesta demonstração.</p>
  <fieldset disabled className="space-y-4"><label className="block text-sm font-semibold">Estudante <select className={cn(field,'mt-1')}><option>Lucas Martins (fictício)</option></select></label>
    <label className="block text-sm font-semibold">Modalidade <select className={cn(field,'mt-1')}><option>AEE individual</option></select></label>
    <label className="block text-sm font-semibold">Atividade realizada <textarea className={cn(field,'mt-1')} rows={3} defaultValue="Pareamento sílaba-imagem com apoio visual (exemplo)"/></label>
    <p className="text-sm text-slate-700">Meta 2 · Leitura | Participação: 4/5 (exemplo)</p>
    <div className="flex flex-wrap gap-2">{['Engajado','Autônomo','Precisou de pausa','Apoio verbal'].map(item=><Pill key={item} kind="grey">{item}</Pill>)}</div>
    <button className={primary} type="button">Salvar registro</button>
  </fieldset>
  <div className="border-t mt-5 pt-5"><button className={secondary} type="button" onClick={calm}><Wind size={17} className="inline mr-2"/>Abrir Canto da Calma</button></div>
  </div></>;
}
function CalmRoom() {
  const [seconds,setSeconds]=useState(0),[running,setRunning]=useState(false),[start,setStart]=useState(3),[end,setEnd]=useState(2),[items,setItems]=useState([]),[triggers,setTriggers]=useState([]),[outcome,setOutcome]=useState('melhorou'),[returned,setReturned]=useState('parcialmente'),[confirmed,setConfirmed]=useState(false);
  useEffect(()=>{if(!running)return;const timer=setInterval(()=>setSeconds(s=>s+1),1000);return ()=>clearInterval(timer);},[running]);
  const toggle=(value,list,set)=>set(list.includes(value)?list.filter(x=>x!==value):[...list,value]);
  const time=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
  const ok=validateCalmDemo({entry:start,exit:end,outcome,returned,items,elapsed:seconds});
  return <><Heading overline="Acolhimento sensorial">Canto da Calma</Heading><div className={cn(card,'max-w-3xl p-5 sm:p-7')}>
    <p className="text-sm text-teal-800 font-bold">Espaço de regulação e acolhimento — nunca punição ou isolamento.</p>
    <div className="flex items-center justify-between flex-wrap gap-3 my-5"><p className="text-4xl font-black tabular-nums text-[#10304b]">{time}</p><button type="button" className={primary} onClick={()=>{setRunning(!running);setConfirmed(false);}}>{running?<Pause size={17} className="inline mr-2"/>:<Play size={17} className="inline mr-2"/>}{running?'Encerrar contagem':'Iniciar / retomar'}</button></div>
    <p className="text-xs text-slate-500 mb-5">O tempo e as escolhas são mantidos somente na memória do navegador durante esta demonstração.</p>
    <div className="grid sm:grid-cols-2 gap-4">{[{label:'Como chegou?',value:start,set:setStart},{label:'Como saiu?',value:end,set:setEnd}].map(part=><fieldset key={part.label}><legend className="font-bold text-sm text-[#10304b] mb-2">{part.label}</legend><div className="flex gap-2">{[1,2,3,4,5].map(n=><button type="button" key={n} aria-pressed={part.value===n} onClick={()=>part.set(n)} className={cn('h-11 w-11 rounded-xl border-2 font-bold',part.value===n?'bg-teal-700 text-white':'border-slate-300')}>{n}</button>)}</div></fieldset>)}</div>
    <fieldset className="mt-6"><legend className="font-bold text-sm text-[#10304b] mb-2">O que antecedeu?</legend><div className="flex flex-wrap gap-2">{calmTriggers.map(t=><button type="button" key={t} aria-pressed={triggers.includes(t)} onClick={()=>toggle(t,triggers,setTriggers)} className={cn('rounded-full px-3 py-2 border text-sm',triggers.includes(t)?'bg-teal-100 border-teal-700':'bg-slate-50 border-slate-300')}>{t}</button>)}</div></fieldset>
    <fieldset className="mt-6"><legend className="font-bold text-sm text-[#10304b] mb-2">Itens utilizados</legend><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{calmItems.map(item=><button type="button" key={item.id} aria-pressed={items.includes(item.id)} onClick={()=>toggle(item.id,items,setItems)} className={cn('rounded-xl min-h-24 border-2 p-2 text-xs font-bold',items.includes(item.id)?'bg-teal-50 border-teal-700':'bg-slate-50 border-slate-200')}><span className="block text-2xl mb-2" aria-hidden="true">{item.icon}</span>{item.label}</button>)}</div></fieldset>
    <div className="grid sm:grid-cols-2 gap-4 mt-5"><label className="text-sm font-bold">Resultado observado<select className={cn(field,'mt-1')} value={outcome} onChange={e=>setOutcome(e.target.value)}><option value="melhorou">Melhorou</option><option value="igual">Ficou igual</option><option value="piorou">Piorou</option></select></label>
      <label className="text-sm font-bold">Voltou à atividade?<select className={cn(field,'mt-1')} value={returned} onChange={e=>setReturned(e.target.value)}><option value="sim">Sim</option><option value="parcialmente">Parcialmente</option><option value="nao">Não</option></select></label></div>
    <button type="button" disabled={!ok||running} className={cn(primary,'mt-5 disabled:opacity-50')} onClick={()=>setConfirmed(true)}>Concluir prévia (não salvar)</button>
    {confirmed&&<p role="status" className="mt-3 text-sm bg-teal-50 text-teal-900 rounded-lg p-3">Demonstração concluída. Nenhuma informação foi transmitida ou salva.</p>}
  </div></>;
}
function SupportPage() {const [choice,setChoice]=useState('revisar');return <><Heading overline="Revisão humana">Suporte pedagógico</Heading>
  <div className="grid md:grid-cols-2 gap-4"><div className={cn(card,'p-5')}><h2 className="font-extrabold text-[#10304b] mb-3">Plano original (exemplo)</h2><p className="text-sm text-slate-700">Ciências: observar o ciclo da água e compreender suas transformações com a turma.</p><Pill kind="grey">BNCC: validar código e edição</Pill></div>
    <div className={cn(card,'p-5')}><h2 className="font-extrabold text-[#10304b] mb-3">Adaptação exemplificativa</h2><ol className="list-decimal ml-5 space-y-2 text-sm text-slate-700"><li>Dividir a tarefa em etapas curtas.</li><li>Apresentar cartões de sol, nuvem e chuva.</li><li>Permitir diferentes formas de resposta.</li><li>Oferecer pausas combinadas e observar a participação.</li></ol><p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-lg mt-4">Texto editorial estático: a IA real, RAG, bases documentais e dados estudantis NÃO estão conectados.</p>
    <label className="block text-sm font-bold mt-4">Decisão do professor<select className={cn(field,'mt-1')} value={choice} onChange={e=>setChoice(e.target.value)}><option value="revisar">Em revisão</option><option value="aprovar">Aprovar demonstração</option><option value="descartar">Descartar demonstração</option></select></label></div></div>
  <p className="mt-4 text-sm text-slate-600">Fase 2: curadoria profissional, RAG com citações, integração com projetos da editora, trilha de decisão, planejamento independente e espanhol.</p></>;
}
function NetworkPage() {return <><div className="bg-[#10304b] rounded-2xl p-6 text-white mb-5"><p className="text-xs text-teal-200">SECRETARIA · DADOS ILUSTRATIVOS</p><h1 className="text-3xl font-extrabold mt-2">Painel da Rede</h1><p className="text-sm text-slate-200 mt-1">Indicadores agregados, sem prontuários individuais</p></div>
  <Stats values={networkMetrics}/><div className="grid lg:grid-cols-2 gap-5 mt-5">
    <div className={cn(card,'p-5')}><h2 className="font-extrabold text-[#10304b] mb-4">Registros por mês</h2><div role="img" aria-label="Barras ilustrativas crescentes de fevereiro a outubro" className="grid grid-cols-9 h-44 items-end gap-1.5">{networkMonthly.map(m=><div key={m.month} className="h-full flex flex-col justify-end items-center gap-2"><div title={m.month+': '+m.count} className="bg-teal-500 rounded-t w-full" style={{height:Math.round(m.count/1200*85)+'%'}}/><span className="text-[10px] text-slate-600">{m.month}</span></div>)}</div></div>
    <div className={cn(card,'p-5')}><h2 className="font-extrabold text-[#10304b] mb-4">Distribuição por necessidades (fictícia)</h2><div className="space-y-3">{networkNeeds.map(m=><div key={m.label}><div className="flex justify-between text-xs mb-1"><span>{m.label}</span><strong>{m.percent}%</strong></div><Meter value={m.percent} color={m.color}/></div>)}</div></div>
  </div><p className="text-xs text-slate-500 mt-4">As regras reais de supressão de pequenas contagens, anonimização e exportação dependem de análise de risco.</p></>;
}
function RecordPage({student,back,activity,role}) {
  const [tab,setTab]=useState('geral');useEffect(()=>setTab('geral'),[student.id]);
  return <><button onClick={back} className={cn(secondary,'mb-4')}><ArrowLeft size={16} className="inline mr-2"/>Voltar aos estudantes</button>
    <div className={cn(card,'p-5 mb-4')}><div className="flex items-center gap-3"><Avatar st={student}/><div><h1 className="font-extrabold text-xl text-[#10304b]">{student.name}</h1><p className="text-sm text-slate-600">{student.age} anos · {student.className} · {student.school}</p></div></div><div className="flex flex-wrap gap-2 mt-4">{student.tags.map(t=><Tag name={t} key={t}/>)}</div></div>
    <Stats values={[{label:'Anos de histórico',value:student.historyYears},{label:'Atendimentos',value:student.appointments},{label:'Metas PEI',value:student.goalPercent+'%'}]}/>
    <div className="flex gap-2 overflow-x-auto my-5 pb-2" role="tablist" aria-label="Prontuário">{[['geral','Visão geral'],['atendimentos','Atendimentos'],['planos','Planos'],['trajetoria','Trajetória'],['canto','Canto da Calma'],['suporte','Suporte'],['evolucao','Evolução']].filter(([id])=>role!=='mediador'||['geral','atendimentos','planos','canto'].includes(id)).map(([id,label])=><button key={id} type="button" role="tab" aria-selected={tab===id} onClick={()=>setTab(id)} className={cn('whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold',tab===id?'bg-teal-700 text-white':'bg-white border text-slate-700')}>{label}</button>)}</div>
    {tab==='geral'&&<div className="grid md:grid-cols-2 gap-4"><div className={cn(card,'p-5')}><h2 className="font-bold text-[#10304b] mb-3">Apoios e acessibilidade</h2><div className="flex flex-wrap gap-2">{student.needs.map(n=><Pill kind="grey" key={n}>{n}</Pill>)}</div></div>
      {role==='aee'&&<div className={cn(card,'p-5')}><h2 className="font-bold text-[#10304b] mb-3">Documentos e laudos</h2><p className="text-xs text-amber-800 mb-3">Somente títulos fictícios: arquivos inacessíveis.</p>{documents.map(d=><div className="flex items-center gap-2 py-2 text-sm" key={d.id}><FileText size={17} className="text-teal-700"/><span>{d.title} · {d.date}</span></div>)}</div>}
      <div className={cn(card,'md:col-span-2 p-5')}><h2 className="font-bold text-[#10304b] mb-2">Atividades acessíveis</h2><p className="text-sm text-slate-600 mb-3">Módulo complementar para o aluno, sem acesso a laudos ou relatórios clínicos.</p><button type="button" onClick={activity} className={primary}>Explorar atividades</button></div></div>}
    {tab==='atendimentos'&&<div className={cn(card,'p-5')}><h2 className="font-bold mb-3">Atendimentos fictícios</h2>{agenda.filter(a=>a.studentId===student.id).map(a=><p key={a.id} className="py-3 text-sm border-b">{a.time} · {a.title} · {a.location}</p>)}</div>}
    {tab==='planos'&&<Plans selectedStudent={student}/>}
    {tab==='trajetoria'&&<Timeline/>}
    {tab==='canto'&&<CalmRoom/>}
    {tab==='suporte'&&role!=='mediador'&&<SupportPage/>}
    {tab==='evolucao'&&role!=='mediador'&&<Evolution/>}
  </>;
}
export default function SineaApp() {
  const [role,setRole]=useState('aee'),[screen,setScreen]=useState('login'),[studentId,setStudentId]=useState(students[0].id);
  function enter(next){setRole(next);setScreen(next==='secretaria'?'painel':'inicio');}
  function open(id){setStudentId(id);setScreen('prontuario');}
  if(screen==='login')return <Login enter={enter} activity={()=>setScreen('atividades')}/>;
  if(screen==='atividades')return <main className="min-h-screen bg-[#10304b] p-4 sm:p-6"><div className="max-w-5xl mx-auto"><button type="button" className={cn(secondary,'mb-4')} onClick={()=>setScreen('login')}>Voltar ao início</button><ActivityStudio/></div></main>;
  return <Shell role={role} screen={screen} setScreen={setScreen} exit={()=>setScreen('login')}>
    {screen==='inicio'&&<HomePage open={open}/>}
    {screen==='estudantes'&&<StudentsPage open={open}/>}
    {screen==='prontuario'&&<RecordPage student={students.find(s=>s.id===studentId)||students[0]} back={()=>setScreen('estudantes')} activity={()=>setScreen('atividades')} role={role}/>}
    {screen==='registro'&&<RecordPagePlaceholder/>}
    {screen==='planos'&&<Plans/>}
    {screen==='painel'&&<NetworkPage/>}
    {screen==='canto'&&<CalmRoom/>}
    {screen==='suporte'&&<SupportPage/>}
  </Shell>;
}
function RecordPagePlaceholder() {
  const [showCalm,setShowCalm]=useState(false);
  return showCalm?<><button type="button" className={cn(secondary,'mb-4')} onClick={()=>setShowCalm(false)}>Voltar ao registro</button><CalmRoom/></>:<RecordPageForm calm={()=>setShowCalm(true)}/>;
}
function RecordPageForm({calm}) {return <><Heading overline="Registro diário">Novo registro</Heading><div className={cn(card,'max-w-2xl p-5')}>
  <p className="text-sm p-4 bg-amber-50 text-amber-900 rounded-xl mb-4">Fluxo apenas demonstrativo. Não envie informações ou fotos reais nesta versão.</p>
  <fieldset disabled className="space-y-4"><label className="block text-sm font-bold">Estudante<select className={cn(field,'mt-1')}><option>Lucas Martins (fictício)</option></select></label>
    <label className="block text-sm font-bold">Atividade realizada<textarea className={cn(field,'mt-1')} rows="3" placeholder="Registro do atendimento"/></label>
    <p className="text-sm text-slate-600">Participação 1 a 5 · Marcadores rápidos · Vínculo PEI · Evidências</p>
    <button type="button" className={primary}>Salvar registro</button>
  </fieldset><button type="button" className={cn(secondary,'mt-4')} onClick={calm}><Wind size={17} className="inline mr-2"/>Canto da Calma</button>
  </div></>;}
