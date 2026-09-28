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

        <!-- Main shortcuts -->
        <div class="dash-cards">
          <template v-for="card in mainCards" :key="card.title">
            <button v-if="card.host" class="dash-card dash-card--host" :disabled="creating" @click="createEvent">
              <img :src="hostEventArt" :alt="card.title" />
            </button>
            <router-link v-else :to="card.to ?? '/'" class="dash-card">
              <img :src="card.image" :alt="card.title" />
            </router-link>
          </template>
        </div>

        <!-- The retailer's next events -->
        <section class="dash-section">
          <router-link to="/events" class="dash-section__title">
            YOUR NEXT EVENTS <v-icon size="18">mdi-chevron-right</v-icon>
          </router-link>
          <div class="dash-panel">
            <!-- Main call to action: hosting events -->
            <section class="host-banner">
              <div class="host-banner__text">
                <h2>Host a Drunagor Night</h2>
                <p>Create an event, set up the tables and let players join from their phones.</p>
                <div class="host-banner__stats">
                  <span><strong>{{ upcomingEvents.length }}</strong> upcoming events</span>
                  <span><strong>{{ totalTables }}</strong> tables</span>
                  <span><strong>{{ totalPlayers }}</strong> players seated</span>
                </div>
              </div>
              <div class="host-banner__actions">
                <v-btn color="accent" size="x-large" class="font-weight-bold" prepend-icon="mdi-plus-thick" :loading="creating" @click="createEvent">
                  Create event
                </v-btn>
                <v-btn variant="outlined" prepend-icon="mdi-table-furniture" to="/assembly-tutorial">
                  Table Assembly guide
                </v-btn>
              </div>
            </section>

            <div v-if="loadingEvents" class="d-flex justify-center py-6">
              <v-progress-circular indeterminate size="28" />
            </div>
            <template v-else-if="upcomingEvents.length">
              <button v-for="event in upcomingEvents.slice(0, 5)" :key="event.events_pk" class="event-row" @click="openEvent(event)">
                <div class="event-row__date">
                  <span>{{ extractMonth(event.event_date, timezone) }}</span>
                  <strong>{{ extractDay(event.event_date, timezone) }}</strong>
                  <span>{{ extractTime(event.event_date, timezone) }}</span>
                </div>
                <div class="event-row__info">
                  <strong class="text-truncate">{{ event.store_name }}</strong>
                  <span class="text-truncate"><v-icon size="15">mdi-sword-cross</v-icon> {{ event.scenario }}</span>
                </div>
                <div class="event-row__tables">
                  <template v-if="tableStats[event.events_pk]">
                    <span><v-icon size="16">mdi-table-chair</v-icon> {{ tableStats[event.events_pk].tables }} tables</span>
                    <span><v-icon size="16">mdi-account-group</v-icon> {{ tableStats[event.events_pk].players }}/{{ tableStats[event.events_pk].seats }} players</span>
                  </template>
                </div>
                <span class="event-row__manage">Manage <v-icon size="18">mdi-chevron-right</v-icon></span>
              </button>
            </template>
            <div v-else class="dash-empty">
              <v-icon size="36">mdi-calendar-plus</v-icon>
              <p>No upcoming events. Create your first Drunagor Night.</p>
              <v-btn color="accent" prepend-icon="mdi-plus-thick" @click="createEvent">Create event</v-btn>
            </div>
          </div>
        </section>

        <!-- Quick access -->
        <section class="dash-section">
          <h2 class="dash-section__title">QUICK ACCESS</h2>
          <div class="dash-shortcuts">
            <router-link v-for="item in shortcuts" :key="item.title" :to="item.to" class="dash-shortcut">
              <img :src="item.image" alt="" />
              <span><v-icon size="20" class="mr-2">{{ item.icon }}</v-icon>{{ item.title }}</span>
            </router-link>
          </div>
        </section>
      </div>
    </div>

    <ManageEventDialog v-model="manageDialog" :event="selectedEvent" @refresh="loadEvents" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import ManageEventDialog from "@/components/dialogs/ManageEventDialog.vue";
import { extractDay, extractMonth, extractTime } from "@/utils/dateHelpers";
import hostEventArt from "@/assets/btn-host.png";

const ASSETS = "https://assets.drunagor.app";

const router = useRouter();
const userStore = useUserStore();
const axios: any = inject("axios");

const timezone = computed(() => userStore.user?.timezone?.iana_name ?? "America/Chicago");
const avatarUrl = computed(() =>
  userStore.user?.picture_hash ? `${ASSETS}/Profile/${userStore.user.picture_hash}` : `${ASSETS}/Profile/user.png`,
);

type MainCard = { title: string; image?: string; to?: string; host?: boolean };
const mainCards: MainCard[] = [
  { title: "Events", image: `${ASSETS}/Dashboard/btn-events3.png`, to: "/events" },
  { title: "Host a Drunagor Night", host: true },
  { title: "SKU's Manager", image: `${ASSETS}/Dashboard/btn-skusmannager.png`, to: "/library" },
  { title: "My Profile", image: `${ASSETS}/Dashboard/btn-profile3.png`, to: "/profile/home" },
];

const shortcuts = [
  { title: "MY STORES", icon: "mdi-store", image: `${ASSETS}/Dashboard/btn-heropack.png`, to: "/profile/store-settings" },
  { title: "TABLE ASSEMBLY", icon: "mdi-table-furniture", image: `${ASSETS}/Dashboard/btn-apoc.png`, to: "/assembly-tutorial" },
  { title: "OP KIT GUIDE", icon: "mdi-package-variant", image: `${ASSETS}/Dashboard/btn-spoils.png`, to: "/retailer-tutorial" },
  { title: "RETAILER FAQ", icon: "mdi-help-circle", image: `${ASSETS}/Dashboard/btn-horseman.png`, to: "/FAQforRetailers" },
];

// Upcoming events and their table occupancy.
const upcomingEvents = ref<any[]>([]);
const loadingEvents = ref(true);
const tableStats = ref<Record<number, { tables: number; players: number; seats: number }>>({});

const totalTables = computed(() => Object.values(tableStats.value).reduce((sum, stat) => sum + stat.tables, 0));
const totalPlayers = computed(() => Object.values(tableStats.value).reduce((sum, stat) => sum + stat.players, 0));

const loadTableStats = async (eventPk: number) => {
  try {
    const { data } = await axios.get(`/event_tables/list/${eventPk}`);
    const tables = data.tables || [];
    tableStats.value[eventPk] = {
      tables: tables.length,
      players: tables.reduce((sum: number, table: any) => sum + (table.players_count || 0), 0),
      seats: tables.reduce((sum: number, table: any) => sum + (table.max_players || 0), 0),
    };
  } catch {
    // The event simply shows without table numbers.
  }
};

const loadEvents = async () => {
  try {
    const { data } = await axios.get("/events/my_events/retailer", {
      params: { retailer_fk: userStore.user?.users_pk, active: "true", past_events: false },
    });
    upcomingEvents.value = (data.events || []).sort(
      (a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
    );
    await Promise.allSettled(upcomingEvents.value.map((event) => loadTableStats(event.events_pk)));
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

// Events need a store: without one, send the retailer to create it first.
const creating = ref(false);
const createEvent = async () => {
  creating.value = true;
  try {
    const { data } = await axios.get("/stores/list", {
      params: { users_fk: userStore.user?.users_pk },
      validateStatus: (status: number) => status === 200 || status === 404,
    });
    router.push((data.stores || []).length ? { path: "/events", query: { action: "create" } } : "/profile/store-settings");
  } finally {
    creating.value = false;
  }
};

onMounted(loadEvents);
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
.host-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 4px;
  color: rgb(var(--v-theme-on-surface));
  padding: 24px;
  background:
    linear-gradient(100deg, rgba(var(--v-theme-accent), 0.28) 0%, rgba(var(--v-theme-primary), 0.9) 60%),
    url("https://assets.drunagor.app/Dashboard/btn-events3.png") right 35% / 55% auto no-repeat,
    rgb(var(--v-theme-primary));
  border: 1px solid rgba(var(--v-theme-accent), 0.5);
  border-radius: 12px;
}
.host-banner h2 {
  font-size: 1.6rem;
  font-weight: 800;
  text-transform: uppercase;
}
.host-banner p {
  margin: 4px 0 12px;
  font-size: 0.9rem;
  opacity: 0.85;
}
.host-banner__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.host-banner__stats span {
  padding: 4px 12px;
  background: rgba(var(--v-theme-background), 0.6);
  border-radius: 999px;
  font-size: 0.8rem;
}
.host-banner__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
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
.dash-card--host {
  position: relative;
  padding: 0;
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
/* Light panel so the events stand out from the dark page. */
.dash-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  color: #141414;
}
.event-row {
  display: grid;
  grid-template-columns: 64px 1fr auto auto;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  color: inherit;
  text-align: left;
  transition: background 0.2s ease;
}
.event-row:hover {
  background: rgba(0, 0, 0, 0.12);
}
.event-row__date {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
}
.event-row__date span {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.event-row__date strong {
  font-size: 1.7rem;
}
.event-row__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.event-row__info span,
.event-row__tables {
  font-size: 0.8rem;
  opacity: 0.8;
}
.event-row__tables {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.event-row__manage {
  display: flex;
  align-items: center;
  color: rgb(var(--v-theme-primary));
  font-size: 0.85rem;
  font-weight: 700;
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
.dash-shortcut img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.55);
  transition: filter 0.2s ease;
}
.dash-shortcut:hover img {
  filter: brightness(0.75);
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
</style>
