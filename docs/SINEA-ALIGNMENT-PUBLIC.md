# SINEA — Roteiro técnico de alinhamento (versão resumida para repositório público)

**Fonte de autoridade:** briefing confidencial fornecido pela Editora Evoluce em 01/11/2026.
Não adicionar o PDF original, páginas, screenshots, notas comerciais ou dados reais a este repositório público.

## Produto
SINEA — Sistema de Inteligência para Necessidades Educacionais e Aprendizagem.
A marca, os direitos de código, o conteúdo editorial e os termos de licenciamento
dependem do instrumento contratual da editora. Domínio provisório autista.helpusbr.com.

O foco é gestão inclusiva de escolas públicas e particulares. Não limitar a TEA:
incluir diferentes deficiências, transtornos de aprendizagem e altas habilidades.
Atividades interativas são um complemento pedagógico, não o objetivo principal.

## Fluxo demonstrativo
1. Identidade SINEA; acesso por perfil, sem coletar CPF real no ambiente público.
2. Início com agenda do profissional e pendências.
3. Estudantes: visão geral do prontuário, atendimentos e histórico.
4. Planos PEI, PDI e PAEE e metas observáveis.
5. Registro diário: visualização do fluxo, envio bloqueado sem autenticação.
6. Evolução pedagógica, funcional, cognitiva, socioemocional.
7. Painel de rede somente com dados agregados fictícios.
8. Canto da Calma: simulação de sessão acolhedora (não punição/isolamento).
9. Suporte: demonstração de revisão humana de proposta pedagógica.
10. Atividades para o estudante: módulo de aprendizagem acessível separado do prontuário.

## Gates de entrega
**Pré-produção:** backend seguro + isolamento entre redes, autenticação individual,
MFA para perfis privilegiados, controle por vínculo, trilha de auditoria, criptografia
e backup/restore. Proibido CPF e dados médicos reais na versão pública demonstrativa.

**MVP requerido no contrato:** agendas, prontuário, anexos privados, histórico de
transferências, PEI/PDI/PAEE, registros, Canto da Calma, gráficos e painel, app iOS/Android,
offline + reconciliação segura, idiomas internacionalizáveis e todos os controles de segurança.

**Fase 2:** agente pedagógico RAG com fontes, revisão humana, projetos editoriais,
espaço de planejamento independente, painel de especialista e espanhol.

## Ajustes arquiteturais necessários
- Frontend de demonstração atual: Vite React. Uso exclusivo de dados fictícios.
- Backend proposto: API com autenticação, autorização por relação e tenant, PostgreSQL
  com RLS, anexos privados, jobs e observabilidade. Escolher região de hospedagem
  brasileira conforme exigência contratual e confirmar residência de *todos* suboperadores.
- Planejar app nativo/cross-platform com coleta offline criptografada, biometria/PIN,
  revogação remota e sync idempotente, após threat modeling.
- Trilha de auditoria imutável com eventos por acesso, inclusive downloads.
- Agregados da rede exigem supressão de grupos pequenos e análise de risco de reidentificação.
- IA sem diagnóstico clínico, recomendação de medicação ou aplicação autônoma; manter
  trilha de versão, fontes e decisão do professor.
- Licença por estudante, não por usuário; vínculo docente e instituição múltipla.

## Diferenças críticas da versão anterior
- SINEA substitui o nome InclusivaTEA na UI.
- Plano agora inclui PDI além de PEI/PAEE.
- Canto da Calma passa a ter sessão registrável e relatório individual futuro.
- Suporte é agente pedagógico com RAG e supervisão profissional; não um chat genérico.
- Rede pública / mantenedora é primeira classe e só recebe indicadores agregados.
- iOS e Android exigidos no produto final: PWA isoladamente não cumpre o briefing.
- Usuário aluno interage com atividades em área própria, sem exposição a documentos clínicos.

## Privacidade do repositório
O GitHub HelpUSA/autista encontra-se PUBLICO. Antes de adicionar especificações internas,
integrações reais, modelos de ameaça, contratos ou informações do cliente, validar
a alteração para PRIVADO com a titularidade e permissões contratuais.
