import {json} from '../_middleware.js';
export async function onRequestGet({data,env}){
  const mode=env.DB&&env.DISCORD_CLIENT_ID?'production':'demo';
  if(mode==='production'&&!data.user)return json({mode,error:'unauthenticated'},401);
  return json({mode,user:data.user&&{id:data.user.id,username:data.user.username,role:data.user.role_key}});
}
