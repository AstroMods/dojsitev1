import {json,can} from '../_middleware.js';
export async function onRequestGet({data}){
  if(!can(data.user,'notifications.read'))return json({error:'forbidden'},403);
  return json({items:[]}); // TODO: query D1
}
