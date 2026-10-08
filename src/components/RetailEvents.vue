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
            <EventListCard
              v-for="event in sortedMyEvents"
              :key="event.events_pk"
              :event="event"
              :timezone="userTimezone"
              @open="openManageDialog(event)"
            >
              <template #status>
                <span class="events-manage-hint">Manage <v-icon size="16">mdi-chevron-right</v-icon></span>
              </template>
            </EventListCard>
            <CreateEventCard @create="openCreateEventDialog" />
          </div>
        </div>
      </div>

      <v-dialog v-model="dialog" max-width="560" scrollable>
        <v-card class="event-dialog" color="surface">
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
    </v-card>
  </v-col>

  <EventFormDialog v-model="eventFormDialog" :event="eventFormEvent" @saved="onEventFormSaved" />

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
import EventFormDialog from "@/components/dialogs/EventFormDialog.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import {
  extractMonth,
  extractDay,
  extractTime,
  formatEventDate,
} from "@/utils/dateHelpers";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const tutorialStore = useTutorialStore();
const axios = inject("axios");
const showTutorialPrompt = ref(false);
const dialog = ref(false);
const manageDialog = ref(false);
const selectedEvent = ref(null);
const activeTab = ref(1);
const sortBy = ref("date");
const events = ref([]);
const userCreatedEvents = ref([]);
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
const manageDialogRef = ref(null);
const lastCreatedEventId = ref(null);
const pendingSuccessAfterTutorial = ref(false);
const openingManageDialog = ref(false);

const getSeasonInfo = (fk) => {
  if (fk == 2) return { flag: s1flag, name: "Season 1" };
  if (fk == 3) return { flag: s2flag, name: "Season 2" };
  return { flag: null, name: "" };
};

const userTimezone = computed(
  () => userStore.user?.timezone?.iana_name ?? "America/Chicago",
);

const isBeforeJulyFirst2026 = () => {
  return false;
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

const openManageDialog = (event) => {
  selectedEvent.value = event;
  manageDialog.value = true;
};

const handleRefresh = () => {
  fetchUserCreatedEvents(showPast.value);
  fetchPlayerEvents(showPast.value);
};

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
  eventFormEvent.value = null;
  eventFormDialog.value = true;
};

// Create and edit share one form: wing, date and time only.
const eventFormDialog = ref(false);
const eventFormEvent = ref(null);
const openEventForm = (event) => {
  eventFormEvent.value = event;
  eventFormDialog.value = true;
};
const onEventFormSaved = async (eventPk) => {
  fetchPlayerEvents(showPast.value);
  if (eventFormEvent.value) {
    fetchUserCreatedEvents(showPast.value);
    return;
  }
  lastCreatedEventId.value = eventPk;
  if (tutorialStore.shouldShowInitialSetup) {
    pendingSuccessAfterTutorial.value = true;
    showTutorialPrompt.value = true;
  } else {
    successDialog.value = true;
  }
};

// "Edit event" in Manage Event: close it and open the edit form.
const editFromManage = (event) => {
  manageDialog.value = false;
  openEventForm(event);
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

  await fetchPlayerEvents(showPast.value);
  await fetchUserCreatedEvents(showPast.value);

  // "Edit event" from the dashboard lands here with ?edit=<events_pk>.
  if (route.query.edit) {
    const eventToEdit = userCreatedEvents.value.find((e) => String(e.events_pk) === String(route.query.edit));
    activeTab.value = 2;
    router.replace({ query: null });
    if (eventToEdit) openEventForm(eventToEdit);
  }

  eventsInterval.value = setInterval(() => {
    if (activeTab.value === 1) {
      fetchPlayerEvents(showPast.value, true);
    } else {
      fetchUserCreatedEvents(showPast.value, true);
    }
  }, 5000);
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

</script>

<style scoped>
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
.events-sort__item {
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

/* "Manage" on the retailer's own events: outlined, filled when the card is hovered. */
.events-manage-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px 3px 10px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 999px;
  color: #141414;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.events-grid :deep(.event-list-card:hover) .events-manage-hint {
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
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

.list-container {
  min-height: 400px;
}

.cinzel-text {
  font-family: "Cinzel", serif;
}
</style>
