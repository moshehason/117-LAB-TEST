/* 117 STRANGE WISDOM
   Cryptic, weird, oracle-like spoken phrases about the number 117.
   Uses Web Speech API – real browser voices, no external files needed.
*/
(() => {
  const path = (location.pathname.split('/').pop() || '').toLowerCase();
  if (['117-pig-runner.html', '117-pig-signal.html', '117-pong.html'].includes(path)) return;

  // Strange wisdom / cryptic phrases related to 117
  const PHRASES = [
    "One one seven. The number that finds you.",
    "Some numbers are chosen. This one chooses back.",
    "One hundred and seventeen times the door was opened.",
    "It appears on clocks. On receipts. On the wrong page.",
    "Ignore it once. It returns twice. Ignore it twice... it waits.",
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
    "One one seven is the last thing the room says before it goes quiet."
  ];

  let unlocked = false;
  let lastSpeak = 0;
  let speaking = false;

  function getVoice() {
    const voices = speechSynthesis.getVoices();
    // Prefer deeper / more dramatic English voices
    const preferred = voices.filter(v =>
      /en(-|_)?(us|gb|uk|au)?/i.test(v.lang) &&
      (/daniel|alex|fred|samuel|google uk|microsoft|premium|neural/i.test(v.name) || v.default)
    );
    if (preferred.length) return preferred[Math.floor(Math.random() * preferred.length)];
    // Fallback any English
    const eng = voices.filter(v => /en/i.test(v.lang));
    return eng[Math.floor(Math.random() * eng.length)] || voices[0];
  }

  function speak() {
    const now = performance.now();
    if (now - lastSpeak < 1600 || speaking) return;
    lastSpeak = now;

    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech so new phrase starts clean
    speechSynthesis.cancel();

    const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    const utter = new SpeechSynthesisUtterance(phrase);

    const voice = getVoice();
    if (voice) utter.voice = voice;

    // Slightly slow, lower pitch – more oracle / strange wisdom feel
    utter.rate = 0.82 + Math.random() * 0.18;
    utter.pitch = 0.7 + Math.random() * 0.35;
    utter.volume = 0.85;

    speaking = true;
    utter.onend = utter.onerror = () => { speaking = false; };

    speechSynthesis.speak(utter);
  }

  function unlock() {
    unlocked = true;
    // Warm up voices list (needed on some browsers)
    speechSynthesis.getVoices();
    speak();
  }

  // First interaction unlocks
  ['pointerup', 'touchend', 'click'].forEach(ev => {
    addEventListener(ev, () => {
      if (!unlocked) unlock();
    }, { once: true, passive: true });
  });

  // Every click / tap after unlock speaks a new strange phrase
  addEventListener('pointerdown', () => {
    if (unlocked) speak();
  }, { passive: true });

  // Some browsers load voices asynchronously
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }
})();
