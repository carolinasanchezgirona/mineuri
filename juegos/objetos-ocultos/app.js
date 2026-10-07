'use strict';
(() => {
  const OBJECTS=[
    {id:'lamp',label:'Lámpara de mesa',icon:'💡',score:1,box:[8.5,23,15,16]},
    {id:'suitcase',label:'Maleta azul',icon:'🧳',score:1,box:[68,37,12,22]},
    {id:'cat',label:'Gato dormido',icon:'🐈',score:1,box:[22,49,20,9]},
    {id:'popcorn',label:'Palomitas',icon:'🍿',score:1,box:[60,58,11,12]},
    {id:'banana',label:'Plátano',icon:'🍌',score:1,box:[55.5,68,13,6]},
    {id:'clapper',label:'Claqueta',icon:'🎬',score:2,box:[87,41,12,9]},
    {id:'chair',label:'Silla plegable',icon:'🪑',score:2,box:[59,34,10,19]},
    {id:'sneakers',label:'Zapatillas',icon:'👟',score:2,box:[75,57,13,8]},
    {id:'orangeCushion',label:'Cojín naranja',icon:'🟧',score:2,box:[35,36,17,12]},
    {id:'stripedCushion',label:'Cojín de rayas',icon:'▤',score:2,box:[14,41,17,13]},
    {id:'mug',label:'Taza',icon:'☕',score:3,box:[25,65,11,11]},
    {id:'basket',label:'Cesta de mimbre',icon:'🧺',score:3,box:[47,78,23,14]},
    {id:'remote',label:'Mando a distancia',icon:'🎛️',score:4,box:[72,67,7,5]},
    {id:'candle',label:'Vela',icon:'🕯️',score:4,box:[51,64,5,6]},
    {id:'catPicture',label:'Cuadro del gato',icon:'🖼️',score:4,box:[35.5,10.5,7,10]}
  ];
  const DIFFICULTY={easy:{target:1,hints:5,mult:1.15},medium:{target:2,hints:4,mult:1},hard:{target:3,hints:3,mult:.9},expert:{target:4,hints:2,mult:.8}};
  const BASE_TIME={6:90,8:120,10:150,12:180,15:240};
  const $=id=>document.getElementById(id);
  const setup=$('setup-screen'),play=$('play-screen'),tray=$('target-tray'),layer=$('hit-layer'),sceneCanvas=$('scene-canvas');
  const state={difficulty:'medium',count:8,mode:'relax',hints:4,hintsUsed:0,targets:[],found:new Set(),seconds:0,timerId:null,zoom:1,startedAt:0};

  function selected(name){return document.querySelector('input[name="'+name+'"]:checked')?.value}
  function shuffle(list){return list.map(v=>({v:v,n:Math.random()})).sort((a,b)=>a.n-b.n).map(x=>x.v)}
  function updateSetup(resetHints=false){
    state.difficulty=selected('difficulty')||'medium';
    state.count=Number(selected('objectCount')||8);
    state.mode=selected('timeMode')||'relax';
    const cfg=DIFFICULTY[state.difficulty];
    const hintSelect=$('hint-count');
    if(resetHints) hintSelect.value=String(cfg.hints);
    state.hints=Number(hintSelect.value);
    const seconds=Math.round((BASE_TIME[state.count]||120)*cfg.mult);
    $('time-estimate').textContent=state.mode==='timed'?'Tiempo de partida: '+formatTime(seconds):'Sin límite de tiempo';
  }
  function chooseTargets(){
    if(state.count>=OBJECTS.length) return shuffle([...OBJECTS]);
    const target=DIFFICULTY[state.difficulty].target;
    const ranked=[...OBJECTS].sort((a,b)=>{
      const da=Math.abs(a.score-target),db=Math.abs(b.score-target);
      return da-db || (Math.random()-.5);
    });
    return shuffle(ranked.slice(0,Math.min(state.count,ranked.length)));
  }
  function formatTime(total){
    total=Math.max(0,Math.floor(total));
    return String(Math.floor(total/60)).padStart(2,'0')+':'+String(total%60).padStart(2,'0');
  }
  function renderTargets(){
    tray.innerHTML='';layer.innerHTML='';
    state.targets.forEach(obj=>{
      const card=document.createElement('div');
      card.className='target-card';card.dataset.id=obj.id;
      card.innerHTML='<span class="target-icon" aria-hidden="true">'+obj.icon+'</span><span>'+obj.label+'</span>';
      tray.appendChild(card);
      const hit=document.createElement('button');
      hit.type='button';hit.className='hitbox';hit.dataset.id=obj.id;hit.setAttribute('aria-label',obj.label);
      const x=obj.box[0],y=obj.box[1],w=obj.box[2],h=obj.box[3];
      Object.assign(hit.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
      hit.addEventListener('click',event=>{event.stopPropagation();findObject(obj,hit)});
      layer.appendChild(hit);
    });
    updateProgress();
  }
  function findObject(obj,hit){
    if(state.found.has(obj.id)) return;
    state.found.add(obj.id);hit.classList.remove('hinted');hit.classList.add('found');
    const card=tray.querySelector('[data-id="'+obj.id+'"]');if(card)card.classList.add('found');
    const check=document.createElement('span');check.className='found-check';check.textContent='✓';
    const x=obj.box[0],y=obj.box[1],w=obj.box[2],h=obj.box[3];
    check.style.left=(x+w/2)+'%';check.style.top=(y+h/2)+'%';layer.appendChild(check);
    setTimeout(()=>check.remove(),1000);
    $('feedback').textContent='Encontrado: '+obj.label;
    updateProgress();
    if(state.found.size===state.targets.length) setTimeout(finishGame,450);
  }
  function updateProgress(){
    const text=state.found.size+'/'+state.targets.length;
    $('progress').textContent=text;$('progress-large').textContent=text;
    $('hint-value').textContent=state.hints;
    $('hint-button').disabled=state.hints<=0 || state.found.size===state.targets.length;
  }
  function useHint(){
    if(state.hints<=0) return;
    const pending=state.targets.filter(o=>!state.found.has(o.id));
    if(!pending.length) return;
    layer.querySelectorAll('.hinted').forEach(n=>n.classList.remove('hinted'));
    const obj=pending[Math.floor(Math.random()*pending.length)];
    const hit=layer.querySelector('[data-id="'+obj.id+'"]');
    state.hints--;state.hintsUsed++;updateProgress();
    if(hit)hit.classList.add('hinted');
    $('feedback').textContent='La pista señala una zona durante unos segundos.';
    setTimeout(()=>{if(hit)hit.classList.remove('hinted')},2400);
  }
  function setZoom(next){
    state.zoom=Math.max(1,Math.min(2,next));
    sceneCanvas.style.width=(state.zoom*100)+'%';
    $('zoom-value').textContent=Math.round(state.zoom*100)+'%';
    $('zoom-out').disabled=state.zoom<=1;$('zoom-in').disabled=state.zoom>=2;
  }
  function startTimer(){
    clearInterval(state.timerId);state.timerId=null;
    if(state.mode!=='timed'){$('timer-pill').hidden=true;return}
    state.seconds=Math.round((BASE_TIME[state.count]||120)*DIFFICULTY[state.difficulty].mult);
    $('timer').textContent=formatTime(state.seconds);$('timer-pill').hidden=false;
    state.timerId=setInterval(()=>{
      state.seconds--;$('timer').textContent=formatTime(state.seconds);
      if(state.seconds<=0){clearInterval(state.timerId);state.timerId=null;timeUp()}
    },1000);
  }
  function timeUp(){
    layer.querySelectorAll('.hitbox').forEach(b=>b.disabled=true);
    $('finish-title').textContent='Tiempo agotado';
    $('finish-summary').textContent='Has encontrado '+state.found.size+' de '+state.targets.length+'. Puedes repetir la escena o cambiar a modo sin tiempo.';
    $('finish-dialog').showModal();
  }
  function startGame(){
    state.difficulty=selected('difficulty')||'medium';
    state.count=Number(selected('objectCount')||8);
    state.mode=selected('timeMode')||'relax';
    state.hints=Number($('hint-count').value);state.hintsUsed=0;state.found.clear();state.targets=chooseTargets();state.startedAt=Date.now();
    setup.hidden=true;play.hidden=false;setZoom(1);renderTargets();startTimer();
    $('feedback').textContent='Toca un objeto cuando lo encuentres.';
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function finishGame(){
    clearInterval(state.timerId);state.timerId=null;
    const elapsed=Math.round((Date.now()-state.startedAt)/1000);
    const timeText=state.mode==='timed'?' con '+formatTime(state.seconds)+' restantes':' en '+formatTime(elapsed);
    $('finish-title').textContent='Encontrados todos';
    $('finish-summary').textContent='Has localizado '+state.targets.length+' objetos'+timeText+'. Pistas utilizadas: '+state.hintsUsed+'.';
    try{localStorage.setItem('mineuri-hidden-last',JSON.stringify({difficulty:state.difficulty,count:state.count,mode:state.mode,hints:Number($('hint-count').value)}));}catch{}
    $('finish-dialog').showModal();
  }
  function showSetup(){
    clearInterval(state.timerId);state.timerId=null;
    play.hidden=true;setup.hidden=false;
    if($('finish-dialog').open)$('finish-dialog').close();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function restore(){
    try{
      const saved=JSON.parse(localStorage.getItem('mineuri-hidden-last')||'null');
      if(!saved)return;
      [['difficulty',saved.difficulty],['objectCount',String(saved.count)],['timeMode',saved.mode]].forEach(pair=>{
        const el=document.querySelector('input[name="'+pair[0]+'"][value="'+pair[1]+'"]');
        if(el)el.checked=true;
      });
      if(Number.isFinite(saved.hints))$('hint-count').value=String(Math.max(0,Math.min(5,saved.hints)));
    }catch{}
  }
  document.querySelectorAll('input[name="difficulty"]').forEach(el=>el.addEventListener('change',()=>updateSetup(true)));
  document.querySelectorAll('input[name="objectCount"],input[name="timeMode"]').forEach(el=>el.addEventListener('change',()=>updateSetup(false)));
  $('hint-count').addEventListener('change',()=>{state.hints=Number($('hint-count').value)});
  $('start-game').addEventListener('click',startGame);$('hint-button').addEventListener('click',useHint);
  $('zoom-in').addEventListener('click',()=>setZoom(state.zoom+.25));$('zoom-out').addEventListener('click',()=>setZoom(state.zoom-.25));
  $('scene-viewport').addEventListener('click',event=>{if(!event.target.closest('.hitbox'))$('feedback').textContent='No está ahí. Sigue buscando.'});
  $('change-settings').addEventListener('click',showSetup);$('finish-settings').addEventListener('click',showSetup);
  $('play-again').addEventListener('click',()=>{$('finish-dialog').close();startGame()});
  restore();updateSetup(false);setZoom(1);
})();