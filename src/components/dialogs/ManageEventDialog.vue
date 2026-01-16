<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    scroll-target="#app"
    max-width="900"
    persistent
  >
    <v-card color="surface">
      <div v-if="dialogLoading" class="dialog-overlay">
        <v-progress-circular indeterminate size="80" color="primary" />
      </div>

      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">Manage Event</span>
        <v-btn icon variant="text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-tabs
        v-model="activeTab"
        bg-color="background"
        centered
        grow
        class="mb-4"
      >
        <v-tab value="details">
          <v-icon start>mdi-information-outline</v-icon> Details
        </v-tab>
        <v-tab value="tables">
          <v-icon start>mdi-table-chair</v-icon> Tables
        </v-tab>
        <v-tab value="players">
          <v-icon start>mdi-account-group</v-icon> Players
        </v-tab>
        <v-tab value="setup">
          <v-icon start>mdi-tools</v-icon> Initial Setup
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="activeTab">
          <!-- Details Tab -->
          <v-window-item value="details">
            <v-card-text class="pt-0">
              <p>
                <v-icon>mdi-seat</v-icon> Available Seats:
                {{ event?.seats_number }}
              </p>
              <p>
                <v-icon>mdi-sword-cross</v-icon> Scenario:
                {{ event?.scenario }}
              </p>
              <p v-if="getSeasonInfo(event?.seasons_fk).name">
                <v-icon>mdi-shield-sun</v-icon> Season:
                {{ getSeasonInfo(event.seasons_fk).name }}
              </p>
              <p class="text-end scheduled-box">
                Scheduled for:
                {{
                  new Date(event?.event_date).toLocaleString("en-US", {
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

            <v-card
              color="primary"
              min-height="130px"
              class="mr-4 event-card"
              @click="openInGoogleMaps()"
            >
              <v-row no-gutters>
                <v-col cols="3" lg="3">
                  <v-img
                    :src="
                      event?.picture_hash
                        ? `https://assets.drunagor.app/${event.picture_hash}`
                        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'
                    "
                    class="event-img"
                  />
                </v-col>
                <v-col cols="9" class="pa-2">
                  <h3 class="text-subtitle-1 font-weight-bold">
                    {{ event?.store_name }}
                  </h3>
                  <p class="text-caption">
                    <v-icon color="red">mdi-map-marker</v-icon>
                    {{ event?.address }}
                  </p>
                </v-col>
              </v-row>
            </v-card>

            <v-card color="primary" class="mr-4 mt-4 event-card">
              <v-responsive
                style="width: 100%; height: 200px"
                aspect-ratio="16/9"
              >
                <iframe
                  v-if="event?.latitude"
                  :src="
                    `https://www.google.com/maps?q=${event.latitude},${event.longitude}` +
                    `&z=15&output=embed`
                  "
                  frameborder="0"
                  style="border: 0; width: 100%; height: 100%"
                  allowfullscreen
                  loading="lazy"
                />
              </v-responsive>
            </v-card>

            <v-card-text>
              <h3 class="text-h6 font-weight-bold">REWARDS:</h3>
              <v-row
                v-if="eventRewards.length"
                v-for="(reward, index) in eventRewards"
                :key="index"
                class="align-center my-2"
              >
                <v-col cols="3" md="2">
                  <v-avatar size="60">
                    <v-img
                      :src="`https://assets.drunagor.app/${reward.picture_hash}`"
                    />
                  </v-avatar>
                </v-col>
                <v-col cols="9" md="10">
                  <h4 class="text-subtitle-1 font-weight-bold">
                    {{ reward.name }}
                  </h4>
                </v-col>
              </v-row>
              <p v-else class="text-caption">
                No rewards linked to this event.
              </p>
            </v-card-text>
          </v-window-item>

          <!-- Tables Tab -->
          <v-window-item value="tables">
            <v-row class="mb-4">
              <v-col
                cols="12"
                class="d-flex justify-space-between align-center flex-wrap"
              >
                <h3 class="text-h6 mb-2 mb-md-0">Event Tables</h3>
                <div class="d-flex gap-3 flex-wrap">
                  <v-btn
                    color="primary"
                    @click="openCreateTableDialog"
                    size="default"
                  >
                    <v-icon start>mdi-plus</v-icon> Create Table
                  </v-btn>
                  <v-btn
                    color="secondary"
                    @click="openCreateMultipleTablesDialog"
                    size="default"
                  >
                    <v-icon start>mdi-table-multiple</v-icon> Create Multiple
                    Tables
                  </v-btn>
                </div>
              </v-col>
            </v-row>

            <div v-if="loadingTables" class="text-center py-6">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>

            <v-row v-else>
              <v-col
                cols="12"
                v-if="tables.length === 0"
                class="text-center text-grey py-6"
              >
                No tables created yet. Create your first table!
              </v-col>

              <v-col
                v-for="table in tables"
                :key="table.event_tables_pk"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card
                  class="pa-4 table-card"
                  elevation="4"
                  rounded="lg"
                  @click="generateQRCode(table)"
                >
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      class="d-flex justify-space-between align-center mb-2"
                    >
                      <v-chip
                        color="primary"
                        size="small"
                        label
                        class="font-weight-bold"
                      >
                        <v-icon start color="white" size="small">
                          mdi-table-furniture
                        </v-icon>
                        <span class="table-number-text">
                          Table {{ table.table_number }}
                        </span>
                      </v-chip>
                      <v-btn
                        icon
                        size="small"
                        color="red"
                        variant="text"
                        @click.stop="deleteTable(table.event_tables_pk)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>

                    <v-col cols="12">
                      <div
                        class="d-flex align-center justify-space-between mb-2"
                      >
                        <span class="text-caption text-grey">Players</span>
                        <v-chip
                          size="small"
                          :color="table.is_full ? 'red' : 'green'"
                          variant="flat"
                        >
                          {{ table.players_count }}/{{ table.max_players }}
                        </v-chip>
                      </div>
                      <v-progress-linear
                        :model-value="
                          (table.players_count / table.max_players) * 100
                        "
                        :color="table.is_full ? 'red' : 'green'"
                        height="8"
                        rounded
                      ></v-progress-linear>
                    </v-col>

                    <v-col cols="12" class="mt-3">
                      <div class="text-caption text-grey">
                        <v-icon size="small" class="mr-1">mdi-seat</v-icon>
                        {{ table.available_seats }} seat(s) available
                      </div>
                    </v-col>

                    <v-col cols="12" class="mt-2">
                      <v-btn
                        block
                        size="small"
                        color="white"
                        variant="tonal"
                        @click.stop="generateQRCode(table)"
                      >
                        <v-icon start size="small">mdi-qrcode</v-icon>
                        Generate QR Code
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Players Tab -->
          <v-window-item value="players">
            <v-row>
              <v-col cols="12" class="d-flex align-end flex-column">
                <p class="pb-3 font-weight-bold">
                  PLAYERS INTERESTED
                  <v-btn
                    icon
                    size="medium"
                    variant="text"
                    @click="refreshPlayers"
                  >
                    <v-icon class="mb-1" color="white">mdi-refresh</v-icon>
                  </v-btn>
                </p>
              </v-col>

              <v-col
                cols="12"
                v-for="player in playersByEvent"
                :key="player.users_pk"
                class="pa-1"
              >
                <v-card class="player-card mb-3" rounded="lg" elevation="10">
                  <v-row no-gutters>
                    <v-col cols="4" lg="1" class="d-flex">
                      <v-img
                        :src="
                          player.picture_hash
                            ? `https://assets.drunagor.app/Profile/${player.picture_hash}`
                            : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'
                        "
                        alt="Player Image"
                        max-width="90"
                        max-height="90"
                        class="rounded-lg"
                      ></v-img>
                    </v-col>
                    <v-col
                      cols="8"
                      class="pl-3 d-flex flex-column justify-center"
                    >
                      <p class="font-weight-bold text-truncate">
                        {{ player.user_name }}
                      </p>
                      <p class="text-caption">
                        Status: {{ player.event_status }}
                      </p>
                      <p
                        v-if="player.status_date"
                        class="text-caption grey--text"
                      >
                        Received:
                        {{
                          new Date(player.status_date).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        }}
                      </p>
                    </v-col>
                    <v-col cols="12" md="3" class="d-flex flex-column">
                      <template
                        v-if="player.event_status === 'Granted Passage'"
                      >
                        <v-btn
                          color="deep-purple"
                          size="x-small"
                          class="mt-2 mt-md-0 pa-0"
                          block
                          @click="updatePlayerStatus(player, JoinedtheQuest)"
                        >
                          <v-icon start>mdi-flag-checkered</v-icon>Start Event
                        </v-btn>
                        <v-btn
                          color="red"
                          size="x-small"
                          class="mt-2"
                          block
                          @click="updatePlayerStatus(player, turnedAwayStatus)"
                        >
                          <v-icon start>mdi-close-circle-outline</v-icon>Turn
                          Away
                        </v-btn>
                      </template>
                      <template
                        v-else-if="player.event_status === 'Joined the Quest'"
                      >
                        <v-row
                          no-gutters
                          class="fill-height"
                          align="center"
                          justify="center"
                        >
                          <v-chip
                            color="yellow"
                            text-color="black"
                            class="ma-1"
                            label
                          >
                            <v-icon start>mdi-sword-cross</v-icon>Playing
                          </v-chip>
                        </v-row>
                      </template>
                      <template
                        v-else-if="player.event_status === 'Turned Away'"
                      >
                        <v-row
                          no-gutters
                          class="fill-height"
                          align="center"
                          justify="center"
                        >
                          <v-btn icon disabled class="ma-0 pa-0">
                            <v-icon color="red" size="24"
                              >mdi-close-circle</v-icon
                            >
                          </v-btn>
                        </v-row>
                      </template>
                      <template v-else>
                        <v-btn
                          color="green"
                          size="x-small"
                          class="mt-2"
                          block
                          @click="updatePlayerStatus(player, grantedStatus)"
                        >
                          <v-icon start>mdi-check-circle-outline</v-icon>Grant
                          Passage
                        </v-btn>
                        <v-btn
                          color="red"
                          size="x-small"
                          class="mt-2"
                          block
                          @click="updatePlayerStatus(player, turnedAwayStatus)"
                        >
                          <v-icon start>mdi-close-circle-outline</v-icon>Turn
                          Away
                        </v-btn>
                      </template>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col
                cols="12"
                class="d-flex justify-center"
                v-if="totalPages > 1"
              >
                <v-pagination
                  v-model="currentPage"
                  :length="totalPages"
                ></v-pagination>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Setup Tab -->
          <v-window-item value="setup">
            <div class="setup-guide-container">
              <div class="mb-4">
                <h3 class="text-h6 font-weight-bold mb-2">
                  <v-icon color="primary" class="mr-2">mdi-lightbulb-on</v-icon>
                  Initial Setup Tutorial
                </h3>
                <p class="text-body-2 text-grey">
                  Follow this step-by-step guide to prepare the game components
                  for your event.
                </p>
              </div>

              <v-dialog v-model="showAssemblyGuide" max-width="1200" persistent>
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="primary"
                    size="large"
                    block
                    v-bind="props"
                    class="mb-4"
                  >
                    <v-icon start>mdi-play-circle</v-icon>
                    Start Inital Setup
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title
                    class="d-flex justify-space-between align-center"
                  >
                    <span class="text-h6">Initial Setup Guide</span>
                    <v-btn
                      icon
                      variant="text"
                      @click="showAssemblyGuide = false"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text>
                    <AssemblyGuide @close="showAssemblyGuide = false" />
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <!-- QR Code Dialog -->
    <v-dialog v-model="qrCodeDialog" max-width="500" persistent>
      <v-card color="surface">
        <div v-if="generatingQR" class="dialog-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>

        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">
            Table {{ selectedTable?.table_number }} QR Code
          </span>
          <v-btn icon variant="text" @click="qrCodeDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="text-center">
          <div v-if="qrCodeData" class="qr-code-container pa-6 mb-4">
            <qrcode-vue
              :value="qrCodeData.code"
              :size="300"
              level="H"
              render-as="canvas"
              class="mx-auto"
            />
          </div>

          <v-btn
            block
            color="secondary"
            size="large"
            class="mb-4"
            @click="showTablePlayers"
          >
            <v-icon start>mdi-account-group</v-icon>
            View Players ({{ tablePlayers.length }})
          </v-btn>

          <v-expand-transition>
            <div v-if="showPlayers">
              <v-divider class="mb-4"></v-divider>
              <h4 class="text-left mb-3">Players at this table:</h4>

              <div v-if="loadingTablePlayers" class="text-center py-4">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="40"
                ></v-progress-circular>
              </div>

              <div
                v-else-if="tablePlayers.length === 0"
                class="text-center text-grey py-4"
              >
                No players at this table yet.
              </div>

              <v-list v-else class="transparent">
                <v-list-item
                  v-for="player in tablePlayers"
                  :key="player.users_pk"
                  class="mb-2 rounded-lg"
                  elevation="2"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40">
                      <v-img
                        :src="
                          player.picture_hash
                            ? `https://assets.drunagor.app/Profile/${player.picture_hash}`
                            : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'
                        "
                      ></v-img>
                    </v-avatar>
                  </template>

                  <v-list-item-title>{{ player.user_name }}</v-list-item-title>
                  <v-list-item-subtitle v-if="player.party_role">
                    {{ player.party_role }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Create Table Dialog -->
    <v-dialog v-model="createTableDialog" max-width="400">
      <v-card color="surface">
        <v-card-title>Create New Table</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model.number="newTable.table_number"
                label="Table Number (optional)"
                type="number"
                variant="outlined"
                hint="Leave empty to auto-generate"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model.number="newTable.max_players"
                label="Max Players"
                type="number"
                variant="outlined"
                :rules="[(v) => v > 0 || 'Must be greater than 0']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="createTableDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="creatingTable" @click="createTable">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Multiple Tables Dialog -->
    <v-dialog v-model="createMultipleTablesDialog" max-width="400">
      <v-card color="surface">
        <v-card-title>Create Multiple Tables</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model.number="multipleTables.quantity"
                label="Number of Tables"
                type="number"
                variant="outlined"
                :rules="[(v) => (v > 0 && v <= 50) || 'Between 1 and 50']"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model.number="multipleTables.max_players"
                label="Max Players per Table"
                type="number"
                variant="outlined"
                :rules="[(v) => v > 0 || 'Must be greater than 0']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="createMultipleTablesDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn :loading="creatingTable" @click="createMultipleTables">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
import QrcodeVue from "qrcode-vue3";
import AssemblyGuide from "@/components/AssemblyGuide.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  event: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "refresh"]);

const axios = inject("axios");

// State
const activeTab = ref("details");
const dialogLoading = ref(false);
const tables = ref([]);
const loadingTables = ref(false);
const playersByEvent = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const eventRewards = ref([]);

// Statuses
const statuses = ref([]);
const grantedStatus = ref(null);
const turnedAwayStatus = ref(null);
const JoinedtheQuest = ref(null);

// Table Creation
const createTableDialog = ref(false);
const createMultipleTablesDialog = ref(false);
const creatingTable = ref(false);
const newTable = ref({
  table_number: null,
  max_players: 4,
});
const multipleTables = ref({
  quantity: 4,
  max_players: 4,
});

// QR Code
const qrCodeDialog = ref(false);
const generatingQR = ref(false);
const selectedTable = ref(null);
const qrCodeData = ref(null);
const showPlayers = ref(false);
const tablePlayers = ref([]);
const loadingTablePlayers = ref(false);

// Assembly Guide
const showAssemblyGuide = ref(false);

// Methods
const getSeasonInfo = (fk) => {
  if (fk == 2) return { flag: s1flag, name: "Season 1" };
  if (fk == 3) return { flag: s2flag, name: "Season 2" };
  return { flag: null, name: "" };
};

const openInGoogleMaps = () => {
  if (
    !props.event?.store_name ||
    props.event.latitude == null ||
    props.event.longitude == null
  )
    return;

  const encodedName = props.event.store_name.split(" ").join("+");
  const lat = props.event.latitude;
  const lng = props.event.longitude;
  const query = `${encodedName}%20${lat},${lng}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  window.open(mapsUrl, "_blank");
};

const closeDialog = () => {
  emit("update:modelValue", false);
};

const fetchTablesForEvent = async (eventFk) => {
  loadingTables.value = true;
  try {
    const { data } = await axios.get(`/event_tables/list/${eventFk}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    tables.value = data.tables || [];
  } catch (error) {
    console.error("Error fetching tables:", error);
    tables.value = [];
  } finally {
    loadingTables.value = false;
  }
};

const fetchPlayersForEvent = async (eventFk) => {
  dialogLoading.value = true;
  try {
    const params = {
      events_fk: eventFk,
      limit: 5,
      offset: (currentPage.value - 1) * 5,
    };
    const { data } = await axios.get("/rl_events_users/list_players", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    playersByEvent.value = data.players || [];
    totalPages.value = data.last_page || 1;
  } catch (error) {
    console.error("Error fetching players:", error);
    playersByEvent.value = [];
  } finally {
    dialogLoading.value = false;
  }
};

const fetchStatuses = async () => {
  try {
    const { data } = await axios.get("/event_status/search");
    statuses.value = data.event_status;
    grantedStatus.value = statuses.value.find(
      (s) => s.name === "Granted Passage",
    )?.event_status_pk;
    turnedAwayStatus.value = statuses.value.find(
      (s) => s.name === "Turned Away",
    )?.event_status_pk;
    JoinedtheQuest.value = statuses.value.find(
      (s) => s.name === "Joined the Quest",
    )?.event_status_pk;
  } catch (error) {
    console.error("Error fetching statuses:", error);
  }
};

const fetchEventRewards = async (eventFk) => {
  try {
    const { data } = await axios.get("/rl_events_rewards/list_rewards", {
      params: { events_fk: eventFk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    eventRewards.value = data.rewards || [];
  } catch (error) {
    console.error("Error fetching event rewards:", error);
    eventRewards.value = [];
  }
};

const refreshPlayers = () => {
  if (props.event?.events_pk) {
    fetchPlayersForEvent(props.event.events_pk);
  }
};

const updatePlayerStatus = async (player, statusPk) => {
  dialogLoading.value = true;
  const payload = {
    users_fk: player.users_pk,
    events_fk: props.event.events_pk,
    status: statusPk,
    active: true,
  };
  try {
    await axios.post("/rl_events_users/cadastro", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    await fetchPlayersForEvent(props.event.events_pk);

    // Grant rewards if starting event
    if (statusPk === JoinedtheQuest.value && eventRewards.value.length > 0) {
      await Promise.all(
        eventRewards.value.map((reward) =>
          axios.post(
            "/rl_users_rewards/cadastro",
            {
              users_fk: player.users_pk,
              rewards_fk: reward.rewards_pk,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            },
          ),
        ),
      );
    }
  } catch (error) {
    console.error("Error updating player status:", error);
    alert("Failed to update player status");
  } finally {
    dialogLoading.value = false;
  }
};

const openCreateTableDialog = () => {
  newTable.value = { table_number: null, max_players: 4 };
  createTableDialog.value = true;
};

const openCreateMultipleTablesDialog = () => {
  multipleTables.value = { quantity: 4, max_players: 4 };
  createMultipleTablesDialog.value = true;
};

const createTable = async () => {
  creatingTable.value = true;
  try {
    const payload = {
      events_fk: props.event.events_pk,
      max_players: newTable.value.max_players || 4,
      active: true,
    };

    if (newTable.value.table_number) {
      payload.table_number = newTable.value.table_number;
    }

    await axios.post("/event_tables/create", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    await fetchTablesForEvent(props.event.events_pk);
    createTableDialog.value = false;
    emit("refresh");
  } catch (error) {
    console.error("Error creating table:", error);
    alert(error.response?.data?.message || "Failed to create table");
  } finally {
    creatingTable.value = false;
  }
};

const createMultipleTables = async () => {
  creatingTable.value = true;
  try {
    const payload = {
      events_fk: props.event.events_pk,
      quantity: multipleTables.value.quantity,
      max_players: multipleTables.value.max_players || 4,
    };

    await axios.post("/event_tables/create_multiple", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    await fetchTablesForEvent(props.event.events_pk);
    createMultipleTablesDialog.value = false;
    emit("refresh");
  } catch (error) {
    console.error("Error creating multiple tables:", error);
    alert(error.response?.data?.message || "Failed to create tables");
  } finally {
    creatingTable.value = false;
  }
};

const deleteTable = async (eventTablesPk) => {
  if (!confirm("Are you sure you want to delete this table?")) return;

  try {
    await axios.delete(`/event_tables/${eventTablesPk}/delete`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    await fetchTablesForEvent(props.event.events_pk);
    emit("refresh");
  } catch (error) {
    console.error("Error deleting table:", error);
    alert("Failed to delete table");
  }
};

const generateQRCode = async (table) => {
  selectedTable.value = table;
  generatingQR.value = true;
  qrCodeDialog.value = true;
  showPlayers.value = false;

  try {
    const { data } = await axios.post("/qr_code/generate", null, {
      params: {
        events_fk: props.event.events_pk,
        event_tables_pk: table.event_tables_pk,
        expires_in_hours: 24,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    qrCodeData.value = data;
  } catch (error) {
    console.error("Error generating QR Code:", error);
    alert(error.response?.data?.message || "Failed to generate QR Code");
    qrCodeDialog.value = false;
  } finally {
    generatingQR.value = false;
  }
};

const showTablePlayers = async () => {
  if (!showPlayers.value) {
    await fetchTablePlayers();
  }
  showPlayers.value = !showPlayers.value;
};

const fetchTablePlayers = async () => {
  loadingTablePlayers.value = true;
  try {
    const { data } = await axios.get(
      `/rl_events_users/table_players/${props.event.events_pk}/${selectedTable.value.event_tables_pk}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    tablePlayers.value = data.players || [];
  } catch (error) {
    console.error("Error fetching table players:", error);
    tablePlayers.value = [];
  } finally {
    loadingTablePlayers.value = false;
  }
};

// Watchers
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && props.event) {
      currentPage.value = 1;
      activeTab.value = "details";
      await Promise.all([
        fetchTablesForEvent(props.event.events_pk),
        fetchPlayersForEvent(props.event.events_pk),
        fetchStatuses(),
        fetchEventRewards(props.event.events_pk),
      ]);
    }
  },
);

watch(currentPage, () => {
  if (props.modelValue && props.event) {
    fetchPlayersForEvent(props.event.events_pk);
  }
});
</script>

<style scoped>
.setup-guide-container {
  max-width: 900px;
  margin: 0 auto;
}

.event-card {
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.event-img {
  width: 110px;
  height: 110px;
  border-radius: 4px;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(21, 21, 21, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.table-card:hover {
  transform: translateY(-2px);
}

.qr-code-container {
  background: white;
  border-radius: 12px;
}

.table-number-text {
  color: white !important;
  font-weight: 700 !important;
  font-size: 0.875rem;
}

.player-card {
  padding: 10px !important;
}

.gap-3 {
  gap: 12px !important;
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
</style>
