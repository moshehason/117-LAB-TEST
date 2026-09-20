(()=>{const p=location.pathname.split('/').pop()||'',cfg={
"117-time-cut.html":[46,.018,"sine"],"117-liquid-drift.html":[62,.014,"sine"],"117-chronosculpt.html":[38,.014,"triangle"],
"117-black-time.html":[31,.012,"sawtooth"],"117-tvtv.html":[92,.010,"square"],"117-meaning.html":[73,.012,"sine"],
"117-museum-signal.html":[84,.010,"triangle"],"117-clean-chaos.html":[48,.009,"sawtooth"],"117-liquid-glass.html":[55,.014,"sine"],
"117-prism-orbit.html":[110,.012,"sine"],"117-mercury-bloom.html":[44,.015,"triangle"],"117-ribbon-cut.html":[125,.008,"square"],
"117-ghost-type.html":[34,.012,"sine"],"117-organic-ink.html":[57,.012,"triangle"],"117-metal-cube.html":[41,.015,"sawtooth"],
"117-pig-runner.html":[52,.007,"sine"]
}[p];if(!cfg||p==="117-pig-signal.html"||p==="117-pong.html")return;
let ac,master,o1,o2,lfo,spoken=false;
function start(){
 if(ac)return;
 const A=window.AudioContext||window.webkitAudioContext;if(!A)return;
 ac=new A();master=ac.createGain();master.gain.value=cfg[1];master.connect(ac.destination);
 const f=ac.createBiquadFilter();f.type="lowpass";f.frequency.value=p==="117-tvtv.html"?1200:420;f.Q.value=.5;f.connect(master);
 o1=ac.createOscillator();o2=ac.createOscillator();o1.type=cfg[2];o2.type="sine";
 o1.frequency.value=cfg[0];o2.frequency.value=cfg[0]*1.503;
 const g1=ac.createGain(),g2=ac.createGain();g1.gain.value=.65;g2.gain.value=.18;o1.connect(g1).connect(f);o2.connect(g2).connect(f);
 lfo=ac.createOscillator();const lg=ac.createGain();lfo.frequency.value=.07;lg.gain.value=cfg[0]*.025;lfo.connect(lg).connect(o1.frequency);
 o1.start();o2.start();lfo.start();
 if(p==="117-pig-runner.html"&&!spoken){spoken=true;whisper()}
}
function whisper(){
 if(!("speechSynthesis" in window))return;
 const u=new SpeechSynthesisUtterance("hey... hey... come here");
 u.volume=.16;u.rate=.58;u.pitch=.62;
 const vs=speechSynthesis.getVoices();u.voice=vs.find(v=>/en[-_](US|GB)/i.test(v.lang)&&/male|daniel|aaron|fred|alex/i.test(v.name))||vs.find(v=>/^en/i.test(v.lang))||null;
 speechSynthesis.cancel();speechSynthesis.speak(u);
}
addEventListener("pointerdown",start,{once:true,passive:true});addEventListener("touchstart",start,{once:true,passive:true});addEventListener("keydown",start,{once:true});
})();