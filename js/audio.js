/* =========================================================
   THAYLA — áudio procedural (WebAudio, sem arquivos)
   ========================================================= */

var Sfx = (function () {
  var ac = null, master = null, rainGain = null, rainFilter = null;
  var droneGain = null, ready = false, muted = false;
  var noiseBuf = null;

  function init() {
    if (ready) {
      if (ac && ac.state === 'suspended') { try { ac.resume(); } catch (e) {} }
      return;
    }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { ac = new AC(); } catch (e) { ac = null; return; }

    master = ac.createGain();
    master.gain.value = 0.5;
    master.connect(ac.destination);

    var len = Math.floor(ac.sampleRate * 2);
    noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    /* chuva / chiado ambiente */
    var src = ac.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;

    rainFilter = ac.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.value = 1400;
    rainFilter.Q.value = 0.5;

    rainGain = ac.createGain();
    rainGain.gain.value = 0.0;

    src.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(master);
    src.start();

    /* drone grave */
    droneGain = ac.createGain();
    droneGain.gain.value = 0.035;
    droneGain.connect(master);

    var o1 = ac.createOscillator(); o1.type = 'sine'; o1.frequency.value = 48;
    var o2 = ac.createOscillator(); o2.type = 'sine'; o2.frequency.value = 72.5;
    var o3 = ac.createOscillator(); o3.type = 'triangle'; o3.frequency.value = 36;
    var g3 = ac.createGain(); g3.gain.value = 0.3;
    o1.connect(droneGain); o2.connect(droneGain); o3.connect(g3); g3.connect(droneGain);
    o1.start(); o2.start(); o3.start();

    ready = true;
  }

  function now() { return ac ? ac.currentTime : 0; }

  function tone(freq, dur, type, vol, slideTo) {
    if (!ready || muted) return;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, now());
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now() + dur);
    g.gain.setValueAtTime(0.0001, now());
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), now() + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now() + dur);
    o.connect(g); g.connect(master);
    o.start(); o.stop(now() + dur + 0.02);
  }

  function noise(dur, freq, q, vol, type) {
    if (!ready || muted) return;
    var s = ac.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    var f = ac.createBiquadFilter();
    f.type = type || 'lowpass';
    f.frequency.value = freq;
    f.Q.value = q || 1;
    var g = ac.createGain();
    g.gain.setValueAtTime(vol, now());
    g.gain.exponentialRampToValueAtTime(0.0001, now() + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(); s.stop(now() + dur + 0.02);
  }

  return {
    init: init,
    setMuted: function (m) { muted = m; if (master) master.gain.value = m ? 0 : 0.5; },
    isMuted: function () { return muted; },
    toggleMute: function () { this.setMuted(!muted); return muted; },

    setRain: function (amount) {
      if (!ready) return;
      rainGain.gain.linearRampToValueAtTime(amount * 0.05, now() + 0.8);
    },

    shoot: function () {
      noise(0.09, 2600, 0.8, 0.32);
      tone(150, 0.09, 'square', 0.14, 60);
    },
    shotgun: function () {
      noise(0.26, 1200, 0.6, 0.5);
      tone(90, 0.22, 'sawtooth', 0.2, 40);
    },
    dry: function () { noise(0.03, 3000, 1, 0.12, 'highpass'); },
    knife: function () { noise(0.11, 4200, 1.2, 0.16, 'highpass'); },
    hit: function () { noise(0.05, 900, 1, 0.22); },
    splat: function () { noise(0.16, 420, 0.7, 0.26); tone(90, 0.14, 'sine', 0.1, 40); },
    hurt: function () { tone(240, 0.22, 'sawtooth', 0.16, 90); noise(0.12, 700, 1, 0.2); },
    pickup: function () { tone(620, 0.07, 'square', 0.09); tone(880, 0.09, 'square', 0.07); },
    key: function () { tone(523, 0.08, 'triangle', 0.1); tone(784, 0.12, 'triangle', 0.09); },
    door: function () { noise(0.3, 320, 0.8, 0.2); tone(70, 0.3, 'sine', 0.1, 45); },
    locked: function () { tone(140, 0.08, 'square', 0.1); tone(110, 0.12, 'square', 0.1); },
    ui: function () { tone(700, 0.04, 'square', 0.05); },
    type: function () { noise(0.015, 2400, 1, 0.05, 'highpass'); },
    growl: function () {
      tone(rand(58, 84), rand(0.35, 0.8), 'sawtooth', 0.07, rand(40, 55));
      noise(0.4, rand(300, 700), 0.8, 0.05);
    },
    heal: function () { tone(440, 0.1, 'sine', 0.1); tone(554, 0.1, 'sine', 0.1); tone(659, 0.2, 'sine', 0.1); },
    acid: function () { noise(0.18, 900, 1.4, 0.16, 'bandpass'); },
    roar: function () { tone(110, 1.1, 'sawtooth', 0.2, 38); noise(0.8, 500, 0.6, 0.2); },
    alarm: function () { tone(880, 0.25, 'square', 0.07, 660); },
    inject: function () { tone(180, 0.5, 'sine', 0.12, 420); noise(0.3, 1500, 1, 0.08); },
    save: function () { tone(392, 0.12, 'triangle', 0.09); tone(523, 0.12, 'triangle', 0.09); tone(784, 0.4, 'triangle', 0.09); },
    ending: function () {
      [261.6, 329.6, 392, 523.2].forEach(function (f, i) {
        setTimeout(function () { tone(f, 2.2, 'sine', 0.07); }, i * 260);
      });
    }
  };
})();
