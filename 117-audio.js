/* 117 REAL AUDIO — NO BELLS / NO CHIMES / NO SYNTH.
70% real spoken 117, 20% real animal, 10% short odd real speech. */
(()=>{const p=location.pathname.split('/').pop()||'';
if(['117-pig-runner.html','117-pig-signal.html','117-pong.html'].includes(p))return;
const R='https://commons.wikimedia.org/wiki/Special:Redirect/file/';
const U={
 n117:'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/40/LL-Q33890_%28nso%29-Mohau-117.wav/LL-Q33890_%28nso%29-Mohau-117.wav.mp3',
 pig:R+encodeURIComponent('Pig grunt - Erdie.ogg'),
 odd:R+encodeURIComponent('Come here, my child.ogg')
};
let on=false,timer;
function play(url,vol=.1,dur=3.5){const a=new Audio(url);a.volume=0;a.preload='auto';a.play().then(()=>{const t0=performance.now(),fade=.55,iv=setInterval(()=>{const t=(performance.now()-t0)/1000;a.volume=t<fade?vol*t/fade:t>dur-fade?Math.max(0,vol*(dur-t)/fade):vol;if(t>=dur){clearInterval(iv);a.pause();a.currentTime=0}},50)}).catch(()=>{})}
function event(){const r=Math.random();if(r<.70)play(U.n117,.12,3.6);else if(r<.90)play(U.pig,.065,2.4);else play(U.odd,.085,3.2);timer=setTimeout(event,9000+Math.random()*13000)}
function start(){if(on)return;on=true;setTimeout(event,500)}
['pointerup','touchend','click'].forEach(e=>addEventListener(e,start,{once:true,passive:true}));
})();