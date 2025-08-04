<template>
  <v-card class="pa-4" color="surface">
    <v-card-text class="scroll-container">
      <p class="text-body-1 mb-4">
        We're glad to have you back, dear Adventurers! These instructions will
        help you restart the Campaign exactly where you left off.
      </p>

      <v-alert type="info" variant="tonal" class="mb-4">
        Make sure all Trays, Maps, and Doors of the Adventure are already set up
      </v-alert>

      <v-card-title
        class="text-subtitle-1 font-weight-bold text-primary mt-6 mb-2"
      >
        Preparation Steps
      </v-card-title>

      <p class="text-body-1 mb-2">
        Open the "Campaign Log" tab and gather the appropriate components:
      </p>

      <v-list density="compact" class="mb-4">
        <v-list-item>
          <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
          <v-list-item-title>
            Model, Hero Board, Initiative card, Hero Skill cards, and Class
            Ability cards for each Hero
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon color="amber" class="mr-2">mdi-diamond-stone</v-icon>
          <v-list-item-title>
            Draw the recorded number of Runes and place them on the Initiative
            Track
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon color="teal" class="mr-2">mdi-cards</v-icon>
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

      <v-card-title
        class="text-subtitle-1 font-weight-bold text-primary mt-6 mb-2"
      >
        Assigning Hero Components
      </v-card-title>

      <p class="text-body-1 mb-2">
        Use the "Manage Resources" button to assign:
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
        Assigning Skills and Abilities
      </v-card-title>

      <p class="text-body-1 mb-2">
        Use the "Hero Skills and Class Skills" button to assign:
      </p>

      <v-list density="compact" class="mb-4">
        <v-list-item>
          <v-icon color="amber" class="mr-2">mdi-account</v-icon>
          <v-list-item-title>Dungeon Role</v-list-item-title>
        </v-list-item>
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

      <v-card-title
        class="text-subtitle-1 font-weight-bold text-primary mt-6 mb-2"
      >
        Adjusting Hero Game State
      </v-card-title>

      <p class="text-body-1 mb-2">For each Hero, adjust:</p>

      <v-row class="mb-4">
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
          </v-list>
        </v-col>
        <v-col cols="12" md="6">
          <v-list density="compact">
            <v-list-item>
              <v-icon color="purple" class="mr-2">mdi-cube</v-icon>
              <v-list-item-title>Curse Cubes</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-icon color="deep-purple" class="mr-2">mdi-cube-outline</v-icon>
              <v-list-item-title>Trauma Cubes</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-icon color="red" class="mr-2">mdi-heart</v-icon>
              <v-list-item-title>Current Health</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <v-card-title
        class="text-subtitle-1 font-weight-bold text-primary mt-6 mb-2"
      >
        Final Steps
      </v-card-title>

      <v-list density="compact" class="mb-4">
        <v-list-item>
          <v-icon color="success" class="mr-2">mdi-door</v-icon>
          <v-list-item-title>
            Place Heroes within Range 1 of the "Next Door" (at least one
            adjacent)
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon color="info" class="mr-2">mdi-door-open</v-icon>
          <v-list-item-title>
            Open the Door and build its Setup
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-icon color="primary" class="mr-2">mdi-restart</v-icon>
          <v-list-item-title>
            Return the Initiative marker to the first card
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-alert type="success" variant="tonal" class="mt-6">
        <div class="text-h6">Resume the game!</div>
        <div class="mt-2">Good luck on your adventure!</div>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Componente apenas visual
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
