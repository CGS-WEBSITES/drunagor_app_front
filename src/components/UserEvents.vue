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
        <div v-if="loading" class="d-flex justify-center my-8">
          <v-progress-circular indeterminate size="48" color="primary" />
        </div>
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
                            .toLocaleDateString("en-US", { month: "short" })
                            .toUpperCase()
                        }}
                      </p>
                      <p class="cinzel-text text-h3 font-weight-bold">
                        {{
                          String(event.event_date).split("T")[0].split("-")[2]
                        }}
                      </p>
                      <p class="text-caption font-weight-bold">
                        {{
                          new Date(event.event_date).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )
                        }}
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="8" sm="10" class="pt-2">
                    <h3 class="pb-1">
                      <v-icon class="pr-1" size="small" color="black"
                        >mdi-chess-rook</v-icon
                      >
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
                    <p class="text-caption ml-3" v-if="event.rewards?.length">
                      <v-row class="d-flex align-center rewards-container">
                        <v-icon class="mr-1" color="red"
                          >mdi-star-circle</v-icon
                        >
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
        <v-dialog v-model="dialog" max-width="600" min-height="431">
          <v-card color="surface">
            <v-card-actions class="d-flex justify-left">
              <v-btn color="red" @click="dialog = false">X</v-btn>
            </v-card-actions>

            <v-dialog v-model="showDialog" width="400">
              <v-card>
                <v-card-title class="text-h6">Share Event</v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="sharedLink"
                    label="Event Link"
                    readonly
                    density="compact"
                    hide-details
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="success"
                    size="small"
                    @click="copyLink(sharedLink)"
                  >
                    Copy Link
                  </v-btn>
                  <v-btn color="grey" size="small" @click="showDialog = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-card-text>
              <p></p>
              <v-btn
                block
                color="blue"
                size="small"
                variant="flat"
                class="mt-2"
                @click="shareEvent(selectedEvent?.events_pk)"
              >
                <v-icon start>mdi-share-variant</v-icon>
                Share Event
              </v-btn>
              <br />
              <p>
                <v-icon>mdi-seat</v-icon> Disponible Seats:
                {{ selectedEvent?.seats_number }}
              </p>
              <p>
                <v-icon>mdi-sword-cross</v-icon> Scenario:
                {{ selectedEvent?.scenario }}
              </p>
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
            <v-card-text v-if="eventRewards.length">
              <h3 class="text-h6 font-weight-bold">REWARDS:</h3>
              <v-row
                v-for="(reward, index) in eventRewards"
                :key="index"
                class="align-center my-2"
              >
                <v-col cols="3" md="2">
                  <v-avatar size="60">
                    <v-img
                      :src="`https://druna-assets.s3.us-east-2.amazonaws.com/${reward.picture_hash}`"
                    />
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
              <v-col cols="12" class="mb-2">
                <v-btn
                  block
                  color="#539041"
                  class="rounded-0"
                  @click="joinEvent"
                >
                  Count me in
                </v-btn>

                <v-alert
                  v-if="showSuccessAlert"
                  type="success"
                  class="mt-4"
                  border="start"
                  variant="tonal"
                  closable
                  @click:close="showSuccessAlert = false"
                >
                  You’ve successfully joined this event! Visit the
                  <strong>My Events</strong> page to view it.
                </v-alert>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </div>

      <div v-else-if="activeTab === 2">
        <div v-if="loading" class="d-flex justify-center my-8">
          <v-progress-circular indeterminate size="48" color="primary" />
        </div>
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
                  <v-col cols="8" sm="9" class="pt-2">
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
                      Seats: {{ evt.seats_number }} | Season:
                      {{ evt.seasons_fk }}
                    </p>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-end pr-2">
                    <v-tooltip
                      :text="getEventStatusInfo(evt.status).tooltip"
                      location="top"
                    >
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

        <v-dialog v-model="myDialog" max-width="700" min-height="500">
          <v-card color="surface" class="pa-6">
            <div v-if="loading" class="dialog-overlay">
              <v-progress-circular
                indeterminate
                :size="80"
                :width="7"
                color="primary"
              ></v-progress-circular>
            </div>
            <div class="d-flex align-center justify-space-between pl-8">
              <v-card-title class="text-h6 font-weight-bold pa-0">
                {{ selectedMyEvent?.store_name }}
              </v-card-title>
              <v-icon
                color="red"
                @click="myDialog = false"
                class="mr-2"
                style="cursor: pointer"
              >
                mdi-close
              </v-icon>
            </div>

            <div class="mt-1 pl-6" style="display: inline-block">
              <p class="text-caption scheduled-box ma-0 ml-">
                Scheduled for:
                {{
                  new Date(selectedMyEvent?.event_date).toLocaleString(
                    "en-US",
                    {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    },
                  )
                }}
              </p>
            </div>

            <v-row class="" align="center" justify="space-between">
              <v-col cols="12" md="6" class="text-center pt-8 ml-3">
                <div
                  style="
                    position: relative;
                    display: inline-block;
                    background: white;
                    padding: 8px;
                    border-radius: 8px;
                  "
                >
                  <v-img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
                    width="180"
                    height="180"
                    class="rounded"
                    style="opacity: 0.3; filter: grayscale(1)"
                  />
                  <div
                    style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%) rotate(-10deg);
                      font-weight: 600;
                      font-size: 0.9rem;
                      color: #999;
                      background-color: rgba(255, 255, 255, 0.7);
                      padding: 4px 10px;
                      border-radius: 4px;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    "
                  >
                    Coming Soon
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="5"
                class="text-center ml-3 px-5 px-md-0 mr-md-7 pr-md-3"
              >
                <div class="d-flex align-center justify-center mb-2">
                  <p class="text-subtitle-2 font-weight-medium my-0 mr-2">
                    Status: {{ selectedMyEvent?.status }}
                  </p>
                  <v-btn
                    icon="mdi-refresh"
                    variant="text"
                    size="small"
                    :loading="isRefreshingStatus"
                    :disabled="isRefreshingStatus"
                    @click="
                      refreshEventStatus();
                    "
                  ></v-btn>
                </div>

                <v-btn
                  class="mb-4"
                  block
                  color="green"
                  @click="handleNewCampaign('underkeep')"
                  :disabled="
                    !currentPlayer ||
                    currentPlayer.event_status !== 'Joined the Quest'
                  "
                >
                  Join Campaign
                </v-btn>
                <v-btn class="mb-8" block color="red" @click="quitEvent()">
                  Quit Event
                </v-btn>
                
                <v-alert
                  v-if="showQuitSuccessAlert"
                  type="success"
                  title="Success"
                  class="mb-4"
                  variant="tonal"
                  closable
                  @click:close="showQuitSuccessAlert = false"
                >
                  You have successfully left the event. It will no longer appear in your list.
                </v-alert>

                <v-alert
                  v-if="showQuitErrorAlert"
                  type="error"
                  title="Failed to Leave Event"
                  class="mb-4"
                  variant="tonal"
                  closable
                  @click:close="showQuitErrorAlert = false"
                >
                  {{ quitErrorMessage }}
                </v-alert>

              </v-col>
            </v-row>

            <v-card color="primary" min-height="130px" class="mr-4 event-card">
              <v-row no-gutters>
                <v-col cols="3" lg="3">
                  <v-img
                    :src="
                      selectedMyEvent?.picture_hash
                        ? `https://druna-assets.s3.us-east-2.amazonaws.com/${selectedMyEvent.picture_hash}`
                        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'
                    "
                    class="event-img"
                  />
                </v-col>
                <v-col cols="9" class="pa-2">
                  <h3 class="text-subtitle-1 font-weight-bold">
                    {{ selectedMyEvent?.store_name }}
                  </h3>
                  <p class="text-caption">
                    <v-icon color="red">mdi-map-marker</v-icon>
                    {{ selectedMyEvent?.address }}
                  </p>
                </v-col>
                <v-col cols="2" class="text-right pa-0"></v-col>
              </v-row>
            </v-card>
          </v-card>
        </v-dialog>

        <v-dialog v-model="showQuitConfirmDialog" max-width="400">
          <v-card>
            <v-card-title class="text-h6">Confirm Exit</v-card-title>
            <v-card-text>
              Are you sure you want to quit this event? This action cannot be
              undone.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="showQuitConfirmDialog = false"
                >Cancel</v-btn
              >
              <v-btn color="red-darken-2" text @click="confirmQuitEvent"
                >Quit Event</v-btn
              >
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
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import { Campaign } from "@/store/Campaign";
import { useDebounceFn } from "@vueuse/core";

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
    updatePlayerStatus(player, newStatus, editableEvent.value.events_pk);
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
  return players.value.find((p) => p.users_pk === appUserPk.value) || null;
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
    JSON.stringify(campaignStore.find(campaignId)),
  );
}

const joinedEventPk = ref(null);

async function handleNewCampaign(type) {
  loading.value = true;
  try {
    const usersPk = userStore.user?.users_pk;
    const { data } = await axios.get("/skus/search", {
      params: { users_fk: usersPk },
    });
    const skuList = Array.isArray(data.skus)
      ? data.skus
      : Object.values(data.skus);
    const nameMap = {
      underkeep: "underkeep",
    };
    const selectedSku = skuList.find(
      (s) => s.name?.toLowerCase() === nameMap[type].toLowerCase(),
    );
    if (!selectedSku) throw new Error("SKU não encontrado");
    const campaignRes = await axios.post("/campaigns/cadastro", {
      tracker_hash:
        "eyJjYW1wYWlnbkRhdGEiOnsiY2FtcGFpZ25JZCI6IiIsImNhbXBhaWduIjoidW5kZXJrZWVwIiwibmFtZSI6IiIsImRvb3IiOiIiLCJ3aW5nIjoiIiwic3RhdHVzSWRzIjpbXSwib3V0Y29tZUlkcyI6W10sImZvbGxvd2VySWRzIjpbXSwidW5mb2xkaW5nSWRzIjpbXSwiYmFja2dyb3VuZEFuZFRyYWl0SWRzIjpbXSwibGVnYWN5VHJhaWwiOnsicGVyc2V2ZXJhbmNlIjowLCJ0cmFnZWR5IjowLCJkb29tIjowLCJoZXJvaXNtIjowfSwiaXNTZXF1ZW50aWFsQWR2ZW50dXJlIjpmYWxzZSwic2VxdWVudGlhbEFkdmVudHVyZVJ1bmVzIjowfSwiaGVyb2VzIjpbXX0=",
      conclusion_percentage: 0,
      box: selectedSku.skus_pk,
    });
    const campaignFk = campaignRes.data.campaign.campaigns_pk;
    const newCamp = new Campaign(String(campaignFk), type);
    campaignStore.add(newCamp);
    await axios.put(`/campaigns/alter/${campaignFk}`, {
      tracker_hash:
        "eyJjYW1wYWlnbkRhdGEiOnsiY2FtcGFpZ25JZCI6IiIsImNhbXBhaWduIjoidW5kZXJrZWVwIiwibmFtZSI6IiIsImRvb3IiOiIiLCJ3aW5nIjoiIiwic3RhdHVzSWRzIjpbXSwib3V0Y29tZUlkcyI6W10sImZvbGxvd2VySWRzIjpbXSwidW5mb2xkaW5nSWRzIjpbXSwiYmFja2dyb3VuZEFuZFRyYWl0SWRzIjpbXSwibGVnYWN5VHJhaWwiOnsicGVyc2V2ZXJhbmNlIjowLCJ0cmFnZWR5IjowLCJkb29tIjowLCJoZXJvaXNtIjowfSwiaXNTZXF1ZW50aWFsQWR2ZW50dXJlIjpmYWxzZSwic2VxdWVudGlhbEFkdmVudHVyZVJ1bmVzIjowfSwiaGVyb2VzIjpbXX0=",
      party_name: "",
    });
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
    await axios
      .post("rl_campaigns_users/cadastro", {
        users_fk: users_pk,
        campaigns_fk: resp.campaign.campaigns_pk,
        party_roles_fk: 1,
        skus_fk: parseInt(resp.campaign.box, 10),
      })
      .then((response) => {})
      .catch((error) => {
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

const playerFk = ref(null);

onMounted(() => {
  const rawUser = localStorage.getItem("app_user");
  playerFk.value = rawUser ? JSON.parse(rawUser).users_pk : null;
});

const showPastEvents = ref(false)

const fetchPlayerEvents = async () => {
  loading.value = true;
  try {
    const params = {
      player_fk: playerFk.value,
      past_events: showPastEvents.value.toString(),
    };
    const response = await axios.get("/events/list_events/", {
      params,
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
    fetchPlayerEvents();
  }
});

const myEvents = ref([]);
const showPastMyEvents = ref(false);

const fetchMyEvents = async () => {
  if (!playerFk.value) {
    console.warn("❌ playerFk indefinido, abortando requisição.");
    return;
  }

  try {
    const params = {
      player_fk: playerFk.value,
      past_events: showPastMyEvents.value.toString(),
    };
    console.log("🔁 Fetching my events:", params);
    const response = await axios.get("system/events/my_events/player", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    myEvents.value = response.data.events || [];
  } catch (error) {
    console.error("Error fetching my events:", error);
    myEvents.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchMyEventsDebounced = useDebounceFn(() => {
  if (!playerFk.value) return;
  fetchMyEvents();
}, 300); // aguarda 300ms para evitar chamadas em sequência

watch(showPastMyEvents, (val) => {
  if (activeTab.value === 2) {
    console.log("✅ Checkbox mudou para:", val);
    fetchMyEventsDebounced();
  }
});

async function loadTabData() {
  loading.value = true;
  if (activeTab.value === 1) {
    await fetchPlayerEvents();
  } else {
    await fetchMyEvents();
  }
  loading.value = false;
}

watch(activeTab, async (newTab) => {
  showPastEvents.value = false;
  showPastMyEvents.value = false;

  loading.value = true;
  if (newTab === 1) {
    await fetchPlayerEvents();
  } else if (newTab === 2) {
    await fetchMyEvents();
  }
  loading.value = false;
}, { immediate: true });

watch(activeTab, loadTabData, { immediate: true })

onMounted(async () => {
  if (activeTab.value === 1) {
    await fetchPlayerEvents();
  } else {
    await fetchMyEvents();
  }
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
    .then((response) => {})
    .catch((error) => {
      // Handle error fetching players
    });
};

const myDialog = ref(false);
const selectedMyEvent = ref(null);
const showQuitConfirmDialog = ref(false);
const rlEventsUsersPkToQuit = ref(null);
const isRefreshingStatus = ref(false);

const showQuitSuccessAlert = ref(false);
const showQuitErrorAlert = ref(false);
const quitErrorMessage = ref('');

const openMyEventsDialog = async (event) => {
  showQuitSuccessAlert.value = false;
  showQuitErrorAlert.value = false;
  rlEventsUsersPkToQuit.value = event.rl_events_users_pk;

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
      (player) => player.users_pk === userId,
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

const refreshEventStatus = async () => {
  if (!selectedMyEvent.value?.events_pk) {
    console.warn("Nenhum evento selecionado para atualizar.");
    return;
  }
  isRefreshingStatus.value = true;
  try {
    await fetchPlayers(selectedMyEvent.value.events_pk);
    if (currentPlayer.value) {
      selectedMyEvent.value.status = currentPlayer.value.event_status;
      toast.add({
        severity: "info",
        summary: "Status Atualizado",
        detail: `O novo status é: ${currentPlayer.value.event_status}`,
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Falha ao atualizar o status do evento:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível atualizar o status.",
      life: 3000,
    });
  } finally {
    isRefreshingStatus.value = false;
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
    quitErrorMessage.value = "Cannot quit event. Relationship ID not found.";
    showQuitErrorAlert.value = true;
    return;
  }
  try {
    await axios.delete(
      `/rl_events_users/${rlEventsUsersPkToQuit.value}/delete/`,
      { status: 3 },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    showQuitSuccessAlert.value = true;
    showQuitErrorAlert.value = false;
    await fetchMyEvents();
    setTimeout(() => {
      myDialog.value = false;
    }, 2500);
  } catch (error) {
    console.error("Failed to quit event:", error);
    quitErrorMessage.value = "An unexpected error occurred. Please try again later.";
    showQuitErrorAlert.value = true;
    showQuitSuccessAlert.value = false;
  }
};

const sharedLink = ref("");
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

const getEventStatusInfo = (status) => {
  switch (status) {
    case "Seeks Entry":
      return {
        icon: "mdi-timer-sand",
        color: "orange",
        tooltip: "Waiting for the retailer to accept your entry.",
      };
    case "Granted Passage":
      return {
        icon: "mdi-check-circle",
        color: "success",
        tooltip: "Retailer accepted your passage to the event.",
      };
    case "Turned Away":
      return {
        icon: "mdi-cancel",
        color: "error",
        tooltip: "Retailer refused your entry or you left the event.",
      };
    case "Joined the Quest":
      return {
        icon: "mdi-sword",
        color: "purple",
        tooltip: "Your campaign is available and you can play now.",
      };
    default:
      return {
        icon: "mdi-help-circle",
        color: "grey",
        tooltip: "Unknown event status.",
      };
  }
};

const joinEvent = async () => {
  const userId = userStore.user?.users_pk;
  if (!userId || !selectedEvent.value) {
    return;
  }
  try {
    await axios.post(
      "/rl_events_users/cadastro",
      {
        users_fk: userStore.user?.users_pk,
        events_fk: selectedEvent.value.events_pk,
        status: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    joinedEventPk.value = selectedEvent.value.events_pk;
    await fetchMyEvents();
    showSuccessAlert.value = true;
    setTimeout(() => {
      showSuccessAlert.value = false;
    }, 1500);
    setTimeout(() => {
      dialog.value = false;
    }, 2000);
  } catch (error) {
    console.error("Erro ao entrar no evento:", error);
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