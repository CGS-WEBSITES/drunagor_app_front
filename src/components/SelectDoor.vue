<template>
  <template v-if="isAdmin && !loading">
    <v-select
      v-model="wing"
      label="Select Wing"
      :items="campaignOptions"
      variant="outlined"
      class="mb-4"
      clearable
      @update:modelValue="onWingChange"
    />

    <v-select
      v-model="door"
      :label="'Select Door'"
      :items="filteredDoors"
      variant="outlined"
      :disabled="!wing"
      :loading="savingDoor"
      clearable
      @update:modelValue="onDoorChange"
    />

    <v-alert
      v-if="saveError"
      type="error"
      variant="tonal"
      closable
      class="mt-2"
      @click:close="saveError = ''"
    >
      {{ saveError }}
    </v-alert>

    <v-alert
      v-if="saveSuccess"
      type="success"
      variant="tonal"
      closable
      class="mt-2"
      @click:close="saveSuccess = ''"
    >
      {{ saveSuccess }}
    </v-alert>
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

interface Door {
  doors_pk: number;
  name: string;
  code: string;
}

interface OpenedDoor {
  rl_campaigns_doors_pk: number;
  doors_fk: number;
  campaign_fk: number;
  date: string;
  door_name: string;
  door_code: string;
}

const props = defineProps<{
  campaignId: string;
  campaignType: string;
}>();

const emit = defineEmits<{
  (e: 'door-opened', door: OpenedDoor): void;
  (e: 'door-closed', doorId: number): void;
}>();

const userStore = useUserStore();
const campaignStore = CampaignStore();

const isAdmin = ref(false);
const loading = ref(true);
const savingDoor = ref(false);
const saveError = ref("");
const saveSuccess = ref("");

// Doors from backend
const allDoors = ref<Door[]>([]);
const openedDoors = ref<OpenedDoor[]>([]);

// Wing and door mappings with codes
const wingCodePrefix: Record<string, string> = {
  "Wing 1 - Tutorial": "W1T",
  "Wing 1 - Advanced": "W1A",
  "Wing 2 - Advanced": "W2A",
  "WING 3 - ADVANCED": "W3A",
  "WING 4 - ADVANCED": "W4A",
};

const underkeepWings = [
  "Wing 1 - Tutorial",
  "Wing 1 - Advanced",
  "Wing 2 - Advanced",
];

const underkeepDoors: Record<string, string[]> = {
  "Wing 1 - Tutorial": ["FIRST SETUP", "DOOR 1 - THE BARRICADED PATH", "DOOR 2 - THE KEEP'S COURTYARD", "DOOR 3 - THE ENTRY HALL", "DOOR 4 - THE GREAT HALL"],
  "Wing 1 - Advanced": ["FIRST SETUP", "DOOR 1 - THE BARRICADED PATH", "DOOR 2 - THE KEEP'S COURTYARD", "DOOR 3 - THE ENTRY HALL", "DOOR 4 - THE GREAT HALL"],
  "Wing 2 - Advanced": ["FIRST SETUP", "DOOR 1 - THE GREAT CISTERN", "DOOR 2 - THE DUNGEONS OF OBLIVION", "DOOR 3 - THE ALCHEMY LAB", "DOOR 4 - THE BURIED ARMORY", "DOOR 5 - THERE AND BACK AGAIN"],
};

const underkeep2Wings = [
  "WING 3 - ADVANCED",
  "WING 4 - ADVANCED",
];

const underkeep2Doors: Record<string, string[]> = {
  "WING 3 - ADVANCED": ["DUNGEON FOYER", "QUEEN'S HALL", "THE FORGE", "ARTISAN'S GALLERY", "PROVING GROUNDS", "MAIN HALL"],
  "WING 4 - ADVANCED": ["DRACONIC CHAPEL", "CRYPTS", "LIBRARY", "LABORATORY"],
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
    return underkeep2Doors[selectedWing] || [];
  } 
  return underkeepDoors[selectedWing] || [];
});

const generateDoorCode = (wingName: string, doorName: string): string => {
  const prefix = wingCodePrefix[wingName];
  if (!prefix) return "";

  if (doorName === "FIRST SETUP") {
    return `${prefix}_FIRST_SETUP`;
  }

  const doorMatch = doorName.match(/^DOOR (\d+) - (.+)$/);
  if (doorMatch) {
    return `${prefix}_DOOR_${doorMatch[1]}`;
  }

  const simpleName = doorName
    .toUpperCase()
    .replace(/['']/g, "")
    .replace(/[^A-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  return `${prefix}_${simpleName}`;
};

const findDoorByCode = (code: string): Door | undefined => {
  return allDoors.value.find(d => d.code === code);
};

const isDoorOpened = (doorCode: string): OpenedDoor | undefined => {
  return openedDoors.value.find(od => od.door_code === doorCode);
};

const fetchAllDoors = async () => {
  try {
    const response = await axios.get("/doors/search");
    allDoors.value = response.data.doors || [];
  } catch (error) {
    console.error("Error fetching doors:", error);
  }
};

const fetchOpenedDoors = async () => {
  try {
    const response = await axios.get("/rl_campaign_door/search", {
      params: { campaign_fk: props.campaignId }
    });
    openedDoors.value = response.data.campaign_doors || [];
  } catch (error) {
    console.error("Error fetching opened doors:", error);
  }
};

const saveDoorOpening = async (doorCode: string): Promise<boolean> => {
  const doorObj = findDoorByCode(doorCode);
  
  if (!doorObj) {
    saveError.value = `Door not found in database: ${doorCode}`;
    return false;
  }

  if (isDoorOpened(doorCode)) {
    return true;
  }

  savingDoor.value = true;
  saveError.value = "";
  saveSuccess.value = "";

  try {
    const response = await axios.post("/rl_campaign_door/cadastro", {
      doors_fk: doorObj.doors_pk,
      campaign_fk: parseInt(props.campaignId)
    });

    if (response.status === 201) {
      saveSuccess.value = "Door opened successfully!";
      
      const newOpenedDoor: OpenedDoor = {
        rl_campaigns_doors_pk: response.data.rl_campaign_door.rl_campaigns_doors_pk,
        doors_fk: doorObj.doors_pk,
        campaign_fk: parseInt(props.campaignId),
        date: response.data.rl_campaign_door.date,
        door_name: doorObj.name,
        door_code: doorObj.code
      };
      openedDoors.value.push(newOpenedDoor);
      
      emit('door-opened', newOpenedDoor);
      
      setTimeout(() => {
        saveSuccess.value = "";
      }, 3000);
      
      return true;
    }

    return false;
  } catch (error: any) {
    if (error.response?.status === 409) {
      await fetchOpenedDoors();
      return true;
    }
    
    saveError.value = error.response?.data?.message || "Failed to save door opening";
    console.error("Error saving door opening:", error);
    return false;
  } finally {
    savingDoor.value = false;
  }
};

const onWingChange = (newWing: string | null) => {
  if (!newWing) {
    wing.value = "";
    door.value = "";
    return;
  }

  wing.value = newWing;
  
  const currentDoor = door.value;
  if (currentDoor && !filteredDoors.value.includes(currentDoor)) {
    door.value = "";
  }
};

const onDoorChange = async (newDoor: string | null) => {
  if (!newDoor || !wing.value) {
    door.value = "";
    return;
  }

  door.value = newDoor;

  const doorCode = generateDoorCode(wing.value, newDoor);
  
  if (doorCode) {
    await saveDoorOpening(doorCode);
  }
};

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
  }
};

const initialize = async () => {
  loading.value = true;
  
  try {
    await Promise.all([
      checkUserRole(),
      fetchAllDoors(),
      fetchOpenedDoors()
    ]);
  } catch (error) {
    console.error("Error initializing SelectDoor:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(initialize);
</script>