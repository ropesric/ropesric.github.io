document.getElementById('year').textContent=new Date().getFullYear();
// Mobile menu toggle (slide-down under sticky header)
(function(){
  const btn   = document.getElementById('menuToggle');
  const panel = document.getElementById('mobileMenu');
  if(!btn || !panel) return;

  const open = () => {
    panel.hidden = false;      // include in layout
    // force reflow so transition plays
    // eslint-disable-next-line no-unused-expressions
    panel.offsetHeight;
    panel.classList.add('open');
    btn.setAttribute('aria-expanded','true');
  };
  const close = () => {
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    // hide after transition so it leaves tab order
    panel.addEventListener('transitionend', function te(e){
      if(e.propertyName==='max-height'){ panel.hidden = true; panel.removeEventListener('transitionend', te); }
    });
  };

  btn.addEventListener('click', ()=>{
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });

  // ESC to close
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true'){ close(); btn.focus(); }
  });

  // Close on link click
  panel.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', ()=> close());
  });
})();

/* console typing */
const lines=[
  "Initializing AI modules... ✅",
  "Loading Python core... ✅",
  "Connecting cloud services (AWS/GCP)... ✅",
  "Launching microservices... ✅",
  "Ropesric ready. Let's build something great. 🚀"
];
const typed=document.getElementById('typed'); let li=0,ci=0;
function loopType(){
  if(li>=lines.length){ setTimeout(()=>{typed.textContent="";typed.parentElement.scrollTop=0;li=0;ci=0;loopType();},900); return;}
  const line=lines[li];
  if(ci<line.length){ typed.textContent+=line.charAt(ci++); typed.parentElement.scrollTop=typed.parentElement.scrollHeight; setTimeout(loopType,34);}
  else{ typed.textContent+="\n$ "; li++; ci=0; setTimeout(loopType,260);}
}
typed.textContent=""; loopType();

/* game */

// Skip game setup entirely on small screens (matches CSS behavior)
const IS_MOBILE = window.matchMedia && window.matchMedia('(max-width: 720px)').matches;
if (!IS_MOBILE) {
  // --- your existing game code below unchanged ---
  const cvs = document.getElementById('gameCanvas'), ctx = cvs.getContext('2d');
  // ... rest of your game setup & loop ...
}

const cvs=document.getElementById('gameCanvas'), ctx=cvs.getContext('2d');
const W=cvs.width, H=cvs.height;
let state='idle', robot, items, score, best=0, timeLeft, spawnTick, last, keys={}, total=0;

const scoreLbl=document.getElementById('scoreLbl'),
      timeLbl =document.getElementById('timeLbl'),
      bestLbl =document.getElementById('bestLbl');

addEventListener('keydown',e=>{
  if(e.code==='Space'){ e.preventDefault();
    if(state==='running'){ state='paused'; }
    else if(state==='paused'){ state='running'; last=performance.now(); }
  }
  keys[e.key]=true;
});
addEventListener('keyup',e=>{keys[e.key]=false;});

function reset(){
  robot={x:W/2-60,y:H-44,w:120,h:22,s:8};
  items=[]; score=0; timeLeft=45e3; spawnTick=0; last=performance.now(); total=0;
  updateHUD();
}
function updateHUD(){
  scoreLbl.textContent="Score: "+score;
  timeLbl.textContent="⏱ "+Math.max(0,Math.ceil(timeLeft/1000))+"s";
  bestLbl.textContent="⭐ "+best;
}
function rnd(a,b){return Math.random()*(b-a)+a;}
function spawn(){ const good=Math.random()>0.35; items.push({x:rnd(16,W-16), y:-18, vy:rnd(1.2,2.8), good, r:12+Math.random()*6}); total++; }
function step(dt){
  if(keys['ArrowLeft']||keys['a']) robot.x-=robot.s;
  if(keys['ArrowRight']||keys['d']) robot.x+=robot.s;
  robot.x=Math.max(0,Math.min(W-robot.w,robot.x));
  spawnTick+=dt; if(spawnTick>420){spawnTick=0; spawn();}
  for(let i=items.length-1;i>=0;i--){
    const it=items[i]; it.y+=it.vy; if(it.y-it.r>H){ items.splice(i,1); continue; }
    const hitY = it.y+it.r>robot.y && it.y-it.r<robot.y+robot.h;
    const hitX = it.x>robot.x && it.x<robot.x+robot.w;
    if(hitX && hitY){ score += it.good?10:-5; items.splice(i,1); updateHUD(); }
  }
  timeLeft-=dt; if(timeLeft<=0){ state='over'; best=Math.max(best,score); updateHUD(); }
}
/* background (same as before) */
/* Visual background (grid + CPU + stacks + racks + cloud/bucket/lambda + pipes) */
function drawCloud(x,y,w,h){
  ctx.fillStyle='rgba(122,224,255,.18)';
  ctx.beginPath(); ctx.arc(x, y, h*0.35, 0, Math.PI*2);
  ctx.arc(x+w*0.25, y-h*0.15, h*0.45, 0, Math.PI*2);
  ctx.arc(x+w*0.55, y, h*0.35, 0, Math.PI*2); ctx.fill();
}
function drawDB(x,y,w,h){
  ctx.fillStyle='#0f1a33'; ctx.fillRect(x,y,w,h);
  ctx.fillStyle='#163058'; ctx.fillRect(x,y-8,w,16);
  ctx.strokeStyle='rgba(255,255,255,.12)'; 
  ctx.strokeRect(x+.5,y+.5,w-1,h-1);
}
function drawBucket(x,y,w,h){
  ctx.fillStyle='#102544'; ctx.beginPath();
  ctx.moveTo(x,y); ctx.lineTo(x+w,y); ctx.lineTo(x+w*0.8,y+h); ctx.lineTo(x+w*0.2,y+h); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#7AE0FF'; ctx.fillRect(x+w*0.25,y+h*0.35,w*0.5,4);
}
function drawLambda(x,y,size){
  ctx.strokeStyle='#7AE0FF'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(x, y+size*0.1);
  ctx.lineTo(x+size*0.5, y+size*0.9);
  ctx.lineTo(x+size*0.8, y+size*0.1);
  ctx.stroke();
}
function drawCPU(x,y,w,h){
  ctx.fillStyle='#0f1a33'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#31486e'; ctx.strokeRect(x+.5,y+.5,w-1,h-1);
  ctx.fillStyle='#19325a'; ctx.fillRect(x+8,y+8,w-16,h-16);
  for(let i=0;i<6;i++){ ctx.fillStyle='#7AE0FF'; ctx.fillRect(x+14+i*10,y+14,6,6); }
}
function drawStack(x,y,w,h,rows){
  ctx.fillStyle='#0f1a33'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#31486e'; ctx.strokeRect(x+.5,y+.5,w-1,h-1);
  for(let i=0;i<rows;i++){ ctx.fillStyle='#13244a'; ctx.fillRect(x+8,y+8+i*18,w-16,12); }
}
function drawRacks(){
  function rack(x,y,w,h){
    ctx.fillStyle='#0f1a33'; ctx.fillRect(x,y,w,h);
    ctx.strokeStyle='rgba(255,255,255,.08)'; ctx.strokeRect(x+.5,y+.5,w-1,h-1);
    for(let i=0;i<5;i++){
      ctx.fillStyle='#13244a'; ctx.fillRect(x+8,y+8+i*24,w-16,16);
      ctx.fillStyle='#7AE0FF'; ctx.fillRect(x+12,y+12+i*24,8,8);
    }
  }
  rack(30,140,120,160);
  rack(W-180,100,120,160);
}
function drawPipes(){
  ctx.strokeStyle='rgba(122,224,255,.25)'; ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(0, H*0.65); ctx.lineTo(W*0.25, H*0.65); ctx.lineTo(W*0.25, H*0.85); ctx.lineTo(W*0.55, H*0.85);
  ctx.stroke();
}
function drawBackground(){
  const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0a1428'); g.addColorStop(1,'#0e2042');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.lineWidth=1;
  for(let x=0;x<W;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for(let y=0;y<H;y+=40){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  drawRacks(); 
  drawPipes();
  drawCloud(W*0.28,280,160,60); 
  drawCloud(W*0.60,95,180,70);
  drawDB(W*0.20, H*0.2, 80, 70);
  drawBucket(W*0.78, H*0.68, 70, 60);
  drawLambda(W*0.48, H*0.18, 60);
  drawCPU(W*0.35, H*0.25, 90, 70);
  drawStack(W*0.60, H*0.28, 90, 90, 4);
}
function draw(){
  ctx.clearRect(0,0,W,H);
  drawBackground();
  const gt=ctx.createLinearGradient(robot.x,robot.y,robot.x,robot.y+robot.h);
  gt.addColorStop(0,'#223a6b'); gt.addColorStop(1,'#132040');
  ctx.fillStyle=gt; ctx.fillRect(robot.x,robot.y,robot.w,robot.h);
  ctx.strokeStyle='#3b4e7a'; ctx.lineWidth=2; ctx.strokeRect(robot.x+.5,robot.y+.5,robot.w-1,robot.h-1);
  items.forEach(it=>{
    ctx.beginPath(); ctx.arc(it.x,it.y,it.r,0,Math.PI*2);
    ctx.fillStyle=it.good?'#7AE0FF':'#ff6b6b'; ctx.fill();
    ctx.font='16px system-ui,Segoe UI,Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#041022';
    ctx.fillText(it.good?'💡':'🐞', it.x, it.y+0.5);
  });
  if(state!=='running'){
    ctx.fillStyle='rgba(7,16,32,.5)'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#EAF2FF'; ctx.font='18px system-ui,Segoe UI,Arial'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(state==='idle'?'Press Start':(state==='paused'?'Paused':`Time! Score: ${score}`), W/2, H/2);
  }
}
function frame(now){ if(state==='running'){ const dt=now-last; last=now; step(dt);} else { last=now; } draw(); requestAnimationFrame(frame); }
function $(id){return document.getElementById(id)}

function updateControls(state){
  start.style.display = (state==='idle') ? 'inline-flex' : 'none';
  resume.style.display = (state==='paused') ? 'inline-flex' : 'none';
  pause.style.display  = (state==='running') ? 'inline-flex' : 'none';
  // stop.style.display   = (state==='running' || state==='paused' || state == 'idle') ? 'inline-flex' : 'none';
}
updateControls(state)
$('start').onclick = ()=>{ if(state==='idle'||state==='over'){ reset(); state='running'; updateControls(state);} };
$('pause').onclick = ()=>{ if(state==='running'){ state='paused'; updateControls(state);} };
$('resume').onclick= ()=>{ if(state==='paused'){ state='running'; last=performance.now();updateControls(state); } };
$('stop').onclick  = ()=>{ state='idle'; reset(); updateControls(state); };
$('restart').onclick=()=>{ reset(); state='running'; updateControls(state); };
reset(); requestAnimationFrame(frame);