---
title: "Threat-Model"
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

# Modelo de ameaças e riscos

## Ativos de maior criticidade
Identificação do estudante, laudos, vínculos familiares, metas do PEI, registros de atendimento, imagens de evidência, mensagens privadas, chaves do aplicativo, tokens OIDC e backups.

## Ameaças e controles
| Ameaça | Exemplo | Mitigação obrigatória |
|---|---|---|
| IDOR/BOLA | Usuário troca student_id da URL | RBAC+vínculo no DB e RLS, testes negativos |
| Tenant breakout | Escola A lê escola B | tenant_id de sessão validada, policy SQL, pentest |
| Elevação de perfil | JS declara usuário Secretaria/AEE | papel do token não confiável; membership DB |
| Exposição de laudos | URL pública ou storage mal configurado | bucket privado cifrado, URLs curtas, auditoria |
| Exposição em notificações | Nome+diagnóstico em lockscreen | push genérico sem dados infantis |
| Perda de dispositivo | Banco offline em texto claro | SQLCipher, Keychain/Keystore, wipe e revogação |
| Reenvio offline | Duplicar registro e sobrescrever histórico | clientMutationId, versão e conflito manual |
| Injeção IA | Documento editorial tenta instruir prompt | isolamento RAG, fontes, output guardrails |
| Inferência por grupos | Secretaria compara escola pequena | supressão dupla, limiares, análise estatística |
| Dependências | CVE Vite/esbuild ou biblioteca móvel | audit CI e atualização com lockfile |
| Credencial vazada | Token Cloudflare/GitHub em log | vault, escopo mínimo, rotação |
| Falha operacional | Backup sem restauração | testes periódicos restore e RPO/RTO |

## Revisão
Realizar STRIDE/OWASP ASVS no backend e OWASP MASVS no mobile, pentest externo, scanner SAST/DAST, revisão acessível e teste de incidente. Registrar evidências, responsável e gate.

## Estado
Migrações e testes sintéticos são salvaguardas de base, não encerram a ameaça. Ver [[03-Arquitetura/Seguranca-e-RBAC]].
