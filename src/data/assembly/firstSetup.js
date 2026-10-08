import { assemblySteps } from "@/data/assembly/assembly";

// Player-facing First Setup: the room assembly steps from the retailer guide.
// Table layout (step 1) is now covered by Table Assembly, and Gift Pack
// management (step 7) stays with the retailer.
const MONSTER_NOTE = `<p>Do not place the Monsters on the map yet. The Start Here guide will teach you how to identify Monsters, attach colored snaps, track Health on the Monster Board, and place Monsters according to the setup.</p>`;

export const firstSetupSteps = assemblySteps
  .filter((step) => step.id >= 2 && step.id <= 6)
  .map((step) =>
    step.id === 6
      ? { ...step, instruction: step.instruction + MONSTER_NOTE }
      : step,
  );
