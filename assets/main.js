document.querySelectorAll('[data-cfg]').forEach(el=>{
  const k=el.getAttribute('data-cfg');
  if(k==='phoneLink'){ return; }
  if(CONFIG[k]!==undefined){ el.innerHTML=CONFIG[k]; }
});
document.querySelectorAll('.year').forEach(e=>e.textContent=new Date().getFullYear());
document.querySelectorAll('a[data-tel]').forEach(a=>{a.href='tel:'+CONFIG.phoneTel;});
document.querySelectorAll('a[data-mail]').forEach(a=>{a.href='mailto:'+CONFIG.email;});
(function(){const box=document.querySelector('[data-social]'); if(!box) return; const icons={instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',linkedin:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8.5h-3v11h3v-11ZM5 3.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5ZM20.5 13c0-3-1.6-4.7-4.2-4.7-1.5 0-2.5.8-3 1.6V8.5h-3v11h3v-5.8c0-1.5.6-2.5 2-2.5s1.9 1 1.9 2.5v5.8h3.3V13Z"/></svg>',facebook:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.5-1.5h1.4V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7h3Z"/></svg>',youtube:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2s-.2-1.5-.8-2.1c-.8-.8-1.6-.8-2-.9C16.3 5 12 5 12 5s-4.3 0-7.2.2c-.4.1-1.3.1-2 .9C2.2 6.7 2 8.2 2 8.2S1.8 9.9 1.8 11.6v1.6c0 1.7.2 3.4.2 3.4s.2 1.5.8 2.1c.8.8 1.8.8 2.2.9 1.6.2 7 .2 7 .2s4.3 0 7.2-.2c.4-.1 1.3-.1 2-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.4v-1.6C22.2 9.9 22 8.2 22 8.2ZM10 15.3V8.9l5.5 3.2-5.5 3.2Z"/></svg>'};
 Object.entries(CONFIG.social||{}).forEach(([k,u])=>{if(!u) return; const a=document.createElement('a'); a.href=u; a.target='_blank'; a.rel='noopener'; a.setAttribute('aria-label',k); a.innerHTML=icons[k]||k; box.appendChild(a);}); if(!box.children.length) box.remove();})();
(function(){const sec=document.getElementById('bewertungen'); if(!sec) return; const list=(CONFIG.reviews||[]); if(!list.length){sec.remove(); document.querySelectorAll('.rating-badge').forEach(e=>e.remove()); return;}
 const g=sec.querySelector('.grid'); list.slice(0,6).forEach(r=>{const d=document.createElement('article'); d.className='review'; d.innerHTML='<div class="stars" aria-label="'+r.stars+' von 5 Sternen">'+'★'.repeat(r.stars)+'☆'.repeat(5-r.stars)+'</div><p>'+r.text+'</p><b>'+r.name+'</b><small>'+(r.info||'')+'</small>'; g.appendChild(d);});
 const avg=(list.reduce((a,r)=>a+r.stars,0)/list.length).toFixed(1); document.querySelectorAll('.rating-badge').forEach(e=>{e.innerHTML='<span aria-hidden="true">★★★★★</span> '+avg+'/5 aus '+list.length+' Google-Bewertungen';});})();

function collect(form){
  const d={}; const fd=new FormData(form);
  for(const [k,v] of fd.entries()){ if(k==='leistungen'){(d.leistungen=d.leistungen||[]).push(v);} else d[k]=v.trim(); }
  d.quelle='Website-Formular'; d.seite=location.href; d.zeit=new Date().toISOString();
  return d;
}
function required(form){
  let ok=true;
  form.querySelectorAll('[required]').forEach(i=>{
    const bad = i.type==='checkbox' ? !i.checked : !i.value.trim();
    i.style.borderColor = bad ? 'var(--err)' : '';
    if(bad) ok=false;
  });
  return ok;
}
async function send(data){
  if(CONFIG.demo){ await new Promise(r=>setTimeout(r,500)); return {mode:'webhook'}; }
  if(!CONFIG.webhookUrl){ return {mode:'mail'}; }
  const r=await fetch(CONFIG.webhookUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!r.ok) throw new Error('HTTP '+r.status);
  return {mode:'webhook'};
}
function mailFallback(data){
  const lines=Object.entries(data).map(([k,v])=>k+': '+(Array.isArray(v)?v.join(', '):v)).join('\n');
  const href='mailto:'+CONFIG.email+'?subject='+encodeURIComponent('Transportanfrage: '+(data.fahrzeug||''))+'&body='+encodeURIComponent(lines);
  window.location.href=href;
}
function wire(formId,msgId){
  const form=document.getElementById(formId), msg=document.getElementById(msgId);
  form.addEventListener('submit',async e=>{
    e.preventDefault(); msg.className='msg';
    if(!required(form)){ msg.className='msg err'; msg.textContent='Bitte füllen Sie die markierten Felder aus.'; return; }
    const btn=form.querySelector('button[type=submit]'); btn.disabled=true;
    const data=collect(form);
    try{
      const res=await send(data);
      if(res.mode==='mail'){ mailFallback(data); msg.className='msg ok'; msg.textContent='Ihr E-Mail-Programm öffnet sich mit der Anfrage. Falls nicht: schreiben Sie uns an '+CONFIG.email+' oder rufen Sie an: '+CONFIG.phone; }
      else { msg.className='msg ok'; msg.textContent='Vielen Dank – Ihre Anfrage ist eingegangen. Wir melden uns persönlich bei Ihnen.'; form.reset(); }
    }catch(err){
      msg.className='msg err'; msg.textContent='Die Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns an: '+CONFIG.phone+' oder schreiben Sie an '+CONFIG.email;
    }finally{ btn.disabled=false; }
  });
}
if(document.getElementById('quickForm')) wire('quickForm','quickMsg');
if(document.getElementById('leadForm')) wire('leadForm','leadMsg');
