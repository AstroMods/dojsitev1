import {sha256} from '../../_middleware.js';
export async function onRequestGet({request,env}){
  const url=new URL(request.url),code=url.searchParams.get('code'),state=url.searchParams.get('state');
  const ck=(request.headers.get('Cookie')||'').match(/oauth_state=([^;]+)/);
  if(!code||!state||!ck||ck[1]!==state)return new Response('Invalid OAuth state',{status:400});
  const tok=await fetch('https://discord.com/api/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({client_id:env.DISCORD_CLIENT_ID,client_secret:env.DISCORD_CLIENT_SECRET,grant_type:'authorization_code',code,redirect_uri:env.DISCORD_REDIRECT_URI})});
  if(!tok.ok)return new Response('Discord token exchange failed',{status:502});
  const {access_token}=await tok.json();
  const me=await (await fetch('https://discord.com/api/users/@me',{headers:{Authorization:'Bearer '+access_token}})).json();
  await env.DB.prepare(`INSERT INTO users(discord_id,username,avatar,role_key,created_at) VALUES(?,?,?,?,?)
    ON CONFLICT(discord_id) DO UPDATE SET username=excluded.username,avatar=excluded.avatar`).bind(me.id,me.username,me.avatar,'department_personnel',Date.now()).run();
  const user=await env.DB.prepare('SELECT id FROM users WHERE discord_id=?').bind(me.id).first();
  const sid=[...crypto.getRandomValues(new Uint8Array(32))].map(b=>b.toString(16).padStart(2,'0')).join('');
  const ttl=12*3600*1000;
  await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at,revoked) VALUES(?,?,?,0)').bind(await sha256(sid),user.id,Date.now()+ttl).run();
  const h=new Headers({Location:'/'});
  h.append('Set-Cookie',`sid=${sid}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${ttl/1000}`);
  h.append('Set-Cookie','oauth_state=; Path=/api/auth; Max-Age=0');
  return new Response(null,{status:302,headers:h});
}
