# InclusivaTEA — Decisões de produto e arquitetura

## Estado em 2026-11-01
- A branch main é uma **demonstração pública**, sem autenticação, banco de dados ou segregação por escola.
- O módulo interativo trabalha apenas com conteúdo fictício e estado em memória. **Não inserir dados reais de estudantes.**
- O domínio planejado é `autista.helpusbr.com`. Implantação e DNS são de responsabilidade do Antigravity.
- O nome da plataforma está sujeito à confirmação comercial/marcária.

## Objetivo
Produto B2B/B2B2C para editora, escolas e famílias, com materiais didáticos adaptáveis para estudantes com diferentes necessidades, incluindo estudantes autistas. A equipe humana define objetivos pedagógicos.

## DUA (CAST 3.0)
1. Engajamento: escolha de atividade, autonomia de pausa, ausência de cronômetro/ranqueamento.
2. Representação: texto, símbolos ilustrativos, leitura sob demanda; revisar pertinência cultural e semântica dos símbolos.
3. Ação/expressão: opção por toque, teclado, CAA e, futuramente, outras respostas acessíveis.

## PEI, PAEE e BNCC
- Estudo de caso identifica **barreiras, potencialidades, apoios e estratégias**.
- Documentos PEI/PAEE: versão, responsável, data, vigência, metas observáveis, recursos, evidências, revisão, aprovação.
- Não inferir diagnóstico, capacidade, estado emocional ou apoio necessário com IA.
- BNCC: guardar código + edição/versão + componente + etapa + justificativa pedagógica **validada pela editora**; nunca inventar códigos nem alegar alinhamento automático.
- Atividades podem sugerir evidências de aprendizagem, nunca substituir interpretação do educador.

## Entidades propostas para o backend
- tenants (escolas/redes), memberships (usuário↔instituição↔papel), invitations
- students (identidade restrita), guardianships (vínculos e permissões)
- case_studies, pei_plans, paee_plans, plan_goals, accommodations
- publisher_materials, licensed_materials, activity_definitions, assignments
- activity_sessions, observations, evidence_attachments
- audit_events, retention_policies, consent_or_legal_basis_records

Chaves mínimas: UUID por entidade, `tenant_id` em toda entidade institucional,
`created_at`, `updated_at`, `created_by`; planos versionados e eventos auditáveis.
`activity_sessions` não devem armazenar classificação clínica, inferências de emoção ou observações livres por padrão.

## Contratos de autorização (a implementar antes de dados reais)
- superadmin: configuração da plataforma (acesso ao conteúdo estudantil apenas sob procedimento auditável).
- admin_escola: usuários e turmas do próprio tenant.
- professor / AEE: estudantes vinculados e planos autorizados.
- familia: somente dependentes verificados e informações cuja divulgação tenha base legal.
- aluno: próprio conteúdo autorizado, sem acesso a outros perfis.
- editora: catálogo e licenciamento; **sem acesso a registros pessoais do estudante por padrão**.
- apoio_externo: acesso por escopo e prazo explícitos, com trilha de auditoria.

Backend deve aplicar autorização no servidor e RLS onde viável; esconder botões na UI não é segurança. Testar acesso cruzado entre tenants e papéis.

## Regras de segurança antes de produção real
1. Identificação institucional e contrato/controladoria; análise jurídica LGPD e ECA Digital.
2. Autenticação, MFA para administradores, sessão com expiração e controle de papéis.
3. RLS de dados institucionais e provas automatizadas de isolamento.
4. Criptografia em trânsito/repouso; arquivos privados e URLs assinadas expiráveis.
5. Proteção contra XSS, CSRF quando aplicável, rate limiting, cabeçalhos de segurança.
6. Inventário dos dados, minimização, retenção e descarte, incidentes e recuperação.
7. Processo de revisão pedagógica de atividades e acessibilidade com usuários reais.
8. NÃO enviar dados de crianças a serviços de IA sem avaliação contratual e jurídica específica.
9. Telemetria desativada por padrão no modo aluno; zero anúncios, rastreamento comportamental ou monetização dos dados.

Referências normativas:
- Decreto nº 12.686/2025, alterado pelo 12.773/2025: https://www2.camara.leg.br/legin/fed/decret/2025/decreto-12686-20-outubro-2025-798166-normaatualizada-pe.html
- Lei nº 15.211/2025 (ECA Digital): https://normas.leg.br/?urn=urn%3Alex%3Abr%3Afederal%3Alei%3A2025-09-17%3B15211
- DUA/UDL (CAST): https://www.cast.org/what-we-do/universal-design-for-learning/

## Próximos marcos
P0: demonstrativo interativo e teste. P1: identificação de usuários, banco e isolamento. P2: PEI/PAEE, licenças e editorial. P3: piloto autorizado com validação humana, auditoria de acessibilidade e segurança.
