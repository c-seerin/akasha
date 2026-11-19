/* bg10500 bundle rechecked against live memory 2026-11-14. Native UV periods;
   parent-facing X orientation restored. 50-degree framing is reference-calibrated,
   not a captured runtime camera. Central particle playback remains adapted. */
(async()=>{
 const canvas=document.querySelector('.summon-native-canvas');if(!canvas)return;
 const gl=canvas.getContext('webgl',{alpha:false,antialias:true});if(!gl)return;
 const assetURL = window.akashaRenderAssetURL || (async path => path);
 const data=await fetch(await assetURL('img/fgo-ui/summon-scene.json')).then(r=>r.json());
 const vs=`attribute vec3 p;attribute vec2 uv;uniform vec3 shift;uniform float aspect,time,speed;varying vec2 v;void main(){vec3 q=p+shift;float z=-q.z+2.;gl_Position=vec4(-q.x/(.4663*aspect),(q.y-.2)/.4663,z*.999-0.2,z);v=uv+vec2(time*speed,0.);}`;
 const fs=`precision mediump float;uniform sampler2D tex;uniform vec4 tint;varying vec2 v;void main(){vec4 c=texture2D(tex,v);gl_FragColor=vec4(c.rgb*c.a*tint.rgb*2.*tint.a,1.);}`;
 function shader(type,s){const sh=gl.createShader(type);gl.shaderSource(sh,s);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh}
 const pr=gl.createProgram();gl.attachShader(pr,shader(gl.VERTEX_SHADER,vs));gl.attachShader(pr,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
 const loc={};for(const n of ['shift','aspect','time','speed','tex','tint'])loc[n]=gl.getUniformLocation(pr,n);
 const pos=gl.getAttribLocation(pr,'p'),uv=gl.getAttribLocation(pr,'uv');gl.enableVertexAttribArray(pos);gl.enableVertexAttribArray(uv);
 const images={},textures={};await Promise.all(['10500_bg_tex001','10500_bg_tex002'].map(n=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[n]=im;const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);textures[n]=t;resolve()};im.onerror=reject;assetURL('img/fgo-ui/'+n+'.png').then(url=>{im.src=url;},reject)})));
 const meshes=data.map(m=>{m.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(m.vertices),gl.STATIC_DRAW);return m});
 const fx=document.createElement('canvas');fx.className='summon-light-canvas';fx.setAttribute('aria-hidden','true');fx.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:screen';canvas.after(fx);const cx=fx.getContext('2d');
 gl.disable(gl.CULL_FACE);gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.clearColor(.001,.004,.012,1);
 let w=0,h=0;const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 function frame(ts){if(document.body.dataset.screen==='roll'){
 const d=Math.min(devicePixelRatio,1.5);if(w!==innerWidth||h!==innerHeight){w=innerWidth;h=innerHeight;canvas.width=fx.width=w*d;canvas.height=fx.height=h*d;cx.setTransform(d,0,0,d,0,0);gl.viewport(0,0,canvas.width,canvas.height)}
 const t=reduced?0:ts/1000;gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(loc.aspect,w/h);gl.uniform1f(loc.time,t);
 for(const m of meshes){gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,20,0);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,20,12);gl.bindTexture(gl.TEXTURE_2D,textures[m.texture]);gl.uniform3fv(loc.shift,m.position);gl.uniform4fv(loc.tint,m.name==='space_BG'?[.12,.12,.12,1]:m.name==='bg_line'?[.16,.22,.25,.5]:m.tint);gl.uniform1f(loc.speed,m.period?1/m.period:0);gl.drawArrays(gl.TRIANGLES,0,m.vertices.length/5)}
 cx.clearRect(0,0,w,h);cx.globalCompositeOperation='lighter';const x=w*.5,y=h*.49,s=Math.min(w,h)*.25;
 // Smooth, bounded breathing; reconstructed timing, not recovered game curves.
 const breath=.5+.5*Math.sin(t*2*Math.PI/4.8),swell=.5+.5*Math.sin(t*2*Math.PI/7.3+.8);
 const outer=s*(1.08+.16*swell),inner=s*(.88+.12*breath);
 const halo=cx.createRadialGradient(x,y,0,x,y,outer);
 halo.addColorStop(0,'rgba(222,251,255,.22)');halo.addColorStop(.22,'rgba(122,220,255,.12)');halo.addColorStop(.58,'rgba(59,157,246,.035)');halo.addColorStop(1,'rgba(40,120,240,0)');
 cx.globalAlpha=.55+.3*breath;cx.fillStyle=halo;cx.fillRect(x-outer,y-outer,2*outer,2*outer);
 cx.globalAlpha=.46+.28*breath;cx.drawImage(images['10500_bg_tex002'],0,0,128,128,x-inner,y-inner,2*inner,2*inner);
 // Radial billboards use the native elongated glow, not CSS lines.
 for(let i=0;i<36;i++){const angle=i*2.39996+t*.008,len=s*(1.2+Math.sin(i*7.31)*.55);cx.save();cx.translate(x,y);cx.rotate(angle);cx.globalAlpha=.09+.05*Math.sin(t*.4+i);cx.drawImage(images['10500_bg_tex002'],128,0,128,128,0,-s*.025,len,s*.05);cx.restore()}
 const core=s*(.38+.065*breath+.015*Math.sin(t*2.1));
 cx.globalAlpha=.67+.22*breath+.025*Math.sin(t*3.7);cx.drawImage(images['10500_bg_tex002'],0,256,256,256,x-core,y-core,2*core,2*core);
 for(let i=0;i<90;i++){const phase=(((Math.sin(i*78.233)*43758.5453)%1+1)+t*.014)%1,a=i*i*2.39996,dist=phase*Math.max(w,h)*.65,px=x+Math.cos(a)*dist,py=y+Math.sin(a)*dist*.6,sz=3+(i%4);cx.globalAlpha=Math.sin(phase*Math.PI)*.7;cx.drawImage(images['10500_bg_tex002'],0,0,128,128,px,py,sz,sz)}
 cx.globalAlpha=1;canvas.dataset.renderer='original-bg10500-meshes';
 }requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();




