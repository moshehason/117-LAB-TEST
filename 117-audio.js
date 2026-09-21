/* 117 AUDIO MIX
   Hybrid system:
   - Mostly cryptic / strange wisdom about 117 (Web Speech)
   - Sometimes real spoken audio samples
   - Occasional weird texture (pig / odd voice)
*/
(() => {
  const path = (location.pathname.split('/').pop() || '').toLowerCase();
  if (['117-pig-runner.html', '117-pig-signal.html', '117-pong.html'].includes(path)) return;

  // ——— Strange wisdom phrases ———
  const WISDOM = [
    "One one seven. The number that finds you.",
    "Some numbers are chosen. This one chooses back.",
    "It appears on clocks. On receipts. On the wrong page.",
    "Ignore it once. It returns twice.",
    "One one seven is not a name. It is a frequency.",
    "The city counts in different numbers. This one counts you.",
    "When the lights flicker one one seven times, listen.",
    "It was never random. It was never coincidence.",
    "One one seven keeps the score you refuse to see.",
    "The walls remember. The number does not forget.",
    "You can leave the room. The number stays.",
    "One one seven is the space between what was said and what was meant.",
    "It grows quieter the more you notice it.",
    "Some people collect art. This number collects people.",
    "One one seven does not explain itself.",
    "The night has a favorite number. You already know it.",
    "It is not superstition if it keeps being true.",
    "One one seven is the door that opens both ways.",
    "You were looking for meaning. The number was looking for you.",
    "Count slowly. It is already ahead of you.",
    "One one seven is older than the question.",
    "The materials remember the number before the hand does.",
    "It is not a code. It is a presence.",
    "One one seven waits in the static between stations.",
    "When everything else is noise, this number is still clear.",
    "It does not need believers. Only witnesses.",
    "One one seven is the last thing the room says before it goes quiet.",
    "There is a version of you that already answered.",
    "The number is patient. It has time.",
    "One one seven was here before the building."
  ];

  // ——— Real audio samples (stable public sources) ———
  const REAL = [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/40/LL-Q33890_%28nso%29-Mohau-117.wav/LL-Q33890_%28nso%29-Mohau-117.wav.mp3',
      vol: 0.15,
      dur: 3.5
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3a/En-us-hello.ogg/En-us-hello.ogg.mp3',
      vol: 0.12,
      dur: 1.5
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8a/En-us-yes.ogg/En-us-yes.ogg.mp3',
      vol: 0.13,
      dur: 1.2
    },
    {
      url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent('Come here, my child.ogg'),
      vol: 0.10,
      dur: 2.8
    },
    {
      url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent('Pig grunt - Erdie.ogg'),
      vol: 0.07,
      dur: 2.0
    }
  ];

  let unlocked = false;
  let lastPlay = 0;
  let busy = false;
  let currentAudio = null;

  // ——— Web Speech (wisdom) ———
  function getVoice() {
    const voices = speechSynthesis.getVoices();
    const preferred = voices.filter(v =>
      /en(-|_)?(us|gb|uk|au)?/i.test(v.lang) &&
      (/daniel|alex|fred|samuel|google uk|microsoft|premium|neural|siri/i.test(v.name) || v.default)
    );
    if (preferred.length) return preferred[Math.floor(Math.random() * preferred.length)];
    const eng = voices.filter(v => /en/i.test(v.lang));
    return eng[Math.floor(Math.random() * eng.length)] || voices[0];
  }

  function speakWisdom() {
    if (!window.speechSynthesis || busy) return;
    speechSynthesis.cancel();

    const phrase = WISDOM[Math.floor(Math.random() * WISDOM.length)];
    const utter = new SpeechSynthesisUtterance(phrase);
    const voice = getVoice();
    if (voice) utter.voice = voice;

    // Oracle / strange tone
    utter.rate = 0.78 + Math.random() * 0.22;
    utter.pitch = 0.65 + Math.random() * 0.4;
    utter.volume = 0.88;

    busy = true;
    utter.onend = utter.onerror = () => { busy = false; };
    speechSynthesis.speak(utter);
  }

  // ——— Real audio ———
  function playReal() {
    if (busy) return;
    const pick = REAL[Math.floor(Math.random() * REAL.length)];

    if (currentAudio) {
      try { currentAudio.pause(); currentAudio.currentTime = 0; } catch(e) {}
    }

    const a = new Audio(pick.url);
    a.volume = 0;
    a.preload = 'auto';
    currentAudio = a;
    busy = true;

    a.play().then(() => {
      const start = performance.now();
      const fade = 0.3;
      const iv = setInterval(() => {
        const t = (performance.now() - start) / 1000;
        if (t < fade) a.volume = pick.vol * (t / fade);
        else if (t > pick.dur - fade) a.volume = Math.max(0, pick.vol * (pick.dur - t) / fade);
        else a.volume = pick.vol;

        if (t >= pick.dur) {
          clearInterval(iv);
          a.pause();
          busy = false;
        }
      }, 40);
    }).catch(() => { busy = false; });
  }

  // ——— Main trigger ———
  function trigger() {
    const now = performance.now();
    if (now - lastPlay < 1400 || busy) return;
    lastPlay = now;

    // Mix ratios:
    // 70% strange wisdom (speech)
    // 20% real spoken samples
    // 10% weird real (pig / odd)
    const r = Math.random();
    if (r < 0.70) {
      speakWisdom();
    } else {
      playReal();
    }
  }

  function unlock() {
    unlocked = true;
    speechSynthesis.getVoices(); // warm up
    trigger();
  }

  // First interaction
  ['pointerup', 'touchend', 'click'].forEach(ev => {
    addEventListener(ev, () => {
      if (!unlocked) unlock();
    }, { once: true, passive: true });
  });

  // Every later click
  addEventListener('pointerdown', () => {
    if (unlocked) trigger();
  }, { passive: true });

  // Voices load async on some browsers
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }
})();
