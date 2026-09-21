/* 117 AUDIO — mix of English + Hebrew strange wisdom + real samples */
(() => {
  const path = (location.pathname.split('/').pop() || '').toLowerCase();
  if (['117-pig-runner.html', '117-pig-signal.html', '117-pong.html', '117-chaos-catch.html'].includes(path)) return;

  const WISDOM_EN = [
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
    "Count slowly. It is already ahead of you."
  ];

  // Hebrew strange wisdom
  const WISDOM_HE = [
    "מאה שבע עשרה. המספר שמוצא אותך.",
    "יש מספרים שבוחרים. זה בוחר בחזרה.",
    "הוא מופיע על שעונים. על קבלות. בעמוד הלא נכון.",
    "התעלם ממנו פעם אחת. הוא חוזר פעמיים.",
    "מאה שבע עשרה זה לא שם. זו תדר.",
    "העיר סופרת במספרים אחרים. זה סופר אותך.",
    "כשהאורות מהבהבים מאה שבע עשרה פעמים, תקשיב.",
    "זה אף פעם לא היה מקרי. זה אף פעם לא היה צירוף מקרים.",
    "הקירות זוכרים. המספר לא שוכח.",
    "אתה יכול לעזוב את החדר. המספר נשאר.",
    "מאה שבע עשרה הוא המרווח בין מה שנאמר למה שהתכוונו.",
    "הוא נהיה שקט יותר ככל שאתה שם לב אליו.",
    "יש אנשים שאוספים אמנות. המספר הזה אוסף אנשים.",
    "מאה שבע עשרה לא מסביר את עצמו.",
    "ללילה יש מספר אהוב. אתה כבר יודע אותו.",
    "זה לא אמונה טפלה אם זה ממשיך להיות אמת.",
    "מאה שבע עשרה הוא הדלת שנפתחת לשני הכיוונים.",
    "חיפשת משמעות. המספר חיפש אותך.",
    "תספור לאט. הוא כבר לפניך.",
    "מאה שבע עשרה היה כאן לפני הבניין."
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

  function getVoice(lang) {
    const voices = speechSynthesis.getVoices();
    if (lang === 'he') {
      const he = voices.filter(v => /he|iw|hebrew/i.test(v.lang) || /hebrew|עברית/i.test(v.name));
      if (he.length) return he[Math.floor(Math.random() * he.length)];
    }
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

    // 50% Hebrew, 50% English
    const useHe = Math.random() < 0.5;
    const list = useHe ? WISDOM_HE : WISDOM_EN;
    const phrase = list[Math.floor(Math.random() * list.length)];
    const utter = new SpeechSynthesisUtterance(phrase);
    utter.lang = useHe ? 'he-IL' : 'en-US';

    const voice = getVoice(useHe ? 'he' : 'en');
    if (voice) utter.voice = voice;

    utter.rate = 0.78 + Math.random() * 0.22;
    utter.pitch = 0.65 + Math.random() * 0.4;
    utter.volume = 0.88;

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
    if (now - lastPlay < 1400 || busy) return;
    lastPlay = now;
    if (Math.random() < 0.78) speakWisdom();
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
