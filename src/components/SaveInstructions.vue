<template>
  <div class="pa-4">
    <h3 class="headline">SAVING YOUR GAME</h3>
    <p>
      You’re done with this game session and it’s time to save your Party’s
      progress. To do so, ensure that no Monsters are alive and that the
      Initiative marker is on the End of the Round Game State Check-Up card, at
      the end of the Initiative Track. If both conditions are met, you can save
      your Party’s progress by first adjusting the board:
    </p>
    <ul>
      <li>
        Remove any Chests and Interaction tokens (if any) left on the board.
        They are lost forever.
      </li>
      <li>
        Return any Runes that are on the board (if any) to the Initiative Track.
        Stacks left behind cannot be recovered.
      </li>
    </ul>
    <p>
      Next, open the “Campaign Log” tab in your Chronicles of Drunagor App and
      record the following Game State information:
    </p>
    <ul>
      <li>
        Record which Adventure will be played in the next session. If this one
        hasn’t been completed yet, it remains the same. Otherwise, it will be
        the next one.
      </li>
      <li>
        Record which Door will be opened next by the Party in that Adventure. If
        you’re finishing an Adventure now, select the “First Setup” of the next
        Adventure.
      </li>
    </ul>
    <p>
      These two steps should only be followed if you haven’t completed the
      current Adventure and are saving the game between rooms. Otherwise, you
      may skip them.
    </p>
    <ul>
      <li>
        Record the number of Runes on the Initiative Track. You don’t need to
        specify their color, only the total number.
      </li>
      <li>
        Record which Rune, Game State Check-Up, and Game Mechanics cards are on
        the Initiative Track.
      </li>
    </ul>
    <p>
      Then, record the following Hero information. The Party Leader must fill
      out the fields for each Hero in the Party. Only the total number is
      important:
    </p>
    <ul>
      <li>Hero’s current Health.</li>
      <li>Number of Curse Cubes the Hero has.</li>
      <li>Number of Trauma Cubes the Hero has.</li>
      <li>Number of Available Action Cubes the Hero has.</li>
      <li>Number of Action Cubes allocated to Skills or Expended.</li>
      <li>Which Dungeon Role the Hero is playing.</li>
    </ul>
    <p>
      Continue by clicking the “Manage Resources” button to register the
      Resource tokens and Equipment each Hero has:
    </p>
    <ul>
      <li>
        Number of SHIELDS, FOCUS, KI, FURY, FRUIT OF LIFE, and any other tokens
        defined as Resources.
      </li>
      <li>Which Consumable Items (if any) are in the Hero’s Backpack.</li>
      <li>
        Which Equipment the Hero is wielding in each of their equipment slots.
      </li>
    </ul>
    <p>
      Finally, also register the Hero Skills and Class Skills of each Hero.
      These fields only indicate the cards that were chosen:
    </p>
    <ul>
      <li>Which Level 1 Skills the Hero has.</li>
      <li>Which Level 2 Skills the Hero has.</li>
      <li>Which Class Abilities the Hero has.</li>
    </ul>
    <p>
      Once all information for all Heroes is filled in, click “Save Changes” and
      you’re done! All the relevant information for your Campaign has been
      recorded. Until next time, dear Adventurer!
    </p>
  </div>
</template>

<script setup lang="ts">
// Por enquanto só markup, sem props nem emits
</script>

<style scoped>
.headline {
  font-family: "Cinzel Decorative", cursive;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
