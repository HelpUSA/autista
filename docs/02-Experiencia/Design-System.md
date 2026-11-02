---
title: "Design-System"
project: SINEA
type: documentation
category: "02-Experiencia"
status: maintained
updated: 2026-11-01
tags:
  - sinea
  - helpus
  - evoluce
---

# Design system HelpUS × SINEA

## Identidade e prioridade
A interface respeita o briefing Evoluce, com presença institucional HelpUS. Cores em hex:
- `#10304b`: azul-marinho, cabeçalho, títulos principais;
- `#0f766e`: turquesa escuro (botões e foco);
- `#f3f7fa`: fundo, canvas;
- `#ffffff`: superfície de cards;
- `#fef3c7`: advertências de demonstração;
- cinzas da escala Tailwind para textos de apoio.

### Logo
Foi localizada a imagem `frontend/public/logo-helpus.png` em `HelpUSA/helpus-ai`, a mesma usada em `HelpUSA/nexosai-frontend/public/helpus_logo.png`. A identidade oficial foi incorporada em `public/brand/helpus-logo.jpg` (web) e `mobile/assets/helpus-logo.jpg` (Expo), reutilizando o blob SHA Git `5fd4cb3ab76399f6d6200f9a897bea95124cf0c3` do repositório `HelpUSA/helpus-ai`. Apesar do nome original `.png`, os bytes possuem assinatura JPEG, preservados sem edição.

> [!warning] Gate de marca
> Ativo copiado com bytes idênticos e hash Git preservado. Confirmar aprovação contratual de uso de marca HelpUS no projeto Evoluce, testar renderização web/native e registrar o SHA-256 do binário durante a homologação antes da publicação.

## Layout e grid
- Mobile primeiro, mínimo 320 px, menu inferior com Início, Estudantes, Registrar, Planos e Painel.
- Acesso a Comunicação, Rotina, Atividades, Canto e Suporte pelo botão secundário.
- Desktop ≥1024 px: sidebar fixa com áreas principais/auxiliares e conteúdo max 7xl.
- Grades `grid-cols-2`, `sm:grid-cols-2`, `lg:grid-cols-3/4`; evitar overflow horizontal.
- Área tocável mínima 44x44 CSS px; foco visível, labels e heading semânticos.
- Formulários reais não são disponibilizados no demo.

## Tipografia e componentes
Sistema `Inter, ui-sans-serif, system-ui`; `PanelTitle`, `Metric`, `StudentTile`, `Brand`, `Selector`; classe compartilhada de botões `min-h-11`, radius 12–16 px. Evitar fontes remotas e flashes na troca de idioma.

## Tokens e acessibilidade
Contraste de conteúdo sujeito a auditoria WCAG; `prefers-reduced-motion` respeitado; rolagem e impressão não exibem navegação. Símbolos de rotina devem ser revisados com usuários reais.

Relacionamentos: [[02-Experiencia/Acessibilidade-e-DUA]], [[02-Experiencia/Internacionalizacao]].
