<template>
  <v-card class="pa-4" color="surface">
    <v-card-text class="scroll-container">
      <v-stepper mobile :items="steps">
        <!-- Step 1 -->
        <template v-slot:item.1>
          <v-card flat title="1 - Save Conditions">
            <p class="text-body-1 mb-4">
              You&apos;re done with this game session and it&apos;s time to save
              your Party&apos;s progress. To do so, ensure that:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>No Monsters are alive</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  The Initiative marker is on the End of the Round Game State
                  Check-Up card
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-alert type="info" variant="tonal" class="mb-4">
              If both conditions are met, you can save your Party&apos;s
              progress
            </v-alert>
          </v-card>
        </template>

        <!-- Step 2 -->
        <template v-slot:item.2>
          <v-card flat title="2 - Adjusting the Board">
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Remove any Chests and Interaction tokens left on the board
                  (they are lost forever)
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Return any Runes on the board to the Initiative Track (stacks
                  left behind cannot be recovered)
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 3 -->
        <template v-slot:item.3>
          <v-card flat title="3 - Game State Information">
            <p class="text-body-1 mb-2">
              Open the "Campaign Log" tab and record:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Next Adventure to be played (same if current not completed)
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Next Door to be opened ("First Setup" if finishing adventure)
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-alert type="warning" variant="tonal" class="mb-4">
              These two steps are only needed if saving between rooms in an
              uncompleted adventure
            </v-alert>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Total number of Runes on the Initiative Track
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Specific Rune, Game State Check-Up, and Game Mechanics cards
                  on the Track
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 4 -->
        <template v-slot:item.4>
          <v-card flat title="4 - Recording Hero Information">
            <p class="text-body-1 mb-2">For each Hero, record:</p>
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Current Health</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Number of Curse Cubes</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      Number of Trauma Cubes
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>
                      Available Action Cubes
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      Action Cubes allocated/expended
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Current Dungeon Role</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card>
        </template>

        <!-- Step 5 -->
        <template v-slot:item.5>
          <v-card flat title="5 - Resources & Equipment">
            <p class="text-body-1 mb-2">
              Use the "Manage Resources" button to register:
            </p>
            <v-list density="compact" class="mb-4">
              <v-list-item>
                <v-list-item-title>
                  Resource tokens (SHIELDS, FOCUS, KI, FURY, FRUIT OF LIFE,
                  etc.)
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  Consumable Items in Backpack
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Equipment in each slot</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

        <!-- Step 6 -->
        <template v-slot:item.6>
          <v-card flat title="6 - Skills & Abilities">
            <p class="text-body-1 mb-2">
              Register selected cards for each Hero:
            </p>
            <v-list density="compact" class="mb-4">
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

        <!-- Step 7 -->
        <template v-slot:item.7>
          <v-card flat title="7 - Review & Save">
            <v-alert type="success" variant="tonal" class="mt-6">
              <strong>Final Step:</strong> When all information is complete,
              click “Save Changes”!
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
  "Recording Hero Information",
  "Resources & Equipment",
  "Skills & Abilities",
  "Review & Save",
];

defineEmits(["save"]);
</script>

<style scoped>
.v-list-item {
  min-height: 36px;
}

.scroll-container {
  max-height: 15vh;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
