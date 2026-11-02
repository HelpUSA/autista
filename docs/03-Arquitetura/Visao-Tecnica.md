---
title: "Visao-Tecnica"
project: SINEA
type: documentation
category: "03-Arquitetura"
status: maintained
updated: 2026-11-01
tags:
  - sinea
  - helpus
  - evoluce
---

# Arquitetura lógica SINEA

```mermaid
flowchart TB
 A[Web React/Vite — DEMO] --> I[i18n PT EN ES]
 A --> M[Fluxos educativos, diário e família]
 B[Expo iOS/Android — Protótipo] --> F[Outbox offline — motor puro]
 M -. "integração futura, NÃO habilitada" .-> API[API Node OIDC/JWKS experimental]
 F -. "backend futuro" .-> API
 API --> P[RBAC por vínculo verificado no banco]
 P --> DB[(PostgreSQL Brasil, RLS)]
 API -. "futuro" .-> OBJ[(Storage privado cifrado)]
 API -. "futuro" .-> AUD[(Logs de auditoria imutável)]
 E[Editora Evoluce] --> CAT[Catálogo e licenças]
 CAT -.-> API
```

## Implementação observada
- `src/main.jsx` inicializa `src/sinea/SineaAppV2.jsx`.
- `src/sinea/i18n.js` concentra traduções.
- `src/domain/*.js`: regras puras de PEI, Canto, transferências, licenciamento, IA e métricas.
- `database/migrations/001..003`: PostgreSQL com RLS forçada; migração 002 concede leituras limitadas à role sem LOGIN `sinea_api`.
- `server/`: API experimental com JWT OIDC/JWKS e MFA; escrita desabilitada.
- `mobile/`: Expo DEMO e motor offline sem criptografia nativa.

## Princípios
Negar por padrão, menor privilégio, isolamento por rede e escola, separação de dado clínico e pedagógico, confirmação por segundo profissional em aprovações, idempotência de mutações offline, minimização e logs sem dados pessoais.

## Pendências de integração
O web demo não faz chamadas reais à API. O backend não tem autenticação implantada nem persistência de escrita. Nenhuma decisão de arquitetura altera esse estado sem passar gates de segurança.

Links: [[03-Arquitetura/Modelo-de-Dados]], [[03-Arquitetura/API-e-Contratos]], [[05-Seguranca/Threat-Model]].
