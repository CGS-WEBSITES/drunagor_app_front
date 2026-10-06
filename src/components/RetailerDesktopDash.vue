<template>
  <div>
    <div class="retailer-dash">
      <div class="retailer-dash__container">
        <!-- Profile header -->
        <header class="dash-header">
          <router-link to="/profile/home" class="dash-header__avatar" title="My Profile">
            <img :src="avatarUrl" alt="" />
          </router-link>
          <div>
            <h1 class="dash-header__name">{{ userStore.user.user_name || "Retailer" }}</h1>
            <span class="dash-header__role">Retailer</span>
          </div>
        </header>

        <!-- The retailer's next events: click one to manage it. -->
        <section class="dash-section">
          <router-link to="/events" class="dash-section__title">
            MY EVENTS <v-icon size="18">mdi-chevron-right</v-icon>
          </router-link>
          <div class="dash-panel">
            <div v-if="loadingEvents" class="dash-skeleton"><span></span><span></span></div>
            <div v-else class="dash-events">
              <EventListCard
                v-for="event in upcomingEvents.slice(0, 5)"
                :key="event.events_pk"
                :event="event"
                :timezone="timezone"
                @open="openEvent(event)"
              >
                <template #status>
                  <span class="dash-manage-hint">Manage <v-icon size="16">mdi-chevron-right</v-icon></span>
                </template>
              </EventListCard>
              <CreateEventCard :loading="creating" @create="createEvent" />
            </div>
          </div>
        </section>

        <!-- Retailers can play too. -->
        <section class="dash-section">
          <h2 class="dash-section__title">PLAY</h2>
          <div class="play-row">
            <button class="play-card play-card--join" @click="showJoinTable = true">
              <v-icon size="28">mdi-qrcode-scan</v-icon>
              <span><strong>Join a table</strong><small>Scan the table's QR Code or type its code</small></span>
            </button>
            <router-link to="/campaign-tracker/" class="play-card">
              <v-icon size="28">mdi-book-open-page-variant</v-icon>
              <span><strong>My campaigns</strong><small>Your heroes and their progress</small></span>
            </router-link>
          </div>
        </section>

        <!-- Quick access -->
        <section class="dash-section">
          <h2 class="dash-section__title">QUICK ACCESS</h2>
          <div class="dash-shortcuts">
            <router-link
              v-for="item in shortcuts"
              :key="item.title"
              :to="item.to"
              class="dash-shortcut"
              :style="{ '--tint': item.tint }"
            >
              <img :src="quickAccessBg" alt="" />
              <span><v-icon size="20" class="mr-2">{{ item.icon }}</v-icon>{{ item.title }}</span>
            </router-link>
          </div>
        </section>

        <!-- Every upcoming event, from every store. -->
        <section class="dash-section">
          <router-link to="/events" class="dash-section__title">
            EVENTS <v-icon size="18">mdi-chevron-right</v-icon>
          </router-link>
          <div class="dash-panel">
            <div v-if="loadingEvents" class="dash-skeleton"><span></span><span></span></div>
            <div v-else class="dash-events">
              <EventListCard
                v-for="event in otherEvents"
                :key="event.events_pk"
                :event="event"
                :timezone="timezone"
                @open="router.push('/events')"
              />
              <router-link to="/events" class="dash-more-events">
                <EventListCard v-if="otherTeaser" :event="otherTeaser" :timezone="timezone" class="dash-more-events__teaser" aria-hidden="true" />
                <span class="dash-more-events__label">
                  <v-icon size="22" class="mr-2">mdi-calendar-search</v-icon>
                  {{ otherTeaser ? "See more events" : "See all events" }}
                </span>
              </router-link>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- Join a table as a player: scan the QR Code or type the table code. -->
    <HUB v-model="showJoinTable" />

    <ManageEventDialog
      v-model="manageDialog"
      :event="selectedEvent"
      editable
      @refresh="loadEvents"
      @edit="editEvent"
    />

    <EventFormDialog v-model="formDialog" :event="formEvent" @saved="onEventSaved" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import ManageEventDialog from "@/components/dialogs/ManageEventDialog.vue";
import HUB from "@/components/HUB.vue";
import quickAccessBg from "@/assets/dashboard/quick-access-bg.png";
import EventListCard from "@/components/EventListCard.vue";
import CreateEventCard from "@/components/CreateEventCard.vue";
import EventFormDialog from "@/components/dialogs/EventFormDialog.vue";

const ASSETS = "https://assets.drunagor.app";

const router = useRouter();
const userStore = useUserStore();
const axios: any = inject("axios");

const timezone = computed(() => userStore.user?.timezone?.iana_name ?? "America/Chicago");
const avatarUrl = computed(() =>
  userStore.user?.picture_hash ? `${ASSETS}/Profile/${userStore.user.picture_hash}` : `${ASSETS}/Profile/user.png`,
);

// Retailers can play too: Join a table and their campaigns sit with the store tools.
const shortcuts = [
  { title: "TABLE ASSEMBLY", icon: "mdi-table-furniture", tint: "#6b1d22", to: "/assembly-tutorial" },
  { title: "BOX ASSEMBLY GUIDE", icon: "mdi-package-variant", tint: "#43306a", to: "/box-assembly-guide" },
  { title: "MY STORES", icon: "mdi-store", tint: "#1b4f5a", to: "/profile/store-settings" },
  { title: "RETAILER GUIDE", icon: "mdi-school-outline", tint: "#6a4a1a", to: "/retailer-tutorial" },
  { title: "SKU'S MANAGER", icon: "mdi-bookshelf", tint: "#1f5a3a", to: "/library" },
  { title: "HELP", icon: "mdi-help-circle", tint: "#4a5658", to: "/FAQforRetailers" },
];
const showJoinTable = ref(false);

// Every upcoming event from other stores.
const allEvents = ref<any[]>([]);
const loadAllEvents = async () => {
  try {
    const { data } = await axios.get("/events/list_events/", {
      params: { past_events: "false", player_fk: userStore.user?.users_pk },
    });
    allEvents.value = data.events || [];
  } catch {
    allEvents.value = [];
  }
};
const othersUpcoming = computed(() => {
  const mine = new Set(upcomingEvents.value.map((event: any) => event.events_pk));
  const now = Date.now();
  return allEvents.value
    .filter((event: any) => !mine.has(event.events_pk) && new Date(event.event_date).getTime() >= now)
    .sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
});
const otherEvents = computed(() => othersUpcoming.value.slice(0, 3));
const otherTeaser = computed(() => othersUpcoming.value[3] ?? null);

// The retailer's upcoming events.
const upcomingEvents = ref<any[]>([]);
const loadingEvents = ref(true);

const loadEvents = async () => {
  try {
    const { data } = await axios.get("/events/my_events/retailer", {
      params: { retailer_fk: userStore.user?.users_pk, active: "true", past_events: false },
    });
    upcomingEvents.value = (data.events || []).sort(
      (a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
    );
  } catch (error) {
    console.error("[RetailerDesktopDash] Failed to load events", error);
  } finally {
    loadingEvents.value = false;
  }
};

const manageDialog = ref(false);
const selectedEvent = ref<any>(null);
const openEvent = (event: any) => {
  selectedEvent.value = event;
  manageDialog.value = true;
};

// Create and edit right here, without leaving the dashboard.
const formDialog = ref(false);
const formEvent = ref<any>(null);
const editEvent = (event: any) => {
  manageDialog.value = false;
  formEvent.value = event;
  formDialog.value = true;
};
const onEventSaved = async (eventPk: number) => {
  await loadEvents();
  // A new event opens in Manage Event, ready for tables and players.
  if (!formEvent.value) {
    const created = upcomingEvents.value.find((event) => event.events_pk === eventPk);
    if (created) openEvent(created);
  }
};

// Events need a store: without one, send the retailer to create it first.
const creating = ref(false);
const createEvent = async () => {
  creating.value = true;
  try {
    const { data } = await axios.get("/stores/list", {
      params: { users_fk: userStore.user?.users_pk },
      validateStatus: (status: number) => status === 200 || status === 404,
    });
    if ((data.stores || []).length) {
      formEvent.value = null;
      formDialog.value = true;
    } else {
      router.push("/profile/store-settings");
    }
  } finally {
    creating.value = false;
  }
};

onMounted(() => {
  loadEvents();
  loadAllEvents();
});
</script>

<style scoped>
.retailer-dash {
  padding: 92px 16px 48px;
  font-family: "Poppins", sans-serif;
  color: rgb(var(--v-theme-on-surface));
}
.retailer-dash__container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px 24px;
  background: rgba(var(--v-theme-surface), 0.92);
  border-radius: 16px;
}
.dash-header {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 88px;
  margin: 0 -16px 20px;
  padding: 0 32px;
  background: rgb(var(--v-theme-primary));
  border-radius: 16px 16px 0 0;
}
.dash-header__avatar {
  display: block;
  flex: 0 0 128px;
  width: 128px;
  height: 128px;
  margin-top: -48px;
  overflow: hidden;
  background: rgb(var(--v-theme-background));
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
}
.dash-header__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.dash-header__name {
  font-size: 1.4rem;
  font-weight: 700;
  text-transform: uppercase;
}
.dash-header__role {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.75;
  text-transform: uppercase;
}
.dash-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.dash-card {
  display: block;
  aspect-ratio: 944 / 1420;
  overflow: hidden;
  border-radius: 12px;
}
.dash-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}
.dash-card:hover img {
  transform: scale(1.05);
}
.dash-section {
  margin-top: 28px;
}
.dash-section__title {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 10px;
  color: inherit;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
}
.dash-panel {
  padding: 12px;
  background: rgb(var(--v-theme-primary));
  border-radius: 12px;
}
.dash-events {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
/* Compact event cards: the Events page stretches them to fill its grid. */
.dash-events :deep(.event-list-card) {
  height: auto;
  min-height: 96px;
}
/* "Manage" on the retailer's own events: outlined, filled when the card is hovered. */
.dash-manage-hint {
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
.dash-events :deep(.event-list-card:hover) .dash-manage-hint {
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}
.dash-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px;
  text-align: center;
}
.dash-empty p {
  margin: 0;
  opacity: 0.8;
}
.dash-shortcuts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.dash-shortcut {
  position: relative;
  display: flex;
  align-items: center;
  aspect-ratio: 476 / 54;
  min-height: 48px;
  overflow: hidden;
  border-radius: 10px;
  color: rgb(var(--v-theme-on-surface));
  text-decoration: none;
  transition: transform 0.2s ease;
}
/* Quick access: dark texture glowing into each button's color. */
.dash-shortcut {
  background: linear-gradient(90deg, #141416 0%, #19191c 30%, var(--tint) 100%);
}
.dash-shortcut img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: overlay;
  opacity: 0.55;
  filter: none;
  transition: opacity 0.2s ease;
}
.dash-shortcut:hover img {
  opacity: 0.75;
  filter: none;
}
.dash-shortcut:hover {
  transform: translateY(-2px);
}
.dash-shortcut span {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 16px;
  font-size: 0.9rem;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}
.dash-more-events {
  position: relative;
  display: block;
  min-height: 84px;
  border-radius: 6px;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
}
.dash-more-events__teaser {
  filter: blur(1.2px);
  opacity: 0.8;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.dash-more-events__label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background: rgba(var(--v-theme-background), 0.3);
  text-shadow: 0 1px 4px rgba(var(--v-theme-background), 0.9);
}
.dash-more-events:hover .dash-more-events__teaser {
  opacity: 0.95;
}
/* Play */
.play-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.play-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: rgb(var(--v-theme-primary));
  border: 1px solid rgba(var(--v-theme-on-primary), 0.1);
  border-radius: 12px;
  color: inherit;
  text-align: left;
  text-decoration: none;
  transition: transform 0.2s ease;
}
.play-card:hover {
  transform: translateY(-2px);
}
.play-card > span {
  display: flex;
  flex-direction: column;
}
.play-card strong {
  font-size: 1rem;
}
.play-card small {
  font-size: 0.78rem;
  opacity: 0.7;
}
.play-card--join {
  background: rgb(var(--v-theme-playbutton));
  color: rgb(var(--v-theme-on-playbutton));
}
/* Loading */
.dash-skeleton {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.dash-skeleton span {
  height: 96px;
  background: linear-gradient(90deg, rgba(var(--v-theme-on-surface), 0.06) 0%, rgba(var(--v-theme-on-surface), 0.12) 50%, rgba(var(--v-theme-on-surface), 0.06) 100%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: dash-shimmer 1.4s ease-in-out infinite;
}
@keyframes dash-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
</style>
