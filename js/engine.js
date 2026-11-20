/* =========================================================
   THAYLA — engine base
   Utilidades, matemática, entrada, canvas.
   ========================================================= */

var VIEW_W = 480, VIEW_H = 270, TAU = Math.PI * 2;

function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
function lerp(a, b, t) { return a + (b - a) * t; }
function rand(a, b) { if (b === undefined) { b = a; a = 0; } return a + Math.random() * (b - a); }
function randInt(a, b) { return Math.floor(a + Math.random() * (b - a + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function dist(ax, ay, bx, by) { var dx = bx - ax, dy = by - ay; return Math.sqrt(dx * dx + dy * dy); }
function dist2(ax, ay, bx, by) { var dx = bx - ax, dy = by - ay; return dx * dx + dy * dy; }
function angNorm(a) { a %= TAU; if (a > Math.PI) a -= TAU; if (a < -Math.PI) a += TAU; return a; }
function angDiff(a, b) { return angNorm(b - a); }
function approach(v, t, s) { return v < t ? Math.min(v + s, t) : Math.max(v - s, t); }
function boxHit(e, r) {
  return e.x + e.hw > r.x && e.x - e.hw < r.x + r.w &&
         e.y + e.hh > r.y && e.y - e.hh < r.y + r.h;
}
function makeRng(seed) {
  seed = seed >>> 0;
  return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}

/* ---------- canvas ---------- */

var Render = { scale: 1, ox: 0, oy: 0 };
var CANVAS = null, CTX = null;
var GAME_CANVAS = null, GCTX = null;

function resizeCanvas() {
  if (!CANVAS) return;
  var cw = Math.max(320, window.innerWidth), ch = Math.max(180, window.innerHeight);
  CANVAS.width = cw; CANVAS.height = ch;
  if (cw / ch >= 480 / 270) {
    VIEW_H = 270;
    VIEW_W = Math.ceil(cw / (ch / VIEW_H));
    Render.scale = ch / VIEW_H;
  } else {
    VIEW_W = 480;
    VIEW_H = Math.ceil(ch / (cw / VIEW_W));
    Render.scale = cw / VIEW_W;
  }
  Render.ox = 0;
  Render.oy = 0;
  if (GAME_CANVAS) {
    GAME_CANVAS.width = VIEW_W;
    GAME_CANVAS.height = VIEW_H;
    GCTX = GAME_CANVAS.getContext('2d');
    GCTX.imageSmoothingEnabled = false;
  }
  if (typeof initRain === 'function') initRain();
  CTX = CANVAS.getContext('2d');
  CTX.imageSmoothingEnabled = false;
}

function engineInit() {
  CANVAS = document.getElementById('game');
  GAME_CANVAS = document.createElement('canvas');
  GAME_CANVAS.width = VIEW_W;
  GAME_CANVAS.height = VIEW_H;
  GCTX = GAME_CANVAS.getContext('2d');
  GCTX.imageSmoothingEnabled = false;
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  Input.init();
}

/* ---------- entrada ---------- */

var Input = {
  down: {}, pressed: {},
  mouse: { cx: 0, cy: 0, x: 0, y: 0, down: false, rdown: false, clicked: false, rclicked: false },
  touch: { moveX: 0, moveY: 0, down: {}, pressed: {} },
  wheel: 0,

  init: function () {
    var self = this;
    var moveStick = document.getElementById('move-stick');
    var moveKnob = moveStick && moveStick.querySelector('.touch-stick-knob');
    var movePointer = null;
    var canvasPointer = null;

    function updateMoveStick(e) {
      var rect = moveStick.getBoundingClientRect();
      var radius = Math.max(1, Math.min(rect.width, rect.height) / 2 - 24);
      var dx = e.clientX - (rect.left + rect.width / 2);
      var dy = e.clientY - (rect.top + rect.height / 2);
      var length = Math.hypot(dx, dy);
      if (length > radius) { dx *= radius / length; dy *= radius / length; }
      self.touch.moveX = dx / radius;
      self.touch.moveY = dy / radius;
      if (moveKnob) moveKnob.style.transform =
        'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
    }

    if (moveStick) {
      moveStick.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        movePointer = e.pointerId;
        moveStick.setPointerCapture(e.pointerId);
        updateMoveStick(e);
      });
      moveStick.addEventListener('pointermove', function (e) {
        if (e.pointerId === movePointer) updateMoveStick(e);
      });
      function releaseMove(e) {
        if (e.pointerId !== movePointer) return;
        movePointer = null;
        self.touch.moveX = self.touch.moveY = 0;
        if (moveKnob) moveKnob.style.transform = 'translate(-50%, -50%)';
      }
      moveStick.addEventListener('pointerup', releaseMove);
      moveStick.addEventListener('pointercancel', releaseMove);
    }

    var touchButtons = document.querySelectorAll ?
      document.querySelectorAll('[data-touch-key]') : [];
    for (var b = 0; b < touchButtons.length; b++) {
      (function (button) {
        var code = button.getAttribute('data-touch-key');
        button.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          button.setPointerCapture(e.pointerId);
          if (!self.touch.down[code]) self.touch.pressed[code] = true;
          self.touch.down[code] = true;
        });
        function releaseButton() {
          self.touch.down[code] = false;
        }
        button.addEventListener('pointerup', releaseButton);
        button.addEventListener('pointercancel', releaseButton);
      })(touchButtons[b]);
    }

    var tutorialDismiss = document.getElementById('tutorial-dismiss');
    var mobileTutorial = document.getElementById('mobile-tutorial');
    if (tutorialDismiss && mobileTutorial) {
      tutorialDismiss.addEventListener('click', function () {
        mobileTutorial.classList.add('is-hidden');
      });
    }

    if (CANVAS && CANVAS.addEventListener) {
      CANVAS.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'touch') return;
        e.preventDefault();
        canvasPointer = e.pointerId;
        self.mouse.cx = e.clientX;
        self.mouse.cy = e.clientY;
        self.mouse.down = true;
        self.mouse.clicked = true;
      });
      CANVAS.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch' && e.pointerId === canvasPointer) {
          self.mouse.cx = e.clientX;
          self.mouse.cy = e.clientY;
        }
      });
      function releaseCanvas(e) {
        if (e.pointerId !== canvasPointer) return;
        canvasPointer = null;
        self.mouse.down = false;
      }
      CANVAS.addEventListener('pointerup', releaseCanvas);
      CANVAS.addEventListener('pointercancel', releaseCanvas);
    }

    function codeOf(e) {
      if (e.code) return e.code;
      var k = e.key || '';
      if (k === ' ' || k === 'Spacebar') return 'Space';
      if (k === 'Esc') return 'Escape';
      if (/^[a-zA-Z]$/.test(k)) return 'Key' + k.toUpperCase();
      if (/^[0-9]$/.test(k)) return 'Digit' + k;
      return k;
    }

    window.addEventListener('keydown', function (e) {
      var code = codeOf(e);
      if (!self.down[code]) self.pressed[code] = true;
      self.down[code] = true;
      if (!e.repeat) self.pressed[code] = true;
      if (code === 'Tab' || code === 'Space' ||
          code === 'ArrowUp' || code === 'ArrowDown' ||
          code === 'ArrowLeft' || code === 'ArrowRight' ||
          code === 'KeyE' || code === 'Quote') {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', function (e) {
      self.down[codeOf(e)] = false;
    });

    window.addEventListener('mousemove', function (e) {
      self.mouse.cx = e.clientX;
      self.mouse.cy = e.clientY;
    });

    window.addEventListener('mousedown', function (e) {
      if (e.button === 0) { self.mouse.down = true; self.mouse.clicked = true; }
      if (e.button === 2) { self.mouse.rdown = true; self.mouse.rclicked = true; }
    });

    window.addEventListener('mouseup', function (e) {
      if (e.button === 0) self.mouse.down = false;
      if (e.button === 2) self.mouse.rdown = false;
    });

    window.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    window.addEventListener('wheel', function (e) {
      self.wheel += e.deltaY;
    }, { passive: true });

    window.addEventListener('blur', function () {
      self.down = {};
      self.mouse.down = false;
      self.mouse.rdown = false;
    });
  },

  /* converte o mouse para o espaço lógico 480x270 */
  sync: function () {
    this.mouse.x = (this.mouse.cx - Render.ox) / Render.scale;
    this.mouse.y = (this.mouse.cy - Render.oy) / Render.scale;
  },

  endFrame: function () {
    this.pressed = {};
    this.touch.pressed = {};
    this.mouse.clicked = false;
    this.mouse.rclicked = false;
    this.wheel = 0;
  },

  key: function (code) { return !!(this.down[code] || this.touch.down[code]); },
  hit: function (code) { return !!(this.pressed[code] || this.touch.pressed[code]); },

  any: function (codes) {
    for (var i = 0; i < codes.length; i++) if (this.key(codes[i])) return true;
    return false;
  },
  anyHit: function (codes) {
    for (var i = 0; i < codes.length; i++) if (this.hit(codes[i])) return true;
    return false;
  }
};

/* ---------- desenho ---------- */

function fillRect(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }

function strokeRect(g, x, y, w, h, c, lw) {
  g.strokeStyle = c; g.lineWidth = lw || 1;
  g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

function fillCircle(g, x, y, r, c) {
  g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
}

function fillEllipse(g, x, y, rx, ry, c) {
  g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill();
}

function line(g, x1, y1, x2, y2, c, lw) {
  g.strokeStyle = c; g.lineWidth = lw || 1;
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
}

function drawShadow(g, x, y, rx, ry, alpha) {
  g.globalAlpha = alpha === undefined ? 0.32 : alpha;
  fillEllipse(g, x, y, rx, ry, '#000000');
  g.globalAlpha = 1;
}

/* texto com fonte monoespaçada */
function setFont(g, px, bold) {
  g.font = (bold ? 'bold ' : '') + px + 'px Consolas, "Courier New", monospace';
}

function text(g, str, x, y, px, color, align, bold) {
  setFont(g, px, bold);
  g.fillStyle = color;
  g.textAlign = align || 'left';
  g.textBaseline = 'alphabetic';
  g.fillText(str, x, y);
  g.textAlign = 'left';
}

function textShadow(g, str, x, y, px, color, align, bold) {
  setFont(g, px, bold);
  g.textAlign = align || 'left';
  g.textBaseline = 'alphabetic';
  g.fillStyle = 'rgba(0,0,0,0.72)';
  g.fillText(str, x + 1, y + 1);
  g.fillStyle = color;
  g.fillText(str, x, y);
  g.textAlign = 'left';
}

function wrapLines(g, str, maxW, px) {
  setFont(g, px, false);
  var words = str.split(' ');
  var lines = [], cur = '';
  for (var i = 0; i < words.length; i++) {
    var test = cur ? cur + ' ' + words[i] : words[i];
    if (g.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = words[i];
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}
