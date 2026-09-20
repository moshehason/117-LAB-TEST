/* 117 REAL FIELD-RECORDING AUDIO — no synthesis/TTS.
   Starts only after first user gesture for iOS Safari.
   Sources are public-domain/CC recordings hosted by Wikimedia Commons. */
(()=>{
const p=location.pathname.split('/').pop()||'';
const C='https://commons.wikimedia.org/wiki/Special:Redirect/file/';
const files={
 crt:'CRT monitor turns on.ogg',
 hum:'Shredder hum.ogg',
 water:'Water sloshing in a small bottle.ogg',
 flow:'Flowing-water-100019.ogg',
 bubbles:'Water bubbles chortling.ogg',
 metal:'Metal drop thump.ogg',
 thud:'Dull thud.ogg',
 rain:'SV100344.ogg',
 heart:'HROgg.ogg',
 click:'Clicker sound.ogg',
 pig:'Pig grunt - Erdie.ogg',
 hey:'En-us-hey.ogg',
 come:'En-us-come.ogg',
 here:'En-us-here.ogg'
};
const map={
 '117-time-cut.html':['crt',.045],
 '117-liquid-drift.html':['water',.038],
 '117-chronosculpt.html':['heart',.032],
 '117-black-time.html':['rain',.030],
 '117-tvtv.html':['crt',.052],
 '117-meaning.html':['flow',.026],
 '117-museum-signal.html':['click',.028],
 '117-clean-chaos.html':['rain',.025],
 '117-liquid-glass.html':['water',.042],
 '117-prism-orbit.html':['flow',.028],
 '117-mercury-bloom.html':['hum',.034],
 '117-ribbon-cut.html':['metal',.030],
 '117-ghost-type.html':['rain',.024],
 '117-organic-ink.html':['bubbles',.028],
 '117-metal-cube.html':['metal',.038],
 '117-pig-runner.html':['rain',.020],
 '117-pig-signal.html':['pig',.075],
 '117-maze.html':['hum',.028],
 '117-snake.html':['click',.030]
};
const cfg=map[p]; if(!cfg)return;
let begun=false,amb;
function mk(key,vol,loop=false,rate=1){
 const a=new Audio(C+encodeURIComponent(files[key]));a.preload='auto';a.volume=vol;a.loop=loop;a.playbackRate=rate;return a;
}
function play(a){const q=a.play();if(q&&q.catch)q.catch(()=>{});}
function runnerVoice(){
 // Every syllable is a real human recording; no TTS and no generated voice.
 const hey=mk('hey',.12),hey2=mk('hey',.105),come=mk('come',.10),here=mk('here',.09);
 hey.playbackRate=.82;hey2.playbackRate=.78;come.playbackRate=.80;here.playbackRate=.80;
 play(hey);setTimeout(()=>play(hey2),650);setTimeout(()=>play(come),1450);setTimeout(()=>play(here),1900);
}
function start(){
 if(begun)return;begun=true;
 if(p==='117-pig-runner.html'){ setTimeout(runnerVoice,500); return; }
 amb=mk(cfg[0],cfg[1],true,p==='117-mercury-bloom.html'?.82:1);
 play(amb);
}
['pointerup','touchend','click'].forEach(e=>addEventListener(e,start,{once:true,passive:true}));
})();