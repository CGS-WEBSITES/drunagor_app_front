<template>
  <v-card color="primary" class="pa-4">
    <v-container class="pa-0">
      <v-row class="justify-center">
        <v-col cols="12" class="pa-2">
          <h3 class="text-h5 font-weight-bold mb-4">MY UPCOMING EVENTS</h3>
          <div v-if="loading" class="d-flex justify-center align-center" style="height: 200px;">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else>
            <v-row v-if="upcomingRetailerEventsPreview.length > 0">
              <v-col
                v-for="event in upcomingRetailerEventsPreview"
                :key="event.events_pk"
                cols="12"
                md="6"
              >
                <v-card
                  color="terciary"
                  class="pt-0 event-card"
                  @click="openManageDialog(event)"
                >
                  <v-row no-gutters align="center">
                    <v-col cols="4" sm="2">
                      <div class="text-center ml-3" style="width: 70px; color: black">
                        <p class="pt-3 text-caption font-weight-bold">{{ new Date(event.event_date).toLocaleDateString("en-US", { month: "short" }).toUpperCase() }}</p>
                        <p class="cinzel-text text-h3 font-weight-bold">{{ String(event.event_date).split("T")[0].split("-")[2] }}</p>
                        <p class="text-caption font-weight-bold">{{ new Date(event.event_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}}</p>
                      </div>
                    </v-col>
                    <v-col cols="8" sm="10" class="pt-2">
                      <h3 class="pb-1 text-truncate"><v-icon class="pr-1" size="small" color="black">mdi-chess-rook</v-icon>{{ event.store_name }}</h3>
                      <p class="text-caption text-truncate"><v-icon color="red">mdi-map-marker</v-icon>{{ event.address }}</p>
                      <p class="text-caption" v-if="event.scenario"><v-icon color="red">mdi-sword-cross</v-icon>Scenario: {{ event.scenario }}</p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-card v-else color="transparent" flat class="text-center d-flex flex-column align-center justify-center pa-5" min-height="150">
                <p class="mb-4">You have no upcoming events.</p>
                <v-btn color="primary" @click="goToEventsPageAndCreate">Create New Event</v-btn>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="manageDialog" scroll-target="#app" max-width="800">
      <v-card class="dark-background">
        <div v-if="dialogLoading" class="loading-overlay"><v-progress-circular indeterminate size="80" color="primary" /></div>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="d-flex align-end flex-column">
                <p class="pb-3 font-weight-bold">PLAYERS INTERESTED <v-btn icon size="medium" variant="text" @click="fetchPlayersForEvent(selectedEvent.events_pk)"><v-icon class="mb-1" color="white">mdi-refresh</v-icon></v-btn></p>
            </v-col>
            <v-row>
              <v-col cols="12" v-for="player in playersByEvent" :key="player.users_pk" class="pa-1">
                <v-card class="pa-1 mb-3" rounded="lg" elevation="10">
                  <v-row no-gutters>
                    <v-col cols="4" lg="1" class="d-flex"><v-img :src="player.picture_hash ? `https://assets.drunagor.app/Profile/${player.picture_hash}` : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'" alt="Player Image" max-width="90" max-height="90" class="rounded-lg"></v-img></v-col>
                    <v-col cols="8" class="pl-3 d-flex flex-column justify-center">
                      <p class="font-weight-bold text-truncate">{{ player.user_name }}</p>
                      <p class="text-caption">Status: {{ player.event_status }}</p>
                      <p v-if="player.status_date" class="text-caption grey--text">Received: {{ new Date(player.status_date).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}}</p>
                    </v-col>
                    <v-col cols="12" md="3" class="d-flex flex-column">
                      <template v-if="player.event_status === 'Granted Passage'"><v-btn color="deep-purple" size="x-small" class="mt-2 mt-md-0 pa-0" block @click="updatePlayerStatus(player, JoinedtheQuest)"><v-icon start>mdi-flag-checkered</v-icon>Start Event</v-btn><v-btn color="red" size="x-small" class="mt-2" block @click="updatePlayerStatus(player, turnedAwayStatus)"><v-icon start>mdi-close-circle-outline</v-icon>Turn Away</v-btn></template>
                      <template v-else-if="player.event_status === 'Joined the Quest'"><v-row no-gutters class="fill-height" align="center" justify="center"><v-chip color="yellow" text-color="black" class="ma-1" label><v-icon start>mdi-sword-cross</v-icon>Playing</v-chip></v-row></template>
                      <template v-else-if="player.event_status === 'Turned Away'"><v-row no-gutters class="fill-height" align="center" justify="center"><v-btn icon disabled class="ma-0 pa-0"><v-icon color="red" size="24">mdi-close-circle</v-icon></v-btn></v-row></template>
                      <template v-else><v-btn color="green" size="x-small" class="mt-2" block @click="updatePlayerStatus(player, grantedStatus)"><v-icon start>mdi-check-circle-outline</v-icon>Grant Passage</v-btn><v-btn color="red" size="x-small" class="mt-2" block @click="updatePlayerStatus(player, turnedAwayStatus)"><v-icon start>mdi-close-circle-outline</v-icon>Turn Away</v-btn></template>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12" class="d-flex justify-center" v-if="totalPages > 1"><v-pagination v-model="currentPage" :length="totalPages"></v-pagination></v-col>
            </v-row>
            <v-col cols="12" class="d-flex justify-start mt-4">
              <v-btn color="red" @click="manageDialog = false">Close</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";

const router = useRouter();
const userStore = useUserStore();
const axios = inject("axios");

const loading = ref(true);
const dialogLoading = ref(false);
const userCreatedEvents = ref([]);
const selectedEvent = ref(null);
const manageDialog = ref(false);
const playersByEvent = ref([]);

const currentPage = ref(1);
const totalPages = ref(1);
const statuses = ref([]);
const grantedStatus = ref(null);
const turnedAwayStatus = ref(null);
const JoinedtheQuest = ref(null);

const upcomingRetailerEventsPreview = computed(() => {
  const now = new Date();
  return userCreatedEvents.value
    .filter(event => new Date(event.event_date) > now)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 3);
});

const fetchUserCreatedEvents = async () => {
  try {
    const params = { retailer_fk: userStore.user.users_pk, active: "true", past_events: false };
    const { data } = await axios.get("/events/my_events/retailer", { params, headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
    userCreatedEvents.value = data.events || [];
  } catch (error) {
    console.error("Error fetching retailer events:", error);
    userCreatedEvents.value = [];
  }
};

const openManageDialog = async (event) => {
  selectedEvent.value = event;
  currentPage.value = 1; 
  await fetchPlayersForEvent(event.events_pk);
  manageDialog.value = true;
};

const goToEventsPageAndCreate = () => {
  router.push({ path: '/events', query: { action: 'create' } });
};

const fetchStatuses = async () => {
  try {
    const { data } = await axios.get("/event_status/search");
    statuses.value = data.event_status;
    grantedStatus.value = statuses.value.find(s => s.name === "Granted Passage")?.event_status_pk;
    turnedAwayStatus.value = statuses.value.find(s => s.name === "Turned Away")?.event_status_pk;
    JoinedtheQuest.value = statuses.value.find(s => s.name === "Joined the Quest")?.event_status_pk;
  } catch (error) {
    console.error("Error fetching statuses:", error);
  }
};

const fetchPlayersForEvent = async (eventFk) => {
  dialogLoading.value = true;
  try {
    const params = { events_fk: eventFk, limit: 5, offset: (currentPage.value - 1) * 5 };
    const { data } = await axios.get("/rl_events_users/list_players", { params });
    playersByEvent.value = data.players;
    totalPages.value = data.last_page;
  } catch (error) {
    console.error("Error fetching players:", error);
    playersByEvent.value = [];
  } finally {
    dialogLoading.value = false;
  }
};

const updatePlayerStatus = async (player, statusPk) => {
  dialogLoading.value = true;
  const payload = { users_fk: player.users_pk, events_fk: selectedEvent.value.events_pk, status: statusPk, active: true };
  try {
    await axios.post("/rl_events_users/cadastro", payload, { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
    await fetchPlayersForEvent(selectedEvent.value.events_pk); 
  } catch (error) {
    console.error("Error updating player status:", error);
  } finally {
    dialogLoading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([
    fetchUserCreatedEvents(),
    fetchStatuses()
  ]);
  loading.value = false;
});

watch(currentPage, () => {
  if (manageDialog.value && selectedEvent.value) {
    fetchPlayersForEvent(selectedEvent.value.events_pk);
  }
});
</script>

<style scoped>
.cinzel-text { font-family: "Cinzel", serif; }
.event-card { cursor: pointer; transition: transform 0.2s ease-in-out; min-height: 120px; }
.event-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.loading-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; }
</style>