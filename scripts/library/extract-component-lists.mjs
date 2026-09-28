// Builds src/data/library/components.json from the official Components List
// PDFs. Needs `pdftotext` (poppler, shipped with Git for Windows).
//
//   node scripts/library/extract-component-lists.mjs [pdfDir...]
//
// The PDFs are large and not committed; by default they are read from
// src/assets/1.2_Compressed_versions and src/assets/1.5_Compressed_versions.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const DEFAULT_DIRS = ["src/assets/1.2_Compressed_versions", "src/assets/1.5_Compressed_versions"];
const OUTPUT = "src/data/library/components.json";

// Component list file -> Library box key (SKU name as it comes from the API).
const BOXES = {
  Components_List_Corebox: "Corebox",
  Components_List_Apocalypse: "Apocalypse",
  Components_List_Awakenings: "Awakenings",
  Components_List_Lordwrath: "Lordwrath",
  Components_List_Luccanor: "Ruin of Luccanor",
  Components_List_The_Shadow_World: "Shadow World",
  Components_List_Fallen_Sisters: "Fallen Sisters",
  "Components_List_Companions_&_Furniture": "Companions & Fornitures",
  Components_List_Hero_Pack: "Hero Pack",
  Components_List_Lorien: "Lorien",
  Component_List_Riders_of_Apocalyse: "Four Horseman",
  Components_List_Monster_Pack: "Monster Pack",
  Components_List_Spoils_Of_War: "Spoils of War",
  Components_List_Desert_Of_Hellscar: "Desert of Hellscar",
  Components_List_Undead_Dragon: "Rise of The Undead Dragon",
};

// "Skeleton knight Rookie - Standard/ Alternate" -> "Skeleton knight"
// ("Figther" is a typo found in the source PDFs).
const monsterName = (text) =>
  text
    .replace(/\s*-\s*Standard.*$/i, "")
    .replace(/\s+(Rookie|Fighter|Figther|Veteran|Champion|Minion|Elite|Standard)\b.*$/i, "");

const titleCase = (text) =>
  text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.;,]+$/, "")
    .replace(/\b([a-z])([a-z'’]*)/gi, (_, first, rest) => first.toUpperCase() + rest.toLowerCase())
    .replace(/\b(Of|The|And|In|On|At|To|A|An|Of|For|From|With)\b/g, (word, _m, offset) =>
      offset === 0 ? word : word.toLowerCase(),
    );

const splitList = (text) =>
  text
    .split(/,|\/| and |&/i)
    .map((part) => part.trim())
    .filter(Boolean);

// Each rule reads one "Type - Name ..." entry into a category.
const RULES = [
  { re: /^Hero skill - ([^-]+?) -/i, add: (m, box) => box.heroes.add(titleCase(m[1])) },
  { re: /^(?:\d+\s+)?Heroes? - (.+)$/i, add: (m, box) => splitList(m[1]).forEach((hero) => box.heroes.add(titleCase(hero))) },
  // "Hero class - Assassin - Acrobatics" or "Hero class - Affliction - Sorcerer":
  // the class is the side shared by its skill trees, resolved later.
  { re: /^Hero class - (.+?) - ([^-]+)$/i, add: (m, box) => box.classCards.push([titleCase(m[1]), titleCase(m[2])]) },
  { re: /^Classboard - (.+)$/i, add: (m, box) => splitList(m[1]).forEach((cls) => box.heroClasses.add(titleCase(cls))) },
  { re: /^Overlord - (.+)$/i, add: (m, box) => box.bosses.add(titleCase(m[1])) },
  // Miniature lists: "4 Pets - Drumm, Jokull;" or "Monsters - Abomination".
  { re: /^(?:\d+\s+Monsters?|Monsters) - (.+)$/i, add: (m, box) => splitList(m[1]).forEach((monster) => box.monsters.add(titleCase(monster))) },
  { re: /^(?:\d+\s+Companions?|Companions) - (.+)$/i, add: (m, box) => splitList(m[1]).forEach((c) => box.companions.add(titleCase(c))) },
  { re: /^(?:\d+\s+Pets?|Pets) - (.+)$/i, add: (m, box) => splitList(m[1]).forEach((pet) => box.pets.add(titleCase(pet))) },
  { re: /^Epic item - (.+)$/i, add: (m, box) => box.epicItems.add(titleCase(m[1])) },
  { re: /^Boss - (.+)$/i, add: (m, box) => box.bosses.add(titleCase(m[1])) },
  // The boss can be either side ("Boss attack - Plague horseman - Charge" or
  // "Boss attack - Earthquake - Wermunggdir"); resolved after all entries.
  { re: /^Boss attack - (.+?) - (.+)$/i, add: (m, box) => box.bossAttacks.push([titleCase(m[1]), titleCase(m[2])]) },
  { re: /^White monster - (.+)$/i, add: (m, box) => box.whiteMonsters.add(titleCase(monsterName(m[1]))) },
  { re: /^Gray monster - (.+)$/i, add: (m, box) => box.grayMonsters.add(titleCase(monsterName(m[1]))) },
  { re: /^Black monster - (.+)$/i, add: (m, box) => box.blackMonsters.add(titleCase(monsterName(m[1]))) },
  { re: /^(?:Scenario )?commander - (.+)$/i, add: (m, box) => box.commanders.add(titleCase(m[1].split(/ - |\//)[0])) },
  { re: /^Companion - (.+)$/i, add: (m, box) => box.companions.add(titleCase(m[1].split(/\//)[0])) },
  { re: /^Pet - (.+)$/i, add: (m, box) => box.pets.add(titleCase(m[1])) },
  {
    re: /^Door (\d+) - (.+?) - Chapter (\d+)(?: - (.+))?$/i,
    add: (m, box) =>
      box.doors.set(`${m[3]}-${m[1]}-${m[2]}`, {
        door: Number(m[1]),
        name: titleCase(m[2]),
        chapter: Number(m[3]),
        chapterName: m[4] ? titleCase(m[4]) : "",
      }),
  },
];

const pdfText = (file) =>
  execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", file, "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

// Two-column layout: split lines on wide gaps and drop FRONT/BACK labels.
const entriesOf = (text) =>
  text
    .replace(/FRONT|BACK/g, "   ")
    .split("\n")
    .flatMap((line) => line.split(/\s{2,}/))
    .map((part) => part.trim())
    .filter((part) => part.includes(" - "));

// The QUANTITY block lists totals per component type ("CARDS - 226").
const summaryOf = (text) => {
  const start = text.indexOf("QUANTITY");
  if (start < 0) return {};
  const end = text.indexOf("\f", start);
  const block = text.slice(start, end < 0 ? undefined : end);
  const summary = {};
  for (const match of block.matchAll(/^\s*([A-Z][A-Z ,&()+]+?)\s+-\s+(\d+)/gm)) {
    summary[titleCase(match[1].replace(/\(.*\)/, ""))] = Number(match[2]);
  }
  return summary;
};

// Hero names known to the app, used to fix typos in the PDFs ("Bihitte").
const KNOWN_HEROES = readdirSync("src/data/content", { recursive: true })
  .filter((file) => /[\\/]hero[\\/][^\\/]+\.ts$/.test(file))
  .map((file) => readFileSync(join("src/data/content", file), "utf8").match(/name = "([^"]+)"/)?.[1])
  .filter(Boolean)
  // "Vacren (Warlord)" -> "Vacren"
  .map((name) => name.replace(/\s*\(.*\)$/, ""));

const distance = (a, b) => {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = current;
    }
  }
  return row[b.length];
};

// Only fixes near-identical spellings: same first letter, one letter apart.
const canonicalHero = (name) => {
  const lower = name.toLowerCase();
  if (KNOWN_HEROES.some((hero) => hero.toLowerCase() === lower)) return name;
  return (
    KNOWN_HEROES.find((hero) => hero[0].toLowerCase() === lower[0] && distance(hero.toLowerCase(), lower) <= 1) ??
    name
  );
};

// The Four Horsemen are spelled inconsistently across the PDFs.
const HORSEMEN = { plague: "Plague Horseman", famine: "Famine Horseman", war: "War Horseman", death: "Death Horsewoman" };
const bossName = (name) => HORSEMEN[/^(\w+) Horse(?:wo)?m[ae]n$/i.exec(name)?.[1].toLowerCase()] ?? name;

const dirs = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_DIRS;
const files = dirs.flatMap((dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".pdf")).map((f) => join(dir, f)) : [],
);

const result = {};
for (const file of files) {
  const key = basename(file, ".pdf").replace(/_compressed$/, "");
  const boxName = BOXES[key];
  if (!boxName) continue;

  const text = pdfText(file).replace(/\r/g, "");
  const box = {
    heroes: new Set(),
    heroClasses: new Set(),
    epicItems: new Set(),
    bosses: new Set(),
    whiteMonsters: new Set(),
    grayMonsters: new Set(),
    blackMonsters: new Set(),
    monsters: new Set(),
    commanders: new Set(),
    companions: new Set(),
    pets: new Set(),
    doors: new Map(),
    bossAttacks: [],
    classCards: [],
  };
  // Miniature lists like "1 Plague Horsemen 1 Death Horsewoman" (the Riders).
  for (const match of text.matchAll(/\b\d+\s+((?:Plague|Death|Famine|War) Horse(?:wo)?m[ae]n)\b/g)) {
    box.bosses.add(titleCase(match[1]));
  }
  for (const entry of entriesOf(text)) {
    for (const rule of RULES) {
      const match = entry.match(rule.re);
      if (match) {
        rule.add(match, box);
        break;
      }
    }
  }

  // "Type - A - B" pairs where the owner (boss, class) can be either side:
  // it is the side whose names repeat within this box.
  const owners = (pairs) => {
    const repeated = (side) => {
      const counts = new Map();
      pairs.forEach((pair) => counts.set(pair[side], (counts.get(pair[side]) ?? 0) + 1));
      return [...counts].filter(([name, count]) => count > 1 && !/status card/i.test(name)).map(([name]) => name);
    };
    const [first, second] = [repeated(0), repeated(1)];
    return first.length >= second.length ? first : second;
  };
  owners(box.bossAttacks).forEach((name) => box.bosses.add(name));
  owners(box.classCards).forEach((name) => box.heroClasses.add(name));
  delete box.bossAttacks;
  delete box.classCards;
  box.bosses = new Set([...box.bosses].map(bossName));

  box.heroes = new Set([...box.heroes].map(canonicalHero));
  // Uncolored miniatures only list monsters not already sorted by color
  // (ignoring plurals: "Corrupted Farmers" is "Corrupted Farmer").
  const singular = (name) => name.toLowerCase().replace(/s$/, "");
  const colored = new Set([...box.whiteMonsters, ...box.grayMonsters, ...box.blackMonsters].map(singular));
  box.monsters = new Set([...box.monsters].filter((name) => !colored.has(singular(name))));

  result[boxName] = {
    source: basename(file),
    summary: summaryOf(text),
    ...Object.fromEntries(
      Object.entries(box).map(([category, values]) => [
        category,
        values instanceof Map
          ? [...values.values()].sort((a, b) => a.chapter - b.chapter || a.door - b.door)
          : [...values].sort((a, b) => a.localeCompare(b)),
      ]),
    ),
  };
  console.log(`${boxName.padEnd(28)} ${Object.entries(result[boxName]).filter(([, v]) => Array.isArray(v)).map(([k, v]) => `${k}:${v.length}`).join(" ")}`);
}

mkdirSync("src/data/library", { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(result, null, 2) + "\n");
console.log(`\nWrote ${Object.keys(result).length} boxes to ${OUTPUT}`);
