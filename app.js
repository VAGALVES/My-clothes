const COLORS = {
  navy:{name:"Azul-marinho",hex:"#152743"},
  gray:{name:"Cinza",hex:"#8a8f93"},
  lightgray:{name:"Cinza claro",hex:"#c4c6c3"},
  beige:{name:"Bege",hex:"#cfb78f"},
  khaki:{name:"Caqui",hex:"#bda476"},
  lightblue:{name:"Azul claro",hex:"#a9c7dc"},
  blue:{name:"Azul",hex:"#2d4e82"},
  olive:{name:"Verde oliva",hex:"#59623b"},
  lightgreen:{name:"Verde claro",hex:"#b6bea1"},
  darkgreen:{name:"Verde escuro",hex:"#154b3c"},
  brown:{name:"Marrom",hex:"#704522"},
  darkbrown:{name:"Marrom escuro",hex:"#3c251d"},
  mediumbrown:{name:"Marrom médio",hex:"#8a4d22"},
  burgundy:{name:"Bordô",hex:"#6b1f2d"},
  oxblood:{name:"Vinho / oxblood",hex:"#681d22"},
  black:{name:"Preto",hex:"#171819"},
  white:{name:"Branco",hex:"#f1f0eb"},
  charcoal:{name:"Grafite",hex:"#3d4145"},
};

const ITEMS = [
  // shirts
  ...["navy","gray","beige","olive","lightblue","brown","burgundy","black","white","lightgreen","darkgreen"].map(c=>({id:`shirt-${c}`,type:"shirt",color:c,label:`Camisa ${COLORS[c].name}`})),
  // pants
  ...["navy","gray","lightgray","beige","khaki","olive","brown","black","white","lightblue"].map(c=>({id:`pants-${c}`,type:"pants",color:c,label:`Calça ${COLORS[c].name}`})),
  // shoes
  ...["black","darkbrown","oxblood","mediumbrown"].map(c=>({id:`shoes-${c}`,type:"shoes",color:c,label:`Sapato ${COLORS[c].name}`})),
  // suits
  ...["black","charcoal","navy","lightgray"].map(c=>({id:`suit-${c}`,type:"suit",color:c,label:`Terno ${COLORS[c].name}`})),
];

const SHIRT_PANTS = new Map([
  ["navy|gray",96],["gray|navy",94],["beige|lightblue",89],["olive|brown",90],
  ["lightblue|navy",98],["brown|khaki",91],["navy|white",92],["white|gray",97],
  ["burgundy|gray",94],["black|beige",95],["lightblue|brown",93],["white|brown",92],
  ["white|navy",99],["white|black",96],["white|beige",93],["white|olive",91],
  ["lightblue|gray",95],["lightblue|beige",92],["lightblue|olive",87],
  ["navy|beige",95],["navy|khaki",93],["navy|lightgray",96],
  ["gray|black",92],["gray|beige",88],["beige|navy",93],["beige|olive",88],
  ["burgundy|beige",92],["burgundy|navy",90],["black|gray",94],["black|lightgray",96],
  ["darkgreen|lightgray",93],["darkgreen|beige",90],["lightgreen|black",87]
]);

const PANTS_SHOES = new Map([
  ["black|black",97],["gray|darkbrown",92],["lightgray|black",96],["navy|oxblood",96],
  ["navy|darkbrown",97],["navy|mediumbrown",93],["olive|mediumbrown",96],["olive|darkbrown",93],
  ["beige|darkbrown",96],["beige|mediumbrown",94],["khaki|darkbrown",95],["brown|darkbrown",94],
  ["white|darkbrown",89],["lightblue|darkbrown",88],["gray|black",95],["brown|oxblood",91]
]);

const SUIT_SHOES = new Map([
  ["black|black",99],["charcoal|black",99],["navy|darkbrown",98],["navy|oxblood",97],
  ["lightgray|black",96],["lightgray|darkbrown",92]
]);

const SUIT_SHIRT = new Map([
  ["black|white",99],["black|lightblue",92],
  ["charcoal|white",98],["charcoal|lightblue",95],
  ["navy|white",99],["navy|lightblue",98],
  ["lightgray|white",97],["lightgray|lightblue",94],["lightgray|black",91]
]);

const STARTER = new Set(["shirt-white","shirt-lightblue","shirt-navy","shirt-burgundy","pants-navy","pants-gray","pants-beige","shoes-black","shoes-darkbrown","suit-navy"]);

const OCCASIONS = {
  work:["Trabalho","smart"],
  smart:["Smart casual","smart"],
  formal:["Formal","formal"],
  event:["Evento","formal"]
};

function loadOwned(){
  try{
    const raw=localStorage.getItem("closetmatch-owned");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  }catch{return new Set();}
}
let owned = loadOwned();

function saveOwned(){
  localStorage.setItem("closetmatch-owned",JSON.stringify([...owned]));
  refreshAll();
}

function byId(id){return ITEMS.find(x=>x.id===id)}
function itemsOf(type){return ITEMS.filter(x=>x.type===type)}
function pairScore(map,a,b){return map.get(`${a}|${b}`)||0}

function svgFor(item){
  const fill=COLORS[item.color].hex;
  const stroke=item.color==="white" ? "#b9b9b4" : "rgba(255,255,255,.18)";
  if(item.type==="shirt"){
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 9l10 7 10-7 12 9-7 11-5-4v30H22V25l-5 4-7-11 12-9z" fill="${fill}" stroke="${stroke}" stroke-width="2"/><path d="M26 13l6 3 6-3-6 9-6-9z" fill="rgba(255,255,255,.2)"/></svg>`;
  }
  if(item.type==="pants"){
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M20 7h24l-2 47H34l-2-27-2 27h-8L20 7z" fill="${fill}" stroke="${stroke}" stroke-width="2"/><path d="M20 15h24" stroke="rgba(255,255,255,.18)" stroke-width="2"/></svg>`;
  }
  if(item.type==="shoes"){
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 38c8-1 13-8 17-17h8c4 9 6 12 18 17 4 2 5 8 0 10H15c-7 0-10-8-5-10z" fill="${fill}" stroke="${stroke}" stroke-width="2"/><path d="M20 34h16" stroke="rgba(255,255,255,.22)" stroke-width="2"/></svg>`;
  }
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M20 7l12 7 12-7 9 12-7 6-3 30H21l-3-30-7-6 9-12z" fill="${fill}" stroke="${stroke}" stroke-width="2"/><path d="M32 14l-6 15 6 5 6-5-6-15z" fill="rgba(255,255,255,.13)"/></svg>`;
}

function generateCasual(){
  const shirts=itemsOf("shirt"), pants=itemsOf("pants"), shoes=itemsOf("shoes");
  const results=[];
  for(const s of shirts) for(const p of pants){
    const sp=pairScore(SHIRT_PANTS,s.color,p.color);
    if(!sp) continue;
    for(const sh of shoes){
      const ps=pairScore(PANTS_SHOES,p.color,sh.color);
      if(!ps) continue;
      const score=Math.round(sp*.58+ps*.42);
      results.push({kind:"separates",shirt:s,pants:p,shoes:sh,score,tags:["Smart casual","Trabalho"]});
    }
  }
  return results;
}

function generateFormal(){
  const suits=itemsOf("suit"), shirts=itemsOf("shirt"), shoes=itemsOf("shoes");
  const results=[];
  for(const su of suits) for(const s of shirts){
    const ss=pairScore(SUIT_SHIRT,su.color,s.color);
    if(!ss) continue;
    for(const sh of shoes){
      const ps=pairScore(SUIT_SHOES,su.color,sh.color);
      if(!ps) continue;
      const score=Math.round(ss*.5+ps*.5);
      results.push({kind:"suit",suit:su,shirt:s,shoes:sh,score,tags:["Formal","Evento","Trabalho"]});
    }
  }
  return results;
}

const ALL_LOOKS=[...generateCasual(),...generateFormal()].sort((a,b)=>b.score-a.score);

function ownsLook(look){
  const required = look.kind==="suit" ? [look.suit,look.shirt,look.shoes] : [look.shirt,look.pants,look.shoes];
  return required.every(x=>owned.has(x.id));
}

function baseMatches(look,base){
  if(base==="all") return true;
  return Object.values(look).some(v=>v && typeof v==="object" && v.id===base);
}

function occasionMatches(look,occ){
  if(occ==="all") return true;
  const label=OCCASIONS[occ]?.[0];
  return look.tags.includes(label);
}

function renderLook(look){
  const pieces = look.kind==="suit" ? [look.suit,look.shirt,look.shoes] : [look.shirt,look.pants,look.shoes];
  const ownedBadge = pieces.every(x=>owned.has(x.id)) ? `<span class="tag">100% no armário</span>` : "";
  return `<article class="outfit">
    <div class="outfit-top">
      <div>
        <span class="eyebrow">${look.kind==="suit"?"ALFAIATARIA":"SEPARATES"}</span>
        <strong style="display:block;margin-top:4px">${look.score}% harmonia</strong>
      </div>
      <span class="score">${look.score>=96?"Excelente":"Muito boa"}</span>
    </div>
    <div class="look-visual">
      ${pieces.map(p=>`<div class="garment">${svgFor(p)}<small>${COLORS[p.color].name}</small></div>`).join("")}
    </div>
    <div class="outfit-meta">
      <div class="muted">${pieces.map(p=>p.label).join(" • ")}</div>
      <div class="tags">${look.tags.map(t=>`<span class="tag">${t}</span>`).join("")}${ownedBadge}</div>
    </div>
  </article>`;
}

function renderOutfits(){
  let list = ALL_LOOKS;
  if(smartState.anchorId){
    const kind = smartState.anchorType==="suit" ? "suit" : "separates";
    list = list.filter(x=>x.kind===kind && lookContainsId(x, smartState.anchorId));
  }else{
    list = list.filter(x=>x.kind==="separates");
  }
  list.sort((a,b)=>(Number(ownsLook(b))-Number(ownsLook(a))) || b.score-a.score);
  list=list.slice(0,18);
  document.getElementById("resultCount").textContent=smartState.anchorId ? `${list.length} compatíveis` : `${list.length} sugestões`;
  document.getElementById("outfitGrid").innerHTML=list.map(renderLook).join("") || `<div class="panel" style="padding:20px">Nenhuma combinação encontrada.</div>`;
}

function renderWardrobe(){
  const labels={shirt:"Camisas",pants:"Calças",shoes:"Sapatos",suit:"Ternos"};
  const root=document.getElementById("wardrobeSections");
  root.innerHTML=Object.entries(labels).map(([type,title])=>`
    <div class="wardrobe-group">
      <h4>${title}</h4>
      <div class="item-grid">
        ${itemsOf(type).map(it=>`
          <label class="item-card">
            <input type="checkbox" data-id="${it.id}" ${owned.has(it.id)?"checked":""}/>
            <span class="swatch" style="background:${COLORS[it.color].hex}"></span>
            <span><strong>${COLORS[it.color].name}</strong><span>${title.slice(0,-1)}</span></span>
          </label>`).join("")}
      </div>
    </div>`).join("");
  root.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.addEventListener("change",e=>{
    e.target.checked ? owned.add(e.target.dataset.id) : owned.delete(e.target.dataset.id);
    saveOwned();
  }));
}

function missingScore(item){
  let unlocked=0;
  const temp=new Set(owned); temp.add(item.id);
  for(const look of ALL_LOOKS){
    const required=look.kind==="suit" ? [look.suit,look.shirt,look.shoes] : [look.shirt,look.pants,look.shoes];
    const before=required.every(x=>owned.has(x.id));
    const after=required.every(x=>temp.has(x.id));
    if(!before && after) unlocked++;
  }
  // also measure compatibility potential with current items, even if one more piece is missing
  let near=0;
  for(const look of ALL_LOOKS){
    const required=look.kind==="suit" ? [look.suit,look.shirt,look.shoes] : [look.shirt,look.pants,look.shoes];
    if(!required.some(x=>x.id===item.id)) continue;
    const others=required.filter(x=>x.id!==item.id);
    near += others.filter(x=>owned.has(x.id)).length;
  }
  return {unlocked,score:unlocked*10+near};
}

function renderShopping(){
  const rows=ITEMS.filter(x=>!owned.has(x.id)).map(item=>({item,...missingScore(item)})).sort((a,b)=>b.score-a.score).slice(0,12);
  const typeName={shirt:"Camisa",pants:"Calça",shoes:"Sapato",suit:"Terno"};
  document.getElementById("shoppingList").innerHTML=rows.map((r,i)=>`
    <div class="shop-row">
      <span class="shop-rank">${i+1}</span>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="swatch" style="background:${COLORS[r.item.color].hex}"></span>
        <div><strong>${typeName[r.item.type]} ${COLORS[r.item.color].name}</strong><small>Alta versatilidade no seu conjunto atual</small></div>
      </div>
      <span class="unlock">${r.unlocked?`+${r.unlocked} looks agora`:"boa peça-base"}</span>
    </div>`).join("") || `<div class="panel" style="padding:20px">Seu armário já contém todas as peças do catálogo inicial.</div>`;
}

function renderGuide(){
  const groups=[
    ["Camisa + calça",[["navy","gray"],["lightblue","navy"],["burgundy","gray"],["black","beige"],["white","brown"],["olive","brown"]]],
    ["Calça + camisa",[["navy","white"],["beige","navy"],["olive","beige"],["lightgray","black"],["black","white"]]],
    ["Calça + sapato",[["black","black"],["gray","darkbrown"],["navy","oxblood"],["olive","mediumbrown"]]],
    ["Terno + sapato",[["black","black"],["charcoal","black"],["navy","darkbrown"],["lightgray","black"]]]
  ];
  document.getElementById("guideGrid").innerHTML=groups.map(([title,pairs])=>`
    <div class="guide-card"><h4>${title}</h4>
      ${pairs.map(([a,b])=>`<div class="combo-row">
        <span class="swatch" style="background:${COLORS[a].hex}"></span>
        <span>${COLORS[a].name}</span><span class="arrow">→</span>
        <span class="swatch" style="background:${COLORS[b].hex}"></span>
        <span>${COLORS[b].name}</span>
      </div>`).join("")}
    </div>`).join("");
}


const TYPE_LABELS={shirt:"Camisa",pants:"Calça",shoes:"Sapato",suit:"Terno"};
const smartState={
  anchorType:"pants",
  anchorId:null,
  selections:{shirt:null,pants:null,shoes:null,suit:null}
};

function lookMap(look){
  if(look.kind==="suit") return {suit:look.suit,shirt:look.shirt,shoes:look.shoes};
  return {shirt:look.shirt,pants:look.pants,shoes:look.shoes};
}

function lookContainsId(look,id){
  return Object.values(lookMap(look)).some(x=>x && x.id===id);
}

function setSelectionsFromLook(look){
  smartState.selections={shirt:null,pants:null,shoes:null,suit:null};
  const map=lookMap(look);
  Object.entries(map).forEach(([type,item])=>smartState.selections[type]=item?.id||null);
}

function looksForAnchor(){
  if(!smartState.anchorId) return [];
  const kind=smartState.anchorType==="suit" ? "suit" : "separates";
  return ALL_LOOKS.filter(l=>l.kind===kind && lookContainsId(l,smartState.anchorId));
}

function bestLookWith(type,id){
  const list=looksForAnchor().filter(l=>{
    const map=lookMap(l);
    return map[type]?.id===id;
  });
  return list.sort((a,b)=>b.score-a.score)[0]||null;
}

function currentBestLook(){
  const list=looksForAnchor().filter(l=>{
    const map=lookMap(l);
    return Object.entries(smartState.selections).every(([type,id])=>{
      if(!id) return true;
      return map[type]?.id===id;
    });
  });
  return list.sort((a,b)=>b.score-a.score)[0] || looksForAnchor().sort((a,b)=>b.score-a.score)[0] || null;
}

function selectAnchor(id){
  smartState.anchorId=id;
  const list=looksForAnchor().sort((a,b)=>b.score-a.score);
  if(list[0]) setSelectionsFromLook(list[0]);
  renderSmartBuilder();
  renderOutfits();
}

function chooseAlternative(type,id){
  const best=bestLookWith(type,id);
  if(best){
    setSelectionsFromLook(best);
    renderSmartBuilder();
    renderOutfits();
  }
}

function candidateOptions(type){
  const anchorLooks=looksForAnchor();
  if(!anchorLooks.length) return [];
  const current=smartState.selections;
  const scores=new Map();

  // Keep the anchor and the currently selected pieces of other categories
  // whenever this does not eliminate every option.
  let filtered=anchorLooks.filter(l=>{
    const map=lookMap(l);
    return Object.entries(current).every(([t,id])=>{
      if(!id || t===type || t===smartState.anchorType) return true;
      return map[t]?.id===id;
    });
  });
  if(!filtered.length) filtered=anchorLooks;

  for(const look of filtered){
    const item=lookMap(look)[type];
    if(!item) continue;
    const prev=scores.get(item.id);
    if(!prev || look.score>prev.score) scores.set(item.id,{item,score:look.score});
  }
  return [...scores.values()].sort((a,b)=>b.score-a.score);
}

function renderAnchorTypes(){
  const root=document.getElementById("anchorTypes");
  const order=["pants","shirt","shoes","suit"];
  root.innerHTML=order.map(type=>`<button type="button" class="type-choice ${smartState.anchorType===type?"active":""}" data-type="${type}">${TYPE_LABELS[type]}</button>`).join("");
  root.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    smartState.anchorType=btn.dataset.type;
    smartState.anchorId=null;
    smartState.selections={shirt:null,pants:null,shoes:null,suit:null};
    renderSmartBuilder();
    renderOutfits();
  }));
}

function renderAnchorItems(){
  const root=document.getElementById("anchorItems");
  root.innerHTML=itemsOf(smartState.anchorType).map(item=>`
    <button type="button" class="anchor-card ${smartState.anchorId===item.id?"selected":""}" data-id="${item.id}" aria-pressed="${smartState.anchorId===item.id}">
      <span class="swatch" style="background:${COLORS[item.color].hex}"></span>
      <span class="label">${COLORS[item.color].name}${owned.has(item.id)?'<span class="owned">No meu armário</span>':""}</span>
    </button>`).join("");
  root.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>selectAnchor(btn.dataset.id)));
}

function currentPieceCard(type,item){
  const isAnchor=item.id===smartState.anchorId;
  return `<div class="current-piece ${isAnchor?"anchor-piece":""}">
    <div class="piece-icon">${svgFor(item)}</div>
    <div>
      <small>${TYPE_LABELS[type]}</small>
      <strong>${COLORS[item.color].name}</strong>
      ${isAnchor?'<span class="anchor-badge">PEÇA INICIAL</span>':""}
    </div>
  </div>`;
}

function renderSmartResult(){
  const root=document.getElementById("smartResult");
  if(!smartState.anchorId){
    root.innerHTML=`<div class="builder-empty"><strong>Escolha uma ${TYPE_LABELS[smartState.anchorType].toLowerCase()} acima.</strong><span>O aplicativo calculará o melhor conjunto e liberará apenas alternativas compatíveis.</span></div>`;
    return;
  }

  const look=currentBestLook();
  if(!look){
    root.innerHTML=`<div class="builder-empty"><strong>Não encontramos um conjunto para essa peça.</strong><span>Tente outra cor ou outro tipo de peça.</span></div>`;
    return;
  }

  // Ensure state reflects a valid current look.
  setSelectionsFromLook(look);
  const map=lookMap(look);
  const order=look.kind==="suit" ? ["suit","shirt","shoes"] : ["shirt","pants","shoes"];
  const otherTypes=order.filter(t=>t!==smartState.anchorType);

  root.innerHTML=`
    <div class="current-look">
      <div class="current-look-head">
        <div>
          <span class="eyebrow">CONJUNTO ATUAL</span>
          <h3>Melhor combinação encontrada</h3>
        </div>
        <span class="score-big">${look.score}%</span>
      </div>
      <div class="current-set">
        ${order.map(type=>currentPieceCard(type,map[type])).join("")}
      </div>

      <div class="compatible-area">
        ${otherTypes.map(type=>{
          const options=candidateOptions(type);
          return `<div class="option-group">
            <div class="option-group-head">
              <strong>Outras opções de ${TYPE_LABELS[type].toLowerCase()}</strong>
              <span>${options.length} compatíveis</span>
            </div>
            <div class="option-list">
              ${options.map(({item,score})=>`
                <button type="button" class="option-card ${smartState.selections[type]===item.id?"selected":""}" data-type="${type}" data-id="${item.id}">
                  <span class="swatch" style="background:${COLORS[item.color].hex}"></span>
                  <span class="option-copy">
                    <strong>${COLORS[item.color].name}</strong>
                    <small>até ${score}% harmonia</small>
                  </span>
                </button>`).join("")}
            </div>
          </div>`;
        }).join("")}
      </div>
      <div class="builder-tip">Ao trocar uma opção, o terceiro elemento do conjunto é recalculado automaticamente para preservar a compatibilidade.</div>
    </div>`;

  root.querySelectorAll(".option-card").forEach(btn=>btn.addEventListener("click",()=>{
    chooseAlternative(btn.dataset.type,btn.dataset.id);
  }));
}

function renderSmartBuilder(){
  renderAnchorTypes();
  renderAnchorItems();
  renderSmartResult();
}

document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab,.tabpage").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(btn.dataset.tab).classList.add("active");
}));

document.getElementById("resetBuilder").addEventListener("click",()=>{
  smartState.anchorId=null;
  smartState.selections={shirt:null,pants:null,shoes:null,suit:null};
  renderSmartBuilder();
  renderOutfits();
});

document.getElementById("selectStarter").addEventListener("click",()=>{
  owned=new Set(STARTER); saveOwned();
});

renderGuide();
renderSmartBuilder();
refreshAll();

let deferredPrompt;
const installBtn=document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault(); deferredPrompt=e; installBtn.classList.remove("hidden");
});
installBtn.addEventListener("click",async()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt(); await deferredPrompt.userChoice;
  deferredPrompt=null; installBtn.classList.add("hidden");
});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
