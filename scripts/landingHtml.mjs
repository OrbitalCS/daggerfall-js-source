// THE LANDING PAGE'S BUILD SEAM (U60).
//
// index.html at the site root is a page in front of the game: what it
// is, how to play, credits, Play. It is a static document - it mounts
// no game code, so it cannot call injectEnhancedStyle() - and it has
// to be the SAME product as the menu behind it, which is exactly the
// drift the skin module was written to stop. So the page carries no
// palette and no font URL of its own. This plugin puts the skin's
// ENHANCED_TOKENS block and ENHANCED_FONTS_URL into it at serve/build
// time, the way build-tag-meta puts the sha into every page, and the
// page's own <style> only ever says var(--brass). Its fonts are the
// skin's BRAND face and DATA face through the skin's own URL builder.
//
// The transform is a pure function over the html so the test can run
// it without Vite and assert the tokens on the page ARE the skin's.
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { ENHANCED_TOKENS, ENHANCED_FONTS_URL } from '../src/ui/enhanced/enhancedStyle.js';
import { PIXELIFY_FIVE_FACE } from '../src/ui/pixelifyFive.js';   // TERMS1: the documents take the five from its home
import { SUPPORT_MARKS_CSS } from '../src/ui/supportAsks.js';   // SUPPORT1: the asks' marks, the game door's own pixels
import { SITE_KIT_CSS, siteKitCss } from '../src/ui/enhanced/enhancedFrame.js';   // PLUS-SITE: the game's stone and brass, cut without a picture; PLAYER-GUIDE-STYLE: the guide's own cut of it

/** U63: the landing page asks for THE SKIN'S OWN REQUEST, not a subset.
 *  It used to load the brand + data faces, because the site was set in
 *  Grenze Gotisch and the menu was not; PX1 made the menu pixel art and
 *  U63 made the site follow, so both now want Jacquard 12 and Pixelify
 *  Sans. One URL for both pages means one cache entry and no way for the
 *  site to be set in a face the game does not have. */
export const LANDING_FONTS_URL = ENHANCED_FONTS_URL;

/** The page this plugin is for - only the root document. `/play/index.html`
 *  is the game and gets nothing from here but the icon. */
export const LANDING_PATH = '/index.html';
export const GAME_PATH = '/play/index.html';

/** THE ICON: the section fitting - a brass diamond on ink - as an SVG
 *  data URI, drawn from the tokens so it cannot disagree with the
 *  page. No file, so nothing for the doctrine allow-list to weigh. */
export function iconTag(tokens = ENHANCED_TOKENS) {
  const hex = (name) => tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
  const ink = hex('ink'); const brass = hex('brass');
  if (!ink || !brass) return null;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">`
    + `<rect width="32" height="32" fill="${ink}"/><path d="M16 5l11 11-11 11L5 16z" fill="${brass}"/></svg>`;
  return { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: `data:image/svg+xml,${encodeURIComponent(svg)}` }, injectTo: 'head' };
}

/** The build sha `scripts/buildTag.mjs` stamped at prebuild, or '' when
 *  it has not run (a dev serve - the stamp is build-only and nothing
 *  verifies dev). Shared with build-tag-meta, which used to read it
 *  itself. */
export function readBuildSha(read = (p) => readFileSync(p, 'utf8')) {
  try {
    return read('src/buildTag.js').match(/'([^']*)'/)?.[1] ?? '';
  } catch {
    return '';
  }
}

/* ── THE LEDGER STRIP (U60c) ──────────────────────────────────
   Two figures beside the sha, COUNTED at build rather than typed:
   the size of the suite and the size of the port. Both come from the
   tree the build is made of, the way the sha does, so the page can
   never claim a number the repository does not hold. The test count
   is the declared tests: top-of-line `test(` calls in every *.test.js
   under test/ (test/ui/enhanced/landing.test.js walks the tree to hold it). */
export function countTests(dir = 'test', read = (p) => readFileSync(p, 'utf8')) {
  let n = 0;
  for (const f of readdirSync(dir, { recursive: true })) {   // TIDY5: every folder under test/
    if (!f.endsWith('.test.js')) continue;
    n += (read(`${dir}/${f}`).match(/^test\(/gm) || []).length;
  }
  return n;
}

/** Lines of JavaScript under src/ - TRACKED files only (`git ls-files`),
 *  so a scratch file or the build's own stamp cannot inflate it.
 *  NO-GIT (2026-10-10, Dudey's dev serve from a downloaded zip: "fatal: not a git repository" - the landing page an
 *  Internal server error): a tree with no git counts every .js under src/ instead - the zip's own files. */
export function countSrcLines(read = (p) => readFileSync(p, 'utf8')) {
  let files;
  try {
    files = execFileSync('git', ['ls-files', 'src'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n');
  } catch {
    files = readdirSync('src', { recursive: true }).map((f) => `src/${String(f).replace(/\\/g, '/')}`);
  }
  files = files.filter((f) => f.endsWith('.js'));
  let n = 0;
  for (const f of files) n += read(f).split('\n').length - 1;
  return n;
}

/** The figures as the page shows them: grouped digits, no decimals. */
export const figure = (n) => new Intl.NumberFormat('en-US').format(n);

/* ── THE NIGHT, IN CSS (U63, 2026-08-27) ──────────────────────────
   The menu's home face stands on `ui/pixelGround.js`: a vertical
   gradient quantized through a six-step RAMP by 4x4 Bayer thresholds,
   two drifting fog blobs, and stars scattered on a seeded LCG so every
   load sees the same sky. The landing page cannot run it - it is a
   DOCUMENT, with no script and no canvas, and that is a pin - so the
   same sky is built here out of CSS and injected: the ramp as a
   hard-stopped gradient, the blobs as two radial gradients at the same
   relative homes, the dither as a 2px checker, and the stars as a
   box-shadow list from THE SAME SEED AND THE SAME LCG. The constants
   are pinned against pixelGround's own text, so the site's sky cannot
   drift from the menu's. What it does not have is the drift and the
   twinkle: those need a clock, and a clock needs a script. */
export const GROUND_RAMP = ['#07080d', '#0b0d14', '#10141d', '#161c27', '#1e2632', '#28313f'];
export const GROUND_SEED = 0xda66e4;

/** pixelGround's own generator, at the page's scale: the upper 55% of
 *  the sky, density by area, a bright quarter. Returns CSS box-shadow
 *  parts, deterministic for a given size. */
export function groundStars(w = 1920, h = 1080, scale = 4) {
  const W = Math.ceil(w / scale), H = Math.ceil(h / scale);
  let seed = GROUND_SEED;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 0x100000000;
  const n = Math.round((W * H) / 1440);
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = (rnd() * W) | 0, y = (rnd() * H * 0.55) | 0;
    const bright = rnd() < 0.25;
    rnd();                                  // the phase draw, kept so the stream matches pixelGround's
    const b = bright ? 200 : 120;
    out.push(`${x * scale}px ${y * scale}px 0 0 rgb(${b},${b},${b - 10})`);
  }
  return out;
}

/** The whole ground as one <style> block: ramp, fog, dither, stars. */
export function groundCss(w, h) {
  const stops = GROUND_RAMP.map((c, i) => {
    const a = Math.round((i / GROUND_RAMP.length) * 100), b = Math.round(((i + 1) / GROUND_RAMP.length) * 100);
    return `${c} ${a}% ${b}%`;
  }).join(', ');
  return `.night {
  background:
    radial-gradient(46% 34% at 78% 35%, rgba(40,49,63,0.55) 0%, transparent 100%),
    radial-gradient(58% 42% at 30% 72%, rgba(40,49,63,0.75) 0%, transparent 100%),
    linear-gradient(180deg, ${stops});
}
.night::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    repeating-linear-gradient(0deg, rgba(255,255,255,0.028) 0 2px, transparent 2px 4px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.028) 0 2px, transparent 2px 4px);
}
.night::after {
  content: ''; position: absolute; left: 0; top: 0; width: 4px; height: 4px;
  pointer-events: none; border-radius: 0;
  box-shadow: ${groundStars(w, h).join(', ')};
}`;
}

/** What the page needs to be a landing page: a <style> holding the
 *  skin's tokens, the skin's font link, and the build stamp filled in.
 *  Returns Vite's { html, tags } shape. The stamp is a data attribute
 *  on the element the page styles as the build line, and the page hides
 *  it when empty, so a dev serve shows no stamp rather than a lie. */
export function transformLanding(html, {
  sha = '', tokens = ENHANCED_TOKENS, fonts = LANDING_FONTS_URL, stats = null,
} = {}) {
  // Every empty stamp on the page, not the first: the rail's foot hides
  // on a phone and the page's end carries the same line for that case.
  // A stamp that links to `.../commit/` gets the sha on the end of it.
  let stamped = sha
    ? html.replace(/<(\w+)([^>]*)\sdata-build=""([^>]*)>\s*<\/\1>/g,
      (_m, tag, pre, post) => {
        const linked = post.replace(/href="([^"]*\/commit\/)"/, (_h, base) => `href="${base}${sha}"`);
        return `<${tag}${pre} data-build="${sha}"${linked}>${sha}</${tag}>`;
      })
    : html;
  // The ledger figures: every `data-stat="tests"` / `data-stat="lines"`
  // element gets its number. Absent figures leave the element empty,
  // and the page hides an empty one, as it hides an empty stamp.
  for (const [key, value] of Object.entries(stats ?? {})) {
    stamped = stamped.replace(new RegExp(`<(\\w+)([^>]*)\\sdata-stat="${key}"([^>]*)>\\s*<\\/\\1>`, 'g'),
      (_m, tag, pre, post) => `<${tag}${pre} data-stat="${key}"${post}>${figure(value)}</${tag}>`);
  }
  return {
    html: stamped,
    tags: [
      { tag: 'style', attrs: { id: 'enhanced-tokens' }, children: tokens, injectTo: 'head-prepend' },
      // A viewport, not a page: `.night` is fixed, so the field covers
      // one screen. 1920x1080 gives the same 90 stars pixelGround draws
      // at that size - the same law at the same density.
      { tag: 'style', attrs: { id: 'pixel-ground' }, children: groundCss(1920, 1080), injectTo: 'head' },
      // SUPPORT1: the corner asks' marks - the same rules the game's door draws its two icons with, so the page
      // cannot ask under a drawing the menu does not have (the page's own style holds only the plaques around them)
      { tag: 'style', attrs: { id: 'support-marks' }, children: SUPPORT_MARKS_CSS, injectTo: 'head' },
      // PLUS-SITE: the kit's roles, after the page's own sheet - the page gives each box its edge and room, the kit its
      // stone and brass, winning by order at the same weight as it does in the game
      { tag: 'style', attrs: { id: 'plus-kit' }, children: SITE_KIT_CSS, injectTo: 'head' },
      ...skinTags(tokens, fonts),
    ],
  };
}

/** The tags every page of the site takes after its own style. Shared by
 *  the landing page and the documents (TERMS1), so neither can come to
 *  ask for a face the other does not. */
function skinTags(tokens, fonts) {
  const ink = tokens.match(/--ink:\s*(#[0-9a-fA-F]{6})/)?.[1];
  return [
    // The phone's address bar takes the page's ground - read from the
    // same block rather than typed, so it cannot disagree with it.
    ...(ink ? [{ tag: 'meta', attrs: { name: 'theme-color', content: ink }, injectTo: 'head' }] : []),
    ...(iconTag(tokens) ? [iconTag(tokens)] : []),
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' }, injectTo: 'head' },
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }, injectTo: 'head' },
    { tag: 'link', attrs: { rel: 'stylesheet', href: fonts }, injectTo: 'head' },
  ];
}

/* ── THE DOCUMENTS (TERMS1, 2026-09-28) ──────────────────────────────
   The Terms of Service and the Privacy Policy, which the Create account
   form links to and a new account must tick. Documents as the landing
   page is one - no script, no file of their own - so they take the same
   skin from here: its tokens, its fonts request and its icon, and the
   digit five from its home in the game (src/ui/pixelifyFive.js) rather
   than a second copy of the landing page's inline one.

   THEIR RULES LIVE HERE, ONCE, because there are two pages and one look.
   They are the landing page's own idioms read with nothing around them -
   its face with no ligatures (U63's "Ales"), its parchment on its ink,
   its links, skip link and caps - and every colour is a var() or one the
   skin itself uses, the law the landing page is held to. NO NIGHT SKY and
   no plaque: a document read to the end wants a quiet ground and a
   measure a line can be followed across. */
// PLAYER-GUIDE (2026-10-25): the player guide's pages are documents too - the same skin, the same one rule set.
export const DOCUMENT_PATHS = Object.freeze([
  '/terms/index.html', '/privacy/index.html',
  '/guide/index.html', '/guide/races.html', '/guide/skills.html', '/guide/attributes.html', '/guide/custom-classes.html',
]);

export const DOCUMENT_CSS = `* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100dvh;
  color: #d8cfae; background: #0a0c11;
  font-family: 'Pixelify Five', 'Pixelify Sans', monospace; font-size: 16px; line-height: 1.6;
  -webkit-font-smoothing: none;
  font-variant-ligatures: none; font-feature-settings: 'liga' 0, 'clig' 0;
}
a { color: #d8cfae; text-decoration: none; border-bottom: 2px solid #7d7460; overflow-wrap: anywhere; }
a:hover, a:focus-visible { outline: none; color: rgb(243,239,44); border-color: var(--brass); text-shadow: 2px 2px 0 rgb(93,77,12); }
.skip { position: absolute; left: 12px; top: -60px; padding: 10px 14px; background: var(--brass); color: #0a0c11; z-index: 10; border: 0; }
.skip:focus { top: 12px; }
.caps { font-size: 14px; letter-spacing: 0.12em; text-transform: uppercase; color: #7d7460; }
.docbar { max-width: 760px; margin: 0 auto; padding: 20px 24px 8px; display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px 24px; }
.docbar .home { border: 0; font-size: 18px; letter-spacing: 0.18em; text-transform: uppercase; }
.docbar nav { display: flex; flex-wrap: wrap; gap: 6px 22px; }
.docbar nav a { border: 0; color: #7d7460; }
.docbar nav a[aria-current="page"] { color: var(--brass); }
.doc { max-width: 760px; margin: 0 auto; padding: 8px 24px max(56px, env(safe-area-inset-bottom)); }
.doc h1, .doc h2 { font-weight: 400; text-shadow: 2px 2px 0 rgba(0,0,0,0.7); overflow-wrap: anywhere; }
.doc h1 { font-size: clamp(24px, 4.2vw, 34px); line-height: 1.2; margin: 16px 0 12px; }
.doc h2 { font-size: 19px; line-height: 1.35; margin: 32px 0 10px; color: var(--brass); }
.doc p { margin: 0 0 12px; }
.doc ul { margin: 0 0 12px; padding-left: 24px; }
.doc li { margin: 0 0 6px; }
.doc strong { font-weight: 500; }
/* PLAYER-GUIDE-STYLE: the guide's pages alone (<main class="doc guide">), so the Terms and the Privacy Policy stay
   plain. The landing page's own shapes, value for value (index.html: main > section, .cols > div, .steps/.step,
   .qa, .doorlinks, .rule, .gem, and its 860px step-down): the page gives each box its edge and room, and the stone and
   brass are the kit's (GUIDE_KIT_CSS below, injected on the guide's pages alone) - the landing page's own division.
   No night sky: the documents' quiet ground stays. */
.guide h3 { font-weight: 400; margin: 0; text-shadow: 4px 4px 0 rgba(0,0,0,0.7); }
.guide .panel { position: relative; border: 4px solid; padding: 0 30px 34px; margin: 0 0 44px; text-align: center; }
.guide .panel > h2 { font-size: clamp(36px, 5vw, 52px); line-height: 1; margin: 0 -30px; padding: 24px 16px 20px; color: #d8cfae; }
.guide .panel > .rule { margin: 18px auto 26px; }
.guide .panel > ul, .guide .panel > ol { text-align: left; }
.guide .card { border: 2px solid; padding: 16px 18px 4px; margin: 0 0 12px; text-align: left; }
.guide .card h3 { font-size: 24px; margin-bottom: 6px; }
.guide .steps { list-style: none; margin: 0 auto; padding: 0; counter-reset: step; text-align: left; max-width: 64ch; }
.guide .step { display: grid; grid-template-columns: 54px 1fr; gap: 0 18px; padding: 16px 18px 4px; margin: 0 0 12px; border: 2px solid; }
.guide .step::before { counter-increment: step; content: counter(step); display: flex; align-items: center; justify-content: center;
  width: 54px; height: 54px; border: 2px solid; font-size: 36px; line-height: 1; color: var(--brass); text-shadow: 2px 2px 0 rgba(0,0,0,0.8); }
.guide .qa { display: flex; flex-direction: column; gap: 12px; text-align: left; margin: 24px 0 0; }
.guide .qa > div { display: grid; grid-template-columns: 220px 1fr; gap: 6px 24px; padding: 16px 18px; border: 2px solid; }
.guide .qa dt { font-size: 24px; line-height: 1.1; text-shadow: 2px 2px 0 rgba(0,0,0,0.7); }
.guide .qa dd { margin: 0; color: #a89f88; font-size: 15px; }
.guide .doorlinks { margin-top: 28px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.guide .doorlinks a { justify-content: center; text-align: center; }
.guide .doorlinks a, .guide a[download] { display: inline-flex; align-items: center; min-height: 44px; padding: 6px 14px; border: 2px solid; color: #d8cfae; }
.guide .rule { display: flex; align-items: center; gap: 16px; width: min(420px, 70vw); margin: 30px auto 32px; }
.guide .rule::before, .guide .rule::after { content: ''; flex: 1; height: 2px; background: #7d7460; opacity: 0.55; }
.guide .gem {
  position: relative; width: 2px; height: 2px; background: var(--ruby);
  box-shadow:
    0 -4px 0 var(--brass), 0 4px 0 var(--brass), -4px 0 0 var(--brass), 4px 0 0 var(--brass),
    -2px -2px 0 var(--ruby), 2px -2px 0 var(--ruby), -2px 2px 0 var(--ruby), 2px 2px 0 var(--ruby);
}
@media (max-width: 600px) { .guide .doorlinks { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 860px) {
  .guide .panel { padding: 0 16px 24px; }
  .guide .panel > h2 { margin: 0 -16px; }
  .guide .step { grid-template-columns: 44px 1fr; gap: 0 14px; padding: 14px 14px 4px; }
  .guide .step::before { width: 44px; height: 44px; font-size: 28px; }
  .guide .qa > div { grid-template-columns: 1fr; }
}
`;

/** PLAYER-GUIDE-STYLE: the guide's pages - the documents that also wear the landing page's stone and brass. */
export const GUIDE_PATHS = Object.freeze(DOCUMENT_PATHS.filter((p) => p.startsWith('/guide/')));
/** The landing page's kit, cut for the guide's boxes: a framed panel is a window, its heading the band, a card or a
 *  step a panel, a link button pressable, a step's numeral a well. The same generator and tones as the site and the
 *  game, so the three cannot carve two stones. */
export const GUIDE_KIT_CSS = siteKitCss({
  window: ['.guide .panel'], header: ['.guide .panel > h2'], panel: ['.guide .card', '.guide .step', '.guide .qa > div'],
  button: ['.guide .doorlinks a', '.guide a[download]'], primary: [], well: ['.guide .step::before'],
});

/** A document's head: the skin's tokens, the five, the documents' rules,
 *  then what every page takes. The page itself is not rewritten. */
export function transformDocument(html, { tokens = ENHANCED_TOKENS, fonts = LANDING_FONTS_URL, kit = null } = {}) {
  return {
    html,
    tags: [
      { tag: 'style', attrs: { id: 'enhanced-tokens' }, children: tokens, injectTo: 'head-prepend' },
      { tag: 'style', attrs: { id: 'document-style' }, children: `${PIXELIFY_FIVE_FACE}\n${DOCUMENT_CSS}`, injectTo: 'head' },
      // PLAYER-GUIDE-STYLE: the guide's pages alone - after the document's rules, as the landing page's kit is after its sheet
      ...(kit ? [{ tag: 'style', attrs: { id: 'guide-kit' }, children: kit, injectTo: 'head' }] : []),
      ...skinTags(tokens, fonts),
    ],
  };
}

export function landingHtml() {
  return {
    name: 'landing-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (ctx.path === GAME_PATH) return { html, tags: [iconTag()].filter(Boolean) };   // the tab's mark, nothing else
        if (DOCUMENT_PATHS.includes(ctx.path)) return transformDocument(html, GUIDE_PATHS.includes(ctx.path) ? { kit: GUIDE_KIT_CSS } : {});   // TERMS1: the Terms and the Privacy Policy; PLAYER-GUIDE-STYLE: the guide's stone
        if (ctx.path !== LANDING_PATH) return html;
        // BUILD ONLY for the stamp, as build-tag-meta is: on a dev serve
        // src/buildTag.js holds whatever the last build left behind, and
        // a page that names a commit it was not built from is a lie.
        return transformLanding(html, {
          sha: ctx.server ? '' : readBuildSha(),
          // Counted fresh on every serve and build: they are true whenever
          // they are counted, unlike the sha, which is true only of a build.
          stats: { tests: countTests(), lines: countSrcLines() },
        });
      },
    },
  };
}
