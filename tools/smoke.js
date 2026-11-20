/* Teste headless: simula DOM/canvas e roda o jogo por vários quadros. */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

function makeCtx() {
  const grad = { addColorStop() {} };
  const ctx = {
    canvas: null,
    fillStyle: '#000', strokeStyle: '#000', lineWidth: 1,
    font: '10px monospace', textAlign: 'left', textBaseline: 'alphabetic',
    globalAlpha: 1, globalCompositeOperation: 'source-over',
    imageSmoothingEnabled: false,
    fillRect() {}, clearRect() {}, strokeRect() {},
    beginPath() {}, closePath() {}, moveTo() {}, lineTo() {},
    arc() {}, ellipse() {}, rect() {}, clip() {},
    fill() {}, stroke() {}, save() {}, restore() {},
    translate() {}, rotate() {}, scale() {}, setTransform() {},
    drawImage() {}, fillText() {}, strokeText() {},
    createRadialGradient: () => grad,
    createLinearGradient: () => grad,
    measureText(t) {
      const m = /(\d+(?:\.\d+)?)px/.exec(this.font);
      const size = m ? parseFloat(m[1]) : 10;
      return { width: String(t).length * size * 0.55 };
    },
    createPattern: () => null,
    getImageData: () => ({ data: [] }),
    putImageData() {}
  };
  return ctx;
}

function makeCanvas() {
  const c = { width: 300, height: 150, style: {}, getContext: null, listeners: {} };
  c.getContext = () => makeCtx();
  c.addEventListener = (name, fn) => { (c.listeners[name] || (c.listeners[name] = [])).push(fn); };
  c.dispatchEvent = e => (c.listeners[e.type] || []).forEach(fn => fn(e));
  return c;
}

const sandbox = {
  console,
  Math,
  Date,
  JSON,
  parseInt,
  parseFloat,
  isFinite,
  Array,
  Object,
  String,
  Number,
  Boolean,
  Error,
  RegExp,
  setTimeout: () => 0,
  clearTimeout: () => 0,
  requestAnimationFrame: () => 0,
  cancelAnimationFrame: () => 0,
  performance: { now: () => Date.now() },
  localStorage: {
    _d: {},
    getItem(k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },
    setItem(k, v) { this._d[k] = String(v); },
    removeItem(k) { delete this._d[k]; }
  },
  innerWidth: 1280,
  innerHeight: 720,
  addEventListener() {},
  removeEventListener() {}
};

sandbox.window = sandbox;
sandbox.document = {
  getElementById(id) {
    if (id === 'game') return sandbox.__canvas;
    if (id === 'boot') return { style: {} };
    return null;
  },
  createElement(tag) {
    if (tag === 'canvas') return makeCanvas();
    return { style: {} };
  },
  addEventListener() {},
  body: { style: {} }
};
sandbox.__canvas = makeCanvas();

const ctx = vm.createContext(sandbox);

const files = [
  'js/engine.js', 'js/audio.js', 'js/lore.js', 'js/rooms.js',
  'js/world.js', 'js/render.js', 'js/ui.js', 'js/game.js'
];

for (const f of files) {
  const code = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
  try {
    vm.runInContext(code, ctx, { filename: f });
  } catch (e) {
    console.error('FALHA AO CARREGAR', f, e);
    process.exit(1);
  }
}

const g = sandbox;
const log = (...a) => console.log(...a);
let failures = 0;

function check(name, fn) {
  try {
    fn();
    log('  ok  ' + name);
  } catch (e) {
    failures++;
    log('  ERRO ' + name + ' :: ' + (e && e.stack ? e.stack.split('\n')[0] : e));
  }
}

function step(n, dt = 1 / 60) {
  for (let i = 0; i < n; i++) {
    g.Input.sync();
    g.update(dt);
    g.render();
    g.Input.endFrame();
  }
}

function press(code) {
  g.Input.pressed[code] = true;
}

function hold(code, on = true) {
  g.Input.down[code] = on;
}

log('--- boot ---');
check('boot', () => g.boot());
check('title frames', () => step(30));
check('new game', () => g.newGame());
check('intro dialogue frames', () => step(10));

check('tela preenchida em diferentes proporções', () => {
  g.innerWidth = 1600;
  g.innerHeight = 720;
  g.resizeCanvas();
  step(2);
  if (g.VIEW_W <= 480 || g.VIEW_H !== 270) throw new Error('viewport lógico não expandiu: ' + g.VIEW_W + 'x' + g.VIEW_H);
  if (g.Render.ox !== 0 || g.Render.oy !== 0) throw new Error('render ainda possui barras');
  if (g.Render.scale * g.VIEW_W < g.innerWidth || g.Render.scale * g.VIEW_H < g.innerHeight) {
    throw new Error('render não cobre a tela');
  }
  g.innerWidth = 720;
  g.innerHeight = 900;
  g.resizeCanvas();
  step(2);
  if (g.VIEW_W !== 480 || g.VIEW_H <= 270) throw new Error('viewport lógico não expandiu na vertical: ' + g.VIEW_W + 'x' + g.VIEW_H);
  if (g.Render.ox !== 0 || g.Render.oy !== 0) throw new Error('render ainda possui barras no formato vertical');
  if (g.Render.scale * g.VIEW_W < g.innerWidth || g.Render.scale * g.VIEW_H < g.innerHeight) {
    throw new Error('render não cobre a tela no formato vertical');
  }
  g.innerWidth = 1280;
  g.innerHeight = 720;
  g.resizeCanvas();
  step(1);
});

log('estado:', g.__thayla.getState(), '| sala:', g.__thayla.getRoom() && g.__thayla.getRoom().id);

// avança diálogo inicial
for (let i = 0; i < 40; i++) {
  press('KeyE');
  step(1);
  press('Space');
  step(1);
}
check('dialogo inicial termina', () => {
  if (g.__thayla.getState() !== 'play') throw new Error('estado=' + g.__thayla.getState());
});

const p = g.__thayla.player;
const startX = p.x;

check('movimento', () => {
  hold('KeyD', true);
  step(60);
  hold('KeyD', false);
  if (!(p.x > startX + 20)) throw new Error('x não avançou: ' + p.x);
});

check('controles touch', () => {
  const before = p.x;
  g.Input.touch.moveX = -1;
  step(30);
  g.Input.touch.moveX = 0;
  if (!(p.x < before - 20)) throw new Error('analógico não moveu: ' + p.x);

  g.Input.touch.down.KeyF = true;
  g.Input.touch.pressed.KeyF = true;
  if (!g.Input.key('KeyF') || !g.Input.hit('KeyF')) throw new Error('ação touch não foi reconhecida');
  g.Input.touch.down.KeyF = false;
  g.Input.touch.pressed = {};
});

check('tiro', () => {
  const before = g.__thayla.inv().ammo9;
  g.__canvas.dispatchEvent({
    type: 'pointerdown', pointerType: 'touch', pointerId: 1,
    clientX: 640, clientY: 360, preventDefault() {}
  });
  step(20);
  g.__canvas.dispatchEvent({ type: 'pointerup', pointerId: 1 });
  if (g.__thayla.inv().ammo9 >= before) throw new Error('munição não baixou');
});
step(30);

check('inventário abre/fecha', () => {
  press('Tab'); step(1); g.Input.pressed = {};
  if (g.__thayla.getState() !== 'inv') throw new Error('não abriu: ' + g.__thayla.getState());
  press('Tab'); step(1);
  if (g.__thayla.getState() !== 'play') throw new Error('não fechou: ' + g.__thayla.getState());
});

log('--- salas ---');
const rooms = ['delegacia', 'praca', 'farmacia', 'esgoto', 'laboratorio', 'terraco'];
for (const r of rooms) {
  check('carrega/renderiza ' + r, () => {
    g.loadRoom(r, null);
    g.__thayla.setState('play');
    step(6);
    if (!g.__thayla.getRoom() || g.__thayla.getRoom().id !== r) throw new Error('sala errada');
  });
  // fecha diálogos da sala
  for (let i = 0; i < 24; i++) {
    press('KeyE'); step(1);
    press('Space'); step(1);
  }
}

log('--- documentos ---');
check('abre e fecha doc', () => {
  g.openDoc('boletim', 'play');
  step(4);
  press('Escape'); step(1);
  if (g.__thayla.getState() !== 'play') throw new Error('doc não fechou');
});

log('--- teclado ---');
check('código errado e certo', () => {
  g.keypadOpen();
  step(2);
  g.Input.pressed = {};
  // erra
  press('Digit1'); press('Digit2'); press('Digit3'); step(1);
  press('Enter'); step(1);
  if (g.__thayla.flags().locker_open) throw new Error('abriu com senha errada');
  // acerta
  g.Input.pressed = {};
  press('Digit4'); step(1);
  press('Digit2'); step(1);
  press('Digit7'); step(1);
  press('Enter'); step(1);
  if (!g.__thayla.flags().locker_open) throw new Error('não abriu com 427');
  if (!g.__thayla.inv().shotgun) throw new Error('sem escopeta');
});

log('--- combate ---');
check('zumbi morre', () => {
  g.loadRoom('rua', { x: 400, y: 300 });
  g.__thayla.setState('play');
  const room = g.__thayla.getRoom();
  const z = room.enemies[0];
  if (!z) throw new Error('sem zumbi');
  z.x = p.x + 20; z.y = p.y;
  step(2);
  for (let i = 0; i < 12; i++) { g.hurtEnemy(z, 30, 1, 0); }
  if (!z.dead) throw new Error('não morreu');
});

check('rainha e raul existem', () => {
  g.loadRoom('esgoto', { x: 500, y: 400 });
  g.__thayla.setState('play');
  if (!g.__thayla.getRoom().enemies.some(e => e.type === 'queen')) throw new Error('sem rainha');
  g.loadRoom('terraco', { x: 400, y: 400 });
  g.__thayla.setState('play');
  if (!g.__thayla.getRoom().enemies.some(e => e.type === 'raul')) throw new Error('sem raul');
});

log('--- síntese e finais ---');
check('síntese do soro', () => {
  const f = g.__thayla.flags();
  f.power = true; f.reagent = true; f.core = true; f.blood = true;
  g.loadRoom('laboratorio', { x: 475, y: 270 });
  g.__thayla.setState('play');
  g.useInteract({ t: 'synth' });
  if (!f.cure) throw new Error('soro não sintetizado');
});

check('final da cura', () => {
  g.showEnding('cure');
  step(90);
  press('Enter'); step(2);
  if (g.__thayla.getState() !== 'title') throw new Error('não voltou ao menu: ' + g.__thayla.getState());
});

log('--- save/load ---');
check('save e load', () => {
  g.newGame();
  for (let i = 0; i < 40; i++) { press('KeyE'); step(1); press('Space'); step(1); }
  g.__thayla.flags().keycard = true;
  g.saveGame();
  g.backToTitle();
  step(2);
  g.loadGame();
  if (!g.__thayla.flags().keycard) throw new Error('flag perdida');
  step(5);
});

log('--- estresse ---');
check('500 quadros variados', () => {
  g.setState = null;
  g.loadRoom('praca', null);
  g.__thayla.setState('play');
  for (let i = 0; i < 500; i++) {
    hold('KeyW', i % 40 < 12);
    hold('KeyD', i % 60 < 20);
    hold('KeyA', i % 80 < 10);
    g.Input.mouse.down = i % 7 === 0;
    g.Input.mouse.x = 200 + Math.sin(i / 20) * 100;
    g.Input.mouse.y = 120 + Math.cos(i / 30) * 60;
    step(1);
  }
  g.Input.mouse.down = false;
  hold('KeyW', false); hold('KeyD', false); hold('KeyA', false);
});

log(failures === 0 ? '\nTODOS OS TESTES PASSARAM' : '\n' + failures + ' FALHA(S)');
process.exit(failures === 0 ? 0 : 1);
