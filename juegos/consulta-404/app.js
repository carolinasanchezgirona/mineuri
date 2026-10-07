'use strict';
(() => {
const STORAGE='mineuri-consulta404-ep1-v1';
const VERBS=['mirar','coger','hablar','usar','combinar'];
const ITEMS={
 clip:{name:'Clip enorme',desc:'Una herramienta de precisión, según nadie.'},
 sandwich:{name:'Medio bocadillo',desc:'Ha vivido días mejores.'},
 form:{name:'Formulario B-17',desc:'Seis páginas para agilizar procesos.'},
 card:{name:'Tarjeta de empleado',desc:'Pertenece a M. Gutiérrez. Tú no.'},
 manual:{name:'Manual dudoso',desc:'Soluciones temporales permanentes.'}
};
const fresh=()=>({version:1,scene:'reception',verb:'mirar',selected:null,items:['clip','sandwich'],flags:{form:false,jammed:false,puriGone:false,card:false,kevinClue:false,elevatorOpen:false,hidden:false,floor3:false,office:false,phone:false},achievements:[],dialogue:{speaker:'Narrador',text:'Primer día. Primer objetivo: encontrar tu despacho. Ya parece excesivamente ambicioso.',choices:[]},ended:false});
let state=restore();
const app=document.getElementById('app');
let toastTimer;

function restore(){try{const s=JSON.parse(localStorage.getItem(STORAGE));return s&&s.version===1?Object.assign(fresh(),s,{flags:Object.assign(fresh().flags,s.flags||{})}):fresh();}catch{return fresh();}}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{}}
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
function say(speaker,text,choices=[]){state.dialogue={speaker,text,choices};save();render();}
function addItem(id){if(!state.items.includes(id)){state.items.push(id);toast('Añadido al inventario: '+ITEMS[id].name)}}
function achievement(id,label){if(!state.achievements.includes(id)){state.achievements.push(id);toast('Logro: '+label)}}
function selectItem(id){state.selected=state.selected===id?null:id;state.verb='usar';save();render();}
function setVerb(v){state.verb=v;save();render();}
function objective(){
 if(state.scene==='reception'&&!state.flags.form)return 'Averigua cómo subir a la tercera planta.';
 if(state.scene==='reception'&&!state.flags.jammed)return 'Consigue que el B-17 sea aceptado.';
 if(state.scene==='reception'&&!state.flags.card)return 'Aprovecha el caos administrativo.';
 if(!state.flags.kevinClue)return 'Descubre cómo llegar a una planta que no existe.';
 if(state.scene==='elevator'&&!state.flags.floor3)return 'Encuentra el botón que falta.';
 if(state.scene==='floor3'&&!state.flags.office)return 'Entra en el despacho 404.';
 if(state.scene==='office'&&!state.flags.phone)return 'Averigua quién ocupa realmente tu despacho.';
 return 'Sobrevive a tu primer día.';
}
function sceneName(){return {reception:'Recepción',it:'Informática',elevator:'Ascensor',floor3:'Tercera planta',office:'Despacho 404'}[state.scene]}
function hotspots(){
 if(state.scene==='reception')return ['puri','board','printer','plant','itdoor','elevator'];
 if(state.scene==='it')return ['kevin','box','elevator'];
 if(state.scene==='elevator')return state.flags.hidden?['panel','hidden']:['panel'];
 if(state.scene==='floor3')return ['door404','elevator'];
 if(state.scene==='office')return state.flags.phone?['photocopier','phone']:['photocopier'];
 return [];
}
const labels={puri:'Puri',board:'Tablón',printer:'Impresora',plant:'Planta',itdoor:'Informática',elevator:'Ascensor',kevin:'Kevin',box:'Caja',panel:'Panel',hidden:'¿?',door404:'Despacho 404',photocopier:'Fotocopiadora',phone:'Teléfono'};
function sceneDecor(){
 const common='<div class="scene-label">'+sceneName()+'</div>';
 if(state.scene==='reception')return common+'<div class="wall-sign sign-a">EL PROBLEMA<br>ES PARTE DEL<br>PROCESO</div><div class="wall-sign sign-b">SONRÍA<br>TAMBIÉN PASA</div><div class="window"></div><div class="desk"></div><div class="paper-stack"></div><div class="printer"></div><div class="plant"></div><div class="character puri"><span class="hair"></span><span class="head"></span><span class="glasses"></span><span class="body"></span><span class="tag">PURI</span></div><div class="elevator"></div>';
 if(state.scene==='it')return common+'<div class="wall-sign sign-a">REINICIAR<br>TAMBIÉN ES<br>AVANZAR</div><div class="window"></div><div class="desk"></div><div class="character kevin"><span class="hair"></span><span class="head"></span><span class="body"></span></div><div class="paper-stack"></div><div class="printer"></div>';
 if(state.scene==='elevator')return common+'<div class="elevator" style="right:34%;width:32%;height:70%"></div><div class="wall-sign sign-b">NO APOYARSE<br>EN LA LÓGICA</div>';
 if(state.scene==='floor3')return common+'<div class="wall-sign sign-b">3ª PLANTA<br>(que no existe)</div><div class="window"></div><div class="door404"></div>';
 if(state.scene==='office')return common+'<div class="wall-sign sign-a">PROBLEMAS<br>PERFECTAMENTE<br>NORMALES</div><div class="window"></div><div class="photocopier"></div>'+(state.flags.phone?'<div class="phone">☎</div>':'');
 return common;
}
function render(){
 if(state.ended){renderEnding();return;}
 const hs=hotspots().map(id=>'<button type="button" class="hotspot '+(found(id)?'found':'')+'" data-hotspot="'+id+'">'+labels[id]+'</button>').join('');
 const choices=(state.dialogue.choices||[]).map((c,i)=>'<button type="button" class="choice" data-choice="'+i+'">'+c.label+'</button>').join('');
 const items=state.items.map(id=>'<button type="button" class="item '+(state.selected===id?'active':'')+'" data-item="'+id+'" aria-pressed="'+(state.selected===id)+'"><strong>'+ITEMS[id].name+'</strong><small>'+ITEMS[id].desc+'</small></button>').join('');
 const verbs=VERBS.map(v=>'<button type="button" class="verb '+(state.verb===v?'active':'')+'" data-verb="'+v+'" aria-pressed="'+(state.verb===v)+'">'+v[0].toUpperCase()+v.slice(1)+'</button>').join('');
 app.innerHTML='<section class="game-shell"><div class="chapter-bar"><p><span class="eyebrow">EPISODIO 1</span><br><strong>El despacho que no existía</strong></p><span class="chapter-status">Día 1 · '+progressLabel()+'</span></div><div class="scene-wrap"><div class="scene">'+sceneDecor()+hs+'</div><aside class="sidebar"><div class="objective"><small>Objetivo actual</small><strong>'+objective()+'</strong></div><div class="dialogue"><span class="speaker">'+escape(state.dialogue.speaker)+'</span><p>'+escape(state.dialogue.text)+'</p><div class="choices">'+choices+'</div></div><div class="verbs">'+verbs+'</div></aside><div class="inventory-bar"><div class="inventory-label">INVENTARIO</div><div class="items">'+items+'</div></div><div class="message-bar">'+statusLine()+'</div></div></section>';
 bind();
}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function found(id){return (id==='board'&&state.flags.form)||(id==='printer'&&state.flags.jammed)||(id==='elevator'&&state.flags.elevatorOpen)||(id==='hidden'&&state.flags.floor3)||(id==='door404'&&state.flags.office)}
function progressLabel(){const f=state.flags;const n=[f.form,f.jammed,f.card,f.kevinClue,f.floor3,f.office].filter(Boolean).length;return Math.round(n/6*100)+'% del caos comprendido'}
function statusLine(){return state.selected?'Usar '+ITEMS[state.selected].name+' con…':'Acción seleccionada: '+state.verb+'. Toca un elemento de la escena.'}
function bind(){
 app.querySelectorAll('[data-verb]').forEach(b=>b.addEventListener('click',()=>setVerb(b.dataset.verb)));
 app.querySelectorAll('[data-item]').forEach(b=>b.addEventListener('click',()=>selectItem(b.dataset.item)));
 app.querySelectorAll('[data-hotspot]').forEach(b=>b.addEventListener('click',()=>interact(b.dataset.hotspot)));
 app.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.choice))));
}
function choose(i){const c=state.dialogue.choices?.[i];if(c&&typeof actions[c.action]==='function')actions[c.action]()}
const actions={
 puriAuth(){say('Puri','Para subir necesita la autorización B.')},
 puriWhere(){say('Puri','En la tercera planta.',[{label:'Pero necesito la autorización para llegar a la tercera planta.',action:'puriLoop'}])},
 puriLoop(){say('Puri','Exactamente. El sistema funciona.')},
 puriFloor(){say('Puri','Administrativamente, no existe. Arquitectónicamente, es más complejo.')},
 kevinFloor(){state.flags.kevinClue=true;achievement('support','Soporte emocional no incluido');say('Kevin','Entre el 2 y el 4 hay un botón que oficialmente no está. No digas que te lo he dicho.')},
 kevinOffice(){say('Kevin','Tu despacho es el 404. Sí, también es un error. No, no es una coincidencia.')},
 finalCall(){state.flags.phone=true;state.ended=true;achievement('survived','Primer día completado');save();render()}
};
function interact(id){
 const v=state.verb,item=state.selected;
 if(id==='puri'){
  if(v==='hablar'){say('Puri','¿Tiene cita? Porque sin cita, aquí todo son coincidencias muy improbables.',[{label:'Trabajo aquí. ¿Cuenta como cita?',action:'puriAuth'},{label:'¿Dónde consigo la autorización?',action:'puriWhere'},{label:'¿Existe la tercera planta?',action:'puriFloor'}]);return}
  say('Narrador','Puri parece capaz de detectar formularios incompletos a veinte metros.');return;
 }
 if(id==='board'){
  if(v==='coger'||v==='mirar'){
   if(!state.flags.form){state.flags.form=true;addItem('form');say('Narrador','Encuentras el formulario B-17. Seis páginas. El encabezado dice “Para simplificar trámites”.');}
   else say('Narrador','El tablón contiene avisos caducados y una circular sobre reducir el uso de circulares.');
   state.selected=null;save();return;
  }
 }
 if(id==='plant'){
  if(v==='usar'&&item==='sandwich'){achievement('botany','Botánica aplicada');state.selected=null;say('Narrador','Le ofreces el bocadillo a la planta. No responde. También es de plástico.');return}
  say('Narrador','Lleva aquí más tiempo que tú y probablemente tiene mejor estabilidad laboral.');return;
 }
 if(id==='printer'){
  if(v==='usar'&&item==='form'&&state.flags.form&&!state.flags.jammed){state.flags.jammed=true;state.selected=null;say('Narrador','La impresora acepta el B-17 durante tres segundos y después emite un ruido que debería requerir consentimiento informado. Papel atascado.');return}
  if(v==='usar'&&item==='clip'&&state.flags.jammed&&!state.flags.puriGone){state.flags.puriGone=true;state.flags.card=true;addItem('card');state.selected=null;say('Narrador','El clip funciona. La impresora escupe 34 copias. Puri sale a buscar a Kevin. En el mostrador queda una tarjeta de empleado. Qué desafortunado.');return}
  if(state.flags.jammed)say('Narrador','La impresora sigue atascada con una convicción admirable. Algo metálico podría persuadirla.');
  else say('Narrador','Tres luces rojas. Una verde. La verde está aquí por motivos estadísticos.');
  return;
 }
 if(id==='itdoor'){state.scene='it';state.selected=null;say('Narrador','Informática. El cartel dice “Soporte técnico”. Debajo alguien ha añadido “emocional no”.');return}
 if(id==='kevin'){
  if(v==='hablar'){say('Kevin','¿Has probado a apagarlo y volverlo a encender?',[{label:'Necesito llegar a la tercera planta.',action:'kevinFloor'},{label:'¿Sabes dónde está mi despacho?',action:'kevinOffice'}]);return}
  say('Narrador','Kevin parece llevar despierto desde una actualización de 2024.');return;
 }
 if(id==='box'){
  if(v==='coger'&&!state.items.includes('manual')){addItem('manual');say('Narrador','Encuentras “Soluciones temporales permanentes”. Kevin asegura que es documentación oficial.');return}
  say('Narrador','Una caja de cables etiquetada “por si acaso”. El “caso” no está especificado.');return;
 }
 if(id==='elevator'){
  if(state.scene==='it'){state.scene='reception';say('Narrador','Regresas a recepción. La impresora sigue produciendo documentación no solicitada.');return}
  if(v==='usar'&&item==='card'&&state.flags.card){state.flags.elevatorOpen=true;state.scene='elevator';state.selected=null;say('Ascensor','Tarjeta aceptada. Plantas disponibles: 0, 1, 2 y 4. Las matemáticas presentan una queja formal.');return}
  if(state.flags.elevatorOpen){state.scene='elevator';say('Narrador','Entras en el ascensor. El botón 3 sigue ausente con mucha seguridad.');return}
  say('Narrador','El ascensor pide tarjeta. Tu presencia y buena actitud no son RFID.');return;
 }
 if(id==='panel'){
  if(v==='mirar'){
   if(state.flags.kevinClue){state.flags.hidden=true;say('Narrador','Entre el 2 y el 4 notas una marca rectangular. El panel ha sido discretamente indiscreto.');}
   else say('Narrador','0, 1, 2 y 4. Es evidente que alguien tiene una relación complicada con el 3.');
   return;
  }
  say('Narrador','El panel ignora tu iniciativa. Quizá primero convenga observarlo.');return;
 }
 if(id==='hidden'){
  if(state.flags.hidden){state.flags.floor3=true;state.scene='floor3';achievement('nonexistent','No oficialmente existente');say('Ascensor','Planta no reconocida. Las puertas se abren igualmente.');return}
 }
 if(id==='door404'){
  if(v==='usar'&&item==='card'){state.flags.office=true;state.scene='office';state.selected=null;say('Narrador','La tarjeta abre el despacho 404. Dentro hay una sola ocupante: una fotocopiadora.');return}
  say('Narrador','Cerrado. Parece necesitar la misma tarjeta que ya ha provocado varios problemas.');return;
 }
 if(id==='photocopier'){
  if(v==='mirar'){achievement('employee','Empleado del mes');state.flags.phone=true;say('Narrador','La placa dice “Empleado del mes, agosto de 2018”. En ese momento suena el teléfono.');return}
  if(v==='hablar'){say('Tú','¿Este es mi despacho?\n\nFotocopiadora: Brrrr-clac.\n\nSorprendentemente, es la respuesta más clara del día.');return}
  say('Narrador','No se mueve. Tiene más antigüedad que tú y probablemente protección sindical.');return;
 }
 if(id==='phone'){
  if(v==='hablar'||v==='usar'){say('Voz al teléfono','¿Consulta 404? Tenemos un problema en Recursos Inhumanos.',[{label:'¿Urgente?',action:'finalCall'}]);return}
  say('Narrador','El teléfono insiste. Esto parece narrativamente importante.');return;
 }
 say('Narrador','Eso no parece funcionar. Lo cual, aquí, tampoco demuestra demasiado.');
}
function renderEnding(){
 app.innerHTML='<section class="game-shell"><div class="ending"><span class="stamp">CASO ADMINISTRATIVAMENTE ABIERTO</span><h1>Has encontrado tu despacho.</h1><p>También has descubierto que está ocupado por una fotocopiadora con más antigüedad que tú.</p><div class="ending-card"><strong>☎ Próximo problema</strong><p>“Tenemos un problema en Recursos Inhumanos.”</p><p>Melquíades ha solicitado una reunión para decidir si la reunión es necesaria.</p></div><div class="ending-actions"><a class="btn primary" href="../">Volver a Mente en juego</a><button class="btn ghost" type="button" id="ending-reset">Volver a jugar</button></div></div></section>';
 document.getElementById('ending-reset')?.addEventListener('click',reset);
}
function reset(){state=fresh();save();render();document.getElementById('reset-dialog')?.close();}
function openPanel(type){
 const d=document.getElementById('panel-dialog'),title=document.getElementById('panel-title'),content=document.getElementById('panel-content');
 if(type==='inventory'){title.textContent='Inventario';content.innerHTML='<div class="panel-list">'+state.items.map(id=>'<div class="panel-card"><strong>'+ITEMS[id].name+'</strong><span>'+ITEMS[id].desc+'</span></div>').join('')+'</div>'}
 if(type==='achievements'){const all=[['botany','Botánica aplicada'],['support','Soporte emocional no incluido'],['nonexistent','No oficialmente existente'],['employee','Empleado del mes'],['survived','Primer día completado']];title.textContent='Logros';content.innerHTML='<div class="panel-list">'+all.map(([id,n])=>'<div class="panel-card achievement '+(state.achievements.includes(id)?'':'locked')+'"><strong>'+(state.achievements.includes(id)?'✓ ':'○ ')+n+'</strong></div>').join('')+'</div>'}
 if(type==='map'){const places=[['reception','Recepción','Planta baja'],['it','Informática','Planta baja'],['elevator','Ascensor','Entre plantas'],['floor3','Tercera planta','No existe'],['office','Despacho 404','Objetivo final']];const unlocked={reception:true,it:state.flags.puriGone,elevator:state.flags.elevatorOpen,floor3:state.flags.floor3,office:state.flags.office};title.textContent='Mapa';content.innerHTML='<div class="map-grid">'+places.map(([id,n,s])=>'<div class="map-place '+(state.scene===id?'current ':'')+(unlocked[id]?'':'locked')+'"><strong>'+n+'</strong><small>'+s+'</small></div>').join('')+'</div>'}
 d.showModal();
}
function hint(){
 let t='Habla con Puri para entender qué pide el ascensor.';
 if(state.flags.form&&!state.flags.jammed)t='Prueba a usar el B-17 con la impresora.';
 else if(state.flags.jammed&&!state.flags.card)t='La impresora está atascada. ¿Tienes algo pequeño y metálico?';
 else if(state.flags.card&&!state.flags.kevinClue)t='Antes de subir, quizá Informática sepa algo sobre la planta que falta.';
 else if(state.flags.kevinClue&&!state.flags.floor3)t='Usa la tarjeta en el ascensor y examina el panel.';
 else if(state.flags.floor3&&!state.flags.office)t='El despacho 404 está cerrado. Ya tienes algo que abre accesos.';
 else if(state.flags.office&&!state.flags.phone)t='Examina a la ocupante del despacho.';
 else if(state.flags.phone)t='El teléfono no va a dejar de sonar por educación.';
 titlePanel('Una pista',t);
}
function titlePanel(titleText,text){const d=document.getElementById('panel-dialog');document.getElementById('panel-title').textContent=titleText;document.getElementById('panel-content').innerHTML='<p>'+escape(text)+'</p>';d.showModal();}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.open)));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close)?.close()));
document.getElementById('help-button').addEventListener('click',hint);
document.getElementById('reset-button').addEventListener('click',()=>document.getElementById('reset-dialog').showModal());
document.getElementById('confirm-reset').addEventListener('click',reset);
render();
})();