
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=n=>"₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:2});
const finalPrice=p=>p.sale>0&&p.sale<p.price?p.sale:p.price;
const pct=p=>p.sale>0&&p.sale<p.price?Math.round((1-p.sale/p.price)*100):0;
function safeUrl(u){try{const x=new URL(u);return(x.protocol==="https:"||x.protocol==="http:")?x.href:""}catch(e){return""}}
let products=(window.PRODUCTS||[]).filter(p=>p.published!==false);
let cat="All",term="",sort="rel";
const categories=()=>["All",...new Set(products.map(p=>p.category).filter(Boolean))];
const PH='<div class="ph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>No image</div>';

/* reusable product card (own image + own link per product) */
function card(p,src){
  src=src!==undefined?src:(p.image||"");
  const href=safeUrl(p.url),d=pct(p);
  const img=src?`<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{innerHTML:PH}).firstChild)">`:PH;
  const buy=href?`<a class="buy" href="${esc(href)}" target="_blank" rel="noopener noreferrer nofollow sponsored">Buy Now</a>`:`<span class="buy" aria-disabled="true">Link coming soon</span>`;
  return `<article class="card"><div class="img">${d>0?`<span class="badge">-${d}%</span>`:""}${img}</div><div class="body"><span class="cat">${esc(p.category)}</span><h3 class="name">${esc(p.name||"Product name")}</h3><div class="price"><span class="now">${money(finalPrice(p)||0)}</span>${d>0?`<span class="old">${money(p.price)}</span>`:""}</div>${p.description?`<p class="desc">${esc(p.description)}</p>`:""}${buy}</div></article>`;
}
function render(){
  const cats=categories();if(!cats.includes(cat))cat="All";
  $("nav").innerHTML=cats.map(c=>`<button class="${c===cat?"on":""}" data-c="${esc(c)}">${c==="All"?"All Products":esc(c)}</button>`).join("");
  $("scat").innerHTML=cats.map(c=>`<option ${c===cat?"selected":""} value="${esc(c)}">${c==="All"?"All":esc(c)}</option>`).join("");
  const t=term.trim().toLowerCase();
  let list=products.filter(p=>(cat==="All"||p.category===cat)&&p.name.toLowerCase().includes(t));
  if(sort==="asc")list.sort((a,b)=>finalPrice(a)-finalPrice(b));
  if(sort==="desc")list.sort((a,b)=>finalPrice(b)-finalPrice(a));
  $("title").textContent=(cat==="All"?"All products":cat)+(t?` — “${term.trim()}”`:"")+` (${list.length})`;
  $("grid").innerHTML=list.map(p=>card(p)).join("");
  $("empty").textContent=products.length?"😕 No products found. Try a different search or category.":"No products available yet. Please check back later.";$("empty").style.display=list.length?"none":"block";
}
$("nav").onclick=e=>{const b=e.target.closest("button");if(b){cat=b.dataset.c;render()}};
$("scat").onchange=e=>{cat=e.target.value;render()};
$("sort").onchange=e=>{sort=e.target.value;render()};
$("q").oninput=e=>{term=e.target.value;render()};
$("sf").onsubmit=e=>{e.preventDefault();term=$("q").value;render();$("grid").scrollIntoView({behavior:"smooth"})};

/* modal helpers */
function openM(h){$("mp").innerHTML=h;$("m").classList.add("open")}
function closeM(){$("m").classList.remove("open")}
$("m").onclick=e=>{if(e.target.id==="m")closeM();const b=e.target.closest("[data-c]");if(b){cat=b.dataset.c;closeM();render()}};
function toast(t,bad){const x=$("toast");x.textContent=t;x.style.background=bad?"#8a1010":"#0b5d1e";x.style.display="block";setTimeout(()=>x.style.display="none",3500)}
try{const t=sessionStorage.getItem("vx-toast");if(t){sessionStorage.removeItem("vx-toast");toast(t)}}catch(e){}
$("menu").onclick=()=>openM(`<h3>Menu</h3>${categories().map(c=>`<div class="row"><span>${c==="All"?"All Products":esc(c)}</span><button class="sm" data-c="${esc(c)}">View</button></div>`).join("")}<br><button class="sm" onclick="closeM()">Close</button>`);

$("acct").onclick=()=>openM(`<h3>Account</h3><p class="note">Browsing and Buy Now need no login. The store owner adds products by editing products.js (see README.md).</p><button class="sm" onclick="closeM()">Close</button>`);
render();
setTimeout(()=>$("splash").classList.add("hide"),2000);
