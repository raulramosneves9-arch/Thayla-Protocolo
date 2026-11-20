/* =========================================================
   THAYLA — arte procedural
   Tudo desenhado com canvas: chão, paredes, móveis e sprites.
   ========================================================= */

var Art = (function () {

  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  /* =====================================================
     BASE DA SALA
     ===================================================== */
  function buildBase(R) {
    var c = document.createElement('canvas');
    c.width = R.w; c.height = R.h;
    var g = c.getContext('2d');
    if (g.imageSmoothingEnabled !== undefined) g.imageSmoothingEnabled = false;
    drawFloor(g, R);
    drawWalls(g, R);
    drawProps(g, R);
    if (R.def.bloodStatic) drawStaticBlood(g, R);
    return c;
  }

  /* ---------------- pisos ---------------- */
  function drawFloor(g, R) {
    var rnd = makeRng(hashStr(R.id) + 11);
    var w = R.w, h = R.h, i, x, y;

    if (R.theme === 'street') {
      fillRect(g, 0, 0, w, h, '#14171c');
      for (i = 0; i < 1400; i++) {
        x = rnd() * w; y = rnd() * h;
        g.fillStyle = rnd() < 0.5 ? '#181c22' : '#101318';
        g.fillRect(x | 0, y | 0, 1, 1);
      }
      fillRect(g, 0, 150, w, 24, '#262a31');
      fillRect(g, 0, 440, w, 30, '#262a31');
      for (x = 0; x < w; x += 32) {
        fillRect(g, x, 150, 1, 24, '#1b1f25');
        fillRect(g, x + 16, 440, 1, 30, '#1b1f25');
      }
      fillRect(g, 0, 174, w, 3, '#343a44');
      fillRect(g, 0, 437, w, 3, '#343a44');
      for (x = 30; x < w; x += 90) fillRect(g, x, 310, 42, 3, '#7d6f36');
      for (i = 0; i < 16; i++) {
        x = rnd() * w; y = 190 + rnd() * 230;
        g.globalAlpha = 0.5;
        fillEllipse(g, x, y, 10 + rnd() * 26, 3 + rnd() * 6, '#1c2a35');
        g.globalAlpha = 0.25;
        fillEllipse(g, x - 2, y - 1, 7 + rnd() * 16, 2 + rnd() * 3, '#31505f');
        g.globalAlpha = 1;
      }
      fillCircle(g, 880, 342, 12, '#1d2228');
      fillCircle(g, 880, 342, 9, '#222831');
      for (i = 0; i < 5; i++) {
        g.strokeStyle = '#272d35'; g.lineWidth = 1;
        g.beginPath();
        var cx = 100 + rnd() * (w - 200), cy = 190 + rnd() * 230;
        g.moveTo(cx, cy); g.lineTo(cx + rnd() * 30 - 15, cy + rnd() * 16 - 8);
        g.stroke();
      }
    }

    else if (R.theme === 'police') {
      fillRect(g, 0, 0, w, h, '#2b3038');
      for (y = 0; y < h; y += 24) {
        for (x = 0; x < w; x += 24) {
          var alt = ((x / 24) + (y / 24)) % 2 === 0;
          fillRect(g, x, y, 24, 24, alt ? '#333944' : '#2b313b');
        }
      }
      for (y = 0; y < h; y += 24) fillRect(g, 0, y, w, 1, 'rgba(0,0,0,0.18)');
      for (x = 0; x < w; x += 24) fillRect(g, x, 0, 1, h, 'rgba(0,0,0,0.18)');
      fillRect(g, 0, 480, w, 42, '#20252c');
      for (i = 0; i < 40; i++) {
        x = rnd() * w; y = rnd() * h;
        g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(x, y, 1 + rnd() * 2, 1);
      }
    }

    else if (R.theme === 'plaza') {
      fillRect(g, 0, 0, w, h, '#242a30');
      for (y = 0; y < h; y += 40) {
        for (x = 0; x < w; x += 40) {
          var shade = rnd();
          fillRect(g, x, y, 40, 40, shade < 0.33 ? '#272e35' : shade < 0.66 ? '#222930' : '#2a3138');
          fillRect(g, x, y, 40, 1, '#1b2127');
          fillRect(g, x, y, 1, 40, '#1b2127');
        }
      }
      for (i = 0; i < 26; i++) {
        x = rnd() * w; y = rnd() * h;
        g.globalAlpha = 0.25;
        fillEllipse(g, x, y, 8 + rnd() * 30, 4 + rnd() * 12, '#1d2c2a');
        g.globalAlpha = 1;
      }
      for (i = 0; i < 10; i++) {
        x = rnd() * w; y = rnd() * h;
        g.globalAlpha = 0.35;
        fillEllipse(g, x, y, 14 + rnd() * 22, 3 + rnd() * 5, '#33454c');
        g.globalAlpha = 1;
      }
    }

    else if (R.theme === 'pharmacy') {
      fillRect(g, 0, 0, w, h, '#b3bdc1');
      for (y = 0; y < h; y += 24) {
        for (x = 0; x < w; x += 24) {
          var alt2 = ((x / 24) + (y / 24)) % 2 === 0;
          fillRect(g, x, y, 24, 24, alt2 ? '#bcc6ca' : '#b0babe');
        }
      }
      for (y = 0; y < h; y += 24) fillRect(g, 0, y, w, 1, '#96a1a5');
      for (x = 0; x < w; x += 24) fillRect(g, x, 0, 1, h, '#96a1a5');
      for (i = 0; i < 24; i++) {
        x = rnd() * w; y = rnd() * h;
        g.fillStyle = 'rgba(120,110,95,0.16)';
        g.fillRect(x, y, 2 + rnd() * 6, 1 + rnd() * 2);
      }
    }

    else if (R.theme === 'sewer') {
      fillRect(g, 0, 0, w, h, '#20262a');
      for (i = 0; i < 1600; i++) {
        x = rnd() * w; y = rnd() * h;
        g.fillStyle = rnd() < 0.5 ? '#242b2f' : '#1a2024';
        g.fillRect(x | 0, y | 0, 2, 1);
      }
      fillRect(g, 0, 458, w, 98, '#123130');
      for (i = 0; i < 60; i++) {
        x = rnd() * w; y = 462 + rnd() * 90;
        g.globalAlpha = 0.4;
        fillRect(g, x, y, 10 + rnd() * 50, 1, '#2a6b62');
        g.globalAlpha = 1;
      }
      for (i = 0; i < 30; i++) {
        x = rnd() * w; y = 430 + rnd() * 110;
        g.globalAlpha = 0.2;
        fillEllipse(g, x, y, 12 + rnd() * 30, 2 + rnd() * 4, '#3d8a6d');
        g.globalAlpha = 1;
      }
      g.strokeStyle = '#161b1e'; g.lineWidth = 2;
      for (i = 0; i < 12; i++) {
        x = rnd() * w; y = rnd() * 430;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + rnd() * 26 - 13, y + rnd() * 26); g.stroke();
      }
      for (x = 60; x < w; x += 180) {
        fillRect(g, x, 456, 46, 3, '#0d1f20');
        fillRect(g, x + 4, 459, 2, 8, '#0d1f20');
      }
    }

    else if (R.theme === 'lab') {
      fillRect(g, 0, 0, w, h, '#c3cccf');
      for (y = 0; y < h; y += 48) {
        for (x = 0; x < w; x += 48) {
          fillRect(g, x, y, 47, 47, rnd() < 0.5 ? '#c8d1d4' : '#bfc8cb');
          fillRect(g, x, y, 47, 1, '#a7b2b6');
          fillRect(g, x, y, 1, 47, '#a7b2b6');
        }
      }
      fillRect(g, 0, 236, w, 5, '#3f6f8a');
      fillRect(g, 0, 300, w, 2, '#8fa3ad');
      for (i = 0; i < 18; i++) {
        x = rnd() * w; y = rnd() * h;
        g.globalAlpha = 0.18;
        fillEllipse(g, x, y, 8 + rnd() * 20, 2 + rnd() * 5, '#5d6b70');
        g.globalAlpha = 1;
      }
    }

    else { /* roof */
      fillRect(g, 0, 0, w, h, '#23262b');
      for (i = 0; i < 1200; i++) {
        x = rnd() * w; y = rnd() * h;
        g.fillStyle = rnd() < 0.5 ? '#272a30' : '#1e2126';
        g.fillRect(x | 0, y | 0, 2, 1);
      }
      for (x = 0; x < w; x += 64) fillRect(g, x, 0, 1, h, '#1b1e22');
      for (y = 0; y < h; y += 64) fillRect(g, 0, y, w, 1, '#1b1e22');
      for (i = 0; i < 14; i++) {
        x = rnd() * w; y = rnd() * h;
        g.globalAlpha = 0.3;
        fillEllipse(g, x, y, 10 + rnd() * 26, 3 + rnd() * 7, '#2d3941');
        g.globalAlpha = 1;
      }
    }
  }

  /* ---------------- paredes ---------------- */
  function drawWalls(g, R) {
    var rnd = makeRng(hashStr(R.id) + 31);
    for (var i = 0; i < R.def.walls.length; i++) {
      var wl = R.def.walls[i];
      var x = wl[0], y = wl[1], w = wl[2], h = wl[3];
      fillRect(g, x, y, w, h, '#07090c');
      fillRect(g, x + 2, y + 2, w - 4, h - 4, '#191e24');
      fillRect(g, x + 2, y + 2, w - 4, 2, '#323942');

      if (R.theme === 'street' && h > 100) {
        for (var wy = y + 26; wy < y + h - 24; wy += 34) {
          for (var wx = x + 18; wx < x + w - 20; wx += 46) {
            var lit = rnd();
            fillRect(g, wx, wy, 22, 18, lit < 0.25 ? '#2b3f4a' : '#0e1218');
            if (lit < 0.25) {
              fillRect(g, wx + 1, wy + 1, 20, 16, rnd() < 0.5 ? '#3a5a66' : '#6a5a3a');
              g.globalAlpha = 0.5;
              fillRect(g, wx + 3, wy + 3, 7, 10, '#8f7a48');
              g.globalAlpha = 1;
            }
            fillRect(g, wx + 10, wy, 1, 18, '#070a0d');
          }
        }
      } else if (R.theme === 'lab') {
        for (var lx = x + 6; lx < x + w - 6; lx += 26) {
          fillRect(g, lx, y + 4, 2, Math.min(h - 8, 10), '#39434a');
        }
      } else if (R.theme === 'police') {
        fillRect(g, x + 2, y + h - 6, w - 4, 3, '#26313f');
      } else if (R.theme === 'sewer') {
        for (var sx = x + 8; sx < x + w - 8; sx += 30) {
          fillRect(g, sx, y + 4, 3, Math.min(h - 8, 14), '#2c3536');
        }
      }
    }
  }

  function drawStaticBlood(g, R) {
    var rnd = makeRng(hashStr(R.id) + 77);
    for (var i = 0; i < 9; i++) {
      var x = rnd() * R.w, y = rnd() * R.h;
      g.globalAlpha = 0.35;
      fillEllipse(g, x, y, 6 + rnd() * 16, 2 + rnd() * 5, '#4a1010');
      g.globalAlpha = 1;
    }
  }

  /* =====================================================
     PROPS
     ===================================================== */
  function drawProps(g, R) {
    var props = R.def.props || [];
    for (var i = 0; i < props.length; i++) {
      var p = props[i];
      if (p.solid) drawShadow(g, p.x + p.w / 2, p.y + p.h - 2, p.w * 0.48, 4, 0.28);
      prop(g, p, R);
    }
  }

  function prop(g, p, R) {
    var x = p.x, y = p.y, w = p.w, h = p.h;

    switch (p.t) {
      case 'car': {
        fillRect(g, x, y, w, h, '#151b24');
        fillRect(g, x + 2, y + 3, w - 4, h - 6, '#2c3a52');
        fillRect(g, x + 20, y + 8, w - 40, h - 16, '#1a2434');
        fillRect(g, x + 26, y + 7, w - 52, h - 14, '#7f9bb5');
        fillRect(g, x + 24, y + 6, w - 48, 2, '#c9d8e6');
        fillRect(g, x + 4, y + 6, 14, 10, '#e8b23c');       /* farol */
        fillRect(g, x + w - 18, y + 6, 14, 10, '#b83a3a');
        fillRect(g, x + 4, y + h - 16, 14, 10, '#b83a3a');
        fillRect(g, x + w - 18, y + h - 16, 14, 10, '#e8b23c');
        fillRect(g, x + w / 2 - 12, y + 4, 24, 6, '#d8dde3'); /* giroflex */
        fillRect(g, x + w / 2 - 12, y + 4, 11, 6, '#c03a3a');
        fillRect(g, x + w / 2 + 1, y + 4, 11, 6, '#3a6ac0');
        fillRect(g, x + 2, y + h - 4, 10, 4, '#0b0e12');
        fillRect(g, x + w - 12, y + h - 4, 10, 4, '#0b0e12');
        fillRect(g, x + 2, y, 10, 4, '#0b0e12');
        fillRect(g, x + w - 12, y, 10, 4, '#0b0e12');
        break;
      }
      case 'barricade':
        fillRect(g, x, y, w, h, '#b8962e');
        for (var bx = x; bx < x + w; bx += 16) fillRect(g, bx, y, 8, h, '#1a1a1a');
        fillRect(g, x, y, w, 2, '#e0c060');
        break;

      case 'dumpster':
        fillRect(g, x, y, w, h, '#27402f');
        fillRect(g, x + 2, y + 4, w - 4, h - 6, '#31503a');
        fillRect(g, x + 2, y, w - 4, 4, '#1c2e20');
        fillRect(g, x + 8, y + 8, w - 16, 2, '#24402c');
        fillRect(g, x + w - 14, y + 6, 6, 2, '#8a9a6a');
        break;

      case 'barrel':
        fillRect(g, x, y, w, h, '#2a2d33');
        fillRect(g, x + 1, y + 2, w - 2, h - 4, '#3a3f47');
        fillRect(g, x, y + 6, w, 2, '#1b1e23');
        fillRect(g, x, y + h - 8, w, 2, '#1b1e23');
        if (p.fire) {
          g.globalAlpha = 0.6;
          fillCircle(g, x + w / 2, y - 2, 5, '#ff7a2a');
          fillCircle(g, x + w / 2, y - 4, 2.6, '#ffd06a');
          g.globalAlpha = 1;
        }
        break;

      case 'body':
        fillEllipse(g, x + w / 2, y + h, 14, 5, 'rgba(80,12,12,0.55)');
        fillEllipse(g, x + w / 2, y, 9, 3, '#39413c');
        fillCircle(g, x + w / 2 + 6, y - 2, 2.4, '#8a8f7e');
        fillRect(g, x, y - 1, 7, 2, '#2a2f2c');
        break;

      case 'trash':
        fillEllipse(g, x + w / 2, y + h, 10, 3, 'rgba(0,0,0,0.3)');
        fillEllipse(g, x + 5, y + 6, 7, 6, '#22262b');
        fillEllipse(g, x + 14, y + 8, 6, 5, '#2b3036');
        break;

      case 'lamp':
        fillRect(g, x - 1, y, 8, 3, '#3a4048');
        fillRect(g, x, y + 3, 6, 40, '#22262c');
        break;

      case 'fountain': {
        fillEllipse(g, x + w / 2, y + h / 2, w / 2, h / 2, '#2b3138');
        fillEllipse(g, x + w / 2, y + h / 2, w / 2 - 8, h / 2 - 8, '#242a31');
        fillEllipse(g, x + w / 2, y + h / 2, w / 2 - 16, h / 2 - 16, '#1a3a44');
        fillEllipse(g, x + w / 2, y + h / 2 - 2, w / 2 - 26, h / 2 - 22, '#24505c');
        g.globalAlpha = 0.35;
        fillEllipse(g, x + w / 2 - 20, y + h / 2 - 6, 26, 8, '#7fd6e8');
        g.globalAlpha = 1;
        fillRect(g, x + w / 2 - 5, y + 18, 10, h / 2 - 10, '#39434c');
        fillCircle(g, x + w / 2, y + 16, 7, '#4a5560');
        break;
      }

      case 'tree':
        fillEllipse(g, x + w / 2, y + h, w * 0.5, 6, 'rgba(0,0,0,0.32)');
        fillRect(g, x + w / 2 - 3, y + h - 22, 6, 22, '#2c2620');
        fillCircle(g, x + w / 2, y + 18, 20, '#1d302a');
        fillCircle(g, x + w / 2 - 9, y + 12, 12, '#244038');
        fillCircle(g, x + w / 2 + 10, y + 16, 11, '#1a2c26');
        break;

      case 'bench':
        fillRect(g, x, y + 6, w, 6, '#4a3b2c');
        fillRect(g, x, y + 12, w, 4, '#3a2e23');
        fillRect(g, x + 4, y + 16, 4, 6, '#22262b');
        fillRect(g, x + w - 8, y + 16, 4, 6, '#22262b');
        fillRect(g, x, y + 2, w, 4, '#5a4834');
        break;

      case 'manhole':
        fillEllipse(g, x + w / 2, y + h / 2, w / 2, h / 2, '#1a1e23');
        fillEllipse(g, x + w / 2, y + h / 2, w / 2 - 4, h / 2 - 3, '#2b3138');
        for (var mx = -20; mx <= 20; mx += 8) {
          fillRect(g, x + w / 2 + mx, y + 4, 2, h - 8, '#191d22');
        }
        break;

      case 'counter':
        fillRect(g, x, y, w, h, '#3a2f26');
        fillRect(g, x, y, w, 5, '#5b4837');
        fillRect(g, x, y + h - 3, w, 3, '#241d17');
        fillRect(g, x + 12, y + 10, 26, 14, '#c9c3ae');
        fillRect(g, x + 44, y + 14, 20, 10, '#b6b0a0');
        fillRect(g, x + w - 40, y + 8, 16, 12, '#20262c');
        fillRect(g, x + w - 38, y + 10, 12, 7, '#5a7f66');
        break;

      case 'sofa':
        fillRect(g, x, y + 6, w, h - 6, '#33404f');
        fillRect(g, x + 3, y + 2, w - 6, 10, '#3c4b5c');
        fillRect(g, x, y + 12, 6, h - 12, '#2a3542');
        fillRect(g, x + w - 6, y + 12, 6, h - 12, '#2a3542');
        fillRect(g, x + 8, y + 14, (w - 16) / 2 - 2, h - 18, '#2f3b49');
        fillRect(g, x + w / 2 + 1, y + 14, (w - 16) / 2 - 2, h - 18, '#2f3b49');
        break;

      case 'locker':
        for (var lk = 0; lk < 4; lk++) {
          var lx2 = x + lk * (w / 4);
          fillRect(g, lx2, y, w / 4 - 2, h, '#3c444e');
          fillRect(g, lx2 + 1, y + 2, w / 4 - 4, h - 4, '#4a545f');
          fillRect(g, lx2 + 4, y + 6, w / 4 - 10, 2, '#2c343d');
          fillRect(g, lx2 + 4, y + 11, w / 4 - 10, 2, '#2c343d');
          fillRect(g, lx2 + w / 4 - 8, y + h / 2, 2, 6, '#20262c');
        }
        break;

      case 'cabinet':
        fillRect(g, x, y, w, h, '#252b31');
        fillRect(g, x + 1, y + 1, w - 2, h - 2, '#39424a');
        fillRect(g, x + 4, y + 4, w - 8, h - 8, '#2f3840');
        fillRect(g, x + w - 9, y + h / 2, 3, 8, '#9aa4ac');
        fillCircle(g, x + w / 2, y + 8, 2, '#c04a3a');
        break;

      case 'desk':
        fillRect(g, x, y, w, h, '#33291f');
        fillRect(g, x, y, w, 6, '#54402e');
        fillRect(g, x + 8, y + 12, 34, 20, '#c3bda8');
        fillRect(g, x + 12, y + 15, 26, 2, '#9c947f');
        fillRect(g, x + 16, y + 20, 18, 1, '#9c947f');
        fillRect(g, x + w - 58, y + 10, 30, 22, '#1b2027');
        fillRect(g, x + w - 55, y + 13, 24, 15, '#3f5a52');
        fillRect(g, x + w - 44, y + 32, 4, 3, '#1b2027');
        fillRect(g, x + w - 30, y + h - 16, 10, 12, '#b0a890');
        break;

      case 'bars':
        fillRect(g, x, y, w, h, '#0c0f13');
        if (h > w) {
          for (var by = y + 4; by < y + h; by += 12) fillRect(g, x, by, w, 2, '#4a545e');
        } else {
          for (var bx2 = x + 4; bx2 < x + w; bx2 += 12) fillRect(g, bx2, y, 2, h, '#4a545e');
        }
        break;

      case 'typewriter':
        fillRect(g, x, y + 6, w, h - 6, '#1c2126');
        fillRect(g, x + 2, y, w - 4, 10, '#2a3138');
        fillRect(g, x + 8, y - 4, w - 16, 6, '#d8d2c0');
        for (var ty = 0; ty < 3; ty++)
          for (var tx = 0; tx < 6; tx++)
            fillRect(g, x + 4 + tx * 3.4, y + 12 + ty * 2, 2, 1, '#59626b');
        break;

      case 'plant':
        fillRect(g, x + 6, y + 14, 14, 12, '#2e3a36');
        fillCircle(g, x + 13, y + 10, 10, '#2a4a38');
        fillCircle(g, x + 8, y + 6, 6, '#33583f');
        fillCircle(g, x + 19, y + 8, 6, '#244a34');
        break;

      case 'shelf':
        fillRect(g, x, y, w, h, '#2b3238');
        fillRect(g, x + 2, y + 2, w - 4, h - 4, '#39424a');
        fillRect(g, x + 4, y + h / 2, w - 8, 2, '#232a30');
        for (var sb = 0; sb < 12; sb++) {
          var sx2 = x + 8 + (sb % 6) * ((w - 16) / 6);
          var sy2 = y + 6 + (sb < 6 ? 0 : h / 2 + 4);
          fillRect(g, sx2, sy2, 5, 8, ['#6a8a6a', '#8a6a6a', '#6a7a8a', '#9a9a6a'][sb % 4]);
          fillRect(g, sx2 + 1, sy2, 3, 2, '#d8d8d8');
        }
        break;

      case 'pillar':
        fillRect(g, x, y, w, h, '#1b2226');
        fillRect(g, x + 2, y + 2, w - 4, h - 4, '#2c3539');
        fillRect(g, x + 2, y + 2, w - 4, 3, '#3d484c');
        fillRect(g, x + 10, y + 10, 2, h - 20, '#232c30');
        fillRect(g, x + w - 14, y + 14, 2, h - 24, '#232c30');
        break;

      case 'pipe':
        fillRect(g, x, y, w, h, '#1a2024');
        fillRect(g, x, y + 2, w, h - 4, '#39444a');
        fillRect(g, x, y + 2, w, 2, '#556269');
        for (var px = x + 10; px < x + w; px += 34) fillRect(g, px, y, 3, h, '#161c20');
        break;

      case 'crate':
        fillRect(g, x, y, w, h, '#3a2e22');
        fillRect(g, x + 2, y + 2, w - 4, h - 4, '#4a3a2a');
        fillRect(g, x + 2, y + 2, w - 4, 2, '#5c4834');
        g.strokeStyle = '#2a2118'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(x + 4, y + 4); g.lineTo(x + w - 4, y + h - 4);
        g.moveTo(x + w - 4, y + 4); g.lineTo(x + 4, y + h - 4); g.stroke();
        break;

      case 'console':
        fillRect(g, x, y, w, h, '#20262c');
        fillRect(g, x + 2, y + 2, w - 4, h - 4, '#2b333a');
        fillRect(g, x + 8, y + 8, 34, 24, '#0f1a1e');
        fillRect(g, x + 10, y + 10, 30, 20, '#1d4a44');
        fillRect(g, x + 12, y + 14, 18, 1, '#63c9a8');
        fillRect(g, x + 12, y + 18, 24, 1, '#63c9a8');
        fillRect(g, x + 12, y + 22, 12, 1, '#63c9a8');
        for (var cb = 0; cb < 6; cb++)
          fillCircle(g, x + w - 60 + (cb % 3) * 14, y + 14 + Math.floor(cb / 3) * 12, 2, cb % 2 ? '#c04a3a' : '#4a8ac0');
        fillRect(g, x + 50, y + h - 14, w - 60, 8, '#1a2026');
        break;

      case 'cold':
        fillRect(g, x, y, w, h, '#1d2429');
        fillRect(g, x + 2, y + 2, w - 4, h - 4, '#48555c');
        fillRect(g, x + 6, y + 6, w - 12, h - 12, '#39454c');
        fillRect(g, x + 10, y + 10, w - 20, 18, '#7fa8b8');
        fillRect(g, x + 12, y + 12, w - 24, 14, '#a8d4e0');
        g.globalAlpha = 0.4;
        fillCircle(g, x + w / 2, y + h / 2 + 8, 12, '#bfe7ff');
        g.globalAlpha = 1;
        fillRect(g, x + w - 12, y + h / 2, 4, 10, '#9aa4ac');
        break;

      case 'synth':
        fillRect(g, x, y, w, h, '#22282e');
        fillRect(g, x + 2, y + 2, w - 4, h - 4, '#333c44');
        fillCircle(g, x + 30, y + h / 2, 16, '#101619');
        fillCircle(g, x + 30, y + h / 2, 12, '#1d4a44');
        fillCircle(g, x + 30, y + h / 2, 8, '#2e7a6a');
        fillCircle(g, x + 30, y + h / 2, 3, '#7fe0c0');
        fillRect(g, x + 56, y + 10, w - 66, 8, '#0e1418');
        fillRect(g, x + 56, y + 12, (w - 66) * 0.6, 4, '#5ac0a8');
        for (var sy = 0; sy < 4; sy++)
          fillCircle(g, x + 60 + sy * 10, y + h - 20, 2.4, sy === 0 ? '#c04a3a' : '#3a6a5a');
        break;

      case 'fusebox':
        fillRect(g, x, y, w, h, '#2a2f33');
        fillRect(g, x + 1, y + 1, w - 2, h - 2, '#4a4a2e');
        fillRect(g, x + 5, y + 5, w - 10, h - 10, '#2e2e1e');
        for (var fb = 0; fb < 3; fb++)
          fillRect(g, x + 7, y + 8 + fb * 6, w - 14, 3, '#c0b060');
        break;

      case 'tube':
        fillRect(g, x, y, w, h, '#1b2226');
        fillRect(g, x + 3, y + 4, w - 6, h - 8, '#2a3a3a');
        g.globalAlpha = 0.65;
        fillRect(g, x + 6, y + 10, w - 12, h - 20, '#3f8a6a');
        g.globalAlpha = 1;
        fillRect(g, x + 6, y + 10, w - 12, 3, '#7fd8b0');
        fillRect(g, x + 2, y, w - 4, 4, '#39434a');
        fillRect(g, x + 2, y + h - 4, w - 4, 4, '#39434a');
        break;

      case 'elevator':
        fillRect(g, x, y, w, h, '#1a2024');
        fillRect(g, x + 2, y + 2, w / 2 - 3, h - 4, '#4a545c');
        fillRect(g, x + w / 2 + 1, y + 2, w / 2 - 3, h - 4, '#414a52');
        fillRect(g, x + w / 2 - 1, y + 2, 2, h - 4, '#151a1e');
        fillRect(g, x + w - 10, y + h / 2 - 4, 4, 8, '#c0a040');
        break;

      case 'ac':
        fillRect(g, x, y, w, h, '#282d33');
        fillRect(g, x + 2, y + 2, w - 4, h - 4, '#3a4249');
        fillCircle(g, x + w / 2, y + h / 2, 16, '#1e2328');
        fillCircle(g, x + w / 2, y + h / 2, 13, '#2b333a');
        g.strokeStyle = '#1a1f24'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(x + w / 2 - 10, y + h / 2); g.lineTo(x + w / 2 + 10, y + h / 2); g.stroke();
        g.beginPath(); g.moveTo(x + w / 2, y + h / 2 - 10); g.lineTo(x + w / 2, y + h / 2 + 10); g.stroke();
        fillRect(g, x + 4, y + h - 8, w - 8, 2, '#4a545c');
        break;

      case 'antenna':
        fillRect(g, x, y, w, h, '#2a3036');
        fillRect(g, x - 6, y + 6, w + 12, 2, '#39434a');
        fillRect(g, x - 4, y + 14, w + 8, 2, '#39434a');
        fillCircle(g, x + w / 2, y - 2, 2.6, '#c04a3a');
        break;

      case 'helipad':
        g.strokeStyle = '#4a5258'; g.lineWidth = 4;
        g.beginPath(); g.arc(x, y, w / 2, 0, TAU); g.stroke();
        g.lineWidth = 2;
        g.beginPath(); g.arc(x, y, w / 2 - 12, 0, TAU); g.stroke();
        g.fillStyle = '#4a5258';
        g.fillRect(x - 18, y - 22, 8, 44);
        g.fillRect(x + 10, y - 22, 8, 44);
        g.fillRect(x - 18, y - 4, 36, 8);
        break;
    }
  }

  /* =====================================================
     SPRITES
     ===================================================== */
  function legs(g, x, y, step, color, boot) {
    g.fillStyle = color;
    g.fillRect(x - 3.4 + step * 0.5, y + 1, 2.8, 6);
    g.fillRect(x + 0.8 - step * 0.5, y + 1, 2.8, 6);
    g.fillStyle = boot;
    g.fillRect(x - 3.4 + step * 0.5, y + 6, 2.8, 1.6);
    g.fillRect(x + 0.8 - step * 0.5, y + 6, 2.8, 1.6);
  }

  function drawThayla(g, p, t, opts) {
    var moving = p.moving;
    var wt = p.walkT * 11;
    var bob = moving ? Math.sin(wt) * 1.4 : Math.sin(t * 2.2) * 0.45;
    var step = moving ? Math.sin(wt) : 0;
    var face = p.face < 0 ? -1 : 1;
    var flash = p.inv > 0 && Math.floor(t * 20) % 2 === 0;
    var aiming = opts && opts.aiming;
    var x = p.x, y = p.y;
    var ax = Math.cos(p.aim), ay = Math.sin(p.aim);
    var sway = Math.sin(p.walkT * 5 + t * 1.6) * (moving ? 1.5 : 0.55);

    drawShadow(g, x, y + 8, 8.4, 3.2, 0.38);
    g.globalAlpha = flash ? 0.55 : 1;

    /* ---------- esquiva: bola de cabelo ---------- */
    if (p.dodge > 0) {
      fillCircle(g, x - face * 1.5, y - 2 + bob, 7, '#202a44');
      fillCircle(g, x - face * 3.5, y - 5 + bob, 6, '#241619');
      fillCircle(g, x - face * 5.5, y - 2 + bob + sway * 0.4, 4.4, '#2b1a1d');
      fillCircle(g, x + face * 1.5, y - 7 + bob, 4.2, '#2b1a1d');
      fillRect(g, x - 4, y + 4, 8, 2.4, '#0d1118');
      fillRect(g, x - 3, y + 4, 2, 1.6, '#e8c25a');
      g.globalAlpha = 1;
      return;
    }

    /* ---------- cabelo (atrás do corpo) ---------- */
    var hx = x - face * 1.4;
    var hb = bob + sway * 0.35;
    fillCircle(g, hx - face * 1.2, y - 19.5 + hb, 6.6, '#241619');
    fillCircle(g, hx - face * 4.6, y - 16.5 + hb + sway * 0.5, 5.2, '#2b1a1d');
    fillCircle(g, hx - face * 6.2, y - 11 + hb + sway * 0.9, 4.4, '#241619');
    fillCircle(g, hx - face * 5.4, y - 6.5 + hb + sway * 1.2, 3.4, '#1d1114');
    fillCircle(g, hx - face * 2.6, y - 6 + hb + sway * 1.1, 3.2, '#241619');
    fillCircle(g, hx + face * 2.2, y - 20.5 + hb, 4.6, '#2b1a1d');
    /* cachos iluminados */
    fillCircle(g, hx - face * 2.4, y - 18.5 + hb, 3.1, '#3a2427');
    fillCircle(g, hx - face * 4.8, y - 14.5 + hb + sway * 0.6, 2.6, '#352124');
    fillCircle(g, hx - face * 5.4, y - 9 + hb + sway, 2.2, '#312024');

    /* ---------- pernas ---------- */
    var s1 = step * 1.9, s2 = -step * 1.9;
    /* perna de trás */
    fillRect(g, x - 4.4 + s1, y - 1.2 + (s1 > 0 ? 0.9 : 0), 3.5, 7.2, '#1f2a40');
    fillRect(g, x - 4.6 + s1, y + 5.6 + (s1 > 0 ? 0.9 : 0), 3.9, 2.2, '#0d1118');
    fillRect(g, x - 4.6 + s1, y + 5.4 + (s1 > 0 ? 0.9 : 0), 3.9, 0.7, '#222c40');
    /* perna da frente */
    fillRect(g, x + 0.9 + s2, y - 1.2 + (s2 > 0 ? 0.9 : 0), 3.5, 7.2, '#283650');
    fillRect(g, x + 0.7 + s2, y + 5.6 + (s2 > 0 ? 0.9 : 0), 3.9, 2.2, '#10141c');
    fillRect(g, x + 0.7 + s2, y + 5.4 + (s2 > 0 ? 0.9 : 0), 3.9, 0.7, '#26324a');

    /* ---------- tronco ---------- */
    var ty = y - 11.6 + bob;
    g.fillStyle = '#2c3c60';
    g.fillRect(x - 4.6, ty, 9.2, 10.6);
    g.fillStyle = '#22304e';
    g.fillRect(x - 4.6, ty, 2.2, 10.6);
    g.fillStyle = '#354870';
    g.fillRect(x + 2.4, ty + 0.4, 1.8, 8.2);
    /* gola / camisa interna */
    g.fillStyle = '#d3dfee';
    g.fillRect(x - 2.2, ty - 0.4, 4.4, 2);
    g.fillStyle = '#18233a';
    g.fillRect(x - 0.6, ty + 0.3, 1.2, 3.2);
    /* distintivo */
    g.fillStyle = '#e8c25a';
    g.fillRect(x + face * 1.7, ty + 3.2, 1.5, 1.7);
    g.fillStyle = '#fff0b0';
    g.fillRect(x + face * 1.7, ty + 3.2, 0.7, 0.8);
    /* rádio no ombro */
    g.fillStyle = '#0e131c';
    g.fillRect(x - face * 4.2, ty + 1.2, 2.1, 3);
    g.fillStyle = '#39434f';
    g.fillRect(x - face * 4.2, ty + 1.2, 2.1, 0.7);
    g.fillRect(x - face * 3.5, ty - 0.6, 0.7, 1.9);
    /* cinto de serviço */
    g.fillStyle = '#10141c';
    g.fillRect(x - 4.9, y - 2.1 + bob, 9.8, 2.3);
    g.fillStyle = '#c8b060';
    g.fillRect(x - 1.1, y - 1.8 + bob, 2.2, 1.7);
    g.fillStyle = '#2a3446';
    g.fillRect(x - 4.4, y - 1.7 + bob, 1.5, 1.4);
    g.fillRect(x + 2.9, y - 1.7 + bob, 1.5, 1.4);
    /* coldre */
    g.fillStyle = '#141a24';
    g.fillRect(x + face * 3.4 - 0.8, y - 0.4 + bob, 2, 4.2);

    /* ---------- braços ---------- */
    if (aiming) {
      var hxx = x + ax * 8.2;
      var hyy = y - 7.6 + bob + ay * 8.2;
      g.strokeStyle = '#2c3c60';
      g.lineWidth = 2.8;
      g.beginPath();
      g.moveTo(x + face * 1.8, y - 8.6 + bob);
      g.lineTo(hxx, hyy);
      g.stroke();
      g.strokeStyle = '#e8b48f';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(hxx - ax * 1.4, hyy - ay * 1.4);
      g.lineTo(hxx, hyy);
      g.stroke();
      /* mão de apoio */
      g.fillStyle = '#e8b48f';
      g.fillRect(x + face * 0.8, y - 6.4 + bob, 2, 1.6);
      /* pistola */
      g.save();
      g.translate(hxx + ax * 1.6, hyy + ay * 1.6);
      g.rotate(p.aim);
      g.fillStyle = '#0e1219';
      g.fillRect(-1.2, -1.8, 6, 3.2);
      g.fillStyle = '#3e4a58';
      g.fillRect(0.4, -1.2, 4.4, 1.5);
      g.fillStyle = '#0a0d12';
      g.fillRect(-1.2, 0.5, 2.1, 2.4);
      g.fillStyle = '#e8c25a';
      g.fillRect(0.2, -0.6, 0.8, 0.7);
      g.restore();
      if (p.muzzle > 0) {
        g.globalAlpha = (p.muzzle / 0.06) * 0.9;
        fillCircle(g, hxx + ax * 5.4, hyy + ay * 5.4, 3.6, '#ffe08a');
        fillCircle(g, hxx + ax * 6.2, hyy + ay * 6.2, 1.9, '#fff6d0');
        g.globalAlpha = flash ? 0.55 : 1;
      }
    } else {
      /* braço da frente */
      g.fillStyle = '#2c3c60';
      g.fillRect(x + face * 2.6, ty + 2.6, 2.2, 4.6);
      g.fillStyle = '#e8b48f';
      g.fillRect(x + face * 2.6, ty + 6.7, 2.2, 1.7);
      /* braço de trás */
      g.fillStyle = '#22304e';
      g.fillRect(x - face * 4.8, ty + 2.6, 2.1, 4.4);
      g.fillStyle = '#d8a47e';
      g.fillRect(x - face * 4.8, ty + 6.5, 2.1, 1.6);
      /* faixa de ombro */
      g.fillStyle = '#e8c25a';
      g.fillRect(x + face * 2.6, ty + 2.3, 2.2, 0.7);
    }

    /* ---------- cabeça ---------- */
    var hcy = y - 17.6 + bob;
    /* pescoço */
    g.fillStyle = '#d8a47e';
    g.fillRect(x - 1.3, hcy + 4.2, 2.6, 2.4);
    /* rosto */
    fillEllipse(g, x + face * 1.1, hcy, 4.4, 5.1, '#eab68f');
    fillEllipse(g, x + face * 1.1, hcy + 1.6, 4.1, 3.2, '#e2ab83');
    /* orelha */
    fillCircle(g, x - face * 3.4, hcy + 0.6, 1.4, '#dca780');
    /* franja */
    fillCircle(g, x + face * 0.6, hcy - 4.6, 4.7, '#2b1a1d');
    fillRect(g, x - face * 3.2, hcy - 5.4, 6.4, 1.9, '#2b1a1d');
    fillCircle(g, x + face * 4.2, hcy - 2.2, 2.2, '#241619');
    /* mecha lateral */
    fillCircle(g, x - face * 3.6, hcy + 1.2, 2, '#2b1a1d');
    /* olhos */
    g.fillStyle = '#241416';
    g.fillRect(x + face * 0.5, hcy - 0.8, 1.3, 1.9);
    g.fillRect(x + face * 2.7, hcy - 0.8, 1.3, 1.9);
    g.fillStyle = 'rgba(255,255,255,0.75)';
    g.fillRect(x + face * 0.9, hcy - 0.6, 0.5, 0.5);
    g.fillRect(x + face * 3.1, hcy - 0.6, 0.5, 0.5);
    /* sobrancelhas */
    g.fillStyle = '#3a2326';
    g.fillRect(x + face * 0.4, hcy - 2.3, 1.5, 0.6);
    g.fillRect(x + face * 2.6, hcy - 2.3, 1.5, 0.6);
    /* nariz e boca */
    g.fillStyle = '#c99070';
    g.fillRect(x + face * 2.3, hcy + 1.3, 0.9, 0.8);
    g.fillStyle = '#8a4a4a';
    g.fillRect(x + face * 1.2, hcy + 3.1, 1.7, 0.6);

    /* ---------- quepe ---------- */
    g.fillStyle = '#1b2740';
    g.fillRect(x - 3.4 + face * 0.9, hcy - 7.3, 7, 2.6);
    g.fillStyle = '#131c2e';
    g.fillRect(x - 3.4 + face * 0.9, hcy - 5.2, 7, 0.8);
    g.fillStyle = '#0b0f16';
    g.fillRect(x + face * 1.7, hcy - 4.7, 4.6, 1.1);
    g.fillStyle = '#e8c25a';
    g.fillRect(x - 0.1 + face * 0.9, hcy - 6.8, 1.7, 1.5);
    g.fillStyle = '#fff0b0';
    g.fillRect(x - 0.1 + face * 0.9, hcy - 6.8, 0.8, 0.7);

    g.globalAlpha = 1;
  }

  function drawZombie(g, e, t) {
    var bob = Math.sin(e.walkT * 6 + e.seed) * 1.2;
    var step = Math.sin(e.walkT * 6 + e.seed) * 2;
    var hurt = e.flash > 0;
    var skin = hurt ? '#d8d0b8' : '#8fa07e';
    var cloth = hurt ? '#8a8a72' : '#4a4f45';

    drawShadow(g, e.x, e.y + 8, 6.6, 2.8, 0.34);
    g.globalAlpha = e.dead ? 0.75 : 1;

    legs(g, e.x, e.y, step, '#3a3f39', '#22251f');

    g.fillStyle = cloth;
    g.fillRect(e.x - 4.4, e.y - 7 + bob, 8.8, 9);
    g.fillStyle = '#3a3e36';
    g.fillRect(e.x - 4.4, e.y - 7 + bob, 2.4, 9);
    /* rasgo */
    g.fillStyle = '#6b1616';
    g.fillRect(e.x - 1, e.y - 4 + bob, 3, 4);

    /* braços esticados */
    var ax = Math.cos(e.aim), ay = Math.sin(e.aim);
    g.strokeStyle = skin; g.lineWidth = 2.4;
    g.beginPath();
    g.moveTo(e.x - 3, e.y - 5 + bob);
    g.lineTo(e.x - 3 + ax * 8, e.y - 5 + bob + ay * 8);
    g.stroke();
    g.beginPath();
    g.moveTo(e.x + 3, e.y - 5 + bob);
    g.lineTo(e.x + 3 + ax * 7, e.y - 5 + bob + ay * 7);
    g.stroke();

    /* cabeça pendida */
    g.fillStyle = skin;
    g.fillRect(e.x - 3.2, e.y - 13 + bob + 1, 6.4, 6);
    g.fillStyle = '#6a7a58';
    g.fillRect(e.x - 3.2, e.y - 13 + bob + 1, 6.4, 1.6);
    g.fillStyle = '#2a0e0e';
    g.fillRect(e.x - 2, e.y - 11 + bob, 1.4, 1.4);
    g.fillRect(e.x + 0.8, e.y - 11 + bob, 1.4, 1.4);
    g.fillStyle = '#4a1010';
    g.fillRect(e.x - 1.6, e.y - 8.4 + bob, 3.2, 1);

    g.globalAlpha = 1;
  }

  function drawCrawler(g, e, t) {
    var w = Math.sin(e.walkT * 9 + e.seed) * 1.6;
    drawShadow(g, e.x, e.y + 5, 8, 2.4, 0.3);
    g.globalAlpha = e.dead ? 0.7 : 1;
    g.fillStyle = e.flash > 0 ? '#d8d0b8' : '#7e8f70';
    fillEllipse(g, e.x, e.y + 1, 7, 4.2, e.flash > 0 ? '#d8d0b8' : '#7e8f70');
    g.fillStyle = '#4a4f45';
    fillEllipse(g, e.x - 2, e.y + 2, 5, 2.6, '#4a4f45');
    g.fillStyle = e.flash > 0 ? '#f0e8d0' : '#8fa07e';
    fillCircle(g, e.x + Math.cos(e.aim) * 5, e.y - 1 + Math.sin(e.aim) * 3, 3, e.flash > 0 ? '#f0e8d0' : '#8fa07e');
    g.fillStyle = '#3a0c0c';
    fillCircle(g, e.x + Math.cos(e.aim) * 6, e.y - 1 + Math.sin(e.aim) * 3, 1.1, '#3a0c0c');
    /* braços rastejantes */
    g.strokeStyle = '#7e8f70'; g.lineWidth = 1.8;
    g.beginPath();
    g.moveTo(e.x - 2, e.y);
    g.lineTo(e.x - 6, e.y + 3 + w);
    g.moveTo(e.x + 2, e.y);
    g.lineTo(e.x + 6, e.y + 3 - w);
    g.stroke();
    g.globalAlpha = 1;
  }

  function drawQueen(g, e, t) {
    var pulse = 0.6 + Math.sin(t * 5) * 0.4;
    var bob = Math.sin(t * 2.2) * 2;

    drawShadow(g, e.x, e.y + 18, 30, 9, 0.35);

    g.strokeStyle = '#2b1f2b'; g.lineWidth = 3;
    for (var i = 0; i < 6; i++) {
      var a = (i / 6) * TAU + 0.3;
      g.beginPath();
      g.moveTo(e.x + Math.cos(a) * 10, e.y + Math.sin(a) * 8 + bob);
      g.lineTo(e.x + Math.cos(a) * 26, e.y + Math.sin(a) * 20 + 6 + bob);
      g.stroke();
    }

    fillEllipse(g, e.x, e.y + bob, 22, 16, e.flash > 0 ? '#a88aa8' : '#4a3750');
    g.strokeStyle = e.flash > 0 ? '#e0c8e0' : '#84495c';
    g.lineWidth = 1;
    g.beginPath(); g.ellipse(e.x, e.y + bob, 22, 16, 0, 0, TAU); g.stroke();
    fillEllipse(g, e.x, e.y - 4 + bob, 16, 11, e.flash > 0 ? '#a88aa8' : '#5a4258');
    fillEllipse(g, e.x - 8, e.y - 8 + bob, 7, 5, '#4a3548');
    fillEllipse(g, e.x + 8, e.y - 8 + bob, 7, 5, '#4a3548');

    /* núcleo pulsante */
    g.globalAlpha = 0.35 * pulse;
    fillCircle(g, e.x, e.y + bob, 13, '#ff4a4a');
    g.globalAlpha = 1;
    fillCircle(g, e.x, e.y + bob, 6.5, '#a01a1a');
    fillCircle(g, e.x, e.y + bob, 3.4, '#ff6a5a');

    /* mandíbulas */
    g.fillStyle = '#d8c8a0';
    for (var j = 0; j < 4; j++) {
      g.fillRect(e.x - 10 + j * 6, e.y + 12 + bob, 2, 5);
    }
    g.globalAlpha = 1;
  }

  function drawRaul(g, e, t, kneeling) {
    var bob = kneeling ? 0 : Math.sin(e.walkT * 8) * 1.2;
    var step = kneeling ? 0 : Math.sin(e.walkT * 8) * 2.2;
    var hurt = e && e.flash > 0;

    drawShadow(g, e.x, e.y + 8, 7.5, 3, 0.34);
    if (kneeling) {
      g.fillStyle = '#c9c6bb';
      g.fillRect(e.x - 6, e.y - 5, 12, 11);
      g.fillStyle = '#e0dccf';
      g.fillRect(e.x - 6, e.y - 5, 12, 3);
      g.fillStyle = '#8a8478';
      g.fillRect(e.x - 6, e.y + 4, 12, 2);
      g.fillStyle = '#d8c8a8';
      g.fillRect(e.x - 3, e.y - 14, 6, 7);
      g.fillStyle = '#6a6460';
      g.fillRect(e.x - 3.4, e.y - 15, 6.8, 2.4);
      g.fillStyle = '#ff5a4a';
      g.fillRect(e.x - 2, e.y - 11, 1.2, 1.2);
      g.fillRect(e.x + 0.8, e.y - 11, 1.2, 1.2);
      return;
    }

    legs(g, e.x, e.y, step, '#4a4038', '#241f1a');

    /* jaleco */
    g.fillStyle = hurt ? '#ffffff' : '#c9c6bb';
    g.fillRect(e.x - 5, e.y - 8 + bob, 10, 10.5);
    g.fillStyle = '#a8a49a';
    g.fillRect(e.x - 5, e.y - 8 + bob, 2.2, 10.5);
    g.fillStyle = '#8a3a3a';
    g.fillRect(e.x + 0.5, e.y - 6 + bob, 2, 3);

    /* braço mutante */
    g.strokeStyle = hurt ? '#c0a0c0' : '#5c3a5c'; g.lineWidth = 3.4;
    g.beginPath();
    g.moveTo(e.x + 4, e.y - 6 + bob);
    g.lineTo(e.x + 4 + Math.cos(e.aim) * 9, e.y - 6 + bob + Math.sin(e.aim) * 9);
    g.stroke();
    fillCircle(g, e.x + 4 + Math.cos(e.aim) * 10, e.y - 6 + bob + Math.sin(e.aim) * 10, 3, '#7a4a7a');

    /* cabeça */
    g.fillStyle = '#c8b8a0';
    g.fillRect(e.x - 3.2, e.y - 15 + bob, 6.4, 7);
    g.fillStyle = '#6a6460';
    g.fillRect(e.x - 3.6, e.y - 16.2 + bob, 7.2, 2.6);
    g.fillStyle = e.hp < e.maxhp * 0.5 ? '#ff3a2a' : '#c8b8a0';
    g.fillRect(e.x - 2, e.y - 12.4 + bob, 1.4, 1.4);
    g.fillRect(e.x + 0.8, e.y - 12.4 + bob, 1.4, 1.4);
    /* veias */
    g.fillStyle = 'rgba(90,30,90,0.7)';
    g.fillRect(e.x + 2, e.y - 14 + bob, 1, 3);
    g.fillRect(e.x - 3, e.y - 1 + bob, 1.4, 3);
  }

  function drawTick(g, e, t) {
    var s = e.flash > 0 ? '#d8d0b8' : '#4a2b3a';
    drawShadow(g, e.x, e.y + 4, 5, 1.8, 0.3);
    g.strokeStyle = s; g.lineWidth = 1.4;
    for (var i = 0; i < 4; i++) {
      var a = (i / 4) * TAU + Math.sin(t * 8 + i) * 0.3;
      g.beginPath();
      g.moveTo(e.x, e.y);
      g.lineTo(e.x + Math.cos(a) * 7, e.y + Math.sin(a) * 6);
      g.stroke();
    }
    fillEllipse(g, e.x, e.y, 5, 4, s);
    fillCircle(g, e.x, e.y - 1, 2.2, '#a02a2a');
  }

  return {
    buildBase: buildBase,
    drawThayla: drawThayla,
    drawZombie: drawZombie,
    drawCrawler: drawCrawler,
    drawQueen: drawQueen,
    drawRaul: drawRaul,
    drawTick: drawTick,
    prop: prop
  };
})();
