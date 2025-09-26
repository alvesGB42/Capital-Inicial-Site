# Rock 90s —

## Objetivo
Refazer o site original mantendo a estrutura e os recursos de acessibilidade, porém modernizando a apresentação com layout responsivo, animações, timeline e conteúdo expandido sobre o Rock dos anos 90.

## O que foi feito
- Mantida a estrutura HTML e todos atributos de acessibilidade (aria, alt, tabindex).
- A parte de acessibilidade (menu flutuante, botões A+/A-/alto contraste) **não foi alterada**.
- Adicionado conteúdo: panorama BR/INT, timeline interativa, cards de tópicos, galeria, seção dedicada a Capital Inicial com o texto enviado.
- Estilização moderna com CSS responsivo e efeitos.
- Animações de entrada via ScrollReveal e microinterações em CSS/JS.
- Links e imagens são placeholders: substitua `img/...` por arquivos reais conforme preferir.

## Como testar
1. Coloque os arquivos (`index.html`, `styles.css`, `script.js`) na mesma pasta com uma subpasta `img/` contendo suas imagens.
2. Abra `index.html` no navegador.
3. Teste o menu de acessibilidade (A+/A-/Contraste) — comportamento preservado.

## Tecnologias
- HTML semântio + ARIA
- CSS moderno (grid, transitions)
- JavaScript (ScrollReveal + microinteractions)
- Bootstrap apenas para reset/estrutura
