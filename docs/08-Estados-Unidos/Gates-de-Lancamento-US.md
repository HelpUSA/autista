---
title: "Gates de lançamento US"
project: SINEA
type: release-gates
category: "08-Estados-Unidos"
status: proposed
updated: 2026-11-02
tags: [sinea, us, gate, amazon, security, privacy]
---

# Gates GO/NO-GO — Lançamento nos EUA

## P0 — O que já existe

| Item | Evidência no repositório | Condição |
|---|---|---|
| Web responsiva PT/EN/ES | `src/sinea/SineaAppV2.jsx`, `i18n.js` | DEMO |
| Expo mobile trilíngue | `mobile/App.jsx`, `mobile/src/i18n.js` | DEMO |
| Atividades e rotina visual | `mobile/App.jsx` e `src/activities/` | DEMO |
| Fire Tablet independente | `mobile/fire/` (30 atividades/5 temas, CAA, rotina em EN/PT/ES) | **Teste interno; sem APK assinado ou publicação** |
| Backend OIDC/RLS | `server/`, `database/migrations/` | NÃO implantado para uso real; escrita bloqueada |
| Offline mobile | `mobile/src/offlineEngine.mjs` | Contrato de fila; criptografia nativa não implementada |
| Lojas / Amazon | Sem submissão confirmada | PENDENTE |
| Direitos de ativos | Logo HelpUS em `mobile/assets/helpus-logo.jpg` | Verificar autorização de uso final |

## P0 — Primeira edição Amazon Fire
- [ ] Product scope aprovado: apenas conteúdos e atividades, sem prontuário, sem login infantil, sem fotos, sem chat, sem coleta de dados pessoais.
- [ ] Revisão COPPA/Amazon Child-Directed App Policy e privacidade com advogado competente.
- [ ] Confirmação técnica de zero coleta/transmissão de informações e de SDKs/telemetria.
- [x] EN-US padrão em app Fire isolado, PT-BR e ES-ES para os textos atualmente presentes; testes automatizados de paridade. **Voz, revisão editorial, loja, suporte e política completos seguem pendentes**.
- [ ] Conteúdo editorial original/licenciado, sem material confidencial no GitHub público.
- [x] Edição de teste separada em código, com 30 atividades, cartões CAA e rotina visual, sem API/login incorporados.
- [ ] Teste de APK real em Fire físico, incluindo garantia de que SDK não faz tráfego de rede.
- [x] Perfis de build interno e package ID de **preview** definidos em `mobile/fire/app.json`/`eas.json`.
- [ ] Identificador final, assinatura segura, APK/AAB reproduzível, notas de versão e atualização.
- [ ] Conta Amazon Developer HelpUS LLC, metadados e classificação infantil corretos.
- [ ] Capturas genuínas em três idiomas, termos e política pública, contatos de suporte.
- [ ] Execução de checklist Amazon, relatórios de testes e aprovação formal de release.

## P1 — SaaS para escolas, distritos e rede (não bloquear publicação do app offline)
- [ ] Segurança e persistência RLS/grants + fluxos de dados com identidades reais.
- [ ] IEP / 504 Plans e terminologia americana revisados por especialistas.
- [ ] FERPA e COPPA por modalidade/idade, contratos institucionais, direitos parentais, políticas estaduais.
- [ ] Ambiente EUA, backup/restore, monitoramento, retenção, auditoria, DPA, gestão de incidentes.
- [ ] Billing por contrato escolar, medição de licenças em servidor, acesso por tenant/seat.
- [ ] AWS Marketplace vendedor e integração comercial, com testes de sandbox, se selecionado.
- [ ] Auditoria independente de segurança, WCAG, desempenho e aceite institucional.

## P2 — Expansões
- [ ] Google Play / Apple App Store para dispositivos comuns.
- [ ] IA/RAG com fontes verificáveis e aprovação humana (sem diagnóstico ou prescrição).
- [ ] Módulos editoriais da Evoluce licenciados, com segregação de direitos e marca.
- [ ] Inclusão de novas localidades e conteúdo culturalmente revisado.

## Bloqueios absolutos
1. Nenhum menor real pode ser cadastrado em demo pública sem os controles exigidos e autorização apropriada.
2. Não apresentar o produto como diagnóstico/tratamento de autismo.
3. Não alegar distribuição Android universal pela Amazon Appstore.
4. Não atribuir selo COPPA/FERPA ou aprovação Amazon antes de evidência.
5. Não incorporar materiais de terceiros ou arquivos confidenciais sem autorização escrita.
6. Não usar compra externa para burlar Amazon IAP quando o conteúdo digital exige IAP.
7. Não promover branch não homologada apenas por funcionar no alias Vercel.

Relacionamentos: [[08-Estados-Unidos/Plano-Amazon-Appstore]], [[05-Seguranca/Threat-Model]], [[06-Operacao/Testes-e-Homologacao]].
