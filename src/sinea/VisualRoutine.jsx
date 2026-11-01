import React, { useMemo, useState } from 'react';
import { CheckCircle2, Printer, RotateCcw } from 'lucide-react';
import { sampleRoutine, describeRoutine, nextRoutineItem } from './visualRoutine.js';

export default function VisualRoutine() {
  const [done, setDone] = useState([]);
  const [showSymbols, setShowSymbols] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const routine = useMemo(() => describeRoutine(sampleRoutine, done), [done]);
  const next = nextRoutineItem(sampleRoutine, done);

  function toggle(id) {
    setDone(existing => existing.includes(id) ? existing.filter(i => i !== id) : [...existing, id]);
  }

  return <section aria-labelledby="visual-routine-title" className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6">
    <div className="flex gap-3 flex-wrap items-center justify-between mb-4">
      <div>
        <h2 id="visual-routine-title" className="text-xl font-extrabold text-[#10304b]">Minha rotina visual</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">Exemplo fictício para antecipar atividades e transições.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={()=>setDone([])}
          className="min-h-11 px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700">
          <RotateCcw size={16} className="inline mr-1"/>Recomeçar
        </button>
        <button type="button" onClick={()=>{setPrintMode(true);window.setTimeout(()=>{window.print();setPrintMode(false);},0);}}
          className="min-h-11 px-3 py-2 rounded-xl bg-teal-700 text-white text-sm font-semibold">
          <Printer size={16} className="inline mr-1"/>Imprimir
        </button>
      </div>
    </div>
    <div className="flex flex-wrap gap-4 mb-4 print:hidden">
      <label className="flex gap-2 items-center text-sm"><input className="h-5 w-5 accent-teal-700" type="checkbox" checked={showSymbols} onChange={e=>setShowSymbols(e.target.checked)}/>Mostrar pictogramas ilustrativos</label>
      <label className="flex gap-2 items-center text-sm"><input className="h-5 w-5 accent-teal-700" type="checkbox" checked={largeText} onChange={e=>setLargeText(e.target.checked)}/>Letra ampliada</label>
    </div>
    <div role="status" aria-live="polite" className="bg-teal-50 text-teal-950 border border-teal-100 rounded-xl p-3 text-sm mb-4">
      {next ? <>Próxima atividade: <strong>{next.time} · {next.title}</strong></> : 'Todas as etapas foram assinaladas. Você pode rever a rotina quando quiser.'}
    </div>
    <ol className="grid sm:grid-cols-2 gap-3">
      {routine.map((item) => <li key={item.id}>
        <button type="button" onClick={()=>toggle(item.id)} aria-pressed={item.completed}
          className={`w-full text-left rounded-xl border-2 min-h-28 p-4 flex items-center gap-3 focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-500 ${item.completed ? 'bg-teal-50 border-teal-600' : 'bg-white border-slate-200 hover:border-teal-400'}`}>
          {showSymbols && <span aria-hidden="true" className="text-3xl shrink-0">{item.icon}</span>}
          <span className="flex-1">
            <strong className={`block text-teal-800 ${largeText?'text-lg':'text-sm'}`}>{item.time}</strong>
            <span className={`block text-[#10304b] font-bold ${largeText?'text-xl':'text-base'}`}>{item.title}</span>
            <span className="text-xs text-slate-600">{item.location}</span>
            <span className="block text-xs mt-1 text-slate-700">{item.completed?'Etapa concluída':'Etapa pendente'}</span>
          </span>
          {item.completed && <CheckCircle2 size={24} className="text-teal-700" aria-hidden="true"/>}
        </button>
      </li>)}
    </ol>
    <p className="text-xs text-slate-600 mt-4">Pictogramas são apenas símbolos ilustrativos. A equipe pedagógica deve adaptar a comunicação às preferências e necessidades do estudante. Nenhuma marcação é salva.</p>
    {printMode && <span className="sr-only">Preparando impressão da rotina visual.</span>}
  </section>;
}
