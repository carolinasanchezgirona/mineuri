'use strict';
(() => {
  const STORAGE = 'detective-barrio-caja-azul-v1';
  const SCENES = {
    biblioteca: {name:'Biblioteca',subtitle:'Donde empezó todo',image:'assets/biblioteca.webp',alt:'Biblioteca de barrio con mesas de madera, estanterías y una caja azul sobre una mesa. Es la escena de esta mañana, antes de su desaparición.',description:'Una sala de lectura tranquila. Aquí estaba la caja esta mañana.',people:['ines'],object:{id:'mesa',name:'Mirar la mesa',x:'48%',y:'58%'}},
    plaza: {name:'Plaza',subtitle:'A medio camino',image:'assets/plaza.webp',alt:'Plaza mediterránea con una fuente, bancos, el suelo mojado y un pequeño papel junto a un banco.',description:'El suelo sigue mojado. Dos vecinos recuerdan la mañana.',people:['julian','clara'],object:{id:'nota',name:'Recoger el papel',x:'27%',y:'80%'}},
    quiosco: {name:'Quiosco',subtitle:'Un lugar a cubierto',image:'assets/quiosco.webp',alt:'Quiosco verde de un barrio mediterráneo, con una puerta lateral abierta y una caja azul en el interior.',description:'La puerta lateral da a un pequeño almacén, protegido de la lluvia.',people:['tomas'],object:{id:'puerta',name:'Mirar la puerta',x:'55%',y:'56%'}}
  };
  const CLUES = {
    mesa: {title:'El programa de la exposición',source:'Objeto · Biblioteca',text:'La exposición empieza a las 12:00. El programa indica que las fotografías originales se guardan en una caja azul.'},
    inicio: {title:'La caja estaba en la biblioteca',source:'Inés · Biblioteca',text:'A las 10:00, Inés dejó la caja azul sobre la mesa de lectura y fue a preparar la sala de la exposición.'},
    lluvia: {title:'La lluvia llegó después',source:'Julián · Plaza',text:'A las 10:15 empezó a llover. Julián se refugió bajo el toldo y vio pasar a Clara poco después.'},
    traslado: {title:'Clara llevaba la caja',source:'Clara · Plaza',text:'Después de empezar a llover, Clara llevó una caja azul desde la biblioteca hasta el quiosco para proteger las fotografías.'},
    aviso: {title:'Un aviso que no llegó',source:'Objeto · Plaza',text:'El papel dice: «Inés: he dejado la caja azul a cubierto en el quiosco. Clara». Apareció junto al banco de la plaza.'},
    notaPerdida: {title:'El papel se perdió al volver',source:'Clara · Plaza',text:'Después de dejar la caja en el quiosco, Clara escribió un aviso para Inés. Al volver por la plaza, una ráfaga se llevó el papel.'},
    refugio: {title:'Tomás la guardó a cubierto',source:'Tomás · Quiosco',text:'Clara llegó con la caja cuando ya llovía. Tomás la guardó en el almacén para que no se mojaran las fotografías.'},
    puerta: {title:'Una caja azul a cubierto',source:'Objeto · Quiosco',text:'Tras la puerta verde hay una caja azul, guardada en un lugar seco. Coincide con la descripción del programa de la exposición.'}
  };
  const PEOPLE = {
    ines: {name:'Inés',initial:'I',role:'Bibliotecaria',greeting:'¡Menos mal que has venido! Preparábamos una exposición de fotos del barrio. La caja azul estaba aquí esta mañana y ahora no la encuentro.',brief:'La caja azul estaba aquí esta mañana. Ahora no la encuentro.',questions:[
      {id:'ines-hora',label:'¿Cuándo viste la caja por última vez?',answer:'A las diez en punto la dejé sobre esta mesa. Después fui a preparar la sala de la exposición. Cuando volví, la caja ya no estaba.',brief:'A las 10:00 la dejé en la mesa. Fui a preparar la sala y, al volver, ya no estaba.',clue:'inicio'},
      {id:'ines-caja',label:'¿Cómo reconoceremos la caja?',answer:'Es azul y contiene fotografías antiguas, algunas originales. El programa que dejé sobre la mesa explica qué hay dentro de la caja.',brief:'Es azul y contiene fotografías antiguas. El programa de la mesa explica qué hay dentro.'},
      {id:'ines-quien',label:'¿Quién estaba ayudando con la exposición?',answer:'Clara vino a ayudarme. Se quedó cerca de la entrada mientras yo preparaba la otra sala. Quizá recuerde algo que yo no vi.',brief:'Clara estaba ayudando. Quizá vio algo mientras yo estaba en otra sala.'}
    ]},
    julian: {name:'Julián',initial:'J',role:'Vecino de la plaza',greeting:'¡Vaya mañana! Salí a pasear y acabé refugiado bajo el toldo. La lluvia nos sorprendió a todos.',brief:'Esta mañana empezó a llover y me refugié bajo el toldo.',questions:[
      {id:'julian-lluvia',label:'¿A qué hora empezó a llover?',answer:'A las diez y cuarto. Miré el reloj porque iba a comprar el periódico. Poco después vi a Clara salir de la biblioteca con algo en las manos.',brief:'Empezó a llover a las 10:15. Después vi salir a Clara de la biblioteca.',clue:'lluvia'},
      {id:'julian-direccion',label:'¿Hacia dónde iba Clara?',answer:'Cruzó la plaza hacia el quiosco. Llevaba una caja y la sujetaba con cuidado. Tomás le abrió la puerta lateral.',brief:'Iba hacia el quiosco con una caja. Tomás le abrió la puerta lateral.'},
      {id:'julian-papel',label:'¿Viste algo más?',answer:'Más tarde volví a verla en la plaza, ya sin la caja. Hacía viento y vi un papel volando cerca de aquel banco.',brief:'Más tarde Clara volvió sin la caja. Vi un papel volando junto al banco.'}
    ]},
    clara: {name:'Clara',initial:'C',role:'Ayudante de la exposición',greeting:'Estaba ayudando a Inés con las fotografías. Con la lluvia hubo que cambiar los planes de esta mañana.',brief:'Ayudaba a Inés con las fotos. La lluvia cambió nuestros planes.',questions:[
      {id:'clara-caja',label:'¿Qué hiciste con la caja?',answer:'Cuando empezó a llover, entraba agua por una ventana junto a la mesa. Llevé la caja azul al quiosco: allí había un almacén seco y Tomás podía guardarla.',brief:'Después de empezar a llover, llevé la caja al quiosco para proteger las fotos.',clue:'traslado'},
      {id:'clara-aviso',label:'¿Pudiste avisar a Inés?',answer:'Después de dejar la caja, escribí una nota para Inés. Al volver por la plaza, una ráfaga se llevó el papel. Lo busqué, pero no lo encontré.',brief:'Escribí una nota después de dejar la caja. Al volver, el viento se llevó el papel.',clue:'notaPerdida'},
      {id:'clara-motivo',label:'¿Por qué elegiste el quiosco?',answer:'Era el lugar más cercano con espacio seco para guardarla. Quería proteger las fotos mientras Inés seguía preparando la sala. No pretendía llevármelas.',brief:'El quiosco estaba cerca y tenía un almacén seco. Quería proteger las fotos.'}
    ]},
    tomas: {name:'Tomás',initial:'T',role:'Quiosquero',greeting:'Buenos días. ¿Buscas algo? Esta mañana he vendido periódicos, prestado un paraguas y guardado un encargo.',brief:'Esta mañana guardé un encargo. ¿Qué buscas?',questions:[
      {id:'tomas-encargo',label:'¿Qué encargo guardaste?',answer:'Clara llegó con una caja azul cuando ya llovía. Me pidió que la dejara en el almacén para que no se mojaran las fotografías. Sigue aquí, tras la puerta verde.',brief:'Clara trajo la caja cuando ya llovía. La guardé en el almacén para proteger las fotos.',clue:'refugio'},
      {id:'tomas-despues',label:'¿Qué pasó después?',answer:'Clara escribió un aviso en un papel y salió hacia la biblioteca. Yo me quedé atendiendo el quiosco. La caja no volvió a salir.',brief:'Clara escribió una nota y volvió hacia la biblioteca. La caja se quedó aquí.'},
      {id:'tomas-recuperar',label:'¿Podemos recuperar la caja?',answer:'Por supuesto. Cuando hayas reconstruido lo que pasó, la devolveremos a Inés. Las fotografías están secas y a salvo.',brief:'Sí. Al resolver el caso, devolveremos la caja. Las fotos están secas.'}
    ]}
  };
  const EVENTS = [
    {id:'inicio',text:'Inés deja la caja en la mesa de la biblioteca.'},
    {id:'lluvia',text:'Empieza a llover en el barrio.'},
    {id:'traslado',text:'Clara lleva la caja al quiosco para protegerla.'},
    {id:'aviso',text:'Clara pierde el aviso al volver por la plaza.'}
  ];
  const fresh = () => ({version:1,started:false,completed:false,view:'play',scene:'biblioteca',person:null,answer:null,inspection:null,clues:[],questions:[],visited:[],people:[],support:'balanced',large:false,hints:0,attempts:0,order:['aviso','lluvia','inicio','traslado'],location:'',reason:'',evidence:[],feedback:'',log:[]});
  function restore() {
    try {
      const saved=JSON.parse(localStorage.getItem(STORAGE));
      if(!saved || saved.version!==1) return fresh();
      const base=fresh();
      ['started','completed','large'].forEach(k=>{if(typeof saved[k]==='boolean')base[k]=saved[k]});
      if(['intro','play','notebook','reconstruct','report','success'].includes(saved.view))base.view=saved.view;
      if(SCENES[saved.scene])base.scene=saved.scene;
      if(PEOPLE[saved.person])base.person=saved.person;
      if(['guided','balanced','challenge'].includes(saved.support))base.support=saved.support;
      base.clues=Array.isArray(saved.clues)?saved.clues.filter(id=>CLUES[id]):[];
      const questionIds=Object.values(PEOPLE).flatMap(p=>p.questions.map(q=>q.id));
      base.questions=Array.isArray(saved.questions)?saved.questions.filter(id=>questionIds.includes(id)):[];
      base.visited=Array.isArray(saved.visited)?saved.visited.filter(id=>SCENES[id]):[];
      base.people=Array.isArray(saved.people)?saved.people.filter(id=>PEOPLE[id]):[];
      base.evidence=Array.isArray(saved.evidence)?saved.evidence.filter(id=>base.clues.includes(id)):[];
      ['hints','attempts'].forEach(k=>{if(Number.isInteger(saved[k]) && saved[k]>=0)base[k]=saved[k]});
      if(Array.isArray(saved.order)&&saved.order.length===4&&new Set(saved.order).size===4&&saved.order.every(id=>EVENTS.some(e=>e.id===id)))base.order=saved.order;
      if(['biblioteca','plaza','quiosco'].includes(saved.location))base.location=saved.location;
      if(['proteccion','venta','prestamo'].includes(saved.reason))base.reason=saved.reason;
      base.log=Array.isArray(saved.log)?saved.log.filter(x=>typeof x==='string').slice(-60):[];
      if(base.completed)base.started=true;
      return base;
    } catch{return fresh();}
  }
  let state=restore();
  let toastTimer;
  let objectiveVisible=false;
  const app=document.getElementById('app');
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{}}
  function log(text){state.log.push(text);state.log=state.log.slice(-60);}
  function toast(text){const el=document.getElementById('toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500);}
  function stopAudio(){if('speechSynthesis' in window)window.speechSynthesis.cancel();}
  function read(text){
    if(!('speechSynthesis' in window)){toast('La lectura en voz alta no está disponible en este navegador. Puedes leer todo en pantalla.');return;}
    stopAudio();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='es-ES';utterance.rate=.9;
    const voice=window.speechSynthesis.getVoices().find(v=>v.lang==='es-ES')||window.speechSynthesis.getVoices().find(v=>v.lang.startsWith('es'));
    if(voice)utterance.voice=voice;
    utterance.onerror=()=>toast('No se pudo reproducir el audio. El texto sigue disponible en pantalla.');window.speechSynthesis.speak(utterance);
  }
  function addClue(id){if(!state.clues.includes(id)){state.clues.push(id);log('Pista recogida: '+CLUES[id].title+'.');toast('Añadido al cuaderno: '+CLUES[id].title);}}
  function start(){const first=!state.started;state.started=true;state.view='play';if(!state.visited.includes(state.scene))state.visited.push(state.scene);if(first)log('Comienza la investigación.');persist();render();}
  function navigate(view){stopAudio();state.view=view;state.feedback='';persist();render();window.scrollTo({top:0,behavior:'instant'});}
  function chooseScene(id){if(!SCENES[id])throw new Error('Escenario no válido.');stopAudio();state.scene=id;state.person=null;state.answer=null;state.inspection=null;if(!state.visited.includes(id)){state.visited.push(id);log('Visita: '+SCENES[id].name+'.');}persist();render();}
  function choosePerson(id){if(!SCENES[state.scene].people.includes(id))throw new Error('Esta persona no está en este escenario.');stopAudio();state.person=id;state.answer=null;state.inspection=null;if(!state.people.includes(id)){state.people.push(id);log('Conversación con '+PEOPLE[id].name+'.');}persist();render();document.getElementById('conversation-title')?.focus({preventScroll:true});if(window.innerWidth<760)document.getElementById('conversation-panel')?.scrollIntoView({behavior:'smooth',block:'start'});}
  function ask(id){const person=PEOPLE[state.person];const q=person?.questions.find(q=>q.id===id);if(!q)throw new Error('Pregunta no válida.');stopAudio();state.answer=id;state.inspection=null;if(!state.questions.includes(id))state.questions.push(id);if(q.clue)addClue(q.clue);persist();render();}
  function inspect(){stopAudio();const id=SCENES[state.scene].object.id;state.inspection=id;state.answer=null;addClue(id==='nota'?'aviso':id);persist();render();if(window.innerWidth<760)document.getElementById('conversation-panel')?.scrollIntoView({behavior:'smooth',block:'start'});}
  function help(){
    state.hints++;let content;
    if(!state.clues.includes('inicio'))content='Inés recuerda cuándo dejó la caja en la mesa. Habla con ella en la biblioteca y pregúntale por la última vez que la vio.';
    else if(!state.clues.includes('lluvia'))content='Julián miró el reloj cuando empezó a llover. Lo encontrarás en la plaza.';
    else if(!state.clues.includes('traslado'))content='Clara ayudaba con la exposición. Pregúntale en la plaza qué hizo con la caja.';
    else if(!state.clues.includes('refugio'))content='En el quiosco, Tomás puede contarte qué encargo guardó y por qué.';
    else if(!state.clues.includes('notaPerdida')&&!state.clues.includes('aviso'))content='Falta saber por qué Inés no recibió el aviso. Pregunta a Clara o examina el papel junto al banco de la plaza.';
    else content='Consulta el cuaderno: primero la caja estaba en la mesa; después empezó a llover. ¿Qué hizo Clara para protegerla y qué ocurrió al volver? Para justificar tu conclusión, elige pistas sobre el traslado o el lugar donde quedó guardada.';
    log('Se solicita una ayuda.');persist();document.getElementById('help-content').textContent=content;document.getElementById('help-dialog').showModal();
  }
  function moveEvent(id,direction){const i=state.order.indexOf(id),j=i+direction;if(i<0||j<0||j>=state.order.length)return;[state.order[i],state.order[j]]=[state.order[j],state.order[i]];state.feedback='';persist();render();document.querySelector(`[data-event="${id}"][data-move="${direction}"]`)?.focus({preventScroll:true});}
  function solve(){
    if(!state.location||!state.reason||state.evidence.length<2){state.feedback='Completa el lugar y el motivo, y selecciona al menos dos pistas del cuaderno para apoyar tu explicación.';render();return {correct:false,incomplete:true};}
    state.attempts++;const sequence=state.order.join(',')===EVENTS.map(e=>e.id).join(',');const conclusion=state.location==='quiosco'&&state.reason==='proteccion';const evidence=state.evidence.some(id=>['traslado','refugio','puerta','aviso'].includes(id));
    if(sequence&&conclusion&&evidence){state.completed=true;state.feedback='';state.view='success';log('Caso resuelto: caja en el quiosco, protegida de la lluvia; el aviso se perdió.');persist();render();window.scrollTo({top:0,behavior:'instant'});return {correct:true};}
    state.feedback=!sequence?'Revisa el orden de los acontecimientos. ¿La lluvia empezó antes o después de que Inés dejara la caja? ¿Cuándo se perdió el aviso?':!conclusion?'Las pistas hablan del agua y de un lugar seco. Revisa qué contó Clara y qué guardó Tomás.':'Elige al menos una pista que explique dónde quedó la caja o por qué fue trasladada.';log('Se revisa una propuesta de solución.');persist();render();return {correct:false};
  }
  function settings(){document.getElementById('settings-dialog').showModal();}
  function syncSettings(){document.body.classList.toggle('large',state.large);document.getElementById('large-text').checked=state.large;document.querySelectorAll('input[name="support"]').forEach(input=>input.checked=input.value===state.support);}
  function intro(){return `<section class="shell"><div class="intro"><div class="intro-copy"><p class="eyebrow">El primer misterio del barrio</p><h1>La caja azul</h1><p>Las fotografías de la exposición han desaparecido. Inés necesita tu ayuda para descubrir dónde está la caja y qué ocurrió esta mañana.</p><p class="subtle">Explora tres lugares, habla con los vecinos y reúne las pistas en tu cuaderno.</p>${state.started?'<div class="resume-note">Tu partida está guardada en este dispositivo.</div>':''}<div class="button-row"><button class="button primary" data-action="start">${state.completed?'Volver al caso resuelto':state.started?'Continuar la investigación':'Comenzar el caso'}</button><button class="button secondary" data-action="settings">Elegir apoyos</button></div><div class="intro-note"><span>Sin tiempo límite</span><span>Texto y lectura en voz alta</span></div></div><div class="intro-art"><img src="assets/biblioteca.webp" alt="Una biblioteca de barrio; sobre la mesa hay una caja azul con fotografías." fetchpriority="high"><div class="scene-caption"><small>ESTA MAÑANA · BIBLIOTECA DEL BARRIO</small><p>Una caja. Cuatro vecinos.<br>Una historia por reconstruir.</p></div></div></div><p class="subtle" style="margin:18px 4px 0">La partida se guarda únicamente en este navegador. No necesitas introducir datos personales.</p></section>`;}
  function header(){return `<div class="case-top"><div><p class="eyebrow" style="margin-bottom:7px">Caso 01</p><h1>La caja azul</h1><div class="progress-label">${state.clues.length} de ${Object.keys(CLUES).length} pistas en tu cuaderno · ${state.people.length} de 4 vecinos consultados</div><div class="progress-dots" aria-hidden="true">${Object.keys(CLUES).map((_,i)=>`<span class="${i<state.clues.length?'filled':''}"></span>`).join('')}</div></div><button class="button secondary" data-action="pause">Pausar</button></div><nav class="toolbar" aria-label="Herramientas del caso"><div class="view-tabs">${[['play','Investigar'],['notebook','Cuaderno'],['reconstruct','Resolver']].map(([id,label])=>`<button class="tab ${state.view===id?'active':''}" data-view="${id}" ${state.view===id?'aria-current="page"':''}>${label}${id==='notebook'?`<small>${state.clues.length}</small>`:''}</button>`).join('')}</div><button class="button quiet" data-action="help">Necesito una pista</button></nav>${state.support!=='challenge'||objectiveVisible?`<div class="objective" style="margin-bottom:22px"><p><strong>Tu objetivo</strong>Descubrir dónde está la caja, por qué la trasladaron y en qué orden ocurrió todo.</p><button class="button quiet" data-action="read-objective" aria-label="Escuchar el objetivo">Escuchar</button></div>`:`<button class="button quiet objective-reveal" data-action="objective">Recordar mi objetivo</button>`}`;}
  function conversation(){
    const p=PEOPLE[state.person];const q=p?.questions.find(q=>q.id===state.answer);const text=p?(state.support==='guided'?(q?.brief||p.brief):(q?.answer||p.greeting)):'';
    if(state.inspection){const clueId=state.inspection==='nota'?'aviso':state.inspection;const c=CLUES[clueId];return `<aside class="panel" id="conversation-panel"><div class="panel-head"><p class="eyebrow" style="margin-bottom:10px">Observación</p><h2 id="conversation-title" tabindex="-1">${c.title}</h2><p>${c.source}</p></div><div class="panel-body"><div class="speech"><p>${c.text}</p></div><button class="button quiet listen" data-action="listen-inspection">Escuchar la pista</button><div class="inspect-note"><p><strong>Guardada en el cuaderno.</strong></p><p>Puedes consultarla siempre que lo necesites.</p></div><button class="button secondary full" data-view="notebook" style="margin-top:20px">Abrir mi cuaderno</button></div></aside>`;}
    if(!p)return `<aside class="panel" id="conversation-panel"><div class="empty-panel"><span class="number" aria-hidden="true">${state.visited.length.toString().padStart(2,'0')}</span><p class="eyebrow">${SCENES[state.scene].name}</p><h2>¿Por dónde empezamos?</h2><p>Elige a una persona para conversar o examina el objeto señalado en la escena.</p>${state.support==='guided'?'<div class="summary-note">Cada pista que encuentres se guardará automáticamente en tu cuaderno.</div>':''}</div><div class="panel-bottom">Puedes volver a cualquier lugar y repetir las conversaciones.</div></aside>`;
    return `<aside class="panel" id="conversation-panel"><div class="panel-head"><h2 id="conversation-title" tabindex="-1">${p.name}</h2><p>${p.role}</p></div><div class="panel-body"><div class="dialogue-label">${q?'Lo que recuerda':'Una conversación en el barrio'}</div><div class="speech" aria-live="polite"><p>${text}</p></div><button class="button quiet listen" data-action="listen-dialogue">Escuchar a ${p.name}</button><div class="questions">${p.questions.map(item=>`<button class="question ${state.questions.includes(item.id)?'done':''}" data-question="${item.id}">${item.label}${state.questions.includes(item.id)?'<small>Ya preguntado · puedes escucharlo otra vez</small>':''}</button>`).join('')}</div>${state.support==='guided'&&q?.clue?`<div class="summary-note"><strong>Para recordar:</strong> ${CLUES[q.clue].text}</div>`:''}</div><div class="panel-bottom">${state.questions.filter(id=>p.questions.some(q=>q.id===id)).length} de 3 preguntas exploradas</div></aside>`;
  }
  function play(){const s=SCENES[state.scene];const objectFound=state.clues.includes(s.object.id==='nota'?'aviso':s.object.id);return `<div class="play-layout"><section aria-label="Explorar el barrio"><nav class="location-tabs" aria-label="Lugares del barrio">${Object.entries(SCENES).map(([id,scene])=>`<button class="location ${id===state.scene?'active':''}" data-scene="${id}" ${id===state.scene?'aria-current="location"':''}>${scene.name}<span>${state.visited.includes(id)?'Ya visitado':scene.subtitle}</span></button>`).join('')}</nav><div class="scene"><img src="${s.image}" alt="${s.alt}"><button class="object-pin ${objectFound?'found':''}" style="--x:${s.object.x};--y:${s.object.y}" data-action="inspect">${objectFound?'Volver a mirar':s.object.name}</button><div class="scene-title"><h2>${s.name}</h2><p>${state.scene==='biblioteca'?'Escena de esta mañana, antes de la desaparición':s.subtitle}</p></div></div><p class="scene-instruction">${s.description}</p><div class="people">${s.people.map(id=>{const p=PEOPLE[id];return `<button class="person ${state.person===id&&!state.inspection?'active':''}" data-person="${id}"><span class="person-mark" aria-hidden="true">${p.initial}</span><span><strong>${p.name}</strong><small>${p.role}${state.people.includes(id)?' · Ya consultado':''}</small></span></button>`}).join('')}</div></section>${conversation()}</div>`;}
  function notebook(){return `<section><div class="notebook-header"><div><h2>Mi cuaderno</h2><p class="subtle">Aquí está lo que has descubierto. Puedes releerlo o escucharlo.</p></div><button class="button secondary" data-view="play">Volver al barrio</button></div>${state.clues.length?`<div class="clue-grid">${state.clues.map(id=>{const c=CLUES[id];return `<article class="clue-card"><p class="source">${c.source}</p><h3>${c.title}</h3><p>${c.text}</p><button class="button quiet listen" data-read-clue="${id}" aria-label="Escuchar: ${c.title}">Escuchar</button></article>`}).join('')}</div>`:'<div class="empty-notebook"><h3>La primera pista te espera.</h3><p>Habla con Inés en la biblioteca o examina el programa de la exposición. Tus descubrimientos aparecerán aquí.</p><button class="button primary" data-view="play">Ir a investigar</button></div>'}</section>`;}
  function reconstruct(){const ready=state.clues.length>=4&&state.people.length>=3;return `<section><div class="reconstruct-header"><div><h2>Reconstruye la mañana</h2><p class="subtle">Ordena los acontecimientos y apoya tu explicación con las pistas.</p></div><button class="button secondary" data-view="notebook">Consultar el cuaderno</button></div>${!ready?`<div class="locked-note">Antes de presentar tu explicación, reúne al menos 4 pistas y habla con 3 vecinos. Llevas ${state.clues.length} pistas y ${state.people.length} vecinos.</div>`:''}<div class="puzzle-layout"><div><h3>1. ¿Qué pasó primero?</h3><p class="subtle">Usa los botones para mover cada acontecimiento hacia arriba o hacia abajo.</p><div class="timeline">${state.order.map((id,i)=>`<div class="timeline-item"><span class="timeline-index">${i+1}</span><span class="timeline-text">${EVENTS.find(e=>e.id===id).text}</span><div class="move-buttons"><button class="move" data-event="${id}" data-move="-1" aria-label="Subir: ${EVENTS.find(e=>e.id===id).text}" ${i===0?'disabled':''}>↑</button><button class="move" data-event="${id}" data-move="1" aria-label="Bajar: ${EVENTS.find(e=>e.id===id).text}" ${i===3?'disabled':''}>↓</button></div></div>`).join('')}</div><p class="subtle" style="margin-top:16px">No tienes que memorizarlo todo. Tu cuaderno sigue disponible.</p></div><div class="puzzle-section"><h3>2. Tu explicación</h3><label class="field-label" for="solution-location">¿Dónde está la caja ahora?</label><select id="solution-location"><option value="">Elige un lugar</option>${[['biblioteca','En la biblioteca'],['plaza','En la plaza'],['quiosco','En el almacén del quiosco']].map(([id,label])=>`<option value="${id}" ${state.location===id?'selected':''}>${label}</option>`).join('')}</select><label class="field-label" for="solution-reason">¿Por qué la trasladaron?</label><select id="solution-reason"><option value="">Elige una explicación</option>${[['proteccion','Para proteger las fotografías de la lluvia'],['venta','Para vender las fotografías'],['prestamo','Para prestárselas a un vecino']].map(([id,label])=>`<option value="${id}" ${state.reason===id?'selected':''}>${label}</option>`).join('')}</select><label class="field-label">¿Qué pistas apoyan tu explicación?</label><p class="subtle" style="margin-bottom:8px">Selecciona al menos dos.</p><div class="evidence-list">${state.clues.map(id=>`<label class="evidence-choice"><input type="checkbox" data-evidence="${id}" ${state.evidence.includes(id)?'checked':''}><span>${CLUES[id].title}<small style="display:block;color:var(--muted)">${CLUES[id].source}</small></span></label>`).join('')}</div>${!state.clues.length?'<p class="subtle">Las pistas que recojas aparecerán aquí.</p>':''}<button class="button primary full" data-action="solve" style="margin-top:24px" ${!ready?'disabled':''}>Comprobar mi explicación</button>${state.feedback?`<div class="feedback" role="status"><p>${state.feedback}</p></div>`:''}</div></div></section>`;}
  function success(){return `<section class="shell"><div class="success"><div class="success-copy"><p class="eyebrow">Caso resuelto</p><h1>Las fotos<br>están a salvo.</h1><p>La caja está en el almacén del quiosco. Clara la llevó allí para protegerla de la lluvia.</p><div class="success-summary"><p>Primero, Inés dejó la caja en la biblioteca. Después empezó a llover y Clara la trasladó al quiosco.</p><p>Al regresar, Clara perdió el aviso en la plaza. Por eso Inés no sabía dónde estaba la caja.</p></div><p>Ya podéis devolverla a la biblioteca. La exposición abrirá con todas sus fotografías.</p><div class="button-row"><button class="button primary" data-action="report">Ver el recorrido</button><button class="button secondary" data-action="review">Revisar las pistas</button></div><button class="button quiet" data-action="reset" style="margin-top:15px">Jugar de nuevo</button></div><div class="success-image"><img src="assets/quiosco.webp" alt="La caja azul guardada a cubierto en el quiosco."></div></div></section>`;}
  function report(){return `<section class="report"><p class="eyebrow">Recorrido de la partida</p><h2>La caja azul</h2><p>Un resumen de las acciones realizadas en este dispositivo.</p><div class="stat-strip"><span class="stat-pill">${state.completed?'Caso resuelto':'Caso en curso'}</span><span class="stat-pill">Sin tiempo límite</span></div><dl><dt>Lugares visitados</dt><dd>${state.visited.length} de 3</dd><dt>Vecinos consultados</dt><dd>${state.people.length} de 4</dd><dt>Pistas recogidas</dt><dd>${state.clues.length} de 8</dd><dt>Preguntas exploradas</dt><dd>${state.questions.length} de 12</dd><dt>Ayudas solicitadas</dt><dd>${state.hints}</dd><dt>Explicaciones comprobadas</dt><dd>${state.attempts}</dd><dt>Apoyos actuales</dt><dd>${{guided:'Más apoyos',balanced:'Equilibrado',challenge:'Más reto'}[state.support]}</dd></dl><h3>Cómo avanzó la investigación</h3><ol>${state.log.map(line=>`<li>${escape(line)}</li>`).join('')}</ol><p class="subtle">Estos datos describen el uso del juego. No son puntuaciones neuropsicológicas ni permiten establecer diagnósticos.</p><div class="button-row no-print"><button class="button primary" data-action="print">Imprimir resumen</button><button class="button secondary" data-action="back-success">Volver al caso</button></div></section>`;}
  function render(){syncSettings();if(!state.started||state.view==='intro'){app.innerHTML=intro();return;}if(state.view==='report'){app.innerHTML=`<div class="shell">${report()}</div>`;return;}if(state.completed&&state.view==='success'){app.innerHTML=success();return;}app.innerHTML=`<div class="shell">${header()}${state.view==='notebook'?notebook():state.view==='reconstruct'?reconstruct():play()}${state.completed?'<div class="button-row" style="margin-top:24px"><button class="button secondary" data-action="back-success">Volver al caso resuelto</button><button class="button quiet" data-action="report">Ver el recorrido</button></div>':''}</div>`;}
  app.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||button.disabled)return;
    if(button.dataset.scene){chooseScene(button.dataset.scene);return;}
    if(button.dataset.person){choosePerson(button.dataset.person);return;}
    if(button.dataset.question){ask(button.dataset.question);return;}
    if(button.dataset.view){navigate(button.dataset.view);return;}
    if(button.dataset.readClue){read(CLUES[button.dataset.readClue].text);return;}
    if(button.dataset.event){moveEvent(button.dataset.event,Number(button.dataset.move));return;}
    switch(button.dataset.action){
      case 'start':if(state.completed){state.started=true;state.view='success';persist();render();}else start();break;
      case 'settings':settings();break;
      case 'inspect':inspect();break;
      case 'help':help();break;
      case 'pause':stopAudio();state.view='intro';persist();render();toast('Partida guardada en este dispositivo.');break;
      case 'objective':objectiveVisible=true;render();break;
      case 'read-objective':read('Tu objetivo es descubrir dónde está la caja, por qué la trasladaron y en qué orden ocurrió todo.');break;
      case 'listen-inspection':read(CLUES[state.inspection==='nota'?'aviso':state.inspection].text);break;
      case 'listen-dialogue':{const p=PEOPLE[state.person];const q=p.questions.find(q=>q.id===state.answer);read(state.support==='guided'?(q?.brief||p.brief):(q?.answer||p.greeting));break;}
      case 'solve':solve();break;
      case 'report':navigate('report');break;
      case 'review':navigate('notebook');break;
      case 'reset':document.getElementById('reset-dialog').showModal();break;
      case 'back-success':navigate(state.completed?'success':'play');break;
      case 'print':window.print();break;
    }
  });
  app.addEventListener('change',event=>{
    const el=event.target;
    if(el.id==='solution-location')state.location=el.value;
    if(el.id==='solution-reason')state.reason=el.value;
    if(el.dataset.evidence){if(el.checked&&!state.evidence.includes(el.dataset.evidence))state.evidence.push(el.dataset.evidence);else if(!el.checked)state.evidence=state.evidence.filter(id=>id!==el.dataset.evidence);}
    state.feedback='';persist();
  });
  document.getElementById('settings-button').addEventListener('click',settings);
  document.getElementById('brand').addEventListener('click',event=>{event.preventDefault();stopAudio();state.view='intro';persist();render();});
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.close).close()));
  document.querySelectorAll('input[name="support"]').forEach(input=>input.addEventListener('change',()=>{state.support=input.value;persist();render();}));
  document.getElementById('large-text').addEventListener('change',event=>{state.large=event.target.checked;persist();render();});
  document.getElementById('confirm-reset').addEventListener('click',()=>{const {support,large}=state;stopAudio();state={...fresh(),support,large};objectiveVisible=false;persist();document.getElementById('reset-dialog').close();render();toast('Puedes comenzar una nueva investigación.');});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio();});
  render();
  const context=document.modelContext;
  if(context?.registerTool){
    const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
    const tools=[
      {name:'read_case_progress',title:'Consultar recorrido del caso',description:'Lee las pistas reunidas y el progreso de la partida actual sin cambiarla.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(input===null||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Se esperaba un objeto vacío.');return {started:state.started,completed:state.completed,scene:state.scene,clues:state.clues.map(id=>({id,...CLUES[id]})),visited:state.visited,hints:state.hints};}},
      {name:'navigate_case_location',title:'Visitar un lugar del barrio',description:'Abre un lugar en una partida iniciada y actualiza el lugar visible. No recoge pistas ni resuelve el caso.',inputSchema:{type:'object',properties:{location:{type:'string',enum:Object.keys(SCENES)}},required:['location'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>k!=='location')||!SCENES[input.location])throw new Error('Elige biblioteca, plaza o quiosco.');if(!state.started||state.completed)throw new Error('Se necesita una partida iniciada y sin resolver.');state.view='play';chooseScene(input.location);return {scene:state.scene,clues:state.clues.length};}}
    ];
    tools.forEach(tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}});
  }
})();
