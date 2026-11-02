---
title: "Comunicacao-Escola-Familia"
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

# Comunicação Escola–Família

## Componentes
1. Comunicados segmentados com confirmação de leitura.
2. Canais por tipo: equipe pedagógica, AEE, Secretaria escolar.
3. Agenda compartilhada: atendimentos, reunião de acompanhamento, prazos.
4. Formulários e autorizações com revisão e vínculo legal.
5. Notificações sem dados sensíveis; o conteúdo é acessado somente após login.
6. Resumo de diário revisado, separado do prontuário clínico.

## Referências
- ClipEscola: organização de agenda, comunicados e leitura.
- Agenda Edu: diário, atividades e rotina da família.
- ClassApp: canais e status de atendimento.
Essas referências não autorizam reprodução de código, imagens, textos ou marcas.

## Contrato de mensagem (planejado)
`tenant_id`, `channel_id`, `sender_subject`, `recipient_subject` e `student_id` **apenas quando vinculado e necessário**; timestamp de criação; status `draft/approved/delivered/read/archived`; `acknowledgment` com ator verificado; versão do texto aprovado; trilha de auditoria.

## Regras
- Família só pode ler mensagem relacionada ao dependente verificado.
- Leitura de mensagem e confirmação de leitura não são sinais clínicos ou comportamentais.
- Informações médicas e relatórios internos não entram em mensagens por padrão.
- E-mails/push devem ser genéricos, sem diagnóstico, nome de criança ou histórico.
- Canais possuem horário de resposta institucional e escalonamento, não são emergência clínica.
- Idempotência na entrega; evitar notificações duplicadas.

## Contratos e banco preparados
`src/domain/familyCommunication.js` implementa regras puras de criação, segunda aprovação, publicação e recibo idempotente mediante vínculo familiar verificado, com testes. `database/migrations/004_family_communications.sql` define tabelas e relacionamentos; **nenhuma permissão de acesso foi aberta**. A integração entre essas regras e as telas, com token real e sessão, continua bloqueada.

## Implementado na DEMO
`FamilyPage` mostra abas Comunicados, Canais, Calendário e Autorizações. Confirmar leitura altera apenas memória da sessão; não envia mensagem nem persiste.

## Gates
- [ ] Caixa de entrada real, serviço de entrega e registro de leitura com autenticação.
- [ ] Moderação e aprovação de mensagens por equipe responsável.
- [ ] Gestão de notificações e preferências com versões PT/EN/ES.
- [ ] Segurança de anexos, direito de acesso/correção, retenção e auditoria.
- [ ] Testes de responsáveis separados, guarda compartilhada e mudança de escola.
