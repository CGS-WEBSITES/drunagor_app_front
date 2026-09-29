// Display names and marks for heroes and the boxes they come from.
import type { ContentId } from "@/data/type/ContentId";
import type { HeroClass } from "@/data/type/HeroClass";
import coreLogo from "@/assets/logo/core.webp";
import awakeningsLogo from "@/assets/logo/awakenings.webp";
import apocalypseLogo from "@/assets/logo/apocalypse.webp";
import s1Flag from "@/assets/s1flag.png";
import s2Flag from "@/assets/s2flag.png";

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

// The data spells it "Assasin".
export const heroClassLabel = (heroClass: HeroClass | string) =>
  heroClass === "Assasin" ? "Assassin" : heroClass === "Shadow knight" ? "Shadow Knight" : heroClass;

// Where an item comes from: a box, or a Drunagor Nights season.
export type ItemSource = "core" | "awakenings" | "apocalypse" | "season-1" | "season-2";

export const ITEM_SOURCE_MARKS: Record<ItemSource, { label: string; image: string; flag: boolean }> = {
  core: { label: "Core Box", image: coreLogo, flag: false },
  awakenings: { label: "Awakenings", image: awakeningsLogo, flag: false },
  apocalypse: { label: "Apocalypse", image: apocalypseLogo, flag: false },
  "season-1": { label: "Drunagor Nights – Season 1", image: s1Flag, flag: true },
  "season-2": { label: "Drunagor Nights – Season 2", image: s2Flag, flag: true },
};
