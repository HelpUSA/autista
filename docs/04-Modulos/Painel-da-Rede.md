---
title: "Painel-da-Rede"
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

# Painel da Rede e indicadores

## Objetivo
Visão de cobertura AEE, unidades, atendimentos, planos ativos e metas revisadas, sem acesso nominal da Secretaria.

## Exibição DEMO
Cards ilustrativos de 24 unidades, 1.280 planos, 8.460 registros e 92% cobertura, e gráfico de necessidades. **Os valores não representam instituições ou estudantes reais.**

## Dados reais
Aplicar RLS/ACL no servidor e supressão de células pequenas (incluindo supressão complementar de um segundo grupo ou total) para reduzir inferência. Revisar risco adicional por comparação de filtros, histórico, campus e período.

## Regras de visualização
Redes/supervisores veem somente instituições sob sua competência; comparação de duas escolas pequena não pode reidentificar indivíduos; exportação agregada exige autorização e auditoria.

## Estados
`networkPrivacy.js` implementa supressão preliminar. Não equivale a anonimização irreversível nem substitui estudo de reidentificação.
