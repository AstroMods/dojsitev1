export const sha256=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
export const can=(u,p)=>!!u&&(u.permissions.includes('*')||u.permissions.includes(p));
export const json=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json'}});
// Resolves the session cookie to user + permissions. Server-side source of truth.
export async function onRequest(ctx){
  const {request,env}=ctx;
  const m=(request.headers.get('Cookie')||'').match(/(?:^|; )sid=([a-f0-9]{64})/);
  ctx.data.user=null;
  if(m&&env.DB){
    const row=await env.DB.prepare(`SELECT u.id,u.username,u.role_key,r.permissions FROM sessions s
      JOIN users u ON u.id=s.user_id LEFT JOIN roles r ON r.key=u.role_key
      WHERE s.token_hash=? AND s.expires_at>? AND s.revoked=0`).bind(await sha256(m[1]),Date.now()).first();
    if(row)ctx.data.user={...row,permissions:JSON.parse(row.permissions||'[]')};
  }
  return ctx.next();
}
