// Builds src/data/library/downloads.json from the CGS Chronicles of Drunagor
// page: every downloadable PDF grouped by Library box and language.
//
//   node scripts/library/extract-downloads.mjs [saved-page.html]
//
// Without an argument the page is fetched from wearecgs.com.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const PAGE_URL = "https://wearecgs.com/chronicles-of-drunagor/";
const OUTPUT = "src/data/library/downloads.json";

// Headings and button labels on the page -> Library box (SKU name).
const BOX_BY_TEXT = [
  [/luccanor/i, "Ruin of Luccanor"],
  [/shadow world/i, "Shadow World"],
  [/undead dragon/i, "Rise of The Undead Dragon"],
  [/hellscar/i, "Desert of Hellscar"],
  [/monster pack/i, "Monster Pack"],
  [/apocalypse/i, "Apocalypse"],
  [/awakenings/i, "Awakenings"],
  [/lorien/i, "Lorien"],
  [/core|lich|reprint/i, "Corebox"],
];
const boxFor = (text) => BOX_BY_TEXT.find(([re]) => re.test(text))?.[1] ?? null;

const LANGUAGES = [
  [/italian/i, "it"],
  [/polish/i, "pl"],
  [/portuguese/i, "pt"],
];

const clean = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8211;|&#8212;/g, "-")
    .replace(/&#8217;/g, "’")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const titleCase = (text) =>
  text
    .toLowerCase()
    .replace(/(^|[\s(|/-])([a-z])/g, (_, sep, letter) => sep + letter.toUpperCase())
    .replace(/ (Of|And|For|The|In) /g, (word) => word.toLowerCase());

const html = process.argv[2]
  ? readFileSync(process.argv[2], "utf8")
  : await (await fetch(PAGE_URL, { headers: { "User-Agent": "Mozilla/5.0" } })).text();

// Walk headings, translation tabs and PDF links in page order.
const TOKENS =
  /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>|class="elementor-tab-title[^"]*"[^>]*>([\s\S]*?)<\/div>|<a [^>]*href="([^"]+\.pdf)"[^>]*>([\s\S]*?)<\/a>/g;

const result = {};
const seen = new Set();
let sectionBox = null; // box of the current "<X> PDF's" section
let box = null;
let language = "en";
let category = "Books";
let inGuides = false;

const add = (targetBox, entry) => {
  const key = `${targetBox}|${language}|${entry.url}`;
  if (seen.has(key)) return;
  seen.add(key);
  result[targetBox] ??= {};
  (result[targetBox][language] ??= []).push(entry);
};

for (const match of html.matchAll(TOKENS)) {
  const [, heading, headingHtml, tabHtml, url, linkHtml] = match;

  if (heading) {
    const text = clean(headingHtml);
    if (/^guides$/i.test(text)) {
      inGuides = true;
      sectionBox = "General";
      box = "General";
      language = "en";
      category = "Guides";
    } else if (/pdf'?s$/i.test(text)) {
      // "CORE BOX PDF's", "APOCALYPSE PDF's"; expansions pick a box per link.
      inGuides = false;
      sectionBox = /expansion/i.test(text) ? null : boxFor(text);
      box = sectionBox;
      language = "en";
      category = "Books";
    } else if (/erratas and extras/i.test(text)) {
      language = "en";
      category = "Extras";
      box = null; // chosen per link label
    } else if (/^books?$/i.test(text)) {
      category = "Books";
    } else if (/^components$/i.test(text)) {
      category = "Components";
    } else if (language !== "en" && boxFor(text)) {
      box = boxFor(text); // box heading inside a translation tab
    }
    continue;
  }

  if (tabHtml !== undefined) {
    language = LANGUAGES.find(([re]) => re.test(clean(tabHtml)))?.[1] ?? language;
    box = sectionBox;
    continue;
  }

  // Translation links read "Rulebook – Download": the label is the text
  // right before the link in the same paragraph.
  let label = clean(linkHtml);
  if (/^download$/i.test(label)) {
    const before = html.slice(Math.max(0, match.index - 400), match.index);
    const lastBreak = Math.max(before.lastIndexOf("<br"), before.lastIndexOf("<p>"), before.lastIndexOf("<p "));
    label = clean(before.slice(lastBreak).replace(/^<[^>]*>/, "")).replace(/\s*-\s*$/, "");
  }
  const targetBox = inGuides ? "General" : box ?? boxFor(label) ?? sectionBox;
  if (!targetBox) {
    console.warn(`No box for "${label}" (${url})`);
    continue;
  }
  add(targetBox, { label: titleCase(label), category, url });
}

mkdirSync("src/data/library", { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(result, null, 2) + "\n");
for (const [name, languages] of Object.entries(result)) {
  console.log(name.padEnd(28), Object.entries(languages).map(([lang, files]) => `${lang}:${files.length}`).join(" "));
}
console.log(`\nWrote ${OUTPUT}`);
