# The player guide (`/guide/`)

PLAYER-GUIDE, 2026-10-25 (OrbitalCS). A small static guide on the site for a player who has never read the repo:
five pages and three example class files, built and deployed with the site. Not a wiki, not a separate site.

## 1. What it is

| Page | What it says |
|---|---|
| `guide/index.html` | How to play: what the game is, getting the game data in (a folder on a desktop, the zip on a phone), making a first character, the first hour, the biggest differences from Daggerfall Unity, where to get help |
| `guide/races.html` | The eight races: homeland, what each race screen claims (TEXT.RSC 2000-2007, paraphrased), what the code gives it (resistances, weapon bonuses with worked numbers, climbing, swimming, warmth), and what that means in play |
| `guide/skills.html` | All 35 skills, grouped: what each does, its advancement multiplier, what counts as a use, and where DFO differs |
| `guide/attributes.html` | All 8 attributes, what to prioritise at creation, and every formula that reads each one |
| `guide/custom-classes.html` | The class builder (hit points, the dagger, the special picks, skills, reputations), export and import, and three example builds |

The landing page's foot links the guide (`index.html`, beside Terms and Privacy). Every page's bar names all five.

## 2. The shape: documents

The guide copies the Terms and the Privacy Policy (TERMS1, `test/ui/enhanced/terms1.test.js`): plain HTML
with no script, no file and no style of its own. At build, `scripts/landingHtml.mjs:"export const DOCUMENT_PATHS"`
names each page and the seam dresses it with the skin's tokens, the fonts, the icon, the digit five and the one
shared rule set `DOCUMENT_CSS` (`.docbar`, `.home`, `.doc`, `.caps`). The pages use those classes and bring no CSS of their own (the guide's rules sit in `DOCUMENT_CSS` under `.guide`, and its stone in `GUIDE_KIT_CSS`, below).
Each is a build input in `vite.config.js` (`guide`, `guideRaces`, `guideSkills`, `guideAttributes`, `guideClasses`).

**PLAYER-GUIDE-STYLE (optional, its own commit).** The guide wears the landing page's look; the Terms and the Privacy
Policy do not. The landing page divides it in two, and the guide keeps the division:

- **The shapes** - the framed panel (`index.html` `main > section` and its heading), the bordered card (`.cols > div`),
  the step box and its numeral (`.steps`, `.step`), the label/value rows a race's details stand in (`.qa`), the link buttons (`.doorlinks a`), the gem divider (`.rule`, `.gem`)
  and their 860px step-down - are copied value for value into `DOCUMENT_CSS` under `.guide` (each guide page's
  `<main>` is `class="doc guide"`). They are borders, room and the skin's tokens, so the documents' colour law
  (`terms1.test.js`) still holds.
- **The stone and brass** - the bevel, the grain, the corner studs, the raised and lit buttons - are the PLUS-SITE kit's,
  and its tones are the game's frame tones, not the skin's. So they are not copied: `scripts/landingHtml.mjs`
  `GUIDE_KIT_CSS` is the kit's own generator (`src/ui/enhanced/enhancedFrame.js` `siteKitCss`) called with the guide's
  selectors (a panel is a window, its heading the band, a card, a step or a label/value row a panel, a link a button, a step's numeral a
  well), and the build adds it to the guide's pages alone (`GUIDE_PATHS`), after the documents' rules, as the
  landing page's kit comes after its sheet. The generator now writes no rule for a role given no selectors (the guide
  has no primary press); the landing page's own kit is byte for byte what it was.

The jump links (races, skill groups) are the one layout of the guide's own: a grid of equal buttons filling the reading
column, four across, two under 600px.

`terms1.test.js` says so: every document is dressed as one, the guide's pages also wear the kit, and the legal pages
never do (two mutants, one each way). No night sky: the guide keeps the documents' quiet ground.

## 3. The facts are the code's

Every statement on the skills and attributes pages was read from the game's own code - `src/systems/skills.js`,
`src/systems/advancement.js`, `src/systems/statMods.js` and the formulas that read each skill and attribute - and
not from Daggerfall lore. Where a default-on vendored mod replaces a formula, the page gives the mod's number first
and Daggerfall Unity's as the alternative:

- Combat runs on the Physical Combat and Armor Overhaul by default and always online
  (`05-Combat/Physical-Combat-Overhaul.md`), so to-hit starts at the weapon skill x1.5, Dodging counts half, and
  the Strength bonus is (STR - 50)/10.
- Archery's draw time, bandages and the heavy-load penalty are Roleplay & Realism's, on by default
  (`06-Systems/Roleplay-Realism.md`).
- Master Skills (past 100), Enhanced Climbing, the online past-100 weapon and school bonuses, SWING-LAW and
  CAST-SPEED are DFO's own, and the pages say so where they apply.

**The governing attribute is a label.** Daggerfall Unity prints an abbreviated attribute beside each skill in its
skills list (`DaggerfallSkills.GetPrimaryStat`, read by `TextProvider.GetSkillSummary` and nowhere else); no formula
reads it, and DFO's skills list does not print it (`src/ui/charsheet.js:"GetSkillSummary's value token is GetLiveSkillValue"` prints a name and a value).
The skills page says so in one sentence and gives no skill a label; where a formula reads an attribute, the
entry lists it under **Reads**.

**The races are read the same way.** What a race does is `src/systems/races.js` (the resistance and immunity flags),
the two combat cores' racial arms (`src/combat/pcaao.js:"export function pcaaoRacialModifiers(attacker, weapon, player)"`,
the default; `formulas.js` `racialModifiers`, Daggerfall Unity's), the Khajiit's climbing and the Argonian's swim, and
`src/systems/survival/temperature.js` `RACE_TEMP`. What each race screen claims is the game's own text (TEXT.RSC
2000-2007), paraphrased and never quoted. Where a claim has no formula behind it (the Breton's and the High Elf's
spellcasting, the Dark Elf's magic, the Wood Elf's and the Khajiit's thievery), the page says so. The worked numbers
(every attribute at 50 and at 75) were computed by calling `pcaaoRacialModifiers` itself. The one sentence on looks is
dated: it states `04-Characters/Own-Heads.md` and `Head-Portraits.md` as of 2026-10-25.

## 4. The example builds

`public/guide/classes/*.dfclass.json` - Shieldbearer (+19 on the dagger), Hedge Mage (+4) and Sunscorned (-12, the
floor). They show the builder's rules, and the page makes no claim about how they play. They live under `public/`
because Vite copies `public/` into the build whole; a file beside the page would never reach the site. Each is
the builder's own document (`src/systems/customClass.js:"export function customClassDoc(c)"`), serialised as the
builder's Export writes it (`src/ui/enhanced/enhancedChargen.js:"const classDocText = () => JSON.stringify(customClassDoc(flow.custom), null, 2);"`),
and named by its `classFileName`. `test/tooling/doctrine.test.js` carries a row for each: text, no ARENA2 byte.

## 5. Pinned

`test/ui/enhanced/playerguide1.test.js`, its mutants in `tools/mutants/player-guide.json` (25, all dead):

- **The reference pages name what the game has.** Each skill is one element with
  `id="skill-<its SKILLS key, kebab-cased>"` whose first `<strong>` is the name `SKILL_NAMES` prints; each
  attribute is `id="attribute-<its STAT_KEYS_ORDER key>"`; each race is `id="race-<its RACE_KEYS key, kebab-cased>"`
  titled with its `RACE_TEMPLATES` name. An entry missing, invented or misnamed fails, and so does one on another
  reference page.
- **The pages are documents**: no script, no file, no style, the skip link, the way home, the title, and a bar
  naming all five with the right one current.
- **They ship**: build inputs, in `DOCUMENT_PATHS`, dressed by the seam, linked from the landing page's foot.
- **The class files are the game's**: each reads back through `parseCustomClassDoc` with nothing skipped, passes
  Create's gates (a name, twelve skills, a spent pool, balanced reputations, the dagger in range), and is exactly
  what the page offers.

`terms1.test.js`'s `DOCUMENT_PATHS` pin now names the guide's five paths beside the two legal ones, and its
`TERMS1-a-document-path-dropped` mutant is re-aimed at the split array.

**What is not pinned: the facts themselves.** The test holds the pages to the game's list of skills and
attributes, not to its formulas. A change to a formula that a page quotes - a multiplier, a default mod switch -
leaves the page wrong and the suite green. A change to a formula in `skills.js`, `advancement.js`, `pcaao.js`,
`formulas.js`, `spellcost.js`, `races.js`, `levelEven.js`, `temperature.js` or the movement motors should read the
matching entry here.

## 6. Not a departure

Nothing here changes how the game plays, so `01-Overview/Port-Ledger.md` is untouched.
