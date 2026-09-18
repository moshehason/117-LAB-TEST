const c=document.querySelector('#c'),g=c.getContext('2d');let W,H,D,t=0,p={x:.5,y:.5,down:false},imp=0;
const base=document.createElement('canvas'),bg=base.getContext('2d');
function resize(){D=Math.min(devicePixelRatio||1,2);W=c.width=base.width=innerWidth*D;H=c.height=base.height=innerHeight*D;makeBase()}
function makeBase(){bg.clearRect(0,0,W,H);let fs=Math.min(W*.55,H*.34);bg.font='900 '+fs+'px Arial Black,Arial';bg.textAlign='center';bg.textBaseline='middle';let gr=bg.createLinearGradient(W*.2,H*.35,W*.8,H*.65);gr.addColorStop(0,'#ffd5cc');gr.addColorStop(.45,'#e9a69a');gr.addColorStop(1,'#c97e75');bg.fillStyle=gr;bg.shadowColor='rgba(95,42,35,.20)';bg.shadowBlur=16*D;bg.shadowOffsetY=8*D;bg.fillText('117',W*.5,H*.49);bg.shadowColor='transparent'}
function pos(e){let q=e.touches?.[0]||e;p.x=q.clientX/innerWidth;p.y=q.clientY/innerHeight}
c.onpointerdown=e=>{pos(e);p.down=true;imp=1;c.setPointerCapture?.(e.pointerId)};c.onpointermove=e=>{if(p.down)pos(e)};c.onpointerup=c.onpointercancel=()=>p.down=false;
c.addEventListener('touchstart',e=>{pos(e);p.down=true;imp=1},{passive:true});c.addEventListener('touchmove',e=>{pos(e);imp=1},{passive:true});c.addEventListener('touchend',()=>p.down=false,{passive:true});
function frame(){requestAnimationFrame(frame);t+=.025;imp*=p.down?.995:.94;g.fillStyle='#fff';g.fillRect(0,0,W,H);
const slices=34,sy=H*.30,sh=H*.40/slices,cx=p.x*W,cy=p.y*H;
for(let i=0;i<slices;i++){let y=sy+i*sh,mid=y+sh*.5,dy=(mid-cy)/(150*D),fall=Math.exp(-dy*dy*1.8),breath=Math.sin(t+i*.38)*2.2*D;
let shove=(p.down?1:imp)*fall*42*D;let dir=(cx<W*.5?1:-1);let dx=breath+dir*shove;
let squash=(p.down?1:imp)*fall*.20;g.save();g.translate(dx,0);g.scale(1+squash,1);g.drawImage(base,0,y,W,sh+1,0,y,W,sh+1);g.restore()}
if(p.down||imp>.05){let r=(52+imp*28)*D,gr=g.createRadialGradient(cx-r*.2,cy-r*.25,2,cx,cy,r);gr.addColorStop(0,'rgba(255,255,255,.24)');gr.addColorStop(.55,'rgba(190,102,92,.10)');gr.addColorStop(1,'rgba(110,48,42,0)');g.fillStyle=gr;g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.fill()}}
addEventListener('resize',resize);resize();frame();