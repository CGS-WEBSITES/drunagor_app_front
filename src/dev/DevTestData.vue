<template>
  <v-container max-width="760" class="py-6 d-flex flex-column ga-4">
    <v-alert type="warning" variant="tonal" density="compact">
      Everything here is created for real in the <strong>TEST</strong> database
      ({{ TEST_API_URL }}), always as the retailer tester account, whatever account you are logged in with.
    </v-alert>

    <!-- App API -->
    <v-card color="grey-darken-4">
      <v-card-title class="text-body-1 font-weight-bold">App API</v-card-title>
      <v-card-text class="d-flex flex-wrap align-center ga-3">
        <span>
          This local app is using the
          <v-chip size="small" :color="appEnv === 'test' ? 'green' : 'red'" variant="flat">{{ appEnv }}</v-chip>
          API.
        </span>
        <v-btn v-if="appEnv !== 'test'" size="small" color="green" @click="switchApiEnv('test')">Use test API</v-btn>
        <v-btn v-else size="small" variant="outlined" @click="switchApiEnv('prod')">Back to prod API</v-btn>
        <span v-if="appUser" class="text-body-2">
          Logged in as <strong>{{ appUser.user_name }}</strong> (#{{ appUser.users_pk }}).
        </span>
        <span v-else class="text-body-2 text-grey">Not logged in.</span>
        <p class="text-caption text-grey w-100 mb-0">
          Generated events only exist on test. To open the lobby links, switch to the test API and log in
          with a player account from the test database. Switching logs you out.
        </p>
      </v-card-text>
    </v-card>

    <!-- How to playtest Drunagor Nights -->
    <v-card color="grey-darken-4">
      <v-card-title class="text-body-1 font-weight-bold">Drunagor Nights playtest</v-card-title>
      <v-card-text>
        <ol class="text-body-2 pl-4 nights-steps">
          <li>Use the test API and log in with your player account (e.g. DuduFlu2).</li>
          <li>Log in as the tester below and generate an event for a Nights wing (1 table is enough).</li>
          <li>Open the table's lobby first, so you are its leader.</li>
          <li>Back here, add 1–3 bot players: they sit at your table with a Core hero already picked.</li>
          <li>In the lobby pick your hero, Start game and create (or load) the campaign: it opens in the immersive view.</li>
        </ol>
        <p class="text-caption text-grey mb-0">
          Bots are test accounts named zz_nights_bot1…6. The lobby lists players by name and the first one leads, so
          keep your user name before "zz".
        </p>
      </v-card-text>
    </v-card>

    <!-- Tester account -->
    <v-card color="grey-darken-4">
      <v-card-title class="text-body-1 font-weight-bold">Retailer tester account</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field v-model="credentials.login" label="Email" density="compact" hide-details />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="credentials.password" label="Password" type="password" density="compact" hide-details />
          </v-col>
        </v-row>
        <div class="d-flex flex-wrap ga-2 mt-3">
          <v-btn color="amber-accent-4" :loading="busy === 'login'" :disabled="!canLogin" @click="login">Log in</v-btn>
          <v-btn variant="outlined" :loading="busy === 'register'" :disabled="!canLogin" @click="register">
            Create tester account
          </v-btn>
        </div>
        <p v-if="tester" class="text-caption text-green mt-2 mb-0">
          Logged in on test as {{ tester.user_name }} (#{{ tester.users_pk }}).
        </p>
        <p class="text-caption text-grey mt-1 mb-0">Credentials are remembered only in this browser.</p>
      </v-card-text>
    </v-card>

    <!-- Generate event -->
    <v-card color="grey-darken-4" :disabled="!tester">
      <v-card-title class="text-body-1 font-weight-bold">Generate an event</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="8">
            <v-select
              v-model="form.sceneryPk"
              :items="sceneries"
              item-title="name"
              item-value="sceneries_pk"
              label="Wing / scenario"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select v-model="form.seasonFk" :items="seasons" label="Season" density="compact" hide-details />
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field v-model="form.date" type="date" label="Date" density="compact" hide-details />
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field v-model="form.time" type="time" label="Time" density="compact" hide-details />
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field v-model.number="form.tables" type="number" min="1" max="10" label="Tables" density="compact" hide-details />
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field v-model.number="form.maxPlayers" type="number" min="1" max="6" label="Players per table" density="compact" hide-details />
          </v-col>
        </v-row>
        <v-btn class="mt-4" block color="green" :loading="busy === 'generate'" :disabled="!form.sceneryPk" @click="generate">
          Generate event
        </v-btn>
        <p v-for="(step, i) in steps" :key="i" class="text-caption text-grey mt-2 mb-0">{{ step }}</p>
      </v-card-text>
    </v-card>

    <!-- Results -->
    <v-card v-for="result in results" :key="result.eventPk" color="grey-darken-4">
      <v-card-title class="text-body-1 font-weight-bold">
        Event #{{ result.eventPk }} · {{ result.storeName }}
      </v-card-title>
      <v-card-text>
        <div v-for="table in result.tables" :key="table.tablePk" class="mb-3">
          <div class="d-flex flex-wrap align-center ga-2">
            <span class="text-body-2">Table {{ table.tableNumber }}</span>
            <v-spacer />
            <v-btn size="small" variant="text" icon="mdi-content-copy" title="Copy lobby link" @click="copy(table.lobbyPath)" />
            <v-btn size="small" color="amber-accent-4" :href="table.lobbyPath" target="_blank">Open lobby</v-btn>
            <v-select
              v-model="botCount[table.tablePk]"
              :items="[1, 2, 3]"
              density="compact"
              hide-details
              variant="outlined"
              class="bot-count"
            />
            <v-btn
              size="small"
              color="green"
              prepend-icon="mdi-robot"
              :loading="busy === `bots-${table.tablePk}`"
              :disabled="!!busy"
              @click="addBots(result, table.tablePk)"
            >
              Add bots
            </v-btn>
          </div>
          <div v-if="bots[table.tablePk]?.length" class="d-flex flex-wrap ga-1 mt-1">
            <v-chip v-for="bot in bots[table.tablePk]" :key="bot.usersPk" size="small" prepend-icon="mdi-robot">
              {{ bot.userName }} · {{ bot.heroId }}
            </v-chip>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-alert v-if="error" type="error" variant="tonal" closable @click:close="error = ''">{{ error }}</v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { resolveApiEnv, switchApiEnv } from "@/dev/apiEnv";
import {
  TEST_API_URL,
  TestDataGenerator,
  loadCredentials,
  saveCredentials,
  seasonForScenery,
  type GeneratedEvent,
  type Scenery,
  type TableBot,
} from "@/dev/testDataGenerator";

const appEnv = resolveApiEnv("prod");
const generator = new TestDataGenerator();

const credentials = reactive(loadCredentials());
const tester = ref<{ users_pk: number; user_name: string } | null>(null);
const sceneries = ref<Scenery[]>([]);
const busy = ref("");
const error = ref("");
const steps = ref<string[]>([]);
const results = ref<GeneratedEvent[]>([]);
const botCount = reactive<Record<number, number>>({});
const bots = reactive<Record<number, TableBot[]>>({});

// Who the app itself is logged in as (the player who will lead the lobby).
const appUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("app_user") || "null") as { users_pk: number; user_name: string } | null;
  } catch {
    return null;
  }
})();

const seasons = [
  { title: "Season 1", value: 2 },
  { title: "Season 2", value: 3 },
];

const now = new Date(Date.now() + 60 * 60 * 1000);
const form = reactive({
  sceneryPk: null as number | null,
  seasonFk: 2,
  date: now.toISOString().split("T")[0],
  time: `${String(now.getHours()).padStart(2, "0")}:00`,
  tables: 2,
  maxPlayers: 4,
});

const canLogin = computed(() => !!credentials.login && !!credentials.password);

watch(
  () => form.sceneryPk,
  (pk) => {
    const scenery = sceneries.value.find((item) => item.sceneries_pk === pk);
    if (scenery) form.seasonFk = seasonForScenery(scenery.name);
  },
);

const run = async (kind: typeof busy.value, task: () => Promise<void>) => {
  busy.value = kind;
  error.value = "";
  try {
    await task();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    busy.value = "";
  }
};

const login = () =>
  run("login", async () => {
    saveCredentials({ ...credentials });
    tester.value = await generator.login(credentials);
    sceneries.value = await generator.listSceneries();
    if (!form.sceneryPk && sceneries.value.length) form.sceneryPk = sceneries.value[0].sceneries_pk;
  });

const register = () =>
  run("register", async () => {
    await generator.register(credentials);
    busy.value = "";
    await login();
  });

const generate = () =>
  run("generate", async () => {
    steps.value = [];
    const scenery = sceneries.value.find((item) => item.sceneries_pk === form.sceneryPk)!;
    const result = await generator.generateEvent(
      { ...form, sceneryPk: scenery.sceneries_pk, sceneryName: scenery.name },
      (step) => steps.value.push(step),
    );
    result.tables.forEach((table) => (botCount[table.tablePk] = 2));
    results.value.unshift(result);
  });

const addBots = (event: GeneratedEvent, tablePk: number) =>
  run(`bots-${tablePk}`, async () => {
    steps.value = [];
    const added = await generator.addBotsToTable(event, tablePk, botCount[tablePk] ?? 2, (step) => steps.value.push(step));
    bots[tablePk] = [...(bots[tablePk] ?? []), ...added];
  });

const copy = (path: string) => navigator.clipboard?.writeText(`${window.location.origin}${path}`);
</script>

<style scoped>
.bot-count {
  flex: 0 0 76px;
}
.nights-steps li {
  margin-bottom: 4px;
}
</style>
