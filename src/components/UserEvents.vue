<template>
  <v-row justify="center">
    <v-col cols="12" class="text-center">
      <h1
        class="cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2"
      >
        EVENTS
      </h1>
    </v-col>
  </v-row>

  <v-col cols="12" md="10" class="mx-auto">
    <v-card class="pb-12" min-height="500px" color="#151515">
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

      <div v-if="activeTab === 1">
        <v-row>
          <v-col
            class="py-2 pl-1 pr-1"
            cols="12"
            md="6"
            v-for="(event, index) in sortedEvents"
            :key="index"
          >
            <v-card
              color="terciary"
              class="pt-0 event-card"
              @click="openDialog(event)"
            >
              <v-row no-gutters>
                <v-col cols="4" sm="2">
                  <div
                    class="text-center ml-3"
                    style="width: 70px; color: black"
                  >
                    <p class="pt-3 text-caption font-weight-bold">
                      {{
                        new Date(event.event_date)
                          .toLocaleDateString("en-US", {
                            month: "short",
                          })
                          .toUpperCase()
                      }}
                    </p>
                    <p
                      color="primary"
                      class="cinzel-text text-h3 font-weight-bold"
                    >
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
                    <v-icon class="pr-1" size="small" color="black"
                      >mdi-chess-rook</v-icon
                    >{{ event.store_name }}
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
                    v-if="event.rewards && event.rewards.length"
                  >
                    <v-row class="d-flex align-center rewards-container">
                      <v-icon class="mr-1" color="red">mdi-star-circle</v-icon>
                      Rewards:
                      <v-col
                        cols="auto"
                        v-for="(reward, index) in event.rewards"
                        :key="index"
                      >
                        <v-img
                          :src="reward.image"
                          height="20"
                          width="20"
                          contain
                          class="reward-icon"
                        ></v-img>
                      </v-col>
                    </v-row>
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <!-- Diálogo para visualização do evento -->
        <v-dialog v-model="dialog" max-width="600" min-height="431">
          <v-card color="surface">
            <v-card-actions class="d-flex justify-left">
              <v-btn color="red" @click="dialog = false">X</v-btn>
            </v-card-actions>
            <v-card-text>
              <p></p>
              <br />
              <p>Disponible Seats: {{ selectedEvent?.seats_number }}</p>
              <br />
              <p class="text-end scheduled-box">
                Scheduled for:
                {{
                  new Date(selectedEvent?.event_date).toLocaleString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                }}
              </p>
            </v-card-text>
            <v-card color="primary" min-height="130px" class="mr-4 event-card">
              <v-row no-gutters>
                <v-col cols="3" lg="3">
                  <v-img
                    :src="
                      selectedEvent?.picture_hash
                        ? `https://druna-assets.s3.us-east-2.amazonaws.com/${selectedEvent.picture_hash}`
                        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'
                    "
                    class="event-img"
                  />
                </v-col>
                <v-col cols="9" class="pa-2">
                  <h3 class="text-subtitle-1 font-weight-bold">
                    {{ selectedEvent?.store_name }}
                  </h3>
                  <p class="text-caption">
                    <v-icon color="red">mdi-map-marker</v-icon>
                    {{ selectedEvent?.address }}
                  </p>
                </v-col>
                <v-col cols="2" class="text-right pa-0"></v-col>
              </v-row>
            </v-card>
            <v-card-text>
              <h3 class="text-h6 font-weight-bold">REWARDS:</h3>
              <v-row
                v-for="(reward, index) in selectedEvent?.rewards"
                :key="index"
                class="align-center my-2"
              >
                <v-col cols="3" md="2">
                  <v-avatar size="60">
                    <v-img :src="reward.image"></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="9" md="10">
                  <h4 class="text-subtitle-1 font-weight-bold">
                    {{ reward.name }}
                  </h4>
                  <p class="text-body-2">{{ reward.description }}</p>
                </v-col>
              </v-row>
            </v-card-text>
            <v-row class="mt-2 ml-0">
              <v-col cols="6" class="pa-0">
                <v-btn
                  block
                  color="#907041"
                  class="rounded-0"
                  @click="joinEvent"
                  >Maybe I’ll Go</v-btn
                >
              </v-col>
              <v-col cols="6" class="pa-0">
                <v-btn
                  block
                  color="#539041"
                  class="rounded-0"
                  @click="joinEvent"
                  >Count me in</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </div>

      <div v-else-if="activeTab === 2">
        <v-row>
          <v-col
            class="py-2 pl-1 pr-1"
            cols="12"
            md="6"
            v-for="(evt, idx) in myEvents"
            :key="evt.events_pk"
          >
            <v-card
              color="terciary"
              class="pt-0 event-card"
              @click="openMyEventsDialog(evt)"
            >
              <v-row no-gutters>
                <!-- Date -->
                <v-col cols="4" sm="2">
                  <div
                    class="text-center ml-3"
                    style="width: 70px; color: black"
                  >
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

                <!-- Details -->
                <v-col cols="8" sm="10" class="pt-2">
                  <h3 class="pb-1">
                    <v-icon class="pr-1" size="small" color="black"
                      >mdi-chess-rook</v-icon
                    >
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
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-dialog v-model="myDialog" max-width="600" min-height="431">
          <v-card color="surface">
            <v-card-actions class="d-flex justify-left">
              <v-btn color="red" @click="myDialog = false">X</v-btn>
            </v-card-actions>
            <v-card-title class="d-flex justify-left">
              {{ selectedMyEvent?.store_name }}
            </v-card-title>
            <v-card-text class="d-flex justify-left">
              <p>Status: {{ selectedMyEvent?.status }}</p>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn 
                color="green"
                @click="createdCompanion()"
                :disabled="selectedMyEvent?.status !== 'Joined the Quest'"  
              >
                Join Campaign
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useEventStore } from "@/store/EventStore";
// import router from "@/router";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

const axios = inject("axios");
if (!axios) {
  throw new Error("Axios não foi injetado na aplicação.");
}

const activeTab = ref(1);
const events = ref([]);
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
    fetchPlayers();
    fetchStatuses();
  }
};

// Lista de players de exemplo para simular a resposta da API
// const samplePlayers = ref([
//   { id: 1, name: "Player One", status: "Seeks Entry" },
//   { id: 2, name: "Player Two", status: "Seeks Entry" },
//   { id: 3, name: "Player Three", status: "Seeks Entry" },
//   { id: 4, name: "Player Four", status: "Seeks Entry" },
//   { id: 5, name: "Player Five", status: "Seeks Entry" },
//   { id: 6, name: "Player Six", status: "Seeks Entry" },
//   { id: 7, name: "Player Seven", status: "Seeks Entry" },
//   { id: 8, name: "Player Eight", status: "Seeks Entry" },
//   { id: 9, name: "Player Nine", status: "Seeks Entry" }
// ]);

const players = ref([]);
const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(players.value.length / pageSize));
const paginatedPlayers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return players.value.slice(start, start + pageSize);
});

const statuses = ref([]);

// O status predefinido é "Seeks Entry", e os botões usam os seguintes status:
// "Granted Passage" e "Turned Away"
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
      console.error("Erro ao buscar status:", error);
    });
};

const fetchPlayers = () => {
  axios
    .get("/rl_events_users/list_players", {
      params: { events_fk: 31 },
    })
    .then((response) => {
      players.value = response.data.players;
    })
    .catch((error) => {
      console.error("Erro ao buscar jogadores:", error);
    });
};

onMounted(() => {
  const usersPk = localStorage.getItem("app_user");
  const appUser = usersPk ? JSON.parse(usersPk).users_pk : null;

  fetchStatuses();
  fetchPlayers();

  stores.value = JSON.parse(localStorage.getItem("stores") || "[]");
});

const updatePlayerStatus = (player, newStatus) => {
  const usersPk = localStorage.getItem("app_user");
  const appUser = usersPk ? JSON.parse(usersPk).users_pk : null;

  axios
    .post("/rl_events_users/cadastro", {
      users_fk: 425,
      events_fk: 31,
      status: newStatus,
    })
    .then((response) => {
      player.status = newStatus;
    })
    .catch((error) => {
      console.error("Erro ao atualizar status:", error);
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

const user = computed(() => useUserStore().user);

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

const openDialog = (event) => {
  selectedEvent.value = event;
  dialog.value = true;
};

const joinEvent = () => {
  alert(`You have joined the event: ${selectedEvent.value.name}`);
  dialog.value = false;
};

const toast = useToast();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const boxSku = computed(() => route.query.sku || "");
const campaignStore = CampaignStore();
const heroStore = HeroStore();

// async function saveCampaign() {
//   const response = await axios.post("/campaigns/cadastro", {
//     tracker_hash: token.value,
//     conclusion_percentage: 0,
//     box: boxSku.value,
//   });
//   // notificação de sucesso
//   toast.add({
//     severity: "success",
//     summary: t("label.success"),
//     detail: "Campaign saved successfully.",
//     life: 3000,
//   });
//   // cria relação usuário↔campanha
//   const { campaigns_pk, box } = response.data.campaign;
//   const users_pk = JSON.parse(localStorage.getItem("app_user")).users_pk;
//   await axios.post("rl_campaigns_users/cadastro", {
//     users_fk: users_pk,
//     campaigns_fk: campaigns_pk,
//     party_roles_fk: 1,
//     skus_fk: parseInt(box, 10),
//   });
// }

async function createdCompanion() {
  const token = 
    "eyJjYW1wYWlnbkRhdGEiOnsiY2FtcGFpZ25JZCI6IiIsImNhbXBhaWduIjoiY29yZSIsIm5hbWUiOiIiLCJzdGF0dXNJZHMiOltdLCJvdXRjb21lSWRzIjpbXSwiZm9sbG93ZXJJZHMiOltdLCJ1bmZvbGRpbmdJZHMiOltdLCJiYWNrZ3JvdW5kQW5kVHJhaXRJZHMiOltdLCJsZWdhY3lUcmFpbCI6eyJwZXJzZXZlcmFuY2UiOjAsInRyYWdlZHkiOjAsImRvb20iOjAsImhlcm9pc20iOjB9LCJpc1NlcXVlbnRpYWxBZHZlbnR1cmUiOmZhbHNlLCJzZXF1ZW50aWFsQWR2ZW50dXJlUnVuZXMiOjB9LCJoZXJvZXMiOltdfQ==";
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

    // 3) Cria relacionamento usuário↔campanha
    const users_pk = JSON.parse(localStorage.getItem("app_user")).users_pk;
    await axios.post("rl_campaigns_users/cadastro", {
      users_fk: users_pk,
      campaigns_fk: resp.campaign.campaigns_pk,
      party_roles_fk: 1,
      skus_fk: parseInt(resp.campaign.box, 10),
    }).then((response) => {
      console.log("Relação usuário↔campanha criada com sucesso.", response.data);
    }).catch((error) => {
      console.error("Erro ao criar relação usuário↔campanha:", error);
      toast.add({
        severity: "error",
        summary: t("label.error"),
        detail: "Error creating campaign-user relationship.",
        life: 3000,
      });
    });
    // 4) Redireciona
    router.push({ path: "/campaign-tracker/campaign" });
  } catch (err) {
    console.error("Erro no fluxo de salvar campanha:", err);
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

// Sample Events Data
const sortBy = ref("date");

const fetchPlayerEvents = async () => {
  try {
    const player_fk = userStore.user?.users_pk;

    if (!player_fk) {
      console.error("❌ Erro: player_fk (users_pk) não definido.");
      return;
    }

    const response = await axios.get("/events/list_events/", {
      params: { player_fk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    events.value = response.data.events || [];
  } catch (error) {
    console.error(
      "❌ Erro ao buscar eventos do jogador:",
      error.response?.data || error.message,
    );
  }
};

const myEvents = ref([]);

const fetchMyEvents = async () => {
  const userData = JSON.parse(localStorage.getItem("app_user"));
  if (!userData?.users_pk) return;
  const res = await axios.get("/events/my_events/player", {
    params: { player_fk: userData.users_pk },
  });
  myEvents.value = res.data.events || [];
};

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
      console.error(
        "❌ Erro ao buscar cenários:",
        error.response?.data || error.message,
      );
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
    console.error("❌ Dados insuficientes para criar o evento.");
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
      console.error("❌ Store não encontrada na API.");
      return;
    }

    storesFk = selectedStore.stores_pk;
  } catch (error) {
    console.error(
      "❌ Erro ao buscar stores na API:",
      error.response?.data || error.message,
    );
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
    console.error(
      "❌ Erro ao cadastrar evento:",
      error.response?.data || error.message,
    );
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
    console.error(
      "❌ Erro ao excluir o evento:",
      error.response?.data || error.message,
    );
  }
};

const userStore = useUserStore();

const userCreatedEvents = ref([]);

const fetchUserCreatedEvents = async () => {
  try {
    const retailer_fk = userStore.user?.users_pk;

    if (!retailer_fk) {
      console.error("❌ Erro: retailer_fk (users_pk) não definido.");
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
    console.error(
      "❌ Erro ao buscar eventos criados pelo usuário:",
      error.response?.data || error.message,
    );
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
    console.error(
      "❌ Erro ao buscar lojas:",
      error.response?.data || error.message,
    );
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
      console.log("Players:", response.data);
    })
    .catch((error) => {
      console.error("Erro ao buscar jogadores:", error);
    });
};

const myDialog = ref(false);
const selectedMyEvent = ref(null);

const openMyEventsDialog = (event) => {
  selectedMyEvent.value = event;
  myDialog.value = true;
};
</script>

<style scoped>
/* Event Card */
.event-card {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  margin-left: 18px;
  background-color: #292929;
}

/* Event Image */
.event-img {
  width: 110px;
  height: 110px;
  border-radius: 4px;
}

/* Sort Buttons */
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
  /* Faz o fundo se ajustar ao tamanho do conteúdo */
  background-color: white;
  /* Fundo branco */
  padding: 6px 12px;
  /* Espaçamento interno */
  border-radius: 20px;
  /* Bordas arredondadas */
  font-size: 14px;
  /* Tamanho do texto */
  font-weight: 500;
  /* Peso do texto */
  color: black;
  /* Cor do texto */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Sombra leve para destacar */
}

.scheduled-box strong {
  font-weight: bold;
  /* Deixa "SCHEDULED FOR:" em negrito */
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
</style>
