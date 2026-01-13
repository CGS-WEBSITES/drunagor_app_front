<template>
  <v-card color="primary" class="pa-4">
    <v-container class="pa-0">
      <v-row class="justify-center">
        <v-col cols="12" class="pa-2">
          <h3 class="text-h5 font-weight-bold mb-4">MY UPCOMING EVENTS</h3>
          <div
            v-if="loading"
            class="d-flex justify-center align-center"
            style="height: 200px"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
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
                      <h3 class="pb-1 text-truncate">
                        <v-icon class="pr-1" size="small" color="black"
                          >mdi-chess-rook</v-icon
                        >{{ event.store_name }}
                      </h3>
                      <p class="text-caption text-truncate">
                        <v-icon color="red">mdi-map-marker</v-icon
                        >{{ event.address }}
                      </p>
                      <p class="text-caption" v-if="event.scenario">
                        <v-icon color="red">mdi-sword-cross</v-icon>Scenario:
                        {{ event.scenario }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-card
              v-else
              color="transparent"
              flat
              class="text-center d-flex flex-column align-center justify-center pa-5"
              min-height="150"
            >
              <p class="mb-4">You have no upcoming events.</p>
              <v-btn color="primary" @click="goToEventsPageAndCreate"
                >Create New Event</v-btn
              >
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog
      v-model="manageDialog"
      scroll-target="#app"
      max-width="900"
      persistent
    >
      <v-card class="dark-background">
        <div v-if="dialogLoading" class="loading-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>

        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">Manage Event</span>
          <v-btn icon variant="text" @click="manageDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-tabs
          v-model="activeTab"
          color="white"
          class="mb-4 custom-tabs-container"
          centered
          grow
        >
          <v-tab value="tables" class="custom-tab">
            <v-icon start>mdi-table-chair</v-icon>
            Tables
          </v-tab>
          <v-tab value="players" class="custom-tab">
            <v-icon start>mdi-account-group</v-icon>
            Players
          </v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="activeTab">
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
                      <v-icon start>mdi-plus</v-icon>
                      Create Table
                    </v-btn>
                    <v-btn
                      color="secondary"
                      @click="openCreateMultipleTablesDialog"
                      size="default"
                    >
                      <v-icon start>mdi-table-multiple</v-icon>
                      Create Multiple Tables
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
                          <v-icon start color="white" size="small"
                            >mdi-table-furniture</v-icon
                          >
                          <span class="table-number-text"
                            >Table {{ table.table_number }}</span
                          >
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

            <v-window-item value="players">
              <v-row>
                <v-col cols="12" class="d-flex align-end flex-column">
                  <p class="pb-3 font-weight-bold">
                    PLAYERS INTERESTED
                    <v-btn
                      icon
                      size="medium"
                      variant="text"
                      @click="fetchPlayersForEvent(selectedEvent.events_pk)"
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
                            new Date(player.status_date).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
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
                            @click="
                              updatePlayerStatus(player, turnedAwayStatus)
                            "
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
                            @click="
                              updatePlayerStatus(player, turnedAwayStatus)
                            "
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
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="qrCodeDialog" max-width="500" persistent>
      <v-card class="dark-background">
        <div v-if="generatingQR" class="loading-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>

        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6"
            >Table {{ selectedTable?.table_number }} QR Code</span
          >
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

    <v-dialog v-model="createTableDialog" max-width="400">
      <v-card class="dark-background">
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
          <v-btn color="grey" variant="text" @click="createTableDialog = false"
            >Cancel</v-btn
          >
          <v-btn :loading="creatingTable" @click="createTable"
            >Create</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="createMultipleTablesDialog" max-width="400">
      <v-card class="dark-background">
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
            >Cancel</v-btn
          >
          <v-btn
            :loading="creatingTable"
            @click="createMultipleTables"
            >Create</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
  
  <TutorialPromptDialog v-model="showTutorialPrompt" />
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import QrcodeVue from "qrcode-vue3";
import { useTutorialStore } from "@/store/TutorialStore";
import TutorialPromptDialog from "@/components/dialogs/TutorialPromptDialog.vue";

const router = useRouter();
const userStore = useUserStore();
const axios = inject("axios");
const loading = ref(true);
const dialogLoading = ref(false);
const userCreatedEvents = ref([]);
const selectedEvent = ref(null);
const manageDialog = ref(false);
const playersByEvent = ref([]);
const activeTab = ref("tables");
const tables = ref([]);
const loadingTables = ref(false);
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
const qrCodeDialog = ref(false);
const generatingQR = ref(false);
const selectedTable = ref(null);
const qrCodeData = ref(null);
const showPlayers = ref(false);
const tablePlayers = ref([]);
const loadingTablePlayers = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const statuses = ref([]);
const grantedStatus = ref(null);
const turnedAwayStatus = ref(null);
const JoinedtheQuest = ref(null);

const tutorialStore = useTutorialStore();
const showTutorialPrompt = ref(false);

const upcomingRetailerEventsPreview = computed(() => {
  const now = new Date();
  return userCreatedEvents.value
    .filter((event) => new Date(event.event_date) > now)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 3);
});

const fetchUserCreatedEvents = async () => {
  loading.value = true;
  try {
    const params = {
      retailer_fk: userStore.user.users_pk,
      active: "true",
      past_events: false,
    };
    const { data } = await axios.get("/events/my_events/retailer", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    userCreatedEvents.value = data.events || [];
  } catch (error) {
    console.error("Error fetching retailer events:", error);
    userCreatedEvents.value = [];
  } finally {
    loading.value = false;
  }
};

const openManageDialog = async (event) => {
  selectedEvent.value = event;
  currentPage.value = 1;
  activeTab.value = "tables";

  await Promise.all([
    fetchTablesForEvent(event.events_pk),
    fetchPlayersForEvent(event.events_pk),
    fetchStatuses(),
  ]);

  manageDialog.value = true;
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

const generateQRCode = async (table) => {
  selectedTable.value = table;
  generatingQR.value = true;
  qrCodeDialog.value = true;
  showPlayers.value = false;

  try {
    const { data } = await axios.post("/qr_code/generate", null, {
      params: {
        events_fk: selectedEvent.value.events_pk,
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
      `/rl_events_users/table_players/${selectedEvent.value.events_pk}/${selectedTable.value.event_tables_pk}`,
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
      events_fk: selectedEvent.value.events_pk,
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

    await fetchTablesForEvent(selectedEvent.value.events_pk);
    createTableDialog.value = false;
    
    if (tutorialStore.shouldShowInitialSetup) {
      showTutorialPrompt.value = true;
    }
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
      events_fk: selectedEvent.value.events_pk,
      quantity: multipleTables.value.quantity,
      max_players: multipleTables.value.max_players || 4,
    };

    await axios.post("/event_tables/create_multiple", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    await fetchTablesForEvent(selectedEvent.value.events_pk);
    createMultipleTablesDialog.value = false;
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
    await fetchTablesForEvent(selectedEvent.value.events_pk);
  } catch (error) {
    console.error("Error deleting table:", error);
    alert("Failed to delete table");
  }
};

const goToEventsPageAndCreate = () => {
  router.push({ path: "/events", query: { action: "create" } });
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

const updatePlayerStatus = async (player, statusPk) => {
  dialogLoading.value = true;
  const payload = {
    users_fk: player.users_pk,
    events_fk: selectedEvent.value.events_pk,
    status: statusPk,
    active: true,
  };
  try {
    await axios.post("/rl_events_users/cadastro", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    await fetchPlayersForEvent(selectedEvent.value.events_pk);
  } catch (error) {
    console.error("Error updating player status:", error);
    alert("Failed to update player status");
  } finally {
    dialogLoading.value = false;
  }
};

onMounted(async () => {
  await fetchUserCreatedEvents();
});

watch(currentPage, () => {
  if (manageDialog.value && selectedEvent.value) {
    fetchPlayersForEvent(selectedEvent.value.events_pk);
  }
});
</script>

<style scoped>
.cinzel-text {
  font-family: "Cinzel", serif;
}
.event-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  min-height: 120px;
}
.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.table-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.table-card:hover {
  transform: translateY(-2px);
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark-background {
  background-color: #121212;
  color: white;
}
.qr-code-container {
  background: white;
  border-radius: 12px;
}
.custom-tabs-container {
  display: flex;
  justify-content: center;
  width: 100%;
}
.custom-tab {
  color: rgba(255, 255, 255, 0.6) !important;
  font-weight: 500;
  flex: 0 1 auto !important;
  min-width: 50% !important;
  max-width: 200px !important;
}
.custom-tab.v-tab--selected {
  color: white !important;
  font-weight: 700;
}
.v-tabs :deep(.v-tabs-slider) {
  max-width: 150px;
  margin: 0 auto;
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

/* Responsive adjustments */
@media (max-width: 600px) {
  .custom-tab {
    min-width: 120px !important;
    font-size: 0.875rem;
  }
}
</style>
