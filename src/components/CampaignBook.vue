<template>
  <div>
    <v-card
      class="book-dialog pa-0"
      @mousedown="startDrag"
      v-if="!hideCard"
    >
      <v-layout>
        <v-navigation-drawer
          expand-on-hover
          rail
          permanent
          width="270"
          class="nav-drawer"
          :floating="false"
          absolute
        >
          <v-list density="compact" nav v-model:opened="openGroups">
           
            
            <v-list-group
              v-for="(sectionItems, sectionName) in groupedNavigationItems"
              :key="sectionName.toString()"
              :value="sectionName.toString()" 
            >
              <template v-slot:activator="{ props: activatorPropsInternal, isOpen }">
                <v-list-item
                  v-bind="activatorPropsInternal"
                  :title="sectionName.toString()"
                  class="drawer-section-header"
                >
                   <template v-slot:prepend>
                     <v-icon :color="isOpen ? '#FFFFFF' : '#f0e6d2'">{{ getSectionIcon(sectionName.toString()) }}</v-icon>
                   </template>
                </v-list-item>
              </template>
              
              <v-list-item
                v-for="(navItem, itemIndex) in sectionItems"
                :key="navItem.id"
                :title="navItem.title"
                :value="navItem.id"
                @click="navigateToContent(navItem.sectionIndex, navItem.id, navItem.sectionTitle)"
                class="drawer-item-index"
                :active="navItem.id === activeClickedItemId"
                active-class="v-list-item--active-book-index"
                density="compact"
              >
                <template v-slot:prepend>
                  <v-avatar 
                    :color="navItem.id === activeClickedItemId ? 'amber-darken-2' : 'grey-darken-1'" 
                    size="24" 
                    class="numbered-avatar"
                  >
                    <span class="text-caption font-weight-bold" :style="{ color: navItem.id === activeClickedItemId ? 'white' : '#f0e6d2' }">
                      {{ itemIndex + 1 }}
                    </span>
                  </v-avatar>
                </template>
                <v-tooltip activator="parent" location="end">{{ navItem.title }}</v-tooltip>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-navigation-drawer>

        <v-main class="main-content">
          <v-card-text class="pa-0 scrollable-content" ref="scrollableContentRef">
            <v-sheet
              v-if="currentPage"
              :key="currentIndex"
              :style="backgroundStyle as CSSProperties"
              class="book-page"
              elevation="0"
              rounded
              @click="handlePageClick"
            >
              <div v-if="isFullScreenWithBackground" class="background-overlay"></div>
              <v-container class="pa-3 ml-2">
                <v-row>
                  <v-col cols="12">
                    <div v-for="(item, contentLoopIndex) in currentPage.content" 
                         :key="`content-${currentIndex}-${contentLoopIndex}`" 
                         :id="`content-block-${currentIndex}-${contentLoopIndex}`" 
                         class="content-block">
                      <div class="header-banner">
                        <div class="d-flex align-center justify-space-between pa-0 pb-0" @mousedown.stop="startDragHeader">
                          <h4 class="section-title">{{ currentPage.section }}</h4>
                          <v-btn icon class="close-btn" @click="hideCard = true">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </div>
                        <h2 v-if="item.title" class="chapter-title-banner">
                          {{ item.title }}
                        </h2>
                      </div>
                      
                      <div class="body-text mt-3" v-html="item.body"></div>
                      
                      <v-card v-if="item.instruction" class="instruction-card mt-6 py-0" flat>
                        <v-card-text v-html="item.instruction" />
                      </v-card>
                    </div>

                     <div class="d-flex justify-end mt-8">
                      <v-btn color="amber-darken-2" variant="flat" @click.stop="prevPage"
                        :disabled="currentIndex === 0" class="mx-4 px-6 text-white font-weight-bold">
                        ◀ Previous
                      </v-btn>
                      <v-btn color="amber-darken-2" variant="flat" @click.stop="nextPage"
                        :disabled="currentIndex >= pages.length - 1" class="mx-4 px-6 text-white font-weight-bold">
                        Next ▶
                      </v-btn>
                    </div>

                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
             <div v-else class="text-center pa-5 fill-height d-flex align-center justify-center">
                <div>Nenhum conteúdo para exibir. Verifique os dados do livro.</div>
            </div>
          </v-card-text>
        </v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, CSSProperties, nextTick } from "vue";

const dialog = ref(false); 
const hideCard = ref(false); 
const drag = ref(false);
const dragX = ref(20);
const dragY = ref(20);
const startX = ref(0);
const startY = ref(0);

// SEUS DADOS COMPLETOS DA ARRAY `pages` ESTÃO AQUI (COMO VOCÊ PEDIU PARA GRAVAR)
const pages = ref([
  {
    section: "WING 1 - TUTORIAL",
    content: [
      { 
        title: "INTO THE UNDERKEEP (TUTORIAL)",
        body: `<p>Times are changing...</p><p>The bravery of adventurers is needed once again. Blackriver, a county of the Kingdom of Elan, has been suffering from macabre events, beginning with the kidnapping of villagers under the cover of night. People are frightened, and monstrous silhouettes wander in the darkness, gnashing teeth and claws.</p><p>You arrived late, from far away. In the twilight gloom, wherever you look, there is only desolation and bloodstains painting the walls and alleys red. There’s no sign of your contractor. Or of any living soul, really. Those who remain have locked themselves inside their homes, praying for a miracle.</p><p>There is no mystery here: All tracks lead to the Count’s fortress, and whatever is happening there must be what you were hired to stop. Or rather, to fight. The hair on your arms stands on end—it’s unmistakable...</p>`,
        instruction: [`<div style="color: red; font-weight: bold; text-transform: uppercase; margin-bottom: px;">SCENARIO OBJECTIVE – DUNGEON CRAWL'.</div><div style="color: #1a120f;">To complete this Adventure, you must move through all the rooms, defeating every enemy in your way until you find the Adventure End Trigger.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 6px;">DEFEAT CONDITIONS – STANDARD'.</div><div style="color: #1a120f;">The Adventure immediately fails if any Hero’s Health Points are reduced to 0. The team cannot continue if even just one Hero is defeated.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 6px;">TUTORIAL – FIRST STEPS'.</div><div style="color: #1a120f;">Read the Tutorials “Turns and Rounds,” “A Hero’s Turn,” “Move Action,” “Cube Action,” and “Making Attacks”.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 6px;">STARTGAME TRIGGER'.</div><div style="color: #1a120f;">You may begin to play the Adventure. The Hero with the Defender Dungeon Role starts the game since that is the first card on the Initiative Track. Once their turn ends, move the marker to the next card, the Vampire Monster, and read the Tutorials “The Monsters’ Turn” and “Reactions”.</div>`].join(""),
      },
    ],
    layout: "single-column",
    background: "url('/img/bg-apoc.png')",
  },
  {
    section: "WING 1 - ADVANNCED", 
    content: [
      { 
        title: "INTO THE UNDERKEEP", 
        body: `<p>Times are changing...</p><p>The bravery of adventurers is needed once again. Blackriver, a county of the Kingdom of Elan, has been suffering from macabre events, beginning with the kidnapping of villagers under the cover of night. People are frightened, and monstrous silhouettes wander in the darkness, gnashing teeth and claws.</p><p>You arrived late, from far away. In the twilight gloom, wherever you look, there is only desolation and bloodstains painting the walls and alleys red. There’s no sign of your contractor. Or of any living soul, really. Those who remain have locked themselves inside their homes, praying for a miracle.</p><p>There is no mystery here: All tracks lead to the Count’s fortress, and whatever is happening there must be what you were hired to stop. Or rather, to fight. The hair on your arms stands on end—it’s unmistakable..</p><div style="color: Black; font-weight: bold; text-transform: uppercase; margin-top: 8px;">Blackriver needs your help. First, set up the components as shown below and then read the instructions for this Adventure:'.</div>`,
        instruction: [`<div style="color: red; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">SCENARIO OBJECTIVE – DUNGEON CRAWL</div><div style="color: #1a120f;">To complete this Adventure, you must move through all the rooms defeating every enemy in your way until you find the Adventure End Trigger.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">DEFEAT CONDITIONS – STANDARD</div><div style="color: #1a120f;">The Adventure immediately fails when one of the following occurs: 1) A Rune cannot be drawn from the bag; 2) any Hero collects their 2nd Trauma Cube; or 3) any Hero acquires their 6th Curse Cube. The team cannot proceed if any Hero is defeated.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">RECOVERY ACTION PENALTY – SINGLE</div><div style="color: #1a120f;">Whenever Heroes take a Voluntary or Involuntary Recall Action, after completing the Action they are performing and recovering their Cubes, they receive 1 Curse Cube.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">GAME MECHANIC – GROWING DARKNESS</div><div style="color: #1a120f;">Darkness lurks in the shadows, but it is too weak to manifest. Place the <span style="color: #0066cc;">Growing Darkness</span> Rune card with face A up in the Rune Slot at the bottom end of the Initiative Track.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">GAME MECHANIC – DRUNAGOR NIGHTS</div><div style="color: #1a120f;">Doors are opened differently in this Adventure: Place the <span style="color: #0066cc;">End of Round</span> Game State Check-Up card in the Rune Slot at the bottom end of the Initiative Track, just below the Rune card, with face A up. It will help you manage this mechanic.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">DUNGEON ACTION – DISTURBED DARKNESS</div><div style="color: #1a120f;">The hold of Darkness is strong here: Draw 24 Runes and place them on the Initiative Track. 12 remain in the bag, enough for 9 complete rounds before a Rune will fail to be drawn.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">STARTGAME TRIGGER</div><div style="color: #1a120f;">With the Setup prepared and all these instructions read, you may begin playing the Adventure.</div>`].join(""),
      },
      {
        title: "HAIL TO HIS MAJESTY", 
        body: `<p>Madness. The only word that fits this moment.</p><p>Corrupted creatures laid siege to the city from the inside out, abducting villagers night after night to sacrifice them in a ritual to a dreadful entity. A classic tale.</p><p>When the last of the aberrations falls, the chorus goes silent and the world around you begins to tremble as if the ground were about to split in two. The shadows dance as if they’ve come to life, and you find it hard to describe what unfolds before your eyes.</p><p>“Hahaha! What is this?” echoes a hoarse laugh, coming from nowhere—sounding as if it emerged from a decaying corpse. Slowly, the darkness swirls and joins together to form a monster unlike anything you’ve ever seen: fifteen feet tall, a crown on its head, and the spine of a giant wielded like a weapon by skeletal hands. “Why resist? Everything that lives, sooner or later, dies. It’s not a matter of ‘if’, but ‘when’—and for you, that moment is now…”</p>`,
        instruction: `<div style="color: #1a120f;">The monster behind Blackriver’s downfall has emerged from the shadows. Make the following preparations for your first Boss Fight:</div><ul style="color: #1a120f; margin-left: 20px; margin-top: 8px; margin-bottom: 8px; list-style-type: disc;"><li>Flip the second Monster Status Board (from orange to brown).</li><li>Set the Undead King’s starting Health Points. He has 25 HP for each Hero (for a total between 25 and 100).</li><li>Grab the Undead King’s Monster card, along with his 4 First Encounter Boss Attack cards, and place them with the “FRONT” side facing up in the designated slots of the Initiative Track.</li><li>Place the Undead King’s model on Map E11-F, occupying the central emerald-colored area. If any Hero is in that area, they must reposition their model to a square adjacent to the villain.</li><li>Replace the Hail to His Majesty Scene Trigger card on the Initiative Track with the Age of Darkness card.</li><li>Finally, each Hero on a square of Bridge BR2-B or any Map from the previous Setups must move their model to a square on Map E12-F. Those Heroes suffer FATIGUE X, with X being the number of squares they had to move. They take 1 non-preventable damage for each AC they should have discarded but couldn’t.</li><li>Remove Bridge BR2-B from the board. Heroes can no longer access previous Setup areas in any way. Pets that were on the Bridge or earlier Setups are Dispelled.</li></ul><div style="color: #1a120f; margin-top: 1em;">A Boss Battle is about to begin. Read the Tutorials “Boss Battles” and “Focus Abilities”. Then read the rule below before continuing the Adventure.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">RULE – THIS IS NOT OVER YET</div><div style="color: #1a120f;">When the Undead King dies for the first time, do not remove his model from the board or his cards from the Initiative Track. Skip all ACTIVATIONS from his Attack and Monster cards while he is in this suspended state. Heroes being GRAPPLED by the Undead King are released into a square adjacent to the Undead King’s model.</div>`
      },
      {
        title: "AGE OF DARKNESS", 
        body: `<p>The author of Blackriver’s misery is not a man. Not anymore. Now he is a carcass corrupted by the same unholy power he claims dominion over. Without a soul to long for anything, all he seeks is death and destruction.</p><p>“Who the hell are you?” the monster demands. The living usually don’t strike back. “You’re strong, I’ll admit that—but this ends now. The seeds have already been planted. There is no more escape, no more rest!”</p><p>Boulders fall from the ceiling as the Undead King raises his hands and makes the hall tremble once again. Your legs fight to stay grounded, but it is your mind that reels at the sight of a nightmare: Shadows condense like black clouds, flashing with emerald light. Then, like a storm, something warm and sticky as pitch spills into the hall.</p><p>The falling slime creeps along the floor and devours corpses with the hunger of a predator, sending a shiver down your spine. Flesh, entrails, and bones vanish in the blink of an eye, thickening and strengthening the mass that oozes ever closer.</p><p>“Welcome, mortals... to the Age of Darkness!”</p>`,
        instruction: `<div style="color: #1a120f;">The Undead King is not yet defeated and summons the Darkness to aid him. Make the following preparations for the second stage of this Boss Fight:</div><ul style="color: #1a120f; margin-left: 20px; margin-top: 8px; margin-bottom: 8px; list-style-type: disc;"><li>The Undead King restores 20 Health Points per Hero (for a total between 20 and 80).</li><li>Flip all of the Undead King’s Attack cards to their BACK side.</li><li>The Undead King releases all Heroes who are GRAPPLED.</li><li>Flip Maps E8-B and E5-F. Remove any Special Event tokens from them, but leave all other elements in their current squares (including Rune Piles). Heroes on those Maps are engulfed by Darkness.</li><li>Replace the Age of Darkness Scene Trigger card with the Into the Underkeep Endgame Trigger card.</li></ul><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">GAME MECHANIC – DARKNESS HUNTING</div><div style="color: #1a120f;">The Darkness is now strong enough to hunt new victims. Replace the Growing Darkness Rune card on the Initiative Track with the Darkness Hunting card, keeping the same face up. The Darkness now chases the Heroes according to the Standard Behavior. You can find details about the emergence of Darkness and its effects here. Reminder: If all Heroes are already in Darkness when a Rune is drawn, they suffer CRUSH damage instead of spawning Darkness.</div><div style="color: #1a120f; margin-top: 1em;">With these preparations complete, proceed with the Adventure. The fight continues until the Undead King is ultimately defeated.</div>`
      },
      {
        title: "INTO THE UNDERKEEP", 
        body: `<p>What takes place in the Great Hall is the embodiment of life’s struggle, as the adrenaline surging through your veins turns any dreams of wealth or glory into a single purpose: survival. Violence is met with violence, but in the end, the final blow is delivered by you.</p><p>“How... How can flesh surpass death?” the skeletal colossus murmurs as he collapses to the ground—but surprisingly, he laughs again. The black mass had already infiltrated the fortress’s foundations, shaking the ground harder than ever. “You know what? It doesn’t matter. You’ve won nothing but the right to dig your own graves...”</p><p>You barely have time to look at each other, let alone think of fleeing, before the cacophony of the collapse silences the hall, raising dust everywhere. All that’s left is to take a deep breath and hope for the best.</p><p>Surely, this job is turning out to be more costly than you expected…</p>`,
        instruction: `<div style="color: #1a120f; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">Congratulations! You’ve completed the Drunagor Nights Season 01, Tutorial!</div><div style="color: #1a120f;">Register your Heroes by marking in the app the Skills, Class Abilities, and Equipment you own. Proceed to the Adventure Underkeep Level 01 for your next game session—or if you prefer, replay this adventure in Advanced Mode first.</div>`
      }
    ],
    layout: "single-column",
    background: "url('/img/bg-apoc.png')",
  },
  {
    section: "WING 2 - ADVANCED",
    content: [
      {
        title: "THE UNDERKEEP LEVEL 01",
        body: `<p>Screams, pain, and despair.</p><p>The ground gives way beneath your feet, dragging you into a sinkhole. Instinctively, you curl up like turtles as you fall, your ears ringing with the echo of another cadaverous laugh fading into the distance.</p><p>At long last, the world around you settles and falls silent and you are able to regain your feet. Every part of your body aches, though it could’ve ended much worse.&nbsp;</p><p>You find yourself on a floor made of raw stone slabs, rough and uncomfortable. There is barely any light, except for a sinister emerald glow flickering from the walls, fueling that murderous shadowy mass. It is here too, of course. Staining the walls like a giant creeping vine, gathering strength to strike at the right moment.&nbsp;</p><p>Turning back is no longer possible, and staying is not an option. This is no longer an incursion—it’s a battle for survival, and you are the prey.</p><p>Surely, you should have read the fine print of that contract…</p><p>You are cornered and must survive Blackriver’s dungeon. First, set up the Initial Setup and then read the Scenario Instructions for this Adventure:</p><div class="setup-placeholder"><strong>FIRST SETUP</strong></div>`,
        instruction: `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">SCENARIO OBJECTIVE – DUNGEON CRAWL</div><div style="color: #1a120f;">To complete this Adventure, you must advance through all the rooms defeating every enemy along the way until you find the Adventure End Trigger.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">DEFEAT CONDITIONS – STANDARD</div><div style="color: #1a120f;">The Adventure immediately fails when one of the following occurs: 1) A Rune cannot be drawn from the bag; 2) any Hero collects their 2nd Trauma Cube; or 3) any Hero acquires their 6th Curse Cube. The team cannot proceed if any Hero is defeated.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">RECALL ACTION PENALTY – DOUBLE</div><div style="color: #1a120f;">Whenever Heroes take a Voluntary or Involuntary Recall Action, after completing the Action they are performing and recovering their Cubes, they receive 2 Curse Cubes.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">GAME MECHANIC – GROWING DARKNESS</div><div style="color: #1a120f;">Darkness lurks in the shadows, but it is too weak to manifest. Place the <span style="color: #2196F3; font-weight: bold;">Growing Darkness</span> Rune card with face A up in the Rune Slot at the bottom of the Initiative Track.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">GAME MECHANIC – THE UNDERKEEP</div><div style="color: #1a120f;">Doors are opened differently in this Adventure: Place the <span style="color: #2196F3; font-weight: bold;">End of Round</span> Game State Check-Up card in the Rune Slot at the bottom of the Initiative Track, just below the Rune card, with face A up. It will help you manage this mechanic.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">DUNGEON ACTION – STIRRING DARKNESS</div><div style="color: #1a120f;">Darkness holds strong here: Draw 30 Runes and place them on the Initiative Track. 6 remain in the bag, enough for 5 full rounds before a Rune will fail to be drawn.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">RULE – LOCKED DOOR</div><div style="color: #1a120f;">Door 01 cannot be opened until another effect states otherwise.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">STARTGAME TRIGGER</div><div style="color: #1a120f;">With the Setup ready and all these instructions read, you may begin playing the Adventure.</div>`
      },
      {
        title: "DOWN THE RIVER",
        body: `<p>The gates have opened, and the unmistakable sound of water flowing over stone echoes through the cistern. Quickly, the first third of the volume drains away, ending the stillness of waters left untouched for years—decades, perhaps centuries. Childhood lessons flash through your mind: disturbing things that lie in peace is almost never a good idea. Should you really have done that?</p>`,
        instruction: `<div style="color: #1a120f;">If the <span style="color: #e91e63; font-weight: bold;">Locked Mechanism</span> Status is noted on the Party’s Campaign Log, the wheel prevents the gates from closing and nothing special happens. Otherwise, continue reading below:</div><div style="color: #1a120f; margin-top: 8px;">The force of the water pouring through the drains forces the gates to close on their own, returning the mechanism to its resting state…</div><div style="color: #1a120f; margin-top: 8px;">Flip the <span style="color: #2196F3; font-weight: bold;">Drainage</span> Game Mechanic card to face B again.</div><div style="color: #1a120f; margin-top: 8px;">Proceed with the Adventure.</div>`
      },
      {
        title: "LURKING FROM THE DEPTHS",
        body: `<p>The gates open, water continues to pour through the drains like an underground river. The second third of the volume drains, revealing an unpleasant surprise: the Darkness is there. The reservoir does not just hold the precious liquid of life, but also death. What other secrets lie at the bottom? Do you really want to know? Suddenly, another internal mechanism activates, and one of the chamber walls retracts into the stone, revealing a door long forgotten…</p><p><strong>Flip Map DNC5-F to side DNC5-B and add the following elements to the Setup:</strong></p><div class="setup-placeholder"><strong>SHOW SETUP</strong></div>`,
        instruction: `<div style="color: #1a120f;">If the <span style="color: #e91e63; font-weight: bold;">Locked Mechanism</span> Status is noted on the Party’s Campaign Log, the wheel prevents the gates from closing and nothing special happens. Otherwise, continue reading below:</div><div style="color: #1a120f; margin-top: 8px;">The force of the water pouring through the drains forces the gates to close on their own, returning the mechanism to its resting state…</div><div style="color: #1a120f; margin-top: 8px;">Flip the <span style="color: #2196F3; font-weight: bold;">Drainage</span> Game Mechanic card to face B again.</div><div style="color: #1a120f; margin-top: 8px;">Proceed with the Adventure.</div>`
      },
      {
        title: "THE BOTTOM OF THE PIT",
        body: `<p>The last of the water drains into the stone, but the vortex is not strong enough to drag the Darkness with it. Exposed once again, the black miasma begins to slither as if it had been waiting for this moment all along, hungrier than ever. The enemy is once again on your trail. But not all the reservoir’s secrets are grim: treasures also lie in the dark, an inheritance from the unfortunate souls of ages past… Were they adventurers like you? Or perhaps the power-hungry men who brought this thing to life?</p><p><strong>Remove both the Drainage Game Mechanic card from the Initiative Track and the Interaction token from the board.</strong></p><p><strong>Replace Map DNC5-B with Map DNC2-B and add the following elements to the Setup:</strong></p><div class="setup-placeholder"><strong>MOSTRAR A CONFIGURAÇÃO</strong></div>`,
        instruction: `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">GAME MECHANIC – DARKNESS HUNTING</div><div style="color: #1a120f;">The Darkness is now strong enough to hunt new victims. Replace the <span style="color: #2196F3; font-weight: bold;">Growing Darkness</span> Rune card on the Initiative Track with the <span style="color: #2196F3; font-weight: bold;">Darkness Hunting</span> card, keeping the same face up. The Darkness now chases the Heroes according to the Standard Behavior.</div><ul style="color: #1a120f; margin-left: 20px; margin-top: 8px; margin-bottom: 8px; list-style-type: disc;"><li>Consider the Darkness Nodes to be the Spawn Points for Darkness tiles instead of those printed on the Maps.</li><li>if there are no Nodes on the board when a Rune is drawn, do not Spawn that tile.</li></ul><div style="color: #1a120f;">You can find details about Darkness Spawning and its Effects here. Reminder: If all Heroes are already in Darkness when a Rune is drawn, they suffer CRUSH damage instead of spawning Darkness.</div><div style="color: #1a120f; margin-top: 8px;">Proceed with the Adventure.</div>`
      },
      {
        title: "THE REUNION",
        body: `<p>Then, as if from nowhere once again, there he is—the Undead King in all his decaying glory. Defeat seems to have affected him little.</p><p>“Life is persistent. Stubborn. Indeed, it always finds a way…” taunts the unforgettable raspy voice. “How many times has Drunagor survived the ‘End of the World’ only to find itself again in the same situation? A pointless struggle with no end…”</p><p>You hesitate. Part of you wants to see the man inside that husk, but Darkness is not a disease—it’s something far worse. There is no cure for it, as it plagues both flesh and mind.</p><p>“Life is overrated. The future of all creatures is unlife. A perpetual existence with no pain, no greed, no need. Why fight destiny? What we offer—isn’t it what you seek? Ascension?”</p><p>It takes only that spark of blasphemy to make your blood boil…</p>`,
        instruction: `<div style="color: #1a120f;">The worst phrase imaginable has become reality: Somehow, the Undead King has returned. Make the following preparations for this Boss Fight:</div><ul style="color: #1a120f; margin-left: 20px; margin-top: 8px; margin-bottom: 8px; list-style-type: disc;"><li>Flip the second Monster Status Board (from orange to brown).</li><li>Set the Undead King’s starting Health Points. He has 60 HP for each Hero (for a total between 60 and 240).</li><li>Take the <span style="color: #2196F3; font-weight: bold;">Undead King</span> Monster card, along with his 4 Second Encounter Boss Attack cards, and place them with the “FRONT” side facing up in the designated slots of the Initiative Track.</li></ul><div style="color: #1a120f;">Now, each Hero and Pet repositions their model in the spaces indicated by the Setup. Each Hero suffers FATIGUE 1 for each area (not square) they must move through to reach one of these positions. If necessary, they must take Involuntary Recovery Actions during this movement, but they do not suffer damage for stepping into Darkness. Finally, if a Hero would receive their 5th or 6th Curse Cube this way, that Hero does not receive them.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">GAME MECHANIC – SUDDEN DEATH</div><div style="color: #1a120f;">The Undead King had to spend Darkness energy to restore himself, weakening it. Remove the <span style="color: #2196F3; font-weight: bold;">Darkness Hunting</span> Rune card from the Initiative Track. Until the end of this Adventure, Darkness no longer pursues the Heroes—but that doesn’t mean they have much time to defeat him. The Undead King’s Attack cards draw many Runes per round.</div><div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">GAME MECHANIC – REALM OF CHAOS</div><div style="color: #1a120f;">The chaotic and cursed influence of this level also affects the Undead King’s Attacks. Whenever a card instructs you to “DRAW 1 RUNE AND 'LOCK-ON' THE APPROPRIATE TARGET AT ANY RANGE”, it means the target of that Attack is determined by the color of the Rune drawn:</div><ul style="color: #1a120f; margin-left: 20px; margin-top: 8px; margin-bottom: 8px; list-style-type: disc;"><li>ORANGE – Strongest Hero at Any Range.</li><li>GREEN – Most Vigorous Hero at Any Range. The Most Vigorous Hero is the one with the most Available Action Cubes on their board at that moment. If two or more Heroes are tied, the one who acts first on the Initiative Track is considered the Most Vigorous.</li><li>BLUE – Most Tired Hero at Any Range. The Most Tired Hero is the one with the fewest Available Action Cubes on their board. If two or more Heroes are tied, the one who acts last on the Initiative Track is the Most Tired among them.</li><li>RED – Weakest Hero at Any Range.</li><li>GRAY – Most Corrupted Hero at Any Range.</li></ul><div style="color: #1a120f;">Note that not all of the Undead King’s Attacks are affected by this Game Mechanic. Those that draw Runes but do not determine “LOCK-ON” do not follow these instructions.</div><div style="color: #1a120f; margin-top: 8px;">Finally, no Character may occupy spaces outside this hall, as if the rest of the dungeon had ceased to exist. When these preparations are complete, proceed with the Adventure. Reminder: The <span style="color: #2196F3; font-weight: bold;">Monster Raid</span> Game Mechanic is still in effect during this fight.</div>`
      },
      {
        title: "TO THE DARK AND BEYOND",
        body: `<p>Darkness, minions, and a flirt with death make this battle just as intense as the first—but you muster every ounce of determination within you and bring the villain to his knees once more, filling yourselves with renewed confidence.</p><p>“Oh… I can feel it…” The monster’s laugh makes you question whether it’s all a façade, or if he truly doesn’t care about dying again and again. “Do not celebrate, mortals. I shall rise once more—for I transcended the weakness of flesh long, long ago.”</p><p>Then, as if centuries were passing in the blink of an eye, his once ornate garments crumble into dust along with the bones inside. The crown is the last to fall, disintegrating into rust as it hits the ground.</p><p>The Darkness nodes weaken, and the great mold covering the walls dissolves, revealing staircases plunging into the heart of the dungeon. Any adventurer might think it’s time to set up camp and rest—but that is a luxury you cannot afford.</p><p>This isn’t over yet…</p>`,
        instruction: `<div style="color: #1a120f; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">Congratulations! You’ve completed the second Wing of Drunagor Nights!</div><div style="color: #1a120f;">Register your Heroes in the Chronicles of Drunagor app, marking the Skills, Class Abilities, and Equipment you possess. Proceed to the <span style="color: #D32F2F; font-weight: bold;">Adventure Underkeep Level 02</span> for your next game session.</div>`
      }
    ],
    layout: "single-column",
    background: "url('/img/bg-apoc.png')", 
  }
]);
// --- FIM DOS DADOS `pages` ---

const scrollableContentRef = ref<HTMLElement | null>(null);
const activeClickedItemId = ref<string | null>(null);
const openGroups = ref<string[]>([]);


interface NavigationItem {
  sectionTitle: string;
  title: string;
  sectionIndex: number; 
  contentIndex: number;
  id: string;           
}

const navigationItems = computed<NavigationItem[]>(() => {
  const items: NavigationItem[] = [];
  pages.value.forEach((section, sectionGlobalIdx) => { 
    if (section.content && section.content.length > 0) {
      section.content.forEach((contentItem, contentIdx) => {
        if (contentItem.title) {
          items.push({
            sectionTitle: section.section,
            title: contentItem.title,
            sectionIndex: sectionGlobalIdx, 
            contentIndex: contentIdx, 
            id: `content-block-${sectionGlobalIdx}-${contentIdx}`
          });
        }
      });
    }
  });
  return items;
});

const groupedNavigationItems = computed(() => {
  const groups: { [key: string]: NavigationItem[] } = {};
  navigationItems.value.forEach(item => {
    if (!groups[item.sectionTitle]) {
      groups[item.sectionTitle] = [];
    }
    groups[item.sectionTitle].push(item);
  });
  return groups;
});

const getSectionIcon = (_sectionName: string) => {
  return 'mdi-book-open-page-variant';
};

const navigateToContent = async (sectionGlobalIndex: number, contentBlockId: string, sectionTitle: string) => {
  console.log(`[Nav] Clicked. Target GlobalSectionIdx: ${sectionGlobalIndex}, ElementID: ${contentBlockId}, SectionTitle: ${sectionTitle}`);

  if (sectionGlobalIndex < 0 || sectionGlobalIndex >= pages.value.length) {
    console.error(`[Nav] Invalid global sectionIndex: ${sectionGlobalIndex}.`);
    return;
  }
  
  currentIndex.value = sectionGlobalIndex;
  activeClickedItemId.value = contentBlockId; 

  if (!openGroups.value.includes(sectionTitle)) {
    openGroups.value = [sectionTitle]; 
  }
  
  await nextTick(); 
  
  const element = document.getElementById(contentBlockId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    if (scrollableContentRef.value) {
        scrollableContentRef.value.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};

const startDragHeader = (e: MouseEvent) => { 
  drag.value = true;
  startX.value = e.clientX - dragX.value;
  startY.value = e.clientY - dragY.value;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
};
const startDrag = (e: MouseEvent) => { 
  const target = e.target as HTMLElement;
  if (target.closest('button, a, input, textarea, .v-navigation-drawer, .header-banner .d-flex')) {
    return;
  }
  drag.value = true;
  startX.value = e.clientX - dragX.value;
  startY.value = e.clientY - dragY.value;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!drag.value) return;
  dragX.value = e.clientX - startX.value;
  dragY.value = e.clientY - startY.value;
};

const stopDrag = () => {
  drag.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
};

const currentIndex = ref(0); 
const currentPage = computed(() => {
    if (!pages.value || pages.value.length === 0) {
      return null;
    }
    const clampedIndex = Math.max(0, Math.min(currentIndex.value, pages.value.length - 1));
    return pages.value[clampedIndex];
});

const isFullScreenWithBackground = computed(() => {
  return (
    currentPage.value?.layout === "full-screen" &&
    !!currentPage.value?.background
  );
});

const backgroundStyle = computed<CSSProperties>(() => {
  if (!currentPage.value) return {};
  const s: CSSProperties = {
    position: "relative",
    color: "#191919",
    borderRadius: "12px",
  };
  if (currentPage.value.background) {
    s.backgroundImage = currentPage.value.background;
    s.backgroundSize = "cover";
    s.backgroundRepeat = "no-repeat";
    s.backgroundPosition = "center center";
  } else {
    s.backgroundColor = "#1c1c1c";
  }
  return s;
});

function handlePageClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.closest('button, a, .v-card, .v-btn, .header-banner, .v-navigation-drawer')) { return; }
}

function nextPage() {
  if (currentIndex.value < pages.value.length - 1) {
    currentIndex.value++;
    activeClickedItemId.value = null; 
    nextTick(() => {
        if (scrollableContentRef.value) scrollableContentRef.value.scrollTop = 0;
        if (pages.value[currentIndex.value]?.section) {
            const newSectionTitle = pages.value[currentIndex.value].section;
            openGroups.value = [newSectionTitle]; 
            const firstItemOfNewPage = navigationItems.value.find(item => item.sectionIndex === currentIndex.value && item.contentIndex === 0);
            if (firstItemOfNewPage) activeClickedItemId.value = firstItemOfNewPage.id;
        }
    });
  }
}

function prevPage() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    activeClickedItemId.value = null;
     nextTick(() => {
        if (scrollableContentRef.value) scrollableContentRef.value.scrollTop = 0;
         if (pages.value[currentIndex.value]?.section) {
            const newSectionTitle = pages.value[currentIndex.value].section;
            openGroups.value = [newSectionTitle];
            const firstItemOfNewPage = navigationItems.value.find(item => item.sectionIndex === currentIndex.value && item.contentIndex === 0);
            if (firstItemOfNewPage) activeClickedItemId.value = firstItemOfNewPage.id;
        }
    });
  }
}
</script>

<style scoped>
.body-text {
  font-style: italic;
}
.body-text p {
  font-family: "EB Garamond", serif;
  font-size: 1.1rem;
  line-height: 1.6;
  text-indent: 2em;
  color: #191919 !important;
  margin-bottom: 1.5rem;
}
.body-text p strong { 
    font-style: normal; 
    font-weight: bold; 
}
.body-text div[style*="color: Black"] { 
    text-indent: 0em !important; 
}
.setup-placeholder {
  text-align: center;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 2px dashed #ccc;
  background-color: #f9f9f9;
  font-size: 1.1em;
  font-style: normal !important; 
}
.setup-placeholder strong {
    font-style: normal !important; 
}

.book-dialog {
  width: 1000px;
  box-shadow:
    15px 0 15px -5px rgba(0, 0, 0, 0.3),
    0 10px 20px rgba(0, 0, 0, 0.5),
    inset 5px 0 10px rgba(255, 255, 255, 0.1);
}

.book-page {
  background-color: #ffffff;
  color: #212121;
  border: 1px solid #1e1e1e;
  margin: 20px;
  box-shadow:
    0 0 10px rgba(94, 69, 57, 0.3),
    inset 0 0 20px rgba(94, 69, 57, 0.2);
  border-radius: 12px;
  min-height: calc(90vh - 40px);
}

.header-banner {
  background-image: url('@/assets/booktop.png'); 
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  padding: 2px 14px 10px; 
  position: relative;
  z-index: 1;
  color: #212121; 
  border-top-left-radius: 6px; 
  border-top-right-radius: 6px;
}
.header-banner .d-flex { 
  cursor: move; 
}

.section-title {
  font-size: 0.7rem;
  color: white;
  padding: 23px 44px 5px; 
  margin: 0;
  text-transform: uppercase;
  font-weight: bold;
}

.chapter-title-banner {
  font-family: "Cinzel Decorative", cursive;
  font-size: 1.8rem; 
  color: white; 
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6); 
  margin-top: 5px; 
  margin-bottom: 10px; 
  padding-left: 44px; 
  padding-right: 44px;
  text-align: left; 
}

.close-btn {
  background-color: #212121 !important;
  color: #f0e6d2 !important;
  border: 1px solid #1e1e1e;
  border-radius: 50%;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.close-btn:hover {
  background-color: #1e1e1e !important;
}

.instruction-card {
  background: #e4e4e4 !important;
  border: 2px solid #212121 !important;
  color: #1a120f !important;
  box-shadow: 3px 3px 0px #212121;
  padding: 16px;
  margin-top: 1rem; 
}

.instruction-card ul { 
  list-style-position: inside;
  padding-left: 0; 
  list-style-type: disc; 
}
.instruction-card li {
  margin-bottom: 0.5em;
}

.v-btn {
  font-family: "Uncial Antiqua", cursive !important;
  letter-spacing: 1px;
  border: 1px solid #212121 !important;
}

.nav-drawer {
  background: #1a120f !important;
  border-right: 2px solid #212121 !important;
  z-index: 1001;
  height: 100%;
  position: absolute !important;
  transition: width 0.3s ease !important;
}

.nav-drawer .v-list-item-title {
  color: #f0e6d2;
  font-size: 0.8rem !important;
  line-height: 1.2;
  white-space: normal !important; 
}
.nav-drawer .v-list-subheader {
  color: #e6c68a !important; 
  font-size: 0.9rem;
  font-family: "Cinzel Decorative", cursive;
  padding-left: 16px; 
  line-height: normal;
  height: auto;
  padding-top: 8px;
  padding-bottom: 8px;
}
.drawer-section-header .v-list-item-title {
 font-weight: bold;
 font-size: 0.85rem !important;
 color: #f5e1a9 !important; 
}
.drawer-item-index .v-list-item-title {
  font-size: 0.75rem !important; 
  font-family: "EB Garamond", serif;
  color: #d4be94 !important;
  margin-left: 8px; /* Espaço padrão ao lado do avatar */
}

.drawer-item-index.v-list-item--active-book-index {
  background-color: rgba(201, 170, 113, 0.2) !important; 
}
.drawer-item-index.v-list-item--active-book-index .v-list-item-title,
.drawer-item-index:hover .v-list-item-title { 
  color: #ffffff !important;
  font-weight: bold;
}
.drawer-item-index.v-list-item--active-book-index .numbered-avatar span { 
    color: white !important;
}

/* === INÍCIO DOS AJUSTES DE CSS PARA ALINHAMENTO DOS NÚMEROS === */
.drawer-section-header.v-list-item {
  padding-inline-start: 16px !important; /* Padrão para itens de topo com ícone */
}
.drawer-section-header.v-list-item .v-list-item__prepend .v-icon {
  margin-inline-end: 16px !important; /* Espaço entre ícone da wing e título da wing */
}

.drawer-item-index.v-list-item {
  /* Força o mesmo padding dos itens de topo para alinhar os slots prepend */
  padding-inline-start: 16px !important; 
}

.drawer-item-index.v-list-item .v-list-item__prepend {
  /* Faz o slot prepend se comportar de forma que o avatar fique alinhado com o ícone da wing */
  min-width: 24px !important; /* Largura aproximada do ícone da wing */
  max-width: 24px !important; /* Evita que o prepend se estique demais */
  margin-right: 16px !important; /* Espaçamento entre o avatar e o título do capítulo */
  display: flex;
  justify-content: center;
  align-items: center;
}

.drawer-item-index .numbered-avatar {
  /* O avatar deve preencher o espaço do prepend, sem margens próprias que o desloquem */
  margin: 0 !important; 
  flex-shrink: 0;
  font-weight: bold;
}
.drawer-item-index .numbered-avatar .text-caption {
  font-size: 0.75rem !important;
  line-height: 1; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* Modo Rail (Drawer minimizado e NÃO sob hover) */
/* Quando o drawer está efetivamente no modo "rail" (estreito) */
:deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering)) .v-list-item__prepend {
    /* Força o ícone/avatar a ocupar o centro da pequena área do item no modo rail */
    width: auto !important; /* Permite que o ícone/avatar defina a largura */
    margin-left: auto !important;
    margin-right: auto !important;
    justify-content: center !important;
}
:deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering)) .drawer-section-header.v-list-item .v-list-item__prepend .v-icon {
    margin: 0 !important; /* Remove margens do ícone da wing no rail */
}
:deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering)) .drawer-item-index.v-list-item .v-list-item__prepend .numbered-avatar {
    margin: 0 !important; /* Remove margens do avatar no rail */
}

/* Esconde o título do capítulo no modo RAIL (quando não está em hover),
   mas o v-avatar no prepend deve continuar visível */
.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering) .drawer-item-index .v-list-item__content {
  display: none !important;
}
.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering) .drawer-section-header .v-list-item__content {
  display: none !important; /* Esconde também o título da wing no rail */
}
/* === FIM DOS AJUSTES DE CSS PARA ALINHAMENTO DOS NÚMEROS === */


.nav-drawer:hover .v-list-item-title {
  opacity: 1;
  margin-left: 0;
  transition:
    opacity 0.3s ease 0.1s,
    margin-left 0.3s ease;
}

.v-navigation-drawer--rail {
  width: 56px !important;
}

.v-navigation-drawer--rail:hover {
  width: 270px !important; 
}

.main-content {
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.v-navigation-drawer--rail:hover ~ .main-content {
   margin-left: 270px !important; 
}
.v-navigation-drawer:not(.v-navigation-drawer--rail) ~ .main-content {
  margin-left: 270px !important; 
}


.scrollable-content {
  overflow-y: auto;
  max-height: calc(100vh - 60px); 
}

.content-block {
  background-color: #fff; 
  border: 1px solid #dedede; 
  border-radius: 6px; 
  padding: 0 0 16px 0; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.content-block .header-banner { 
  padding-left: 16px;
  padding-right: 16px;
}

.content-block:not(:last-child) {
  margin-bottom: 24px; 
}
.content-block:last-child {
  margin-bottom: 16px; 
}

.body-text.mt-3 { 
    margin-top: 1rem !important; 
    padding: 0 16px; 
}
.instruction-card {
    margin-left: 16px;
    margin-right: 16px;
    width: calc(100% - 32px); 
}

@media (max-width: 960px) {
  .book-dialog { width: 90vw !important; max-height: 85vh !important; }
  .scrollable-content { max-height: calc(85vh - 80px); }
  .chapter-title-banner { font-size: 1.6rem !important; }
  .body-text p { font-size: 1rem !important; line-height: 1.5; }
  .content-block .header-banner, .body-text.mt-3 { padding-left: 12px; padding-right: 12px; }
  .instruction-card { margin-left: 12px; margin-right: 12px; width: calc(100% - 24px); }
}

@media (max-width: 600px) {
  .book-dialog { width: 96vw !important; max-height: 90vh !important; }
  .scrollable-content { max-height: calc(90vh - 70px); }
  .d-flex.justify-end { position: sticky; bottom: 0; background: linear-gradient(to bottom, transparent, #f0e6d299 20%, #f0e6d2 60%); padding: 16px 0; z-index: 100; }
  
  .nav-drawer { width: 48px !important; }
  .nav-drawer:hover, .v-navigation-drawer--rail:hover  { width: 220px !important; }
  .v-navigation-drawer--rail:hover ~ .main-content { margin-left: 220px !important; }
  .v-navigation-drawer:not(.v-navigation-drawer--rail) ~ .main-content { margin-left: 220px !important; }

  .header-banner { padding-left: 8px; padding-right: 8px; }
  .section-title { font-size: 0.6rem !important; padding: 15px 10px 5px 10px !important; }
  .chapter-title-banner { font-size: 1.4rem !important; padding-left: 10px !important; padding-right: 10px !important; margin-top: 2px; margin-bottom: 8px; }
  .body-text p { font-size: 0.9rem !important; text-indent: 1em; line-height: 1.4; }
  .v-btn { font-size: 0.8rem !important; padding: 8px 10px !important; margin: 4px !important; }
  .book-page { margin: 10px !important; min-height: unset; }
  .content-block .header-banner, .body-text.mt-3 { padding-left: 8px; padding-right: 8px; }
  .instruction-card { font-size: 0.85rem !important; padding: 12px !important; margin-left: 8px; margin-right: 8px; width: calc(100% - 16px); }
  .content-block:not(:last-child) { margin-bottom: 16px; }
}

@media (max-width: 400px) {
  .d-flex.justify-end { flex-direction: column; gap: 8px; }
  .v-btn { width: 100% !important; justify-content: center; }
  .book-dialog { width: 98vw !important; max-height: 95vh !important; margin: auto; }
  .scrollable-content { max-height: calc(95vh - 60px); }
  .header-banner { margin-bottom: 0; } 
  .section-title { padding: 10px 8px 2px 8px !important; font-size: 0.55rem !important; }
  .chapter-title-banner { font-size: 1.3rem !important; padding-left: 8px !important; padding-right: 8px !important; margin-bottom: 5px;}
}
</style>