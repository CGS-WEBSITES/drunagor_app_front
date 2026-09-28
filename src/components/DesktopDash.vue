<template>
  <div class="desktop-dash">
    <div class="desktop-dash__container">
      <!-- Profile header -->
      <header class="dash-header">
        <router-link to="/profile/home" class="dash-header__avatar" title="My Profile">
          <img :src="avatarUrl" alt="" />
        </router-link>
        <h1 class="dash-header__name">{{ userStore.user.user_name || "Drunagor User" }}</h1>
      </header>

      <!-- Main shortcuts -->
      <div class="dash-cards">
        <router-link v-for="card in mainCards" :key="card.title" :to="card.to" class="dash-card">
          <img :src="card.image" :alt="card.title" />
        </router-link>
      </div>

      <!-- Events -->
      <section class="dash-section">
        <router-link to="/events" class="dash-section__title">EVENTS <v-icon size="18">mdi-chevron-right</v-icon></router-link>
        <div class="dash-panel">
          <div v-if="loadingEvents" class="d-flex justify-center py-6">
            <v-progress-circular indeterminate size="28" />
          </div>
          <div v-else-if="events.length" class="dash-events">
            <EventListCard
              v-for="event in events"
              :key="event.events_pk"
              :event="event"
              :timezone="timezone"
              @open="router.push('/events')"
            />
          </div>
          <p v-else class="dash-empty">No upcoming events.</p>
        </div>
      </section>

      <!-- More shortcuts -->
      <section class="dash-section">
        <div class="dash-shortcuts">
          <router-link v-for="item in shortcuts" :key="item.title" :to="item.to" class="dash-shortcut">
            <img :src="item.image" alt="" />
            <span><v-icon size="20" class="mr-2">{{ item.icon }}</v-icon>{{ item.title }}</span>
          </router-link>
        </div>
      </section>

      <!-- Recent campaigns -->
      <section class="dash-section">
        <router-link to="/campaign-tracker/" class="dash-section__title">
          RECENT CAMPAIGNS <v-icon size="18">mdi-chevron-right</v-icon>
        </router-link>
        <div v-if="loadingCampaigns" class="d-flex justify-center py-6">
          <v-progress-circular indeterminate size="28" />
        </div>
        <v-slide-group v-else-if="campaigns.length" show-arrows class="dash-campaigns">
          <v-slide-group-item v-for="campaign in campaigns" :key="campaign.id">
            <div class="dash-campaign" @click="router.push(`/campaign-tracker/campaign/${campaign.id}`)">
              <img :src="campaign.image" alt="" class="dash-campaign__img" />
              <div class="dash-campaign__info">
                <strong class="text-truncate">{{ campaign.name }}</strong>
                <span class="text-truncate">{{ campaign.game }}</span>
                <span class="dash-campaign__box text-truncate">{{ campaign.detail }}</span>

                <div class="dash-campaign__party">
                  <div class="dash-campaign__members">
                    <template v-if="campaign.isUnderkeep">
                      <div v-for="player in campaign.players" :key="player.name" class="dash-member" :title="player.name">
                        <img v-if="player.avatar" :src="player.avatar" alt="" />
                        <v-icon v-else size="16">mdi-account</v-icon>
                        <span>{{ player.name }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <div v-for="hero in campaign.heroes" :key="hero.id" class="dash-member dash-member--hero" :title="hero.name">
                        <img :src="hero.avatar" alt="" />
                      </div>
                    </template>
                  </div>
                  <span v-if="campaign.isUnderkeep" class="dash-campaign__progress">{{ campaign.progress }}%</span>
                </div>
                <v-progress-linear
                  v-if="campaign.isUnderkeep"
                  :model-value="campaign.progress"
                  color="accent"
                  height="3"
                  rounded
                  class="mt-1"
                />
              </div>
            </div>
          </v-slide-group-item>
        </v-slide-group>
        <p v-else class="dash-empty">No campaigns yet. Start one from the Companion.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { calculateCompletionPercentage } from "@/utils/campaignProgress";
import EventListCard from "@/components/EventListCard.vue";
import underkeepImage from "@/assets/underkeep.png";
import underkeep2Image from "@/assets/underkeep2.png";

const ASSETS = "https://assets.drunagor.app";

const router = useRouter();
const userStore = useUserStore();
const axios: any = inject("axios");
const heroRepository = new HeroDataRepository();

const timezone = computed(() => userStore.user?.timezone?.iana_name ?? "America/Chicago");
const avatarUrl = computed(() =>
  userStore.user?.picture_hash
    ? `${ASSETS}/Profile/${userStore.user.picture_hash}`
    : `${ASSETS}/Profile/user.png`,
);
const isRetailer = computed(() => userStore.user?.roles_fk === 3);

const mainCards = computed(() => [
  { title: "Companion", image: `${ASSETS}/Dashboard/btn-companion.png`, to: "/campaign-tracker/" },
  isRetailer.value
    ? { title: "SKU's Manager", image: `${ASSETS}/Dashboard/btn-skusmannager.png`, to: "/library" }
    : { title: "Library", image: `${ASSETS}/Dashboard/btn-library3.png`, to: "/library" },
  { title: "My Profile", image: `${ASSETS}/Dashboard/btn-profile3.png`, to: "/profile/home" },
  { title: "Events", image: `${ASSETS}/Dashboard/btn-events3.png`, to: "/events" },
]);

const shortcuts = [
  { title: "FRIENDS", icon: "mdi-account-group", image: `${ASSETS}/Dashboard/btn-apoc.png`, to: "/socialhub" },
  { title: "MY HEROES", icon: "mdi-shield-account", image: `${ASSETS}/Dashboard/btn-heropack.png`, to: "/campaign-tracker/heroes" },
  { title: "COMMUNITY BUILDS", icon: "mdi-hammer-wrench", image: `${ASSETS}/Dashboard/btn-spoils.png`, to: "/community-builds" },
  { title: "SETTINGS", icon: "mdi-cog", image: `${ASSETS}/Dashboard/btn-horseman.png`, to: "/profile/settings" },
];

// Next upcoming events.
const events = ref<any[]>([]);
const loadingEvents = ref(true);

const loadEvents = async () => {
  try {
    const { data } = await axios.get("/events/list_events/", {
      params: { player_fk: userStore.user?.users_pk, past_events: "false" },
    });
    events.value = (data.events || [])
      .sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      .slice(0, 4);
  } catch (error) {
    console.error("[DesktopDash] Failed to load events", error);
  } finally {
    loadingEvents.value = false;
  }
};

// Recent campaigns from both seasons, most recently saved first.
type Member = { name: string; avatar: string | null };
type HeroAvatar = { id: string; name: string; avatar: string };
type CampaignCard = {
  id: string;
  name: string;
  game: string;
  detail: string;
  image: string;
  isUnderkeep: boolean;
  progress: number;
  heroes: HeroAvatar[];
  players: Member[];
};
const campaigns = ref<CampaignCard[]>([]);
const loadingCampaigns = ref(true);

const BOXES: Record<string, { label: string; game: string; image: string }> = {
  core: { label: "CORE BOX", game: "CoD: Age of Darkness", image: `${ASSETS}/CampaignTracker/CoreCompanion.webp` },
  apocalypse: { label: "APOCALYPSE", game: "CoD: Age of Darkness", image: `${ASSETS}/CampaignTracker/ApocCompanion.webp` },
  awakenings: { label: "AWAKENINGS", game: "CoD: Age of Darkness", image: `${ASSETS}/CampaignTracker/AwakComapanion.webp` },
  underkeep: { label: "UNDERKEEP", game: "Drunagor Nights · Season 1", image: underkeepImage },
  underkeep2: { label: "UNDERKEEP 2", game: "Drunagor Nights · Season 2", image: underkeep2Image },
};

const heroAvatar = (heroId: string): HeroAvatar | null => {
  const hero = heroRepository.find(heroId);
  return hero ? { id: hero.id, name: hero.name, avatar: hero.images.avatar } : null;
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
  const box = BOXES[type] ?? BOXES.core;
  const isUnderkeep = type === "underkeep" || type === "underkeep2";
  const savedAt = Math.max(
    parsed?.savedAt ? new Date(parsed.savedAt).getTime() : 0,
    raw.start_date ? new Date(raw.start_date).getTime() : 0,
  );
  const card: CampaignCard = {
    id: String(raw.campaigns_fk),
    name: raw.party_name || data.name || "Unnamed Campaign",
    game: box.game,
    detail: isUnderkeep ? [data.wing, data.door].filter(Boolean).join(" · ") || box.label : box.label,
    image: box.image,
    isUnderkeep,
    progress: isUnderkeep ? calculateCompletionPercentage(data) : 0,
    heroes: (parsed?.heroes || [])
      .map((hero: any) => heroAvatar(hero.heroId))
      .filter((hero: HeroAvatar | null): hero is HeroAvatar => !!hero),
    players: [],
  };
  return { savedAt, card };
};

// Underkeep campaigns list their players with the hero each one plays.
const loadPlayers = async (card: CampaignCard) => {
  try {
    const { data } = await axios.get("/rl_campaigns_users/list_players", { params: { campaigns_fk: card.id } });
    const players = data.Users || [];
    card.players = await Promise.all(
      players.map(async (player: any): Promise<Member> => {
        let avatar: string | null = null;
        if (player.playable_heroes_fk) {
          try {
            const res = await axios.get(`/playable_heroes/${player.playable_heroes_fk}`);
            const heroId = JSON.parse(atob(res.data.hero_hash)).heroId;
            avatar = heroAvatar(heroId)?.avatar ?? null;
          } catch {
            avatar = null;
          }
        }
        return { name: player.user_name, avatar };
      }),
    );
  } catch (error) {
    console.warn(`[DesktopDash] Failed to load players for campaign ${card.id}`, error);
  }
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

  await Promise.allSettled(campaigns.value.filter((card) => card.isUnderkeep).map(loadPlayers));
};

onMounted(() => {
  loadEvents();
  loadCampaigns();
});
</script>

<style scoped>
.desktop-dash {
  padding: 112px 16px 48px;
  font-family: "Poppins", sans-serif;
  color: rgb(var(--v-theme-on-surface));
}
.desktop-dash__container {
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
  border-radius: 16px;
  overflow: hidden;
  background: rgb(var(--v-theme-background));
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease;
}
.dash-header__avatar:hover {
  transform: translateY(-2px);
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
.dash-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.dash-card {
  display: block;
  aspect-ratio: 944 / 1420;
  border-radius: 12px;
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
.dash-section__title {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  color: inherit;
  text-decoration: none;
}
.dash-section__title:hover {
  opacity: 0.8;
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
  min-height: 84px;
}
.dash-events :deep(.event-list-card__day) {
  font-size: 1.8rem;
}
.dash-empty {
  margin: 0;
  padding: 12px 0;
  font-size: 0.85rem;
  opacity: 0.7;
}
.dash-shortcuts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
/* Strip buttons (476x54 art) with the label on top. */
.dash-shortcut {
  position: relative;
  display: flex;
  align-items: center;
  aspect-ratio: 476 / 54;
  min-height: 48px;
  border-radius: 10px;
  overflow: hidden;
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
  transition: filter 0.2s ease;
}
.dash-shortcut:hover {
  transform: translateY(-2px);
}
.dash-shortcut:hover img {
  filter: brightness(1.25);
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
.dash-campaign {
  width: 290px;
  margin-right: 12px;
  background: rgb(var(--v-theme-primary));
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.dash-campaign:hover {
  transform: translateY(-2px);
}
.dash-campaign__img {
  display: block;
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-bottom: 3px solid rgb(var(--v-theme-accent));
}
.dash-campaign__info {
  display: flex;
  flex-direction: column;
  padding: 8px 12px 12px;
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
.dash-campaign__party {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  margin-top: 8px;
}
.dash-campaign__members {
  display: flex;
  flex: 1;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
}
.dash-member {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  padding-right: 8px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 999px;
  font-size: 0.7rem;
  white-space: nowrap;
}
.dash-member--hero {
  padding-right: 0;
}
.dash-member img,
.dash-member .v-icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
}
.dash-campaign__progress {
  font-weight: 700;
  color: rgb(var(--v-theme-accent));
}
</style>
