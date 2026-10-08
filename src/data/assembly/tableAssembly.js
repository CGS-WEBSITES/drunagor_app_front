// Act 2 — Table Assembly: the retailer's recurring table setup before each
// Drunagor Night ("Vou realizar uma Drunagor Night. Como preparo a mesa?").
const IMG = "https://assets.drunagor.app/retaitlertutorial/table-assembly";

export const TABLE_ASSEMBLY_PDF = `${IMG}/retailer-manual-table-preparation.pdf`;

export const tableAssemblySteps = [
  {
    id: 1,
    title: "Table Setup",
    image: `${IMG}/00-table.webp`,
    instruction: `<p><em>Estimated time: 3 minutes</em></p>
<p>Follow these steps to prepare for a session of Drunagor Nights. A 3×6-foot table comfortably accommodates all components.</p>
<p>Once you have completed these instructions, the Play Area should be organized as shown above: the <strong>Board Space</strong>, the <strong>Player Areas</strong> and the <strong>Dungeon Area</strong>.</p>
<p>To begin setting up the table, click <strong>Next</strong>.</p>`,
  },
  {
    id: 2,
    title: "1 – Maps, Bridges, and Doors",
    image: `${IMG}/01-maps-bridges-and-doors.webp`,
    instruction: `<p>Place the Maps, Bridges, and Doors in the Dungeon Area.</p>`,
  },
  {
    id: 3,
    title: "2 – Rune Bag",
    image: `${IMG}/02-rune-bag.webp`,
    instruction: `<p>Place the velvet bag containing the Runes in the Dungeon Area.</p>`,
  },
  {
    id: 4,
    title: "3 – Initiative Track",
    image: `${IMG}/03-initiative-track.webp`,
    instruction: `<p>Assemble the Initiative Track at one end of the table.</p>`,
  },
  {
    id: 5,
    title: "4 – Game Boards",
    image: `${IMG}/04-game-boards.webp`,
    instruction: `<p>Place the Hero Boards and Monster Status Boards in the Dungeon Area.</p>`,
  },
  {
    id: 6,
    title: "5 – Save Game Boxes",
    image: `${IMG}/05-save-game-boxes.webp`,
    instruction: `<p>Place the boxes containing the Mini Cards, colored Cubes, and colored Bases on the table. You may spread them out or keep them close together.</p>
<p>The box containing the colored Bases is best kept near the Monster Status Boards.</p>`,
  },
  {
    id: 7,
    title: "6 – Miniature, Token, and Darkness Trays",
    image: `${IMG}/06-miniature-token-and-darkness.webp`,
    instruction: `<p>Place the three central trays in the Dungeon Area. Keep the Game Box nearby. Large miniatures are stored in it.</p>`,
  },
  {
    id: 8,
    title: "7 – Dungeon Trays",
    image: `${IMG}/07-dungeon-trays.webp`,
    instruction: `<p>Place the ten Dungeon Trays in the Dungeon Area.</p>
<p>The table setup is now complete. The next steps—<strong>choosing the Heroes and assembling the First Setup</strong>—are carried out by the players.</p>`,
  },
];
