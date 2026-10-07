'use strict';
(() => {
  const SCENES=[
    {
      id:'noche-en-casa',
      title:'Noche en casa',
      alt:'Salón acogedor al anochecer lleno de objetos y detalles para explorar.',
      parts:'assets/scene-parts',
      partsCount:5,
      objects:[
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
      ]
    },
    {
      id:'cafe-entre-libros',
      title:'Café entre libros',
      alt:'Cafetería librería acogedora al atardecer con muchos objetos y detalles para explorar.',
      image:'assets/scenes/cafe-entre-libros.webp',
      objects:[
        {id:'redMug',label:'Taza roja',icon:'☕',score:1,box:[20,52,15,15]},
        {id:'readingGlasses',label:'Gafas de lectura',icon:'👓',score:2,box:[39,69,12,7]},
        {id:'fountainPen',label:'Pluma estilográfica',icon:'🖋️',score:3,box:[34,74,15,7]},
        {id:'notebook',label:'Cuaderno',icon:'📓',score:1,box:[25,72,28,17]},
        {id:'croissant',label:'Cruasán',icon:'🥐',score:1,box:[34,56,19,13]},
        {id:'brassKey',label:'Llave de latón',icon:'🔑',score:3,box:[17,78,10,9]},
        {id:'polaroid',label:'Cámara instantánea',icon:'📷',score:2,box:[80,22,12,10]},
        {id:'hourglass',label:'Reloj de arena',icon:'⏳',score:3,box:[82,0,8,13]},
        {id:'greenBookmark',label:'Marcapáginas verde',icon:'🔖',score:3,box:[52,74,14,15]},
        {id:'pocketWatch',label:'Reloj de bolsillo',icon:'🕰️',score:2,box:[18,63,13,13]},
        {id:'lemonTart',label:'Tarta de limón',icon:'🥧',score:1,box:[56,62,18,14]},
        {id:'scarf',label:'Bufanda',icon:'🧣',score:2,box:[74,56,20,36]},
        {id:'chessKnight',label:'Caballo de ajedrez',icon:'♞',score:4,box:[88,3,7,11]},
        {id:'headphones',label:'Auriculares',icon:'🎧',score:2,box:[63,48,17,15]},
        {id:'postcard',label:'Postal',icon:'🖼️',score:3,box:[63,79,22,14]}
      ]
    },
    {
      id:'estudio-artista',
      title:'El estudio del artista',
      alt:'Estudio de artista cálido y lleno de pinturas, libros, materiales y pequeños objetos.',
      image:'assets/scenes/estudio-artista.webp',
      objects:[
        {id:'palette',label:'Paleta de pintura',icon:'🎨',score:1,box:[19,58,27,15]},
        {id:'apple',label:'Manzana roja',icon:'🍎',score:2,box:[23,51,9,10]},
        {id:'ceramicMug',label:'Taza de cerámica',icon:'☕',score:2,box:[36,47,10,12]},
        {id:'blueScissors',label:'Tijeras azules',icon:'✂️',score:3,box:[82,79,13,9]},
        {id:'sketchbook',label:'Cuaderno de dibujo',icon:'📓',score:1,box:[35,58,39,21]},
        {id:'violin',label:'Violín',icon:'🎻',score:1,box:[47,25,12,24]},
        {id:'bust',label:'Busto',icon:'🗿',score:2,box:[29,19,10,15]},
        {id:'tapeMeasure',label:'Cinta métrica',icon:'📏',score:3,box:[70,73,18,8]},
        {id:'feather',label:'Pluma blanca',icon:'🪶',score:3,box:[38,75,18,8]},
        {id:'seashell',label:'Concha',icon:'🐚',score:3,box:[63,76,9,9]},
        {id:'filmRoll',label:'Rollo fotográfico',icon:'🎞️',score:4,box:[52,79,12,9]},
        {id:'greenGlove',label:'Guante verde',icon:'🧤',score:2,box:[76,52,12,19]},
        {id:'origami',label:'Grulla de papel',icon:'🕊️',score:4,box:[15,37,11,10]},
        {id:'lantern',label:'Farol',icon:'🏮',score:1,box:[0,27,10,20]},
        {id:'stripedSock',label:'Calcetín de rayas',icon:'🧦',score:4,box:[89,54,9,19]}
      ]
    },
    {
      id:'mercadillo-domingo',
      title:'Mercadillo de domingo',
      alt:'Mercadillo de antigüedades al atardecer lleno de libros, objetos vintage y detalles.',
      image:'assets/scenes/mercadillo-domingo.webp',
      objects:[
        {id:'typewriter',label:'Máquina de escribir',icon:'⌨️',score:1,box:[0,37,25,19]},
        {id:'vinyl',label:'Disco de vinilo',icon:'💿',score:1,box:[83,59,15,19]},
        {id:'marketKey',label:'Llave de latón',icon:'🔑',score:3,box:[13,60,11,7]},
        {id:'teapot',label:'Tetera',icon:'🫖',score:1,box:[26,44,15,18]},
        {id:'camera',label:'Cámara',icon:'📷',score:2,box:[55,49,12,12]},
        {id:'alarm',label:'Despertador',icon:'⏰',score:2,box:[43,43,10,14]},
        {id:'umbrella',label:'Paraguas',icon:'☂️',score:3,box:[94,45,6,29]},
        {id:'marketKnight',label:'Caballo de ajedrez',icon:'♞',score:4,box:[66,61,8,13]},
        {id:'redScarf',label:'Bufanda roja',icon:'🧣',score:1,box:[0,65,34,27]},
        {id:'magnifying',label:'Lupa',icon:'🔍',score:2,box:[44,61,15,12]},
        {id:'marketPostcard',label:'Postal',icon:'🖼️',score:3,box:[34,70,20,12]},
        {id:'wateringCan',label:'Regadera',icon:'🚿',score:2,box:[69,78,15,19]},
        {id:'binoculars',label:'Prismáticos',icon:'🔭',score:3,box:[83,28,15,9]},
        {id:'suitcaseTag',label:'Etiqueta de maleta',icon:'🏷️',score:4,box:[73,44,11,15]},
        {id:'pocketMirror',label:'Espejo de bolsillo',icon:'🪞',score:3,box:[25,61,10,13]}
      ]
    },
    {
      id:'invernadero',
      title:'El invernadero',
      alt:'Invernadero luminoso lleno de plantas, macetas, herramientas y pequeños objetos.',
      image:'assets/scenes/invernadero.webp',
      objects:[
        {id:'greenhouseCan',label:'Regadera',icon:'🚿',score:1,box:[9,65,18,26]},
        {id:'trowel',label:'Paleta de jardín',icon:'🛠️',score:2,box:[55,68,19,10]},
        {id:'seedPacket',label:'Sobre de semillas',icon:'🌻',score:3,box:[71,66,10,10]},
        {id:'ladybugMug',label:'Taza de mariquitas',icon:'☕',score:2,box:[61,48,11,13]},
        {id:'sprayBottle',label:'Pulverizador',icon:'💦',score:2,box:[76,42,11,18]},
        {id:'butterflyNet',label:'Red de mariposas',icon:'🦋',score:1,box:[5,13,16,28]},
        {id:'gardenGloves',label:'Guantes de jardín',icon:'🧤',score:2,box:[82,77,18,14]},
        {id:'lemon',label:'Limón',icon:'🍋',score:1,box:[72,54,11,11]},
        {id:'botanicalNotebook',label:'Cuaderno botánico',icon:'📓',score:2,box:[47,59,24,14]},
        {id:'thermometer',label:'Termómetro',icon:'🌡️',score:4,box:[93,3,5,24]},
        {id:'birdhouse',label:'Casita para pájaros',icon:'🐦',score:3,box:[66,2,11,13]},
        {id:'stripedRibbon',label:'Cinta de rayas',icon:'🎀',score:3,box:[74,83,22,14]},
        {id:'greenhouseLantern',label:'Farol',icon:'🏮',score:1,box:[84,33,11,21]},
        {id:'snail',label:'Caracol',icon:'🐌',score:4,box:[88,53,10,11]},
        {id:'smallKey',label:'Llave pequeña',icon:'🔑',score:4,box:[69,76,10,8]}
      ]
    },
    {
      id:'ultimo-tren',
      title:'Último tren',
      alt:'Elegante vagón de tren nocturno con equipaje, lámparas y objetos de viaje.',
      image:'assets/scenes/ultimo-tren.webp',
      objects:[
        {id:'trainTicket',label:'Billete de tren',icon:'🎫',score:3,box:[28,79,18,9]},
        {id:'trainSuitcase',label:'Maleta verde',icon:'🧳',score:1,box:[82,61,16,34]},
        {id:'newspaper',label:'Periódico',icon:'📰',score:1,box:[3,64,30,14]},
        {id:'redUmbrella',label:'Paraguas rojo',icon:'☂️',score:2,box:[89,38,9,26]},
        {id:'thermos',label:'Termo verde',icon:'🧴',score:1,box:[21,41,10,21]},
        {id:'trainKnight',label:'Caballo de ajedrez',icon:'♞',score:4,box:[46,17,7,12]},
        {id:'paperback',label:'Novela',icon:'📕',score:1,box:[53,64,25,14]},
        {id:'trainWatch',label:'Reloj de bolsillo',icon:'🕰️',score:2,box:[30,67,12,12]},
        {id:'trainScarf',label:'Bufanda',icon:'🧣',score:1,box:[63,24,19,29]},
        {id:'trainCamera',label:'Cámara',icon:'📷',score:2,box:[37,50,13,13]},
        {id:'trainHeadphones',label:'Auriculares',icon:'🎧',score:2,box:[49,43,16,14]},
        {id:'trainCroissant',label:'Cruasán',icon:'🥐',score:1,box:[34,59,18,10]},
        {id:'flashlight',label:'Linterna',icon:'🔦',score:3,box:[57,57,15,8]},
        {id:'trainPostcard',label:'Postal',icon:'🖼️',score:3,box:[44,76,22,10]},
        {id:'leatherGlove',label:'Guante de cuero',icon:'🧤',score:3,box:[4,62,18,11]}
      ]
    }
  ];

  const DIFFICULTY={easy:{target:1,hints:5,mult:1.15},medium:{target:2,hints:4,mult:1},hard:{target:3,hints:3,mult:.9},expert:{target:4,hints:2,mult:.8}};
  const BASE_TIME={6:90,8:120,10:150,12:180,15:240};
  const $=id=>document.getElementById(id);
  const setup=$('setup-screen'),play=$('play-screen'),tray=$('target-tray'),layer=$('hit-layer'),sceneCanvas=$('scene-canvas'),sceneImage=$('scene-image');
  const state={difficulty:'medium',count:8,mode:'relax',hints:4,hintsTotal:4,hintsUsed:0,targets:[],found:new Set(),seconds:0,timerId:null,zoom:1,startedAt:0,sceneIndex:0,completedScenes:new Set(),finishAction:'next'};

  function selected(name){return document.querySelector('input[name="'+name+'"]:checked')?.value}
  function shuffle(list){return list.map(v=>({v:v,n:Math.random()})).sort((a,b)=>a.n-b.n).map(x=>x.v)}
  function currentScene(){return SCENES[state.sceneIndex]}

  function updateSetup(resetHints=false){
    state.difficulty=selected('difficulty')||'medium';
    state.count=Number(selected('objectCount')||8);
    state.mode=selected('timeMode')||'relax';
    const cfg=DIFFICULTY[state.difficulty];
    const hintSelect=$('hint-count');
    if(resetHints) hintSelect.value=String(cfg.hints);
    state.hintsTotal=Number(hintSelect.value);
    state.hints=state.hintsTotal;
    const seconds=Math.round((BASE_TIME[state.count]||120)*cfg.mult);
    $('time-estimate').textContent=state.mode==='timed'?'Tiempo por escena: '+formatTime(seconds):'Sin límite de tiempo';
  }

  function chooseTargets(){
    const objects=currentScene().objects;
    if(state.count>=objects.length) return shuffle([...objects]);
    const target=DIFFICULTY[state.difficulty].target;
    const ranked=shuffle([...objects]).sort((a,b)=>Math.abs(a.score-target)-Math.abs(b.score-target));
    return ranked.slice(0,Math.min(state.count,ranked.length));
  }

  function formatTime(total){
    total=Math.max(0,Math.floor(total));
    return String(Math.floor(total/60)).padStart(2,'0')+':'+String(total%60).padStart(2,'0');
  }

  function loadCurrentScene(){
    const scene=currentScene();
    $('scene-kicker').textContent='ESCENA '+String(state.sceneIndex+1).padStart(2,'0')+' DE '+String(SCENES.length).padStart(2,'0');
    $('scene-title').textContent=scene.title;
    sceneImage.alt=scene.alt;
    sceneImage.setAttribute('aria-busy','true');

    if(scene.parts){
      sceneImage.removeAttribute('src');
      delete sceneImage.dataset.sceneLoaded;
      delete sceneImage.dataset.sceneError;
      sceneImage.dataset.sceneParts=scene.parts;
      sceneImage.dataset.scenePartsCount=String(scene.partsCount||5);
      if(window.MineuriSceneLoader) window.MineuriSceneLoader.load(sceneImage);
    }else{
      delete sceneImage.dataset.sceneParts;
      delete sceneImage.dataset.scenePartsCount;
      delete sceneImage.dataset.sceneLoaded;
      delete sceneImage.dataset.sceneError;
      sceneImage.addEventListener('load',()=>{
        sceneImage.dataset.sceneLoaded='true';
        sceneImage.removeAttribute('aria-busy');
      },{once:true});
      sceneImage.addEventListener('error',()=>{
        sceneImage.removeAttribute('aria-busy');
        sceneImage.dataset.sceneError='true';
      },{once:true});
      sceneImage.src=scene.image;
      if(sceneImage.complete && sceneImage.naturalWidth){
        sceneImage.dataset.sceneLoaded='true';
        sceneImage.removeAttribute('aria-busy');
      }
    }
  }

  function renderTargets(){
    tray.innerHTML='';
    layer.innerHTML='';
    state.targets.forEach(obj=>{
      const card=document.createElement('div');
      card.className='target-card';
      card.dataset.id=obj.id;
      card.innerHTML='<span class="target-icon" aria-hidden="true">'+obj.icon+'</span><span>'+obj.label+'</span>';
      tray.appendChild(card);

      const hit=document.createElement('button');
      hit.type='button';
      hit.className='hitbox';
      hit.dataset.id=obj.id;
      hit.setAttribute('aria-label',obj.label);
      const x=obj.box[0],y=obj.box[1],w=obj.box[2],h=obj.box[3];
      Object.assign(hit.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
      hit.addEventListener('click',event=>{
        event.stopPropagation();
        findObject(obj,hit);
      });
      layer.appendChild(hit);
    });
    updateProgress();
  }

  function findObject(obj,hit){
    if(state.found.has(obj.id)) return;
    state.found.add(obj.id);
    hit.classList.remove('hinted');
    hit.classList.add('found');
    const card=tray.querySelector('[data-id="'+obj.id+'"]');
    if(card) card.classList.add('found');

    const check=document.createElement('span');
    check.className='found-check';
    check.textContent='✓';
    const x=obj.box[0],y=obj.box[1],w=obj.box[2],h=obj.box[3];
    check.style.left=(x+w/2)+'%';
    check.style.top=(y+h/2)+'%';
    layer.appendChild(check);
    setTimeout(()=>check.remove(),1000);

    $('feedback').textContent='Encontrado: '+obj.label;
    updateProgress();
    if(state.found.size===state.targets.length) setTimeout(finishGame,450);
  }

  function updateProgress(){
    const text=state.found.size+'/'+state.targets.length;
    $('progress').textContent=text;
    $('progress-large').textContent=text;
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
    state.hints--;
    state.hintsUsed++;
    updateProgress();
    if(hit) hit.classList.add('hinted');
    $('feedback').textContent='La pista señala una zona durante unos segundos.';
    setTimeout(()=>{if(hit) hit.classList.remove('hinted')},2400);
  }

  function setZoom(next){
    state.zoom=Math.max(1,Math.min(2,next));
    sceneCanvas.style.width=(state.zoom*100)+'%';
    $('zoom-value').textContent=Math.round(state.zoom*100)+'%';
    $('zoom-out').disabled=state.zoom<=1;
    $('zoom-in').disabled=state.zoom>=2;
  }

  function startTimer(){
    clearInterval(state.timerId);
    state.timerId=null;
    if(state.mode!=='timed'){
      $('timer-pill').hidden=true;
      return;
    }
    state.seconds=Math.round((BASE_TIME[state.count]||120)*DIFFICULTY[state.difficulty].mult);
    $('timer').textContent=formatTime(state.seconds);
    $('timer-pill').hidden=false;
    state.timerId=setInterval(()=>{
      state.seconds--;
      $('timer').textContent=formatTime(state.seconds);
      if(state.seconds<=0){
        clearInterval(state.timerId);
        state.timerId=null;
        timeUp();
      }
    },1000);
  }

  function configureFinishButtons(action){
    state.finishAction=action;
    const primary=$('finish-primary');
    const repeat=$('repeat-scene');

    if(action==='next'){
      primary.textContent='Siguiente escena →';
      repeat.hidden=false;
      repeat.textContent='Repetir escena';
    }else if(action==='restart'){
      primary.textContent='Jugar de nuevo';
      repeat.hidden=false;
      repeat.textContent='Repetir última escena';
    }else{
      primary.textContent='Repetir escena';
      repeat.hidden=true;
    }
  }

  function timeUp(){
    layer.querySelectorAll('.hitbox').forEach(b=>b.disabled=true);
    $('finish-kicker').textContent='TIEMPO AGOTADO';
    $('finish-title').textContent='Se acabó el tiempo';
    $('finish-summary').textContent='Has encontrado '+state.found.size+' de '+state.targets.length+' objetos en '+currentScene().title+'. Puedes repetir la escena o cambiar los ajustes.';
    configureFinishButtons('retry');
    $('finish-dialog').showModal();
  }

  function savePreferences(){
    try{
      localStorage.setItem('mineuri-hidden-last',JSON.stringify({
        difficulty:state.difficulty,
        count:state.count,
        mode:state.mode,
        hints:state.hintsTotal
      }));
    }catch{}
  }

  function startScene(){
    if($('finish-dialog').open) $('finish-dialog').close();
    clearInterval(state.timerId);
    state.timerId=null;
    state.hints=state.hintsTotal;
    state.hintsUsed=0;
    state.found.clear();
    state.targets=chooseTargets();
    state.startedAt=Date.now();

    loadCurrentScene();
    setZoom(1);
    renderTargets();
    startTimer();
    $('feedback').textContent='Toca un objeto cuando lo encuentres.';
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function startGame(){
    state.difficulty=selected('difficulty')||'medium';
    state.count=Number(selected('objectCount')||8);
    state.mode=selected('timeMode')||'relax';
    state.hintsTotal=Number($('hint-count').value);
    state.sceneIndex=0;
    state.completedScenes.clear();
    setup.hidden=true;
    play.hidden=false;
    savePreferences();
    startScene();
  }

  function finishGame(){
    clearInterval(state.timerId);
    state.timerId=null;
    const scene=currentScene();
    state.completedScenes.add(scene.id);
    const elapsed=Math.round((Date.now()-state.startedAt)/1000);
    const timeText=state.mode==='timed'?' con '+formatTime(state.seconds)+' restantes':' en '+formatTime(elapsed);

    if(state.sceneIndex<SCENES.length-1){
      const next=SCENES[state.sceneIndex+1];
      $('finish-kicker').textContent='ESCENA COMPLETADA';
      $('finish-title').textContent=scene.title+' completada';
      $('finish-summary').textContent='Has localizado '+state.targets.length+' objetos'+timeText+'. Pistas utilizadas: '+state.hintsUsed+'. La siguiente escena es '+next.title+'.';
      configureFinishButtons('next');
    }else{
      $('finish-kicker').textContent='RECORRIDO COMPLETADO';
      $('finish-title').textContent='Has completado las seis escenas';
      $('finish-summary').textContent='Última escena superada'+timeText+'. Has terminado todo el recorrido de Objetos ocultos.';
      configureFinishButtons('restart');
    }

    savePreferences();
    $('finish-dialog').showModal();
  }

  function handlePrimaryFinish(){
    if(state.finishAction==='next'){
      state.sceneIndex++;
      startScene();
    }else if(state.finishAction==='restart'){
      state.sceneIndex=0;
      state.completedScenes.clear();
      startScene();
    }else{
      startScene();
    }
  }

  function repeatScene(){
    startScene();
  }

  function showSetup(){
    clearInterval(state.timerId);
    state.timerId=null;
    play.hidden=true;
    setup.hidden=false;
    if($('finish-dialog').open) $('finish-dialog').close();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function restore(){
    try{
      const saved=JSON.parse(localStorage.getItem('mineuri-hidden-last')||'null');
      if(!saved) return;
      [['difficulty',saved.difficulty],['objectCount',String(saved.count)],['timeMode',saved.mode]].forEach(pair=>{
        const el=document.querySelector('input[name="'+pair[0]+'"][value="'+pair[1]+'"]');
        if(el) el.checked=true;
      });
      if(Number.isFinite(saved.hints)) $('hint-count').value=String(Math.max(0,Math.min(5,saved.hints)));
    }catch{}
  }

  document.querySelectorAll('input[name="difficulty"]').forEach(el=>el.addEventListener('change',()=>updateSetup(true)));
  document.querySelectorAll('input[name="objectCount"],input[name="timeMode"]').forEach(el=>el.addEventListener('change',()=>updateSetup(false)));
  $('hint-count').addEventListener('change',()=>{
    state.hintsTotal=Number($('hint-count').value);
    state.hints=state.hintsTotal;
  });
  $('start-game').addEventListener('click',startGame);
  $('hint-button').addEventListener('click',useHint);
  $('zoom-in').addEventListener('click',()=>setZoom(state.zoom+.25));
  $('zoom-out').addEventListener('click',()=>setZoom(state.zoom-.25));
  $('scene-viewport').addEventListener('click',event=>{
    if(!event.target.closest('.hitbox')) $('feedback').textContent='No está ahí. Sigue buscando.';
  });
  $('change-settings').addEventListener('click',showSetup);
  $('finish-settings').addEventListener('click',showSetup);
  $('finish-primary').addEventListener('click',handlePrimaryFinish);
  $('repeat-scene').addEventListener('click',repeatScene);

  restore();
  updateSetup(false);
  setZoom(1);
})();