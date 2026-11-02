---
title: "Handoff-Antigravity"
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

# Handoff operacional Antigravity — interface tri-idiomas e Obsidian

**Branch:** `feat/sinea-family-i18n-helpus-obsidian-20261101`  
**PR:** #15 (base = PR #12)  
**Pasta local:** `D:\AntiG\autista`  
**Documento cliente:** `D:\AntiG\autista\docs\SINEA - Briefing tecnico para orcamento.pdf` (não adicionar ao GitHub público).

## Checklist
- [ ] Buscar branches remotas e inspecionar diff antes de checkout.
- [ ] Rodar lint/smoke/build/test e registrar SHA.
- [ ] Homologar UI desktop/mobile, três idiomas, menu, fluxo diário, comunicação, notificações fictícias.
- [ ] Comparar cores, hierarquia, logo e 5 botões inferiores ao PDF.
- [ ] Validar a imagem HelpUS local em `public/brand/helpus-logo.jpg` e `mobile/assets/helpus-logo.jpg`, copiada byte a byte do repositório oficial HelpUSA/helpus-ai, SHA Git `5fd4cb3ab76399f6d6200f9a897bea95124cf0c3`; registrar SHA-256 e autorização de marca antes de deploy.
- [ ] Revisar tradução de rótulos da demo, mobile Expo, templates de email, notificações e PDF.
- [ ] Conferir docs Obsidian com backlinks em `docs/00-Inicio.md` e Mermaid.
- [ ] Não migrar dados reais, nem permitir envio de mensagens ou registros sem auth e base legal.
- [ ] Reportar ACK, screenshots e logs saneados, erros, correções e status DNS/SSL.
- [ ] Manter PR #15 em draft até revisão; PR #12 é sua dependência.

## Pendências herdadas
Issues #9 (mobile), #10 (backend), #11 (homologação), #13 (Vite/esbuild), #14 (infraestrutura Brasil). O próprio frontend V2 não conclui segurança de dados reais, integração API, workflows persistentes nem operação mobile.
