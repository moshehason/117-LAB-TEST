/* 117 — real recorded playful sound layer. No synthesis, no TTS.
   Public-domain / CC0 recordings from Wikimedia Commons. Starts after touch on iOS. */
(()=>{const p=location.pathname.split('/').pop()||'',C='https://commons.wikimedia.org/wiki/Special:Redirect/file/';
const F={
 chime:'OER 5200 Chime Door open and close.ogg',
 wind:'Windchimes.ogg',
 bells:'Soothing jingling little bells ambience.ogg',
 pottery:'Chiming pottery.ogg',
 agogo:'Agogo.ogg',
 airplane:'Airplane Chime Sound Effect.ogg'
};
const M={
 '117-time-cut.html':['wind',.055,1],
 '117-liquid-drift.html':['bells',.040,.96],
 '117-chronosculpt.html':['pottery',.045,.94],
 '117-black-time.html':['chime',.032,.90],
 '117-tvtv.html':['airplane',.045,1.03],
 '117-meaning.html':['bells',.045,1],
 '117-museum-signal.html':['chime',.040,.98],
 '117-clean-chaos.html':['agogo',.025,.94],
 '117-liquid-glass.html':['wind',.040,.92],
 '117-prism-orbit.html':['bells',.050,1.04],
 '117-mercury-bloom.html':['pottery',.035,.90],
 '117-ribbon-cut.html':['chime',.038,1.06],
 '117-ghost-type.html':['wind',.032,.88],
 '117-organic-ink.html':['bells',.040,.95],
 '117-metal-cube.html':['pottery',.036,.91],
 '117-maze.html':['chime',.038,1],
 '117-snake.html':['agogo',.025,1.03]
};
const fallback=['bells',.035,.97];const m=M[p]||fallback;if(p==='117-pig-runner.html'||p==='117-pig-signal.html'||p==='117-pong.html')return;let started=false,a;
function startAgain(){started=false;start()}
function start(){if(started)return;started=true;a=new Audio(C+encodeURIComponent(F[m[0]]));a.preload='auto';a.volume=0;a.loop=false;a.playbackRate=m[2];a.play().then(()=>{
 const target=m[1],up=setInterval(()=>{a.volume=Math.min(target,a.volume+.002);if(a.volume>=target)clearInterval(up)},80);
 const fade=()=>{clearInterval(up);const dn=setInterval(()=>{a.volume=Math.max(0,a.volume-.002);if(a.volume<=.002){clearInterval(dn);a.pause();setTimeout(()=>{a.currentTime=0;startAgain()},3500+Math.random()*6000)}},80)};
 setTimeout(fade,7000+Math.random()*5000);
}).catch(()=>{started=false})}
['pointerup','touchend','click'].forEach(e=>addEventListener(e,start,{once:true,passive:true}));
})();