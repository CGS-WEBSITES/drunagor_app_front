<template>
  <template v-if="isAdmin && !loading">
    <v-select
      v-model="door"
      label="Select Door"
      :items="doorOptions"
      item-title="name"
      item-value="name"
      variant="outlined"
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

    <v-alert
      v-if="newDoorDetected"
      type="info"
      variant="tonal"
      closable
      class="mt-2"
      @click:close="newDoorDetected = ''"
    >
      <v-icon class="mr-2">mdi-door-open</v-icon>
      {{ newDoorDetected }}
    </v-alert>
  </template>

  <template v-else-if="!loading">
    <v-text-field
      :model-value="door"
      label="Door"
      variant="outlined"
      readonly
      persistent-hint
      disabled
    />

    <v-alert
      v-if="newDoorDetected"
      type="info"
      variant="tonal"
      closable
      class="mt-2"
      @click:close="newDoorDetected = ''"
    >
      <v-icon class="mr-2">mdi-door-open</v-icon>
      {{ newDoorDetected }}
    </v-alert>
  </template>

  <template v-else>
    <v-text-field label="Door" variant="outlined" loading readonly disabled />
  </template>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";

interface Door {
  doors_pk: number;
  name: string;
  code: string | null;
}

interface OpenedDoor {
  rl_campaigns_doors_pk: number;
  doors_fk: number;
  campaign_fk: number;
  date: string;
  door_name: string;
  door_code: string | null;
}

const props = defineProps<{
  campaignId: string;
}>();

const emit = defineEmits<{
  (e: "door-opened", door: OpenedDoor): void;
  (e: "door-closed", doorId: number): void;
  (e: "doors-updated", doors: OpenedDoor[]): void;
}>();

const userStore = useUserStore();
const campaignStore = CampaignStore();

const isAdmin = ref(false);
const loading = ref(true);
const savingDoor = ref(false);
const saveError = ref("");
const saveSuccess = ref("");
const newDoorDetected = ref("");

const allDoors = ref<Door[]>([]);
const openedDoors = ref<OpenedDoor[]>([]);

// Polling
const POLLING_INTERVAL = 5000; // 5 seconds
let pollingTimer: ReturnType<typeof setInterval> | null = null;
const isPollingActive = ref(true);

// Door options from database
const doorOptions = computed(() => {
  return allDoors.value.map((d) => ({
    name: d.name,
    code: d.code,
    doors_pk: d.doors_pk,
  }));
});

const door = computed({
  get() {
    return campaignStore.find(props.campaignId)?.door ?? "";
  },
  set(newValue) {
    if (isAdmin.value) {
      campaignStore.updateCampaignProperty(props.campaignId, "door", newValue);
    }
  },
});

const findDoorByName = (name: string): Door | undefined => {
  return allDoors.value.find((d) => d.name === name);
};

const isDoorOpened = (doorName: string): OpenedDoor | undefined => {
  return openedDoors.value.find((od) => od.door_name === doorName);
};

const fetchAllDoors = async () => {
  try {
    const response = await axios.get("/doors/search");
    allDoors.value = response.data.doors || [];
  } catch (error) {
    console.error("Error fetching doors:", error);
  }
};

const fetchOpenedDoors = async (): Promise<OpenedDoor[]> => {
  try {
    const response = await axios.get("/rl_campaigns_doors/search", {
      params: { campaign_fk: props.campaignId },
    });
    return response.data.campaign_doors || [];
  } catch (error) {
    console.error("Error fetching opened doors:", error);
    return [];
  }
};

const checkForNewDoors = async () => {
  if (!isPollingActive.value) return;

  try {
    const currentDoors = await fetchOpenedDoors();
    const currentIds = new Set(
      openedDoors.value.map((d) => d.rl_campaigns_doors_pk),
    );
    const newDoors = currentDoors.filter(
      (d) => !currentIds.has(d.rl_campaigns_doors_pk),
    );

    if (newDoors.length > 0) {
      openedDoors.value = currentDoors;

      newDoors.forEach((newDoor) => {
        newDoorDetected.value = `New door opened: ${newDoor.door_name}`;
        emit("door-opened", newDoor);

        setTimeout(() => {
          if (
            newDoorDetected.value === `New door opened: ${newDoor.door_name}`
          ) {
            newDoorDetected.value = "";
          }
        }, 5000);
      });

      emit("doors-updated", currentDoors);
    }
  } catch (error) {
    console.error("Error checking for new doors:", error);
  }
};

const startPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
  }

  pollingTimer = setInterval(checkForNewDoors, POLLING_INTERVAL);
  console.log(`[SelectDoor] Polling started (${POLLING_INTERVAL}ms interval)`);
};

const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
    console.log("[SelectDoor] Polling stopped");
  }
};

const handleVisibilityChange = () => {
  if (document.hidden) {
    isPollingActive.value = false;
    stopPolling();
    console.log("[SelectDoor] Tab hidden - polling paused");
  } else {
    isPollingActive.value = true;
    checkForNewDoors();
    startPolling();
    console.log("[SelectDoor] Tab visible - polling resumed");
  }
};

const saveDoorOpening = async (doorName: string): Promise<boolean> => {
  const doorObj = findDoorByName(doorName);

  if (!doorObj) {
    saveError.value = `Door not found in database: ${doorName}`;
    return false;
  }

  // FIRST SETUP and END GAME have null code - local navigation only
  if (!doorObj.code) {
    console.log(`[SelectDoor] ${doorName} - local navigation only (no code)`);
    return true;
  }

  if (isDoorOpened(doorName)) {
    return true;
  }

  savingDoor.value = true;
  saveError.value = "";
  saveSuccess.value = "";

  try {
    const response = await axios.post("/rl_campaigns_doors/cadastro", {
      doors_fk: doorObj.doors_pk,
      campaign_fk: parseInt(props.campaignId),
    });

    if (response.status === 201) {
      saveSuccess.value = "Door opened successfully!";

      const newOpenedDoor: OpenedDoor = {
        rl_campaigns_doors_pk:
          response.data.rl_campaign_door.rl_campaigns_doors_pk,
        doors_fk: doorObj.doors_pk,
        campaign_fk: parseInt(props.campaignId),
        date: response.data.rl_campaign_door.date,
        door_name: doorObj.name,
        door_code: doorObj.code,
      };
      openedDoors.value.push(newOpenedDoor);

      emit("door-opened", newOpenedDoor);

      setTimeout(() => {
        saveSuccess.value = "";
      }, 3000);

      return true;
    }

    return false;
  } catch (error: any) {
    if (error.response?.status === 409) {
      openedDoors.value = await fetchOpenedDoors();
      return true;
    }

    saveError.value =
      error.response?.data?.message || "Failed to save door opening";
    console.error("Error saving door opening:", error);
    return false;
  } finally {
    savingDoor.value = false;
  }
};

const onDoorChange = async (newDoor: string | null) => {
  if (!newDoor) {
    door.value = "";
    return;
  }

  door.value = newDoor;
  await saveDoorOpening(newDoor);
};

const checkUserRole = async () => {
  try {
    const response = await axios.get("/rl_campaigns_users/search", {
      params: {
        users_fk: userStore.user?.users_pk,
        campaigns_fk: props.campaignId,
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
    await Promise.all([checkUserRole(), fetchAllDoors()]);

    openedDoors.value = await fetchOpenedDoors();

    startPolling();

    document.addEventListener("visibilitychange", handleVisibilityChange);
  } catch (error) {
    console.error("Error initializing SelectDoor:", error);
  } finally {
    loading.value = false;
  }
};

onBeforeUnmount(() => {
  stopPolling();
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});

onMounted(initialize);
</script>
