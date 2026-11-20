/* =========================================================
   THAYLA — MAPAS
   Cada sala é um retângulo com paredes, props, portas e itens.
   ========================================================= */

window.ROOMS = {

  /* ------------------------------------------------ RUA */
  rua: {
    name: 'Rua XV de Novembro',
    theme: 'street',
    w: 1024, h: 576,
    dark: 0.4,
    rain: true,
    spawn: { x: 110, y: 340 },

    walls: [
      [0, 0, 560, 150], [720, 0, 304, 150],
      [0, 470, 1024, 106],
      [0, 150, 16, 320],
      [1008, 150, 16, 90], [1008, 340, 16, 130]
    ],

    props: [
      { t: 'car', x: 150, y: 250, w: 120, h: 56, solid: true },
      { t: 'barricade', x: 840, y: 186, w: 84, h: 16, solid: true },
      { t: 'dumpster', x: 596, y: 418, w: 54, h: 36, solid: true },
      { t: 'barrel', x: 420, y: 432, w: 20, h: 20, solid: true, fire: true },
      { t: 'body', x: 250, y: 344, w: 20, h: 8 },
      { t: 'trash', x: 70, y: 184, w: 22, h: 14 },
      { t: 'lamp', x: 300, y: 146, w: 6, h: 4 },
      { t: 'lamp', x: 760, y: 146, w: 6, h: 4 }
    ],

    doors: [
      {
        id: 'rua_delegacia', label: 'Delegacia',
        x: 596, y: 6, w: 72, h: 34, ix: 632, iy: 48,
        to: 'delegacia', toDoor: 'delegacia_rua',
        arrive: { x: 632, y: 86 }
      },
      {
        id: 'rua_praca', label: 'Praça Central',
        x: 996, y: 250, w: 28, h: 80, ix: 982, iy: 290,
        to: 'praca', toDoor: 'praca_rua',
        arrive: { x: 950, y: 290 }
      }
    ],

    items: [
      { t: 'ammo9', x: 900, y: 442, n: 8 },
      { t: 'herb', x: 332, y: 196 }
    ],

    notes: [
      { id: 'boletim', x: 268, y: 356 }
    ],

    enemies: [
      { t: 'walker', x: 700, y: 380 },
      { t: 'walker', x: 470, y: 240 }
    ],

    lights: [
      { x: 300, y: 152, r: 108, c: '#ffcf8a' },
      { x: 760, y: 152, r: 108, c: '#ffcf8a' },
      { x: 430, y: 438, r: 60, c: '#ff7a3c' }
    ]
  },

  /* ------------------------------------------- DELEGACIA */
  delegacia: {
    name: 'Delegacia de Guarannapuava',
    theme: 'police',
    w: 960, h: 540,
    dark: 0.52,
    rain: false,

    walls: [
      [0, 0, 960, 18], [0, 522, 960, 18],
      [0, 0, 18, 540], [942, 0, 18, 540]
    ],

    props: [
      { t: 'counter', x: 300, y: 140, w: 240, h: 42, solid: true },
      { t: 'sofa', x: 60, y: 90, w: 72, h: 38, solid: true },
      { t: 'locker', x: 640, y: 24, w: 190, h: 34, solid: true },
      { t: 'cabinet', x: 838, y: 46, w: 60, h: 66, solid: true },
      { t: 'desk', x: 700, y: 360, w: 140, h: 52, solid: true },
      { t: 'bars', x: 60, y: 300, w: 200, h: 10, solid: true },
      { t: 'bars', x: 60, y: 300, w: 10, h: 140, solid: true },
      { t: 'bars', x: 250, y: 300, w: 10, h: 140, solid: true },
      { t: 'typewriter', x: 150, y: 118, w: 28, h: 20, solid: true },
      { t: 'plant', x: 890, y: 470, w: 26, h: 26 },
      { t: 'body', x: 520, y: 430, w: 20, h: 8 }
    ],

    doors: [
      {
        id: 'delegacia_rua', label: 'Rua XV',
        x: 440, y: 508, w: 80, h: 32, ix: 480, iy: 500,
        to: 'rua', toDoor: 'rua_delegacia',
        arrive: { x: 480, y: 468 }
      }
    ],

    items: [
      { t: 'ammo9', x: 360, y: 204, n: 10 },
      { t: 'ammo9', x: 762, y: 176, n: 8 },
      { t: 'herb', x: 120, y: 254 },
      { t: 'keycard', x: 726, y: 342, take: true },
      { t: 'key_farmacia', x: 900, y: 226, take: true }
    ],

    notes: [
      { id: 'senha', x: 508, y: 186 },
      { id: 'carta', x: 820, y: 342 }
    ],

    enemies: [
      { t: 'walker', x: 200, y: 442 },
      { t: 'walker', x: 826, y: 300 }
    ],

    interacts: [
      { t: 'keypad', x: 868, y: 120, label: 'Armário de Evidências' },
      { t: 'save', x: 164, y: 106, label: 'Máquina de escrever' }
    ],

    lights: [
      { x: 460, y: 80, r: 150, c: '#dfe9f0' },
      { x: 700, y: 260, r: 130, c: '#dfe9f0' }
    ]
  },

  /* ------------------------------------------------ PRAÇA */
  praca: {
    name: 'Praça Central',
    theme: 'plaza',
    w: 1120, h: 640,
    dark: 0.46,
    rain: true,

    walls: [
      [0, 0, 520, 140], [600, 0, 520, 140],
      [0, 0, 16, 200], [0, 300, 16, 340],
      [1104, 0, 16, 640],
      [0, 620, 1120, 20]
    ],

    props: [
      { t: 'fountain', x: 470, y: 258, w: 200, h: 132, solid: true },
      { t: 'tree', x: 160, y: 200, w: 46, h: 46, solid: true },
      { t: 'tree', x: 880, y: 420, w: 46, h: 46, solid: true },
      { t: 'tree', x: 960, y: 180, w: 46, h: 46, solid: true },
      { t: 'bench', x: 300, y: 470, w: 72, h: 22, solid: true },
      { t: 'bench', x: 800, y: 300, w: 72, h: 22, solid: true },
      { t: 'barricade', x: 600, y: 176, w: 90, h: 16, solid: true },
      { t: 'body', x: 380, y: 360, w: 20, h: 8 },
      { t: 'lamp', x: 300, y: 136, w: 6, h: 4 },
      { t: 'lamp', x: 820, y: 136, w: 6, h: 4 },
      { t: 'manhole', x: 626, y: 588, w: 70, h: 30 }
    ],

    doors: [
      {
        id: 'praca_rua', label: 'Rua XV',
        x: 0, y: 206, w: 26, h: 88, ix: 28, iy: 250,
        to: 'rua', toDoor: 'rua_praca',
        arrive: { x: 64, y: 250 }
      },
      {
        id: 'praca_farmacia', label: 'Farmácia',
        x: 548, y: 6, w: 64, h: 32, ix: 580, iy: 48,
        to: 'farmacia', toDoor: 'farmacia_praca',
        lock: 'key_farmacia', lockMsg: 'Trancada. Preciso da chave da farmácia.',
        arrive: { x: 580, y: 78 }
      },
      {
        id: 'praca_bueiro', label: 'Bueiro',
        x: 626, y: 596, w: 70, h: 38, ix: 661, iy: 584,
        to: 'esgoto', toDoor: 'esgoto_praca',
        lock: 'crowbar', lockMsg: 'A tampa está soldada. Preciso de um pé de cabra.',
        arrive: { x: 661, y: 556 }
      }
    ],

    items: [
      { t: 'herb', x: 982, y: 520 },
      { t: 'ammo9', x: 180, y: 546, n: 10 }
    ],

    notes: [
      { id: 'diario1', x: 330, y: 456 }
    ],

    enemies: [
      { t: 'walker', x: 700, y: 220 },
      { t: 'walker', x: 900, y: 520 },
      { t: 'crawler', x: 420, y: 520 }
    ],

    lights: [
      { x: 300, y: 140, r: 110, c: '#ffcf8a' },
      { x: 820, y: 140, r: 110, c: '#ffcf8a' },
      { x: 570, y: 320, r: 130, c: '#9fe2ff' }
    ]
  },

  /* ---------------------------------------------- FARMÁCIA */
  farmacia: {
    name: 'Farmácia São Lucas',
    theme: 'pharmacy',
    w: 800, h: 480,
    dark: 0.5,
    rain: false,

    walls: [
      [0, 0, 800, 18], [0, 462, 800, 18],
      [0, 0, 18, 480], [782, 0, 18, 480]
    ],

    props: [
      { t: 'shelf', x: 100, y: 110, w: 190, h: 40, solid: true },
      { t: 'shelf', x: 100, y: 210, w: 190, h: 40, solid: true },
      { t: 'shelf', x: 500, y: 110, w: 190, h: 40, solid: true },
      { t: 'shelf', x: 500, y: 210, w: 190, h: 40, solid: true },
      { t: 'counter', x: 290, y: 350, w: 210, h: 44, solid: true },
      { t: 'cabinet', x: 700, y: 300, w: 50, h: 60, solid: true },
      { t: 'body', x: 200, y: 300, w: 20, h: 8 }
    ],

    doors: [
      {
        id: 'farmacia_praca', label: 'Praça Central',
        x: 360, y: 448, w: 80, h: 32, ix: 400, iy: 442,
        to: 'praca', toDoor: 'praca_farmacia',
        arrive: { x: 400, y: 408 }
      }
    ],

    items: [
      { t: 'reagent', x: 360, y: 328, take: true },
      { t: 'ammo9', x: 620, y: 300, n: 8 },
      { t: 'herb', x: 120, y: 390 },
      { t: 'shell', x: 720, y: 262, n: 4 }
    ],

    notes: [
      { id: 'email', x: 648, y: 368 }
    ],

    enemies: [
      { t: 'walker', x: 300, y: 160 },
      { t: 'crawler', x: 600, y: 400 }
    ],

    lights: [
      { x: 200, y: 80, r: 130, c: '#d8f3ff' },
      { x: 600, y: 80, r: 130, c: '#d8f3ff' }
    ]
  },

  /* ------------------------------------------------ ESGOTO */
  esgoto: {
    name: 'Esgoto — Ninho',
    theme: 'sewer',
    w: 1024, h: 576,
    dark: 0.55,
    rain: false,

    walls: [
      [0, 0, 460, 20], [540, 0, 484, 20],
      [0, 556, 1024, 20],
      [0, 0, 20, 576],
      [1004, 0, 20, 250], [1004, 320, 20, 256]
    ],

    props: [
      { t: 'pillar', x: 220, y: 150, w: 46, h: 46, solid: true },
      { t: 'pillar', x: 760, y: 150, w: 46, h: 46, solid: true },
      { t: 'pillar', x: 220, y: 340, w: 46, h: 46, solid: true },
      { t: 'pillar', x: 760, y: 340, w: 46, h: 46, solid: true },
      { t: 'pipe', x: 20, y: 440, w: 170, h: 20, solid: true },
      { t: 'pipe', x: 840, y: 470, w: 164, h: 20, solid: true },
      { t: 'crate', x: 120, y: 100, w: 34, h: 34, solid: true },
      { t: 'barrel', x: 900, y: 100, w: 20, h: 20, solid: true },
      { t: 'body', x: 600, y: 486, w: 20, h: 8 }
    ],

    doors: [
      {
        id: 'esgoto_praca', label: 'Subir para a Praça',
        x: 460, y: 0, w: 80, h: 30, ix: 500, iy: 44,
        to: 'praca', toDoor: 'praca_bueiro',
        arrive: { x: 500, y: 74 }
      },
      {
        id: 'esgoto_lab', label: 'Porta blindada',
        x: 1002, y: 252, w: 22, h: 70, ix: 984, iy: 287,
        to: 'laboratorio', toDoor: 'lab_esgoto',
        lock: 'keycard', lockMsg: 'Leitor pisca em vermelho. Exige o Cartão R.P.D.',
        arrive: { x: 958, y: 287 }
      }
    ],

    items: [
      { t: 'herb', x: 100, y: 500 },
      { t: 'ammo9', x: 890, y: 520, n: 10 }
    ],

    notes: [
      { id: 'diario2', x: 104, y: 84 }
    ],

    enemies: [],

    lights: [
      { x: 512, y: 300, r: 140, c: '#ff5a4a' },
      { x: 120, y: 120, r: 90, c: '#7fd8c0' },
      { x: 900, y: 460, r: 90, c: '#7fd8c0' }
    ]
  },

  /* -------------------------------------------- LABORATÓRIO */
  laboratorio: {
    name: 'Umbrella — Subsolo 3',
    theme: 'lab',
    w: 960, h: 540,
    dark: 0.66,
    rain: false,
    spawn: { x: 894, y: 150 },

    walls: [
      [0, 0, 18, 250], [0, 320, 18, 220],
      [0, 0, 960, 18], [0, 522, 960, 18], [942, 0, 18, 540]
    ],

    props: [
      { t: 'console', x: 200, y: 110, w: 220, h: 46, solid: true },
      { t: 'console', x: 600, y: 110, w: 180, h: 46, solid: true },
      { t: 'cold', x: 800, y: 380, w: 100, h: 70, solid: true },
      { t: 'synth', x: 420, y: 300, w: 110, h: 60, solid: true },
      { t: 'fusebox', x: 60, y: 24, w: 34, h: 26 },
      { t: 'tube', x: 104, y: 200, w: 26, h: 120, solid: true },
      { t: 'cabinet', x: 700, y: 400, w: 50, h: 50, solid: true },
      { t: 'elevator', x: 858, y: 40, w: 72, h: 74, solid: true },
      { t: 'body', x: 300, y: 450, w: 20, h: 8 }
    ],

    doors: [
      {
        id: 'lab_esgoto', label: 'Esgoto',
        x: 0, y: 252, w: 28, h: 70, ix: 40, iy: 287,
        to: 'esgoto', toDoor: 'esgoto_lab',
        arrive: { x: 62, y: 287 }
      }
    ],

    items: [
      { t: 'ammo9', x: 262, y: 220, n: 8 },
      { t: 'herb', x: 120, y: 460 },
      { t: 'shell', x: 620, y: 220, n: 4 }
    ],

    notes: [
      { id: 'bula', x: 620, y: 92 },
      { id: 'memorando', x: 300, y: 92 }
    ],

    enemies: [
      { t: 'walker', x: 400, y: 430 },
      { t: 'walker', x: 700, y: 270 },
      { t: 'crawler', x: 880, y: 220 }
    ],

    interacts: [
      { t: 'fuse', x: 77, y: 66, label: 'Quadro de fusíveis' },
      { t: 'cold', x: 850, y: 348, label: 'Câmara fria' },
      { t: 'synth', x: 475, y: 274, label: 'Centrífuga de bancada' },
      { t: 'elevator', x: 894, y: 128, label: 'Elevador de serviço' }
    ],

    lights: [
      { x: 340, y: 200, r: 130, c: '#bfe7ff' },
      { x: 780, y: 200, r: 130, c: '#bfe7ff' }
    ]
  },

  /* ------------------------------------------------ TERRAÇO */
  terraco: {
    name: 'Terraço — Umbrella',
    theme: 'roof',
    w: 800, h: 480,
    dark: 0.42,
    rain: true,

    walls: [
      [0, 0, 800, 18], [0, 462, 800, 18],
      [0, 0, 18, 480], [782, 0, 18, 480]
    ],

    props: [
      { t: 'ac', x: 110, y: 80, w: 62, h: 52, solid: true },
      { t: 'ac', x: 620, y: 80, w: 62, h: 52, solid: true },
      { t: 'antenna', x: 396, y: 60, w: 10, h: 44 },
      { t: 'barrel', x: 110, y: 380, w: 22, h: 22, solid: true },
      { t: 'barrel', x: 680, y: 380, w: 22, h: 22, solid: true },
      { t: 'crate', x: 700, y: 200, w: 34, h: 34, solid: true },
      { t: 'crate', x: 62, y: 210, w: 34, h: 34, solid: true },
      { t: 'helipad', x: 400, y: 300, w: 150, h: 150 }
    ],

    doors: [
      {
        id: 'terraco_lab', label: 'Elevador',
        x: 360, y: 446, w: 80, h: 34, ix: 400, iy: 442,
        to: 'laboratorio', toDoor: 'lab_elevator',
        arrive: { x: 400, y: 400 }
      }
    ],

    items: [],

    notes: [],

    enemies: [],

    lights: [
      { x: 400, y: 120, r: 150, c: '#ff5a4a' }
    ]
  }
};
