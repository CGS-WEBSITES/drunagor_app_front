// Which interactions are on the board in each room of a wing.
// Keys match interactionConfigurations.json (the QR link of each Season 1 card).

export const BARRICADE = "https://qr1.be/WMJL";
const WEAPONS_TABLE = "https://qr1.be/FNMI";
const SHINING_ARMOR = "https://qr1.be/0RLM";
const STONE_GUARDIAN = "https://qr1.be/60LT";
const RESERVOIR = "https://qr1.be/LPF2";
const TREASURES = "https://qr1.be/Y4ZP";

interface WingPlan {
  doors: string[];
  // Interactions each door puts on the board.
  placed: Record<string, string[]>;
  // Interactions a door takes off the board.
  removed?: Record<string, string[]>;
}

const WING_1: WingPlan = {
  doors: ["FIRST SETUP", "THE BARRICADED PATH", "THE KEEP'S COURTYARD", "THE ENTRY HALL", "THE GREAT HALL"],
  // The Barricade comes from the Game State Check-Up card, not from a token.
  placed: { "THE BARRICADED PATH": [BARRICADE], "THE ENTRY HALL": [WEAPONS_TABLE, SHINING_ARMOR] },
};

const WING_2: WingPlan = {
  doors: ["FIRST SETUP", "THE GREAT CISTERN", "THE DUNGEONS", "THE ALCHEMY LAB", "THE BURIED ARMORY", "THERE AND BACK AGAIN"],
  placed: { "FIRST SETUP": [STONE_GUARDIAN], "THE GREAT CISTERN": [RESERVOIR], "THE BURIED ARMORY": [TREASURES] },
  // The Alchemy Lab removes the Reservoir token if the Drainage is still in play.
  removed: { "THE ALCHEMY LAB": [RESERVOIR] },
};

const WING_3: WingPlan = {
  doors: ["FIRST SETUP", "DUNGEON FOYER", "QUEEN'S HALL", "THE FORGE", "ARTISAN'S GALLERY", "PROVING GROUNDS", "MAIN HALL"],
  placed: { "FIRST SETUP": ["InteractionThePrisoner"], "QUEEN'S HALL": ["InteractionTheSeed"], "THE FORGE": ["InteractionTheForge"] },
};

// Wing 4 branches (Chapel or Crypts first), so it is listed room by room.
const WING_4_ROOMS: Record<string, { all: string[]; placed: string[] }> = {
  "FIRST SETUP": { all: ["InteractionTheRunic"], placed: ["InteractionTheRunic"] },
  "DRACONIC CHAPEL": { all: ["InteractionTheRunic", "InteractionDraconianAltar"], placed: ["InteractionDraconianAltar"] },
  CRYPTS: { all: ["InteractionTheRunic", "InteractionBeerFactory"], placed: ["InteractionBeerFactory"] },
  "BOTH OPEN": {
    all: ["InteractionTheRunic", "InteractionDraconianAltar", "InteractionBeerFactory"],
    placed: ["InteractionDraconianAltar", "InteractionBeerFactory"],
  },
  LIBRARY: { all: ["InteractionTheRunic", "InteractionDraconianAltar", "InteractionBeerFactory"], placed: [] },
  LABORATORY: { all: ["InteractionTheRunic", "InteractionDraconianAltar", "InteractionBeerFactory"], placed: [] },
};

// Boss rooms have no interactions.
const BOSS_DOORS = ["THE GREAT HALL", "THERE AND BACK AGAIN", "MAIN HALL", "DRAGON BOSS", "END GAME"];

export interface RoomInteractions {
  // Every interaction the party can use in this room.
  available: string[];
  // The ones this room just added (the button's notification).
  placedHere: string[];
}

const NONE: RoomInteractions = { available: [], placedHere: [] };

// "THE ENTRY HALL (TUTORIAL)" → "THE ENTRY HALL"; a new campaign may have no door yet.
const normalizeDoor = (door: string) => (door || "FIRST SETUP").toUpperCase().replace(/\s*\(TUTORIAL\)\s*$/, "").trim();

function fromPlan(plan: WingPlan, door: string): RoomInteractions {
  const index = plan.doors.indexOf(door);
  if (index < 0) return NONE;
  let available: string[] = [];
  for (const step of plan.doors.slice(0, index + 1)) {
    const removed = plan.removed?.[step] ?? [];
    available = [...available.filter((id) => !removed.includes(id)), ...(plan.placed[step] ?? [])];
  }
  return { available, placedHere: plan.placed[door] ?? [] };
}

export function roomInteractions(wing: string, door: string): RoomInteractions {
  const w = (wing || "").toUpperCase();
  const d = normalizeDoor(door);
  if (BOSS_DOORS.includes(d)) return NONE;
  if (w.includes("WING 4")) {
    const room = WING_4_ROOMS[d];
    return room ? { available: room.all, placedHere: room.placed } : NONE;
  }
  if (w.includes("WING 3")) return fromPlan(WING_3, d);
  if (w.includes("WING 2") || w.includes("WING 02")) return fromPlan(WING_2, d);
  if (w.includes("WING 1") || w.includes("WING 01") || w.includes("TUTORIAL")) return fromPlan(WING_1, d);
  return NONE;
}

// Interactions printed in the Tutorial book PDF link to drunagor.app/interaction/<slug>.
export const INTERACTION_SLUGS: Record<string, string> = { barricade: BARRICADE };

// The interaction key a scanned code stands for: an app link by its slug, anything else as-is.
export function interactionFromCode(text: string): string {
  const match = text.trim().match(/\/interaction\/([\w-]+)/i);
  if (!match) return text.trim();
  return INTERACTION_SLUGS[match[1].toLowerCase()] || match[1];
}
