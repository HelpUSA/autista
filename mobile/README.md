# SINEA Mobile — esqueleto Expo (não homologado)

Este diretório inicia um app **independente para Android/iOS** com:
- agenda profissional fictícia, rotina visual, pranchas ilustrativas de CAA,
  Canto da Calma demonstrativo, duas questões interativas e painel agregado;
- identidade visual SINEA e ausência deliberada de dados reais;
- nenhum acesso à API ou banco, nenhuma persistência offline de dados sensíveis.

## Execução local
```bash
cd mobile
npm install
npm run doctor
npm start
```
Validar compatibilidade exata de Expo/React Native e gerar lockfile no ambiente
do Antigravity antes de homologar. Não publicar este esqueleto nas lojas.

## Gates antes de integrar dados reais
1. App sandbox com autenticação segura e expiração; PIN ou biometria.
2. Armazenamento offline **criptografado** (SQLCipher ou equivalente avaliado),
   chaves no Android Keystore/iOS Keychain; armazenamento protegido em backups.
3. Fila de operações idempotentes, controle de versão e resolução supervisionada
   de conflitos, testes de perda de conexão e reinício.
4. Captura de imagens sem salvar na galeria; uploads privados; remoção remota.
5. Sem informação sensível em notificações ou logs; avaliação OWASP MASVS.
6. Auditoria WCAG 2.1 AA e práticas de acessibilidade nativas iOS/Android.
7. Ambientes produção/homologação/desenvolvimento separados, infraestrutura no Brasil.

# SINEA Mobile — Gates para sincronização offline

O código de `mobile/src/offlineEngine.mjs` implementa **apenas o motor puro da fila**.
Ele rejeita a criação de uma operação se o adaptador de storage criptografado
não confirmar prontidão. O prefixo `enc:v1:` é um marcador de contrato, **não
é criptografia**: a cifragem real deve acontecer no módulo nativo.

Antes de habilitar dados reais:
- Validar Android Keystore e iOS Keychain/biometria/PIN.
- Integrar SQLCipher e chaves com ciclo de vida seguro; não usar AsyncStorage em claro.
- Testar rede instável, conflitos, retransmissão, idempotência, expiração de sessão,
  cancelamento de conta, dispositivo perdido e remoção remota.
- Fazer revisão de segurança móvel e pen test, armazenamento no Brasil e contratos LGPD.
- Não usar esse protótipo Expo como aplicação de produção ou prova de compliance.

## Internacionalização do protótipo Expo
`mobile/App.jsx` possui seletor PT/EN/ES com o mesmo dicionário de `src/sinea/i18n.js`, mantido em `mobile/src/i18n.js` e verificado por teste de paridade `mobile/src/i18n.test.mjs`. Não foi homologado em aparelhos reais; traduzir serviços, notificações e acessibilidade nativa antes de produção.
