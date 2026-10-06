<template>
  <v-card color="primary" class="home-feed fill-height d-flex flex-column w-100">
    <div class="home-scroll">
      <div v-if="loading" class="home-loading"><v-progress-circular indeterminate /></div>

      <template v-else>
        <!-- Continue: the last campaign, whatever box it is. -->
        <section class="home-section">
          <h3 class="home-label">Continue</h3>
          <button v-if="recentCampaign" class="continue-card" @click="resumeRecentCampaign">
            <img :src="getCampaignBanner(recentCampaign.campaign) || ''" alt="" class="continue-card__art" />
            <span class="continue-card__body">
              <span class="continue-card__text">
                <strong>{{ recentCampaign.name }}</strong>
                <small v-if="recentCampaign.wing || recentCampaign.door">
                  {{ [recentCampaign.wing, recentCampaign.door].filter(Boolean).join(" · ") }}
                </small>
              </span>
              <span class="continue-card__party">
                <template v-if="!isUnderkeep">
                  <v-avatar v-for="(hero, idx) in recentCampaignHeroes.slice(0, 4)" :key="idx" size="26">
                    <v-img :src="hero.images.avatar" cover />
                  </v-avatar>
                </template>
                <template v-else>
                  <v-avatar v-for="(player, idx) in recentCampaignPlayers.slice(0, 4)" :key="idx" size="26" color="grey-darken-3">
                    <v-img v-if="player.avatar" :src="player.avatar" cover />
                    <span v-else class="text-caption font-weight-bold">{{ (player.name || "P")[0].toUpperCase() }}</span>
                  </v-avatar>
                </template>
                <v-icon class="continue-card__go">mdi-play-circle</v-icon>
              </span>
            </span>
          </button>
          <button v-else class="continue-card continue-card--empty" @click="router.push('/campaign-tracker/')">
            <v-icon size="28">mdi-sword-cross</v-icon>
            <span class="continue-card__text">
              <strong>Start your first adventure</strong>
              <small>Tap Play to join a Drunagor Night, or open your campaigns.</small>
            </span>
          </button>
        </section>

        <!-- The next event you signed up for. -->
        <section v-if="myEventsPreview.length" class="home-section">
          <h3 class="home-label">Your next event</h3>
          <div class="next-event">
            <button class="next-event__info" @click="openMyEventsDialog(myEventsPreview[0])">
              <span class="date-chip">
                <small>{{ extractMonth(myEventsPreview[0].event_date, userTimezone) }}</small>
                <strong>{{ extractDay(myEventsPreview[0].event_date, userTimezone) }}</strong>
              </span>
              <span class="event-text">
                <strong>{{ myEventsPreview[0].store_name }}</strong>
                <small>{{ extractTime(myEventsPreview[0].event_date, userTimezone) }} · {{ myEventsPreview[0].scenario }}</small>
                <small class="event-status">
                  <v-icon size="14" :color="getEventStatusInfo(myEventsPreview[0].status).color">{{ getEventStatusInfo(myEventsPreview[0].status).icon }}</v-icon>
                  {{ myEventsPreview[0].status }}
                </small>
              </span>
            </button>
            <button class="next-event__join" @click="showJoinTable = true">
              <v-icon size="20">mdi-qrcode-scan</v-icon> Join table
            </button>
          </div>
        </section>

        <!-- Everything else the app does. -->
        <section class="home-section">
          <div class="shortcuts">
            <button v-for="item in shortcuts" :key="item.label" class="shortcut" @click="router.push(item.to)">
              <v-icon size="24">{{ item.icon }}</v-icon>
              <span>{{ item.label }}</span>
            </button>
          </div>
        </section>

        <!-- Events near you -->
        <section class="home-section">
          <div class="home-label-row">
            <h3 class="home-label">Events near you</h3>
            <button class="home-link" @click="goToEvents">See all</button>
          </div>
          <div v-if="nearbyEvents.length" class="event-list">
            <button v-for="event in nearbyEvents" :key="event.events_pk" class="event-row" @click="openDialog(event)">
              <span class="date-chip">
                <small>{{ extractMonth(event.event_date, userTimezone) }}</small>
                <strong>{{ extractDay(event.event_date, userTimezone) }}</strong>
              </span>
              <span class="event-text">
                <strong>{{ event.store_name }}</strong>
                <small>{{ extractTime(event.event_date, userTimezone) }} · {{ event.scenario }}</small>
                <small class="event-text__muted">{{ event.address }}</small>
              </span>
              <img v-if="getSeasonInfo(event.seasons_fk).flag" :src="getSeasonInfo(event.seasons_fk).flag || undefined" alt="" class="event-row__flag" />
            </button>
          </div>
          <p v-else class="home-empty">No upcoming events right now.</p>
        </section>
      </template>
    </div>

    <v-dialog v-model="dialog" max-width="600">
      <v-card color="surface" style="position: relative">
        <div v-if="dialogLoading" class="dialog-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>
        <v-card-actions class="d-flex justify-left"
          ><v-btn color="red" @click="dialog = false">X</v-btn></v-card-actions
        >
        <v-card-text>
          <v-btn
            block
            color="blue"
            size="small"
            variant="flat"
            class="mb-4"
            @click="shareEvent(selectedEvent?.events_pk)"
          >
            <v-icon start>mdi-share-variant</v-icon>
            Share Event
          </v-btn>
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
            Scheduled for:
            {{ formatEventDate(selectedEvent?.event_date, userTimezone) }}
          </p>
        </v-card-text>
        <v-card
          color="primary"
          min-height="130px"
          class="mx-4 event-card-dialog"
          @click="openInGoogleMaps"
        >
          <v-row no-gutters>
            <v-col cols="3" lg="3"
              ><v-img
                :src="
                  selectedEvent?.picture_hash
                    ? `https://assets.drunagor.app/${selectedEvent.picture_hash}`
                    : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'
                "
                class="event-img"
            /></v-col>
            <v-col cols="9" class="pa-2">
              <h3 class="text-subtitle-1 font-weight-bold">
                {{ selectedEvent?.store_name }}
              </h3>
              <p class="text-caption">
                <v-icon color="red">mdi-map-marker</v-icon>
                {{ selectedEvent?.address }}
              </p>
            </v-col>
          </v-row>
        </v-card>
        <v-card color="primary" class="mx-4 mt-4 event-card">
          <v-responsive style="width: 100%; height: 200px" aspect-ratio="16/9">
            <iframe
              v-if="selectedEvent?.latitude"
              :src="`https://maps.google.com/maps?q=${selectedEvent.latitude},${selectedEvent.longitude}&z=15&output=embed`"
              frameborder="0"
              style="border: 0; width: 100%; height: 100%"
              allowfullscreen
              loading="lazy"
            />
          </v-responsive>
        </v-card>
        <v-card-text v-if="eventRewards.length">
          <h3 class="text-h6 font-weight-bold">REWARDS:</h3>
          <v-row
            v-for="reward in eventRewards"
            :key="reward.rewards_pk"
            class="align-center my-2"
          >
            <v-col cols="3" md="2"
              ><v-avatar size="60"
                ><v-img
                  :src="`https://assets.drunagor.app/${reward.picture_hash}`" /></v-avatar
            ></v-col>
            <v-col cols="9" md="10">
              <h4 class="text-subtitle-1 font-weight-bold">
                {{ reward.name }}
              </h4>
              <p class="text-body-2">{{ reward.description }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <BaseAlert
          v-model="showAlert"
          :type="alertType"
          class="mt-4 mx-4"
          border="start"
          variant="tonal"
          closable
        >
          <span v-html="alertMessage"></span>
        </BaseAlert>
        <v-row class="mt-2 ml-0"
          ><v-col cols="12" class="mb-2"
            ><v-btn block color="#539041" class="rounded-0" @click="joinEvent"
              >Count me in</v-btn
            ></v-col
          ></v-row
        >
        <v-dialog v-model="showDialog" width="400">
          <v-card style="position: relative">
            <v-card-title class="text-h6">Share Event</v-card-title>
            <v-card-text
              ><v-text-field
                v-model="sharedLink"
                label="Event Link"
                readonly
                density="compact"
                hide-details
            /></v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="success" size="small" @click="copyLink(sharedLink)"
                >Copy Link</v-btn
              >
              <v-btn color="grey" size="small" @click="showDialog = false"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-dialog>

    <v-dialog v-model="myDialog" max-width="700">
      <v-card color="surface" class="pa-6" style="position: relative">
        <div v-if="dialogLoading" class="dialog-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>
        <div class="d-flex align-center justify-space-between pl-8">
          <v-card-title class="text-h6 font-weight-bold pa-0">{{
            selectedMyEvent?.store_name
          }}</v-card-title>
          <v-icon
            color="red"
            @click="myDialog = false"
            class="mr-2"
            style="cursor: pointer"
            >mdi-close</v-icon
          >
        </div>
        <div class="mt-1 pl-6" style="display: inline-block">
          <p class="text-caption scheduled-box ma-0">
            Scheduled for:
            {{ formatEventDate(selectedMyEvent?.event_date, userTimezone) }}
          </p>
        </div>
        <v-row>
          <v-col cols="12" class="text-center px-5">
            <v-row>
              <v-col cols="12" class="d-flex align-center justify-center mb-2">
                <p class="text-subtitle-2 font-weight-medium my-0 mr-2">
                  Status: {{ currentPlayer?.event_status }}
                </p>
                <v-btn
                  icon="mdi-refresh"
                  variant="text"
                  size="small"
                  :loading="isRefreshingStatus"
                  @click="refreshEventStatus()"
                />
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-btn class="mb-4" block color="green" prepend-icon="mdi-qrcode-scan" @click="showJoinTable = true"
                  >Join table</v-btn
                >
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-btn class="mb-8" block color="red" @click="quitEvent()"
                  >Quit Event</v-btn
                >
              </v-col>
            </v-row>
            <BaseAlert
              v-model="showQuitSuccessAlert"
              type="success"
              title="Success"
              class="mb-4"
              variant="tonal"
              closable
              >You have successfully left the event.</BaseAlert
            >
            <BaseAlert
              v-model="showQuitErrorAlert"
              type="error"
              title="Failed to Leave Event"
              class="mb-4"
              variant="tonal"
              closable
              >{{ quitErrorMessage }}</BaseAlert
            >
          </v-col>
        </v-row>
        <v-card
          color="primary"
          min-height="130px"
          class="mx-4 event-card-dialog"
          @click="openInGoogleMaps"
        >
          <v-row no-gutters>
            <v-col cols="3" lg="3"
              ><v-img
                :src="
                  selectedMyEvent?.picture_hash
                    ? `https://assets.drunagor.app/${selectedMyEvent.picture_hash}`
                    : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'
                "
                class="event-img"
            /></v-col>
            <v-col cols="9" class="pa-2">
              <h3 class="text-subtitle-1 font-weight-bold">
                {{ selectedMyEvent?.store_name }}
              </h3>
              <p class="text-caption">
                <v-icon color="red">mdi-map-marker</v-icon>
                {{ selectedMyEvent?.address }}
              </p>
            </v-col>
          </v-row>
        </v-card>
        <v-card color="primary" class="mx-4 mt-4 event-card">
          <v-responsive style="width: 100%; height: 200px" aspect-ratio="16/9">
            <iframe
              v-if="selectedMyEvent?.latitude"
              :src="`https://maps.google.com/maps?q=${selectedMyEvent.latitude},${selectedMyEvent.longitude}&z=15&output=embed`"
              frameborder="0"
              style="border: 0; width: 100%; height: 100%"
              allowfullscreen
              loading="lazy"
            />
          </v-responsive>
        </v-card>
        <v-card-text v-if="eventRewards.length">
          <h3 class="text-h6 font-weight-bold">REWARDS:</h3>
          <v-row
            v-for="(reward, index) in eventRewards"
            :key="index"
            class="align-center my-2"
          >
            <v-col cols="3" md="2"
              ><v-avatar size="60"
                ><v-img
                  :src="`https://assets.drunagor.app/${reward.picture_hash}`" /></v-avatar
            ></v-col>
            <v-col cols="9" md="10">
              <h4 class="text-subtitle-1 font-weight-bold">
                {{ reward.name }}
              </h4>
              <p class="text-body-2">{{ reward.description }}</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showQuitConfirmDialog" max-width="400">
      <v-card style="position: relative">
        <div v-if="dialogLoading" class="dialog-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>
        <v-card-title class="text-h6">Confirm Exit</v-card-title>
        <v-card-text
          >Are you sure you want to quit this event? This action cannot be
          undone.</v-card-text
        >
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text @click="showQuitConfirmDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="red-darken-2" text @click="confirmQuitEvent"
            >Quit Event</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showCampaignDialog" max-width="320" persistent />
    <!-- Join table: scan the QR Code or type the table code. -->
    <HUB v-model="showJoinTable" />
  </v-card>
</template>

<script setup lang="ts">
import HUB from "@/components/HUB.vue";
import { ref, computed, onMounted, inject, watch } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import genconLogo from "@/assets/cgsblue.png";

const router = useRouter();
const userStore = useUserStore();
const axios: any = inject("axios");

const activeTab = ref<"upcoming" | "myevents">("upcoming");
const loading = ref(true);
const dialogLoading = ref(false);
const allEvents = ref<any[]>([]);
const myEvents = ref<any[]>([]);
const playerFk = ref<string | null>(null);
const players = ref<any[]>([]);

const dialog = ref(false);
const selectedEvent = ref<any>(null);
const eventRewards = ref<any[]>([]);
const showAlert = ref(false);
const alertType = ref<"success" | "error" | "info" | "warning">("success");
const alertMessage = ref("");
const showDialog = ref(false);
const sharedLink = ref("");

const myDialog = ref(false);
const selectedMyEvent = ref<any>(null);
const showQuitConfirmDialog = ref(false);
const rlEventsUsersPkToQuit = ref<any>(null);
const isRefreshingStatus = ref(false);
const showQuitSuccessAlert = ref(false);
const showQuitErrorAlert = ref(false);
const quitErrorMessage = ref("");
const showCampaignDialog = ref(false);
const showJoinTable = ref(false);
const showPlaytestDialog = ref(false);

const isGenConActive = computed(() => false);

import {
  extractMonth,
  extractDay,
  extractTime,
  formatEventDate,
} from "@/utils/dateHelpers";

const userTimezone = computed(() => userStore.userIanaTimezone());

const filterAndSortUpcoming = (eventList: any[]) => {
  const now = new Date();
  return eventList
    .filter((e) => new Date(e.event_date) > now)
    .sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
    );
};

const upcomingEventsPreview = computed(() => {
  if (!allEvents.value || allEvents.value.length === 0) return [];
  const filtered = filterAndSortUpcoming(allEvents.value);
  return filtered.length > 0 ? filtered : allEvents.value;
});
const myEventsPreview = computed(() => {
  if (!myEvents.value || myEvents.value.length === 0) return [];
  const filtered = filterAndSortUpcoming(myEvents.value);
  return filtered.length > 0 ? filtered : myEvents.value;
});


const currentPlayer = computed(() => {
  if (!userStore.user?.users_pk) return null;
  return (
    players.value.find((p) => p.users_pk === userStore.user.users_pk) || null
  );
});

const goToEvents = () => router.push({ name: "Events" });

// Home shortcuts: the app is more than Drunagor Nights.
const shortcuts = [
  { label: "Campaigns", icon: "mdi-book-open-page-variant", to: "/campaign-tracker/" },
  { label: "Library", icon: "mdi-bookshelf", to: "/library" },
  { label: "Keywords", icon: "mdi-book-search-outline", to: "/campaign-tracker/keyword" },
  { label: "Events", icon: "mdi-calendar-star", to: "/events" },
];

// Events near you, without the ones you already joined.
const nearbyEvents = computed(() => {
  const joined = new Set(myEvents.value.map((event: any) => event.events_pk));
  return upcomingEventsPreview.value.filter((event: any) => !joined.has(event.events_pk)).slice(0, 4);
});

const openInGoogleMaps = () => {
  const event = dialog.value ? selectedEvent.value : selectedMyEvent.value;
  if (!event?.store_name || event.latitude == null || event.longitude == null)
    return;
  const lat = event.latitude;
  const lng = event.longitude;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  window.open(mapsUrl, "_blank");
};

const shareEvent = (eventId: any) => {
  Promise.resolve(eventId)
    .then((id) => {
      if (!id) throw new Error("Event ID not found!");
      return btoa(id.toString());
    })
    .then((encoded) => {
      sharedLink.value = `${window.location.origin}/event/${encoded}`;
      showDialog.value = true;
    })
    .catch(() => {});
};

const copyLink = (link: string) => {
  navigator.clipboard
    .writeText(link)
    .then(() => {
      showDialog.value = false;
    })
    .catch(() => {});
};

const getSeasonInfo = (fk: number) => {
  if (fk == 2) return { flag: s1flag, name: "Season 1" };
  if (fk == 3) return { flag: s2flag, name: "Season 2" };
  return { flag: null, name: "" };
};

const fetchAllEvents = async () => {
  try {
    const params: any = { past_events: "false" };
    if (playerFk.value) params.player_fk = playerFk.value;
    const response = await axios.get("/events/list_events/", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const eventsData = response.data.events || [];
    const eventsWithRewards = await Promise.all(
      eventsData.map(async (event: any) => {
        try {
          const rewardsRes = await axios.get("/rl_events_rewards/list_rewards", {
            params: { events_fk: event.events_pk },
          });
          return {
            ...event,
            rewards: (rewardsRes.data.rewards || []).map((r: any) => ({
              ...r,
              image: `https://assets.drunagor.app/${r.picture_hash}`,
            })),
          };
        } catch (e) {
          return { ...event, rewards: [] };
        }
      })
    );
    allEvents.value = eventsWithRewards;
  } catch (err) {
    console.error("Error in fetchAllEvents:", err);
    allEvents.value = [];
  }
};

const fetchMyEvents = async () => {
  try {
    const params: any = { past_events: "false" };
    if (playerFk.value) params.player_fk = playerFk.value;
    const response = await axios.get("/events/my_events/player", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const eventsData = response.data.events || [];
    const eventsWithRewards = await Promise.all(
      eventsData.map(async (event: any) => {
        try {
          const rewardsRes = await axios.get("/rl_events_rewards/list_rewards", {
            params: { events_fk: event.events_pk },
          });
          return {
            ...event,
            rewards: (rewardsRes.data.rewards || []).map((r: any) => ({
              ...r,
              image: `https://assets.drunagor.app/${r.picture_hash}`,
            })),
          };
        } catch (e) {
          return { ...event, rewards: [] };
        }
      })
    );
    myEvents.value = eventsWithRewards;
  } catch (err) {
    console.error("Error in fetchMyEvents:", err);
    myEvents.value = [];
  }
};

const fetchPlayers = async (eventPk: any) => {
  try {
    const response = await axios.get("/rl_events_users/list_players", {
      params: { events_fk: eventPk },
    });
    players.value = response.data.players;
  } catch {
    players.value = [];
  }
};

const fetchEventRewards = async (eventPk: any) => {
  try {
    const rewardsRes = await axios.get("/rl_events_rewards/list_rewards", {
      params: { events_fk: eventPk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    eventRewards.value = rewardsRes.data.rewards || [];
  } catch {
    eventRewards.value = [];
  }
};

const openDialog = async (event: any) => {
  selectedEvent.value = event;
  dialog.value = true;
  dialogLoading.value = true;
  showAlert.value = false;
  await fetchEventRewards(event.events_pk);
  dialogLoading.value = false;
};

const openMyEventsDialog = async (event: any) => {
  selectedMyEvent.value = event;
  myDialog.value = true;
  dialogLoading.value = true;
  showQuitSuccessAlert.value = false;
  showQuitErrorAlert.value = false;
  await Promise.all([
    fetchEventRewards(event.events_pk),
    fetchPlayers(event.events_pk),
  ]);
  const currentUserEntry = players.value.find(
    (p) => p.users_pk === userStore.user?.users_pk,
  );
  rlEventsUsersPkToQuit.value = currentUserEntry
    ? currentUserEntry.rl_events_users_pk
    : null;
  dialogLoading.value = false;
};

const joinEvent = async () => {
  showAlert.value = false;
  dialogLoading.value = true;
  try {
    await axios.post(
      "/rl_events_users/cadastro",
      {
        users_fk: userStore.user.users_pk,
        events_fk: selectedEvent.value.events_pk,
        status: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    alertType.value = "success";
    alertMessage.value =
      "You’ve successfully joined this event! Redirecting...";
    showAlert.value = true;
    await fetchMyEvents();
    setTimeout(() => {
      dialog.value = false;
      activeTab.value = "myevents";
    }, 2000);
  } catch (error: any) {
    alertType.value = "error";
    alertMessage.value = error.response?.data?.message || "An error occurred.";
    showAlert.value = true;
  } finally {
    dialogLoading.value = false;
  }
};

const refreshEventStatus = async () => {
  if (!selectedMyEvent.value) return;
  isRefreshingStatus.value = true;
  await fetchPlayers(selectedMyEvent.value.events_pk);
  isRefreshingStatus.value = false;
};

const quitEvent = () => {
  if (rlEventsUsersPkToQuit.value) {
    showQuitConfirmDialog.value = true;
  } else {
    quitErrorMessage.value = "Cannot quit event. Relationship ID not found.";
    showQuitErrorAlert.value = true;
  }
};

const confirmQuitEvent = async () => {
  showQuitConfirmDialog.value = false;
  dialogLoading.value = true;
  try {
    await axios.delete(
      `/rl_events_users/${rlEventsUsersPkToQuit.value}/delete/`,
      {
        data: { status: 3 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    showQuitSuccessAlert.value = true;
    await fetchMyEvents();
    setTimeout(() => {
      myDialog.value = false;
    }, 2000);
  } catch {
    quitErrorMessage.value = "An unexpected error occurred. Please try again.";
    showQuitErrorAlert.value = true;
  } finally {
    dialogLoading.value = false;
  }
};

const getEventStatusInfo = (status: string) => {
  const statuses: any = {
    "Seeks Entry": {
      icon: "mdi-timer-sand",
      color: "orange",
      tooltip: "Waiting for acceptance.",
    },
    "Granted Passage": {
      icon: "mdi-check-circle",
      color: "success",
      tooltip: "Entry accepted.",
    },
    "Turned Away": {
      icon: "mdi-cancel",
      color: "error",
      tooltip: "Entry refused or you left.",
    },
    "Joined the Quest": {
      icon: "mdi-sword",
      color: "purple",
      tooltip: "Campaign available.",
    },
  };
  return (
    statuses[status] || {
      icon: "mdi-help-circle",
      color: "grey",
      tooltip: "Unknown status.",
    }
  );
};

watch(activeTab, (val) => {
  if (val === "myevents") {
    dialog.value = false;
    selectedEvent.value = null;
  } else {
    myDialog.value = false;
    selectedMyEvent.value = null;
  }
});

import UnderkeepBanner from "@/assets/underkeep.png";
import Underkeep2Banner from "@/assets/underkeep2.png";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";

const heroRepo = new HeroDataRepository();
const recentCampaign = ref<any | null>(null);
const recentCampaignHeroes = ref<any[]>([]);
const recentCampaignPlayers = ref<any[]>([]);

const isUnderkeep = computed(() => {
  if (!recentCampaign.value) return false;
  const camp = (recentCampaign.value.campaign || "").toLowerCase();
  return camp === "underkeep" || camp === "underkeep2";
});

const getCampaignBanner = (campType: string) => {
  if (campType === 'core') return "https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp";
  if (campType === 'apocalypse') return "https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp";
  if (campType === 'awakenings') return "https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp";
  if (campType === 'underkeep2') return Underkeep2Banner;
  return UnderkeepBanner;
};

const resumeRecentCampaign = () => {
  if (!recentCampaign.value) return;
  router.push({ name: "Campaign", params: { id: recentCampaign.value.campaignId } });
};

const loadRecentCampaign = async () => {
  if (!userStore.user?.users_pk) {
    userStore.restoreFromStorage();
  }
  let userId: number | string | null = userStore.user?.users_pk;
  if (!userId) {
    const pkStr = localStorage.getItem("users_pk");
    if (pkStr) userId = Number(pkStr);
  }
  if (!userId) {
    const rawUser = localStorage.getItem("app_user");
    if (rawUser) {
      try {
        userId = JSON.parse(rawUser).users_pk;
      } catch (e) {}
    }
  }

  if (!userId) return;

  try {
    let legacyCampaigns: any[] = [];
    try {
      const resLegacy = await axios.get("/rl_campaigns_users/search", {
        params: { users_fk: userId, show_season2: false, _t: Date.now() },
      });
      legacyCampaigns = resLegacy.data?.campaigns || [];
    } catch (e) {}

    let s2Campaigns: any[] = [];
    try {
      const resS2 = await axios.get("/rl_campaigns_users/search", {
        params: { users_fk: userId, show_season2: true, _t: Date.now() },
      });
      s2Campaigns = resS2.data?.campaigns || [];
    } catch (e) {}

    const allCampaignsRaw = [...legacyCampaigns, ...s2Campaigns];
    if (allCampaignsRaw.length === 0) {
      recentCampaign.value = null;
      recentCampaignHeroes.value = [];
      recentCampaignPlayers.value = [];
      return;
    }

    const campaignsWithDates = allCampaignsRaw.map((c: any) => {
      let mtime = 0;
      let parsedHash: any = null;
      if (c.tracker_hash) {
        try {
          parsedHash = JSON.parse(atob(c.tracker_hash));
          if (parsedHash.savedAt) mtime = new Date(parsedHash.savedAt).getTime();
        } catch (e) {}
      }
      if (c.start_date) {
        const startTime = new Date(c.start_date).getTime();
        if (startTime > mtime) mtime = startTime;
      }
      return { raw: c, mtime, parsedHash };
    });

    campaignsWithDates.sort((a, b) => b.mtime - a.mtime);
    const mostRecent = campaignsWithDates[0];
    const rawCamp = mostRecent.raw;
    const parsed = mostRecent.parsedHash;

    if (parsed && parsed.campaignData) {
      const campData = parsed.campaignData;
      campData.campaignId = String(rawCamp.campaigns_fk);
      campData.name = rawCamp.party_name || campData.name || "Unnamed Campaign";
      recentCampaign.value = campData;
    } else {
      recentCampaign.value = {
        campaignId: String(rawCamp.campaigns_fk),
        name: rawCamp.party_name || "Unnamed Campaign",
        campaign: rawCamp.box === 38 ? "underkeep" : rawCamp.box === 39 ? "underkeep2" : "core"
      };
    }

    if (isUnderkeep.value) {
      // Fetch PLAYERS for Underkeep
      try {
        const resP = await axios.get("/rl_campaigns_users/search", {
          params: { campaigns_fk: rawCamp.campaigns_fk },
        });
        const playerList = resP.data?.Users || resP.data?.campaigns || [];
        recentCampaignPlayers.value = playerList.map((p: any) => ({
          name: p.user_name || p.name || "Player",
          avatar: p.avatar_url || p.profile_image || null,
        }));
      } catch (e) {}
    } else {
      // Resolve HEROES for Core / Apocalypse / Awakenings
      let avatars: any[] = [];
      if (recentCampaign.value?.heroes && Array.isArray(recentCampaign.value.heroes)) {
        avatars = recentCampaign.value.heroes
          .map((h: any) => heroRepo.find(h.heroId || h.id || h.playable_heroes_fk))
          .filter((h: any) => !!h && h.images?.avatar);
      }

      if (avatars.length === 0 && rawCamp.campaigns_fk) {
        try {
          const resPlayers = await axios.get("/rl_campaigns_users/search_players", {
            params: { campaigns_fk: rawCamp.campaigns_fk },
          });
          const playerList = resPlayers.data?.players || [];
          avatars = playerList
            .map((p: any) => heroRepo.find(p.playable_heroes_fk || p.hero_fk || p.heroId))
            .filter((h: any) => !!h && h.images?.avatar);
        } catch (e) {}
      }

      recentCampaignHeroes.value = avatars;
    }
  } catch (err) {
    console.error("Error loading recent campaign in DashboardEvents:", err);
  }
};

const initDashboardData = async () => {
  if (!userStore.user?.users_pk) {
    userStore.restoreFromStorage();
  }
  let pk: any = userStore.user?.users_pk;
  if (!pk) pk = localStorage.getItem("users_pk");
  if (!pk) {
    const raw = localStorage.getItem("app_user");
    if (raw) {
      try { pk = JSON.parse(raw).users_pk; } catch (e) {}
    }
  }
  playerFk.value = pk ? String(pk) : null;

  loading.value = true;
  await Promise.all([fetchAllEvents(), fetchMyEvents(), loadRecentCampaign()]);
  loading.value = false;
};

watch(
  () => userStore.user?.users_pk,
  (newPk) => {
    if (newPk) {
      initDashboardData();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await initDashboardData();
});
</script>

<style scoped>
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
.cinzel-text {
  font-family: "Cinzel", serif;
}
.scheduled-box {
  display: inline-block;
  background-color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
.event-card-dialog .event-img {
  width: 110px;
  height: 110px;
  border-radius: 4px;
}
.season-flag {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 50px;
  height: 50px;
  z-index: 2;
  border-bottom-left-radius: 8px;
}
.content-scroll {
  padding-bottom: 12px;
}
.see-all-btn {
  padding: 16px 18px;
}

/* Player home feed */
.home-feed {
  background: transparent !important;
  box-shadow: none !important;
}
.home-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 2px 16px;
  font-family: "Poppins", sans-serif;
}
.home-loading {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}
.home-section {
  margin-bottom: 18px;
}
.home-label {
  margin: 0 0 8px 2px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  opacity: 0.65;
}
.home-label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.home-link {
  color: rgb(var(--v-theme-accent));
  font-size: 0.75rem;
  font-weight: 700;
}
.home-empty {
  padding: 16px;
  font-size: 0.85rem;
  text-align: center;
  opacity: 0.6;
}
/* Continue */
.continue-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  background: rgb(var(--v-theme-primary));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  text-align: left;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.continue-card:active {
  transform: scale(0.99);
}
.continue-card__art {
  display: block;
  width: 100%;
  height: 104px;
  object-fit: cover;
  object-position: center 30%;
}
.continue-card__body {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}
.continue-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.continue-card__text strong {
  overflow: hidden;
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.continue-card__text small {
  overflow: hidden;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.65;
}
.continue-card__party {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}
.continue-card__party .v-avatar {
  margin-left: -6px;
  border: 2px solid rgb(var(--v-theme-primary));
}
.continue-card__go {
  margin-left: 8px;
  color: rgb(var(--v-theme-accent));
  font-size: 30px !important;
}
.continue-card--empty {
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-style: dashed;
}
.continue-card--empty .continue-card__text small {
  white-space: normal;
}
/* Next event */
.next-event {
  display: flex;
  overflow: hidden;
  background: rgb(var(--v-theme-primary));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
}
.next-event__info {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 10px 12px;
  text-align: left;
}
.next-event__join {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0 16px;
  background: #4f9a4b;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}
.date-chip {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 52px;
  background: #f2efe8;
  border-radius: 10px;
  color: #1a1a1a;
  line-height: 1;
}
.date-chip small {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
}
.date-chip strong {
  font-family: "Cinzel", serif;
  font-size: 1.35rem;
}
.event-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.event-text strong,
.event-text small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.event-text strong {
  font-size: 0.92rem;
}
.event-text small {
  font-size: 0.72rem;
  opacity: 0.75;
}
.event-text__muted {
  opacity: 0.5 !important;
}
/* Shortcuts */
.shortcuts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
.shortcut {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 66px;
  background: rgb(var(--v-theme-primary));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
}
.shortcut .v-icon {
  color: rgb(var(--v-theme-accent));
}
/* Events near you */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.event-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 44px 10px 10px;
  background: rgb(var(--v-theme-primary));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  text-align: left;
}
.event-row__flag {
  position: absolute;
  top: 0;
  right: 10px;
  width: 22px;
}
.event-status {
  display: flex;
  align-items: center;
  gap: 3px;
}
</style>
