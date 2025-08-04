<template>
  <v-card class="pa-4" color="surface">
    <!-- Container scrollável -->
    <v-card-text class="scroll-container">
      <p class="text-body-1 mb-4">
        You're done with this game session and it's time to save your Party's
        progress. To do so, ensure that:
      </p>

      <v-list density="compact" class="mb-4">
        <v-list-item>
          <v-icon color="error" class="mr-2">mdi-skull</v-icon>
          <v-list-item-title>No Monsters are alive</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon color="info" class="mr-2">mdi-flag-checkered</v-icon>
          <v-list-item-title>
            The Initiative marker is on the End of the Round Game State Check-Up
            card
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-alert type="info" variant="tonal" class="mb-4">
        If both conditions are met, you can save your Party's progress
      </v-alert>

      <v-card-title
        class="text-subtitle-1 font-weight-bold text-primary mt-6 mb-2"
      >
        Adjusting the Board
      </v-card-title>

      <v-list density="compact" class="mb-4">
        <v-list-item>
          <v-icon color="warning" class="mr-2">mdi-delete</v-icon>
          <v-list-item-title>
            Remove any Chests and Interaction tokens left on the board (they are
            lost forever)
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon color="success" class="mr-2">mdi-autorenew</v-icon>
          <v-list-item-title>
            Return any Runes on the board to the Initiative Track (stacks left
            behind cannot be recovered)
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card-title
        class="text-subtitle-1 font-weight-bold text-primary mt-6 mb-2"
      >
        Recording Game State Information
      </v-card-title>

      <p class="text-body-1 mb-2">Open the "Campaign Log" tab and record:</p>

      <v-list density="compact" class="mb-4">
        <v-list-item>
          <v-icon class="mr-2">mdi-map</v-icon>
          <v-list-item-title>
            Next Adventure to be played (same if current not completed)
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon class="mr-2">mdi-door</v-icon>
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
          <v-icon class="mr-2">mdi-numeric</v-icon>
          <v-list-item-title>
            Total number of Runes on the Initiative Track
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon class="mr-2">mdi-cards</v-icon>
          <v-list-item-title>
            Specific Rune, Game State Check-Up, and Game Mechanics cards on the
            Track
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card-title
        class="text-subtitle-1 font-weight-bold text-primary mt-6 mb-2"
      >
        Recording Hero Information
      </v-card-title>

      <p class="text-body-1 mb-2">For each Hero, record:</p>

      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <v-list density="compact">
            <v-list-item>
              <v-icon color="red" class="mr-2">mdi-heart</v-icon>
              <v-list-item-title>Current Health</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-icon color="purple" class="mr-2">mdi-cube</v-icon>
              <v-list-item-title>Number of Curse Cubes</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-icon color="deep-purple" class="mr-2">mdi-cube-outline</v-icon>
              <v-list-item-title>Number of Trauma Cubes</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="6">
          <v-list density="compact">
            <v-list-item>
              <v-icon color="green" class="mr-2">mdi-cube-scan</v-icon>
              <v-list-item-title>Available Action Cubes</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-icon color="blue" class="mr-2">mdi-function</v-icon>
              <v-list-item-title
                >Action Cubes allocated/expended</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-icon color="amber" class="mr-2">mdi-account</v-icon>
              <v-list-item-title>Current Dungeon Role</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <v-card-title
        class="text-subtitle-1 font-weight-bold text-primary mt-6 mb-2"
      >
        Resources & Equipment
      </v-card-title>

      <p class="text-body-1 mb-2">
        Use the "Manage Resources" button to register:
      </p>

      <v-list density="compact" class="mb-4">
        <v-list-item>
          <v-icon class="mr-2">mdi-shield</v-icon>
          <v-list-item-title>
            Resource tokens (SHIELDS, FOCUS, KI, FURY, FRUIT OF LIFE, etc.)
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon class="mr-2">mdi-bag-personal</v-icon>
          <v-list-item-title> Consumable Items in Backpack </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon class="mr-2">mdi-sword</v-icon>
          <v-list-item-title> Equipment in each slot </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card-title
        class="text-subtitle-1 font-weight-bold text-primary mt-6 mb-2"
      >
        Skills & Abilities
      </v-card-title>

      <p class="text-body-1 mb-2">Register selected cards for each Hero:</p>

      <v-list density="compact" class="mb-4">
        <v-list-item>
          <v-icon color="primary" class="mr-2">mdi-cards</v-icon>
          <v-list-item-title>Level 1 Skills</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon color="secondary" class="mr-2">mdi-cards</v-icon>
          <v-list-item-title>Level 2 Skills</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon color="teal" class="mr-2">mdi-cards</v-icon>
          <v-list-item-title>Class Abilities</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-alert type="success" variant="tonal" class="mt-6">
        <strong>Final Step:</strong> When all information is complete, click
        "Save Changes"!
        <div class="mt-2">Until next time, dear Adventurer!</div>
      </v-alert>
    </v-card-text>
    <v-card-actions class="justify-end mt-4">
      <v-btn color="white" class="mt-4" @click="$emit('save')">
        Save Campaign
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineEmits(["save"]);
</script>

<style scoped>
.headline {
  font-family: "Cinzel Decorative", cursive;
  border-bottom: 2px solid #3f51b5;
  padding-bottom: 12px;
}

.text-primary {
  color: #3f51b5 !important;
}

.v-list-item {
  min-height: 36px;
}

.scroll-container {
  max-height: 25vh;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
