/* =========================================================
   THAYLA — renderização da cena
   ========================================================= */

var rainDrops = [];
var lightCanvas = null, lctx = null;

function initRain() {
  rainDrops = [];
  for (var i = 0; i < 120; i++) {
    rainDrops.push({
      x: rand(0, VIEW_W), y: rand(0, VIEW_H),
      s: rand(230, 360), l: rand(3, 9)
    });
  }
}

function updateRain(dt) {
  if (!room || !room.rain) return;
  for (var i = 0; i < rainDrops.length; i++) {
    var d = rainDrops[i];
    d.y += d.s * dt;
    d.x -= d.s * 0.24 * dt;
    if (d.y > VIEW_H + 6) { d.y = -10; d.x = rand(-30, VIEW_W + 30); }
    if (d.x < -30) d.x = VIEW_W + 30;
  }
}

function drawRain(g) {
  if (!room || !room.rain) return;
  g.strokeStyle = 'rgba(170,198,220,0.20)';
  g.lineWidth = 1;
  g.beginPath();
  for (var i = 0; i < rainDrops.length; i++) {
    var d = rainDrops[i];
    g.moveTo(d.x, d.y);
    g.lineTo(d.x + d.l * 0.24, d.y - d.l);
  }
  g.stroke();

  g.fillStyle = 'rgba(170,198,220,0.10)';
  for (var j = 0; j < 22; j++) {
    var sx = (j * 73 + (tGlobal * 40) % VIEW_W) % VIEW_W;
    var sy = (j * 47 + (tGlobal * 70) % VIEW_H) % VIEW_H;
    g.fillRect(sx, sy, 1, 1);
  }
}

/* =========================================================
   CENA
   ========================================================= */

function render() {
  var g = GCTX;
  if (document.body && document.body.classList) {
    document.body.classList.toggle('touch-modal', state === 'dialogue' || state === 'doc');
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = '#04060a';
  g.fillRect(0, 0, VIEW_W, VIEW_H);

  if (state === 'title') {
    drawTitleGame(g);
  } else if (state === 'ending') {
    g.fillStyle = '#04060a';
    g.fillRect(0, 0, VIEW_W, VIEW_H);
  } else if (room) {
    drawScene(g);
  }

  blitGame();
  drawOverlayUI(CTX);
}

function blitGame() {
  CTX.setTransform(1, 0, 0, 1, 0, 0);
  CTX.fillStyle = '#000';
  CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
  CTX.imageSmoothingEnabled = false;
  CTX.setTransform(Render.scale, 0, 0, Render.scale, Render.ox, Render.oy);
  CTX.drawImage(GAME_CANVAS, 0, 0);
}

function drawScene(g) {
  g.save();
  g.translate(-Math.round(cam.x) + Math.round(shakeX), -Math.round(cam.y) + Math.round(shakeY));

  if (room.base) g.drawImage(room.base, 0, 0);
  else { g.fillStyle = '#101318'; g.fillRect(0, 0, room.w, room.h); }

  drawBlood(g);
  drawDoorFrames(g);
  drawNotes(g);
  drawItems(g);
  drawEnemies(g);
  drawPlayerLayer(g);
  drawBullets(g);
  drawParticles(g);
  drawFloaters(g);

  g.restore();

  drawLighting(g);
  drawRain(g);
  if (flash > 0) {
    g.fillStyle = 'rgba(190,215,255,' + (flash * 0.28) + ')';
    g.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  drawVignette(g);
}

function drawBlood(g) {
  if (!room.blood) return;
  for (var i = 0; i < room.blood.length; i++) {
    var b = room.blood[i];
    g.globalAlpha = b.a;
    fillEllipse(g, b.x, b.y, b.r, b.r * 0.45, '#5a1010');
    fillEllipse(g, b.x + b.r * 0.3, b.y + 2, b.r * 0.5, b.r * 0.2, '#3d0a0a');
    g.globalAlpha = 1;
  }
}

function drawDoorFrames(g) {
  if (!room.doors) return;
  for (var i = 0; i < room.doors.length; i++) {
    var d = room.doors[i];
    if (d.noFrame) continue;
    var locked = d.lock && !flags[d.lock];
    var near = nearest && nearest.kind === 'door' && nearest.obj === d;

    fillRect(g, d.x, d.y, d.w, d.h, '#0a0d11');
    fillRect(g, d.x + 2, d.y + 2, d.w - 4, d.h - 4, near ? '#33414f' : '#222b34');
    /* batente */
    if (d.w > d.h) {
      fillRect(g, d.x, d.y, d.w, 3, '#39434d');
      fillRect(g, d.x, d.y + d.h - 3, d.w, 3, '#39434d');
      fillRect(g, d.x + d.w * 0.48, d.y + 4, 3, d.h - 8, '#141a20');
      fillCircle(g, d.x + d.w * 0.42, d.y + d.h / 2, 1.6, '#9aa4ac');
    } else {
      fillRect(g, d.x, d.y, 3, d.h, '#39434d');
      fillRect(g, d.x + d.w - 3, d.y, 3, d.h, '#39434d');
      fillRect(g, d.x + 4, d.y + d.h * 0.48, d.w - 8, 3, '#141a20');
      fillCircle(g, d.x + d.w / 2, d.y + d.h * 0.42, 1.6, '#9aa4ac');
    }
    /* luz de trava */
    fillCircle(g, d.x + d.w - 5, d.y + 5, 2, locked ? '#c04030' : '#4ad07a');
    if (near) {
      g.globalAlpha = 0.5;
      fillCircle(g, d.ix, d.iy, 10, 'rgba(140,200,255,0.10)');
      g.globalAlpha = 1;
    }
  }
}

function drawItems(g) {
  if (!room.items) return;
  for (var i = 0; i < room.items.length; i++) {
    var it = room.items[i];
    var bob = Math.sin(tGlobal * 2.4 + (it.bob || 0)) * 1.3;
    var x = it.x, y = it.y + bob;
    var near = nearest && nearest.kind === 'item' && nearest.obj === it;
    var glow = 0.16 + 0.08 * Math.sin(tGlobal * 4 + i);

    var col = '#c8d8e8';
    if (it.t === 'herb') col = '#6ad06a';
    else if (it.t === 'reagent') col = '#6ad0d0';
    else if (it.t === 'core') col = '#ff6a5a';
    else if (it.t === 'keycard') col = '#e0c860';
    else if (it.t.indexOf('key') === 0) col = '#e0c860';

    g.globalAlpha = glow + (near ? 0.25 : 0);
    fillCircle(g, x, y, 9, col);
    g.globalAlpha = 1;

    if (it.t === 'ammo9') {
      fillRect(g, x - 4, y - 3, 8, 6, '#4a5142');
      fillRect(g, x - 3, y - 2, 6, 4, '#6a7358');
      fillRect(g, x - 3, y - 2, 6, 1, '#c8c070');
    } else if (it.t === 'shell') {
      fillRect(g, x - 4, y - 3, 8, 6, '#5a2a2a');
      fillRect(g, x - 3, y - 2, 2, 4, '#c04a3a');
      fillRect(g, x - 0.5, y - 2, 2, 4, '#c04a3a');
      fillRect(g, x + 2, y - 2, 2, 4, '#c04a3a');
    } else if (it.t === 'herb') {
      fillCircle(g, x, y, 4, '#3f8a4a');
      fillCircle(g, x - 2, y - 2, 2.4, '#6ad06a');
      fillCircle(g, x + 2, y + 1, 2.2, '#56b060');
    } else if (it.t === 'keycard') {
      fillRect(g, x - 4, y - 3, 8, 6, '#e0c860');
      fillRect(g, x - 3, y - 1, 5, 1, '#6a5a20');
      fillRect(g, x - 3, y + 1, 3, 1, '#6a5a20');
    } else if (it.t === 'reagent') {
      fillRect(g, x - 2.5, y - 4, 5, 8, '#8adede');
      fillRect(g, x - 3, y - 5, 6, 2, '#c8d0d0');
    } else if (it.t === 'core') {
      fillCircle(g, x, y, 5, '#a01a1a');
      fillCircle(g, x, y, 3, '#ff6a5a');
      g.globalAlpha = 0.5 + 0.3 * Math.sin(tGlobal * 6);
      fillCircle(g, x, y, 7, '#ff8a6a');
      g.globalAlpha = 1;
    } else {
      /* chaves */
      fillCircle(g, x - 2, y - 1, 2.4, '#e0c860');
      fillRect(g, x, y - 1, 5, 1.6, '#e0c860');
      fillRect(g, x + 3, y, 1.6, 2, '#e0c860');
    }
  }
}

function drawNotes(g) {
  if (!room.notes) return;
  for (var i = 0; i < room.notes.length; i++) {
    var n = room.notes[i];
    var near = nearest && nearest.kind === 'note' && nearest.obj === n;
    var bob = Math.sin(tGlobal * 2 + i) * 0.8;
    g.globalAlpha = 0.18 + (near ? 0.18 : 0);
    fillCircle(g, n.x, n.y, 8, '#dfe6e0');
    g.globalAlpha = 1;
    fillRect(g, n.x - 3, n.y - 4 + bob, 6, 8, '#d8d2bc');
    fillRect(g, n.x - 2, n.y - 3 + bob, 4, 1, '#8a8270');
    fillRect(g, n.x - 2, n.y - 1 + bob, 4, 1, '#8a8270');
    fillRect(g, n.x - 2, n.y + 1 + bob, 3, 1, '#8a8270');
  }
}

function drawEnemies(g) {
  if (!room.enemies) return;
  for (var i = 0; i < room.enemies.length; i++) {
    var e = room.enemies[i];
    if (e.dead) {
      if (e.type === 'raul' && e.kneeling) {
        Art.drawRaul(g, e, tGlobal, true);
        continue;
      }
      g.globalAlpha = 0.55;
      fillEllipse(g, e.x, e.y + 4, e.hw * 1.5, e.hh * 0.7, '#2a1010');
      fillEllipse(g, e.x - 2, e.y + 2, e.hw * 0.8, e.hh * 0.5, '#3d2a24');
      g.globalAlpha = 1;
      continue;
    }

    if (e.type === 'walker') Art.drawZombie(g, e, tGlobal);
    else if (e.type === 'crawler') Art.drawCrawler(g, e, tGlobal);
    else if (e.type === 'tick') Art.drawTick(g, e, tGlobal);
    else if (e.type === 'queen') Art.drawQueen(g, e, tGlobal);
    else if (e.type === 'raul') Art.drawRaul(g, e, tGlobal, false);

    /* telegrafia de ataque */
    if (e.atkWind > 0 || e.wind > 0) {
      g.globalAlpha = 0.5 + 0.4 * Math.sin(tGlobal * 30);
      g.strokeStyle = '#ff8a6a'; g.lineWidth = 1;
      g.beginPath(); g.arc(e.x, e.y, e.hw + 6, 0, TAU); g.stroke();
      g.globalAlpha = 1;
    }

    /* barra de vida de chefe */
    if (e.type === 'queen' || e.type === 'raul') {
      if (e.hp < e.maxhp) {
        var bw = 56, bx = e.x - bw / 2, by = e.y - e.hh - 18;
        fillRect(g, bx - 1, by - 1, bw + 2, 5, 'rgba(0,0,0,0.7)');
        fillRect(g, bx, by, bw * clamp(e.hp / e.maxhp, 0, 1), 3, '#b03a3a');
        fillRect(g, bx, by, bw * clamp(e.hp / e.maxhp, 0, 1), 1, '#e06a5a');
      }
    }
  }
}

function drawPlayerLayer(g) {
  if (!player || player.dead) return;
  Art.drawThayla(g, player, tGlobal, { aiming: true });
}

function drawBullets(g) {
  for (var i = 0; i < bullets.length; i++) {
    var b = bullets[i];
    g.strokeStyle = 'rgba(255,230,150,0.85)';
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(b.x, b.y);
    g.lineTo(b.x - b.vx * 0.012, b.y - b.vy * 0.012);
    g.stroke();
    fillCircle(g, b.x, b.y, 1.1, '#fff0c0');
  }
  for (var j = 0; j < ebullets.length; j++) {
    var e = ebullets[j];
    g.globalAlpha = 0.35;
    fillCircle(g, e.x, e.y, e.r + 2.5, '#7fe08a');
    g.globalAlpha = 1;
    fillCircle(g, e.x, e.y, e.r, '#a8f0a0');
    fillCircle(g, e.x - 1, e.y - 1, e.r * 0.5, '#e0ffe0');
  }
}

function drawParticles(g) {
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    var a = clamp(p.life / p.max, 0, 1);
    g.globalAlpha = a;
    if (p.shape === 'line') {
      g.strokeStyle = p.c; g.lineWidth = p.r;
      g.beginPath();
      g.moveTo(p.x, p.y);
      g.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02);
      g.stroke();
    } else {
      fillCircle(g, p.x, p.y, p.r * (0.4 + a * 0.6), p.c);
    }
  }
  g.globalAlpha = 1;
}

function drawFloaters(g) {
  for (var i = 0; i < floaters.length; i++) {
    var f = floaters[i];
    var a = clamp(f.life / f.max, 0, 1);
    g.globalAlpha = a;
    textShadow(g, f.txt, f.x, f.y, 7, f.c, 'center', true);
  }
  g.globalAlpha = 1;
}

/* =========================================================
   ILUMINAÇÃO
   ========================================================= */

function ensureLight() {
  if (!lightCanvas) {
    lightCanvas = document.createElement('canvas');
  }
  if (lightCanvas.width !== VIEW_W || lightCanvas.height !== VIEW_H) {
    lightCanvas.width = VIEW_W;
    lightCanvas.height = VIEW_H;
    lctx = lightCanvas.getContext('2d');
  }
}

function punchLight(x, y, r, alpha) {
  var grd = lctx.createRadialGradient(x, y, 2, x, y, r);
  grd.addColorStop(0, 'rgba(0,0,0,' + alpha + ')');
  grd.addColorStop(0.55, 'rgba(0,0,0,' + (alpha * 0.6) + ')');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  lctx.fillStyle = grd;
  lctx.beginPath();
  lctx.arc(x, y, r, 0, TAU);
  lctx.fill();
}

function drawLighting(g) {
  if (!room) return;
  ensureLight();

  var dark = room.dark;
  if (roomId === 'laboratorio' && flags.power) dark = 0.42;

  lctx.setTransform(1, 0, 0, 1, 0, 0);
  lctx.globalCompositeOperation = 'source-over';
  lctx.clearRect(0, 0, VIEW_W, VIEW_H);
  lctx.fillStyle = 'rgba(3,5,9,' + dark + ')';
  lctx.fillRect(0, 0, VIEW_W, VIEW_H);
  lctx.globalCompositeOperation = 'destination-out';

  var px = player.x - cam.x + shakeX;
  var py = player.y - cam.y + shakeY;

  punchLight(px, py, 78, 0.95);

  var cg = lctx.createRadialGradient(px, py, 6, px, py, 185);
  cg.addColorStop(0, 'rgba(0,0,0,0.92)');
  cg.addColorStop(0.5, 'rgba(0,0,0,0.66)');
  cg.addColorStop(1, 'rgba(0,0,0,0)');
  lctx.fillStyle = cg;
  lctx.beginPath();
  lctx.moveTo(px, py);
  lctx.arc(px, py, 170, player.aim - 0.46, player.aim + 0.46);
  lctx.closePath();
  lctx.fill();

  for (var i = 0; i < (room.lights || []).length; i++) {
    var L = room.lights[i];
    punchLight(L.x - cam.x + shakeX, L.y - cam.y + shakeY, L.r, 0.9);
  }

  if (player.muzzle > 0) {
    var mx = px + Math.cos(player.aim) * 14;
    var my = py + Math.sin(player.aim) * 14;
    punchLight(mx, my, 46, 0.9);
  }

  if (player.hurt > 0) {
    lctx.fillStyle = 'rgba(0,0,0,0)';
  }

  lctx.globalCompositeOperation = 'source-over';
  g.drawImage(lightCanvas, 0, 0);

  /* brilho colorido aditivo */
  g.globalCompositeOperation = 'lighter';
  for (var j = 0; j < (room.lights || []).length; j++) {
    var L2 = room.lights[j];
    var lx = L2.x - cam.x + shakeX, ly = L2.y - cam.y + shakeY;
    var grd = g.createRadialGradient(lx, ly, 2, lx, ly, L2.r * 0.8);
    grd.addColorStop(0, hexA(L2.c, 0.13));
    grd.addColorStop(1, hexA(L2.c, 0));
    g.fillStyle = grd;
    g.beginPath(); g.arc(lx, ly, L2.r * 0.8, 0, TAU); g.fill();
  }
  if (player.muzzle > 0) {
    var mg = g.createRadialGradient(px, py, 2, px, py, 60);
    mg.addColorStop(0, 'rgba(255,220,140,0.30)');
    mg.addColorStop(1, 'rgba(255,220,140,0)');
    g.fillStyle = mg;
    g.beginPath(); g.arc(px, py, 60, 0, TAU); g.fill();
  }
  g.globalCompositeOperation = 'source-over';
}

function hexA(hex, a) {
  if (!hex) return 'rgba(200,220,255,' + a + ')';
  var r = parseInt(hex.substr(1, 2), 16) || 200;
  var g2 = parseInt(hex.substr(3, 2), 16) || 220;
  var b = parseInt(hex.substr(5, 2), 16) || 255;
  return 'rgba(' + r + ',' + g2 + ',' + b + ',' + a + ')';
}

function drawVignette(g) {
  var low = player.hp <= 30 && !player.dead ? 0.28 + Math.sin(tGlobal * 4) * 0.1 : 0;
  var v = Math.max(vignette * 0.55, low);
  if (v <= 0.01) return;
  var grd = g.createRadialGradient(VIEW_W / 2, VIEW_H / 2, VIEW_H * 0.34, VIEW_W / 2, VIEW_H / 2, VIEW_H * 0.98);
  grd.addColorStop(0, 'rgba(120,0,0,0)');
  grd.addColorStop(1, 'rgba(120,0,0,' + v + ')');
  g.fillStyle = grd;
  g.fillRect(0, 0, VIEW_W, VIEW_H);
}
