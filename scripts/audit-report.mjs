import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'npm-audit.json';
let report;
try { report = JSON.parse(readFileSync(file, 'utf8')); }
catch (err) {
  console.error('Auditoria npm inválida ou indisponível:', err.message);
  process.exitCode = 1;
}
if (report) {
  const issues = Object.entries(report.vulnerabilities ?? {}).map(([pkg, item]) => ({
    pkg, severity:item.severity, direct: Boolean(item.isDirect),
    range:item.range, fix:item.fixAvailable === false ? 'sem correção direta' :
      typeof item.fixAvailable === 'object' ? 'atualizar ' + item.fixAvailable.name + '@' + item.fixAvailable.version :
      String(item.fixAvailable)
  }));
  const ranking = {critical:0,high:1,moderate:2,low:3,info:4};
  issues.sort((a,b)=>(ranking[a.severity]??5)-(ranking[b.severity]??5) || a.pkg.localeCompare(b.pkg));
  for (const i of issues) console.log(`npm audit: ${i.severity}: ${i.pkg} (${i.direct?'direta':'transitiva'}) faixa=${i.range} fix=${i.fix}`);
  const summary=report.metadata?.vulnerabilities ?? {};
  console.log('Resumo npm audit:',JSON.stringify(summary));
  if (!report.vulnerabilities) console.log('Sem relatório de vulnerabilidades npm.');
}
