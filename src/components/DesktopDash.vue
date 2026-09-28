<template>
  <div class="desktop-dash">
    <div class="desktop-dash__container">
      <!-- Profile header -->
      <header class="dash-header">
        <img :src="avatarUrl" alt="" class="dash-header__avatar" />
        <h1 class="dash-header__name">{{ userStore.user.user_name || "Drunagor User" }}</h1>
      </header>

      <v-autocomplete
        v-model="searchTarget"
        :items="searchItems"
        item-title="title"
        item-value="id"
        placeholder="Search in DRUNAGOR APP"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="solo-filled"
        flat
        hide-details
        hide-no-data
        class="dash-search"
        @update:model-value="goToSearchTarget"
      />

      <!-- Main shortcuts -->
      <div class="dash-cards">
        <router-link v-for="card in mainCards" :key="card.title" :to="card.to" class="dash-card">
          <img :src="card.image" :alt="card.title" />
        </router-link>
      </div>

      <!-- Events -->
      <section class="dash-section">
        <div class="dash-section__head">
          <h2>EVENTS</h2>
          <router-link :to="'/events'" class="dash-section__link">See all</router-link>
        </div>
        <div class="dash-events">
          <div v-for="column in eventColumns" :key="column.title" class="dash-events__column">
            <h3>{{ column.title }}</h3>
            <div v-if="loadingEvents" class="d-flex justify-center py-6">
              <v-progress-circular indeterminate size="28" />
            </div>
            <template v-else-if="column.events.length">
              <EventListCard
                v-for="event in column.events"
                :key="event.events_pk"
                :event="event"
                :timezone="timezone"
                class="mb-2"
                @open="router.push('/events')"
              />
            </template>
            <p v-else class="dash-empty">{{ column.empty }}</p>
          </div>
        </div>
      </section>

      <!-- Recent campaigns -->
      <section class="dash-section">
        <div class="dash-section__head">
          <h2>RECENT CAMPAIGNS</h2>
          <router-link :to="'/campaign-tracker/'" class="dash-section__link">See all</router-link>
        </div>
        <div v-if="loadingCampaigns" class="d-flex justify-center py-6">
          <v-progress-circular indeterminate size="28" />
        </div>
        <v-slide-group v-else-if="campaigns.length" show-arrows class="dash-campaigns">
          <v-slide-group-item v-for="campaign in campaigns" :key="campaign.id">
            <div class="dash-campaign" @click="router.push(`/campaign-tracker/campaign/${campaign.id}`)">
              <img :src="campaign.image" alt="" class="dash-campaign__img" />
              <div class="dash-campaign__info">
                <strong class="text-truncate">{{ campaign.name }}</strong>
                <span class="text-truncate">{{ campaign.subtitle }}</span>
                <span class="dash-campaign__box">{{ campaign.boxLabel }}</span>
              </div>
            </div>
          </v-slide-group-item>
        </v-slide-group>
        <p v-else class="dash-empty">
          No campaigns yet. Start one from the
          <router-link :to="'/campaign-tracker/'">Companion</router-link>.
        </p>
      </section>

      <!-- More shortcuts -->
      <section class="dash-section">
        <div class="dash-tiles">
          <router-link v-for="tile in tiles" :key="tile.title" :to="tile.to" class="dash-tile">
            <img :src="tile.image" alt="" />
            <span><v-icon size="20" class="mr-2">{{ tile.icon }}</v-icon>{{ tile.title }}</span>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import EventListCard from "@/components/EventListCard.vue";
import underkeepImage from "@/assets/underkeep.png";
import underkeep2Image from "@/assets/underkeep2.png";

const ASSETS = "https://assets.drunagor.app";

const router = useRouter();
const userStore = useUserStore();
const axios: any = inject("axios");

const timezone = computed(() => userStore.user?.timezone?.iana_name ?? "America/Chicago");
const avatarUrl = computed(() =>
  userStore.user?.picture_hash
    ? `${ASSETS}/Profile/${userStore.user.picture_hash}`
    : `${ASSETS}/Profile/user.png`,
);

const mainCards = [
  { title: "Companion", image: `${ASSETS}/Dashboard/btn-companion.png`, to: "/campaign-tracker/" },
  { title: "SKU's Manager", image: `${ASSETS}/Dashboard/btn-skusmannager.png`, to: "/library" },
  { title: "My Profile", image: `${ASSETS}/Dashboard/btn-profile3.png`, to: "/profile/home" },
  { title: "Events", image: `${ASSETS}/Dashboard/btn-events3.png`, to: "/events" },
];

const tiles = [
  { title: "FRIENDS", icon: "mdi-account-group", image: `${ASSETS}/Library/bg-heropack.png`, to: "/socialhub" },
  { title: "MY HEROES", icon: "mdi-shield-account", image: `${ASSETS}/Library/bg-corebox.png`, to: "/campaign-tracker/heroes" },
  { title: "COMMUNITY BUILDS", icon: "mdi-hammer-wrench", image: `${ASSETS}/Dashboard/btn-CB-desk.png`, to: "/community-builds" },
  { title: "SETTINGS", icon: "mdi-cog", image: `${ASSETS}/Library/bg-shadowworld.png`, to: "/profile/settings" },
];

// Quick navigation from the search box.
const searchItems = [
  ...mainCards.map((card) => ({ id: card.title, title: card.title, to: card.to })),
  ...tiles.map((tile) => ({ id: tile.title, title: tile.title.replace(/\b\w+/g, (w) => w[0] + w.slice(1).toLowerCase()), to: tile.to })),
  { id: "Library", title: "Library", to: "/library" },
  { id: "Campaigns", title: "Campaigns", to: "/campaign-tracker/" },
];
const searchTarget = ref<string | null>(null);
const goToSearchTarget = (id: string | null) => {
  const item = searchItems.find((entry) => entry.id === id);
  if (item) router.push(item.to);
};

// Events: upcoming events and the ones the player joined.
const nextEvents = ref<any[]>([]);
const joinedEvents = ref<any[]>([]);
const loadingEvents = ref(true);
const eventColumns = computed(() => [
  { title: "NEXT", events: nextEvents.value, empty: "No upcoming events." },
  { title: "COUNT ME IN", events: joinedEvents.value, empty: "You have not joined any event yet." },
]);

const byDate = (a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime();

const loadEvents = async () => {
  const playerFk = userStore.user?.users_pk;
  const [next, joined] = await Promise.allSettled([
    axios.get("/events/list_events/", { params: { player_fk: playerFk, past_events: "false" } }),
    axios.get("/events/my_events/player", { params: { player_fk: playerFk, past_events: "false", limit: 30, offset: 0 } }),
  ]);
  if (next.status === "fulfilled") nextEvents.value = (next.value.data.events || []).sort(byDate).slice(0, 3);
  if (joined.status === "fulfilled") joinedEvents.value = (joined.value.data.events || []).sort(byDate).slice(0, 3);
  loadingEvents.value = false;
};

// Recent campaigns from both seasons, most recently saved first.
type CampaignCard = { id: string; name: string; subtitle: string; boxLabel: string; image: string };
const campaigns = ref<CampaignCard[]>([]);
const loadingCampaigns = ref(true);

const CAMPAIGN_BOXES: Record<string, { label: string; image: string }> = {
  core: { label: "CORE", image: `${ASSETS}/CampaignTracker/CoreCompanion.webp` },
  apocalypse: { label: "APOCALYPSE", image: `${ASSETS}/CampaignTracker/ApocCompanion.webp` },
  awakenings: { label: "AWAKENINGS", image: `${ASSETS}/CampaignTracker/AwakComapanion.webp` },
  underkeep: { label: "UNDERKEEP", image: underkeepImage },
  underkeep2: { label: "UNDERKEEP 2", image: underkeep2Image },
};

const toCampaignCard = (raw: any) => {
  let parsed: any = null;
  try {
    parsed = raw.tracker_hash ? JSON.parse(atob(raw.tracker_hash)) : null;
  } catch {
    parsed = null;
  }
  const data = parsed?.campaignData ?? {};
  const type = data.campaign || (raw.box === 38 ? "underkeep" : raw.box === 39 ? "underkeep2" : "core");
  const box = CAMPAIGN_BOXES[type] ?? CAMPAIGN_BOXES.core;
  const savedAt = Math.max(
    parsed?.savedAt ? new Date(parsed.savedAt).getTime() : 0,
    raw.start_date ? new Date(raw.start_date).getTime() : 0,
  );
  return {
    savedAt,
    card: {
      id: String(raw.campaigns_fk),
      name: raw.party_name || data.name || "Unnamed Campaign",
      subtitle: [data.wing, data.door].filter(Boolean).join(" · "),
      boxLabel: box.label,
      image: box.image,
    },
  };
};

const loadCampaigns = async () => {
  const usersFk = userStore.user?.users_pk;
  const results = await Promise.allSettled(
    [false, true].map((showSeason2) =>
      axios.get("/rl_campaigns_users/search", { params: { users_fk: usersFk, show_season2: showSeason2 } }),
    ),
  );
  const raws = results.flatMap((result) => (result.status === "fulfilled" ? result.value.data?.campaigns || [] : []));
  const unique = new Map<string, { savedAt: number; card: CampaignCard }>();
  raws.forEach((raw: any) => {
    const entry = toCampaignCard(raw);
    if (!unique.has(entry.card.id)) unique.set(entry.card.id, entry);
  });
  campaigns.value = [...unique.values()]
    .sort((a, b) => b.savedAt - a.savedAt)
    .slice(0, 10)
    .map((entry) => entry.card);
  loadingCampaigns.value = false;
};

onMounted(() => {
  loadEvents();
  loadCampaigns();
});
</script>

<style scoped>
.desktop-dash {
  padding: 72px 16px 48px;
  font-family: "Poppins", sans-serif;
  color: #fff;
}
.desktop-dash__container {
  max-width: 960px;
  margin: 0 auto;
  background: rgba(20, 20, 20, 0.92);
  padding: 0 16px 24px;
}
.dash-header {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 88px;
  margin: 0 -16px 16px;
  padding: 0 32px;
  background: #2f2f2f;
}
.dash-header__avatar {
  width: 128px;
  height: 128px;
  margin-top: -40px;
  object-fit: cover;
  background: #000;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
}
.dash-header__name {
  font-size: 1.4rem;
  font-weight: 700;
  text-transform: uppercase;
}
.dash-search {
  margin-bottom: 16px;
}
.dash-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.dash-card {
  display: block;
  aspect-ratio: 944 / 1420;
  overflow: hidden;
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
.dash-section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}
.dash-section__head h2 {
  font-size: 1.1rem;
  font-weight: 700;
}
.dash-section__link {
  font-size: 0.8rem;
  color: #bdbdbd;
}
.dash-events {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.dash-events__column {
  background: #2f2f2f;
  padding: 12px;
}
.dash-events__column h3 {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 8px;
}
/* Compact event cards: the Events page stretches them to fill its grid. */
.dash-events__column :deep(.event-list-card) {
  height: auto;
  min-height: 84px;
}
.dash-events__column :deep(.event-list-card__day) {
  font-size: 1.8rem;
}
.dash-empty {
  font-size: 0.85rem;
  color: #9e9e9e;
  padding: 12px 0;
}
.dash-campaign {
  width: 300px;
  margin-right: 12px;
  background: #2f2f2f;
  cursor: pointer;
  overflow: hidden;
}
.dash-campaign__img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-bottom: 3px solid #bca341;
}
.dash-campaign__info {
  display: flex;
  flex-direction: column;
  padding: 8px 12px 10px;
  font-size: 0.8rem;
  line-height: 1.35;
}
.dash-campaign__info strong {
  font-size: 1rem;
}
.dash-campaign__box {
  font-weight: 700;
  text-transform: uppercase;
}
.dash-tiles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.dash-tile {
  position: relative;
  display: flex;
  align-items: center;
  height: 64px;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
}
.dash-tile img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  filter: brightness(0.55);
  transition: filter 0.2s ease;
}
.dash-tile:hover img {
  filter: brightness(0.8);
}
.dash-tile span {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 16px;
  font-weight: 700;
  font-size: 0.95rem;
}
</style>
