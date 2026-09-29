<template>
  <v-row justify="center">
    <v-col cols="12" class="text-center">
      <h1
        class="cinzel-text font-weight-black events-title justify-center text-center text-h2"
      >
        EVENTS
      </h1>
    </v-col>
  </v-row>

  <v-col cols="12" md="10" class="mx-auto">
    <v-card class="events-panel pb-8" min-height="500px">
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

      <nav class="events-tabs">
        <button
          v-for="tab in viewTabs"
          :key="tab.value"
          class="events-tabs__item"
          :class="{ active: viewTab === tab.value }"
          @click="viewTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </nav>
      <div class="events-sort">
        <div class="events-sort__group">
          <span class="events-sort__label">Show:</span>
          <button
            v-for="option in periodOptions"
            :key="option.label"
            class="events-sort__item"
            :class="{ active: showPast === option.value }"
            @click="showPast = option.value"
          >
            {{ option.label }}
          </button>
        </div>
        <div class="events-sort__group">
          <span class="events-sort__label">Sort by:</span>
          <button
            v-for="option in sortOptions"
            :key="option.value"
            class="events-sort__item"
            :class="{ active: sortBy === option.value }"
            @click="setSort(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>


      <div v-if="activeTab === 1">
        <div v-if="loading" class="loading-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>
        <div v-else class="list-container">
          <div v-if="events.length > 0" class="events-grid">
            <EventListCard
              v-for="event in sortedEvents"
              :key="event.events_pk"
              :event="event"
              :timezone="userTimezone"
              @open="openDialog(event)"
            />
          </div>
          <p v-else class="text-center text-grey py-8">No events match the selected filters.</p>
        </div>
      </div>

      <div v-if="activeTab === 2">
        <div v-if="loading" class="loading-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>
        <div v-else class="list-container">
          <div class="events-grid">
            <CreateEventCard @create="openCreateEventDialog" />
            <EventListCard
              v-for="event in sortedMyEvents"
              :key="event.events_pk"
              :event="event"
              :timezone="userTimezone"
              @open="openManageDialog(event)"
            >
              <template #status>
                <span class="events-manage-hint"><v-icon size="14">mdi-cog</v-icon> Manage</span>
              </template>
            </EventListCard>
          </div>
        </div>
      </div>

      <v-dialog v-model="dialog" max-width="560" scrollable>
        <v-card class="event-dialog" color="#2b2b2b">
          <div class="event-dialog__header">
            <h2 class="event-dialog__title">{{ selectedEvent?.store_name }}</h2>
            <v-btn icon variant="text" size="small" class="event-dialog__close" @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <v-card-text class="pt-0">
            <EventDetailContent :event="selectedEvent" :rewards="eventRewards" :timezone="userTimezone" />
          </v-card-text>
          <button class="event-dialog__share" @click="shareSelectedEvent">
            <v-icon start size="18">{{ shareCopied ? "mdi-check" : "mdi-share-variant" }}</v-icon>
            {{ shareCopied ? "Link copied" : "Share event" }}
          </button>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="createEventDialog"
        max-width="1280"
        scroll-target="#app"
      >
        <v-card class="create-event-shell dark-background">
          <div v-if="loading" class="loading-overlay">
            <v-progress-circular indeterminate size="80" color="primary" />
          </div>
          <div class="create-event-header">
            <h2 class="text-h5 font-weight-black mb-0">
              Create a Drunagor Nights Event
            </h2>
            <v-btn
              icon
              size="default"
              class="close-btn"
              @click="createEventDialog = false"
            >
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </div>
          <v-card-text class="create-event-body">
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="newEvent.store"
                  :items="availableStores"
                  label="SELECT YOUR STORE *"
                  variant="outlined"
                  prepend-inner-icon="mdi-store"
                  :loading="loading"
                  no-data-text="No stores found"
                  persistent-hint
                  hint="Choose the store hosting this event. Required."
                  :rules="[(v) => !!v || 'Please select your store']"
                  class="mb-2"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newEvent.season"
                  :items="retailerSeasonOptions"
                  item-title="name"
                  item-value="seasons_pk"
                  label="SEASON"
                  variant="outlined"
                  prepend-inner-icon="mdi-flag-variant"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="newEvent.scenario"
                  :items="filteredScenarios"
                  item-title="displayName"
                  item-value="sceneries_pk"
                  label="WING"
                  variant="outlined"
                  prepend-inner-icon="mdi-sword-cross"
                  :disabled="!filteredScenarios.length"
                  no-data-text="No wings available"
                >
                  <template #item="{ item, props }">
                    <v-list-item
                      v-bind="props"
                      :title="item.raw.wingLabel || item.raw.name"
                      :subtitle="item.raw.name"
                    ></v-list-item>
                  </template>
                  <template #selection="{ item }">
                    <span class="select-short-value">
                      {{ item.raw.wingLabel || item.raw.name }}
                    </span>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="4" sm="4" md="2">
                <v-select
                  v-model="newEvent.hour"
                  :items="hourOptions"
                  label="HOUR"
                  variant="outlined"
                  class="time-input"
                ></v-select>
              </v-col>

              <v-col cols="4" sm="4" md="2">
                <v-select
                  v-model="newEvent.minute"
                  :items="minuteOptions"
                  label="MIN"
                  variant="outlined"
                  class="time-input"
                ></v-select>
              </v-col>

              <v-col cols="4" sm="4" md="2">
                <v-select
                  v-model="newEvent.ampm"
                  :items="['AM', 'PM']"
                  label="AM/PM"
                  variant="outlined"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="6" class="d-flex align-center">
                <v-text-field
                  v-model="newEvent.date"
                  label="DATE"
                  type="date"
                  variant="outlined"
                  class="date-input"
                  prepend-inner-icon="mdi-calendar"
                  lang="en-US"
                  placeholder="mm/dd/yyyy"
                  :min="today"
                  :max="oneYearFromTodayISO"
                  :rules="dateRules"
                ></v-text-field>
              </v-col>

              <v-col cols="12" v-if="selectedRewards.length > 0">
                <p class="text-subtitle-1 font-weight-bold mb-2">
                  EVENT REWARD:
                </p>
                <v-card
                  v-for="(reward, index) in selectedRewards"
                  :key="index"
                  rounded="lg"
                  elevation="2"
                  class="py-2 px-2 d-flex align-center position-relative mb-2"
                  color="rgba(255, 255, 255, 0.05)"
                >
                  <v-row class="align-center" no-gutters>
                    <v-col
                      cols="3"
                      sm="2"
                      class="d-flex align-center justify-center pl-2"
                    >
                      <v-img
                        :src="`https://assets.drunagor.app/${reward.picture_hash}`"
                        alt="Reward Icon"
                        max-height="64"
                        max-width="64"
                        contain
                      ></v-img>
                    </v-col>
                    <v-col
                      cols="9"
                      sm="10"
                      class="pl-4 d-flex flex-column justify-center"
                    >
                      <p class="font-weight-bold white--text ma-0 text-h6">
                        {{ reward.name }}
                      </p>
                      <p class="text-body-2 grey--text ma-0">
                        {{ reward.description }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col cols="12">
                <div class="create-event-actions">
                  <v-btn
                    variant="text"
                    color="white"
                    @click="createEventDialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="secundary"
                    class="launch-btn"
                    :loading="loading"
                    :disabled="loading || !createEventReady"
                    @click="addEvent"
                  >
                    LAUNCH EVENT
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editEventDialog" scroll-target="#app" max-width="720">
        <v-card class="edit-event" color="#141414">
          <div v-if="loading" class="loading-overlay">
            <v-progress-circular indeterminate size="80" color="primary" />
          </div>

          <div class="edit-event__header">
            <h2>Edit event</h2>
            <v-btn icon variant="text" size="small" @click="editEventDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <v-alert v-if="showSuccessAlert" type="success" variant="tonal" density="compact" class="mx-6 mb-2">
            Event changed successfully
          </v-alert>

          <div class="edit-event__body">
            <label class="edit-event__label">Scenario</label>
            <v-select
              v-model="editableEvent.sceneries_fk"
              :items="editableScenarios"
              item-title="displayName"
              item-value="sceneries_pk"
              :key="editableScenarios.length"
              :disabled="!isEditable"
              variant="solo"
              density="compact"
              flat
              hide-details
              class="edit-event__field"
            />

            <label class="edit-event__label">Store</label>
            <v-select
              v-model="editableEvent.store"
              :items="availableStores"
              :disabled="!isEditable"
              prepend-inner-icon="mdi-store"
              variant="solo"
              density="compact"
              flat
              hide-details
              class="edit-event__field"
            />

            <div class="edit-event__row">
              <div>
                <label class="edit-event__label">Date</label>
                <v-text-field
                  v-model="editableEvent.date"
                  type="date"
                  :min="today"
                  :max="oneYearFromTodayISO"
                  :rules="dateRules"
                  :disabled="!isEditable"
                  variant="solo"
                  density="compact"
                  flat
                  hide-details="auto"
                  class="edit-event__field"
                />
              </div>
              <div>
                <label class="edit-event__label">Time</label>
                <div class="edit-event__time">
                  <v-text-field
                    v-model="editableEvent.hour"
                    placeholder="HH:MM"
                    maxlength="5"
                    :disabled="!isEditable"
                    variant="solo"
                    density="compact"
                    flat
                    hide-details
                    class="edit-event__field"
                    @blur="validateTime"
                  />
                  <v-select
                    v-model="editableEvent.ampm"
                    :items="['AM', 'PM']"
                    :disabled="!isEditable"
                    variant="solo"
                    density="compact"
                    flat
                    hide-details
                    class="edit-event__field edit-event__ampm"
                  />
                </div>
              </div>
            </div>

            <template v-if="editableRewardsItems.length">
              <label class="edit-event__label">Rewards</label>
              <div class="edit-event__rewards">
                <v-avatar
                  v-for="(reward, index) in editableRewardsItems"
                  :key="index"
                  size="48"
                  :title="reward.name"
                >
                  <v-img :src="`https://assets.drunagor.app/${reward.picture_hash}`" />
                </v-avatar>
              </div>
            </template>
          </div>

          <button
            v-if="isEditable"
            class="edit-event__confirm"
            :disabled="loading"
            @click="saveEditedEvent"
          >
            Confirm changes
          </button>
        </v-card>
      </v-dialog>
    </v-card>
  </v-col>

  <ManageEventDialog
    ref="manageDialogRef"
    v-model="manageDialog"
    :event="selectedEvent"
    editable
    @refresh="handleRefresh"
    @edit="editFromManage"
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
import EventListCard from "@/components/EventListCard.vue";
import CreateEventCard from "@/components/CreateEventCard.vue";
import EventDetailContent from "@/components/EventDetailContent.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import {
  extractMonth,
  extractDay,
  extractTime,
  formatEventDate,
  parseApiDate,
} from "@/utils/dateHelpers";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const tutorialStore = useTutorialStore();
const axios = inject("axios");
const LOCKED_RETAILER_SEASON_PK = 3;
const RETAILER_ALLOWED_SCENERIES = [5, 6];
const FALLBACK_RETAILER_SEASON = {
  seasons_pk: LOCKED_RETAILER_SEASON_PK,
  name: "Season 2",
};

const createDefaultNewEvent = () => ({
  date: "",
  hour: "12",
  minute: "00",
  ampm: "AM",
  store: "",
  season: 2,
  scenario: null,
  address: "",
});

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
const newEvent = ref(createDefaultNewEvent());
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

const getRetailWingLabel = (sceneryPk) => {
  if (sceneryPk === 2) return "Wing 1 Tutorial";
  if (sceneryPk === 3) return "Wing 1 Advanced";
  if (sceneryPk === 4) return "Wing 2 Advanced";
  if (sceneryPk === 5) return "Wing 3";
  if (sceneryPk === 6) return "Wing 4";
  return "";
};

const decorateScenario = (scenario) => {
  const wingLabel = getRetailWingLabel(scenario.sceneries_pk);
  return {
    ...scenario,
    wingLabel,
    displayName: wingLabel ? `${wingLabel} - ${scenario.name}` : scenario.name,
  };
};

const sortRetailScenarios = (a, b) =>
  RETAILER_ALLOWED_SCENERIES.indexOf(a.sceneries_pk) -
  RETAILER_ALLOWED_SCENERIES.indexOf(b.sceneries_pk);

const getStoreDisplayName = (store) =>
  (store && (store.name || store.storename)) || "";

const buildStoreAddress = (store) => {
  if (!store) return "";

  return [
    store.address,
    store.streetNumber,
    store.complement,
    store.city,
    store.state,
  ]
    .filter(Boolean)
    .join(", ");
};

const findStoreByNameInList = (storeList, selectedStoreName) => {
  const normalizedName = selectedStoreName
    ? selectedStoreName.toLowerCase().trim()
    : "";
  if (!normalizedName) return null;

  return (
    storeList.find(
      (store) =>
        getStoreDisplayName(store).toLowerCase().trim() === normalizedName,
    ) || null
  );
};

const findStoreByName = (selectedStoreName) =>
  findStoreByNameInList(stores.value, selectedStoreName);

const userTimezone = computed(
  () => userStore.user?.timezone?.iana_name ?? "America/Chicago",
);

const isBeforeJulyFirst2026 = () => {
  return false;
};

const retailerSeasonOptions = computed(() => {
  const allowedSg = seasons.value.filter(
    (season) => season.seasons_pk === 2 || season.seasons_pk === 3,
  );
  return allowedSg.length === 0
    ? [
        { seasons_pk: 2, name: "Season 1" },
        { seasons_pk: 3, name: "Season 2" }
      ]
    : allowedSg.map(s => ({ seasons_pk: s.seasons_pk, name: s.name }));
});

const availableStores = computed(() => {
  const names = stores.value
    .map((store) => getStoreDisplayName(store))
    .filter(Boolean);

  return [...new Set(names)];
});

const hourOptions = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

const minuteOptions = ["00", "15", "30", "45"];

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

// "My Events" lists the events this retailer created; "All Events" lists every
// event. "Show" picks upcoming events only or past ones too, for either tab.
const viewTabs = [
  { value: "mine", label: "MY EVENTS" },
  { value: "all", label: "ALL EVENTS" },
];
const viewTab = computed({
  get: () => (activeTab.value === 2 ? "mine" : "all"),
  set: (value) => {
    activeTab.value = value === "mine" ? 2 : 1;
  },
});
const periodOptions = [
  { value: false, label: "UPCOMING" },
  { value: true, label: "ALL" },
];

const sortOptions = [
  { value: "location", label: "LOCATION" },
  { value: "date", label: "DATE" },
  { value: "store", label: "STORE" },
];
const userCoords = ref(null);

const setSort = (value) => {
  sortBy.value = value;
  if (value === "location" && !userCoords.value && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userCoords.value = { lat: position.coords.latitude, lng: position.coords.longitude };
      },
      () => {
        // Permission denied: location sorting falls back to the address.
      },
    );
  }
};

const distanceKm = (event) => {
  if (!userCoords.value || event.latitude == null || event.longitude == null) return Infinity;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(event.latitude - userCoords.value.lat);
  const dLng = toRad(event.longitude - userCoords.value.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(userCoords.value.lat)) * Math.cos(toRad(event.latitude)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const sortEvents = (list) => {
  const sorted = [...list];
  if (sortBy.value === "store") {
    return sorted.sort((a, b) => (a.store_name || "").localeCompare(b.store_name || ""));
  }
  if (sortBy.value === "location") {
    return userCoords.value
      ? sorted.sort((a, b) => distanceKm(a) - distanceKm(b))
      : sorted.sort((a, b) => (a.address || "").localeCompare(b.address || ""));
  }
  return sorted.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
};

const sortedEvents = computed(() => sortEvents(events.value));
const sortedMyEvents = computed(() => sortEvents(userCreatedEvents.value));

const filteredScenarios = computed(() => {
  const currentSeason = newEvent.value.season;
  if (currentSeason === 2) {
    return sceneries.value
      .filter((scenario) => [3, 4].includes(scenario.sceneries_pk))
      .sort((a, b) => a.sceneries_pk - b.sceneries_pk)
      .map(decorateScenario);
  }
  if (currentSeason === 3) {
    return sceneries.value
      .filter((scenario) => [5, 6].includes(scenario.sceneries_pk))
      .sort((a, b) => a.sceneries_pk - b.sceneries_pk)
      .map(decorateScenario);
  }
  return [];
});

// Always offer the event's current scenario, even when it is no longer one
// retailers can pick for new events (otherwise the select shows its raw id).
const editableScenarios = computed(() => {
  const options = editableScenarioOptions.value;
  const current = sceneries.value.find((scenario) => scenario.sceneries_pk === editableEvent.value.sceneries_fk);
  if (current && !options.some((option) => option.sceneries_pk === current.sceneries_pk)) {
    return [decorateScenario(current), ...options];
  }
  return options;
});

const editableScenarioOptions = computed(() => {
  const currentSeason =
    editableEvent.value.seasons_fk ?? selectedEvent.value?.seasons_fk;

  if (currentSeason === 2) {
    return sceneries.value
      .filter((scenario) => [3, 4].includes(scenario.sceneries_pk))
      .map(decorateScenario);
  }

  if (currentSeason === LOCKED_RETAILER_SEASON_PK) {
    return sceneries.value
      .filter((scenario) =>
        RETAILER_ALLOWED_SCENERIES.includes(scenario.sceneries_pk),
      )
      .sort(sortRetailScenarios)
      .map(decorateScenario);
  }

  return sceneries.value.map(decorateScenario);
});

const editableRewardsItems = computed(() => {
  if (!editableEvent.value.rewards_pk) return [];
  return editableEvent.value.rewards_pk
    .map((pk) => allRewards.value.find((r) => r.rewards_pk === pk))
    .filter(Boolean);
});

const createEventReady = computed(
  () =>
    !!newEvent.value.store &&
    !!newEvent.value.season &&
    !!newEvent.value.scenario &&
    !!newEvent.value.date &&
    isValid12HourTime(getFormattedNewEventTime()) &&
    !!newEvent.value.ampm,
);

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

const normalize12HourTime = (value) => {
  if (!value || value.length !== 5 || !value.includes(":")) return;
  let [hh, mm] = value.split(":");
  hh = parseInt(hh);
  mm = parseInt(mm);
  if (isNaN(hh) || hh < 1) hh = 1;
  if (hh > 12) hh = 12;
  if (isNaN(mm)) mm = 0;
  if (mm > 59) mm = 59;
  return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
};

const validateTime = () => {
  editableEvent.value.hour = normalize12HourTime(editableEvent.value.hour);
};

const validateNewEventTime = () => {
  const normalizedHour = String(newEvent.value.hour || "").padStart(2, "0");
  if (hourOptions.includes(normalizedHour)) {
    newEvent.value.hour = normalizedHour;
  }

  if (!minuteOptions.includes(newEvent.value.minute)) {
    newEvent.value.minute = "00";
  }
};

const isValid12HourTime = (value) => /^(0[1-9]|1[0-2]):[0-5][0-9]$/.test(value);

const getFormattedNewEventTime = () =>
  `${String(newEvent.value.hour || "").padStart(2, "0")}:${String(newEvent.value.minute || "00").padStart(2, "0")}`;

const ensureRetailerSeasonLocked = () => {
  if (!newEvent.value.season) {
    newEvent.value.season = 2;
  }
};

const resetCreateEventForm = () => {
  newEvent.value = createDefaultNewEvent();
  selectedRewards.value = [];
  errorDialog.value = {
    show: false,
    message: "",
  };
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

// Share uses the phone's share sheet when there is one, else copies the link.
const shareCopied = ref(false);
const shareSelectedEvent = async () => {
  if (!selectedEvent.value?.events_pk) return;
  const url = `${window.location.origin}/event/${btoa(String(selectedEvent.value.events_pk))}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: selectedEvent.value.store_name, url });
      return;
    } catch {
      // Share sheet closed: fall back to copying.
    }
  }
  await navigator.clipboard?.writeText(url);
  shareCopied.value = true;
  setTimeout(() => (shareCopied.value = false), 2000);
};

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

const addEvent = () => {
  loading.value = true;
  errorDialog.value.show = false;
  successDialog.value = false;

  const userId = userStore.user.users_pk;
  ensureRetailerSeasonLocked();
  validateNewEventTime();

  if (
    !newEvent.value.date ||
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

  const formattedTime = getFormattedNewEventTime();

  if (!isValid12HourTime(formattedTime)) {
    errorDialog.value = {
      show: true,
      message: "Please enter a valid time in HH:MM format.",
    };
    loading.value = false;
    return;
  }

  axios
    .get("/stores/list", {
      params: { users_fk: userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(({ data }) => {
      const allStores = data.stores || [];
      const found = findStoreByNameInList(allStores, newEvent.value.store);

      if (!found) throw new Error("StoreNotFound");
      if (!found.active) throw new Error("StoreInactive");
      if (!found.verified) throw new Error("StoreUnverified");

      return {
        storesFk: found.stores_pk,
        storeAddress: buildStoreAddress(found),
      };
    })
    .then(({ storesFk, storeAddress }) => {
      const date = `${newEvent.value.date}; ${formattedTime} ${newEvent.value.ampm || "AM"}`;

      return axios
        .post("/events/cadastro", null, {
          params: {
            seats_number: 4,
            seasons_fk: newEvent.value.season,
            sceneries_fk: newEvent.value.scenario,
            date,
            stores_fk: storesFk,
            users_fk: userId,
            active: true,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then(({ data }) => ({ data, storeAddress }));
    })
    .then(async ({ data, storeAddress }) => {
      const created = data.event;
      const id = created?.events_pk;

      if (!id) throw new Error("EventCreationFailed");

      lastCreatedEventId.value = id;
      lastCreatedEventFallback.value = {
        ...created,
        events_pk: id,
        store_name: newEvent.value.store,
        address: storeAddress || newEvent.value.address,
        scenario:
          filteredScenarios.value.find(
            (scenario) => scenario.sceneries_pk === newEvent.value.scenario,
          )?.name || "",
      };

      await createInitialTableForEvent(id);

      return Promise.all(
        selectedRewards.value.map((reward) =>
          axios
            .post(
              "/rl_events_rewards/cadastro",
              {
                events_fk: id,
                rewards_fk: reward.rewards_pk,
                active: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              },
            )
            .catch(() => null),
        ),
      ).then(() => id);
    })
    .then(() => {
      createEventDialog.value = false;
      fetchUserCreatedEvents(showPast.value);

      if (tutorialStore.shouldShowInitialSetup) {
        pendingSuccessAfterTutorial.value = true;
        showTutorialPrompt.value = true;
      } else {
        successDialog.value = true;
      }

      resetCreateEventForm();
    })
    .catch((err) => {
      const knownMessages = {
        StoreNotFound:
          "We couldn't find the selected store. Please choose a valid store and try again.",
        StoreInactive:
          "This store is inactive and can't host events right now.",
        StoreUnverified:
          "This store still needs verification before creating events.",
        EventCreationFailed:
          "The event could not be created correctly. Please try again.",
      };

      if (knownMessages[err.message]) {
        errorDialog.value = {
          show: true,
          message: knownMessages[err.message],
        };
        return;
      }

      console.error("Unexpected error:", err);
      errorDialog.value = {
        show: true,
        message:
          err.response?.data?.message ||
          "An error occurred while creating the event.",
      };
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
  if (isBeforeJulyFirst2026()) {
    router.push({ name: "NightsCommunication" });
    return;
  }
  ensureRetailerSeasonLocked();
  createEventDialog.value = true;
};

// "Edit event" in Manage Event: close it and open the edit form.
const editFromManage = (event) => {
  manageDialog.value = false;
  openEditDialog(event, true);
};

const openEditDialog = (event, editable = false) => {
  // Edit the time as the store sees it: the API sends it with the store's
  // offset ("2026-09-29T18:00:00-05:00") and saving treats it as store time,
  // so reading it in the browser's timezone would shift the event.
  const wallClock = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/.exec(event.event_date || "");
  const parsed = wallClock ? null : parseApiDate(event.event_date);
  const hours24 = wallClock ? Number(wallClock[2]) : parsed ? parsed.getHours() : 0;
  const minutes = wallClock ? wallClock[3] : parsed ? String(parsed.getMinutes()).padStart(2, "0") : "00";
  const datePart = wallClock
    ? wallClock[1]
    : parsed
      ? `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`
      : "";
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? "PM" : "AM";

  editableEvent.value = {
    events_pk: event.events_pk,
    date: datePart,
    hour: `${String(hours12).padStart(2, "0")}:${minutes}`,
    ampm,
    seats_number: event.seats_number,
    seasons_fk: event.seasons_fk,
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
      const foundStore = findStoreByNameInList(
        allStores,
        editableEvent.value.store,
      );
      if (!foundStore) {
        console.error(`Store "${editableEvent.value.store}" not found`);
        throw new Error("StoreNotFound");
      }
      return foundStore.stores_pk;
    })
    .then((storesFk) => {
      const seasonsFk =
        editableEvent.value.seasons_fk ??
        selectedEvent.value?.seasons_fk ??
        LOCKED_RETAILER_SEASON_PK;
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

watch(createEventDialog, (isOpen) => {
  if (isOpen) {
    ensureRetailerSeasonLocked();
    return;
  }

  resetCreateEventForm();
});

watch(filteredScenarios, (scenarioOptions) => {
  const hasSelectedScenario = scenarioOptions.some(
    (scenario) => scenario.sceneries_pk === newEvent.value.scenario,
  );

  if (!hasSelectedScenario) {
    newEvent.value.scenario = null;
  }
});

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
    const selectedStore = findStoreByName(selectedStoreName);
    if (selectedStore) {
      newEvent.value.address = buildStoreAddress(selectedStore);
    } else {
      newEvent.value.address = "";
    }
  },
);
watch(
  () => newEvent.value.scenario,
  (newScenarioPk) => {
    if (!newScenarioPk) {
      selectedRewards.value = [];
      return;
    }

    let targetRewardPk = null;
    if (newScenarioPk === 5) targetRewardPk = 5;
    else if (newScenarioPk === 6) targetRewardPk = 6;
    else if (newScenarioPk === 2 || newScenarioPk === 3) targetRewardPk = 2; // Wing 1 Tutorial / Wing 1 Advanced -> Tutorial Completed
    else if (newScenarioPk === 4) targetRewardPk = 3; // Wing 2 Advanced -> Season 1 Completed

    if (targetRewardPk) {
      const rewardObject = allRewards.value.find(
        (r) => r.rewards_pk === targetRewardPk,
      );
      if (rewardObject) {
        selectedRewards.value = [rewardObject];
      }
    }
  },
);

watch(
  () => editableEvent.value.sceneries_fk,
  (newScenarioPk) => {
    const currentSeason =
      editableEvent.value.seasons_fk ?? selectedEvent.value?.seasons_fk;
    if (currentSeason !== 2 && currentSeason !== LOCKED_RETAILER_SEASON_PK) return;

    if (!newScenarioPk) {
      editableEvent.value.rewards_pk = [];
      return;
    }

    let targetRewardPk = null;
    if (newScenarioPk === 5) targetRewardPk = 5;
    else if (newScenarioPk === 6) targetRewardPk = 6;
    else if (newScenarioPk === 2 || newScenarioPk === 3) targetRewardPk = 2; // Wing 1 Tutorial / Wing 1 Advanced -> Tutorial Completed
    else if (newScenarioPk === 4) targetRewardPk = 3; // Wing 2 Advanced -> Season 1 Completed

    if (targetRewardPk) {
      editableEvent.value.rewards_pk = [targetRewardPk];
    }
  },
);
</script>

<style scoped>
.edit-event {
  color: #fff;
  font-family: "Poppins", sans-serif;
}
.edit-event__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 4px 24px;
}
.edit-event__header h2 {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
}
.edit-event__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 24px 24px;
}
.edit-event__label {
  margin-top: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
}
.edit-event__field :deep(.v-field) {
  border-radius: 8px;
  background: #e8e8e8;
  color: #141414;
}
.edit-event__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.edit-event__time {
  display: flex;
  gap: 8px;
}
.edit-event__ampm {
  flex: 0 0 96px;
}
.edit-event__rewards {
  display: flex;
  gap: 10px;
}
.edit-event__confirm {
  height: 52px;
  background: #fff;
  color: #000;
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  transition: background 0.2s ease;
}
.edit-event__confirm:hover {
  background: #e0e0e0;
}
.edit-event__confirm:disabled {
  opacity: 0.6;
}
@media (max-width: 599px) {
  .edit-event__row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
.event-dialog {
  color: #fff;
  font-family: "Poppins", sans-serif;
}
.event-dialog__header {
  position: relative;
  padding: 20px 56px 8px;
  text-align: center;
}
.event-dialog__title {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  text-transform: uppercase;
}
.event-dialog__close {
  position: absolute;
  top: 12px;
  right: 12px;
}
.event-dialog__share {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 56px;
  background: #1e88e5;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  text-transform: uppercase;
}
.events-panel {
  background: #0d0d0d !important;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}
.events-title {
  padding: 48px 0 24px;
}
.events-tabs,
.events-sort {
  display: grid;
  align-items: center;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
}
.events-tabs {
  grid-template-columns: repeat(2, 1fr);
  background: #4a4a4a;
  min-height: 44px;
}
.events-sort {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 24px;
  padding: 4px 16px;
  background: #2b2b2b;
  min-height: 36px;
  font-size: 0.8rem;
}
.events-sort__group {
  display: flex;
  align-items: center;
  gap: 16px;
}
.events-sort__label {
  text-transform: none;
}
.events-tabs__item,
.events-sort__item,
.events-sort__clear {
  justify-self: center;
  padding: 6px 4px 2px;
  border-bottom: 2px solid transparent;
  text-transform: uppercase;
  white-space: nowrap;
}
.events-tabs__item {
  font-size: 1rem;
}
.events-sort__item.active {
  border-bottom-color: #fff;
}
/* Selected tab is light (theme "terciary"); the other one is dimmed. */
.events-tabs {
  padding: 0;
}
.events-tabs__item {
  justify-self: stretch;
  align-self: stretch;
  padding: 12px 4px;
  border-bottom: 0;
  opacity: 0.45;
  transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}
.events-tabs__item:hover {
  opacity: 0.7;
}
.events-tabs__item.active {
  background: rgb(var(--v-theme-terciary));
  color: rgb(var(--v-theme-on-terciary));
  opacity: 1;
}
.events-sort__clear {
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: none;
}
.events-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 16px 12px;
}
@media (max-width: 959px) {
  /* The mobile app bar overlays the page, so leave room for it. */
  .events-title {
    padding: calc(84px + env(safe-area-inset-top, 0px)) 0 16px;
    font-size: 2.75rem !important;
    line-height: 1.1;
  }
  .events-sort {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 10px 12px;
  }
  .events-sort__group {
    gap: 6px;
  }
  .events-sort__label {
    flex: 0 0 64px;
    justify-self: auto;
    padding: 0;
    border: 0;
    font-size: 0.72rem;
  }
  .events-sort__item {
    flex: 1;
    justify-self: auto;
    padding: 6px 4px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
    font-size: 0.68rem;
    text-align: center;
  }
  .events-sort__item.active {
    background: #fff;
    border-color: #fff;
    color: #000;
  }
  .events-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .events-tabs__item {
    font-size: 0.85rem;
  }
  .events-sort {
    font-size: 0.7rem;
  }
}

/* Small "Manage" pill on the retailer's own event cards. */
.events-manage-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: rgb(var(--v-theme-primary));
  border-radius: 999px;
  color: rgb(var(--v-theme-on-primary));
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}
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

.create-event-shell {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #121212;
}

.create-event-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 14px 6px 18px;
  position: sticky;
  top: 0;
  z-index: 12;
  background: #121212;
}

.create-event-header h2 {
  flex: 1;
  min-width: 0;
  line-height: 1.15;
}

.create-event-panel {
  height: 100%;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.create-event-panel--compact {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  backdrop-filter: none;
}

.create-event-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.select-short-value {
  display: block;
  max-width: 100%;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date-input {
  width: 100%;
}

.time-input {
  width: 100%;
}

.hour-input {
  max-width: 110px;
  margin-left: 10px;
}

.launch-btn {
  min-width: 220px;
  min-height: 48px;
  font-weight: 800;
  letter-spacing: 0.08em;
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
  flex-shrink: 0;
  z-index: 13;
  color: white;
  width: 40px !important;
  height: 40px !important;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.24);
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.04);
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.24);
}

.create-event-body {
  padding: 6px 18px 18px !important;
}

.redbutton {
  background: #691d1d;
  width: 60px;
}

.editbutton {
  background: gray;
  width: 60px;
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
  .create-event-header {
    padding: 12px 12px 4px 16px;
  }

  .create-event-header h2 {
    font-size: 1.05rem !important;
  }

  .create-event-body {
    padding: 6px 16px 16px !important;
  }

  .create-event-actions {
    justify-content: stretch;
  }

  .create-event-actions .v-btn {
    width: 100%;
  }

  .event-card {
    margin-right: 0 !important;
  }
}
</style>
