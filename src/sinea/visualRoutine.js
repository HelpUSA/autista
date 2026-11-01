/**
 * Rotina visual exclusivamente demonstrativa, sem dados reais e sem persistência.
 * Alterações e impressão são locais à sessão em memória.
 */
export const sampleRoutine = Object.freeze([
  { id:'r1', time:'08:00', icon:'👋', title:'Acolhimento', location:'Sala de aula', category:'aula' },
  { id:'r2', time:'08:30', icon:'📖', title:'Leitura com apoio visual', location:'Sala de aula', category:'aula' },
  { id:'r3', time:'09:15', icon:'🎒', title:'Atendimento AEE', location:'Sala de recursos', category:'aee' },
  { id:'r4', time:'10:00', icon:'🍎', title:'Lanche', location:'Refeitório', category:'pausa' },
  { id:'r5', time:'10:30', icon:'🧩', title:'Atividade de matemática', location:'Sala de aula', category:'aula' },
  { id:'r6', time:'11:15', icon:'🌿', title:'Pausa combinada, se necessário', location:'Espaço tranquilo', category:'pausa' }
]);

export function validateRoutine(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return false;
  const ids = new Set();
  let last = -1;
  for (const entry of entries) {
    if (!entry?.id || ids.has(entry.id) || !entry.title?.trim() ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(entry.time)) return false;
    const [hour, minute] = entry.time.split(':').map(Number);
    const value = hour * 60 + minute;
    if (value < last) return false;
    ids.add(entry.id);
    last = value;
  }
  return true;
}

export function describeRoutine(entries, completedIds = []) {
  const complete = new Set(completedIds);
  return entries.map(entry => ({
    ...entry,
    completed: complete.has(entry.id),
    accessibilityLabel: `${entry.time}: ${entry.title}. ${complete.has(entry.id) ? 'Concluído' : 'Pendente'}.`
  }));
}

export function nextRoutineItem(entries, completedIds = []) {
  const complete = new Set(completedIds);
  return entries.find(entry => !complete.has(entry.id)) ?? null;
}
