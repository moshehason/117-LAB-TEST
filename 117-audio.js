/* 117 AUDIO — fully autonomous random mix
   Free sources only:
   - Web Speech (cryptic 117 wisdom)
   - Wikimedia real spoken samples
*/
(() => {
  const path = (location.pathname.split('/').pop() || '').toLowerCase();
  if (['117-pig-runner.html', '117-pig-signal.html', '117-pong.html'].includes(path)) return;

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
    "One one seven was here before the building.",
    "It does not knock. It is already inside.",
    "The first time you saw it, you looked away.",
    "One one seven does not arrive. It was waiting.",
    "Some numbers measure. This one observes.",
    "You can change the clocks. You cannot change this.",
    "One one seven is the only honest thing in the room.",
    "It has no opinion. It only continues.",
    "The number does not care if you believe it.",
    "One one seven is what remains when the story ends.",
    "It has been counted more times than it has been understood."
  ];

  const REAL = [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/40/LL-Q33890_%28nso%29-Mohau-117.wav/LL-Q33890_%28nso%29-Mohau-117.wav.mp3', vol: 0.15, dur: 3.5 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3a/En-us-hello.ogg/En-us-hello.ogg.mp3', vol: 0.12, dur: 1.5 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8a/En-us-yes.ogg/En-us-yes.ogg.mp3', vol: 0.13, dur: 1.2 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/4c/En-us-no.ogg/En-us-no.ogg.mp3', vol: 0.12, dur: 1.1 },
    { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent('Come here, my child.ogg'), vol: 0.10, dur: 2.8 },
    { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent('Pig grunt - Erdie.ogg'), vol: 0.07, dur: 2.0 }
  ];

  let unlocked = false;
  let lastPlay = 0;
  let busy = false;
  let currentAudio = null;

  function getVoice() {
    const voices = speechSynthesis.getVoices();
    const preferred = voices.filter(v =>
      /en(-|_)?(us|gb|uk|au)?/i.test(v.lang) &&
      (/daniel|alex|fred|samuel|google uk|microsoft|premium|neural|siri|david|james/i.test(v.name) || v.default)
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
    utter.rate = 0.75 + Math.random() * 0.28;
    utter.pitch = 0.6 + Math.random() * 0.45;
    utter.volume = 0.87;
    busy = true;
    utter.onend = utter.onerror = () => { busy = false; };
    speechSynthesis.speak(utter);
  }

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

  function trigger() {
    const now = performance.now();
    if (now - lastPlay < 1300 || busy) return;
    lastPlay = now;
    // 75% wisdom, 25% real samples — fully random
    if (Math.random() < 0.75) speakWisdom();
    else playReal();
  }

  function unlock() {
    unlocked = true;
    speechSynthesis.getVoices();
    trigger();
  }

  ['pointerup', 'touchend', 'click'].forEach(ev => {
    addEventListener(ev, () => { if (!unlocked) unlock(); }, { once: true, passive: true });
  });

  addEventListener('pointerdown', () => { if (unlocked) trigger(); }, { passive: true });

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }
})();
