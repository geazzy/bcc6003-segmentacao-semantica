# BCC6003 — Segmentação Semântica (YOLO / U-Net)

Material da disciplina **BCC6003 – Inteligência Computacional** (Bacharelado em Ciência da Computação).

**Tópico:** técnicas de segmentação semântica, com ênfase em **YOLO** e **U-Net**.

## Slides (GitHub Pages)

Apresentação em Reveal.js:

**[Abrir slides](https://geazzy.github.io/bcc6003-segmentacao-semantica/apresentacao/)**

> Se o link acima ainda não estiver ativo, siga os passos abaixo para rodar os slides localmente:
>
> 1. **Clone o repositório:**
>    ```bash
>    git clone https://github.com/geazzy/bcc6003-segmentacao-semantica.git
>    cd bcc6003-segmentacao-semantica
>    ```
> 2. **Sirva localmente com Python:**
>    ```bash
>    python3 -m http.server 8080
>    ```
> 3. Acesse: [http://localhost:8080/apresentacao/](http://localhost:8080/apresentacao/)

## Exercício prático (Google Colab)

**[Abrir notebook no Colab](https://colab.research.google.com/drive/1EMkiCFCBLLtAPd-I3udVLJMr9RGB22g1)**

Especificação completa: [`exercicio.md`](exercicio.md). A entrega é o **link do seu notebook no Colab** — responda todas as perguntas nas células markdown do notebook.

## Conteúdo

| Arquivo | Descrição |
|---------|-----------|
| [`apresentacao/`](apresentacao/) | Slides da aula (~28 slides): conceitos, YOLO, U-Net, comparação e atividades. |
| [`revisao-bibliografica.md`](revisao-bibliografica.md) | Guia de estudos complementar com contexto bibliográfico e leitura orientada. |
| [`exercicio.md`](exercicio.md) | Especificação do exercício prático: U-Net + Oxford-IIIT Pet no Colab. |
| [`materiais/notebooks/`](materiais/notebooks/) | Notebook Jupyter para treinar U-Net no Colab. |
| [`materiais/referencias/unet-architecture-explained.pdf`](materiais/referencias/unet-architecture-explained.pdf) | Material complementar sobre a arquitetura U-Net (leitura opcional). |
| [`unet/`](unet/) | Demo interativa da U-Net (acessível a partir do slide 22). |

## Como usar

1. Leia a **revisão bibliográfica** antes da aula e para a atividade pós-aula.
2. Acompanhe os **slides** na aula ou pelo link do GitHub Pages.
3. Consulte o PDF da U-Net em [`materiais/referencias/`](materiais/referencias/) para aprofundar a arquitetura encoder–decoder.
4. Realize o exercício no **Colab** (link acima), complete os `# TODO`, responda as perguntas no notebook e envie o link ao professor.

## Referências principais

- Goodfellow, I.; Bengio, Y.; Courville, A. *Deep Learning*. MIT Press, 2016.
- Redmon, J. et al. *You Only Look Once: Unified, Real-Time Object Detection*. CVPR, 2016.
- Ronneberger, O.; Fischer, P.; Brox, T. *U-Net: Convolutional Networks for Biomedical Image Segmentation*. MICCAI, 2015.
- Long, J.; Shelhamer, E.; Darrell, T. *Fully Convolutional Networks for Semantic Segmentation*. CVPR, 2015.

---

**Professor:** Diego Bertolini Gonçalves  
**Disciplina:** BCC6003 – Inteligência Computacional
