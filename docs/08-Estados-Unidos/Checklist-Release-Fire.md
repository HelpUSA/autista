---
title: "Checklist de release Fire Tablet"
project: SINEA
type: operational-checklist
category: "08-Estados-Unidos"
status: no-go
updated: 2026-11-02
tags: [sinea, amazon, appstore, android, testing, rollout]
---

# Checklist de release — SINEA Activities para Fire Tablet

**Branch de trabalho:** `feat/sinea-us-fire-offline-20261102` (PR #19, base PR #15).  
**Projeto nativo independente:** `mobile/fire/`.  
**Estado:** interno e fechado para submissão (`storeSubmissionAuthorized=false`).

## Gate A — Produto
- [x] Separação de código do SINEA Schools, sem importar login, telas institucionais ou API.
- [x] 30 exercícios em EN-US, PT-BR, ES-ES e três percursos locais (atividades, rotina, CAA).
- [x] Nenhuma persistência ou API de estudante implementada nesse escopo.
- [ ] Revisão de conteúdo com educador de educação inclusiva e público-alvo.
- [ ] Avaliar acessibilidade, pictogramas e orientação de rotina por usuários reais.
- [ ] Completar instruções de ajuda, suporte e conteúdo suficiente para venda.

## Gate B — Binário reprodutível
- [ ] `cd mobile/fire && npm install && npm test`; adicionar `package-lock.json` e depois `npm ci`.
- [ ] `npx expo-doctor` sem divergência de versões.
- [ ] `npx expo config --type public`: validar `name`, `package`, `versionCode`, locales, updates e permissões.
- [ ] Compilação interna `npx eas build --platform android --profile fire-internal` com conta autorizada.
- [ ] Baixar APK interno, registrar URL, tamanho, SHA-256, assinatura e versionCode em laudo **sem dados secretos**.
- [ ] No APK real: `aapt dump badging <APK>` e `aapt dump permissions <APK>` (ou `apkanalyzer manifest permissions`).
- [ ] Confirmar que `android.permission.INTERNET` e permissões sensíveis não constam no Manifest final; qualquer exceção exige análise formal.
- [ ] Identificar bibliotecas e SDKs realmente embarcados, licenças, CVEs e tráfego; não basta procurar `fetch` no JavaScript.
- [ ] Verificar ABI, minSdk, targetSdk, Fire OS e disponibilidade no console antes de selecionar dispositivos.
- [ ] Validar hash da logo e direitos de uso.
- [ ] Definir package ID definitivo — **não publicar** o sufixo `.preview` como produto.

## Gate C — Hardware real
- [ ] Fire HD 8 e Fire HD 10 compatíveis, ou justificar equivalentes efetivamente disponíveis.
- [ ] Instalação e primeira execução com internet desabilitada.
- [ ] Fechar/reabrir sem erro ou persistência inesperada.
- [ ] Troca de idioma EN→PT→ES em todas as telas, texto longo, acessibilidade, leitores de tela.
- [ ] Rotina: marcar/desmarcar/reiniciar todas as seis etapas, sem gravação.
- [ ] CAA: seis cartões sem áudio/câmera/rede.
- [ ] Exercícios: 30 itens, três alternativas por pergunta, respostas corretas e incorretas, pausa e reinício.
- [ ] Tela 7–11 polegadas, rotação, fonte ampliada e contraste.
- [ ] Memória baixa, atualizações e remoção/reinstalação.
- [ ] Capturas autênticas e logs sanitizados anexados à issue #17.

## Gate D — Privacidade, legal e Amazon
- [ ] COPPA (quando aplicável), Child Directed Apps Amazon, target age/rating e política de dados revisados por assessor jurídico dos EUA.
- [ ] Verificar com teste de rede + SDKs o escopo efetivo de coleta, serviços de terceiros, analytics e crash reports.
- [ ] Política de privacidade pública e termos finais, contato real de suporte, processo de reclamação e exclusão.
- [ ] Titularidade do código/tecnologia, direitos dos conteúdos, marca HelpUS e licenciamento revisados.
- [ ] HelpUS LLC: Amazon Developer validado, tax profile e dados bancários, exclusivamente por responsável autorizado.
- [ ] Escolher modelo (download pago ou gratuito) e confirmar a política de Amazon IAP para compras futuras.
- [ ] Nome, descrição, fotos reais em idiomas disponíveis, screenshots e localização conferidos.
- [ ] Master autorizar explicitamente submissão; submeter e registrar ID de revisão.
- [ ] Após aprovação Amazon, monitorar avaliações, problemas e versionamento de atualizações.

## GO/NO-GO
**NO-GO** até concluir todos os gates de build/hardware/legal e autorização comercial. A passagem nos testes Node e no GitHub Actions não substitui essas etapas.

## Evidências esperadas do Antigravity
ACK na conversa `fde722e0-8605-4bfd-8b30-5be3d281f489`; git SHA, testes Node, logs Expo Doctor, ID EAS, SHA-256 do APK, Manifest de permissões, dispositivos Fire e Fire OS, captura em três idiomas, checklist jurídico e decisão GO/NO-GO.

Relacionamentos: [[08-Estados-Unidos/Produto-Fire-Activities]], [[08-Estados-Unidos/Listagem-Amazon-Trilingue]], [[06-Operacao/Handoff-Antigravity]].

## CI adicional — Expo/Metro antes do APK

A PR #20 inclui `.github/workflows/fire-native-preflight.yml`, acionado por mudanças em `mobile/fire/`. Ele resolve dependências Expo, roda `npm test`, `expo-doctor`, e gera **somente** um bundle JS Android por `expo export`, além de arquivar um candidato `package-lock.json` e a configuração Expo pública. Esse passo valida a compilação de JavaScript mobile em runner Linux, sem criar ou assinar APK e sem atestar o Manifest mesclado. Se falhar, não liberar publicação; corrigir os problemas de SDK e reexecutar. O lockfile candidato precisa ser revisado e commitado antes de builds reproduzíveis.
