'use strict';
const CACHE='mineuri-mente-en-juego-v3';
const FILES=[
  '/juegos/', '/juegos/juegos.css?v=3',
  '/juegos/manifest.webmanifest',
  '/juegos/icons/icon-192.png', '/juegos/icons/icon-512.png', '/juegos/icons/icon-maskable-512.png',
  '/style.css?v=21', '/games-navigation.css?v=1', '/script.js?v=games-1',
  '/assets/logo-mineuri.png', '/assets/favicon.svg'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mineuri-mente-en-juego-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  const known=FILES.some(path=>new URL(path,self.location.origin).href===url.href);
  const inGames=url.pathname.startsWith('/juegos/');
  if(!known&&!inGames)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
      return response;
    }).catch(async()=>{
      const cache=await caches.open(CACHE);
      const canonical=url.pathname.replace(/index\.html$/,'');
      return await cache.match(event.request)||await cache.match(canonical)||await cache.match('/juegos/');
    }));return;
  }
  event.respondWith(caches.open(CACHE).then(async cache=>{
    const saved=await cache.match(event.request);if(saved)return saved;
    const response=await fetch(event.request);if(response.ok)await cache.put(event.request,response.clone());return response;
  }));
});
