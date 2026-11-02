---
title: "Testes-e-Homologacao"
project: SINEA
type: documentation
category: "06-Operacao"
status: maintained
updated: 2026-11-01
tags:
  - sinea
  - helpus
  - evoluce
---

# Plano de testes e homologação

## Automáticos
- `npm ci && npm test && npm run build`
- `npm run test:mobile-domain` (outbox pura)
- `cd server && npm ci && npm test` após lockfile do Antigravity
- PostgreSQL 16: migrations 001, 002 e 003 e SQL tests RLS, cross-tenant e schema extendido.
- i18n: mesmas chaves em PT/EN/ES, fallback, textos de segurança em cada idioma.
- Audit de dependências: runtime deve estar sem advisories alta/crítica.

## E2E responsivo
320, 375, 768, 1024, 1440 px; foco sem mouse, menu inferior e sidebar desktop, sem overflow ou sobreposição; logo HelpUS visível em falha de rede e sem layout shift; trocas PT→EN→ES em cada tela.

## Jornada família
Comunicado fictício, confirmação de leitura somente em memória, canais segmentados, calendário e autorização em modo somente leitura. Garantir que sem login real não há mensagem nem dado real.

## Jornada aluno
Rotina por etapas, pictograma ligado/desligado, letra ampliada, leitura em voz alta (se disponível), pausa, reinício, feedback livre de nota; idiomas e sem cronômetro.

## Jornada pedagógica
Visualização de prontuário fictício, plano PEI/PDI/PAEE, diário dividido em profissional/família, Canto da Calma, panel agregado, secretaria sem prontuário nominal e dados clínicos.

## Gates de produção
- [ ] CI, SAST/DAST, pentest e auditoria manual.
- [ ] IdP e MFA, RLS/grants completos, arquivos e auditoria imutável.
- [ ] Backup/restore, criptografia e data center Brasil.
- [ ] DPA/RIPD e aceite jurídico.
- [ ] Aprovação editorial Evoluce e licença de conteúdos.
- [ ] Revisão WCAG e testes de acessibilidade em Android/iOS.
- [ ] Validação operacional e aceite de cliente documentados.

Até lá, `status=DEMO_ONLY`.
