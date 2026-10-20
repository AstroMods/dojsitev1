import {json,can} from '../_middleware.js';
export async function onRequestGet({data,env}){
  if(!can(data.user,'reports.read'))return json({error:'forbidden'},403);
  const c=async q=>(await env.DB.prepare(q).first()).n;
  return json({stats:{'Active cases':await c("SELECT COUNT(*) n FROM cases WHERE status='Active'"),'Active personnel':await c('SELECT COUNT(*) n FROM users')}});
}
