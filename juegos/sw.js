'use strict';
const CACHE='mineuri-mente-en-juego-v9';
const FILES=[
  '/juegos/',
  '/juegos/juegos.css?v=5',
  '/juegos/scene-loader.js?v=1',
  '/juegos/pwa.js?v=3',
  '/juegos/manifest.webmanifest',
  '/juegos/icons/icon-192.png',
  '/juegos/icons/icon-512.png',
  '/juegos/icons/icon-maskable-512.png',
  '/style.css?v=21',
  '/games-navigation.css?v=1',
  '/script.js?v=games-1',
  '/assets/logo-mineuri.png',
  '/assets/favicon.svg',
  '/juegos/objetos-ocultos/',
  '/juegos/objetos-ocultos/style.css?v=3',
  '/juegos/objetos-ocultos/runtime-guard.js?v=2',
  '/juegos/objetos-ocultos/app.js?v=3',
  '/juegos/objetos-ocultos/assets/scene-parts/part1.txt',
  '/juegos/objetos-ocultos/assets/scene-parts/part2.txt',
  '/juegos/objetos-ocultos/assets/scene-parts/part3.txt',
  '/juegos/objetos-ocultos/assets/scene-parts/part4.txt',
  '/juegos/objetos-ocultos/assets/scene-parts/part5.txt',
  '/juegos/objetos-ocultos/assets/scenes/cafe-entre-libros.webp',
  '/juegos/objetos-ocultos/assets/scenes/estudio-artista.webp',
  '/juegos/objetos-ocultos/assets/scenes/mercadillo-domingo.webp',
  '/juegos/objetos-ocultos/assets/scenes/invernadero.webp',
  '/juegos/objetos-ocultos/assets/scenes/ultimo-tren.webp'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key.startsWith('mineuri-mente-en-juego-')&&key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  const inGames=url.pathname.startsWith('/juegos/');
  if(!inGames)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(event.request,{cache:'no-store'});
      if(response.ok)event.waitUntil(cache.put(event.request,response.clone()));
      return response;
    }catch{
      return await cache.match(event.request)
        || await cache.match(url.pathname)
        || (event.request.mode==='navigate'?await cache.match('/juegos/'):undefined)
        || Response.error();
    }
  })());
});