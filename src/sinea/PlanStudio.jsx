import React, {useState} from 'react';
import {CheckCheck, FileCheck2, RotateCcw, ShieldCheck} from 'lucide-react';
import {createPlanDraft,revisePlan,submitForReview,approvePlan,recordGoalEvidence}
  from '../domain/planWorkflow.js';

const author={subject:'demo-professora-aee'};
const reviewer={subject:'demo-coordenadora'};
function fresh(kind){
  return createPlanDraft({
    id:'demo-plan-'+kind.toLowerCase(),
    studentId:'demo-student',
    schoolYear:2026,
    kind,
    nextReviewOn:'2026-12-10',
    goals:[{id:'demo-goal-1',area:'Comunicação',
      description:'Solicitar uma pausa utilizando cartões de comunicação em contexto pedagógico',
      responsibleId:author.subject,dueOn:'2026-12-10'}]
  },author);
}
export default function PlanStudio({kind='PEI'}) {
  const [plan,setPlan]=useState(()=>fresh(kind));
  const [message,setMessage]=useState('Selecione uma ação demonstrativa.');
  const [expanded,setExpanded]=useState(false);
  function enact(action) {
    try{setPlan(existing=>action(existing));setMessage('Ação simulada registrada nesta sessão.');}
    catch(e){setMessage('Não foi possível aplicar: '+e.message);}
  }
  function reset(){setPlan(fresh(kind));setMessage('Demonstração reiniciada.');}
  const canReview=plan.status==='draft';
  const canApprove=plan.status==='review';
  const canEvidence=plan.status==='approved';
  return <section className="bg-white rounded-2xl p-5 mt-5 border border-slate-200 shadow-sm"
    aria-labelledby="plan-studio-heading">
    <div className="flex justify-between flex-wrap items-center gap-2">
      <div><h2 id="plan-studio-heading" className="font-extrabold text-[#10304b] text-lg">Fluxo de revisão de {kind}</h2>
        <p className="text-xs mt-1 text-slate-600">Simulação com dados fictícios, não salva nem assina documentos.</p></div>
      <span className="border border-teal-200 text-teal-900 rounded-full px-3 py-1 text-xs font-bold">
        Versão {plan.version} · {plan.status==='draft'?'Rascunho':plan.status==='review'?'Em revisão':'Aprovado'}
      </span>
    </div>
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
      <p className="font-bold text-[#10304b]">{plan.goals[0].area}</p>
      <p className="text-slate-700 mt-1">{plan.goals[0].description}</p>
      <p className="mt-2 text-slate-600 text-xs">Próxima revisão: {plan.nextReviewOn} · Responsável fictícia: Professora AEE</p>
      <p className="mt-2 text-teal-800 text-sm font-semibold">
        Evidência de progresso: {plan.goals[0].progress===null?'Aguardando avaliação humana':plan.goals[0].progress+'% (avaliado por profissional)'}
      </p>
    </div>
    <div className="flex flex-wrap gap-2 mt-4">
      <button type="button" disabled={!canReview}
        onClick={()=>enact(p=>revisePlan(p,{nextReviewOn:'2026-12-20'},p.version,author))}
        className="rounded-xl border border-teal-300 text-teal-900 px-4 py-3 text-sm font-semibold disabled:opacity-40">Revisar prazo</button>
      <button type="button" disabled={!canReview}
        onClick={()=>enact(p=>submitForReview(p,p.version,author))}
        className="rounded-xl border border-teal-300 text-teal-900 px-4 py-3 text-sm font-semibold disabled:opacity-40">Enviar à coordenação</button>
      <button type="button" disabled={!canApprove}
        onClick={()=>enact(p=>approvePlan(p,p.version,reviewer))}
        className="rounded-xl bg-teal-700 text-white px-4 py-3 text-sm font-semibold disabled:opacity-40">
        <FileCheck2 size={16} className="inline mr-2"/>Aprovar como coordenadora</button>
      <button type="button" disabled={!canEvidence}
        onClick={()=>enact(p=>recordGoalEvidence(p,'demo-goal-1',
          {description:'Observada solicitação de pausa por meio de cartão em quatro atividades de demonstração',
            rubric:'Rubrica descritiva, avaliação humana',progress:75},p.version,author))}
        className="rounded-xl border border-teal-300 text-teal-900 px-4 py-3 text-sm font-semibold disabled:opacity-40">
        <CheckCheck size={16} className="inline mr-2"/>Adicionar evidência fictícia</button>
      <button type="button" onClick={reset}
        className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700">
        <RotateCcw size={16} className="inline mr-2"/>Recomeçar</button>
    </div>
    <p role="status" aria-live="polite" className="text-xs text-slate-700 bg-slate-100 p-3 rounded-lg mt-4">{message}</p>
    <button type="button" onClick={()=>setExpanded(v=>!v)}
      className="text-sm font-semibold text-teal-800 underline mt-3">
      {expanded?'Ocultar histórico':'Ver histórico de versões'}</button>
    {expanded && <ol className="text-xs text-slate-700 mt-3 space-y-2">
      {plan.history.map((event,i)=><li key={i} className="border-l-2 border-teal-400 pl-3">
        Versão {event.version} · {event.action} · {event.actor} (fictício)
      </li>)}
      {plan.history.length===0&&<li>Nenhum evento simulado ainda.</li>}
    </ol>}
    <p className="text-xs mt-4 text-amber-900 bg-amber-50 rounded-lg border border-amber-100 p-3">
      <ShieldCheck size={14} className="inline mr-1"/>A assinatura real, trilha de auditoria, armazenamento, autorização e
      proteção de prontuário somente serão habilitados após homologação de segurança.
    </p>
  </section>;
}
