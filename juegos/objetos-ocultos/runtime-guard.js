'use strict';
(() => {
  const nativeSetInterval=window.setInterval.bind(window);
  window.setInterval=(fn,delay,...args)=>{
    if(delay!==1000)return nativeSetInterval(fn,delay,...args);
    return nativeSetInterval(()=>{
      const img=document.getElementById('scene-image');
      if(img&&(img.getAttribute('aria-busy')==='true'||img.dataset.sceneError==='true'))return;
      fn(...args);
    },delay);
  };

  function boot(){
    const viewport=document.getElementById('scene-viewport');
    const canvas=document.getElementById('scene-canvas');
    const img=document.getElementById('scene-image');
    const layer=document.getElementById('hit-layer');
    const feedback=document.getElementById('feedback');
    const zoomIn=document.getElementById('zoom-in');
    const zoomOut=document.getElementById('zoom-out');
    if(!viewport||!canvas||!img||!layer)return;

    const style=document.createElement('style');
    style.textContent=`
      .scene-viewport{position:relative;touch-action:pan-x pan-y;scrollbar-gutter:stable}
      .scene-viewport.is-zoomed{cursor:grab}
      .scene-viewport.is-dragging{cursor:grabbing;user-select:none}
      .scene-loading-overlay{position:absolute;inset:0;z-index:8;display:none;place-items:center;align-content:center;gap:8px;text-align:center;padding:24px;background:linear-gradient(135deg,rgba(16,39,58,.94),rgba(70,61,53,.94));color:#fff;line-height:1.4}
      .scene-loading-overlay.is-visible{display:grid}
      .scene-loading-overlay strong{font:700 1.12rem Sora,system-ui,sans-serif}
      .scene-loading-overlay span{max-width:34ch;font:.85rem Sora,system-ui,sans-serif;color:rgba(255,255,255,.82)}
      .scene-loading-overlay .scene-retry{margin-top:8px;border:0;border-radius:12px;padding:11px 18px;background:#f4c761;color:#10273a;font:700 .9rem Sora,system-ui,sans-serif;cursor:pointer}
    `;
    document.head.appendChild(style);

    const overlay=document.createElement('div');
    overlay.className='scene-loading-overlay';
    overlay.setAttribute('aria-live','polite');
    viewport.appendChild(overlay);

    const showLoading=()=>{
      delete img.dataset.sceneError;
      img.setAttribute('aria-busy','true');
      overlay.className='scene-loading-overlay is-visible';
      overlay.innerHTML='<strong>Cargando escena…</strong><span>Un segundo, estamos colocando hasta la última miguita.</span>';
      layer.style.pointerEvents='none';
      if(zoomIn)zoomIn.disabled=true;
      if(zoomOut)zoomOut.disabled=true;
    };

    const showReady=()=>{
      delete img.dataset.sceneError;
      img.removeAttribute('aria-busy');
      overlay.className='scene-loading-overlay';
      layer.style.pointerEvents='';
      if(zoomIn)zoomIn.disabled=false;
      if(zoomOut)zoomOut.disabled=(parseFloat(canvas.style.width)||100)<=100;
      preloadNext();
    };

    const showError=()=>{
      img.removeAttribute('aria-busy');
      img.dataset.sceneError='true';
      layer.style.pointerEvents='none';
      if(zoomIn)zoomIn.disabled=true;
      if(zoomOut)zoomOut.disabled=true;
      overlay.className='scene-loading-overlay is-visible';
      overlay.innerHTML='<strong>No se ha podido cargar la escena</strong><span>La partida queda en pausa.</span><button type="button" class="scene-retry">Reintentar</button>';
      if(feedback)feedback.textContent='La escena no se ha cargado. La partida está en pausa.';
      overlay.querySelector('.scene-retry')?.addEventListener('click',()=>{
        const src=img.currentSrc||img.src;
        if(!src)return;
        showLoading();
        const clean=src.replace(/([?&])retry=\d+(&|$)/,'$1').replace(/[?&]$/,'');
        img.src=clean+(clean.includes('?')?'&':'?')+'retry='+Date.now();
      },{once:true});
    };

    img.addEventListener('load',showReady);
    img.addEventListener('mineuri-scene-loaded',showReady);
    img.addEventListener('error',showError);

    new MutationObserver(mutations=>{
      if(mutations.some(m=>m.attributeName==='src'))showLoading();
    }).observe(img,{attributes:true,attributeFilter:['src']});

    let zoomSnapshot=null;
    document.querySelectorAll('#zoom-in,#zoom-out').forEach(btn=>{
      btn.addEventListener('pointerdown',()=>{
        zoomSnapshot={
          height:viewport.getBoundingClientRect().height,
          centerX:viewport.scrollLeft+viewport.clientWidth/2,
          centerY:viewport.scrollTop+viewport.clientHeight/2,
          oldScale:(parseFloat(canvas.style.width)||100)/100
        };
      },true);
      btn.addEventListener('click',()=>{
        setTimeout(()=>{
          const scale=(parseFloat(canvas.style.width)||100)/100;
          if(scale<=1){
            viewport.style.height='';
            viewport.classList.remove('is-zoomed');
            viewport.scrollLeft=0;
            viewport.scrollTop=0;
            return;
          }
          viewport.classList.add('is-zoomed');
          if(zoomSnapshot){
            viewport.style.height=zoomSnapshot.height+'px';
            const ratio=scale/zoomSnapshot.oldScale;
            viewport.scrollLeft=Math.max(0,zoomSnapshot.centerX*ratio-viewport.clientWidth/2);
            viewport.scrollTop=Math.max(0,zoomSnapshot.centerY*ratio-viewport.clientHeight/2);
          }
        },0);
      });
    });

    let pan=null;
    let moved=false;
    viewport.addEventListener('pointerdown',event=>{
      if(event.pointerType!=='mouse'||event.button!==0||!viewport.classList.contains('is-zoomed')||event.target.closest('.hitbox,.scene-retry'))return;
      pan={id:event.pointerId,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
      moved=false;
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    viewport.addEventListener('pointermove',event=>{
      if(!pan||event.pointerId!==pan.id)return;
      const dx=event.clientX-pan.x,dy=event.clientY-pan.y;
      if(Math.abs(dx)>3||Math.abs(dy)>3)moved=true;
      viewport.scrollLeft=pan.left-dx;
      viewport.scrollTop=pan.top-dy;
    });
    const endPan=event=>{
      if(!pan||event.pointerId!==pan.id)return;
      viewport.classList.remove('is-dragging');
      pan=null;
      if(viewport.hasPointerCapture(event.pointerId))viewport.releasePointerCapture(event.pointerId);
    };
    viewport.addEventListener('pointerup',endPan);
    viewport.addEventListener('pointercancel',endPan);
    viewport.addEventListener('click',event=>{
      if(moved){
        moved=false;
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },true);

    const scenes=[
      'assets/scenes/cafe-entre-libros.webp',
      'assets/scenes/estudio-artista.webp',
      'assets/scenes/mercadillo-domingo.webp',
      'assets/scenes/invernadero.webp',
      'assets/scenes/ultimo-tren.webp'
    ];
    function preloadNext(){
      const title=document.getElementById('scene-title')?.textContent||'';
      const titles=['Noche en casa','Café entre libros','El estudio del artista','Mercadillo de domingo','El invernadero'];
      const i=titles.indexOf(title);
      if(i<0||!scenes[i])return;
      const pre=new Image();
      pre.decoding='async';
      pre.src=scenes[i];
    }

    if(img.complete&&img.naturalWidth)showReady();
    else showLoading();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();