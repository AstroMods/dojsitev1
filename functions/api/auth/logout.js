import {sha256} from '../../_middleware.js';
export async function onRequestPost({request,env}){
  const m=(request.headers.get('Cookie')||'').match(/sid=([a-f0-9]{64})/);
  if(m)await env.DB.prepare('UPDATE sessions SET revoked=1 WHERE token_hash=?').bind(await sha256(m[1])).run();
  return new Response(null,{status:204,headers:{'Set-Cookie':'sid=; HttpOnly; Secure; Path=/; Max-Age=0'}});
}
