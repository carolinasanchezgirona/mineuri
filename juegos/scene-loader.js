'use strict';
(() => {
  async function loadScene(img){
    if(!img || img.dataset.sceneLoaded==='true') return;
    const base=img.dataset.sceneParts;
    const count=Math.max(1,Math.min(12,Number(img.dataset.scenePartsCount||5)));
    if(!base) return;
    img.setAttribute('aria-busy','true');
    try{
      const parts=await Promise.all(Array.from({length:count},(_,i)=>
        fetch(base+'/part'+(i+1)+'.txt').then(r=>{
          if(!r.ok) throw new Error('No se pudo cargar una parte de la escena');
          return r.text();
        })
      ));
      img.src='data:image/webp;base64,'+parts.join('');
      await img.decode().catch(()=>{});
      img.dataset.sceneLoaded='true';
      img.removeAttribute('aria-busy');
      img.dispatchEvent(new CustomEvent('mineuri-scene-loaded'));
    }catch(error){
      img.removeAttribute('aria-busy');
      img.dataset.sceneError='true';
      img.alt='No se ha podido cargar la escena del juego.';
      console.error(error);
    }
  }
  function boot(){
    document.querySelectorAll('img[data-scene-parts]').forEach(loadScene);
  }
  window.MineuriSceneLoader={load:loadScene,boot};
  boot();
})();