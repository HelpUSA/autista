---
title: "Seguranca-e-RBAC"
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

# RBAC e ABAC por vínculo

## Política fundamental
Controle de acesso não é esconder botão. Usuário autenticado é avaliado por tenant, instituição, escola, papel, vínculo estudante–profissional, data de vigência e permissão específica no backend, com RLS no PostgreSQL.

| Operação | AEE vinculado | Regente vinculado | Mediador vinculado | Coordenação escola | Secretaria | Família |
|---|---|---|---|---|---|---|
| Plano ler | ✓ | ✓ | ✓ | ✓ | — | Resumo autorizado |
| Plano editar | ✓ | — | — | ✓ | — | — |
| Laudo clínico | ✓ | — | — | — | — | Exige regra jurídica própria |
| Registro diário criar | ✓ | ✓ | ✓ | Conforme vínculo | — | — |
| Canto da Calma registrar | ✓ | ✓ | ✓ | Conforme vínculo | — | — |
| Painel agregado | — | — | — | Unidade | ✓ | — |
| Confirmação de comunicado | — | — | — | — | — | Somente dependente verificado |

> [!danger] Restrições
> A presença do perfil família na DEMO não significa autenticação ou validação de responsabilidade legal. A rede não pode consultar laudos apenas por ser Secretaria. A equipe comercial não deve acessar prontuários.

## Referências de código
`src/domain/accessPolicy.js`, `src/sinea/demoPolicy.js`, `database/migrations/002_scoped_read_rls.sql`, `database/tests/verify_tenant_isolation.sql`.

## Controles de produção requeridos
IdP com MFA, revogação, sessão expirada, auditoria de cada acesso, testes de violação horizontal/vertical, account recovery e observabilidade. Testar troca de rede, profissional com duas escolas, transferência e revogação de vínculo. Os testes locais atuais usam identidades sintéticas.

Relacionamentos: [[05-Seguranca/Threat-Model]], [[05-Seguranca/Privacidade-e-LGPD]].
