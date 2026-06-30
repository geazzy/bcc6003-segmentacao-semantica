# Notebooks — U-Net para segmentação (Kaggle / Colab)

Material prático da disciplina **BCC6003 – Inteligência Computacional**: fine-tuning de U-Net com `segmentation_models.pytorch` para segmentação binária no **Oxford-IIIT Pet Dataset**.

| Arquivo | Descrição |
|---------|-----------|
| [`unet_segmentacao_pets.ipynb`](unet_segmentacao_pets.ipynb) | Pipeline de dados e modelo via lib prontos; treino e visualização com `# TODO` |

Especificação completa do exercício: [`exercicio.md`](../../exercicio.md).

---

## Pré-requisitos

1. Conta no [Kaggle](https://www.kaggle.com/) ou [Google Colab](https://colab.research.google.com/)
2. Notebook com **GPU** habilitada (T4 recomendada)
3. **Internet ligada** — dataset via `torchvision`, biblioteca `segmentation-models-pytorch` e pesos ImageNet

Dependência adicional (instalada no notebook):

```bash
pip install segmentation-models-pytorch
```

---

## Publicar o notebook

1. Acesse [kaggle.com/code](https://www.kaggle.com/code) → **New Notebook**
2. **File → Upload Notebook** e envie `unet_segmentacao_pets.ipynb`
3. Em **Settings** (painel direito):
   - **Accelerator:** GPU T4 (ou GPU disponível)
   - **Internet:** On
4. Execute **Run All** e complete os trechos marcados com `# TODO`
5. **Save Version → Save & Run All** para gerar uma versão executável

---

## Compartilhar

- **Share → Copy link** — URL pública do notebook
- Envie o link na plataforma da disciplina

---

## Estrutura do notebook

1. Introdução e setup (Kaggle / Colab)
2. Instalação de `segmentation_models.pytorch`
3. Carregamento do dataset (Oxford-IIIT Pet)
4. Pré-processamento (128×128, máscara binária)
5. DataLoader (600 / 100 / 100)
6. Configuração da U-Net — `smp.Unet` com encoder ResNet18 + ImageNet
7. `BCEWithLogitsLoss` e otimizador Adam
8. Loop de treinamento (5 épocas) — **TODO**
9. Gráfico de loss — **TODO**
10. Visualização imagem | máscara real | predição — **TODO**

---

## Referências

- Ronneberger, O.; Fischer, P.; Brox, T. *U-Net: Convolutional Networks for Biomedical Image Segmentation*. MICCAI, 2015.
- [segmentation_models.pytorch](https://github.com/qubvel-org/segmentation_models.pytorch)
- [Oxford-IIIT Pet — torchvision](https://pytorch.org/vision/stable/generated/torchvision.datasets.OxfordIIITPet.html)
