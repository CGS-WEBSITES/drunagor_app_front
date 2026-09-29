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
          <router-link v-for="card in mainCards" :key="card.title" :to="card.to" class="dash-card">
            <img :src="card.image" :alt="card.title" />
          </router-link>
        </div>

        <!-- The retailer's next events: click one to manage it. -->
        <section class="dash-section">
          <router-link to="/events" class="dash-section__title">
            YOUR NEXT EVENTS <v-icon size="18">mdi-chevron-right</v-icon>
          </router-link>
          <div class="dash-panel">
            <div v-if="loadingEvents" class="d-flex justify-center py-6">
              <v-progress-circular indeterminate size="28" />
            </div>
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

const mainCards = [
  { title: "Events", image: `${ASSETS}/Dashboard/btn-events3.png`, to: "/events" },
  { title: "Campaign Manager", image: `${ASSETS}/Dashboard/btn-campaignmanager.png`, to: "/campaign-tracker/" },
  { title: "SKU's Manager", image: `${ASSETS}/Dashboard/btn-skusmannager.png`, to: "/library" },
  { title: "My Profile", image: `${ASSETS}/Dashboard/btn-profile3.png`, to: "/profile/home" },
];

const shortcuts = [
  { title: "MY STORES", icon: "mdi-store", image: `${ASSETS}/Dashboard/btn-heropack.png`, to: "/profile/store-settings" },
  { title: "TABLE ASSEMBLY", icon: "mdi-table-furniture", image: `${ASSETS}/Dashboard/btn-apoc.png`, to: "/assembly-tutorial" },
  { title: "OP KIT GUIDE", icon: "mdi-package-variant", image: `${ASSETS}/Dashboard/btn-spoils.png`, to: "/retailer-tutorial" },
  { title: "RETAILER FAQ", icon: "mdi-help-circle", image: `${ASSETS}/Dashboard/btn-horseman.png`, to: "/FAQforRetailers" },
];

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
