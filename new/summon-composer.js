/* Adapter for the approved v10 layered artwork; existing draw/selection state remains authoritative. */
(()=>{
const boot=()=>{const root=document.querySelector('#roll'),brand=root?.querySelector('.fs-brand');if(!root||!brand||root.dataset.composed==='true')return;
if(!root.dataset.summonView){setTimeout(boot,50);return}root.dataset.composed='true';
const art='img/summon-composer/';
brand.innerHTML=`<canvas class="composition-effects" width="1536" height="864" aria-hidden="true"></canvas><img class="composition-ui" src="${art}ui-0.png" alt="出身召唤"><span hidden class="release-rule-title"></span><span hidden class="release-rule-text"></span><button type="button" class="composition-arrow prev" aria-label="上一个卡池"></button><button type="button" class="composition-arrow next" aria-label="下一个卡池"></button><button type="button" class="composition-details" aria-label="召唤详情"></button><span class="composition-status" aria-live="polite"></span>`;
const foreground=document.createElement('div');foreground.className='composition-foreground';foreground.innerHTML=`<div class="summon-actors" role="img" aria-label="伦戈米尼亚德与阿瓦隆女士"><img class="summon-knight" src="img/fgo-ui/release-knight.svg" alt=""><img class="summon-parasol" src="img/fgo-ui/release-parasol.svg#svgView(viewBox(100,0,850,768))" alt=""></div><img class="foreground-rainbow" src="${art}rainbow-overlay.png" alt=""><img src="${art}labels-stars.png" alt="">`;root.prepend(foreground);
const portrait=document.createElement('img');portrait.className='composition-portrait-figures';portrait.src=art+'portrait-characters.png';portrait.alt='';foreground.append(portrait);
brand.querySelectorAll('.composition-arrow').forEach(b=>root.append(b));
const bar=root.querySelector('#fs-roll').closest('.fs-bar');bar.classList.add('composition-actions');
const roll=root.querySelector('#fs-roll'),clear=root.querySelector('#fs-clear'),next=root.querySelector('#fs-next');
const steps=root.querySelector('#fs-steps');const names=['出身','概念','技能','装备'];
function current(){return Math.max(0,[...steps.children].findIndex(x=>x.classList.contains('on')))}
function sync(){const i=current();brand.querySelector('.composition-ui').src=art+`${root.dataset.orientation==='portrait'?'portrait-':''}ui-${i}.png`;brand.querySelector('.composition-ui').alt=names[i]+'召唤';brand.querySelector('.composition-status').textContent=`第 ${i+1}/4 步 · ${names[i]}`;roll.textContent='召唤一次';clear.textContent='清空';clear.setAttribute('aria-label','清空当前卡池已选卡牌');next.textContent='下一步';next.disabled=i===3;}
new MutationObserver(sync).observe(steps,{childList:true});sync();
function move(delta){const children=[...steps.children];children[(current()+delta+children.length)%children.length]?.click()}
root.querySelector('.prev').onclick=()=>move(-1);root.querySelector('.next').onclick=()=>move(1);
root.addEventListener('keydown',e=>{if(root.dataset.summonView!=='pool'||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}});
const help=document.createElement('dialog');help.className='composition-help';help.innerHTML='<h2>四步卡池召唤详情</h2><p>出身：每次呈现 6 张，选择 1～2 张。<br>概念：每次呈现 3 张，选择 1 张。<br>技能：每次呈现 4 张，选择 2 张。<br>装备：每次呈现 3 张，选择 1 张。</p><p>左右箭头选择卡池；召唤一次会重新抽取当前卡池并清空本步选择。清空仅取消本步已选卡牌，其他步骤保留。持有状况可查看全部已选卡牌。</p><button type="button">关闭</button>';document.body.append(help);brand.querySelector('.composition-details').onclick=()=>help.showModal();help.querySelector('button').onclick=()=>help.close();help.addEventListener('close',()=>brand.querySelector('.composition-details').focus());
const holdings=root.querySelector('.summon-holdings');holdings.classList.add('composition-holdings');
help.classList.add('summon-notice');help.setAttribute('aria-labelledby','summon-notice-title');
help.innerHTML='<header class="notice-head"><h2 id="summon-notice-title">召唤详情</h2><button type="button" aria-label="关闭召唤详情">×</button></header><article class="notice-body"><div class="notice-banner"><img src="img/summon-composer/characters.png" alt=""><img src="img/summon-composer/labels-stars.png" alt=""></div><h3>◆「四步卡池推荐召唤」◆</h3><p>依次完成出身、概念、技能与装备四步选择，组合属于你的角色。</p><h3>召唤与选择规则</h3><table><thead><tr><th>卡池</th><th>每次呈现</th><th>选择数量</th></tr></thead><tbody><tr><td>出身</td><td>6 张</td><td>1～2 张</td></tr><tr><td>概念</td><td>3 张</td><td>1 张</td></tr><tr><td>技能</td><td>4 张</td><td>2 张</td></tr><tr><td>装备</td><td>3 张</td><td>1 张</td></tr></tbody></table><h3>操作说明</h3><p>使用左右箭头切换卡池。点击「召唤一次」会重新抽取当前卡池，同时清空本步选择。</p><p>在结果弹窗中点击卡槽进行选择或取消，名称下方可直接阅读概述；点击「确认选择」保存当前选择并关闭弹窗。</p><p>「清空」仅取消当前卡池的选择，其他步骤保留。「持有状况」可查看全部已选卡牌。</p></article>';
help.querySelector('button').onclick=()=>help.close();
const noticeStyle=document.createElement('link');noticeStyle.rel='stylesheet';noticeStyle.href='summon-notice.css';document.head.append(noticeStyle);
const detail=root.querySelector('.summon-card-detail');const grid=root.querySelector('#fs-grid');
function keyboardCards(){grid.querySelectorAll('.fs-card').forEach(c=>{c.tabIndex=0;c.setAttribute('role','button');c.setAttribute('aria-pressed',c.classList.contains('picked')?'true':'false')})}new MutationObserver(keyboardCards).observe(grid,{childList:true});keyboardCards();grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.fs-card')){e.preventDefault();e.target.click()}});
// Actual viewport and dock dimensions set one uniform scale for all art and hit areas.
const dock=document.querySelector('#horizontal-nav-container');
const head=document.querySelector('.game-topbar');
function fit(){
  if(document.body.dataset.screen!=='roll')return;
  const height=document.documentElement.clientHeight;
  const width=document.documentElement.clientWidth;
  const top=head?.getBoundingClientRect().bottom||0;
  const bottom=dock?.getBoundingClientRect().top??height;
  const room=Math.max(0,bottom-top);
  if(!room||!width)return;
  const portrait=matchMedia('(orientation:portrait)').matches;
  const orientation=portrait?'portrait':'landscape';
  const artWidth=portrait?720:1024;
  // The landscape title starts at y=54 and the last control ends at y=510.
  const safeTop=portrait?0:46;
  const safeHeight=portrait?960:472;
  const scale=Math.min(width/artWidth,room/safeHeight);
  root.style.setProperty('--composition-scale',scale);
  root.style.setProperty('--composition-left',(width-artWidth*scale)/2+'px');
  root.style.setProperty('--composition-top',top+(room-safeHeight*scale)/2-safeTop*scale+'px');
  root.style.setProperty('--composition-dock',height-bottom+'px');
  if(root.dataset.orientation!==orientation){root.dataset.orientation=orientation;sync();}
}
const layoutObserver=new ResizeObserver(fit);
for(const element of [document.documentElement,head,dock])if(element)layoutObserver.observe(element);
new MutationObserver(fit).observe(document.body,{attributes:true,attributeFilter:['data-screen']});
window.addEventListener('resize',fit);fit();
// Native radiance sprites, bounded to the active pool view. All art is non-interactive.
const canvas=brand.querySelector('canvas'),cx=canvas.getContext('2d'),sprite=new Image();sprite.src=art+'effects.png';let frame=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function paint(ts){frame=0;if(document.hidden||document.body.dataset.screen!=='roll'||root.dataset.summonView!=='pool')return;cx.clearRect(0,0,1536,864);cx.globalCompositeOperation='lighter';const t=reduced.matches?0:ts/1000;for(let i=0;i<32;i++){const phase=((i*.618+t*.025)%1),x=i%2?1260+Math.sin(i)*140:160+Math.sin(i)*140,y=680-phase*330,sz=3+i%4;cx.globalAlpha=Math.sin(phase*Math.PI)*.6;cx.drawImage(sprite,0,0,128,128,x,y,sz,sz)}if(!reduced.matches)frame=requestAnimationFrame(paint)}
function resume(){if(frame)cancelAnimationFrame(frame);frame=0;if(sprite.complete&&sprite.naturalWidth)paint(performance.now())}sprite.onload=resume;new MutationObserver(resume).observe(root,{attributes:true,attributeFilter:['data-summon-view']});new MutationObserver(resume).observe(document.body,{attributes:true,attributeFilter:['data-screen']});document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));else setTimeout(boot,0);
})();
