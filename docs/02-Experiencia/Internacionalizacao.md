---
title: "Internacionalizacao"
project: SINEA
type: documentation
category: "02-Experiencia"
status: maintained
updated: 2026-11-01
tags:
  - sinea
  - helpus
  - evoluce
---

# Internacionalização (i18n) · PT / EN / ES

## Idiomas obrigatórios
`pt-BR` (padrão), `en-US`, `es-ES` (aceitar variante `es-PY` após validação da Evoluce no Paraguai). Seletor em cabeçalho, sempre visível e acessível.

## Arquitetura atual
- `src/sinea/i18n.js`: dicionários, `LANGUAGES`, `normalizeLocale`, `translate`, `translationCoverage`.
- `src/sinea/SineaAppV2.jsx`: todas as telas da **nova interface** utilizam `t(key)` para o conteúdo criado/revisado.
- `src/sinea/i18n.test.js`: prova igualdade de chaves, fallback e textos críticos.
- `document.documentElement.lang` e `document.title` seguem escolha de idioma.
- Seleção de idioma mantida somente em memória; não registra dados do estudante.
- Voz em atividades usa locale do usuário quando Web Speech API existe.

> [!warning] Escopo / dívida técnica
> A interface legada `SineaApp.jsx`, `ActivityStudio.jsx`, `VisualRoutine.jsx` e o protótipo `mobile/App.jsx` continuam com textos originalmente em português. A entrada web passou a usar `SineaAppV2.jsx`. Para cumprir a regra **em todas as superfícies**, migrar também mobile, e-mails, push, relatórios PDF, auditorias acessíveis, erros de API expostos e conteúdo editorial. Não alegar cobertura global antes de fazê-lo.

## Novas chaves
- Chave semântica em inglês técnico (ex.: `familySummary`).
- Traduzir contexto, não palavra isolada; não inserir diagnoses presumidos.
- Não traduzir nomes próprios, siglas de planos ou códigos de habilidade sem revisão.
- Texto de menores deve ser acessível, inclusivo e não estigmatizante.
- Todos os novos recursos devem chegar com chaves e testes de paridade.

## Formatação
Usar `Intl.DateTimeFormat(locale)`, `Intl.NumberFormat(locale)`, e futura tradução de notificações no servidor. Dados escolares contêm fuso horário da rede, nunca inferir da máquina.

## Critérios de aceite
- [ ] Todos os rótulos e mensagens PT/EN/ES revisados por profissional.
- [ ] Teclado, leitor de tela, zoom 200%, RTL não é obrigatório.
- [ ] Troca de idioma não perde o contexto da tela nem grava dados pessoais.
- [ ] E-mails, app Android/iOS, relatórios, PDFs e notificações nos três idiomas.
- [ ] Testes E2E em todos os idiomas e na região do Paraguai.
