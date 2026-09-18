const c=document.querySelector('#c'),x=c.getContext('2d'),src=document.createElement('canvas'),s=src.getContext('2d');let W,H,D,t=0,mode=0,p={x:.5,y:.5,d:0,energy:0};
function resize(){D=Math.min(devicePixelRatio||1,2);W=c.width=src.width=innerWidth*D;H=c.height=src.height=innerHeight*D;paint()}
function paint(){s.clearRect(0,0,W,H);let fs=Math.min(W*.58,H*.36),gr=s.createLinearGradient(W*.2,H*.35,W*.8,H*.65);gr.addColorStop(0,'#ffd9d1');gr.addColorStop(.42,'#e9a99d');gr.addColorStop(1,'#bd746c');s.font='900 '+fs+'px Arial Black,Arial';s.textAlign='center';s.textBaseline='middle';s.fillStyle=gr;s.shadowColor='#73372f44';s.shadowBlur=18*D;s.shadowOffsetY=9*D;s.fillText('117',W/2,H*.48)}
function pt(e){let q=e.touches?.[0]||e;p.x=q.clientX/innerWidth;p.y=q.clientY/innerHeight;p.d=1;p.energy=1}c.onpointerdown=pt;c.onpointermove=e=>{if(e.buttons)pt(e)};c.onpointerup=()=>p.d=0;c.addEventListener('touchstart',pt,{passive:true});c.addEventListener('touchmove',pt,{passive:true});c.addEventListener('touchend',()=>p.d=0,{passive:true});
document.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{mode=i;document.querySelectorAll('button').forEach(z=>z.classList.remove('on'));b.classList.add('on')});document.querySelector('button').classList.add('on');
function frame(){requestAnimationFrame(frame);t+=.035;x.fillStyle='#fff';x.fillRect(0,0,W,H);p.energy*=p.d?.997:.94;let N=72,top=H*.28,hh=H*.40/N,cx=p.x*W,cy=p.y*H;
for(let i=0;i<N;i++){let y=top+i*hh,m=y+hh/2,yn=(m-top)/(H*.40),dy=(m-cy)/(140*D),f=Math.exp(-dy*dy*1.7),dx=0,sc=1;
if(mode===0){let e=p.energy*f;dx=Math.sin(t+i*.25)*3*D+e*(Math.sin(i*.77+t*3)*34*D+(cx-W/2)*.22);sc=1+e*(.10+.38*Math.abs(Math.sin(i*.43+t*2.1)))}
if(mode===1){let e=p.energy*f;dx=Math.sin(t*2+i*.32)*14*D+e*(Math.sin(i*.91+t*5)*65*D+Math.sin(i*.17-t*2)*28*D);sc=1+e*.25*Math.sin(i*.31+t*3)}
if(mode===2){let e=p.energy*f;dx=Math.sin(t+i*.18)*5*D+e*Math.sin(i*.57+t*2.8)*48*D;sc=1+Math.max(0,yn-.30)*(.12+.18*Math.sin(t*1.2+i*.11))+e*.42*Math.abs(Math.sin(i*.23+t))}
if(mode===3){let e=p.energy*f,side=cx<W/2?-1:1;dx=Math.sin(t*.8+i*.16)*5*D+e*(side*95*D+Math.sin(i*.83+t*4)*55*D);sc=1+e*(.22+.38*Math.abs(Math.cos(i*.37+t*2)))}
x.save();x.translate(dx,0);x.scale(sc,1);x.drawImage(src,0,y,W,hh+1,0,y,W,hh+1);x.restore()}p.d*=.995}
addEventListener('resize',resize);resize();frame();