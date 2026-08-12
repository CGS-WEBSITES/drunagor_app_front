<template>
  <v-card color="primary" class="fill-height d-flex flex-column w-100">
    <v-tabs
      v-model="activeTab"
      bg-color="background"
      grow
      class="flex-grow-0 mb-3"
    >
      <v-tab value="upcoming">Events</v-tab>
      <v-tab value="myevents">My Events</v-tab>
    </v-tabs>

    <div class="flex-grow-1 mt-2 content-scroll" style="overflow-y: auto">
      <div
        v-if="activeTab === 'upcoming'"
        class="px-2 py-3 fill-height d-flex flex-column"
      >
        <div
          v-if="loading"
          class="d-flex justify-center align-center"
          style="height: 200px"
        >
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else class="d-flex flex-column flex-grow-1">
          <div v-if="upcomingEventsPreviewSliced.length > 0 || recentCampaign">
            <v-row dense class="mx-n1">
              <!-- Recent Campaign Card (Image 1 style: Heroes for Core/Apoc/Awak, Players for Underkeep) -->
              <v-col
                v-if="recentCampaign"
                cols="12"
                md="6"
                class="px-1 py-1"
              >
                <v-card
                  color="#1a1d24"
                  elevation="6"
                  class="cursor-pointer transition-swing rounded-lg overflow-hidden h-100 d-flex flex-column justify-space-between event-card"
                  style="border: 1px solid rgba(255, 255, 255, 0.15); min-height: 96px;"
                  @click="resumeRecentCampaign"
                >
                  <!-- Full-width Campaign Banner -->
                  <v-img
                    :src="getCampaignBanner(recentCampaign.campaign)"
                    height="64"
                    cover
                    class="w-100"
                  ></v-img>

                  <!-- Bottom Bar: Party Name + Heroes (or Players if Underkeep) -->
                  <div class="py-2 px-3 bg-grey-darken-4 text-white font-weight-bold text-subtitle-2 d-flex align-center justify-space-between flex-wrap" style="letter-spacing: 0.5px; height: 38px;">
                    <span class="text-truncate mr-2 font-weight-bold text-subtitle-2" style="max-width: 170px;">
                      {{ recentCampaign.name }}
                    </span>

                    <!-- Core / Apocalypse / Awakenings: Show HEROES -->
                    <div v-if="!isUnderkeep && recentCampaignHeroes.length > 0" class="d-flex align-center gap-1">
                      <v-avatar
                        v-for="(hero, idx) in recentCampaignHeroes.slice(0, 4)"
                        :key="idx"
                        size="24"
                        style="border: 1px solid rgba(255, 255, 255, 0.3);"
                      >
                        <v-img :src="hero.images.avatar" cover />
                      </v-avatar>
                    </div>

                    <!-- Underkeep: Show PLAYERS -->
                    <div v-else-if="isUnderkeep && recentCampaignPlayers.length > 0" class="d-flex align-center gap-1">
                      <v-avatar
                        v-for="(player, idx) in recentCampaignPlayers.slice(0, 4)"
                        :key="idx"
                        size="24"
                        color="grey-darken-3"
                        style="border: 1px solid rgba(255, 255, 255, 0.3);"
                      >
                        <v-img v-if="player.avatar" :src="player.avatar" cover />
                        <span v-else class="text-caption font-weight-bold">{{ (player.name || 'P')[0].toUpperCase() }}</span>
                      </v-avatar>
                    </div>
                  </div>
                </v-card>
              </v-col>

              <v-col
                cols="12"
                md="6"
                v-for="event in upcomingEventsPreviewSliced"
                :key="event.events_pk"
                class="px-1 py-1"
              >
                <v-card
                  color="terciary"
                  class="pt-0 pb-2 event-card"
                  @click="openDialog(event)"
                >
                  <v-img
                    v-if="getSeasonInfo(event.seasons_fk).flag"
                    :src="getSeasonInfo(event.seasons_fk).flag"
                    class="season-flag"
                  />
                  <v-row no-gutters align="center" class="flex-nowrap w-100">
                    <v-col cols="auto" class="d-flex justify-center px-1">
                      <div
                        class="text-center"
                        style="width: 70px; color: black"
                      >
                        <p
                          class="pt-3 text-caption font-weight-bold"
                          style="line-height: 1.2"
                        >
                          {{ extractMonth(event.event_date, userTimezone) }}
                        </p>
                        <p
                          class="cinzel-text text-h4 font-weight-bold my-1"
                          style="line-height: 1"
                        >
                          {{ extractDay(event.event_date, userTimezone) }}
                        </p>
                        <p
                          class="text-caption font-weight-bold"
                          style="line-height: 1.2; font-size: 11px !important"
                        >
                          {{ extractTime(event.event_date, userTimezone) }}
                        </p>
                      </div>
                    </v-col>

                    <v-col
                      class="py-2 pl-2"
                      style="min-width: 0; padding-right: 55px !important"
                    >
                      <h3
                        class="pb-1 text-subtitle-1 font-weight-bold text-truncate"
                        style="line-height: 1.2"
                      >
                        <v-icon class="pr-1" size="small" color="black"
                          >mdi-chess-rook</v-icon
                        >
                        {{ event.store_name }}
                      </h3>
                      <p
                        class="text-caption text-truncate mb-1"
                        style="line-height: 1.2"
                      >
                        <v-icon color="red" size="small">mdi-map-marker</v-icon>
                        {{ event.address }}
                      </p>
                      <p
                        class="text-caption text-truncate mb-0"
                        style="line-height: 1.2"
                      >
                        <v-icon color="red" size="small"
                          >mdi-sword-cross</v-icon
                        >
                        {{ event.scenario }}
                      </p>
                      <p class="text-caption text-truncate mb-0" v-if="event.rewards?.length" style="line-height: 1.2">
                        <v-icon color="red" size="small">mdi-star-circle</v-icon>
                        Rewards:
                        <span v-for="(reward, i) in event.rewards" :key="i" class="d-inline-flex align-center ml-1">
                          <img :src="reward.image" height="14" width="14" style="object-fit: contain;" />
                        </span>
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-btn
              v-if="upcomingEventsPreview.length >= itemsLimit"
              block
              color="white"
              class="text-black mt-2 see-all-btn"
              @click="goToEvents"
              >See all events</v-btn
            >
          </div>
          <div v-else class="d-flex fill-height align-center justify-center">
            <v-card
              color="transparent"
              flat
              class="text-center pa-5 fill-height d-flex align-center justify-center"
            >
              <p>No upcoming events at the moment.</p>
            </v-card>
          </div>
        </div>
      </div>

      <div v-else class="px-2 py-3 fill-height d-flex flex-column">
        <div
          v-if="loading"
          class="d-flex justify-center align-center"
          style="height: 200px"
        >
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else class="d-flex flex-column flex-grow-1">
          <div v-if="myEventsPreviewSliced.length > 0">
            <v-row dense class="mx-n1">
              <v-col
                cols="12"
                md="6"
                v-for="event in myEventsPreviewSliced"
                :key="event.events_pk"
                class="px-1"
              >
                <v-card
                  color="terciary"
                  class="pt-0 pb-2 event-card"
                  @click="openMyEventsDialog(event)"
                >
                  <v-img
                    v-if="getSeasonInfo(event.seasons_fk).flag"
                    :src="getSeasonInfo(event.seasons_fk).flag"
                    class="season-flag"
                  />
                  <v-row no-gutters align="center" class="flex-nowrap w-100">
                    <v-col cols="auto" class="d-flex justify-center px-1">
                      <div
                        class="text-center"
                        style="width: 70px; color: black"
                      >
                        <p
                          class="pt-3 text-caption font-weight-bold"
                          style="line-height: 1.2"
                        >
                          {{ extractMonth(event.event_date, userTimezone) }}
                        </p>
                        <p
                          class="cinzel-text text-h4 font-weight-bold my-1"
                          style="line-height: 1"
                        >
                          {{ extractDay(event.event_date, userTimezone) }}
                        </p>
                        <p
                          class="text-caption font-weight-bold"
                          style="line-height: 1.2; font-size: 11px !important"
                        >
                          {{ extractTime(event.event_date, userTimezone) }}
                        </p>
                      </div>
                    </v-col>
                    <v-col
                      class="py-2 pl-2"
                      style="min-width: 0; padding-right: 55px !important"
                    >
                      <h3
                        class="pb-1 text-subtitle-1 font-weight-bold text-truncate"
                        style="line-height: 1.2"
                      >
                        <v-icon class="pr-1" size="small" color="black"
                          >mdi-chess-rook</v-icon
                        >
                        {{ event.store_name }}
                      </h3>
                      <p
                        class="text-caption text-truncate mb-1"
                        style="line-height: 1.2"
                      >
                        <v-icon color="red" size="small">mdi-map-marker</v-icon>
                        {{ event.address }}
                      </p>
                      <p
                        class="text-caption text-truncate"
                        style="line-height: 1.2"
                      >
                        <v-icon color="red" size="small"
                          >mdi-sword-cross</v-icon
                        >
                        {{ event.scenario }}
                      </p>
                    </v-col>
                  </v-row>
                  <div
                    style="
                      position: absolute;
                      bottom: 8px;
                      right: 8px;
                      z-index: 3;
                    "
                  >
                    <v-tooltip
                      :text="getEventStatusInfo(event.status).tooltip"
                      location="top"
                    >
                      <template #activator="{ props }">
                        <v-icon
                          v-bind="props"
                          :color="getEventStatusInfo(event.status).color"
                          size="large"
                        >
                          {{ getEventStatusInfo(event.status).icon }}
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-btn
              v-if="myEventsPreview.length >= itemsLimit"
              block
              color="white"
              class="text-black mt-2 see-all-btn"
              @click="goToEvents"
              >See all events</v-btn
            >
          </div>
          <div v-else class="d-flex fill-height align-center justify-center">
            <v-card
              color="transparent"
              flat
              class="text-center pa-5 fill-height d-flex align-center justify-center"
            >
              <p>You have no upcoming events.</p>
            </v-card>
          </div>
        </div>
      </div>
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
                <v-btn
                  class="mb-4"
                  block
                  color="green"
                  @click="showCampaignDialog = true"
                  :disabled="
                    !currentPlayer ||
                    currentPlayer.event_status !== 'Joined the Quest'
                  "
                  >Join Campaign</v-btn
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
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import genconLogo from "@/assets/cgsblue.png";

const router = useRouter();
const userStore = useUserStore();
const axios: any = inject("axios");
const display = useDisplay();

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

const itemsLimit = computed(() => {
  if (display.xs.value) return 4;
  if (display.sm.value || display.md.value) return 5;
  return 12;
});

const upcomingEventsPreviewSliced = computed(() =>
  upcomingEventsPreview.value.slice(0, itemsLimit.value),
);
const myEventsPreviewSliced = computed(() =>
  myEventsPreview.value.slice(0, itemsLimit.value),
);

const currentPlayer = computed(() => {
  if (!userStore.user?.users_pk) return null;
  return (
    players.value.find((p) => p.users_pk === userStore.user.users_pk) || null
  );
});

const goToEvents = () => router.push({ name: "Events" });

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
</style>
