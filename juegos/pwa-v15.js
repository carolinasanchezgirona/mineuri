'use strict';
(() => {
  const BUILD='15';
  let installPrompt=null;
  const installButton=document.getElementById('install-games');
  const installDialog=document.getElementById('install-games-dialog');
  const status=document.getElementById('offline-status');
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
  window.addEventListener('appinstalled',()=>{installPrompt=null;if(installButton)installButton.textContent='App instalada';});
  installButton?.addEventListener('click',async()=>{
    if(installPrompt){
      const prompt=installPrompt;installPrompt=null;
      try{await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='accepted')installButton.textContent='Instalación solicitada';}
      catch{installDialog?.showModal();}
    }else installDialog?.showModal();
  });
  document.getElementById('close-install-games')?.addEventListener('click',()=>installDialog.close());
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/juegos/sw-v15.js',{scope:'/juegos/',updateViaCache:'none'}).then(async registration=>{
      try{await registration.update();}catch{}
      let refreshing=false;
      if(sessionStorage.getItem('mineuri-sw-refresh')==='1'){
        sessionStorage.removeItem('mineuri-sw-refresh');
      }
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        if(refreshing)return;
        refreshing=true;
        sessionStorage.setItem('mineuri-sw-refresh','1');
        location.reload();
      });
      return navigator.serviceWorker.ready;
    }).then(()=>{
      if(status)status.textContent='Los juegos de Mineuri están disponibles sin conexión en este dispositivo.';
    }).catch(()=>{if(status)status.textContent='Puedes jugar conectado a internet. La partida se guarda en este navegador.';});
  }
  const fullscreenButton=document.getElementById('fullscreen-game');
  if(fullscreenButton){
    if(!document.documentElement.requestFullscreen){fullscreenButton.hidden=true;}
    else{
      fullscreenButton.addEventListener('click',async()=>{
        try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
        catch{fullscreenButton.textContent='Pantalla completa no disponible';}
      });
      document.addEventListener('fullscreenchange',()=>{fullscreenButton.textContent=document.fullscreenElement?'Salir de pantalla completa':'Pantalla completa';});
    }
  }
})();
