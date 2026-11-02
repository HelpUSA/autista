---
title: "Plano Amazon Appstore — EUA"
project: SINEA
type: launch-plan
category: "08-Estados-Unidos"
status: proposed
updated: 2026-11-02
tags: [sinea, us, amazon, fire-tablet, coppa, tri-language]
---

# Plano de lançamento Amazon — SINEA Estados Unidos

> [!danger] Lançamento não autorizado
> A versão disponível é DEMO_ONLY, sem permissão para coletar dados de crianças. Nenhum APK/AAB assinado, conta Amazon Developer homologada ou aceitação da Amazon foi confirmado. Este é um plano de execução e aceite, não anúncio de produto pronto.

## Escopo e canais

| Produto | Público | Canal | Modelo |
|---|---|---|---|
| SINEA Activities (provisório) | Família, aluno, educador | Amazon Appstore **para Fire Tablet** | Aplicativo pago uma única vez (hipótese a testar); sem conta, IAP, anúncios ou dados pessoais de menores |
| SINEA Schools | Escolas/distritos | SaaS web, contratação direta; AWS Marketplace em etapa posterior | Contrato institucional por aluno/ano, com elegibilidade e faturamento do marketplace quando implementados |
| SINEA Mobile, Android/iPhone | Escolas/famílias | Google Play e Apple App Store em expansão | App complementar; **não** distribuído a smartphones comuns pela Amazon Appstore |

> [!important] Amazon Appstore em 2026
> Amazon suspendeu suporte para celulares Android que **não** são dispositivos Amazon em 20/08/2025. A Amazon Appstore permanece em Fire Tablets e Fire TV. Para o SINEA educacional, priorizar somente Fire Tablets; Fire TV não agrega valor ao escopo inicial. A Appstore oferece conta de desenvolvedor sem taxa de inscrição.

## Track A — Fire Tablet offline sem coleta infantil (primeira opção)

- [ ] Definir o pacote fechado de conteúdo educacional, público-alvo, limites de marketing e faixa etária real (não marcar somente adultos para escapar de COPPA).
- [ ] Separar páginas funcionais de aluno (atividades, comunicação por cartões e rotina visual) das áreas institucionais de prontuário, família, assinatura e relatórios.
- [ ] Garantir **zero login, zero identificador pessoal coletado/transmitido, zero foto/áudio enviados, zero publicidade e zero analytics de crianças** nesta edição; confirmar por auditoria de SDKs e tráfego, não somente pelo código da interface.
- [ ] Possibilidade de progresso estritamente local e opcional: só depois de revisão jurídica e ameaça; nenhum identificador persistente enviado.
- [ ] Garantir conteúdo com utilidade real e diversidade suficiente para não ser rejeitado como demonstração de funcionalidade mínima.
- [ ] Tradução total de navegação, enunciados, instruções, voz, mensagens de erro, ajuda, política e marketing em **en-US / pt-BR / es-ES**; inglês padrão ao distribuir nos EUA, com escolha preservada.
- [ ] Rever acessibilidade: controles de toque, foco/teclado, tipografia, contraste, não depender só de cor, uso sem cronômetro e pausas; ensaios com especialistas.
- [ ] Converter o projeto `mobile/` (Expo 54, React Native 0.81, `com.helpus.sineademo`, `DEMO_ONLY`) para identidade de release revisada e package ID **definitivo, ainda a escolher**; não publicar `sineademo` como produto definitivo.
- [ ] Definir e verificar `minSdkVersion`, `targetSdkVersion`, ABI 64 bits e compatibilidade Fire OS 7/8; testar em hardware Fire HD 8 / HD 10, incluindo tablet sem Google Mobile Services.
- [ ] Criar processo reprodutível de compilação e assinatura `APK` ou `AAB`, gerenciar chaves, backups de assinatura, versionCode e package ID em cofre.
- [ ] Testar primeira instalação, inicialização, reinicialização, atualização, modo avião, pouca memória, desempenho e tela pequena/grande, usando **dispositivo Fire físico**.
- [ ] Cadastrar Amazon Developer como HelpUS LLC (dados fiscais, titularidade e beneficiário), após aprovação administrativa do Master.
- [ ] Preparar título, descrição, screenshots, ícones, contato de suporte, e-mail, política de privacidade pública e formulário de dados / classificação infantil em Amazon Appstore.
- [ ] Submeter binário apenas quando testes, avaliação COPPA, conteúdo, direitos e Amazon pre-submission checklist estiverem aprovados.
- [ ] Verificar termos de monetização: se houver conteúdos digitais vendidos dentro do aplicativo, usar Amazon IAP quando aplicável; o modelo inicial de **pagamento único pelo download** evita integração de IAP.
- [ ] Após aprovação Amazon: publicar, acompanhar rejeições/erros, manter política de atualização e remover dados fictícios que se assemelhem a dados reais se constarem em capturas.

**Critérios GO:** 3 idiomas e conteúdo revisados, sem coleta infantil comprovada, app Fire estável em dispositivos reais, privacidade e classificação aprovadas, direitos de marca/conteúdo documentados, conta publicadora verificada, loja aprovou.

## Track B — SaaS institucional USA (posterior e independente do Track A)

- [ ] Concluir backend de verdade (IdP OIDC, tenant/RLS, perfis e guardian verified, CRUD auditado, políticas de escrita e logs imutáveis).
- [ ] Modelar distritos, escolas, alunos, professores, responsáveis e transferência escolar conforme requisitos locais; comprovação de vínculo, revogação, SSO/MFA.
- [ ] Traduzir e **adaptar conceitualmente** PEI/PDI/PAEE ao quadro legal estadunidense: IEP sob IDEA e Section 504 Plans; revisão pedagógica e jurídica dos EUA, sem traduções literais enganadoras.
- [ ] Implementar diário, plano, comunicação familiar, agenda, evidências com rubricas, relatórios acessíveis e import/export, todos com controle de acesso verificado.
- [ ] Projetar residência/região de dados para clientes EUA com segregação de ambientes e contratos; nunca migrar dados brasileiros de clientes sem base jurídica.
- [ ] Preparar e validar COPPA, FERPA, leis estaduais aplicáveis, política e avisos, privacy by design, retenção/exclusão, acesso dos pais, segurança e resposta a incidentes.
- [ ] Testes de penetração, integridade de backups, recuperação, acessibilidade, performance e suporte institucional.
- [ ] Integração SaaS/contrato AWS Marketplace **somente se escolhermos AWS Marketplace**: cadastro vendedor HelpUS LLC (W-9, conta bancária elegível), infraestrutura SaaS compatível, registration/fulfillment URL, Entitlement Service, assinaturas/contratos/medição conforme modelo, sandbox de compra, EULA PDF e suporte.
- [ ] Não lançar produto SaaS incompleto no AWS Marketplace; o marketplace exige solução produtiva e suporte.
- [ ] Comercialização B2B em USD por estudante/ano com pacotes e compromisso mínimo poderá ser testada independentemente da Appstore.

## Alocação de execução

**ChatGPT via GitHub:** arquitetura, isolamento de pacotes, contratos/testes, i18n, conteúdo da UI, documentação Obsidian, CI, especificações de API, gestão dos riscos e issues.

**Antigravity (local):** contas/certificados, compilação binária, assinatura, testes em dispositivo Fire, análise de SDKs/tráfego, builds Windows, Vercel/AWS, submissão nas lojas e coleta de evidências.

**Master / HelpUS LLC:** validação de titularidade de software e marca, conta Amazon Developer, bancária/fiscal, seleção de modelo e preço, aprovação de marketing/privacidade e autorização de publicação.

## Fontes oficiais verificadas em 02/11/2026

- Amazon Appstore e Android convencional: https://developer.amazon.com/apps-and-games/blogs/2025/02/upcoming-changes-to-amazon-appstore-for-android-devices-and-coins-program
- Registro e submissão: https://developer.amazon.com/docs/app-submission/submitting-apps-to-amazon-appstore.html
- Compatibilidade Fire OS: https://developer.amazon.com/docs/app-submission/device-filtering-and-compatibility.html
- Localização: https://www.developer.amazon.com/docs/app-submission/distribute-your-app-internationally.html
- Política para crianças e dados: https://developer.amazon.com/docs/app-submission/target-app.html
- FTC COPPA: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- FERPA: https://studentprivacy.ed.gov/faq/who-school-official-under-ferpa
- IDEA IEP: https://sites.ed.gov/idea/regs/b/d/300.324
- AWS SaaS: https://docs.aws.amazon.com/marketplace/latest/userguide/saas-create-product.html
- AWS Seller: https://docs.aws.amazon.com/marketplace/latest/userguide/user-guide-for-sellers.html

Relacionamentos: [[08-Estados-Unidos/Gates-de-Lancamento-US]], [[08-Estados-Unidos/Distribuicao-e-Monetizacao]], [[03-Arquitetura/Visao-Tecnica]], [[05-Seguranca/Privacidade-e-LGPD]], [[07-Governanca/Roadmap-e-Pendencias]].
