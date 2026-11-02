# SINEA Activities — edição independente para Amazon Fire Tablet

> **INTERNA / NÃO PUBLICAR.** Escopo isolado do SINEA Schools. Este diretório é um projeto Expo separado para evitar empacotar os módulos de prontuário, backend ou login da aplicação institucional.

## Características
- **EN-US padrão**, com **PT-BR** e **ES-ES** em todos os fluxos.
- 30 cartões de atividades em cinco temas: cores, formas, contagem, comunicação e sequência.
- Rotina visual editável na sessão (6 etapas), cartões de comunicação e pausa sempre disponível.
- Sem rankings, tempo limite, anúncios, compras internas ou contas infantis.
- Nenhum progresso é persistido; nenhuma resposta sai da memória de execução.
- O manifesto tenta bloquear permissões de rede, mídia, microfone e localização; **o APK final ainda precisa ser auditado**.

## Desenvolvimento
```bash
cd mobile/fire
npm install
npm test
npx expo start --offline
```
A compilação cloud com EAS exige credenciais Expo/Android válidas, login autorizado e deve ser executada pelo Antigravity após aprovação:
```bash
npx eas build --platform android --profile fire-internal
```

## Bloqueios P0
- [ ] Confirmar pacote definitivo (atualmente `com.helpus.sinea.activities.preview`).
- [ ] Executar `npx expo-doctor` e gerar `package-lock.json` reprodutível do projeto Fire.
- [ ] Inspecionar `AndroidManifest.xml` do APK real, assinar, verificar hashes/arquiteturas e comprovadamente **não** transmitir informações.
- [ ] Testar funcionamento offline e sem Google Play Services no tablet físico Fire.
- [ ] Revisão de conteúdo/experiência com AEE e usuários, inclusive legendas não discriminatórias.
- [ ] Revisão jurídica COPPA, Amazon Appstore, faixa etária, aviso de privacidade e direitos de imagem/marca.
- [ ] Capturas verdadeiras, idiomas e texto de listing revisados, preço confirmado e conta HelpUS LLC aprovada.
- [ ] Autorizar a submissão ao Amazon Developer Console explicitamente.

## NÃO FAZER
Não usar login/registro escolar, telemetria, SDK de terceiros não auditado, dados reais, fotos, áudio de estudantes, anúncios ou integração do prontuário nessa edição. Não usar o código da demo institucional como release infantil.

## Verificações automatizadas
`npm run test:fire` na raiz executa `mobile/fire/*.test.mjs` sem Expo. A CI testa as traduções, 30 cartões, comportamento local e bloqueios de permissões. Isso não substitui inspeção nativa nem hardware.
