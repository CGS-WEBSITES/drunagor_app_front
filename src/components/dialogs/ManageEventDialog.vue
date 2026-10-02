<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    scroll-target="#app"
    max-width="900"
    :fullscreen="smAndDown"
  >
    <v-card color="surface" class="manage-event-card d-flex flex-column">
      <div v-if="dialogLoading" class="dialog-overlay">
        <v-progress-circular indeterminate size="80" color="primary" />
      </div>

      <div class="manage-event__header">
        <span class="manage-event__kicker">Manage event</span>
        <h2 class="manage-event__title">{{ event?.store_name }}</h2>
        <span class="manage-event__date">{{ formatEventDate(event?.event_date, userTimezone) }}</span>
        <v-btn icon variant="text" size="small" class="manage-event__close" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <nav class="manage-event__tabs">
        <button
          v-for="tab in manageTabs"
          :key="tab.value"
          class="manage-event__tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          <v-icon size="18">{{ tab.icon }}</v-icon>
          <span>{{ tab.label }}</span>
        </button>
      </nav>

      <v-card-text class="flex-grow-1 overflow-y-auto pt-0">
        <v-window v-model="activeTab">
          <v-window-item value="details">
            <!-- At a glance: when, which wing, how full. -->
            <div class="md-summary">
              <div class="md-tile">
                <v-icon size="22" class="md-tile__icon">mdi-calendar-clock</v-icon>
                <span class="md-tile__label">When</span>
                <strong class="md-tile__value">{{ eventDay }}</strong>
                <span class="md-tile__sub">{{ eventTime }}</span>
              </div>
              <div class="md-tile md-tile--flag">
                <img v-if="seasonInfo.flag" :src="seasonInfo.flag" alt="" class="md-tile__banner" />
                <v-icon size="22" class="md-tile__icon">mdi-sword-cross</v-icon>
                <span class="md-tile__label">Wing</span>
                <strong class="md-tile__value">{{ event?.scenario }}</strong>
                <span class="md-tile__sub">{{ seasonInfo.name }}</span>
              </div>
              <div class="md-tile md-tile--link" @click="activeTab = 'tables'">
                <v-icon size="22" class="md-tile__icon">mdi-account-group</v-icon>
                <span class="md-tile__label">Seats taken</span>
                <strong class="md-tile__value">{{ seatStats.taken }}/{{ seatStats.total }}</strong>
                <span class="md-tile__sub">{{ tables.length }} {{ tables.length === 1 ? "table" : "tables" }} ›</span>
              </div>
            </div>

            <!-- Where -->
            <div class="md-store">
              <div class="md-store__info">
                <img :src="storeImage" alt="" class="md-store__img" />
                <div class="md-store__text">
                  <span class="md-tile__label">Store</span>
                  <h3>{{ event?.store_name }}</h3>
                  <p><v-icon size="15" class="mr-1">mdi-map-marker</v-icon>{{ event?.address }}</p>
                  <button v-if="event?.latitude" class="md-link" @click="openInGoogleMaps">
                    Open in Google Maps <v-icon size="14">mdi-open-in-new</v-icon>
                  </button>
                </div>
              </div>
              <iframe
                v-if="event?.latitude"
                class="md-store__map"
                :src="`https://www.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`"
                title="Store location"
                loading="lazy"
              />
            </div>

            <!-- What players get -->
            <div class="md-section-title">Reward</div>
            <div v-if="eventRewards.length" class="md-rewards">
              <div v-for="reward in eventRewards" :key="reward.rewards_pk" class="md-reward">
                <v-avatar size="52">
                  <v-img :src="`https://assets.drunagor.app/${reward.picture_hash}`" />
                </v-avatar>
                <div>
                  <strong>{{ reward.name }}</strong>
                  <p v-if="reward.description">{{ reward.description }}</p>
                </div>
              </div>
            </div>
            <p v-else class="md-empty">No rewards linked to this event.</p>

            <div class="md-actions">
              <v-btn v-if="editable" color="accent" variant="flat" prepend-icon="mdi-pencil" @click="emit('edit', event)">
                Edit event
              </v-btn>
              <v-btn variant="outlined" :prepend-icon="shareCopied ? 'mdi-check' : 'mdi-share-variant'" @click="shareEvent">
                {{ shareCopied ? "Link copied" : "Share" }}
              </v-btn>
              <v-spacer />
              <v-btn variant="tonal" color="error" prepend-icon="mdi-delete-outline" class="md-delete" @click="deleteConfirm = true">
                Delete
              </v-btn>
            </div>
          </v-window-item>

          <v-window-item value="tables">
            <v-alert v-if="qrTutorial.active" type="info" variant="tonal" class="mb-4" border="start">
              <div class="font-weight-bold">{{ tablesAlertCopy.title }}</div>
              <div class="mt-1">{{ tablesAlertCopy.message }}</div>
            </v-alert>

            <!-- Tables -->
            <div class="md-head">
              <div>
                <h3 class="md-head__title">Tables</h3>
                <p class="md-head__sub">
                  {{ seatStats.taken }}/{{ seatStats.total }} seats taken · players join by scanning the table's QR code
                </p>
              </div>
              <div class="md-head__actions">
                <v-btn color="accent" variant="flat" size="small" prepend-icon="mdi-plus" @click="openCreateTableDialog">
                  Add table
                </v-btn>
                <v-btn variant="outlined" size="small" prepend-icon="mdi-table-multiple" @click="openCreateMultipleTablesDialog">
                  Add several
                </v-btn>
              </div>
            </div>

            <div v-if="loadingTables" class="text-center py-6">
              <v-progress-circular indeterminate color="primary" />
            </div>
            <div v-else-if="tables.length === 0" class="md-empty-box">
              <v-icon size="36">mdi-table-furniture</v-icon>
              <p>No tables yet. Add one so players can join.</p>
            </div>
            <div v-else class="md-tables">
              <div
                v-for="table in tables"
                :key="table.event_tables_pk"
                class="md-table"
                :class="{ 'md-table--full': table.is_full }"
              >
                <div class="md-table__top">
                  <strong>Table {{ table.table_number }}</strong>
                  <span class="md-table__count">{{ table.players_count }}/{{ table.max_players }}</span>
                  <v-btn icon size="x-small" variant="text" title="Delete table" @click.stop="deleteTable(table.event_tables_pk)">
                    <v-icon size="18">mdi-delete-outline</v-icon>
                  </v-btn>
                </div>
                <!-- One seat per player slot. -->
                <div class="md-seats">
                  <template v-for="seat in table.max_players" :key="seat">
                    <v-avatar v-if="table.players?.[seat - 1]" size="30" class="md-seat md-seat--taken" :title="table.players[seat - 1].user_name">
                      <v-img :src="avatarUrl(table.players[seat - 1].picture_hash)" />
                    </v-avatar>
                    <span v-else-if="seat <= table.players_count" class="md-seat md-seat--taken"><v-icon size="16">mdi-account</v-icon></span>
                    <span v-else class="md-seat"></span>
                  </template>
                </div>
                <button class="md-table__qr" @click="generateQRCode(table)">
                  <v-icon size="18">mdi-qrcode</v-icon> QR code
                </button>
              </div>
            </div>

            <!-- Players -->
            <div class="md-head mt-8">
              <div>
                <h3 class="md-head__title">Players</h3>
                <p class="md-head__sub">Let players in when they arrive, then start their quest.</p>
              </div>
              <v-btn icon size="small" variant="text" title="Refresh" @click="refreshPlayers">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </div>

            <div v-if="playersByEvent.length === 0" class="md-empty-box">
              <v-icon size="36">mdi-account-clock-outline</v-icon>
              <p>No players yet. They'll show up here once they sign up for the event.</p>
            </div>
            <div v-else class="md-players">
              <div v-for="player in playersByEvent" :key="player.users_pk" class="md-player">
                <v-avatar size="44">
                  <v-img :src="avatarUrl(player.picture_hash)" />
                </v-avatar>
                <div class="md-player__info">
                  <strong>{{ player.user_name }}</strong>
                  <span class="md-status" :class="statusClass(player.event_status)">{{ statusLabel(player.event_status) }}</span>
                </div>
                <div class="md-player__actions">
                  <template v-if="player.event_status === 'Granted Passage'">
                    <v-btn color="accent" variant="flat" size="small" prepend-icon="mdi-flag-checkered" @click="updatePlayerStatus(player, JoinedtheQuest)">
                      Start
                    </v-btn>
                    <v-btn color="error" variant="text" size="small" class="md-delete" @click="updatePlayerStatus(player, turnedAwayStatus)">
                      Turn away
                    </v-btn>
                  </template>
                  <template v-else-if="player.event_status !== 'Joined the Quest' && player.event_status !== 'Turned Away'">
                    <v-btn color="success" variant="flat" size="small" prepend-icon="mdi-check" @click="updatePlayerStatus(player, grantedStatus)">
                      Let in
                    </v-btn>
                    <v-btn color="error" variant="text" size="small" class="md-delete" @click="updatePlayerStatus(player, turnedAwayStatus)">
                      Turn away
                    </v-btn>
                  </template>
                </div>
              </div>
            </div>

            <div v-if="totalPages > 1" class="d-flex justify-center mt-2">
              <v-pagination v-model="currentPage" :length="totalPages" density="comfortable" />
            </div>
          </v-window-item>

          <v-window-item value="setup">
            <div class="table-assembly-container">
              <p class="md-head__sub mb-3 text-center">
                Prepare the table before each Drunagor Night. Heroes and the First Setup are handled by the players.
              </p>
              <a
          :href="TABLE_ASSEMBLY_PDF"
          target="_blank"
          rel="noopener noreferrer"
          class="pdf-download"
        >
          <v-icon size="20">mdi-file-pdf-box</v-icon>
          <span>Download PDF version</span>
          <v-icon size="16" class="pdf-download__go">mdi-download</v-icon>
        </a>
              <AssemblyGuide :steps="tableAssemblySteps" />
            </div>
          </v-window-item>

        </v-window>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="qrCodeDialog"
      max-width="500"
      :fullscreen="smAndDown"
      persistent
    >
      <v-card color="surface">
        <div v-if="generatingQR" class="dialog-overlay">
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
            <div ref="qrCanvasWrap" class="d-flex justify-center">
              <QrcodeVue
                :value="qrCodeData.code"
                :size="qrCanvasSize"
                level="H"
                render-as="canvas"
              />
            </div>
          </div>

          <v-alert
            v-if="qrCodeData"
            type="success"
            variant="tonal"
            class="mb-4"
          >
            Share this QR code with your players. They must scan it to join the
            table.
          </v-alert>

          <v-btn
            block
            color="primary"
            size="large"
            class="mb-4"
            :disabled="!qrCodeData"
            :loading="downloadingPdf"
            @click="downloadQrPdf"
          >
            <v-icon start>mdi-download</v-icon>
            Download QR Code (PDF)
          </v-btn>

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
              <v-divider class="mb-4" />
              <h4 class="text-left mb-3">Players at this table:</h4>

              <div v-if="loadingTablePlayers" class="text-center py-4">
                <v-progress-circular indeterminate color="primary" size="40" />
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
                      />
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

    <v-dialog v-model="deleteConfirm" max-width="420">
      <v-card>
        <v-card-title class="text-h6">Delete this event?</v-card-title>
        <v-card-text>
          {{ event?.store_name }} · {{ formatEventDate(event?.event_date, userTimezone) }}.
          Players will no longer see it. This cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="deleting" @click="deleteConfirm = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="deleteEvent">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model.number="newTable.max_players"
                label="Max Players"
                type="number"
                variant="outlined"
                :rules="[(v) => v > 0 || 'Must be greater than 0']"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="createTableDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="creatingTable" @click="createTable">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model.number="multipleTables.max_players"
                label="Max Players per Table"
                type="number"
                variant="outlined"
                :rules="[(v) => v > 0 || 'Must be greater than 0']"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
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
import { ref, computed, watch, inject, nextTick } from "vue";
import { useDisplay } from "vuetify";
import { jsPDF } from "jspdf";
import QrcodeVue from "qrcode-vue3";
import QRCode from "qrcode";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import { useUserStore } from "@/store/UserStore";
import { extractTime, formatEventDate } from "@/utils/dateHelpers";
import AssemblyGuide from "@/components/AssemblyGuide.vue";
import { tableAssemblySteps, TABLE_ASSEMBLY_PDF } from "@/data/assembly/tableAssembly";

const { smAndDown } = useDisplay();

const userStore = useUserStore();

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  event: { type: Object, default: null },
  // Shows "Edit event": the parent owns the edit form and handles @edit.
  editable: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "refresh", "edit", "deleted"]);
const axios = inject("axios");

const activeTab = ref("details");
const dialogLoading = ref(false);
const tables = ref([]);
const loadingTables = ref(false);
const playersByEvent = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const eventRewards = ref([]);

const statuses = ref([]);
const grantedStatus = ref(null);
const turnedAwayStatus = ref(null);
const JoinedtheQuest = ref(null);

const createTableDialog = ref(false);
const createMultipleTablesDialog = ref(false);
const creatingTable = ref(false);
const newTable = ref({ table_number: null, max_players: 4 });
const multipleTables = ref({ quantity: 4, max_players: 4 });

const qrCodeDialog = ref(false);
const generatingQR = ref(false);
const selectedTable = ref(null);
const qrCodeData = ref(null);
const showPlayers = ref(false);
const tablePlayers = ref([]);
const loadingTablePlayers = ref(false);
const startInTables = ref(false);

const qrTutorial = ref({
  active: false,
  step: 1,
});

const qrCanvasWrap = ref(null);
const qrPngDataUrl = ref("");
const qrCanvasSize = computed(() => (smAndDown.value ? 240 : 300));
const downloadingPdf = ref(false);

const userTimezone = computed(() => userStore.userIanaTimezone());

const qrTutorialCopy = computed(() => {
  if (!qrTutorial.value.active) return null;

  return {
    title: "Generate a QR Code",
    message:
      "Generate a QR code by clicking the Generate QR Code button below and share it with your players. They will scan it to enter the table.",
  };
});

const tablesAlertCopy = computed(() => {
  if (qrTutorial.value.active && qrTutorialCopy.value)
    return qrTutorialCopy.value;

  return {
    title: "QR Code Setup",
    message:
      "Generate a QR code for each table and share it with your players. They will scan it to join the table.",
  };
});

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

const closeDialog = () => emit("update:modelValue", false);

const avatarUrl = (hash) =>
  hash ? `https://assets.drunagor.app/Profile/${hash}` : "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png";

const storeImage = computed(() =>
  props.event?.picture_hash
    ? `https://assets.drunagor.app/${props.event.picture_hash}`
    : "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png",
);

const seasonInfo = computed(() => getSeasonInfo(props.event?.seasons_fk));

// "Tuesday, September 29, 2026" and "06:00 PM".
const eventDay = computed(() =>
  formatEventDate(props.event?.event_date, userTimezone.value, { weekday: true, dateOnly: true }),
);
const eventTime = computed(() => extractTime(props.event?.event_date, userTimezone.value));

const seatStats = computed(() => ({
  taken: tables.value.reduce((sum, table) => sum + (table.players_count || 0), 0),
  total: tables.value.reduce((sum, table) => sum + (table.max_players || 0), 0),
}));

const STATUS_LABELS = {
  "Granted Passage": "Let in",
  "Joined the Quest": "Playing",
  "Turned Away": "Turned away",
};
const statusLabel = (status) => STATUS_LABELS[status] || status || "Waiting";
const statusClass = (status) =>
  ({
    "Granted Passage": "md-status--in",
    "Joined the Quest": "md-status--playing",
    "Turned Away": "md-status--out",
  })[status] || "";

const shareCopied = ref(false);
const shareEvent = async () => {
  const pk = props.event?.events_pk;
  if (!pk) return;
  const url = `${window.location.origin}/event/${btoa(String(pk))}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: props.event.store_name, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    shareCopied.value = true;
    setTimeout(() => (shareCopied.value = false), 2000);
  } catch (_) {
    // Share sheet closed.
  }
};

const manageTabs = [
  { value: "details", label: "Details", icon: "mdi-information-outline" },
  { value: "tables", label: "Tables & players", icon: "mdi-table-chair" },
  { value: "setup", label: "Table assembly", icon: "mdi-table-furniture" },
];

const deleteConfirm = ref(false);
const deleting = ref(false);

const deleteEvent = async () => {
  if (!props.event?.events_pk) return;
  deleting.value = true;
  try {
    await axios.delete(`/events/${props.event.events_pk}/delete/`);
    deleteConfirm.value = false;
    emit("deleted", props.event);
    emit("refresh");
    closeDialog();
  } catch (error) {
    console.error("Error deleting event:", error);
    alert(error.response?.data?.message || "Failed to delete the event");
  } finally {
    deleting.value = false;
  }
};

const fetchTablesForEvent = async (eventFk) => {
  loadingTables.value = true;
  try {
    const { data } = await axios.get(`/event_tables/list/${eventFk}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const fetchedTables = data.tables || [];
    
    await Promise.all(
      fetchedTables.map(async (table) => {
        try {
          const playersRes = await axios.get(
            `/rl_events_users/table_players/${eventFk}/${table.event_tables_pk}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          table.players = playersRes.data.players || [];
        } catch (err) {
          table.players = [];
        }
      })
    );
    
    tables.value = fetchedTables;
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
  if (props.event?.events_pk) fetchPlayersForEvent(props.event.events_pk);
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

    if (statusPk === JoinedtheQuest.value && eventRewards.value.length > 0) {
      await Promise.all(
        eventRewards.value.map((reward) =>
          axios.post(
            "/rl_users_rewards/cadastro",
            { users_fk: player.users_pk, rewards_fk: reward.rewards_pk },
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
    if (newTable.value.table_number)
      payload.table_number = newTable.value.table_number;

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

const captureQrPngFromCanvas = async () => {
  qrPngDataUrl.value = "";
  if (!qrCanvasWrap.value) return;

  await nextTick();
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const canvas = qrCanvasWrap.value.querySelector("canvas");
  if (!canvas) return;

  try {
    qrPngDataUrl.value = canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Failed to read QR canvas:", err);
    qrPngDataUrl.value = "";
  }
};

const generateQRCode = async (table) => {
  selectedTable.value = table;
  generatingQR.value = true;
  qrCodeDialog.value = true;
  showPlayers.value = false;
  qrPngDataUrl.value = "";

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

    await captureQrPngFromCanvas();
  } catch (error) {
    console.error("Error generating QR Code:", error);
    alert(error.response?.data?.message || "Failed to generate QR Code");
    qrCodeDialog.value = false;
  } finally {
    generatingQR.value = false;
  }
};

watch([qrCodeDialog, qrCodeData], async ([open, data]) => {
  if (!open || !data?.code) {
    qrPngDataUrl.value = "";
    return;
  }
  await captureQrPngFromCanvas();
});

const showTablePlayers = async () => {
  if (!showPlayers.value) await fetchTablePlayers();
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

const openTablesAndStartQrTutorial = async () => {
  startInTables.value = true;
  qrTutorial.value = { active: true, step: 1 };

  if (props.modelValue) {
    activeTab.value = "tables";
    await nextTick();
  }
};

defineExpose({
  openTablesAndStartQrTutorial,
});

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const getQrPngDataUrl = async () => {
  await nextTick();
  await new Promise((r) => requestAnimationFrame(r));

  const wrap = qrCanvasWrap.value;

  if (wrap) {
    const canvas = wrap.querySelector("canvas");
    if (canvas) {
      try {
        return canvas.toDataURL("image/png");
      } catch (e) {
        console.error("toDataURL(canvas) failed:", e);
      }
    }

    const svg = wrap.querySelector("svg");
    if (svg) {
      try {
        if (!svg.getAttribute("xmlns")) {
          svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        }

        const svgString = new XMLSerializer().serializeToString(svg);
        const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

        const img = await loadImage(svgUrl);

        const size = 900;
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;

        const ctx = c.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);

        return c.toDataURL("image/png");
      } catch (e) {
        console.error("SVG -> PNG failed:", e);
      }
    }
  }

  if (qrCodeData.value?.code) {
    try {
      return await QRCode.toDataURL(qrCodeData.value.code, {
        errorCorrectionLevel: "H",
        width: 900,
        margin: 1,
      });
    } catch (e) {
      console.error("QRCode.toDataURL fallback failed:", e);
    }
  }

  return "";
};

const downloadQrPdf = async () => {
  try {
    downloadingPdf.value = true;

    const imgData = await getQrPngDataUrl();

    if (!imgData || !selectedTable.value) {
      alert("QR code image is not ready yet. Please try again.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;

    doc.setFontSize(18);
    doc.text(`Table ${selectedTable.value.table_number} — QR Code`, margin, 56);

    const qrSize = Math.min(360, pageWidth - margin * 2);
    doc.addImage(imgData, "PNG", (pageWidth - qrSize) / 2, 80, qrSize, qrSize);

    doc.setFontSize(12);
    const y = 80 + qrSize + 36;
    doc.text("How to use this QR code:", margin, y);

    const steps = [
      "1. Share this QR code with the players before the event.",
      "2. Players need to be logged into the Drunagor app - https://drunagor.app/",
      "3. After logging in, they will be directed to the Dashboard page, where there will be a 'PLAY' button.",
      "4. The player needs to click this button and scan the QR code provided by the retailer.",
      "5. By scanning the QR code, they will be redirected to the event table, where they need to select a hero.",
    ];

    doc.text(steps, margin, y + 18, { maxWidth: pageWidth - margin * 2 });

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
      "Tip: You can print this PDF and place it on the table.",
      margin,
      pageHeight - 40,
    );

    const filename = `event-${props.event?.events_pk || "unknown"}-table-${selectedTable.value.table_number}-qr.pdf`;
    doc.save(filename);
  } catch (err) {
    console.error("downloadQrPdf failed:", err);
    alert("Failed to download the QR code PDF.");
  } finally {
    downloadingPdf.value = false;
  }
};

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && props.event) {
      currentPage.value = 1;

      activeTab.value = startInTables.value ? "tables" : "details";

      await Promise.all([
        fetchTablesForEvent(props.event.events_pk),
        fetchPlayersForEvent(props.event.events_pk),
        fetchStatuses(),
        fetchEventRewards(props.event.events_pk),
      ]);

      if (startInTables.value) {
        activeTab.value = "tables";
        qrTutorial.value = { active: true, step: 1 };
        await nextTick();
      }
    }

    if (!isOpen) {
      startInTables.value = false;
    }
  },
);

watch(currentPage, () => {
  if (props.modelValue && props.event)
    fetchPlayersForEvent(props.event.events_pk);
});
</script>

<style scoped>
.manage-event-card {
  color: #fff;
  font-family: "Poppins", sans-serif;
}
.manage-event__header {
  position: relative;
  flex-shrink: 0;
  padding: 20px 56px 12px;
  text-align: center;
}
.manage-event__kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.7;
}
.manage-event__title {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  text-transform: uppercase;
}
.manage-event__date {
  font-size: 0.8rem;
  opacity: 0.8;
}
.manage-event__close {
  position: absolute;
  top: 12px;
  right: 12px;
}
.manage-event__tabs {
  display: flex;
  flex-shrink: 0;
  gap: 6px;
  margin: 0 16px 16px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 10px;
}
.manage-event__tab {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 6px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.6;
  transition: background 0.2s ease, opacity 0.2s ease;
}
.manage-event__tab.active {
  background: rgb(var(--v-theme-terciary));
  color: rgb(var(--v-theme-on-terciary));
  opacity: 1;
}
/* Details */
.md-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.md-tile {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.md-tile--link {
  cursor: pointer;
  transition: background 0.2s ease;
}
.md-tile--link:hover {
  background: rgba(255, 255, 255, 0.1);
}
.md-tile__icon {
  margin-bottom: 6px;
  color: rgb(var(--v-theme-accent));
}
.md-tile__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  opacity: 0.6;
}
.md-tile__value {
  overflow: hidden;
  font-size: 1rem;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.md-tile__sub {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  opacity: 0.75;
}
/* Season banner hanging from the top edge, like on the event cards. */
.md-tile--flag {
  position: relative;
  padding-right: 64px;
}
.md-tile__banner {
  position: absolute;
  top: 0;
  right: 14px;
  width: 40px;
  height: auto;
}
.md-store {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.md-store__info {
  display: flex;
  gap: 14px;
  padding: 14px;
}
.md-store__img {
  flex: 0 0 64px;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  background: #fff;
}
.md-store__text {
  min-width: 0;
}
.md-store__text h3 {
  font-size: 1rem;
  line-height: 1.3;
  text-transform: uppercase;
}
.md-store__text p {
  display: flex;
  align-items: flex-start;
  margin: 4px 0 8px;
  font-size: 0.8rem;
  opacity: 0.8;
}
.md-store__map {
  width: 100%;
  height: 100%;
  min-height: 150px;
  border: 0;
}
.md-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: rgb(var(--v-theme-accent));
  font-size: 0.8rem;
  font-weight: 600;
}
.md-section-title {
  margin: 20px 0 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  opacity: 0.6;
}
.md-rewards {
  display: grid;
  gap: 8px;
}
.md-reward {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.md-reward p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.75;
}
.md-empty {
  font-size: 0.85rem;
  opacity: 0.6;
}
.md-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* The theme's error red is too dark on this card: lift the text. */
.md-delete {
  color: #ff8a80 !important;
}

/* Tables & players */
.md-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.md-head__title {
  font-size: 1.05rem;
  font-weight: 700;
  text-transform: uppercase;
}
.md-head__sub {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.65;
}
.md-head__actions {
  display: flex;
  gap: 8px;
}
.md-empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 16px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  text-align: center;
  opacity: 0.7;
}
.md-empty-box p {
  margin: 0;
  font-size: 0.85rem;
}
.md-tables {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
.md-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 12px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-radius: 10px;
}
.md-table--full {
  border-color: rgba(var(--v-theme-accent), 0.6);
}
.md-table__top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.md-table__top strong {
  flex: 1;
  text-transform: uppercase;
}
.md-table__count {
  font-size: 0.8rem;
  opacity: 0.75;
}
.md-seats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.md-seat {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}
.md-seat--taken {
  border: 2px solid rgb(var(--v-theme-accent));
}
.md-table__qr {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  transition: background 0.2s ease;
}
.md-table__qr:hover {
  background: rgba(255, 255, 255, 0.16);
}
.md-players {
  display: grid;
  gap: 8px;
}
.md-player {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.md-player__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
}
.md-player__info strong {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.md-player__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
}
.md-status {
  padding: 1px 8px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.md-status--in {
  background: rgba(var(--v-theme-success), 0.25);
}
.md-status--playing {
  background: rgb(var(--v-theme-accent));
  color: #141414;
}
.md-status--out {
  background: rgba(var(--v-theme-error), 0.3);
}
@media (max-width: 599px) {
  .md-summary {
    grid-template-columns: 1fr 1fr;
  }
  .md-summary .md-tile:first-child {
    grid-column: 1 / -1;
  }
  .md-store {
    grid-template-columns: 1fr;
  }
  .md-store__map {
    height: 160px;
  }
  .md-player {
    flex-wrap: wrap;
  }
  .md-player__actions {
    width: 100%;
  }
}
.event-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  margin-top: 20px;
}
@media (max-width: 599px) {
  .manage-event__tab {
    flex-direction: column;
    gap: 2px;
    font-size: 0.66rem;
  }
}
/* Fixed height so switching tabs does not resize the dialog. Vuetify sizes
   dialog cards through flex-basis, read from --v-card-height. */
.manage-event-card {
  --v-card-height: min(85vh, 780px);
  height: min(85vh, 780px);
}

.v-dialog--fullscreen .manage-event-card {
  --v-card-height: 100%;
  height: 100%;
}

.table-assembly-container {
  max-width: 900px;
  margin: 0 auto;
}

.gap-2 {
  gap: 8px !important;
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
  width: 100%;
  max-width: 110px;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
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

@media (max-width: 600px) {
  .event-card {
    margin-right: 0 !important;
  }
  .qr-code-container {
    padding: 16px !important;
  }
}

/* Download PDF version */
.pdf-download {
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  margin: 0 auto 20px;
  padding: 10px 16px;
  background: rgba(188, 163, 65, 0.14);
  border: 1px solid rgba(188, 163, 65, 0.6);
  border-radius: 999px;
  color: #e6cf73 !important;
  font-family: "Poppins", sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s ease;
}
.pdf-download:hover {
  background: rgba(188, 163, 65, 0.26);
}
.pdf-download__go {
  opacity: 0.8;
}
</style>
