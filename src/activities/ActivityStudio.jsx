import React, { useEffect, useState } from 'react';
import { activities, evaluateAnswer, getActivity } from './engine.js';

export default function ActivityStudio() {
  const [activityId, setActivityId] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [showSymbols, setShowSymbols] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [spoken, setSpoken] = useState('');

  const activity = getActivity(activityId);
  const question = activity?.questions[index] ?? null;
  const result = selected && question
    ? evaluateAnswer(activity.id, question.id, selected)
    : null;

  useEffect(() => {
    // Não manter síntese de voz ativa após sair da atividade.
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activityId]);

  function speak(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpoken('Leitura em voz alta indisponível neste navegador.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85;
    utterance.onend = () => setSpoken('');
    utterance.onerror = () => setSpoken('Não foi possível reproduzir o áudio.');
    setSpoken('Lendo o enunciado.');
    window.speechSynthesis.speak(utterance);
  }

  function chooseActivity(id) {
    setActivityId(id);
    setIndex(0);
    setSelected(null);
    setCompleted(false);
    setPaused(false);
    setShowHints(false);
    setSpoken('');
  }

  function chooseAnswer(id) {
    if (result?.correct) return;
    setSelected(id);
  }

  function advance() {
    if (!activity || !result?.correct) return;
    if (index === activity.questions.length - 1) setCompleted(true);
    else {
      setIndex((current) => current + 1);
      setSelected(null);
      setShowHints(false);
    }
  }

  const textSize = largeText ? 'text-xl md:text-2xl' : 'text-base md:text-lg';

  return (
    <section aria-labelledby="studio-title" className="space-y-5">
      <div className="rounded-2xl border border-sky-700/50 bg-slate-900 p-5 space-y-2">
        <div className="flex flex-wrap justify-between gap-3 items-center">
          <h2 id="studio-title" className="text-xl sm:text-2xl font-bold text-white">🎒 Atividades interativas</h2>
          <span className="text-xs rounded-lg px-3 py-1 bg-amber-900/40 border border-amber-700 text-amber-100">Demonstração • conteúdo fictício</span>
        </div>
        <p className="text-slate-300 text-sm">
          Explore no seu ritmo. Não há cronômetro, competição ou notas. A participação do estudante
          deve ser acompanhada pelo educador, respeitando suas formas de comunicação e expressão.
        </p>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={largeText} onChange={(e) => setLargeText(e.target.checked)}
            className="w-5 h-5 accent-sky-500" />
          Texto ampliado
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={showSymbols} onChange={(e) => setShowSymbols(e.target.checked)}
            className="w-5 h-5 accent-sky-500" />
          Exibir símbolos
        </label>
        <p className="w-full text-xs text-slate-400">
          A leitura em voz alta é opcional e só acontece quando solicitada. Nenhuma resposta é enviada a um servidor.
        </p>
      </div>

      {!activity && (
        <div className="grid sm:grid-cols-2 gap-4" aria-label="Escolher atividade">
          {activities.map((item) => (
            <button type="button" key={item.id} onClick={() => chooseActivity(item.id)}
              className="min-h-36 text-left rounded-2xl border-2 border-slate-700 bg-slate-800 p-5 hover:border-sky-400 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-300">
              <span aria-hidden="true" className="text-3xl block mb-3">{item.icon}</span>
              <strong className="block text-white text-lg">{item.title}</strong>
              <span className="block text-slate-300 text-sm mt-1">{item.description}</span>
              <span className="block text-sky-300 text-xs mt-3">{item.questions.length} desafios • sem limite de tempo</span>
            </button>
          ))}
        </div>
      )}

      {activity && !completed && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sky-300 text-sm">{activity.title}</p>
              <p className="text-slate-300 text-xs">Etapa {index + 1} de {activity.questions.length}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setPaused((value) => !value)}
                className="rounded-xl border border-slate-500 px-4 py-3 text-sm min-h-12 hover:bg-slate-700">
                {paused ? 'Continuar' : 'Fazer pausa'}
              </button>
              <button type="button" onClick={() => chooseActivity(null)}
                className="rounded-xl border border-slate-500 px-4 py-3 text-sm min-h-12 hover:bg-slate-700">
                Sair
              </button>
            </div>
          </div>
          {paused ? (
            <div role="status" className="p-6 rounded-xl bg-slate-800 text-center space-y-2">
              <p className="text-xl font-semibold">Pausa</p>
              <p className="text-sm text-slate-300">Quando quiser, selecione Continuar.</p>
            </div>
          ) : (
            <>
              <h3 className={`font-semibold leading-relaxed text-white ${textSize}`}>{question.prompt}</h3>
              <button type="button" onClick={() => speak(question.prompt)}
                className="rounded-xl border border-sky-600 px-4 py-3 min-h-12 text-sky-100 text-sm hover:bg-sky-900/50">
                🔊 Ouvir pergunta
              </button>
              <p aria-live="polite" className="text-xs text-slate-400">{spoken}</p>
              <div className="grid sm:grid-cols-3 gap-3" role="group" aria-label="Alternativas da atividade">
                {question.options.map((option) => (
                  <button type="button" key={option.id} onClick={() => chooseAnswer(option.id)}
                    disabled={result?.correct}
                    aria-pressed={selected === option.id}
                    className={`min-h-28 rounded-xl border-2 p-5 flex flex-col gap-2 items-center justify-center focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300
                      ${selected === option.id ? 'border-sky-300 bg-sky-900/60' : 'border-slate-600 bg-slate-800 hover:border-sky-500'}
                      disabled:cursor-default ${largeText ? 'text-xl' : 'text-base'}`}>
                    {showSymbols && <span aria-hidden="true" className="text-4xl">{option.symbol}</span>}
                    <span className="font-semibold text-white text-center">{option.label}</span>
                  </button>
                ))}
              </div>
              <div aria-live="polite" aria-atomic="true" className="min-h-14 rounded-xl bg-slate-800/60 p-4">
                {!result && <p className="text-slate-300 text-sm">Escolha a opção que faz sentido para você.</p>}
                {result?.correct && <p className="text-emerald-200 font-semibold">Você encontrou a opção! Pode continuar quando quiser.</p>}
                {result && !result.correct && <p className="text-amber-100">Podemos tentar outra opção. Você também pode pedir uma dica.</p>}
                {showHints && <p className="text-slate-200 mt-2">{question.hint}</p>}
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setShowHints((value) => !value)}
                  className="min-h-12 px-5 py-3 border border-slate-500 rounded-xl text-sm hover:bg-slate-800">
                  {showHints ? 'Ocultar dica' : 'Quero uma dica'}
                </button>
                {result?.correct && (
                  <button type="button" onClick={advance}
                    className="min-h-12 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold">
                    {index === activity.questions.length - 1 ? 'Concluir atividade' : 'Próximo desafio'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {activity && completed && (
        <div role="status" className="text-center rounded-2xl border border-emerald-700/60 bg-slate-900 px-6 py-10 space-y-5">
          <span aria-hidden="true" className="text-4xl">🌱</span>
          <h3 className="text-2xl font-semibold text-white">Você explorou esta atividade!</h3>
          <p className="text-slate-300">Agora você pode descansar, repetir ou conhecer outra atividade.</p>
          <p className="text-xs text-slate-400">Esta demonstração não atribui notas nem registra resultados pessoais.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button type="button" onClick={() => chooseActivity(activityId)}
              className="min-h-12 px-5 py-3 rounded-xl border border-slate-500">Repetir</button>
            <button type="button" onClick={() => chooseActivity(null)}
              className="min-h-12 px-5 py-3 rounded-xl bg-sky-600 text-white font-bold">Escolher outra</button>
          </div>
        </div>
      )}
    </section>
  );
}
