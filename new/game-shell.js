(() => {
 'use strict';
 const ready = () => {
  const $ = s => document.querySelector(s);
  const home = $('#home'), terminal = $('.game-terminal');
  const labels={home:['终端','Terminal'],timeline:['世界线','World Timeline'],roll:['灵基召唤','Talent Summoning'],profile:['魔术师','Magus Record'],'servant-profile':['英灵','Servant Record'],'origin-login':['原角色','Original Character'],'preview-all':['资料室','Archives'],'record-log':['记事录','Chronicle'],'divine-login':['里侧登录','Reverse Side']};
  terminal.innerHTML=`<div class="terminal-scene" aria-label="旋转地图">
   <div class="map-status"><strong>月の记事录</strong><span>c-surrive</span></div>
   <div class="map-viewport"><canvas id="world-map" tabindex="0" role="img" aria-label="可旋转地图，拖动或使用左右方向键旋转"></canvas><div class="map-fallback" hidden>地图暂不可显示，请使用右侧入口继续。</div>

   </div>
   <div class="map-toolbar"><div class="map-modes" role="group" aria-label="地图形态"><button data-map="cylinder" aria-pressed="true">筒状地图</button><button data-map="globe" aria-pressed="false">白色地球</button></div><div class="map-controls"><button data-turn="-1" aria-label="向左旋转">◀</button><button id="map-pause" aria-label="暂停地图旋转" aria-pressed="false">Ⅱ</button><button data-turn="1" aria-label="向右旋转">▶</button></div><small>拖动旋转 · 点击标记前往</small></div>
  </div>
  <div class="ordeal-ui">
   <button type="button" class="ordeal-rank" aria-label="人理奠基盘"><img src="img/fgo-ui/rank-hd.png" alt="人理奠基盘 A RANK" draggable="false"></button>
   <div class="chapter-selectors">
    <button data-chapter="0" aria-pressed="false"><small>奏章 IV</small>人类裁决法庭</button>
    <button data-chapter="1" aria-pressed="false"><small>奏章 III</small>新灵长后继战</button>
    <button data-chapter="2" aria-pressed="false"><small>奏章 II</small>不可逆废弃孔</button>
    <button data-chapter="3" aria-pressed="false"><small>奏章 I</small>虚数罗针内界</button>
   </div>
   <div class="region-name"></div><div class="ordeal-detail"></div>
   <button class="map-overview">◀ 返回地球全景</button>
   <div class="globe-tilt"><button data-tilt="1" aria-label="向上旋转">▲</button><button data-tilt="-1" aria-label="向下旋转">▼</button></div>
  </div>
  <div class="terminal-quests">
   <button class="release-banner" aria-label="查看月の记事录正式发布公告"><span class="banner-title"></span><span class="banner-character" aria-hidden="true"></span><span class="banner-date">上线时间：2026年11月20日0:00</span><span class="new-label">新!</span></button>
   <div class="banner-indicator" aria-hidden="true"><i></i><span>RELEASE INFORMATION</span></div>
   <a class="quest-banner quest-world" href="#timeline"><span class="quest-tag">STORY</span><span class="quest-text"><strong>迦勒底之门</strong><em>Chaldea Gate</em><small>选择世界线 · 故事由此开始</small></span><span class="quest-seal" aria-hidden="true">◇</span></a>
   <a class="quest-banner quest-summon" href="#roll"><span class="quest-tag">SUMMON</span><span class="quest-text"><strong>天赋召唤</strong><em>Talent Summoning</em><small>出身 · 概念 · 技能 · 装备</small></span><span class="quest-seal" aria-hidden="true">✦</span></a>
   <a class="quest-banner quest-record" href="#preview-all"><span class="quest-text"><strong>阿卡夏记录</strong><em>Akashic Records</em></span><span class="quest-seal" aria-hidden="true">▱</span></a>
   <button class="quest-guide" type="button" id="game-guide-toggle" aria-expanded="false">世界资料 <span>WORLD MATERIAL　⌄</span></button>
  </div>
  <div class="terminal-dialogue"><span>月の记事录</span><p>观测已就绪。请选择你的世界线，记录属于你的故事。</p></div>`;
  const rankEntrance=$('.ordeal-rank');
  let rankTimer=null,rankX=0,rankY=0;
  const cancelRankHold=()=>{clearTimeout(rankTimer);rankTimer=null;};
  const enterReverse=()=>window.openReverseEntrance?.(rankEntrance);
  rankEntrance.addEventListener('pointerdown',e=>{
   if(!e.isPrimary||e.button!==0)return;
   cancelRankHold();rankX=e.clientX;rankY=e.clientY;
   rankTimer=setTimeout(()=>{rankTimer=null;enterReverse();},700);
  });
  rankEntrance.addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-rankX,e.clientY-rankY)>14)cancelRankHold();});
  ['pointerup','pointercancel','pointerleave','blur'].forEach(type=>rankEntrance.addEventListener(type,cancelRankHold));
  rankEntrance.addEventListener('contextmenu',e=>e.preventDefault());
  rankEntrance.addEventListener('click',e=>{e.preventDefault();if(e.detail===0)enterReverse();});
  window.addEventListener('hashchange',cancelRankHold);
  document.addEventListener('visibilitychange',cancelRankHold);
  $('.release-banner').innerHTML='<img class="whole-release-poster" width="1600" height="600" src="img/announcement-release-wide.png" alt="月の记事录 · 正式发布纪念活动">';
  const figure=$('#release-top'); figure.hidden=false;
  figure.querySelector('.game-notice-heading').remove();
  figure.querySelector('figcaption').innerHTML='<button class="game-enter-primary" type="button">关闭</button><small>Confirmation</small>';
  const dialog=document.createElement('dialog'); dialog.id='release-dialog';dialog.setAttribute('aria-label','正式发布纪念公告');dialog.append(figure);document.body.append(dialog);
  const notice=$('.game-notice-button');notice.setAttribute('aria-controls','news-dialog');notice.setAttribute('aria-expanded','false');
  const news=document.createElement('dialog');news.id='news-dialog';news.setAttribute('aria-labelledby','news-heading');
  news.innerHTML='<header class="news-header"><h1 id="news-heading">游戏公告</h1><button class="news-close" aria-label="关闭游戏公告" type="button"></button></header><div class="news-scroll"><div class="news-content"><div class="news-banner-slot"></div><div class="news-dots" aria-label="第 1 张，共 1 张"><i></i></div><div class="news-tabs" role="tablist" aria-label="公告分类"></div><div class="news-panels"></div></div></div>';
  document.body.append(news);
  const banner=$('.release-banner').cloneNode(true);banner.classList.add('news-banner');banner.querySelectorAll('[id]').forEach(el=>el.id='news-'+el.id);const bannerImage=banner.querySelector('svg image');if(bannerImage)bannerImage.setAttribute('clip-path','url(#news-banner-title-crop)');news.querySelector('.news-banner-slot').append(banner);
  let returnToNews=false;
  const showNews=()=>{if(dialog.open)dialog.close();if(!news.open)news.showModal();notice.setAttribute('aria-expanded','true');document.body.classList.add('notice-open');};
  const showNotice=()=>{returnToNews=news.open;if(news.open)news.close();if(!dialog.open)dialog.showModal();document.body.classList.add('notice-open');};
  const closeNotice=()=>dialog.close();
  const tabs=news.querySelector('.news-tabs'),panels=news.querySelector('.news-panels');
  const articleStore=document.createElement('div');articleStore.hidden=true;news.append(articleStore);
  const detailView=document.createElement('section');detailView.className='news-detail-view';detailView.hidden=true;
  detailView.innerHTML='<button type="button" class="news-return">‹ 返回公告列表</button><h2 class="news-article-title" tabindex="-1"></h2><div class="news-article"></div>';
  news.querySelector('.news-scroll').append(detailView);
  const releaseArticle=document.createElement('div');
  const releaseImage=figure.querySelector('img');if(releaseImage){const img=releaseImage.cloneNode(true);img.removeAttribute('id');img.className='news-release-image';releaseArticle.append(img);}
  const releaseText=document.createElement('p');releaseText.textContent='月の记事录 · 正式发布纪念活动\n上线时间：2026年11月20日0:00';releaseArticle.append(releaseText);articleStore.append(releaseArticle);
  const homeIntroArticle=document.createElement('div');homeIntroArticle.className='news-home-intro';
  home.querySelectorAll(':scope > .card').forEach(card=>{
   const copy=card.cloneNode(true);
   copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
   copy.querySelectorAll('*').forEach(el=>{for(const a of [...el.attributes])if(a.name.startsWith('on')||a.name==='style')el.removeAttribute(a.name);});
   copy.querySelectorAll('.spacer,[aria-hidden="true"]:empty').forEach(el=>el.remove());
   homeIntroArticle.append(copy);
  });
  const gameplaySource=document.createElement('div');gameplaySource.innerHTML="<div class=\"tm-features\">\n  <div class=\"tm-grid\">\n\n    <div class=\"tm-card\">\n      <div class=\"tm-icon\">⚖️</div>\n      <h3>行动要过裁定</h3>\n      <p>\n        你写的每一句都是「行动意图」，不是既成事实。<br>\n        系统按三问判定：<strong>打不打得穿 · 吃不吃相性 · 付不付得起代价</strong>。<br>\n        结果只有三种——<strong>允许 / 降级 / 拒绝</strong>，每轮正文首行给出依据。\n      </p>\n    </div>\n\n    <div class=\"tm-card\">\n      <div class=\"tm-icon\">🕰️</div>\n      <h3>世界有自己的时钟</h3>\n      <p>\n        <strong>清晨 → 上午 → 中午 → 下午 → 黄昏 → 夜晚 → 深夜 → 次日</strong><br>\n        时间按「拍」推进，不按分钟。\n      </p>\n    </div>\n\n    <div class=\"tm-card\">\n      <div class=\"tm-icon\">🌐</div>\n      <h3>别人也在做事</h3>\n      <p>\n        势力不是背景板。它们有四个阶段：<br>\n        <strong>获知 → 准备 → 出发 → 抵达</strong>\n      </p>\n    </div>\n\n    <div class=\"tm-card\">\n      <div class=\"tm-icon\">📜</div>\n      <h3>你改写过的事会留下</h3>\n      <p>\n        你做的<strong>真正改变因果</strong>的选择，会被记下来。<br>\n        不是好感度，不是数值，是「你做过什么」。\n      </p>\n    </div>\n\n    <div class=\"tm-card\">\n      <div class=\"tm-icon\">🜁</div>\n      <h3>历史会分岔</h3>\n      <p>\n        泛人类史 / 异闻带。<br>\n        分歧点之前，两边完全一致；一旦跨过，<strong>锁死，回不去</strong>。\n      </p>\n    </div>\n\n    <div class=\"tm-card\">\n      <div class=\"tm-icon\">🎭</div>\n      <h3>没有写好的剧本</h3>\n      <p>\n        大事件有骨架，但<strong>怎么走到那里由你决定</strong>。<br>\n        引擎不推剧情，只结算你和世界的碰撞。\n      </p>\n    </div>\n\n    <div class=\"tm-card\">\n      <div class=\"tm-icon\">🎲</div>\n      <h3>天赋是真会改变玩法的</h3>\n      <p>\n        抽到的天赋带<strong>代价</strong>，代价会真的发生。<br>\n        异世界能力进了型月世界，一样受门槛约束。\n      </p>\n    </div>\n\n    <div class=\"tm-card\">\n      <div class=\"tm-icon\">✨</div>\n      <h3>宝具解放必须有效果</h3>\n      <p>\n        真名解放不是喊完就完。<br>\n        <strong>光/声/震动 → 落到目标 → 在场者反应 → 施术者代价 → 环境残留 → 战局变化</strong>\n      </p>\n    </div>\n\n  </div>\n</div>\n\n";
  const featuresArticle=document.createElement('div');featuresArticle.className='news-home-intro';
  featuresArticle.append(...gameplaySource.childNodes);
  articleStore.append(homeIntroArticle,featuresArticle);
  let articleTrigger=null,listScroll=0;
  const returnToList=()=>{const body=detailView.querySelector('.news-article');while(body.firstChild)articleStore.append(body.firstChild);detailView.hidden=true;news.querySelector('.news-content').hidden=false;news.querySelector('.news-scroll').scrollTop=listScroll;articleTrigger?.focus({preventScroll:true});};
  const openArticle=(title,content,trigger)=>{articleTrigger=trigger;listScroll=news.querySelector('.news-scroll').scrollTop;news.querySelector('.news-content').hidden=true;detailView.hidden=false;detailView.querySelector('h2').textContent=title;const body=detailView.querySelector('.news-article');body.replaceChildren();if(content)body.append(content);else body.textContent='暂无内容。';news.querySelector('.news-scroll').scrollTop=0;detailView.querySelector('h2').focus({preventScroll:true});};
  detailView.querySelector('.news-return').addEventListener('click',returnToList);
  news.addEventListener('close',()=>{if(!detailView.hidden)returnToList();});
  const selectNotice=index=>{[...tabs.children].forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels.children[i].hidden=i!==index;});};
  ['公告','备注','更新','故障'].forEach((title,i)=>{
   const tab=document.createElement('button');tab.type='button';tab.textContent=title;tab.id='notice-tab-'+i;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','notice-panel-'+i);tabs.append(tab);
   const panel=document.createElement('section');panel.id='notice-panel-'+i;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panels.append(panel);tab.addEventListener('click',()=>selectNotice(i));
   if(i===0){panel.innerHTML='<button class="news-row release-news-row" type="button"><span class="news-date">2026-11-20</span><strong>月の记事录 · 正式发布纪念活动</strong></button>';panel.firstChild.addEventListener('click',()=>openArticle('月の记事录 · 正式发布纪念活动',releaseArticle,panel.firstChild));}
   else if(i<3){const row=document.createElement('button');row.type='button';row.className='news-row';row.textContent=i===1?'作者备注':'更新日志';const content=$(i===1?'#log-note':'#log-changelog');if(content)articleStore.append(content);row.addEventListener('click',()=>openArticle(i===1?'作者备注':'更新日志',content,row));panel.append(row);}
   else panel.innerHTML='<p class="news-empty">暂无故障公告</p>';
  });
  const introTopics=[
   {title:'世界架构',en:'WORLD ARCHITECTURE',summary:'神代退场 · 历史分歧点 · 神话编纂',content:homeIntroArticle},
   {title:'本书特色',en:'CARD FEATURES',summary:'这张卡的特殊之处',content:featuresArticle}
  ];
  const slides=[banner],slot=news.querySelector('.news-banner-slot'),dots=news.querySelector('.news-dots');
  introTopics.forEach((topic,index)=>{
   const slide=document.createElement('button');slide.type='button';slide.className='news-topic-banner topic-'+index;
   slide.innerHTML='<img class="topic-poster" width="1600" height="600" src="img/'+(index===0?'notice-world-art.png?v=3af3a441':'notice-features-art.png?v=0c199fee')+'" alt="'+topic.title+'" draggable="false">';
   slide.setAttribute('aria-label','查看'+topic.title);slot.append(slide);slides.push(slide);
   slide.addEventListener('dblclick',()=>openArticle(topic.title,topic.content,slide));
   const row=document.createElement('button');row.type='button';row.className='news-row home-intro-news-row';row.innerHTML='<strong>'+topic.title+'</strong>';
   panels.children[0].append(row);row.addEventListener('click',()=>openArticle(topic.title,topic.content,row));
  });
  const setupAnnouncementCarousel=(slot,dots,slides)=>{
  dots.replaceChildren();dots.setAttribute('aria-label','公告横幅分页');let activeSlide=0;
  const track=document.createElement('div');track.className='news-banner-track';track.append(...slides);slot.append(track);
  const slideOffset=()=>activeSlide*(track.getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap||0));
  const selectSlide=index=>{activeSlide=index;track.style.transform='translateX(-'+slideOffset()+'px)';slides.forEach((slide,i)=>{slide.hidden=false;slide.inert=i!==index;slide.setAttribute('aria-hidden',String(i!==index));dots.children[i].setAttribute('aria-pressed',String(i===index));});};
  ['发布公告','世界架构','本书特色'].forEach((title,index)=>{
   const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',title+'，第 '+(index+1)+' 页，共 3 页');dot.innerHTML='<i aria-hidden="true"></i>';dots.append(dot);dot.addEventListener('click',()=>selectSlide(index));
  });
  dots.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();selectSlide((activeSlide+(event.key==='ArrowRight'?1:2))%3);dots.children[activeSlide].focus();});
  selectSlide(0);
  new ResizeObserver(()=>selectSlide(activeSlide)).observe(slot);
  let gesture=null,suppressOpenUntil=0,lastTap=null;
  slot.setAttribute('aria-label','公告横幅：左右拖动切换，双击打开');
  slides.forEach(slide=>{slide.querySelectorAll('img').forEach(img=>img.draggable=false);slide.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();slide.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));}});});
  slot.addEventListener('dragstart',event=>event.preventDefault());
  slot.addEventListener('dblclick',event=>{if(Date.now()<suppressOpenUntil){event.preventDefault();event.stopImmediatePropagation();}},true);
  slot.addEventListener('pointerdown',event=>{
   if(!event.isPrimary||event.button!==0)return;
   gesture={id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,horizontal:false};
  });
  slot.addEventListener('pointermove',event=>{
   if(!gesture||event.pointerId!==gesture.id)return;
   const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
   if(!gesture.horizontal){if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){gesture=null;lastTap=null;return;}if(Math.abs(dx)<8)return;gesture.horizontal=true;lastTap=null;slot.setPointerCapture(event.pointerId);slot.classList.add('is-dragging');}
   gesture.dx=dx;event.preventDefault();
   const edge=(activeSlide===0&&dx>0)||(activeSlide===slides.length-1&&dx<0);
   track.style.transform='translateX('+(-slideOffset()+(edge?dx*.25:dx))+'px)';
  });
  const finishDrag=event=>{
   if(!gesture||gesture.id!==event.pointerId)return;
   const g=gesture;gesture=null;slot.classList.remove('is-dragging');
   if(g.horizontal){suppressOpenUntil=Date.now()+450;lastTap=null;const step=event.type==='pointerup'&&Math.abs(g.dx)>Math.min(80,slot.clientWidth*.15)?(g.dx<0?1:-1):0;selectSlide(Math.max(0,Math.min(slides.length-1,activeSlide+step)));}
   else if(event.type==='pointerup'&&event.pointerType==='touch'){
    const now=Date.now();if(lastTap&&now-lastTap.time<350&&lastTap.index===activeSlide&&Math.hypot(event.clientX-lastTap.x,event.clientY-lastTap.y)<24){slides[activeSlide].dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));suppressOpenUntil=now+450;lastTap=null;}else lastTap={time:now,index:activeSlide,x:event.clientX,y:event.clientY};
   }
   if(slot.hasPointerCapture(event.pointerId))slot.releasePointerCapture(event.pointerId);
  };
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>slot.addEventListener(type,finishDrag));

  };
  setupAnnouncementCarousel(slot,dots,slides);
  const homeBanner=terminal.querySelector('.release-banner');
  const homeSlot=document.createElement('div');homeSlot.className='news-banner-slot home-banner-slot';
  homeBanner.before(homeSlot);homeSlot.append(homeBanner);
  const homeDots=terminal.querySelector('.banner-indicator');homeDots.className='news-dots home-banner-dots';homeDots.removeAttribute('aria-hidden');
  const homeSlides=[homeBanner];
  introTopics.forEach((topic,index)=>{
   const slide=slides[index+1].cloneNode(true);slide.inert=false;homeSlides.push(slide);homeSlot.append(slide);
   slide.addEventListener('dblclick',()=>{showNews();openArticle(topic.title,topic.content,notice);});
  });
  setupAnnouncementCarousel(homeSlot,homeDots,homeSlides);
  homeBanner.addEventListener('dblclick',showNotice);
  news.querySelectorAll('.news-row').forEach(row=>{const artwork=document.createElement('img');artwork.className='news-row-art';artwork.src='img/fgo-ui/notice-row.png';artwork.alt='';artwork.setAttribute('aria-hidden','true');const label=document.createElement('span');label.className='news-row-label';while(row.firstChild)label.append(row.firstChild);row.append(artwork,label);});
  selectNotice(0);
  tabs.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();let i=[...tabs.children].indexOf(document.activeElement);i=e.key==='Home'?0:e.key==='End'?3:(i+(e.key==='ArrowRight'?1:3))%4;selectNotice(i);tabs.children[i].focus();});
  notice.addEventListener('click',showNews);banner.addEventListener('dblclick',()=>openArticle('月の记事录 · 正式发布纪念活动',releaseArticle,banner));
  news.querySelector('.news-close').addEventListener('click',()=>news.close());
  news.addEventListener('close',()=>{notice.setAttribute('aria-expanded','false');if(!dialog.open)document.body.classList.remove('notice-open');});
  $('.game-enter-primary').addEventListener('click',closeNotice);
  dialog.addEventListener('close',()=>{document.body.classList.remove('notice-open');if(returnToNews){returnToNews=false;showNews();}});
  dialog.addEventListener('click',e=>{if(e.target===dialog)closeNotice();});
  const oldLog=$('#record-log');oldLog.replaceChildren();const noticeLink=document.createElement('button');noticeLink.type='button';noticeLink.className='btn';noticeLink.textContent='查看公告 · 作者备注与更新日志';noticeLink.addEventListener('click',()=>{selectNotice(1);showNews();});oldLog.append(noticeLink);
  $('.game-back').textContent='返回';$('.game-back').setAttribute('aria-label','返回终端');
  $('#game-guide-toggle').addEventListener('click',e=>{const open=!home.classList.contains('guide-open');home.classList.toggle('guide-open',open);e.currentTarget.setAttribute('aria-expanded',String(open));if(open)home.querySelector('.archive-divider').scrollIntoView({behavior:'smooth',block:'start'});});
  const icons={home:'<ellipse cx="32" cy="15" rx="20" ry="8"/><path d="M12 15v32c0 11 40 11 40 0V15M17 25l12 3 5-5 12 3M18 39l8-5 8 9 11-5M20 48l5-5"/>',timeline:'<circle cx="32" cy="32" r="23"/><ellipse cx="32" cy="32" rx="11" ry="23"/><path d="M9 32h46M14 19h36M14 45h36"/>',roll:'<path d="M27 7h10l3 12 12-4 5 9-9 9 9 9-5 9-12-4-3 12H27l-3-12-12 4-5-9 9-9-9-9 5-9 12 4Z"/><circle cx="32" cy="33" r="10"/>',profile:'<path d="M13 9 47 49M51 9 17 49M7 38l19 17M38 55l19-17M13 9l11 5-7 7ZM51 9l-11 5 7 7Z"/>','servant-profile':'<path d="m13 14 15-5 20 5 5 15-8 22-13 8-13-8-8-22Z M21 24l11-8 11 8-3 19-8 8-8-8Z"/>','origin-login':'<circle cx="32" cy="22" r="11"/><path d="M12 53c0-22 40-22 40 0ZM24 11l8-5 8 5"/>','preview-all':'<path d="m12 10 31-3 12 9v38l-31 4-12-8ZM24 20l31-4M24 20v38M12 10l12 10M30 30l17-2M30 39l17-2"/>','record-log':'<path d="M39 11H12v45h39V31M27 37l4-13L49 6l9 9-18 18ZM31 24l9 9M21 46h22"/>'};
  $('#horizontal-nav').setAttribute('role','navigation');
  document.querySelectorAll('#horizontal-nav .nav-btn').forEach(a=>{const id=a.dataset.target;if(!icons[id])return;const label=id==='roll'?'召唤':labels[id][0];a.setAttribute('aria-label',labels[id][0]);a.innerHTML=`<span class="nav-diamond"><svg viewBox="0 0 64 64" aria-hidden="true">${icons[id]}</svg></span><span class="nav-title">${label}</span>`;});
  labels.formation=['编队','Formation'];
  const formation=document.createElement('section');formation.id='formation';formation.className='tm-section';
  formation.innerHTML='<div class="formation-character" aria-hidden="true"><img src="img/fgo-ui/formation-character.png" alt="" draggable="false"></div><div class="formation-heading"><h1>编队</h1><p>选择需要编写或查看的角色记录</p></div><div class="formation-list">'+[
   ['profile','魔术师登记','Magus Record','魔术回路、起源与个人经历','fgo-plate-master.png'],
   ['servant-profile','英灵登记','Servant Record','职阶、能力与宝具记录','fgo-plate-grand.png'],
   ['origin-login','原角色登记','Original Character','原作角色与个人设定','fgo-plate-second.png']
  ].map(([id,title,en,desc,plate])=>'<a class="formation-entry" href="#'+id+'" title="'+title+'"><img class="plate" src="img/fgo-ui/'+plate+'" alt="'+title+'" style="width:100%;height:auto;max-width:none;position:static;display:block;margin:0;left:auto;top:auto;transform:none;filter:none"><span class="formation-label">'+title+'</span></a>').join('')+'</div>';
  home.parentElement.insertBefore(formation,home.nextSibling);
  formation.querySelectorAll('.formation-entry').forEach(entry=>{
   const img=entry.querySelector('img.plate'),label=entry.querySelector('.formation-label');
   const surface=document.createElement('canvas');surface.width=444;surface.height=117;surface.className='formation-label-surface';surface.setAttribute('aria-hidden','true');entry.insertBefore(surface,label);
   const render=()=>{const ctx=surface.getContext('2d');ctx.clearRect(0,0,444,117);ctx.drawImage(img,140,36,1,38,173,36,222,38);};
   if(img.complete&&img.naturalWidth)render();else img.addEventListener('load',render,{once:true});
  });
  // Contextual navigation is handled by the fixed top-left back button.
  const navs=[['home','终端','menu-terminal',true],['formation','编队','menu-formation',true],['roll','召唤','menu-summon',true],['preview-all','个人空间','menu-room',true]];
  $('#horizontal-nav').innerHTML=navs.map(([id,title,asset,baked])=>'<a class="nav-btn native-nav '+(baked?'native-baked':'native-custom')+'" data-target="'+id+'" href="#'+id+'" aria-label="'+title+'"><span class="native-sprite"><img src="img/fgo-ui/'+asset+'.png" alt=""></span>'+(baked?'':'<span class="nav-title">'+title+'</span>')+'</a>').join('');
  const roll=$('#roll'),brand=$('.fs-brand');
  brand.innerHTML='<div class="summon-eyebrow">AKASHA · TALENT PICKUP</div><h1>可能性召唤</h1><div class="summon-line"><span>天赋构筑</span><b>常驻卡池</b></div><p>四步抽卡 · 出身 / 概念 / 技能 / 装备</p>';
  const summoning=document.createElement('div');summoning.className='summon-art';summoning.setAttribute('aria-hidden','true');summoning.innerHTML='<canvas class="summon-native-canvas"></canvas>';roll.prepend(summoning);const nativeBackground=document.createElement('script');nativeBackground.src='summon-background.js';document.head.append(nativeBackground);
  $('#fs-roll').innerHTML='<small>寻找新的可能性</small><strong>天赋召唤</strong>';
  $('#fs-roll').addEventListener('click',()=>{roll.classList.remove('summoning');void roll.offsetWidth;roll.classList.add('summoning');setTimeout(()=>roll.classList.remove('summoning'),1100);});
  const cards=$('#fs-grid');
  const enhanceCards=()=>{cards.querySelectorAll('.fs-card').forEach((card,i)=>{card.setAttribute('role','button');card.setAttribute('tabindex','0');card.setAttribute('aria-pressed',String(card.classList.contains('picked')));card.style.setProperty('--card-index',i);});};
  new MutationObserver(enhanceCards).observe(cards,{childList:true});enhanceCards();
  cards.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.fs-card')){e.preventDefault();e.target.click();}});
  const sync=()=>{const id=location.hash.slice(1)||'home';document.body.dataset.screen=id;document.body.classList.toggle('show-ordeal',id==='home'&&terminal.classList.contains('is-globe'));$('#game-location-label').textContent=(labels[id]||labels.home)[0];$('.game-location>span').textContent=(labels[id]||labels.home)[1];document.querySelectorAll('#horizontal-nav .nav-btn').forEach(a=>a.setAttribute('aria-current',(a.dataset.target===id||(a.dataset.target==='formation'&&['profile','servant-profile','origin-login'].includes(id)))?'page':'false'));if(dialog.open)closeNotice();requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));};
  window.addEventListener('hashchange',sync);sync();
  if(window.AkashaMap)window.AkashaMap.init($('#world-map'));
  let seen=false;try{seen=sessionStorage.getItem('akasha-game-notice')==='1';}catch{}
  if(!seen){const loader=$('#loader-overlay');const openWhenReady=()=>{if(loader&&loader.isConnected&&!loader.classList.contains('hidden')&&getComputedStyle(loader).display!=='none'&&getComputedStyle(loader).visibility!=='hidden')return false;showNotice();try{sessionStorage.setItem('akasha-game-notice','1');}catch{}return true;};if(!openWhenReady()){const observer=new MutationObserver(()=>{if(openWhenReady())observer.disconnect();});observer.observe(loader,{attributes:true,attributeFilter:['class','style','hidden']});setTimeout(()=>{if(openWhenReady())observer.disconnect();},2000);}}
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();



