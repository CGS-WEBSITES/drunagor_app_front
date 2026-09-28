// Library box data: contents extracted from the official Components List
// PDFs and downloads from the CGS site (see scripts/library).
import components from "@/data/library/components.json";
import downloads from "@/data/library/downloads.json";

export type Door = { door: number; name: string; chapter: number; chapterName: string };

export type BoxContents = {
  source: string;
  summary: Record<string, number>;
  heroes: string[];
  heroClasses: string[];
  epicItems: string[];
  bosses: string[];
  whiteMonsters: string[];
  grayMonsters: string[];
  blackMonsters: string[];
  monsters: string[];
  commanders: string[];
  companions: string[];
  pets: string[];
  doors: Door[];
};

export type DownloadFile = { label: string; category: string; url: string };
export type LanguageCode = "en" | "it" | "pl" | "pt";

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: "English",
  it: "Italiano",
  pl: "Polski",
  pt: "Português",
};

// Component types, in the order the box detail lists them.
export const COMPONENT_TYPES = [
  { key: "epicItems", label: "Epic Items" },
  { key: "bosses", label: "Bosses" },
  { key: "heroes", label: "Heroes" },
  { key: "heroClasses", label: "Hero Class" },
  { key: "whiteMonsters", label: "White Monsters" },
  { key: "grayMonsters", label: "Gray Monsters" },
  { key: "blackMonsters", label: "Black Monsters" },
  { key: "monsters", label: "Monsters" },
  { key: "commanders", label: "Commanders" },
  { key: "companions", label: "Companions" },
  { key: "pets", label: "Pets" },
] as const;

export type ComponentTypeKey = (typeof COMPONENT_TYPES)[number]["key"];

// Content groups for the Library filter.
export const CONTENT_GROUPS: { label: string; boxes: string[] }[] = [
  { label: "Core Box", boxes: ["Corebox"] },
  { label: "Expansions", boxes: ["Apocalypse", "Awakenings"] },
  {
    label: "Adventure Packs",
    boxes: ["Ruin of Luccanor", "Shadow World", "Rise of The Undead Dragon", "Desert of Hellscar"],
  },
  { label: "Hero Packs", boxes: ["Hero Pack", "Lorien", "Lordwrath"] },
  { label: "Monsters & Bosses", boxes: ["Monster Pack", "Fallen Sisters", "Four Horseman"] },
  { label: "Add-ons", boxes: ["Companions & Fornitures", "Spoils of War"] },
];

const CONTENTS = components as unknown as Record<string, BoxContents>;
const DOWNLOADS = downloads as unknown as Record<string, Partial<Record<LanguageCode, DownloadFile[]>>>;

export const boxContents = (boxName: string): BoxContents | null => CONTENTS[boxName] ?? null;

export const boxDownloads = (boxName: string) => DOWNLOADS[boxName] ?? {};

export const generalGuides = (): DownloadFile[] => DOWNLOADS.General?.en ?? [];

export const doorLabel = (door: Door) =>
  `Door ${String(door.door).padStart(2, "0")} - ${door.name} - Chapter ${door.chapter}`;

// Components of a box matching a search, optionally within one type.
export const matchComponents = (boxName: string, query: string, type: ComponentTypeKey | null) => {
  const contents = boxContents(boxName);
  const needle = query.trim().toLowerCase();
  if (!contents || !needle) return [];
  const types = type ? COMPONENT_TYPES.filter((t) => t.key === type) : COMPONENT_TYPES;
  return types.flatMap((t) =>
    contents[t.key].filter((name) => name.toLowerCase().includes(needle)).map((name) => ({ type: t.label, name })),
  );
};

// Whether a box has anything of a given type (used when only a type is picked).
export const hasComponentType = (boxName: string, type: ComponentTypeKey) =>
  (boxContents(boxName)?.[type].length ?? 0) > 0;
