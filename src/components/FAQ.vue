<template>
  <div class="page-background pa-4 pa-md-8">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="11" lg="10">
          <h2 class="text-h5 text-md-h4 font-weight-bold mb-6 text-center">
            Help Center
          </h2>

          <v-tabs
            v-model="currentTab"
            bg-color="primary"
            class="mb-6"
            align-tabs="center"
            :grow="!mobile"
          >
            <v-tab value="faq">
              <v-icon start>mdi-frequently-asked-questions</v-icon>
              FAQ
            </v-tab>
            <v-tab value="retailer">
              <v-icon start>mdi-book-open-variant</v-icon>
              Retailer Books
            </v-tab>
          </v-tabs>

          <v-window v-model="currentTab">
            <v-window-item value="faq">
              <v-expansion-panels>
                <v-expansion-panel
                  v-for="(item, i) in faqData"
                  :key="i"
                  elevation="2"
                >
                  <v-expansion-panel-title expand-icon="mdi-chevron-down">
                    <span class="font-weight-bold">Q: {{ item.question }}</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="answer-content" v-html="item.answer"></div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-window-item>

            <v-window-item value="retailer">
              <v-card>
                <v-card-title class="font-weight-bold">
                  Downloadable Content
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-list bg-color="transparent">
                    <v-list-item
                      v-for="(book, i) in retailerBooks"
                      :key="i"
                      :href="book.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      prepend-icon="mdi-book-open-page-variant-outline"
                    >
                      <v-list-item-title class="readable-title">{{
                        book.title
                      }}</v-list-item-title>
                      <template #append>
                        <v-icon>mdi-download</v-icon>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";

// Helper do Vuetify para responsividade
const { mobile } = useDisplay();

const currentTab = ref("faq");

const retailerBooks = ref([
  {
    title: "RETAILER QUESTIONS BOOK",
    url: "https://druna-assets.s3.us-east-2.amazonaws.com/book/retailers_book.pdf",
  },
]);

const faqData = ref([
  {
    question: "I CAN’T FIND THE “COMMANDER GUARDIAN” CARD",
    answer: `<p>There is a typo on the Commander Guardian card. His name is printed as “Fallen Guardian” instead of simply “Guardian.” The Commander Fallen Guardian card is in the Kit and represents this Commander.</p>`,
  },
  {
    question: "WHERE ARE MAYA’S PET CARDS?",
    answer: `<p>Due to an oversight, we didn’t include extra copies of the Pet cards in Season 01 of the Organized Play Kit. However, copies of this card are in the Age of Darkness Corebox. The retailer will need to look for them there—they’re easy to spot by the Eagle and Wolf artwork. Starting with Season 02, the Kits will include copies of these cards to address this issue.</p>`,
  },
  {
    question: "HOW DO I SAVE MY CAMPAIGN PROGRESS?",
    answer: `
      <p>You’re done with this game session and it’s time to save your Party’s progress. To do so, ensure that no Monsters are alive and that the Initiative marker is on the End of the Round Game State Check-Up card, at the end of the Initiative Track. If both conditions are met, you can save your Party’s progress by first adjusting the board:</p>
      <ul>
        <li>Remove any Chests and Interaction tokens (if any) left on the board. They are lost forever.</li>
        <li>Return any Runes that are on the board (if any) to the Initiative Track. Stacks left behind cannot be recovered.</li>
      </ul>
      <p>Next, open the “Campaign Log” tab in your Chronicles of Drunagor App and record the following Game State information:</p>
      <ul>
        <li>Record which Adventure will be played in the next session. If this one hasn’t been completed yet, it remains the same. Otherwise, it will be the next one.</li>
        <li>Record which Door will be opened next by the Party in that Adventure. If you’re finishing an Adventure now, select the “First Setup” of the next Adventure.</li>
      </ul>
      <p>These two steps should only be followed if you haven’t completed the current Adventure and are saving the game between rooms. Otherwise, you may skip them.</p>
      <ul>
        <li>Record the number of Runes on the Initiative Track. You don’t need to specify their color, only the total number.</li>
        <li>Record which Rune, Game State Check-Up, and Game Mechanics cards are on the Initiative Track.</li>
      </ul>
      <p>Then, record the following Hero information. The Party Leader must fill out the fields for each Hero in the Party. Only the total number is important:</p>
      <ul>
        <li>Hero’s current Health.</li>
        <li>Number of Curse Cubes the Hero has.</li>
        <li>Number of Trauma Cubes the Hero has.</li>
        <li>Number of Available Action Cubes the Hero has.</li>
        <li>Number of Action Cubes allocated to Skills or Expended.</li>
        <li>Which Dungeon Role the Hero is playing.</li>
      </ul>
      <p>Continue by clicking the “Manage Resources” button to register the Resource tokens and Equipment each Hero has:</p>
      <ul>
        <li>Number of SHIELDS, FOCUS, KI, FURY, FRUIT OF LIFE, and any other tokens defined as Resources.</li>
        <li>Which Consumable Items (if any) are in the Hero’s Backpack.</li>
        <li>Which Equipment the Hero is wielding in each of their equipment slots.</li>
      </ul>
      <p>Finally, also register the Hero Skills and Class Skills of each Hero. These fields only indicate the cards that were chosen:</p>
      <ul>
        <li>Which Level 1 Skills the Hero has.</li>
        <li>Which Level 2 Skills the Hero has.</li>
        <li>Which Class Abilities the Hero has.</li>
      </ul>
      <p>Once all information for all Heroes is filled in, click “Save Changes” and you’re done! All the relevant information for your Campaign has been recorded. Until next time, dear Adventurer!</p>
    `,
  },
  {
    question: "HOW DO I LOAD MY CAMPAIGN?",
    answer: `
      <p>We’re glad to have you back, dear Adventurers! These instructions will help you restart the Campaign exactly where you left off. To do so, make sure all Trays, Maps, and Doors of the Adventure are already set up in their respective places. Then, open the “Campaign Log” tab in your Chronicles of Drunagor App, check which Heroes are in your Party, and gather the appropriate components:</p>
      <ul>
        <li>Model, Hero Board, Initiative card, Hero Skill cards, and Class Ability cards for each Hero in your Party.</li>
        <li>If there is a record of Runes on the Initiative Track, draw the indicated number of Runes and place them back on the Track.</li>
        <li>If there are any Rune, Game State Check-Up, and/or Game Mechanics cards, place them in the appropriate positions on the Initiative Track. All of them go at the bottom end of the Track, in the Rune Slot, except for the Monster Raid Game Mechanic card, which goes on top of this same Slot. The correct order is:</li>
      </ul>
      <p>Game Mechanics go on top of Rune cards, which in turn go on top of Game State Check-Up cards.</p>
      <p>Then, one by one, check the Game State of each Hero and make the appropriate adjustments. Start by clicking the “Manage Resources” button and assign the following components to each Hero:</p>
      <ul>
        <li>Number of SHIELDS, FOCUS, KI, FURY, FRUIT OF LIFE, and any other tokens defined as Resources.</li>
        <li>Which Consumable Items (if any) are in the Hero’s Backpack.</li>
        <li>Which Equipment the Hero is wielding in each of their equipment slots.</li>
      </ul>
      <p>Then, click the “Hero Skills and Class Skills” button and assign each Hero the Abilities they’ve learned in previous sessions:</p>
      <ul>
        <li>Which Dungeon Role the Hero is fulfilling.</li>
        <li>Which Level 1 Skills the Hero has.</li>
        <li>Which Level 2 Skills the Hero has.</li>
        <li>Which Class Abilities the Hero has.</li>
      </ul>
      <p>Finally, adjust each Hero’s Game State as recorded in the Campaign Log:</p>
      <ul>
        <li>How many Available Action Cubes the Hero has. Check their Initiative card to see their starting amount, then give them the appropriate Cubes based on the Hero Skills they’ve learned.</li>
        <li>How many Action Cubes are allocated to Skills or Expended. You may place all of them in the Expended Cube Box. Heroes resume the game with all Hero Skills unassigned.</li>
        <li>How many Curse and Trauma Cubes the Hero has. Curse Cubes or Trauma Cubes can be placed in any Hero or Role Skill. No need to repeat those selected in the previous session.</li>
        <li>Hero’s current Health.</li>
      </ul>
      <p>Once all Hero information is set, place them back on the board. Each Hero may reposition their Model to a space within Range 1 of the Door listed as “Next Door” in their Campaign Log. At least one Hero, however, must be adjacent to it to open it. Open that Door, build its Setup, return the Initiative marker to the first card on the Track, and that’s it! Resume the game!</p>
    `,
  },
  {
    question:
      "WHAT’S THE DIFFERENCE BETWEEN DRUNAGOR NIGHTS GAMEPLAY AND THE AGE OF DARKNESS COREBOX?",
    answer: `
      <p>Drunagor Nights isn’t exactly a “demo” of the Corebox. The Adventures in both products follow a similar structure but are not set in the same universe. The Drunagor Nights Adventures are exclusive to this event and are not part of the official Age of Darkness campaign, so it serves both newcomers and veteran CoD players.</p>
      <p>Regarding gameplay, the core rules are the same in both games. The difference lies in how certain effects are written. Drunagor Nights uses simpler, clearer effects to make it more accessible, which means the wording reads differently from Age of Darkness. For example:</p>
      <ul>
        <li>Target specification (SELF, UP TO TWO TARGETS) is separated by “,” in Age of Darkness, rather than “:” as in Drunagor Nights.</li>
        <li>Triggered Effects are separated by “:” in Age of Darkness, rather than “–” in Drunagor Nights.</li>
        <li>When a Passive Skill doesn’t define the Range of its effect in Age of Darkness, the default is ANY RANGE. No ability in Drunagor Nights omits its Range.</li>
        <li>Whenever an effect doesn’t specify its targets in Age of Darkness, the default is ANY ONE CHARACTER. No ability in Drunagor Nights omits its specific targets.</li>
        <li>Exception: In Age of Darkness, MOVE X, JUMP X, or TRAMPLE X always target SELF unless it explicitly states that another Character can MOVE.</li>
        <li>Exception: In Age of Darkness, +X HIT or +X HIT/ +X HIT are the instructions that indicate an ability is a ² and always target SELF unless it explicitly states that another Character can make an Attack with +X HIT.</li>
        <li>In ² in Age of Darkness, any effect described after +X HIT is considered Collateral Damage. There isn’t a clear delimiter such as “CD – EFFECT” as there is in Drunagor Nights effects.</li>
      </ul>
      <p>Each of these instructions is explained in the Corebox Rulebook, pages 24–28, with many written and visual examples.</p>
      <p>The phrasing of Interactions is also different in the Corebox. They don’t include a “Proceed with the Adventure” command, but players should do so whenever they finish reading a resolution.</p>
      <p>One last note — the Heroes’ Skills are a bit different there as well. The ones borrowed for Drunagor Nights are simpler, with effects that use fewer Keywords and with attacks that favor hit bonuses rather than damage bonuses to be more accessible to new players. However, don’t worry — the Heroes’ concept and gameplay are the same. The difference is in the complexity of the effects and in the number of Keywords.</p>
    `,
  },
]);
</script>

<style scoped>
.page-background {
  background-color: #121212;
  min-height: 100vh;
}

.answer-content {
  line-height: 1.7;
  text-align: justify;
}

.answer-content :deep(ul) {
  padding-left: 24px;
  margin-top: 12px;
  margin-bottom: 12px;
}

.answer-content :deep(li) {
  margin-bottom: 8px;
}

.v-expansion-panel-title {
  line-height: 1.4;
}

.readable-title {
  white-space: normal;
  line-height: 1.25rem;
  height: auto;
}
</style>
