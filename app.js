const c=document.querySelector('#stage'),g=c.getContext('2d'),nameEl=document.querySelector('#name');let W,H,D=Math.min(devicePixelRatio||1,2),pts=[],mode='signal',mx=.5,my=.5,tx=.5,ty=.5,t=0,kick=0;
const names={signal:'LIVING SIGNAL',clay:'MOLTEN CLAY',dna:'GENETIC 117',xerox:'XEROX MUTANT'};
function build(){W=c.width=innerWidth*D;H=c.height=innerHeight*D;const o=document.createElement('canvas'),q=o.getContext('2d');o.width=W;o.height=H;const fs=Math.min(W*.46,H*.55);q.font='900 '+fs+'px Arial';q.textAlign='center';q.textBaseline='middle';q.fillStyle='#fff';q.fillText('117',W/2,H/2);const im=q.getImageData(0,0,W,H).data,s=Math.max(6,Math.floor(7*D));pts=[];for(let y=0;y<H;y+=s)for(let x=0;x<W;x+=s)if(im[(y*W+x)*4+3]>90&&Math.random()<.48)pts.push({ox:x,oy:y,p:Math.random()*6.283,r:(.6+Math.random()*1.8)*D,z:Math.random()})}
function setMode(m){mode=m;nameEl.textContent=names[m];document.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.mode===m));kick=1}
document.querySelectorAll('button').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
function point(e){const p=e.touches?e.touches[0]:e;tx=p.clientX/innerWidth;ty=p.clientY/innerHeight}addEventListener('mousemove',point);addEventListener('touchmove',point,{passive:true});addEventListener('touchstart',e=>{point(e);kick=1},{passive:true});addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')kick=1});
function loop(){requestAnimationFrame(loop);t+=.014;kick*=.94;mx+=(tx-mx)*.04;my+=(ty-my)*.04;g.fillStyle=mode==='clay'?'#d9d4ca':'#090909';g.fillRect(0,0,W,H);const px=mx*W,py=my*H;
if(mode==='dna'){g.globalAlpha=.22;g.strokeStyle='#fff';g.lineWidth=D;for(let j=0;j<2;j++){g.beginPath();for(let y=H*.18;y<H*.82;y+=5*D){let x=W/2+Math.sin(y*.018/D+t*2+j*Math.PI)*W*.12;y===H*.18?g.moveTo(x,y):g.lineTo(x,y)}g.stroke()}g.globalAlpha=1}
for(const p of pts){let dx=p.ox-px,dy=p.oy-py,d=Math.hypot(dx,dy)+1,f=Math.max(0,1-d/(230*D)),x=p.ox,y=p.oy,r=p.r;
if(mode==='signal'){x+=(dx/d)*f*42*D+Math.sin(p.p+t*3)*kick*90*D;y+=(dy/d)*f*42*D+Math.cos(p.p+t*2)*kick*60*D}
if(mode==='clay'){let sag=(.5+.5*Math.sin(t*.7+p.p))*18*D;x+=Math.sin(p.oy*.012+t+p.p)*8*D+y/H*10*D;y+=sag+kick*Math.sin(p.p)*45*D;r*=1.6+.55*Math.sin(t+p.p)}
if(mode==='dna'){let helix=Math.sin(p.oy*.025/D+t*2+p.p)*kick*W*.24;x+=helix+Math.sin(t+p.p)*3*D;y+=Math.cos(t*1.4+p.p)*3*D}
if(mode==='xerox'){let cut=Math.sin(p.oy*.06/D+t*5)>0?1:-1;x+=cut*(6+kick*45)*D+Math.sin(p.p+t*9)*2*D;y+=Math.round(Math.sin(t*7+p.p)*2)*D;r*=Math.random()>.985?4:1}
g.fillStyle=mode==='clay'?'#171717':'#eee';g.beginPath();g.arc(x,y,Math.max(.5,r),0,Math.PI*2);g.fill()}
if(mode==='xerox'){g.globalCompositeOperation='difference';g.fillStyle='#fff';for(let i=0;i<4;i++){let y=(Math.sin(t*(1+i*.13)+i)*.5+.5)*H;g.fillRect(0,y,W,(1+i%2)*D)}g.globalCompositeOperation='source-over'}}
addEventListener('resize',build);build();loop();