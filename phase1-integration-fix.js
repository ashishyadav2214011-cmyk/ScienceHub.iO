/* Additive Phase 1 UI patch. Existing framework and data engine are retained. */
(()=> {
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const FRONT='./11_VISUAL-INTEGRATION__SCIENCEHUB-FRONTEND-APP-ICON.png';
 const INTERNAL='./11_VISUAL-INTEGRATION__SCIENCEHUB-INTERNAL-APP-ICON.png';
 const subs={'11':[['phy','Physics'],['chem','Chemistry'],['math','Mathematics'],['bio','Biology'],['eng','English'],['hin','Hindi']],
 '12':[['phy12','Physics'],['chem12','Chemistry'],['math12','Mathematics'],['bio12','Biology'],['eng12','English'],['hin12','Hindi']]};
 const get=k=>{try{return localStorage.getItem(k)}catch{return null}},set=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
 let busy=false;
 function selectors(){
  const top=$('.top'),bar=$('.toolbar');if(!top||!bar||$('#phase1BoardSelect'))return;
  const brand=$('.brand',top);if(brand)brand.innerHTML=`<img class="sh-brand-icon" src="${INTERNAL}" alt="ScienceHub.io internal logo"><span>ScienceHub.io</span>`;
  const board=document.createElement('select');board.id='phase1BoardSelect';board.setAttribute('aria-label','Board');board.innerHTML='<option>UP Board</option>';board.value=get('sciencehub.phase1.board')||'UP Board';board.onchange=()=>set('sciencehub.phase1.board',board.value);
  const subject=document.createElement('select');subject.id='phase1SubjectSelect';subject.setAttribute('aria-label','Choose subject');
  const cls=()=>$('#classSelect')?.value||get('sciencehub.phase1.class')||'11';
  const fill=()=>subject.innerHTML='<option value="">Choose subject…</option>'+subs[cls()].map(([id,n])=>`<option value="${id}">${n}</option>`).join('');
  fill();subject.onchange=()=>{if(!subject.value)return;set('sciencehub.phase1.subject',subject.value);$('[data-route="Learning"]')?.click()};
  $('#classSelect')?.addEventListener('change',()=>{fill();set('sciencehub.phase1.class',cls())});
  bar.insertBefore(board,bar.firstChild);bar.insertBefore(subject,board.nextSibling);
  let status=$('#phase1SelectionStatus');if(!status){status=document.createElement('small');status.id='phase1SelectionStatus';status.className='phase1-selection-status';top.appendChild(status)}
  status.textContent='UP Board · Class 11–12 · Select a subject';
 }
 function home(){
  const main=$('.panel');if(!main||$('h1',main)?.textContent.trim()!=='Home')return;
  if(!$('.phase1-hero',main)){
   const h=$('h1',main),hero=document.createElement('section');hero.className='phase1-hero';
   hero.innerHTML=`<div class="phase1-hero-copy"><span class="phase1-eyebrow">YOUR PERSONAL STUDY SPACE</span><h2>Learn clearly. Practise confidently.</h2><p>Class 11–12 · UP Board · PCM and PCB · English and Hindi</p><div class="phase1-hero-actions"><button class="action" data-p1="Learning">Explore subjects</button><button class="action secondary" data-p1="Practice">Start practice</button></div><small>Availability depends on mapped academic content.</small></div><img class="phase1-hero-logo" src="${FRONT}" alt="ScienceHub.io frontend logo">`;
   h?.insertAdjacentElement('afterend',hero);hero.querySelectorAll('[data-p1]').forEach(b=>b.onclick=()=> $(`[data-route="${b.dataset.p1}"]`)?.click());
  }
  if(!$('.phase1-study-hub',main)){
   const hub=document.createElement('section');hub.className='phase1-study-hub';hub.innerHTML='<h2>Study Hub</h2><p>Learning, practice and performance in one place.</p><div class="phase1-study-links"><button class="action" data-hub="Learning">Learning</button><button class="action" data-hub="Practice">Practice</button><button class="action" data-hub="Performance">Performance</button></div>';
   $('.phase1-hero',main)?.insertAdjacentElement('afterend',hub);hub.querySelectorAll('[data-hub]').forEach(b=>b.onclick=()=> $(`[data-route="${b.dataset.hub}"]`)?.click());
  }
  $$('h3').forEach(h=>{if(['Phase 5 Runtime','Learning Pipeline'].includes(h.textContent.trim())){const c=h.closest('.card');if(c)c.style.display='none'}});
  const ctx=$$('h3').find(h=>h.textContent.trim()==='Academic Context');if(ctx){const p=ctx.closest('.card')?.querySelector('.muted');if(p)p.textContent='Physics · Chemistry · Mathematics · Biology · English · Hindi'}
 }
 function chat(){
  const btn=$('#sukoon');if(!btn||btn.dataset.p1chat)return;btn.dataset.p1chat='1';
  document.addEventListener('click',e=>{if(!e.target.closest('#sukoon'))return;e.preventDefault();e.stopImmediatePropagation();
   let p=$('#sukoonPanel');if(p){p.remove();return}
   p=document.createElement('aside');p.id='sukoonPanel';p.className='sukoon-panel';
   p.innerHTML='<header><img src="./12_SUKOON-BRAIN-REALTIME-ICON.png" alt="" width="42"><strong>Sukoon.Brain</strong><button id="p1close" aria-label="Close">×</button></header><p>Offline study helper · Live AI is not connected.</p><div class="phase1-chat-log" id="p1log"><div class="phase1-chat-bubble bot">Hi! Ask about a subject or tell me what you want to revise.</div></div><form id="p1form"><input id="p1input" placeholder="Type your question…" required><button class="action">Send</button></form>';
   document.body.appendChild(p);$('#p1close').onclick=()=>p.remove();
   $('#p1form').onsubmit=ev=>{ev.preventDefault();const input=$('#p1input'),m=input.value.trim();if(!m)return;const log=$('#p1log');for(const [cl,txt] of [['user',m],['bot','I can help you organise revision. Open Study Hub → Learning for mapped chapters. Detailed AI answers are not connected in this build.']]){const d=document.createElement('div');d.className='phase1-chat-bubble '+cl;d.textContent=txt;log.appendChild(d)}input.value='';log.scrollTop=log.scrollHeight};
  },true);
  btn.onpointerdown=e=>{const r=btn.getBoundingClientRect();btn._drag={x:e.clientX,y:e.clientY,l:r.left,t:r.top,m:false}};
  btn.onpointermove=e=>{const d=btn._drag;if(!d)return;let x=e.clientX-d.x,y=e.clientY-d.y;if(Math.abs(x)+Math.abs(y)>8)d.m=true;if(d.m){btn.style.left=Math.max(4,Math.min(innerWidth-btn.offsetWidth-4,d.l+x))+'px';btn.style.top=Math.max(4,Math.min(innerHeight-btn.offsetHeight-4,d.t+y))+'px';btn.style.right='auto';btn.style.bottom='auto'}};
  btn.onpointerup=()=>{const d=btn._drag;if(d?.m){set('sciencehub.phase1.mascotPosition',JSON.stringify({left:parseFloat(btn.style.left),top:parseFloat(btn.style.top)}));btn.dataset.dragged='1';setTimeout(()=>delete btn.dataset.dragged,120)}btn._drag=null};
  try{const p=JSON.parse(get('sciencehub.phase1.mascotPosition')||'null');if(p){btn.style.left=p.left+'px';btn.style.top=p.top+'px';btn.style.right='auto';btn.style.bottom='auto'}}catch{}
 }
 function run(){if(busy)return;busy=true;try{selectors();home();chat()}finally{busy=false}}
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true});document.addEventListener('DOMContentLoaded',run);run();
})();
