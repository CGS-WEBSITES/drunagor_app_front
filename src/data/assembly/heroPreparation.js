// Act 3 — Preparing your Hero ("Sou jogador. Como começo?"). Shown in the
// lobby right after a player picks a Hero; each Core Hero has its own images.
const IMG = "https://assets.drunagor.app/retaitlertutorial/hero-preparation";

const NIGHTS_HEROES = ["elros", "jaheen", "lorelai", "maya", "vorn"];

const image = (file, hero) => (NIGHTS_HEROES.includes(hero) ? `${IMG}/${file}-${hero}.webp` : null);

/**
 * @param {string} heroName e.g. "Vorn"
 * @param {{ name: string, description: string } | undefined} gift recommended Gift Equipment
 */
export function heroPreparationSteps(heroName, gift) {
  const hero = (heroName || "").toLowerCase();
  const giftNote = gift
    ? `<p><strong>Gift Equipment:</strong> ask the Store Owner for the Gift Equipment Pack and take 1 card. Recommended for ${heroName}: <strong>${gift.name}</strong>. ${gift.description}</p>`
    : "";

  return [
    {
      id: 1,
      title: "Preparing your Hero",
      image: image("00-player-area", hero),
      instruction: `<p><em>Estimated time: 2 to 3 minutes</em></p>
<p>Prepare ${heroName || "your Hero"} by placing their components in your Play Area, as shown above.</p>
<p>Click <strong>Next</strong> to begin.</p>`,
    },
    {
      id: 2,
      title: "1 – Hero Board",
      image: image("01-hero-board", hero),
      instruction: `<p>Take your Hero's Hero Board.</p>`,
    },
    {
      id: 3,
      title: "2 – Hero Skill Cards",
      image: image("02-hero-skill", hero),
      instruction: `<p>Take your Hero's Hero Skill cards and keep them nearby in a stack. Identify them by the portrait on the side banner of each card.</p>
<p>You will only need them when your Hero levels up.</p>`,
    },
    {
      id: 4,
      title: "3 – Class Cards",
      image: image("03-class-skill", hero),
      instruction: `<p>Take your Hero's Class cards and keep them nearby in a stack. Your Hero's Class is listed directly below their name.</p>
<p>You will only need these cards when your Hero levels up.</p>`,
    },
    {
      id: 5,
      title: "4 – Starting Gear",
      image: image("04-starting-gear", hero),
      instruction: `<p>Place your Hero's Starting Gear (1 Weapon and 1 Armor) in the appropriate Equipment slots.</p>
<p>Your Hero's portrait helps you identify their Gear, but each card also states which Hero it belongs to.</p>`,
    },
    {
      id: 6,
      title: "5 – Hero Model",
      image: image("05-hero-model", hero),
      instruction: `<p>Take your Hero's model and keep it nearby. It will be placed on the board shortly, when the First Setup is assembled.</p>`,
    },
    {
      id: 7,
      title: "6 – Choose a Dungeon Role",
      image: image("06-dungeon-roles", hero),
      instruction: `<p>Choose a Dungeon Role and take its 2 cards (I and II). There are 5 options, each supporting a different playstyle:</p>
<ul>
  <li><strong>Defender</strong> – Withstand attacks and initiate combat.</li>
  <li><strong>Leader</strong> – Provide allies with tactical options.</li>
  <li><strong>Controller</strong> – Weaken enemies.</li>
  <li><strong>Support</strong> – Provide allies with resources.</li>
  <li><strong>Striker</strong> – Deal damage to enemies.</li>
</ul>
<p>The Defender was chosen for this example, but you may choose any Dungeon Role. Place its cards to the right of your Hero Board, next to the Equipment cards.</p>`,
    },
    {
      id: 8,
      title: "7 – Setting up the Initiative Track",
      image: image("07-initiative-track", hero),
      instruction: `<p>Take your Hero's Initiative card and place it in the position indicated by the chosen Dungeon Role.</p>
<p>Since Defender was chosen in the previous step, the card was placed in the Defender position on the Initiative Track. Make sure to place your card in the position corresponding to your chosen Dungeon Role.</p>`,
    },
    {
      id: 9,
      title: "8 – Picking Action Cubes",
      image: image("08-picking-action-cube", hero),
      instruction: `<p>Take your Hero's starting Action Cubes. This information is shown on their Initiative card.</p>
${giftNote}
<p><strong>Your Hero preparation is complete!</strong> When the party leader starts the game, you'll go to the First Setup: assemble it as shown in the illustration, open the book tab to read the scenario instructions, and then begin playing.</p>
<p><em>If this is your first time playing Chronicles of Drunagor, a pop-up will offer the Tutorial. Accept it to learn these steps and the basics of the gameplay.</em></p>
<p>Have a great Adventure!</p>`,
    },
  ];
}
