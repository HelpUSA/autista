---
title: "ADRs"
project: SINEA
type: documentation
category: "07-Governanca"
status: maintained
updated: 2026-11-01
tags:
  - sinea
  - helpus
  - evoluce
---

# Architecture Decision Records (ADRs)

## ADR-001 · Produto único SINEA
**Estado:** decidido. InclusivaTEA/Autista foi nome inicial; SINEA é o produto oficial, abrangendo necessidades além de TEA. Domínio provisório `autista.helpusbr.com`.

## ADR-002 · Simulação sem dados reais
**Estado:** decidido. Sem backend seguro aprovado, telas permanecem fictícias e ações de comunicação não têm envio, armazenamento nem autorização real.

## ADR-003 · Acesso restrito por vínculo
**Estado:** aceito para implementação. Backend determina role e vínculo via banco; Secretaria recebe agregados; documentos clínicos só para escopos aprovados.

## ADR-004 · Idiomas
**Estado:** implementado na UI web V2. Padrão `pt-BR`, com `en-US` e `es-ES`, dicionário centralizado e seletor persistente no cabeçalho. Mobile/PDF/e-mail ainda pendentes.

## ADR-005 · Identidade HelpUS + Evoluce
**Estado:** provisório. Usar azul-marinho/turquesa e logo HelpUS já copiada dos ativos do repositório HelpUSA/helpus-ai para web/mobile; aprovação contratual de marca e validação visual são pendentes.

## ADR-006 · Comunicação escola–família
**Estado:** proposta aprovada pelo usuário para implementação. Separar diário técnico e resumo familiar revisado, comunicados, canais, calendário, autorização e confirmação de leitura.

## ADR-007 · Offline criptografado
**Estado:** contrato, não implementado nativamente. Motor de outbox falha fechado sem adaptador cifrado; SQLCipher/Keychain/Keystore e aparelho real pendentes.

## ADR-008 · Repositório público
**Estado:** risco conhecido. Referências públicas de implementação sem briefing confidencial; revisão contratual para possível conversão a privado pendente.

## ADR-009 · IA pedagógica
**Estado:** fase 2. Sugestão com RAG e fontes + aprovação humana, sem diagnóstico ou prescrição.

## Processo
Toda alteração de decisão requer proposta, impacto em segurança e compatibilidade, aprovação técnica e atualização da matriz de rastreabilidade.
