// Imágenes originales, en orden (01 = teclado ... 34 = puzzle)
const IMG=["img/01.png", "img/02.png", "img/03.png", "img/04.png", "img/05.png", "img/06.png", "img/07.png", "img/08.png", "img/09.png", "img/10.png", "img/11.png", "img/12.png", "img/13.png", "img/14.png", "img/15.png", "img/16.png", "img/17.png", "img/18.png", "img/19.png", "img/20.png", "img/21.png", "img/22.png", "img/23.png", "img/24.png", "img/25.png", "img/26.png", "img/27.png", "img/28.png", "img/29.png", "img/30.png", "img/31.png", "img/32.png", "img/33.png", "img/34.png"];
const CODE="101082";
const bg=document.getElementById('bg'),layer=document.getElementById('layer');
const set=i=>bg.src=IMG[i], clear=()=>layer.innerHTML='';
function box(l,t,w,h,cls){const d=document.createElement('div');d.className=cls;d.style.cssText=`left:${l}%;top:${t}%;width:${w}%;height:${h}%`;layer.append(d);return d}
function hs(l,t,w,h,fn,label){const b=document.createElement('button');b.className='hs';b.style.cssText=`left:${l}%;top:${t}%;width:${w}%;height:${h}%`;b.setAttribute('aria-label',label);b.onclick=fn;layer.append(b)}

/* 1. teclado */
let buf="",boxes=[],lockOn=false;
function lock(){clear();set(0);buf="";lockOn=true;
 [592,653,713,774,835,894].forEach(x=>boxes.push(0));boxes=[592,653,713,774,835,894].map(x=>box((x-21)/10.83,(212-21)/6.07,3.9,6.9,'box'));
 const K=["1","2","3","4","5","6","7","8","9","*","0","#"];
 K.forEach((k,i)=>hs((643+(i%3)*100-25)/10.83,(278+((i/3)|0)*66.7-25)/6.07,4.7,8.2,()=>press(k),k==='*'?'Borrar':k==='#'?'Limpiar':k));
}
function draw(){boxes.forEach((b,i)=>b.textContent=buf[i]||'')}
function press(k){
 if(!lockOn)return;
 if(k==='*')buf=buf.slice(0,-1);else if(k==='#')buf="";else if(buf.length<6)buf+=k;
 draw();
 if(buf.length===6){
  if(buf===CODE){lockOn=false;setTimeout(bday,700)}
  else{boxes.forEach(b=>b.classList.add('shake'));setTimeout(()=>{boxes.forEach(b=>b.classList.remove('shake'));buf="";draw()},500)}
 }}
addEventListener('keydown',e=>{if(/^[0-9]$/.test(e.key))press(e.key);else if(e.key==='Backspace')press('*')});

/* 2. cumpleaños */
function bday(){clear();set(1);hs(35.2,82.4,27.3,7.6,wall,'Comenzar')}

/* confetti */
const cv=document.getElementById('cf'),cx=cv.getContext('2d');
function confetti(){
 cv.width=cv.clientWidth;cv.height=cv.clientHeight;
 const cols=['#ff5fb8','#38b2ff','#ffd23f','#00c060','#fff','#7b5cff'];
 let P=Array.from({length:240},()=>({x:cv.width/2,y:cv.height*.75,vx:(Math.random()-.5)*24,vy:-Math.random()*24-6,s:Math.random()*9+4,r:Math.random()*6,vr:Math.random()*.4-.2,c:cols[Math.random()*6|0]}));
 (function f(){cx.clearRect(0,0,cv.width,cv.height);P.forEach(p=>{p.vy+=.5;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.r+=p.vr;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()});P=P.filter(p=>p.y<cv.height+20);if(P.length)requestAnimationFrame(f);else cx.clearRect(0,0,cv.width,cv.height)})();
}

/* 3. pared: la flecha avanza */
function wall(){confetti();clear();set(2);hs(83.9,77,4.9,8.6,intro,'Siguiente')}

/* 4. intro */
function intro(){clear();set(3);const go=()=>{score=0;rec=[];quiz(0)};
 hs(32,80.5,11.1,7.8,go,'Sí');hs(56.8,80.5,11.3,7.8,go,'Más que lista')}

/* 5. quiz */
const QS=[
 {a:2,o:["Melbourne","Sidney","Canberra","Brisbane"],base:4,hint:5,ok:6},
 {a:1,o:["Van Gogh","Da Vinci","Miguel Ángel","Pablo Picasso"],base:7,hint:8,ok:9},
 {a:0,o:["Pácifico","Atlántico","Índico","Ártico"],base:10,hint:11,ok:12},
 {a:1,o:["América","África","Asia","Europa"],base:13,hint:14,ok:15},
 {a:0,o:["Dióxido de carbono","Oxígeno","Nitrógeno","Helio"],base:16,hint:17,ok:18},
 {a:3,o:["Fernando Pessoa","Gil Vicente","José Saramago","Luís de Camoes"],base:19,hint:20,ok:21}
];
QS[2].o[0]="Pacífico";
const OT=[34.7,45.7,56.7,67.8];let score=0,locked=false,rec=[];
function quiz(i){
 const Q=QS[i];clear();set(Q.base);locked=false;
 Q.o.forEach((t,k)=>hs(58.6,OT[k],23.6,7.7,()=>answer(i,k),"ABCD"[k]+". "+t));
 hs(66,78.7,8.6,5.4,function(){
  if(Q.hint!=null){set(Q.hint);this.remove()}
  else{this.remove();const h=box(57,79,26,6,'hint');h.textContent=Q.txt}
 },'Pista');
}
function answer(i,k){
 if(locked)return;locked=true;const Q=QS[i];const ok=k===Q.a;rec[i]={k,ok};
 if(ok){score++;if(Q.ok!=null){clear();set(Q.ok)}}
 if(!ok||Q.ok==null){const p=box(58.6,OT[k],23.6,7.7,'pill '+(ok?'good':'bad'));p.textContent="ABCD"[k]+". "+Q.o[k]}
 setTimeout(()=>i+1<QS.length?quiz(i+1):end(),ok?1300:1000);
}
const arrow=(fn,l)=>hs(83.9,77,4.9,8.6,fn,l);
function end(){confetti();results()}
function results(){clear();set(22);
 const c=box(29.9,56,22.2,16.6,'cell'),x=box(52.2,56,22,16.6,'cell');
 rec.forEach((r,i)=>{const d=document.createElement('div'),Q=QS[i];
  if(r.ok){d.textContent="P"+(i+1)+" · "+Q.o[Q.a];c.append(d)}
  else{d.textContent="P"+(i+1)+" · "+Q.o[r.k]+" → "+Q.o[Q.a];x.append(d)}});
 const p=box(56,75.6,8,7.6,'pts');p.textContent=score*10;
 arrow(gifts,'Siguiente')}
/* regalos */
const seen=new Set();
function gifts(){clear();
 if(seen.has('l')&&seen.has('r')){set(26);hs(24.6,48,16.1,29.3,letter,'Carta');hs(62.5,34.5,16.3,29.6,puzzle,'Puzzle');arrow(pistas,'Siguiente')}
 else{set(23);hs(26.2,47.4,16.1,29.4,letter,'Carta');hs(58.2,36.5,16.2,29,puzzle,'Puzzle')}}
function letter(){clear();set(24);hs(46.2,53,8.3,14.8,()=>{seen.add('l');clear();set(25);arrow(gifts,'Volver')},'Abrir carta')}
let pzOn=false;
function puzzle(){clear();set(33);pzOn=true;
 const C=4,R=3,b=box(8,27.3,52.3,62,'pz');
 b.style.gridTemplateColumns=`repeat(${C},1fr)`;b.style.gridTemplateRows=`repeat(${R},1fr)`;
 let order=[...Array(C*R).keys()],sel=null;
 do{order.sort(()=>Math.random()-.5)}while(order.every((v,i)=>v===i));
 const draw=()=>{b.innerHTML='';order.forEach((v,i)=>{
  const p=document.createElement('button');p.className='pc'+(sel===i?' sel':'');
  p.style.backgroundPosition=`${(v%C)/(C-1)*100}% ${((v/C)|0)/(R-1)*100}%`;
  p.setAttribute('aria-label','Pieza '+(i+1));
  p.onclick=()=>{
   if(b.classList.contains('done'))return;
   if(sel===null)sel=i;else{[order[sel],order[i]]=[order[i],order[sel]];sel=null}
   draw();
   if(order.every((v,j)=>v===j)){b.classList.add('done');box(8,91,52.3,6,'pzmsg').textContent='¡Puzzle completado! 🎉';pzDone()}
  };b.append(p)})};
 draw()}
function pzDone(){if(!pzOn||document.querySelector('.ab'))return;
 const b=document.createElement('button');b.className='ab';b.textContent='➜';b.setAttribute('aria-label','Volver a los regalos');
 b.style.cssText='left:83.9%;top:77%;width:4.9%;height:8.6%';b.onclick=()=>{seen.add('r');pzOn=false;gifts()};layer.append(b)}
/* pistas */
function pistas(){clear();set(27);arrow(s2a,'Siguiente')}
function s2a(){clear();set(28);hs(32.1,81,11,7.4,s3a,'Lo tengo');hs(59,81,11,7.4,s2b,'No sé')}
function s2b(){clear();set(29);hs(41.4,79.7,17.3,7.9,s3a,'Lo tengo')}
function s3a(){clear();set(30);hs(32.1,81,11,7.4,feliz,'Lo tengo');hs(59,81,11,7.4,s3b,'No sé')}
function s3b(){clear();set(31);hs(41.6,79.3,17.3,8,feliz,'Lo tengo')}
/* final */
let lit=false;
function feliz(){clear();set(32);lit=false;hs(43.1,81,14.4,7.1,shine,'Corazones')}
function shine(){if(lit)return;lit=true;
 [[14.3,23.4],[27,35.4],[70.9,18.1],[80.7,39.1],[67.1,69.7],[36.5,74.8]].forEach(([x,y],i)=>{
  const g=document.createElement('div');g.className='glow';g.style.cssText=`left:calc(${x}% - 4.5cqw);top:calc(${y}% - 4.5cqw);animation-delay:${i*.2}s`;layer.append(g)});
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 setInterval(()=>{const h=document.createElement('div');h.className='fall';h.textContent='♥';
  h.style.cssText=`left:${6+Math.random()*88}%;font-size:${1+Math.random()*1.4}cqw;animation-duration:${3.5+Math.random()*3}s;color:${['#1a1ab8','#5a8cff','#ff8fc8'][Math.random()*3|0]}`;
  h.onanimationend=()=>h.remove();layer.append(h)},170)}

IMG.forEach(s=>{const i=new Image();i.src=s});
lock();