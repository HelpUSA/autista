---
title: "Planos-PEI-PDI-PAEE"
project: SINEA
type: documentation
category: "04-Modulos"
status: maintained
updated: 2026-11-01
tags:
  - sinea
  - helpus
  - evoluce
---

# PEI · PDI · PAEE e metas

## Modelo pedagógico
Estudo de caso → barreiras e potencialidades → metas observáveis e critérios de medida → recursos/apoios → revisão → execução/evidências → evolução e replanejamento.

## Regras implementadas
`src/domain/planWorkflow.js`:
- cria rascunho PEI/PDI/PAEE validado;
- identifica versões e conflitos;
- somente plano com metas passa a revisão;
- aprovação exige outro profissional;
- evidência requer descrição, rubrica, ator e progresso informado por docente;
- não altera automaticamente plano aprovado.

`src/sinea/PlanStudio.jsx` (PR #12) tem simulação local; a UI trilíngue usa cartões de metas exemplificativas. Integração das duas UIs no mesmo fluxo real é pendente.

## Dados pretendidos
Ano letivo, escola, autor, responsável, prazo/revisão, versão, status, metas, critérios, apoios, evidências, referências curriculares e assinatura profissional. PDI e PAEE não são apenas etiquetas de PEI: semântica precisa de revisão com equipe da Evoluce.

## Fluxo
Rascunho → Revisão → Aprovado → Vigente → Revisão periódica → Nova versão. Incluir exportação PDF acessível somente após controle de acesso e revisão de conteúdo.

## BNCC
Nunca inventar código BNCC. Cada vinculação exige edição, componente, justificativa e aprovação editorial humana.

## Aceite
Testes de edição concorrente, aprovação por outro profissional, histórico imutável, autorização de família e exportação restrita em três idiomas.
