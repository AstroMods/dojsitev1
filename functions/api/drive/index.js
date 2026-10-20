import {json,can} from '../../_middleware.js';
export async function onRequestGet({data,env}){
  if(!can(data.user,'drive.read'))return json({error:'forbidden'},403);
  const {results}=await env.DB.prepare('SELECT id,name,mime,size,created_at FROM files WHERE deleted=0 ORDER BY created_at DESC LIMIT 200').all();
  return json({items:results});
}
