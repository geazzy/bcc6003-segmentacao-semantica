# Notebooks — U-Net para segmentação (Colab)

Material prático da disciplina **BCC6003 – Inteligência Computacional**: fine-tuning de U-Net com `segmentation_models.pytorch` para segmentação binária no **Oxford-IIIT Pet Dataset**.

| Arquivo | Descrição |
|---------|-----------|
| [`unet_segmentacao_pets.ipynb`](unet_segmentacao_pets.ipynb) | Pipeline de dados e modelo via lib prontos; treino e visualização com `# TODO` |

Especificação completa do exercício: [`exercicio.md`](../../exercicio.md).

**Notebook no Colab:** [Abrir atividade](https://colab.research.google.com/drive/1EMkiCFCBLLtAPd-I3udVLJMr9RGB22g1)

---

## Pré-requisitos

1. Conta no [Google Colab](https://colab.research.google.com/)
2. **Ambiente de execução → T4 GPU**
3. **Internet ativa** — dataset via `torchvision`, biblioteca `segmentation-models-pytorch` e pesos ImageNet

Dependência adicional (instalada no notebook):

```bash
pip install segmentation-models-pytorch
```

---

## Entrega

A entrega é o **link do seu notebook no Google Colab**, enviado ao professor pela plataforma da disciplina.

1. Complete os `# TODO` e responda **todas as perguntas** nas células markdown.
2. Execute **Executar tudo** com GPU.
3. Compartilhe o notebook (link de leitura).
4. Envie o link do Colab — **sem** PDF ou documento separado.

---

## Estrutura do notebook

1. Introdução, objetivos e entrega (link do Colab)
2. Instalação de `segmentation_models.pytorch`
3. Carregamento do dataset (Oxford-IIIT Pet)
4. Pré-processamento (128×128, máscara binária) + perguntas com espaço de resposta
5. DataLoader (600 / 100 / 100)
6. Configuração da U-Net — `smp.Unet` com encoder ResNet18 + ImageNet
7. `BCEWithLogitsLoss` e otimizador Adam
8. Loop de treinamento (5 épocas) — **TODO**
9. Gráfico de loss + IoU/Dice (funções prontas)
10. Visualização imagem | máscara real | predição — **TODO**
11. Discussão, questões conceituais e checklist de entrega

---

## Referências

- Ronneberger, O.; Fischer, P.; Brox, T. *U-Net: Convolutional Networks for Biomedical Image Segmentation*. MICCAI, 2015.
- [segmentation_models.pytorch](https://github.com/qubvel-org/segmentation_models.pytorch)
- [Oxford-IIIT Pet — torchvision](https://pytorch.org/vision/stable/generated/torchvision.datasets.OxfordIIITPet.html)
