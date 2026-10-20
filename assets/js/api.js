// Production data always comes from /api (server-side authz). Demo mode applies only when the
// API reports no configuration or is unreachable; it never grants real access.
const API={mode:'demo',user:null,
 async init(){try{const r=await fetch('/api/users',{credentials:'same-origin'});
  if(r.ok){const j=await r.json();this.mode=j.mode||'production';this.user=j.user;return}
  if(r.status===401){this.mode='production';return}}catch(e){}
  this.mode='demo'},
 async get(p){const r=await fetch('/api/'+p,{credentials:'same-origin'});if(!r.ok)throw new Error(r.status);return r.json()}};
const DEMO={cases:[{case_number:'DEMO-0001',title:'Sample People v. Doe',status:'Active'},{case_number:'DEMO-0002',title:'Sample Civil Matter',status:'Pending'}],
 stats:{'Active cases':2,'Pending filings':1,'Upcoming hearings':1,'Active personnel':3,'Overdue tasks':0,'Pending approvals':1}};
