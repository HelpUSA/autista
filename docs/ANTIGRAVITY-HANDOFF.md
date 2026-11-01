# Handoff Antigravity — 2026-11-01

Repositório oficial: https://github.com/HelpUSA/autista
Branch proposta: feat/interactive-learning-accessibility-20261101
Diretório local: D:\\AntiG\\autista
Domínio pretendido: autista.helpusbr.com

## Para validar esta PR (NÃO publicar automaticamente)
1. Executar `git fetch origin`; conferir HEAD local e remoto e status limpo.
2. Fazer checkout da branch de feature sem descartar alterações não comitadas.
3. Executar `npm ci`, `npm test`, `npm run build`.
4. Navegador desktop+mobile: acessar aba Atividades, quatro módulos, 12 desafios, erro/tentativa, dica, pausa, voltar, conclusão; modo texto ampliado/símbolos e leitura PT-BR.
5. Verificar navegação por teclado, foco visível, leitura por leitor de tela (NVDA), contraste e redução de movimento.
6. Executar `git diff main...HEAD`; validar que áreas antigas permanecem intactas.
7. Reportar resultados e SHAs na ponte; não alegar homologação sem evidências.

## P0 gates
- G1 build/test OK; G2 interação e acessibilidade manual OK; G3 não há dados reais de criança; G4 alinhamento editorial/DUA validado; G5 revisão da PR.
- Corrigir a persistência/autorização antes de ativar perfis reais. Para o domínio público, exibir aviso de demonstração.
- Não armazenar credenciais, tokens, dados sensíveis ou transcrições de conversas no GitHub.
- Abrir issues de P1: autenticação, isolamento por escola, PEI/PAEE, catálogo editorial/licenças, política de privacidade.
