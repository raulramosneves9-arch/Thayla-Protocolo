/* =========================================================
   THAYLA — interface: HUD, diálogos, documentos, menus
   ========================================================= */

var titleMenu = 0;
var invRects = [], keypadRects = [], choiceRects = [], invCloseRect = null, invPanel = null;
var docCloseRect = null;

/* ---------- utilidades de UI ---------- */

function panelBox(g, x, y, w, h, alpha) {
  g.fillStyle = 'rgba(6,10,15,' + (alpha === undefined ? 0.92 : alpha) + ')';
  g.fillRect(x, y, w, h);
  g.strokeStyle = 'rgba(120,150,175,0.5)';
  g.lineWidth = 1;
  g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  g.strokeStyle = 'rgba(200,220,235,0.18)';
  g.beginPath();
  g.moveTo(x + 3, y + 3); g.lineTo(x + 14, y + 3);
  g.moveTo(x + 3, y + 3); g.lineTo(x + 3, y + 14);
  g.moveTo(x + w - 3, y + h - 3); g.lineTo(x + w - 14, y + h - 3);
  g.moveTo(x + w - 3, y + h - 3); g.lineTo(x + w - 3, y + h - 14);
  g.stroke();
}

function spacedText(g, str, x, y, px, color, spacing, align) {
  setFont(g, px, true);
  g.fillStyle = color;
  var total = 0, i;
  for (i = 0; i < str.length; i++) total += g.measureText(str[i]).width + spacing;
  total -= spacing;
  var cx = align === 'center' ? x - total / 2 : (align === 'right' ? x - total : x);
  g.textAlign = 'left';
  for (i = 0; i < str.length; i++) {
    g.fillText(str[i], cx, y);
    cx += g.measureText(str[i]).width + spacing;
  }
}

function outlinedText(g, str, x, y, px, color, align) {
  setFont(g, px, false);
  g.textAlign = align || 'center';
  g.textBaseline = 'alphabetic';
  g.fillStyle = 'rgba(3,6,10,0.85)';
  for (var dx = -1; dx <= 1; dx++) {
    for (var dy = -1; dy <= 1; dy++) {
      if (dx || dy) g.fillText(str, x + dx, y + dy);
    }
  }
  g.fillStyle = color;
  g.fillText(str, x, y);
  g.textAlign = 'left';
}

function hideBoot() {
  var b = document.getElementById('boot');
  if (b) b.style.display = 'none';
}

/* =========================================================
   HUD
   ========================================================= */

function drawHUD(g) {
  if (!room || state === 'title') return;

  var topFade = g.createLinearGradient(0, 0, 0, 46);
  topFade.addColorStop(0, 'rgba(3,7,11,0.74)');
  topFade.addColorStop(1, 'rgba(3,7,11,0)');
  g.fillStyle = topFade;
  g.fillRect(0, 0, VIEW_W, 46);

  var botFade = g.createLinearGradient(0, VIEW_H - 52, 0, VIEW_H);
  botFade.addColorStop(0, 'rgba(3,7,11,0)');
  botFade.addColorStop(1, 'rgba(3,7,11,0.74)');
  g.fillStyle = botFade;
  g.fillRect(0, VIEW_H - 52, VIEW_W, 52);

  textShadow(g, 'OBJETIVO', 12, 14, 5.6, '#5f8098');
  textShadow(g, objective, 12, 24, 7.2, '#c6dcec');

  /* vida */
  var hp = clamp(player.hp / player.maxhp, 0, 1);
  textShadow(g, 'VIDA', 12, 244, 5.6, '#5f8098');
  fillRect(g, 12, 247, 106, 9, 'rgba(4,8,12,0.8)');
  fillRect(g, 13, 248, 104, 7, '#16202a');
  var col = hp > 0.5 ? '#69c46e' : hp > 0.25 ? '#d8a844' : '#c8443a';
  fillRect(g, 13, 248, 104 * hp, 7, col);
  for (var i = 1; i < 4; i++) fillRect(g, 13 + i * 26, 248, 1, 7, 'rgba(0,0,0,0.45)');
  textShadow(g, Math.ceil(player.hp) + '%', 122, 255, 6, '#8fa8bc');

  /* arma / munição */
  var w = WEAPONS[inv.weapon] || WEAPONS.gun;
  textShadow(g, w.name.toUpperCase(), 468, 241, 5.8, '#5f8098', 'right');
  textShadow(g, String(inv[w.ammo]), 468, 257, 14, inv[w.ammo] > 0 ? '#e8e0c8' : '#a05050', 'right', true);
  if (inv.shotgun) textShadow(g, '[Q]', 400, 257, 6, '#4a6376', 'right');

  /* ervas */
  g.fillStyle = '#3f8a4a';
  fillCircle(g, 148, 251, 3.2, '#4f9a5a');
  fillCircle(g, 146, 249, 2, '#7ad07a');
  textShadow(g, 'x' + inv.herb, 155, 254, 7, '#9ec4a4');

  /* nome da sala */
  if (roomNameT > 0) {
    var a = clamp(roomNameT / 0.6, 0, 1) * clamp((3.2 - roomNameT) / 0.4, 0, 1);
    g.globalAlpha = a;
    spacedText(g, roomName.toUpperCase(), VIEW_W - 12, 16, 7, '#cfe0ee', 1.8, 'right');
    g.globalAlpha = 1;
  }
}

function drawPrompt(g) {
  if (state !== 'play' || !nearest) return;
  var sx = clamp(player.x - cam.x, 54, VIEW_W - 54);
  var sy = clamp(player.y - cam.y - 26, 34, VIEW_H - 46);
  var label = '[E] ' + nearest.label;
  setFont(g, 7, false);
  var tw = g.measureText(label).width;
  panelBox(g, sx - tw / 2 - 7, sy - 9, tw + 14, 14, 0.82);
  textShadow(g, label, sx, sy + 1, 7, '#d8e8f4', 'center');
}

function drawToast(g) {
  if (!toastMsg) return;
  var a = clamp(toastMsg.t / 0.4, 0, 1);
  g.globalAlpha = a;
  setFont(g, 7.2, false);
  var tw = g.measureText(toastMsg.txt).width;
  panelBox(g, VIEW_W / 2 - tw / 2 - 12, 214, tw + 24, 18, 0.85);
  textShadow(g, toastMsg.txt, VIEW_W / 2, 226, 7.2, '#e8dcc0', 'center');
  g.globalAlpha = 1;
}

/* =========================================================
   DIÁLOGO
   ========================================================= */

function dialogueStart(lines, onDone) {
  if (!lines || !lines.length) { if (onDone) onDone(); return; }
  dlg = { lines: lines, i: 0, chars: 0, onDone: onDone || null, tick: 0 };
  state = 'dialogue';
}

function updateDialogue(dt) {
  if (!dlg) { state = 'play'; return; }
  var line = dlg.lines[dlg.i];
  if (!line) { endDialogue(); return; }

  if (dlg.chars < line.text.length) {
    dlg.chars = Math.min(line.text.length, dlg.chars + dt * 58);
    dlg.tick += dt * 58;
    if (dlg.tick > 3) { dlg.tick = 0; Sfx.type(); }
  }

  if (Input.anyHit(['KeyE', 'Space', 'Enter']) || Input.mouse.clicked) {
    if (dlg.chars < line.text.length) dlg.chars = line.text.length;
    else {
      dlg.i++;
      dlg.chars = 0;
      if (dlg.i >= dlg.lines.length) endDialogue();
    }
  }
}

function endDialogue() {
  var cb = dlg ? dlg.onDone : null;
  dlg = null;
  state = 'play';
  if (cb) cb();
}

function drawDialogue(g) {
  if (!dlg) return;
  var line = dlg.lines[dlg.i];
  if (!line) return;

  var bw = Math.min(444, VIEW_W - 36), bh = 68;
  var bx = (VIEW_W - bw) / 2;
  var by = (VIEW_H - bh) / 2 + 20;
  panelBox(g, bx, by, bw, bh, 0.9);

  if (line.who) {
    g.fillStyle = 'rgba(8,12,18,0.98)';
    g.fillRect(bx + 10, by - 12, 14 + line.who.length * 5.6, 15);
    g.strokeStyle = 'rgba(120,150,175,0.5)';
    g.strokeRect(bx + 10.5, by - 11.5, 13 + line.who.length * 5.6, 14);
    text(g, line.who, bx + 17, by - 2, 7.5, '#e0b060', 'left', true);
  }

  var shown = line.text.slice(0, Math.floor(dlg.chars));
  var lines = wrapLines(g, shown, bw - 32, 8.1);
  for (var i = 0; i < lines.length && i < 5; i++) {
    text(g, lines[i], bx + 16, by + 20 + i * 11, 8.1, line.who ? '#e2eaf2' : '#a4b6c6');
  }

  if (dlg.chars >= line.text.length) {
    g.globalAlpha = 0.45 + 0.45 * Math.sin(tGlobal * 6);
    text(g, 'E  ▶', bx + bw - 14, by + bh - 8, 7, '#8fb0c8', 'right');
    g.globalAlpha = 1;
  }
}

/* =========================================================
   DOCUMENTOS
   ========================================================= */

function openDoc(id, from) {
  if (!LORE.docs[id]) return;
  doc = { id: id, scroll: 0, from: from || 'play' };
  docs[id] = true;
  state = 'doc';
  Sfx.ui();
}

function updateDoc(dt) {
  if (!doc) { state = 'play'; return; }
  if (Input.anyHit(['Escape', 'KeyE', 'Enter']) || Input.mouse.rclicked) {
    state = doc.from;
    doc = null;
    Sfx.ui();
    return;
  }
  if (Input.mouse.clicked && docCloseRect &&
      Input.mouse.x >= docCloseRect.x && Input.mouse.x <= docCloseRect.x + docCloseRect.w &&
      Input.mouse.y >= docCloseRect.y && Input.mouse.y <= docCloseRect.y + docCloseRect.h) {
    state = doc.from;
    doc = null;
    Sfx.ui();
    return;
  }
  if (doc.from === 'inv' && Input.hit('Tab')) {
    state = 'inv'; doc = null;
    return;
  }
  var d = LORE.docs[doc.id];
  var total = docHeight(d);
  var maxScroll = Math.max(0, total - 168);
  doc.scroll = clamp(doc.scroll + Input.wheel * 0.35, 0, maxScroll);
  if (Input.key('ArrowDown')) doc.scroll = clamp(doc.scroll + 140 * dt, 0, maxScroll);
  if (Input.key('ArrowUp')) doc.scroll = clamp(doc.scroll - 140 * dt, 0, maxScroll);
}

function docHeight(d) {
  setFont(CTX, 7.7, false);
  var total = 0;
  for (var p = 0; p < d.body.length; p++) {
    total += wrapLines(CTX, d.body[p], 374, 7.7).length * 10.1 + 5;
  }
  return total;
}

function drawDoc(g) {
  if (!doc) return;
  var d = LORE.docs[doc.id];
  if (!d) return;

  g.fillStyle = 'rgba(2,4,8,0.7)';
  g.fillRect(0, 0, VIEW_W, VIEW_H);

  var w = Math.min(408, VIEW_W - 32), h = Math.min(246, VIEW_H - 24);
  var x = (VIEW_W - w) / 2, y = (VIEW_H - h) / 2;
  g.fillStyle = '#d9d2c0';
  g.fillRect(x, y, w, h);
  g.fillStyle = '#c9c1ad';
  g.fillRect(x, y, w, 4);
  g.strokeStyle = '#8c8270';
  g.lineWidth = 1;
  g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

  docCloseRect = { x: x + w - 29, y: y + 7, w: 20, h: 18 };
  fillRect(g, docCloseRect.x, docCloseRect.y, docCloseRect.w, docCloseRect.h, '#c9c1ad');
  strokeRect(g, docCloseRect.x, docCloseRect.y, docCloseRect.w, docCloseRect.h, '#8c8270');
  text(g, 'X', docCloseRect.x + docCloseRect.w / 2, docCloseRect.y + 12, 7.5, '#241d14', 'center', true);

  text(g, d.type, x + 16, y + 20, 6.2, '#857861', 'left', true);
  text(g, d.code, x + w - 16, y + 20, 5.8, '#8c8069', 'right');
  text(g, d.title, x + 16, y + 35, 11.5, '#241d14', 'left', true);
  g.fillStyle = '#b3a88f';
  g.fillRect(x + 16, y + 41, w - 32, 1);

  var areaY = y + 52, areaH = h - 66;
  g.save();
  g.beginPath();
  g.rect(x + 12, areaY - 4, w - 24, areaH);
  g.clip();

  var cy = areaY - doc.scroll;
  for (var p = 0; p < d.body.length; p++) {
    var lines = wrapLines(g, d.body[p], w - 40, 7.7);
    for (var i = 0; i < lines.length; i++) {
      text(g, lines[i], x + 18, cy + 8, 7.7, '#2e261b');
      cy += 10.1;
    }
    cy += 5;
  }
  g.restore();

  /* sombra de rolagem */
  var total = docHeight(d);
  if (total > areaH + 6) {
    var frac = areaH / total;
    var barH = Math.max(14, areaH * frac);
    var barY = areaY + (areaH - barH) * (doc.scroll / Math.max(1, total - areaH));
    fillRect(g, x + w - 9, areaY, 2, areaH, 'rgba(120,110,90,0.2)');
    fillRect(g, x + w - 10, barY, 4, barH, 'rgba(110,100,80,0.7)');
  }

  text(g, '[E] FECHAR', x + w - 16, y + h - 8, 5.8, '#8c8069', 'right');
  text(g, 'ARQUIVO ' + (Object.keys(docs).length) + '/8', x + 16, y + h - 8, 5.8, '#8c8069');
}

/* =========================================================
   INVENTÁRIO
   ========================================================= */

function openInventory() {
  state = 'inv';
  Sfx.ui();
}

function updateInv(dt) {
  if (Input.anyHit(['Tab', 'Escape', 'KeyI'])) { state = 'play'; Sfx.ui(); return; }
  if (Input.hit('KeyH')) { useHerb(); return; }
  if (Input.mouse.clicked) {
    if (invCloseRect &&
        Input.mouse.x >= invCloseRect.x && Input.mouse.x <= invCloseRect.x + invCloseRect.w &&
        Input.mouse.y >= invCloseRect.y && Input.mouse.y <= invCloseRect.y + invCloseRect.h) {
      state = 'play';
      Sfx.ui();
      return;
    }
    for (var i = 0; i < invRects.length; i++) {
      var r = invRects[i];
      if (Input.mouse.x >= r.x && Input.mouse.x <= r.x + r.w &&
          Input.mouse.y >= r.y && Input.mouse.y <= r.y + r.h) {
        if (r.doc) { openDoc(r.doc, 'inv'); return; }
      }
    }
    if (Input.mouse.x < invPanel.x || Input.mouse.x > invPanel.x + invPanel.w ||
        Input.mouse.y < invPanel.y || Input.mouse.y > invPanel.y + invPanel.h) {
      state = 'play';
      Sfx.ui();
    }
  }
}

function drawInventory(g) {
  g.fillStyle = 'rgba(2,4,8,0.74)';
  g.fillRect(0, 0, VIEW_W, VIEW_H);
  invRects = [];

  var w = Math.min(432, VIEW_W - 32), h = Math.min(234, VIEW_H - 24);
  var x = (VIEW_W - w) / 2, y = (VIEW_H - h) / 2;
  invPanel = { x: x, y: y, w: w, h: h };
  invCloseRect = { x: x + w - 35, y: y + 6, w: 24, h: 20 };
  panelBox(g, x, y, w, h, 0.94);

  text(g, 'INVENTÁRIO', x + 16, y + 20, 11, '#dce8f2', 'left', true);
  text(g, 'THAYLA VAZ — INVESTIGADORA', x + w - 48, y + 19, 6, '#5f8098', 'right');
  fillRect(g, invCloseRect.x, invCloseRect.y, invCloseRect.w, invCloseRect.h, '#17232e');
  strokeRect(g, invCloseRect.x, invCloseRect.y, invCloseRect.w, invCloseRect.h, 'rgba(120,150,175,0.5)');
  text(g, 'X', invCloseRect.x + invCloseRect.w / 2, invCloseRect.y + 13, 8, '#c8d8e0', 'center', true);
  g.fillStyle = 'rgba(120,150,175,0.4)';
  g.fillRect(x + 16, y + 26, w - 32, 1);

  var colY = y + 42;

  /* coluna 1 — armamento */
  text(g, 'ARMAMENTO', x + 16, colY, 6, '#5f8098');
  var yy = colY + 14;
  var weapons = [{ id: 'gun', label: 'PISTOLA .40', ammo: 'ammo9' }];
  if (inv.shotgun) weapons.push({ id: 'shotgun', label: 'ESCOPETA 12', ammo: 'shell' });

  for (var i = 0; i < weapons.length; i++) {
    var wp = weapons[i];
    var sel = inv.weapon === wp.id;
    if (sel) {
      g.fillStyle = 'rgba(120,160,200,0.13)';
      g.fillRect(x + 12, yy - 8, 132, 17);
    }
    text(g, wp.label, x + 16, yy + 1, 6.8, sel ? '#e8dcc0' : '#8fa6b8', 'left', sel);
    text(g, String(inv[wp.ammo]), x + 138, yy + 1, 7, sel ? '#e8dcc0' : '#7f96a8', 'right');
    yy += 17;
  }

  yy += 6;
  g.fillStyle = 'rgba(120,150,175,0.22)';
  g.fillRect(x + 16, yy - 6, 126, 1);
  text(g, 'ERVAS MEDICINAIS', x + 16, yy + 6, 6, '#5f8098');
  text(g, String(inv.herb), x + 138, yy + 6, 8, '#8fd08f', 'right', true);

  yy += 20;
  g.fillStyle = 'rgba(120,150,175,0.22)';
  g.fillRect(x + 16, yy - 6, 126, 1);
  text(g, '[Q] TROCAR ARMA', x + 16, yy + 8, 5.8, '#446072');
  text(g, '[H] USAR ERVA', x + 16, yy + 18, 5.8, '#446072');

  /* coluna 2 — itens-chave */
  var cx = x + 152;
  text(g, 'ITENS-CHAVE', cx, colY, 6, '#5f8098');
  var ky = colY + 14;
  var keys = Object.keys(KEYNAMES);
  var had = 0;
  for (var k = 0; k < keys.length; k++) {
    if (!flags[keys[k]]) continue;
    had++;
    text(g, '› ' + KEYNAMES[keys[k]], cx, ky, 6.6, '#c8d8e0');
    ky += 13;
  }
  if (!had) text(g, '— vazio —', cx, ky, 6.4, '#4a6274');

  /* coluna 3 — documentos */
  var dx = x + 292;
  text(g, 'ARQUIVOS', dx, colY, 6, '#5f8098');
  var dy = colY + 14;
  var docIds = Object.keys(docs);
  for (var d2 = 0; d2 < docIds.length; d2++) {
    var id = docIds[d2];
    var info = LORE.docs[id];
    if (!info) continue;
    var hover = Input.mouse.x >= dx - 4 && Input.mouse.x <= x + w - 12 &&
                Input.mouse.y >= dy - 8 && Input.mouse.y <= dy + 4;
    if (hover) {
      g.fillStyle = 'rgba(120,160,200,0.12)';
      g.fillRect(dx - 4, dy - 8, x + w - dx - 8, 13);
    }
    text(g, info.title, dx, dy, 6.2, hover ? '#e8dcc0' : '#a8bcc8');
    dy += 13;
    invRects.push({ x: dx - 4, y: dy - 21, w: x + w - dx - 8, h: 13, doc: id });
  }
  if (!docIds.length) text(g, '— nenhum —', dx, dy, 6.4, '#4a6274');

  g.fillStyle = 'rgba(120,150,175,0.4)';
  g.fillRect(x + 16, y + h - 24, w - 32, 1);
  text(g, '[TAB] FECHAR', x + 16, y + h - 11, 6, '#5f8098');
  text(g, 'CLIQUE NUM ARQUIVO PARA LER', x + w - 16, y + h - 11, 6, '#5f8098', 'right');
}

/* =========================================================
   TECLADO / COFRE
   ========================================================= */

function keypadOpen() {
  keypadUI = { code: '', msg: 'DIGITE A SENHA DE 3 DÍGITOS', flash: 0 };
  state = 'keypad';
  Sfx.ui();
}

function keypadLayout() {
  var bx = 158, by = 52;
  var out = [];
  var labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'];
  for (var i = 0; i < 12; i++) {
    var col = i % 3, row = Math.floor(i / 3);
    out.push({
      label: labels[i],
      x: bx + 13 + col * 46, y: by + 90 + row * 24,
      w: 40, h: 21
    });
  }
  return out;
}

function updateKeypad(dt) {
  if (!keypadUI) { state = 'play'; return; }
  if (Input.hit('Escape')) { state = 'play'; keypadUI = null; return; }

  var digits = ['Digit0', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9'];
  for (var i = 0; i < 10; i++) {
    if (Input.hit(digits[i]) && keypadUI.code.length < 3) {
      keypadUI.code += String(i);
      Sfx.ui();
    }
  }
  if (Input.hit('Backspace') && keypadUI.code.length) {
    keypadUI.code = keypadUI.code.slice(0, -1);
    Sfx.ui();
  }
  if (Input.hit('Enter')) { keypadConfirm(); if (!keypadUI) return; }

  var rects = keypadLayout();
  if (Input.mouse.clicked) {
    for (var r = 0; r < rects.length; r++) {
      var b = rects[r];
      if (Input.mouse.x >= b.x && Input.mouse.x <= b.x + b.w &&
          Input.mouse.y >= b.y && Input.mouse.y <= b.y + b.h) {
        if (b.label === 'C') keypadUI.code = '';
        else if (b.label === 'OK') { keypadConfirm(); return; }
        else if (keypadUI.code.length < 3) keypadUI.code += b.label;
        Sfx.ui();
      }
    }
  }
  keypadUI.flash = Math.max(0, keypadUI.flash - dt);
}

function keypadConfirm() {
  if (keypadUI.code === '427') {
    state = 'play';
    keypadUI = null;
    onKeypadSuccess();
  } else {
    keypadUI.msg = 'ACESSO NEGADO';
    keypadUI.flash = 0.8;
    keypadUI.code = '';
    Sfx.locked();
  }
}

function drawKeypad(g) {
  if (!keypadUI) return;
  g.fillStyle = 'rgba(2,4,8,0.72)';
  g.fillRect(0, 0, VIEW_W, VIEW_H);

  var x = 158, y = 52, w = 164, h = 186;
  panelBox(g, x, y, w, h, 0.95);
  text(g, 'ARMÁRIO DE EVIDÊNCIAS', x + w / 2, y + 16, 6.2, '#5f8098', 'center', true);

  fillRect(g, x + 16, y + 24, w - 32, 26, '#0a1016');
  g.strokeStyle = keypadUI.flash > 0 ? '#c04030' : 'rgba(120,150,175,0.4)';
  g.strokeRect(x + 16.5, y + 24.5, w - 33, 25);

  var shown = keypadUI.code.split('').join(' ') || '_ _ _';
  text(g, shown, x + w / 2, y + 42, 13, keypadUI.flash > 0 ? '#e06050' : '#9fe0b0', 'center', true);
  text(g, keypadUI.msg, x + w / 2, y + 62, 5.6,
    keypadUI.flash > 0 ? '#e06050' : '#5f8098', 'center');

  var rects = keypadLayout();
  for (var i = 0; i < rects.length; i++) {
    var b = rects[i];
    var hover = Input.mouse.x >= b.x && Input.mouse.x <= b.x + b.w &&
                Input.mouse.y >= b.y && Input.mouse.y <= b.y + b.h;
    fillRect(g, b.x, b.y, b.w, b.h, hover ? '#2a3a48' : '#16212b');
    g.strokeStyle = 'rgba(120,150,175,0.35)';
    g.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
    text(g, b.label, b.x + b.w / 2, b.y + 14, 8, b.label === 'OK' ? '#9fe0b0' : '#c8d8e0', 'center', true);
  }

  text(g, '[ESC] SAIR   [ENTER] CONFIRMAR', x + w / 2, y + h + 12, 5.6, '#4a6274', 'center');
}

/* =========================================================
   ESCOLHA FINAL
   ========================================================= */

function showChoice(options) {
  choiceUI = { options: options, index: 0 };
  state = 'choice';
}

function updateChoice(dt) {
  if (!choiceUI) { state = 'play'; return; }
  var n = choiceUI.options.length;
  if (Input.anyHit(['ArrowDown', 'KeyS'])) { choiceUI.index = (choiceUI.index + 1) % n; Sfx.ui(); }
  if (Input.anyHit(['ArrowUp', 'KeyW'])) { choiceUI.index = (choiceUI.index + n - 1) % n; Sfx.ui(); }
  if (Input.hit('Enter') || Input.hit('KeyE')) {
    var opt = choiceUI.options[choiceUI.index];
    if (opt && !opt.disabled) { choiceUI = null; opt.action(); }
    else Sfx.locked();
  }
  if (Input.mouse.clicked) {
    for (var i = 0; i < choiceRects.length; i++) {
      var r = choiceRects[i];
      if (Input.mouse.x >= r.x && Input.mouse.x <= r.x + r.w &&
          Input.mouse.y >= r.y && Input.mouse.y <= r.y + r.h) {
        if (!r.opt.disabled) { choiceUI = null; r.opt.action(); }
        else Sfx.locked();
        return;
      }
    }
  }
}

function drawChoice(g) {
  if (!choiceUI) return;
  g.fillStyle = 'rgba(2,4,8,0.6)';
  g.fillRect(0, 0, VIEW_W, VIEW_H);

  var x = 108, y = 78, w = 264, h = 122;
  panelBox(g, x, y, w, h, 0.95);
  text(g, 'A DECISÃO É SUA', x + w / 2, y + 20, 8, '#dce8f2', 'center', true);
  g.fillStyle = 'rgba(120,150,175,0.35)';
  g.fillRect(x + 16, y + 26, w - 32, 1);

  choiceRects = [];
  for (var i = 0; i < choiceUI.options.length; i++) {
    var o = choiceUI.options[i];
    var oy = y + 42 + i * 24;
    var sel = choiceUI.index === i;
    if (sel) {
      g.fillStyle = 'rgba(120,160,200,0.14)';
      g.fillRect(x + 12, oy - 12, w - 24, 22);
    }
    text(g, (sel ? '▸ ' : '   ') + o.label, x + 22, oy + 2, 8,
      o.disabled ? '#4a5f70' : (sel ? '#f0e2c0' : '#a8bfd0'), 'left', sel);
    if (o.disabled && o.note) {
      text(g, o.note, x + 34, oy + 11, 5.6, '#6a4a4a');
    }
    choiceRects.push({ x: x + 12, y: oy - 12, w: w - 24, h: 22, opt: o });
  }
}

/* =========================================================
   MORTE / FINAL
   ========================================================= */

function updateDead(dt) {
  if (Input.anyHit(['Enter', 'Space', 'KeyE']) || Input.mouse.clicked) retry();
}

function drawDead(g) {
  g.fillStyle = 'rgba(30,0,0,0.72)';
  g.fillRect(0, 0, VIEW_W, VIEW_H);
  g.globalAlpha = 0.85 + Math.sin(tGlobal * 2) * 0.1;
  text(g, 'VOCÊ MORREU', VIEW_W / 2, 122, 26, '#b03a2a', 'center', true);
  g.globalAlpha = 1;
  text(g, 'Guarannapuava não devolve o que engole.', VIEW_W / 2, 142, 7, '#8a6a5a', 'center');
  g.globalAlpha = 0.5 + 0.5 * Math.sin(tGlobal * 5);
  text(g, '[ENTER] TENTAR DE NOVO', VIEW_W / 2, 176, 7.5, '#d0c0a8', 'center');
  g.globalAlpha = 1;
}

function showEnding(id) {
  ending = { id: id, t: 0 };
  state = 'ending';
  fadeA = 1;
  Sfx.setRain(0.15);
  Sfx.ending();
}

function updateEnding(dt) {
  ending.t += dt;
  if (Input.anyHit(['Enter', 'Space', 'Escape', 'KeyE']) || Input.mouse.clicked) {
    if (ending.t > 1.2) backToTitle();
  }
}

function drawEnding(g) {
  if (!ending) return;
  var data = LORE.endings[ending.id];
  if (!data) return;

  g.fillStyle = '#04060a';
  g.fillRect(0, 0, VIEW_W, VIEW_H);

  var grd = g.createLinearGradient(0, 0, 0, VIEW_H);
  grd.addColorStop(0, ending.id === 'cure' ? 'rgba(20,50,60,0.5)' : 'rgba(50,10,10,0.5)');
  grd.addColorStop(1, 'rgba(4,6,10,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, VIEW_W, VIEW_H);

  g.globalAlpha = clamp(ending.t / 1.2, 0, 1);
  spacedText(g, 'FINAL', VIEW_W / 2, 44, 7, '#5f8098', 3, 'center');
  text(g, data.title, VIEW_W / 2, 72, 22,
    ending.id === 'cure' ? '#9fe0c0' : '#d06a5a', 'center', true);
  g.fillStyle = 'rgba(120,150,175,0.3)';
  g.fillRect(VIEW_W / 2 - 70, 80, 140, 1);
  g.globalAlpha = 1;

  var startY = 102;
  for (var i = 0; i < data.lines.length; i++) {
    var t0 = 1.0 + i * 0.85;
    if (ending.t < t0) break;
    var a = clamp((ending.t - t0) / 0.6, 0, 1);
    g.globalAlpha = a;
    var lines = wrapLines(g, data.lines[i], 360, 7.4);
    for (var j = 0; j < lines.length; j++) {
      text(g, lines[j], VIEW_W / 2, startY, 7.4, '#c8d8e2', 'center');
      startY += 10.5;
    }
    startY += 3;
    g.globalAlpha = 1;
  }

  if (ending.t > 1.2 + data.lines.length * 0.85 + 0.8) {
    g.globalAlpha = 0.4 + 0.4 * Math.sin(tGlobal * 4);
    text(g, '[ENTER] VOLTAR AO MENU', VIEW_W / 2, VIEW_H - 16, 6.4, '#7f96a8', 'center');
    g.globalAlpha = 1;
  }
}

/* =========================================================
   TELA-TÍTULO
   ========================================================= */

function drawTitleGame(g, bgOnly) {
  var grd = g.createLinearGradient(0, 0, 0, VIEW_H);
  grd.addColorStop(0, '#0a1520');
  grd.addColorStop(0.6, '#070b12');
  grd.addColorStop(1, '#04060a');
  g.fillStyle = grd;
  g.fillRect(0, 0, VIEW_W, VIEW_H);

  /* lua */
  g.globalAlpha = 0.5;
  fillCircle(g, VIEW_W - 92, 60, 20, '#cdd8e0');
  fillCircle(g, VIEW_W - 84, 56, 18, '#0a1520');
  g.globalAlpha = 1;

  /* silhueta da cidade */
  var rnd = makeRng(20241103);
  for (var i = 0; i < Math.ceil(VIEW_W / 20) + 2; i++) {
    var bw = 16 + rnd() * 42;
    var bh = 40 + rnd() * 110;
    var bx = i * 20 - 10 + rnd() * 8;
    var by = VIEW_H - 46 - bh;
    g.fillStyle = i % 3 === 0 ? '#070a0f' : '#05080c';
    g.fillRect(bx, by, bw, bh + 50);
    for (var wy = by + 8; wy < VIEW_H - 54; wy += 12) {
      for (var wx = bx + 5; wx < bx + bw - 5; wx += 9) {
        if (rnd() < 0.16) {
          g.fillStyle = rnd() < 0.6 ? 'rgba(220,180,110,0.5)' : 'rgba(140,200,220,0.35)';
          g.fillRect(wx, wy, 3, 5);
        }
      }
    }
    g.fillStyle = '#05080c';
  }

  /* chão molhado */
  g.fillStyle = '#080b10';
  g.fillRect(0, VIEW_H - 46, VIEW_W, 46);
  g.globalAlpha = 0.18;
  fillEllipse(g, VIEW_W / 2, VIEW_H - 30, 180, 12, '#4a7a90');
  g.globalAlpha = 1;

  /* chuva */
  g.strokeStyle = 'rgba(170,198,220,0.22)';
  g.lineWidth = 1;
  g.beginPath();
  for (var r = 0; r < rainDrops.length; r++) {
    var d = rainDrops[r];
    g.moveTo(d.x, d.y);
    g.lineTo(d.x + d.l * 0.24, d.y - d.l);
  }
  g.stroke();

  if (bgOnly) return;

  /* título */
  g.globalAlpha = 0.9;
  spacedText(g, 'THAYLA', VIEW_W / 2, 96, 44, '#e8eef4', 4, 'center');
  g.globalAlpha = 1;
  g.fillStyle = '#b03a2a';
  g.fillRect(VIEW_W / 2 - 96, 104, 192, 2);
  spacedText(g, 'PROTOCOLO GUARANNAPUAVA', VIEW_W / 2, 122, 8.5, '#8fb0c8', 2.2, 'center');
  outlinedText(g, 'um caso UmbrellaRaulTick', VIEW_W / 2, 138, 7, '#8aa4b8', 'center');

  /* menu */
  var opts = titleOptions();
  var y0 = 166;
  for (var m = 0; m < opts.length; m++) {
    var sel = titleMenu === m;
    var yy = y0 + m * 18;
    if (sel) {
      g.globalAlpha = 0.65 + 0.3 * Math.sin(tGlobal * 4);
      g.fillStyle = '#d8b060';
      var ax = VIEW_W / 2 - 80, ay = yy - 3;
      g.beginPath();
      g.moveTo(ax, ay - 4);
      g.lineTo(ax + 6, ay);
      g.lineTo(ax, ay + 4);
      g.closePath();
      g.fill();
      g.globalAlpha = 1;
    }
    textShadow(g, opts[m].label, VIEW_W / 2, yy, 9.5,
      sel ? '#f0e6cc' : '#7f96a8', 'center', sel);
  }

  outlinedText(g, 'WASD MOVER  ·  MOUSE MIRAR  ·  CLIQUE ATIRAR  ·  F FACA  ·  ESPAÇO ESQUIVA', VIEW_W / 2, VIEW_H - 26, 5.4, '#63809a', 'center');
  outlinedText(g, 'E INTERAGIR  ·  TAB INVENTÁRIO  ·  H ERVA  ·  Q ARMA  ·  [M] SOM ' + (Sfx.isMuted() ? 'OFF' : 'ON'), VIEW_W / 2, VIEW_H - 14, 5.4, '#4f6a80', 'center');
}

function titleOptions() {
  var opts = [{ label: 'NOVO JOGO', action: 'new' }];
  if (tutorialSupported()) opts.push({ label: 'TUTORIAL (PC)', action: 'tutorial' });
  if (saveExists) opts.push({ label: 'CONTINUAR', action: 'continue' });
  return opts;
}

function titleChoose(action) {
  if (action === 'continue') loadGame();
  else if (action === 'tutorial') beginTutorial('menu');
  else startNewGame();
}

function updateTitle(dt) {
  var hasSave = saveExists;
  var opts = titleOptions();
  var n = opts.length;
  if (titleMenu >= n) titleMenu = 0;

  if (Input.anyHit(['ArrowDown', 'KeyS'])) { titleMenu = (titleMenu + 1) % n; Sfx.ui(); }
  if (Input.anyHit(['ArrowUp', 'KeyW'])) { titleMenu = (titleMenu + n - 1) % n; Sfx.ui(); }

  if (Input.hit('KeyC') && hasSave) { loadGame(); return; }
  if (Input.hit('Enter') || Input.hit('Space')) {
    titleChoose(opts[titleMenu].action);
    return;
  }
  if (Input.mouse.clicked) {
    for (var m = 0; m < n; m++) {
      var yy = 166 + m * 18;
      if (Math.abs(Input.mouse.x - VIEW_W / 2) < 82 &&
          Input.mouse.y > yy - 11 && Input.mouse.y < yy + 5) {
        titleMenu = m;
        titleChoose(opts[m].action);
        return;
      }
    }
  }
}

/* =========================================================
   TUTORIAL (SOMENTE PC)
   ========================================================= */

var tut = {
  mode: 'menu', step: 0, t: 0, stepT: 0, waitT: 0,
  mouseX0: 0, mouseY0: 0
};

var TUT_STEPS = [
  {
    action: 'hold', code: 'WASD', keys: ['KeyW', 'KeyA', 'KeyS', 'KeyD'],
    title: 'MOVIMENTAÇÃO', hint: 'SEGURE W, A, S OU D',
    text: 'Use W, A, S e D para mover Thayla pelo cenário.'
  },
  {
    action: 'moveMouse', code: 'MOUSE', title: 'MIRA', hint: 'MOVA O CURSOR',
    text: 'Mova o mouse para apontar a arma. A mira acompanha o cursor.'
  },
  {
    action: 'click', code: 'CLIQUE', title: 'ATIRAR', hint: 'CLIQUE COM O BOTÃO ESQUERDO',
    text: 'Clique com o botão esquerdo para disparar. Fique de olho na munição.'
  },
  {
    action: 'hit', key: 'KeyF', code: 'F', title: 'FACA', hint: 'APERTE A TECLA',
    text: 'Aperte F para atacar com a faca quando a munição acabar.'
  },
  {
    action: 'hit', key: 'Space', code: 'ESPAÇO', title: 'ESQUIVA', hint: 'APERTE A TECLA',
    text: 'Aperte Espaço para rolar e escapar de mordidas e ataques.'
  },
  {
    action: 'hit', key: 'KeyE', code: 'E', title: 'INTERAGIR', hint: 'APERTE A TECLA',
    text: 'Use E para abrir portas, ler cartas e pegar itens próximos.'
  },
  {
    action: 'hit', key: 'Tab', code: 'TAB', title: 'INVENTÁRIO', hint: 'APERTE A TECLA',
    text: 'Tab abre a bolsa. Confira munição, ervas e itens de missão.'
  },
  {
    action: 'hit', key: 'KeyH', code: 'H', title: 'ERVAS', hint: 'APERTE A TECLA',
    text: 'Aperte H para usar uma erva medicinal e recuperar vida.'
  },
  {
    action: 'hit', key: 'KeyQ', code: 'Q', title: 'TROCAR ARMA', hint: 'APERTE A TECLA',
    text: 'Aperte Q para alternar entre a pistola e a escopeta, quando tiver as duas.'
  }
];

function tutorialSupported() {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(pointer: fine)').matches;
    }
  } catch (e) {}
  return true;
}

function tutorialWasDone() {
  try { return !!localStorage.getItem('thayla_tut_done'); }
  catch (e) { return true; }
}

function beginTutorial(mode) {
  tut.mode = mode || 'menu';
  tut.step = 0;
  tut.t = 0;
  tut.stepT = 0;
  tut.waitT = 0;
  tut.mouseX0 = Input.mouse.x;
  tut.mouseY0 = Input.mouse.y;
  state = 'tutorial';
  fadeA = 1;
  Sfx.ui();
}

function finishTutorial(skipped) {
  try { localStorage.setItem('thayla_tut_done', '1'); } catch (e) {}

  if (tut.mode === 'new') {
    newGame();
  } else {
    backToTitle();
    if (!skipped) showToast('TREINAMENTO CONCLUÍDO');
  }
}

function updateTutorial(dt) {
  tut.t += dt;

  if (tut.waitT > 0) {
    tut.waitT -= dt;
    if (tut.waitT <= 0) {
      tut.step++;
      tut.stepT = 0;
      if (tut.step >= TUT_STEPS.length) { finishTutorial(false); return; }
      tut.mouseX0 = Input.mouse.x;
      tut.mouseY0 = Input.mouse.y;
      Sfx.ui();
    }
    return;
  }

  if (Input.hit('Escape')) { finishTutorial(true); return; }

  tut.stepT += dt;
  if (tut.stepT < 0.22) return;

  var s = TUT_STEPS[tut.step];
  var ok = false;
  if (s.action === 'hold') ok = Input.any(s.keys);
  else if (s.action === 'hit') ok = Input.hit(s.key);
  else if (s.action === 'click') ok = Input.mouse.clicked;
  else if (s.action === 'moveMouse') {
    ok = Math.abs(Input.mouse.x - tut.mouseX0) +
      Math.abs(Input.mouse.y - tut.mouseY0) > 30;
  }

  if (ok) {
    tut.waitT = 0.6;
    Sfx.pickup();
  }
}

function drawTutorial(g) {
  g.fillStyle = 'rgba(3,6,10,0.74)';
  g.fillRect(0, 0, VIEW_W, VIEW_H);

  var x = Math.round((VIEW_W - 352) / 2);
  var y = Math.round((VIEW_H - 226) / 2);
  var w = 352, h = 226;
  panelBox(g, x, y, w, h, 0.95);

  g.fillStyle = '#b03a2a';
  g.fillRect(x, y, w, 2);

  spacedText(g, 'TREINAMENTO TÁTICO · PC', x + 18, y + 18, 5.2, '#b06a5a', 1.6, 'left');
  text(g, 'COMO JOGAR', x + 18, y + 35, 11, '#e8eef4', 'left', true);

  var s = TUT_STEPS[tut.step];
  var num = tut.step + 1;
  text(g, (num < 10 ? '0' : '') + num + ' / ' + (TUT_STEPS.length < 10 ? '0' : '') + TUT_STEPS.length,
    x + w - 18, y + 33, 6.4, '#7f97aa', 'right', true);

  g.fillStyle = 'rgba(150,175,195,0.18)';
  g.fillRect(x + 18, y + 44, w - 36, 1);

  /* tecla em destaque */
  var kx = VIEW_W / 2, ky = y + 82;
  var kw = Math.max(96, Math.min(196, s.code.length * 15 + 34));
  var pulse = tut.waitT > 0 ? 1 : 0.5 + 0.5 * Math.sin(tut.t * 3.2);

  g.globalAlpha = 0.10 + pulse * 0.10;
  fillEllipse(g, kx, ky, kw * 0.62, 28, '#d8b060');
  g.globalAlpha = 1;

  var kg = g.createLinearGradient(0, ky - 22, 0, ky + 22);
  kg.addColorStop(0, tut.waitT > 0 ? '#253b2c' : '#1b2a37');
  kg.addColorStop(1, '#091017');
  g.fillStyle = kg;
  g.fillRect(kx - kw / 2, ky - 22, kw, 44);
  g.strokeStyle = tut.waitT > 0
    ? 'rgba(130,210,150,' + (0.55 + pulse * 0.35) + ')'
    : 'rgba(216,176,96,' + (0.45 + pulse * 0.35) + ')';
  g.lineWidth = 1.5;
  g.strokeRect(kx - kw / 2 + 0.5, ky - 21.5, kw - 1, 43);
  g.fillStyle = 'rgba(255,255,255,0.06)';
  g.fillRect(kx - kw / 2 + 2, ky - 20, kw - 4, 1);

  var codePx = s.code.length <= 2 ? 20 : (s.code.length <= 4 ? 15 : 11);
  text(g, s.code, kx, ky + codePx * 0.36, codePx, tut.waitT > 0 ? '#b8e8c4' : '#f0e6cc', 'center', true);

  /* instrução */
  text(g, s.title, VIEW_W / 2, y + 126, 8.6, '#d8b060', 'center', true);
  var lines = wrapLines(g, s.text, 296, 6.8);
  for (var i = 0; i < lines.length && i < 3; i++) {
    text(g, lines[i], VIEW_W / 2, y + 141 + i * 10, 6.8, '#a9bfd0', 'center');
  }

  var status = tut.waitT > 0 ? '✓  ' + s.title + ' CONCLUÍDO' : s.hint;
  text(g, status, VIEW_W / 2, y + 184, 5.8,
    tut.waitT > 0 ? '#7ad07a' : '#6f8a9e', 'center', tut.waitT > 0);

  /* progresso */
  var dotW = TUT_STEPS.length * 12 - 6;
  var dx = VIEW_W / 2 - dotW / 2 + 3;
  for (var d = 0; d < TUT_STEPS.length; d++) {
    var px = dx + d * 12;
    if (d < tut.step || (d === tut.step && tut.waitT > 0)) {
      fillCircle(g, px, y + 198, 2.4, '#69c46e');
    } else if (d === tut.step) {
      fillCircle(g, px, y + 198, 2.8, '#d8b060');
      g.strokeStyle = 'rgba(216,176,96,0.35)';
      g.lineWidth = 1;
      g.beginPath();
      g.arc(px, y + 198, 4.4, 0, Math.PI * 2);
      g.stroke();
    } else {
      fillCircle(g, px, y + 198, 2, '#25333f');
    }
  }

  text(g, '[ESC] PULAR TREINAMENTO', VIEW_W / 2, y + 216, 5.4, '#5c7488', 'center');
}

/* =========================================================
   OVERLAY GERAL
   ========================================================= */

function drawOverlayUI(g) {
  g.setTransform(Render.scale, 0, 0, Render.scale, Render.ox, Render.oy);

  if (state === 'play' || state === 'dead') {
    drawHUD(g);
    drawPrompt(g);
  }

  if (state === 'dialogue') drawDialogue(g);
  if (state === 'tutorial') drawTutorial(g);
  if (state === 'doc') drawDoc(g);
  if (state === 'inv') drawInventory(g);
  if (state === 'keypad') drawKeypad(g);
  if (state === 'choice') drawChoice(g);
  if (state === 'dead') drawDead(g);
  if (state === 'ending') drawEnding(g);

  if (toastMsg) drawToast(g);

  if (fadeA > 0) {
    g.fillStyle = 'rgba(0,0,0,' + clamp(fadeA, 0, 1) + ')';
    g.fillRect(0, 0, VIEW_W, VIEW_H);
  }
}
