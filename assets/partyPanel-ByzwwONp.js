const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./headPortraits-Bu5vauYB.js","./rolldown-runtime-DK3Fl9T5.js","./uiPrefs-Bk07lQeg.js","./settings-CRQjSgqj.js","./textManager-DTzj7yyh.js","./preload-helper-CRzLMJPS.js","./equip-D4R-xCtO.js","./textureReplacement-BG4sDubU.js","./color32Order-Q-RIhgi8.js","./touchDevice-5D3lZdzc.js","./soundClips-CX_DKKTc.js","./mapsTables-tbuxu9Iz.js","./blocksFile-eaD_pfLd.js","./puddleMask-SgJGpUuA.js","./terrainSampler-Dt_f7oZx.js","./professionLaw-APSgUj2g.js","./mat4-CPsgC_7A.js","./gameDate-Btk2fwl3.js"])))=>i.map(i=>d[i]);
import{t as e}from"./color32Order-Q-RIhgi8.js";import{Cn as t,O as n,Sn as r,xo as i}from"./talk-C4L_jD2V.js";import{t as a}from"./preload-helper-CRzLMJPS.js";import{o}from"./blocksFile-eaD_pfLd.js";import"./professionLaw-APSgUj2g.js";import{t as s}from"./touchDevice-5D3lZdzc.js";import{r as c,t as l}from"./pixelifyFive-DKI2nEMs.js";import{n as u}from"./headPortraits-Bu5vauYB.js";import"./spellMaker-C-GiutfF.js";var d=e=>Array.isArray(e)?e.map(e=>`${e.i}:${e.r}:${+!!e.d}:${e.n}`).join(`|`):``;function f(e){let t=String(e??``).trim().split(/\s+/).filter(Boolean);return t.length?t.length===1?t[0].slice(0,3):t.slice(0,3).map(e=>e[0].toUpperCase()).join(``):`?`}function p(e,t){let n=Number(t?.h);return!Number.isFinite(n)||e==null||!Number.isFinite(e)||e<=0||t?.rest||t?.rs?0:n>e?Math.round(n-e):0}var m=`dagger-party-style`,h=`★`,g=`- / -`,_=`?`,v=32,y=34,b=`
${l}
/* AUDIT SOC C6: 92, NOT 40. The FPS read-out is the other thing in this corner (ui/fpsCounter.js: top 8, z 9) and
   it is FOUR LINES tall with the renderer's counts on - measured at 76px in Chromium, bottom edge 84 - so a HUD at
   40 put its first card's portrait straight through the middle of it. 92 clears the read-out with eight pixels to
   spare; the touch value stays 76, which is the number that clears the touch layer's own top-right buttons. */
/* GUIDE4: ...and it steps under the quest tracker's card, which stands on the same line (ui/quest/questTracker.js publishes
   its height as --dfquest-h, 0 with no card), so the two never cover each other. */
.dfparty { position: fixed; right: calc(8px + env(safe-area-inset-right, 0px)); top: calc(92px + var(--dfquest-h, 0px) + env(safe-area-inset-top, 0px));
  width: 200px; max-width: calc(100vw - 16px); z-index: 5; pointer-events: none;
  /* AUDIT GUIDE U17: stepped under the card, a full party is cut at the window's foot - never pushed off it */
  max-height: calc(100dvh - 100px - var(--dfquest-h, 0px) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px)); overflow: hidden;
  display: flex; flex-direction: column; gap: 3px;
  ${c} color: var(--bone, #e9e4d9);
  -webkit-user-select: none; user-select: none; }
/* below the touch layer's own top-right row of buttons (ui/touch/touch.js: top 16, 44 tall) */
.dfparty.touch { top: calc(76px + var(--dfquest-h, 0px) + env(safe-area-inset-top, 0px)); }
/* AUDIT SOC C7: A PHONE HAS NO TOP-RIGHT CORNER TO SPARE. At 430x860 with the touch skin the HUD covered most of every
   chat peek line and the open friends panel under it besides. Narrower AND out of that corner: the HUD drops to the
   bottom right, above the touch layer's own jump and sheathe column (ui/touch/touch.js: bottom 16, 48 tall, so 76 clears
   them), where nothing is written and the finger never goes (the HUD takes no pointer). */
@media (max-width: 560px) {
  .dfparty, .dfparty.touch { width: 180px; top: auto; bottom: calc(76px + env(safe-area-inset-bottom, 0px)); }
}
/* AUDIT PARTY8: A PHONE HELD SIDEWAYS is wider than 560 and shorter than the stack - seven rows from top 76 ran to
   438 on a 430-tall screen, over the touch layer's jump and sheathe row (bottom 16, 48 tall). Capped so the bottom
   clears that row by the same 76 the portrait rule keeps; what does not fit is cut, never drawn over the buttons. */
@media (max-height: 560px) and (min-width: 561px) {
  .dfparty.touch { max-height: calc(100dvh - 152px - var(--dfquest-h, 0px) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px)); overflow: hidden; }
}
/* AUDIT PRE-MERGE 1003 U4: A BOUT'S VERSUS BAR (ui/arena/arenaHud.js, 560 wide, centred under the compass) reaches this corner on
   a screen under 980 - its half and this list's 208 from the edge - and stood on the list there; the list steps aside
   while the bar stands, as the quest card does. A phone's list is at the foot (above), clear of it. */
@media (min-width: 561px) and (max-width: 980px) { body:has(.arena-hud.on) .dfparty { visibility: hidden; } }
.dfparty-title { font-size: 11px; letter-spacing: .18em; text-transform: uppercase; text-align: right;
  color: var(--dim, #9a9486); text-shadow: 2px 2px 0 rgba(0,0,0,0.85); }
.dfparty-count { margin-left: 6px; letter-spacing: 0; color: var(--bone, #e9e4d9); font-variant-numeric: tabular-nums; }
/* AUDIT WK-U6: MY COMPANIONS ARE NEVER THE FIRST CUT. Under the height cap (a phone held sideways, a short window under
   the quest card) the panel cuts at its foot what does not fit, and my companions' cards stood last - a full party cut
   them whole, every time. They stand in a list of their own after the seats', never shrunk; the seats' list shrinks
   instead and is cut at its own foot, the order kept. Being cut, it reaches up into the title's line by as much as it
   is drawn back, so a heal's "+N" rising off the first seat (.dfparty-heal, 12px over its card) is not cut with it. */
.dfparty-list { display: flex; flex-direction: column; gap: 3px; min-height: 0; overflow: hidden; padding-top: 14px; margin-top: -14px; }
.dfparty-mates { display: flex; flex-direction: column; gap: 3px; flex: none; }
.dfparty-list:empty, .dfparty-mates:empty { display: none; }
/* PARTY8-B: QUIET ROWS - no plate behind a card (no border, no fill, no blur: seven boxed cards were fourteen edges
   over the world). A row is a portrait, a name and thin lines under it; the text carries the HUD's hard shadow. */
.dfparty-card { position: relative; display: flex; gap: 6px; padding: 3px 0; }   /* relative: PARTY-BUFFS' heal floats off it */
/* away: the whole card goes quiet - the portrait too, so a grey face is never mistaken for a live one */
.dfparty-card.away { opacity: .46; filter: grayscale(1); }
.dfparty-card.mate .dfparty-thin { display: none; }   /* COMPANION-KIT: the crew carry no stamina or magicka */
.dfparty-face { flex: none; box-sizing: content-box; width: 32px; height: 34px; overflow: hidden;   /* AUDIT PARTY8: the sheet's border-box took the 1px border out of the plate and squashed a 31-wide head */
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(180deg, #232830, #14171b); border: 1px solid var(--iron, #2b323b);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.6); }
.dfparty-facepix { display: none; max-width: 100%; max-height: 100%; image-rendering: pixelated; }
.dfparty-face.has .dfparty-facepix { display: block; }
.dfparty-face.has .dfparty-facemark { display: none; }
.dfparty-facemark { font-size: 13px; font-weight: 600; color: var(--dim, #9a9486); opacity: .45; }
/* AUDIT WK-U4: A COMPANION'S LETTER IS HIS ROLE, WRITTEN - not the hole a face is still on its way to, which the dim
   mark at .45 is (1.9:1 on the plate). In the name's own bone, whole (11.7:1 on the plate's lighter stop); his role
   line under the bar is a member's place line, at its weight (it was dimmed again, 2.5:1 over snow). The mark is the
   plate's, read by nobody: the card's name says who he is (aria-hidden on the node). */
.dfparty-card.mate .dfparty-facemark { opacity: 1; color: var(--bone, #e9e4d9); }
.dfparty-body { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 3px; }
.dfparty-head { display: flex; align-items: baseline; gap: 4px; min-width: 0; text-shadow: 2px 2px 0 rgba(0,0,0,0.85); }
.dfparty-name { min-width: 0; flex: 0 1 auto; font-weight: 600; font-size: 12px; line-height: 1.2;
  color: ${r}; letter-spacing: 0;   /* AUDIT FONT3 L7: a long name loses no more of itself to the tracking */ overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dfparty-lead { flex: none; font-size: 11px; line-height: 1; color: var(--brass, #c08a3e); }
.dfparty-lead.off { display: none; }
/* the health digits, at the row's right edge: drawn ONLY while the seat is under half health (.low), in the
   health's own red - a healthy party is names and bars and nothing else. The node is written for every pose. */
.dfparty-hp { margin-left: auto; flex: none; font-size: 11px; line-height: 1.2; color: #e2554c; font-variant-numeric: tabular-nums; }
.dfparty-hp.off { display: none; }
.dfparty-hp.blank { color: var(--dim, #9a9486); }   /* AUDIT PARTY8: a seat with no pose yet - dashes, dim */
/* the health is the one real bar; stamina and magicka are two hairlines under it, side by side - their shape, not
   their weight. The tracks are square-cornered and black, the enhanced HUD's own. */
.dfparty-bars { display: flex; flex-direction: column; gap: 3px; }
.dfparty-vital { display: flex; align-items: center; }
.dfparty-track { flex: 1; min-width: 0; height: 5px; overflow: hidden;
  background: rgba(0, 0, 0, .65); box-shadow: 0 0 0 1px rgba(0, 0, 0, .5); }
.dfparty-thin { display: flex; gap: 3px; }
.dfparty-thin .dfparty-vital { flex: 1; min-width: 0; }
.dfparty-thin .dfparty-track { height: 2px; }
.dfparty-fill { height: 100%; width: 0%; }
/* the skin's own hues - the blood red, a moss green, a dusk blue - not the web's primaries */
.dfparty-vital.health .dfparty-fill { background: linear-gradient(180deg, #d9463c, #7d1b15); }
.dfparty-vital.fatigue .dfparty-fill { background: linear-gradient(180deg, #4faa58, #2d6b34); }
.dfparty-vital.magicka .dfparty-fill { background: linear-gradient(180deg, #5d74d8, #33418f); }
/* a hit: the health fill flares for a beat, so the eye is pulled to the seat that took it. Two names for one
   animation - a fresh hit on a fill still flaring takes the other name, which restarts it with no reflow forced. */
@keyframes dfparty-hit { 0% { filter: brightness(2.6); } 100% { filter: brightness(1); } }
@keyframes dfparty-hit2 { 0% { filter: brightness(2.6); } 100% { filter: brightness(1); } }
.dfparty-fill.hit { animation: dfparty-hit .6s ease-out; }
.dfparty-fill.hit2 { animation: dfparty-hit2 .6s ease-out; }
/* the digits beside a bar are kept on the node (a pin reads them) and drawn nowhere: the bar says the shape */
.dfparty-num { display: none; }
/* the place line: drawn only for a seat that is NOT where I am (.off otherwise) - a party walking together says
   nothing under the bars; the one who wandered into a dungeon says where. An away seat says when it was last seen. */
.dfparty-where { font-size: 11px; line-height: 1; letter-spacing: 0;   /* AUDIT FONT3 L2: the floor's 11px on a 1.2 line took a row past PARTY8's 48px budget */ color: var(--dim, #9a9486); text-shadow: 2px 2px 0 rgba(0,0,0,0.85);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dfparty-where.off { display: none; }
/* PARTY-BUFFS (2026-09-27, Tabitha: "buff timers or SOME sort of indicator that we have placed a buff on a party teammate
   [preferably on their party portrait]"): the member's own live effects, under the bars - the spell's icon (its words
   while the art is on its way) with the rounds left over its corner, a debuff outlined in the health's red. Drawn
   only while there are any, so a party with nothing on it is still names and bars. */
.dfparty-fx { display: flex; flex-wrap: wrap; gap: 2px; }
.dfparty-fx.off { display: none; }
.dfparty-fxe { position: relative; width: 16px; height: 16px; flex: none; box-sizing: border-box;
  background: rgba(0,0,0,.55); box-shadow: 0 0 0 1px rgba(0,0,0,.6); }
.dfparty-fxe.debuff { box-shadow: 0 0 0 1px #e2554c; }
.dfparty-fxe img { display: block; width: 16px; height: 16px; image-rendering: pixelated; }
.dfparty-fxw { display: block; font-size: 7px; line-height: 16px; text-align: center; color: var(--bone, #e9e4d9); overflow: hidden; }
.dfparty-fxr { position: absolute; right: -1px; bottom: -2px; font-size: 7px; line-height: 1; color: #fff;
  text-shadow: 1px 1px 0 #000, -1px 0 0 #000; font-variant-numeric: tabular-nums; }
/* ...and a heal the member gained: "+N" in green, rising off the health bar and gone (Tabitha: "floating Heal numbers") */
@keyframes dfparty-heal { 0% { opacity: 0; transform: translateY(4px); } 15% { opacity: 1; } 100% { opacity: 0; transform: translateY(-14px); } }
.dfparty-heal { position: absolute; left: 40px; top: 2px; font-size: 11px; font-weight: 600; color: #7ee07a;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.85); animation: dfparty-heal 1.2s ease-out forwards; pointer-events: none; }
@media (prefers-reduced-motion: reduce) { .dfparty-heal { animation-name: dfparty-heal-still; } @keyframes dfparty-heal-still { 0%, 80% { opacity: 1; } 100% { opacity: 0; } } }
`;function x(e=document){if(e.getElementById?.(`dagger-party-style`))return;let t=e.createElement(`style`);t.id=m,t.textContent=b,(e.head??e.body).append(t)}var S=Object.freeze([Object.freeze({key:`health`,now:`h`,max:`hm`,label:`Health`}),Object.freeze({key:`fatigue`,now:`f`,max:`fm`,label:`Stamina`}),Object.freeze({key:`magicka`,now:`m`,max:`mm`,label:`Magicka`})]),C=e=>`${e?.race??`Breton`}|${e?.gender===`female`?`female`:`male`}|${Math.max(0,Math.min(9,(e?.face??0)|0))}`;function ee(e){if(!e)return``;let t=String(e.loc??``).trim(),n=e.in===1?`dungeon`:e.in===2?`inside`:``;return t&&n?`${t} - ${n}`:t||n||`the wilderness`}function w(e,t){let n=Number(t),r=Number(e);return!Number.isFinite(n)||n<=0||!Number.isFinite(r)?0:Math.max(0,Math.min(100,Math.round(r/n*100)))}var T=50,E=(e,t)=>!!e&&!!t&&e.px===t.px&&e.py===t.py&&(e.in??0)===(t.in??0)&&((e.in??0)!==2||(e.bk??null)===(t.bk??null)),D=e=>e?`${e.px},${e.py},${e.in??0},${e.bk??``}`:``;function O(e,t){let n=Number(e),r=Number(t);return!Number.isFinite(n)||!Number.isFinite(r)?g:`${Math.max(0,Math.round(n))} / ${Math.max(0,Math.round(r))}`}var k=null,A=!1;function j(){if(!u())return``;if(!k)return A||(A=!0,a(()=>import(`./headPortraits-Bu5vauYB.js`).then(e=>e.t).then(e=>{k=e}),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]),import.meta.url).catch(()=>{})),``;let e=k.headDataStamp();return e?`|mw${e}`:``}async function M(e){let{poseHeadImage:t,HEAD_RECORD:n}=await a(async()=>{let{poseHeadImage:e,HEAD_RECORD:t}=await import(`./headPortraits-Bu5vauYB.js`).then(e=>e.t);return{poseHeadImage:e,HEAD_RECORD:t}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]),import.meta.url),r=await t(e,{px:n.w*n.scale,ph:n.h*n.scale});if(!r)return null;let i=new Uint8ClampedArray(r.width*r.height*4);return i.set(r.data),{width:r.width,height:r.height,colors:i,scale:n.scale}}var N=`TFAC00I0.RCI`;function P({fetchBytes:t,palette:n}={}){let r=new Map,a=e=>{let a=r.get(e);return a||(a=(async()=>{let r=new i;return r.load(await t(e),e,n),r})(),r.set(e,a)),a};return async r=>{let i=u()?await M(r).catch(()=>null):null;if(i)return i;if(!t||!n)return null;if(Number.isInteger(r?.common)&&r.common>=0){let t=(await a(N)).getDFBitmap(r.common,0);return t?e(t,n):null}let s=o(r?.race??`Breton`,r?.gender===`female`?`female`:`male`),c=Math.max(0,Math.min(9,(r?.face??0)|0)),l=(await a(s.heads)).getDFBitmap(c,0);return l?e(l,n):null}}var F=e=>`${e?.key}|${e?.name}|${e?.role}|${Math.round(Number(e?.h)||0)}/${Math.round(Number(e?.hm)||0)}|${d(e?.fx)}`;function I({social:e,doc:r=document,art:i=null,faceLoader:a=null,touch:o=s(),here:c=null,fxIcon:l=null,companions:u=null}={}){let m=u;x(r);let h=l??(e=>{try{return n(e)}catch{return null}}),_=()=>c?.()??null,v=()=>D(_()),y=a??P(i??{}),b=(e,t,n)=>{let i=r.createElement(e);return i.className=t,n!=null&&(i.textContent=n),i},T=(e,t)=>{e.textContent!==t&&(e.textContent=t)},k=(e,t)=>{e.className!==t&&(e.className=t)},A=(e,t)=>{e.style.width!==t&&(e.style.width=t)},M=b(`div`,`dfparty${o?` touch`:``}`);M.setAttribute(`role`,`group`),M.setAttribute(`aria-label`,`Party`);let N=b(`div`,`dfparty-title`,`Party`),I=b(`span`,`dfparty-count`,``);N.append(I);let L=b(`div`,`dfparty-list`),R=b(`div`,`dfparty-mates`);M.append(N,L,R),r.body.append(M),M.style.display=`none`;let z=new Map,B=new Map,V=new Map,H=-1,U=-1,W=``,G=!1,K=!1,q=null,J=()=>{try{let e=m?.()??[];return Array.isArray(e)?e:[]}catch{return[]}},Y=!0,X=!1,Z=null,Q=null,te=null,ne=()=>{let e=!G&&K?``:`none`;M.style.display!==e&&(M.style.display=e)},re=e=>{let t=!!e;if(t!==G){if(G=t,G)for(let e of z.values())e.hpH=null;G||(q=null),ne()}},$=(e,t,n)=>{if(e.drawn===t||!n?.width||!n?.height||n.colors?.byteLength!==n.width*n.height*4)return;let r=e.pix.getContext?.(`2d`);if(!r?.createImageData||!r.putImageData)return;e.pix.width=n.width,e.pix.height=n.height;let i=n.scale>0?1/n.scale:Math.max(1,Math.min(Math.floor(32/n.width),Math.floor(34/n.height)));e.pix.style.width=`${n.width*i}px`,e.pix.style.height=`${n.height*i}px`,e.pix.style.imageRendering=n.scale>0?`auto`:``;let a=r.createImageData(n.width,n.height);a.data.set(new Uint8ClampedArray(n.colors.buffer)),r.putImageData(a,0,0),e.drawn=t,k(e.facebox,`dfparty-face has`)},ie=(e,t,n)=>{if(B.has(t)){let n=B.get(t);n&&$(e,t,n);return}let r=V.get(t);r||(r=Promise.resolve().then(()=>y(n)).then(e=>(V.delete(t),B.set(t,e??null),e??null),e=>(V.delete(t),B.set(t,null),X||(X=!0,console.warn(`[party] portrait art unavailable:`,e?.message??e)),null)),V.set(t,r)),r.then(n=>{Y&&n&&e.faceKey===t&&$(e,t,n)})},ae=()=>{let e=b(`div`,`dfparty-card`),t=b(`div`,`dfparty-face`),n=r.createElement(`canvas`);n.className=`dfparty-facepix`;let i=b(`span`,`dfparty-facemark`,`?`);i.setAttribute(`aria-hidden`,`true`),t.append(n,i);let a=b(`div`,`dfparty-body`),o=b(`div`,`dfparty-head`),s=b(`span`,`dfparty-name`),c=b(`span`,`dfparty-lead off`,`★`);c.setAttribute(`title`,`Party leader`),c.setAttribute(`aria-label`,`Party leader`);let l=b(`span`,`dfparty-hp off`,g);o.append(s,c,l);let u=b(`div`,`dfparty-where off`),d=b(`div`,`dfparty-bars`),f=S.map(e=>{let t=b(`div`,`dfparty-vital ${e.key}`),n=b(`div`,`dfparty-track`),r=b(`div`,`dfparty-fill`),i=b(`span`,`dfparty-num`,g);return n.append(r),t.append(n,i),t.setAttribute(`role`,`group`),t.setAttribute(`aria-label`,e.label),{row:t,fill:r,num:i}}),p=b(`div`,`dfparty-thin`);p.append(f[1].row,f[2].row),d.append(f[0].row,p);let m=b(`div`,`dfparty-fx off`);a.append(o,d,m,u),e.append(t,a);for(let e of f)e.fill.addEventListener?.(`animationend`,()=>k(e.fill,`dfparty-fill`));return{node:e,facebox:t,pix:n,facemark:i,name:s,lead:c,where:u,hp:l,vitals:f,fx:m,fxKey:`#`,faceKey:null,drawn:null,away:null,hpPct:null,hpH:null,hmH:null,hitFlip:!1}},oe=(e,t)=>{let n=Array.isArray(t)?t:[],i=n.map(e=>h(e.i)),a=`${d(n)}#${i.map(e=>+!!e).join(``)}`;a!==e.fxKey&&(e.fxKey=a,e.fx.replaceChildren?.(),n.forEach((t,n)=>{let a=b(`span`,`dfparty-fxe${t.d?` debuff`:``}`),o=i[n];if(o){let e=r.createElement(`img`);e.src=o,e.alt=``,a.append(e)}else a.append(b(`span`,`dfparty-fxw`,f(t.n)));a.append(b(`span`,`dfparty-fxr`,String(t.r))),a.setAttribute(`title`,`${t.n||`Spell`} - ${t.r} rounds${t.d?` (harmful)`:``}`),e.fx.append(a)}),k(e.fx,`dfparty-fx${n.length?``:` off`}`))},se=(e,t)=>{let n=b(`span`,`dfparty-heal`,`+${t}`);e.node.append(n);let r=()=>n.remove?.();n.addEventListener?.(`animationend`,r),setTimeout(r,1500)},ce=(n,r,i)=>{let a=r.p??null;k(n.node,`dfparty-card${r.online?``:` away`}`);let o=r.name??``;n.name.textContent!==o&&(T(n.name,o),n.name.setAttribute(`title`,o)),k(n.lead,`dfparty-lead${i?``:` off`}`),n.away=r.online?null:{seen:r.seen},T(n.where,r.online?ee(a):t(!1,r.seen,e.now())),k(n.where,`dfparty-where${!r.online||a&&!E(a,_())?``:` off`}`);for(let e=0;e<S.length;e++){let t=S[e],r=n.vitals[e];A(r.fill,`${a?w(a[t.now],a[t.max]):0}%`),T(r.num,a?O(a[t.now],a[t.max]):g)}T(n.hp,n.vitals[0].num.textContent);let s=a?w(a.h,a.hm):null;k(n.hp,`dfparty-hp${s==null&&r.online?` blank`:s!=null&&s<50&&r.online?``:` off`}`);let c=a&&Number.isFinite(Number(a.h))?Number(a.h):null;c!=null&&n.hpH!=null&&c<n.hpH&&r.online&&(n.hitFlip=!n.hitFlip,k(n.vitals[0].fill,`dfparty-fill ${n.hitFlip?`hit`:`hit2`}`));let l=r.online?p(n.hpH,a):0;l>0&&se(n,l),n.hpH=c,oe(n,r.online?a?.fx:null),n.hpPct=s;let u=a?`${C(a)}${j()}`:null;u===n.faceKey?u&&!n.drawn&&B.get(u)&&$(n,u,B.get(u)):(n.faceKey=u,n.drawn=null,k(n.facebox,`dfparty-face`),u&&ie(n,u,a))},le=()=>{let n=v();if(n!==W){W=n;let t=_();for(let[n,r]of z){if(r.away||n.startsWith(`companion:`))continue;let i=e.party?.members?.find(e=>e.acct===n)?.p??null;k(r.where,`dfparty-where${i&&!E(i,t)?``:` off`}`)}}for(let n of z.values())n.away&&T(n.where,t(!1,n.away.seen,e.now()));ue()},ue=()=>{let e=null;try{e=Z?.()??null}catch{e=null}let t=e?[...e].map(([e,t])=>`${e}|${t.num}|${t.cls}|${t.mark}|${t.ring==null?``:Math.round(t.ring*100)}|${t.where??``}|${t.title}`).join(`#`):``;if(t!==Q){Q=t;for(let[t,n]of z){if(t.startsWith(`companion:`))continue;let r=e?.get(t)??null;if(r&&!n.egNum){let e=n.name.parentNode??n.name.parent;n.egNum=b(`span`,`dfparty-egn`),n.egMark=b(`span`,`dfparty-egm`),n.egRing=b(`div`,`dfparty-egring`),n.egMark.setAttribute(`aria-hidden`,`true`),e?.insertBefore?.(n.egNum,n.name),e?.insertBefore?.(n.egMark,n.lead),n.facebox.append(n.egRing),n.node.addEventListener?.(`click`,()=>{String(n.node.className).split(/\s+/).includes(`eg-tap`)&&te?.(t)})}if(!n.egNum)continue;T(n.egNum,r?r.num:``),T(n.egMark,r?r.mark:``);let i=String(n.node.className).split(/\s+/).filter(e=>e&&!e.startsWith(`eg-`)).join(` `);k(n.node,r?.cls?`${i} ${r.cls}`:i),n.node.setAttribute(`title`,r?.title??``);let a=r?.ring==null?``:String(Math.round(r.ring*1e3)/1e3);n.egRing.style.getPropertyValue?.(`--eg-ring`)!==a&&n.egRing.style.setProperty?.(`--eg-ring`,a),r?.where?(T(n.where,r.where),k(n.where,`dfparty-where`),n.egWhere=!0):n.egWhere&&(n.egWhere=!1,H=-1)}}},de=(e,t)=>{k(e.node,`dfparty-card mate`);let n=String(t.name??``);e.name.textContent!==n&&(T(e.name,n),e.name.setAttribute(`title`,n)),k(e.lead,`dfparty-lead off`),T(e.where,String(t.role??``)),k(e.where,`dfparty-where${t.role?``:` off`}`);let r=Number(t.h),i=Number(t.hm),a=Number.isFinite(r)&&Number.isFinite(i)&&i>0?{h:r,hm:i}:null;A(e.vitals[0].fill,`${a?w(a.h,a.hm):0}%`),T(e.vitals[0].num,a?O(a.h,a.hm):g),T(e.hp,e.vitals[0].num.textContent);let o=a?w(a.h,a.hm):null;k(e.hp,`dfparty-hp${o!=null&&o<50?``:` off`}`),a&&e.hmH!=null&&a.hm!==e.hmH&&(e.hpH=null),e.hmH=a?a.hm:null,a&&e.hpH!=null&&a.h<e.hpH&&(e.hitFlip=!e.hitFlip,k(e.vitals[0].fill,`dfparty-fill ${e.hitFlip?`hit`:`hit2`}`));let s=a?p(e.hpH,a):0;s>0&&se(e,s),e.hpH=a?a.h:null,oe(e,t.fx),e.hpPct=o;let c=(String(t.role??t.name??`?`).trim()[0]??`?`).toUpperCase();e.facemark&&e.facemark.textContent!==c&&(e.facemark.textContent=c)},fe=()=>{W=v();let t=e?.others?.()??[],n=e?.party?.leader??null,r=J();q=r.map(F).join(`#`),K=t.length>0||r.length>0,T(I,e?.party?`${e?.party?.members?.length??t.length+1}/8`:``);let i=new Set([...t.map(e=>e.acct),...r.map(e=>`companion:${e.key}`)]);for(let[e,t]of z)i.has(e)||(t.node.remove?.(),z.delete(e));let a=[];for(let e of t){let t=z.get(e.acct);t||(t=ae(),z.set(e.acct,t)),ce(t,e,e.acct===n),a.push(t.node)}let o=[];for(let e of r){let t=`companion:${e.key}`,n=z.get(t);n||(n=ae(),z.set(t,n)),de(n,e),o.push(n.node)}let s=(e,t)=>e.children.length===t.length&&t.every((t,n)=>e.children[n]===t);s(L,a)||L.replaceChildren(...a),s(R,o)||R.replaceChildren(...o),ne(),Q=null,ue()};return{root:M,list:L,mates:R,setHidden:re,render({covered:t=!1}={}){if(!Y||(re(t),G))return;let n=J().map(F).join(`#`);e?n===q&&e.version===H&&(e.poseVersion??0)===U?le():(H=e.version,U=e.poseVersion??0,fe()):n!==q&&fe()},setCompanions(e){m=typeof e==`function`?e:null,q=null},setSpire(e,t=null){Z=typeof e==`function`?e:null,te=typeof t==`function`?t:null,Q=null},cardCount:()=>z.size,cardFor:e=>z.get(e)??null,destroy(){Y&&(Y=!1,z.clear(),M.remove?.())}}}export{N as COMMON_FACES_FILE,_ as FACE_BLANK_MARK,y as FACE_BOX_H,v as FACE_BOX_W,T as HP_DIGITS_BELOW,h as LEADER_MARK,b as PARTY_CSS,m as PARTY_STYLE_ID,S as PARTY_VITALS,g as VITALS_BLANK,w as barPercent,F as companionKey,P as createFaceLoader,I as createPartyPanel,C as faceKeyOf,j as headSuffix,D as hereKeyOf,x as injectPartyStyle,ee as placeText,O as vitalsText,E as withMe};