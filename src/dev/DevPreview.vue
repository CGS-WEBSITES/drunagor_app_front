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
      <h1 class="text-h5 font-weight-bold mb-1">Dev Preview</h1>
      <p class="text-body-2 text-grey mb-6">
        Real screens running on a fake API and a fake user. Nothing here reaches the backend,
        and your real session, heroes and campaigns are restored when you leave. Dev mode only.
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
    <UserEvents v-else-if="screen === 'events'" />

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
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AssemblyGuide from "@/components/AssemblyGuide.vue";
import Lobby from "@/components/Lobby.vue";
import UserEvents from "@/components/UserEvents.vue";
import HeroPreparationDialog from "@/components/dialogs/HeroPreparationDialog.vue";
import ManageEventDialog from "@/components/dialogs/ManageEventDialog.vue";
import AssemblyTutorial from "@/pages/AssemblyTutorial.vue";
import DevGameplay from "@/dev/DevGameplay.vue";
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
      { id: "events", title: "Events", icon: "mdi-calendar-search", role: "player", description: "Player events list (I'M IN / NEXT / ALL, sorting) and the event detail with Share event and Count me in." },
      { id: "lobby", title: "Event Lobby", icon: "mdi-account-group", role: "player", description: "Table with other players. Pick a hero from Choose your Hero or Create New Hero, confirm it and see the preparation popup." },
      { id: "hero-prep", title: "Hero Preparation", icon: "mdi-sword", role: "player", description: "The Prepare your Hero popup for any hero and season, without going through the lobby." },
      { id: "first-setup", title: "First Setup Guide", icon: "mdi-map", role: "player", description: "Room assembly steps the player sees when entering the campaign." },
      { id: "gameplay", title: "Gameplay", icon: "mdi-dice-multiple", role: "player", description: "Campaign screen at the First Setup door, with Vorn, Lorelai and Maya. Opens the First Setup guide, then the Start Here book." },
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

const allScreens = groups.flatMap((group) => group.items);
const HERO_NAMES = ["Vorn", "Lorelai", "Jaheen", "Maya", "Elros"];

const route = useRoute();
const screen = computed(() => String((route.params as Record<string, string>).screen || ""));
const current = computed(() => allScreens.find((item) => item.id === screen.value && !item.to));

const screenRoute = (id: string) =>
  id === "lobby"
    ? { name: "DevPreview", params: { screen: "lobby", id: DEV_EVENT_PK }, query: { table_pk: DEV_TABLE_PK } }
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
.dev-toolbar {
  position: sticky;
  top: 0;
  z-index: 20;
}
</style>
