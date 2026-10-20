import {json,can} from '../../_middleware.js';
const OK=['application/pdf','image/png','image/jpeg','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX=9*1024*1024; // stay under Discord's per-message limit
export async function onRequestPost({request,data,env}){
  if(!can(data.user,'drive.write'))return json({error:'forbidden'},403);
  if(!env.DISCORD_FILES_WEBHOOK)return json({error:'storage not configured'},503);
  const f=(await request.formData()).get('file');
  if(!f||!OK.includes(f.type)||f.size>MAX)return json({error:'invalid file'},400);
  const safe=f.name.replace(/[^\w.\- ]/g,'_').slice(0,120);
  const fd=new FormData();
  fd.append('files[0]',f,crypto.randomUUID()+'_'+safe);
  fd.append('payload_json',JSON.stringify({content:`Upload by ${data.user.username}`,allowed_mentions:{parse:[]}}));
  const r=await fetch(env.DISCORD_FILES_WEBHOOK+'?wait=true',{method:'POST',body:fd});
  if(!r.ok)return json({error:'storage failed'},502);
  const msg=await r.json();
  await env.DB.prepare('INSERT INTO files(r2_key,name,mime,size,owner_id,created_at) VALUES(?,?,?,?,?,?)')
    .bind(msg.id,safe,f.type,f.size,data.user.id,Date.now()).run(); // r2_key column holds the Discord message ID
  return json({id:msg.id},201);
}
