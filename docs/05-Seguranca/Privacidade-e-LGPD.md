---
title: "Privacidade-e-LGPD"
project: SINEA
type: documentation
category: "05-Seguranca"
status: maintained
updated: 2026-11-01
tags:
  - sinea
  - helpus
  - evoluce
---

# LGPD, ECA Digital e privacidade por concepção

> [!danger] Sem liberação de dados reais
> O produto lida potencialmente com dados de crianças e informações sensíveis de saúde. A demonstração não está autorizada a processar dados reais. A existência de login visual, RLS ou teste de domínio não representa conformidade legal.

## Papéis contratuais
Definir controlador, operador, suboperadores por rede e editora; avaliar bases legais aplicáveis ao tratamento educacional, consentimento ou outra hipótese adequada, direito de titulares e representantes, transparência por faixa etária e melhores interesses da criança.

## Medidas mínimas
- Minimização de identidade, separação clínica/pedagógica e finalidade específica.
- Vínculo responsável–dependente verificado antes de qualquer acesso.
- Criptografia em trânsito e repouso, gestão de chaves, TLS com CA e secret vault.
- MFA em acesso privilegiado e registros de estudantes; revogação imediata.
- Logs de acesso/download/exportação e relatórios de incidente sem conteúdo sensível.
- Políticas de retenção e eliminação documentadas conforme necessidade legal.
- Portabilidade, correção, oposição/eliminação quando aplicáveis e monitoramento de solicitações.
- Avaliação de impacto (RIPD quando cabível), contratos DPA e fornecedores.
- Data center efetivo no Brasil conforme contrato; verificar também backups e suboperadores.
- Sem anúncios, rastreamento comportamental nem perfilamento de crianças.
- Ambiente de testes com dados sintéticos, sem cópia de produção.

## Proteção de comunicação familiar
Mensagens não devem carregar laudos; push não identifica estudante nem diagnóstico. Confirmações de leitura devem registrar ator verificado e finalidade, não se tornarem métrica clínica.

## Referências oficiais a acompanhar
- LGPD: Lei 13.709/2018.
- ECA Digital: Lei 15.211/2025.
- Regulamentação brasileira da educação inclusiva vigente.
- Parecer da assessoria jurídica antes de piloto e transferência inter-redes.

Relacionamentos: [[05-Seguranca/Threat-Model]], [[06-Operacao/Testes-e-Homologacao]].
