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

## Política de navegação do demonstrativo (atualização 2026-11-01)

O módulo `src/sinea/navigationPolicy.js` define explicitamente as telas por perfil no web V2, com abordagem de negação por padrão. Suas funções `canOpenDemoScreen`, `resolveDemoScreen`, `visibleDemoNavigation` e `studentVisibleToDemoRole` são exercitadas por testes negativos. A Secretaria vê apenas o painel ilustrativo; a família não abre registros profissionais, suporte de IA ou painel agregado e acessa somente um estudante **fictício**. 

> [!danger] Limite do mecanismo
> Essas regras são apenas de UI e não certificam autorização real. Todo o conteúdo demonstrativo é embarcado no JavaScript, inclusive os objetos fictícios. A API ainda precisa garantir acesso por vínculo verificado, tenant e RLS antes de qualquer dado de estudantes reais. Não há autenticação por seleção visual de perfil.
