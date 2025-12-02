<template>
  <template v-if="isAdmin && !loading">
    <v-select
      v-model="wing"
      label="Select Wing"
      :items="campaignOptions"
      variant="outlined"
      class="mb-4"
      clearable
    />

    <v-select
      v-model="door"
      :label="'Select Door'"
      :items="filteredDoors"
      variant="outlined"
      :disabled="!wing"
      clearable
    />
  </template>

  <template v-else-if="!loading">
    <v-text-field
      :model-value="wing"
      label="Wing"
      variant="outlined"
      class="mb-4"
      readonly
      persistent-hint
      :disabled="!isAdmin"
    />

    <v-text-field
      :model-value="door"
      label="Door"
      variant="outlined"
      readonly
      persistent-hint
      :disabled="!isAdmin"
    />
  </template>

  <template v-else>
    <v-text-field
      label="Wing"
      variant="outlined"
      class="mb-4"
      loading
      readonly
      :disabled="!isAdmin"
    />

    <v-text-field
      label="Door"
      variant="outlined"
      loading
      readonly
      :disabled="!isAdmin"
    />
  </template>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const props = defineProps<{
  campaignId: string;
  campaignType: string;
}>();

const userStore = useUserStore();
const campaignStore = CampaignStore();

const isAdmin = ref(false);
const loading = ref(true);

const underkeepWings = [
  "Wing 1 - Tutorial",
  "Wing 1 - Advanced",
  "Wing 2 - Advanced",
];
const underkeepDoors = {
  "Wing 1 - Tutorial": ["FIRST SETUP", "DOOR 1 - THE BARRICADED PATH", "DOOR 2 - THE KEEP'S COURTYARD", "DOOR 3 - THE ENTRY HALL", "DOOR 4 - THE GREAT HALL"],
  "Wing 1 - Advanced": ["FIRST SETUP", "DOOR 1 - THE BARRICADED PATH", "DOOR 2 - THE KEEP'S COURTYARD", "DOOR 3 - THE ENTRY HALL", "DOOR 4 - THE GREAT HALL"],
  "Wing 2 - Advanced": ["FIRST SETUP", "DOOR 1 - THE GREAT CISTERN", "DOOR 2 - THE DUNGEONS OF OBLIVION", "DOOR 3 - THE ALCHEMY LAB", "DOOR 4 - THE BURIED ARMORY", "DOOR 5 - THERE AND BACK AGAIN"],
};

const underkeep2Wings = [
  "WING 3 - ADVANCED",
  "WING 4 - ADVANCED",
];
const underkeep2Doors = {
  "WING 3 - ADVANCED": ["FIRST SETUP","DUNGEON FOYER", "QUEEN'S HALL", "THE FORGE", "ARTISAN'S GALLERY", "PROVING GROUNDS", "MAIN HALL"],
  "WING 4 - ADVANCED": ["FIRST SETUP", "DRACONIC CHAPEL", "CRYPTS", "LIBRARY", "LABORATORY"],
};

const campaignOptions = computed(() => {
  if (props.campaignType === 'underkeep2') {
    return underkeep2Wings;
  }
  return underkeepWings;
});

const wing = computed({
  get() {
    return campaignStore.find(props.campaignId)?.wing ?? "";
  },
  set(newValue) {
    if (isAdmin.value) {
      campaignStore.updateCampaignProperty(props.campaignId, 'wing', newValue);
      const currentDoor = campaignStore.find(props.campaignId)?.door;
      if (currentDoor && !filteredDoors.value.includes(currentDoor)) {
        campaignStore.updateCampaignProperty(props.campaignId, 'door', "");
      }
    }
  },
});

const door = computed({
  get() {
    return campaignStore.find(props.campaignId)?.door ?? "";
  },
  set(newValue) {
    if (isAdmin.value) {
      campaignStore.updateCampaignProperty(props.campaignId, 'door', newValue);
    }
  },
});

const filteredDoors = computed(() => {
  const selectedWing = wing.value;
  if (!selectedWing) {
    return [];
  }

  if (props.campaignType === 'underkeep2') {
    return underkeep2Doors[selectedWing as keyof typeof underkeep2Doors] || [];
  } 
  return underkeepDoors[selectedWing as keyof typeof underkeepDoors] || [];
});

const checkUserRole = async () => {
  try {
    const response = await axios.get("rl_campaigns_users/search", {
      params: { 
        users_fk: userStore.user?.users_pk, 
        campaigns_fk: props.campaignId 
      },
    });
    isAdmin.value = response.data.campaigns[0]?.party_role === "Admin";
  } catch (error) {
    isAdmin.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(checkUserRole);
</script>