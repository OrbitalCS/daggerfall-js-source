// PLAYER-GUIDE (2026-10-25): THE PLAYER GUIDE - five documents under guide/ (how to play, races, skills, attributes,
// custom classes) and the example class files under public/guide/classes/. Held here:
//
//   THE REFERENCE PAGES NAME WHAT THE GAME HAS - NO MORE, NO LESS. guide/skills.html gives every skill in SKILL_NAMES
//     one entry, guide/attributes.html every attribute in STAT_KEYS_ORDER one and guide/races.html every race in
//     RACE_KEYS one, each under an id read from the game's own key (`skill-short-blade`, `attribute-luck`,
//     `race-dark-elf`) and titled with the name the game prints. A skill or
//     attribute added to the game and not to its page fails here, and so does an entry for one the game does not
//     have, or one titled with another's name.
//   THE PAGES ARE DOCUMENTS, as the Terms are (terms1.test.js): no script, no file and no style of their own, each
//     bar naming all five, built and dressed by the same seam, and linked from the landing page's foot.
//   THE CLASS FILES ARE THE GAME'S OWN. Every file under public/guide/classes/ reads back through the builder's own
//     door (parseCustomClassDoc) with nothing left out, passes the gates Create would hold it to, and is the file
//     the custom-classes page offers - public/, because Vite copies it into the build whole.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { SKILL_KEYS, SKILL_NAMES, SKILL_COUNT } from '../../../src/systems/skills.js';
import { STAT_KEYS_ORDER } from '../../../src/systems/statMods.js';
import { RACE_KEYS, raceByKey } from '../../../src/systems/races.js';
import {
  parseCustomClassDoc, difficultyPoints, repPointsToDistribute, DIFFICULTY_MIN, DIFFICULTY_MAX, STAT_DEFAULT,
} from '../../../src/systems/customClass.js';
import { totalAdjust } from '../../../src/systems/specialAdvantages.js';
import { DOCUMENT_PATHS, transformDocument, landingHtml } from '../../../scripts/landingHtml.mjs';

const read = (p) => readFileSync(new URL(`../../../${p}`, import.meta.url), 'utf8');

/** The five pages, in the bar's order: file, title, and the href every bar uses. */
const PAGES = Object.freeze([
  { file: 'guide/index.html', title: 'How to play', href: '../guide/' },
  { file: 'guide/races.html', title: 'Races', href: '../guide/races.html' },
  { file: 'guide/skills.html', title: 'Skills', href: '../guide/skills.html' },
  { file: 'guide/attributes.html', title: 'Attributes', href: '../guide/attributes.html' },
  { file: 'guide/custom-classes.html', title: 'Custom classes', href: '../guide/custom-classes.html' },
]);
const CLASS_DIR = 'public/guide/classes';

/** The game's key as the page spells its id: ShortBlade -> short-blade, HandToHand -> hand-to-hand. */
const kebab = (key) => key.replace(/(?<=[a-z])(?=[A-Z])/g, '-').toLowerCase();

/** Every entry on a page under `prefix`: its id's tail and the name in the entry's first <strong>. */
function entries(html, prefix) {
  const out = [];
  const re = new RegExp(`<(\\w+)[^>]*\\bid="${prefix}-([^"]*)"[^>]*>([\\s\\S]*?)</\\1>`, 'g');
  for (const [, , id, body] of html.matchAll(re)) out.push({ id, name: body.match(/<strong>([^<]*)<\/strong>/)?.[1] ?? body.replace(/<[^>]+>/g, '').trim() });
  return out;
}

test('PLAYER-GUIDE: the skills page has one entry for every skill the game has, and none for any other (mutant: an entry dropped)', () => {
  const found = entries(read('guide/skills.html'), 'skill');
  const want = SKILL_KEYS.map((key, id) => ({ id: kebab(key), name: SKILL_NAMES[id] }));
  assert.equal(want.length, SKILL_COUNT, 'the game\'s own count');
  assert.deepEqual(found.map((e) => e.id).sort(), want.map((e) => e.id).sort(), 'the page\'s skills are the game\'s skills');
  for (const w of want) {
    const on = found.filter((e) => e.id === w.id);
    assert.equal(on.length, 1, `${w.name}: one entry, not ${on.length}`);
    assert.equal(on[0].name, w.name, `skill-${w.id}: titled with the name the game prints`);
  }
});

test('PLAYER-GUIDE: the attributes page has one entry for every attribute, and none for any other (mutant: an entry renamed)', () => {
  const found = entries(read('guide/attributes.html'), 'attribute');
  assert.deepEqual(found.map((e) => e.id).sort(), [...STAT_KEYS_ORDER].sort(), 'the page\'s attributes are the game\'s eight');
  for (const key of STAT_KEYS_ORDER) {
    const on = found.filter((e) => e.id === key);
    assert.equal(on.length, 1, `${key}: one entry, not ${on.length}`);
    assert.equal(on[0].name, key[0].toUpperCase() + key.slice(1), `attribute-${key}: titled with its name`);
  }
});

test('PLAYER-GUIDE: the races page has one entry for every race the game has, and none for any other (mutant: a race dropped)', () => {
  const found = entries(read('guide/races.html'), 'race');
  assert.deepEqual(found.map((e) => e.id).sort(), RACE_KEYS.map(kebab).sort(), 'the page\'s races are the game\'s eight');
  for (const key of RACE_KEYS) {
    const on = found.filter((e) => e.id === kebab(key));
    assert.equal(on.length, 1, `${key}: one entry, not ${on.length}`);
    assert.equal(on[0].name, raceByKey(key).name, `race-${kebab(key)}: titled with the race's name`);
  }
});

test('PLAYER-GUIDE: no reference page carries another\'s entries (mutant: a skill on the attributes page)', () => {
  const kinds = { 'guide/skills.html': 'skill', 'guide/attributes.html': 'attribute', 'guide/races.html': 'race' };
  for (const [file, own] of Object.entries(kinds)) {
    for (const other of Object.values(kinds)) {
      if (other !== own) assert.deepEqual(entries(read(file), other), [], `no ${other} entry on ${file}`);
    }
  }
});

test('PLAYER-GUIDE: the pages are DOCUMENTS - no script, no file and no style of their own; each bar names all five (mutant: a script added)', () => {
  for (const page of PAGES) {
    const html = read(page.file);
    assert.doesNotMatch(html, /<script/i, `${page.file}: runs no script`);
    assert.doesNotMatch(html, /<img|<link\b|<style|\sstyle=/i, `${page.file}: references no file and brings no style - the skin is put in at build`);
    assert.match(html, /<a class="skip" href="#main">Skip to content<\/a>/, `${page.file}: a keyboard reader can skip the bar`);
    assert.match(html, /<main id="main" class="doc">/);
    assert.match(html, /<a class="home" href="\.\.\/">DFO Online<\/a>/, `${page.file}: the way home is relative`);
    assert.match(html, new RegExp(`<title>${page.title} - DFO Online</title>`), `${page.file}: the tab says which page`);
    // the BAR, not the page: a body that links a page in the same words is not the bar naming it
    const bar = html.match(/<header class="docbar">([\s\S]*?)<\/header>/)?.[1] ?? '';
    for (const other of PAGES) {
      const current = other === page ? ' aria-current="page"' : '';
      assert.ok(bar.includes(`<a href="${other.href}"${current}>${other.title}</a>`), `${page.file}: its bar names ${other.title}${current ? ' as the page it is' : ''}`);
    }
  }
});

test('PLAYER-GUIDE: the pages ship - build inputs, dressed by the seam, linked from the landing page (mutant: an input dropped)', async () => {
  const input = Object.values((await import('../../../vite.config.js')).default.build.rollupOptions.input);
  const { handler } = landingHtml().transformIndexHtml;
  for (const page of PAGES) {
    assert.ok(input.includes(page.file), `${page.file} works under npm run dev and never ships`);
    const path = `/${page.file}`;
    assert.ok(DOCUMENT_PATHS.includes(path), `${path} is a document`);
    assert.deepEqual(handler('<html><head></head><body></body></html>', { path }), transformDocument('<html><head></head><body></body></html>'), `${path} is not dressed as a document`);
  }
  const end = read('index.html').match(/<footer class="end">([\s\S]*?)<\/footer>/)?.[1] ?? '';
  assert.match(end, /<a href="\.\/guide\/">Guide<\/a>/, 'the landing page\'s foot links the guide');
});

test('PLAYER-GUIDE: every example class is the builder\'s own file - read back whole, fit for Create, and offered by its page (mutant: a field corrupted)', () => {
  const files = readdirSync(new URL(`../../../${CLASS_DIR}/`, import.meta.url)).filter((f) => f.endsWith('.json')).sort();
  assert.ok(files.length >= 1, 'the page has classes to offer');
  for (const f of files) {
    const r = parseCustomClassDoc(read(`${CLASS_DIR}/${f}`));
    assert.equal(r.ok, true, `${f}: ${r.error}`);
    assert.deepEqual(r.skipped, [], `${f}: a special pick the builder would not take`);
    const v = r.value;
    // ChargenFlow.customExit's four gates (a name, every skill set, a balanced pool, the dagger in range) and the
    // reputation window's zero - an example that loads and cannot be created is no example
    assert.ok(v.name.length > 0, `${f}: a name`);
    assert.ok(v.skills.every((s) => s != null), `${f}: all twelve skills`);
    assert.equal(STAT_DEFAULT * STAT_KEYS_ORDER.length - STAT_KEYS_ORDER.reduce((n, k) => n + v.stats[k], 0), 0, `${f}: the attribute pool is spent`);
    assert.equal(repPointsToDistribute(v.reps), 0, `${f}: the reputations balance`);
    const dp = difficultyPoints(v.hp, totalAdjust(v.advantages), totalAdjust(v.disadvantages));
    assert.ok(dp >= DIFFICULTY_MIN && dp <= DIFFICULTY_MAX, `${f}: the dagger in range, not ${dp}`);
  }
  const offered = [...read('guide/custom-classes.html').matchAll(/<a href="classes\/([^"]+)" download>/g)].map(([, f]) => f).sort();
  assert.deepEqual(offered, files, 'the page offers exactly the files that ship');
});
