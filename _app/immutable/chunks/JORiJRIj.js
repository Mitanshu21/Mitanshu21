import{C as e,H as t,J as n,N as r,O as i,P as a,U as o,a as s,i as c,q as l,u,x as d}from"./C3HGdhs0.js";import"./xihTtKlq.js";var f=e(`<canvas aria-label="Wet ink brush — paint over the page; the paper drinks it back"></canvas>`);function p(e,p){n(p,!0);let m=c(p,`active`,3,!1),h=c(p,`clearSignal`,3,0),g=o(void 0),_=o(!0),v=()=>matchMedia(`(prefers-reduced-motion: reduce)`).matches;a(()=>{if(!i(g)||v()){t(_,!1);return}let e=i(g),n=e.getContext(`webgl`,{alpha:!0,depth:!1,stencil:!1,antialias:!1,premultipliedAlpha:!0}),r=n?.getExtension(`OES_texture_half_float`),o=n?.getExtension(`OES_texture_half_float_linear`);if(!n||!r||!o){t(_,!1);return}t(_,!0);let s=r.HALF_FLOAT_OES,c=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),n.STATIC_DRAW);function l(e){let t=n.createShader(n.VERTEX_SHADER);n.shaderSource(t,`
		attribute vec2 aPos; varying vec2 vUv;
		void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`),n.compileShader(t);let r=n.createShader(n.FRAGMENT_SHADER);n.shaderSource(r,e),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)||console.error(n.getShaderInfoLog(r));let i=n.createProgram();return n.attachShader(i,t),n.attachShader(i,r),n.linkProgram(i),{p:i,loc:n.getAttribLocation(i,`aPos`)}}let u={advect:l(`
		precision highp float; varying vec2 vUv;
		uniform sampler2D uVel; uniform sampler2D uSrc;
		uniform float uDt; uniform float uDiss;
		void main() {
			vec2 coord = vUv - uDt * texture2D(uVel, vUv).xy;
			gl_FragColor = uDiss * texture2D(uSrc, coord);
		}`),splat:l(`
		precision highp float; varying vec2 vUv;
		uniform sampler2D uSrc; uniform vec2 uPoint; uniform vec3 uValue;
		uniform float uRadius; uniform float uAspect;
		void main() {
			vec2 d = vUv - uPoint; d.x *= uAspect;
			float g = exp(-dot(d, d) / uRadius);
			gl_FragColor = texture2D(uSrc, vUv) + vec4(uValue, 0.0) * g;
		}`),curl:l(`
		precision highp float; varying vec2 vUv;
		uniform sampler2D uVel; uniform vec2 uTexel;
		void main() {
			float L = texture2D(uVel, vUv - vec2(uTexel.x, 0.0)).y;
			float R = texture2D(uVel, vUv + vec2(uTexel.x, 0.0)).y;
			float B = texture2D(uVel, vUv - vec2(0.0, uTexel.y)).x;
			float T = texture2D(uVel, vUv + vec2(0.0, uTexel.y)).x;
			gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
		}`),vorticity:l(`
		precision highp float; varying vec2 vUv;
		uniform sampler2D uVel; uniform sampler2D uCurl;
		uniform vec2 uTexel; uniform float uEps; uniform float uDt;
		void main() {
			float L = texture2D(uCurl, vUv - vec2(uTexel.x, 0.0)).x;
			float R = texture2D(uCurl, vUv + vec2(uTexel.x, 0.0)).x;
			float B = texture2D(uCurl, vUv - vec2(0.0, uTexel.y)).x;
			float T = texture2D(uCurl, vUv + vec2(0.0, uTexel.y)).x;
			float C = texture2D(uCurl, vUv).x;
			vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
			force /= length(force) + 0.0001;
			force *= uEps * C * vec2(1.0, -1.0);
			gl_FragColor = vec4(texture2D(uVel, vUv).xy + force * uDt, 0.0, 1.0);
		}`),divergence:l(`
		precision highp float; varying vec2 vUv;
		uniform sampler2D uVel; uniform vec2 uTexel;
		void main() {
			float L = texture2D(uVel, vUv - vec2(uTexel.x, 0.0)).x;
			float R = texture2D(uVel, vUv + vec2(uTexel.x, 0.0)).x;
			float B = texture2D(uVel, vUv - vec2(0.0, uTexel.y)).y;
			float T = texture2D(uVel, vUv + vec2(0.0, uTexel.y)).y;
			gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
		}`),pressure:l(`
		precision highp float; varying vec2 vUv;
		uniform sampler2D uPressure; uniform sampler2D uDiv; uniform vec2 uTexel;
		void main() {
			float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
			float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
			float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
			float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
			float div = texture2D(uDiv, vUv).x;
			gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
		}`),gradient:l(`
		precision highp float; varying vec2 vUv;
		uniform sampler2D uPressure; uniform sampler2D uVel; uniform vec2 uTexel;
		void main() {
			float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
			float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
			float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
			float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
			gl_FragColor = vec4(texture2D(uVel, vUv).xy - 0.5 * vec2(R - L, T - B), 0.0, 1.0);
		}`),fade:l(`
		precision highp float; varying vec2 vUv;
		uniform sampler2D uDye; uniform float uRate;
		void main() {
			vec4 dye = texture2D(uDye, vUv);
			gl_FragColor = dye * (1.0 - uRate);
		}`),composite:l(`
		precision highp float; varying vec2 vUv;
		uniform sampler2D uDye; uniform vec2 uTexel;
		void main() {
			vec4 dye = texture2D(uDye, vUv);
			float ink = clamp(dye.r, 0.0, 1.0);
			float orange = clamp(dye.g, 0.0, 1.0);
			vec3 inkCol = vec3(0.066, 0.067, 0.078);
			vec3 sigCol = vec3(1.0, 0.302, 0.0);
			float a = clamp(ink + orange, 0.0, 0.96);
			vec3 col = (inkCol * ink + sigCol * orange) / max(0.001, ink + orange);
			// wet gloss
			float hL = texture2D(uDye, vUv - vec2(uTexel.x, 0.0)).r;
			float hR = texture2D(uDye, vUv + vec2(uTexel.x, 0.0)).r;
			float hB = texture2D(uDye, vUv - vec2(0.0, uTexel.y)).r;
			float hT = texture2D(uDye, vUv + vec2(0.0, uTexel.y)).r;
			vec3 n = normalize(vec3(hL - hR, hB - hT, 0.35));
			float spec = pow(max(dot(n, normalize(vec3(0.4, 0.55, 0.73))), 0.0), 24.0);
			col += spec * 0.35 * a;
			gl_FragColor = vec4(col * a, a);
		}`)};function d(e,t,r){let i=n.createTexture();n.bindTexture(n.TEXTURE_2D,i),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,r),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,r),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,e,t,0,n.RGBA,s,null);let a=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,a),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,i,0),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),{tex:i,fbo:a,w:e,h:t}}function f(e,t,n){return{a:d(e,t,n),b:d(e,t,n),swap(){let e=this.a;this.a=this.b,this.b=e}}}function p(t){n.bindFramebuffer(n.FRAMEBUFFER,t?t.fbo:null),n.viewport(0,0,t?t.w:e.width,t?t.h:e.height),n.drawArrays(n.TRIANGLE_STRIP,0,4)}function m(e,t,r){n.useProgram(e.p),n.bindBuffer(n.ARRAY_BUFFER,c),n.enableVertexAttribArray(e.loc),n.vertexAttribPointer(e.loc,2,n.FLOAT,!1,0,0);let i=0;for(let[t,a]of Object.entries(r))n.activeTexture(n.TEXTURE0+i),n.bindTexture(n.TEXTURE_2D,a),n.uniform1i(n.getUniformLocation(e.p,t),i),i++;for(let[r,i]of Object.entries(t)){let t=n.getUniformLocation(e.p,r);typeof i==`number`?n.uniform1f(t,i):i.length===2?n.uniform2f(t,i[0],i[1]):i.length===3&&n.uniform3f(t,i[0],i[1],i[2])}}let y=Math.min(devicePixelRatio||1,1.5),b=0,x=0,S=0,C=0,w=0,T=0,E,D,O,k,A;function j(){b=e.clientWidth,x=e.clientHeight,e.width=Math.round(b*y),e.height=Math.round(x*y),S=Math.max(64,Math.round(e.width/4)),C=Math.max(64,Math.round(e.height/4)),w=Math.max(128,Math.round(e.width/2)),T=Math.max(128,Math.round(e.height/2)),E=f(S,C,n.LINEAR),O=f(S,C,n.NEAREST),D=f(w,T,n.LINEAR),k=d(S,C,n.NEAREST),A=d(S,C,n.NEAREST)}let M=0,N=!1,P=!1,F=0,I=0,L=0,R=0,z=-1e4,B=0;function V(e,t,n,r,i){m(u.splat,{uPoint:[t,n],uValue:r,uRadius:i,uAspect:b/x},{uSrc:e.a.tex}),p(e.b),e.swap()}function H(){for(let e of[E.a,E.b,D.a,D.b,O.a,O.b])n.bindFramebuffer(n.FRAMEBUFFER,e.fbo),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT);p(null),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT)}let U=h();a(()=>{h()!==U&&(U=h(),H())});function W(){let e=1/60,t=[1/S,1/C],n=performance.now();P&&n-R>250&&V(D,F,I,[0,.02,0],.0035),m(u.curl,{uTexel:t},{uVel:E.a.tex}),p(k),m(u.vorticity,{uTexel:t,uEps:1.8,uDt:e},{uVel:E.a.tex,uCurl:k.tex}),p(E.b),E.swap(),m(u.divergence,{uTexel:t},{uVel:E.a.tex}),p(A);for(let e=0;e<18;e++)m(u.pressure,{uTexel:t},{uPressure:O.a.tex,uDiv:A.tex}),p(O.b),O.swap();m(u.gradient,{uTexel:t},{uPressure:O.a.tex,uVel:E.a.tex}),p(E.b),E.swap(),m(u.advect,{uDt:e,uDiss:.995},{uVel:E.a.tex,uSrc:E.a.tex}),p(E.b),E.swap(),m(u.advect,{uDt:e,uDiss:1},{uVel:E.a.tex,uSrc:D.a.tex}),p(D.b),D.swap(),n-z>1500&&(m(u.fade,{uRate:.012},{uDye:D.a.tex}),p(D.b),D.swap()),m(u.composite,{uTexel:[1/w,1/T]},{uDye:D.a.tex}),p(null),B++}function G(){W();let e=performance.now()-z>12e3;M=N&&(!e||P)?requestAnimationFrame(G):0}function K(){!M&&N&&(M=requestAnimationFrame(G))}function q(t){let n=e.getBoundingClientRect();return{x:(t.clientX-n.left)/n.width,y:1-(t.clientY-n.top)/n.height}}function J(t){if(!t.isPrimary)return;let n=q(t);F=n.x,I=n.y,L=performance.now(),R=L,z=L,P=!0;try{e.setPointerCapture(t.pointerId)}catch{}V(D,n.x,n.y,[.12,0,0],.004),K()}function Y(e){if(!P)return;let t=performance.now(),n=q(e),r=Math.max(1,t-L)/1e3,i=(n.x-F)/r,a=(n.y-I)/r,o=Math.min(1,Math.max(0,(Math.hypot(i,a)-.6)/1.2));V(E,n.x,n.y,[i*(.1+o*.1),a*(.1+o*.1),0],.012-o*.007),V(D,n.x,n.y,[.14,0,0],.005-o*.002),F=n.x,I=n.y,L=t,R=t,z=t,K()}function X(){P=!1,z=performance.now()}j();let Z=new ResizeObserver(()=>j());Z.observe(e);let Q=new IntersectionObserver(([e])=>{N=e.isIntersecting&&!document.hidden,N&&K()});Q.observe(e);let $=()=>{N=!document.hidden,N&&K()};return document.addEventListener(`visibilitychange`,$),e.addEventListener(`pointerdown`,J),e.addEventListener(`pointermove`,Y),e.addEventListener(`pointerup`,X),e.addEventListener(`pointercancel`,X),()=>{cancelAnimationFrame(M),Z.disconnect(),Q.disconnect(),document.removeEventListener(`visibilitychange`,$),e.removeEventListener(`pointerdown`,J),e.removeEventListener(`pointermove`,Y),e.removeEventListener(`pointerup`,X),e.removeEventListener(`pointercancel`,X),n.getExtension(`WEBGL_lose_context`)?.loseContext()}});var y=f();let b;s(y,e=>t(g,e),()=>i(g)),r(()=>b=u(y,1,`svelte-134abzo`,null,b,{active:m(),hidden:!i(_)})),d(e,y),l()}export{p as default};