---
title: "Estado-Git-e-Deploy"
project: SINEA
type: runbook
category: "06-Operacao"
status: maintained
updated: 2026-11-01
tags: [sinea, helpus, vercel, github, deployment]
---

# Estado de Git, deploy e rastreabilidade

> [!important] Regra de rastreabilidade
> **Alias Vercel e branch `main` são estados independentes.** Um deployment de Preview pode receber alias de domínio customizado sem que o commit correspondente tenha sido integrado ao ramo principal do GitHub. HTTP 200 e validação visual não comprovam merge de PR nem readiness para estudantes reais.

## Evidências recebidas do Antigravity
Em 01/11/2026, o executor local reportou que o domínio `https://autista.helpusbr.com/` e o espelho `https://autista-umber.vercel.app/` foram associados ao deployment Vercel `dpl_C7wjFSyoqNteZuhVTjE3DWVHQAJC`, antes acessível como Preview. O relatório informou HTTP 200, bundle `index-toF54Tza.js`, DNS Cloudflare, TLS Let's Encrypt e captura em Chrome headless. **Essas são evidências comunicadas pelo executor, não verificações independentes do ChatGPT.**

## Estado Git confirmado pelo conector
Na mesma data, `main` permanecia em `d77990590a768ed558c02809ee620b64f1bffe61`. As PRs [[../07-Governanca/Roadmap-e-Pendencias|#12 e #15]] permaneciam Draft/abertas: #12 introduz fundamentos da API e SQL; #15 inclui interface e documentação, baseada na #12. Deploy via alias NÃO modifica essas referências.

## Check obrigatório antes de promover
1. `git fetch --all --prune` e `git rev-parse origin/main`, registrando commit e horário UTC.
2. `git rev-parse origin/feat/sinea-family-i18n-helpus-obsidian-20261101`.
3. `vercel inspect <deployment-url>` ou API Vercel e coletar `gitSource.ref`, `gitSource.sha`, deployment ID, alias e horário, sem segredos.
4. Comparar deployment SHA com GitHub HEAD esperado. Se SHA divergir, registrar bloqueio.
5. Executar CI, navegação browser real e testes de segurança antes de nova promoção.
6. Rotular a versão atual como `DEMO_ONLY` e nunca autorizar dados infantis porque o alias foi corrigido.
7. Documentar rollback, URL anterior, impacto, janela e responsável pela promoção.

## Matriz
| Item | Fonte | Último relato |
|---|---|---|
| Git main | GitHub, conector | `d779905...` |
| PR #12 | GitHub, conector | Draft/aberta |
| PR #15 | GitHub, conector | Draft/aberta; em evolução |
| Produção `autista.helpusbr.com` | Antigravity/Vercel | Alias para `dpl_C7wjFSyoqNteZuhVTjE3DWVHQAJC` |
| SHA exato do deployment de produção | Vercel inspect | **Não apresentado**; verificar |
| Segurança com dados reais | Gates de aceite | **Não autorizada** |

Relacionamentos: [[06-Operacao/Ambientes-e-Deploy]], [[06-Operacao/Testes-e-Homologacao]], [[07-Governanca/Roadmap-e-Pendencias]].
