// Somente segmentação visual em um MOCK. Autorizações reais deverão ser validadas no servidor.
export const DEMO_VIEW_PERMISSIONS = Object.freeze({
  aee: ['inicio','estudantes','registro','planos','painel','canto','suporte','atividades'],
  mediador: ['inicio','estudantes','registro','canto','atividades'],
  coordenacao: ['inicio','estudantes','planos','painel','canto','suporte'],
  secretaria: ['painel']
});

export function canPreview(profile, screen) {
  return Boolean(DEMO_VIEW_PERMISSIONS[profile]?.includes(screen));
}

export function anonymizeNetworkCell(total, minGroupSize = 10) {
  if (!Number.isInteger(total) || total < 0) throw new Error('Contagem inválida');
  if (total < minGroupSize) return null;
  return total;
}

export function validateCalmDemo(data) {
  if (!data || !Number.isInteger(data.entry) || !Number.isInteger(data.exit)) return false;
  if (data.entry < 1 || data.entry > 5 || data.exit < 1 || data.exit > 5) return false;
  if (!['melhorou','igual','piorou'].includes(data.outcome)) return false;
  if (!['sim','nao','parcialmente'].includes(data.returned)) return false;
  if (!Number.isInteger(data.elapsed) || data.elapsed < 0) return false;
  return Array.isArray(data.items) && data.items.every(x => typeof x === 'string');
}
