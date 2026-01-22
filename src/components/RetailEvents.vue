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
      <div v-if="openingManageDialog" class="page-loading-overlay">
        <v-progress-circular indeterminate size="80" color="primary" />
      </div>

      <v-dialog v-model="errorDialog.show" max-width="400">
        <v-card>
          <v-card-title class="headline">Error</v-card-title>
          <v-card-text>{{ errorDialog.message }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="
                () => {
                  errorDialog.show = false;
                  createEventDialog = false;
                }
              "
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="successDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Success</v-card-title>
          <v-card-text>Event created successfully!</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="handleEventCreatedOk">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="turnAwayConfirmDialog.show" max-width="500" persistent>
        <v-card>
          <v-card-title class="headline">Are you sure?</v-card-title>
          <v-card-text>
            This action will turn the player away and cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="turnAwayConfirmDialog.show = false">
              Cancel
            </v-btn>
            <v-btn color="red" text @click="executeTurnAway"> Confirm </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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

      <v-row class="mb-4" align="center">
        <v-col cols="12" sm="6" class="d-flex align-center">
          <span class="ml-2">Upcoming</span>
          <v-switch
            v-model="showPast"
            hide-details
            color="secundary"
            class="mx-4"
          ></v-switch>
          <span>All</span>
        </v-col>
      </v-row>

      <div v-if="activeTab === 1">
        <div v-if="loading" class="loading-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>
        <div v-else class="list-container">
          <v-row v-if="events.length > 0">
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
                <v-img
                  v-if="getSeasonInfo(event.seasons_fk).flag"
                  :src="getSeasonInfo(event.seasons_fk).flag"
                  class="season-flag"
                />
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
                      <p
                        color="primary"
                        class="cinzel-text text-h3 font-weight-bold"
                      >
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
                      <v-icon color="red">mdi-sword-cross</v-icon> Scenario:
                      {{ event.scenario }}
                    </p>
                    <p
                      class="text-caption ml-3"
                      v-if="event.rewards && event.rewards.length"
                    >
                      <v-row class="d-flex align-center rewards-container">
                        <v-icon class="mr-1" color="red"
                          >mdi-star-circle</v-icon
                        >
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
          <v-row v-else>
            <v-col class="text-center">
              No events match the selected filters.
            </v-col>
          </v-row>
        </div>
      </div>

      <div v-if="activeTab === 2">
        <div v-if="loading" class="loading-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>
        <div v-else class="list-container">
          <v-row class="CreateNew align-center bg-gray text-white">
            <v-col cols="2"></v-col>
            <v-col cols="3">
              <v-btn
                variant="text"
                class="sort-btn"
                @click="openCreateEventDialog"
              >
                <v-icon>mdi-plus-box-outline</v-icon>
                Create New
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="userCreatedEvents.length === 0">
            <v-col class="text-center">
              No events match the selected filters.
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col
              v-for="(event, index) in userCreatedEvents"
              :key="event.events_pk"
              class="py-2 pl-1 pr-1"
              cols="12"
              md="6"
            >
              <v-card
                color="white"
                max-height="120"
                class="pt-0 pl-0 pb-0 event-card"
                @click="openManageDialog(event)"
              >
                <v-row no-gutters>
                  <v-col cols="auto" class="redbutton pt-13 pl-3">
                    <v-btn
                      color="#AB2929"
                      icon
                      class="delete-btn"
                      @click.stop="deleteEvent(event.events_pk)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="8" class="pt-6 pr-3">
                    <v-row no-gutters>
                      <v-col cols="4" sm="2">
                        <div
                          class="text-center ml-2 pr-3"
                          style="width: 74px; color: black"
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
                            {{
                              String(event.event_date)
                                .split("T")[0]
                                .split("-")[2]
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

                      <v-col cols="8" sm="10" class="pt-2 pl-5">
                        <h3 class="pb-1 text-truncate">
                          <v-icon class="pr-1" size="small" color="black"
                            >mdi-chess-rook</v-icon
                          >
                          {{ event.store_name }}
                        </h3>

                        <p class="text-caption text-truncate">
                          <v-icon color="red">mdi-map-marker</v-icon>
                          {{ event.address }}
                        </p>

                        <p class="text-caption" v-if="event.scenario">
                          <v-icon color="red">mdi-sword-cross</v-icon>
                          Scenario: {{ event.scenario }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-col cols="auto" class="editbutton pt-13 pl-3">
                  <v-btn
                    color="white"
                    icon
                    class="delete-btn"
                    @click.stop="openEditDialog(event, true)"
                  >
                    <v-icon>mdi mdi-pencil</v-icon>
                  </v-btn>
                </v-col>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>

      <v-dialog v-model="dialog" max-width="600" min-height="410">
        <v-card color="surface">
          <v-card-actions class="d-flex justify-left">
            <v-btn color="red" @click="dialog = false">X</v-btn>
          </v-card-actions>
          <v-card-text>
            <p>
              <v-icon>mdi-seat</v-icon> Available Seats:
              {{ selectedEvent?.seats_number }}
            </p>
            <p>
              <v-icon>mdi-sword-cross</v-icon> Scenario:
              {{ selectedEvent?.scenario }}
            </p>
            <p v-if="getSeasonInfo(selectedEvent?.seasons_fk).name">
              <v-icon>mdi-shield-sun</v-icon> Season:
              {{ getSeasonInfo(selectedEvent.seasons_fk).name }}
            </p>
            <p class="text-end scheduled-box">
              Sheduled for:
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
                    selectedEvent?.picture_hash
                      ? `https://assets.drunagor.app/${selectedEvent.picture_hash}`
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

          <v-card color="primary" class="mr-4 mt-4 event-card">
            <v-responsive
              style="width: 100%; height: 200px"
              aspect-ratio="16/9"
            >
              <iframe
                v-if="selectedEvent?.latitude"
                :src="
                  `https://www.google.com/maps?q=${selectedEvent.latitude},${selectedEvent.longitude}` +
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

            <p v-else class="text-caption">No rewards linked to this event.</p>
          </v-card-text>
          <v-row class="mt-2 ml-0"> </v-row>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="createEventDialog"
        max-width="1280"
        scroll-target="#app"
      >
        <v-btn icon class="close-btn" @click="createEventDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card class="pa-6 dark-background">
          <div v-if="loading" class="loading-overlay">
            <v-progress-circular indeterminate size="80" color="primary" />
          </div>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="newEvent.store"
                  :items="stores.map((store) => store.name)"
                  label="STORE"
                  variant="outlined"
                  :loading="loading"
                  no-data-text="No stores found"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newEvent.season"
                  :items="seasons"
                  item-title="name"
                  item-value="seasons_pk"
                  label="SEASON"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newEvent.scenario"
                  :items="filteredScenarios"
                  item-title="name"
                  item-value="sceneries_pk"
                  label="SCENARIO"
                  variant="outlined"
                  :disabled="!newEvent.season"
                  no-data-text="Select a season first"
                ></v-select>
              </v-col>
              <v-col cols="6" md="4">
                <v-text-field
                  v-model="newEvent.hour"
                  label="TIME"
                  variant="outlined"
                  placeholder="HH:MM"
                  maxlength="5"
                  v-mask="'##:##'"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="4">
                <v-select
                  v-model="newEvent.ampm"
                  :items="['AM', 'PM']"
                  label="AM/PM"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-text-field
                  v-model="newEvent.date"
                  label="DATE"
                  type="date"
                  variant="outlined"
                  class="date-input"
                  :min="today"
                  :max="oneYearFromTodayISO"
                  :rules="dateRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <p class="pb-3 font-weight-bold">REWARDS</p>
                <v-autocomplete
                  v-model="selectedRewards"
                  :items="allRewards"
                  item-title="name"
                  item-value="rewards_pk"
                  label="Select Rewards"
                  multiple
                  return-object
                >
                  <template #item="{ item, props }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-avatar size="32">
                          <v-img
                            :src="`https://assets.drunagor.app/${item.raw.picture_hash}`"
                          />
                        </v-avatar>
                      </template>
                      <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                    </v-list-item>
                  </template>
                  <template #selection="{ item, index }">
                    <v-chip
                      size="small"
                      class="ma-1"
                      closable
                      @click:close="selectedRewards.splice(index, 1)"
                    >
                      <v-avatar start size="24">
                        <v-img
                          :src="`https://assets.drunagor.app/${item.raw.picture_hash}`"
                        />
                      </v-avatar>
                      {{ item.raw.name }}
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-btn
                  block
                  color="secundary"
                  class="launch-btn mt-12"
                  @click="addEvent"
                  >LAUNCH EVENT</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editEventDialog" scroll-target="#app" max-width="800">
        <v-card class="dark-background">
          <div v-if="loading" class="loading-overlay">
            <v-progress-circular indeterminate size="80" color="primary" />
          </div>
          <v-alert v-if="showSuccessAlert" type="success" class="mb-4" dense>
            Event changed successfully
          </v-alert>
          <v-card-text>
            <v-row>
              <v-col cols="6" md="6" v-if="isEditable">
                <v-select
                  v-model="editableEvent.seats_number"
                  :items="[1, 2, 3, 4]"
                  label="SEATS"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="6" md="6" v-if="isEditable">
                <v-select
                  v-model="editableEvent.sceneries_fk"
                  :items="sceneries"
                  item-title="name"
                  item-value="sceneries_pk"
                  label="SCENARIO"
                  variant="outlined"
                  :key="sceneries.length"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="isEditable">
                <v-select
                  v-model="editableEvent.store"
                  :items="stores.map((store) => store.name)"
                  label="STORE"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="6" md="3" v-if="isEditable">
                <v-text-field
                  v-model="editableEvent.hour"
                  label="TIME"
                  variant="outlined"
                  placeholder="HH:MM"
                  maxlength="5"
                  @blur="validateTime"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="2" v-if="isEditable">
                <v-select
                  v-model="editableEvent.ampm"
                  :items="['AM', 'PM']"
                  label="AM/PM"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="d-flex align-center"
                v-if="isEditable"
              >
                <v-text-field
                  v-model="editableEvent.date"
                  label="DATE"
                  type="date"
                  variant="outlined"
                  class="date-input"
                  :min="today"
                  :max="oneYearFromTodayISO"
                  :rules="dateRules"
                ></v-text-field>
              </v-col>
              <div v-if="existingRewards.length" class="mt-4">
                <p class="pb-2 font-weight-bold">Current Rewards:</p>
                <v-chip
                  v-for="reward in existingRewards"
                  :key="reward.rl_events_rewards_pk"
                  class="ma-1"
                  closable
                  @click:close="removeReward(reward)"
                >
                  {{ reward.name }}
                </v-chip>
              </div>
              <v-col cols="12" v-if="isEditable">
                <p class="pb-3 font-weight-bold">REWARDS</p>
                <v-autocomplete
                  v-model="editableEvent.rewards_pk"
                  :items="allRewards"
                  item-title="name"
                  item-value="rewards_pk"
                  label="Select Rewards"
                  multiple
                  chips
                  clearable
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" class="d-flex justify-space-between">
                <v-btn color="red" @click="editEventDialog = false"
                  >Close</v-btn
                >
                <v-btn
                  v-if="isEditable"
                  color="green"
                  :loading="loading"
                  :disabled="loading"
                  @click="saveEditedEvent"
                >
                  Save Changes</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </v-col>

  <ManageEventDialog
    ref="manageDialogRef"
    v-model="manageDialog"
    :event="selectedEvent"
    @refresh="handleRefresh"
  />

  <TutorialPromptDialog 
    v-model="showTutorialPrompt" 
    @tutorial-completed="handleTutorialCompleted"
  />
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  inject,
  nextTick,
} from "vue";
import { useUserStore } from "@/store/UserStore";
import { useRouter, useRoute } from "vue-router";
import { useTutorialStore } from "@/store/TutorialStore";
import TutorialPromptDialog from "@/components/dialogs/TutorialPromptDialog.vue";
import ManageEventDialog from "@/components/dialogs/ManageEventDialog.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const tutorialStore = useTutorialStore();
const axios = inject("axios");

const showTutorialPrompt = ref(false);
const isEditable = ref(false);
const selectedRewards = ref([]);
const dialog = ref(false);
const manageDialog = ref(false);
const selectedEvent = ref(null);
const activeTab = ref(1);
const sortBy = ref("date");
const events = ref([]);
const sceneries = ref([]);
const userCreatedEvents = ref([]);
const createEventDialog = ref(false);
const newEvent = ref({});
const stores = ref([]);
const editEventDialog = ref(false);
const editableEvent = ref({ rewards_pk: [] });
const showSuccessAlert = ref(false);
const existingRewards = ref([]);
const allRewards = ref([]);
const eventRewards = ref([]);
const showPast = ref(false);
const loading = ref(false);
const errorDialog = ref({
  show: false,
  message: "",
});
const successDialog = ref(false);
const eventsInterval = ref(null);
const turnAwayConfirmDialog = ref({
  show: false,
  player: null,
});
const seasons = ref([]);
const manageDialogRef = ref(null);
const lastCreatedEventId = ref(null);
const lastCreatedEventFallback = ref(null);
const pendingSuccessAfterTutorial = ref(false);
const openingManageDialog = ref(false);

const getSeasonInfo = (fk) => {
  if (fk == 2) return { flag: s1flag, name: "Season 1" };
  if (fk == 3) return { flag: s2flag, name: "Season 2" };
  return { flag: null, name: "" };
};

const confirmTurnAway = (player) => {
  turnAwayConfirmDialog.value = {
    show: true,
    player: player,
  };
};

const executeTurnAway = () => {
  if (turnAwayConfirmDialog.value.player) {
    turnAwayConfirmDialog.value = { show: false, player: null };
  }
};

const sortedEvents = computed(() => {
  if (sortBy.value === "date") {
    return events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  return events.value;
});

const filteredScenarios = computed(() => {
  if (!newEvent.value.season) return [];
  if (newEvent.value.season === 2) {
    return sceneries.value.filter((s) => [2, 3, 4].includes(s.sceneries_pk));
  }
  if (newEvent.value.season === 3) {
    return sceneries.value.filter((s) => [5, 6].includes(s.sceneries_pk));
  }
  return [];
});

const openInGoogleMaps = () => {
  const event = selectedEvent.value;
  if (!event?.store_name || event.latitude == null || event.longitude == null)
    return;

  const encodedName = event.store_name.split(" ").join("+");
  const lat = event.latitude;
  const lng = event.longitude;
  const query = `${encodedName}%20${lat},${lng}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  window.open(mapsUrl, "_blank");
};

const validateTime = () => {
  const value = editableEvent.value.hour;
  if (!value || value.length !== 5 || !value.includes(":")) return;
  let [hh, mm] = value.split(":");
  hh = parseInt(hh);
  mm = parseInt(mm);
  if (isNaN(hh) || hh < 1) hh = 1;
  if (hh > 12) hh = 12;
  if (isNaN(mm)) mm = 0;
  if (mm > 59) mm = 59;
  editableEvent.value.hour = `${hh.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}`;
};

const openManageDialog = (event) => {
  selectedEvent.value = event;
  manageDialog.value = true;
};

const handleRefresh = () => {
  fetchUserCreatedEvents(showPast.value);
  fetchPlayerEvents(showPast.value);
};

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const dateRules = [
  (value) => {
    if (!value) return "The date is required.";
    const inputDate = new Date(`${value}T00:00:00`);
    if (inputDate < startOfToday) {
      return "The date cannot be in the past.";
    }
    if (inputDate > oneYearFromToday) {
      return "The date cannot be more than 1 year in the future.";
    }
    return true;
  },
];

const today = new Date();
const todayISO = today.toISOString().split("T")[0];
const oneYearFromToday = new Date();
oneYearFromToday.setFullYear(today.getFullYear() + 1);
const oneYearFromTodayISO = oneYearFromToday.toISOString().split("T")[0];

const openDialog = (event) => {
  selectedEvent.value = event;
  dialog.value = true;

  axios
    .get("/rl_events_rewards/list_rewards", {
      params: { events_fk: event.events_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((res) => {
      eventRewards.value = res.data.rewards || [];
    })
    .catch(() => {
      eventRewards.value = [];
    });
};

const fetchPlayerEvents = async (past, isPolling = false) => {
  if (!isPolling) loading.value = true;
  try {
    const { data } = await axios.get("/events/list_events/", {
      params: {
        player_fk: userStore.user.users_pk,
        past_events: past.toString(),
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const eventsData = data.events || [];
    const eventsWithRewards = await Promise.all(
      eventsData.map(async (event) => {
        try {
          const rewardsResponse = await axios.get(
            "/rl_events_rewards/list_rewards",
            {
              params: { events_fk: event.events_pk },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            },
          );
          const rewards = rewardsResponse.data.rewards || [];
          const formattedRewards = rewards.map((r) => ({
            ...r,
            image: `https://assets.drunagor.app/${r.picture_hash}`,
          }));
          return { ...event, rewards: formattedRewards };
        } catch (rewardError) {
          return { ...event, rewards: [] };
        }
      }),
    );
    events.value = eventsWithRewards;
  } catch (err) {
    console.error("Error fetching player events:", err);
    events.value = [];
  } finally {
    if (!isPolling) loading.value = false;
  }
};

const fetchUserCreatedEvents = async (past, isPolling = false) => {
  if (!isPolling) loading.value = true;
  try {
    const params = {
      retailer_fk: userStore.user.users_pk,
      active: "true",
      past_events: past.toString(),
      limit: 30,
      offset: 0,
    };
    const { data } = await axios.get("/events/my_events/retailer", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const eventsData = data.events || [];
    const eventsWithRewards = await Promise.all(
      eventsData.map(async (event) => {
        try {
          const rewardsResponse = await axios.get(
            "/rl_events_rewards/list_rewards",
            {
              params: { events_fk: event.events_pk },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            },
          );

          const rewards = rewardsResponse.data.rewards || [];
          const formattedRewards = rewards.map((r) => ({
            ...r,
            image: `https://assets.drunagor.app/${r.picture_hash}`,
          }));

          return { ...event, rewards: formattedRewards };
        } catch (rewardError) {
          return { ...event, rewards: [] };
        }
      }),
    );

    userCreatedEvents.value = eventsWithRewards;
  } catch (error) {
    console.error("Error fetching my events:", error);
    userCreatedEvents.value = [];
  } finally {
    if (!isPolling) loading.value = false;
  }
};

const fetchSeasons = async () => {
  try {
    const { data } = await axios.get("/seasons/search", {
      params: { active: true },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    seasons.value = data.seasons || [];
  } catch (error) {
    console.error("Error fetching seasons:", error);
  }
};

const fetchSceneries = async () => {
  await axios
    .get("/sceneries/search", {
      params: { active: true },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((response) => {
      sceneries.value = [...response.data.sceneries];
    })
    .catch((error) => {
      console.error("Error fetching sceneries:", error);
    });
};

const removeReward = async (reward) => {
  try {
    const relationPk = reward.rl_events_rewards_pk;
    await axios.put(
      `/rl_events_rewards/alter/${relationPk}`,
      {
        events_fk: selectedEvent.value.events_pk,
        rewards_fk: reward.rewards_pk,
        active: false,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    existingRewards.value = existingRewards.value.filter(
      (r) => r.rl_events_rewards_pk !== relationPk,
    );
    editableEvent.value.rewards_pk = editableEvent.value.rewards_pk.filter(
      (id) => id !== reward.rewards_pk,
    );
  } catch (err) {
    console.error("Error removing reward:", err);
    errorDialog.value = { show: true, message: "Failed to remove reward." };
  }
};

const roundTimeToNearest15Minutes = (timeString) => {
  if (!timeString || !timeString.includes(':')) return timeString;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  // Arredonda minutos para o múltiplo de 5 mais próximo
  const roundedMinutes = Math.round(minutes / 5) * 5;
  // Se arredondar para 60, adicionar 1 hora e zerar minutos
  if (roundedMinutes === 60) {
    const newHours = hours === 12 ? 1 : hours + 1;
    return `${String(newHours).padStart(2, '0')}:00`;
  }
  
  return `${String(hours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
};

  const addEvent = () => {
    loading.value = true;
    errorDialog.value.show = false;
    successDialog.value = false;

    const userId = userStore.user.users_pk;

    if (
      !newEvent.value.date ||
      !newEvent.value.hour ||
      !newEvent.value.store ||
      !newEvent.value.season ||
      !newEvent.value.scenario ||
      !userId
    ) {
      errorDialog.value = {
        show: true,
        message: "Please fill in all fields before creating the event.",
      };
      loading.value = false;
      return;
    }

    newEvent.value.hour = roundTimeToNearest15Minutes(newEvent.value.hour);

    axios
      .get("/stores/list", {
        params: { users_fk: userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      );
    })
    .then(async ({ data }) => {
      const created = data.event;
      const id = created?.events_pk;

      if (!id) {
        errorDialog.value = {
          show: true,
          message: "Error creating event. Please try again.",
        };
        return Promise.reject("EventCreationFailed");
      }

      lastCreatedEventId.value = id;

      lastCreatedEventFallback.value = {
        ...(created || {}),
        events_pk: id,
        store_name: created?.store_name || newEvent.value.store || "",
        address: created?.address || newEvent.value.address || "",
        scenario: created?.scenario || "",
        seats_number: created?.seats_number || newEvent.value.seats || null,
        event_date: created?.event_date || null,
      };

      await createInitialTableForEvent(id);

      return Promise.all(
        selectedRewards.value.map((r) =>
          axios
            .post(
              "/rl_events_rewards/cadastro",
              {
                events_fk: id,
                rewards_fk: r.rewards_pk,
                active: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken",
                  )}`,
                },
              },
            )
            .catch(() => null),
        ),
      ).then(() => id);
    })
    .then((id) => {
      successDialog.value = false;
      createEventDialog.value = false;

      fetchUserCreatedEvents(showPast.value).catch(() => {});
      fetchPlayerEvents(showPast.value).catch(() => {});

      pendingSuccessAfterTutorial.value = true;

      if (tutorialStore.shouldShowInitialSetup) {
        pendingSuccessAfterTutorial.value = true;
        showTutorialPrompt.value = true;
      } else {
        pendingSuccessAfterTutorial.value = false;
        successDialog.value = true;
      }

      newEvent.value = {
        date: "",
        hour: "",
        ampm: "AM",
        store: "",
        seats: null,
        season: null,
        scenario: null,
      };
      selectedRewards.value = [];
    })
    .catch((err) => {
      if (
        [
          "StoreNotFound",
          "StoreInactive",
          "StoreUnverified",
          "EventCreationFailed",
        ].includes(err)
      )
        return;
      console.error("Unexpected error:", err);
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};

const createInitialTableForEvent = async (eventPk) => {
  try {
    await axios.post(
      "/event_tables/create",
      {
        events_fk: eventPk,
        max_players: 4,
        active: true,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
  } catch (err) {
    console.error("Error creating initial table:", err);
  }
};

const handleEventCreatedOk = async () => {
  successDialog.value = false;
  openingManageDialog.value = true;

  try {
    await fetchUserCreatedEvents(showPast.value);
  } catch (_) {}

  let eventToOpen = null;

  if (lastCreatedEventId.value) {
    eventToOpen = userCreatedEvents.value.find(
      (e) => e.events_pk === lastCreatedEventId.value,
    );
  }

  if (!eventToOpen && lastCreatedEventFallback.value) {
    eventToOpen = lastCreatedEventFallback.value;
  }

  if (!eventToOpen) {
    openingManageDialog.value = false;
    return;
  }

  openManageDialog(eventToOpen);

  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 100));

  manageDialogRef.value?.openTablesAndStartQrTutorial?.();

  activeTab.value = 2;

  await nextTick();

  openingManageDialog.value = false;
};

const deleteEvent = (events_pk) => {
  axios
    .delete(`/events/${events_pk}/delete/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(() => {
      fetchUserCreatedEvents(showPast.value);
      fetchPlayerEvents(showPast.value);
    })
    .catch((error) => {
      console.error("Error deleting event:", error);
    });
};

  const openCreateEventDialog = () => {
    createEventDialog.value = true;
  };

  const openEditDialog = (event, editable = false) => {
  const [datePart, timePart] = event.event_date.split("T");
  const [hoursStr, minutesStr] = timePart.split(":");
  const hours24 = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? "PM" : "AM";

  editableEvent.value = {
    events_pk: event.events_pk,
    date: datePart,
    hour: `${String(hours12).padStart(2, "0")}:${minutes}`,
    ampm,
    seats_number: event.seats_number,
    sceneries_fk: event.sceneries_fk,
    store: event.store_name,
    rewards: event.rewards || [],
  };

  eventRewards.value = [];
  selectedEvent.value = event;
  isEditable.value = editable;
  editEventDialog.value = true;

  let chain = Promise.resolve();

  if (!sceneries.value.length) {
    chain = chain.then(() => fetchSceneries());
  }

  chain = chain.then(() => {
    const found = sceneries.value.find((s) => s.name === event.scenario);
    editableEvent.value.sceneries_fk = found ? found.sceneries_pk : null;
  });

  if (editable) {
    chain = chain
      .then(() =>
        axios.get("/rl_events_rewards/list_rewards", {
          params: { events_fk: event.events_pk },
        }),
      )
      .then(({ data }) => {
        existingRewards.value = data.rewards || [];
        editableEvent.value.rewards_pk = existingRewards.value.map(
          (r) => r.rewards_pk,
        );
      })
      .catch((err) => {
        console.error("Error fetching existing rewards:", err);
        existingRewards.value = [];
        editableEvent.value.rewards_pk = [];
      });
  }

  chain = chain
    .then(() => fetchAllRewards())
    .catch((err) => {
      console.error("Error fetching all rewards:", err);
    });

  return chain;
};

const saveEditedEvent = () => {
  loading.value = true;

  const eventPk = editableEvent.value.events_pk;
  if (!eventPk) {
    console.error("Event without events_pk");
    return;
  }

  axios
    .get("/stores/list", {
      params: { users_fk: userStore.user.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((response) => {
      const allStores = response.data.stores || [];
      const foundStore = allStores.find(
        (s) => s.name === editableEvent.value.store,
      );
      if (!foundStore) {
        console.error(`Store "${editableEvent.value.store}" not found`);
        throw new Error("StoreNotFound");
      }
      return foundStore.stores_pk;
    })
    .then((storesFk) => {
      const seasonsFk = editableEvent.value.seasons_fk ?? 2;
      const hour = (editableEvent.value.hour || "12:00").trim();
      const ampm = editableEvent.value.ampm || "PM";
      const dateFormatted = `${editableEvent.value.date}; ${hour} ${ampm}`;

      const payload = {
        events_pk: eventPk,
        seats_number: editableEvent.value.seats_number,
        seasons_fk: seasonsFk,
        sceneries_fk: editableEvent.value.sceneries_fk,
        date: dateFormatted,
        stores_fk: storesFk,
      };

      return axios.put("/events/alter", payload, {
        params: { events_pk: eventPk },
      });
    })
    .then(() => {
      const before = existingRewards.value.map((r) => r.rewards_pk);
      const after = editableEvent.value.rewards_pk;

      const toAdd = after.filter((id) => !before.includes(id));
      const toRemove = before.filter((id) => !after.includes(id));

      const promises = [
        ...toAdd.map((id) =>
          axios.post(
            "/rl_events_rewards/cadastro",
            { events_fk: eventPk, rewards_fk: id, active: true },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            },
          ),
        ),
        ...toRemove.map((id) =>
          axios.post(
            "/rl_events_rewards/cadastro",
            { events_fk: eventPk, rewards_fk: id, active: false },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            },
          ),
        ),
      ];

      return Promise.all(promises);
    })
    .then(() => {
      showSuccessAlert.value = true;
      setTimeout(() => {
        editEventDialog.value = false;
        fetchUserCreatedEvents(showPast.value);
        fetchPlayerEvents(showPast.value);
      }, 1500);
    })
    .catch((error) => {
      if (error.message === "StoreNotFound") return;
      console.error("Error saving event:", error);
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};

const fetchAllRewards = () => {
  axios
    .get("/rewards/search", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((res) => {
      allRewards.value = res.data.rewards || [];
    })
    .catch((err) => {
      console.error("Error fetching rewards:", err);
    });
};

const handleTutorialCompleted = () => {
  if (pendingSuccessAfterTutorial.value) {
    pendingSuccessAfterTutorial.value = false;
    successDialog.value = true;
  }
};

onMounted(async () => {
  if (route.query.action === "create") {
    activeTab.value = 2;
    openCreateEventDialog();
    router.replace({ query: null });
  }

  await axios
    .get("/stores/list", {
      params: { users_fk: userStore.user.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((response) => {
      stores.value = response.data.stores || [];
    })
    .catch((error) => {
      console.error("Error fetching stores:", error);
    });

  fetchSeasons();
  fetchSceneries();
  fetchAllRewards();
  await fetchPlayerEvents(showPast.value);
  await fetchUserCreatedEvents(showPast.value);

  eventsInterval.value = setInterval(() => {
    if (activeTab.value === 1) {
      fetchPlayerEvents(showPast.value, true);
    } else {
      fetchUserCreatedEvents(showPast.value, true);
    }
  }, 5000);
});

watch(
  () => newEvent.value.season,
  () => {
    newEvent.value.scenario = null;
  },
);

onUnmounted(() => {
  clearInterval(eventsInterval.value);
});

watch(showPast, async (novo) => {
  if (activeTab.value == 1) {
    await fetchPlayerEvents(novo);
  } else {
    await fetchUserCreatedEvents(novo);
  }
});

watch(activeTab, async (novo) => {
  if (novo == 1) {
    await fetchPlayerEvents(showPast.value);
  } else {
    await fetchUserCreatedEvents(showPast.value);
  }
});

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


</script>

<style scoped>
.page-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.map-link {
  color: inherit;
  text-decoration: underline;
}

.map-link:hover {
  opacity: 0.8;
}

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
  width: 100%;
  max-width: 110px;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
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
.season-flag {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  z-index: 2;
}

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
  position: relative;
  overflow: hidden;
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

.download-fab {
  position: fixed;
  z-index: 1000;
  bottom: 24px;
  right: 24px;
}
@media (max-width: 960px) {
  .download-fab {
    position: absolute;
    top: 16px;
    right: 16px;
    bottom: auto;
  }
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

@media (max-width: 600px) {
  .event-card {
    margin-right: 0 !important;
  }
}
</style>
