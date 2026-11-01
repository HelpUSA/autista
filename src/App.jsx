import React, { useState } from 'react';
import ActivityStudio from './activities/ActivityStudio.jsx';
import { 
  BookOpen, 
  Smile, 
  Volume2, 
  Users, 
  Calendar, 
  Heart, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  FileText, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Brain,
  HelpCircle,
  Clock,
  Send,
  Eye,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('aluno');
  const [calmMode, setCalmMode] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState('');
  
  // Rotina do aluno
  const [routine, setRoutine] = useState([
    { id: 1, time: '08:00', title: 'Acolhimento & Roda de Conversa', done: true, icon: '☀️' },
    { id: 2, time: '08:45', title: 'Português: Livro da Editora - Cap. 3 (Animais e Sons)', done: true, icon: '📖' },
    { id: 3, time: '09:30', title: 'Momento de Lanche & Socialização', done: false, icon: '🍎' },
    { id: 4, time: '10:15', title: 'Matemática Adaptada: Contagem Visual com Blocos', done: false, icon: '🔢' },
    { id: 5, time: '11:00', title: 'Pausa Sensorial na Sala de Calmaria', done: false, icon: '🌿' },
  ]);

  // Prancha de CAA (Comunicação Aumentativa e Alternativa)
  const caaCards = [
    { id: 'water', label: 'Quero Água', icon: '💧', color: 'bg-blue-600 hover:bg-blue-500' },
    { id: 'bathroom', label: 'Banheiro', icon: '🚻', color: 'bg-indigo-600 hover:bg-indigo-500' },
    { id: 'help', label: 'Preciso de Ajuda', icon: '🙋', color: 'bg-amber-600 hover:bg-amber-500' },
    { id: 'break', label: 'Quero Descansar', icon: '🛋️', color: 'bg-emerald-600 hover:bg-emerald-500' },
    { id: 'happy', label: 'Estou Contente', icon: '😄', color: 'bg-green-600 hover:bg-green-500' },
    { id: 'overwhelmed', label: 'Barulho Alto', icon: '🎧', color: 'bg-rose-600 hover:bg-rose-500' },
    { id: 'eat', label: 'Quero Lanchar', icon: '🥪', color: 'bg-orange-600 hover:bg-orange-500' },
    { id: 'more_time', label: 'Mais Tempo', icon: '⏳', color: 'bg-teal-600 hover:bg-teal-500' },
  ];

  // Registros de mediadores
  const [supportLogs, setSupportLogs] = useState([
    { id: 1, student: 'Lucas Silva (6 anos)', activity: 'Leitura Silábica - Livro Ed. Inclusiva pág. 24', supportLevel: 'Suporte Gestual', mood: 'Calmo', notes: 'Engajamento alto com uso dos pictogramas da editora.', time: '09:15' },
    { id: 2, student: 'Sofia Santos (8 anos)', activity: 'Contagem Matemática - Coleção Passos pág. 12', supportLevel: 'Suporte Verbal', mood: 'Focado', notes: 'Concluiu a atividade antes do previsto com reforço positivo.', time: '10:30' },
  ]);

  const [newLog, setNewLog] = useState({
    student: 'Lucas Silva (6 anos)',
    activity: 'Português - Reconhecimento de Vogais',
    supportLevel: 'Suporte Gestual',
    mood: 'Calmo',
    notes: ''
  });

  // Função para sintetizar voz no navegador
  const speakText = (text) => {
    setSpeechFeedback(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRoutine = (id) => {
    setRoutine(routine.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const addSupportLog = (e) => {
    e.preventDefault();
    if (!newLog.notes) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setSupportLogs([
      { id: Date.now(), ...newLog, time: timeStr },
      ...supportLogs
    ]);
    setNewLog({ ...newLog, notes: '' });
  };

  return (
    <div className={`min-h-screen ${calmMode ? 'bg-sky-950 text-sky-100 font-lexend' : 'bg-slate-950 text-slate-100'} transition-colors duration-300`}>
      {/* Top Banner */}
      <header className="border-b border-sky-900/40 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-2xl">
              🧩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Inclusiva<span className="text-sky-400">TEA</span>
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 font-medium">
                  Plataforma da Editora
                </span>
              </div>
              <p className="text-xs text-slate-400">Acompanhamento Escolar, Adaptação Didática e PEI Digital</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Botão de Modo Calmaria */}
            <button 
              onClick={() => setCalmMode(!calmMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                calmMode 
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-sm' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              {calmMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
              {calmMode ? 'Modo Suave Ativo' : 'Ativar Modo Suave'}
            </button>

            {/* Selo do Domínio */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              autista.helpusbr.com
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
          <nav aria-label="Navegação principal" className="flex space-x-2 md:space-x-8 overflow-x-auto py-2 text-sm font-medium">
            <button
              onClick={() => setActiveTab('aluno')}
              className={`flex items-center gap-2 pb-2 px-1 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'aluno'
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smile className="w-4 h-4" />
              1. Aluno (Prancha CAA & Rotina)
            </button>
            <button
              onClick={() => setActiveTab('atividades')}
              className={`flex items-center gap-2 pb-2 px-1 border-b-2 whitespace-nowrap transition-colors ${activeTab === 'atividades' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <BookOpen className="w-4 h-4" />
              Atividades Interativas
            </button>
            <button
              onClick={() => setActiveTab('mediador')}
              className={`flex items-center gap-2 pb-2 px-1 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'mediador'
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              2. Professor & Mediador (PEI)
            </button>
            <button
              onClick={() => setActiveTab('livro')}
              className={`flex items-center gap-2 pb-2 px-1 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'livro'
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              3. Livro Didático Adaptado
            </button>
            <button
              onClick={() => setActiveTab('familia')}
              className={`flex items-center gap-2 pb-2 px-1 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'familia'
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              4. Família & Terapeutas
            </button>

          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div role="note" className="mb-5 rounded-xl border border-amber-700/60 bg-amber-950/50 p-3 text-sm text-amber-100">
          Ambiente demonstrativo público, com exemplos fictícios. Não informe nomes reais, laudos, informações de saúde ou outros dados de estudantes.
        </div>
        {activeTab === 'atividades' && <ActivityStudio />}
        
        {/* TAB 1: VISÃO DO ALUNO */}
        {activeTab === 'aluno' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-r from-sky-900/40 via-indigo-900/30 to-slate-900 p-6 border border-sky-800/40">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">Espaço do Estudante</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Olá, Lucas! 👋</h2>
                  <p className="text-sm text-slate-300 mt-0.5">Veja sua rotina e use as pranchas para falar com seu professor e amigos.</p>
                </div>
                {speechFeedback && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-200 animate-pulse text-sm">
                    <Volume2 className="w-4 h-4" />
                    <span>Falando: <strong>"{speechFeedback}"</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Prancha CAA */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-sky-400" />
                    Prancha de Comunicação Alternativa (CAA)
                  </h3>
                  <span className="text-xs text-slate-400">Toque no cartão para falar</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {caaCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => speakText(card.label)}
                      className={`${card.color} text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg transform transition active:scale-95 hover:shadow-sky-500/20 min-h-[110px]`}
                    >
                      <span className="text-3xl mb-2">{card.icon}</span>
                      <span className="text-xs font-bold leading-tight">{card.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sala de Calmaria / Descompressão */}
                <div className="mt-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center text-xl">
                        🌿
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Sala de Calmaria & Respiração</h4>
                        <p className="text-xs text-slate-400">Pausa para auto-regulação quando houver sobrecarga sensorial.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => speakText("Respire fundo. Puxe o ar... segure... solte bem devagar.")}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-2"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Exercício Guiado
                    </button>
                  </div>
                </div>
              </div>

              {/* Rotina Visual do Dia */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  Minha Rotina de Hoje
                </h3>

                <div className="space-y-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
                  {routine.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleRoutine(item.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        item.done 
                          ? 'bg-slate-800/40 border-slate-800 text-slate-400 opacity-70 line-through' 
                          : 'bg-slate-800/90 border-slate-700/80 text-white hover:border-sky-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <p className="text-xs font-semibold leading-snug">{item.title}</p>
                          <span className="text-[10px] text-sky-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" /> {item.time}
                          </span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        item.done ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold text-xs' : 'border-slate-600'
                      }`}>
                        {item.done && '✓'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEDIADOR & PROFESSOR */}
        {activeTab === 'mediador' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-sky-400" />
                Painel do Professor & Mediador Escolar (AEE)
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Registro de nível de suporte em sala e integração com os objetivos do PEI e da BNCC.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulário de Registro Rápido */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Novo Registro de Acompanhamento
                </h3>

                <form onSubmit={addSupportLog} className="space-y-4 text-sm">
                  <p id="demo-form-disabled" role="note" className="rounded-lg bg-amber-900/40 border border-amber-700/50 p-3 text-xs text-amber-100">
                    Registro desativado no ambiente público de demonstração. Os exemplos abaixo são fictícios.
                  </p>
                  <fieldset disabled aria-describedby="demo-form-disabled" className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Aluno Selecionado</label>
                    <select 
                      value={newLog.student}
                      onChange={(e) => setNewLog({ ...newLog, student: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option>Lucas Silva (6 anos) - 1º Ano</option>
                      <option>Sofia Santos (8 anos) - 3º Ano</option>
                      <option>Mateus Rocha (10 anos) - 5º Ano</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Atividade do Livro Didático</label>
                    <input 
                      type="text"
                      value={newLog.activity}
                      onChange={(e) => setNewLog({ ...newLog, activity: e.target.value })}
                      placeholder="Ex: Livro de Matemática, Cap. 2 - pág. 15"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Nível de Suporte Necessário</label>
                    <select 
                      value={newLog.supportLevel}
                      onChange={(e) => setNewLog({ ...newLog, supportLevel: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option>Totalmente Independente</option>
                      <option>Suporte Verbal (instrução oral simples)</option>
                      <option>Suporte Gestual (apontar para o material)</option>
                      <option>Suporte com Modelo (demonstrar antes)</option>
                      <option>Suporte Físico Parcial (mão sobre mão)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Estado Emocional / Sensorial</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Calmo', 'Focado', 'Agitado'].map(mood => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setNewLog({ ...newLog, mood })}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                            newLog.mood === mood 
                              ? 'bg-sky-500/20 border-sky-400 text-sky-300' 
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Observações do Mediador</label>
                    <textarea 
                      rows="3"
                      value={newLog.notes}
                      onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                      placeholder="Ex: O aluno necessitou de redução de ruído antes de iniciar a escrita..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Registrar no Diário de Bordo
                  </button>
                  </fieldset>
                </form>
              </div>

              {/* Feed de Ocorrências Diárias */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">Histórico Recente em Sala</h3>
                  <span className="text-xs text-slate-400">{supportLogs.length} registros hoje</span>
                </div>

                <div className="space-y-3">
                  {supportLogs.map((log) => (
                    <div key={log.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{log.student}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30">
                            {log.supportLevel}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {log.time}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-300">
                        <strong>Atividade:</strong> {log.activity}
                      </p>
                      <p className="text-xs text-slate-400 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/40">
                        "{log.notes}"
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                        <span>Estado: <strong className="text-emerald-400">{log.mood}</strong></span>
                        <span>•</span>
                        <span className="text-indigo-400 font-medium">Vinculado ao PEI 2026/2</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVRO DIDÁTICO ADAPTADO */}
        {activeTab === 'livro' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-400" />
                Catálogo da Editora: Camada de Acessibilidade & Adaptação
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Veja como o material didático físico da editora é transformado em atividades acessíveis com apoio de IA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exemplo Livro Tradicional */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 opacity-75">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Página Original do Livro</span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">Sem Adaptação</span>
                </div>
                <div className="border border-slate-700/60 rounded-xl p-4 bg-slate-800/40 space-y-3">
                  <h4 className="font-bold text-slate-200 text-sm">Capítulo 4: O Ciclo da Água na Natureza</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "A evaporação da água é um fenômeno termodinâmico contínuo onde as partículas líquidas ganham energia cinética com o calor solar, transformando-se em vapor d'água que ascende na atmosfera terrestre até condensar..."
                  </p>
                  <div className="text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    ⚠️ <strong>Barreiras para o aluno autista:</strong> Vocabulário abstrato, ausência de apoio visual sequencial, excesso de texto denso sem ancoragem prática.
                  </div>
                </div>
              </div>

              {/* Exemplo Livro Adaptado no App */}
              <div className="bg-slate-900/90 border border-sky-800/60 rounded-2xl p-5 space-y-4 shadow-lg shadow-sky-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Versão Digital Adaptada da Editora
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium">Metodologia DUA</span>
                </div>
                <div className="border border-sky-700/50 rounded-xl p-4 bg-sky-950/30 space-y-4">
                  <h4 className="font-bold text-sky-200 text-base">Passo a Passo: Como a Água Viaja ☀️🌧️</h4>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-2xl block mb-1">☀️ ➡️ 💧</span>
                      <strong className="text-white block text-[11px]">1. Sol Aquece</strong>
                      <span className="text-[10px] text-slate-400">A água sobe</span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-2xl block mb-1">☁️</span>
                      <strong className="text-white block text-[11px]">2. Forma Nuvem</strong>
                      <span className="text-[10px] text-slate-400">Fica cheia</span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-2xl block mb-1">🌧️</span>
                      <strong className="text-white block text-[11px]">3. Chove</strong>
                      <span className="text-[10px] text-slate-400">Volta pro rio</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => speakText("Passo um: O sol esquenta a água. Passo dois: Forma nuvem. Passo três: A chuva cai.")}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Ouvir Explicação em Voz Alta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FAMÍLIA & TERAPEUTAS */}
        {activeTab === 'familia' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-400" />
                Rede Tripartite: Escola • Família • Equipe Multidisciplinar
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Canal direto com fonoaudiólogos, terapeutas ocupacionais e psicólogos ABA para unificar as condutas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold">
                  <Brain className="w-4 h-4" />
                  Terapeuta Ocupacional (T.O.)
                </div>
                <p className="text-xs text-slate-300">
                  "Recomendamos uso de almofada proprioceptiva na cadeira durante as aulas de matemática para diminuir a inquietação motora."
                </p>
                <span className="text-[10px] text-slate-400 block">Dra. Camila Nogueira • Atualizado há 2 dias</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                  <MessageSquare className="w-4 h-4" />
                  Fonoaudiologia
                </div>
                <p className="text-xs text-slate-300">
                  "Estimular o uso da prancha CAA para pedir 'Mais Tempo' antes das transições de sala para evitar desregulação."
                </p>
                <span className="text-[10px] text-slate-400 block">Dra. Roberta Mendes • Atualizado ontem</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <Heart className="w-4 h-4" />
                  Recado da Família
                </div>
                <p className="text-xs text-slate-300">
                  "Hoje o Lucas dormiu bem, tomou a medicação no horário e estava muito animado para a aula de artes."
                </p>
                <span className="text-[10px] text-slate-400 block">Mariana Silva (Mãe) • Hoje às 07:40</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-12 py-6 text-center text-xs text-slate-400">
        <p>© 2026 InclusivaTEA • Ecossistema de Educação Inclusiva e Adaptação de Materiais Didáticos para Editoras.</p>
        <p className="mt-1 text-slate-400">Operado sob o domínio oficial <span className="text-sky-400 font-medium">autista.helpusbr.com</span></p>
      </footer>
    </div>
  );
}
