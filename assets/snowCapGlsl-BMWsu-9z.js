import"./uiPrefs-Bk07lQeg.js";import"./uiSkin-Ceob8Zyl.js";import{r as e}from"./mat4-CPsgC_7A.js";import{c as t,i as n,r,s as i,t as a}from"./puddleMask-SgJGpUuA.js";Object.freeze([`pool`,`spatter`,`streak`,`drip`,`print`]);var o=Object.freeze([.47,.04,.032]);Object.freeze([.3,.13,.09,1]),Object.freeze({pool:.42,spatter:.2,streak:.19}),Object.freeze({a:0,depth:0});function s(e,t,n=Math.random){let r=e.cells.filter(e=>e.kind===t);if(!r.length)return e.cells[0]??null;let i=r[Math.min(r.length-1,Math.floor(n()*r.length))];return n()<.5?{...i,u0:i.u1,u1:i.u0}:i}var c=Object.freeze([.5,.95,.95]),ee=2.2,te=Object.freeze(c.map(e=>e/ee)),ne=.18,re=.72,ie=.02,ae=.15,oe=.75,se=.85,l=`
uniform sampler2D uCloudShadowMap;
uniform vec4 uCloudShadowRect;   // VC4: the square's corner x, z; 1 / its side; the amount (0 = no shadow, the classic skin and every interior)
uniform vec2 uCloudShadowFar;    // OW-HORIZON: x the transmittance past the square, y 1 when told ((0, 0): full sun past it, as before)
// the transmittance of the cloud slab along the sun's ray from this
// ground point, read off the map the same field the sky is drawn from
// writes (render/volumetricClouds.js); outside the square the far law
// (OW-HORIZON), no shadow in a program never told it
float cloudShadowAt(vec3 wp) {
  if (uCloudShadowRect.w <= 0.0) return 1.0;
  vec2 uv = (wp.xz - uCloudShadowRect.xy) * uCloudShadowRect.z;
  bool told = uCloudShadowFar.y > 0.5;
  float far = told ? uCloudShadowFar.x : 1.0;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return far;
  float t = 1.0 - (1.0 - texture(uCloudShadowMap, uv).r) * uCloudShadowRect.w;
  if (!told) return t;
  vec2 e = abs(uv - 0.5) * 2.0;
  return mix(t, far, smoothstep(${.8.toFixed(2)}, 1.0, max(e.x, e.y)));
}
// SKY-CAP: the transmittance at the texel NEAREST ground point g (x, z) the map knows - past the square, its edge. Clamped
// in the map's own UV, never in world metres: the square's far side in metres (corner + 1 / z, in fp32) carried back
// into UV lands a hair past 1.0 for some squares, where cloudShadowAt answers "outside: full sun"
float cloudShadowNearest(vec2 g) {
  if (uCloudShadowRect.w <= 0.0) return 1.0;
  vec2 uv = clamp((g - uCloudShadowRect.xy) * uCloudShadowRect.z, 0.0, 1.0);
  return 1.0 - (1.0 - texture(uCloudShadowMap, uv).r) * uCloudShadowRect.w;
}
`,ce=`${l}
uniform float uCloudFar;   // the far transmittance the host's uSunScale already carries; 1 with no map
float ringSun() { return uSunScale * cloudShadowAt(vWorld) / max(uCloudFar, 0.05); }`,u=`
// Bayer 4x4, the ordered dither a 256-colour gradient used.
// LA-COST4 (2026-09-27, Mac: "performance improvements"): THE MATRIX BY ITS BITS, NOT BY A TABLE. This built a
// sixteen-float local array in every fragment that dithers - the lane's five programs, the resolve, the AO's
// rotation, the glow's jitter, the skies' band - to read one element of it. A 4x4 Bayer matrix IS a bit interleave:
// with z = x ^ y its value's four bits, high to low, are z's low bit, y's low bit, z's high bit, y's high bit. The same
// sixteen numbers the table held (0 8 2 10 / 12 4 14 6 / 3 11 1 9 / 15 7 13 5), which test/render/la_cost.test.js checks cell
// by cell by running this very text.
float bayer4(vec2 p) {
  int x = int(mod(p.x, 4.0)), y = int(mod(p.y, 4.0));
  int z = x ^ y;
  return float(((z & 1) << 3) | ((y & 1) << 2) | (z & 2) | ((y >> 1) & 1)) / 16.0;
}
`,le=`
uniform float uDissolveCut;
void dissolveCut() {
  if (uDissolveCut > 0.0 && bayer4(gl_FragCoord.xy) + 0.03125 >= 1.0 - uDissolveCut) discard;
}
`,ue=.46875,de=`
in vec3 vShade;   // LPT1 (render/lowPolyTreesGlsl.js)
in float vAlpha;
in float vFade;
`,fe=`  vec4 lptTexel = tex;   // LPT1: a tree's texel, kept from the flats' margin clear (render/lowPolyTreesGlsl.js)
`,pe=`
  // LPT1: a low-poly tree's own texel, its light and colour, its cut, and the crossfade with its far picture
  // (render/lowPolyTreesGlsl.js)
  if (vFade > 1.5) tex = lptTexel;
  tex.rgb *= vShade;
  tex.a = vAlpha > 0.0 ? tex.a * vAlpha : 1.0;
  if (vFade < 1.0 ? bayer4(gl_FragCoord.xy) + 0.03125 >= vFade : (vFade > 1.5 && vFade < 3.0 && bayer4(gl_FragCoord.xy) + 0.03125 < 3.0 - vFade)) discard;
`,me=`
uniform vec4 uJungleHaze[2];   // BANTHA1: [0] the floor's extinction (1/m), the floor's height, 1 / the falloff (1/m), the clear start (m) | [1].x on
float hazeMean(float a, float b) {   // the mean density over a ray from height a to b (in falloffs over the floor), the floor's 1
  float lo = min(a, b), hi = max(a, b);
  if (hi <= 0.0) return 1.0;
  float span = hi - lo;
  if (span < 1e-4) return exp(-max(lo, 0.0));
  float lo0 = max(lo, 0.0);
  return ((lo0 - lo) + (exp(-lo0) - exp(-hi))) / span;
}
float hazeAt(vec3 worldPos, vec3 origin) {
  if (uJungleHaze[1].x < 0.5) return 1.0;
  float run = length(worldPos - origin) - uJungleHaze[0].w;
  if (run <= 0.0) return 1.0;
  float k = uJungleHaze[0].z;
  return exp(-uJungleHaze[0].x * run * hazeMean((origin.y - uJungleHaze[0].y) * k, (worldPos.y - uJungleHaze[0].y) * k));
}`,he=`${me}
uniform vec3 uHazeEye;
float ringHaze(float m) { return 1.0 - (1.0 - m) * hazeAt(vWorld, uHazeEye); }`,ge=`uniform vec4 uFocus;
vec3 focusOrigin() { return uFocus.w > 0.5 ? uFocus.xyz : uCamPos; }
${me}
float weatherFogAt(vec3 worldPos) {
  if (uFogMode == 0) return 1.0;
  float d = length(worldPos - focusOrigin());   // TV1: the traveller's eye under the travel view, the camera otherwise
  if (uFogMode == 1) {
    return clamp((uFogRange.y - d) / max(uFogRange.y - uFogRange.x, 1e-4), 0.0, 1.0);
  }
  if (uFogMode == 3) { float f = uFogDensity * d; return exp(-f * f); }   // DS1: FogMode.ExponentialSquared
  return exp(-uFogDensity * d);
}
float fogFactorAt(vec3 worldPos) { return weatherFogAt(worldPos) * hazeAt(worldPos, focusOrigin()); }   // BANTHA1
uniform vec4 uDwFog[5];   // DW-C: on, sea Y, vision, strength | absorb rgb, scatter per m | in-scatter rgb, darkening | fog rgb, far factor | far start, far end, sky distance, -
float dwWaterDistance(vec3 worldPos) {   // the ray's length in the water: capped where it climbs through the surface
  vec3 r = worldPos - uCamPos;
  float dist = length(r);
  float toSurface = uDwFog[0].y - uCamPos.y;
  float dy = r.y / max(dist, 1e-6);
  return (dy > 1e-4 && toSurface > 0.0) ? min(toSurface / dy, dist) : dist;
}
float dwWaterClose(float d) {   // the two bands' closing to the fog colour
  float v = uDwFog[0].z;
  return max(smoothstep(0.5 * v, 1.45 * v, d), uDwFog[3].w * smoothstep(uDwFog[4].x, uDwFog[4].y, d));
}
vec3 dwWaterFogAt(vec3 col, float d) {
  vec3 c = (col * exp(-d * uDwFog[1].xyz) + (1.0 - exp(-d * uDwFog[1].w)) * uDwFog[2].xyz) * uDwFog[2].w;
  return mix(c, uDwFog[3].xyz, dwWaterClose(d));
}
vec3 dwWaterFog(vec3 col, vec3 worldPos) {
  if (uDwFog[0].x < 0.5) return col;
  return dwWaterFogAt(col, dwWaterDistance(worldPos));
}
vec3 dwWaterFogAdd(vec3 add, vec3 worldPos) {
  if (uDwFog[0].x < 0.5) return add;
  float d = dwWaterDistance(worldPos);
  return add * exp(-d * uDwFog[1].xyz) * uDwFog[2].w * (1.0 - dwWaterClose(d));
}`,d=49152,f=Object.freeze({own:Object.freeze([[10248,16976],[-21357,7588]]),shiver:Object.freeze([[18853,-8840],[6493,24016]])}),p=e=>`vec2(${(e[0]*2*Math.PI/d).toPrecision(9)}, ${(e[1]*2*Math.PI/d).toPrecision(9)})`,_e=`
uniform vec4 uWindfallSway;   // WINDFALL1: sway amplitude x min(S, 2), shiver amplitude x saturate(S) x min(S, 2), the sway's phase, the shiver's
uniform vec4 uWindfallAxis;   // WINDFALL1: the wind's heading x, z (zero while the mod's law is off) and the land's anchor
vec3 windfallLean(vec2 root, vec3 right) {
  vec2 w = root + uWindfallAxis.zw;
  float cell = fract(sin(dot(mod(floor(w * 0.0833333358), 4096.0) * 12.0, vec2(12.9898, 78.233))) * 43758.5469);
  float own = 0.5 + 0.25 * (sin(dot(w, ${p(f.own[0])})) + sin(dot(w, ${p(f.own[1])})));
  float shiv = 0.5 + 0.25 * (sin(dot(w, ${p(f.shiver[0])})) + sin(dot(w, ${p(f.shiver[1])})));
  float sway = sin((cell + (own - cell) * 0.2) * 6.28318548 + uWindfallSway.z);
  float shiver = sin(shiv * 6.28318548 + uWindfallSway.w);
  vec3 d = vec3(uWindfallAxis.x, 0.0, uWindfallAxis.y);
  return (d * 0.15 + right * (dot(d, right) * 0.85)) * (uWindfallSway.x * sway + uWindfallSway.y * shiver) * (shiv * 0.400000036 + 0.8);
}
bool windfallLaw() { return dot(uWindfallAxis.xy, uWindfallAxis.xy) > 0.5; }
`;Object.freeze([.035,.065,.075,1]),Object.freeze([14/255,25/255,21/255,1]),Object.freeze([.519,.527,.467,1]),Object.freeze([.055,.105,.12,1]),Object.freeze([.72,.78,.82,1]),Object.freeze([.21,.21,.19,1]),Object.freeze([.0225,.0375]),Object.freeze({archive:302,record:0}),Object.freeze({sand:[.74,.66,.49],mid:[.41,.38,.31],deep:[.18,.18,.2],swamp:[.3,.27,.18],shelfMix:.55,depthGamma:1.4}),Object.freeze([1.8,1.25,1.05]),Object.freeze([.09,.165,.155,1]),Object.freeze([.012,.022,.026,1]),Object.freeze([.02,.04,.045,1]),Object.freeze([.003,.006,.009,1]);var ve=`
uniform sampler2D uSurfaceTex;
uniform vec3 uDwCamFwd;        // the camera's forward (uCamFwd is the lane's light clusters' vec4 - one program holds both)
uniform float uColumnOn;       // 1 while the camera is over the sea and the surfaces are drawn
uniform float uSeaY;           // the surface's world height
uniform vec4 uTopColor;        // the top's _Color (rgb tint, a alpha)
uniform float uTopVision;      // the top's _WaterSurfaceVisionDistance
uniform vec2 uSurfaceScroll;   // the top's texture offset now, in repeats
uniform vec3 uPixelOrigin;     // this pixel's world origin (the surface's uv is pixel-local)
vec3 dwColumn(vec3 col, vec3 worldPos) {
  if (uColumnOn > 0.5 && worldPos.y < uSeaY && uCamPos.y > worldPos.y) {
    // where the view ray crosses the sea, and the eye depth behind it
    vec3 toFrag = worldPos - uCamPos;
    float s = clamp((uSeaY - uCamPos.y) / min(toFrag.y, -1e-4), 0.0, 1.0);
    vec3 entry = uCamPos + toFrag * s;
    float behind = max(dot(worldPos - entry, uDwCamFwd), 0.0);
    float t = min(behind / max(uTopVision, 1.0), 1.0);
    vec2 uv = (entry.xz - uPixelOrigin.xz) / 819.2 * ${128 .toFixed(1)} + uSurfaceScroll;
    vec3 st = texture(uSurfaceTex, uv).rgb * uTopColor.rgb;
    st = mix(st, uTopColor.rgb * 0.32, 0.22);
    st = mix(uFogColor, st, fogFactorAt(entry));
    col = mix(col, st, t);
  }
  return col;
}`;Object.freeze([`wall`,`wall2`,`wainscot`,`floor`,`floor2`,`ceiling`,`beam`,`furniture`]),Object.freeze({wall:Object.freeze([`plaster`,`stripes`,`stone`,`boards`]),floor:Object.freeze([`planks`,`flags`,`tiles`])});var m=Object.freeze([Object.freeze({name:`plaster and oak`,colors:[[182,160,124],[168,146,112],[96,64,40],[118,82,50],[104,72,44],[150,128,98],[78,52,32],[70,46,28]],pattern:[0,0,1,1]}),Object.freeze({name:`whitewash and flags`,colors:[[196,190,172],[184,178,160],[120,112,98],[112,108,100],[92,88,82],[176,170,154],[96,72,48],[84,58,36]],pattern:[0,1,0,1]}),Object.freeze({name:`merchant's green`,colors:[[92,112,78],[104,124,88],[70,52,36],[126,92,58],[110,80,50],[160,142,110],[84,60,40],[64,40,26]],pattern:[1,0,1,0]}),Object.freeze({name:`red ochre`,colors:[[150,78,54],[138,70,48],[84,52,34],[104,70,44],[90,60,38],[140,112,84],[70,46,30],[58,36,22]],pattern:[0,2,1,1]}),Object.freeze({name:`blue paper`,colors:[[80,96,132],[104,120,158],[64,48,34],[132,98,64],[116,84,54],[172,160,136],[88,64,44],[72,48,30]],pattern:[1,0,1,0]}),Object.freeze({name:`stone hall`,colors:[[128,124,116],[112,108,100],[90,84,76],[96,92,86],[80,76,70],[110,98,84],[70,50,34],[80,56,34]],pattern:[2,1,0,1]}),Object.freeze({name:`bare timber`,colors:[[138,104,70],[124,92,60],[100,72,46],[110,78,48],[96,68,42],[120,90,60],[74,52,32],[66,44,26]],pattern:[3,0,0,1]}),Object.freeze({name:`yellow lime`,colors:[[200,176,112],[186,162,100],[108,78,50],[140,120,96],[70,60,50],[184,170,140],[92,66,42],[76,52,32]],pattern:[0,2,1,0]})]),ye=Object.freeze([`none`,`bed`,`table`,`shelf`,`hearth`,`painting`,`wardrobe`]),h=Object.freeze([[140,40,36],[52,82,120],[168,128,52],[74,104,62],[118,60,110],[196,170,110]]),be=.62,xe=.5,Se=Object.freeze([255,120,40]),Ce=625341585,we=1<<30,Te=1759714724,Ee=Math.round(be*2**24),De=Math.round(xe*2**16),g=Object.freeze([.18,.14,.82,.14]);function Oe(){let e=[];for(let t of m)for(let n of t.colors)e.push(n);return e}Object.freeze({plain:0,room:1,glass:2,cut:3});var _=Object.freeze({x0:-.5,x1:1.5,y0:-.25,y1:1.1}),ke=.9,Ae=.34,je=.14,Me=.55,Ne=.5,Pe=1.15,Fe=.45,v=.05,Ie=.85,y=e=>{let t=Number(e).toFixed(5).replace(/0+$/,``);return t.endsWith(`.`)?`${t}0`:t},b=e=>`vec3(${y(e[0]/255)}, ${y(e[1]/255)}, ${y(e[2]/255)})`,Le=`
float rwHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
highp uint rwMix(highp uint h, highp uint k) {
  k *= 0xcc9e2d51u; k = (k << 15u) | (k >> 17u); k *= 0x1b873593u;
  h ^= k; h = (h << 13u) | (h >> 19u);
  return h * 5u + 0xe6546b64u;
}
highp uint rwFinal(highp uint h) {
  h ^= h >> 16u; h *= 0x85ebca6bu; h ^= h >> 13u; h *= 0xc2b2ae35u; h ^= h >> 16u;
  return h;
}
highp uint rwSeedBits(vec3 n, vec3 wp, vec3 origin, vec2 uv) {
  highp ivec3 nq = ivec3(floor(n * 4.0 + 0.5)) + 8;
  highp int plane = int(floor(dot(n, wp - origin) * 40.0 + 0.5)) + ${we};
  highp ivec2 tile = ivec2(floor(uv)) + ${we};
  highp uint h = ${Ce>>>0}u;
  h = rwMix(h, uint(nq.x)); h = rwMix(h, uint(nq.y)); h = rwMix(h, uint(nq.z));
  h = rwMix(h, uint(plane)); h = rwMix(h, uint(tile.x)); h = rwMix(h, uint(tile.y));
  return rwFinal(h);
}
bool rwRoomLit(highp uint h) { return (h >> 8u) < ${Ee}u; }
highp uint rwCurtainBits(highp uint h) { return rwFinal(h ^ ${Te>>>0}u); }
bool rwCurtained(highp uint c) { return (c & 65535u) < ${De}u; }
`;function Re(e=`c`){let t=Oe(),n=m.map(e=>`vec4(${e.pattern.map(y).join(`, `)})`);return`
// RW1: THE REAL WINDOWS (render/realWindows.js) - the room behind an exterior window, an interior's glass cut to the
// view out, and a cutout picture's holes
uniform float uWinMode;    // 0 plain, 1 a room behind the glass, 2 an interior's glass, 3 an interior's glass cut
uniform float uCutout;     // the bound picture is a cutout: a texel under half alpha is a hole
uniform vec4 uGlassRect;   // the view out's rect in window pixels (x0, y0, x1, y1): glass is cut only inside it
uniform vec4 uRoomLamp;    // rgb a lit room's lamp; a the night (the window style's own warmth)
uniform vec3 uRoomDay;     // the light a room takes from the day outside
uniform mat4 uModel;       // the room's seed reads the model's own frame (a floating origin moves the world, not it)
uniform highp sampler2D uPaneDepth; // the view out's pass: the glass's own depth - nothing on the room's side of a pane draws
uniform float uPaneOn;              //   (on in that pass alone; FIELD BUGS 2026-10-12g PANE-CLIP)
vec3 rwDecode(vec3 c) { return ${e}; }   // the lane's colour decode of an sRGB constant
const vec3 RW_COL[${t.length}] = vec3[${t.length}](${t.map(b).join(`, `)});
const vec4 RW_PAT[${n.length}] = vec4[${n.length}](${n.join(`, `)});
const vec3 RW_FAB[${h.length}] = vec3[${h.length}](${h.map(b).join(`, `)});
const float RW_NSTYLES = ${y(m.length)};
const float RW_NPIECES = ${y(ye.length)};
const float RW_NFAB = ${y(h.length)};
${Le}
float rwBand(float x, float a, float b) { return step(a, x) * (1.0 - step(b, x)); }
float rwRect(vec2 p, vec4 r) { return rwBand(p.x, r.x, r.z) * rwBand(p.y, r.y, r.w); }
bool rwInRect(vec2 w) { return w.x >= uGlassRect.x && w.y >= uGlassRect.y && w.x < uGlassRect.z && w.y < uGlassRect.w; }
// a wall at p (metres along it, metres up it) of style s
vec3 rwWall(int s, vec2 p, float n) {
  vec4 pat = RW_PAT[s];
  int wp = int(pat.x + 0.5);
  vec3 c = RW_COL[s * 8];
  if (wp == 1) c = mod(floor(p.x / 0.2), 2.0) < 0.5 ? RW_COL[s * 8] : RW_COL[s * 8 + 1];
  else if (wp == 2) {
    float row = floor(p.y / 0.3);
    float bx = p.x / 0.6 + 0.5 * mod(row, 2.0);
    float mortar = max(step(fract(p.y / 0.3), 0.12), step(fract(bx), 0.06));
    c = mix(RW_COL[s * 8], RW_COL[s * 8 + 1], step(0.5, rwHash(vec3(floor(bx), row, 3.0)))) * (1.0 - 0.35 * mortar);
  } else if (wp == 3) c = RW_COL[s * 8] * (1.0 - 0.3 * step(fract(p.x / 0.2), 0.12));
  if (pat.z > 0.5 && p.y < 0.9) c = p.y > 0.82 ? min(RW_COL[s * 8 + 2] * 1.25, vec3(1.0)) : RW_COL[s * 8 + 2] * (1.0 - 0.25 * step(fract(p.x / 0.25), 0.12));
  if (p.y < 0.1) c = RW_COL[s * 8 + 7];
  return c * (0.9 + 0.1 * n);
}
// the piece against the back wall at p, its centre cx along the wall: rgb and how much of it covers the wall
vec4 rwPiece(int k, vec2 p, float cx, vec3 wood, vec3 fab, inout float glow) {
  float x = p.x - cx, y = p.y;
  if (k == 1) {   // a bed: its frame, its blanket, its headboard
    float bed = rwRect(vec2(x, y), vec4(-0.9, 0.0, 0.9, 0.55)) + rwRect(vec2(x, y), vec4(-0.9, 0.0, -0.75, 0.95));
    vec3 c = y > 0.38 && x > -0.75 ? fab : wood;
    return vec4(c, min(bed, 1.0));
  }
  if (k == 2) {   // a table and its two legs
    float top = rwRect(vec2(x, y), vec4(-0.6, 0.7, 0.6, 0.78));
    float legs = rwRect(vec2(abs(x), y), vec4(0.48, 0.0, 0.56, 0.7));
    return vec4(wood * (1.0 + 0.2 * top), min(top + legs, 1.0));
  }
  if (k == 3) {   // a shelf of things
    float frame = rwRect(vec2(x, y), vec4(-0.5, 0.2, 0.5, 1.9));
    float board = step(fract((y - 0.2) / 0.42), 0.12);
    float thing = rwHash(vec3(floor(x * 8.0), floor((y - 0.2) / 0.42), 7.0));
    vec3 c = board > 0.5 ? wood * 1.2 : (thing > 0.55 ? mix(fab, vec3(0.7, 0.62, 0.48), thing) : wood * 0.55);
    return vec4(c, frame);
  }
  if (k == 4) {   // a hearth: its stone, its dark mouth, and at night its fire
    float stone = rwRect(vec2(x, y), vec4(-0.7, 0.0, 0.7, 1.2));
    float mouth = rwRect(vec2(x, y), vec4(-0.42, 0.0, 0.42, 0.72));
    glow = mouth * (1.0 - smoothstep(0.0, 0.7, y)) * (0.6 + 0.4 * rwHash(vec3(floor(x * 12.0), floor(y * 12.0), 9.0)));
    return vec4(mouth > 0.5 ? vec3(0.06, 0.05, 0.04) : vec3(0.42, 0.40, 0.37) * (0.85 + 0.15 * step(0.5, fract(y / 0.2))), stone);
  }
  if (k == 5) {   // a painting in its frame
    float frame = rwRect(vec2(x, y), vec4(-0.42, 1.2, 0.42, 1.8));
    float canvas = rwRect(vec2(x, y), vec4(-0.34, 1.27, 0.34, 1.73));
    return vec4(canvas > 0.5 ? mix(fab, vec3(0.45, 0.55, 0.35), step(y, 1.45)) : vec3(0.55, 0.42, 0.18), frame);
  }
  if (k == 6) {   // a wardrobe
    float body = rwRect(vec2(x, y), vec4(-0.45, 0.0, 0.45, 1.9));
    return vec4(wood * (1.0 - 0.35 * step(abs(x), 0.02)), body);
  }
  return vec4(0.0);
}
// THE ROOM: the glass's own colour (base: the classic glass, its style on top), the mask's share at this texel, the
// screen derivatives taken at the top of main, and the sun's term on the glass (main's diff). Returns what it shows.
vec3 rwRoomOver(vec3 base, float glass, vec3 dp1, vec3 dp2, vec2 duv1, vec2 duv2, float sunDiff) {
  vec3 toFrag = vWorldPos - uCamPos;
  float dist = length(toFrag);
  float fade = 1.0 - smoothstep(${y(70)}, ${y(160)}, dist);
  if (glass <= 0.0 || fade <= 0.0) return base;
  vec3 V = toFrag / max(dist, 1e-4);
  vec3 cr = cross(dp1, dp2);
  float crl = length(cr);
  if (crl < 1e-12) return base;
  vec3 N = cr / crl;
  if (dot(N, V) > 0.0) N = -N;                     // the face toward the eye: the room is behind it
  float nv = -dot(N, V);
  if (nv < 0.02 || abs(N.y) > 0.5) return base;     // grazing, or glass in a roof: no room
  // the wall's texture frame (the cotangent frame): uv per metre, in the wall's plane
  float det = dot(N, cr);
  vec3 p1 = cross(N, dp1), p2 = cross(dp2, N);
  vec3 gu = (p2 * duv1.x + p1 * duv2.x) / det;
  vec3 gv = (p2 * duv1.y + p1 * duv2.y) / det;
  float lu = length(gu), lv = length(gv);
  if (lu < 1e-4 || lv < 1e-4) return base;
  float tileW = 1.0 / lu, tileH = 1.0 / lv;
  float up = gv.y >= 0.0 ? 1.0 : -1.0;              // does v run up the wall, or down it?
  float roomW = ${y(_.x1-_.x0)} * tileW, roomH = ${y(_.y1-_.y0)} * tileH;
  float depth = clamp(${y(ke)} * roomW, ${y(2)}, ${y(7)});
  vec2 f = fract(vUV);
  vec3 o = vec3(f.x, up > 0.0 ? f.y : 1.0 - f.y, 0.0);
  vec3 d = vec3(dot(gu, V), up * dot(gv, V), nv / depth);
  float tx = d.x > 0.0 ? (${y(_.x1)} - o.x) / d.x : (d.x < 0.0 ? (${y(_.x0)} - o.x) / d.x : 1e9);
  float ty = d.y > 0.0 ? (${y(_.y1)} - o.y) / d.y : (d.y < 0.0 ? (${y(_.y0)} - o.y) / d.y : 1e9);
  float tz = 1.0 / d.z;
  float t = min(tz, min(tx, ty));
  vec3 h = o + d * t;
  // the seeds: the glass's tile, its wall's plane in the model's own frame - a street's houses differ, a house keeps them
  vec3 vn = length(vNormal) > 1e-4 ? normalize(vNormal) : N;
  vec3 nq = floor(vn * 4.0 + 0.5);
  float plane = floor(dot(vn, vWorldPos - uModel[3].xyz) * 40.0 + 0.5);   // RW1 (AUDIT): rounded to the native a wall stands on - at half metres a wall at 0.25 m sat on the boundary and the floating origin flipped its seed
  vec2 tile = floor(vUV);
  float s0 = rwHash(vec3(tile.x + 17.0 * nq.x + 3.0 * nq.z, tile.y + 29.0 * nq.y, plane));
  float s1 = rwHash(vec3(plane * 0.731, tile.x * 1.7 + nq.z, tile.y + 5.0));
  highp uint sb = rwSeedBits(vn, vWorldPos, uModel[3].xyz, vUV);   // WAGONS2 (FINAL AUDIT): the seed the bloom's replay reads too; WL1: and the window light
  highp uint cb = rwCurtainBits(sb);
  int s = int(min(floor(s0 * RW_NSTYLES), RW_NSTYLES - 1.0));
  int piece = int(min(floor(s1 * RW_NPIECES), RW_NPIECES - 1.0));
  vec3 fab = RW_FAB[int(min(floor(fract(s1 * 7.0) * RW_NFAB), RW_NFAB - 1.0))];
  vec3 wood = RW_COL[s * 8 + 7];
  float glow = 0.0;
  float hz = h.z;
  vec3 albedo;
  const float TPM = ${y(12)};
  if (t == tz) {                                     // the back wall, and what stands against it
    vec2 p = (floor(vec2((h.x - ${y(_.x0)}) * tileW, (h.y - ${y(_.y0)}) * tileH) * TPM) + 0.5) / TPM;
    albedo = rwWall(s, p, rwHash(vec3(p * TPM, float(s))));
    vec4 pc = rwPiece(piece, p, (0.3 + 0.4 * fract(s0 * 9.0)) * roomW, wood, fab, glow);
    albedo = mix(albedo, pc.rgb, pc.a);
  } else if (t == tx) {                              // a side wall
    vec2 p = (floor(vec2(h.z * depth, (h.y - ${y(_.y0)}) * tileH) * TPM) + 0.5) / TPM;
    albedo = rwWall(s, p, rwHash(vec3(p * TPM, float(s) + 0.5))) * 0.85;
  } else if (d.y < 0.0) {                            // the floor, and a rug on some
    vec2 p = (floor(vec2((h.x - ${y(_.x0)}) * tileW, h.z * depth) * TPM) + 0.5) / TPM;
    int fp = int(RW_PAT[s].y + 0.5);
    float n = rwHash(vec3(p * TPM, float(s) + 1.5));
    if (fp == 1) {
      float m = max(step(fract(p.x / 0.5), 0.08), step(fract(p.y / 0.5), 0.08));
      albedo = mix(RW_COL[s * 8 + 3], RW_COL[s * 8 + 4], step(0.5, rwHash(vec3(floor(p / 0.5), 4.0)))) * (1.0 - 0.4 * m);
    } else if (fp == 2) albedo = mod(floor(p.x / 0.5) + floor(p.y / 0.5), 2.0) < 0.5 ? RW_COL[s * 8 + 3] : RW_COL[s * 8 + 4];
    else {
      float row = floor(p.y / 0.2);
      float seam = step(fract(p.y / 0.2), 0.1) + step(fract(p.x / 1.2 + 0.37 * row), 0.03);
      albedo = RW_COL[s * 8 + 3] * (1.0 - 0.3 * min(seam, 1.0));
    }
    albedo *= 0.9 + 0.1 * n;
    if ((sb & 1u) == 1u) albedo = mix(albedo, fab * 0.8, rwRect(p, vec4(roomW * 0.3, depth * 0.25, roomW * 0.7, depth * 0.7)));
  } else {                                           // the ceiling, and its beams
    vec2 p = (floor(vec2((h.x - ${y(_.x0)}) * tileW, h.z * depth) * TPM) + 0.5) / TPM;
    albedo = RW_COL[s * 8 + 5] * (0.9 + 0.1 * rwHash(vec3(p * TPM, float(s) + 2.5)));
    if (RW_PAT[s].w > 0.5 && fract(p.y / 0.9) < 0.2) albedo = RW_COL[s * 8 + 6];
  }
  // curtains, hung just behind the glass at the tile's sides
  bool curtained = rwCurtained(cb);
  float cl = ${y(g[0])} + ${y(g[1])} * float((cb >> 16u) & 255u) / 255.0, crr = ${y(g[2])} - ${y(g[3])} * float(cb >> 24u) / 255.0;
  bool onCurtain = false;
  if (curtained) {
    float tc = ${y(v)} / d.z;
    vec2 pc = o.xy + d.xy * tc;
    if (tc < t && (pc.x < cl || pc.x > crr) && pc.y > -0.1 && pc.y < 1.05) {
      albedo = fab * (0.72 + 0.28 * abs(sin(pc.x * 60.0)));
      hz = ${y(v)};
      glow = 0.0;
      onCurtain = true;
    }
  }
  float night = uRoomLamp.a;
  float lit = rwRoomLit(sb) ? night : 0.0;
  vec3 light = uRoomDay * (1.0 - ${y(Ne)} * hz) + uRoomLamp.rgb * (lit * (${y(Pe)} - ${y(Fe)} * hz));
  // WL1: THE SUN THROUGH THIS WINDOW, or the moon - followed back from what the ray met to the glass; where it crosses a
  // pane (the window's own mask) and no curtain, the face it lands on takes it at its angle and the glass's own share of
  // the sun outside (main's diff: the cloud and, on the lane, the shadow over the facade)
  bool day = uSunScale > 0.0;
  vec3 S = day ? uLightDir : uMoonDir;
  vec3 skyL = day ? uSunColor * (uSunScale * sunDiff / max(dot(vn, uLightDir), 1e-3)) : uMoonColor * uMoonScale;
  float sn = dot(N, S);
  if (!onCurtain && sn > 0.02 && dot(skyL, skyL) > 0.0) {
    float lg = hz * depth / sn;
    vec2 gp = h.xy + vec2(dot(gu, S), up * dot(gv, S)) * lg;
    float lc = (hz - ${y(v)}) * depth / sn;
    float xc = h.x + dot(gu, S) * lc;
    bool shut = curtained && lc > 0.0 && (xc < cl || xc > crr);
    if (!shut && gp.x > 0.0 && gp.x < 1.0 && gp.y > 0.0 && gp.y < 1.0) {
      float m = textureLod(uEmissionTex, tile + vec2(gp.x, up > 0.0 ? gp.y : 1.0 - gp.y), 0.0).r;
      float cosr = t == tz ? sn : t == tx ? (d.x > 0.0 ? -1.0 : 1.0) * dot(gu, S) / lu : (d.y < 0.0 ? 1.0 : -1.0) * up * dot(gv, S) / lv;
      light += skyL * (${y(Ie)} * m * max(cosr, 0.0));
    }
  }
  vec3 room = rwDecode(albedo) * light + rwDecode(${b(Se)}) * (glow * night);
  float F = pow(max(1.0 - nv, 0.0), 5.0);   // RW1 (AUDIT): head on, nv rounds past 1 - pow of a negative is undefined
  float r0 = mix(${y(Ae)}, ${y(je)}, night);
  float R = r0 + (1.0 - r0) * ${y(Me)} * F;
  return mix(base, mix(room, base, R), glass * fade);
}
`}var ze=`  vec3 rwDp1 = dFdx(vWorldPos), rwDp2 = dFdy(vWorldPos); vec2 rwDuv1 = dFdx(vUV), rwDuv2 = dFdy(vUV);   // RW1: the room's frame, in uniform control flow
  if (uPaneOn > 0.5 && gl_FragCoord.z <= texelFetch(uPaneDepth, ivec2(gl_FragCoord.xy), 0).r) discard;   // PANE-CLIP: the view out draws only what stands past the glass`,Be=`  if (uCutout > 0.5 && tex.a < 0.5) discard;   // RW1: a cutout picture's hole (every other picture keeps INCIDENT 2026-09-04's no-clip law)`,Ve=`  float rwGlass = texture(uEmissionTex, vUV).r;   // RW1: the glass mask
  if (uWinMode > 2.5 && rwGlass > 0.5 && rwInRect(gl_FragCoord.xy)) discard;   // RW1: an interior's glass, cut to the view out
  emission *= step(uWinMode, 1.5);   // RW1: an interior's glass wears no window style`,He=`  if (uWinMode > 0.5 && uWinMode < 1.5) lit = rwRoomOver(lit + emission, rwGlass, rwDp1, rwDp2, rwDuv1, rwDuv2, diff) - emission;   // RW1: the room behind the glass; WL1: and the sun through it`,x=.25,S=24/Math.log(256/x);Float64Array.from({length:24},(e,t)=>t<=0?0:x*Math.exp(t/S)*.999),Float64Array.from({length:24},(e,t)=>t>=23?1/0:x*Math.exp((t+1)/S)*1.001);var Ue=24,We=65536,Ge=48,Ke=131072;Object.freeze({lamp:0,sun:1,sunBare:2,row:3});var qe=.1,Je=.0093,Ye=2.5,Xe=3**10,Ze=Object.freeze([g[0]+g[1]/2,g[2]-g[3]/2]),C=e=>{let t=Number(e).toFixed(6).replace(/0+$/,``);return t.endsWith(`.`)?`${t}0`:t};function Qe({atten:e=`wlClassicAtten(rl, r)`,shadow:t=!1,clusters:n=!1}={}){return`
// WL1: WINDOW LIGHT (render/windowLight.js)
layout(std140) uniform WinLights { vec4 uWinL[896]; };
// LIGHT-REACH: the far rows, and the frame's word on the two tiers: the eye and the near cut, the lamp's colour and the far cut
layout(std140) uniform WinFar { vec4 uWinF[889]; vec4 uWinFrame[2]; };
const highp int WL_P3[10] = int[10](${Array.from({length:10},(e,t)=>3**t).join(`, `)});
uniform highp sampler2DArray uWinMask;   // the glass's masks, a layer a window picture
uniform int uWinOn;                      // 1: the frame carries window lights, in LC1's grid's band; 2: and a sun through glass the sun map holds
${n?`uniform highp usampler2D uClusterGrid;
uniform highp usampler2D uClusterList;
uniform vec4 uClusterRect;
uniform vec2 uClusterZ;
uniform vec4 uCamFwd;`:``}
float wlClassicAtten(float d, float r) { float a = clamp(1.0 - d / r, 0.0, 1.0); return a * a; }
// LIGHT-REACH: far row i's light at wp - each lit tile's lamp through that tile's own glass, for the tiles whose glass a
// ray from wp to their lamps can cross; each weighted by its distance from the eye, so it takes what the near tier's
// fade leaves and fades at the far cut. Its record: G0 reach | u* uv-u | v* uv-v | nf span-u | lamp0 span-v | PU code |
// (the coverage centre - G0) states - tile j's glass centre and lamp are tile 0's plus PU j.
vec3 winRow(int i, vec3 wp, vec3 n, float isFlat) {
  int o = i * 7;
  vec4 r0 = uWinF[o], r3 = uWinF[o + 3], r4 = uWinF[o + 4];
  vec3 rel = wp - r0.xyz, lr = r4.xyz - r0.xyz;
  float s = dot(rel, r3.xyz), sl = dot(lr, r3.xyz);
  if (s <= 0.0 || sl >= 0.0) return vec3(0.0);   // behind the wall
  float tt = s / (s - sl);   // where a ray to any of the row's lamps crosses the glass's plane
  vec4 r1 = uWinF[o + 1], r2 = uWinF[o + 2];
  vec3 w0 = rel * (1.0 - tt) + lr * tt;   // ... from tile 0's glass centre; tile j's is this less PU j (1 - tt)
  float pw = ${C(2*qe)} * tt, pa = pw * length(r1.xyz), pb = pw * length(r2.xyz);
  float b = dot(w0, r2.xyz);   // the same for every tile: the row runs along the glass's u
  if (abs(b) > 0.5 + pb) return vec3(0.0);
  float a0 = dot(w0, r1.xyz), stp = (1.0 - tt) / r3.w;   // tile j's a is a0 - j stp (u* . PU is 1 / span-u)
  vec4 r5 = uWinF[o + 5], r6 = uWinF[o + 6];
  highp int code = int(r6.w + 0.5);
  highp int cnt = code / ${Xe};
  int j0 = int(clamp(ceil((a0 - 0.5 - pa) / stp), 0.0, float(cnt))), j1 = int(clamp(floor((a0 + 0.5 + pa) / stp), -1.0, float(cnt - 1)));
  float lod = log2(max(max(pa * r3.w, pb * r4.w) * 128.0, 1.0)), layer = float(int(r5.w + 0.5) & 255), r = r0.w;
  vec3 acc = vec3(0.0);
  for (int j = j0; j <= j1; j++) {
    highp int st = (code / WL_P3[j]) % 3;
    if (st == 0) continue;   // a dark room
    float dq = length(r0.xyz + r6.xyz + r5.xyz * float(j) - uWinFrame[0].xyz);
    float wt = (1.0 - clamp((uWinFrame[0].w - dq) / (uWinFrame[0].w * ${C(.19999999999999996)}), 0.0, 1.0)) * clamp((uWinFrame[1].w - dq) / (uWinFrame[1].w * ${C(.19999999999999996)}), 0.0, 1.0);
    if (wt <= 0.0) continue;   // the near tier's, or past the far cut
    float u = r1.w + (a0 - float(j) * stp) * r3.w;
    if (st == 2 && (u < ${C(Ze[0])} - pa * r3.w || u > ${C(Ze[1])} + pa * r3.w)) continue;   // behind a curtain
    vec3 ray = r4.xyz + r5.xyz * float(j) - wp;
    float rl = length(ray);
    if (rl >= r) continue;
    float ndl = isFlat > 0.5 ? 1.0 : max(dot(n, ray), 0.0) / max(rl, 1e-4);
    if (ndl <= 0.0) continue;
    float m = textureLod(uWinMask, vec3(u, r2.w + b * r4.w, layer), lod).r;
    acc += uWinFrame[1].rgb * (m * ndl * (${e}) * wt);
  }
  return acc;
}
vec3 winLit(vec3 wp, vec3 n, float isFlat, float flatSun) {
  if (uWinOn == 0) return vec3(0.0);
  ivec2 tc = clamp(ivec2((gl_FragCoord.xy - uClusterRect.xy) * uClusterRect.zw), ivec2(0), ivec2(15, 8));
  int zc = clamp(int(log(max((dot(uCamFwd.xyz, wp) + uCamFwd.w) * uClusterZ.x, 1.0)) * uClusterZ.y), 0, 23);
  highp uvec2 cell = texelFetch(uClusterGrid, ivec2(tc.x + tc.y * 16, zc + ${Ue}), 0).rg;
  int cnt = int(cell.y);
  vec3 acc = vec3(0.0);
  for (int j = 0; j < 128; j++) {
    if (j >= cnt) break;
    highp int at = ${We} + int(cell.x) + j;
    int i = int(texelFetch(uClusterList, ivec2(at & 255, at >> ${Math.log2(256)}), 0).r) * 7;
    vec4 c0 = uWinL[i];
    vec3 rel = wp - c0.xyz;
    float d2 = dot(rel, rel);
    if (d2 >= c0.w * c0.w) continue;
    vec4 c3 = uWinL[i + 3];
    float s = dot(rel, c3.xyz);
    if (s <= 0.0) continue;   // behind the glass: the wall it stands in keeps its light
    float d = sqrt(d2);
    if (d2 < ${C(36)}) {   // the glass's glow, a small lit area
      vec4 c6 = uWinL[i + 6];
      float x2 = d2 / ${C(36)}, win = (1.0 - x2 * x2) * (1.0 - x2 * x2);
      float cr = isFlat > 0.5 ? 1.0 : max(-dot(n, rel), 0.0) / max(d, 1e-4);
      acc += c6.rgb * (c6.w * (s / max(d, 1e-4)) * cr / (3.14159265 * d2 + c6.w) * win);
    }
    vec4 c4 = uWinL[i + 4], c5 = uWinL[i + 5];
    int code = int(c5.w + 0.5), kind = code >> 8;
    vec3 ray; float tt;
    if (kind == 0) { ray = c4.xyz - wp; tt = s / (s - dot(c4.xyz - c0.xyz, c3.xyz)); }   // toward the lamp, to the glass's plane
    else { ray = c4.xyz; float dn = dot(ray, c3.xyz); if (dn > -1e-3) continue; tt = -s / dn; }   // toward the sun
    vec3 w = wp + ray * tt - c0.xyz;
    vec4 c1 = uWinL[i + 1], c2 = uWinL[i + 2];
    float a = dot(w, c1.xyz), b = dot(w, c2.xyz);
    float pw = kind == 0 ? ${C(2*qe)} * tt : ${C(Je)} * tt;   // the source's footprint on the glass's plane, metres
    float pa = pw * length(c1.xyz), pb = pw * length(c2.xyz);   // ... in the aperture's own units
    if (abs(a) > 0.5 + pa || abs(b) > 0.5 + pb) continue;   // the ray crosses the wall, not the window or its soft edge
    if (kind == 2 && wp.y < c0.y - 0.5 / max(length(c2.xyz), 1e-4) - ${C(Ye)}) continue;   // no sun map: a storey down is under a floor
    float rl = length(ray);
    float ndl = isFlat > 0.5 ? 1.0 : max(dot(n, ray), 0.0) / max(rl, 1e-4);
    if (ndl <= 0.0) continue;
    float lod = log2(max(max(pa * c3.w, pb * c4.w) * 128.0, 1.0));
    float m = textureLod(uWinMask, vec3(c1.w + a * c3.w, c2.w + b * c4.w, float(code & 255)), lod).r;
    if (m <= 0.0) continue;
    float r = c0.w;
    float g = kind == 0 ? ${e} : ${t===`flat`?`(kind == 1 ? flatSun : 1.0)`:t?`(kind == 1 ? (isFlat > 0.5 ? flatSun : sunShadowAt(wp, n)) : 1.0)`:`1.0`};
    acc += c5.rgb * (m * ndl * g);
  }
  // LIGHT-REACH: the far rows, in their own band of the grid
  highp uvec2 fcell = texelFetch(uClusterGrid, ivec2(tc.x + tc.y * 16, zc + ${Ge}), 0).rg;
  int fcnt = int(fcell.y);
  for (int j = 0; j < 127; j++) {
    if (j >= fcnt) break;
    highp int at = ${Ke} + int(fcell.x) + j;
    acc += winRow(int(texelFetch(uClusterList, ivec2(at & 255, at >> ${Math.log2(256)}), 0).r), wp, n, isFlat);
  }
  return acc;
}
`}var $e=`uniform float uMeshAlpha;   // POI-2: 0 the opaque world (alpha 1, INCIDENT 2026-09-04's law); above 0 a translucent draw (render/meshAlpha.js)
float meshAlphaOf(float a) { return uMeshAlpha > 0.0 ? a * uMeshAlpha : 1.0; }`;Object.freeze([`repeat`,`clamp`,`mirror`]),Object.freeze([`nearest`,`linear`]),Object.freeze([0,0,0]);var w=.5,et=.6,tt=.15,nt=.15,T=.25,rt=.7,it=.05,at=.02,E=e=>Number.isInteger(e)?`${e}.0`:String(e),D=.6,ot=.3,O=Object.freeze([-12,4]),k=Object.freeze([-2,2]),A=65535,j=Object.freeze((()=>{let e=[];for(let t=0;t<10;t++){let n=+(.3+.18*t).toFixed(2),r=+(.012*(t+1)*(t%2?-1:1)).toFixed(3);e.push([r,n],[-r,-n])}for(let t=0;t<4;t++){let n=.25*(t+1),r=+((.4+.05*t)*(t%2?1:-1)).toFixed(2);e.push([n,r],[-n,-r])}return e.map(e=>Object.freeze(e))})());Object.freeze([[-1,-1],[1,-1],[-1,1],[1,1]].map(e=>Object.freeze(e)));var M=`
uniform highp sampler2D uDepth;   // AUDIT-VC7 (G2): a fragment shader's samplers are lowp unless told - a depth read at lowp is not a depth
uniform vec4 uProjInfo;   // proj[0], proj[5], proj[10], proj[14]
uniform vec4 uRect;       // the world rect in canvas pixels
uniform vec2 uCanvas;
float viewDist(float d01) {
  float z = d01 * 2.0 - 1.0;
  return uProjInfo.w / (z + uProjInfo.z);   // -viewZ: positive, along the eye's -z
}
float depthAt(vec2 wuv) {   // AUDIT-VC7 (G3): level 0 by name - a depth image has no others, and a loop's branch has no derivatives to choose one by
  return textureLod(uDepth, (uRect.xy + wuv * uRect.zw) / uCanvas, 0.0).r;
}
`,st=`
uniform highp sampler2D uPrevDepth;   // AUDIT-VC7 (G2): a depth, at a depth's precision
uniform mat4 uPrevVP;
uniform vec4 uPrevProjInfo;   // the previous frame's projection terms (viewDist)
uniform vec4 uContactParams;  // x length, y thickness, z floor, w 1 = on
// DISC7: the previous frame's WORLD RECT in the canvas, normalised (x, y, w, h). uPrevVP's clip space covers the
// world viewport, and the depth it was written under is the whole canvas - a docked large HUD takes the bottom of it.
// Every other screen pass maps through its rect (DEPTH_GLSL's depthAt); this block read the canvas as if the rect
// were all of it, so under the docked bar every sample came from the wrong row and near the bottom from the bar's
// cleared strip. The bounds tests stay in the rect's own [0,1].
uniform vec4 uPrevRect;
vec2 prevDepthUV(vec2 wuv) { return uPrevRect.xy + wuv * uPrevRect.zw; }
float contactShadow(vec3 wp, vec3 n, vec3 toLight, float dist) {
  if (uContactParams.w <= 0.0) return 1.0;
  float len = min(dist, uContactParams.x);
  vec3 start = wp + n * ${E(at)};
  // F3: THE SURFACE MUST HAVE BEEN THERE. The march reads LAST frame's depth,
  // and a wall just revealed round a corner was not in it: its pixels
  // reproject onto the corner's near face, every sample lands "behind" it,
  // and the whole wall wore a shadow that swam with the turn. So the point
  // itself is reprojected first, and only a point the previous frame saw
  // where it stands is marched.
  vec4 c0 = uPrevVP * vec4(start, 1.0);
  if (c0.w <= 0.0) return 1.0;
  vec2 uv0 = c0.xy / c0.w * 0.5 + 0.5;
  if (uv0.x < 0.0 || uv0.x > 1.0 || uv0.y < 0.0 || uv0.y > 1.0) return 1.0;
  float z0 = texture(uPrevDepth, prevDepthUV(uv0)).r * 2.0 - 1.0;
  // LA-POST6: "where it stands" is the surface's own tolerance, not the occluder thickness (0.8 let a wall revealed
  // within 80 cm behind a pillar through, into the pillar's shadow): AIR_CONTACT_SELF, plus the depth one texel of the
  // previous image spans on this surface - its view distance times the texel's tangent (the rect's rows through the
  // projection's focal term) times the tangent of its slope to the eye, capped at AIR_CONTACT_SLOPE_MAX; LA-AUDIT B1: and
  // the lift the start stands off the surface, seen along the ray
  float ct = max(abs(dot(n, normalize(uCamPos - wp))), ${E(1/16)});
  float texelTan = 2.0 / (abs(uPrevProjInfo.y) * uPrevRect.w * float(textureSize(uPrevDepth, 0).y));
  float tol = ${E(it)} + ${E(at)} / ct + c0.w * texelTan * sqrt(1.0 - ct * ct) / ct;
  if (abs(c0.w - uPrevProjInfo.w / (z0 + uPrevProjInfo.z)) > tol) return 1.0;
  // LA-POST6: the steps are start + toLight * (len * i / steps) and a projection is linear in its point, so step i's
  // clip position is c0 + i * dc - one product for the march where there was one a step
  vec4 dc = uPrevVP * vec4(toLight * (len / ${E(4)}), 0.0);
  float occ = 0.0;
  for (int i = 1; i <= 4; i++) {
    vec4 c = c0 + dc * float(i);
    if (c.w <= 0.0) break;
    vec2 uv = c.xy / c.w * 0.5 + 0.5;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) break;
    float z = texture(uPrevDepth, prevDepthUV(uv)).r * 2.0 - 1.0;
    float sceneDist = uPrevProjInfo.w / (z + uPrevProjInfo.z);
    float behind = c.w - sceneDist;   // c.w is the point's view distance under that projection
    // LA-POST6: A CLAIM, NOT A VERDICT. Each step was all or nothing off one NEAREST texel - the floor at 0.02 behind,
    // nothing at 0.019 or past the thickness - so a contact shadow's edge flipped whole as the texels under the steps
    // changed. A step claims a share now: rising over AIR_CONTACT_RAMP past the 0.02, easing out over the thickness's
    // last quarter; the strongest claim darkens toward the floor
    occ = max(occ, smoothstep(0.02, ${E(.1)}, behind) * (1.0 - smoothstep(uContactParams.y * 0.75, uContactParams.y, behind)));
  }
  return mix(1.0, uContactParams.z, occ);
}
`,N=`
float airAdaptLog2(vec4 t) {
  return (floor(t.r * 255.0 + 0.5) * 256.0 + floor(t.g * 255.0 + 0.5)) / ${E(A)} * ${E(k[1]-k[0])} + (${E(k[0])});
}
`,ct=`
uniform highp sampler2D uAdapt;   // LA-AUDIT B5: sixteen bits, at a precision that holds them
${N}
float elAdapt() {
  return exp2(airAdaptLog2(texture(uAdapt, vec2(0.5))));
}
`,P=`
vec3 airDecode(vec3 c) {
  vec3 lo = c / 12.92;
  vec3 hi = pow((c + 0.055) / 1.055, vec3(2.4));
  return mix(hi, lo, step(c, vec3(0.04045)));
}
vec3 airEncode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
  return mix(hi, lo, step(c, vec3(0.0031308)));
}
`;`${P}${N}${E(O[0])}${E(O[1])}${O[0]}${O[1]-O[0]}`,`${N}${Math.log2(32)}${O[1]-O[0]}${O[0]}${k[0]}${k[1]-k[0]}${E(A)}`,`${M}${u}${et}${(Math.PI/2).toFixed(7)}${w}`,`${M}${E(tt)}${w}`,`${M}${u}${l}${E(D)}${E(D)}${E(D)}${E(ot)}`;var lt=`
uniform vec2 uBloomSize;
bool occluded() {
  vec2 wuv = gl_FragCoord.xy / uBloomSize;
  return viewDist(gl_FragCoord.z) > viewDist(depthAt(wuv)) + ${E(nt)};
}
`;`${P}${M}${lt}${Le}`,`${P}${M}${lt}`,`${M}${j.length}${j.length}${j.map(([e,t])=>`vec2(${E(e)}, ${E(t)})`).join(`, `)}${E(T)}${E(2*T)}${E(T/2)}${E(T)}${j.length}${E(j.length)}`;var ut=2048,dt=Object.freeze([12,48,240]),F=2.5,ft=.1;Object.freeze(new Set([216]));var pt=5e-5,I=.04;typeof window<`u`&&(window.__DF_SHADOW_TUNING={steady:!0,override:null,debug:!1,debugForce:null,selfLamps:null,calmForce:null,facePrepass:!0,sunPrepass:!0,volumeMemo:!0,moverDirect:!0,loUnread:!0}),Object.freeze([0,0,0]),dt.map(t=>e(t,t,0,1200));var mt=Object.freeze([[[1,0,0],[0,-1,0]],[[-1,0,0],[0,-1,0]],[[0,1,0],[0,0,1]],[[0,-1,0],[0,0,-1]],[[0,0,1],[0,-1,0]],[[0,0,-1],[0,-1,0]]]);function ht(e){let[t,n]=mt[e],r=[-t[0],-t[1],-t[2]],i=[n[1]*r[2]-n[2]*r[1],n[2]*r[0]-n[0]*r[2],n[0]*r[1]-n[1]*r[0]];return{x:i,y:[r[1]*i[2]-r[2]*i[1],r[2]*i[0]-r[0]*i[2],r[0]*i[1]-r[1]*i[0]]}}function gt(){let e=e=>`vec3(${e.map(e=>e.toFixed(1)).join(`, `)})`,t=[],n=[];for(let r=0;r<6;r++){let i=ht(r);t.push(e(i.x)),n.push(e(i.y))}return`const vec3 FACE_X[6] = vec3[6](${t.join(`, `)});\nconst vec3 FACE_Y[6] = vec3[6](${n.join(`, `)});`}var _t=`
precision highp sampler2DArrayShadow;
uniform sampler2DArrayShadow uSunShadow;
uniform mat4 uSunVP[3];
uniform vec4 uSunOrigin;          // TV1: xyz the point the cascades were rendered about, w 1 = set (0: uCamPos, the old law)
uniform vec4 uSunShadowParams;    // x y z the three cascades' radii, w 1 = on (EL7: three)
uniform vec4 uSunTexel;           // x y z the cascades' texel size (world)
uniform sampler2DArrayShadow uPointShadow;   // EL5: six face layers per caster
uniform vec4 uPointShadowParams[12];  // xyz the light, w its far plane (0 = off)
uniform int uShadowIndex[12];         // the lantern each caster's layers belong to, -1 for none
uniform int uCasterOf[48];              // EL8: light i's caster slot, -1 for none - one lookup (DISC15: SHADOW_POINT_CASTERS + j for lo slot j)
uniform sampler2DArrayShadow uPointShadowLo;                 // DISC15: the lo tier - six layers per slot, the room's static casters
${gt()}
// EL5: the cube's face of direction d by its major axis (m, the distance along it), and d's uv on that face by the
// face's basis (pointFaceMatrices' own lookAt axes). AUDIT 68 S17-shadowpass-layer-dup: the four readers' one pick.
vec2 cubeFaceUv(vec3 d, out int face, out float m) {
  vec3 a = abs(d);
  if (a.x >= a.y && a.x >= a.z) { face = d.x > 0.0 ? 0 : 1; m = a.x; }
  else if (a.y >= a.z) { face = d.y > 0.0 ? 2 : 3; m = a.y; }
  else { face = d.z > 0.0 ? 4 : 5; m = a.z; }
  return vec2(dot(FACE_X[face], d), dot(FACE_Y[face], d)) / max(m, 1e-4) * 0.5 + 0.5;
}
// LA-SHADOW2: cascade c's lookup at wp - the whole of what sunShadowTap did for the one cascade it picked
float sunCascadeTap(int c, vec3 wp, vec3 n, bool soft, float h) {
  float texel = c == 0 ? uSunTexel.x : c == 1 ? uSunTexel.y : uSunTexel.z;
  mat4 vp = c == 0 ? uSunVP[0] : c == 1 ? uSunVP[1] : uSunVP[2];
  vec4 lp = vp * vec4(wp + n * texel * 1.5, 1.0);
  vec3 p = lp.xyz / lp.w * 0.5 + 0.5;
  if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0 || p.z > 1.0) return 1.0;
  float ref = p.z - ${pt};   // AUDIT-EL F15: ~0.06 world units over the 1200-unit box (0.0004 was half a unit - feet floated off their shadows)
  // AUDIT FLICKER S1: A FLAT'S OWN CARD. The sun replay draws each flat as an upright card through the very base it
  // reads at (EL2), and the sun is not level: the card above the read point stands nearer the light by tan(elevation)
  // a unit up, and the kernel reaches ${F} texels up it - past the constant bias once that reach
  // times tan(e) passes it, by a share the sun's turn slides texel by texel (a tree stepped a third of its sun in one
  // frame, and chattered on the far cascade's redraws). A flat's read is lowered by what its own card could hold over
  // it: the kernel's reach up the card (tan(e) a texel), never more than the card above the point holds (h, the
  // flat's height: sin(e) a unit up it).
  if (soft && h > 0.0) {
    vec3 zr = vec3(vp[0][2], vp[1][2], vp[2][2]);
    float zl = length(zr);
    vec3 toSun = -zr / max(zl, 1e-6);
    float sinE = max(toSun.y, 0.0);
    ref -= min(${F} * texel * sinE / max(length(toSun.xz), 1e-3), max(h - 0.5, 0.0) * sinE) * 0.5 * zl;
  }
  float texelUv = 1.0 / ${ut}.0;   // AUDIT-EL F17: not 'step' - a built-in's name
  // PERF-SUN: the far cascade takes ONE tap, which the sampler already
  // makes a hardware 2x2 (COMPARE_REF_TO_TEXTURE + LINEAR). Its texel is
  // 23 cm - about two pixels at a hundred metres - so the eight extra
  // samples soften nothing the eye can resolve, over most of an outdoor
  // screen. The near cascades keep the kernel: that is EL7's contact
  // hairline, at a texel of 1.2 cm.
  //
  // TREES1 (2026-09-19, Mac: "there's this weird darkening effect
  // happening to trees"): UNLESS THE CALLER IS A FLAT. The trade above
  // is an ANTIALIASING one, and it only holds for a surface that shades
  // PER FRAGMENT - the terrain and the meshes, where neighbouring pixels
  // smooth a coarse filter whatever this returns. A flat is not like
  // that. It reads ONE value at its base and wears it over the whole
  // sprite (EL2: a sprite sampled at its own fragment would shadow
  // itself), so the kernel is not softening an edge there - it is the
  // only gradation the tree has. With one tap a tree whose foot sits
  // near a shadow edge flips between fully lit and fully dark, and jumps
  // again at the cascade boundary as you walk toward it. Flats keep the
  // kernel at every distance, and they are a thin slice of the frame's
  // fragments beside the ground, so nearly all of the saving stands.
  if (!soft && c >= 2) return texture(uSunShadow, vec4(p.xy, float(c), ref));
  // PERF-EXT5 (2026-09-25, the players' "fps issues in the exterior but
  // fine in the interior" and "me too my friend.. don't know why. I got a
  // RX6600"): THE 3x3 KERNEL IN FOUR TAPS, THE SAME WEIGHTS. It was nine
  // hardware 2x2s one texel apart. Per axis they weigh the four texels
  // under them [1-f, 1, 1, f] (f the sample's fraction past a texel
  // centre), and two bilinear taps give exactly that: one over the first
  // pair at weight 2-f, set 1/(2-f) of the way into it, and one over the
  // last pair at weight 1+f, set f/(1+f) in. The kernel is separable, so
  // four taps are the nine - the same texels, the same weights, equal in
  // exact arithmetic. What moves: the hardware quantises each tap's
  // sub-texel fraction (8 bits on the players' D3D11-class cards), and the
  // four taps quantise other fractions than the nine did - under a 255th
  // of the sun's light, in a penumbra only (0.93 of one at worst over the
  // provers' random maps; test/render/perfexta.test.js's twin holds it under
  // one), 2 of 518,400 pixels by one step on SwiftShader.
  // Five fetches a fragment gone: every flat by day, and every lit
  // fragment of the near cascades.
  vec2 st = p.xy * ${ut}.0 - 0.5;
  vec2 b = floor(st), f = st - b;
  vec2 wA = 2.0 - f, wB = 1.0 + f;
  vec2 tA = (b - 0.5 + 1.0 / wA) * texelUv, tB = (b + 1.5 + f / wB) * texelUv;
  float lc = float(c);
  float lit = wA.x * wA.y * texture(uSunShadow, vec4(tA.x, tA.y, lc, ref)) + wB.x * wA.y * texture(uSunShadow, vec4(tB.x, tA.y, lc, ref))
    + wA.x * wB.y * texture(uSunShadow, vec4(tA.x, tB.y, lc, ref)) + wB.x * wB.y * texture(uSunShadow, vec4(tB.x, tB.y, lc, ref));
  return lit / 9.0;
}
// LA-SHADOW2 (2026-09-27, Mac: "a deep audit on the enhanced lighting system, look for flickering issues"): THE
// CASCADES HAND OVER IN A BAND, AND THE LAST ONE FADES OUT. The pick was a hard line at nine tenths of each radius:
// a shadow crossing it changed its texel four- or fivefold, its normal offset with it (the edge stepped sideways by
// centimetres) and, at the far line, its kernel - a ring about the player that popped every shadow it swept over as
// they walked, and a tree's whole sprite with it (a flat reads one value at its foot). Past the far box the shadows
// stopped at its square edge, a line that turned with the sun. Now the last SUN_CASCADE_BAND of each cascade's reach
// mixes in the next one, which covers it whole, and the far cascade's last stretch fades to lit by distance - a
// circle, not the box's turning square. Two lookups only in the band.
float sunShadowTap(vec3 wp, vec3 n, bool soft, float h) {
  if (uSunShadowParams.w <= 0.0) return 1.0;
  float d = length(wp - (uSunOrigin.w > 0.5 ? uSunOrigin.xyz : uCamPos));   // TV1: picked about the point the cascades stand on - the travel view's traveller, else the eye
  int c = d < uSunShadowParams.x * 0.9 ? 0 : d < uSunShadowParams.y * 0.9 ? 1 : 2;
  float r = c == 0 ? uSunShadowParams.x : c == 1 ? uSunShadowParams.y : uSunShadowParams.z;
  float t = smoothstep(r * ${.7.toFixed(2)}, r * 0.9, d);   // 0 short of the band, 1 at the handover
  if (c == 2) return t >= 1.0 ? 1.0 : mix(sunCascadeTap(2, wp, n, soft, h), 1.0, t);
  float lit = sunCascadeTap(c, wp, n, soft, h);
  return t > 0.0 ? mix(lit, sunCascadeTap(c + 1, wp, n, soft, h), t) : lit;
}
/** A surface that shades per fragment: the cheap tap past SHADOW_PCF_CASCADES. */
float sunShadowAt(vec3 wp, vec3 n) { return sunShadowTap(wp, n, false, 0.0); }
/** A FLAT, which reads once for a whole sprite: the kernel at every distance (TREES1). AUDIT FLICKER S1: h its
 *  height, whose own card the read is kept off. */
float sunShadowSoftAt(vec3 wp, vec3 n, float h) { return sunShadowTap(wp, n, true, h); }
// the face's depth of a point whose major-axis distance is m (cubeDepthRef in shadowPass.js)
float cubeDepthOfM(float m, float far) {
  float near = ${ft};
  m = max(m, near);
  float ndc = (far + near) / (far - near) - (2.0 * far * near) / ((far - near) * m);
  return ndc * 0.5 + 0.5;
}
// EL5: caster k's shadow at wp - the cube's face by the major axis, the face's
// uv by its basis (pointFaceMatrices' own lookAt axes), the layer k * 6 + face
float pointShadowAt(int k, vec3 wp, vec3 n) {
  vec4 P = uPointShadowParams[k];
  float far = P.w;
  if (far <= 0.0) return 1.0;
  vec3 d = (wp + n * 0.05) - P.xyz;
  int face; float m;
  vec2 uv = cubeFaceUv(d, face, m);
  float layer = float(k * 6 + face);
  // AUDIT-EL F15: THE BIAS IS IN WORLD UNITS - the depth is hyperbolic, and a
  // constant 0.002 off it was half a unit at five units and four at fifteen:
  // an occluder within four units of a wall cast nothing near a lantern's range
  float ref = cubeDepthOfM(m - ${I}, far);
  float t = 1.5 / 512.0;
  float lit = texture(uPointShadow, vec4(uv, layer, ref));
  lit += texture(uPointShadow, vec4(uv + vec2(t, 0.0), layer, ref)) + texture(uPointShadow, vec4(uv - vec2(t, 0.0), layer, ref))
       + texture(uPointShadow, vec4(uv + vec2(0.0, t), layer, ref)) + texture(uPointShadow, vec4(uv - vec2(0.0, t), layer, ref));
  return lit / 5.0;
}
// VOL1: caster k's shadow at a point IN THE AIR - one tap, no normal (a march has no surface to bias against, and
// the blur after it smooths what the kernel would); the face and its uv exactly as pointShadowAt finds them
float pointShadowOne(int k, vec3 wp) {
  vec4 P = uPointShadowParams[k];
  float far = P.w;
  if (far <= 0.0) return 1.0;
  vec3 d = wp - P.xyz;
  int face; float m;
  vec2 uv = cubeFaceUv(d, face, m);
  return texture(uPointShadow, vec4(uv, float(k * 6 + face), cubeDepthOfM(m - ${I}, far)));
}
// DISC15: light L's shadow from its lo map j, drawn to far (LA-SHADOW4: the caster table's word carries it) -
// pointShadowAt's face and uv on the lo array, the normal offset and the bias held to a texel of it (a 256 face's
// texel is twice a 512's)
float pointShadowLoAt(int j, float far, vec4 L, vec3 wp, vec3 n) {
  vec3 d0 = wp - L.xyz;
  float texel = 2.0 * max(max(abs(d0.x), abs(d0.y)), abs(d0.z)) / 256.0;
  vec3 d = d0 + n * max(0.05, 1.5 * texel);
  int face; float m;
  vec2 uv = cubeFaceUv(d, face, m);
  float layer = float(j * 6 + face);
  float ref = cubeDepthOfM(m - max(${I}, texel), far);
  float t = 1.5 / 256.0;
  float lit = texture(uPointShadowLo, vec4(uv, layer, ref));
  lit += texture(uPointShadowLo, vec4(uv + vec2(t, 0.0), layer, ref)) + texture(uPointShadowLo, vec4(uv - vec2(t, 0.0), layer, ref))
       + texture(uPointShadowLo, vec4(uv + vec2(0.0, t), layer, ref)) + texture(uPointShadowLo, vec4(uv - vec2(0.0, t), layer, ref));
  return lit / 5.0;
}
// DISC15: the same IN THE AIR - one tap, no normal (pointShadowOne's shape)
float pointShadowLoOne(int j, float far, vec4 L, vec3 wp) {
  vec3 d = wp - L.xyz;
  int face; float m;
  vec2 uv = cubeFaceUv(d, face, m);
  float texel = 2.0 * m / 256.0;
  return texture(uPointShadowLo, vec4(uv, float(j * 6 + face), cubeDepthOfM(m - max(${I}, texel), far)));
}
// DISC15: caster k of the light at L (uCasterOf's word): a 512 slot below SHADOW_POINT_CASTERS, a lo slot past it;
// LA-SHADOW4: the slot is the word's low byte, and a lo map's far the quanta above it (casterWord)
float casterShadowAt(int k, vec4 L, vec3 wp, vec3 n) {
  int s = k & 255;
  return s < 12 ? pointShadowAt(s, wp, n) : pointShadowLoAt(s - 12, float(k >> 8) * 4.0, L, wp, n);
}
float casterShadowOne(int k, vec4 L, vec3 wp) {
  int s = k & 255;
  return s < 12 ? pointShadowOne(s, wp) : pointShadowLoOne(s - 12, float(k >> 8) * 4.0, L, wp);
}
// EL5: light i's shadow - its caster's, if it has one this frame (EL8: by the table, one lookup; DISC15: either tier)
float shadowOfLight(int i, vec4 L, vec3 wp, vec3 n) {
  int k = uCasterOf[i];
  return k >= 0 ? casterShadowAt(k, L, wp, n) : 1.0;
}
`,vt=.12;Object.freeze([1,.42,.1]),Object.freeze([.62,.4,1]);var yt=e=>!!e&&e[0]>.5,bt=`
// uDissolve (x the share gone, 0 whole and 1 gone; yzw the edge's colour) is declared by each program that composes
// this block, beside its other per-batch uniforms (AUDIT 47: a unit declares what it uses, where the sweep reads it)
float dissolveGrain(vec2 uv) {
  vec2 cell = floor(uv * vec2(textureSize(uTex, 0)) * 0.5);   // two-texel grains: the art's own pixels
  float h = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
  return h * 0.72 + uv.y * 0.28;   // v = 0 is the feet: they go first
}
float dissolveCutAt(float x) { return x * 1.1 - 0.05; }
bool dissolveGone(vec2 uv) { return uDissolve.x > 0.0 && dissolveGrain(uv) < dissolveCutAt(uDissolve.x); }
float dissolveEdge(vec2 uv) {
  if (uDissolve.x <= 0.0) return 0.0;
  float k = 1.0 - smoothstep(0.0, 0.09, dissolveGrain(uv) - dissolveCutAt(uDissolve.x));
  return k * min(1.0, uDissolve.x * 8.0);
}
vec3 dissolveLit(vec3 lit, vec2 uv, vec3 edge) {   // edge: uDissolve.yzw in the program's own light (the lane's decoded)
  float k = dissolveEdge(uv);
  return k > 0.0 ? mix(lit, edge * 1.6, k) : lit;
}`,xt=.3,St=Object.freeze({own:.35,heart:.75}),Ct=`
// uCrack (x the share worked, 0 whole and 1 a blow from breaking; y the pattern's seed) is declared by each program that
// composes this block, beside its other per-batch uniforms (AUDIT 47: a unit declares what it uses, where the sweep reads it)
float crackHash(vec2 c) { return fract(sin(dot(c, vec2(127.1, 311.7)) + uCrack.y * 61.7) * 43758.5453); }
vec2 crackSite(vec2 c) { return c + 0.2 + 0.6 * vec2(crackHash(c), crackHash(c + vec2(31.7, 11.3))); }
float veinCrackShade(vec2 uv) {
  if (uCrack.x <= 0.0) return 1.0;
  vec2 size = vec2(textureSize(uTex, 0));
  vec2 texel = floor(uv * size) + 0.5;   // the art's own pixels: a seam is a texel wide, never a smooth line
  vec2 p = texel / ${7 .toFixed(1)};
  vec2 cell = floor(p);
  float d1 = 1e9, d2 = 1e9;
  vec2 c1 = cell, c2 = cell;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 c = cell + vec2(float(i), float(j));
      float d = length(p - crackSite(c));
      if (d < d1) { d2 = d1; c2 = c1; d1 = d; c1 = c; } else if (d < d2) { d2 = d; c2 = c; }
    }
  }
  if ((d2 - d1) * ${7 .toFixed(1)} > 1.0) return 1.0;   // not on a seam
  // the seam's turn to open: its own (the same from either side - the pair's sum and product), and how far it lies from
  // the face's heart; the share worked opens every seam whose turn has come
  float own = crackHash(c1 + c2 + c1 * c2 * 0.013);
  float heart = length(texel / size - 0.5) * 1.6;
  return uCrack.x >= own * ${St.own.toFixed(2)} + heart * ${St.heart.toFixed(2)} ? ${xt.toFixed(2)} : 1.0;
}`,wt=`
vec3 hitFlashLit(vec3 lit, vec3 albedo, float k) {
  if (k <= 0.0) return lit;
  const vec3 LUM = vec3(0.299, 0.587, 0.114);
  float l = dot(albedo, LUM);
  // as bright as the sprite already is in strong light, never darker than a glow in the dark (a dungeon's foe)
  vec3 red = vec3(1.0, 0.09, 0.06) * max(dot(lit, LUM) * 1.5, 0.45 + 0.8 * l);
  return mix(lit, red, clamp(k, 0.0, 1.0));
}`,Tt=`
const vec3 ELITE_GOLD = vec3(1.0, 0.68, 0.16);
const vec3 ELITE_RIM = vec3(0.35, 0.75, 1.0);   // the outline: a bright blue
// EXACT TEXELS (Mac's screenshot, 2026-10-01: thin lines over an elite's corpse): the sprites are MIPMAPPED and wrap
// REPEAT, so a filtered texture() read just past the top edge blended in the opaque BOTTOM row (a body lying on the
// floor is opaque all along it) and drew a line the corpse's width. The outline and the embers now read the base
// level's own texels with texelFetch - no filtering, no mip, no wrap; outside the sprite is empty.
float eliteAlphaAt(sampler2D t, ivec2 p) {
  ivec2 ts = textureSize(t, 0);
  if (p.x < 0 || p.y < 0 || p.x >= ts.x || p.y >= ts.y) return 0.0;
  return texelFetch(t, p, 0).a;
}
// THE OUTLINE'S WIDTH (Mac: "make it like it was before without lines"): every texel within 2 of the silhouette
// (dx*dx + dy*dy <= 4) - the eight round it plus a second texel straight out on each axis, the ~1.5-texel weight
// the filtered reads used to give it, now from exact texels.
float eliteRim(sampler2D t, vec2 uv) {
  ivec2 p = ivec2(floor(uv * vec2(textureSize(t, 0))));
  for (int dy = -2; dy <= 2; dy++) {
    for (int dx = -2; dx <= 2; dx++) {
      if ((dx == 0 && dy == 0) || dx * dx + dy * dy > 4) continue;
      if (eliteAlphaAt(t, p + ivec2(dx, dy)) >= 0.5) return 1.0;
    }
  }
  return 0.0;
}
// THE OUTLINE'S PULSE (Mac: "the outline to have the same effect as yellow just more visible and the max brightness it
// should reach is what we have right now"): it breathes with the body's warmth, on the same pulse (k 0.55..1) but
// deeper - from a dim blue at the pulse's low to the outline's full brightness at its peak, and never past it.
// A corpse's batch is static - nothing writes its pulse each frame - so a NEGATIVE glow carries its phase instead
// (-0.05..-1) and the shader runs the same pulse off the clock (Mac: "corpses need to pulse too").
// STAFF-EVENT: a staff event's MINI BOSS glows YELLOW (mob: "instead of the blue elite glow lets make the mini boss
// have a yellow glow") - its glow is an elite's past STAFF_BOSS_GLOW (systems/eliteFoes.js), kept through the pulse here
// so the colour reads it: a living one's 2.55..3, a corpse's -2.05..-3.
const vec3 STAFF_BOSS_RIM = vec3(1.0, 0.82, 0.18);   // the outline: a bright yellow
float eliteRimK(float g, float secs) {
  if (g > 0.0) return g;
  float boss = -g >= 2.0 ? 2.0 : 0.0;
  return boss + 0.775 + 0.225 * sin(secs * 3.2 + (-g - boss) * 6.2831853);
}
vec3 eliteRimColor(float k) {
  bool boss = k >= 2.0;
  if (boss) k -= 2.0;
  vec3 full = min((boss ? STAFF_BOSS_RIM : ELITE_RIM) * 2.0, vec3(1.0));   // the brightest it reaches: the outline as it was
  float s = clamp((k - 0.55) / 0.45, 0.0, 1.0);
  return full * mix(0.4, 1.0, s);
}
// THE EMBERS (Mac: "make the outline flow into the air a bit ... pixels that fly in the air"): single pixels of the
// outline's colour rising off the top of the silhouette. Each texel column holds at most one ember a cycle; whether it
// burns, how fast it climbs and when it starts are hashes of the column and the cycle, so nothing is stored and nothing
// is sent online. A fragment finds the body under it by scanning down its own column (a transparent elite fragment only).
const float ELITE_RISE = 18.0;   // how high an ember climbs, texels
float eliteHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float eliteEmber(sampler2D t, vec2 uv, float secs) {
  vec2 ts = vec2(textureSize(t, 0));
  vec2 tp = floor(uv * ts);
  // straight up its own column: a sideways sway mapped two columns onto one ember and drew short dashes
  float c = tp.x;
  float d = -1.0;
  for (int i = 1; i <= 18; i++) {
    float y = tp.y - float(i);
    if (y < 0.0) break;
    if (eliteAlphaAt(t, ivec2(int(c), int(y))) >= 0.5) { d = float(i); break; }   // exact texels (see eliteAlphaAt)
  }
  if (d < 3.0) return 0.0;   // nothing below in reach, or this texel is the rim's (2 wide)
  float speed = 5.0 + 7.0 * eliteHash(vec2(c, 1.7));   // texels a second
  float cyc = secs * speed / ELITE_RISE + eliteHash(vec2(c, 9.1));
  float n = floor(cyc);
  if (eliteHash(vec2(c, n + 3.0)) > 0.3) return 0.0;   // most columns rest this cycle
  float h = 3.0 + floor(fract(cyc) * ELITE_RISE);
  if (d != h) return 0.0;
  return 1.0 - fract(cyc);   // fades as it climbs
}
// A NEGATIVE glow is an elite's corpse: the rim alone at |k| - no embers, no gold (systems/eliteFoes.js).
// The body (Mac: "the yellow glow is too much make the enemy glow from normal to a bit yellow"): the pulse runs from
// the sprite's own colours (k at its low, 0.55) to a light yellow warmth (k at 1) - a tint, never a wash.
vec3 eliteGlowLit(vec3 lit, vec3 albedo, float k) {
  if (k <= 0.0) return lit;
  if (k >= 2.0) k -= 2.0;   // STAFF-EVENT: a mini boss's pulse, warmed as an elite's
  const vec3 LUM = vec3(0.299, 0.587, 0.114);
  float l = dot(albedo, LUM);
  float s = clamp((k - 0.55) / 0.45, 0.0, 1.0);
  return lit * mix(vec3(1.0), vec3(1.10, 1.04, 0.82), s) + ELITE_GOLD * (0.035 * s * l);
}`,Et=`
vec3 glintRimColor(vec4 g) { return min(g.rgb * (0.55 + 0.75 * g.a), vec3(1.0)); }
vec3 glintLit(vec3 lit, vec3 albedo, vec4 g) {
  if (g.a <= 0.0) return lit;
  const vec3 LUM = vec3(0.299, 0.587, 0.114);
  float l = dot(albedo, LUM);
  vec3 c = g.rgb * max(dot(lit, LUM) * 1.4, 0.35 + 0.8 * l);
  return mix(lit, c, clamp(g.a, 0.0, 1.0) * 0.45);
}`;Object.freeze([.001,.001,.001,.001]);var L=Object.freeze({patch:Object.freeze([Object.freeze({cell:1,weight:.35}),Object.freeze({cell:4,weight:.4}),Object.freeze({cell:16,weight:.25})]),edge:.07,salt:1397641047,fade:Object.freeze([2,2])}),R=6.4,z=R,B=e=>Number.isInteger(e)?`${e}.0`:`${e}`;function V(){let e=L.edge,t=L.patch;return`// PRECIP4 (render/snowCoverGlsl.js; the law is systems/weather/snowpack.js)
uniform highp sampler2D uSnowLines;   // the window's lattice of snowlines: texel (i, j) the point i east and j south of its first, rgb h10/h50/h90 (m above the sea)
uniform vec4 uSnowSet;                // x: world y -> metres above the sea; y: 1 on; z: the lattice's spacing (world tiles)
uniform highp ivec3 uSnowWin;         // the window's first point's world tile (x east, z north - the ecotone's frame), its side (points)
uniform highp ivec4 uSnowArr;         // the bound arrays' winter halves: x the draw's own (uTileArr), y-w uEcoArr1-3 (0 none)
float snowHash(highp ivec2 c, highp uint salt) {
  highp uint h = (uint(c.x) * 0x8da6b343u) ^ (uint(c.y) * 0xd8163841u) ^ (salt * 0xcb1ab31fu);
  h ^= h >> 16u; h *= 0x7feb352du; h ^= h >> 15u; h *= 0x846ca68bu; h ^= h >> 16u;
  return float(h >> 8u) * (1.0 / 16777216.0);
}
float snowNoise(vec2 lt, highp int cell, highp uint salt) {
  vec2 q = lt / float(cell);
  vec2 fl = floor(q);
  highp ivec2 i = uEcoOrigin.xy / cell + ivec2(fl);
  vec2 fr = q - fl;
  vec2 u = fr * fr * (3.0 - 2.0 * fr);
  float a = snowHash(i, salt), b = snowHash(i + ivec2(1, 0), salt), c = snowHash(i + ivec2(0, 1), salt), d = snowHash(i + ivec2(1, 1), salt);
  float top = a + (b - a) * u.x, bot = c + (d - c) * u.x;
  return top + (bot - top) * u.y;
}
// snowpack.js coverAtHeight: piecewise linear through (h10, 0.1), (h50, 0.5), (h90, 0.9), out to 0 and 1 a quarter span on
float snowAtHeight(vec3 line, float h) {
  float lo = max(1.0, line.y - line.x), hi = max(1.0, line.z - line.y);
  if (h <= line.x) return max(0.0, 0.1 + 0.1 * (h - line.x) / (0.25 * lo));
  if (h <= line.y) return 0.1 + 0.4 * (h - line.x) / lo;
  if (h <= line.z) return 0.5 + 0.4 * (h - line.y) / hi;
  return min(1.0, 0.9 + 0.1 * (h - line.z) / (0.25 * hi));
}
vec3 snowLineAt(highp ivec2 p) {
  highp int s = uSnowWin.z - 1;
  return texelFetch(uSnowLines, clamp(p, ivec2(0), ivec2(s)), 0).rgb;
}
// the snowline at a pixel-local point: the lattice's bilinear between the four points about it (snowCoverHost.js lineAt)
vec3 snowLine(vec2 local) {
  vec2 rel = vec2(uEcoOrigin.xy - uSnowWin.xy) + local / ${B(z)};   // world tiles from the window's first point, x east, z north
  vec2 q = vec2(rel.x, -rel.y) / uSnowSet.z;
  vec2 fl = floor(q);
  highp ivec2 i = ivec2(fl);
  vec2 u = q - fl;
  vec3 a = snowLineAt(i), b = snowLineAt(i + ivec2(1, 0)), c = snowLineAt(i + ivec2(0, 1)), d = snowLineAt(i + ivec2(1, 1));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float snowCover(vec2 local, float y, vec2 gx, vec2 gy) {
  if (uSnowSet.y < 0.5) return 0.0;   // off the lane: one uniform test
  float c = snowAtHeight(snowLine(local), y + uSnowSet.x);   // SNOW-FACE: a steep face keeps it (SNOW_GROUND)
  if (c <= 0.0 || c >= 1.0) return c;
  vec2 lt = local / ${B(z)};
  // AUDIT PRECIP GROUND-8: the patches band-limited by the fragment's footprint (gx, gy: tiles a screen pixel - the
  // tile's own gradient, GRAIN1's) - an octave whose cell the footprint reaches is its mean, and what the patches no
  // longer resolve is their mean, the share itself: the distant snowline stands still as the eye moves
  float fw = max(length(gx), length(gy)), p = 0.0, keep = 0.0;
${t.map((e,t)=>`  { float a = clamp(${B(L.fade[0])} - ${B(L.fade[1])} * fw / ${B(e.cell)}, 0.0, 1.0); p += ${B(e.weight)} * mix(0.5, snowNoise(lt, ${e.cell}, ${L.salt+t}u), a); keep += ${B(e.weight)} * a; }`).join(`
`)}
  if (keep <= 0.0) return c;
  p = clamp((p - 0.5) * 2.2 + 0.5, 0.0, 1.0);   // the sum's middle widened, so a half cover is half the ground
  return mix(c, smoothstep(${B(-e)}, ${B(e)}, ${B(-e)} + ${B(1+2*e)} * c - p), keep);
}
// AUDIT PRECIP GROUND-9: the share of the ground a snow lying ON it may take (the Snowfall mod's surface,
// render/snowfallGlsl.js): the ground's own cover on the snow lane - never a drift on green grass - and the whole ground
// off it, where DFU's winter dresses every tile and the mod's own gate asks the season
float snowLaid(vec2 local, float y, vec2 gx, vec2 gy) {
  return uSnowSet.y < 0.5 ? 1.0 : snowCover(local, y, gx, gy);
}
`}function Dt(e=``){return`${V()}
vec3 snowGround(vec3 bare, vec4 ew, float c, vec3 tl, vec2 gx, vec2 gy) {
  if (c <= 0.0) return bare;
  vec3 white = ${e}(textureGrad(uTileArr, vec3(tl.xy, tl.z + float(uSnowArr.x)), gx, gy).rgb);
  if (ew.x < 1.0) {
    vec3 cw = white * ew.x;
    if (ew.y > 0.0) cw += ew.y * ${e}(textureGrad(uEcoArr1, vec3(tl.xy, tl.z + float(uSnowArr.y)), gx, gy).rgb);
    if (ew.z > 0.0) cw += ew.z * ${e}(textureGrad(uEcoArr2, vec3(tl.xy, tl.z + float(uSnowArr.z)), gx, gy).rgb);
    if (ew.w > 0.0) cw += ew.w * ${e}(textureGrad(uEcoArr3, vec3(tl.xy, tl.z + float(uSnowArr.w)), gx, gy).rgb);
    white = cw;
  }
  return mix(bare, white, c);
}
`}var Ot=`
float seaFresnel(float ndv, float f0) { return f0 + (0.85 - f0) * pow(1.0 - clamp(ndv, 0.0, 1.0), 5.0); }
vec3 seaSkyRefl(float ry, vec3 zenith, vec3 horizon) { return mix(horizon, zenith, clamp(0.2 + ry * 1.4, 0.0, 1.0)); }
vec3 seaLight(vec3 ambient, vec3 sunColor, float sunDiff, vec3 moonColor, float moonDiff) {
  return ambient + sunColor * (sunDiff * 0.6) + moonColor * moonDiff;
}
float seaSunLobe(float nh) { return pow(max(nh, 0.0), 180.0); }
float seaMoonLobe(float nh) { return pow(max(nh, 0.0), 220.0); }
vec3 seaGlints(vec3 sunColor, float sun, vec3 moonColor, float moon) { return sunColor * (1.6 * sun) + moonColor * (0.7 * moon); }
vec3 seaSky(vec3 lit, float ndv, vec3 zenith, vec3 horizon, float f0) {
  float F = seaFresnel(ndv, f0);
  return lit * (1.0 - F) + seaSkyRefl(ndv, zenith, horizon) * F;
}`,kt=`
float horizonHaze(float d, float fogStart, float fogEnd, float rimStart, float rimEnd, float hold) {
  float ramp = clamp((d - fogStart) / max(fogEnd - fogStart, 1.0), 0.0, 1.0);
  return min(min(ramp, hold) + (1.0 - hold) * smoothstep(rimStart, rimEnd, d), 1.0);
}`,H=Object.freeze({from:3700,to:6500,keep:.7,ease:8e3}),At=`in float vSea;
in vec3 vWorld;
in vec3 vSeaBody;
uniform vec3 uOrigin;
uniform vec3 uEye;
uniform vec3 uSkyZenith;
uniform vec3 uSkyHorizon;
uniform float uSeaF0;
uniform float uSeaLook;   // 1 with a sky to reflect (and the Enhanced water on), 0 without (the sea lit as ground, as before)
uniform float uSummitFrom;   // RED-MOUNTAIN: the streamed grid's edge, metres out - the summits' thinner air eased in past it
${Ot}
${kt}
${`
float summitHoldAt(float hold, float alt, float d, float from) {
  return hold * (1.0 - ${H.keep.toFixed(4)} * smoothstep(${H.from.toFixed(1)}, ${H.to.toFixed(1)}, alt) * smoothstep(from, from + ${H.ease.toFixed(1)}, d));
}`}
// RED-MOUNTAIN: the haze lies under the summits - the ring's hold eased down over ground standing over SUMMIT_HAZE.from
float summitHold(float hold, float d) { return summitHoldAt(hold, vWorld.y - uOrigin.y, d, uSummitFrom); }
vec3 ringSea(vec3 ambient, vec3 sunColor, vec3 moonColor, float sunScale) {
  vec3 V = normalize(uEye - vWorld);   // the normal is up: the facing and the reflected ray's height are V.y
  vec3 lit = vSeaBody * seaLight(ambient, sunColor, sunScale * max(uLightDir.y, 0.0), moonColor, uMoonScale * max(uMoonDir.y, 0.0));
  vec3 H = normalize(uLightDir + V);
  vec3 Hm = normalize(uMoonDir + V);
  return seaSky(lit, V.y, uSkyZenith, uSkyHorizon, uSeaF0) + seaGlints(sunColor, seaSunLobe(H.y) * sunScale, moonColor, seaMoonLobe(Hm.y) * uMoonScale);
}`,jt=`in float vFlora;
in vec3 vCanopy;
uniform vec3 uFlora;   // x 1 with the woods on; y, z the crowns' and the groves' spacing (metres)
float floraHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float floraNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(floraHash(i), floraHash(i + vec2(1.0, 0.0)), u.x), mix(floraHash(i + vec2(0.0, 1.0)), floraHash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float floraGrain(vec2 xz) {
  if (uFlora.x < 0.5) return 1.0;
  vec2 c = xz / uFlora.y, g = xz / uFlora.z;
  float fc = 1.0 - smoothstep(0.3, 0.8, length(fwidth(c)));
  float fg = 1.0 - smoothstep(0.3, 0.8, length(fwidth(g)));
  return 1.0 + 0.55 * (floraNoise(c) - 0.5) * fc + 0.4 * (floraNoise(g) - 0.5) * fg;
}
vec3 floraLight(vec3 ambient, vec3 sunColor, float sun, vec3 moonColor, float moonScale) {
  return ambient + moonColor * (moonScale * 0.5) + sunColor * (sun * 0.5);
}`,U=Object.freeze([46,47,55]),Mt=U[0],W=Object.freeze({soft:.07,wander:Object.freeze([Object.freeze({cells:32,amp:.12}),Object.freeze({cells:128,amp:.06}),Object.freeze({cells:512,amp:.05})]),salt:213});W.soft+W.wander.reduce((e,t)=>e+t.amp,0);var G=Object.freeze((()=>{let e=[0,0];for(let t=0;t<64;t++){let r=!1;for(let e=0;e<4;e++)n[t<<2|e]&&(r=!0);r&&(e[t>>5]=(e[t>>5]|1<<(t&31))>>>0)}return e})()),K=e=>Number.isInteger(e)?`${e}.0`:`${e}`,Nt=`float reHash(highp ivec2 c, highp uint salt) {
  highp uint h = (uint(c.x) * 0x8da6b343u) ^ (uint(c.y) * 0xd8163841u) ^ (salt * 0xcb1ab31fu);
  h ^= h >> 16u; h *= 0x7feb352du; h ^= h >> 15u; h *= 0x846ca68bu; h ^= h >> 16u;
  return float(h >> 8u) * (1.0 / 16777216.0);
}
// value noise on a lattice of \`n\` cells a pixel's side, its indices taken modulo the pixel (the same on both sides of its edge)
float reNoise(vec2 p, highp int n, highp uint salt) {
  vec2 q = p * (float(n) / 128.0);
  vec2 fl = floor(q);
  highp ivec2 i = ivec2(fl);   // never negative: p is the pixel's own, 0..128
  highp ivec2 i0 = i % n, i1 = (i + 1) % n;
  vec2 fr = q - fl;
  vec2 u = fr * fr * (3.0 - 2.0 * fr);
  float a = reHash(i0, salt), b = reHash(ivec2(i1.x, i0.y), salt), c = reHash(ivec2(i0.x, i1.y), salt), d = reHash(i1, salt);
  float top = a + (b - a) * u.x, bot = c + (d - c) * u.x;
  return top + (bot - top) * u.y;
}
`;function Pt(e=``){let t=W.soft;return`// ROAD-LOOK (render/roadEdgeGlsl.js; the law is world/road/roadEdge.js)
uniform float uRoadEdge;   // 0: every tile its own, as DFU draws it
const highp uvec2 RE_WET = uvec2(${G[0]}u, ${G[1]}u);   // the records that carry water, 0-31 and 32-63
bool reRoad(highp uint d) { return (d >> 2u) == ${Mt}u; }   // the paving: its edge tiles are the ground's side
bool reTakes(highp uint d) { highp uint r = d >> 2u; return r < 56u && (((r < 32u ? (RE_WET.x >> r) : (RE_WET.y >> (r - 32u))) & 1u) == 0u); }
${Nt}float reWander(vec2 p) {
  return ${W.wander.map((e,t)=>`${K(e.amp)} * (2.0 * reNoise(p, ${e.cells}, ${W.salt+t}u) - 1.0)`).join(` + `)};
}
float reNear(float d) { float w = max(0.5 - d, 0.0); return w * w / max(d * d, 1e-6); }
highp uint reCell(highp ivec2 c) { return texelFetch(uTilemap, clamp(c, ivec2(0), ivec2(127)), 0).r; }
// a cell's picture at p, mirrored about the cell's own square and turned by its own transform, at the fragment's gradient
vec3 reTexel(highp uint d, highp ivec2 c, vec2 p, vec2 dux, vec2 duy) {
  vec2 l = p - vec2(c);
  l = vec2(l.x < 0.0 ? -l.x : (l.x > 1.0 ? 2.0 - l.x : l.x), l.y < 0.0 ? -l.y : (l.y > 1.0 ? 2.0 - l.y : l.y));
  int t = int(d & 3u);
  return ${e}(textureGrad(uTileArr, vec3(ROT[t] * l + TRANS[t], float(d >> 2u)), ROT[t] * dux, ROT[t] * duy).rgb);
}
vec3 roadEdge(vec3 own, highp uint data, vec2 p, vec2 gx, vec2 gy, int t) {
  if (uRoadEdge <= 0.0 || !reTakes(data)) return own;
  highp ivec2 c = clamp(ivec2(floor(p)), ivec2(0), ivec2(127));
  vec2 fr = p - vec2(c);
  highp ivec2 sg = ivec2(fr.x < 0.5 ? -1 : 1, fr.y < 0.5 ? -1 : 1);
  highp ivec2 cb = c + ivec2(sg.x, 0), cc = c + ivec2(0, sg.y), cd = c + sg;
  highp uint db = reCell(cb), dc = reCell(cc), dd = reCell(cd);
  bool ra = reRoad(data), rb = reRoad(db), rc = reRoad(dc), rd = reRoad(dd);
  if (ra == rb && ra == rc && ra == rd) return own;
  // the dual square about the nearest tile corner k: s runs 0..1 from the cells' centres west and south of it
  vec2 k = floor(p + 0.5);
  vec2 s = p - (k - 0.5);
  float wxa = float(c.x) == k.x ? s.x : 1.0 - s.x, wxb = float(cb.x) == k.x ? s.x : 1.0 - s.x;
  float wya = float(c.y) == k.y ? s.y : 1.0 - s.y, wyc = float(cc.y) == k.y ? s.y : 1.0 - s.y;
  float lin = (ra ? wxa * wya : 0.0) + (rb ? wxb * wya : 0.0) + (rc ? wxa * wyc : 0.0) + (rd ? wxb * wyc : 0.0);
  float rho = smoothstep(${K(.5-t)}, ${K(.5+t)}, lin + reWander(p));
  float mine = ra ? rho : 1.0 - rho;
  if (mine >= 1.0) return own;
  float u = min(fr.x, 1.0 - fr.x), v = min(fr.y, 1.0 - fr.y);
  float gb = (rb != ra && reTakes(db)) ? reNear(u) : 0.0;
  float gc = (rc != ra && reTakes(dc)) ? reNear(v) : 0.0;
  float gd = (rd != ra && reTakes(dd)) ? reNear(sqrt(u * u + v * v)) : 0.0;
  float gs = gb + gc + gd;
  if (gs <= 0.0) return own;
  // the coordinate's own gradient, back from the fragment's turn (ROT is orthonormal)
  vec2 dux = transpose(ROT[t]) * gx, duy = transpose(ROT[t]) * gy;
  vec3 o = vec3(0.0);
  if (gb > 0.0) o += gb * reTexel(db, cb, p, dux, duy);
  if (gc > 0.0) o += gc * reTexel(dc, cc, p, dux, duy);
  if (gd > 0.0) o += gd * reTexel(dd, cd, p, dux, duy);
  return mix(o / gs, own, mine);
}
`}var q=Object.freeze({water:0,dirt:1,grass:2,stone:3}),J=Object.freeze({soft:.08,wander:Object.freeze([Object.freeze({cells:32,amp:.16}),Object.freeze({cells:128,amp:.08}),Object.freeze({cells:512,amp:.04})]),salt:1761}),Ft=J.soft+J.wander.reduce((e,t)=>e+t.amp,0),Y=Object.freeze([{records:r[0],a:q.water,b:q.dirt,ring:0},{records:Object.freeze([10,11,12,51]),a:q.grass,b:q.dirt,ring:1},{records:Object.freeze([15,16,17,53]),a:q.grass,b:q.stone,ring:2},{records:r[1],a:q.water,b:q.grass,ring:0},{records:r[2],a:q.water,b:q.stone,ring:0}]),It=(e,t,n)=>1|e<<1|t<<3|n<<5;function Lt(){let e=new Uint16Array(256),n=t();for(let t of Y.slice(0,3))for(let r=1;r<15;r++){let a=n[r|t.ring<<4],o=t.records.indexOf(a&63);if(o<0)throw Error(`COAST-LOOK: ring ${t.ring}'s shape ${r} wrote record ${a&63}, no transition of its family`);let s=i(a),c=It(t.a,t.b,r);if(e[s]&&e[s]!==c)throw Error(`COAST-LOOK: byte ${s} written by two shapes`);if(e[s]=c,t.ring===0)for(let t of Y.slice(3))e[t.records[o]<<2|s&3]=It(t.a,t.b,r)}for(let t of Y){let n=t.records[3];for(let t of[2,3])e[n<<2|t]||(e[n<<2|t]=e[n<<2|t-2])}return e}var Rt=Lt();function zt(e=Rt){let t=new Uint32Array(128);for(let n=0;n<256;n++)t[n>>1]=(t[n>>1]|(e[n]&65535)<<(n&1)*16)>>>0;return t}var Bt=Object.freeze({line:.875,reach:.12}),Vt=Bt.reach/(Ft-J.soft),X=e=>Number.isInteger(e)?`${e}.0`:`${e}`;function Ht(){return`// COAST-LOOK's wander (render/groundEdgeGlsl.js; the law is world/terrain/groundEdge.js)
uniform float uGroundEdge;   // 0: every tile its own, as DFU draws it
float geWander(vec2 p) {
  if (uGroundEdge <= 0.0) return 0.0;
  p = max(p, vec2(0.0));   // the lattice's index is never negative
  return ${J.wander.map((e,t)=>`${X(e.amp)} * (2.0 * reNoise(p, ${e.cells}, ${J.salt+t}u) - 1.0)`).join(` + `)};
}`}function Ut(){return`const highp uint GE_KINDS[128] = uint[128](${[...zt()].map(e=>`${e}u`).join(`, `)});
highp uint geEntry(highp uint d) { return (GE_KINDS[int(d >> 1u)] >> ((d & 1u) * 16u)) & 65535u; }`}function Wt(e=``){let t=J.soft;return`${Ht()}
${Ut()}
bool groundMix(highp uint d, vec2 f, vec2 p, out highp uint a, out highp uint b, out float s) {
  a = 0u; b = 0u; s = 0.0;
  if (uGroundEdge <= 0.0) return false;
  highp uint e = geEntry(d);
  if (e == 0u) return false;
  a = (e >> 1u) & 3u; b = (e >> 3u) & 3u;
  highp uint m = (e >> 5u) & 15u;
  float c = mix(mix(float(m & 1u), float((m >> 1u) & 1u), f.x), mix(float((m >> 2u) & 1u), float((m >> 3u) & 1u), f.x), f.y);
  s = smoothstep(${X(.5-t)}, ${X(.5+t)}, c + geWander(p));
  return true;
}
vec3 geBase(highp uint k, vec2 f, vec2 dux, vec2 duy) { return ${e}(textureGrad(uTileArr, vec3(f, float(k)), dux, duy).rgb); }
bool coastCut(vec2 p, inout uint data, inout int layer, inout int t, inout vec2 tileUV, inout vec2 tuv, inout vec2 gx, inout vec2 gy) {
  if (data != 255u) return false;   // a cell the mod kept is never cut
  highp ivec2 c = clamp(ivec2(floor(p)), ivec2(0), ivec2(127));
  vec2 fr = p - vec2(c);
  highp ivec2 sg = ivec2(fr.x < 0.5 ? -1 : 1, fr.y < 0.5 ? -1 : 1);
  highp ivec2 cb = c + ivec2(sg.x, 0), cc = c + ivec2(0, sg.y), cd = c + sg;
  highp uint db = reCell(cb), dc = reCell(cc), dd = reCell(cd);
  bool kb = db == 255u, kc = dc == 255u, kd = dd == 255u;
  if (kb && kc && kd) return true;
  // the dual square about the nearest tile corner k: s runs 0..1 from the cells' centres west and south of it
  vec2 k = floor(p + 0.5);
  vec2 q = p - (k - 0.5);
  float wxa = float(c.x) == k.x ? q.x : 1.0 - q.x, wxb = float(cb.x) == k.x ? q.x : 1.0 - q.x;
  float wya = float(c.y) == k.y ? q.y : 1.0 - q.y, wyc = float(cc.y) == k.y ? q.y : 1.0 - q.y;
  float lin = wxa * wya + (kb ? wxb * wya : 0.0) + (kc ? wxa * wyc : 0.0) + (kd ? wxb * wyc : 0.0);
  if (lin + ${X(Vt)} * geWander(p) > ${X(Bt.line)}) return true;
  // kept: the nearest kept cell across this corner - its x or y neighbour (the nearer edge first), else the diagonal
  float u = min(fr.x, 1.0 - fr.x), v = min(fr.y, 1.0 - fr.y);
  highp ivec2 n = cd; highp uint dn = dd;
  if (u <= v) { if (!kb) { n = cb; dn = db; } else if (!kc) { n = cc; dn = dc; } }
  else { if (!kc) { n = cc; dn = dc; } else if (!kb) { n = cb; dn = db; } }
  // the coordinate's own gradient, back from the cut byte's turn (ROT is orthonormal), turned by the kept cell's
  vec2 dux = transpose(ROT[t]) * gx, duy = transpose(ROT[t]) * gy;
  data = dn; layer = int(dn >> 2u); t = int(dn & 3u);
  vec2 l = p - vec2(n);
  l = vec2(l.x < 0.0 ? -l.x : (l.x > 1.0 ? 2.0 - l.x : l.x), l.y < 0.0 ? -l.y : (l.y > 1.0 ? 2.0 - l.y : l.y));
  tileUV = l; tuv = ROT[t] * l + TRANS[t]; gx = ROT[t] * dux; gy = ROT[t] * duy;
  return false;
}
`}var Gt=Object.freeze([.62,.6,.52]),Kt=.62,qt=.8,Jt=`
uniform float uWaterBed;       // WATER-NEXT 2: 1 where the enhanced water lies over this ground
uniform uvec4 uBedMask[8];     // the draw's water corners, packed as the water's own uWaterMask
// SHORE-SILT: tl/gx/gy the ground's own texel of this tile (its layer, turned) - a shore's art paints its water past
// the corner table's line, and that paint goes under the silt too (its mask in the layer's alpha, world/puddleMask.js
// markShoreWater), or a bank is freckled with flat blue where neither the bed nor the sheet reaches. Answers the bed's
// share and, of it, the FRINGE's - the art's water past the sheet, which no water darkens: drawn as wet mud, not silt.
// AUDIT PRECIP GROUND-5: under the snow (\`snowC\`, the ground's cover - render/snowCoverGlsl.js) the art's water is the
// texel's it wears there: the summer record's mask walked to its winter record's (uSnowArr.x layers on) by the cover
// COAST-LOOK: \`blended\` a tile the ground drew as its two kinds - its line wanders at \`p\` as the sheet's, its art no fringe
vec2 bedCover(uint data, vec2 f, vec2 p, vec3 tl, vec2 gx, vec2 gy, float snowC, bool blended) {
  if (uWaterBed < 0.5) return vec2(0.0);
  uint rec = data >> 2u;
  if (${a.map(e=>`rec == ${e}u`).join(` || `)}) return vec2(0.0);
  uvec4 v = uBedMask[data >> 5u];
  uint j = (data >> 3u) & 3u;
  uint word = j == 0u ? v.x : (j == 1u ? v.y : (j == 2u ? v.z : v.w));
  uint m = (word >> ((data & 7u) * 4u)) & 15u;
  if (m == 0u) return vec2(0.0);
  float c = mix(mix(float(m & 1u), float((m >> 1u) & 1u), f.x), mix(float((m >> 2u) & 1u), float((m >> 3u) & 1u), f.x), f.y);
  float k = smoothstep(0.3, 0.7, c - (blended ? geWander(p) : 0.0));
  float art = 0.0;
  if (m != 15u && k < 1.0 && !blended) {
    float a = textureGrad(uTileArr, tl, gx, gy).a;
    if (snowC > 0.0) a = mix(a, textureGrad(uTileArr, vec3(tl.xy, tl.z + float(uSnowArr.x)), gx, gy).a, snowC);
    art = smoothstep(0.3, 0.7, a);
  }
  return vec2(max(k, art), max(art - k, 0.0));
}`,Yt=(e=e=>e)=>`vec2 bedK = bedCover(data, tileUV, unwrapped, vec3(tuv, float(layer)), gx, gy, snowC, ge);
  if (bedK.x > 0.0) {   // WATER-NEXT 2: under the water, a bed
    vec3 silt = ${e(`textureGrad(uTileArr, vec3(tuv, ${1 .toFixed(1)}), gx, gy).rgb`)} * vec3(${Gt.map(e=>e.toFixed(2)).join(`, `)});
    silt = mix(silt, vec3(dot(silt, vec3(0.299, 0.587, 0.114))) * ${Kt.toFixed(2)}, ${qt.toFixed(2)} * bedK.y);   // SHORE-SILT: the fringe past the sheet is wet mud - darker, greyer
    tex = mix(tex, silt, bedK.x);
  }`,Z=Object.freeze({band:96,warp:Object.freeze([Object.freeze({cell:64,amp:48}),Object.freeze({cell:8,amp:16})]),patch:Object.freeze([Object.freeze({cell:8,weight:.65}),Object.freeze({cell:2,weight:.35})]),stretch:2,edge:.06,row0:512,saltX:101,saltZ:211}),Xt=Z.band+Z.warp.reduce((e,t)=>e+t.amp,0);Object.freeze([3,4,5]);var Q=e=>Number.isInteger(e)?`${e}.0`:`${e}`;function Zt(e=``){let[t,n]=Z.warp,[r,i]=Z.patch,a=Z.edge;return`// ECOTONE1 (render/ecotoneGlsl.js; the law is world/ecotone.js)
uniform sampler2DArray uEcoArr1;
uniform sampler2DArray uEcoArr2;
uniform sampler2DArray uEcoArr3;
uniform highp ivec4 uEcoSide;     // the W, E, S, N neighbours' sets: 0 the pixel's own, 1-3 uEcoArr1-3
uniform highp ivec4 uEcoCorner;   // the SW, SE, NW, NE neighbours'
uniform highp ivec3 uEcoOrigin;   // the pixel's first world tile (x east, z north of row ${Z.row0}); z 1 when a neighbour's set differs
// HIGHP, every integer here: a fragment stage's ints and uints are mediump unless they say, and a phone's mediump int is
// sixteen bits - a world tile runs to 128,000 and the hash wraps at 2^32
float ecoHash(highp ivec2 c, highp uint salt) {
  highp uint h = (uint(c.x) * 0x8da6b343u) ^ (uint(c.y) * 0xd8163841u) ^ (salt * 0xcb1ab31fu);
  h ^= h >> 16u; h *= 0x7feb352du; h ^= h >> 15u; h *= 0x846ca68bu; h ^= h >> 16u;
  return float(h >> 8u) * (1.0 / 16777216.0);
}
float ecoNoise(vec2 lt, highp int cell, highp uint salt) {
  vec2 q = lt / float(cell);
  vec2 fl = floor(q);
  highp ivec2 i = uEcoOrigin.xy / cell + ivec2(fl);
  vec2 fr = q - fl;
  vec2 u = fr * fr * (3.0 - 2.0 * fr);
  float a = ecoHash(i, salt), b = ecoHash(i + ivec2(1, 0), salt), c = ecoHash(i + ivec2(0, 1), salt), d = ecoHash(i + ivec2(1, 1), salt);
  float top = a + (b - a) * u.x, bot = c + (d - c) * u.x;
  return top + (bot - top) * u.y;
}
float ecoShare(float u, vec2 lt, highp uint salt) {
  float d = u + ${Q(t.amp)} * (2.0 * ecoNoise(lt, ${t.cell}, salt) - 1.0) + ${Q(n.amp)} * (2.0 * ecoNoise(lt, ${n.cell}, salt + 1u) - 1.0);
  float p = clamp(0.5 + d / ${Q(2*Z.band)}, 0.0, 1.0);
  float n0 = ${Q(r.weight)} * ecoNoise(lt, ${r.cell}, salt + 2u) + ${Q(i.weight)} * ecoNoise(lt, ${i.cell}, salt + 3u);
  float n = clamp((n0 - 0.5) * ${Q(Z.stretch)} + 0.5, 0.0, 1.0);
  return smoothstep(${Q(-a)}, ${Q(a)}, ${Q(-a)} + ${Q(1+2*a)} * p - n);
}
void ecoAdd(inout vec4 w, int slot, float v) {
  if (slot == 1) w.y += v; else if (slot == 2) w.z += v; else if (slot == 3) w.w += v; else w.x += v;
}
// the shares of the pixel's own set and of uEcoArr1-3 at a fragment (x own; summing to 1) - PRECIP4's winter texel
// (render/snowCoverGlsl.js) crosses the border by the same weights
vec4 ecoWeights(vec2 local) {
  if (uEcoOrigin.z == 0) return vec4(1.0, 0.0, 0.0, 0.0);   // every neighbour wears the pixel's own set
  float sx = local.x < 409.6 ? -1.0 : 1.0, sz = local.y < 409.6 ? -1.0 : 1.0;
  float ux = sx < 0.0 ? local.x : local.x - 819.2, uz = sz < 0.0 ? local.y : local.y - 819.2;
  // the three neighbours of the nearer corner, and which of the two seams can move a weight (world/ecotone.js
  // ecotoneOwner's rule: a seam with the pixel's own set across it and one set along the far row moves none)
  int nx = sx < 0.0 ? uEcoSide.x : uEcoSide.y, nz = sz < 0.0 ? uEcoSide.z : uEcoSide.w;
  int nd = sz < 0.0 ? (sx < 0.0 ? uEcoCorner.x : uEcoCorner.y) : (sx < 0.0 ? uEcoCorner.z : uEcoCorner.w);
  float ox = 1.0, oz = 1.0;
  vec2 lt = local / 6.4;
  if (abs(ux) < ${Q(Xt)} && !(nx == 0 && nd == nz)) { float s = ecoShare(ux, lt, ${Z.saltX}u); ox = sx < 0.0 ? s : 1.0 - s; }
  if (abs(uz) < ${Q(Xt)} && !(nz == 0 && nd == nx)) { float s = ecoShare(uz, lt, ${Z.saltZ}u); oz = sz < 0.0 ? s : 1.0 - s; }
  vec4 w = vec4(ox * oz, 0.0, 0.0, 0.0);
  if (ox * oz >= 1.0) return w;
  ecoAdd(w, nx, (1.0 - ox) * oz);
  ecoAdd(w, nz, ox * (1.0 - oz));
  ecoAdd(w, nd, (1.0 - ox) * (1.0 - oz));
  return w;
}
vec3 ecotone(vec3 own, vec4 w, vec3 tl, vec2 gx, vec2 gy) {
  if (w.x >= 1.0) return own;
  vec3 c = own * w.x;
  if (w.y > 0.0) c += w.y * ${e}(textureGrad(uEcoArr1, tl, gx, gy).rgb);
  if (w.z > 0.0) c += w.z * ${e}(textureGrad(uEcoArr2, tl, gx, gy).rgb);
  if (w.w > 0.0) c += w.w * ${e}(textureGrad(uEcoArr3, tl, gx, gy).rgb);
  return c;
}
`}var Qt=Object.freeze({bare:.62,held:.8,from:500,full:150}),$=e=>Number.isInteger(e)?`${e}.0`:`${e}`;function $t(e,t){let n=Qt;return`// PEAKS1 (render/snowCapGlsl.js; the law is world/peaks/snowcap.js)
float snowCapAt(highp ivec2 p) {
  highp int s = uSnowWin.z - 1;
  return texelFetch(uSnowLines, clamp(p, ivec2(0), ivec2(s)), 0).a;
}
// the cap's line at a pixel-local point: the lattice's bilinear, snowLine's own
float snowCapLine(vec2 local) {
  vec2 rel = vec2(uEcoOrigin.xy - uSnowWin.xy) + local / ${$(t)};
  vec2 q = vec2(rel.x, -rel.y) / uSnowSet.z;
  vec2 fl = floor(q);
  highp ivec2 i = ivec2(fl);
  vec2 u = q - fl;
  return mix(mix(snowCapAt(i), snowCapAt(i + ivec2(1, 0)), u.x), mix(snowCapAt(i + ivec2(0, 1)), snowCapAt(i + ivec2(1, 1)), u.x), u.y);
}
// snowcap.js faceRock: steep (the normal's y under held, all of it at bare) and near or over the cap's line
float snowFaceRock(vec2 local, float y, vec3 n) {
  if (uSnowSet.y < 0.5) return 0.0;
  if (n.y >= ${$(n.held)}) return 0.0;   // a ledge holds it - the line unread (its four fetches spared on most ground)
  float line = snowCapLine(local);
  return (1.0 - smoothstep(${$(n.bare)}, ${$(n.held)}, n.y)) * smoothstep(line - ${$(n.from)}, line - ${$(n.full)}, y + uSnowSet.x);
}
float snowFace(inout vec3 tex, float c, vec2 local, float y, vec3 n, vec2 tuv, vec2 gx, vec2 gy) {
  float r = snowFaceRock(local, y, n);
  if (r <= 0.0) return c;
  tex = mix(tex, ${e}(textureGrad(uTileArr, vec3(tuv, ${$(3)}), gx, gy).rgb), r);
  return c * (1.0 - r);
}
`}export{s as $,He as A,ue as B,rt as C,Be as D,Qe as E,he as F,te as G,l as H,de as I,se as J,o as K,fe as L,ve as M,_e as N,ze as O,ge as P,ae as Q,pe as R,st as S,$e as T,ce as U,le as V,c as W,re as X,ne as Y,oe as Z,bt as _,Wt as a,_t as b,jt as c,V as d,Dt as f,Ct as g,wt as h,Yt as i,Re as j,Ve as k,At as l,Et as m,Zt as n,Pt as o,Tt as p,ie as q,Jt as r,U as s,$t as t,R as u,yt as v,E as w,ct as x,vt as y,u as z};