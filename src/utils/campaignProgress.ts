// Share of an Underkeep campaign completed, from the current door within its wing.
export const calculateCompletionPercentage = (campaign: { wing?: string | null; door?: string | null }): number => {
  const wing = (campaign.wing || "").toUpperCase();
  const currentDoor = (campaign.door || "").toUpperCase();
  
  let list: string[] = [];
  if (wing.includes("TUTORIAL")) {
    list = [
      "FIRST SETUP",
      "THE BARRICADED PATH (TUTORIAL)",
      "THE KEEP'S COURTYARD (TUTORIAL)",
      "THE ENTRY HALL (TUTORIAL)",
      "THE GREAT HALL (TUTORIAL)",
      "END GAME"
    ];
  } else if (wing.includes("WING 1") || wing.includes("WING 01")) {
    list = [
      "FIRST SETUP",
      "THE BARRICADED PATH",
      "THE KEEP'S COURTYARD",
      "THE ENTRY HALL",
      "THE GREAT HALL",
      "END GAME"
    ];
  } else if (wing.includes("WING 2") || wing.includes("WING 02")) {
    list = [
      "FIRST SETUP",
      "THE GREAT CISTERN",
      "THE DUNGEONS",
      "THE ALCHEMY LAB",
      "THE BURIED ARMORY",
      "THERE AND BACK AGAIN",
      "END GAME"
    ];
  } else if (wing.includes("WING 3") || wing.includes("WING 03")) {
    list = [
      "FIRST SETUP",
      "DUNGEON FOYER",
      "QUEEN'S HALL",
      "THE FORGE",
      "ARTISAN'S GALLERY",
      "PROVING GROUNDS",
      "MAIN HALL",
      "END GAME"
    ];
  } else if (wing.includes("WING 4") || wing.includes("WING 04")) {
    list = [
      "FIRST SETUP",
      "DRACONIC CHAPEL",
      "CRYPTS",
      "BOTH OPEN",
      "LIBRARY",
      "LABORATORY",
      "DRAGON BOSS",
      "END GAME"
    ];
  }

  if (list.length === 0) return 0;
  
  let idx = list.indexOf(currentDoor);
  if (idx === -1) {
    idx = list.findIndex(d => currentDoor.includes(d) || d.includes(currentDoor));
  }
  
  if (idx === -1) {
    if (currentDoor === "FIRST SETUP") idx = 0;
    else if (currentDoor === "END GAME") idx = list.length - 1;
    else idx = 0;
  }
  
  const pct = Math.round((idx / (list.length - 1)) * 100);
  return Math.min(100, Math.max(0, pct));
};
