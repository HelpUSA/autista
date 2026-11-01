# SINEA — Segurança e persistência: pré-condições para uso de dados reais

## Status
As migrações 001–003 agora fornecem estrutura institucional, documental,
editorial, offline e de IA, com **RLS forçada**. A migração 002 adiciona políticas
de **leitura mínima** por instituição, escola, papel e vínculo profissional,
destinadas a um papel PostgreSQL `sinea_api` sem LOGIN. As tabelas adicionais
da migração 003 continuam sem permissões. **Não existem grants de escrita para
a API, nem credenciais de execução configuradas aqui.** A API Node exige OIDC,
MFA para registros nominais e está com gravação DESABILITADA. A interface web
ainda usa somente dados fictícios. Nada disso autoriza dados sensíveis reais.

## Implementar antes de liberar produção
1. Instalar identidade corporativa (OIDC) com autenticação individual, MFA para
   Secretaria e acesso a laudos, bloqueio/rate-limit, expiração de sessão e revogação.
2. Criar autorizações do backend por **papel E vínculo aluno/profissional/escola**
   e controles de menor privilégio. Secretaria tem apenas agregados por padrão;
   administrador da Evoluce e especialista não têm acesso nominal.
3. Políticas RLS `USING` e `WITH CHECK` com contexto validado pelo servidor.
   **Não confiar em `tenant_id` ou `actor_id` informados pelo navegador**;
   não oferecer acesso direto ao PostgreSQL. Executar testes de penetração de
   permissão cruzada antes de ativar grants para aplicação.
4. Armazenar documentos no Brasil em storage PRIVADO com cifragem reforçada,
   chave gerenciada e URL assinada temporária; emitir log imutável em serviço
   externo para visualizar, baixar e imprimir, com marca-d'água.
5. Implementar migrações CI, rollback controlado, backup criptografado diário
   (retenção ≥ 30 dias) e teste de restauração, RPO/RTO contratados.
6. Sincronização offline em app nativo usando armazenamento cifrado por
   aparelho, fila idempotente, versionamento e **conflitos revisados**.
7. Retenção/descarte, portabilidade, atendimentos de solicitações de titulares,
   DPA, suboperadores, RIPD e plano de incidentes.
8. AFERIR: dados em data center Brasil, 99,5% mensal, até 2s/4G,
   50–50.000 estudantes, WCAG 2.1 AA, acessibilidade dos apps.
9. Pentest independente e avaliação móvel OWASP MASVS antes do piloto.
10. Integração IA (segunda fase): motor RAG com citações, curadoria
    psicopedagógica, pseudonimização, restrição contratual de treinamento e
    revisão humana. Nenhum dado médico integral nos prompts.

## Custos, propriedade e contratação
Definir proposta comercial por faixas de 1.000/10.000/50.000 estudantes,
licença individual por estudante, titularidade contratual, portabilidade de
dados e código, SLA e materiais de edital.
O fornecimento de documentação da Evoluce a um repositório público requer
autorização contratual; **não fazer upload do briefing confidencial**.

## Funcionalidades web atuais
Os componentes criados são **demonstrações com personagens fictícios**.
Registro diário e arquivo clínico permanecem bloqueados. Canto da Calma
possui uma simulação local em memória, sem persistência. Não representa
liberação para tratamento de dados reais.

## Fonte
Análise interna do briefing SINEA, versão 1 de 01/11/2026,
sem anexar ao repositório público o documento confidencial do cliente.
