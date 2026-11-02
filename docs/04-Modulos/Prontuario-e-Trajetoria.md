---
title: "Prontuario-e-Trajetoria"
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

# Prontuário digital e trajetória escolar

## Objetivo
Visão longitudinal do estudante em escola e rede, com histórico de transferências, planos, atendimentos e documentos. Registros originais permanecem vinculados à autoria e instituição.

## Prontuário
Identificação mínima, turma/unidade, apoios e preferências pedagógicas, objetivos, atendimentos, documentos, histórico de acompanhamento e revisões. Dados clínicos em compartimento separado, com papéis restritos.

## Transferência
`studentTransfer.js` representa solicitação da escola origem, aprovação pelo destinatário e conclusão com trilha. Transferência intra-rede deve conservar mesmo `student_id`; entre redes exige acordo, base jurídica, escopo e auditoria específicos.

## Documentos
Somente metadados em SQL; objetos no Brasil, cifrados, com URL assinada temporária, versionamento, antivírus, marca d'água e registro de consulta/download.

## DEMO
Mostra personagens fictícios, tags, apoio, metas ilustrativas e linha do tempo; não serve PDF real.

## Testes de aceite
Vínculo revogado não lê prontuário, AEE não lê outro estudante, regente não lê documentos clínicos, Secretaria só agregados, transferência não duplica histórico, download privado expira e é auditado.
