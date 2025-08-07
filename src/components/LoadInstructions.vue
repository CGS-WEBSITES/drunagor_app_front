<template>
  <v-card class="pa-4" color="surface">
    <v-card-text class="scroll-container">
      <v-stepper mobile :items="steps">
        <!-- Step 1: Initial Setup -->
        <template v-slot:item.1>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6">1 - Initial Setup</span>
            </template>
            <p class="text-body-1 mb-4">
              We're glad to have you back, dear Adventurers! These instructions
              will help you restart the Campaign exactly where you left off.
            </p>
            <v-alert type="info" variant="tonal" class="mb-4">
              Make sure all Trays, Maps, and Doors of the Adventure are already
              set up in their respective places.
            </v-alert>
            <p class="text-body-1 mb-2">
              Open the "Campaign Log" tab in your Chronicles of Drunagor App,
              check which Heroes are in your Party, and gather the appropriate
              components:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Model, Hero Board, Initiative card, Hero Skill cards, and
                  Class Ability cards for each Hero in your Party
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 2: Initiative Track Setup -->
        <template v-slot:item.2>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6"
                >2 - Initiative Track Setup</span
              >
            </template>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  If there is a record of Runes on the Initiative Track, draw
                  the indicated number of Runes and place them back on the Track
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  If there are any Rune, Game State Check-Up, and/or Game
                  Mechanics cards, place them in the appropriate positions on
                  the Initiative Track
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-alert type="warning" variant="tonal" class="mb-4">
              <strong>Card Placement Rules:</strong>
              <div class="mt-2">
                All cards go at the bottom end of the Track, in the Rune Slot,
                except for the Monster Raid Game Mechanic card, which goes on
                top of this same Slot.
              </div>
              <div class="mt-2">
                <strong>Correct order:</strong> Game Mechanics go on top of Rune
                cards, which in turn go on top of Game State Check-Up cards.
              </div>
            </v-alert>
          </v-card>
        </template>

        <!-- Step 3: Manage Resources -->
        <template v-slot:item.3>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6">3 - Manage Resources</span>
            </template>
            <p class="text-body-1 mb-2">
              Click the "Manage Resources" button and assign the following
              components to each Hero:
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

        <!-- Step 4: Hero Skills and Class Skills -->
        <template v-slot:item.4>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6"
                >4 - Hero Skills and Class Skills</span
              >
            </template>
            <p class="text-body-1 mb-2">
              Click the "Hero Skills and Class Skills" button and assign each
              Hero the Abilities they've learned in previous sessions:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Which Dungeon Role the Hero is fulfilling
                </v-list-item-title>
              </v-list-item>
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

        <!-- Step 5: Adjust Hero Game State -->
        <template v-slot:item.5>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6"
                >5 - Adjust Hero Game State</span
              >
            </template>
            <p class="text-body-1 mb-2">
              Adjust each Hero's Game State as recorded in the Campaign Log:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  <strong>Available Action Cubes:</strong> Check their
                  Initiative card to see their starting amount, then give them
                  the appropriate Cubes based on the Hero Skills they've learned
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <strong>Action Cubes allocation:</strong> How many Action
                  Cubes are allocated to Skills or Expended. You may place all
                  of them in the Expended Cube Box. Heroes resume the game with
                  all Hero Skills unassigned
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <strong>Curse and Trauma Cubes:</strong> How many Curse and
                  Trauma Cubes the Hero has. Curse Cubes or Trauma Cubes can be
                  placed in any Hero or Role Skill. No need to repeat those
                  selected in the previous session
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Hero's current Health</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 6: Final Setup and Resume -->
        <template v-slot:item.6>
          <v-card flat>
            <template #title>
              <span class="text-body-1 text-sm-h6"
                >6 - Final Setup and Resume</span
              >
            </template>
            <p class="text-body-1 mb-2">Once all Hero information is set:</p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Place Heroes back on the board. Each Hero may reposition their
                  Model to a space within Range 1 of the Door listed as "Next
                  Door" in their Campaign Log
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  At least one Hero must be adjacent to the Next Door to open it
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Open that Door and build its Setup
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Return the Initiative marker to the first card on the Track
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-alert type="success" variant="tonal" class="mt-6">
              <div class="text-h6">Resume the game!</div>
              <div class="mt-2">That's it! Resume the game!</div>
            </v-alert>
          </v-card>
        </template>
      </v-stepper>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";

const steps = [
  "Initial Setup",
  "Initiative Track Setup",
  "Manage Resources",
  "Hero Skills and Class Skills",
  "Adjust Hero Game State",
  "Final Setup and Resume",
];

defineEmits(["save"]);
</script>

<style scoped>
.scroll-container {
  max-height: 20vh;
  overflow-y: auto;
  padding-right: 8px;
}

.v-list-item {
  min-height: 36px;
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

  ::v-deep .v-alert ul li {
    font-size: 0.75rem !important;
    line-height: 1.2 !important;
  }
}
</style>
