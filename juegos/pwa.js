'use strict';
(() => {
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
    navigator.serviceWorker.register('/juegos/sw.js',{scope:'/juegos/'}).then(()=>navigator.serviceWorker.ready).then(()=>{
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
