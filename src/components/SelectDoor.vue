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
}>();

const userStore = useUserStore();
const campaignStore = CampaignStore();

const isAdmin = ref(false);
const loading = ref(true);

const campaignOptions = [
  "Wing 1 - Tutorial",
  "Wing 1 - Advanced",
  "Wing 2 - Advanced",
];

const allDoorOptions = [
  "FIRST SETUP", "DOOR 1 - THE BARRICADED PATH", "DOOR 2 - THE KEEP'S COURTYARD", "DOOR 3 - THE ENTRY HALL", "DOOR 4 - THE GREAT HALL",
  "FIRST SETUP", "DOOR 1 - THE BARRICADED PATH", "DOOR 2 - THE KEEP'S COURTYARD", "DOOR 3 - THE ENTRY HALL", "DOOR 4 - THE GREAT HALL",
  "FIRST SETUP", "DOOR 1 - THE GREAT CISTERN", "DOOR 2 - THE DUNGEONS OF OBLIVION", "DOOR 3 - THE ALCHEMY LAB", "DOOR 4 - THE BURIED ARMORY", "DOOR 5 - THERE AND BACK AGAIN",
];

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
  switch (wing.value) {
    case "Wing 1 - Tutorial": return allDoorOptions.slice(0, 5);
    case "Wing 1 - Advanced": return allDoorOptions.slice(5, 10);
    case "Wing 2 - Advanced": return allDoorOptions.slice(10, 16); // Corrected to 16 to include the last door
    default: return [];
  }
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