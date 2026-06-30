# Exercício Prático — Fine-tuning de U-Net para Segmentação Semântica

**Realize a atividade no Google Colab:** [Abrir notebook](https://colab.research.google.com/drive/1EMkiCFCBLLtAPd-I3udVLJMr9RGB22g1)

## Entrega

A entrega é o **envio do link do seu notebook no Google Colab** ao professor (plataforma da disciplina).

Antes de enviar:

- complete os trechos marcados com `# TODO`;
- responda **todas as perguntas** nas células markdown do notebook (reflexão, discussão e questões conceituais);
- execute **Executar tudo** com GPU e confira que gráficos, métricas e visualizações aparecem;
- compartilhe o notebook com link de leitura.

Não é necessário enviar PDF, relatório em Word ou respostas em arquivo separado.

## Objetivo

Configurar e treinar uma U-Net com **transfer learning** para segmentar animais (gatos e cachorros) utilizando o Oxford-IIIT Pet Dataset.

A arquitetura U-Net (encoder, decoder, skip connections) é estudada **conceitualmente na aula** (slides e visualização interativa). No notebook, utilizamos a biblioteca [segmentation_models.pytorch](https://github.com/qubvel-org/segmentation_models.pytorch), que implementa a mesma estrutura com encoder pré-treinado no ImageNet.

Ao final do exercício o aluno deverá ser capaz de:

- compreender como funciona uma U-Net (encoder, decoder, skip connections);
- configurar uma U-Net via biblioteca com transfer learning;
- treinar uma rede de segmentação com `BCEWithLogitsLoss`;
- interpretar métricas **IoU** e **Dice** e relacioná-las com a qualidade visual das máscaras;
- visualizar máscaras previstas e discutir os resultados.

## Dataset

**Oxford-IIIT Pet Dataset**

Possui aproximadamente:

- 7349 imagens
- Máscaras de segmentação
- Classes:
  - fundo
  - animal
  - contorno (opcional)

Para reduzir o tempo de execução será utilizada apenas uma pequena amostra.

Por exemplo:

- 600 imagens para treino
- 100 imagens para validação
- 100 imagens para teste

O treinamento leva aproximadamente:

- 3–5 minutos na GPU T4 (encoder ResNet18 + ImageNet)
- batch_size = 16
- 5 épocas

## Parte 1 — Preparação dos dados

O aluno deverá:

- carregar imagens
- carregar máscaras
- redimensionar para 128 × 128
- converter para tensor.

*Responda as perguntas de reflexão nas células correspondentes do notebook (seção 2).*

## Parte 2 — Configuração do modelo

Utilizar a biblioteca **segmentation_models.pytorch**:

```python
import segmentation_models_pytorch as smp

model = smp.Unet(
    encoder_name="resnet18",
    encoder_weights="imagenet",
    in_channels=3,
    classes=1,
    activation=None,
)
```

O aluno deverá:

- instalar a biblioteca (`pip install segmentation-models-pytorch`);
- configurar o modelo com os parâmetros acima;
- escrever uma justificativa breve (2–3 linhas) sobre a escolha do encoder.

**Diagrama de referência (visto na aula — Ronneberger et al., 2015):**

```
Entrada     128×128×3
      │
Encoder     128×128×64 → 64×64×128 → 32×32×256 → 16×16×512
      │
Bottleneck   8×8×1024
      │
Decoder     16×16×512 → 32×32×256 → 64×64×128 → 128×128×64
      │
Saída       128×128×1
```

A biblioteca implementa a mesma ideia: encoder (ResNet18 pré-treinado), decoder com upsampling e skip connections entre camadas de mesma resolução.

*Responda as perguntas de reflexão e a justificativa do encoder nas células do notebook (seção 3).*

## Parte 3 — Função de perda

Utilizar:

**BCEWithLogitsLoss**

*Responda as perguntas de reflexão nas células do notebook (seção 4).*

## Parte 4 — Treinamento

Treinar por **5 épocas**.

Registrar:

- loss treino
- loss validação

Ao final gerar um gráfico comparando as curvas de loss.

## Parte 5 — Avaliação e predição

Após o treinamento, calcular **IoU** e **Dice** nos conjuntos de validação e teste (funções fornecidas no notebook).

Selecionar algumas imagens do conjunto de teste e mostrar lado a lado:

**Imagem Original** | **Máscara Real** | **Máscara Predita**

Relacionar os valores numéricos (IoU/Dice) com a qualidade visual das máscaras.

## Parte 6 — Discussão

*Responda as perguntas de discussão nas células do notebook (seção 9).*

Temas a abordar:

- Em quais imagens a rede acertou? Em quais falhou?
- O que pode explicar os erros?
- Mais épocas resolveriam?
- Como aumentar a qualidade da segmentação?
- Como as métricas IoU e Dice se comparam com sua impressão visual?

### Desafio Extra

Trocar a função de perda:

- BCE

por

- Dice Loss

Comparar os resultados visuais e as métricas IoU/Dice.

## Organização do Notebook

1. Introdução e entrega (link do Colab)
2. Carregamento do Dataset
3. Pré-processamento
4. DataLoader
5. Configuração da U-Net (`segmentation_models.pytorch`)
6. Função de perda
7. Otimizador
8. Loop de treinamento
9. Avaliação (loss, IoU e Dice)
10. Visualização das predições
11. Discussão e questões conceituais
12. Checklist de entrega

## Questões conceituais

As 8 questões abaixo devem ser respondidas na **seção 10 do notebook** — não envie em arquivo separado.

1. Explique por que a U-Net utiliza Skip Connections.
2. Qual é a função do Encoder?
3. Qual é a função do Decoder?
4. O que acontece se removermos as Skip Connections?
5. Por que a última camada possui apenas um canal?
6. O que representa cada pixel da saída da U-Net?
7. Por que utilizamos uma função Sigmoid apenas na inferência (quando usamos BCEWithLogitsLoss)?
8. Cite duas diferenças entre uma CNN para classificação de imagens e uma U-Net para segmentação semântica.

## Sugestão de notebook base

Para manter o foco no treinamento e na interpretação dos resultados, forneça um notebook parcialmente implementado com o pipeline de dados pronto e a U-Net configurável via biblioteca. Marque os trechos com `# TODO`, por exemplo:

- configuração do modelo (`smp.Unet`)
- justificativa da escolha do encoder
- `train_one_epoch` e `validate`
- loop de treinamento
- `plot_history`
- visualização das máscaras

Dessa forma, em uma aula de aproximadamente 100 minutos, a turma consegue treinar a rede por algumas épocas e analisar os resultados, concentrando o aprendizado nos conceitos centrais da segmentação semântica.

## Referências

- Ronneberger, O.; Fischer, P.; Brox, T. *U-Net: Convolutional Networks for Biomedical Image Segmentation*. MICCAI, 2015 — introduz a arquitetura U-Net e suas skip connections.
- Long, J.; Shelhamer, E.; Darrell, T. *Fully Convolutional Networks for Semantic Segmentation*. CVPR, 2015 — estabelece as bases das redes totalmente convolucionais para segmentação.
- [segmentation_models.pytorch](https://github.com/qubvel-org/segmentation_models.pytorch) — biblioteca PyTorch com U-Net e encoders pré-treinados.
- Goodfellow, I.; Bengio, Y.; Courville, A. *Deep Learning*. MIT Press, 2016 — fundamentos de redes neurais profundas e treinamento.
