<template>
  <v-card class="pa-4" color="surface">
    <v-card-text class="scroll-container">
      <v-stepper mobile :items="steps">
        <!-- Step 1 -->
        <template v-slot:item.1>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6">1 - Save Conditions</span>
            </template>
            <p class="text-body-1 mb-4">
              You're done with this game session and it's time to save your
              Party's progress. To do so, ensure that:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>No Monsters are alive</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  The Initiative marker is on the End of the Round Game State
                  Check-Up card, at the end of the Initiative Track
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-alert type="info" variant="tonal" class="mb-4">
              If both conditions are met, you can save your Party's progress by
              first adjusting the board
            </v-alert>
          </v-card>
        </template>

        <!-- Step 2 -->
        <template v-slot:item.2>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6"
                >2 - Adjusting the Board</span
              >
            </template>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Remove any Chests and Interaction tokens (if any) left on the
                  board. They are lost forever.
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Return any Runes that are on the board (if any) to the
                  Initiative Track. Stacks left behind cannot be recovered.
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 3 -->
        <template v-slot:item.3>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6"
                >3 - Game State Information</span
              >
            </template>
            <p class="text-body-1 mb-2">
              Next, open the "Campaign Log" tab in your Chronicles of Drunagor
              App and record the following Game State information:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Record which Adventure will be played in the next session. If
                  this one hasn't been completed yet, it remains the same.
                  Otherwise, it will be the next one.
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Record which Door will be opened next by the Party in that
                  Adventure. If you're finishing an Adventure now, select the
                  "First Setup" of the next Adventure.
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-alert type="warning" variant="tonal" class="mb-4">
              These two steps should only be followed if you haven't completed
              the current Adventure and are saving the game between rooms.
              Otherwise, you may skip them.
            </v-alert>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Record the number of Runes on the Initiative Track. You don't
                  need to specify their color, only the total number.
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Record which Rune, Game State Check-Up, and Game Mechanics
                  cards are on the Initiative Track.
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 4 -->
        <template v-slot:item.4>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6">4 - Hero Information</span>
            </template>
            <p class="text-body-1 mb-2">
              Then, record the following Hero information. The Party Leader must
              fill out the fields for each Hero in the Party. Only the total
              number is important:
            </p>
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Hero's current Health</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title
                      >Number of Curse Cubes the Hero has</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title
                      >Number of Trauma Cubes the Hero has</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>
                      Number of Available Action Cubes the Hero has
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      Number of Action Cubes allocated to Skills or Expended
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title
                      >Which Dungeon Role the Hero is playing</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card>
        </template>

        <!-- Step 5 -->
        <template v-slot:item.5>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6"
                >5 - Resources & Equipment</span
              >
            </template>
            <p class="text-body-1 mb-2">
              Continue by clicking the "Manage Resources" button to register the
              Resource tokens and Equipment each Hero has:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Number of SHIELDS, FOCUS, KI, FURY, FRUIT OF LIFE, and any
                  other tokens defined as Resources
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Which Consumable Items (if any) are in the Hero's Backpack
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Which Equipment the Hero is wielding in each of their
                  equipment slots
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 6 -->
        <template v-slot:item.6>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6">6 - Skills & Abilities</span>
            </template>
            <p class="text-body-1 mb-2">
              Finally, also register the Hero Skills and Class Skills of each
              Hero. These fields only indicate the cards that were chosen:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title
                  >Which Level 1 Skills the Hero has</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-title
                  >Which Level 2 Skills the Hero has</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-title
                  >Which Class Abilities the Hero has</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 7 -->
        <template v-slot:item.7>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6">7 - Save Changes</span>
            </template>
            <p class="text-body-1 mb-4">
              Once all information for all Heroes is filled in, click "Save
              Changes" and you're done! All the relevant information for your
              Campaign has been recorded.
            </p>
            <v-alert type="success" variant="tonal" class="mt-6">
              <strong>Final Step:</strong> When all information is complete,
              click "Save Campaign"!
              <div class="mt-2">Until next time, dear Adventurer!</div>
            </v-alert>
            <v-card-actions class="justify-end mt-4">
              <v-btn color="white" @click="$emit('save')">
                Save Campaign
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-stepper>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const steps = [
  "Save Conditions",
  "Adjusting the Board",
  "Game State Information",
  "Hero Information",
  "Resources & Equipment",
  "Skills & Abilities",
  "Save Changes",
];

defineEmits(["save"]);
</script>

<style scoped>
.v-list-item {
  min-height: 36px;
}

.scroll-container {
  max-height: 20vh;
  overflow-y: auto;
  padding-right: 8px;
}

@media (max-width: 600px) {
  .v-card-title {
    padding: 8px 0 !important;
    line-height: 1.3 !important;
  }

  .v-stepper__header {
    overflow-x: auto !important;
    padding-bottom: 0.5rem;
  }

  .v-stepper__header .v-stepper__step {
    flex: 0 0 48px;
    min-width: 48px;
  }

  .v-stepper__step {
    padding: 4px 2px !important;
  }

  .v-stepper__label {
    font-size: 0.65rem !important;
    line-height: 1.1 !important;
    white-space: normal !important;
    overflow-wrap: break-word !important;
  }

  .scroll-container {
    max-height: 20vh !important;
  }

  .v-list-item-title {
    white-space: normal !important;
    overflow-wrap: break-word !important;
    font-size: 0.75rem;
  }

  ::v-deep .scroll-container p {
    font-size: 0.75rem !important;
    line-height: 1.2 !important;
  }

  ::v-deep .v-alert,
  ::v-deep .v-alert__content {
    font-size: 0.75rem !important;
    line-height: 1.2 !important;
  }
}
</style>
