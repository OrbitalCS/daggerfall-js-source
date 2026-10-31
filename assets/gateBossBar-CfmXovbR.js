import{Ht as e,r as t}from"./hudPlacer-DufwPy55.js";import{L as n}from"./textManager-DTzj7yyh.js";import{$r as r,Ei as i,Oi as a,Qr as o,Si as s,b as c,ei as l,h as u,li as d,mi as f,ni as p,oi as m,pi as h,vi as g,x as _,xi as v}from"./talk-C4L_jD2V.js";import{cn as y,in as b}from"./professionLaw-APSgUj2g.js";import"./snowCapGlsl-BMWsu-9z.js";import"./mobileUnit-Ca2CTtK0.js";import{t as x}from"./labGrass-Cfdh-i-y.js";import"./enemyEntity-BusUouOq.js";var S=.55;function C(e,t,n){let r=Math.max(0,Math.min(100,t));if(!e||r>=e.at)return{at:r,pct:r,hold:S,stood:0};let i=(e.stood??0)+n;if(i<1.2){if(r<e.pct)return{at:e.at,pct:r,hold:S,stood:i};if(e.hold>0)return{at:e.at,pct:r,hold:e.hold-n,stood:i}}return{at:Math.max(r,e.at-70*n),pct:r,hold:0,stood:i}}Object.freeze([`dealt`,`stood`,`rite`]),new TextEncoder,new TextDecoder,Object.freeze({day:null,boss:null,phase:1,hp:0,max:0,x:0,z:0,yaw:0,move:null,atk:null,shieldUntil:0,wrathAt:null,fighters:0,fell:null,wrath:null,heardAt:0,md:null,fed:null,xa:Object.freeze([]),cx:null,stunUntil:0,stunAt:0,rk:0,lg:null,openUntil:0,pt:null,vg:null,vgw:null,sd:null,tithe:null,cp:null}),Object.freeze({"the court is full":!0}),Object.freeze({"the gate is closed":`The gate is closed.`,"the gate is sealed":`The gate has sealed.`,"the gate is closing":`The Warden has fallen. The gate is closing.`,"the court is full":`The Burning Court is full.`});var w=1100,T=.32;Object.freeze((()=>{let e=[.28,-.42],t=Math.hypot(...e),n=35*Math.PI/180;return[e[0]/t*Math.cos(n),Math.sin(n),e[1]/t*Math.cos(n)]})()),Object.freeze({slam:Object.freeze({share:.75,power:1,grit:!0}),leap:Object.freeze({share:.85,power:1.15,grit:!0}),cross:Object.freeze({share:1,power:1.5,grit:!0}),hellfire:Object.freeze({share:.4,power:.7,grit:!1,light:Object.freeze([1.2,7])}),meteor:Object.freeze({share:1,power:1.6,grit:!1,light:Object.freeze([3,16])}),nova:Object.freeze({share:1,power:1.3,grit:!1}),dagon:Object.freeze({share:1,power:2,grit:!1}),embers:Object.freeze({share:.7,power:1.2,grit:!1}),sputter:Object.freeze({share:.12,power:.3,grit:!1}),spoils:Object.freeze({share:1,power:.9,grit:!1}),spoilRest:Object.freeze({share:.3,power:.45,grit:!1}),spoilRestRare:Object.freeze({share:.55,power:.7,grit:!1})});var E=`#version 300 es
precision highp float;
precision highp int;
`,D=E+`layout(location = 0) in float aI;
uniform mat4 uVP;
uniform vec3 uAt;        // the burst's origin in the scene
uniform float uFloor;    // WB9f: the floor's height under it, where a fallen spark rests
uniform vec3 uEdge;      // AUDIT SD IV (R3): where that floor ends - its centre's x, z and its radius (0: it never does)
uniform float uT;        // seconds since it
uniform float uPower;
uniform float uPxPerM;
uniform vec3 uColor;
uniform int uGrit;
out vec3 vColor;
out float vFade;
out vec3 vWorld;
float fr(float x) { return x - floor(x); }
void main() {
  float a = fr(sin(aI * 12.9898 + 4.1) * 43758.5453), b = fr(sin(aI * 78.233 + 1.7) * 24634.6345);
  float bearing = a * 6.283185307179586, outv = (3.0 + 7.0 * b) * uPower, upv = (4.0 + 6.0 * fr(a * 7.31 + b)) * sqrt(uPower);
  float life = (0.55 + 0.45 * fr(b * 5.17 + a)) * ${(w/1e3).toFixed(3)};
  float t = uT, spent = clamp(t / life, 0.0, 1.0);
  vec3 p = uAt + vec3(sin(bearing) * outv * t, max(upv * t - ${7 .toFixed(3)} * t * t, uFloor - uAt.y + 0.05), cos(bearing) * outv * t);
  if (uEdge.z > 0.0) {   // AUDIT SD IV (R3): past the floor's edge it rests on nothing - flying, it flies on down; at rest, it slides off
    vec2 o = uAt.xz - uEdge.xy, d = vec2(sin(bearing), cos(bearing)) * outv;
    float dd = max(dot(d, d), 1e-6), bq = dot(o, d), cq = dot(o, o) - uEdge.z * uEdge.z;
    float tc = cq >= 0.0 ? 0.0 : (-bq + sqrt(max(bq * bq - dd * cq, 0.0))) / dd, rest = uFloor - uAt.y + 0.05, g = ${7 .toFixed(3)};
    if (t > tc) p.y = uAt.y + (upv * tc - g * tc * tc > rest ? upv * t - g * t * t : rest - g * (t - tc) * (t - tc));
  }
  vWorld = p;
  vec4 cp = uVP * vec4(p, 1.0);
  gl_Position = cp;
  float size = ${T.toFixed(3)} * (uGrit == 1 ? 1.5 : 1.0) * (1.0 - 0.6 * spent);
  gl_PointSize = spent >= 1.0 ? 0.0 : clamp(size * uPxPerM / max(cp.w, 0.1), 1.5, 48.0);
  // white-hot at the burst, its colour after, embers at the end; grit darker and redder
  vec3 hot = mix(vec3(1.0, 0.95, 0.85), uColor, smoothstep(0.0, 0.35, spent));
  vColor = uGrit == 1 ? mix(hot, vec3(0.55, 0.3, 0.16), 0.45) : hot;
  vFade = (1.0 - spent) * (1.0 - spent);
}`,O=E+`in vec3 vColor;
in float vFade;
in vec3 vWorld;
uniform int uFogMode;
uniform float uFogDensity;
uniform vec2 uFogRange;
uniform vec3 uCamPos;
out vec4 o;
${x}
void main() {
  vec2 d = gl_PointCoord * 2.0 - 1.0;
  float r = dot(d, d);
  if (r > 1.0) discard;
  float glow = (1.0 - r) * (1.0 - r);
  o = vec4(vColor * (glow * 2.2 + step(r, 0.2) * 1.2) * vFade * fogFactorAt(vWorld), 1.0);   // a hot core in a soft glow
}`,k=E+`layout(location = 0) in vec2 aP;   // x across -1..1, y 0..1 (the trail's length; the glow's up)
uniform mat4 uVP;
uniform int uKind;       // 0 the trail, 1 the stone's glow
uniform vec3 uHead;
uniform vec3 uDir;       // back up its path
uniform float uLen;
uniform float uW;
uniform vec3 uEye;
out vec2 vUv;
out vec3 vWorld;
void main() {
  vUv = aP;
  vec3 w;
  if (uKind == 0) {
    vec3 mid = uHead + uDir * uLen * aP.y;
    vec3 side = normalize(cross(uDir, uEye - mid));
    w = mid + side * aP.x * uW * (1.0 - 0.7 * aP.y);
  } else {
    vec3 f = normalize(uEye - uHead), side = normalize(cross(vec3(0.0, 1.0, 0.0), f)), up = cross(f, side);
    w = uHead + side * aP.x * uW + up * (aP.y * 2.0 - 1.0) * uW;
  }
  vWorld = w;
  gl_Position = uVP * vec4(w, 1.0);
}`,A=E+`in vec2 vUv;
in vec3 vWorld;
uniform int uKind;
uniform vec3 uColor;
uniform float uTime;
uniform int uFogMode;
uniform float uFogDensity;
uniform vec2 uFogRange;
uniform vec3 uCamPos;
out vec4 o;
${x}
void main() {
  float light;
  vec3 col;
  if (uKind == 0) {
    float across = 1.0 - abs(vUv.x);
    float flick = 0.8 + 0.2 * sin(vUv.y * 40.0 - uTime * 30.0);
    light = across * across * (1.0 - vUv.y) * (1.0 - vUv.y) * flick;
    col = mix(vec3(1.0, 0.9, 0.6), uColor, vUv.y * 1.4);
  } else {
    float r = length(vec2(vUv.x, vUv.y * 2.0 - 1.0));
    if (r > 1.0) discard;
    light = pow(1.0 - r, 1.6) * 1.8;
    col = mix(vec3(1.0, 0.97, 0.85), uColor, r);
  }
  o = vec4(col * light * fogFactorAt(vWorld), 1.0);
}`;Object.freeze([[D,O],[k,A]]),new Float32Array([0,1]),Object.freeze({ruhn:Object.freeze({mobile:31,scale:3})}),Object.freeze({burning:35,rime:38,storm:36,venom:37});var j=Object.freeze({blade:e=>n(`gate.sunder.blade`,`{boss}'s Blade`,{boss:e}),burning:e=>n(`gate.sunder.flame`,`{boss}'s Flame`,{boss:e}),rime:e=>n(`gate.sunder.rime`,`{boss}'s Rime`,{boss:e}),storm:e=>n(`gate.sunder.storm`,`{boss}'s Storm`,{boss:e}),venom:e=>n(`gate.sunder.venom`,`{boss}'s Venom`,{boss:e})}),ee=(e,t,n)=>{let r=String(n??``).trim().split(/\s+/).pop()||`Ruhn`;return(e===l.flame?j[t?.aspect?.id]??j.burning:j.blade)(r)},M=12*g(60)*u;_/100*M,Object.freeze([`slam`,`leap`,`nova`]);var N=Object.freeze({cleave:Object.freeze([1,.3,.12]),slam:Object.freeze([1,.52,.1]),charge:Object.freeze([1,.16,.08]),hellfire:Object.freeze([1,.64,.14]),nova:Object.freeze([1,.8,.28]),wrath:Object.freeze([.9,.06,.03]),leap:Object.freeze([1,.42,.1]),meteor:Object.freeze([1,.56,.06]),spokes:Object.freeze([1,.14,.32]),cross:Object.freeze([1,.46,.12]),reckon:Object.freeze([.95,.08,.16]),chains:Object.freeze([1,.34,.1]),brand:Object.freeze([1,.24,.2]),torment:Object.freeze([1,.8,.28]),wheel:Object.freeze([1,.38,.16]),gaze:Object.freeze([1,.97,.9]),unmake:Object.freeze([.78,.2,.62]),sunder:Object.freeze([1,.22,.4]),rejoin:Object.freeze([1,.62,.22])}),te=Object.freeze([1,.18,.34]),ne=Object.freeze([.62,.7,1]),P=Object.freeze([1,.86,.5]),F=Object.freeze([.9,.32,.1]);Object.freeze([1,.36,.05]);var I=e=>Object.freeze(Object.fromEntries(Object.entries(e).map(([e,t])=>[e,Object.freeze(t)]))),L=Object.freeze({rime:I({hellfire:[.5,.78,1],nova:[.72,.9,1],meteor:[.4,.68,1],spokes:[.46,.56,1],pool:[.28,.6,1],ember:[.34,.6,.95],brand:[.42,.62,1]}),storm:I({hellfire:[.66,.52,1],nova:[.84,.8,1],meteor:[.96,.92,.5],spokes:[.74,.46,1],pool:[.56,.4,1],ember:[.6,.42,.95],brand:[.7,.4,1]}),venom:I({hellfire:[.5,1,.26],nova:[.68,1,.38],meteor:[.38,.92,.16],spokes:[.28,1,.52],pool:[.3,.86,.12],ember:[.36,.8,.16],brand:[.4,.95,.2]})}),re=(e,t)=>L[t?.aspect?.id]?.[e.key]??N[e.key],ie=e=>L[e?.aspect?.id]?.ember??F,ae=e=>L[e?.aspect?.id]?.spokes??te;Object.freeze({ember:7,windup:12,landing:18});var R=y[31],z=(e,t,n=1.3)=>Object.freeze({clip:e,pitch:t,volume:n,reach:60,at:`him`}),B=Object.freeze({rise:68,hit:433,shatter:342}),V=(e,t,n=`him`)=>Object.freeze({id:352,pitch:1.1,volume:e,reach:t,at:n});Object.freeze({windup:Object.freeze({cleave:z(R.barkSound,.96),slam:z(R.barkSound,.76),charge:z(R.moveSound,.7),hellfire:Object.freeze({id:352,pitch:.8,volume:1.3,reach:60,at:`him`}),nova:Object.freeze({id:352,pitch:.63,volume:1.4,reach:60,at:`him`}),wrath:z(R.barkSound,.45,1.8),leap:z(R.barkSound,.6,1.5),meteor:Object.freeze({id:352,pitch:.5,volume:1.5,reach:70,at:`him`}),spokes:z(R.barkSound,.47,1.6),cross:Object.freeze({clip:R.barkSound,pitch:.46,volume:1.9,reach:160,at:`him`}),reckon:Object.freeze({clip:R.barkSound,pitch:.38,volume:2.1,reach:160,at:`him`}),chains:z(R.moveSound,.9,1.4),brand:Object.freeze({id:352,pitch:.39,volume:1.4,reach:60,at:`him`}),torment:z(R.attackSound,.85,1.4),wheel:z(R.barkSound,.37,1.6),gaze:z(R.barkSound,.29,1.8),unmake:Object.freeze({id:352,pitch:.305,volume:1.7,reach:80,at:`him`}),sunder:Object.freeze({clip:R.attackSound,pitch:.62,volume:1.9,reach:160,at:`him`}),rejoin:Object.freeze({clip:R.attackSound,pitch:.48,volume:2,reach:160,at:`him`})}),release:Object.freeze({cleave:Object.freeze({clip:105,pitch:.45,volume:1.5,reach:40,at:`him`}),charge:Object.freeze({clip:105,pitch:.45,volume:1.5,reach:40,at:`him`}),slam:Object.freeze({clip:15,pitch:.5,volume:1.4,reach:50,at:`him`}),leap:Object.freeze({clip:15,pitch:.5,volume:1.4,reach:50,at:`him`}),cross:Object.freeze({clip:15,pitch:.4,volume:1.7,reach:120,at:`him`}),hellfire:V(1.1,40,`targets`),nova:V(1.3,50),meteor:V(1.3,60,`targets`),spokes:V(1.3,50),wrath:V(1.8,120),reckon:V(1.8,160),chains:Object.freeze({clip:105,pitch:.7,volume:1.4,reach:40,at:`him`}),brand:V(1.1,40,`targets`),torment:V(1.1,40,`targets`),wheel:Object.freeze({clip:105,pitch:.55,volume:1.6,reach:45,at:`him`}),gaze:V(1.4,70),unmake:V(1.5,60),sunder:Object.freeze({clip:15,pitch:.45,volume:1.7,reach:120,at:`him`}),rejoin:Object.freeze({clip:15,pitch:.36,volume:1.8,reach:160,at:`him`})}),land:Object.freeze({cleave:z(R.attackSound,.8),slam:z(R.attackSound,.6,1.6),charge:z(R.attackSound,.72),hellfire:Object.freeze({clip:420,pitch:.9,volume:1.2,reach:40,at:`targets`}),nova:Object.freeze({clip:420,pitch:.7,volume:1.8,reach:60,at:`him`}),wrath:Object.freeze({clip:420,pitch:.5,volume:2,reach:120,at:`him`}),leap:z(R.attackSound,.55,1.7),meteor:Object.freeze({clip:420,pitch:.55,volume:2,reach:80,at:`targets`}),spokes:Object.freeze({clip:420,pitch:.65,volume:1.8,reach:60,at:`him`}),cross:Object.freeze({clip:15,pitch:.24,volume:2.2,reach:160,at:`him`}),reckon:Object.freeze({clip:420,pitch:.42,volume:2.2,reach:200,at:`him`}),chains:z(R.attackSound,.9),brand:Object.freeze({clip:420,pitch:.95,volume:1.4,reach:40,at:`targets`}),torment:Object.freeze({clip:420,pitch:.8,volume:1.6,reach:40,at:`targets`}),wheel:z(R.attackSound,.66,1.6),gaze:Object.freeze({clip:420,pitch:.85,volume:1.6,reach:70,at:`him`}),unmake:Object.freeze({clip:420,pitch:.6,volume:2,reach:80,at:`him`}),sunder:z(R.attackSound,.5,2),rejoin:Object.freeze({clip:15,pitch:.22,volume:2.2,reach:160,at:`him`})}),roar:z(R.barkSound,.5,1.8),fall:z(R.barkSound,.4,1.8),step:Object.freeze({clip:15,pitch:.42,volume:1,reach:45,at:`him`}),growl:z(R.barkSound,.36,.75),hurt:z(R.barkSound,.62,.9),quake:Object.freeze({clip:15,pitch:.3,volume:1.8,reach:70,at:`him`}),thunder:Object.freeze({clip:350,pitch:.62,volume:1.4,reach:140,at:`him`}),thud:Object.freeze({clip:15,pitch:.26,volume:2,reach:90,at:`him`}),crystalRise:Object.freeze({clip:B.rise,pitch:.7,volume:1.3,reach:60,at:`point`}),crystalHit:Object.freeze({clip:B.hit,pitch:1.55,volume:.9,reach:30,at:`point`}),crystalBreak:Object.freeze({clip:B.shatter,pitch:1.9,volume:1.7,reach:80,at:`point`}),crystalRing:Object.freeze({clip:B.hit,pitch:.55,volume:1.4,reach:80,at:`point`}),stunned:Object.freeze({clip:R.barkSound,pitch:.7,volume:1.8,reach:120,at:`him`}),groundStep:Object.freeze({clip:420,pitch:1.35,volume:.9,reach:14,at:`point`}),sting:Object.freeze({clip:B.hit,pitch:2.2,volume:1.3,reach:20,at:`point`})}),Object.freeze({rime:353,storm:351,venom:350}),Object.freeze({rime:Object.freeze({id:353,pitch:.55}),storm:Object.freeze({clip:350,pitch:.9}),venom:Object.freeze({id:350,pitch:.5})}),Object.freeze([7e3,13e3]),Object.freeze([`slam`,`charge`,`nova`,`wrath`,`leap`,`meteor`,`cross`,`reckon`,`sunder`,`rejoin`]),Object.freeze({slam:Object.freeze([2.5,12]),leap:Object.freeze([2.5,12]),cross:Object.freeze([4,25]),meteor:Object.freeze([3.5,15]),nova:Object.freeze([2,24]),wrath:Object.freeze([6,0]),reckon:Object.freeze([6,0])}),Object.freeze({sunder:`cross`,rejoin:`cross`}),Object.freeze({harrier:Object.freeze({burning:1,rime:1,storm:1,venom:1}),sapper:Object.freeze({burning:35,rime:38,storm:36,venom:37}),bearer:Object.freeze({burning:26,rime:25,storm:29,venom:27}),brute:Object.freeze({burning:27,rime:27,storm:27,venom:27}),caster:Object.freeze({burning:26,rime:25,storm:29,venom:32}),markynaz:Object.freeze({burning:31,rime:31,storm:31,venom:31}),tithe:Object.freeze({burning:1,rime:1,storm:1,venom:1}),gaoler:Object.freeze({burning:26,rime:25,storm:29,venom:27})}),Object.freeze([1,.8,.3]),Object.freeze({1:Object.freeze([`Imp`,`Imps`]),35:Object.freeze([`Fire Atronach`,`Fire Atronachs`]),38:Object.freeze([`Ice Atronach`,`Ice Atronachs`]),36:Object.freeze([`Iron Atronach`,`Iron Atronachs`]),37:Object.freeze([`Flesh Atronach`,`Flesh Atronachs`]),26:Object.freeze([`Fire Daedra`,`Fire Daedra`]),25:Object.freeze([`Frost Daedra`,`Frost Daedra`]),29:Object.freeze([`Daedra Seducer`,`Daedra Seducers`]),27:Object.freeze([`Daedroth`,`Daedroths`]),32:Object.freeze({get 0(){return n(`gate.host.lich`,`Lich`)},get 1(){return n(`gate.host.liches`,`Liches`)}}),31:Object.freeze({get 0(){return n(`gate.host.markynaz`,`Markynaz`)},get 1(){return n(`gate.host.markynazes`,`Markynazes`)}})}),Object.freeze([1,.4,.16]),Object.freeze([1,.5,.12]);var oe=`#ff5a2a`;Object.freeze([255,82,36]);var se=Object.freeze({burning:`Fire`,rime:`Frost`,storm:`Lightning`,venom:`Poison`}),H=Object.freeze({burning:`Resist fire to blunt his flames and burning ground.`,rime:`Resist frost to blunt his frost and rime.`,storm:`Resist shock to blunt his lightning and scorched ground.`,venom:`Resist poison to blunt his venom and poisoned ground.`,colossal:`Give his Ground Slam a wider berth.`,unyielding:`Save your heaviest blows for when his ward falls.`,vengeful:`Heal before you run low.`,scarring:`Fight clear of the scarred floor.`,grudge:`If you hit hardest, expect him.`,soulhungry:`Keep each other standing.`,favoured:`Keep moving from the first phase.`,echoing:`Move as each meteor lands.`,legion:`Stop the Atronachs. Break the Ward-Bearers.`}),ce=e=>`#${e.map(e=>Math.round(Math.max(0,Math.min(1,e))*255).toString(16).padStart(2,`0`)).join(``)}`,le=e=>ce(L[e]?.ember??F),ue=Object.freeze({burning:Object.freeze({fill:!0,d:`M12 1.5c.9 3.2-.8 4.9-2 6.6-1 1.4-1.6 2.6-1 4 .5 1.1 1.7 1.6 2.6 1.1 1.2-.7 1.2-2.2.6-3.8 3.4 1.6 5.8 4.6 5.8 8.1A6 6 0 0 1 12 23.5a6 6 0 0 1-6-6c0-3.3 2.2-5.6 3.8-7.7C11.1 8 12.6 5.6 12 1.5z`}),rime:Object.freeze({fill:!1,d:`M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17M12 2l-2.2 2.4M12 2l2.2 2.4M12 22l-2.2-2.4M12 22l2.2-2.4M3.3 7l.7 3.1M3.3 7l3.1-.9M20.7 17l-.7-3.1M20.7 17l-3.1.9M20.7 7l-3.1-.9M20.7 7l-.7 3.1M3.3 17l3.1.9M3.3 17l.7-3.1`}),storm:Object.freeze({fill:!0,d:`M13.5 1.5L4 13.8h6.4L8.7 22.5 20 9.4h-6.6l.1-7.9z`}),venom:Object.freeze({fill:!0,d:`M12 1.8c2.6 4.4 7 8.6 7 13.2a7 7 0 0 1-14 0c0-4.6 4.4-8.8 7-13.2zm-2.4 12.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zm4.3 2.6a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z`}),colossal:Object.freeze({fill:!0,d:`M2 21.5l6.2-12.3 3.3 5.4 3.4-6.9 7.1 13.8z`}),unyielding:Object.freeze({fill:!0,d:`M12 1.8l8.5 3.1v6.3c0 5.3-3.7 9.6-8.5 11-4.8-1.4-8.5-5.7-8.5-11V4.9z`}),vengeful:Object.freeze({fill:!1,d:`M4 4l10.5 10.5M4 4l.8 3.6M4 4l3.6.8M20 4L9.5 14.5M20 4l-.8 3.6M20 4l-3.6.8M12.5 16.5l3.5 3.5M11.5 16.5L8 20M15 19l3 3M9 19l-3 3`}),scarring:Object.freeze({fill:!1,d:`M12 1.5l-2.4 6.3 4.3 3.1-3.3 5.2 2 6.4M11.6 10.9l6.2-2.4M9.6 7.8L3.8 9.3M10.6 16.1l-5.2 2.6M13.9 10.9l3.1 6`}),grudge:Object.freeze({fill:!1,d:`M1.8 12S5.6 4.8 12 4.8 22.2 12 22.2 12 18.4 19.2 12 19.2 1.8 12 1.8 12zM12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z`}),soulhungry:Object.freeze({fill:!0,d:`M12 1.8c-5 0-8.5 3.5-8.5 8.1 0 2.9 1.4 4.9 3.3 6.1v3.3c0 1 .8 1.9 1.9 1.9h6.6c1.1 0 1.9-.9 1.9-1.9V16c1.9-1.2 3.3-3.2 3.3-6.1 0-4.6-3.5-8.1-8.5-8.1zM8.6 8.9a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm6.8 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM12 13.6l1.3 2.4h-2.6z`}),favoured:Object.freeze({fill:!0,d:`M12 1.5l3 6.9 7.4.7-5.6 4.9 1.7 7.3L12 17.5l-6.5 3.8 1.7-7.3-5.6-4.9 7.4-.7z`}),echoing:Object.freeze({fill:!1,d:`M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6zM12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19z`}),vanguard:Object.freeze({fill:!1,d:`M5 22.5V1.5M5 2.5h13l-3.2 4.2L18 11H5`}),sunder:Object.freeze({fill:!1,d:`M11 2.2L4 5v6.3c0 4.9 3 8.8 7 10.5M13 2.2L20 5v6.3c0 4.9-3 8.8-7 10.5M12 2.5l-1.6 5.2 2.6 3.1-2.2 4.4 1.4 6.3`}),captive:Object.freeze({fill:!1,d:`M7.5 3.5a3.5 3.5 0 0 1 0 7 3.5 3.5 0 0 1 0-7zM16.5 13.5a3.5 3.5 0 0 1 0 7 3.5 3.5 0 0 1 0-7zM9.8 9.8l4.4 4.4`}),legion:Object.freeze({fill:!1,d:`M12 3.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8zM7.6 14.6c.6-3 2.3-4.6 4.4-4.6s3.8 1.6 4.4 4.6M5.4 8.6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2.1 18.4c.5-2.5 1.7-3.7 3.3-3.7s2.8 1.2 3.3 3.7M18.6 8.6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM15.3 18.4c.5-2.5 1.7-3.7 3.3-3.7s2.8 1.2 3.3 3.7M2 21.4h20`})});function de(e,t=14){let n=ue[e];return n?`<svg viewBox="0 0 24 24" width="${t}" height="${t}" aria-hidden="true"><path ${n.fill?`fill="currentColor"`:`fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`} d="${n.d}"/></svg>`:``}function fe(e,t=14){return e?.path?`<svg viewBox="0 0 24 24" width="${t}" height="${t}" aria-hidden="true"><path ${e.fill?`fill="currentColor"`:`fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`} d="${e.path}"/></svg>`:de(e?.id,t)}function pe(e){if(e==null||!Array.isArray(e)||!e.length)return null;let t=U.get(e);if(t!==void 0)return t;let{aspect:n,trials:r}=b(e),i=Object.freeze({key:[n.id,...r.map(e=>e.id)].join(`,`),aspect:Object.freeze({id:n.id,kind:`aspect`,name:n.name,epithet:n.epithet,element:se[n.id]??`Fire`,text:n.omen,tip:H[n.id]??``,color:le(n.id)}),trials:Object.freeze(r.map(e=>Object.freeze({id:e.id,kind:`trial`,name:e.name,text:e.text,tip:H[e.id]??``})))});return U.set(e,i),i}var U=new WeakMap;Object.freeze({title:`The Warden's Marks`,gate:(e,t)=>`${e} comes ${t} tonight`,arrive:(e,t)=>`${e} comes ${t} tonight`,element:e=>`His blows carry ${e.toLowerCase()}`}),Object.freeze([`arrive`,`gate`]),Object.freeze([]);var W=`58px`,me=460,he=3e5,ge=6e4,G=1200,_e=500,ve=160,ye=800,K=Object.freeze({wardBreak:250,spent:400,callIn:160}),q=Object.freeze({warded:`Warded`,fallen:`Felled`,move:`Move`,wrathIn:e=>`Dagon's Wrath in ${e}`,fighters:e=>e===1?`1 in the court`:`${e} in the court`,reckon:(e,t,n,r)=>`${e} - ${t} of ${n} ${n===1?`crystal`:`crystals`} - ${r}s`,stunned:e=>`Stunned - ${e}s`,reckonIn:e=>`Reckoning in ${e}`,bearers:(e,t)=>`Ward-Bearers - ${t>e?`${e} of ${t}`:e} ${e===1?`stands`:`stand`}`,host:e=>`His host: ${e}`,vanguard:(e,t,r)=>n(`gate.bar.vanguard`,`The Vanguard - {stage}, wave {w} of {of}`,{stage:e,w:t,of:r}),vanguardHolds:e=>n(`gate.bar.vanguardHolds`,`The Vanguard - {stage}`,{stage:e}),stages:()=>[n(`gate.bar.bridgehead`,`Bridgehead`),n(`gate.bar.muster`,`Muster`)],kneels:e=>n(`gate.bar.kneels`,`Kneels - {secs}s`,{secs:e}),halfWarded:()=>n(`gate.bar.halfWarded`,`Warded`),alone:()=>n(`gate.bar.alone`,`Alone`),gaolers:e=>n(`gate.bar.gaolers`,`Gaolers: {n}`,{n:e}),ward:()=>n(`gate.bar.ward`,`The Covenant's ward`)});function be(e,t,n){let r=e?.sd;if(!r)return``;let i=r.kn[t]|0,a=t===l.flame?r.fl.su:e.stunUntil,o=t===l.flame?r.fl.sh:e.shieldUntil;return i>0&&n<a?q.kneels(Math.max(0,Math.ceil((a-n)/1e3))):n<o?q.halfWarded():r.lo[t]?q.alone():``}var J=e=>`rgb(${Math.round(e[0]*255)}, ${Math.round(e[1]*255)}, ${Math.round(e[2]*255)})`,xe=J(P),Se=`dagger-gate-bar-style`,Ce=`
.wb-boss-bar { position: fixed; left: 50%; top: ${W}; transform: translateX(-50%); width: 460px; max-width: 88vw;
  pointer-events: none; z-index: 30; font: 600 13px 'Cormorant', Georgia, serif; letter-spacing: 0.08em; color: #f3d9c4;
  text-shadow: 0 0 3px #000, 0 0 8px rgba(0,0,0,0.9); text-align: center; }
.wb-boss-name { font-size: 16px; letter-spacing: 0.12em; text-transform: uppercase; color: ${oe}; white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; text-shadow: 0 0 3px #000, 0 0 10px rgba(255,70,30,0.5); }
.wb-boss-sub { font-size: 12px; letter-spacing: 0.06em; line-height: 1.2; color: #d9b9a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wb-boss-marks { display: flex; flex-wrap: wrap; justify-content: center; gap: 1px 14px; margin: 1px 0 3px; }
.wb-boss-chip { flex: 0 0 auto; text-align: left; line-height: 1.15; }
.wb-boss-chip-head { display: flex; align-items: center; gap: 4px; min-width: 0; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; }
.wb-boss-chip-icon { flex: 0 0 13px; height: 13px; display: flex; align-items: center; }
.wb-boss-chip-name { overflow: hidden; text-overflow: ellipsis; }
.wb-boss-track { position: relative; height: 12px; margin: 4px 0 3px; border: 1px solid rgba(255,120,60,0.55);
  background: rgba(20,4,2,0.72); box-shadow: 0 0 10px rgba(0,0,0,0.8), inset 0 0 6px rgba(0,0,0,0.9); }
.wb-boss-ghost { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: rgba(255,232,196,0.78); }
.wb-boss-fill { position: absolute; left: 0; top: 0; bottom: 0; width: 100%;
  background: linear-gradient(180deg, #ff7a3a 0%, #c81e0c 55%, #6e0a04 100%); transition: width 250ms cubic-bezier(.2,.7,.3,1), filter 160ms; }
.wb-boss-mark { position: absolute; top: -2px; bottom: -2px; width: 2px; background: rgba(255,230,200,0.75); transition: opacity 300ms; }
.wb-boss-mark.spent { opacity: 0.35; }
.wb-boss-mark.spent.now { animation: wb-mark-spent ${K.spent}ms ease-out; }
@keyframes wb-mark-spent { 0% { opacity: 1; background: #fff; box-shadow: 0 0 8px 2px #fff; } 100% { opacity: 0.35; } }
.wb-boss-ward { position: absolute; inset: -2px; border: 2px solid rgba(255,220,130,0.95); box-shadow: 0 0 12px rgba(255,210,120,0.85);
  opacity: 0; transform: scale(1.04); transition: opacity 160ms ease-out, transform 160ms ease-out; }
.wb-boss-bar.warded .wb-boss-ward { opacity: 1; transform: scale(1); }
.wb-boss-halves { display: flex; gap: 12px; margin: 1px 0 3px; }
.wb-boss-half { flex: 1 1 0; min-width: 0; text-align: left; }
.wb-boss-half.flame { text-align: right; }
.wb-boss-half-name { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wb-boss-half-track { position: relative; height: 7px; margin: 2px 0 1px; border: 1px solid rgba(255,120,60,0.45); background: rgba(20,4,2,0.72); }
.wb-boss-half-fill { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; background: linear-gradient(180deg, #ff7a3a 0%, #c81e0c 55%, #6e0a04 100%); transition: width 250ms cubic-bezier(.2,.7,.3,1); }
.wb-boss-half.flame .wb-boss-half-fill { left: auto; right: 0; }
.wb-boss-half.kneels .wb-boss-half-track { border-color: rgba(160,180,255,0.8); box-shadow: 0 0 8px rgba(150,170,255,0.6); }
.wb-boss-half.warded .wb-boss-half-track { border-color: rgba(255,220,130,0.95); box-shadow: 0 0 8px rgba(255,210,120,0.7); }
.wb-boss-half-state { font-size: 11px; min-height: 13px; letter-spacing: 0.06em; color: #d9b9a0; font-variant-numeric: lining-nums tabular-nums; }
.wb-boss-bar.warded .wb-boss-fill { filter: saturate(0.45) brightness(0.8); }
.wb-boss-bar.wbreak .wb-boss-track { animation: wb-ward-break ${K.wardBreak}ms ease-out; }
@keyframes wb-ward-break { from { box-shadow: 0 0 0 2px #fff, 0 0 22px 6px rgba(255,244,214,0.95); } }
.wb-boss-callout { display: inline-block; font-size: 16px; text-transform: uppercase; min-height: 18px; margin-top: 1px; }
.wb-boss-callout-line { height: 2px; margin-top: 1px; background: currentColor; transform-origin: left center; transform: scaleX(0); opacity: 0.85; }
.wb-boss-callout.cin { animation: wb-callout-in 140ms ease-out; }
@keyframes wb-callout-in { from { opacity: 0; transform: translateY(-4px) scale(1.06); } }
.wb-boss-callout.cout { opacity: 0; transition: opacity 160ms ease-in; }
.wb-boss-callout.dagon .wb-boss-callout-text { display: inline-block; padding: 1px 10px; font-size: 18px; color: #f6ead2; background: rgba(130,10,10,0.88);
  box-shadow: 0 0 10px rgba(0,0,0,0.85); animation: wb-dagon-plate 250ms ease-in-out infinite alternate; }
@keyframes wb-dagon-plate { from { background: rgba(110,6,6,0.88); } to { background: rgba(170,16,16,0.95); } }
.wb-boss-move { display: none; margin-left: 8px; padding: 0 6px; font-size: 13px; letter-spacing: 0.14em; color: #fff4e6; background: rgba(214,58,12,0.92);
  vertical-align: 2px; box-shadow: 0 0 8px rgba(255,90,20,0.7); }
.wb-boss-callout.aimed .wb-boss-move { display: inline-block; animation: wb-move 250ms ease-in-out infinite alternate; }
@keyframes wb-move { from { opacity: 0.75; } to { opacity: 1; } }
.wb-boss-foot { display: flex; justify-content: center; flex-wrap: wrap; gap: 3px 6px; margin-top: 2px; font-size: 12px; font-variant-numeric: lining-nums tabular-nums; }
.wb-boss-tag { padding: 0 6px; line-height: 16px; background: rgba(20,4,2,0.55); border: 1px solid rgba(255,120,60,0.22); opacity: 0.9; }
.wb-boss-wrath { color: #ff9a7a; border-color: rgba(255,90,60,0.55); opacity: 1; }
.wb-boss-wrath.near { color: #fff0e8; background: rgba(150,14,8,0.85); animation: wb-wrath-near 500ms ease-in-out infinite alternate; }
.wb-boss-host.near { color: #fff6dc; animation: wb-wrath-near 500ms ease-in-out infinite alternate; }
.wb-boss-bar.brass .wb-boss-host.near { animation-name: wb-brass-near; }
@keyframes wb-brass-near { from { background: rgba(90,64,10,0.8); } to { background: rgba(170,128,30,0.95); } }
@keyframes wb-wrath-near { from { background: rgba(110,8,6,0.8); } to { background: rgba(190,20,12,0.95); } }
.wb-boss-bar.intro .wb-boss-fill { animation: wb-fill-in 700ms cubic-bezier(.2,.7,.3,1); }
.wb-boss-bar.low .wb-boss-fill { animation: wb-low 650ms ease-in-out infinite alternate; }
@keyframes wb-low { to { filter: brightness(1.55) saturate(1.2); } }
.wb-boss-bar.intro .wb-boss-name { animation: wb-name-in 250ms ease-out; }
@keyframes wb-fill-in { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes wb-name-in { from { opacity: 0; letter-spacing: 0.3em; } }
/* SD8c: the Brass Remnant's bar - the same readout in the Hour's brass (its model's \`theme\`, ui/superDungeon/sdRemnantBar.js) */
.wb-boss-bar.brass { color: #f2e2bc; }
.wb-boss-bar.brass .wb-boss-name { color: #e8c060; text-shadow: 0 0 3px #000, 0 0 10px rgba(230,180,70,0.5); }
.wb-boss-bar.brass .wb-boss-sub { color: #d8c49a; }
.wb-boss-bar.brass .wb-boss-track { border-color: rgba(230,190,90,0.55); background: rgba(16,12,4,0.75); }
.wb-boss-bar.brass .wb-boss-fill { background: linear-gradient(180deg, #ffd977 0%, #b8862a 55%, #4a3208 100%); }
.wb-boss-bar.brass .wb-boss-tag { background: rgba(16,12,4,0.55); border-color: rgba(230,190,90,0.25); }
.wb-boss-bar.brass .wb-boss-wrath { color: #ffd2a0; border-color: rgba(255,160,80,0.55); }
/* AUDIT SD IV (T6): the Hour's Reset and its End called on its own brass plate, in the call's own colour (the Mantella's
   green, the End's red) - they stood on Dagon's pulsing blood in the gate's cream - and its last minute pulsing brass */
.wb-boss-bar.brass .wb-boss-callout.dagon .wb-boss-callout-text { color: inherit; background: rgba(60,42,8,0.9); animation-name: wb-brass-plate; }
@keyframes wb-brass-plate { from { background: rgba(40,28,6,0.88); } to { background: rgba(96,70,14,0.95); } }
.wb-boss-bar.brass .wb-boss-wrath.near { color: #fff6dc; background: rgba(130,96,20,0.85); animation-name: wb-brass-near; }
/* SERPENT1: the sea serpent's bar - the same readout in the sea's colours (its model's \`theme\`, ui/serpentBar.js) */
.wb-boss-bar.sea { color: #d6efe8; }
.wb-boss-bar.sea .wb-boss-name { color: #8fe3cf; text-shadow: 0 0 3px #000, 0 0 10px rgba(40,200,170,0.5); }
.wb-boss-bar.sea .wb-boss-sub { color: #a9cfc4; }
.wb-boss-bar.sea .wb-boss-track { border-color: rgba(90,210,190,0.55); background: rgba(2,14,18,0.75); }
.wb-boss-bar.sea .wb-boss-fill { background: linear-gradient(180deg, #4fe0c0 0%, #1a8a86 55%, #0b3a4a 100%); }
.wb-boss-bar.sea .wb-boss-tag { background: rgba(2,14,18,0.55); border-color: rgba(90,210,190,0.25); }
.wb-boss-bar.sea .wb-boss-wrath { color: #ffd2a0; border-color: rgba(255,160,80,0.55); }
/* STAR6: a fallen star's master - the same readout in the star's violet (its model's \`theme\`, ui/starfall/starBar.js) */
.wb-boss-bar.star { color: #e6defa; }
.wb-boss-bar.star .wb-boss-name { color: #c9b6ff; text-shadow: 0 0 3px #000, 0 0 10px rgba(150,110,255,0.55); }
.wb-boss-bar.star .wb-boss-sub { color: #b7a9d8; }
.wb-boss-bar.star .wb-boss-track { border-color: rgba(170,140,255,0.55); background: rgba(12,6,24,0.75); }
.wb-boss-bar.star .wb-boss-fill { background: linear-gradient(180deg, #c7b0ff 0%, #7a52e0 55%, #2c1660 100%); }
.wb-boss-bar.star .wb-boss-tag { background: rgba(12,6,24,0.55); border-color: rgba(170,140,255,0.25); }
@media (max-width: 640px) {
  .wb-boss-bar { top: 72px; }
  .wb-boss-marks { column-gap: 10px; }
  .wb-boss-chip-head { font-size: 10px; letter-spacing: 0.06em; }
}
@media (max-height: 480px) {
  .wb-boss-bar { top: 44px; }
  .wb-boss-marks { display: none !important; }
}
`;function we(t,n,u,g=null,{flame:_=null,flameMine:y=!1}={}){if(!t||t.day===null||!u)return null;let b=s(t),x=t.fell?0:t.max>0?Math.max(0,Math.min(1,t.hp/t.max)):1,S=y&&_?_:t,C=S===t?b:s(S),w=S.atk,T=w?r[w.a]:null,E=T?c(w,S.phase,n):null,D=!t.fell&&T&&E&&!E.over?{text:C.atk[T.key].name,color:J(re(T,C)),t:n<w.at?E.t:1,dagon:v(T),move:!!g&&g===C.atk[T.key].name}:null;if(!t.fell&&T===o.reckon&&E&&n<w.at&&t.cx){let e=0;for(let n of t.cx.c)n[2]>0&&e++;D={text:q.reckon(b.atk.reckon.name,e,t.cx.c.length,Math.ceil((w.at-n)/1e3)),color:J(a(t.cp,w)?P:ae(b)),t:E.t,dagon:!0,move:!1}}else!t.fell&&t.wrath==null&&n<(t.stunUntil??0)&&!t.sd&&(D={text:q.stunned(Math.ceil((t.stunUntil-n)/1e3)),color:J(ne),t:null,dagon:!1,move:!1});let O=0,k=0,A=0;for(let e of t.lg?.ads??[])e.k===p.bearer?O++:e.k===p.gaoler?A++:e.k!==p.tithe&&k++;!t.fell&&t.wrath==null&&O>0&&n<t.shieldUntil&&!D&&(D={text:q.bearers(O,t.lg?.ward?.n??O),color:J(P),t:null,dagon:!1,move:!1});let j=Number.isFinite(t.wrathAt)?t.wrathAt-n:1/0,M=!t.fell&&t.wrath==null&&t.phase>=3&&t.rk>n?t.rk-n:null,N=t.fell?n-(Number.isFinite(t.fell.at)?t.fell.at:n):0,te=t.fell?Math.max(0,Math.min(1,1-(N-G)/500)):1,F=b.md?pe(b.md):null,I=!t.fell&&t.wrath==null?t.sd??null:null,L=I?[l.blade,l.flame].map(e=>({name:ee(e,b,u.name),frac:I.m>0?Math.max(0,Math.min(1,I.h[e]/I.m)):0,state:be(t,e,n),kneels:(I.kn[e]|0)>0,warded:n<(e===l.flame?I.fl.sh:t.shieldUntil),color:e===l.flame?J(ie(b)):``})):null;return{name:u.name,title:u.title,frac:x,marks:i(t)?[m[0],d]:[...m],phase:t.phase,halves:L,spent:m.map((e,n)=>t.phase>n+1),epithet:b.md?b.aspect.epithet:``,trials:b.trialsLine,epithetColor:F?.aspect.color??null,marksView:F,warded:!t.fell&&n<t.shieldUntil&&!(L&&!L.every(e=>e.warded)),fallen:!!t.fell,callout:D,wrath:!t.fell&&t.wrath==null&&j<=3e5?q.wrathIn(e(j)):null,wrathNear:!t.fell&&t.wrath==null&&j<=6e4,fighters:t.fighters|0,reckonIn:M===null?null:q.reckonIn(e(M)),host:!t.fell&&t.wrath==null&&t.vg&&t.vg[0]<2?t.vg[1]>0?q.vanguard(q.stages()[t.vg[0]],t.vg[1],h[t.vg[0]].waves.length):q.vanguardHolds(q.stages()[t.vg[0]]):!t.fell&&t.wrath==null&&A>0?q.gaolers(A):!t.fell&&t.wrath==null&&t.cp?.f>0&&!f(t.cp,t.atk,n)?q.ward():!t.fell&&t.wrath==null&&k>0?q.host(k):null,alpha:Math.round(te*20)/20,now:n,low:!t.fell&&x>0&&x<.1}}var Y=null,X=null,Z=()=>({vis:``,name:null,sub:null,subColor:null,marks:null,marksTheme:null,spent:null,ticks:null,spentAt:null,spentNew:null,marksAt:null,frac:-1,ghost:-1,g:null,at:null,warded:null,breakAt:null,rootCls:null,callout:null,calloutColor:null,calloutCls:null,calloutT:-1,inAt:null,outAt:null,dagon:!1,move:!1,tags:[null,null,null,null],wrathNear:null,hostNear:null,alpha:-1,introAt:null,halves:null}),Q=Z();function Te(e){if(e.getElementById&&!e.getElementById(`dagger-gate-bar-style`)){let n=e.createElement(`style`);n.id=Se,n.textContent=Ce,(e.head??e.body)?.append(n),e.head&&t(e)}let n=(t,n=`div`)=>{let r=e.createElement(n);return r.className=t,r};Y=n(`wb-boss-bar`);let r=n(`wb-boss-name`),i=n(`wb-boss-sub`),a=n(`wb-boss-track`),o=n(`wb-boss-ghost`),s=n(`wb-boss-fill`),c=n(`wb-boss-ward`);a.append(o,s);let l=m.map(e=>{let t=n(`wb-boss-mark`);return t.style.left=`${(e*100).toFixed(1)}%`,a.append(t),t});a.append(c);let u=n(`wb-boss-marks`),d=[0,1,2].map(()=>{let e=n(`wb-boss-chip`),t=n(`wb-boss-chip-head`),r=n(`wb-boss-chip-icon`),i=n(`wb-boss-chip-name`);return t.append(r,i),e.append(t),u.append(e),{chip:e,icon:r,label:i}});u.style.display=`none`;let f=n(`wb-boss-callout`),p=n(`wb-boss-callout-text`,`span`),h=n(`wb-boss-move`,`span`),g=n(`wb-boss-callout-line`);h.textContent=q.move,f.append(p,h,g);let _=n(`wb-boss-foot`),v=[`wb-boss-tag`,`wb-boss-tag wb-boss-host`,`wb-boss-tag`,`wb-boss-tag wb-boss-wrath`].map(e=>{let t=n(e,`span`);return t.style.display=`none`,t});_.append(...v);let y=n(`wb-boss-halves`),b=[`blade`,`flame`].map(e=>{let t=n(`wb-boss-half ${e}`),r=n(`wb-boss-half-name`),i=n(`wb-boss-half-track`),a=n(`wb-boss-half-fill`),o=n(`wb-boss-half-state`);return i.append(a),t.append(r,i,o),y.append(t),{root:t,name:r,fill:a,state:o,key:e}});y.style.display=`none`,Y.append(r,i,a,u,f,_,y),(e.body??e.documentElement)?.append(Y),X={name:r,sub:i,marks:u,chips:d,ghost:o,fill:s,ward:c,ticks:l,callout:f,calloutText:p,move:h,calloutLine:g,foot:_,tags:v,halves:y,half:b}}function Ee(e,t,n){t?(e.chip.style.display=``,e.icon.innerHTML=fe(t,12),e.icon.style.color=t.kind===`aspect`?t.color:n===`brass`?`#e8c060`:`#ffb27a`,e.label.textContent=t.name,e.label.style.color=t.kind===`aspect`?t.color:``):e.chip.style.display=`none`}var $=(e,t,n)=>e!==null&&t-e<n;function De(e,{hidden:t=!1,doc:n=globalThis.document}={}){let r=!t&&!!e&&(e.alpha??1)>0;if(!Y){if(!r||!n?.createElement)return;Te(n)}let i=r?`on`:`off`;if(i!==Q.vis&&(Q.vis=i,Y.style.display=r?``:`none`),!e&&Q.introAt!==null&&(Q={...Z(),vis:Q.vis},X.calloutText.textContent=``),!r||!e)return;let a=Number.isFinite(e.now)?e.now:0;Q.introAt===null&&(Q.introAt=a),e.name!==Q.name&&(Q.name=e.name,X.name.textContent=e.name);let o=e.epithet?`${e.epithet.charAt(0).toUpperCase()}${e.epithet.slice(1)}`:e.title;o!==Q.sub&&(Q.sub=o,X.sub.textContent=o);let s=e.epithet?e.epithetColor??``:``;s!==Q.subColor&&(Q.subColor=s,X.sub.style.color=s);let c=e.marksView??null,l=c?.key??``,u=e.theme??``;if(l!==Q.marks||u!==Q.marksTheme){Q.marks=l,Q.marksTheme=u,X.marks.style.display=c?``:`none`;let e=c?[c.aspect,...c.trials]:[];X.chips.forEach((t,n)=>Ee(t,e[n]??null,u))}let d=Array.isArray(e.marks)&&e.marks.length===X.ticks.length?e.marks:m,f=d.join(`,`);f!==Q.marksAt&&(Q.marksAt=f,X.ticks.forEach((e,t)=>{e.style.left=`${(d[t]*100).toFixed(1)}%`}));let p=(e.spent??[]).map(e=>+!!e).join(``);p!==Q.spent&&(Q.spent!==null&&(Q.spentNew=[...p].map((e,t)=>e===`1`&&Q.spent[t]!==`1`),Q.spentAt=a),Q.spent=p);let h=X.ticks.map((e,t)=>p[t]===`1`?Q.spentNew?.[t]&&$(Q.spentAt,a,K.spent)?`wb-boss-mark spent now`:`wb-boss-mark spent`:`wb-boss-mark`),g=h.join(`|`);g!==Q.ticks&&(Q.ticks=g,h.forEach((e,t)=>{X.ticks[t].className=e}));let _=Math.round(e.frac*1e3)/1e3;_!==Q.frac&&(Q.frac=_,X.fill.style.width=`${(_*100).toFixed(1)}%`);let v=Q.at===null?0:Math.max(0,Math.min(.25,(a-Q.at)/1e3));Q.at=a,Q.g=C(Q.g,_*100,v);let y=Math.round(Q.g.at*10)/10;y!==Q.ghost&&(Q.ghost=y,X.ghost.style.width=`${y.toFixed(1)}%`),e.warded!==Q.warded&&(Q.warded&&!e.warded&&!e.fallen&&(Q.breakAt=a),Q.warded=e.warded);let b=`wb-boss-bar${e.theme?` ${e.theme}`:``}${e.warded?` warded`:``}${$(Q.breakAt,a,K.wardBreak)?` wbreak`:``}${$(Q.introAt,a,800)?` intro`:``}${e.low?` low`:``}`;b!==Q.rootCls&&(Q.rootCls=b,Y.className=b);let x=e.alpha??1;x!==Q.alpha&&(Q.alpha=x,Y.style.opacity=x<1?String(x):``);let S=e.halves??null,w=S?S.map(e=>`${e.name}|${Math.round(e.frac*1e3)}|${e.state}|${+!!e.kneels}${+!!e.warded}|${e.color}`).join(`#`):``;w!==Q.halves&&(Q.halves=w,X.halves.style.display=S?``:`none`,S&&X.half.forEach((e,t)=>{let n=S[t];e.name.textContent=n.name,e.name.style.color=n.color,e.fill.style.width=`${(n.frac*100).toFixed(1)}%`,e.state.textContent=n.state,e.root.className=`wb-boss-half ${e.key}${n.kneels?` kneels`:``}${n.warded?` warded`:``}`}));let T=e.fallen?e.fallenText??q.fallen:e.callout?e.callout.text:e.warded?e.wardedText??q.warded:``,E=e.fallen?e.ringCss??`#ff5a2a`:e.callout?e.callout.color:e.warded?xe:e.ringCss??`#ff5a2a`;if(T){if(Q.outAt=null,T!==Q.callout){let e=!Q.callout||Q.callout.split(` - `)[0]!==T.split(` - `)[0];Q.callout=T,X.calloutText.textContent=T,e&&(Q.inAt=a)}Q.dagon=!!e.callout?.dagon&&!e.fallen,Q.move=!!e.callout?.move&&!e.fallen}else Q.callout&&(Q.outAt===null?Q.outAt=a:a-Q.outAt>=160&&(Q.callout=``,Q.outAt=null,Q.dagon=Q.move=!1,X.calloutText.textContent=``));let D=`wb-boss-callout${$(Q.inAt,a,K.callIn)&&Q.outAt===null?` cin`:``}${Q.dagon?` dagon`:``}${Q.move?` aimed`:``}${Q.outAt===null?``:` cout`}`;D!==Q.calloutCls&&(Q.calloutCls=D,X.callout.className=D),T&&E!==Q.calloutColor&&(Q.calloutColor=E,X.callout.style.color=E);let O=Q.outAt===null?T&&e.callout&&Number.isFinite(e.callout.t)&&!e.fallen?Math.round(e.callout.t*50)/50:0:Q.calloutT;O!==Q.calloutT&&(Q.calloutT=O,X.calloutLine.style.transform=`scaleX(${O})`);let k=[e.fightersLine??q.fighters(e.fighters),e.fallen?``:e.host??``,e.fallen?``:e.reckonIn??``,e.wrath??``];for(let e=0;e<k.length;e++)k[e]!==Q.tags[e]&&(Q.tags[e]=k[e],X.tags[e].textContent=k[e],X.tags[e].style.display=k[e]?``:`none`);let A=!!e.wrath&&!!e.wrathNear;A!==Q.wrathNear&&(Q.wrathNear=A,X.tags[3].className=A?`wb-boss-tag wb-boss-wrath near`:`wb-boss-tag wb-boss-wrath`);let j=!!e.host&&!!e.hostNear&&!e.fallen;j!==Q.hostNear&&(Q.hostNear=j,X.tags[1].className=j?`wb-boss-tag wb-boss-host near`:`wb-boss-tag wb-boss-host`)}function Oe(){Y?.remove?.(),Y=null,X=null,Q=Z()}export{Ce as BOSS_BAR_CSS,Se as BOSS_BAR_STYLE_ID,q as BOSS_BAR_TEXT,W as BOSS_BAR_TOP,me as BOSS_BAR_WIDTH,ve as CALLOUT_OUT_MS,_e as FELL_FADE_MS,G as FELL_HOLD_MS,K as FLASH_MS,ye as INTRO_MS,ge as WRATH_NEAR_MS,he as WRATH_WARN_MS,we as bossBarModel,Oe as destroyGateBossBar,De as drawGateBossBar,be as halfState};