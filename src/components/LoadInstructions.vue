<template>
  <v-card class="pa-4" color="surface">
    <v-card-text class="scroll-container">
      <v-stepper mobile :items="steps">
        
        <!-- Step 1: Welcome & Setup -->
        <template v-slot:item.1>
          <v-card flat title="1 - Welcome & Setup">
            <p class="text-body-1 mb-4">
              We're glad to have you back, dear Adventurers! These instructions will
              help you restart the Campaign exactly where you left off.
            </p>
            <v-alert type="info" variant="tonal" class="mb-4">
              Make sure all Trays, Maps, and Doors of the Adventure are already set up
            </v-alert>
          </v-card>
        </template>

        <!-- Step 2: Preparation Steps -->
        <template v-slot:item.2>
          <v-card flat title="2 - Preparation Steps">
            <p class="text-body-1 mb-2">
              Open the "Campaign Log" tab and gather the appropriate components:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Model, Hero Board, Initiative card, Hero Skill cards, and Class
                  Ability cards for each Hero
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Draw the recorded number of Runes and place them on the Initiative
                  Track
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Place any recorded Rune, Game State Check-Up, and Game Mechanics
                  cards on the Track
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-alert type="warning" variant="tonal" class="mb-4">
              <strong>Card Placement Order:</strong>
              <ul class="mt-2">
                <li>Game Mechanics on top</li>
                <li>Rune cards in the middle</li>
                <li>Game State Check-Up cards at the bottom</li>
              </ul>
              <div class="mt-2">
                Exception: Monster Raid Game Mechanic card goes on top of the Rune
                Slot
              </div>
            </v-alert>
          </v-card>
        </template>

        <!-- Step 3: Assigning Hero Components -->
        <template v-slot:item.3>
          <v-card flat title="3 - Assigning Hero Components">
            <p class="text-body-1 mb-2">
              Use the "Manage Resources" button to assign:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Resource tokens (SHIELDS, FOCUS, KI, FURY, FRUIT OF LIFE, etc.)
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Consumable Items in Backpack</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Equipment in each slot</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 4: Assigning Skills & Abilities -->
        <template v-slot:item.4>
          <v-card flat title="4 - Assigning Skills & Abilities">
            <p class="text-body-1 mb-2">
              Use the "Hero Skills and Class Skills" button to assign:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>Dungeon Role</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Level 1 Skills</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Level 2 Skills</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Class Abilities</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 5: Adjusting Hero Game State -->
        <template v-slot:item.5>
          <v-card flat title="5 - Adjusting Hero Game State">
            <p class="text-body-1 mb-2">For each Hero, adjust:</p>
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Available Action Cubes</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      Action Cubes allocated/expended
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Curse Cubes</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Trauma Cubes</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Current Health</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card>
        </template>

        <!-- Step 6: Final Steps -->
        <template v-slot:item.6>
          <v-card flat title="6 - Final Steps">
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Place Heroes within Range 1 of the "Next Door" (at least one adjacent)
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Open the Door and build its Setup
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Return the Initiative marker to the first card
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-alert type="success" variant="tonal" class="mt-6">
              <div class="text-h6">Resume the game!</div>
              <div class="mt-2">Good luck on your adventure!</div>
            </v-alert>
          </v-card>
        </template>

      </v-stepper>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

const steps = [
  'Welcome & Setup',
  'Preparation Steps',
  'Assigning Hero Components',
  'Assigning Skills & Abilities',
  'Adjusting Hero Game State',
  'Final Steps',
]

defineEmits(['save'])
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
</style>
