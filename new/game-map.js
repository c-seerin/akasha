/* Scene renderer calibrated against the user's MuMu observations. No game logic. */

window.AkashaMap={init(canvas){

 const root=canvas.closest('.game-terminal'), gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});

 const fallback=()=>{canvas.hidden=true;root.querySelector('.map-fallback').hidden=false;};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let mode=0,yaw=.8,pitch=.50,roll=.23,zoom=.86,shift=0,drag=false,lastX=0,lastY=0,prev=0,visible=true,paused=reduced.matches,tween=null,focus=null;

 const pause=document.getElementById('map-pause');function updatePause(){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'开始地图旋转':'暂停地图旋转');}pause.onclick=()=>{paused=!paused;updatePause();};updatePause();reduced.addEventListener('change',e=>{paused=e.matches;updatePause();});

 // Regional anchors for the existing mythic login points, not archaeological claims.

 const chapters=[

 {id:'pick-divine-sumer',name:'美索不达米亚 · 乌鲁克',title:'苏美尔神话',sub:'神代乌鲁克',pantheon:'美索不达米亚',lat:31.32,lon:45.64},

 {id:'pick-divine-greek',name:'希腊神话区域',title:'希腊神话',sub:'奥林波斯机神 · 亚特兰蒂斯神代',pantheon:'希腊',lat:38,lon:24},

 {id:'pick-divine-norse',name:'北欧神话区域',title:'北欧神话',sub:'诸神黄昏',pantheon:'北欧',lat:62,lon:16},

 {id:'pick-divine-arthur',name:'不列颠 · 神代余韵',title:'亚瑟王传说',sub:'卡美洛 · 圆桌的誓言',pantheon:'凯尔特',lat:51,lon:-3}];

 root.querySelectorAll('[data-chapter]').forEach((b,i)=>{b.innerHTML='<i class=shortcut-emblem aria-hidden=true></i><span><strong>'+chapters[i].title+'</strong><small>'+chapters[i].sub+'</small></span>';b.setAttribute('aria-label','定位'+chapters[i].title);});

 function point(lat,lon){const v=(90-lat)/180,u=(180-lon)/360,t=u*Math.PI*2;return[Math.cos(t)*Math.sin(v*Math.PI),Math.cos(v*Math.PI),Math.sin(t)*Math.sin(v*Math.PI)];}

 function rotation(q){let [x,y,z]=q,c=Math.cos(yaw),s=Math.sin(yaw);[x,z]=[c*x+s*z,-s*x+c*z];[y,z]=[Math.cos(pitch)*y-Math.sin(pitch)*z,Math.sin(pitch)*y+Math.cos(pitch)*z];return[Math.cos(roll)*x-Math.sin(roll)*y,Math.sin(roll)*x+Math.cos(roll)*y,z];}

 const points=chapters;

 const markers=points.map((p,i)=>{const b=document.createElement('button');b.className='globe-marker';b.hidden=true;b.dataset.login=p.id;b.setAttribute('aria-label','定位'+p.title);b.innerHTML='<i></i><b>1</b><span class="marker-diamond" aria-hidden="true">◇</span>';b.onclick=()=>select(i);canvas.parentElement.append(b);return{p,b,q:point(p.lat,p.lon)};});

 const panel=root.querySelector('.ordeal-detail'),region=root.querySelector('.region-name');

 function animate(to){if(reduced.matches){({yaw,pitch,roll,zoom,shift}=to);tween=null;}else tween={from:{yaw,pitch,roll,zoom,shift},to,start:performance.now()};}

 function select(i){const p=chapters[i];if(!mode||!p)return;focus=p;root.classList.add('map-focused');region.textContent=p.name;

 panel.innerHTML='<small>Ordeal Call · 神代登录</small><button type="button" class="divine-enter"><i class=shortcut-emblem aria-hidden=true></i><span><strong>'+p.title+'</strong><em>'+p.sub+'</em></span><b>登录　›</b></button>'+'<div class="divine-period"><label>时期</label><select class="dp-select"></select><input class="dp-custom" type="text" placeholder="自选时期（可留空，填了优先）"></div>'+'<p class="divine-description" hidden></p>';

 const radio=document.getElementById(p.id),card=radio.closest('.timeline-card');panel.querySelector('.divine-description').textContent=card.querySelector('p').textContent;

 const dpSel=panel.querySelector('.dp-select'), dpCustom=panel.querySelector('.dp-custom');
 const PPERIOD={"pick-divine-sumer": ["提亚马特创世（约14,000年前）", "伊什塔尔挑战艾比夫山（约前5,500）", "伊什塔尔下冥界（约前5,200）", "吉尔伽美什即位（约前5,000）", "恩奇都之死与求不死（即位之后）", "诀别·美索不达米亚神代终结（约前2,600）", "神代消退契机（约前7世纪）"], "pick-divine-greek": ["机神舰队抵达（约14,000年前）", "白之毁灭·机神真体被毁（约前12,000）", "提坦之战（神话层，无精确年代）", "英雄时代·特洛伊（约前12世纪）", "神代余晖期（年代未记载）"], "pick-divine-norse": ["阿斯加德全盛（无精确年代）", "诸神黄昏前夜", "终末进行中", "终末之后"], "pick-divine-arthur": ["卡美洛建成期", "圆桌全盛期", "剑栏之战", "神代余韵消散"]}[p.id]||[];
 if(dpSel){ dpSel.innerHTML='<option value="">时期：不指定（从该切面最早可介入处开始）</option>'+PPERIOD.map(function(v){return '<option value="'+v+'">时期：'+v+'</option>';}).join('');
   const prev=card.getAttribute('data-tl-choice')||'';
   if(prev){ const hit=PPERIOD.indexOf(prev); if(hit>=0) dpSel.selectedIndex=hit+1; else if(dpCustom) dpCustom.value=prev; }
   function syncPeriod(){ const v=(dpCustom&&dpCustom.value.trim())?dpCustom.value.trim():(dpSel.value||'');
     if(v){ card.setAttribute('data-tl-choice', v); } else { card.removeAttribute('data-tl-choice'); }
     let tag=card.querySelector('.tl-chosen');
     if(v){ if(!tag){ tag=document.createElement('div'); tag.className='tl-chosen'; const row=card.querySelector('.pick-row'); card.insertBefore(tag,row);} tag.textContent='已选时期：'+v; }
     else if(tag){ tag.remove(); } }
   dpSel.onchange=function(){ if(dpCustom) dpCustom.value=''; syncPeriod(); };
   if(dpCustom) dpCustom.oninput=function(){ syncPeriod(); };
   syncPeriod(); }
 const enter=panel.querySelector('.divine-enter');
 function showChoice(){
  enter.setAttribute('aria-pressed',String(radio.checked));
  enter.querySelector('b').textContent=radio.checked?'✓ 已选择':'选择';
 }
 enter.onclick=()=>{radio.click();showChoice();};
 showChoice();
 panel.dataset.chapter=String(i);root.querySelectorAll('[data-chapter]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.chapter===i)));

 markers.forEach(m=>m.b.setAttribute('aria-pressed',String(m.p===p)));

 let target=(180-p.lon)/360*Math.PI*2-Math.PI/2;while(target-yaw>Math.PI)target-=Math.PI*2;while(target-yaw< -Math.PI)target+=Math.PI*2;

 animate({yaw:target,pitch:p.lat*Math.PI/180,roll:0,zoom:1.333,shift:-.448});canvas.dataset.focus=p.id;

 }

 root.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>select(+b.dataset.chapter));

 function overview(){focus=null;root.classList.remove('map-focused','moon-focused');canvas.dataset.focus='';root.querySelectorAll('[data-chapter]').forEach(b=>b.setAttribute('aria-pressed','false'));animate({yaw,pitch,roll:0,zoom:.833,shift:0});}

 root.querySelector('.map-overview').onclick=()=>{overview();root.querySelector('[data-chapter]').focus();};

 function setMode(next){mode=next;focus=null;tween=null;root.classList.toggle('is-globe',!!mode);document.body.classList.toggle('show-ordeal',!!mode&&document.body.dataset.screen==='home');root.classList.remove('map-focused','moon-focused');canvas.dataset.mode=mode?'globe':'cylinder';yaw=mode?2.05:.8;pitch=mode?.68:.50;roll=mode?0:.23;zoom=mode?.833:.86;shift=0;canvas.dataset.focus='';root.querySelectorAll('[data-map]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.map==='globe')===!!mode)));}

 root.querySelectorAll('[data-map]').forEach(b=>b.onclick=()=>setMode(b.dataset.map==='globe'?1:0));setMode(0);

 window.AkashaMap.openDivine=()=>{location.hash='home';setMode(1);root.querySelector('[data-chapter]').focus({preventScroll:true});};

 const exit=document.createElement('button');exit.className='divine-map-exit';exit.textContent='◀ 返回终端';exit.onclick=()=>{setMode(0);document.querySelector('.ordeal-entry')?.focus({preventScroll:true});};root.querySelector('.ordeal-ui').append(exit);

 document.querySelector('.game-back').addEventListener('click',e=>{if(mode&&document.body.dataset.screen==='home'){e.preventDefault();e.stopImmediatePropagation();setMode(0);}},true);

 const formBack=document.createElement('button');formBack.type='button';formBack.className='divine-form-back';formBack.textContent='◀ 返回神代地图';formBack.onclick=()=>window.AkashaMap.openDivine();document.getElementById('divine-login').prepend(formBack);

 

 root.querySelectorAll('[data-turn]').forEach(b=>b.onclick=()=>{tween=null;yaw+=Number(b.dataset.turn)*.3;});root.querySelectorAll('[data-tilt]').forEach(b=>b.onclick=()=>{tween=null;pitch=Math.max(-1.45,Math.min(1.45,pitch+Number(b.dataset.tilt)*.3));});

 canvas.onpointerdown=e=>{drag=true;tween=null;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(!drag)return;yaw+=(e.clientX-lastX)*.005;if(mode)pitch=Math.max(-1.45,Math.min(1.45,pitch+(lastY-e.clientY)*.005));lastX=e.clientX;lastY=e.clientY;};for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>drag=false);

 canvas.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Escape'].includes(e.key))return;e.preventDefault();e.stopImmediatePropagation();tween=null;if(e.key==='Escape'){overview();return;}if(e.key==='ArrowLeft'||e.key==='ArrowRight')yaw+=e.key==='ArrowRight'?.15:-.15;else if(mode)pitch=Math.max(-1.45,Math.min(1.45,pitch+(e.key==='ArrowUp'?.15:-.15)));};

if(!gl){fallback();return;}

 const vs=`precision mediump float;attribute vec3 p;attribute vec2 uv;uniform float yaw,pitch,roll,aspect,zoom,shift,globe;varying vec2 v;varying vec3 n;vec3 rot(vec3 q){float c=cos(yaw*globe),s=sin(yaw*globe);q=vec3(c*q.x+s*q.z,q.y,-s*q.x+c*q.z);q=vec3(q.x,cos(pitch)*q.y-sin(pitch)*q.z,sin(pitch)*q.y+cos(pitch)*q.z);return vec3(cos(roll)*q.x-sin(roll)*q.y,sin(roll)*q.x+cos(roll)*q.y,q.z);}void main(){vec3 q=rot(p);n=normalize(rot(vec3(p.x,p.y*globe,p.z)));float w=1.-(1.-globe)*.20*q.z;gl_Position=vec4(q.x*zoom/aspect+shift*w,q.y*zoom,-q.z*.2,w);v=vec2(mix(uv.x*2.+yaw/6.2831853,1.-uv.x,globe),uv.y);}`;

 const fs=`precision mediump float;uniform sampler2D tex;uniform float globe;varying vec2 v;varying vec3 n;void main(){vec3 t=texture2D(tex,v).rgb;float land=smoothstep(.81,.95,t.r);float coast=smoothstep(.845,.86,t.r);float side=pow(abs(n.x),3.);vec3 blue=mix(vec3(.045,.57,.79),vec3(.18,.73,.89),coast);blue=mix(blue,vec3(.30,.94,.96),side*.42);float rim=step(v.y,.004)+step(.996,v.y);blue+=rim*vec3(.25,.40,.30);float light=.94+.06*max(0.,dot(n,normalize(vec3(-.5,.8,1.))));vec3 white=mix(vec3(.84,.88,.93),vec3(.98,.985,1.),land)*light;white+=(t-vec3(t.r))*.2+(t.r-.85)*.12;gl_FragColor=vec4(mix(blue,white,globe),mix(gl_FrontFacing?.97:.93,1.,globe));}`;

 function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}

 let program;try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Map link failed');}catch(e){console.warn(e);fallback();return;}gl.useProgram(program);

 const loc={};for(const k of ['yaw','pitch','roll','aspect','zoom','shift','globe'])loc[k]=gl.getUniformLocation(program,k);

 function mesh(sphere){let a=[],idx=[],cols=160,rows=sphere?80:1;for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const u=i/cols,v=j/rows,t=u*Math.PI*2,r=sphere?Math.sin(v*Math.PI):1,y=sphere?Math.cos(v*Math.PI):(.62-v*1.24);a.push(Math.cos(t)*r,y,Math.sin(t)*r,u,v);}for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let k=j*(cols+1)+i;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}if(!sphere){for(let i=0;i<=cols;i++){const k=i*5,l=((cols+1)+i)*5;if(a[k]!==a[l]||a[k+2]!==a[l+2])throw Error("Cylinder rings must have identical radii");}canvas.dataset.geometry="equal-radius-cylinder";}const b=gl.createBuffer(),e=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(a),gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,e);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx),gl.STATIC_DRAW);return{b,e,n:idx.length};}

 const meshes=[mesh(false),mesh(true)],pos=gl.getAttribLocation(program,'p'),uv=gl.getAttribLocation(program,'uv');gl.enableVertexAttribArray(pos);gl.enableVertexAttribArray(uv);

 const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([225,230,240,255]));

 const assetURL = window.akashaRenderAssetURL || (async path => path);

 const pic=new Image();pic.onload=()=>{try {gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,pic);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);canvas.dataset.texture='ready';} catch(error) { console.warn('地图纹理上传失败',error); fallback(); }};pic.onerror=fallback;

 assetURL('img/fgo-ui/WhiteEarth_Color.png').then(url=>{if (/^https?:$/i.test(location.protocol)) pic.crossOrigin='anonymous';pic.src=url;},fallback);

 new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(canvas);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);let stopped=false;canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();stopped=true;fallback();});

 function frame(t){if(stopped)return;requestAnimationFrame(frame);let dt=Math.min((t-prev)/1000,.05);prev=t;if(document.hidden||!visible)return;

 if(tween){let k=Math.min(1,(t-tween.start)/950);k=k*k*(3-2*k);const a=tween.from,b=tween.to;yaw=a.yaw+(b.yaw-a.yaw)*k;pitch=a.pitch+(b.pitch-a.pitch)*k;roll=a.roll+(b.roll-a.roll)*k;zoom=a.zoom+(b.zoom-a.zoom)*k;shift=a.shift+(b.shift-a.shift)*k;if(k===1)tween=null;}else if(!mode&&!paused&&!drag)yaw+=dt*.13;

 if(mode){const box=root.getBoundingClientRect();root.style.setProperty("--scene-top",box.top+"px");root.style.setProperty("--scene-left",box.left+"px");}const r=canvas.getBoundingClientRect();if(r.width<1||r.height<1)return;const dpr=Math.min(devicePixelRatio||1,1.7),w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}let aspect=w/h;const ax=-Math.sin(roll)*Math.cos(pitch),ay=Math.cos(roll)*Math.cos(pitch);const fitZoom=mode?zoom:Math.min(zoom,.78*aspect/(Math.sqrt(1-ax*ax)+.62*Math.abs(ax)),.78/(Math.sqrt(1-ay*ay)+.62*Math.abs(ay)));gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);for(const [k,v]of Object.entries({yaw,pitch,roll,zoom:fitZoom,shift,aspect,globe:mode}))gl.uniform1f(loc[k],v);let m=meshes[mode];gl.bindBuffer(gl.ARRAY_BUFFER,m.b);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.e);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,20,0);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,20,12);gl.enable(gl.CULL_FACE);if(!mode){gl.cullFace(gl.BACK);gl.depthMask(false);gl.drawElements(gl.TRIANGLES,m.n,gl.UNSIGNED_SHORT,0);}gl.cullFace(gl.FRONT);gl.depthMask(true);gl.drawElements(gl.TRIANGLES,m.n,gl.UNSIGNED_SHORT,0);

 for(const {b,q}of markers){let p=rotation(q);b.hidden=!mode||p[2]<.025; if(b.hidden)continue;b.style.left=((p[0]*zoom/aspect+shift+1)*.5*100)+'%';b.style.top=((1-p[1]*zoom)*.5*100)+'%';b.style.setProperty('--foreshorten',Math.max(.12,p[2]).toFixed(3));b.style.setProperty('--surface-angle',(Math.atan2(p[0]/aspect,p[1])*180/Math.PI)+'deg');b.style.opacity=Math.min(1,p[2]*5);}

 canvas.dataset.angle=yaw.toFixed(3);canvas.dataset.pitch=pitch.toFixed(3);canvas.dataset.zoom=zoom.toFixed(3);root.style.setProperty('--marker-size',(innerHeight*(focus?.089:.035))+'px');

 }

 requestAnimationFrame(frame);

}};























