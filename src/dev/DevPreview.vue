<template>
  <div class="dev-preview">
    <v-sheet v-if="current" class="dev-toolbar d-flex align-center ga-2 px-3 py-2" color="grey-darken-4">
      <v-btn size="small" variant="text" prepend-icon="mdi-arrow-left" :to="{ name: 'DevPreview' }">Dev Preview</v-btn>
      <v-divider vertical class="mx-1" />
      <span class="text-body-2 font-weight-bold text-truncate">{{ current.title }}</span>
      <v-spacer />
      <v-chip size="x-small" :color="current.role === 'retailer' ? 'blue' : 'green'" variant="flat">
        {{ current.role === "retailer" ? "Retailer" : "Player" }}
      </v-chip>
    </v-sheet>

    <!-- Hub -->
    <v-container v-if="!current" max-width="960" class="py-8">
      <div class="d-flex align-center ga-2 mb-1">
        <h1 class="text-h5 font-weight-bold">Dev Preview</h1>
        <v-spacer />
        <v-chip size="small" :color="appEnv === 'test' ? 'green' : 'red'" variant="flat">App API: {{ appEnv }}</v-chip>
      </div>
      <p class="text-body-2 text-grey mb-6">
        Real screens running on a fake API and a fake user: previews never reach the backend, and your real
        session, heroes and campaigns are restored when you leave. Only the Test tools write data, and only
        to the test database. Dev mode only.
      </p>

      <section v-for="group in groups" :key="group.title" class="mb-8">
        <h2 class="text-subtitle-1 font-weight-bold text-uppercase text-amber-accent-4 mb-3">{{ group.title }}</h2>
        <v-row dense>
          <v-col v-for="item in group.items" :key="item.id" cols="12" sm="6" md="4">
            <v-card class="h-100 d-flex flex-column" color="grey-darken-4" :to="item.to ?? screenRoute(item.id)">
              <v-card-title class="d-flex align-center text-body-1 font-weight-bold">
                <v-icon start size="small">{{ item.icon }}</v-icon> {{ item.title }}
              </v-card-title>
              <v-card-text class="text-body-2 text-grey-lighten-1 flex-grow-1">{{ item.description }}</v-card-text>
              <v-card-actions v-if="item.to" class="pt-0 px-4">
                <span class="text-caption text-grey">Real page, no fake data</span>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </section>
    </v-container>

    <!-- Player -->
    <DesktopDash v-else-if="screen === 'dashboard'" />

    <UserDash v-else-if="screen === 'dashboard-mobile'" />

    <UserEvents v-else-if="screen === 'events'" />

    <CampaignOverviewView v-else-if="screen === 'campaigns'" />

    <CampaignView v-else-if="screen === 'campaign'" :key="String(route.params.id)" />

    <Lobby v-else-if="screen === 'lobby'" />

    <v-container v-else-if="screen === 'hero-prep'" max-width="700" class="py-6">
      <div class="d-flex align-center ga-2 mb-4">
        <span class="text-body-2">Season:</span>
        <v-btn-toggle v-model="season" mandatory density="compact" color="amber-accent-4">
          <v-btn value="s1">S1</v-btn>
          <v-btn value="s2">S2</v-btn>
        </v-btn-toggle>
      </div>
      <div class="d-flex flex-wrap ga-2">
        <v-btn v-for="hero in HERO_NAMES" :key="hero" @click="openPreparation(hero)">{{ hero }}</v-btn>
      </div>
      <HeroPreparationDialog v-model="preparationDialog" :hero-name="preparedHero" :season="season" />
    </v-container>

    <v-container v-else-if="screen === 'first-setup'" max-width="900" class="py-6">
      <AssemblyGuide :steps="firstSetupSteps" finish-label="Continue to Start Here" @finish="finished = true" />
      <v-alert v-if="finished" type="success" variant="tonal" class="mt-4">
        In the campaign, this opens the Start Here book.
      </v-alert>
    </v-container>

    <DevGameplay v-else-if="screen === 'gameplay'" />

    <DevEffects v-else-if="screen === 'effects'" />

    <!-- Retailer -->
    <template v-else-if="screen === 'event'">
      <v-container max-width="700" class="py-6 text-center">
        <v-btn color="amber-accent-4" @click="eventDialog = true">Open event management</v-btn>
      </v-container>
      <ManageEventDialog v-model="eventDialog" :event="DEV_EVENT" />
    </template>

    <v-container v-else-if="screen === 'table-assembly'" max-width="900" class="py-6">
      <AssemblyGuide :steps="tableAssemblySteps" />
    </v-container>

    <AssemblyTutorial v-else-if="screen === 'assembly-tutorial'" />

    <!-- Test tools -->
    <DevTestData v-else-if="screen === 'test-data'" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AssemblyGuide from "@/components/AssemblyGuide.vue";
import DevEffects from "@/dev/DevEffects.vue";
import CampaignOverviewView from "@/components/CampaignOverviewView.vue";
import CampaignView from "@/components/CampaignView.vue";
import Lobby from "@/components/Lobby.vue";
import UserEvents from "@/components/UserEvents.vue";
import DesktopDash from "@/components/DesktopDash.vue";
import UserDash from "@/components/UserDash.vue";
import HeroPreparationDialog from "@/components/dialogs/HeroPreparationDialog.vue";
import ManageEventDialog from "@/components/dialogs/ManageEventDialog.vue";
import AssemblyTutorial from "@/pages/AssemblyTutorial.vue";
import DevGameplay from "@/dev/DevGameplay.vue";
import DevTestData from "@/dev/DevTestData.vue";
import { resolveApiEnv } from "@/dev/apiEnv";
import { tableAssemblySteps } from "@/data/assembly/tableAssembly";
import { firstSetupSteps } from "@/data/assembly/firstSetup";
import { DEV_EVENT, DEV_EVENT_PK, DEV_TABLE_PK } from "@/dev/mockApi";
import { enterDevSandbox, leaveDevSandbox, setDevRole, type DevRole } from "@/dev/devSandbox";

type Screen = {
  id: string;
  title: string;
  description: string;
  icon: string;
  role: DevRole;
  to?: string;
};

const groups: { title: string; items: Screen[] }[] = [
  {
    title: "Player journey",
    items: [
      { id: "dashboard", title: "Dashboard (desktop)", icon: "mdi-view-dashboard", role: "player", description: "The management dashboard shown on PC and large tablets: shortcuts, events, recent campaigns and more." },
      { id: "dashboard-mobile", title: "Dashboard (mobile)", icon: "mdi-cellphone", role: "player", description: "The play-first dashboard shown on phones, with its Events / My Events tabs. Open it at phone width." },
      { id: "events", title: "Events", icon: "mdi-calendar-search", role: "player", description: "Player events list (I'M IN / NEXT / ALL, sorting) and the event detail with Share event and Count me in." },
      { id: "lobby", title: "Event Lobby", icon: "mdi-account-group", role: "player", description: "Table with other players. Pick a hero from Choose your Hero or Create New Hero, confirm it and see the preparation popup." },
      { id: "hero-prep", title: "Hero Preparation", icon: "mdi-sword", role: "player", description: "The Prepare your Hero popup for any hero and season, without going through the lobby." },
      { id: "first-setup", title: "First Setup Guide", icon: "mdi-map", role: "player", description: "Room assembly steps the player sees when entering the campaign." },
      { id: "gameplay", title: "Gameplay", icon: "mdi-dice-multiple", role: "player", description: "Campaign screen at the First Setup door, with Vorn, Lorelai and Maya. Opens the First Setup guide, then the Start Here book." },
      { id: "campaigns", title: "Campaign list", icon: "mdi-format-list-bulleted", role: "player", description: "Many campaigns (Core, Apocalypse, Awakenings and Drunagor Nights) to check the list and how it loads." },
      { id: "campaign", title: "Legacy campaign", icon: "mdi-sword", role: "player", description: "A Core campaign: the navigation bar on PC and the Add hero dialog." },
      { id: "effects", title: "Aura / Status / Outcome", icon: "mdi-auto-fix", role: "player", description: "The hero effect pickers from the campaign sheet, with Core data." },
    ],
  },
  {
    title: "Retailer journey",
    items: [
      { id: "event", title: "Event Management", icon: "mdi-calendar-star", role: "retailer", description: "Event lobby dialog with details, tables, the Table Assembly tab and players." },
      { id: "table-assembly", title: "Table Assembly", icon: "mdi-table-furniture", role: "retailer", description: "Act 2 guide on its own (image placeholders until design delivers)." },
      { id: "assembly-tutorial", title: "'Setup the Game Table' QR page", icon: "mdi-qrcode", role: "retailer", description: "The /assembly-tutorial page as a logged-in retailer." },
      { id: "retailer-tutorial", title: "'Assemble your OP Kit' QR page", icon: "mdi-package-variant", role: "retailer", to: "/retailer-tutorial", description: "Retailer tutorial page (Act 1 entry point)." },
      { id: "box-assembly", title: "Box Assembly Guide", icon: "mdi-archive", role: "retailer", to: "/box-assembly-guide", description: "Act 1: organizing the OP Kit." },
    ],
  },
];

groups.push({
  title: "Test tools",
  items: [
    { id: "test-data", title: "Test Data Generator", icon: "mdi-database-plus", role: "retailer", description: "Create real events and tables in the TEST database as the retailer tester, pick the wing, and open the lobbies to play." },
  ],
});

const allScreens = groups.flatMap((group) => group.items);
const appEnv = resolveApiEnv("prod");
const HERO_NAMES = ["Vorn", "Lorelai", "Jaheen", "Maya", "Elros"];

const route = useRoute();
const screen = computed(() => String((route.params as Record<string, string>).screen || ""));
const current = computed(() => allScreens.find((item) => item.id === screen.value && !item.to));

// The Core campaign from the fake campaign list.
const DEV_CAMPAIGN_PK = "900104";

const screenRoute = (id: string) =>
  id === "lobby"
    ? { name: "DevPreview", params: { screen: "lobby", id: DEV_EVENT_PK }, query: { table_pk: DEV_TABLE_PK } }
    : id === "campaign"
      ? { name: "DevPreview", params: { screen: "campaign", id: DEV_CAMPAIGN_PK } }
      : { name: "DevPreview", params: { screen: id } };

// Runs in setup, before any real screen mounts and calls the API.
enterDevSandbox(current.value?.role ?? "player");
watch(current, (item) => item && setDevRole(item.role));
onBeforeUnmount(leaveDevSandbox);

const season = ref<"s1" | "s2">("s1");
const preparationDialog = ref(false);
const preparedHero = ref("");
const finished = ref(false);
// ManageEventDialog loads its data when it opens, so open it after mounting.
const eventDialog = ref(false);

const openPreparation = (heroName: string) => {
  preparedHero.value = heroName;
  preparationDialog.value = true;
};

watch(
  screen,
  async (value) => {
    finished.value = false;
    eventDialog.value = false;
    if (value === "event") {
      await nextTick();
      eventDialog.value = true;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
/* Sits right below the fixed app bar (48px desktop with its border, 56px mobile). The app
   already pads the page by 20px on desktop and not at all on mobile. */
.dev-toolbar {
  position: sticky;
  top: 48px;
  margin-top: 28px;
  z-index: 20;
}
@media (max-width: 959px) {
  .dev-toolbar {
    top: calc(56px + env(safe-area-inset-top, 0px));
    margin-top: calc(56px + env(safe-area-inset-top, 0px));
  }
}
</style>
