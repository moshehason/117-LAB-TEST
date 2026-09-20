/* 117 REAL AUDIO RADIO — real recordings only, no synthesis/TTS.
   Mix per event: 70% spoken 117 / 20% real playful-animal sound / 10% odd real speech.
   Every event <=5s with fade-in/out. Starts after first user gesture (iOS). */
(()=>{const p=location.pathname.split('/').pop()||'';
if(['117-pig-runner.html','117-pig-signal.html','117-pong.html'].includes(p))return;
const R='https://commons.wikimedia.org/wiki/Special:Redirect/file/';
const U={
  // Real human pronunciation of 117 (Northern Sotho), Wikimedia/Wikidata pronunciation audio.
  n117:'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/40/LL-Q33890_%28nso%29-Mohau-117.wav/LL-Q33890_%28nso%29-Mohau-117.wav.mp3',
  pig:R+encodeURIComponent('Pig grunt - Erdie.ogg'),
  wind:R+encodeURIComponent('Windchimes.ogg'),
  bells:R+encodeURIComponent('Soothing jingling little bells ambience.ogg'),
  pottery:R+encodeURIComponent('Chiming pottery.ogg'),
  odd:R+encodeURIComponent('Come here, my child.ogg')
};
let unlocked=false,timer=null,last=null;
function fadePlay(url,vol=0.10,max=4.7){
 const a=new Audio(url);last=a;a.preload='auto';a.volume=0;
 const stopAt=Math.min(max,4.7),step=50,fade=.65;
 a.play().then(()=>{
   let t0=performance.now();
   const iv=setInterval(()=>{
     const t=(performance.now()-t0)/1000;
     if(t<fade)a.volume=vol*(t/fade);
     else if(t>stopAt-fade)a.volume=Math.max(0,vol*((stopAt-t)/fade));
     else a.volume=vol;
     if(t>=stopAt){clearInterval(iv);a.pause();a.currentTime=0}
   },step);
 }).catch(()=>{});
}
function event(){
 const r=Math.random();
 if(r<.70) fadePlay(U.n117,.115,3.8);
 else if(r<.90){
   const q=Math.random();
   fadePlay(q<.34?U.pig:q<.67?U.wind:q<.84?U.bells:U.pottery,q<.34?.07:.055,4.4);
 } else fadePlay(U.odd,.085,3.2);
 timer=setTimeout(event,9000+Math.random()*13000);
}
function start(){if(unlocked)return;unlocked=true;setTimeout(event,700+Math.random()*1200)}
['pointerup','touchend','click'].forEach(e=>addEventListener(e,start,{once:true,passive:true}));
})();