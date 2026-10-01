// Display names, colors and marks for heroes and the boxes they come from.
import type { ContentId } from "@/data/type/ContentId";
import type { HeroClass } from "@/data/type/HeroClass";
import type { HeroData } from "@/data/repository/HeroData";
import coreLogo from "@/assets/logo/core.webp";
import awakeningsLogo from "@/assets/logo/awakenings.webp";
import apocalypseLogo from "@/assets/logo/apocalypse.webp";
import s1Flag from "@/assets/s1flag.png";
import s2Flag from "@/assets/s2flag.png";
import assassinIcon from "@/assets/classes/assassin.png";
import barbarianIcon from "@/assets/classes/Barbarian.png";
import bardIcon from "@/assets/classes/Bard.png";
import clericIcon from "@/assets/classes/Cleric.png";
import druidIcon from "@/assets/classes/Druid.png";
import mageIcon from "@/assets/classes/Mage.png";
import monkIcon from "@/assets/classes/Monk.png";
import necromancerIcon from "@/assets/classes/Necromancer.png";
import paladinIcon from "@/assets/classes/Paladin.png";
import rangerIcon from "@/assets/classes/Ranger.png";
import shadowKnightIcon from "@/assets/classes/Shadow Knight.png";
import shamanIcon from "@/assets/classes/Shaman.png";
import sorcererIcon from "@/assets/classes/Sorcerer.png";
import swordmageIcon from "@/assets/classes/Swordmage.png";
import warlordIcon from "@/assets/classes/Warlord.png";
import warriorIcon from "@/assets/classes/Warrior.png";

export const CONTENT_LABELS: Record<ContentId, string> = {
  core: "Core Box",
  "desert-of-hellscar": "Desert of Hellscar",
  "monster-pack-1": "Monster Pack 1",
  "rise-of-the-undead-dragon": "Rise of the Undead Dragon",
  "spoils-of-war": "Spoils of War",
  "the-ruin-of-luccanor": "The Ruin of Luccanor",
  "the-shadow-world": "The Shadow World",
  handuriel: "Handuriel",
  lordwrath: "Lordwrath",
  apocalypse: "Apocalypse",
  awakenings: "Awakenings",
  "hero-pack-1": "Hero Pack 1",
  lorien: "Lorien",
  "fallen-sisters": "Fallen Sisters",
};

export const CONTENT_LOGOS: Partial<Record<ContentId, string>> = {
  core: coreLogo,
  awakenings: awakeningsLogo,
  apocalypse: apocalypseLogo,
};

// Each box's symbol, as printed on its components (white, on transparent).
const BOX_SYMBOL_FILES = import.meta.glob("@/assets/box symbols/*.png", { eager: true, import: "default" }) as Record<string, string>;
const boxSymbol = (file: string) => Object.entries(BOX_SYMBOL_FILES).find(([path]) => path.endsWith(`/${file}.png`))?.[1];
export const CONTENT_SYMBOLS: Partial<Record<ContentId, string | undefined>> = {
  apocalypse: boxSymbol("Vector"),
  awakenings: boxSymbol("Vector-1"),
  core: boxSymbol("Vector-2"),
  "desert-of-hellscar": boxSymbol("Vector-4"),
  handuriel: boxSymbol("Vector-5"),
  "hero-pack-1": boxSymbol("Vector-6"),
  lordwrath: boxSymbol("Vector-7"),
  lorien: boxSymbol("Vector-8"),
  "monster-pack-1": boxSymbol("Vector-9"),
  "the-ruin-of-luccanor": boxSymbol("Vector-10"),
  "the-shadow-world": boxSymbol("Vector-11"),
  "spoils-of-war": boxSymbol("Vector-12"),
  "rise-of-the-undead-dragon": boxSymbol("Vector-13"),
  "fallen-sisters": boxSymbol("E"),
};

// Box renders, the same ones the Library shows.
const LIBRARY = "https://assets.drunagor.app/Library";
export const CONTENT_BOX_IMAGES: Partial<Record<ContentId, string>> = {
  core: `${LIBRARY}/box-corebox.png`,
  apocalypse: `${LIBRARY}/box-apoc.png`,
  lordwrath: `${LIBRARY}/box-lordwrath.png`,
  "the-ruin-of-luccanor": `${LIBRARY}/box-luccanor.png`,
  "the-shadow-world": `${LIBRARY}/box-shadowworld.png`,
  "fallen-sisters": `${LIBRARY}/box-fallen.png`,
  "hero-pack-1": `${LIBRARY}/box-heropack.png`,
  lorien: `${LIBRARY}/box-lorien.png`,
  "monster-pack-1": `${LIBRARY}/box-monsterpack.png`,
  "spoils-of-war": `${LIBRARY}/box-spoils.png`,
  awakenings: `${LIBRARY}/box-awakenings.png`,
  "desert-of-hellscar": `${LIBRARY}/box-hellscar.png`,
  "rise-of-the-undead-dragon": `${LIBRARY}/box-undeaddragon.png`,
};

// Equipment slot icons from the design (white on transparent). 
const TRACKER_ICONS = import.meta.glob("@/assets/icons/TRACKER/CAMPAIGN/HERO BOX/*.png", { eager: true, import: "default" }) as Record<string, string>;
const trackerIcon = (file: string) => Object.entries(TRACKER_ICONS).find(([path]) => path.endsWith(`/${file}.png`))?.[1];
export const SLOT_ICONS: Record<string, { image?: string; mdi: string }> = {
  Weapon: { image: trackerIcon("WEAPON ICON"), mdi: "mdi-sword-cross" },
  "Off Hand": { image: trackerIcon("OFF HAND ICON"), mdi: "mdi-shield-half-full" },
  Armor: { image: trackerIcon("Vector"), mdi: "mdi-shield-account" },
  Trinket: { image: trackerIcon("Vector-1"), mdi: "mdi-diamond-stone" },
  Consumable: { image: trackerIcon("Vector-2"), mdi: "mdi-bottle-tonic" },
  Bag: { image: trackerIcon("Vector-2"), mdi: "mdi-bag-personal" },
  Treasure: { image: trackerIcon("Vector-3"), mdi: "mdi-treasure-chest" },
  // No design icon for the backpack yet.
  Stash: { mdi: "mdi-bag-personal" },
};

// Drunagor Nights is played only with the five Core heroes.
export const NIGHTS_HEROES = ["elros", "vorn", "lorelai", "maya", "jaheen"];

// The data spells it "Assasin".
export const heroClassLabel = (heroClass: HeroClass | string) =>
  heroClass === "Assasin" ? "Assassin" : heroClass === "Shadow knight" ? "Shadow Knight" : heroClass;

// Class colors (background and stroke) and symbols, from the design.
export const CLASS_STYLES: Record<string, { bg: string; stroke: string; icon: string }> = {
  Necromancer: { bg: "#12012D", stroke: "#773993", icon: necromancerIcon },
  Mage: { bg: "#3A2447", stroke: "#774C73", icon: mageIcon },
  Bard: { bg: "#520032", stroke: "#8F0B5B", icon: bardIcon },
  Warlord: { bg: "#590122", stroke: "#9F2342", icon: warlordIcon },
  Warrior: { bg: "#2C0011", stroke: "#69141A", icon: warriorIcon },
  Barbarian: { bg: "#6E0013", stroke: "#BF3E28", icon: barbarianIcon },
  Monk: { bg: "#945304", stroke: "#DC7E1B", icon: monkIcon },
  Ranger: { bg: "#003253", stroke: "#0061A1", icon: rangerIcon },
  Swordmage: { bg: "#4F6A73", stroke: "#7093A5", icon: swordmageIcon },
  Paladin: { bg: "#7F848A", stroke: "#FFFFFF", icon: paladinIcon },
  Sorcerer: { bg: "#114934", stroke: "#4C998B", icon: sorcererIcon },
  "Shadow Knight": { bg: "#231615", stroke: "#62413E", icon: shadowKnightIcon },
  Druid: { bg: "#322821", stroke: "#9B815A", icon: druidIcon },
  Assassin: { bg: "#352E2C", stroke: "#867571", icon: assassinIcon },
  Shaman: { bg: "#433933", stroke: "#938366", icon: shamanIcon },
  Cleric: { bg: "#644629", stroke: "#B3975D", icon: clericIcon },
};

const FALLBACK_STYLE = { bg: "#2b2b2b", stroke: "#555555", icon: "" };
export const classStyle = (heroClass: HeroClass | string) => CLASS_STYLES[heroClassLabel(heroClass)] ?? FALLBACK_STYLE;

// Cut-out portraits, named hero-<name>-<class>.png (some with typos).
const PORTRAITS = import.meta.glob("@/assets/companion/hero-*.png", { eager: true, import: "default" }) as Record<string, string>;
const portraitEntries = Object.entries(PORTRAITS)
  .map(([path, url]) => {
    const match = /hero-([a-z]+)-([a-z]+)(-\d+)?\.png$/.exec(path);
    return match ? { name: match[1], cls: match[2], variant: !!match[3], url } : null;
  })
  .filter((entry): entry is { name: string; cls: string; variant: boolean; url: string } => !!entry)
  .sort((a, b) => Number(a.variant) - Number(b.variant));

export function heroPortrait(hero: HeroData): string {
  const name = hero.name.toLowerCase().replace(/[^a-z]/g, "");
  const cls = heroClassLabel(hero.class).toLowerCase().replace(/[^a-z]/g, "");
  const found = portraitEntries.find(
    (entry) => entry.name.slice(0, 4) === name.slice(0, 4) && entry.cls.slice(0, 4) === cls.slice(0, 4),
  );
  return found?.url ?? hero.images.avatar;
}

// Where an item comes from: a box, or a Drunagor Nights season.
export type ItemSource = "core" | "awakenings" | "apocalypse" | "season-1" | "season-2";

export const ITEM_SOURCE_MARKS: Record<ItemSource, { label: string; short: string; color: string; flag?: string }> = {
  core: { label: "Core Box", short: "Core", color: "#6d6d6d" },
  awakenings: { label: "Awakenings", short: "Awakenings", color: "#2f6f73" },
  apocalypse: { label: "Apocalypse", short: "Apocalypse", color: "#8a2a1f" },
  "season-1": { label: "Drunagor Nights – Season 1", short: "S1", color: "#1d4a44", flag: s1Flag },
  "season-2": { label: "Drunagor Nights – Season 2", short: "S2", color: "#1d4a44", flag: s2Flag },
};
