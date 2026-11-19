/* Integrates the approved skins without changing the original narrative or intro. */
(()=>{
const lbNext=document.querySelector('#lb-next'),lbCopy=document.querySelector('#lb-copy');if(lbNext&&lbCopy)lbNext.before(lbCopy);
const step=document.querySelector('#lb-gate .lb-step[data-step="1"]');
if(step){const lr=step.querySelector('.lb-lr'),tree=step.querySelector('#lb-tree').closest('label'),depth=step.querySelector('#lb-depth').closest('label');lr.before(tree,depth);const details=document.createElement('details');details.className='depth-guide';details.innerHTML='<summary>查看深度参照</summary>';details.append(step.querySelector('.lb-depth-panel'));depth.append(details);lr.remove();step.querySelector('#lb-event').closest('label').classList.remove('wide');}
const root=document.querySelector('#act3'),inner=root?.querySelector('.a3-inner'),form=root?.querySelector('#a3-form');if(!form)return;
const types=root.querySelector('.a3-types'),quote=root.querySelector('.a3-quote'),pick=root.querySelector('#a3-pick'),copy=root.querySelector('#a3-copy'),oldBack=root.querySelector('#a3-back');
const content=document.createElement('div');content.className='layout-page-content';while(form.firstChild)content.append(form.firstChild);form.append(content);
const heading=document.createElement('div');heading.className='layout-page-heading';form.prepend(heading);
const footer=document.createElement('div');footer.className='layout-page-footer';footer.innerHTML='<button type="button" data-page-back>返回</button><span aria-live="polite"></span><button type="button" data-page-next>继续　›</button>';inner.append(footer);footer.append(copy);
let page=0,key='',drafts={};const titles=['','存在信息','种族与能力','个性与补充','档案'];
const basics=new Set(['a3-name','a3-gender','a3-era','a3-look']);const extras=new Set(['a3-persona','a3-power','a3-notes']);
function save(){if(!key)return;drafts[key]={};form.querySelectorAll('.a3-grid input,.a3-grid select,.a3-grid textarea').forEach(e=>drafts[key][e.id]=e.value);}
function show(n){page=n;root.dataset.page=String(n);types.hidden=n!==0;quote.hidden=n!==0;form.hidden=n===0||n===4;pick.hidden=n!==4;copy.hidden=n!==4;oldBack.hidden=true;heading.textContent=titles[n]; // subtype is shown on the identity page below
form.querySelectorAll('.a3-grid>label').forEach(l=>{const id=l.querySelector('input,select,textarea')?.id;const group=basics.has(id)?1:extras.has(id)?3:2;l.hidden=group!==n;});
const pools=form.querySelector('#a3-pools');if(pools)pools.hidden=n!==2||!pools.textContent.trim();const tip=form.querySelector('.a3-talent-tip');if(tip)tip.hidden=n!==3;form.querySelector('.a3-go').style.display='none';footer.querySelector('span').textContent=root.querySelector('.a3-types .on')?.dataset.type||'';footer.querySelector('[data-page-next]').textContent=n===3?'生成档案　›':n===4?'完成':'继续　›';content.scrollTop=0;root.scrollTop=0;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)(n===4?pick:n===0?types:form).animate([{opacity:.25,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});}
// Keep subtype selection with identity instead of duplicating it across pages.
const subtype=content.querySelector('.a3-row');types.after(subtype);
const originalShow=show;show=function(n){originalShow(n);subtype.hidden=n!==0;};
root.addEventListener('click',e=>{if(e.target.closest('.a3-types button')){save();queueMicrotask(()=>{key=(root.querySelector('.a3-types .on')?.dataset.type||'')+'|'+root.querySelector('#a3-sub').value;restore();show(0);});}},true);
function restore(){for(const [id,value]of Object.entries(drafts[key]||{})){const e=form.querySelector('#'+id);if(e)e.value=value;}const power=form.querySelector('input#a3-power');if(power){const area=document.createElement('textarea');area.id=power.id;area.placeholder=power.placeholder;area.value=power.value;area.rows=2;power.replaceWith(area);}const look=form.querySelector('input#a3-look');if(look){const area=document.createElement('textarea');area.id=look.id;area.placeholder=look.placeholder;area.value=look.value;area.rows=3;look.replaceWith(area);}}
subtype.addEventListener('change',()=>{save();queueMicrotask(()=>{key=(root.querySelector('.a3-types .on')?.dataset.type||'')+'|'+root.querySelector('#a3-sub').value;restore();show(0);});},true);
footer.querySelector('[data-page-back]').onclick=()=>{save();if(page===0)oldBack.click();else show(page-1);};footer.querySelector('[data-page-next]').onclick=()=>{save();if(page===0&&!root.querySelector('.a3-types .on')){footer.querySelector('span').textContent='先选一个类型。';return;}if(page===3){form.querySelector('.a3-go').click();show(4);}else if(page===4)oldBack.click();else show(page+1);};
show(0);
root.querySelector('.a3-types button.on')?.click();
})();






(()=>{
 function install(){
  const h=document.querySelector('.game-topbar');if(!h)return;
  const c=document.createElement('canvas');c.className='header-native-photons';c.setAttribute('aria-hidden','true');document.querySelector('#app-shell').prepend(c);
  const assetURL = window.akashaRenderAssetURL || (async path => path);
 const ctx=c.getContext('2d'),img=new Image();
  let sprite=null,w=0,dpr=1,frame=0,last=0,elapsed=0;const reduce=matchMedia('(prefers-reduced-motion:reduce)');
  let seed=7319;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};const particles=Array.from({length:1500},()=>({x:random(),y:random(),phase:random(),size:4.5+random()*5.1}));
  function resize(){w=c.clientWidth;dpr=Math.min(devicePixelRatio||1,2);c.width=w*dpr;c.height=100*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  new ResizeObserver(resize).observe(c);
  const alphaKeys=[[0.0, 0.0], [0.10000762951094835, 0.11764705926179886], [0.30000762951094834, 0.8235294222831726], [0.5000076295109483, 1.0], [0.7000076295109483, 0.8235294222831726], [0.9000076295109484, 0.11764705926179886], [1.0, 0.0]];
  const smooth=x=>x*x*(3-2*x);
  function alphaAt(u){for(let i=1;i<alphaKeys.length;i++){const [x1,y1]=alphaKeys[i],[x0,y0]=alphaKeys[i-1];if(u<=x1)return y0+(y1-y0)*(u-x0)/(x1-x0)}return 0}
  function draw(now){frame=0;if(document.hidden)return;if(last&&now-last<32){frame=requestAnimationFrame(draw);return}if(last)elapsed+=Math.min((now-last)/1000,.1);last=now;
   ctx.clearRect(0,0,w,100);ctx.globalCompositeOperation='lighter';
   const t=reduce.matches?2:elapsed,u=(t%4)/4;
   // Verified native 4 s, zero-tangent size curves; native seven-key alpha gradient.
   const sizePulse=smooth(u<.5?u*2:(1-u)*2),light=alphaAt(u);
   const flareScale=.6018306613+(1-.6018306613)*sizePulse;
   c.dataset.breath=light.toFixed(3);
   // Band coupling and travel speed are visual approximations, not recovered emitter settings.
   const bandLight=.24+.76*light;
   ctx.globalAlpha=.12+.26*light;
   ctx.drawImage(sprite,0,64,128,64,w*.03,-16,w*.94,78);
   for(const p of particles){
    const age=(p.phase+t/(28+p.y*12))%1;
    const side=p.x<.5?-1:1;
    const start=.15+Math.abs(p.x-.5)*1.7;
    const distance=start*(1-age);
    const x=w/2+side*w*.5*distance;
    const y=22+Math.pow(p.y,2.7)*64*(1-age*.85);
    const edge=Math.pow(Math.max(0,1-distance),.45);
    const fade=Math.min(1,age/.12)*Math.min(1,(1-age)/.16);
    ctx.globalAlpha=edge*fade*bandLight*(.30+.025*Math.sin(t*.7+p.phase*12))*(1-p.y*.4);
    const sz=p.size*(w<500?.7:1)*(1+.12*light);
    ctx.drawImage(sprite,0,0,32,32,x-sz,y-sz,sz*2,sz*2);
   }
   const flareWidth=w*.82*flareScale;
   ctx.globalAlpha=.3647058904*light;
   ctx.drawImage(sprite,0,64,128,64,w/2-flareWidth/2,-17,flareWidth,74);
   const coreSize=34*sizePulse;
   ctx.globalAlpha=1;
   if(coreSize>.01)ctx.drawImage(sprite,0,0,32,32,w/2-coreSize/2,20-coreSize/2,coreSize,coreSize);

   if(!reduce.matches)frame=requestAnimationFrame(draw);
  }
  function start(){if(sprite&&!frame)frame=requestAnimationFrame(draw)}
  img.onload=()=>{sprite=document.createElement("canvas");sprite.width=img.width;sprite.height=img.height;const sc=sprite.getContext("2d");sc.drawImage(img,0,0);const data=sc.getImageData(0,0,img.width,img.height);for(let i=0;i<data.data.length;i+=4){const a=Math.max(data.data[i],data.data[i+1],data.data[i+2]);for(let k=0;k<3;k++)data.data[i+k]=a?data.data[i+k]*255/a:0;data.data[i+3]=a;}sc.putImageData(data,0,0);start()};
  assetURL('img/fgo-ui/ef_header_particles_21.png').then(url=>{img.src=url;}).catch(console.warn);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0}else start()});reduce.addEventListener('change',start);resize();start();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();




