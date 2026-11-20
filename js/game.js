/* =========================================================
   THAYLA — Protocolo Guarannapuava
   Núcleo do jogo: estado, salas, combate, interação.
   ========================================================= */

var WEAPONS = {
  gun: {
    name: 'Pistola .40', ammo: 'ammo9', dmg: 34, rate: 0.26, speed: 560,
    spread: 0.03, pellets: 1, life: 0.72, shake: 1.5, sfx: 'shoot'
  },
  shotgun: {
    name: 'Escopeta 12', ammo: 'shell', dmg: 22, rate: 0.84, speed: 520,
    spread: 0.21, pellets: 7, life: 0.34, shake: 5, sfx: 'shotgun'
  }
};

var KEYNAMES = {
  keycard: 'Cartão R.P.D.',
  key_farmacia: 'Chave da Farmácia',
  crowbar: 'Pé de Cabra',
  fuse: 'Fusível 20A',
  reagent: 'Reagente A-3',
  blood: 'Sangue S-0',
  core: 'Núcleo da Rainha',
  cure: 'Soro R-7'
};

/* ---------------- estado ---------------- */

var state = 'title';
var room = null, roomId = null;
var world = {};
var flags = {}, inv = { ammo9: 12, shell: 0, herb: 0, weapon: 'gun', shotgun: false }, docs = {};
var objective = '';
var cam = { x: 0, y: 0 };
var shake = 0, shakeX = 0, shakeY = 0;
var fadeA = 0, trans = null;
var vignette = 0, flash = 0;
var tGlobal = 0;
var roomName = '', roomNameT = 0;
var toastMsg = null;
var nearest = null;
var lastEntry = null;
var saveExists = false;
var baseCache = {};
var booted = false;

var player = {
  x: 0, y: 0, hw: 5, hh: 6,
  hp: 100, maxhp: 100,
  aim: 0, face: 1, speed: 84, walkT: 0, moving: false,
  shootCd: 0, knifeCd: 0, dodge: 0, dodgeCd: 0, dodgeX: 0, dodgeY: 0,
  inv: 0, hurt: 0, muzzle: 0, dead: false
};

var bullets = [], ebullets = [], parts = [], floaters = [];

/* ---------------- utilidades ---------------- */

function showToast(txt) { toastMsg = { txt: txt, t: 2.4 }; }
function setObjective(txt) { objective = txt; }

function itemName(t) {
  return {
    ammo9: 'Munição 9mm', shell: 'Cartuchos 12', herb: 'Erva medicinal',
    keycard: 'Cartão R.P.D.', key_farmacia: 'Chave da Farmácia',
    reagent: 'Reagente A-3', core: 'Núcleo da Rainha', blood: 'Sangue S-0'
  }[t] || 'Item';
}

function makeEnemy(type, x, y, uid) {
  var S = {
    walker: { hp: 105, speed: 26, dmg: 10, reach: 14, windup: 0.34, hw: 6, hh: 7 },
    crawler: { hp: 70, speed: 46, dmg: 8, reach: 12, windup: 0.26, hw: 7, hh: 4 },
    tick: { hp: 24, speed: 60, dmg: 5, reach: 9, windup: 0.16, hw: 4, hh: 3 },
    queen: { hp: 520, speed: 22, dmg: 14, reach: 28, windup: 0.5, hw: 20, hh: 14 },
    raul: { hp: 380, speed: 54, dmg: 16, reach: 16, windup: 0.35, hw: 6, hh: 7 }
  }[type] || { hp: 100, speed: 24, dmg: 10, reach: 14, windup: 0.34, hw: 6, hh: 7 };

  return {
    type: type, uid: uid || null, x: x, y: y, hw: S.hw, hh: S.hh,
    hp: S.hp, maxhp: S.hp, speed: S.speed, dmg: S.dmg,
    reach: S.reach, windup: S.windup,
    walkT: rand(0, 6), seed: rand(0, 6.28), aim: 0,
    flash: 0, stun: 0, atkCd: rand(0.3, 1.2), atkWind: 0,
    dead: false, deadT: 0, awake: false, touchCd: 0,
    dash: 0, dashDir: 0, wind: 0, acidCd: 3.5, spawnCd: 6, kneeling: false
  };
}

/* ---------------- construção de sala ---------------- */

function loadRoom(id, pos) {
  var def = ROOMS[id];
  if (!def) return;

  roomId = id;
  var ws = world[id];
  if (!ws) ws = world[id] = { taken: {}, killed: {}, blood: [], coreX: 0, coreY: 0 };

  room = {
    id: id, def: def, w: def.w, h: def.h, theme: def.theme,
    dark: def.dark === undefined ? 0.6 : def.dark,
    rain: !!def.rain,
    walls: def.walls, solids: [], props: def.props || [],
    doors: [], items: [], notes: [], enemies: [], interacts: [],
    lights: def.lights || [], blood: ws.blood, base: null
  };

  var i, k;
  for (i = 0; i < def.walls.length; i++) {
    var wl = def.walls[i];
    room.solids.push({ x: wl[0], y: wl[1], w: wl[2], h: wl[3] });
  }
  for (i = 0; i < room.props.length; i++) {
    var pr = room.props[i];
    if (pr.solid) room.solids.push({ x: pr.x, y: pr.y, w: pr.w, h: pr.h });
  }

  for (i = 0; i < (def.doors || []).length; i++) room.doors.push(def.doors[i]);

  for (i = 0; i < (def.items || []).length; i++) {
    if (ws.taken['i' + i]) continue;
    var it = {};
    for (k in def.items[i]) it[k] = def.items[i][k];
    it.uid = 'i' + i;
    it.bob = rand(0, TAU);
    room.items.push(it);
  }

  for (i = 0; i < (def.notes || []).length; i++) {
    if (ws.taken['n' + i]) continue;
    var nt = {};
    for (k in def.notes[i]) nt[k] = def.notes[i][k];
    nt.uid = 'n' + i;
    room.notes.push(nt);
  }

  for (i = 0; i < (def.interacts || []).length; i++) room.interacts.push(def.interacts[i]);

  for (i = 0; i < (def.enemies || []).length; i++) {
    if (ws.killed['e' + i]) continue;
    room.enemies.push(makeEnemy(def.enemies[i].t, def.enemies[i].x, def.enemies[i].y, 'e' + i));
  }

  if (id === 'esgoto' && flags.queen_dead && !flags.core_taken) {
    room.items.push({
      t: 'core', x: ws.coreX || 512, y: ws.coreY || 330,
      take: true, uid: 'core_drop', bob: 0
    });
  }
  if (id === 'esgoto' && !flags.queen_dead) {
    room.enemies.push(makeEnemy('queen', 512, 300, 'queen'));
  }
  if (id === 'terraco' && !flags.raul_done) {
    room.enemies.push(makeEnemy('raul', 400, 170, 'raul'));
  }

  if (!baseCache[id]) baseCache[id] = Art.buildBase(room);
  room.base = baseCache[id];

  var start = pos || def.spawn || { x: def.w / 2, y: def.h / 2 };
  player.x = start.x;
  player.y = start.y;
  player.dodge = 0;
  player.walkT = 0;
  lastEntry = { x: start.x, y: start.y };

  bullets.length = 0;
  ebullets.length = 0;
  nearest = null;

  roomName = def.name;
  roomNameT = 3.2;

  cam.x = clamp(player.x - VIEW_W / 2, 0, Math.max(0, room.w - VIEW_W));
  cam.y = clamp(player.y - VIEW_H / 2, 0, Math.max(0, room.h - VIEW_H));
  if (room.w < VIEW_W) cam.x = (room.w - VIEW_W) / 2;
  if (room.h < VIEW_H) cam.y = (room.h - VIEW_H) / 2;

  Sfx.setRain(def.rain ? 1 : 0);
  onEnterRoom(id);
}

function onEnterRoom(id) {
  if (id === 'delegacia' && !flags.seen_delegacia) {
    flags.seen_delegacia = true;
    setObjective(LORE.objectives.delegacia);
    dialogueStart(LORE.dialogue.delegacia);
  } else if (id === 'praca' && !flags.seen_praca) {
    flags.seen_praca = true;
    dialogueStart(LORE.dialogue.praca);
  } else if (id === 'farmacia' && !flags.seen_farmacia) {
    flags.seen_farmacia = true;
    dialogueStart(LORE.dialogue.farmacia);
  } else if (id === 'esgoto' && !flags.seen_esgoto) {
    flags.seen_esgoto = true;
    dialogueStart(LORE.dialogue.esgoto, function () {
      if (!flags.queen_dead) dialogueStart(LORE.dialogue.queen);
    });
  } else if (id === 'laboratorio' && !flags.seen_lab) {
    flags.seen_lab = true;
    dialogueStart(LORE.dialogue.lab);
  } else if (id === 'terraco' && !flags.raul_intro) {
    flags.raul_intro = true;
    dialogueStart(LORE.dialogue.raul, function () {
      flags.raul_fight = true;
    });
  }
}

/* ---------------- movimento ---------------- */

function moveWithCollision(e, dx, dy) {
  if (!room) return;
  var solids = room.solids, i, s;

  if (dx) {
    e.x += dx;
    for (i = 0; i < solids.length; i++) {
      s = solids[i];
      if (e.x + e.hw > s.x && e.x - e.hw < s.x + s.w &&
          e.y + e.hh > s.y && e.y - e.hh < s.y + s.h) {
        if (dx > 0) e.x = s.x - e.hw;
        else e.x = s.x + s.w + e.hw;
      }
    }
  }
  if (dy) {
    e.y += dy;
    for (i = 0; i < solids.length; i++) {
      s = solids[i];
      if (e.x + e.hw > s.x && e.x - e.hw < s.x + s.w &&
          e.y + e.hh > s.y && e.y - e.hh < s.y + s.h) {
        if (dy > 0) e.y = s.y - e.hh;
        else e.y = s.y + s.h + e.hh;
      }
    }
  }

  e.x = clamp(e.x, e.hw, room.w - e.hw);
  e.y = clamp(e.y, e.hh, room.h - e.hh);
}

function pointInSolid(x, y) {
  if (!room) return false;
  var solids = room.solids;
  for (var i = 0; i < solids.length; i++) {
    var s = solids[i];
    if (x > s.x && x < s.x + s.w && y > s.y && y < s.y + s.h) return true;
  }
  return false;
}

/* ---------------- partículas ---------------- */

function bloodBurst(x, y, n, c) {
  for (var i = 0; i < n; i++) {
    var a = rand(0, TAU), sp = rand(18, 95);
    parts.push({
      x: x, y: y - 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - rand(0, 26),
      life: rand(0.25, 0.75), max: 0.75, r: rand(0.7, 2.2),
      c: c || '#6b1414', grav: 140, shape: 'dot'
    });
  }
}

function acidSplash(x, y) {
  for (var i = 0; i < 5; i++) {
    var a = rand(0, TAU), sp = rand(10, 50);
    parts.push({
      x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      life: rand(0.2, 0.5), max: 0.5, r: rand(0.8, 1.8),
      c: '#7fe08a', grav: 90, shape: 'dot'
    });
  }
}

function spark(x, y) {
  for (var i = 0; i < 4; i++) {
    var a = rand(0, TAU), sp = rand(20, 70);
    parts.push({
      x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      life: rand(0.12, 0.3), max: 0.3, r: rand(0.5, 1.2),
      c: '#ffd890', grav: 0, shape: 'dot'
    });
  }
}

function addBlood(x, y, r) {
  if (!room) return;
  room.blood.push({
    x: x + rand(-4, 4), y: y + rand(-2, 4),
    r: r * rand(0.7, 1.25), a: rand(0.35, 0.6)
  });
  if (room.blood.length > 70) room.blood.shift();
}

function updateParticles(dt) {
  for (var i = parts.length - 1; i >= 0; i--) {
    var p = parts[i];
    p.life -= dt;
    p.vy += (p.grav || 0) * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.life <= 0) parts.splice(i, 1);
  }
  for (var j = floaters.length - 1; j >= 0; j--) {
    var f = floaters[j];
    f.life -= dt;
    f.y -= 16 * dt;
    if (f.life <= 0) floaters.splice(j, 1);
  }
}

/* ---------------- combate ---------------- */

function damagePlayer(n, sx, sy) {
  if (!player || player.dead || player.inv > 0 || player.dodge > 0) return;
  if (state !== 'play' || trans) return;

  player.hp -= n;
  player.inv = 0.85;
  player.hurt = 0.4;
  vignette = Math.min(1, vignette + 0.8);
  shake = Math.max(shake, 3.5);
  Sfx.hurt();
  bloodBurst(player.x, player.y, 4);

  if (sx !== undefined) {
    var a = Math.atan2(player.y - sy, player.x - sx);
    moveWithCollision(player, Math.cos(a) * 9, Math.sin(a) * 9);
  }

  if (player.hp <= 0) {
    player.hp = 0;
    player.dead = true;
    state = 'dead';
    Sfx.roar();
  }
}

function hurtEnemy(e, dmg, vx, vy) {
  if (e.dead) return;
  e.hp -= dmg;
  e.flash = 0.09;
  e.stun = Math.max(e.stun, 0.07);
  Sfx.hit();
  bloodBurst(e.x, e.y, 3);
  shake = Math.max(shake, 1.6);
  if (vx || vy) {
    var a = Math.atan2(vy, vx);
    e.x += Math.cos(a) * 1.6;
    e.y += Math.sin(a) * 1.6;
  }
  if (e.hp <= 0) killEnemy(e);
}

function killEnemy(e) {
  if (e.type === 'raul') { defeatRaul(e); return; }

  e.dead = true;
  e.deadT = 0;
  Sfx.splat();
  bloodBurst(e.x, e.y, 12);
  addBlood(e.x, e.y, e.type === 'queen' ? 26 : 10);
  shake = Math.max(shake, e.type === 'queen' ? 9 : 2.5);

  if (e.uid && e.uid.charAt(0) === 'e') world[roomId].killed[e.uid] = true;

  if (e.type === 'queen') {
    flags.queen_dead = true;
    if (world.esgoto) { world.esgoto.coreX = e.x; world.esgoto.coreY = e.y; }
    room.items.push({ t: 'core', x: e.x, y: e.y, take: true, uid: 'core_drop', bob: 0 });
    setObjective('Leve o núcleo ao laboratório subterrâneo.');
    dialogueStart([{ who: 'THAYLA', text: 'O núcleo está na minha mão. Pulsando. Ainda vivo.' }]);
  }
}

function defeatRaul(e) {
  e.hp = 0;
  e.dead = true;
  e.kneeling = true;
  e.deadT = 0;
  flags.raul_done = true;
  flags.raul_fight = false;
  ebullets.length = 0;
  bullets.length = 0;
  Sfx.splat();
  addBlood(e.x, e.y, 14);
  shake = 6;
  setObjective(LORE.objectives.final);
  dialogueStart(LORE.dialogue.raul_defeat, showFinalChoice);
}

function shoot() {
  var w = WEAPONS[inv.weapon];
  if (!w || player.shootCd > 0 || state !== 'play' || player.dead) return;

  if (inv[w.ammo] <= 0) {
    Sfx.dry();
    player.shootCd = 0.3;
    showToast('SEM MUNIÇÃO');
    return;
  }

  inv[w.ammo]--;
  player.shootCd = w.rate;
  player.muzzle = 0.06;
  shake = Math.max(shake, w.shake);
  Sfx[w.sfx]();

  var bx = player.x + Math.cos(player.aim) * 9;
  var by = player.y - 4 + Math.sin(player.aim) * 9;

  for (var i = 0; i < w.pellets; i++) {
    var a = player.aim + rand(-w.spread, w.spread);
    bullets.push({
      x: bx, y: by,
      vx: Math.cos(a) * w.speed, vy: Math.sin(a) * w.speed,
      life: w.life, dmg: w.dmg
    });
  }

  parts.push({
    x: bx, y: by,
    vx: Math.cos(player.aim + 1.6) * rand(20, 55),
    vy: Math.sin(player.aim + 1.6) * rand(20, 55) - 20,
    life: 0.45, max: 0.45, r: 0.9, c: '#c8a860', grav: 200, shape: 'dot'
  });
}

function melee() {
  if (player.knifeCd > 0 || state !== 'play') return;
  player.knifeCd = 0.42;
  Sfx.knife();

  var dmg = flags.crowbar ? 58 : 42;
  for (var i = 0; i < room.enemies.length; i++) {
    var e = room.enemies[i];
    if (e.dead) continue;
    var d = dist(player.x, player.y, e.x, e.y);
    if (d < e.hw + 23) {
      var a = Math.atan2(e.y - player.y, e.x - player.x);
      if (Math.abs(angDiff(player.aim, a)) < 0.95) {
        hurtEnemy(e, dmg, Math.cos(a), Math.sin(a));
      }
    }
  }

  for (var s = 0; s < 5; s++) {
    var aa = player.aim + rand(-0.55, 0.55);
    parts.push({
      x: player.x + Math.cos(aa) * 12, y: player.y - 4 + Math.sin(aa) * 12,
      vx: Math.cos(aa) * rand(40, 90), vy: Math.sin(aa) * rand(40, 90),
      life: 0.18, max: 0.18, r: 0.8, c: '#c8d8e8', grav: 0, shape: 'dot'
    });
  }
}

/* ---------------- inimigos ---------------- */

function separate(e) {
  for (var i = 0; i < room.enemies.length; i++) {
    var o = room.enemies[i];
    if (o === e || o.dead) continue;
    var dx = o.x - e.x, dy = o.y - e.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    var min = (e.hw + o.hw) * 0.85;
    if (d > 0.001 && d < min) {
      e.x -= (dx / d) * (min - d) * 0.4;
      e.y -= (dy / d) * (min - d) * 0.4;
    }
  }
}

function updateBasicEnemy(e, dt) {
  e.atkCd = Math.max(0, e.atkCd - dt);
  var d = dist(e.x, e.y, player.x, player.y);

  if (!e.awake) {
    if (d < 310 || e.type === 'tick') e.awake = true;
    else return;
  }
  if (e.stun > 0) return;

  if (e.atkWind > 0) {
    e.atkWind -= dt;
    if (e.atkWind <= 0) {
      if (dist(e.x, e.y, player.x, player.y) < e.reach + 9) {
        damagePlayer(e.dmg, e.x, e.y);
      }
      e.atkCd = 1.05;
    }
    return;
  }

  if (d < e.reach + 2) {
    if (e.atkCd <= 0) {
      e.atkWind = e.windup;
      if (e.type !== 'tick') Sfx.growl();
    }
    return;
  }

  var ang = Math.atan2(player.y - e.y, player.x - e.x) + Math.sin(e.walkT * 2 + e.seed) * 0.22;
  moveWithCollision(e, Math.cos(ang) * e.speed * dt, Math.sin(ang) * e.speed * dt);
}

function spawnTicks(e) {
  for (var i = 0; i < 2; i++) {
    var t = makeEnemy('tick', e.x + rand(-26, 26), e.y + rand(-16, 16), null);
    t.awake = true;
    room.enemies.push(t);
  }
  Sfx.growl();
}

function queenAcid(e) {
  Sfx.acid();
  for (var i = -1; i <= 1; i++) {
    var a = e.aim + i * 0.22;
    ebullets.push({
      x: e.x + Math.cos(a) * 18, y: e.y + Math.sin(a) * 18,
      vx: Math.cos(a) * 148, vy: Math.sin(a) * 148, r: 4, life: 3
    });
  }
}

function updateQueen(e, dt) {
  e.atkCd = Math.max(0, e.atkCd - dt);
  e.spawnCd -= dt;
  e.acidCd -= dt;
  var d = dist(e.x, e.y, player.x, player.y);

  if (e.atkWind > 0) {
    e.atkWind -= dt;
    if (e.atkWind <= 0) queenAcid(e);
    return;
  }
  if (e.dash > 0) {
    e.dash -= dt;
    moveWithCollision(e, Math.cos(e.dashDir) * 150 * dt, Math.sin(e.dashDir) * 150 * dt);
    if (d < e.reach) { damagePlayer(16, e.x, e.y); e.dash = 0; }
    return;
  }

  if (d > 62) moveWithCollision(e, Math.cos(e.aim) * e.speed * dt, Math.sin(e.aim) * e.speed * dt);

  if (e.atkCd <= 0 && d < 250) {
    e.atkWind = 0.55;
    e.atkCd = 2.8;
  } else if (e.spawnCd <= 0) {
    e.spawnCd = 8;
    spawnTicks(e);
  }

  if (d < e.reach && e.touchCd <= 0) {
    damagePlayer(12, e.x, e.y);
    e.touchCd = 1.0;
  }
}

function raulSpit(e) {
  Sfx.acid();
  for (var i = -1; i <= 1; i++) {
    var a = e.aim + i * 0.16;
    ebullets.push({
      x: e.x + Math.cos(a) * 12, y: e.y + Math.sin(a) * 12,
      vx: Math.cos(a) * 130, vy: Math.sin(a) * 130, r: 3.5, life: 3
    });
  }
}

function updateRaul(e, dt) {
  if (!flags.raul_fight) return;
  var d = dist(e.x, e.y, player.x, player.y);
  e.atkCd = Math.max(0, e.atkCd - dt);
  e.touchCd = Math.max(0, e.touchCd - dt);
  e.acidCd -= dt;

  if (e.dash > 0) {
    e.dash -= dt;
    moveWithCollision(e, Math.cos(e.dashDir) * 240 * dt, Math.sin(e.dashDir) * 240 * dt);
    if (d < e.reach + 5 && e.touchCd <= 0) {
      damagePlayer(18, e.x, e.y);
      e.touchCd = 0.8;
    }
    return;
  }
  if (e.wind > 0) {
    e.wind -= dt;
    if (e.wind <= 0) {
      e.dash = 0.32;
      e.dashDir = e.aim;
      Sfx.roar();
    }
    return;
  }

  if (d > 46) moveWithCollision(e, Math.cos(e.aim) * e.speed * dt, Math.sin(e.aim) * e.speed * dt);
  else if (d < 28) moveWithCollision(e, -Math.cos(e.aim) * e.speed * 0.5 * dt, -Math.sin(e.aim) * e.speed * 0.5 * dt);

  if (d < e.reach + 2 && e.touchCd <= 0) {
    damagePlayer(14, e.x, e.y);
    e.touchCd = 0.9;
  }
  if (e.atkCd <= 0 && d < 230) {
    e.wind = 0.45;
    e.atkCd = 2.4;
  }
  if (e.acidCd <= 0) {
    e.acidCd = 4.5;
    raulSpit(e);
  }
}

function updateEnemies(dt) {
  for (var i = 0; i < room.enemies.length; i++) {
    var e = room.enemies[i];
    if (e.dead) { e.deadT += dt; continue; }
    e.flash = Math.max(0, e.flash - dt);
    e.stun = Math.max(0, e.stun - dt);
    e.touchCd = Math.max(0, e.touchCd - dt);
    e.aim = Math.atan2(player.y - e.y, player.x - e.x);
    e.walkT += dt;

    if (e.type === 'queen') { updateQueen(e, dt); continue; }
    if (e.type === 'raul') { updateRaul(e, dt); continue; }

    updateBasicEnemy(e, dt);
    separate(e);
  }
}

function updateBullets(dt) {
  for (var i = bullets.length - 1; i >= 0; i--) {
    var b = bullets[i];
    var dead = false;

    for (var s = 0; s < 2; s++) {
      b.x += b.vx * dt * 0.5;
      b.y += b.vy * dt * 0.5;

      if (pointInSolid(b.x, b.y)) { spark(b.x, b.y); dead = true; break; }

      for (var j = 0; j < room.enemies.length; j++) {
        var e = room.enemies[j];
        if (e.dead) continue;
        if (dist(b.x, b.y, e.x, e.y) < e.hw + 3) {
          hurtEnemy(e, b.dmg, b.vx, b.vy);
          dead = true;
          break;
        }
      }
      if (dead) break;
    }

    b.life -= dt;
    if (dead || b.life <= 0) bullets.splice(i, 1);
  }
}

function updateEbullets(dt) {
  for (var i = ebullets.length - 1; i >= 0; i--) {
    var b = ebullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;

    if (pointInSolid(b.x, b.y) || b.life <= 0) {
      acidSplash(b.x, b.y);
      ebullets.splice(i, 1);
      continue;
    }
    if (dist(b.x, b.y, player.x, player.y) < 9) {
      damagePlayer(11, b.x, b.y);
      acidSplash(b.x, b.y);
      ebullets.splice(i, 1);
    }
  }
}

/* ---------------- interação ---------------- */

function findNearest() {
  if (!room) return null;
  var best = null, bd = 1e9, i, dd, d;

  for (i = 0; i < room.doors.length; i++) {
    d = room.doors[i];
    dd = dist(player.x, player.y, d.ix, d.iy);
    if (dd < 34 && dd < bd) {
      bd = dd;
      var locked = d.lock && !flags[d.lock];
      best = { kind: 'door', obj: d, label: locked ? (d.label + ' — trancada') : d.label };
    }
  }
  for (i = 0; i < room.notes.length; i++) {
    var n = room.notes[i];
    dd = dist(player.x, player.y, n.x, n.y);
    if (dd < 27 && dd < bd) {
      bd = dd;
      var ni = LORE.notes[n.id];
      best = { kind: 'note', obj: n, label: 'Ler: ' + (ni ? ni.label : 'Documento') };
    }
  }
  for (i = 0; i < room.items.length; i++) {
    var it = room.items[i];
    if (!it.take) continue;
    dd = dist(player.x, player.y, it.x, it.y);
    if (dd < 27 && dd < bd) {
      bd = dd;
      best = { kind: 'item', obj: it, label: 'Pegar: ' + itemName(it.t) };
    }
  }
  for (i = 0; i < room.interacts.length; i++) {
    var ic = room.interacts[i];
    dd = dist(player.x, player.y, ic.x, ic.y);
    if (dd < 31 && dd < bd) {
      bd = dd;
      best = { kind: 'int', obj: ic, label: ic.label };
    }
  }
  return best;
}

function doInteract() {
  if (!nearest) return;
  var k = nearest.kind, o = nearest.obj;

  if (k === 'door') useDoor(o);
  else if (k === 'note') openDoc(o.id, 'play');
  else if (k === 'item') takeItem(o);
  else if (k === 'int') useInteract(o);
}

function useDoor(d) {
  if (d.lock && !flags[d.lock]) {
    Sfx.locked();
    showToast(d.lockMsg || 'Trancada.');
    return;
  }
  var target = ROOMS[d.to];
  if (!target) return;

  var arrive = null;
  for (var i = 0; i < (target.doors || []).length; i++) {
    if (target.doors[i].id === d.toDoor) arrive = target.doors[i].arrive;
  }
  if (!arrive) arrive = target.spawn || { x: target.w / 2, y: target.h / 2 };

  transitionTo(d.to, arrive);
}

function transitionTo(id, pos) {
  if (trans) return;
  trans = {
    t: 0, phase: 'out',
    fn: function () { loadRoom(id, pos); }
  };
  Sfx.door();
  player.inv = Math.max(player.inv, 0.5);
}

function useInteract(ic) {
  if (ic.t === 'keypad') {
    if (flags.locker_open) { showToast('O armário está vazio.'); return; }
    keypadOpen();
    return;
  }

  if (ic.t === 'save') {
    saveGame();
    Sfx.save();
    return;
  }

  if (ic.t === 'fuse') {
    if (flags.power) { showToast('A energia já está estável.'); return; }
    if (!flags.fuse) { Sfx.locked(); showToast('Falta um fusível de 20A.'); return; }
    flags.fuse = false;
    flags.power = true;
    Sfx.alarm();
    showToast('ENERGIA RESTAURADA');
    setObjective('Recupere a amostra de sangue na câmara fria.');
    dialogueStart(LORE.dialogue.power);
    return;
  }

  if (ic.t === 'cold') {
    if (!flags.power) { Sfx.locked(); showToast('A câmara fria está sem energia.'); return; }
    if (flags.blood) { showToast('A câmara está vazia.'); return; }
    flags.blood = true;
    flags.blood_taken = true;
    Sfx.key();
    showToast('OBTEVE: SANGUE S-0');
    setObjective(LORE.objectives.sintese);
    return;
  }

  if (ic.t === 'synth') {
    if (!flags.power) { Sfx.locked(); showToast('A centrífuga está sem energia.'); return; }
    if (flags.cure) { showToast('A cuba está vazia. Só havia uma dose.'); return; }
    if (!flags.reagent || !flags.core || !flags.blood) {
      var miss = [];
      if (!flags.reagent) miss.push('reagente A-3');
      if (!flags.core) miss.push('núcleo da rainha');
      if (!flags.blood) miss.push('sangue S-0');
      Sfx.locked();
      showToast('FALTAM: ' + miss.join(', ').toUpperCase() + '.');
      return;
    }
    flags.reagent = false;
    flags.core = false;
    flags.blood = false;
    flags.cure = true;
    Sfx.inject();
    setObjective(LORE.objectives.terraco);
    showToast('SORO R-7 SINTETIZADO — UMA DOSE');
    return;
  }

  if (ic.t === 'elevator') {
    if (!flags.power) { Sfx.locked(); showToast('O elevador está sem energia.'); return; }
    if (!flags.keycard) { Sfx.locked(); showToast('O leitor exige o Cartão R.P.D.'); return; }
    transitionTo('terraco', { x: 400, y: 400 });
    return;
  }
}

function takeItem(it) {
  var ws = world[roomId];
  var idx = room.items.indexOf(it);
  if (idx >= 0) room.items.splice(idx, 1);

  if (it.uid === 'core_drop') flags.core_taken = true;
  else if (it.uid && ws) ws.taken[it.uid] = true;

  if (it.t === 'ammo9') {
    inv.ammo9 += it.n || 8;
    Sfx.pickup();
    showToast('+ ' + (it.n || 8) + ' MUNIÇÃO 9MM');
  } else if (it.t === 'shell') {
    inv.shell += it.n || 4;
    Sfx.pickup();
    showToast('+ ' + (it.n || 4) + ' CARTUCHOS 12');
  } else if (it.t === 'herb') {
    inv.herb++;
    Sfx.pickup();
    showToast('+ ERVA MEDICINAL');
  } else {
    giveKey(it.t);
    Sfx.key();
    showToast('OBTEVE: ' + itemName(it.t).toUpperCase());
  }
}

function giveKey(t) {
  flags[t] = true;

  if (t === 'keycard') {
    if (!flags.key_farmacia) setObjective('Pegue a Chave da Farmácia e abra o armário de evidências.');
  }
  if (t === 'key_farmacia') setObjective(LORE.objectives.farmacia);
  if (t === 'reagent') setObjective(LORE.objectives.esgoto);
  if (t === 'core') setObjective(LORE.objectives.lab);
}

function onKeypadSuccess() {
  flags.locker_open = true;
  flags.fuse = true;
  flags.crowbar = true;
  inv.shotgun = true;
  inv.shell += 6;
  inv.ammo9 += 10;
  Sfx.save();
  showToast('ESCOPETA · FUSÍVEL · PÉ DE CABRA · MUNIÇÃO');
  if (!flags.key_farmacia) setObjective('Encontre a Chave da Farmácia.');
}

function useHerb() {
  if (inv.herb <= 0) { showToast('Sem ervas.'); return; }
  if (player.hp >= player.maxhp) { showToast('Você não precisa disso agora.'); return; }
  inv.herb--;
  player.hp = Math.min(player.maxhp, player.hp + 40);
  vignette = 0.25;
  Sfx.heal();
  showToast('+40 VIDA');
  if (state === 'inv') state = 'play';
}

/* ---------------- progresso / save ---------------- */

function saveGame() {
  if (!room) return;
  try {
    var data = {
      v: 1, roomId: roomId, x: player.x, y: player.y, hp: player.hp,
      flags: flags, inv: inv, docs: docs, objective: objective
    };
    localStorage.setItem('thayla_save', JSON.stringify(data));
    saveExists = true;
    showToast('PROGRESSO SALVO');
  } catch (e) {
    showToast('Não foi possível salvar.');
  }
}

function checkSave() {
  try { saveExists = !!localStorage.getItem('thayla_save'); }
  catch (e) { saveExists = false; }
}

function loadGame() {
  try {
    var raw = localStorage.getItem('thayla_save');
    if (!raw) { newGame(); return; }
    var data = JSON.parse(raw);

    flags = data.flags || {};
    inv = data.inv || { ammo9: 12, shell: 0, herb: 0, weapon: 'gun', shotgun: false };
    docs = data.docs || {};
    player.hp = data.hp || 100;
    objective = data.objective || LORE.objectives.start;
    player.dead = false;

    world = {};
    baseCache = {};
    state = 'play';
    loadRoom(data.roomId, { x: data.x, y: data.y });
    fadeA = 1;
    Sfx.ui();
  } catch (e) {
    newGame();
  }
}

/* =========================================================
   LOOP PRINCIPAL
   ========================================================= */

function newGame() {
  flags = {};
  world = {};
  docs = {};
  baseCache = {};
  inv = { ammo9: 12, shell: 0, herb: 0, weapon: 'gun', shotgun: false };
  player.hp = 100;
  player.dead = false;
  player.inv = 0;
  player.hurt = 0;
  objective = LORE.objectives.start;
  state = 'play';
  loadRoom('rua', { x: 110, y: 340 });
  fadeA = 1;
  dialogueStart(LORE.intro);
  Sfx.init();
}

function retry() {
  state = 'play';
  player.dead = false;
  player.hp = Math.max(60, player.hp);
  player.inv = 1.6;
  player.hurt = 0;
  bullets.length = 0;
  ebullets.length = 0;
  loadRoom(roomId, lastEntry || null);
  fadeA = 1;
}

function backToTitle() {
  state = 'title';
  titleMenu = 0;
  ending = null;
  dlg = null;
  doc = null;
  keypadUI = null;
  choiceUI = null;
  fadeA = 1;
  Sfx.setRain(0.32);
  checkSave();
  hideBoot();
}

function showFinalChoice() {
  showChoice([
    {
      label: 'Aplicar o Soro R-7', disabled: !flags.cure,
      note: flags.cure ? '' : 'Você não sintetizou o soro.',
      action: function () { showEnding('cure'); }
    },
    { label: 'Atirar em Raul', action: function () { showEnding('shoot'); } },
    { label: 'Deixar e ir embora', action: function () { showEnding('leave'); } }
  ]);
}

function updatePlay(dt) {
  var p = player;
  var i;

  p.shootCd = Math.max(0, p.shootCd - dt);
  p.knifeCd = Math.max(0, p.knifeCd - dt);
  p.dodgeCd = Math.max(0, p.dodgeCd - dt);
  p.inv = Math.max(0, p.inv - dt);
  p.hurt = Math.max(0, p.hurt - dt);
  p.muzzle = Math.max(0, p.muzzle - dt);

  /* mira */
  var wx = cam.x + Input.mouse.x, wy = cam.y + Input.mouse.y;
  if (Math.abs(wx - p.x) + Math.abs(wy - p.y) > 5) p.aim = Math.atan2(wy - p.y, wx - p.x);
  p.face = Math.cos(p.aim) < 0 ? -1 : 1;

  /* movimento */
  var mx = (Input.key('KeyD') || Input.key('ArrowRight') ? 1 : 0) -
           (Input.key('KeyA') || Input.key('ArrowLeft') ? 1 : 0);
  var my = (Input.key('KeyS') || Input.key('ArrowDown') ? 1 : 0) -
           (Input.key('KeyW') || Input.key('ArrowUp') ? 1 : 0);
  var len = Math.hypot(mx, my);
  if (len > 0) { mx /= len; my /= len; }

  if (Input.hit('Space') && p.dodgeCd <= 0) {
    var dx = len > 0 ? mx : Math.cos(p.aim);
    var dy = len > 0 ? my : Math.sin(p.aim);
    p.dodge = 0.17;
    p.dodgeCd = 0.8;
    p.dodgeX = dx;
    p.dodgeY = dy;
    Sfx.knife();
    for (i = 0; i < 4; i++) {
      parts.push({
        x: p.x, y: p.y + 3, vx: -dx * rand(10, 45), vy: -dy * rand(10, 45),
        life: 0.3, max: 0.3, r: rand(1, 2), c: '#5a6a7a', grav: 0, shape: 'dot'
      });
    }
  }

  if (p.dodge > 0) {
    p.dodge -= dt;
    p.moving = true;
    p.walkT += dt * 1.7;
    moveWithCollision(p, p.dodgeX * 230 * dt, p.dodgeY * 230 * dt);
  } else if (len > 0) {
    p.moving = true;
    p.walkT += dt;
    moveWithCollision(p, mx * p.speed * dt, my * p.speed * dt);
  } else {
    p.moving = false;
  }

  if (Input.mouse.down) shoot();
  if (Input.hit('KeyF')) melee();

  if (Input.hit('Tab') || Input.hit('KeyI')) { openInventory(); return; }
  if (Input.hit('Escape')) { openInventory(); return; }
  if (Input.hit('KeyE')) doInteract();
  if (Input.hit('KeyH')) useHerb();
  if (Input.hit('KeyQ') && inv.shotgun) {
    inv.weapon = inv.weapon === 'gun' ? 'shotgun' : 'gun';
    Sfx.ui();
    showToast(WEAPONS[inv.weapon].name.toUpperCase());
  }

  updateEnemies(dt);
  updateBullets(dt);
  updateEbullets(dt);

  /* itens automáticos */
  for (i = room.items.length - 1; i >= 0; i--) {
    var it = room.items[i];
    if (it.take) continue;
    if (dist(p.x, p.y, it.x, it.y) < 14) takeItem(it);
  }

  nearest = findNearest();

  if (room.rain && Math.random() < dt * 0.06) flash = 1;
}

function updateCamera(dt) {
  if (!room) return;
  var tx = clamp(player.x - VIEW_W / 2, 0, Math.max(0, room.w - VIEW_W));
  var ty = clamp(player.y - VIEW_H / 2, 0, Math.max(0, room.h - VIEW_H));
  if (room.w < VIEW_W) tx = (room.w - VIEW_W) / 2;
  if (room.h < VIEW_H) ty = (room.h - VIEW_H) / 2;
  cam.x = lerp(cam.x, tx, Math.min(1, dt * 9));
  cam.y = lerp(cam.y, ty, Math.min(1, dt * 9));
}

function updateTrans(dt) {
  if (!trans) return;
  trans.t += dt;
  if (trans.phase === 'out') {
    fadeA = clamp(trans.t / 0.3, 0, 1);
    if (trans.t >= 0.3) {
      trans.phase = 'in';
      trans.t = 0;
      trans.fn();
    }
  } else {
    fadeA = 1 - clamp(trans.t / 0.35, 0, 1);
    if (trans.t >= 0.35) {
      trans = null;
      fadeA = 0;
    }
  }
}

function update(dt) {
  tGlobal += dt;
  shake = Math.max(0, shake - dt * 16);
  shakeX = rand(-shake, shake);
  shakeY = rand(-shake, shake);
  vignette = Math.max(0, vignette - dt * 1.4);
  flash = Math.max(0, flash - dt * 2.5);
  if (roomNameT > 0) roomNameT -= dt;
  if (toastMsg) {
    toastMsg.t -= dt;
    if (toastMsg.t <= 0) toastMsg = null;
  }

  if (Input.hit('KeyM')) {
    var mm = Sfx.toggleMute();
    showToast(mm ? 'SOM DESLIGADO' : 'SOM LIGADO');
  }

  updateParticles(dt);
  updateRain(dt);
  updateCamera(dt);
  if (trans) updateTrans(dt);

  switch (state) {
    case 'title': updateTitle(dt); break;
    case 'play': if (!trans) updatePlay(dt); break;
    case 'dialogue': updateDialogue(dt); break;
    case 'doc': updateDoc(dt); break;
    case 'inv': updateInv(dt); break;
    case 'keypad': updateKeypad(dt); break;
    case 'choice': updateChoice(dt); break;
    case 'dead': updateDead(dt); break;
    case 'ending': updateEnding(dt); break;
  }

  if (!trans && fadeA > 0 && state !== 'ending') {
    fadeA = Math.max(0, fadeA - dt * 2.4);
  }
}

var lastTs = 0;

function frame(ts) {
  if (!lastTs) lastTs = ts;
  var dt = (ts - lastTs) / 1000;
  lastTs = ts;
  if (!isFinite(dt) || dt <= 0) dt = 0.016;
  dt = Math.min(dt, 0.05);

  Input.sync();
  update(dt);
  render();
  Input.endFrame();
  requestAnimationFrame(frame);
}

function boot() {
  if (booted) return;
  booted = true;
  engineInit();
  initRain();
  checkSave();
  Sfx.setRain(0.25);

  window.addEventListener('pointerdown', function () { Sfx.init(); hideBoot(); });
  window.addEventListener('keydown', function () { Sfx.init(); hideBoot(); });

  requestAnimationFrame(frame);
}

if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('load', boot);
}

/* hooks de teste / depuração */
window.__thayla = {
  boot: boot, newGame: newGame, loadRoom: loadRoom, update: update, render: render,
  player: player,
  getRoom: function () { return room; },
  getState: function () { return state; },
  setState: function (s) { state = s; },
  flags: function () { return flags; },
  inv: function () { return inv; }
};
