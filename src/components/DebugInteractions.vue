<template>
  <v-container class="fill-height bg-grey-darken-4" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-card elevation="10" class="rounded-xl border-thin">
          <v-toolbar color="purple-darken-3">
            <v-icon start class="ml-4">mdi-bug</v-icon>
            <v-toolbar-title>Interaction Debugger</v-toolbar-title>
          </v-toolbar>

          <v-card-text class="pa-6">
            <v-alert
              color="info"
              variant="tonal"
              class="mb-4"
              icon="mdi-information"
              text="Selecione a Ala e a Porta para simular a interação."
            ></v-alert>

            <v-select
              v-model="selectedWing"
              label="Select Wing"
              :items="['WING 3', 'WING 4']"
              variant="outlined"
              prepend-inner-icon="mdi-map"
              class="mb-2"
            ></v-select>

            <v-select
              v-model="selectedDoor"
              label="Select Door / Stage"
              :items="availableDoors"
              variant="outlined"
              prepend-inner-icon="mdi-door"
              :disabled="!selectedWing"
            ></v-select>
          </v-card-text>

          <v-card-actions class="pa-4 pt-0">
            <v-btn 
              block 
              color="purple-accent-2" 
              variant="elevated" 
              size="large"
              @click="openDebugDialog"
              :disabled="!selectedWing || !selectedDoor"
              class="font-weight-bold text-black"
            >
              <v-icon start>mdi-play</v-icon>
              Launch Interaction
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog 
      v-model="dialogVisible" 
      fullscreen 
      transition="dialog-bottom-transition" 
      :scrim="false"
    >
      <v-card color="black">
        <InteractViewNew 
          v-if="dialogVisible"
          :current-door="selectedDoor" 
          :wing="selectedWing" 
          @close="dialogVisible = false" 
        />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import InteractViewNew from "@/components/InteractViewNew.vue";

const dialogVisible = ref(false);
const selectedWing = ref('WING 4');
const selectedDoor = ref('FIRST SETUP');

const doorsWing3 = [
  "FIRST SETUP",
  "DUNGEON FOYER",
  "QUEEN'S HALL",
  "THE FORGE",
  "ARTISAN'S GALLERY",
  "PROVING GROUNDS",
  "MAIN HALL"
];

const doorsWing4 = [
  "FIRST SETUP",
  "DRACONIC CHAPEL",
  "CRYPTS",
  "BOTH OPEN",
  "LIBRARY",
  "LABORATORY",
  "DRAGON BOSS"
];

const availableDoors = computed(() => {
  if (selectedWing.value === 'WING 3') return doorsWing3;
  if (selectedWing.value === 'WING 4') return doorsWing4;
  return [];
});

function openDebugDialog() {
  dialogVisible.value = true;
}
</script>

<style scoped>
/* Estilos opcionais se necessário */
</style>