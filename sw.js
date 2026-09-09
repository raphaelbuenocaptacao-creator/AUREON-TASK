const CACHE_PREFIX='aureon-task-shell-';
const CACHE=CACHE_PREFIX+'v8-query-safe-private-vary';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
const SENSITIVE=/\b(api|auth|login|logout|session|token|password|senha|secret|private|account|conta)\b/i;
const SHELL_URLS=new Set(ASSETS.map(asset=>new URL(asset,self.registration.scope).href));

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.all(ASSETS.map(async asset=>{
      try{
        const url=new URL(asset,self.registration.scope);
        const response=await fetch(url,{cache:'reload',credentials:'omit',redirect:'error'});
        if(cacheableResponse(response)) await cache.put(url,response.clone());
      }catch(error){
        // Optional shell failures must not poison installation or cache redirects.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

function cacheableRequest(request){
  if(request.method!=='GET') return false;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return false;
  if(request.headers.has('authorization')||request.headers.has('cookie')||request.headers.has('range')||request.headers.has('if-range')) return false;
  if(SENSITIVE.test(url.pathname)||SENSITIVE.test(url.search)) return false;
  return true;
}

function cacheableResponse(response){
  if(!response||!response.ok||response.redirected||response.type==='opaque'||response.status===206) return false;
  if(response.headers.has('content-range')||response.headers.has('set-cookie')) return false;
  const vary=(response.headers.get('vary')||'').toLowerCase().split(',').map(v=>v.trim()).filter(Boolean);
  if(vary.some(v=>v==='*'||v==='cookie'||v==='authorization'||v==='range')) return false;
  const cc=(response.headers.get('cache-control')||'').toLowerCase();
  if(cc.includes('no-store')||cc.includes('private')) return false;
  return true;
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(!cacheableRequest(request)) return;
  const url=new URL(request.url);
  const isNavigation=request.mode==='navigate';
  const isShellAsset=url.search===''&&SHELL_URLS.has(url.href);
  if(!isNavigation&&!isShellAsset) return;

  event.respondWith((async()=>{
    try{
      const response=await fetch(request,{redirect:'error'});
      if(isShellAsset&&cacheableResponse(response)){
        const cache=await caches.open(CACHE);
        await cache.put(request,response.clone());
      }
      return response;
    }catch(error){
      if(isShellAsset){
        const cache=await caches.open(CACHE);
        const cached=await cache.match(request);
        if(cached) return cached;
      }
      if(isNavigation){
        const cache=await caches.open(CACHE);
        const fallback=await cache.match(new URL('./index.html',self.registration.scope));
        if(fallback) return fallback;
      }
      throw error;
    }
  })());
});
