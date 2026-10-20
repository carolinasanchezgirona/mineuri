/* Mineuri: explorador de recursos, sin analítica ni almacenamiento de datos personales. */
(() => {
 "use strict";
 const norm = value => (value || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
 const init = () => {
  const list = document.querySelector("[data-store-products]");
  if(!list)return;
  const input = document.querySelector("#buscar-recursos");
  const topic = document.querySelector("#area-recursos");
  const format = document.querySelector("#formato-recursos");
  const audience = [...document.querySelectorAll('input[name="destinatario"]')];
  const availability = document.querySelector("#solo-disponibles");
  const reset = document.querySelector("[data-store-reset]");
  const count = document.querySelector("[data-store-count]");
  const empty = document.querySelector("[data-store-empty]");
  const cards = [...list.querySelectorAll("[data-product]")];
  const params = new URLSearchParams(location.search);
  const initialAudience = params.get("para") || "todos";
  const audienceOption = audience.find(a => a.value === initialAudience);
  if(audienceOption)audienceOption.checked=true;
  if(params.get("area") && [...topic.options].some(o=>o.value===params.get("area")))topic.value=params.get("area");
  if(params.get("formato") && [...format.options].some(o=>o.value===params.get("formato")))format.value=params.get("formato");
  if(params.get("tipo")==="gratuito"||params.get("solo")==="disponibles")availability.checked=true;
  if(params.get("q"))input.value=params.get("q").slice(0,100);
  function update(){
   const selectedAudience=(audience.find(a=>a.checked)||{}).value||"todos";
   const q=norm(input.value);
   let shown=0;
   for(const card of cards){
    const text=norm(card.dataset.search||card.textContent);
    const match=(selectedAudience==="todos"||card.dataset.audience.split(" ").includes(selectedAudience))&&
     (topic.value==="todos"||card.dataset.topic===topic.value)&&
     (format.value==="todos"||card.dataset.format===format.value)&&
     (!availability.checked||card.dataset.available==="true")&&
     (!q||text.includes(q));
    card.hidden=!match;
    if(match)shown++;
   }
   count.textContent=shown===1?"1 recurso encontrado":shown+" recursos encontrados";
   empty.hidden=shown!==0;
  }
  [input,topic,format,availability,...audience].forEach(el=>el.addEventListener(el===input?"input":"change",update));
  reset.addEventListener("click",()=>{
   input.value="";topic.value="todos";format.value="todos";availability.checked=false;
   const all=audience.find(el=>el.value==="todos");if(all)all.checked=true;
   update();
  });
  update();
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();