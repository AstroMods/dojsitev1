const MODULES=[['dashboard','Dashboard'],['departments','Departments'],['cases','Case Management'],['legal-documents','Legal Documents'],['drive','Drive'],['pdf-studio','PDF Studio'],['discord-logs','Discord Logs'],['newsroom','Newsroom'],['announcements','Announcements'],['personnel','Personnel'],['tasks','Tasks'],['calendar','Meetings & Calendar'],['reports','Reports'],['notifications','Notifications'],['admin','Administration'],['settings','Settings']];
const head=(t,s)=>`<h1>${esc(t)}</h1><p class="sub">${esc(s||'')}</p>`;
const table=(cols,rows)=>rows.length?`<table><thead><tr>${cols.map(c=>`<th>${esc(c[1])}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${esc(r[c[0]])}</td>`).join('')}</tr>`).join('')}</tbody></table>`:'<div class="empty">No records yet.</div>';
const list=async(ep,demo)=>API.mode==='demo'?demo:(await API.get(ep)).items||[];
const stub=(t,s)=>async()=>head(t,s)+'<div class="empty">Module scaffold ready. Add its UI in assets/js and its endpoint in functions/api.</div>';

Router.add('dashboard',async()=>{
 const s=API.mode==='demo'?DEMO.stats:(await API.get('reports')).stats;
 return head('Dashboard','Operational overview')+`<div class="grid">${Object.entries(s).map(([k,v])=>`<div class="card"><div class="n">${esc(v)}</div><div class="l">${esc(k)}</div></div>`).join('')}</div>`+
 (API.mode==='demo'?`<div class="card" style="margin-top:1rem"><div class="l">Sample chart (demo data)</div><div class="bars">${[3,5,2,6,4,7,5,8].map(h=>`<i style="height:${h*12}%"></i>`).join('')}</div></div>`:'')});
Router.add('cases',async()=>head('Case Management','Cases, filings, hearings')+table([['case_number','Case #'],['title','Title'],['status','Status']],await list('cases',DEMO.cases)));
Router.add('drive',async()=>head('Drive','Documents stored via Discord webhook')+'<div class="drop" id="drop">Drag files here to upload (PDF, DOCX, PNG, JPG; 9 MB max)</div>');
document.addEventListener('dragover',e=>{if(e.target.closest&&e.target.closest('#drop'))e.preventDefault()});
document.addEventListener('drop',async e=>{if(!(e.target.closest&&e.target.closest('#drop')))return;e.preventDefault();
 if(API.mode==='demo'){alert('Demo mode: uploads are disabled.');return}
 for(const f of e.dataTransfer.files){const fd=new FormData();fd.append('file',f);await fetch('/api/drive/upload',{method:'POST',body:fd,credentials:'same-origin'})}});
Router.add('pdf-studio',stub('PDF Studio','PDF.js viewer + pdf-lib editing (pin versions from cdnjs)'));
Router.add('discord-logs',stub('Discord Logs','Events come from your bot service via signed POST'));
for(const [id,t] of MODULES){if(!Router.routes[id])Router.add(id,stub(t,''))}
(async()=>{
 $('#nav').innerHTML=MODULES.map(([id,t])=>`<a href="#/${id}" data-r="${id}">${esc(t)}</a>`).join('');
 const th=localStorage.getItem('theme');if(th)document.documentElement.dataset.theme=th;
 $('#themeBtn').onclick=()=>{const n=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;localStorage.setItem('theme',n)};
 $('#menuBtn').onclick=()=>{const s=$('#sidebar');innerWidth<800?s.classList.toggle('open'):s.classList.toggle('closed')};
 await API.init();
 if(API.mode==='demo'){const b=$('#banner');b.hidden=false;b.textContent='DEMO MODE: sample data only. No real authentication or Discord activity.'}
 if(API.user){$('#userChip').textContent=API.user.username;$('#loginBtn').hidden=true}
 Router.start();
})();
