# SINEA — Handoff P1 para Antigravity (01/11/2026)

**GitHub:** HelpUSA/autista
**PR de trabalho:** #12, branch feat/sinea-p1-secure-foundation-20261101
**main:** d77990590a768ed558c02809ee620b64f1bffe61 (demonstração pública).
**Mudanças em produção:** nenhuma nesta etapa.
**PDF do cliente:** confidencial e mantido apenas em ambiente autorizado; nunca publicar em repositório público.

## Entregas nesta PR
- Auditoria npm em CI com bloqueio de vulnerabilidades altas/críticas de runtime.
- Novas regras pedagógicas: rascunho, revisão, assinatura em dois profissionais,
  versionamento de PEI/PDI/PAEE e evidência observável avaliada pelo docente.
- Canto da Calma como acolhimento, com relatórios não clínicos e revisão humana.
- Métricas agregadas com supressão de grupos pequenos e de total dedutível.
- Transferência intra-rede com aprovação pela escola destinatária e trilha de eventos.
- Licenças editoriais, mapeamento curricular humano e planejamento independente sem aluno.
- Guardrails preliminares de IA: somente contexto pedagógico permitido e resposta com
  fontes/revisão humana. **Ainda não existe serviço de IA ou RAG**.
- API Node experimental com JWKS/OIDC validado via biblioteca jose, exigir MFA para
  consulta nominal e busca de vínculos exclusivamente do banco; gravação desabilitada.
- PostgreSQL migrations 002 e 003: escopo leitura RLS e mais entidades sem grants.
- Motor mobile de outbox criptografada com testes; não existe criptografia real implementada.
- Simulação web de revisão de planos, sem persistência ou dados reais.

## Gates locais: Antigravity
1. `git status` + `git fetch --all`, revisar HEAD e diferenças, não descartar alterações locais.
2. Na branch PR #12: `npm ci && npm test && npm run test:mobile-domain && npm run build`.
3. Em `server/`: `npm install`, `npm test`, `npm audit --omit=dev`;
   gerar `package-lock.json` e encaminhar commit revisado para builds reprodutíveis.
4. PostgreSQL 16 local isolado: rodar migrations 001→002→003; executar
   `database/tests/verify_rls.sql`, `verify_tenant_isolation.sql` e
   `verify_extended_schema.sql`. Apenas dados totalmente sintéticos.
5. Atualizar Vite/esbuild em branch separada, pois `npm audit` detectou
   Vite alta e esbuild moderada em dependências de desenvolvimento.
   Preservar lockfile e conferir React/Vite, build, navegador, acessibilidade e segurança.
6. Executar `mobile/` em emulador Android e iOS. Validar versões Expo e dependências
   com lockfile, acessibilidade nativa, VoiceOver/TalkBack. Não habilitar armazenamento real.
7. Revisão E2E: navegação, pranchas de comunicação, Canto da Calma,
   visualização de planos e registro desativado; layout conforme briefing cliente.
8. Verificar HTTPS e DNS efetivo de `autista.helpusbr.com`, Vercel, Cloudflare,
   TLS e logs sem dados sensíveis. Não publicar PR #12 automaticamente.
9. Planejar cloud e storage em região Brasil, MFA, logs append-only em serviço externo,
   DPA/RIPD, controlador/operador, recuperação de backup, RPO/RTO, pentest e WCAG.
10. Recomendação: migrar GitHub público para privado após aprovação de titularidade,
    contratos e acessos. Não armazenar documentos da editora ou dados de alunos nele.

## Bloqueios de produção real
- API ainda fechada a operações de gravação, sem RLS de escrita;
- frontend não conectado à API; ambiente de homologação/produção separado;
- app iOS/Android sem storage criptografado, PIN/biometria, sincronização real;
- sem documentos clínicos em storage privado, assinatura e cadeia de auditoria;
- sem auditoria externa, RIPD/DPA concluídos, residência de dados e pentest;
- sem agente RAG e curadoria validada da fase 2;
- sem aceite formal da Evoluce.

**Retornar:** ACK, commits, status dos gates, logs sanitizados, evidências de UX,
riscos, DNS e próxima ordem proposta, preservando main.
