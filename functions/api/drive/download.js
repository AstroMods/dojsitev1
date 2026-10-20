import {json,can} from '../../_middleware.js';
export async function onRequestGet({request,data,env}){
  if(!can(data.user,'drive.read'))return json({error:'forbidden'},403);
  const id=new URL(request.url).searchParams.get('id');
  const row=await env.DB.prepare('SELECT r2_key,name,mime FROM files WHERE id=? AND deleted=0').bind(id).first();
  if(!row)return json({error:'not found'},404);
  const m=await fetch(`${env.DISCORD_FILES_WEBHOOK}/messages/${row.r2_key}`);
  if(!m.ok)return json({error:'file unavailable'},502);
  const url=(await m.json()).attachments?.[0]?.url;
  if(!url)return json({error:'file unavailable'},502);
  const o=await fetch(url);
  await env.DB.prepare('INSERT INTO access_log(user_id,file_id,action,at) VALUES(?,?,?,?)').bind(data.user.id,id,'download',Date.now()).run();
  return new Response(o.body,{headers:{'Content-Type':row.mime,'Content-Disposition':`attachment; filename="${row.name}"`}});
}
