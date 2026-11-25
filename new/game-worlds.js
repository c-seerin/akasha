/* Work-level world selection; original radio inputs and cards are retained. */
(()=>{const categories=[{"id":"fgo","label":"Fate/Grand Order","note":"全章节 · 序章到奏章Ⅳ","section":"fgo","ids":["pick-fgo","pick-fgo-s1","pick-fgo-s2","pick-fgo-s3","pick-fgo-s4","pick-fgo-s5","pick-fgo-s6","pick-fgo-s7","pick-fgo-solomon","pick-eor1","pick-eor2","pick-eor3","pick-eor4","pick-lb1","pick-lb2","pick-lb3","pick-lb4","pick-lb5","pick-lb6","pick-lb7","pick-oc1","pick-oc2","pick-oc3","pick-oc4","pick-fgo-heian","pick-fgo-tunguska","pick-fgo-traum"]},{"id":"fate-zero","label":"Fate/Zero","ids":["pick-fzero"],"note":"选择章节与故事起点"},{"id":"fate-stay-night","label":"Fate/stay night","ids":["pick-fsn","pick-fsn-hf"],"note":"选择章节与故事起点"},{"id":"fate-hollow","label":"Fate/hollow ataraxia","ids":["pick-fha"],"note":"选择章节与故事起点"},{"id":"fate-fake","label":"Fate/strange Fake","note":"雪原市的圣杯战争","section":"series","ids":["pick-fsf-snowfield","pick-servant-fsf"]},{"id":"extra","label":"Fate/EXTRA","ids":["pick-extra"],"note":"选择章节与故事起点"},{"id":"extra-ccc","label":"Fate/EXTRA CCC","ids":["pick-extra-ccc"],"note":"选择章节与故事起点"},{"id":"last-encore","label":"Fate/EXTRA Last Encore","ids":["pick-extra-le"],"note":"选择章节与故事起点"},{"id":"prototype","label":"Fate/Prototype","ids":["pick-prototype"],"note":"选择章节与故事起点"},{"id":"fragments","label":"Fate/Prototype 苍银的碎片","ids":["pick-fragments"],"note":"选择章节与故事起点"},{"id":"fate-apocrypha","label":"Fate/Apocrypha","note":"红与黑的圣杯大战","section":"series","ids":["pick-apo-s1","pick-apo-s2","pick-servant-apo-black","pick-servant-apo-red"]},{"id":"prisma","label":"魔法少女伊莉雅","note":"第一季 · 雪下的誓言","section":"series","ids":["pick-prisma-s1","pick-prisma-yuki","pick-servant-prisma","pick-servant-snow"]},{"id":"case-files","label":"埃尔梅罗二世事件簿","ids":["pick-adra","pick-iselma","pick-rail","pick-atlas","pick-grandroll"],"note":"选择章节与故事起点"},{"id":"adventures","label":"埃尔梅罗二世的大冒险","ids":["pick-adventure-食神之男","pick-adventure-彷徨海","pick-adventure-炼金遗产","pick-adventure-费姆船宴","pick-adventure-星冠密议"],"note":"选择章节与故事起点"},{"id":"tsukihime","label":"月姬","ids":["pick-tsuki","pick-tsuki-remake"],"note":"选择章节与故事起点"},{"id":"melty","label":"月姬格斗","ids":["pick-melty-lumina"],"note":"选择章节与故事起点"},{"id":"kara","label":"空之境界","note":"两仪式与都市异闻","section":"series","ids":["pick-knk"]},{"id":"mahoyo","label":"魔法使之夜","note":"本篇 · 隈乃温泉","section":"series","ids":["pick-mahou","pick-kumano"]},{"id":"custom","label":"自定义世界线","note":"书写自己的故事起点","section":"series","ids":["pick-custom","pick-servant-custom"]},{"id":"divine","label":"神代主线","note":"神话时代的故事起点","ids":["pick-divine-sumer","pick-divine-greek","pick-divine-norse","pick-divine-arthur"]}];

// Native board artwork, with a separately editable title. Frame pixels stay untouched.
function paintWorkBoard(button,label,variant,hue){
 const canvas=document.createElement('canvas');canvas.width=1350;canvas.height=267;canvas.className='native-work-art';canvas.setAttribute('aria-hidden','true');button.append(canvas);
 const source=new Image();source.src='img/fgo-ui/questboard_cap'+variant+'.png';
 source.onload=async()=>{
  await document.fonts.load('800 32px "Akasha Registration Serif VF"');
  const clean=document.createElement('canvas');clean.width=450;clean.height=139;const c=clean.getContext('2d');c.drawImage(source,0,0);
  // Reuse the unlettered native texture on the left, preserving the native frame and end caps.
  const fill=document.createElement('canvas');fill.width=450;fill.height=139;const f=fill.getContext('2d');
  for(let x=20,i=0;x<430;x+=104,i++){
   f.save();f.translate(x+(i%2?104:0),0);f.scale(i%2?-1:1,1);f.drawImage(source,24,44,104,68,0,44,104,68);f.restore();
  }
  f.globalCompositeOperation='destination-in';const fade=f.createLinearGradient(20,0,430,0);fade.addColorStop(0,'transparent');fade.addColorStop(.06,'white');fade.addColorStop(.94,'white');fade.addColorStop(1,'transparent');f.fillStyle=fade;f.fillRect(0,0,450,139);
  c.drawImage(fill,0,0);
  const ctx=canvas.getContext('2d');ctx.scale(3,3);ctx.drawImage(source,0,35,450,89,0,0,450,89);
  // Apply colour only inside the native border, leaving silver/black trim unaltered.
  ctx.save();ctx.beginPath();ctx.moveTo(12,8);ctx.lineTo(438,8);ctx.lineTo(441,18);ctx.lineTo(432,45);ctx.lineTo(441,70);ctx.lineTo(438,81);ctx.lineTo(12,81);ctx.lineTo(9,70);ctx.lineTo(18,45);ctx.lineTo(9,18);ctx.closePath();ctx.clip();
  ctx.filter=button.classList.contains('mahoyo-blue')?'saturate(1.15) brightness(1.16)':'hue-rotate('+hue+'deg)'+(label?'':' saturate(.65) brightness(.78)');ctx.drawImage(clean,0,35,450,89,0,0,450,89);if(button.classList.contains('champagne-story')){ctx.filter='none';ctx.globalCompositeOperation='screen';ctx.fillStyle='#b1a363';ctx.fillRect(0,0,450,89);}ctx.restore();
  if(!label){canvas.className='native-story-art';button.dataset.artReady='true';return;}
  ctx.font='800 32px "Akasha Registration Serif VF", serif';
  const measured=ctx.measureText(label).width;const size=Math.min(32,32*390/measured);ctx.font='800 '+size+'px "Akasha Registration Serif VF", serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  ctx.strokeStyle='#182b3b';ctx.lineWidth=2.2;ctx.strokeText(label,225,40);
  const silver=ctx.createLinearGradient(0,24,0,57);silver.addColorStop(0,'#ffffff');silver.addColorStop(.45,'#f9faf2');silver.addColorStop(.5,'#bec9cf');silver.addColorStop(1,'#eff9ff');ctx.fillStyle=silver;ctx.fillText(label,225,40);
  ctx.font='8px Georgia,serif';ctx.fillStyle='#a8d9ed';ctx.fillText('W O R L D   R E C O R D',225,66);button.dataset.artReady='true';
 };
}

const init=()=>{
 const metalFilters=document.createElementNS('http://www.w3.org/2000/svg','svg');metalFilters.setAttribute('width','0');metalFilters.setAttribute('height','0');metalFilters.style.position='absolute';metalFilters.setAttribute('aria-hidden','true');
 metalFilters.innerHTML='<defs><filter id="raised-logo-metal" x="-40%" y="-25%" width="180%" height="150%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="4" result="outer"/><feFlood flood-color="#171e2b"/><feComposite in2="outer" operator="in" result="dark"/><feMorphology in="SourceAlpha" operator="dilate" radius="2.8" result="silverMask"/><feFlood flood-color="#e6e7e2"/><feComposite in2="silverMask" operator="in" result="silver"/><feMorphology in="SourceAlpha" operator="dilate" radius="1" result="innerMask"/><feFlood flood-color="#66758e"/><feComposite in2="innerMask" operator="in" result="inner"/><feMerge><feMergeNode in="dark"/><feMergeNode in="silver"/><feMergeNode in="inner"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';document.body.append(metalFilters);
 const moon=categories.find(c=>c.id==='tsukihime'),melty=categories.find(c=>c.id==='melty');
 if(moon&&melty){moon.label='月姬 / 月姬格斗';moon.ids.push(...melty.ids);categories.splice(categories.indexOf(melty),1);}

 const fateWorks=categories.filter(c=>c.id!=='fgo'&&/^fate[\/／]/i.test(c.label));
 if(fateWorks.length){
  const at=categories.findIndex(c=>c===fateWorks[0]);
  const pack={id:'fate-series',label:'Fate 系列',note:'Zero · stay night · EXTRA · 其他 Fate 作品',ids:fateWorks.flatMap(c=>c.ids)};
  for(let i=categories.length-1;i>=0;i--)if(fateWorks.includes(categories[i]))categories.splice(i,1);
  categories.splice(at,0,pack);
 }
 const panel=document.querySelector('.terminal-quests'),legacy=document.querySelector('#timeline');
 if(!panel||!legacy)return;
 const radios=[...legacy.querySelectorAll('input[name="entry-world"]')];
 const all=radios.map(r=>({id:r.id,card:r.closest('.timeline-card'),radio:r})).filter(x=>x.card);
 const known=new Set(categories.flatMap(c=>c.ids));
 const extra=all.filter(x=>!known.has(x.id));if(extra.length)categories.push({id:'other',label:'其他世界',note:'原页面的其他登录点',ids:extra.map(x=>x.id)});
 const groups=categories.map(c=>({...c,entries:c.ids.map(id=>all.find(x=>x.id===id)).filter(Boolean)})).filter(c=>c.entries.length);
 panel.querySelectorAll('.quest-banner,.quest-guide').forEach(e=>e.remove());
 const host=document.createElement('div');host.className='world-browser';
 host.innerHTML='<div class="world-selection" role="status" aria-live="polite"></div><div class="work-toolbar" hidden><button type="button">‹ 返回作品</button><h2></h2></div><div class="work-index"></div><div class="work-chapters" hidden></div><a class="world-continue" href="#formation" hidden>前往编队　›</a>';
 panel.append(host);
 const index=host.querySelector('.work-index'),chapters=host.querySelector('.work-chapters'),toolbar=host.querySelector('.work-toolbar'),status=host.querySelector('.world-selection'),next=host.querySelector('.world-continue');
 let active=null;
 const fgoIds=new Set(categories.find(c=>c.id==='fgo').ids);
 all.forEach(x=>{if(!fgoIds.has(x.id)){
  x.card.classList.add('compact-world-card');
  [...x.card.childNodes].filter(n=>n.nodeType===3&&!n.textContent.trim()).forEach(n=>n.remove());
  const heading=x.card.querySelector('h4');if(x.id==='pick-prisma-s1')heading.textContent='Fate/kaleid liner';
  const logo=x.card.querySelector('.work-logo');
  if(logo){const classify=()=>{if(logo.naturalHeight/ logo.naturalWidth>1.05)x.card.classList.add('raised-logo-card');};if(logo.complete)classify();else logo.addEventListener('load',classify,{once:true});}
 if(logo?.getAttribute('src').includes('prisma.webp'))x.card.classList.add('champagne-story','wide-logo-story');
  else if(logo?.getAttribute('src').includes('elmelloi.webp'))x.card.classList.add('wide-logo-story');
 
  const group=groups.find(g=>g.ids.includes(x.id));if(group?.id==='mahoyo')x.card.classList.add('mahoyo-blue');
  const palette={'fate-series':[11000,0],'prisma':[11000,55],'case-files':[11000,38],'adventures':[12000,30],'tsukihime':[11000,22],'kara':[11000,8],'mahoyo':[11000,0],'custom':[11000,290]};
  if(!x.card.querySelector('textarea,input:not([type=radio])')){paintWorkBoard(x.card,'',...(palette[group?.id]||[11000,0]));x.card.classList.add('metal-story-card');}
 x.card.tabIndex=0;x.card.setAttribute('role','button');x.card.setAttribute('aria-label',x.card.querySelector('h4')?.textContent.trim()||x.radio.value);
  x.card.addEventListener('keydown',e=>{if(e.target===x.card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();x.radio.click();}});
 }});
 document.querySelector('.game-back').addEventListener('click',e=>{
  if(document.querySelector('.terminal-scene.is-globe')||document.body.classList.contains('show-ordeal'))return;
  e.preventDefault();e.stopImmediatePropagation();
  const screen=document.body.dataset.screen||'home';
  if(screen==='home'&&active){showIndex();return;}
  if(['profile','servant-profile','origin-login'].includes(screen)){location.hash='formation';return;}
  if(screen!=='home'){location.hash='home';return;}
  showIndex();window.scrollTo({top:0,behavior:'smooth'});
 },true);
 // Move the original nodes, preserving IDs, values, listeners and custom fields.
 all.forEach(x=>{x.card.hidden=true;chapters.append(x.card);if(x.card.classList.contains('node-card')){x.card.querySelectorAll('img.node-plate').forEach(img=>{img.loading='eager';});x.card.tabIndex=0;x.card.setAttribute('role','button');x.card.setAttribute('aria-label',x.card.querySelector('h4').textContent.trim());x.card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();x.radio.click();}});}});
 function update(){const chosen=all.find(x=>x.radio.checked);status.textContent=chosen?'已选择 · '+chosen.card.querySelector('h4').textContent.trim():'选择作品，再选择世界线';next.hidden=!chosen;all.forEach(x=>{x.card.classList.toggle('world-picked',x.radio.checked);if(x.card.classList.contains('node-card')||x.card.classList.contains('compact-world-card'))x.card.setAttribute('aria-pressed',String(x.radio.checked));});}
 function showIndex(){active=null;index.hidden=false;chapters.hidden=true;toolbar.hidden=true;all.forEach(x=>x.card.hidden=true);panel.scrollTop=0;}
 function showWork(g){active=g.id;chapters.dataset.work=g.id;index.hidden=true;chapters.hidden=false;toolbar.hidden=false;toolbar.querySelector('h2').textContent=g.label;all.forEach(x=>x.card.hidden=!g.ids.includes(x.id));panel.scrollTop=host.offsetTop-panel.offsetTop;update();}
 for(const g of groups){
  const btn=document.createElement('button');btn.type='button';btn.className='work-banner';btn.dataset.work=g.id;if(g.id==='mahoyo')btn.classList.add('mahoyo-blue');
  const title=document.createElement('strong');title.textContent=g.label;
  const note=document.createElement('span');note.textContent=g.note||'选择故事起点';
  const count=document.createElement('small');count.textContent=g.entries.length+' 个世界线';
  btn.setAttribute('aria-label',g.label+' · '+g.entries.length+' 个世界线');btn.title=g.label+' · '+(g.note||'选择故事起点');
  if(g.id==='divine'){
   btn.classList.add('ordeal-entry');btn.setAttribute('aria-label','Ordeal Call · 神代登录');const art=document.createElement('img');art.src='img/fgo-ui/questboard_cap401.png';art.alt='Ordeal Call';btn.append(art);
   btn.addEventListener('click',()=>window.AkashaMap.openDivine());host.before(btn);
  }else{const styles={'fgo':[11000,0],'fate-series':[12000,0],'prisma':[12000,305],'case-files':[11000,48],'adventures':[12000,32],'tsukihime':[11000,20],'melty':[12000,330],'kara':[11000,115],'mahoyo':[11000,0],'custom':[11000,290],'other':[11000,160]};const style=styles[g.id]||[11000,0];paintWorkBoard(btn,g.label,...style);btn.addEventListener('click',()=>showWork(g));index.append(btn);}
 }
 toolbar.querySelector('button').onclick=showIndex;
 const fitTitles=()=>{
  chapters.querySelectorAll('.metal-story-card:not([hidden])').forEach(card=>{
   const title=card.querySelector('h4');if(!title)return;
   title.style.removeProperty('font-size');
   const limit=Math.max(36,card.clientHeight-24);
   let size=parseFloat(getComputedStyle(title).fontSize)||Math.min(28,Math.max(16,card.clientWidth*.043));
   let guard=0;
   while(guard++<40&&size>9&&(title.scrollWidth>title.clientWidth+1||title.getBoundingClientRect().height>limit)){size-=.5;title.style.setProperty('font-size',size+'px','important');}
  });
 };
 const titleObserver=new ResizeObserver(()=>requestAnimationFrame(fitTitles));titleObserver.observe(chapters);
 document.fonts.ready.then(fitTitles);
 chapters.addEventListener('change',update);update();
 const oldBrowsers=legacy.querySelectorAll('.entry-category-browser');oldBrowsers.forEach(e=>e.hidden=true);
 // Keep legacy anchors accessible while routing world selection into the terminal.
 const enter=()=>{if(location.hash==='#timeline'){document.querySelector('[data-map="cylinder"]').click();showIndex();location.replace('#home');}};
 window.addEventListener('hashchange',enter);enter();
 host.dataset.entryCount=String(all.length);host.dataset.workCount=String(groups.length);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();


