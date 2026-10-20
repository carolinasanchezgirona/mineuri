document.addEventListener("DOMContentLoaded",()=>{"use strict";
const form=document.querySelector("[data-eco-search]");if(!form)return;
const list=document.querySelector(".eco-profiles"),counter=document.querySelector("[data-eco-count]"),empty=document.querySelector("[data-eco-empty]");
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
function profiles(){return [...document.querySelectorAll("[data-eco-profile]")];}
function update(){const q=norm(form.elements.namedItem("q").value),modo=form.elements.namedItem("modo").value,esp=form.elements.namedItem("especialidad").value,zona=form.elements.namedItem("zona").value;let found=0;
for(const card of profiles()){const ok=(!q||norm(card.dataset.keywords).includes(q))&&(!modo||card.dataset.modo.split(" ").includes(modo))&&(!esp||card.dataset.especialidad.split(" ").includes(esp))&&(!zona||card.dataset.zona.split(" ").includes(zona));card.hidden=!ok;if(ok)found++;}
if(counter)counter.textContent=found===1?"1 ficha encontrada":found+" fichas encontradas";if(empty)empty.hidden=found>0;}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function getUrl(raw){try{const u=new URL(raw);return u.protocol==="https:"?u.href:null;}catch{return null;}}
function valid(p){return p&&typeof p==="object"&&typeof p.nombre==="string"&&p.nombre.length<101&&p.nombre.trim()&&typeof p.perfil==="string"&&p.perfil.trim()&&typeof p.zona==="string"&&p.zona.trim()&&getUrl(p.web);}
function card(p){const search=norm([p.nombre,p.perfil,p.zona,p.areas,p.colegio,p.colegiacion,p.modalidad].join(" ")),role=norm(p.perfil+" "+p.areas),area=norm(p.zona),mode=norm(p.modalidad);
const a=el("article","eco-profile");a.dataset.ecoProfile="";a.dataset.keywords=search;a.dataset.modo=[mode.includes("online")?"online":"",mode.includes("presencial")?"presencial":""].filter(Boolean).join(" ");
a.dataset.especialidad=[role.includes("psicolog")?"psicologia":"",role.includes("neuropsicolog")?"neuropsicologia":"",role.includes("demencia")?"demencias":""].filter(Boolean).join(" ");
a.dataset.zona=[area.includes("barcelona")?"barcelona":"",area.includes("maresme")||area.includes("arenys")?"maresme":"",mode.includes("online")?"online":""].filter(Boolean).join(" ");
const initials=p.nombre.trim().split(/\s+/).slice(0,2).map(x=>x.charAt(0)).join("").toUpperCase();a.append(el("div","eco-avatar",initials));
const content=el("div");content.append(el("span","eyebrow","Ficha del directorio"),el("h3","",p.nombre),el("p","",p.perfil));
const detail=el("p","",p.areas||"Consulta la web del profesional para conocer sus áreas de trabajo.");content.append(detail);
const chips=el("div","eco-chips");for(const value of [p.zona,p.modalidad]){const span=el("span","",value);chips.append(span);}content.append(chips);
content.append(el("p","eco-muted","Colegiación indicada: "+String(p.colegio||"").trim()+" "+String(p.colegiacion||"").trim()+". Para confirmar las credenciales, consulta el colegio profesional correspondiente."));
const link=el("a","action","Consultar web profesional ↗");link.href=getUrl(p.web);link.target="_blank";link.rel="noopener noreferrer";content.append(link);a.append(content);return a;}
async function hydrate(){try{const res=await fetch("perfiles-publicos.json",{cache:"no-store"});if(!res.ok)throw Error("Sin catálogo público");const data=await res.json();if(!Array.isArray(data)||data.length>300)throw Error("Formato no válido");const ok=data.filter(valid);if(!ok.length)return;for(const prev of profiles())prev.remove();for(const entry of ok){list.insertBefore(card(entry),empty);}update();}catch(error){update();}}
form.addEventListener("input",update);form.addEventListener("change",update);form.addEventListener("submit",e=>e.preventDefault());form.addEventListener("reset",()=>requestAnimationFrame(update));
update();hydrate();
});