export async function onRequestGet({env}){
  if(!env.DISCORD_CLIENT_ID)return new Response('Discord OAuth is not configured',{status:503});
  const state=crypto.randomUUID();
  const u=new URL('https://discord.com/oauth2/authorize');
  u.search=new URLSearchParams({client_id:env.DISCORD_CLIENT_ID,response_type:'code',scope:'identify',state,redirect_uri:env.DISCORD_REDIRECT_URI});
  return new Response(null,{status:302,headers:{Location:u.toString(),'Set-Cookie':`oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=600`}});
}
