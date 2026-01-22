<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    scroll-target="#app"
    max-width="900"
    :fullscreen="smAndDown"
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
            <!-- ALERT SEMPRE VISÍVEL -->
            <v-alert type="info" variant="tonal" class="mb-4" border="start">
              <div class="font-weight-bold">{{ tablesAlertCopy.title }}</div>
              <div class="mt-1">{{ tablesAlertCopy.message }}</div>
            </v-alert>

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
              <v-progress-circular indeterminate color="primary" />
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
                      />
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
                      />
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
                <v-pagination v-model="currentPage" :length="totalPages" />
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Setup Tab -->
          <v-window-item value="setup">
            <div class="setup-guide-container">
              <div class="mb-4 text-center">
                <h3 class="text-h6 font-weight-bold mb-2">
                  <v-icon color="primary" class="mr-2">mdi-map</v-icon>
                  Initial Setup - {{ event?.scenario }}
                </h3>
              </div>

              <!-- Preview Card -->
              <v-card
                v-if="event?.scenario"
                class="setup-preview-card mb-4"
                elevation="4"
                @click="openSetupDialog"
              >
                <InitialSetupViewer
                  :scenario="event.scenario"
                  preview-mode
                />
                
                <div class="click-to-enlarge-hint">
                  <v-icon color="white" size="small">mdi-magnify-plus-outline</v-icon>
                  <span class="ml-1">Click to enlarge</span>
                </div>
              </v-card>

              <!-- Fallback quando não há cenário -->
              <v-alert
                v-else
                type="info"
                variant="tonal"
                class="text-center"
              >
                <v-icon size="48" class="mb-2">mdi-map-marker-off</v-icon>
                <div class="text-body-1">No setup map available for this scenario</div>
              </v-alert>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <!-- QR Code Dialog -->
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

          <!-- ALERT SEMPRE VISÍVEL -->
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

    <!-- Initial Setup Dialog - Separado do Manage Event -->
    <v-dialog
      v-model="setupDialog"
      max-width="1400"
      :fullscreen="smAndDown"
    >
      <v-card color="surface">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">
            <v-icon class="mr-2">mdi-map</v-icon>
            Initial Setup - {{ event?.scenario }}
          </span>
          
          <div class="d-flex align-center gap-2">
            <!-- Zoom Controls -->
            <v-btn
              icon
              size="small"
              variant="text"
              @click="zoomOut"
              :disabled="zoomLevel <= 1"
            >
              <v-icon>mdi-magnify-minus</v-icon>
            </v-btn>
            
            <v-chip size="small" variant="flat">
              {{ Math.round(zoomLevel * 100) }}%
            </v-chip>
            
            <v-btn
              icon
              size="small"
              variant="text"
              @click="zoomIn"
              :disabled="zoomLevel >= 3"
            >
              <v-icon>mdi-magnify-plus</v-icon>
            </v-btn>
            
            <v-btn
              icon
              size="small"
              variant="text"
              @click="resetZoom"
              v-if="zoomLevel !== 1"
            >
              <v-icon>mdi-restore</v-icon>
            </v-btn>
            
            <v-divider vertical class="mx-2" />
            
            <v-btn icon variant="text" @click="setupDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text class="pa-0 setup-dialog-content">
          <div
            ref="imageContainer"
            class="image-zoom-container"
            @wheel.prevent="handleWheel"
            @mousedown="startPan"
            @mousemove="handlePan"
            @mouseup="endPan"
            @mouseleave="endPan"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <InitialSetupViewer
              v-if="event?.scenario && setupDialog"
              :scenario="event.scenario"
              :style="{
                transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
                transformOrigin: 'center center',
                transition: isZooming ? 'none' : 'transform 0.1s ease-out',
                cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default'
              }"
            />
          </div>
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
import InitialSetupViewer from "@/components/InitialSetupViewer.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";

const { smAndDown } = useDisplay();

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  event: { type: Object, default: null },
});

const emit = defineEmits(["update:modelValue", "refresh"]);
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

const setupDialog = ref(false);

// Zoom and Pan state
const zoomLevel = ref(1);
const panX = ref(0);
const panY = ref(0);
const isPanning = ref(false);
const isZooming = ref(false);
const lastPanX = ref(0);
const lastPanY = ref(0);
const startX = ref(0);
const startY = ref(0);
const imageContainer = ref(null);

// Touch gesture state
let initialDistance = 0;
let initialZoom = 1;

const qrTutorial = ref({
  active: false,
  step: 1,
});

const qrCanvasWrap = ref(null);
const qrPngDataUrl = ref("");
const qrCanvasSize = computed(() => (smAndDown.value ? 240 : 300));
const downloadingPdf = ref(false);

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

const openSetupDialog = () => {
  setupDialog.value = true;
  resetZoom();
};

// Zoom functions
const zoomIn = () => {
  if (zoomLevel.value < 3) {
    zoomLevel.value = Math.min(3, zoomLevel.value + 0.25);
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 1) {
    zoomLevel.value = Math.max(1, zoomLevel.value - 0.25);
    // Reset pan when zooming out to 1x
    if (zoomLevel.value === 1) {
      panX.value = 0;
      panY.value = 0;
    }
  }
};

const resetZoom = () => {
  zoomLevel.value = 1;
  panX.value = 0;
  panY.value = 0;
};

// Mouse wheel zoom
const handleWheel = (event) => {
  isZooming.value = true;
  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  zoomLevel.value = Math.max(1, Math.min(3, zoomLevel.value + delta));
  
  if (zoomLevel.value === 1) {
    panX.value = 0;
    panY.value = 0;
  }
  
  setTimeout(() => {
    isZooming.value = false;
  }, 100);
};

// Pan functions
const startPan = (event) => {
  if (zoomLevel.value > 1) {
    isPanning.value = true;
    startX.value = event.clientX - panX.value;
    startY.value = event.clientY - panY.value;
  }
};

const handlePan = (event) => {
  if (isPanning.value && zoomLevel.value > 1) {
    panX.value = event.clientX - startX.value;
    panY.value = event.clientY - startY.value;
  }
};

const endPan = () => {
  isPanning.value = false;
};

// Touch gestures for pinch-to-zoom
const getDistance = (touch1, touch2) => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const handleTouchStart = (event) => {
  if (event.touches.length === 2) {
    // Pinch to zoom
    initialDistance = getDistance(event.touches[0], event.touches[1]);
    initialZoom = zoomLevel.value;
    isZooming.value = true;
  } else if (event.touches.length === 1 && zoomLevel.value > 1) {
    // Pan
    isPanning.value = true;
    const touch = event.touches[0];
    startX.value = touch.clientX - panX.value;
    startY.value = touch.clientY - panY.value;
  }
};

const handleTouchMove = (event) => {
  event.preventDefault();
  
  if (event.touches.length === 2 && initialDistance > 0) {
    // Pinch to zoom
    const currentDistance = getDistance(event.touches[0], event.touches[1]);
    const scale = currentDistance / initialDistance;
    zoomLevel.value = Math.max(1, Math.min(3, initialZoom * scale));
    
    if (zoomLevel.value === 1) {
      panX.value = 0;
      panY.value = 0;
    }
  } else if (event.touches.length === 1 && isPanning.value && zoomLevel.value > 1) {
    // Pan
    const touch = event.touches[0];
    panX.value = touch.clientX - startX.value;
    panY.value = touch.clientY - startY.value;
  }
};

const handleTouchEnd = (event) => {
  if (event.touches.length < 2) {
    initialDistance = 0;
    isZooming.value = false;
  }
  if (event.touches.length === 0) {
    isPanning.value = false;
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
.setup-guide-container {
  max-width: 1200px;
  margin: 0 auto;
}

.setup-preview-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.setup-preview-card:hover {
  transform: translateY(-4px);
}

.click-to-enlarge-hint {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.setup-dialog-content {
  overflow: hidden;
  max-height: 80vh;
}

.image-zoom-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.image-zoom-container > * {
  max-width: 100%;
  max-height: 80vh;
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
</style>