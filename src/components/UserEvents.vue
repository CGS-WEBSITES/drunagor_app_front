<template>
  <v-row justify="center">
    <v-col cols="12" class="text-center">
      <h1 class="cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2">
        EVENTS
      </h1>
    </v-col>
  </v-row>

  <v-col cols="12" md="10" class="mx-auto">
    <v-card class="pb-12" min-height="500px" color="#151515">
      <!-- Tabs -->
      <v-row no-gutters>
        <v-col cols="12">
          <v-tabs
            class="EventsTabs mb-3"
            v-model="activeTab"
            fixed-tabs
            align-tabs="center"
            color="white"
          >
            <v-tab class="text-h5" :value="1">ALL EVENTS</v-tab>
            <v-tab class="text-h5" :value="2">MY EVENTS</v-tab>
          </v-tabs>
        </v-col>
      </v-row>

      <!-- ALL EVENTS -->
      <div v-if="activeTab === 1">
        <!-- Loading spinner -->
        <div v-if="loading" class="d-flex justify-center my-8">
          <v-progress-circular indeterminate size="48" color="primary" />
        </div>
        <!-- Event list -->
        <div v-else class="list-container">
          <v-row class="mb-4" align="center">
            <v-col cols="12" sm="6">
              <v-checkbox
                v-model="showPastEvents"
                label="Past events"
                hide-details
                color="primary"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-for="(event, index) in sortedEvents"
              :key="index"
              class="py-2 pl-1 pr-1"
              cols="12"
              md="6"
            >
              <v-card color="terciary" class="pt-0 event-card" @click="openDialog(event)">
                <v-row no-gutters>
                  <v-col cols="4" sm="2">
                    <div class="text-center ml-3" style="width: 70px; color: black">
                      <p class="pt-3 text-caption font-weight-bold">
                        {{
                          new Date(event.event_date)
                            .toLocaleDateString("en-US", { month: "short" })
                            .toUpperCase()
                        }}
                      </p>
                      <p class="cinzel-text text-h3 font-weight-bold">
                        {{ String(event.event_date).split("T")[0].split("-")[2] }}
                      </p>
                      <p class="text-caption font-weight-bold">
                        {{
                          new Date(event.event_date).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        }}
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="8" sm="10" class="pt-2">
                    <h3 class="pb-1">
                      <v-icon class="pr-1" size="small" color="black">mdi-chess-rook</v-icon>
                      {{ event.store_name }}
                    </h3>
                    <p class="text-caption text-truncate">
                      <v-icon color="red">mdi-map-marker</v-icon>
                      {{ event.address }}
                    </p>
                    <p class="text-caption">
                      <v-icon color="red">mdi-sword-cross</v-icon>
                      {{ event.scenario }}
                    </p>
                    <p
                      class="text-caption ml-3"
                      v-if="event.rewards?.length"
                    >
                      <v-row class="d-flex align-center rewards-container">
                        <v-icon class="mr-1" color="red">mdi-star-circle</v-icon>
                        Rewards:
                        <v-col
                          v-for="(reward, i) in event.rewards"
                          :key="i"
                          cols="auto"
                        >
                          <v-img
                            :src="reward.image"
                            height="20"
                            width="20"
                            contain
                            class="reward-icon"
                          />
                        </v-col>
                      </v-row>
                    </p>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>

      <!-- MY EVENTS -->
      <div v-else-if="activeTab === 2">
        <!-- Loading spinner -->
        <div v-if="loading" class="d-flex justify-center my-8">
          <v-progress-circular indeterminate size="48" color="primary" />
        </div>
        <!-- My events list -->
        <div v-else class="list-container">
          <v-row class="mb-4" align="center">
            <v-col cols="12" sm="6">
              <v-checkbox
                v-model="showPastMyEvents"
                label="Past events"
                hide-details
                color="primary"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-for="(evt, idx) in myEvents"
              :key="evt.events_pk"
              class="py-2 pl-1 pr-1"
              cols="12"
              md="6"
            >
              <v-card
                color="terciary"
                class="pt-0 event-card"
                @click="openMyEventsDialog(evt)"
              >
                <v-row no-gutters>
                  <v-col cols="4" sm="2">
                    <div class="text-center ml-3" style="width: 70px; color: black">
                      <p class="pt-3 text-caption font-weight-bold">
                        {{
                          new Date(evt.event_date)
                            .toLocaleDateString("en-US", { month: "short" })
                            .toUpperCase()
                        }}
                      </p>
                      <p class="cinzel-text text-h3 font-weight-bold">
                        {{ String(evt.event_date).split("T")[0].split("-")[2] }}
                      </p>
                      <p class="text-caption font-weight-bold">
                        {{
                          new Date(evt.event_date).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        }}
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="8" sm="9" class="pt-2">
                    <h3 class="pb-1">
                      <v-icon class="pr-1" size="small" color="black">mdi-chess-rook</v-icon>
                      {{ evt.store_name }}
                    </h3>
                    <p class="text-caption text-truncate">
                      <v-icon color="red">mdi-map-marker</v-icon>
                      {{ evt.address }}
                    </p>
                    <p class="text-caption">
                      <v-icon color="red">mdi-sword-cross</v-icon>
                      {{ evt.scenario }}
                    </p>
                    <p class="text-caption">
                      Seats: {{ evt.seats_number }} | Season: {{ evt.seasons_fk }}
                    </p>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-end pr-2">
                    <v-tooltip :text="getEventStatusInfo(evt.status).tooltip" location="top">
                      <template #activator="{ props }">
                        <v-icon
                          v-bind="props"
                          :color="getEventStatusInfo(evt.status).color"
                          size="large"
                        >
                          {{ getEventStatusInfo(evt.status).icon }}
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
  </v-col>
</template>

<style scoped>
.list-container {
  min-height: 400px; /* evita encolhimento */
}
</style>


<script setup>
import { ref, computed, watch, onMounted, inject } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useEventStore } from "@/store/EventStore";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import { Campaign } from "@/store/Campaign";

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const userStore = useUserStore();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const user = computed(() => userStore.user);
const loading = ref(false);

const axios = inject("axios");
if (!axios) {
  throw new Error("Axios não foi injetado na aplicação.");
}

const activeTab = ref(1);
const events = ref([]);
const eventPk = ref(null);
const sortedEvents = computed(() => {
  if (sortBy.value === "date") {
    return events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  return events.value;
});

const eventStore = useEventStore();

const isEditable = ref(false);

const openEditDialog = (event, editable = false) => {
  editableEvent.value = { ...event };
  isEditable.value = editable;
  editEventDialog.value = true;
  if (!editable) {
    fetchPlayers(event.events_pk);
    fetchStatuses();
    updatePlayerStatus(player, newStatus, editableEvent.value.events_pk)
  }
};

const players = ref([]);
const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(players.value.length / pageSize));
const paginatedPlayers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return players.value.slice(start, start + pageSize);
});

const statuses = ref([]);

const grantedStatus = ref(null);
const turnedAwayStatus = ref(null);

const fetchStatuses = () => {
  axios
    .get("/event_status/search")
    .then((response) => {
      statuses.value = response.data.event_status;

      grantedStatus.value = statuses.value.find(
        (s) => s.name === "Granted Passage",
      )?.event_status_pk;
      turnedAwayStatus.value = statuses.value.find(
        (s) => s.name === "Turned Away",
      )?.event_status_pk;
    })
    .catch((error) => {
      // Handle error fetching statuses
    });
};

const appUserPk = computed(() => {
  const raw = localStorage.getItem("app_user");
  return raw ? JSON.parse(raw).users_pk : null;
});
const currentPlayer = computed(() => {
  if (!appUserPk.value) return null;
  
  return players.value.find(p => p.users_pk === appUserPk.value) || null;
});
const fetchPlayers = (eventPk) => {
  axios
    .get("/rl_events_users/list_players", {
      params: { events_fk: eventPk },
    })
    .then((response) => {
      players.value = response.data.players;
    })
    .catch((error) => {
      // Handle error fetching players
    });
};

onMounted(() => {
  const usersPk = localStorage.getItem("app_user");
  const appUser = usersPk ? JSON.parse(usersPk).users_pk : null;

  fetchStatuses();
  if (events.value.length) {
    fetchPlayers(events.value[0].events_pk);
  }

  stores.value = JSON.parse(localStorage.getItem("stores") || "[]");
});

const updatePlayerStatus = (player, newStatus, eventPk) => {
  const usersPk = localStorage.getItem("app_user");
  const appUser = usersPk ? JSON.parse(usersPk).users_pk : null;
  axios
    .post("/rl_events_users/cadastro", {
      users_fk: appUser,
      events_fk: eventPk,
      status: newStatus,
    })
    .then((response) => {
      player.status = newStatus;
    })
    .catch((error) => {
      // Handle error updating status
    });
};

const dateRules = [
  (value) => {
    if (!value) return "Date is required.";

    const inputDate = new Date(value);
    if (inputDate < today) return "Date cannot be in the past.";

    if (inputDate > oneYearFromToday)
      return "Date cannot be more than 1 year from today.";

    return true;
  },
];

const today = new Date();
const todayISO = today.toISOString().split("T")[0];

const oneYearFromToday = new Date();
oneYearFromToday.setFullYear(today.getFullYear() + 1);
const oneYearFromTodayISO = oneYearFromToday.toISOString().split("T")[0];

const handleTimeInput = (event) => {
  let raw = event.target.value.replace(/\D/g, "");
  raw = raw.slice(0, 4);
  let hh = raw.slice(0, 2);
  let mm = raw.slice(2, 4);
  if (hh.length === 2) {
    let h = parseInt(hh);
    if (h < 1) hh = "01";
    else if (h > 12) hh = "12";
    else hh = h.toString().padStart(2, "0");
  }
  if (mm.length === 2) {
    let m = parseInt(mm);
    if (m > 59) mm = "59";
    else mm = m.toString().padStart(2, "0");
  }
  if (mm) {
    newEvent.value.hour = `${hh}:${mm}`;
  } else {
    newEvent.value.hour = hh;
  }
};


const selectedRewards = ref([]);

const toggleReward = (reward) => {
  if (selectedRewards.value.includes(reward)) {
    selectedRewards.value = selectedRewards.value.filter((r) => r !== reward);
  } else {
    selectedRewards.value.push(reward);
  }
};

const dialog = ref(false);
const selectedEvent = ref(null);
const eventRewards = ref([]);

const openDialog = async (event) => {
  selectedEvent.value = event;
  dialog.value = true;

  fetchPlayers(event.events_pk);

  try {
    const rewardsRes = await axios.get("/rl_events_rewards/list_rewards", {
      params: { events_fk: event.events_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    eventRewards.value = rewardsRes.data.rewards || [];
  } catch (err) {
    eventRewards.value = [];
  }
};

const showSuccessAlert = ref(false);

function compressCampaign(campaignId) {
  const campaignCopy = JSON.parse(
    JSON.stringify(campaignStore.find(campaignId))
  );
}

const joinedEventPk = ref(null);

async function handleNewCampaign(type) {
  loading.value = true;
  try {
    // 1) buscar SKUs do usuário
    const usersPk = userStore.user?.users_pk;
    const { data } = await axios.get("/skus/search", {
      params: { users_fk: usersPk },
    });
    const skuList = Array.isArray(data.skus)
      ? data.skus
      : Object.values(data.skus);
    const nameMap = {
      underkeep: "underkeep",
      /* core: "core",
      apocalypse: "Apocalypse",
      awakenings: "Awakenings", */
    };
    const selectedSku = skuList.find(
      (s) => s.name?.toLowerCase() === nameMap[type].toLowerCase(),
    );
    if (!selectedSku) throw new Error("SKU não encontrado");
    // 2) POST /campaigns/cadastro
    const campaignRes = await axios.post("/campaigns/cadastro", {
      tracker_hash:
        "eyJjYW1wYWlnbkRhdGEiOnsiY2FtcGFpZ25JZCI6IiIsImNhbXBhaWduIjoidW5kZXJrZWVwIiwibmFtZSI6IiIsImRvb3IiOiIiLCJ3aW5nIjoiIiwic3RhdHVzSWRzIjpbXSwib3V0Y29tZUlkcyI6W10sImZvbGxvd2VySWRzIjpbXSwidW5mb2xkaW5nSWRzIjpbXSwiYmFja2dyb3VuZEFuZFRyYWl0SWRzIjpbXSwibGVnYWN5VHJhaWwiOnsicGVyc2V2ZXJhbmNlIjowLCJ0cmFnZWR5IjowLCJkb29tIjowLCJoZXJvaXNtIjowfSwiaXNTZXF1ZW50aWFsQWR2ZW50dXJlIjpmYWxzZSwic2VxdWVudGlhbEFkdmVudHVyZVJ1bmVzIjowfSwiaGVyb2VzIjpbXX0=",
      conclusion_percentage: 0,
      box: selectedSku.skus_pk,
    });
    const campaignFk = campaignRes.data.campaign.campaigns_pk;
    // opcional: guardar no store local
    const newCamp = new Campaign(String(campaignFk), type);
    campaignStore.add(newCamp);
    await axios.put(`/campaigns/alter/${campaignFk}`, {
      tracker_hash: "eyJjYW1wYWlnbkRhdGEiOnsiY2FtcGFpZ25JZCI6IiIsImNhbXBhaWduIjoidW5kZXJrZWVwIiwibmFtZSI6IiIsImRvb3IiOiIiLCJ3aW5nIjoiIiwic3RhdHVzSWRzIjpbXSwib3V0Y29tZUlkcyI6W10sImZvbGxvd2VySWRzIjpbXSwidW5mb2xkaW5nSWRzIjpbXSwiYmFja2dyb3VuZEFuZFRyYWl0SWRzIjpbXSwibGVnYWN5VHJhaWwiOnsicGVyc2V2ZXJhbmNlIjowLCJ0cmFnZWR5IjowLCJkb29tIjowLCJoZXJvaXNtIjowfSwiaXNTZXF1ZW50aWFsQWR2ZW50dXJlIjpmYWxzZSwic2VxdWVudGlhbEFkdmVudHVyZVJ1bmVzIjowfSwiaGVyb2VzIjpbXX0=",
      party_name: "",
    });
    // 3) POST /rl_campaigns_users/cadastro
    await axios.post("/rl_campaigns_users/cadastro", {
      users_fk: usersPk,
      campaigns_fk: campaignFk,
      party_roles_fk: 1,
      skus_fk: selectedSku.skus_pk,
    });
    compressCampaign(String(campaignFk));
    toast.add({
      severity: "success",
      summary: t("label.success"),
      detail: "Campanha criada com sucesso!",
    });
    // 4) redireciona
    router.push({
      path: `/campaign-tracker/campaign/${campaignFk}`,
      query: { sku: String(selectedSku.skus_pk) },
    });
  } catch (err) {
    console.error("Erro no fluxo de criação:", err);
    toast.add({
      severity: "error",
      summary: t("label.error"),
      detail: err.message || "Falha ao criar campanha.",
    });
  } finally {
    loading.value = false;
  }
}


const route = useRoute();
const boxSku = computed(() => route.query.sku || "");

async function createdCompanion() {
  const token =
    "eyJjYW1wYWlnbkRhdGEiOnsiY2FtcGFpZ25JZCI6IiIsImNhbXBhaWduIjoiY29yZSIsIm5hbWUiOiIiLCJzdGF0dXNJdsdsIjpbXSwib3V0Y29tZUlkcyI6W10sImZvbGxvd2VySWRzIjpbXSwidW5mb2xkaW5nSWRzIjpbXSwiYmFja2dyb3VuZEFuZFRyYWl0SWRzIjpbXSwibGVnYWN5VHJhaWwiOnsicGVyc2V2ZXJhbmNlIjowLCJ0cmFnZWR5IjowLCJkb29tIjowLCJoZXJvaXNtIjowfSwiaXNTZXF1ZW50aWFsQWR2ZW50dXJlIjpmYWxzZ,SIc2VxdWVudGlhbEFkdmVudHVyZVJ1bmVzIjowfSwiaGVyb2VzIjpbXX0=";
  try {
    const { data: resp } = await axios.post("/campaigns/cadastro", {
      tracker_hash: token,
      conclusion_percentage: 0,
      box: 22,
    });

    toast.add({
      severity: "success",
      summary: t("label.success"),
      detail: "Campaign saved successfully.",
      life: 3000,
    });

    const users_pk = JSON.parse(localStorage.getItem("app_user")).users_pk;
    await axios.post("rl_campaigns_users/cadastro", {
      users_fk: users_pk,
      campaigns_fk: resp.campaign.campaigns_pk,
      party_roles_fk: 1,
      skus_fk: parseInt(resp.campaign.box, 10),
    }).then((response) => {
    }).catch((error) => {
      toast.add({
        severity: "error",
        summary: t("label.error"),
        detail: "Error creating campaign-user relationship.",
        life: 3000,
      });
    });
    router.push({ path: "/campaign-tracker/" });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: t("label.error"),
      detail: "Failed to save campaign.",
      life: 3000,
    });
  }
}

const selectedStoreImage = computed(() => {
  const store = stores.value.find(
    (s) => s.storename === selectedEvent.value?.store,
  );
  return store?.picture_hash
    ? `http://druna-user-pic.s3-website.us-east-2.amazonaws.com/${store.picture_hash}`
    : "https://via.placeholder.com/150";
});

const selectedStore = computed(() => {
  return (
    stores.value.find((s) => s.store_name === selectedEvent.value?.store) || {}
  );
});

const sortBy = ref("date");

const showPastEvents = ref(false)

const fetchPlayerEvents = async () => {
  loading.value = true;

  try {
    const player_fk = userStore.user?.users_pk;

    const response = await axios.get("/events/list_events/", {
      params: { 
        player_fk,
        past_events: showPastEvents.value.toString(),
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    events.value = response.data.events || [];
  } catch (error) {
    console.error("Error fetching player events:", error);
    events.value = [];
  } finally {
    loading.value = false;
  }
};

watch(showPastEvents, () => {
  if (activeTab.value === 1) {
    fetchPlayerEvents()
  }
})

const myEvents = ref([]);

const showPastMyEvents = ref(false)

const fetchMyEvents = async () => {
  loading.value = true;

  try {
    const player_fk = userStore.user?.users_pk;
    console.log("Fetching my events for player_fk:", player_fk);
    const res = await axios.get("/events/my_events/player", {
      params: {
        player_fk,
        past_events: showPastMyEvents.value.toString(),
        limit: 30,
        offset: 0
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    myEvents.value = res.data.events || [];
  } catch (error) {
    console.error("Error fetching my events:", error);
    myEvents.value = [];
  } finally {
    loading.value = false;
  }
};

watch(showPastMyEvents, () => {
  if (activeTab.value === 2) {
    fetchMyEvents()
  }
})

async function loadTabData() {
  loading.value = true
  if (activeTab.value === 1) {
    await fetchPlayerEvents()
  } else {
    await fetchMyEvents()
  }
  loading.value = false
}

watch(activeTab, async (newTab, oldTab) => {
  showPastEvents.value   = false
  showPastMyEvents.value = false

  loading.value = true
  if (newTab === 1) {
    await fetchPlayerEvents()
  } else {
    await fetchMyEvents()
  }
  loading.value = false
}, { immediate: true })

watch(activeTab, loadTabData, { immediate: true })

onMounted(async () => {
  await Promise.all([fetchPlayerEvents(), fetchMyEvents()]);
});
const sceneries = ref([]);

const fetchSceneries = async () => {
  await axios
    .get("/sceneries/search", {
      params: { active: true },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((response) => {
      sceneries.value = response.data.sceneries || [];
    })
    .catch((error) => {
      // Handle error fetching scenarios
    });
};

onMounted(async () => {
  await fetchSceneries();
});

const addEvent = async () => {
  const userStore = useUserStore();
  const userId = userStore.user?.users_pk;

  if (
    !newEvent.value.date ||
    !newEvent.value.hour ||
    !newEvent.value.store ||
    !newEvent.value.seats ||
    !newEvent.value.scenario ||
    !userId
  ) {
    return;
  }

  let selectedStore = null;
  let storesFk = null;

  try {
    const response = await axios.get("/stores/list", {
      params: {
        users_fk: userId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const allStores = response.data.stores || [];
    selectedStore = allStores.find(
      (store) =>
        store.name?.toLowerCase().trim() ===
        newEvent.value.store?.toLowerCase().trim(),
    );

    if (!selectedStore) {
      return;
    }

    storesFk = selectedStore.stores_pk;
  } catch (error) {
    return;
  }

  try {
    const formattedDate = new Date(
      `${newEvent.value.date}T${newEvent.value.hour}`,
    );
    const dateString = formattedDate.toLocaleDateString("en-CA");
    const timeString = formattedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const eventDateFormatted = `${dateString}; ${timeString}`;

    const payload = {
      seats_number: newEvent.value.seats,
      seasons_fk: 2,
      sceneries_fk: newEvent.value.scenario,
      date: eventDateFormatted,
      stores_fk: storesFk,
      users_fk: userId,
      active: true,
    };

    const response = await axios.post("/events/cadastro", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    await fetchUserCreatedEvents();
    await fetchPlayerEvents();

    selectedRewards.value = [];
    createEventDialog.value = false;
  } catch (error) {
    // Handle error registering event
  }
};

const deleteEvent = async (events_pk) => {
  try {
    await axios.delete(`/events/${events_pk}/delete/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    await fetchUserCreatedEvents();
    await fetchPlayerEvents();
  } catch (error) {
    // Handle error deleting event
  }
};


const userCreatedEvents = ref([]);

const fetchUserCreatedEvents = async () => {
  try {
    const retailer_fk = userStore.user?.users_pk;

    if (!retailer_fk) {
      return;
    }

    const response = await axios.get("/events/my_events/retailer", {
      params: { retailer_fk, active: true },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    userCreatedEvents.value = response.data.events || [];
  } catch (error) {
    // Handle error fetching user created events
  }
};

onMounted(fetchUserCreatedEvents);

const availableRewards = ref([
  {
    name: "Vorn Armor",
    image:
      "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/vorn.png",
    description:
      "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    name: "Jaheen Shield",
    image:
      "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/jaheen.png",
    description:
      "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    name: "Lorelai Kiss",
    image:
      "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/lorelai.png",
    description:
      "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industrsy.",
  },
]);

const createEventDialog = ref(false);
const newEvent = ref({});

const stores = ref([]);

watch(
  () => newEvent.value.store,
  (selectedStoreName) => {
    const selectedStore = stores.value.find(
      (store) => store.storename === selectedStoreName,
    );
    if (selectedStore) {
      const { address, streetNumber, complement, city, state } = selectedStore;
      newEvent.value.address = `${address}, ${streetNumber}, ${complement}, ${city}, ${state}`;
    } else {
      newEvent.value.address = "";
    }
  },
);

onMounted(async () => {
  try {
    const response = await axios.get("/stores/list", {
      params: { users_fk: userStore.user?.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    stores.value = response.data.stores || [];
  } catch (error) {
    // Handle error fetching stores
  }
});

const createEvent = () => {
  createEventDialog.value = false;
};

const openCreateEventDialog = () => {
  createEventDialog.value = true;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newEvent.value.image = URL.createObjectURL(file);
  }
};

const editEventDialog = ref(false);
const editableEvent = ref({});

const saveEditedEvent = () => {
  const index = events.value.findIndex((e) => e.id === editableEvent.value.id);
  if (index !== -1) {
    events.value[index] = { ...editableEvent.value };
  }
  editEventDialog.value = false;
};

const toggleEditReward = (reward) => {
  const index = editableEvent.value.rewards.findIndex((r) => r === reward);
  if (index === -1) {
    editableEvent.value.rewards.push(reward);
  } else {
    editableEvent.value.rewards.splice(index, 1);
  }
};

const getPlayersForEvent = async (event_fk) => {
  await axios
    .get("/rl_events_users/list_players", {
      params: {
        events_fk: event_fk,
      },
    })
    .then((response) => {
    })
    .catch((error) => {
      // Handle error fetching players
    });
};

const myDialog = ref(false);
const selectedMyEvent = ref(null);
const showQuitConfirmDialog = ref(false);
const rlEventsUsersPkToQuit = ref(null);

const openMyEventsDialog = async (event) => {
  selectedMyEvent.value = event;
  eventPk.value = event.events_pk;
  fetchPlayers(event.events_pk);
  myDialog.value = true;

  const userStore = useUserStore();
  const userId = parseInt(userStore.user?.users_pk, 10);

  if (isNaN(userId)) {
    return;
  }

  try {
    const response = await axios.get("/rl_events_users/list_players", {
      params: {
        events_fk: event.events_pk,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const playersForEvent = response.data.players;

    const currentUserEntry = playersForEvent.find(
      (player) => player.users_pk === userId
    );

    if (currentUserEntry) {
      rlEventsUsersPkToQuit.value = currentUserEntry.rl_events_users_pk;
    } else {
      rlEventsUsersPkToQuit.value = null;
    }
  } catch (error) {
    rlEventsUsersPkToQuit.value = null;
  }
};

const quitEvent = () => {
  if (rlEventsUsersPkToQuit.value) {
    showQuitConfirmDialog.value = true;
  } else {
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: "Cannot quit event. Relationship ID not found.",
      life: 3000,
    });
  }
};

const confirmQuitEvent = async () => {
  showQuitConfirmDialog.value = false;

  if (!rlEventsUsersPkToQuit.value) {
    toast.add({
      severity: "error",
      summary: t("label.error"),
      detail: "Failed to quit the event. Relationship ID not found.",
      life: 3000,
    });
    return;
  }

  try {
    await axios.put(
      `/rl_events_users/alter/${rlEventsUsersPkToQuit.value}`,
      { status: 3 },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    toast.add({
      severity: "success",
      summary: t("label.success"),
      detail: "You have successfully quit the event.",
      life: 3000,
    });

    myDialog.value = false;
    await fetchMyEvents();
    rlEventsUsersPkToQuit.value = null;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: t("label.error"),
      detail: "Failed to quit the event.",
      life: 3000,
    });
  }
};

const sharedLink = ref('');
const showDialog = ref(false);
const showAlert = ref(false);

const shareEvent = (eventId) => {
  try {
    if (!eventId) throw new Error("Event ID not found!");

    const encodedId = btoa(eventId.toString());

    sharedLink.value = `${window.location.origin}/event/${encodedId}`;
    showDialog.value = true;
  } catch (error) {
    // Handle error generating link
  }
};

const copyLink = async (link) => {
  try {
    await navigator.clipboard.writeText(link);
    showDialog.value = false;
    showAlert.value = true;
  } catch (error) {
    // Handle error copying link
  }
};

watch(dialog, (val) => {
  if (!val) {
    showSuccessAlert.value = false;
  }
});


// Function to get icon and tooltip text based on event status
const getEventStatusInfo = (status) => {
  switch (status) {
    case 'Seeks Entry': // Assuming "Seeks Entry" is the string from your API
      return {
        icon: 'mdi-timer-sand', // Waiting icon
        color: 'orange',
        tooltip: 'Waiting for the retailer to accept your entry.',
      };
    case 'Granted Passage': // Assuming "Granted Passage" is the string from your API
      return {
        icon: 'mdi-check-circle', // Accepted icon
        color: 'success', // Green color
        tooltip: 'Retailer accepted your passage to the event.',
      };
    case 'Turned Away': // Assuming "Turned Away" is the string from your API
      return {
        icon: 'mdi-cancel', // Refused icon
        color: 'error', // Red color
        tooltip: 'Retailer refused your entry or you left the event.',
      };
    case 'Joined the Quest': // Assuming "Joined the Quest" is the string from your API
      return {
        icon: 'mdi-sword', // Quest available icon
        color: 'purple', // Or another suitable color
        tooltip: 'Your campaign is available and you can play now.',
      };
    default:
      return {
        icon: 'mdi-help-circle', // Default icon for unknown status
        color: 'grey',
        tooltip: 'Unknown event status.',
      };
  }
};
</script>

<style scoped>
.list-container {
  min-height: 400px;
}
.event-card {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  margin-left: 18px;
  background-color: #292929;
}

.event-img {
  width: 110px;
  height: 110px;
  border-radius: 4px;
}

.sort-btn {
  font-weight: bold;
  text-transform: uppercase;
  color: white;
}

.sort-btn.active {
  text-decoration: underline;
}

.scheduled-box {
  display: inline-block;
  background-color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scheduled-box strong {
  font-weight: bold;
}
</style>

<style>
.cinzel-text {
  font-family: "Cinzel", serif;
}

.EventsTabs {
  background: #424242;
  transform: translateY(-8px);
  position: relative;
}

.CreateNew {
  position: relative;
  transform: translateY(-8px) translateX(12px);
  background-color: #484848;
}

.SortBy {
  position: relative;
  transform: translateY(-8px) translateX(12px);
  background-color: #292929;
}

.event-card {
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.event-card:hover {
  transform: scale(1.02);
}

.event-dialog-img {
  border-radius: 8px;
}

.rewards-container {
  gap: -40px;
}

.dark-background {
  background-color: #121212;
  color: white;
}

.date-input {
  max-width: 190px;
}

.hour-input {
  max-width: 110px;
  margin-left: 10px;
}

.launch-btn {
  background-color: white;
  color: black;
  font-weight: bold;
}

.selected-reward {
  opacity: 1;
  transition: all 0.2s ease-in-out;
}

.unselected-reward {
  filter: grayscale(100%);
  opacity: 0.5;
  transition: all 0.2s ease-in-out;
}

.check-icon {
  position: absolute;
  top: -5px;
  right: -5px;
  background: white;
  border-radius: 50%;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  color: red;
}

.redbutton {
  background: #691d1d;
  transform: translateY(px) translateX(-0px);
  width: 80px;
  height: 160px;
}

.editbutton {
  background: gray;
  transform: translateX(10px);
  width: 80px;
  height: 160px;
}

dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>