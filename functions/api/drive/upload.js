import {json,can} from '../../_middleware.js';
const OK=['application/pdf','image/png','image/jpeg','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export async function onRequestPost({request,data,env}){
  if(!can(data.user,'drive.write'))return json({error:'forbidden'},403);
  const f=(await request.formData()).get('file');
  if(!f||!OK.includes(f.type)||f.size>25*1024*1024)return json({error:'invalid file'},400);
  const safe=f.name.replace(/[^\w.\- ]/g,'_').slice(0,120);
  const key=`${crypto.randomUUID()}/${safe}`;
  await env.BUCKET.put(key,f.stream(),{httpMetadata:{contentType:f.type}});
  await env.DB.prepare('INSERT INTO files(r2_key,name,mime,size,owner_id,created_at) VALUES(?,?,?,?,?,?)').bind(key,safe,f.type,f.size,data.user.id,Date.now()).run();
  return json({key},201);
}
