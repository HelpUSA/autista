# SINEA API — serviço Node experimental (fechado por padrão)

## Propósito
Infraestrutura de API para registros educacionais, não publicada nem conectada à
demonstração do frontend. A inicialização exige configuração explícita:

- `SINEA_SERVER_ENABLED=true` (por padrão **desligado**);
- `SINEA_OIDC_ISSUER`, `SINEA_OIDC_AUDIENCE`, `SINEA_OIDC_JWKS_URL` (JWKS HTTPS);
- `SINEA_DATABASE_URL` de PostgreSQL com papel **NÃO-superusuário**, sem BYPASSRLS;
- `SINEA_DATABASE_CA` para TLS do banco em produção;
- `SINEA_BIND_HOST` (padrão 127.0.0.1), `PORT` (padrão 4000).

O JWT deve ter assinatura válida, issuer, audience, exp, iat, subject e amr
com segundo fator. As permissões são determinadas por membership e vínculo
carregados no banco, **nunca** por role enviado no token/request.
Todas as respostas têm `Cache-Control: no-store`.

## Endpoints implementados
- `GET /healthz`: disponibilidade do processo, **não readiness do banco**.
- `GET /v1/students/:uuid/plans`: leitura nominal com bearer JWT + MFA +
  header de seleção de tenant UUID + RLS. A seleção de tenant NÃO dá permissão.
- `POST /v1/students/:uuid/daily-records` e
  `POST /v1/students/:uuid/calm-sessions`: retornam 503 e **não gravam**.

## Ainda necessário antes de deploy real
- Provisionar IdP real, MFA e sessão; armazenar secrets em vault.
- Completar políticas de GRANT/INSERT, versionamento, idempotência, auditoria
  imutável fora do DB, storage, criptografia e backup — após ameaça/pentest.
- Implementar controle de rate limit e WAF no gateway de entrada.
- Endpoint de prontuário, plano versionado e operações de administração sob ACL.
- Lockfile próprio do backend; homologar versões e npm audit no ambiente local.
- Testes E2E de sessão expirada, replay, revogação, cross-tenant e cross-school.
- Separar ambientes de desenvolvimento, homologação e produção em região Brasil.

**Nunca incluir laudos, CPFs, tokens ou dados reais nos testes, CI ou repositório.**
