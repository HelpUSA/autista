---
title: "Briefing-Rastreabilidade"
project: SINEA
type: documentation
category: "01-Produto"
status: maintained
updated: 2026-11-01
tags:
  - sinea
  - helpus
  - evoluce
---

# Matriz de rastreabilidade do briefing Evoluce

> [!warning] Referência do cliente
> Este documento é uma interpretação técnica resumida do briefing de 14 páginas de 01/11/2026, conforme descrição do cliente. Não substitui revisão linha a linha do PDF original conservado localmente.

| ID | Requisito do briefing | Código ou módulo | Estado | Gate de aceite |
|---|---|---|---|---|
| BR-01 | SINEA, lema e identidade visual azul-marinho/turquesa | SineaAppV2.jsx | Demo | Aprovação visual Evoluce |
| BR-02 | Login por AEE, mediador, coordenação, Secretaria, MFA/biometria | Seleção fictícia + server/auth.mjs | Parcial | IdP real e dispositivos |
| BR-03 | Agenda profissional, 3 contadores e pendências | HomePage | Demo | Dados reais autorizados e E2E |
| BR-04 | Prontuário digital e PDFs | StudentDetail + SQL students/documents | Parcial | Storage cifrado privado |
| BR-05 | Trajetória escolar/transferência | studentTransfer.js + timeline | Parcial | Operações assinadas e auditoria |
| BR-06 | PEI/PDI/PAEE e metas | PlanPage, planWorkflow.js | Parcial | API persistente e validação AEE |
| BR-07 | Diário com escala, apoio, ditado e foto sem rosto | DiaryPage | Demo bloqueado | Captura segura, consentimento, UX |
| BR-08 | Evolução pedagógica/cognitiva/funcional/socioemocional | Painel ilustrativo + dados | Parcial | Rubricas e relatórios reais |
| BR-09 | Painel da rede agregada | NetworkPage + networkPrivacy.js | Parcial | Anonimização e teste de reidentificação |
| BR-10 | Canto da Calma, escala 1–5 e cardápio | CalmPage + calmAnalytics.js | Parcial | Registro autenticado, ética |
| BR-11 | IA pedagógica, PEI, BNCC, Rádio Sintonia | aiGuardrails.js + SupportPage | Planejado | RAG com fontes, revisão humana |
| BR-12 | App iOS/Android e funcionamento offline | mobile/ + offlineEngine | Protótipo | Storage cifrado, sync, pentest |
| BR-13 | Idiomas PT/EN/ES | i18n.js + SineaAppV2.jsx | Web demo | Revisão linguística e mobile |
| BR-14 | Acesso família e comunicação inspirada em agendas escolares | FamilyPage + DiaryPage | Demo | API, contatos, autorização e auditoria |

## Regras
Uma aprovação de build não marca requisito como entregue. Requisitos com riscos de dados infantis só são aceitos após testes de autorização backend, segurança, acessibilidade e aceite jurídico.

Relacionamentos: [[06-Operacao/Testes-e-Homologacao]], [[07-Governanca/Roadmap-e-Pendencias]].
