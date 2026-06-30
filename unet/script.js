/**
 * U-Net Interactive Visualization — script.js
 * Alunos iniciantes em Deep Learning
 */

// ═══════════════════════════════════════════════════════
//  ARCHITECTURE NODES (left panel)
// ═══════════════════════════════════════════════════════
const ARCH_NODES = [
  { id: 'input',    label: 'Imagem',      type: 'input' },
  { id: 'enc1',     label: 'Encoder 1',   type: 'encoder' },
  { id: 'relu1',    label: 'ReLU',        type: 'activation' },
  { id: 'pool1',    label: 'MaxPool',     type: 'pool' },
  { id: 'enc2',     label: 'Encoder 2',   type: 'encoder' },
  { id: 'pool2',    label: 'MaxPool',     type: 'pool' },
  { id: 'enc3',     label: 'Encoder 3',   type: 'encoder' },
  { id: 'pool3',    label: 'MaxPool',     type: 'pool' },
  { id: 'enc4',     label: 'Encoder 4',   type: 'encoder' },
  { id: 'pool4',    label: 'MaxPool',     type: 'pool' },
  { id: 'bn',       label: 'Bottleneck',  type: 'bottleneck' },
  { id: 'dec1',     label: 'UpConv + Dec 1', type: 'decoder' },
  { id: 'dec2',     label: 'UpConv + Dec 2', type: 'decoder' },
  { id: 'dec3',     label: 'UpConv + Dec 3', type: 'decoder' },
  { id: 'dec4',     label: 'Saída',       type: 'output' },
];

// ═══════════════════════════════════════════════════════
//  STEP DEFINITIONS
// ═══════════════════════════════════════════════════════
const STEPS = [
  // ── 0: Entrada
  {
    archNode: 'input',
    badge: 'Etapa 1',
    title: 'Imagem de Entrada',
    render: renderInput,
    explanation: {
      tag: 'input',
      sections: [
        { heading: 'O que é?', body: 'A imagem de entrada é o ponto de partida da U-Net. Neste exemplo, usamos uma imagem RGB de 256×256 pixels.' },
        { heading: 'Tensor de entrada', tensor: ['H × W × C', '256 × 256 × 3'] },
        { heading: 'Significado', body: 'H = altura (256 pixels), W = largura (256 pixels), C = 3 canais de cor (R, G, B). Cada pixel possui 3 valores numéricos entre 0 e 255.' },
        { heading: 'Objetivo', body: 'A rede aprenderá a transformar essa imagem em uma máscara de segmentação — separando objetos de interesse do fundo.', style: 'highlight' },
        { heading: 'Modelo didático', body: 'Arquitetura inspirada em Ronneberger et al. (2015), com simplificações para visualização: entrada 256×256, convoluções com padding, canais reduzidos (32→512) e 1 convolução 3×3 por bloco (o paper original usa 2 convoluções e canais 64→1024).' },
      ]
    }
  },
  // ── 1: Encoder 1 — primeira convolução
  {
    archNode: 'enc1',
    badge: 'Etapa 2',
    title: 'Encoder 1 — Primeira Convolução',
    render: renderEnc1,
    explanation: {
      tag: 'encoder',
      sections: [
        { heading: 'Convolução 3×3', body: 'Uma convolução aplica um filtro (kernel) sobre a imagem, extraindo características como bordas, texturas e padrões. No paper original há duas convoluções 3×3 por nível; aqui usamos uma para simplificar a visualização.' },
        { heading: 'Tensor de entrada', tensor: ['256 × 256 × 3'] },
        { heading: 'Tensor de saída', tensor: ['256 × 256 × 32'] },
        { heading: 'Por que 32?', body: 'O Encoder 1 possui 32 filtros. Cada filtro produz um Feature Map — uma "visão" diferente da imagem. Com 32 filtros, obtemos 32 mapas.', style: 'highlight' },
        { heading: 'Resolução', body: 'A convolução com padding preserva a dimensão espacial (256×256). Apenas os canais aumentam.' },
        { heading: 'Próximo passo', body: 'Após a convolução, aplicamos ReLU (max(0, x)) em cada valor dos Feature Maps — antes do MaxPooling.', style: 'highlight' },
      ]
    }
  },
  // ── 2: ReLU após primeira convolução
  {
    archNode: 'relu1',
    badge: 'Etapa 3',
    title: 'ReLU — Ativação Não Linear',
    render: renderReLU,
    explanation: {
      tag: 'activation',
      sections: [
        { heading: 'O que é ReLU?', body: 'ReLU (Rectified Linear Unit) é a função de ativação aplicada elemento a elemento em cada Feature Map, logo após a convolução. Não age na imagem RGB de entrada — age nos valores numéricos produzidos pelos filtros.' },
        { heading: 'Fórmula', tensor: ['ReLU(x) = max(0, x)', 'Negativos → 0', 'Positivos → mantidos'] },
        { heading: 'Por quê?', body: 'Sem não-linearidade, empilhar convoluções seria equivalente a uma única convolução linear (Goodfellow et al., 2016). A ReLU permite à rede aprender padrões mais complexos.', style: 'highlight' },
        { heading: 'Na U-Net', body: 'Ronneberger et al. (2015) usam ReLU após cada convolução 3×3 (no paper: Conv → ReLU → Conv → ReLU, antes do MaxPool). Neste modelo didático, mostramos uma conv por bloco, mas a ReLU entra da mesma forma.' },
        { heading: 'Efeito', body: 'Feature maps ficam mais esparsos: regiões que o filtro não ativou fortemente são zeradas, reforçando as respostas positivas.' },
      ]
    }
  },
  // ── 3: MaxPool 1
  {
    archNode: 'pool1',
    badge: 'Etapa 4',
    title: 'MaxPool — Redução Espacial',
    render: renderPool,
    data: { before: '256×256', after: '128×128', channels: 32 },
    explanation: {
      tag: 'pool',
      sections: [
        { heading: 'O que é MaxPool?', body: 'O MaxPooling percorre a imagem em janelas de 2×2 e mantém apenas o valor máximo de cada janela, reduzindo a resolução pela metade. Entra após Conv → ReLU no fluxo do encoder.' },
        { heading: 'Antes', tensor: ['256 × 256 × 32'] },
        { heading: 'Depois', tensor: ['128 × 128 × 32'] },
        { heading: 'Por que fazer isso?', body: 'A redução torna a rede mais eficiente e a força a aprender representações mais abstratas e invariantes à posição.', style: 'highlight' },
      ]
    }
  },
  // ── 3: Encoder 2
  {
    archNode: 'enc2',
    badge: 'Etapa 5',
    title: 'Encoder 2 — Dobrar Canais',
    render: renderEnc2,
    explanation: {
      tag: 'encoder',
      sections: [
        { heading: 'Estratégia da U-Net', body: 'A cada nível do Encoder, a resolução cai pela metade mas o número de filtros dobra. Isso compensa a perda de resolução com mais informação semântica.' },
        { heading: 'Tensor de entrada', tensor: ['128 × 128 × 32'] },
        { heading: 'Tensor de saída', tensor: ['128 × 128 × 64'] },
        { heading: 'O que significa?', body: 'Com 64 Feature Maps em 128×128, a rede captura padrões mais complexos com metade da resolução.', style: 'highlight' },
      ]
    }
  },
  // ── 4: MaxPool 2
  {
    archNode: 'pool2',
    badge: 'Etapa 6',
    title: 'MaxPool — Segunda Redução',
    render: renderPool,
    data: { before: '128×128', after: '64×64', channels: 64 },
    explanation: {
      tag: 'pool',
      sections: [
        { heading: 'Segunda redução', body: 'A resolução é reduzida pela segunda vez, de 128×128 para 64×64.' },
        { heading: 'Antes', tensor: ['128 × 128 × 64'] },
        { heading: 'Depois', tensor: ['64 × 64 × 64'] },
        { heading: 'Padrão da U-Net', body: 'Cada MaxPool divide H e W por 2. Com 4 MaxPools, chegamos a 1/16 da resolução original.', style: 'highlight' },
      ]
    }
  },
  // ── 5: Encoder 3
  {
    archNode: 'enc3',
    badge: 'Etapa 7',
    title: 'Encoder 3 — Características Abstratas',
    render: renderResLadder,
    data: {
      steps: [
        { dims: '256×256×32', color: 'encoder', w: 90, h: 70 },
        { dims: '128×128×64', color: 'encoder', w: 72, h: 54 },
        { dims: '64×64×128',  color: 'encoder', w: 55, h: 40 },
      ]
    },
    explanation: {
      tag: 'encoder',
      sections: [
        { heading: 'Encoder 3', body: 'Após a terceira convolução, os Feature Maps passam de 64 para 128 canais.' },
        { heading: 'Tensor de entrada', tensor: ['64 × 64 × 64'] },
        { heading: 'Tensor de saída', tensor: ['64 × 64 × 128'] },
        { heading: 'Progressão', body: '32 → 64 → 128 canais. As características ficam cada vez mais abstratas e de alto nível.', style: 'highlight' },
      ]
    }
  },
  // ── 6: Pool3 + Encoder 4
  {
    archNode: 'enc4',
    badge: 'Etapa 8',
    title: 'Encoder 4 — Profundidade Máxima',
    render: renderResLadder,
    data: {
      steps: [
        { dims: '256×256×32',  color: 'encoder', w: 90,  h: 70 },
        { dims: '128×128×64',  color: 'encoder', w: 72,  h: 54 },
        { dims: '64×64×128',   color: 'encoder', w: 55,  h: 40 },
        { dims: '32×32×256',   color: 'encoder', w: 42,  h: 30 },
      ]
    },
    explanation: {
      tag: 'encoder',
      sections: [
        { heading: 'Encoder 4 — última camada do encoder', body: 'A resolução cai para 32×32 e os canais sobem para 256.' },
        { heading: 'Tensor de entrada', tensor: ['32 × 32 × 128'] },
        { heading: 'Tensor de saída', tensor: ['32 × 32 × 256'] },
        { heading: 'Contexto global', body: 'Em 32×32 cada pixel "vê" uma área grande da imagem original. A rede captura contexto semântico de alto nível.', style: 'highlight' },
      ]
    }
  },
  // ── 7: Bottleneck
  {
    archNode: 'bn',
    badge: 'Etapa 9',
    title: 'Bottleneck — Representação Compacta',
    render: renderBottleneck,
    explanation: {
      tag: 'bottleneck',
      sections: [
        { heading: 'O que é o Bottleneck?', body: 'É o ponto mais profundo da U-Net. A imagem foi comprimida ao máximo — apenas 16×16 pixels mas 512 canais.' },
        { heading: 'Tensor', tensor: ['16 × 16 × 512'] },
        { heading: 'Analogia', body: 'Pense como um "resumo" da imagem inteira: pequeno em resolução, rico em semântica. É aqui que a rede tem a visão mais global.', style: 'highlight orange' },
        { heading: 'Transição', body: 'A partir daqui, a U-Net começa a expandir (Decoder) para reconstruir a segmentação espacial.' },
      ]
    }
  },
  // ── 8: Skip Connection explanation
  {
    archNode: 'dec1',
    badge: 'Etapa 10',
    title: 'Skip Connections — A Chave da U-Net',
    render: renderSkipConnection,
    explanation: {
      tag: 'skip',
      sections: [
        { heading: 'O problema', body: 'Ao comprimir a imagem, a rede perde detalhes espaciais finos (bordas, texturas precisas).' },
        { heading: 'A solução', body: 'As Skip Connections "pulam" as etapas de compressão e levam os Feature Maps do Encoder diretamente para o Decoder.', style: 'highlight purple' },
        { heading: 'Efeito', body: 'O Decoder recebe informação de dois lugares: (1) o contexto semântico do Bottleneck e (2) os detalhes espaciais do Encoder.' },
      ]
    }
  },
  // ── 9: UpSampling
  {
    archNode: 'dec1',
    badge: 'Etapa 11',
    title: 'UpSampling — Expansão Espacial',
    render: renderUpsampling,
    explanation: {
      tag: 'decoder',
      sections: [
        { heading: 'O que é UpSampling?', body: 'O processo inverso ao MaxPool: dobra a resolução espacial. A U-Net usa Convolução Transposta (UpConv) para isso.' },
        { heading: 'Antes', tensor: ['16 × 16 × 512'] },
        { heading: 'Depois', tensor: ['32 × 32 × 256'] },
        { heading: 'Como funciona?', body: 'A UpConv aprende como "expandir" os pixels, interpolando e preenchendo com base nos Feature Maps.', style: 'highlight green' },
      ]
    }
  },
  // ── 10: Concatenação
  {
    archNode: 'dec1',
    badge: 'Etapa 12',
    title: 'Concatenação — Unindo Encoder + Decoder',
    render: renderConcat,
    data: { encChannels: 256, decChannels: 256 },
    explanation: {
      tag: 'decoder',
      sections: [
        { heading: 'A concatenação', body: 'Os Feature Maps vindos do Encoder (via Skip Connection) são concatenados ao longo da dimensão de canais com os Features do Decoder.' },
        { heading: 'Cálculo', tensor: ['Encoder: 32 × 32 × 256', 'Decoder: 32 × 32 × 256', '─────────────────────', 'Concat:  32 × 32 × 512'] },
        { heading: 'Por que isso ajuda?', body: 'A rede combina localização precisa (Encoder) com contexto semântico (Decoder), melhorando muito a qualidade da segmentação.', style: 'highlight purple' },
      ]
    }
  },
  // ── 11: Decoder layers
  {
    archNode: 'dec2',
    badge: 'Etapa 13',
    title: 'Decoder — Reconstrução Progressiva',
    render: renderDecoder,
    explanation: {
      tag: 'decoder',
      sections: [
        { heading: 'Decodificador', body: 'Após a concatenação, uma convolução processa os 512 canais e reduz para 256, refinando a representação.' },
        { heading: 'Progressão do Decoder', tensor: ['16×16×512 → UpConv → 32×32×256', '+ Skip 32×32×256 = 32×32×512', '→ Conv → 32×32×256', '', '→ UpConv → 64×64×128', '+ Skip 64×64×128 = 64×64×256', '→ Conv → 64×64×128'] },
        { heading: 'Simetria', body: 'O Decoder é um espelho do Encoder. Cada nível de compressão tem um nível correspondente de expansão.', style: 'highlight green' },
      ]
    }
  },
  // ── 12: Full resolution
  {
    archNode: 'dec3',
    badge: 'Etapa 14',
    title: 'Resolução Completa Restaurada',
    render: renderFullResolution,
    explanation: {
      tag: 'decoder',
      sections: [
        { heading: 'Resolução restaurada', body: 'Após 4 UpConvs e 4 concatenações, a resolução volta a 256×256 — igual à imagem original.' },
        { heading: 'Tensor final do Decoder', tensor: ['256 × 256 × 32'] },
        { heading: 'Última convolução', body: 'Uma convolução 1×1 mapeia os 32 Feature Maps para as classes de segmentação (ex.: 2 classes para segmentação binária).', style: 'highlight green' },
        { heading: 'Progressão completa', tensor: ['16×16×512', '↓ Up+Concat+Conv', '32×32×256', '↓ Up+Concat+Conv', '64×64×128', '↓ Up+Concat+Conv', '128×128×64', '↓ Up+Concat+Conv', '256×256×32'] },
      ]
    }
  },
  // ── 13: Saída
  {
    archNode: 'dec4',
    badge: 'Etapa 15',
    title: 'Saída — Segmentação Final',
    render: renderOutput,
    explanation: {
      tag: 'output',
      sections: [
        { heading: 'Resultado', body: 'A U-Net produz uma máscara de segmentação com a mesma resolução da imagem de entrada.' },
        { heading: 'Tensor de saída', tensor: ['256 × 256 × C_classes', 'Exemplo: 256 × 256 × 2', '(fundo vs. planta)'] },
        { heading: 'Como interpretar', body: 'Cada pixel da máscara recebe uma probabilidade de pertencer a cada classe. A classe com maior probabilidade é escolhida.', style: 'highlight' },
        { heading: 'Aplicações', body: 'Medicina (segmentação de tumores), automotivo (detecção de pista), satélite (mapeamento de terreno), e muito mais.' },
      ]
    }
  },
];

// ═══════════════════════════════════════════════════════
//  APP STATE
// ═══════════════════════════════════════════════════════
let currentStep = 0;
let playTimer   = null;
const PLAY_INTERVAL = 4000;

// ═══════════════════════════════════════════════════════
//  UTILITY — Tensor 3D SVG
// ═══════════════════════════════════════════════════════
function makeTensor3D(opts) {
  const {
    w = 80, h = 60, d = 20,
    colorA = '#1e3a5f', colorB = '#3b82f6', borderColor = '#3b82f6',
    label = '', labelColor = borderColor
  } = opts;

  const skewX = d * 0.6, skewY = d * 0.35;
  const totalW = w + skewX + 2;
  const totalH = h + skewY + 2;

  const front = `M1,${skewY + 1} L${skewX + 1},1 L${skewX + w},1 L${skewX + w},${skewY + h} L${skewX},${skewY + h + skewY * 0 + 0} L1,${skewY + h}`;
  // Actually use proper box
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);
  svg.setAttribute('width', totalW);
  svg.setAttribute('height', totalH);
  svg.style.overflow = 'visible';

  // defs gradient
  const defs = svgEl('defs');
  const grad = svgEl('linearGradient', { id: 'tg_' + Math.random().toString(36).slice(2), x1:'0%', y1:'0%', x2:'100%', y2:'100%' });
  grad.appendChild(svgStop('0%', colorA));
  grad.appendChild(svgStop('100%', colorB));
  defs.appendChild(grad);
  svg.appendChild(defs);
  const gradId = grad.id;

  // top face
  const topPts = [
    [skewX, 1],
    [skewX + w, 1],
    [w, skewY + 1],
    [1, skewY + 1],
  ].map(p => p.join(',')).join(' ');
  const topFace = svgEl('polygon', { points: topPts, fill: colorMix(colorA, '#fff', 0.2), stroke: borderColor, 'stroke-width': 1 });

  // right face
  const rightPts = [
    [skewX + w, 1],
    [skewX + w, h + 1],
    [w, h + skewY + 1],
    [w, skewY + 1],
  ].map(p => p.join(',')).join(' ');
  const rightFace = svgEl('polygon', { points: rightPts, fill: colorMix(colorB, '#000', 0.4), stroke: borderColor, 'stroke-width': 1 });

  // front face
  const frontRect = svgEl('rect', {
    x: 1, y: skewY + 1, width: w, height: h,
    fill: `url(#${gradId})`, stroke: borderColor, 'stroke-width': 1.5, rx: 2,
  });

  // label in front
  const txt = svgEl('text', {
    x: w / 2 + 1, y: skewY + h / 2 + 1,
    'text-anchor': 'middle', 'dominant-baseline': 'middle',
    'font-size': Math.max(8, Math.min(12, h * 0.18)),
    fill: '#fff', 'font-family': 'monospace', 'font-weight': 700,
  });
  txt.textContent = label;

  svg.append(topFace, rightFace, frontRect, txt);
  return svg;
}

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}
function svgStop(offset, color) {
  const s = svgEl('stop');
  s.setAttribute('offset', offset);
  s.setAttribute('stop-color', color);
  return s;
}
function colorMix(hex, mix, amount) {
  // very rough mix — just lighten/darken via amount
  return mix === '#fff'
    ? `color-mix(in srgb, ${hex} ${(1 - amount) * 100}%, white)`
    : `color-mix(in srgb, ${hex} ${(1 - amount) * 100}%, black)`;
}

// Helper: create a tensor scene with 3D block + dims label
function tensorScene(opts) {
  const wrap = div('tensor-scene');
  const svg = makeTensor3D(opts);
  wrap.appendChild(svg);
  const dims = div('tensor-dims');
  dims.innerHTML = opts.dims || '';
  wrap.appendChild(dims);
  return wrap;
}

// Helper: flow arrow
function flowArrow(label = '', color = '#3b82f6') {
  const wrap = div('flow-arrow');
  const line = div('arrow-line');
  line.style.setProperty('--arrow-color', color);
  const lbl = div('arrow-label');
  lbl.textContent = label;
  if (label) wrap.appendChild(lbl);
  wrap.appendChild(line);
  return wrap;
}

function div(cls = '', tag = 'div') {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  return el;
}

// Feature map mini canvas
function makeFeatureMapCanvas(idx, size = 54) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  // Generate interesting pattern per index
  const hue = (idx * 37 + 120) % 360;
  const patterns = [
    // horizontal edges
    () => {
      for (let y = 0; y < size; y++) {
        const v = Math.abs(Math.sin(y * Math.PI / 4)) * 200 + 55;
        ctx.fillStyle = `rgba(${v * 0.6},${v},${v * 0.8},1)`;
        ctx.fillRect(0, y, size, 1);
      }
    },
    // vertical gradient
    () => {
      const g = ctx.createLinearGradient(0, 0, size, 0);
      g.addColorStop(0, `hsl(${hue},70%,20%)`);
      g.addColorStop(1, `hsl(${hue},80%,60%)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    },
    // diagonal
    () => {
      const g = ctx.createLinearGradient(0, 0, size, size);
      g.addColorStop(0, `hsl(${hue},80%,30%)`);
      g.addColorStop(0.5, `hsl(${(hue + 60) % 360},80%,50%)`);
      g.addColorStop(1, `hsl(${(hue + 120) % 360},80%,20%)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      // add some blobs
      ctx.fillStyle = `hsla(${(hue + 180) % 360},70%,70%,0.3)`;
      ctx.beginPath();
      ctx.arc(size * 0.3, size * 0.4, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    },
    // spots
    () => {
      ctx.fillStyle = `hsl(${hue},50%,10%)`;
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 12; i++) {
        const x = Math.random() * size, y = Math.random() * size;
        const r = 2 + Math.random() * 6;
        ctx.fillStyle = `hsla(${(hue + i * 20) % 360},80%,60%,0.8)`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
    },
    // grid
    () => {
      ctx.fillStyle = `hsl(${hue},40%,8%)`;
      ctx.fillRect(0, 0, size, size);
      const gs = 8;
      for (let x = 0; x < size; x += gs) {
        for (let y = 0; y < size; y += gs) {
          if ((x / gs + y / gs) % 2 === 0) {
            const v = 30 + Math.random() * 50;
            ctx.fillStyle = `hsl(${hue},${v}%,${40 + Math.random() * 20}%)`;
            ctx.fillRect(x, y, gs - 1, gs - 1);
          }
        }
      }
    },
  ];
  const p = patterns[idx % patterns.length];
  p();
  return canvas;
}

const FILTER_DESCRIPTIONS = [
  'Detecta bordas horizontais',
  'Detecta bordas verticais',
  'Detecta cantos e extremidades',
  'Realça regiões brilhantes',
  'Suprime ruído (blur)',
  'Detecta texturas de alta frequência',
  'Responde a gradientes diagonais',
  'Detecta contornos suaves',
  'Identifica regiões escuras',
  'Captura bordas em 45°',
  'Detecta padrões repetitivos',
  'Identifica regiões de alto contraste',
  'Captura formas globulares',
  'Detecta canais de baixa frequência',
  'Responde a padrões de textura',
  'Detecta transições de cor',
];

function makeFMapCard(idx, totalLabel) {
  const card = div('fmap-card');
  const cnv = makeFeatureMapCanvas(idx, 54);
  cnv.className = 'fmap-canvas';
  card.appendChild(cnv);
  const badge = div('fmap-index');
  badge.textContent = idx + 1;
  card.appendChild(badge);
  card.title = `Filtro ${idx + 1}: ${FILTER_DESCRIPTIONS[idx % FILTER_DESCRIPTIONS.length]}`;
  card.addEventListener('click', () => openFMapModal(idx));
  return card;
}

function openFMapModal(idx) {
  const cnv = makeFeatureMapCanvas(idx, 220);
  const box = document.getElementById('modalContent');
  box.innerHTML = '';
  const title = div('modal-title'); title.textContent = `Filtro ${idx + 1}`;
  const sub = div('modal-sub'); sub.textContent = FILTER_DESCRIPTIONS[idx % FILTER_DESCRIPTIONS.length];
  const desc = div('modal-desc');
  desc.textContent = `Este Feature Map visualiza o que o filtro ${idx + 1} detectou na imagem. Filtros iniciais capturam características simples (bordas, cores). Filtros mais profundos detectam padrões complexos como formas e texturas.`;
  box.append(title, sub, cnv, desc);
  document.getElementById('modalOverlay').classList.add('open');
}

// ═══════════════════════════════════════════════════════
//  RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════

function renderInput(area) {
  // Tensor 3D: imagem RGB
  const scene = div('tensor-scene');
  scene.style.alignItems = 'center';

  // Draw on canvas
  const canvas = document.createElement('canvas');
  canvas.width = 160; canvas.height = 160;
  const ctx = canvas.getContext('2d');
  // Simple synthetic "medical" image
  drawSyntheticImage(ctx, 160, 160);
  canvas.style.borderRadius = '8px';
  canvas.style.border = '2px solid #3b82f6';
  scene.appendChild(canvas);

  const dimLbl = div('tensor-dims');
  dimLbl.innerHTML = '<span>256</span> × <span>256</span> × <span>3</span>';
  dimLbl.style.setProperty('--color-border', '#3b82f6');
  scene.appendChild(dimLbl);

  // arrow
  area.appendChild(scene);
  area.appendChild(flowArrow('canais R, G, B', '#3b82f6'));

  // RGB channels
  const rgbRow = div('rgb-row');
  ['R', 'G', 'B'].forEach((ch, ci) => {
    const colors = [
      ['#7f1d1d', '#ef4444'],
      ['#14532d', '#4ade80'],
      ['#1e3a5f', '#60a5fa'],
    ];
    const card = div('rgb-card');
    const cnv = document.createElement('canvas');
    cnv.width = 80; cnv.height = 80;
    const ctx2 = cnv.getContext('2d');
    drawChannelCanvas(ctx2, 80, 80, ci);
    cnv.style.borderRadius = '6px';
    cnv.style.border = `1.5px solid ${colors[ci][1]}`;
    const lbl = div(`rgb-label ${ch.toLowerCase()}`);
    lbl.textContent = `Canal ${ch}`;
    card.append(cnv, lbl);
    rgbRow.appendChild(card);
  });
  area.appendChild(rgbRow);
}

// ── Exsiccata (herbarium specimen) drawing ──────────────────
// Draws a botanical specimen on a cream/paper background,
// with a main stem, compound leaves, and small flowers.
function drawSyntheticImage(ctx, w, h) {
  const s = w / 160; // scale factor

  // Paper / mount background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0,   '#f5f0e4');
  bg.addColorStop(0.5, '#ede8d8');
  bg.addColorStop(1,   '#e8e0cc');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Very subtle paper texture / aging spots
  ctx.save();
  for (let i = 0; i < 120; i++) {
    const px = Math.random() * w, py = Math.random() * h;
    const r  = Math.random() * 2.5 * s;
    ctx.globalAlpha = Math.random() * 0.06;
    ctx.fillStyle = Math.random() > 0.5 ? '#a08050' : '#c4b88a';
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // ── Helper: draw a leaf (ellipse + midrib + veins)
  function drawLeaf(cx, cy, rx, ry, angle, color, veinColor) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Leaf body
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = 0.6 * s;
    ctx.stroke();

    // Midrib
    ctx.beginPath();
    ctx.moveTo(-rx * 0.85, 0);
    ctx.lineTo(rx * 0.85, 0);
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = 0.7 * s;
    ctx.stroke();

    // Lateral veins
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const vx = i * rx * 0.22;
      ctx.beginPath();
      ctx.moveTo(vx, 0);
      ctx.lineTo(vx + rx * 0.1 * Math.sign(i), ry * 0.6 * Math.sign(i));
      ctx.strokeStyle = veinColor;
      ctx.lineWidth = 0.4 * s;
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── Helper: draw a small flower
  function drawFlower(cx, cy, r, petalColor, centerColor) {
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.ellipse(
        cx + Math.cos(a) * r * 0.9,
        cy + Math.sin(a) * r * 0.9,
        r * 0.55, r * 0.35, a, 0, Math.PI * 2
      );
      ctx.fillStyle = petalColor;
      ctx.globalAlpha = 0.88;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.38, 0, Math.PI * 2);
    ctx.fillStyle = centerColor;
    ctx.fill();
  }

  // ── Main stem — slightly curved, going bottom-center to top-right
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(w * 0.38, h * 0.96);
  ctx.bezierCurveTo(w * 0.40, h * 0.65, w * 0.52, h * 0.40, w * 0.62, h * 0.07);
  ctx.strokeStyle = '#5a7a3a';
  ctx.lineWidth = 2.2 * s;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  // ── Secondary branches
  const branches = [
    { t: 0.25, tx: w * 0.58, ty: h * 0.78, ex: w * 0.78, ey: h * 0.72 },
    { t: 0.50, tx: w * 0.50, ty: h * 0.56, ex: w * 0.22, ey: h * 0.48 },
    { t: 0.70, tx: w * 0.55, ty: h * 0.36, ex: w * 0.76, ey: h * 0.26 },
    { t: 0.85, tx: w * 0.58, ty: h * 0.22, ex: w * 0.30, ey: h * 0.12 },
  ];
  branches.forEach(b => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(b.tx, b.ty);
    ctx.lineTo(b.ex, b.ey);
    ctx.strokeStyle = '#5a7a3a';
    ctx.lineWidth = 1.2 * s;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  });

  // ── Leaves — compound, alternate arrangement
  const leafDefs = [
    // Along main stem
    { cx: w*0.55, cy: h*0.82, rx:14*s, ry:7*s,  a: -0.5 },
    { cx: w*0.32, cy: h*0.70, rx:16*s, ry:8*s,  a:  0.6 },
    { cx: w*0.60, cy: h*0.58, rx:13*s, ry:6*s,  a: -0.4 },
    { cx: w*0.35, cy: h*0.47, rx:15*s, ry:7*s,  a:  0.5 },
    { cx: w*0.62, cy: h*0.35, rx:12*s, ry:5.5*s,a: -0.6 },
    { cx: w*0.38, cy: h*0.25, rx:11*s, ry:5*s,  a:  0.4 },
    // On branches
    { cx: w*0.82, cy: h*0.70, rx:10*s, ry:4.5*s,a: -0.3 },
    { cx: w*0.74, cy: h*0.75, rx:10*s, ry:4.5*s,a:  0.3 },
    { cx: w*0.18, cy: h*0.48, rx:10*s, ry:4.5*s,a: -0.8 },
    { cx: w*0.26, cy: h*0.44, rx:10*s, ry:4.5*s,a:  0.2 },
    { cx: w*0.80, cy: h*0.24, rx: 9*s, ry:4*s,  a: -0.4 },
    { cx: w*0.72, cy: h*0.28, rx: 9*s, ry:4*s,  a:  0.5 },
    { cx: w*0.26, cy: h*0.10, rx: 9*s, ry:4*s,  a: -0.6 },
    { cx: w*0.34, cy: h*0.14, rx: 9*s, ry:4*s,  a:  0.3 },
    // Small basal leaves
    { cx: w*0.28, cy: h*0.90, rx:12*s, ry:5*s,  a: 1.0 },
    { cx: w*0.52, cy: h*0.92, rx:11*s, ry:4.5*s,a: -1.1 },
  ];

  // Variation in leaf color
  const leafColors   = ['#6aaa44','#5e9e3c','#72b448','#4e8e30','#60a040'];
  const veinColors   = ['#3a6020','#3a6820','#2e5818','#446828','#3a6028'];
  leafDefs.forEach((l, i) => {
    drawLeaf(l.cx, l.cy, l.rx, l.ry, l.a,
      leafColors[i % leafColors.length],
      veinColors[i % veinColors.length]
    );
  });

  // ── Flowers — at branch tips
  const flowerDefs = [
    { cx: w*0.62, cy: h*0.06, r: 8*s, p:'#e8c0d8', c:'#f0d060' },
    { cx: w*0.78, cy: h*0.22, r: 7*s, p:'#e0b8d0', c:'#f0d050' },
    { cx: w*0.20, cy: h*0.44, r: 7*s, p:'#ecc0d5', c:'#f5d458' },
    { cx: w*0.78, cy: h*0.68, r: 6*s, p:'#e8bcd4', c:'#f2d255' },
    { cx: w*0.48, cy: h*0.04, r: 6*s, p:'#ddb8cc', c:'#eecc50' },
  ];
  flowerDefs.forEach(f => drawFlower(f.cx, f.cy, f.r, f.p, f.c));

  // ── Small label box (like a real exsiccata label, bottom-right)
  const lx = w * 0.54, ly = h * 0.85, lw = w * 0.42, lh = h * 0.13;
  ctx.save();
  ctx.fillStyle = 'rgba(255,252,240,0.88)';
  ctx.strokeStyle = '#8a7050';
  ctx.lineWidth = 0.7 * s;
  ctx.beginPath();
  ctx.rect(lx, ly, lw, lh);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5a4020';
  ctx.font = `bold ${6 * s}px serif`;
  ctx.fillText('EXSICCATA', lx + 3 * s, ly + 8 * s);
  ctx.font = `${4.5 * s}px serif`;
  ctx.fillStyle = '#7a6040';
  ctx.fillText('Plantae sp. nov.', lx + 3 * s, ly + 14 * s);
  ctx.fillText('Herbário UNIOESTE · 2024', lx + 3 * s, ly + 19 * s);
  ctx.restore();
}

function drawChannelCanvas(ctx, w, h, channel) {
  // Render the exsiccata into an offscreen canvas, then extract a single channel
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  drawSyntheticImage(off.getContext('2d'), w, h);
  const src = off.getContext('2d').getImageData(0, 0, w, h);
  const dst = ctx.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const v = src.data[i * 4 + channel];
    dst.data[i * 4 + channel] = v;
    dst.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(dst, 0, 0);
}

function renderEnc1(area) {
  // Input tensor
  area.appendChild(tensorScene({
    w: 80, h: 60, d: 18,
    colorA: '#1e3a5f', colorB: '#3b82f6', borderColor: '#3b82f6',
    label: '3ch', dims: '<span>256 × 256 × 3</span>'
  }));
  area.appendChild(flowArrow('Conv 3×3 × 32', '#3b82f6'));
  area.appendChild(tensorScene({
    w: 80, h: 60, d: 44,
    colorA: '#1e3a5f', colorB: '#3b82f6', borderColor: '#3b82f6',
    label: '32ch', dims: '<span>256 × 256 × 32</span>'
  }));
  area.appendChild(flowArrow('ReLU → Feature Maps', '#f59e0b'));

  // Feature maps grid
  const grid = div('fmaps-grid');
  for (let i = 0; i < 32; i++) grid.appendChild(makeFMapCard(i));
  area.appendChild(grid);
  const hint = div('');
  hint.style.cssText = 'font-size:.72rem;color:var(--text-muted);text-align:center;margin-top:-8px';
  hint.textContent = 'Clique em um Feature Map para ampliá-lo';
  area.appendChild(hint);
}

// ── ReLU demo data (deterministic 6×6 slice) ─────────────────
const RELU_MATRIX = [
  [-2.1,  1.5, -0.3,  0.8, -1.2,  2.4],
  [ 0.0, -0.7,  1.1, -3.0,  0.5, -0.1],
  [ 1.8, -1.5,  0.2,  2.0, -0.4,  1.3],
  [-0.9,  0.6, -2.2,  0.0,  1.7, -0.8],
  [ 0.3,  2.5, -1.0,  0.4, -0.6,  0.9],
  [-1.4,  0.1,  1.6, -0.5,  0.7, -2.0],
];

function reluVal(v) { return Math.max(0, v); }

function makeReLUPlotSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '160');
  svg.setAttribute('height', '120');
  svg.setAttribute('viewBox', '0 0 160 120');
  svg.classList.add('relu-plot');

  const ox = 30, oy = 95, scale = 22;
  // axes
  svg.appendChild(svgEl('line', { x1: ox, y1: 10, x2: ox, y2: oy, stroke: '#475569', 'stroke-width': 1.5 }));
  svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: 145, y2: oy, stroke: '#475569', 'stroke-width': 1.5 }));
  // ReLU curve: x<0 flat at y=oy, x>=0 line y = oy - x*scale
  const path = svgEl('path', {
    d: `M${ox - scale * 2},${oy} L${ox},${oy} L${ox + scale * 4},${oy - scale * 4}`,
    fill: 'none', stroke: '#f59e0b', 'stroke-width': 2.5, 'stroke-linecap': 'round',
  });
  svg.appendChild(path);
  const lbl = svgEl('text', { x: 80, y: 14, 'text-anchor': 'middle', fill: '#f59e0b', 'font-size': 10, 'font-family': 'monospace', 'font-weight': 700 });
  lbl.textContent = 'ReLU(x) = max(0, x)';
  svg.appendChild(lbl);
  const xLbl = svgEl('text', { x: 148, y: oy + 12, fill: '#64748b', 'font-size': 8, 'font-family': 'monospace' });
  xLbl.textContent = 'x';
  const yLbl = svgEl('text', { x: 12, y: 14, fill: '#64748b', 'font-size': 8, 'font-family': 'monospace' });
  yLbl.textContent = 'y';
  svg.append(xLbl, yLbl);
  return svg;
}

function makeValueGrid(matrix, mode) {
  const wrap = div('relu-grid-wrap');
  const lbl = div('relu-grid-label');
  lbl.textContent = mode === 'before' ? 'Antes (pós-conv)' : 'Depois (pós-ReLU)';
  const gridEl = div('relu-grid');
  matrix.forEach(row => {
    row.forEach(v => {
      const out = mode === 'before' ? v : reluVal(v);
      const cell = div('relu-cell');
      if (mode === 'before' && out < 0) cell.classList.add('neg');
      else if (out === 0) cell.classList.add('zero');
      else cell.classList.add('pos');
      cell.textContent = Number.isInteger(out) ? out.toFixed(0) : out.toFixed(1);
      gridEl.appendChild(cell);
    });
  });
  wrap.append(lbl, gridEl);
  return wrap;
}

function makeReLUFeatureMapToggle() {
  const wrap = div('relu-fmap-toggle');
  const lbl = div('relu-fmap-label');
  lbl.textContent = 'Feature Map 1 — clique para alternar';
  wrap.appendChild(lbl);

  const size = 64;
  const preVals = [];
  for (let y = 0; y < size; y++) {
    preVals[y] = [];
    for (let x = 0; x < size; x++) {
      const v = Math.sin(x * 0.25) * Math.cos(y * 0.2) * 1.8 + (Math.random() - 0.5) * 0.6;
      preVals[y][x] = v;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  canvas.className = 'relu-fmap-canvas';
  let showPre = true;

  function drawFMap() {
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const raw = preVals[y][x];
        const v = showPre ? raw : reluVal(raw);
        const i = (y * size + x) * 4;
        if (v < 0) {
          img.data[i]     = 59;
          img.data[i + 1] = 130;
          img.data[i + 2] = 246;
          img.data[i + 3] = showPre ? 200 : 0;
        } else if (v === 0) {
          img.data[i]     = 30;
          img.data[i + 1] = 35;
          img.data[i + 2] = 45;
          img.data[i + 3] = 255;
        } else {
          const b = Math.min(255, Math.floor(v * 120 + 40));
          img.data[i]     = 30;
          img.data[i + 1] = b;
          img.data[i + 2] = 80;
          img.data[i + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    lbl.textContent = showPre ? 'Feature Map 1 — pré-ReLU (azul = negativos)' : 'Feature Map 1 — pós-ReLU (negativos zerados)';
  }

  canvas.addEventListener('click', () => { showPre = !showPre; drawFMap(); });
  drawFMap();
  wrap.appendChild(canvas);
  return wrap;
}

function renderReLU(area) {
  const topRow = div('relu-demo-row');
  topRow.appendChild(makeReLUPlotSVG());
  topRow.appendChild(makeValueGrid(RELU_MATRIX, 'before'));
  const arrowH = div('relu-arrow-h');
  arrowH.innerHTML = '<svg width="40" height="20" viewBox="0 0 40 20"><line x1="4" y1="10" x2="32" y2="10" stroke="#f59e0b" stroke-width="2"/><polygon points="28,5 36,10 28,15" fill="#f59e0b"/></svg>';
  topRow.appendChild(arrowH);
  topRow.appendChild(makeValueGrid(RELU_MATRIX, 'after'));
  area.appendChild(topRow);

  area.appendChild(flowArrow('element-wise em cada Feature Map', '#f59e0b'));

  const flow = div('relu-flow');
  flow.appendChild(tensorScene({
    w: 72, h: 54, d: 44,
    colorA: '#1e3a5f', colorB: '#3b82f6', borderColor: '#3b82f6',
    label: '32ch', dims: '<span>256 × 256 × 32</span>'
  }));
  const arr = div('');
  arr.innerHTML = '<svg width="48" height="20" viewBox="0 0 48 20"><line x1="4" y1="10" x2="38" y2="10" stroke="#f59e0b" stroke-width="2"/><polygon points="34,4 44,10 34,16" fill="#f59e0b"/></svg>';
  flow.appendChild(arr);
  const reluBox = div('relu-box');
  reluBox.textContent = 'ReLU';
  flow.appendChild(reluBox);
  const arr2 = div('');
  arr2.innerHTML = '<svg width="48" height="20" viewBox="0 0 48 20"><line x1="4" y1="10" x2="38" y2="10" stroke="#f59e0b" stroke-width="2"/><polygon points="34,4 44,10 34,16" fill="#f59e0b"/></svg>';
  flow.appendChild(arr2);
  flow.appendChild(tensorScene({
    w: 72, h: 54, d: 44,
    colorA: '#422006', colorB: '#f59e0b', borderColor: '#f59e0b',
    label: '32ch', dims: '<span>256 × 256 × 32</span>'
  }));
  area.appendChild(flow);

  area.appendChild(makeReLUFeatureMapToggle());
}

function renderEnc2(area) {
  area.appendChild(tensorScene({
    w: 72, h: 54, d: 44,
    colorA: '#1e3a5f', colorB: '#3b82f6', borderColor: '#3b82f6',
    label: '32ch', dims: '<span>128 × 128 × 32</span>'
  }));
  area.appendChild(flowArrow('Conv 3×3 × 64', '#3b82f6'));
  area.appendChild(tensorScene({
    w: 72, h: 54, d: 72,
    colorA: '#1e3a5f', colorB: '#3b82f6', borderColor: '#3b82f6',
    label: '64ch', dims: '<span>128 × 128 × 64</span>'
  }));
  area.appendChild(flowArrow('Feature Maps', '#3b82f6'));
  const grid = div('fmaps-grid');
  for (let i = 0; i < 24; i++) grid.appendChild(makeFMapCard(i));
  const note = div('');
  note.style.cssText = 'font-size:.72rem;color:var(--text-muted);text-align:center';
  note.textContent = 'Mostrando 24 de 64 Feature Maps';
  area.appendChild(grid);
  area.appendChild(note);
}

function renderPool(area, step) {
  const data = step.data || { before: '256×256', after: '128×128', channels: 32 };

  // Show before grid
  const demo = div('pool-demo');
  const beforeGroup = div('');
  beforeGroup.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px';

  const bLbl = div(''); bLbl.style.cssText = 'font-size:.72rem;color:var(--text-muted);font-weight:600';
  bLbl.textContent = 'Antes: ' + data.before;

  const bGrid = div('pool-grid');
  bGrid.style.gridTemplateColumns = 'repeat(6, 22px)';
  const vals = [];
  for (let i = 0; i < 36; i++) {
    const v = Math.floor(Math.random() * 200 + 30);
    vals.push(v);
    const cell = div('pool-cell'); cell.textContent = v > 150 ? '●' : '';
    cell.style.background = `rgba(59,130,246,${v / 255})`;
    bGrid.appendChild(cell);
  }
  beforeGroup.append(bLbl, bGrid);

  // Arrow
  const arrowDiv = div('flow-arrow');
  arrowDiv.style.cssText = 'flex-direction:row;gap:8px;align-items:center';
  const arr = div('arrow-line');
  arr.style.cssText = 'width:40px;height:2px;background:var(--encoder);position:relative;border-radius:1px';
  arr.style.setProperty('--arrow-color', '#3b82f6');
  const arLbl = div('arrow-label'); arLbl.textContent = 'MaxPool 2×2';
  arrowDiv.append(arLbl, arr);

  // After grid
  const afterGroup = div('');
  afterGroup.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px';
  const aLbl = div(''); aLbl.style.cssText = 'font-size:.72rem;color:var(--decoder);font-weight:600';
  aLbl.textContent = 'Depois: ' + data.after;
  const aGrid = div('pool-grid');
  aGrid.style.borderColor = 'var(--decoder)';
  aGrid.style.background = 'var(--decoder-bg)';
  aGrid.style.gridTemplateColumns = 'repeat(3, 22px)';
  for (let i = 0; i < 9; i++) {
    const v = Math.max(...[0, 1, 6, 7].map(offset => vals[Math.floor(i / 3) * 12 + (i % 3) * 2 + offset] || 0));
    const cell = div('pool-cell selected'); cell.textContent = v > 150 ? '●' : '';
    cell.style.background = `rgba(34,197,94,${v / 255})`;
    cell.style.borderColor = 'var(--decoder)';
    aGrid.appendChild(cell);
  }
  afterGroup.append(aLbl, aGrid);
  demo.append(beforeGroup, arrowDiv, afterGroup);
  area.appendChild(demo);

  // Tensor comparison
  const row = div(''); row.style.cssText = 'display:flex;gap:28px;align-items:center;margin-top:8px;flex-wrap:wrap;justify-content:center';
  row.appendChild(tensorScene({ w: 68, h: 52, d: 50, colorA: '#1e3a5f', colorB: '#3b82f6', borderColor: '#3b82f6', label: '', dims: `<span>${data.before}×${data.channels}</span>` }));
  const arRow = div('flow-arrow'); arRow.style.flexDirection = 'row';
  const l = div('arrow-line'); l.style.cssText = 'width:44px;height:2px;transform:none;background:linear-gradient(to right,var(--encoder),var(--decoder))';
  arRow.appendChild(l);
  row.appendChild(arRow);
  row.appendChild(tensorScene({ w: 50, h: 38, d: 50, colorA: '#0f2e1a', colorB: '#22c55e', borderColor: '#22c55e', label: '', dims: `<span>${data.after}×${data.channels}</span>` }));
  area.appendChild(row);
}

function renderResLadder(area, step) {
  const steps = step.data.steps;
  const colorMap = { encoder: ['#1e3a5f', '#3b82f6'], decoder: ['#0f2e1a', '#22c55e'] };

  const ladder = div('res-ladder');
  steps.forEach((s, idx) => {
    const [ca, cb] = colorMap[s.color] || colorMap.encoder;
    const sc = div('res-step');
    sc.style.animationDelay = `${idx * 0.15}s`;
    const tensor = tensorScene({ w: s.w, h: s.h, d: Math.min(50, 16 + idx * 10), colorA: ca, colorB: cb, borderColor: cb, label: '', dims: `<span>${s.dims}</span>` });
    sc.appendChild(tensor);
    ladder.appendChild(sc);
    if (idx < steps.length - 1) {
      const arr = flowArrow('MaxPool + Conv', cb);
      arr.style.animationDelay = `${idx * 0.15 + 0.1}s`;
      ladder.appendChild(arr);
    }
  });
  area.appendChild(ladder);
}

function renderBottleneck(area) {
  const wrap = div('');
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:20px';

  // SVG bottleneck shape
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '320');
  svg.setAttribute('height', '140');
  svg.setAttribute('viewBox', '0 0 320 140');

  const path = svgEl('path', {
    d: 'M20,20 C20,20 140,60 160,80 C180,60 300,20 300,20 L300,120 C300,120 180,80 160,100 C140,80 20,120 20,120 Z',
    fill: 'none', stroke: '#f97316', 'stroke-width': '2', opacity: '0.4'
  });

  // Center glowing rect
  const bnRect = svgEl('rect', { x: 120, y: 40, width: 80, height: 60, rx: 8, fill: '#3d1f05', stroke: '#f97316', 'stroke-width': 2 });

  const bnText = svgEl('text', { x: 160, y: 65, 'text-anchor': 'middle', fill: '#f97316', 'font-size': 10, 'font-family': 'monospace', 'font-weight': 700 });
  bnText.textContent = '16×16×512';
  const bnText2 = svgEl('text', { x: 160, y: 80, 'text-anchor': 'middle', fill: '#94a3b8', 'font-size': 9, 'font-family': 'monospace' });
  bnText2.textContent = 'Bottleneck';

  // Left arrows
  [30, 55, 80].forEach((y, i) => {
    const a = svgEl('line', { x1: 20, y1: y, x2: 118, y2: 68, stroke: '#3b82f6', 'stroke-width': 1.5, opacity: 0.6 });
    const lbl = svgEl('text', { x: 14, y: y + 4, 'font-size': 8, fill: '#64748b', 'font-family': 'monospace', 'text-anchor': 'end' });
    lbl.textContent = ['32×32×256', '64×64×128', '128×128×64'][i];
    svg.append(a, lbl);
  });

  // Right arrows
  [30, 55, 80].forEach((y, i) => {
    const a = svgEl('line', { x1: 202, y1: 68, x2: 300, y2: y, stroke: '#22c55e', 'stroke-width': 1.5, opacity: 0.6 });
    const lbl = svgEl('text', { x: 306, y: y + 4, 'font-size': 8, fill: '#64748b', 'font-family': 'monospace' });
    lbl.textContent = ['32×32×256', '64×64×128', '128×128×64'][i];
    svg.append(a, lbl);
  });

  svg.append(path, bnRect, bnText, bnText2);
  svg.classList.add('bottleneck-glow');
  wrap.appendChild(svg);

  // Tensor
  const ts = tensorScene({ w: 30, h: 25, d: 60, colorA: '#3d1f05', colorB: '#f97316', borderColor: '#f97316', label: '', dims: '<span style="color:var(--bottleneck)">16 × 16 × 512</span>' });
  ts.style.marginTop = '-10px';
  wrap.appendChild(ts);

  area.appendChild(wrap);
}

function renderSkipConnection(area) {
  const wrap = div('skip-demo');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '480');
  svg.setAttribute('height', '200');
  svg.setAttribute('viewBox', '0 0 480 200');

  // Encoder block (left)
  const encRect = svgEl('rect', { x: 20, y: 60, width: 90, height: 80, rx: 8, fill: '#1e3a5f', stroke: '#3b82f6', 'stroke-width': 2 });
  const encTxt  = svgEl('text', { x: 65, y: 95, 'text-anchor': 'middle', fill: '#3b82f6', 'font-size': 9, 'font-family': 'monospace', 'font-weight': 700 });
  encTxt.textContent = 'Encoder 4';
  const encTxt2 = svgEl('text', { x: 65, y: 110, 'text-anchor': 'middle', fill: '#94a3b8', 'font-size': 8, 'font-family': 'monospace' });
  encTxt2.textContent = '32×32×256';

  // Decoder block (right)
  const decRect = svgEl('rect', { x: 370, y: 60, width: 90, height: 80, rx: 8, fill: '#0f2e1a', stroke: '#22c55e', 'stroke-width': 2 });
  const decTxt  = svgEl('text', { x: 415, y: 95, 'text-anchor': 'middle', fill: '#22c55e', 'font-size': 9, 'font-family': 'monospace', 'font-weight': 700 });
  decTxt.textContent = 'Decoder 1';
  const decTxt2 = svgEl('text', { x: 415, y: 110, 'text-anchor': 'middle', fill: '#94a3b8', 'font-size': 8, 'font-family': 'monospace' });
  decTxt2.textContent = '32×32×256';

  // Skip path (curved arc on top)
  const skipPath = svgEl('path', {
    d: 'M 110,100 C 200,20 300,20 370,100',
    fill: 'none', stroke: '#a855f7', 'stroke-width': 2.5,
    'stroke-dasharray': '6,3',
  });
  const skipLbl = svgEl('text', { x: 240, y: 22, 'text-anchor': 'middle', fill: '#a855f7', 'font-size': 9, 'font-family': 'monospace', 'font-weight': 700 });
  skipLbl.textContent = 'Skip Connection — 32×32×256';

  // Down arrow into decoder
  const downArrow = svgEl('line', { x1: 240, y1: 130, x2: 240, y2: 165, stroke: '#f97316', 'stroke-width': 2 });
  const downLabel = svgEl('text', { x: 240, y: 180, 'text-anchor': 'middle', fill: '#f97316', 'font-size': 9, 'font-family': 'monospace' });
  downLabel.textContent = 'UpConv: 16×16×512 → 32×32×256';

  // Upconv block
  const upRect = svgEl('rect', { x: 185, y: 60, width: 110, height: 60, rx: 8, fill: '#3d1f05', stroke: '#f97316', 'stroke-width': 2 });
  const upTxt  = svgEl('text', { x: 240, y: 88, 'text-anchor': 'middle', fill: '#f97316', 'font-size': 9, 'font-family': 'monospace', 'font-weight': 700 });
  upTxt.textContent = 'UpConv 2×2';
  const upTxt2 = svgEl('text', { x: 240, y: 103, 'text-anchor': 'middle', fill: '#94a3b8', 'font-size': 8, 'font-family': 'monospace' });
  upTxt2.textContent = '16×16×512→32×32×256';

  // Arrow from upconv to concat with decoder
  const arrowDec = svgEl('line', { x1: 295, y1: 100, x2: 368, y2: 100, stroke: '#22c55e', 'stroke-width': 2 });
  const concatLbl = svgEl('text', { x: 330, y: 118, 'text-anchor': 'middle', fill: '#22c55e', 'font-size': 8, 'font-family': 'monospace' });
  concatLbl.textContent = 'Concat →512ch';

  // Animated packet on skip
  const packet = svgEl('circle', { r: 7, fill: '#a855f7', opacity: 0.9 });
  const animEl = svgEl('animateMotion', { dur: '2s', repeatCount: 'indefinite' });
  const mpath = svgEl('mpath');
  // Reference the skip path
  skipPath.id = 'skipPathSvg';
  mpath.setAttribute('href', '#skipPathSvg');
  animEl.appendChild(mpath);
  packet.appendChild(animEl);

  svg.append(encRect, encTxt, encTxt2, decRect, decTxt, decTxt2, skipPath, skipLbl, upRect, upTxt, upTxt2, arrowDec, concatLbl, downArrow, downLabel, packet);
  wrap.appendChild(svg);
  area.appendChild(wrap);

  // Legend
  const legend = div('');
  legend.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;justify-content:center;font-size:.72rem;color:var(--text-muted)';
  [['#3b82f6','Encoder'],['#f97316','UpConv'],['#a855f7','Skip Connection'],['#22c55e','Decoder']].forEach(([c, l]) => {
    const item = div(''); item.style.cssText = `display:flex;align-items:center;gap:5px`;
    const dot = div(''); dot.style.cssText = `width:10px;height:10px;border-radius:99px;background:${c}`;
    const lbl = div(''); lbl.textContent = l;
    item.append(dot, lbl);
    legend.appendChild(item);
  });
  area.appendChild(legend);
}

function renderUpsampling(area) {
  // Show 4×4 grid expanding to 8×8
  const demo = div('upsample-demo');

  const beforeWrap = div(''); beforeWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px';
  const bLbl = div(''); bLbl.style.cssText = 'font-size:.72rem;color:var(--bottleneck);font-weight:600';
  bLbl.textContent = 'Antes (4×4)';
  const bGrid = div('upsample-grid');
  bGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4,32px);border-color:var(--bottleneck);background:var(--bottleneck-bg)';
  const srcVals = [];
  for (let i = 0; i < 16; i++) {
    const v = Math.floor(Math.random() * 200 + 30);
    srcVals.push(v);
    const cell = div('upsample-cell filled'); cell.style.cssText = `width:32px;height:32px;background:rgba(249,115,22,${v / 255});border-color:var(--bottleneck);font-size:.65rem`;
    cell.textContent = v;
    bGrid.appendChild(cell);
  }
  beforeWrap.append(bLbl, bGrid);

  const arrDiv = div('');
  arrDiv.style.cssText = 'display:flex;align-items:center;justify-content:center';
  arrDiv.innerHTML = '<svg width="48" height="24" viewBox="0 0 48 24"><line x1="4" y1="12" x2="40" y2="12" stroke="#22c55e" stroke-width="2"/><polygon points="36,6 44,12 36,18" fill="#22c55e"/></svg>';

  const afterWrap = div(''); afterWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px';
  const aLbl = div(''); aLbl.style.cssText = 'font-size:.72rem;color:var(--decoder);font-weight:600';
  aLbl.textContent = 'Depois (8×8)';
  const aGrid = div('upsample-grid');
  aGrid.style.cssText = 'display:grid;grid-template-columns:repeat(8,20px);border-color:var(--decoder);background:var(--decoder-bg)';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sr = Math.floor(r / 2), sc2 = Math.floor(c / 2);
      const src = srcVals[sr * 4 + sc2];
      // bilinear-ish
      const isExact = (r % 2 === 0 && c % 2 === 0);
      const cell = div(isExact ? 'upsample-cell filled' : 'upsample-cell interp');
      cell.style.cssText = `width:20px;height:20px;background:rgba(34,197,94,${src / 255 * (isExact ? 1 : 0.5)});border-color:${isExact ? 'var(--decoder)' : 'var(--border)'};font-size:.5rem`;
      aGrid.appendChild(cell);
    }
  }
  afterWrap.append(aLbl, aGrid);
  demo.append(beforeWrap, arrDiv, afterWrap);
  area.appendChild(demo);

  area.appendChild(flowArrow('UpConv 2×2', '#22c55e'));
  const row = div(''); row.style.cssText = 'display:flex;gap:28px;align-items:center;flex-wrap:wrap;justify-content:center';
  row.appendChild(tensorScene({ w: 30, h: 25, d: 60, colorA: '#3d1f05', colorB: '#f97316', borderColor: '#f97316', label: '', dims: '<span>16 × 16 × 512</span>' }));
  const arrH = div(''); arrH.innerHTML = '<svg width="48" height="20" viewBox="0 0 48 20"><line x1="4" y1="10" x2="38" y2="10" stroke="#22c55e" stroke-width="2"/><polygon points="34,4 44,10 34,16" fill="#22c55e"/></svg>';
  row.appendChild(arrH);
  row.appendChild(tensorScene({ w: 48, h: 38, d: 50, colorA: '#0f2e1a', colorB: '#22c55e', borderColor: '#22c55e', label: '', dims: '<span>32 × 32 × 256</span>' }));
  area.appendChild(row);
}

function renderConcat(area, step) {
  const encCh = 256, decCh = 256;

  const demo = div('concat-demo');

  // Encoder block
  const encBlock = div('concat-block');
  const encBar = div('concat-bar');
  encBar.style.cssText = `height:${encCh / 8}px;background:linear-gradient(180deg,var(--encoder-bg),var(--encoder))70%;border:1.5px solid var(--encoder);color:#fff`;
  encBar.textContent = `${encCh}ch`;
  const encLbl = div(''); encLbl.style.cssText = 'font-size:.68rem;color:var(--encoder);font-weight:600;text-align:center';
  encLbl.textContent = 'Encoder\n(Skip)';
  encBlock.append(encBar, encLbl);

  const plus = div('concat-op'); plus.textContent = '+';

  // Decoder block
  const decBlock = div('concat-block');
  const decBar = div('concat-bar');
  decBar.style.cssText = `height:${decCh / 8}px;background:linear-gradient(180deg,var(--bottleneck-bg),var(--bottleneck));border:1.5px solid var(--bottleneck);color:#fff`;
  decBar.textContent = `${decCh}ch`;
  const decLbl = div(''); decLbl.style.cssText = 'font-size:.68rem;color:var(--bottleneck);font-weight:600;text-align:center';
  decLbl.textContent = 'Decoder\n(UpConv)';
  decBlock.append(decBar, decLbl);

  const eq = div('concat-op'); eq.textContent = '=';

  // Result
  const resBlock = div('concat-block');
  const resBar = div('concat-bar');
  const totalCh = encCh + decCh;
  resBar.style.cssText = `height:${totalCh / 8}px;background:linear-gradient(180deg,var(--encoder-bg) 50%,var(--bottleneck-bg) 50%);border:1.5px solid var(--skip);color:#fff`;
  resBar.textContent = `${totalCh}ch`;
  const resLbl = div(''); resLbl.style.cssText = 'font-size:.68rem;color:var(--skip);font-weight:600;text-align:center';
  resLbl.textContent = 'Concatenado';
  resBlock.append(resBar, resLbl);

  demo.append(encBlock, plus, decBlock, eq, resBlock);
  area.appendChild(demo);

  // Tensor viz
  area.appendChild(flowArrow('Concatenação (eixo dos canais)', '#a855f7'));
  const row = div(''); row.style.cssText = 'display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center';
  row.appendChild(tensorScene({ w: 42, h: 32, d: 40, colorA: '#1e3a5f', colorB: '#3b82f6', borderColor: '#3b82f6', label: '256', dims: '<span>32 × 32 × 256</span>' }));
  const plus2 = div(''); plus2.style.cssText = 'font-size:1.5rem;color:var(--text-muted)'; plus2.textContent = '+';
  row.appendChild(plus2);
  row.appendChild(tensorScene({ w: 42, h: 32, d: 40, colorA: '#3d1f05', colorB: '#f97316', borderColor: '#f97316', label: '256', dims: '<span>32 × 32 × 256</span>' }));
  const eq2 = div(''); eq2.style.cssText = 'font-size:1.5rem;color:var(--text-muted)'; eq2.textContent = '=';
  row.appendChild(eq2);
  row.appendChild(tensorScene({ w: 42, h: 32, d: 68, colorA: '#2d1b4e', colorB: '#a855f7', borderColor: '#a855f7', label: '512', dims: '<span>32 × 32 × 512</span>' }));
  area.appendChild(row);
}

function renderDecoder(area) {
  const stages = [
    { label: 'UpConv + Concat', dims: '32×32×512', ca: '#2d1b4e', cb: '#a855f7', w: 42, h: 32, d: 68 },
    { label: 'Conv 3×3', dims: '32×32×256', ca: '#0f2e1a', cb: '#22c55e', w: 42, h: 32, d: 44 },
    { label: 'UpConv + Concat', dims: '64×64×256', ca: '#2d1b4e', cb: '#a855f7', w: 55, h: 42, d: 50 },
    { label: 'Conv 3×3', dims: '64×64×128', ca: '#0f2e1a', cb: '#22c55e', w: 55, h: 42, d: 35 },
  ];
  const wrap = div(''); wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0';
  stages.forEach((s, i) => {
    const sc = div('res-step'); sc.style.animationDelay = `${i * 0.2}s`;
    sc.appendChild(tensorScene({ w: s.w, h: s.h, d: s.d, colorA: s.ca, colorB: s.cb, borderColor: s.cb, label: '', dims: `<span>${s.dims}</span>` }));
    wrap.appendChild(sc);
    if (i < stages.length - 1) {
      const arr = flowArrow(stages[i + 1].label, i % 2 === 0 ? '#22c55e' : '#a855f7');
      wrap.appendChild(arr);
    }
  });
  area.appendChild(wrap);
}

function renderFullResolution(area) {
  const stages = [
    { dims: '16×16×512',  ca: '#3d1f05', cb: '#f97316', w: 22,  h: 18,  d: 68 },
    { dims: '32×32×256',  ca: '#2d1b4e', cb: '#a855f7', w: 32,  h: 24,  d: 50 },
    { dims: '64×64×128',  ca: '#0f2e1a', cb: '#22c55e', w: 44,  h: 34,  d: 38 },
    { dims: '128×128×64', ca: '#0f2e1a', cb: '#22c55e', w: 58,  h: 44,  d: 28 },
    { dims: '256×256×32', ca: '#0f2e1a', cb: '#22c55e', w: 76,  h: 58,  d: 18 },
  ];
  const wrap = div(''); wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0';
  stages.forEach((s, i) => {
    const sc = div('res-step'); sc.style.animationDelay = `${i * 0.18}s`;
    sc.appendChild(tensorScene({ ...s, borderColor: s.cb, label: '', dims: `<span>${s.dims}</span>` }));
    wrap.appendChild(sc);
    if (i < stages.length - 1) {
      wrap.appendChild(flowArrow('UpConv + Skip + Conv', '#22c55e'));
    }
  });
  area.appendChild(wrap);

  // final 1×1 conv
  area.appendChild(flowArrow('Conv 1×1', '#fbbf24'));
  area.appendChild(tensorScene({ w: 76, h: 58, d: 10, colorA: '#2d2305', colorB: '#fbbf24', borderColor: '#fbbf24', label: 'classes', dims: '<span>256 × 256 × N_classes</span>' }));
}

function renderOutput(area) {
  const row = div('output-row');

  // Original image
  const orig = div('output-card');
  const c1 = document.createElement('canvas'); c1.width = 140; c1.height = 140;
  drawSyntheticImage(c1.getContext('2d'), 140, 140);
  const l1 = div('output-card-label'); l1.textContent = 'Imagem Original';
  orig.append(c1, l1);

  // Mask
  const mask = div('output-card');
  const c2 = document.createElement('canvas'); c2.width = 140; c2.height = 140;
  drawMask(c2.getContext('2d'), 140, 140);
  const l2 = div('output-card-label'); l2.style.color = 'var(--decoder)'; l2.textContent = 'Máscara Predita';
  mask.append(c2, l2);

  // Overlay
  const overlay = div('output-card');
  const c3 = document.createElement('canvas'); c3.width = 140; c3.height = 140;
  drawOverlay(c3.getContext('2d'), 140, 140);
  const l3 = div('output-card-label'); l3.style.color = 'var(--skip)'; l3.textContent = 'Segmentação Final';
  overlay.append(c3, l3);

  row.append(orig, mask, overlay);
  area.appendChild(row);

  // Success note
  const note = div('expl-highlight green');
  note.style.marginTop = '8px';
  note.textContent = '✓ A U-Net segmentou a imagem com precisão, preservando detalhes finos graças às Skip Connections.';
  area.appendChild(note);
}

function drawMask(ctx, w, h) {
  const s = w / 160;
  // Black background (fundo = classe 0)
  ctx.fillStyle = '#080c08';
  ctx.fillRect(0, 0, w, h);

  // Stem (classe 1 — planta: caule, folhas e flores)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(w * 0.38, h * 0.97);
  ctx.bezierCurveTo(w * 0.40, h * 0.65, w * 0.52, h * 0.40, w * 0.62, h * 0.07);
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 3.5 * s;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  // Leaves as filled regions (classe 1)
  const leafDefs = [
    { cx: w*0.55, cy: h*0.82, rx:14*s, ry:7*s,  a: -0.5 },
    { cx: w*0.32, cy: h*0.70, rx:16*s, ry:8*s,  a:  0.6 },
    { cx: w*0.60, cy: h*0.58, rx:13*s, ry:6*s,  a: -0.4 },
    { cx: w*0.35, cy: h*0.47, rx:15*s, ry:7*s,  a:  0.5 },
    { cx: w*0.62, cy: h*0.35, rx:12*s, ry:5.5*s,a: -0.6 },
    { cx: w*0.38, cy: h*0.25, rx:11*s, ry:5*s,  a:  0.4 },
    { cx: w*0.82, cy: h*0.70, rx:10*s, ry:4.5*s,a: -0.3 },
    { cx: w*0.74, cy: h*0.75, rx:10*s, ry:4.5*s,a:  0.3 },
    { cx: w*0.18, cy: h*0.48, rx:10*s, ry:4.5*s,a: -0.8 },
    { cx: w*0.26, cy: h*0.44, rx:10*s, ry:4.5*s,a:  0.2 },
    { cx: w*0.80, cy: h*0.24, rx: 9*s, ry:4*s,  a: -0.4 },
    { cx: w*0.72, cy: h*0.28, rx: 9*s, ry:4*s,  a:  0.5 },
    { cx: w*0.26, cy: h*0.10, rx: 9*s, ry:4*s,  a: -0.6 },
    { cx: w*0.34, cy: h*0.14, rx: 9*s, ry:4*s,  a:  0.3 },
    { cx: w*0.28, cy: h*0.90, rx:12*s, ry:5*s,  a: 1.0  },
    { cx: w*0.52, cy: h*0.92, rx:11*s, ry:4.5*s,a: -1.1 },
  ];
  leafDefs.forEach(l => {
    ctx.save();
    ctx.translate(l.cx, l.cy);
    ctx.rotate(l.a);
    ctx.beginPath();
    ctx.ellipse(0, 0, l.rx, l.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();
    ctx.restore();
  });

  // Flowers (classe 1 — planta)
  const flowerDefs = [
    { cx: w*0.62, cy: h*0.06, r: 8*s },
    { cx: w*0.78, cy: h*0.22, r: 7*s },
    { cx: w*0.20, cy: h*0.44, r: 7*s },
    { cx: w*0.78, cy: h*0.68, r: 6*s },
    { cx: w*0.48, cy: h*0.04, r: 6*s },
  ];
  flowerDefs.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.cx, f.cy, f.r * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();
  });
}

function drawOverlay(ctx, w, h) {
  const s = w / 160;
  drawSyntheticImage(ctx, w, h);

  // Semi-transparent green over leaves
  ctx.globalAlpha = 0.38;
  const leafDefs = [
    { cx: w*0.55, cy: h*0.82, rx:14*s, ry:7*s,  a: -0.5 },
    { cx: w*0.32, cy: h*0.70, rx:16*s, ry:8*s,  a:  0.6 },
    { cx: w*0.60, cy: h*0.58, rx:13*s, ry:6*s,  a: -0.4 },
    { cx: w*0.35, cy: h*0.47, rx:15*s, ry:7*s,  a:  0.5 },
    { cx: w*0.62, cy: h*0.35, rx:12*s, ry:5.5*s,a: -0.6 },
    { cx: w*0.38, cy: h*0.25, rx:11*s, ry:5*s,  a:  0.4 },
    { cx: w*0.82, cy: h*0.70, rx:10*s, ry:4.5*s,a: -0.3 },
    { cx: w*0.74, cy: h*0.75, rx:10*s, ry:4.5*s,a:  0.3 },
    { cx: w*0.18, cy: h*0.48, rx:10*s, ry:4.5*s,a: -0.8 },
    { cx: w*0.26, cy: h*0.44, rx:10*s, ry:4.5*s,a:  0.2 },
    { cx: w*0.80, cy: h*0.24, rx: 9*s, ry:4*s,  a: -0.4 },
    { cx: w*0.72, cy: h*0.28, rx: 9*s, ry:4*s,  a:  0.5 },
    { cx: w*0.26, cy: h*0.10, rx: 9*s, ry:4*s,  a: -0.6 },
    { cx: w*0.34, cy: h*0.14, rx: 9*s, ry:4*s,  a:  0.3 },
    { cx: w*0.28, cy: h*0.90, rx:12*s, ry:5*s,  a: 1.0  },
    { cx: w*0.52, cy: h*0.92, rx:11*s, ry:4.5*s,a: -1.1 },
  ];
  leafDefs.forEach(l => {
    ctx.save();
    ctx.translate(l.cx, l.cy);
    ctx.rotate(l.a);
    ctx.beginPath();
    ctx.ellipse(0, 0, l.rx, l.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#4ade80';
    ctx.fill();
    ctx.restore();
  });

  // Flowers (classe 1 — planta)
  const flowerDefs = [
    { cx: w*0.62, cy: h*0.06, r: 8*s },
    { cx: w*0.78, cy: h*0.22, r: 7*s },
    { cx: w*0.20, cy: h*0.44, r: 7*s },
    { cx: w*0.78, cy: h*0.68, r: 6*s },
    { cx: w*0.48, cy: h*0.04, r: 6*s },
  ];
  flowerDefs.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.cx, f.cy, f.r * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = '#4ade80';
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Contour lines on leaves
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 1.2 * s;
  leafDefs.forEach(l => {
    ctx.save();
    ctx.translate(l.cx, l.cy);
    ctx.rotate(l.a);
    ctx.beginPath();
    ctx.ellipse(0, 0, l.rx, l.ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

// ═══════════════════════════════════════════════════════
//  ARCHITECTURE TREE
// ═══════════════════════════════════════════════════════
function buildArchTree() {
  const tree = document.getElementById('archTree');
  tree.innerHTML = '';
  const colorMap = { input: '', encoder: 'type-encoder', activation: 'type-activation', pool: 'type-pool', bottleneck: 'type-bottleneck', decoder: 'type-decoder', output: 'type-output' };
  ARCH_NODES.forEach((node, idx) => {
    const nodeEl = div('arch-node');
    const label  = div(`arch-node-label ${colorMap[node.type] || ''}`);
    label.textContent = node.label;
    label.dataset.id = node.id;
    nodeEl.appendChild(label);
    nodeEl.addEventListener('click', () => {
      const stepIdx = STEPS.findIndex(s => s.archNode === node.id);
      if (stepIdx >= 0) { currentStep = stepIdx; renderStep(); }
    });
    tree.appendChild(nodeEl);
    if (idx < ARCH_NODES.length - 1) {
      tree.appendChild(div('arch-connector'));
    }
  });
}

function highlightArchNode(nodeId) {
  document.querySelectorAll('.arch-node-label').forEach(el => el.classList.remove('active'));
  const active = document.querySelector(`.arch-node-label[data-id="${nodeId}"]`);
  if (active) { active.classList.add('active'); active.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
}

// ═══════════════════════════════════════════════════════
//  EXPLANATION PANEL
// ═══════════════════════════════════════════════════════
function buildExplanation(exp) {
  const box = document.getElementById('explanationBox');
  box.innerHTML = '';
  if (!exp) return;

  if (exp.tag) {
    const chip = div(`tag-chip tag-${exp.tag}`);
    chip.textContent = exp.tag.charAt(0).toUpperCase() + exp.tag.slice(1);
    box.appendChild(chip);
  }

  (exp.sections || []).forEach(s => {
    const sec = div('expl-section');
    if (s.heading) {
      const h = div('expl-heading'); h.textContent = s.heading; sec.appendChild(h);
    }
    if (s.tensor) {
      const t = div('expl-tensor');
      s.tensor.forEach(line => {
        const row = document.createElement('div');
        row.innerHTML = `<span>${line}</span>`;
        t.appendChild(row);
      });
      sec.appendChild(t);
    } else if (s.body) {
      if (s.style && s.style.startsWith('highlight')) {
        const h = div(`expl-highlight ${s.style.replace('highlight','').trim()}`);
        h.textContent = s.body;
        sec.appendChild(h);
      } else {
        const b = div('expl-body'); b.textContent = s.body; sec.appendChild(b);
      }
    }
    box.appendChild(sec);
  });
}

// ═══════════════════════════════════════════════════════
//  STEP DOTS
// ═══════════════════════════════════════════════════════
function buildDots() {
  const dots = document.getElementById('stepDots');
  dots.innerHTML = '';
  STEPS.forEach((_, i) => {
    const d = div('step-dot');
    if (i === currentStep) d.classList.add('active');
    d.addEventListener('click', () => { currentStep = i; renderStep(); });
    dots.appendChild(d);
  });
}

function updateDots() {
  document.querySelectorAll('.step-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentStep);
  });
}

// ═══════════════════════════════════════════════════════
//  PROGRESS BAR
// ═══════════════════════════════════════════════════════
function updateProgress() {
  const pct = ((currentStep + 1) / STEPS.length) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `Etapa ${currentStep + 1} / ${STEPS.length}`;
}

// ═══════════════════════════════════════════════════════
//  MAIN RENDER
// ═══════════════════════════════════════════════════════
function renderStep() {
  const step = STEPS[currentStep];
  const area = document.getElementById('canvasArea');

  // Fade out
  area.style.opacity = '0';
  setTimeout(() => {
    area.innerHTML = '';
    // Call render function
    if (step.render) step.render(area, step);
    area.style.opacity = '1';
  }, 200);

  // Header
  document.getElementById('stepBadge').textContent  = step.badge;
  document.getElementById('stepTitle').textContent  = step.title;

  // Arch highlight
  highlightArchNode(step.archNode);

  // Explanation
  buildExplanation(step.explanation);

  // Controls
  document.getElementById('btnPrev').disabled = currentStep === 0;
  document.getElementById('btnNext').disabled = currentStep === STEPS.length - 1;

  updateProgress();
  updateDots();
  updateUMap();
}

// ═══════════════════════════════════════════════════════
//  CONTROLS
// ═══════════════════════════════════════════════════════
document.getElementById('btnNext').addEventListener('click', () => {
  if (currentStep < STEPS.length - 1) { currentStep++; renderStep(); }
});
document.getElementById('btnPrev').addEventListener('click', () => {
  if (currentStep > 0) { currentStep--; renderStep(); }
});
document.getElementById('btnPlay').addEventListener('click', () => {
  const btn = document.getElementById('btnPlay');
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
    btn.textContent = '▶ Play';
  } else {
    btn.textContent = '⏹ Parar';
    playTimer = setInterval(() => {
      if (currentStep < STEPS.length - 1) { currentStep++; renderStep(); }
      else { clearInterval(playTimer); playTimer = null; btn.textContent = '▶ Play'; }
    }, PLAY_INTERVAL);
  }
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' && currentStep < STEPS.length - 1) { currentStep++; renderStep(); }
  if (e.key === 'ArrowLeft'  && currentStep > 0) { currentStep--; renderStep(); }
});

// Modal close
document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.remove('open');
});
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay'))
    document.getElementById('modalOverlay').classList.remove('open');
});

// ═══════════════════════════════════════════════════════
//  U-MAP MINIMAP  — diagrama inspirado no paper original
// ═══════════════════════════════════════════════════════
/*
  Layout inspirado no paper Ronneberger et al. (2015), com simplificações didáticas:
  - Blocos retangulares onde ALTURA ∝ resolução espacial e LARGURA fixa
  - Encoder desce pela esquerda (blocos ficam mais baixos e finos)
  - Bottleneck na base central
  - Decoder sobe pela direita (blocos crescem)
  - Skip connections = setas horizontais cruzando o U no nível correto
  - MaxPool = setas curtas descendo (↓) entre níveis do encoder
  - UpConv  = setas curtas subindo  (↑) no decoder

  viewBox: 0 0 380 220
  Colunas (x centro de cada bloco):
    ENC: 22, 62, 102, 142   |  BN: 190  |  DEC: 238, 278, 318, 358
  Alturas (proporcional à resolução):
    nível 0 (256px): h=80   nível 1 (128px): h=60   nível 2 (64px): h=44
    nível 3 (32px):  h=30   BN (16px): h=20
*/

const UMAP_VB_W = 380;
const UMAP_VB_H = 215;

// Níveis do U (0=topo/maior resolução, 4=fundo/bottleneck)
// Para cada nível: y_top do bloco (alinhados pela base em y=192)
const BASE_Y = 194;
const BLOCK_W = 28;
const LEVEL_H = [80, 60, 44, 30, 20]; // alturas por nível

// Posições X dos centros de cada coluna
const COL_X = {
  enc1: 22,  enc2: 62,  enc3: 102, enc4: 142,
  bn:   190,
  dec1: 238, dec2: 278, dec3: 318, dec4: 358,
};
// Nível (0=topo) de cada bloco — define a altura
const COL_LEVEL = {
  enc1: 0, enc2: 1, enc3: 2, enc4: 3,
  bn:   4,
  dec1: 3, dec2: 2, dec3: 1, dec4: 0,
};
// Tipo visual de cada bloco
const COL_TYPE = {
  enc1:'encoder', enc2:'encoder', enc3:'encoder', enc4:'encoder',
  bn:'bottleneck',
  dec1:'decoder', dec2:'decoder', dec3:'decoder', dec4:'output',
};

// Blocos do mapa (encoder e decoder principais)
// Cada um tem: id, label, sublabel (dimensão), nível, tipo
const UMAP_BLOCKS = [
  { id:'enc1', label:'E1', sub:'256×32'  },
  { id:'enc2', label:'E2', sub:'128×64'  },
  { id:'enc3', label:'E3', sub:'64×128'  },
  { id:'enc4', label:'E4', sub:'32×256'  },
  { id:'bn',   label:'BN', sub:'16×512'  },
  { id:'dec1', label:'D1', sub:'32×256'  },
  { id:'dec2', label:'D2', sub:'64×128'  },
  { id:'dec3', label:'D3', sub:'128×64'  },
  { id:'dec4', label:'Out',sub:'256×2'   },
];

// Pool nodes (só setas, sem bloco — entre encoder levels)
const POOL_NODES = [
  { id:'pool1', from:'enc1', to:'enc2' },
  { id:'pool2', from:'enc2', to:'enc3' },
  { id:'pool3', from:'enc3', to:'enc4' },
  { id:'pool4', from:'enc4', to:'bn'   },
];

// Skip connections: encoder level → decoder level (mesma resolução)
const SKIP_PAIRS = [
  { from:'enc1', to:'dec4' },  // nível 0 — 256×256
  { from:'enc2', to:'dec3' },  // nível 1 — 128×128
  { from:'enc3', to:'dec2' },  // nível 2 — 64×64
  { from:'enc4', to:'dec1' },  // nível 3 — 32×32
];

const NODE_COLOR = {
  input:      '#94a3b8',
  encoder:    '#3b82f6',
  pool:       '#334155',
  bottleneck: '#f97316',
  decoder:    '#22c55e',
  upconv:     '#16a34a',
  output:     '#fbbf24',
};

// Retorna geometria de um bloco pelo id
function blockGeom(id) {
  const cx   = COL_X[id];
  const lvl  = COL_LEVEL[id];
  const h    = LEVEL_H[lvl];
  const w    = id === 'bn' ? BLOCK_W + 4 : BLOCK_W;
  const x    = cx - w / 2;
  const y    = BASE_Y - h;
  return { x, y, w, h, cx, cy: y + h / 2 };
}

function buildUMap() {
  const svg = document.getElementById('umapSvg');
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${UMAP_VB_W} ${UMAP_VB_H}`);

  const ns = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs = {}) => {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  // ── Defs: arrow markers
  const defs = mk('defs');
  const mkM = (id, color) => {
    const m = mk('marker', { id, markerWidth:5, markerHeight:4, refX:4.5, refY:2, orient:'auto' });
    m.appendChild(mk('polygon', { points:'0,0 5,2 0,4', fill:color }));
    defs.appendChild(m);
  };
  mkM('mDown',  '#3b82f6');
  mkM('mUp',    '#22c55e');
  mkM('mSkip',  '#a855f7');
  mkM('mBn',    '#f97316');
  svg.appendChild(defs);

  // ── Phase label bands (subtle background)
  // Encoder zone
  svg.appendChild(mk('rect', { x:6, y:4, width:154, height:UMAP_VB_H - 8,
    rx:6, fill:'#3b82f608', stroke:'#3b82f618', 'stroke-width':1 }));
  // Decoder zone
  svg.appendChild(mk('rect', { x:220, y:4, width:154, height:UMAP_VB_H - 8,
    rx:6, fill:'#22c55e08', stroke:'#22c55e18', 'stroke-width':1 }));
  // BN zone
  svg.appendChild(mk('rect', { x:172, y:BASE_Y - LEVEL_H[4] - 14, width:36, height:LEVEL_H[4] + 20,
    rx:4, fill:'#f9731610', stroke:'#f9731620', 'stroke-width':1 }));

  // Phase labels
  const phaseLbl = (txt, x, y, color) => {
    const t = mk('text', { x, y, 'text-anchor':'middle', fill:color,
      'font-size':6, 'font-family':'monospace', 'font-weight':700, 'letter-spacing':1 });
    t.textContent = txt;
    svg.appendChild(t);
  };
  phaseLbl('ENCODER ↓', 83,  12, '#3b82f660');
  phaseLbl('BN',         190, 12, '#f9731660');
  phaseLbl('DECODER ↑', 297, 12, '#22c55e60');

  // ── MaxPool arrows (encoder: diagonal down-right between levels)
  POOL_NODES.forEach(p => {
    const a = blockGeom(p.from);
    const b = blockGeom(p.to);
    // Arrow from bottom-center of 'from' block, L-bend to left of 'to' block
    const x1 = a.cx, y1 = BASE_Y;   // bottom of encoder block
    const x2 = b.x,  y2 = b.cy;     // left of next encoder block
    const path = mk('path', {
      d: `M${x1},${y1} L${x1},${y2} L${x2},${y2}`,
      fill:'none', stroke:'#475569', 'stroke-width':1.4,
      'marker-end':'url(#mDown)',
    });
    svg.appendChild(path);
    // Small "↓2" label
    const lbl = mk('text', { x: x1 + 3, y: (y1 + y2) / 2,
      fill:'#475569', 'font-size':5, 'font-family':'monospace' });
    lbl.textContent = '÷2';
    svg.appendChild(lbl);
  });

  // ── BN → dec1 arrow (right then up)
  {
    const a = blockGeom('bn');
    const b = blockGeom('dec1');
    const path = mk('path', {
      d: `M${a.x + a.w},${a.cy} L${b.cx},${a.cy} L${b.cx},${BASE_Y}`,
      fill:'none', stroke:'#f97316', 'stroke-width':1.5,
      'marker-end':'url(#mUp)',
    });
    svg.appendChild(path);
    const lbl = mk('text', { x: (a.x + a.w + b.cx) / 2, y: a.cy - 2,
      fill:'#f97316', 'font-size':5, 'font-family':'monospace', 'text-anchor':'middle' });
    lbl.textContent = '↑2';
    svg.appendChild(lbl);
  }

  // ── Decoder UpConv arrows (right-and-up between decoder blocks)
  const decSeq = ['dec1','dec2','dec3','dec4'];
  for (let i = 0; i < decSeq.length - 1; i++) {
    const a = blockGeom(decSeq[i]);
    const b = blockGeom(decSeq[i + 1]);
    // Arrow from right of current dec to bottom of next dec (up)
    const path = mk('path', {
      d: `M${a.x + a.w},${a.cy} L${b.cx},${a.cy} L${b.cx},${BASE_Y}`,
      fill:'none', stroke:'#22c55e', 'stroke-width':1.4,
      'marker-end':'url(#mUp)',
    });
    svg.appendChild(path);
    const lbl = mk('text', { x: (a.x + a.w + b.cx) / 2, y: a.cy - 2,
      fill:'#22c55e', 'font-size':5, 'font-family':'monospace', 'text-anchor':'middle' });
    lbl.textContent = '↑2';
    svg.appendChild(lbl);
  }

  // ── Skip connections (horizontal, at the top of each encoder block)
  // Each skip goes from TOP of encoder block horizontally to TOP of matching decoder block
  // Use unique y offsets per level so they don't overlap
  const skipYOff = [-6, -4, -4, -2];
  SKIP_PAIRS.forEach(({ from, to }, li) => {
    const a = blockGeom(from);
    const b = blockGeom(to);
    const sharedLevel = Math.max(a.y, b.y); // top of higher (smaller) block
    const ys = Math.min(a.y, b.y) + skipYOff[li]; // arc above both blocks
    const x1 = a.x + a.w;
    const x2 = b.x;
    // Path: right edge of enc → up to skip lane → across → down to dec
    const pathD = [
      `M${x1},${a.y + 4}`,
      `L${x1 + 4},${a.y + 4}`,
      `L${x1 + 4},${ys}`,
      `L${x2 - 4},${ys}`,
      `L${x2 - 4},${b.y + 4}`,
      `L${x2},${b.y + 4}`,
    ].join(' ');
    svg.appendChild(mk('path', {
      d: pathD,
      fill:'none', stroke:'#a855f7', 'stroke-width':1.2,
      'stroke-dasharray':'3 2', 'marker-end':'url(#mSkip)',
      class:'umap-skip-line', opacity:0.75,
    }));
  });

  // ── Draw blocks (nodes)
  UMAP_BLOCKS.forEach(block => {
    const g  = blockGeom(block.id);
    const tp = COL_TYPE[block.id];
    const color = NODE_COLOR[tp] || '#64748b';
    const grp = mk('g', { class:'umap-node', 'data-id':block.id, style:'cursor:pointer' });

    // Shadow / glow rect
    const shadow = mk('rect', {
      x: g.x - 1, y: g.y - 1, width: g.w + 2, height: g.h + 2,
      rx: 4, fill:'none', stroke: color, 'stroke-width':0, opacity:0,
      class:'umap-shadow',
    });

    // Main block
    const rect = mk('rect', {
      x: g.x, y: g.y, width: g.w, height: g.h,
      rx: 3,
      fill: color + '25',
      stroke: color,
      'stroke-width': 1.6,
      class:'umap-box',
    });

    // Label (rotated if block is narrow)
    const lbl = mk('text', {
      x: g.cx, y: g.cy - (block.sub ? 3 : 0),
      'text-anchor':'middle', 'dominant-baseline':'middle',
      fill: color, 'font-size': 6.5, 'font-family':'monospace', 'font-weight':700,
    });
    lbl.textContent = block.label;
    grp.append(shadow, rect, lbl);

    if (block.sub && g.h >= 28) {
      const sub = mk('text', {
        x: g.cx, y: g.cy + 5,
        'text-anchor':'middle', 'dominant-baseline':'middle',
        fill: color + 'aa', 'font-size': 4.2, 'font-family':'monospace',
      });
      sub.textContent = block.sub;
      grp.appendChild(sub);
    }

    grp.addEventListener('click', () => {
      const stepIdx = STEPS.findIndex(s => s.archNode === block.id);
      if (stepIdx >= 0) { currentStep = stepIdx; renderStep(); }
    });
    svg.appendChild(grp);
  });

  // ── "Visited" trail line — drawn at BASE_Y to show the U shape baseline
  svg.appendChild(mk('line', {
    x1: COL_X.enc1, y1: BASE_Y + 2,
    x2: COL_X.dec4, y2: BASE_Y + 2,
    stroke:'#1e293b', 'stroke-width':3, 'stroke-linecap':'round',
  }));
  // Progress trail (will be updated dynamically)
  svg.appendChild(mk('line', {
    id:'umapTrail',
    x1: COL_X.enc1, y1: BASE_Y + 2,
    x2: COL_X.enc1, y2: BASE_Y + 2,
    stroke:'#3b82f6', 'stroke-width':3, 'stroke-linecap':'round',
    opacity:0.5,
  }));

  // ── Active marker: glowing ring rendered on top
  svg.appendChild(mk('rect', {
    id:'umapRing', x:0, y:0, width:0, height:0,
    rx:5, fill:'none', 'stroke-width':2.5, opacity:0,
    class:'umap-pulse',
  }));

  updateUMap();
}

function updateUMap() {
  const step   = STEPS[currentStep];
  const nodeId = step.archNode;
  const UMAP_NODE_ALIAS = { input: 'enc1', relu1: 'enc1', pool1: 'enc1', pool2: 'enc2', pool3: 'enc3', pool4: 'enc4' };
  const blockId = COL_X[nodeId] !== undefined ? nodeId : (UMAP_NODE_ALIAS[nodeId] || null);
  if (!blockId) return;

  const tp    = COL_TYPE[blockId];
  const color = nodeId === 'relu1' ? '#f59e0b' : (NODE_COLOR[tp] || '#fff');

  const g = blockGeom(blockId);

  // Move animated ring
  const ring = document.getElementById('umapRing');
  if (ring) {
    const pad = 3;
    ring.setAttribute('x',      g.x - pad);
    ring.setAttribute('y',      g.y - pad);
    ring.setAttribute('width',  g.w + pad * 2);
    ring.setAttribute('height', g.h + pad * 2);
    ring.setAttribute('stroke', color);
    ring.setAttribute('opacity', 1);
    ring.style.color = color;
  }

  // Update progress trail along baseline
  // Map currentStep → X position along the U
  const trailOrder = ['enc1','enc1','enc1','enc1','enc2','enc2','enc3','enc4','enc4','bn','dec1','dec1','dec2','dec3','dec4'];
  const trailId = trailOrder[Math.min(currentStep, trailOrder.length - 1)];
  const trailX  = COL_X[trailId] || COL_X.enc1;
  const trail   = document.getElementById('umapTrail');
  const isDecoder = currentStep >= 9; // from BN onward
  if (trail) {
    if (!isDecoder) {
      // Going down encoder: trail goes left→right from enc1 to current
      trail.setAttribute('x1', COL_X.enc1);
      trail.setAttribute('x2', trailX);
      trail.setAttribute('stroke', '#3b82f6');
    } else {
      // Going up decoder: draw full encoder + decoder portion
      trail.setAttribute('x1', COL_X.enc1);
      trail.setAttribute('x2', trailX);
      trail.setAttribute('stroke', color);
    }
  }

  // Reset all boxes
  document.querySelectorAll('.umap-node .umap-box').forEach(box => {
    const pid = box.closest('.umap-node')?.dataset?.id;
    const t   = COL_TYPE[pid];
    const c   = NODE_COLOR[t] || '#64748b';
    box.setAttribute('fill', c + '25');
    box.setAttribute('stroke-width', 1.6);
    box.classList.remove('umap-active-glow');
  });

  // Highlight active block
  const activeBox = document.querySelector(`.umap-node[data-id="${blockId}"] .umap-box`);
  if (activeBox) {
    activeBox.setAttribute('fill', color + '55');
    activeBox.setAttribute('stroke-width', 2.5);
    activeBox.classList.add('umap-active-glow');
    activeBox.style.color = color;
  }
}

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════
buildUMap();
buildArchTree();
buildDots();
renderStep();
