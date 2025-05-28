<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  campaignId: string;
}>();

const { t } = useI18n();

const campaignStore = CampaignStore();
const campaign = campaignStore.find(props.campaignId);

// Opções de campanha
const campaignOptions = [
  "Wing 1 - Tutorial",
  "Wing 1 - Advanced",
  "Wing 2 - Advanced",
];

// Lista completa de portas
const allDoorOptions = [
  "FIRST SETUP",
  "DOOR 1 - THE BARRICADED PATH",
  "DOOR 2 - THE KEEP'S COURTYARD",
  "DOOR 3 - THE ENTRY HALL",
  "DOOR 4 - THE GREAT HALL",
  "FIRST SETUP",
  "DOOR 1 - THE BARRICADED PATH",
  "DOOR 2 - THE KEEP'S COURTYARD",
  "DOOR 3 - THE ENTRY HALL",
  "DOOR 4 - THE GREAT HALL",
  "FIRST SETUP",
  "DOOR 1 - THE GREAT CISTERN",
  "DOOR 2 - THE DUNGEONS OF OBLIVION",
  "DOOR 3 - THE ALCHEMY LAB",
  "DOOR 4 - THE BURIED ARMORY",
  "DOOR 5 - THERE AND BACK AGAIN",
];

const selectedWing = ref(campaign.wing || "");
const selectedDoor = ref(campaign.door || "");

// Computa as portas com base na campanha escolhida
const filteredDoors = computed(() => {
  switch (selectedWing.value) {
    case "Wing 1 - Tutorial":
      return allDoorOptions.slice(0, 5);
    case "Wing 1 - Advanced":
      return allDoorOptions.slice(5, 10);
    case "Wing 2 - Advanced":
      return allDoorOptions.slice(10, 15);
    default:
      return [];
  }
});

// Atualiza o store ao selecionar uma wing
watch(selectedWing, (newValue) => {
  campaignStore.find(props.campaignId).wing = newValue;
});

// Atualiza o store ao selecionar uma porta
watch(selectedDoor, (newValue) => {
  campaignStore.find(props.campaignId).door = newValue;
});
</script>

<template>
  <v-select
    v-model="selectedWing"
    label="Select Wing"
    :items="campaignOptions"
    variant="outlined"
    class="mb-4"
    clearable
  />

  <v-select
    v-model="selectedDoor"
    :label="('Select Door')"
    :items="filteredDoors"
    variant="outlined"
    :disabled="!selectedWing"
    clearable
  />
</template>