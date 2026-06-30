# Apresentação — Segmentação Semântica (Reveal.js)

Slides da aula **BCC6003 – Inteligência Computacional** sobre YOLO e U-Net.

## Como abrir

A apresentação usa Reveal.js via CDN. As figuras ficam em `img/`. Para links externos (`../unet/`), é recomendável servir o repositório por HTTP:

```bash
# Na raiz do repositório
python3 -m http.server 8080
```

Acesse: [http://localhost:8080/apresentacao/](http://localhost:8080/apresentacao/)

**GitHub Pages:** [https://geazzy.github.io/bcc6003-segmentacao-semantica/apresentacao/](https://geazzy.github.io/bcc6003-segmentacao-semantica/apresentacao/)

## Atalhos do Reveal.js

| Tecla | Ação |
|-------|------|
| `→` / `↓` / Espaço | Próximo slide / fragmento |
| `←` / `↑` | Slide anterior |
| `F` | Tela cheia |
| `S` | Modo apresentador (notas do slide) |
| `Esc` | Visão geral dos slides |
| `B` / `.` | Tela preta (pausa) |

## Estrutura

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Deck completo (~28 slides + verticais opcionais) |
| `css/theme.css` | Tema escuro alinhado à visualização U-Net |
| `img/` | Diagramas e figuras da aula |

## Conteúdo base

- [`revisao-bibliografica.md`](../revisao-bibliografica.md)
- [`materiais/referencias/unet-architecture-explained.pdf`](../materiais/referencias/unet-architecture-explained.pdf)
