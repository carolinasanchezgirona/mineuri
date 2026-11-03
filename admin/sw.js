/* Mobile admin approvals. No clinical or customer details in notifications. */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("push",event=>{
  event.waitUntil(self.registration.showNotification("Mineuri · Confirma un acceso",{
    body:"¿Estás intentando entrar en la administración? Revísalo desde tu móvil.",
    tag:"mineuri-admin-login",renotify:true,
    data:{url:"/admin/movil/"},
  }));
});
self.addEventListener("notificationclick",event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const url=new URL("/admin/movil/",self.location.origin).href;
    const clients=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    const existing=clients.find(c=>c.url.startsWith(url));
    if(existing){await existing.focus();return;}
    await self.clients.openWindow(url);
  })());
});
