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
  const cards = () => [...list.querySelectorAll("[data-product]")];
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
   for(const card of cards()){
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
  // Se incluyen solo publicaciones aprobadas en Supabase. Los borradores no son accesibles.
  async function loadPublished(){
   const endpoint="https://qtuzwzanifviukqcfzwa.supabase.co/rest/v1/resources?select=id,slug,title,summary,audience,topic,format,is_free,price_cents,cover_path,status&status=eq.published&order=created_at.desc&limit=100";
   const key="sb_publishable_G1q_gbdK6tF1JUb9N4mcdg_G0xEEif-";
   try{
    const res=await fetch(endpoint,{headers:{apikey:key},signal:AbortSignal.timeout(8000)});
    if(!res.ok)throw Error("Catálogo temporalmente inaccesible");
    const data=await res.json();if(!Array.isArray(data))return;
    for(const p of data){
     if(!p||!p.id||!p.title||!p.slug||!p.audience)continue;
     const card=document.createElement("article");card.className="store-product";card.dataset.product="";
     card.dataset.audience=p.audience;card.dataset.topic=p.topic||"";card.dataset.format=(p.format==="pdf"?"cuaderno":p.format)||"";
     // No se atribuye disponibilidad comercial hasta habilitar entrega segura.
     card.dataset.available=p.is_free?"true":"false";card.dataset.search=[p.title,p.summary,p.audience,p.topic].join(" ");
     const cover=document.createElement("div");cover.className="store-cover mint";
     cover.style.cssText="min-height:180px;display:flex;align-items:center;justify-content:center;padding:25px";
     const label=document.createElement("strong");label.textContent=p.title;label.style.font="500 27px/1.2 Georgia,serif";cover.append(label);
     const publicStorageBase="https://qtuzwzanifviukqcfzwa.supabase.co/storage/v1/object/public/mineuri-public/";
     let coverUrl=null;
     if(typeof p.cover_path==="string" && /^resources\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp)$/i.test(p.cover_path)){coverUrl=publicStorageBase+p.cover_path.split("/").map(encodeURIComponent).join("/");}
     else if(typeof p.cover_path==="string" && p.cover_path.startsWith(publicStorageBase)){coverUrl=p.cover_path;}
     if(coverUrl){
      const im=document.createElement("img");im.src=coverUrl;im.alt="Portada del recurso: "+p.title;im.loading="lazy";im.style.cssText="width:100%;height:100%;object-fit:cover;position:absolute;inset:0";cover.style.position="relative";cover.replaceChildren(im);
     }
     const body=document.createElement("div");body.className="store-product-body";
     const tag=document.createElement("div");tag.className="store-tag-row";
     const who=document.createElement("span");who.className="store-tag";who.textContent=p.audience;
     const state=document.createElement("span");state.className="store-tag upcoming";state.textContent=p.is_free?"Gratuito · publicado":"Ficha publicada · entrega en preparación";
     tag.append(who,state);
     const title=document.createElement("h3");title.textContent=p.title;
     const desc=document.createElement("p");desc.textContent=p.summary||"Consulta próximamente los detalles de este recurso.";
     const foot=document.createElement("div");foot.className="store-product-foot";
     const note=document.createElement("span");note.className="store-price";note.textContent=p.is_free?"Gratis":(Number.isFinite(p.price_cents)?(p.price_cents/100).toFixed(2).replace(".",",")+" €":"Consultar disponibilidad");
     const details=document.createElement("button");details.type="button";details.className="store-detail-trigger";details.textContent="Ver información ↗";details.setAttribute("aria-label","Ver información sobre "+p.title);
     details.addEventListener("click",()=>{
      const dialog=document.createElement("dialog");dialog.className="store-detail-dialog";
      const close=document.createElement("button");close.type="button";close.className="store-detail-close";close.setAttribute("aria-label","Cerrar ficha");close.textContent="×";
      close.addEventListener("click",()=>dialog.close());
      const inner=document.createElement("div"),heading=document.createElement("h2"),intro=document.createElement("p"),meta=document.createElement("p"),notice=document.createElement("p");
      heading.textContent=p.title;intro.textContent=p.summary||"Información en preparación.";
      meta.textContent=[p.audience,p.topic,p.format].filter(Boolean).join(" · ");
      notice.textContent=p.is_free?"Recurso gratuito publicado. La descarga se habilitará cuando esté configurada la entrega segura del archivo.":"Ficha informativa. La compra y la descarga digital aún no están habilitadas.";
      inner.append(heading,meta,intro,notice);dialog.append(close,inner);
      if(coverUrl){const photo=document.createElement("img");photo.src=coverUrl;photo.alt="Portada de "+p.title;photo.loading="lazy";inner.prepend(photo);}
      document.body.append(dialog);dialog.addEventListener("close",()=>dialog.remove(),{once:true});dialog.showModal();
     });
     foot.append(note,details);body.append(tag,title,desc,foot);card.append(cover,body);list.append(card);
    }
    update();
   }catch(error){console.error("Mineuri: fallo de conexión con recursos publicados",error);const aviso=document.createElement("p");aviso.setAttribute("role","alert");aviso.textContent="No se han podido cargar los nuevos recursos. Vuelve a intentarlo más tarde.";aviso.style.cssText="color:#9b2929;margin:12px 0";list.parentElement.insertBefore(aviso,list);}
  }
  loadPublished();
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();