import {json,can} from '../_middleware.js';
export async function onRequestGet({data,env}){
  if(!can(data.user,'cases.read'))return json({error:'forbidden'},403);
  const {results}=await env.DB.prepare('SELECT id,case_number,title,status FROM cases ORDER BY created_at DESC LIMIT 200').all();
  return json({items:results});
}
export async function onRequestPost({request,data,env}){
  if(!can(data.user,'cases.write'))return json({error:'forbidden'},403);
  const b=await request.json();
  if(!b.title||b.title.length>200)return json({error:'invalid'},400);
  const n='DOJ-'+Date.now().toString(36).toUpperCase();
  await env.DB.prepare('INSERT INTO cases(case_number,title,status,created_by,created_at) VALUES(?,?,?,?,?)').bind(n,b.title,'Active',data.user.id,Date.now()).run();
  return json({case_number:n},201);
}
