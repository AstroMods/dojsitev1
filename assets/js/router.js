const Router={routes:{},add(p,fn){this.routes[p]=fn},
 start(){addEventListener('hashchange',()=>this.go());this.go()},
 async go(){const p=(location.hash.replace(/^#\/?/,'')||'dashboard').split('?')[0];
  const fn=this.routes[p]||this.routes.dashboard;
  document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('active',a.dataset.r===p));
  const v=$('#view');v.innerHTML='<p class="sub">Loading…</p>';
  try{v.innerHTML=await fn()}catch(e){v.innerHTML='<div class="empty">Unable to load: '+esc(e.message)+'</div>'}
  v.focus();$('#sidebar').classList.remove('open')}};
