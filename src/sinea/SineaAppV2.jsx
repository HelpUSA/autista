import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BarChart3,Bell,BookOpen,CalendarDays,Check,CheckCheck,ChevronRight,ClipboardList,FileText,GraduationCap,HeartHandshake,Home,Languages,LockKeyhole,MessageCircle,Plus,Search,ShieldCheck,Users,Wind,Play,Pause,RotateCcw,Volume2,Printer,Settings2} from 'lucide-react';
import {students,agenda,pending,planGoals,timeline,networkMetrics,networkNeeds,calmItems} from './demoData.js';
import {canPreview} from './demoPolicy.js';
import {LANGUAGES,DEFAULT_LANGUAGE,normalizeLocale,translate} from './i18n.js';
import {localizeDemo} from './demoLocale.js';
import {canOpenDemoScreen,landingDemoScreen,resolveDemoScreen,visibleDemoNavigation,studentVisibleToDemoRole} from './navigationPolicy.js';

const BRAND_LOGO='/brand/helpus-logo.jpg';
const cn=(...s)=>s.filter(Boolean).join(' ');
const card='rounded-2xl border border-slate-200 bg-white shadow-sm';
const btn='inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-teal-500';
const mainBtn=cn(btn,'border-teal-700 bg-teal-700 text-white hover:bg-teal-800');
const softBtn=cn(btn,'border-teal-200 bg-white text-teal-900 hover:bg-teal-50');
const navItems=[['home',Home,'home'],['students',Users,'students'],['record',Plus,'record'],['plans',ClipboardList,'plans'],['dashboard',BarChart3,'dashboard']];
const choices=['aee','mediador','coordenacao','secretaria','familia'];
const stepKeys=[['👋','routineWelcome'],['📚','routineReading'],['🍎','routineSnack'],['🧩','routineMath'],['🌿','routineBreak'],['👋','routineFarewell']];
const lessons=[
 {key:'colors',emoji:'🎨',prompt:'colorsPrompt',choices:[['🔵','blue'],['🔴','red'],['🟢','green']],correct:'blue'},
 {key:'shapes',emoji:'🔷',prompt:'shapesPrompt',choices:[['🔺','triangle'],['⚪','circle'],['🟦','square']],correct:'circle'},
 {key:'counting',emoji:'⭐',prompt:'countPrompt',choices:[['1','one'],['2','two'],['3','three']],correct:'three'},
 {key:'communication',emoji:'💬',prompt:'communicationPrompt',choices:[['💧','water'],['🌿','rest'],['🙋','help']],correct:'water'}
];
function Brand({t,light=false}){
 return <div className="flex items-center gap-3 min-w-0">
  <div className={cn('grid place-items-center shrink-0 rounded-xl p-1.5',light?'bg-white/95':'bg-slate-50 border border-slate-200')}>
   <img src={BRAND_LOGO} alt="HelpUS" className="h-9 w-14 object-contain" onError={e=>{e.currentTarget.style.display='none';}}/>
  </div>
  <div className="min-w-0"><strong className={cn('text-2xl font-extrabold tracking-tight',light?'text-white':'text-[#10304b]')}>SINEA</strong>
   <p className={cn('text-[11px] leading-snug',light?'text-teal-100':'text-slate-600')}>{t('subtitle')}</p></div>
 </div>;
}
function Selector({language,setLanguage,t}){
 return <label className="flex items-center gap-2 text-sm font-semibold">
  <Languages size={17} aria-hidden="true"/><span className="sr-only">{t('language')}</span>
  <select aria-label={t('language')} value={language} onChange={e=>setLanguage(normalizeLocale(e.target.value))}
   className="min-h-11 rounded-xl border border-white/40 bg-[#10304b] px-2 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-300">
   {LANGUAGES.map(item=><option key={item.id} value={item.id}>{item.short} · {item.label}</option>)}
  </select></label>;
}
function PanelTitle({title,eyebrow,action}){
 return <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div>
  {eyebrow&&<p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-800">{eyebrow}</p>}
  <h1 className="text-2xl font-extrabold text-[#10304b] sm:text-3xl">{title}</h1>
 </div>{action}</div>;
}
function Note({t}){return <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"><ShieldCheck className="mr-2 inline" size={17}/>{t('demo')}</div>;}
function Metric({title,value}){return <div className={cn(card,'p-4 min-w-0')}><p className="text-xs font-medium text-slate-600 sm:text-sm">{title}</p><strong className="mt-2 block text-xl font-extrabold text-[#10304b] sm:text-3xl">{value}</strong></div>;}
function StudentTile({s,t,onOpen,l}){return <button type="button" onClick={()=>onOpen(s.id)} className={cn(card,'w-full p-4 text-left hover:border-teal-500 focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-500')}>
 <span className="flex gap-3 items-center"><span aria-hidden="true" className="h-12 w-12 shrink-0 rounded-xl bg-teal-100 grid place-items-center font-extrabold text-teal-900">{s.initials}</span><span className="min-w-0 flex-1"><strong className="block text-[#10304b]">{s.name}</strong><span className="block text-sm text-slate-600">{s.age} · {l(s.className)}</span></span><ChevronRight size={18}/></span>
 <div className="flex flex-wrap gap-2 mt-4">{s.tags.map(tag=><span className="rounded-full bg-teal-50 border border-teal-100 text-teal-800 px-2 py-1 text-xs" key={tag}>{l(tag)}</span>)}</div>
 <div className="mt-3 h-2.5 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-teal-600" style={{width:s.goalPercent+'%'}}/></div>
 <p className="text-xs mt-2 text-slate-600">{t('goalProgress')} · {s.goalPercent}%</p>
 </button>;
}
function HomePage({t,role,onStudent,onGo,l}){
 const family=role==='familia';
 return <>
  <div className="rounded-2xl bg-gradient-to-r from-[#10304b] to-[#116a79] p-5 text-white sm:p-8">
   <p className="text-xs font-semibold uppercase tracking-widest text-teal-200">{t('demoInstitution')}</p>
   <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{t('greeting')}</h1>
   <p className="mt-2 max-w-2xl text-sm text-teal-50">{t('tagline')}</p>
  </div>
  <div className="my-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
   <Metric title={t('countStudents')} value={family?'1':'14'}/>
   <Metric title={t('countAppointments')} value="5"/>
   <Metric title={t('countPlans')} value="2"/>
  </div>
  <div className="grid gap-5 lg:grid-cols-5">
   <section className="lg:col-span-3"><PanelTitle title={t('today')} eyebrow={t('calendar')}/>
    <div className={cn(card,'divide-y divide-slate-100')}>
     {agenda.filter(row=>role!=='familia'||row.studentId===students[0].id).map(row=>{const s=students.find(st=>st.id===row.studentId);return <button type="button" key={row.id} onClick={()=>onStudent(s.id)} className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-teal-50">
       <span className="shrink-0 text-sm font-bold text-teal-800">{row.time}</span><span className="flex-1"><strong className="block text-sm text-[#10304b]">{s.name}</strong><span className="text-xs text-slate-600">{l(row.location)}</span></span><ChevronRight size={16}/></button>;})}
    </div>
   </section>
   <section className="lg:col-span-2"><PanelTitle title={t('pending')} eyebrow={t('notifications')}/>
    <div className={cn(card,'divide-y divide-slate-100')}>{pending.filter(p=>role!=='familia'||p.studentId===students[0].id).map(p=><div key={p.id} className="px-4 py-3"><p className="text-xs font-bold text-amber-800">{l(p.deadline)}</p><p className="text-sm font-semibold text-[#10304b]">{t('review')} · {l(p.detail)}</p></div>)}</div>
    <button className={cn(softBtn,'mt-3 w-full')} onClick={()=>onGo('family')}><MessageCircle size={17}/>{t('family')}<ChevronRight size={16}/></button>
   </section>
  </div>
 </>;
}
function StudentsPage({t,onStudent,role,l}){
 const [term,setTerm]=useState('');
 const list=(role==='familia'?[students[0]]:students).filter(s=>s.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
 return <><PanelTitle title={t('students')} eyebrow={t('studentRecord')}/>
  <label className="mb-5 flex max-w-xl items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3"><Search size={18}/><span className="sr-only">{t('search')}</span>
    <input value={term} onChange={e=>setTerm(e.target.value)} placeholder={t('search')} className="min-w-0 flex-1 bg-transparent text-sm outline-none"/></label>
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map(s=><StudentTile key={s.id} s={s} t={t} l={l} onOpen={onStudent}/>)}</div>
 </>;
}
function StudentDetail({t,student,onBack,onGo,role,l}){
 const [tab,setTab]=useState('overview');
 const family=role==='familia';
 return <>
  <button className={cn(softBtn,'mb-5')} onClick={onBack}><ArrowLeft size={16}/>{t('back')}</button>
  <div className={cn(card,'p-5')}><PanelTitle title={student.name} eyebrow={t('studentRecord')}/>
   <p className="text-slate-600 text-sm">{student.age} · {l(student.className)} · {t('sampleSchool')}</p>
  </div>
  <div role="tablist" aria-label={t('studentRecord')} className="my-4 flex gap-2 overflow-x-auto pb-2">
   {['overview','plans','routine','dailyTitle','schoolHistory'].map(key=><button key={key} role="tab" aria-selected={tab===key} onClick={()=>setTab(key)} className={cn(btn,'shrink-0',tab===key?'border-teal-700 bg-teal-700 text-white':'border-slate-200 bg-white')}>{t(key)}</button>)}
  </div>
  {tab==='overview'&&<div className="grid gap-4 sm:grid-cols-3">
    <Metric title={t('years')} value={student.historyYears}/><Metric title={t('appointments')} value={student.appointments}/><Metric title={t('goalProgress')} value={student.goalPercent+'%'}/>
    <section className={cn(card,'p-5 sm:col-span-2')}><h2 className="font-bold text-[#10304b]">{t('supports')}</h2><div className="mt-3 flex flex-wrap gap-2">{student.needs.map(n=><span key={n} className="rounded-lg bg-teal-50 p-2 text-xs text-teal-900">{l(n)}</span>)}</div></section>
    {!family&&<section className={cn(card,'p-5')}><h2 className="font-bold text-[#10304b]">{t('documents')}</h2><p className="mt-3 text-xs text-amber-800">{t('docsNotAvailable')}</p></section>}
  </div>}
  {tab==='plans'&&<PlanPage t={t} student={student}/>}
  {tab==='routine'&&<RoutinePage t={t}/>}
  {tab==='dailyTitle'&&<DiaryPage t={t} role={role}/>}
  {tab==='schoolHistory'&&<section className={cn(card,'p-5')}><h2 className="font-bold">{t('schoolHistory')}</h2><ol className="mt-4 border-l-2 border-teal-300 pl-5">{timeline.map(x=><li key={x.id} className="mb-4"><strong>{x.year}</strong><p className="text-sm text-slate-700">{l(x.title)}</p></li>)}</ol></section>}
  <div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>onGo('family')} className={softBtn}><MessageCircle size={17}/>{t('family')}</button><button onClick={()=>onGo('activities')} className={softBtn}><BookOpen size={17}/>{t('activities')}</button></div>
 </>;
}
function PlanPage({t,student=students[0]}){
 const [kind,setKind]=useState('PEI');
 return <><PanelTitle title={t('planTitle')} eyebrow={t('humanReview')}/>
  <div className="mb-4 flex flex-wrap gap-2">{['PEI','PDI','PAEE'].map(k=><button key={k} className={cn(btn,kind===k?'bg-teal-700 text-white border-teal-700':'bg-white text-teal-900 border-teal-200')} aria-pressed={kind===k} onClick={()=>setKind(k)}>{k}</button>)}</div>
  <div className={cn(card,'p-5')}><p className="text-xs text-slate-600">{kind} • 2026 • {student.name}</p><p className="mt-2 text-sm font-semibold">{t('goalProgress')} {student.goalPercent}%</p><div className="mt-2 h-3 rounded-full bg-slate-200"><div className="h-3 rounded-full bg-teal-600" style={{width:student.goalPercent+'%'}}/></div>
   <p className="mt-4 text-sm text-amber-800">{t('humanReview')}</p></div>
  <div className="mt-4 grid gap-3 md:grid-cols-3">{['sampleGoalOne','sampleGoalTwo','sampleGoalThree'].map((k,i)=><div className={cn(card,'p-5')} key={k}><p className="text-xs text-teal-800">{t('goal')} {i+1}</p><h2 className="mt-2 font-semibold text-[#10304b]">{t(k)}</h2><p className="mt-4 text-xs text-slate-600">{t('responsible')}: {t('teacher')}</p><p className="text-xs text-slate-600">{t('deadline')}: 2026-12-10</p></div>)}</div>
 </>;
}
function DiaryPage({t,role}){
 const [view,setView]=useState('professionalView');
 const family=role==='familia';
 return <><PanelTitle title={t('dailyTitle')} eyebrow={t('record')}/>
  <p className="mb-4 text-sm text-slate-600">{t('dailyIntro')}</p>
  <div className="mb-4 flex flex-wrap gap-2">{(family?['familySummary']:['professionalView','familySummary']).map(k=><button className={cn(btn,view===k?'bg-teal-700 text-white border-teal-700':'bg-white border-slate-300')} aria-pressed={view===k} key={k} onClick={()=>setView(k)}>{t(k)}</button>)}</div>
  <div className={cn(card,'max-w-3xl p-5 sm:p-7')}>
   <p className="text-xs font-bold uppercase tracking-wide text-teal-800">{view==='professionalView'&&!family?t('professionalView'):t('familySummary')}</p>
   <h2 className="mt-2 text-lg font-extrabold text-[#10304b]">{t('sampleActivity')}</h2>
   {view==='familySummary'||family?<p className="mt-3 text-sm leading-relaxed">{t('sampleSummary')}</p>:
    <div className="mt-4 grid gap-3 sm:grid-cols-2">{[['participation','4/5'],['usedSupports',t('sampleSupport')],['linkedGoal',t('sampleGoal')],['responsible',t('teacher')]].map(([k,val])=><div key={k} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-600">{t(k)}</p><strong className="text-sm text-[#10304b]">{val}</strong></div>)}</div>}
   <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{t('demoLocked')}</p><p className="mt-2 text-xs text-slate-600">{t('shareReview')}</p>
  </div>
 </>;
}
function FamilyPage({t,role}){
 const [tab,setTab]=useState('announcements');
 const [read,setRead]=useState(false);
 const options=[['announcements',Bell],['channels',MessageCircle],['calendar',CalendarDays],['authorization',FileText]];
 return <><PanelTitle title={t('familyTitle')} eyebrow={t('school')}/>
  <p className="mb-4 text-sm text-slate-600">{t('familyAccess')}</p>
  <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label={t('familyTitle')}>{options.map(([key,Icon])=><button key={key} role="tab" aria-selected={tab===key} onClick={()=>setTab(key)} className={cn(btn,tab===key?'border-teal-700 bg-teal-700 text-white':'border-slate-200 bg-white text-[#10304b]')}><Icon size={16}/>{t(key)}</button>)}</div>
  {tab==='announcements'&&<div className={cn(card,'max-w-3xl p-6')}><p className="text-xs font-bold text-teal-800">{t('sampleSchool')} · 2026-11-01</p><h2 className="my-2 text-lg font-bold text-[#10304b]">{t('sampleAnnouncement')}</h2><p className="text-sm leading-relaxed text-slate-700">{t('sampleAnnouncementBody')}</p>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span role="status" aria-live="polite" className="text-sm text-slate-600">{read?t('readConfirmed'):t('unread')}</span><button type="button" className={mainBtn} disabled={read} onClick={()=>setRead(true)}><CheckCheck size={16}/>{t('markRead')}</button></div><p className="mt-2 text-xs text-slate-500">{t('demoLocked')}</p></div>}
  {tab==='channels'&&<div className="grid gap-3 md:grid-cols-3">{[['channelPedagogy',BookOpen],['channelAee',GraduationCap],['channelAdmin',Users]].map(([key,Icon])=><div key={key} className={cn(card,'p-5')}><Icon className="text-teal-700"/><h2 className="mt-3 font-bold text-[#10304b]">{t(key)}</h2><p className="mt-2 text-xs text-slate-600">{t('sampleMessage')}</p><span className="mt-3 inline-block rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800">{t('statusPending')}</span></div>)}<p className="text-sm text-amber-800 md:col-span-3">{t('sendBlocked')}</p></div>}
  {tab==='calendar'&&<div className={cn(card,'max-w-xl p-6')}><CalendarDays size={24} className="text-teal-800"/><h2 className="mt-3 font-bold">{t('sampleEvent')}</h2><p className="mt-2 text-sm text-slate-600">2026-11-10 · 09:00</p><p className="mt-3 text-xs text-slate-600">{t('notifications')}</p></div>}
  {tab==='authorization'&&<div className={cn(card,'max-w-xl p-6')}><FileText size={24} className="text-teal-800"/><h2 className="mt-3 font-bold">{t('sampleAuthorization')}</h2><span className="mt-3 inline-block rounded-full bg-amber-50 px-3 py-2 text-xs text-amber-900">{t('approvalPending')}</span><p className="mt-3 text-sm text-slate-600">{t('demoLocked')}</p></div>}
 </>;
}
function RoutinePage({t}){
 const [completed,setCompleted]=useState([]);
 const [symbols,setSymbols]=useState(true);
 const [large,setLarge]=useState(false);
 const next=stepKeys.find((_,i)=>!completed.includes(i));
 return <><PanelTitle title={t('routineTitle')} eyebrow={t('routine')}/>
 <p className="mb-4 text-sm text-slate-600">{t('routineDescription')}</p>
 <div className={cn(card,'p-4 sm:p-6')}>
  <div className="mb-4 flex flex-wrap items-center gap-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={symbols} onChange={e=>setSymbols(e.target.checked)}/>{t('symbols')}</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={large} onChange={e=>setLarge(e.target.checked)}/>{t('largeText')}</label><button type="button" className={softBtn} onClick={()=>setCompleted([])}><RotateCcw size={16}/>{t('reset')}</button><button type="button" className={softBtn} onClick={()=>window.print()}><Printer size={16}/>{t('print')}</button></div>
  <p role="status" className="mb-4 rounded-xl bg-teal-50 p-3 text-sm text-teal-900">{t('nextActivity')}: {next?t(next[1]):t('done')}</p>
  <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{stepKeys.map(([icon,key],i)=><li key={key}><button type="button" aria-pressed={completed.includes(i)} onClick={()=>setCompleted(old=>old.includes(i)?old.filter(n=>n!==i):[...old,i])} className={cn('min-h-28 w-full rounded-xl border-2 p-4 text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-500',completed.includes(i)?'border-teal-600 bg-teal-50':'border-slate-200 bg-slate-50')}>
  <span className="flex items-center gap-4">{symbols&&<span aria-hidden="true" className="text-3xl">{icon}</span>}<span><strong className={cn('block text-[#10304b]',large?'text-xl':'text-base')}>{t(key)}</strong><span className="text-xs text-slate-700">{completed.includes(i)?t('done'):t('todo')}</span></span>{completed.includes(i)&&<Check size={20} className="ml-auto text-teal-700"/>}</span>
  </button></li>)}</ol><p className="mt-4 text-xs text-slate-500">{t('demoLocked')}</p>
 </div></>;
}
function ActivityPage({t,language}){
 const [selected,setSelected]=useState(null),[answer,setAnswer]=useState(null),[paused,setPaused]=useState(false),[complete,setComplete]=useState(false);
 const question=lessons.find(item=>item.key===selected);
 const done=question&&answer===question.correct;
 function reset(){setSelected(null);setAnswer(null);setPaused(false);setComplete(false);}
 function say(){if(!window.speechSynthesis){return;}window.speechSynthesis.cancel();let msg=new SpeechSynthesisUtterance(t(question.prompt));msg.lang=language;msg.rate=.85;window.speechSynthesis.speak(msg);}
 useEffect(()=>()=>{if(window.speechSynthesis)window.speechSynthesis.cancel();},[language]);
 return <><PanelTitle title={t('activitiesTitle')} eyebrow={t('noTimer')}/>
 <p className="mb-4 text-sm text-slate-600">{t('activityIntro')}</p>
 {!question&&<div className="grid gap-4 sm:grid-cols-2">{lessons.map(item=><button key={item.key} className={cn(card,'p-6 text-left hover:border-teal-600')} onClick={()=>{setSelected(item.key);setAnswer(null);setComplete(false);}}><span className="text-4xl" aria-hidden="true">{item.emoji}</span><h2 className="mt-3 text-lg font-bold text-[#10304b]">{t(item.key)}</h2><p className="mt-2 text-sm text-teal-800">{t('choose')}</p></button>)}</div>}
 {question&&<div className={cn(card,'max-w-3xl p-5 sm:p-8')}>
 <div className="flex justify-between gap-3"><button type="button" className={softBtn} onClick={reset}><ArrowLeft size={16}/>{t('back')}</button><button type="button" className={softBtn} onClick={()=>setPaused(v=>!v)}><Pause size={16}/>{paused?t('resume'):t('pause')}</button></div>
 {paused?<p role="status" className="mt-6 text-lg font-semibold">{t('pause')}</p>:complete?<div role="status" className="py-7 text-center"><p className="text-3xl">🌱</p><h2 className="mt-3 text-xl font-extrabold text-teal-800">{t('end')}</h2><button type="button" className={cn(mainBtn,'mt-4')} onClick={reset}>{t('repeat')}</button></div>:
  <><h2 className="mt-7 text-xl font-bold text-[#10304b]">{t(question.prompt)}</h2><button type="button" className={cn(softBtn,'mt-3')} onClick={say}><Volume2 size={17}/>{t('voice')}</button><div className="mt-5 grid gap-3 sm:grid-cols-3">{question.choices.map(([symbol,key])=><button type="button" key={key} disabled={done} aria-pressed={answer===key} className={cn('min-h-28 rounded-xl border-2 px-4 py-6 font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-500',answer===key?'border-teal-700 bg-teal-50':'border-slate-200 bg-white')} onClick={()=>setAnswer(key)}><span aria-hidden="true" className="block text-3xl">{symbol}</span><span className="mt-2 block">{t(key)}</span></button>)}</div>
  <p role="status" aria-live="polite" className="mt-4 text-sm font-semibold text-teal-900">{answer?(done?t('correct'):t('tryAgain')):''}</p>{done&&<button type="button" className={cn(mainBtn,'mt-3')} onClick={()=>setComplete(true)}>{t('finish')}</button>}
  </>}
 </div>}</>;
}
function CalmPage({t}){
 const [entry,setEntry]=useState(3),[exit,setExit]=useState(2),[items,setItems]=useState([]),[active,setActive]=useState(false);
 return <><PanelTitle title={t('calmTitle')} eyebrow={t('calm')}/>
 <div className={cn(card,'max-w-3xl p-5 sm:p-7')}>
 <p className="rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-900">{t('calmEthics')}</p>
 <p className="mt-3 text-xs text-slate-600">{t('calmPreview')}</p>
 <div className="mt-5 flex gap-3"><button type="button" className={mainBtn} onClick={()=>setActive(v=>!v)}>{active?<Pause size={16}/>:<Play size={16}/>} {active?t('pause'):t('resume')}</button></div>
 <div className="mt-6 grid gap-4 sm:grid-cols-2">{[['entry',entry,setEntry],['exit',exit,setExit]].map(([key,value,set])=><fieldset key={key}><legend className="mb-2 text-sm font-bold">{t(key)}</legend><div className="flex gap-2">{[1,2,3,4,5].map(n=><button type="button" key={n} aria-pressed={value===n} onClick={()=>set(n)} className={cn('h-11 w-11 rounded-lg border text-sm font-bold',value===n?'bg-teal-700 text-white':'bg-slate-50')}>{n}</button>)}</div></fieldset>)}</div>
 <fieldset className="mt-6"><legend className="font-bold">{t('sensoryItems')}</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{[['🎧','calmHeadset'],['💬','calmCards'],['🛋️','calmCushion'],['⌛','calmTimer']].map(([icon,key])=><button type="button" key={key} aria-pressed={items.includes(key)} onClick={()=>setItems(old=>old.includes(key)?old.filter(v=>v!==key):[...old,key])} className={cn('min-h-24 rounded-xl border-2 p-3 text-sm font-semibold',items.includes(key)?'border-teal-700 bg-teal-50':'border-slate-200')}><span className="block text-3xl" aria-hidden="true">{icon}</span>{t(key)}</button>)}</div></fieldset>
 <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">{t('demoLocked')}</p>
 </div></>;
}
function NetworkPage({t,l}){
 return <><PanelTitle title={t('dashboardTitle')} eyebrow={t('aggregates')}/>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[['schools','24'],['activePlans','1.280'],['records','8.460'],['coverage','92%']].map(([k,value])=><Metric key={k} title={t(k)} value={value}/>)}</div>
  <div className={cn(card,'mt-5 p-5')}><h2 className="font-bold text-[#10304b]">{t('distribution')}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{networkNeeds.map(n=><div key={n.label}><p className="mb-1 flex justify-between text-sm"><span>{l(n.label)}</span><strong>{n.percent}%</strong></p><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full" style={{width:n.percent+'%',background:n.color}}/></div></div>)}</div>
  <p className="mt-6 text-sm text-amber-900">{t('noIdentify')}</p></div>
 </>;
}
function SupportPage({t}){
 return <><PanelTitle title={t('aiTitle')} eyebrow={t('support')}/>
 <div className="grid gap-4 md:grid-cols-2"><section className={cn(card,'p-5')}><p className="text-xs font-bold uppercase text-teal-800">{t('original')}</p><h2 className="mt-4 text-lg font-semibold">{t('sampleGoalTwo')}</h2></section><section className={cn(card,'p-5')}><p className="text-xs font-bold uppercase text-teal-800">{t('adaptation')}</p><h2 className="mt-4 text-lg font-semibold">{t('sampleSupport')}</h2><p className="mt-4 text-sm text-amber-900">{t('aiWarning')}</p></section></div>
 </>;
}
export default function SineaApp(){
 const [language,setLanguage]=useState(DEFAULT_LANGUAGE);
 const t=key=>translate(language,key);
 const l=value=>localizeDemo(language,value);
 const [role,setRole]=useState('aee');
 const [screen,setScreen]=useState('home');
 const [studentId,setStudentId]=useState(students[0].id);
 const [menu,setMenu]=useState(false);
 const student=students.find(s=>s.id===studentId)??students[0];
 useEffect(()=>{document.documentElement.lang=language;document.title='SINEA | '+t('subtitle');},[language]);
 function changeRole(next){setRole(next);setScreen(landingDemoScreen(next));setStudentId(students[0].id);setMenu(false);}
 function go(next){setScreen(resolveDemoScreen(role,next));setMenu(false);window.scrollTo?.({top:0,behavior:'instant'});}
 function openStudent(id){if(!studentVisibleToDemoRole(role,id,students.map(s=>s.id)))return;setStudentId(id);go('studentDetail');}
 const mainNav=visibleDemoNavigation(role,navItems);
 const extraNav=[['family',MessageCircle],['routine',CalendarDays],['activities',BookOpen],['calm',HeartHandshake],['support',Settings2]];
 return <div className="min-h-screen bg-[#f3f7fa] text-slate-800">
  <header className="sticky top-0 z-30 bg-[#10304b] text-white shadow-sm">
   <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
    <button type="button" className="rounded-xl text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-200" onClick={()=>go('home')} aria-label="SINEA"><Brand t={t} light/></button>
    <div className="flex flex-wrap items-center gap-2"><Selector language={language} setLanguage={setLanguage} t={t}/><label className="sr-only" htmlFor="sinea-role">{t('role')}</label>
     <select id="sinea-role" aria-label={t('role')} value={role} onChange={e=>changeRole(e.target.value)} className="min-h-11 max-w-44 rounded-xl border border-white/40 bg-[#10304b] px-2 text-xs text-white sm:max-w-none sm:text-sm">{choices.map(k=><option key={k} value={k}>{t(k)}</option>)}</select>
    </div>
   </div>
  </header>
  <div className="mx-auto grid max-w-7xl gap-6 px-3 py-5 sm:px-6 lg:grid-cols-[228px_minmax(0,1fr)]">
   <aside className="hidden lg:block"><div className={cn(card,'sticky top-28 p-3')}>
    <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{t('app')} · {t('role')}</p>
    <nav aria-label={t('overview')} className="space-y-1">{visibleDemoNavigation(role,[...mainNav.map(([key,Icon])=>[key,Icon]),...extraNav]).map(([key,Icon])=><button type="button" key={key} onClick={()=>go(key)} aria-current={screen===key?'page':undefined}
     className={cn('flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-semibold',screen===key?'bg-teal-700 text-white':'text-slate-700 hover:bg-slate-100')}><Icon size={18}/>{t(key==='record'?'record':key)}</button>)}</nav>
    <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">{t('helpus')}</div>
   </div></aside>
   <main id="main-content" className="min-w-0 pb-28 lg:pb-10">
    <Note t={t}/>
    <div className="mt-5">
     {canOpenDemoScreen(role,screen)&&screen==='home'&&<HomePage t={t} l={l} role={role} onStudent={openStudent} onGo={go}/>}
     {canOpenDemoScreen(role,screen)&&screen==='students'&&<StudentsPage t={t} l={l} role={role} onStudent={openStudent}/>}
     {canOpenDemoScreen(role,screen)&&screen==='studentDetail'&&<StudentDetail t={t} l={l} student={student} role={role} onBack={()=>go('students')} onGo={go}/>}
     {canOpenDemoScreen(role,screen)&&screen==='record'&&<DiaryPage t={t} role={role}/>}
     {canOpenDemoScreen(role,screen)&&screen==='plans'&&<PlanPage t={t}/>}
     {canOpenDemoScreen(role,screen)&&screen==='dashboard'&&<NetworkPage t={t} l={l}/>}
     {canOpenDemoScreen(role,screen)&&screen==='family'&&<FamilyPage t={t} role={role}/>}
     {canOpenDemoScreen(role,screen)&&screen==='routine'&&<RoutinePage t={t}/>}
     {canOpenDemoScreen(role,screen)&&screen==='activities'&&<ActivityPage t={t} language={language}/>}
     {canOpenDemoScreen(role,screen)&&screen==='calm'&&<CalmPage t={t}/>}
     {canOpenDemoScreen(role,screen)&&screen==='support'&&<SupportPage t={t}/>}
    </div>
   </main>
  </div>
  <footer className="hidden border-t border-slate-200 bg-white px-5 py-6 text-center text-xs text-slate-600 lg:block">{t('copyright')} · {t('privacy')} · {t('accessibility')}</footer>
  <nav aria-label={t('overview')} className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur lg:hidden">
   <div className="mx-auto grid max-w-2xl grid-cols-5">{navItems.map(([key,Icon])=>{
    const disabled=!canOpenDemoScreen(role,key);
    return <button type="button" key={key} disabled={disabled} aria-current={screen===key?'page':undefined} onClick={()=>go(key)}
      className={cn('min-h-[74px] flex flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold sm:text-xs focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-500',disabled?'opacity-30':'',screen===key?'text-teal-800':'text-slate-600')}>
     <span className={cn('grid place-items-center',key==='record'?'h-11 w-11 rounded-full bg-teal-700 text-white':'h-8 w-8')}><Icon size={key==='record'?23:21}/></span>{t(key)}
    </button>;})}</div>
   <div className="flex justify-center border-t border-slate-100 py-1"><button type="button" className="min-h-8 text-xs font-bold text-teal-800" onClick={()=>setMenu(v=>!v)} aria-expanded={menu} aria-controls="sinea-more">{menu?'−':'＋'} {t('family')} · {t('activities')} · {t('calm')}</button></div>
   {menu&&<div id="sinea-more" className="grid grid-cols-2 gap-2 p-3">{visibleDemoNavigation(role,extraNav).map(([key,Icon])=><button type="button" key={key} onClick={()=>go(key)} className={cn(softBtn,'min-w-0')}><Icon size={16}/>{t(key)}</button>)}</div>}
  </nav>
 </div>;
}
