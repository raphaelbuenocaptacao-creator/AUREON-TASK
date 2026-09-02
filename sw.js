const CACHE_PREFIX='aureon-task-shell-';
const CACHE=CACHE_PREFIX+'v2-safe';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
const SENSITIVE=/\b(api|auth|login|logout|session|token|password|senha|secret|private|account|conta)\b/i;

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))));
  self.clients.claim();
});

function cacheableRequest(request){
  if(request.method!=='GET') return false;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return false;
  if(request.headers.has('authorization')||request.headers.has('cookie')||request.headers.has('range')) return false;
  if(SENSITIVE.test(url.pathname)||SENSITIVE.test(url.search)) return false;
  return true;
}

function cacheableResponse(response){
  if(!response||!response.ok||response.redirected||response.type==='opaque'||response.status===206) return false;
  if(response.headers.has('content-range')||response.headers.has('set-cookie')) return false;
  const cc=(response.headers.get('cache-control')||'').toLowerCase();
  if(cc.includes('no-store')||cc.includes('private')) return false;
  return true;
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(!cacheableRequest(request)) return;
  const url=new URL(request.url);
  const isNavigation=request.mode==='navigate';
  const shellPath=url.pathname.endsWith('/')||url.pathname.endsWith('/index.html')||/\.(?:css|js|png|svg|webmanifest|json)$/i.test(url.pathname);
  if(!isNavigation&&!shellPath) return;

  event.respondWith((async()=>{
    try{
      const response=await fetch(request);
      if(cacheableResponse(response)){
        const cache=await caches.open(CACHE);
        await cache.put(request,response.clone());
      }
      return response;
    }catch(error){
      const cached=await caches.match(request);
      if(cached) return cached;
      if(isNavigation){
        const fallback=await caches.match('./index.html');
        if(fallback) return fallback;
      }
      throw error;
    }
  })());
});
