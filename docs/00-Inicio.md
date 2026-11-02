---
title: "00-Inicio"
project: SINEA
type: documentation
category: "00-Inicio.md"
status: maintained
updated: 2026-11-01
tags:
  - sinea
  - helpus
  - evoluce
---

# SINEA · Central de documentação

> [!important] Fonte de verdade e confidencialidade
> Esta base descreve a arquitetura implementada e planejada no repositório público. O briefing original da Editora Evoluce permanece fora do GitHub. **Nenhum dado pessoal de crianças, CPF, laudo, senha ou contrato deve ser adicionado aqui.**

**Produto:** SINEA — Sistema de Inteligência para Necessidades Educacionais e Aprendizagem  
**Cliente:** Editora Evoluce · Projeto Em Sintonia / Rádio Sintonia  
**Tecnologia:** HelpUS LLC  
**Domínio provisório:** `autista.helpusbr.com`  
**Idiomas:** português (Brasil), inglês e espanhol  
**Estado:** aplicação demonstrativa e arquitetura P1 em homologação; **não autorizada para estudantes reais**.

## Índice do cofre Obsidian

| Área | Documento principal |
|---|---|
| Produto, visão e requisitos | [[01-Produto/Visao-e-Escopo]] · [[01-Produto/Briefing-Rastreabilidade]] |
| Perfis, jornadas e permissões | [[01-Produto/Perfis-e-Jornadas]] · [[03-Arquitetura/Seguranca-e-RBAC]] |
| Experiência e identidade HelpUS | [[02-Experiencia/Design-System]] · [[02-Experiencia/Acessibilidade-e-DUA]] |
| Internacionalização | [[02-Experiencia/Internacionalizacao]] |
| Módulos do sistema | [[04-Modulos/Indice]] |
| Dados e integrações | [[03-Arquitetura/Visao-Tecnica]] · [[03-Arquitetura/Modelo-de-Dados]] · [[03-Arquitetura/API-e-Contratos]] |
| Segurança e privacidade infantil | [[05-Seguranca/Privacidade-e-LGPD]] · [[05-Seguranca/Threat-Model]] |
| Build, CI e Vercel | [[06-Operacao/Ambientes-e-Deploy]] · [[06-Operacao/Testes-e-Homologacao]] |
| Planejamento e decisões | [[07-Governanca/Roadmap-e-Pendencias]] · [[07-Governanca/ADRs]] |
| Handoff para Antigravity | [[06-Operacao/Handoff-Antigravity]] |

## Documentos de legado preservados

[[ARCHITECTURE-AND-SAFETY]] · [[SINEA-ALIGNMENT-PUBLIC]] · [[SECURE-DEPLOYMENT-GATES]] · [[ANTIGRAVITY-HANDOFF]] · [[ANTIGRAVITY-HANDOFF-P1]]

## Convenções do cofre
- Wikilinks `[[Pasta/Arquivo]]`; Markdown padrão, frontmatter YAML, tarefas `- [ ]`.
- Mermaid para arquitetura, sequência e jornadas; Obsidian renderiza nativamente.
- Revisões de decisões em [[07-Governanca/ADRs]] e controle de alterações por Git.
- Estados rigorosos: **implementado**, **demonstrativo**, **em desenvolvimento**, **bloqueado**. Nunca confundir prova unitária com homologação operacional.
- Português é o idioma editorial base da documentação; a interface final traduz tudo nos três idiomas.
