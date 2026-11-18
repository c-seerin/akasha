(()=>{
 const start=()=>{
 const root=document.querySelector('#roll'), grid=document.querySelector('#fs-grid');
 if(!root||!grid||root.dataset.summonView)return;root.dataset.summonView='pool';
 const brand=root.querySelector('.fs-brand');
 brand.innerHTML=`<img class="release-figure figure-knight" src="img/fgo-ui/release-knight.svg" alt="白色铠甲骑士"><img class="release-figure figure-parasol" src="img/fgo-ui/release-parasol.svg" alt="白发持伞少女"><img class="release-rainbow" src="img/fgo-ui/release-rainbow-clean.png" alt="" aria-hidden="true"><img class="release-title" src="img/fgo-ui/release-summon-title.svg" alt="月の记事录 正式发布 纪念活动"><img class="release-central-original" src="img/fgo-ui/release-central-original.png" alt="原版召唤中央组件，原文字对照"><div class="release-fan" aria-hidden="true"><img src="img/fgo-ui/summon-card.svg"><img src="img/fgo-ui/summon-card.svg"><img src="img/fgo-ui/summon-card.svg"></div><div class="release-heading"><strong>命运召唤</strong><span>纪念卡池</span></div><div class="release-strip"><span>月の记事录发布纪念<br><b>命运卡池推荐召唤</b></span><time datetime="2026-11-20T00:00:00+08:00">11月20日（周五）<br><b>0:00开始！</b></time></div><div class="release-rules"><strong class="release-rule-title">出身召唤</strong><div class="release-rule-text">每次呈现 <em>6 张</em>出身卡牌<br>选择 <em>1～2 张</em>作为你的出身</div></div><p class="release-note">依次完成出身、概念、技能、装备四步选择。可通过「持有状况」查看已选卡牌。</p>`;

 const roll=document.querySelector('#fs-roll');roll.innerHTML='<span>召唤 × 6</span>';
 const names=['出身','概念','技能','装备'], counts=[6,3,4,3], picks=['1～2','1','2','1'];
 function syncRules(){const steps=[...root.querySelectorAll('.fs-step')];let i=steps.findIndex(e=>e.classList.contains('on'));if(i<0)i=0;brand.querySelector('.release-rule-title').textContent=names[i]+'召唤';brand.querySelector('.release-rule-text').innerHTML='每次呈现 <em>'+counts[i]+' 张</em>'+names[i]+'卡牌<br>选择 <em>'+picks[i]+' 张</em>作为你的'+names[i];roll.innerHTML='<span>召唤 × '+counts[i]+'</span>';steps.forEach((e,j)=>e.dataset.label='STEP '+(j+1)+' · '+names[j]);}
 new MutationObserver(syncRules).observe(root.querySelector('#fs-steps'),{childList:true,subtree:true});syncRules();
 const back=document.createElement('button');back.type='button';back.className='summon-return-pool';back.textContent='返回召唤';root.querySelector('.fs-bar').prepend(back);
 const detail=document.createElement('div');detail.className='summon-card-detail';detail.setAttribute('aria-live','polite');grid.after(detail);
 const holdings=document.createElement('button');holdings.type='button';holdings.className='summon-holdings';holdings.setAttribute('aria-haspopup','dialog');holdings.setAttribute('aria-label','持有状况');holdings.innerHTML='<img src="img/fgo-ui/summon-holdings.svg" alt="持有状况">';detail.after(holdings);
 const dialog=document.createElement('dialog');dialog.className='summon-holdings-dialog';dialog.setAttribute('aria-labelledby','holdings-title');dialog.innerHTML='<header><h2 id="holdings-title">持有状况</h2><p>查看已选择的出身、概念、技能与装备</p></header><div class="holdings-content"></div><footer><button type="button" class="holdings-close">关闭</button></footer>';document.body.append(dialog);
 function renderHoldings(){const content=dialog.querySelector('.holdings-content');content.replaceChildren();let count=0;root.querySelectorAll('#fs-picked .pk-row').forEach(row=>{const category=row.querySelector('.pk-k')?.textContent||'';row.querySelectorAll('.pk-v em').forEach(item=>{count++;const entry=document.createElement('article');entry.className='holding-entry';const card=document.createElement('div');card.className='holding-card';const name=document.createElement('h3');name.textContent=item.textContent;const tag=document.createElement('span');tag.textContent=category;card.append(name,tag);const label=document.createElement('p');label.className='holding-category';label.textContent=category;entry.append(card,label);content.append(entry);});});if(!count){const empty=document.createElement('p');empty.className='holdings-empty';empty.textContent='尚未选择卡牌，召唤后点击卡牌即可选择。';content.append(empty);}}
 holdings.addEventListener('click',()=>{renderHoldings();dialog.showModal();});dialog.querySelector('.holdings-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>holdings.focus());
 new MutationObserver(()=>{if(dialog.open)renderHoldings();}).observe(root.querySelector('#fs-picked'),{childList:true,subtree:true});
 const results=document.createElement('dialog');results.className='summon-results-dialog';results.setAttribute('aria-labelledby','summon-results-title');
 results.innerHTML='<header><h2 id="summon-results-title">召唤结果</h2><p class="results-rule"></p></header><div class="results-scroll"></div><footer><button type="button" data-action="clear">清空选择</button><button type="button" data-action="close">确认选择</button></footer>';
 root.append(results);results.querySelector('.results-scroll').append(grid,detail);
 const skin=document.createElement('style');skin.textContent=`
 body #app-shell #roll dialog.summon-results-dialog{position:fixed!important;inset:0!important;margin:auto!important;width:min(1100px,94vw);height:min(620px,86dvh);max-width:none;max-height:none;padding:28px 34px 50px;border:0;background:url('img/fgo-ui/release-frame.png') center/100% 100% no-repeat;color:white;overflow:hidden;font-family:SummonFGO,sans-serif;box-sizing:border-box}
 #roll dialog.summon-results-dialog:not([open]){display:none!important}
 #roll dialog.summon-results-dialog[open]{display:flex!important;flex-direction:column;gap:14px}
 .summon-results-dialog::backdrop{background:#020b21a8}
 #roll .summon-results-dialog header{text-align:center;flex:none}
 #roll .summon-results-dialog h2{font-size:30px;line-height:1.3;margin:0 0 8px;color:white;text-shadow:0 2px 3px #10243b}
 #roll .summon-results-dialog .results-rule{font-size:16px;margin:0;color:#e6f7ff}
 #roll .summon-results-dialog .results-scroll{flex:1;min-height:0;overflow:auto;scrollbar-color:#d8e8f4 #142d50}
 body #app-shell #roll[data-summon-view=pool] dialog.summon-results-dialog #fs-grid{display:flex!important;position:relative!important;inset:auto!important;transform:none!important;width:100%!important;gap:14px!important;padding:20px 4px 12px!important}
 body #app-shell #roll .summon-results-dialog .fs-card{flex:0 0 calc((100% - 70px)/6);width:auto;aspect-ratio:132/180!important;min-width:0!important}
 body #app-shell #roll .summon-results-dialog .fs-card h4{font-size:16px!important}
 body #app-shell #roll .summon-results-dialog .fs-card.picked{filter:drop-shadow(0 0 6px #8af7ff)!important}
 body #app-shell #roll .summon-results-dialog .fs-card.picked:after{display:block!important;content:'已选择'!important;position:absolute;top:7%!important;right:4%!important;bottom:auto!important;background:#e5faff;color:#14374f;padding:2px 7px;font-size:12px}
 body #app-shell #roll[data-summon-view=pool] .summon-results-dialog .summon-card-detail{display:block!important;margin:8px 4px!important;padding:12px 18px!important;min-height:70px;font-size:15px;background:#051a36aa}
 #roll .summon-results-dialog footer{display:flex;justify-content:center;gap:24px;flex:none}
 #roll .summon-results-dialog footer button{width:190px;height:55px;min-width:0;padding:0;border:0;background:url('img/fgo-ui/native-silver.png') center/100% 100% no-repeat;color:#18334d;font:22px SummonFGO,sans-serif;cursor:pointer}
 @media(max-width:640px){body #app-shell #roll dialog.summon-results-dialog{height:88dvh;padding:24px 18px 44px}body #app-shell #roll .summon-results-dialog .fs-card{flex-basis:calc((100% - 28px)/3)}body #app-shell #roll .summon-results-dialog .fs-card h4{font-size:13px!important}#roll .summon-results-dialog footer{gap:10px}#roll .summon-results-dialog footer button{width:145px;height:45px;font-size:18px}#roll .summon-results-dialog h2{font-size:25px}}
 `;document.head.append(skin);
 const formationSkin=document.createElement('link');formationSkin.rel='stylesheet';formationSkin.href='summon-results.css';document.head.append(formationSkin);
 function updateResultTitle(){let i=[...root.querySelectorAll('.fs-step')].findIndex(e=>e.classList.contains('on'));i=Math.max(0,i);results.querySelector('h2').textContent=names[i]+'召唤结果';results.querySelector('.results-rule').textContent='请选择 '+picks[i]+' 张 · 已选 '+grid.querySelectorAll('.picked').length+' 张';}
 new MutationObserver(updateResultTitle).observe(grid,{childList:true});
 results.querySelector('[data-action=clear]').onclick=()=>document.querySelector('#fs-clear').click();
 results.querySelector('[data-action=close]').onclick=()=>results.close();
 results.addEventListener('close',()=>roll.focus());
 function setView(v){root.dataset.summonView='pool';detail.replaceChildren();if(v==='results'){detail.textContent='点击卡牌选择，并查看完整说明';updateResultTitle();if(!results.open)results.showModal();}else if(results.open)results.close();}
 roll.addEventListener('click',()=>setView('results'));
 back.addEventListener('click',()=>setView('pool'));
 document.querySelector('#fs-next').addEventListener('click',()=>setView('pool'));
 document.querySelector('#fs-reset').addEventListener('click',()=>setView('pool'));
 document.querySelector('#fs-steps').addEventListener('click',()=>setView('pool'));
 grid.addEventListener('click',e=>{const card=e.target.closest('.fs-card');if(!card)return;const h=document.createElement('strong'),p=document.createElement('p');h.textContent=card.querySelector('h4')?.textContent;p.textContent=card.querySelector('p')?.textContent;detail.replaceChildren(h,p);},true);
 const refresh=()=>{grid.querySelectorAll('.fs-card').forEach(c=>{c.setAttribute('aria-label',c.querySelector('h4')?.textContent);c.setAttribute('aria-pressed',String(c.classList.contains('picked')));});};
 new MutationObserver(refresh).observe(grid,{childList:true});refresh();
 window.addEventListener('hashchange',()=>{if(location.hash==='#roll')setView('pool')});
 };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0));else start();
})();
