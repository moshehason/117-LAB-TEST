/* 117 REAL AUDIO
   Real spoken voices + short phrases.
   Triggered on first interaction, then on every logo / canvas click.
*/
(() => {
  const path = (location.pathname.split('/').pop() || '').toLowerCase();
  // Skip pure game pages that have their own audio
  if (['117-pig-runner.html', '117-pig-signal.html', '117-pong.html'].includes(path)) return;

  // Real audio sources (spoken human voice + short public phrases)
  const SOURCES = [
    // Spoken "117"
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/40/LL-Q33890_%28nso%29-Mohau-117.wav/LL-Q33890_%28nso%29-Mohau-117.wav.mp3',
      vol: 0.14,
      dur: 3.4
    },
    // Short real spoken fragments (public domain / commons)
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3a/En-us-hello.ogg/En-us-hello.ogg.mp3',
      vol: 0.11,
      dur: 1.6
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8a/En-us-yes.ogg/En-us-yes.ogg.mp3',
      vol: 0.12,
      dur: 1.2
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/4c/En-us-no.ogg/En-us-no.ogg.mp3',
      vol: 0.12,
      dur: 1.1
    },
    // Pig (keeps the weird personality of the lab)
    {
      url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent('Pig grunt - Erdie.ogg'),
      vol: 0.07,
      dur: 2.1
    },
    // Odd real speech
    {
      url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent('Come here, my child.ogg'),
      vol: 0.09,
      dur: 2.8
    }
  ];

  let unlocked = false;
  let lastPlay = 0;
  let current = null;

  function playRandom() {
    const now = performance.now();
    if (now - lastPlay < 900) return; // debounce
    lastPlay = now;

    // Stop previous if still playing
    if (current) {
      try { current.pause(); current.currentTime = 0; } catch(e) {}
    }

    const pick = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    const a = new Audio(pick.url);
    a.volume = 0;
    a.preload = 'auto';
    current = a;

    a.play().then(() => {
      const start = performance.now();
      const fade = 0.35;
      const iv = setInterval(() => {
        const t = (performance.now() - start) / 1000;
        if (t < fade) {
          a.volume = pick.vol * (t / fade);
        } else if (t > pick.dur - fade) {
          a.volume = Math.max(0, pick.vol * (pick.dur - t) / fade);
        } else {
          a.volume = pick.vol;
        }
        if (t >= pick.dur) {
          clearInterval(iv);
          a.pause();
          a.currentTime = 0;
        }
      }, 40);
    }).catch(() => {});
  }

  function unlockAndPlay() {
    unlocked = true;
    playRandom();
  }

  // First interaction unlocks audio context (required by browsers)
  ['pointerup', 'touchend', 'click'].forEach(ev => {
    addEventListener(ev, () => {
      if (!unlocked) unlockAndPlay();
    }, { once: true, passive: true });
  });

  // Every subsequent click / tap on the page (especially the logo/canvas) plays a new phrase
  addEventListener('pointerdown', (e) => {
    if (!unlocked) return;
    // Prefer playing when user interacts with the main visual area
    playRandom();
  }, { passive: true });

})();
