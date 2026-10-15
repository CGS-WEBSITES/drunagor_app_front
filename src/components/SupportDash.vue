<template>
  <!-- The layout sets an inline padding on the root, so the spacing lives on the inner box. -->
  <div class="support-page">
  <div class="support">
    <!-- Header: title, the week being read, refresh -->
    <header class="support-head">
      <div class="support-head__title">
        <span class="support-kicker">Support</span>
        <h1>Support &amp; Analytics</h1>
        <p v-if="selectedWeek">
          {{ getWeekLabelByValue(selectedWeek) }}
          <span class="support-head__vs">vs {{ getPreviousWeekLabelByValue(selectedWeek) }}</span>
        </p>
      </div>
      <div class="support-head__actions">
        <v-select
          v-model="selectedWeek"
          :items="weekOptions"
          item-title="label"
          item-value="value"
          label="Week"
          variant="solo-filled"
          density="compact"
          bg-color="secondary"
          hide-details
          flat
          class="support-head__week"
          @update:model-value="onWeekChange"
        />
        <v-btn
          icon="mdi-refresh"
          variant="tonal"
          :loading="loading"
          aria-label="Refresh data"
          @click="fetchDashboardData"
        />
      </div>
    </header>

    <div v-if="loading && !dashboardData" class="support-state">
      <v-progress-circular indeterminate color="accent" size="48" width="5" />
      <span>Loading the metrics…</span>
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal" title="Could not load the data" :text="error" class="mb-6" />

    <template v-else-if="dashboardData">
      <!-- Tabs -->
      <div class="support-tabs" role="tablist">
        <button
          v-for="item in [{ value: 'stats', label: 'Overview', icon: 'mdi-chart-box-outline' }, { value: 'retailers', label: `Retailers (${dashboardData.retailers.length})`, icon: 'mdi-storefront-outline' }]"
          :key="item.value"
          role="tab"
          :aria-selected="tab === item.value"
          :class="{ active: tab === item.value }"
          @click="tab = item.value"
        >
          <v-icon size="18">{{ item.icon }}</v-icon>
          {{ item.label }}
        </button>
      </div>

      <!-- OVERVIEW -->
      <div v-show="tab === 'stats'" class="overview">
        <!-- What needs attention, computed from the data -->
        <section class="panel attention">
          <div class="panel__head">
            <h2><v-icon size="18">mdi-pulse</v-icon> Needs attention</h2>
            <span class="status-pill" :class="`status-pill--${overallStatus.level}`">
              <v-icon size="14">{{ STATUS_ICONS[overallStatus.level] }}</v-icon>{{ overallStatus.label }}
            </span>
          </div>
          <ul class="signals">
            <li v-for="signal in signals" :key="signal.title" class="signal" :class="`signal--${signal.level}`">
              <v-icon size="20" class="signal__icon">{{ STATUS_ICONS[signal.level] }}</v-icon>
              <div>
                <strong>{{ signal.title }}</strong>
                <span>{{ signal.text }}</span>
              </div>
              <span class="signal__value">{{ signal.value }}</span>
            </li>
          </ul>
        </section>

        <!-- KPIs: value, change from last week, progress to the Season 1 target -->
        <section class="kpis">
          <button
            v-for="kpi in kpis"
            :key="kpi.label"
            type="button"
            class="kpi"
            :class="{ 'kpi--link': kpi.tab }"
            :disabled="!kpi.tab"
            @click="kpi.tab && (tab = kpi.tab)"
          >
            <span class="kpi__label"><v-icon size="16">{{ kpi.icon }}</v-icon>{{ kpi.label }}</span>
            <strong class="kpi__value">{{ formatNumber(kpi.value) }}</strong>
            <span v-if="kpi.baseline !== null" class="kpi__delta" :class="deltaClass(kpi.value, kpi.baseline)">
              <v-icon size="14">{{ kpi.value > kpi.baseline ? "mdi-arrow-up" : kpi.value < kpi.baseline ? "mdi-arrow-down" : "mdi-minus" }}</v-icon>
              {{ formatDelta(kpi.value, kpi.baseline) }} <em>vs last week</em>
            </span>
            <span v-if="kpi.target" class="kpi__target">
              <span class="kpi__bar"><span :style="{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }"></span></span>
              <small>{{ Math.min(100, Math.round((kpi.value / kpi.target) * 100)) }}% of the S1 target ({{ formatNumber(kpi.target) }})</small>
            </span>
          </button>
        </section>

        <div class="overview-grid">
          <!-- Growth line -->
          <section class="panel panel--wide">
            <div class="panel__head">
              <h2><v-icon size="18">mdi-chart-line</v-icon> Registered users, week by week</h2>
            </div>
            <div class="chart-box">
              <canvas ref="cUsers" aria-label="Registered users per week"></canvas>
            </div>
            <div class="mini-stats">
              <div><strong>{{ formatNumber(data.saude_geral.novos_usuarios_7d) }}</strong><span>new users (7d)</span></div>
              <div><strong>{{ formatNumber(data.saude_geral.novos_usuarios_30d) }}</strong><span>new users (30d)</span></div>
              <div><strong>{{ formatNumber(data.saude_geral.campanhas_novas_7d) }}</strong><span>new campaigns (7d)</span></div>
              <div><strong>{{ formatNumber(data.saude_geral.campanhas_novas_30d) }}</strong><span>new campaigns (30d)</span></div>
              <div><strong>{{ formatNumber(data.saude_geral.eventos_ativos) }}</strong><span>active events</span></div>
              <div><strong>{{ formatNumber(data.saude_geral.eventos_passados_total) }}</strong><span>completed events</span></div>
            </div>
          </section>

          <!-- Feature adoption -->
          <section class="panel">
            <div class="panel__head">
              <h2><v-icon size="18">mdi-gesture-tap</v-icon> Feature adoption</h2>
              <small>share of all users</small>
            </div>
            <ul class="bars">
              <li v-for="feature in features" :key="feature.label" :title="`${feature.label}: ${formatNumber(feature.users)} users`">
                <div class="bars__row">
                  <span><v-icon size="16">{{ feature.icon }}</v-icon>{{ feature.label }}</span>
                  <strong>{{ formatNumber(feature.users) }} <em>· {{ percentOf(feature.users, data.saude_geral.total_users) }}</em></strong>
                </div>
                <span class="bar"><span :style="{ width: `${barWidth(feature.users, data.saude_geral.total_users)}%` }"></span></span>
                <small>{{ feature.detail }}</small>
              </li>
            </ul>
          </section>

          <!-- Boxes: campaigns, owned, wishlist -->
          <section class="panel">
            <div class="panel__head">
              <h2><v-icon size="18">mdi-package-variant-closed</v-icon> Boxes</h2>
              <div class="seg" role="tablist">
                <button v-for="option in SKU_VIEWS" :key="option.value" role="tab" :aria-selected="skuView === option.value" :class="{ active: skuView === option.value }" @click="skuView = option.value">
                  {{ option.label }}
                </button>
              </div>
            </div>
            <ul v-if="skuRanking.length" class="bars">
              <li v-for="item in skuRanking" :key="item.sku" :title="`${item.sku}: ${formatNumber(item.count)}`">
                <div class="bars__row">
                  <span>{{ item.sku }}</span>
                  <strong>{{ formatNumber(item.count) }}</strong>
                </div>
                <span class="bar"><span :style="{ width: `${barWidth(item.count, skuRanking[0].count)}%` }"></span></span>
              </li>
            </ul>
            <p v-else class="panel__empty">No data for this view.</p>
          </section>

          <!-- Countries -->
          <section class="panel">
            <div class="panel__head">
              <h2><v-icon size="18">mdi-earth</v-icon> Top countries</h2>
              <small>users</small>
            </div>
            <ul class="bars">
              <li v-for="(country, index) in topCountries" :key="country.country" :title="`${country.country}: ${formatNumber(country.count)} users`">
                <div class="bars__row">
                  <span><span class="rank">{{ index + 1 }}</span>{{ country.country }}</span>
                  <strong>{{ formatNumber(country.count) }}</strong>
                </div>
                <span class="bar"><span :style="{ width: `${barWidth(country.count, topCountries[0]?.count)}%` }"></span></span>
              </li>
            </ul>
          </section>

          <!-- Profiles & social -->
          <section class="panel">
            <div class="panel__head">
              <h2><v-icon size="18">mdi-account-heart-outline</v-icon> Profiles &amp; friends</h2>
            </div>
            <div class="tiles">
              <div class="tile"><strong>{{ formatNumber(data.feature_usage.profile_pic) }}</strong><span>custom profile pictures</span></div>
              <div class="tile"><strong>{{ formatNumber(data.feature_usage.profile_bg) }}</strong><span>custom backgrounds</span></div>
              <div class="tile"><strong>{{ formatNumber(data.feature_usage.profile_zip) }}</strong><span>zip codes filled</span></div>
              <div class="tile"><strong>{{ formatNumber(data.feature_usage.friends_friendships) }}</strong><span>friendships · {{ formatNumber(data.feature_usage.friends_interacted) }} users</span></div>
            </div>
          </section>
        </div>
      </div>

      <!-- RETAILERS -->
      <div v-show="tab === 'retailers'" class="panel retailers">
        <div class="filters">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search name, email or store"
            variant="solo-filled"
            density="compact"
            bg-color="secondary"
            flat
            hide-details
            clearable
            class="filters__search"
          />
          <v-select v-model="storeStatusFilter" :items="toItems(storeStatusOptions)" label="Store" variant="solo-filled" density="compact" bg-color="secondary" flat hide-details />
          <v-select v-model="onboardingStatusFilter" :items="toItems(onboardingStatusOptions)" label="Onboarding" variant="solo-filled" density="compact" bg-color="secondary" flat hide-details />
          <v-select v-model="countryFilter" :items="toItems(countryOptions)" label="Country" variant="solo-filled" density="compact" bg-color="secondary" flat hide-details />
          <v-select v-model="lastActivityFilter" :items="toItems(lastActivityOptions)" label="Last activity" variant="solo-filled" density="compact" bg-color="secondary" flat hide-details />
          <v-select v-model="activityMetricsFilter" :items="toItems(activityMetricsOptions)" label="Events / players" variant="solo-filled" density="compact" bg-color="secondary" flat hide-details />
        </div>
        <div class="filters__bar">
          <span>{{ filteredRetailers.length }} of {{ dashboardData.retailers.length }} retailers</span>
          <v-btn v-if="filtersActive" variant="text" size="small" prepend-icon="mdi-filter-remove-outline" class="text-none" @click="clearFilters">Clear filters</v-btn>
          <v-spacer />
          <v-btn variant="tonal" size="small" prepend-icon="mdi-download" class="text-none" :disabled="!filteredRetailers.length" @click="exportToCSV">Export CSV</v-btn>
        </div>

        <div class="table-scroll">
          <v-table class="retailers-table">
            <thead>
              <tr>
                <th>Retailer</th>
                <th>Store</th>
                <th>Onboarding</th>
                <th>Last access</th>
                <th class="text-center">Events</th>
                <th class="text-center">Players</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredRetailers" :key="item.stores_pk ? 'store-' + item.stores_pk : 'user-' + item.users_pk">
                <td data-label="Retailer" class="cell--title">
                  <div class="cell-main">
                    {{ item.name }}
                    <v-icon v-if="item.verified === false" size="16" color="error" title="Not validated">mdi-alert-decagram</v-icon>
                    <v-icon v-else size="16" color="success" title="Validated">mdi-check-decagram</v-icon>
                  </div>
                  <div class="cell-sub">{{ item.email }}</div>
                  <div v-if="item.phone" class="cell-sub">{{ item.phone }}</div>
                </td>
                <td data-label="Store">
                  <div class="cell-main">{{ item.store_name && item.store_name !== "-" ? item.store_name : "No store yet" }}</div>
                  <div class="cell-sub"><v-icon size="12">mdi-map-marker-outline</v-icon> {{ item.country || "-" }}</div>
                </td>
                <td data-label="Onboarding">
                  <span class="onboarding-chip" :style="{ '--chip': onboardingColor(item.onboarding_status) }">{{ onboardingLabel(item.onboarding_status) }}</span>
                </td>
                <td data-label="Last access">
                  <div class="cell-main">{{ formatDate(item.last_access) }}</div>
                  <div class="cell-sub" :class="`inactive--${inactivityLevel(item.last_access)}`">{{ getInactivityDaysText(item.last_access) }}</div>
                </td>
                <td data-label="Events" class="text-center">
                  <button type="button" class="count-btn" :disabled="!item.events_count" @click="showRetailerEventsList(item)">{{ item.events_count }}</button>
                </td>
                <td data-label="Players" class="text-center">
                  <button type="button" class="count-btn" :disabled="!item.players_count" @click="showRetailerPlayersList(item)">{{ item.players_count }}</button>
                </td>
                <td class="text-right cell--action">
                  <v-btn variant="tonal" size="small" class="text-none" @click="showRetailerDetails(item)">Manage</v-btn>
                </td>
              </tr>
              <tr v-if="filteredRetailers.length === 0">
                <td colspan="7" class="panel__empty">No retailers match these filters.</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    </template>

    <!-- Retailer details -->
    <v-dialog v-model="detailsDialog" max-width="680" scrollable v-if="selectedRetailer">
      <v-card class="support-dialog rounded-xl">
        <div class="support-dialog__head">
          <div>
            <small>Retailer</small>
            <strong>{{ selectedRetailer.name }}</strong>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="detailsDialog = false" />
        </div>

        <v-card-text class="support-dialog__body">
          <!-- Validation -->
          <div class="validation" :class="selectedRetailer.verified !== false ? 'validation--ok' : 'validation--bad'">
            <v-icon size="22">{{ selectedRetailer.verified !== false ? "mdi-check-decagram" : "mdi-alert-decagram" }}</v-icon>
            <div>
              <strong>{{ selectedRetailer.verified !== false ? "Validated retailer" : "Not validated" }}</strong>
              <span>{{ selectedRetailer.verified !== false ? "This account is a confirmed store owner." : "Flagged as not validated or fake; it can be filtered out." }}</span>
            </div>
            <v-btn
              :color="selectedRetailer.verified !== false ? 'error' : 'success'"
              variant="flat"
              size="small"
              class="text-none font-weight-bold"
              :loading="savingValidation"
              @click="toggleValidationStatus(!selectedRetailer.verified)"
            >
              {{ selectedRetailer.verified !== false ? "Invalidate" : "Validate" }}
            </v-btn>
          </div>

          <!-- Account -->
          <section class="dlg-section">
            <h3>Account</h3>
            <dl class="facts">
              <div><dt>Nickname</dt><dd>{{ selectedRetailer.user_name }}</dd></div>
              <div><dt>User ID</dt><dd>#{{ selectedRetailer.users_pk }}</dd></div>
              <div class="facts__wide"><dt>Email</dt><dd><a :href="'mailto:' + selectedRetailer.email">{{ selectedRetailer.email }}</a></dd></div>
              <div><dt>Joined</dt><dd>{{ formatDate(selectedRetailer.join_date) }}</dd></div>
              <div><dt>Last access</dt><dd>{{ formatDate(selectedRetailer.last_access) }}</dd></div>
            </dl>
          </section>

          <!-- Onboarding (editable) -->
          <section class="dlg-section">
            <h3>Onboarding</h3>
            <div class="dlg-fields">
              <v-select v-model="editOnboardingStatus" :items="toItems(onboardingStatusOptions.slice(1))" label="Status" variant="solo-filled" density="compact" bg-color="secondary" flat hide-details />
              <v-text-field v-model="editPhone" label="Phone / WhatsApp" prepend-inner-icon="mdi-phone" variant="solo-filled" density="compact" bg-color="secondary" flat hide-details />
            </div>
          </section>

          <!-- Store -->
          <section class="dlg-section">
            <h3>
              Store
              <template v-if="selectedRetailer.stores_pk">
                <span class="mini-chip" :class="selectedRetailer.store_verified ? 'mini-chip--ok' : 'mini-chip--warn'">{{ selectedRetailer.store_verified ? "Verified" : "Unverified" }}</span>
                <span class="mini-chip" :class="selectedRetailer.store_active ? 'mini-chip--ok' : ''">{{ selectedRetailer.store_active ? "Active" : "Inactive" }}</span>
              </template>
            </h3>
            <template v-if="selectedRetailer.stores_pk">
              <v-progress-linear v-if="loadingStoreDetails" indeterminate color="accent" />
              <template v-else-if="storeDetails">
                <dl class="facts">
                  <div class="facts__wide"><dt>Name</dt><dd>{{ storeDetails.name }}</dd></div>
                  <div class="facts__wide"><dt>Address</dt><dd>{{ storeDetails.address }}</dd></div>
                  <div><dt>Zip code</dt><dd>{{ storeDetails.zip_code || "-" }}</dd></div>
                  <div><dt>State</dt><dd>{{ storeDetails.state || "-" }}</dd></div>
                  <div v-if="storeDetails.web_site" class="facts__wide"><dt>Website</dt><dd><a :href="storeDetails.web_site" target="_blank" rel="noopener">{{ storeDetails.web_site }}</a></dd></div>
                  <div><dt>Merchant ID</dt><dd>{{ storeDetails.merchant_id || "-" }}</dd></div>
                </dl>
                <iframe
                  v-if="storeDetails.latitude"
                  class="store-map"
                  :src="`https://www.google.com/maps?q=${storeDetails.latitude},${storeDetails.longitude}&z=15&output=embed`"
                  loading="lazy"
                  title="Store location"
                />
              </template>
            </template>
            <p v-else class="panel__empty"><v-icon size="18">mdi-store-off-outline</v-icon> This retailer has not set up a store yet.</p>
          </section>
        </v-card-text>

        <div class="support-dialog__actions">
          <v-btn variant="text" class="text-none" :disabled="saving" @click="detailsDialog = false">Cancel</v-btn>
          <v-btn color="accent" variant="flat" class="text-none font-weight-bold" :loading="saving" @click="saveRetailerChanges">Save changes</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- A store's events -->
    <v-dialog v-model="eventsDialog" max-width="720" scrollable>
      <v-card class="support-dialog rounded-xl">
        <div class="support-dialog__head">
          <div>
            <small>Events</small>
            <strong>{{ eventsRetailerName }}</strong>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="eventsDialog = false" />
        </div>
        <v-card-text class="support-dialog__body">
          <v-progress-linear v-if="loadingEvents" indeterminate color="accent" />
          <p v-else-if="retailerEvents.length === 0" class="panel__empty">This store has no events yet.</p>
          <v-table v-else class="retailers-table">
            <thead>
              <tr><th>Wing</th><th>Date</th><th class="text-center">Players</th><th class="text-center">Status</th></tr>
            </thead>
            <tbody>
              <tr v-for="evt in retailerEvents" :key="evt.events_pk">
                <td class="cell-main">{{ evt.scenario }}</td>
                <td>{{ formatDate(evt.event_date) }}</td>
                <td class="text-center">{{ evt.players_count }}</td>
                <td class="text-center"><span class="mini-chip" :class="evt.active ? 'mini-chip--ok' : ''">{{ evt.active ? "Active" : "Inactive" }}</span></td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- A store's players -->
    <v-dialog v-model="playersDialog" max-width="720" scrollable>
      <v-card class="support-dialog rounded-xl">
        <div class="support-dialog__head">
          <div>
            <small>Regular players</small>
            <strong>{{ playersRetailerName }}</strong>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="playersDialog = false" />
        </div>
        <v-card-text class="support-dialog__body">
          <v-progress-linear v-if="loadingPlayers" indeterminate color="accent" />
          <p v-else-if="retailerPlayers.length === 0" class="panel__empty">No player has joined this store's events yet.</p>
          <v-table v-else class="retailers-table">
            <thead>
              <tr><th>Player</th><th>Email</th><th class="text-center">Events</th><th class="text-center">Last visit</th></tr>
            </thead>
            <tbody>
              <tr v-for="player in retailerPlayers" :key="player.users_pk">
                <td>
                  <div class="cell-main">{{ player.player_nick }}</div>
                  <div v-if="player.player_name" class="cell-sub">{{ player.player_name }}</div>
                </td>
                <td class="cell-sub">{{ player.player_email }}</td>
                <td class="text-center">{{ player.checked_in_events_count }}</td>
                <td class="text-center">{{ formatDate(player.last_interaction_date) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, inject, nextTick } from "vue";
import { useRoute } from "vue-router";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const axios: any = inject("axios");

const route = useRoute();

const tab = ref(route.query.tab === "retailers" ? "retailers" : "stats");

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab === "retailers") {
      tab.value = "retailers";
    } else {
      tab.value = "stats";
    }
  }
);
const search = ref("");
const storeStatusFilter = ref("Todos");
const onboardingStatusFilter = ref("Todos");
const lastActivityFilter = ref("Todos");
const countryFilter = ref("Todos");
const activityMetricsFilter = ref("Todos");

const countryOptions = computed(() => {
  if (!dashboardData.value || !dashboardData.value.retailers) return ["Todos"];
  const list = dashboardData.value.retailers
    .map((r: any) => r.country)
    .filter((c: any) => c && c !== "-");
  return ["Todos", ...new Set(list)].sort();
});

const activityMetricsOptions = [
  "Todos",
  "Com Eventos (1+)",
  "Sem Eventos",
  "Com Jogadores (1+)",
  "Sem Jogadores"
];

const loading = ref(false);
const error = ref<string | null>(null);
const dashboardData = ref<any>(null);

// Retailer Details dialog
const detailsDialog = ref(false);
const selectedRetailer = ref<any>(null);
const storeDetails = ref<any>(null);
const loadingStoreDetails = ref(false);

// Edit state
const editOnboardingStatus = ref("");
const editPhone = ref("");
const saving = ref(false);
const savingValidation = ref(false);

const toggleValidationStatus = async (newVerifiedState: boolean) => {
  if (!selectedRetailer.value) return;
  savingValidation.value = true;
  try {
    await axios.put("/users/alter", {
      users_pk: selectedRetailer.value.users_pk,
      verified: newVerifiedState
    });

    selectedRetailer.value.verified = newVerifiedState;
    selectedRetailer.value.store_verified = newVerifiedState;

    const idx = dashboardData.value.retailers.findIndex(
      (r: any) => r.users_pk === selectedRetailer.value.users_pk
    );
    if (idx !== -1) {
      dashboardData.value.retailers[idx].verified = newVerifiedState;
      dashboardData.value.retailers[idx].store_verified = newVerifiedState;
    }
  } catch (err: any) {
    console.error("Error toggling validation status:", err);
    alert(err.response?.data?.message || "Failed to update validation status.");
  } finally {
    savingValidation.value = false;
  }
};

// Retailer Events and Players details
const eventsDialog = ref(false);
const playersDialog = ref(false);
const retailerEvents = ref<any[]>([]);
const retailerPlayers = ref<any[]>([]);
const loadingEvents = ref(false);
const loadingPlayers = ref(false);
const eventsRetailerName = ref("");
const playersRetailerName = ref("");

const storeStatusOptions = [
  "Todos",
  "Apenas Validadas",
  "Não Validadas / Fakes",
  "Com Loja",
  "Sem Loja",
  "Loja Verificada",
  "Loja Não Verificada",
  "Loja Ativa",
  "Loja Inativa"
];

const onboardingStatusOptions = [
  "Todos",
  "Cadastro realizado",
  "Loja criada",
  "Primeiro contato realizado",
  "Em onboarding",
  "Evento planejado",
  "Evento realizado",
  "Loja ativa",
  "Sem atividade",
  "Necessita contato",
  "Call agendada",
  "Inativo"
];

const lastActivityOptions = [
  "Todos",
  "Ativo nas últimas 24h",
  "Ativo nos últimos 7 dias",
  "Ativo nos últimos 30 dias",
  "Inativo há 3+ dias",
  "Inativo há 7+ dias",
  "Inativo há 14+ dias"
];

// Week filter options
const weekOptions = ref<any[]>([]);
const selectedWeek = ref<string>("");

const generateWeeks = () => {
  const options = [];
  // Start date: Monday, June 8, 2026
  let currentStart = new Date("2026-06-08T00:00:00");
  const today = new Date();
  
  let weekNum = 1;
  while (currentStart <= today) {
    const currentEnd = new Date(currentStart);
    currentEnd.setDate(currentStart.getDate() + 6);
    
    // Format YYYY-MM-DD for API parameter (Sunday end date)
    const formattedEnd = currentEnd.toISOString().slice(0, 10);
    
    const startStr = currentStart.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    const endStr = currentEnd.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    
    options.unshift({
      label: `Week ${weekNum}: ${startStr} - ${endStr}`,
      value: formattedEnd
    });
    
    currentStart = new Date(currentStart);
    currentStart.setDate(currentStart.getDate() + 7);
    weekNum++;
  }
  
  weekOptions.value = options;
  if (options.length > 0) {
    selectedWeek.value = options[0].value;
  }
};

const getWeekLabelByValue = (val: string) => {
  const opt = weekOptions.value.find((o) => o.value === val);
  return opt ? opt.label.split(": ")[1] : "Current Week";
};

const getPreviousWeekLabelByValue = (val: string) => {
  const idx = weekOptions.value.findIndex((o) => o.value === val);
  if (idx !== -1 && idx + 1 < weekOptions.value.length) {
    return weekOptions.value[idx + 1].label.split(": ")[1];
  }
  return "Previous Week";
};

const formatDelta = (current: number, baseline: number) => {
  const diff = current - baseline;
  const sign = diff >= 0 ? "+" : "";
  let pct = 0;
  if (baseline > 0) {
    pct = (diff / baseline) * 100;
  } else if (diff > 0) {
    pct = 100;
  }
  return `${sign}${diff} (${sign}${pct.toFixed(1)}%)`;
};

const onWeekChange = async () => {
  await fetchDashboardData();
};

const getInactivityDays = (lastAccessStr: any) => {
  if (!lastAccessStr || typeof lastAccessStr !== "string" || lastAccessStr === "None") return 0;
  const lastAccess = new Date(lastAccessStr.replace(/-/g, "/").replace("T", " "));
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastAccess.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getInactivityDaysText = (lastAccessStr: string) => {
  const days = getInactivityDays(lastAccessStr);
  if (days <= 0) return "Active today";
  if (days === 1) return "1 day inactive";
  return `${days} days inactive`;
};

const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params: any = {};
    if (selectedWeek.value) {
      params.end_date = selectedWeek.value;
    }
    const response = await axios.get("/analytics/dashboard", { params });
    dashboardData.value = response.data;
  } catch (err: any) {
    console.error("Error fetching analytics data:", err);
    error.value = err.response?.data?.message || "Could not retrieve statistics from backend. Make sure your role is support or admin.";
  } finally {
    loading.value = false;
  }
};

const showRetailerDetails = async (retailer: any) => {
  selectedRetailer.value = retailer;
  editOnboardingStatus.value = retailer.onboarding_status || "Cadastro realizado";
  editPhone.value = retailer.phone || "";
  storeDetails.value = null;
  detailsDialog.value = true;

  if (retailer.stores_pk) {
    loadingStoreDetails.value = true;
    try {
      // Fetch specific store details from the backend using the store ID
      const response = await axios.get(`/stores/${retailer.stores_pk}`);
      storeDetails.value = response.data;
    } catch (e) {
      console.error("Error fetching store details:", e);
      // Fallback to minimal info from dashboard
      storeDetails.value = {
        name: retailer.store_name || "",
        address: "-",
        zip_code: "-",
        web_site: (retailer.store_site && retailer.store_site !== "-") ? retailer.store_site : null,
      };
    } finally {
      loadingStoreDetails.value = false;
    }
  }
};

const saveRetailerChanges = async () => {
  if (!selectedRetailer.value) return;
  saving.value = true;
  try {
    const payload = {
      users_pk: selectedRetailer.value.users_pk,
      onboarding_status: editOnboardingStatus.value,
      phone: editPhone.value
    };
    
    await axios.put("/users/alter", payload);
    
    // Update local values
    selectedRetailer.value.onboarding_status = editOnboardingStatus.value;
    selectedRetailer.value.phone = editPhone.value;
    
    // Update main dataset
    const idx = dashboardData.value.retailers.findIndex(
      (r: any) => r.users_pk === selectedRetailer.value.users_pk
    );
    if (idx !== -1) {
      dashboardData.value.retailers[idx].onboarding_status = editOnboardingStatus.value;
      dashboardData.value.retailers[idx].phone = editPhone.value;
    }
    
    detailsDialog.value = false;
  } catch (err: any) {
    console.error("Error saving retailer details:", err);
    alert(err.response?.data?.message || "Failed to update retailer details.");
  } finally {
    saving.value = false;
  }
};

const showRetailerEventsList = async (retailer: any) => {
  eventsRetailerName.value = (retailer.store_name && retailer.store_name !== "-") ? retailer.store_name : (retailer.name || "");
  retailerEvents.value = [];
  loadingEvents.value = true;
  eventsDialog.value = true;
  try {
    const response = await axios.get(`/analytics/retailer/${retailer.users_pk}/events`);
    retailerEvents.value = response.data.events;
  } catch (e) {
    console.error("Error fetching retailer events:", e);
  } finally {
    loadingEvents.value = false;
  }
};

const showRetailerPlayersList = async (retailer: any) => {
  playersRetailerName.value = (retailer.store_name && retailer.store_name !== "-") ? retailer.store_name : (retailer.name || "");
  retailerPlayers.value = [];
  loadingPlayers.value = true;
  playersDialog.value = true;
  try {
    const response = await axios.get(`/analytics/retailer/${retailer.users_pk}/players`);
    retailerPlayers.value = response.data.players;
  } catch (e) {
    console.error("Error fetching retailer players:", e);
  } finally {
    loadingPlayers.value = false;
  }
};

const exportToCSV = () => {
  if (!filteredRetailers.value || filteredRetailers.value.length === 0) return;
  
  const headers = [
    "Retailer ID",
    "Name",
    "Nickname",
    "Email",
    "Phone",
    "Country",
    "Join Date",
    "Store Name",
    "Store Website",
    "Store Verified",
    "Store Active",
    "Onboarding Status",
    "Last Access",
    "Events Count",
    "Players Count"
  ];
  
  const csvRows = [headers.join(",")];
  
  for (const item of filteredRetailers.value) {
    const values = [
      item.users_pk,
      `"${(item.name || "").replace(/"/g, '""')}"`,
      `"${(item.user_name || "").replace(/"/g, '""')}"`,
      `"${(item.email || "").replace(/"/g, '""')}"`,
      `"${(item.phone || "").replace(/"/g, '""')}"`,
      `"${(item.country || "-").replace(/"/g, '""')}"`,
      item.join_date,
      `"${(item.store_name || "-").replace(/"/g, '""')}"`,
      `"${(item.store_site || "-").replace(/"/g, '""')}"`,
      item.store_verified ? "Yes" : "No",
      item.store_active ? "Yes" : "No",
      `"${item.onboarding_status || ""}"`,
      item.last_access,
      item.events_count,
      item.players_count
    ];
    csvRows.push(values.join(","));
  }
  
  const csvString = "\uFEFF" + csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("download", `retailers_onboarding_${dateStr}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const filteredRetailers = computed(() => {
  if (!dashboardData.value) return [];
  
  let result = dashboardData.value.retailers;

  // Search filter
  const searchLower = search.value.toLowerCase().trim();
  if (searchLower) {
    result = result.filter((item: any) => {
      const name = (item.name || "").toLowerCase();
      const userName = (item.user_name || "").toLowerCase();
      const email = (item.email || "").toLowerCase();
      const storeName = (item.store_name || "").toLowerCase();
      return (
        name.includes(searchLower) ||
        userName.includes(searchLower) ||
        email.includes(searchLower) ||
        storeName.includes(searchLower)
      );
    });
  }

  // Store status filter
  if (storeStatusFilter.value !== "Todos") {
    result = result.filter((item: any) => {
      const hasStore = !!item.stores_pk;
      if (storeStatusFilter.value === "Apenas Validadas") return item.verified !== false;
      if (storeStatusFilter.value === "Não Validadas / Fakes") return item.verified === false;
      if (storeStatusFilter.value === "Com Loja") return hasStore;
      if (storeStatusFilter.value === "Sem Loja") return !hasStore;
      if (storeStatusFilter.value === "Loja Verificada") return hasStore && item.store_verified;
      if (storeStatusFilter.value === "Loja Não Verificada") return hasStore && !item.store_verified;
      if (storeStatusFilter.value === "Loja Ativa") return hasStore && item.store_active;
      if (storeStatusFilter.value === "Loja Inativa") return hasStore && !item.store_active;
      return true;
    });
  }

  // Onboarding status filter
  if (onboardingStatusFilter.value !== "Todos") {
    result = result.filter((item: any) => {
      return item.onboarding_status === onboardingStatusFilter.value;
    });
  }

  // Last activity filter
  if (lastActivityFilter.value !== "Todos") {
    result = result.filter((item: any) => {
      const days = getInactivityDays(item.last_access);
      if (lastActivityFilter.value === "Ativo nas últimas 24h") return days <= 1;
      if (lastActivityFilter.value === "Ativo nos últimos 7 dias") return days <= 7;
      if (lastActivityFilter.value === "Ativo nos últimos 30 dias") return days <= 30;
      if (lastActivityFilter.value === "Inativo há 3+ dias") return days >= 3;
      if (lastActivityFilter.value === "Inativo há 7+ dias") return days >= 7;
      if (lastActivityFilter.value === "Inativo há 14+ dias") return days >= 14;
      return true;
    });
  }

  // Country filter
  if (countryFilter.value !== "Todos") {
    result = result.filter((item: any) => item.country === countryFilter.value);
  }

  // Activity metrics filter
  if (activityMetricsFilter.value !== "Todos") {
    result = result.filter((item: any) => {
      if (activityMetricsFilter.value === "Com Eventos (1+)") return item.events_count > 0;
      if (activityMetricsFilter.value === "Sem Eventos") return item.events_count === 0;
      if (activityMetricsFilter.value === "Com Jogadores (1+)") return item.players_count > 0;
      if (activityMetricsFilter.value === "Sem Jogadores") return item.players_count === 0;
      return true;
    });
  }

  return result;
});

const formatDate = (dateStr: any) => {
  if (!dateStr || typeof dateStr !== "string" || dateStr === "None") return "-";
  try {
    const d = new Date(dateStr.replace(/-/g, "/").replace("T", " "));
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch (e) {
    return dateStr;
  }
};

// ---- Overview ----
const data = computed(() => dashboardData.value || {});

// Season 1 targets.
const TARGETS = { users: 1500, active7d: 200, active30d: 1000, retailers: 75, tables: 20, campaigns: 1200 };

type Level = "good" | "warning" | "critical";
const STATUS_ICONS: Record<Level, string> = {
  good: "mdi-check-circle",
  warning: "mdi-alert",
  critical: "mdi-alert-octagon",
};
const STATUS_LABELS: Record<Level, string> = { good: "On track", warning: "Watch", critical: "Critical" };
const LEVEL_ORDER: Level[] = ["good", "warning", "critical"];

const percentOf = (part: number, whole: number) => (whole ? `${((part / whole) * 100).toFixed(1)}%` : "0%");
const formatNumber = (value: number) => (Number(value) || 0).toLocaleString("en-US");
const plural = (count: number, one: string, many = `${one}s`) => `${formatNumber(count)} ${Number(count) === 1 ? one : many}`;
// Bars never vanish: a non-zero value keeps a sliver.
const barWidth = (value: number, max: number) => (max ? Math.max(value ? 2 : 0, (value / max) * 100) : 0);

// What needs attention, worked out from this week's numbers.
const signals = computed(() => {
  const d = dashboardData.value;
  if (!d) return [];
  const retailers = d.retailers || [];
  const withStore = retailers.filter((r: any) => r.stores_pk).length;
  const storeRate = retailers.length ? (withStore / retailers.length) * 100 : 0;
  const tables = d.feature_usage?.events_tables ?? 0;
  const active = d.saude_geral?.ativos_7d ?? 0;
  const activeBefore = d.baseline?.ativos_7d ?? null;
  const activeChange = activeBefore ? ((active - activeBefore) / activeBefore) * 100 : 0;
  const stale = retailers.filter((r: any) => r.stores_pk && getInactivityDays(r.last_access) >= 14).length;
  const staleRate = withStore ? (stale / withStore) * 100 : 0;

  return [
    {
      title: "Store onboarding",
      text: `${withStore} of ${retailers.length} retailers have created their store.`,
      value: `${storeRate.toFixed(0)}%`,
      level: (storeRate >= 60 ? "good" : storeRate >= 30 ? "warning" : "critical") as Level,
    },
    {
      title: "Organized play",
      text: `${plural(tables, "active event table")} (Season 1 target: ${TARGETS.tables}).`,
      value: `${tables}`,
      level: (tables >= TARGETS.tables / 2 ? "good" : tables >= TARGETS.tables / 4 ? "warning" : "critical") as Level,
    },
    {
      title: "Weekly active users",
      text:
        activeBefore === null
          ? `${active} users active this week.`
          : `${active} users active this week, ${activeBefore} the week before.`,
      value: activeBefore === null ? `${active}` : `${activeChange >= 0 ? "+" : ""}${activeChange.toFixed(0)}%`,
      level: (activeChange >= 0 ? "good" : activeChange >= -20 ? "warning" : "critical") as Level,
    },
    {
      title: "Quiet stores",
      text: `${plural(stale, "retailer")} with a store ${stale === 1 ? "has" : "have"} not logged in for 14+ days.`,
      value: `${stale}`,
      level: (stale === 0 ? "good" : staleRate <= 25 ? "warning" : "critical") as Level,
    },
  ];
});

const overallStatus = computed(() => {
  const worst = signals.value.reduce<Level>((acc, s) => (LEVEL_ORDER.indexOf(s.level) > LEVEL_ORDER.indexOf(acc) ? s.level : acc), "good");
  return { level: worst, label: STATUS_LABELS[worst] };
});

const kpis = computed(() => {
  const d = dashboardData.value;
  if (!d) return [];
  const b = d.baseline || null;
  const pick = (key: string, from = d.saude_geral) => Number(from?.[key] ?? 0);
  return [
    { label: "Registered users", icon: "mdi-account-group-outline", value: pick("total_users"), baseline: b ? Number(b.total_users) : null, target: TARGETS.users },
    { label: "Active users (7d)", icon: "mdi-run-fast", value: pick("ativos_7d"), baseline: b ? Number(b.ativos_7d) : null, target: TARGETS.active7d },
    { label: "Active users (30d)", icon: "mdi-calendar-check-outline", value: pick("ativos_30d"), baseline: b ? Number(b.ativos_30d) : null, target: TARGETS.active30d },
    { label: "Retailers", icon: "mdi-storefront-outline", value: pick("total_retailers"), baseline: b ? Number(b.total_retailers) : null, target: TARGETS.retailers, tab: "retailers" },
    { label: "Active event tables", icon: "mdi-table-chair", value: pick("events_tables", d.feature_usage), baseline: b ? Number(b.events_tables) : null, target: TARGETS.tables },
    { label: "Active campaigns", icon: "mdi-sword-cross", value: pick("campanhas_ativas"), baseline: b ? Number(b.campanhas_ativas) : null, target: TARGETS.campaigns },
  ];
});

const deltaClass = (current: number, baseline: number) =>
  current > baseline ? "delta--up" : current < baseline ? "delta--down" : "delta--flat";

const features = computed(() => {
  const f = dashboardData.value?.feature_usage || {};
  return [
    { label: "Library", icon: "mdi-bookshelf", users: f.library_users ?? 0, detail: `${plural(f.library_items, "item")} · ${f.library_avg ?? 0} per collection` },
    { label: "Custom heroes", icon: "mdi-shield-sword-outline", users: f.heroes_creators ?? 0, detail: `${plural(f.heroes_count, "hero", "heroes")} · ${f.heroes_avg ?? 0} per creator` },
    { label: "Events", icon: "mdi-map-marker-radius-outline", users: f.events_participants ?? 0, detail: `${plural(f.events_tables, "table")} · ${plural(f.events_qrs, "QR code")}` },
    { label: "Friends", icon: "mdi-account-multiple-outline", users: f.friends_interacted ?? 0, detail: plural(f.friends_friendships, "friendship") },
  ].sort((a, b) => b.users - a.users);
});

const SKU_VIEWS = [
  { value: "campaigns", label: "Campaigns" },
  { value: "owned", label: "Owned" },
  { value: "wishlist", label: "Wishlist" },
];
const skuView = ref("campaigns");
const skuRanking = computed(() =>
  [...(dashboardData.value?.sku_analysis?.[skuView.value] || [])].sort((a: any, b: any) => b.count - a.count).slice(0, 8),
);
const topCountries = computed(() =>
  [...(dashboardData.value?.saude_geral?.countries || [])].sort((a: any, b: any) => b.count - a.count).slice(0, 6),
);

// ---- Retailers: English labels over the stored values ----
const LABELS: Record<string, string> = {
  Todos: "All",
  "Apenas Validadas": "Validated only",
  "Não Validadas / Fakes": "Not validated / fake",
  "Com Loja": "With a store",
  "Sem Loja": "Without a store",
  "Loja Verificada": "Store verified",
  "Loja Não Verificada": "Store not verified",
  "Loja Ativa": "Store active",
  "Loja Inativa": "Store inactive",
  "Cadastro realizado": "Signed up",
  "Loja criada": "Store created",
  "Primeiro contato realizado": "First contact made",
  "Em onboarding": "Onboarding",
  "Evento planejado": "Event planned",
  "Evento realizado": "Event held",
  "Loja ativa": "Active store",
  "Sem atividade": "No activity",
  "Necessita contato": "Needs contact",
  "Call agendada": "Call scheduled",
  Inativo: "Inactive",
  "Ativo nas últimas 24h": "Active in the last 24h",
  "Ativo nos últimos 7 dias": "Active in the last 7 days",
  "Ativo nos últimos 30 dias": "Active in the last 30 days",
  "Inativo há 3+ dias": "Inactive 3+ days",
  "Inativo há 7+ dias": "Inactive 7+ days",
  "Inativo há 14+ dias": "Inactive 14+ days",
  "Com Eventos (1+)": "With events",
  "Sem Eventos": "Without events",
  "Com Jogadores (1+)": "With players",
  "Sem Jogadores": "Without players",
};
const toItems = (options: any[]) => options.map((value) => ({ value, title: LABELS[value] ?? value }));
const onboardingLabel = (status: string) => LABELS[status] ?? status ?? "-";

// Onboarding chip tint, from the stage's meaning.
const ONBOARDING_COLORS: Record<string, string> = {
  "Loja ativa": "#3fb46a",
  "Evento realizado": "#3fb46a",
  "Evento planejado": "#4f8fe0",
  "Em onboarding": "#4f8fe0",
  "Primeiro contato realizado": "#4f8fe0",
  "Call agendada": "#4f8fe0",
  "Loja criada": "#9aa0a6",
  "Cadastro realizado": "#9aa0a6",
  "Sem atividade": "#e0a030",
  "Necessita contato": "#e0a030",
  Inativo: "#e05a4f",
};
const onboardingColor = (status: string) => ONBOARDING_COLORS[status] ?? "#9aa0a6";

const inactivityLevel = (lastAccess: string) => {
  const days = getInactivityDays(lastAccess);
  return days >= 14 ? "critical" : days >= 7 ? "warning" : "good";
};

const filtersActive = computed(
  () =>
    !!search.value ||
    [storeStatusFilter, onboardingStatusFilter, lastActivityFilter, countryFilter, activityMetricsFilter].some((f) => f.value !== "Todos"),
);
const clearFilters = () => {
  search.value = "";
  for (const filter of [storeStatusFilter, onboardingStatusFilter, lastActivityFilter, countryFilter, activityMetricsFilter]) filter.value = "Todos";
};

// ---- Chart: registered users per week (one series, so no legend) ----
const cUsers = ref<HTMLCanvasElement | null>(null);
let usersChart: Chart | null = null;

const themeColor = (el: Element, name: string, alpha = 1) => {
  const rgb = getComputedStyle(el).getPropertyValue(`--v-theme-${name}`).trim();
  return rgb ? `rgba(${rgb}, ${alpha})` : `rgba(224, 179, 65, ${alpha})`;
};

const initCharts = () => {
  usersChart?.destroy();
  usersChart = null;
  const canvas = cUsers.value;
  const trend = dashboardData.value?.user_growth_trend;
  if (!canvas || !trend) return;
  const accent = themeColor(canvas, "accent");
  const ink = themeColor(canvas, "on-surface", 0.6);
  const grid = themeColor(canvas, "on-surface", 0.08);
  usersChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: trend.labels,
      datasets: [
        {
          label: "Registered users",
          data: trend.data,
          borderColor: accent,
          backgroundColor: themeColor(canvas, "accent", 0.12),
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBorderWidth: 2,
          pointHoverBorderColor: themeColor(canvas, "surface"),
          pointHoverBackgroundColor: accent,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { displayColors: false, callbacks: { label: (ctx) => `${formatNumber(Number(ctx.raw))} users` } },
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: ink, maxRotation: 0, autoSkipPadding: 16 } },
        y: { grid: { color: grid }, border: { display: false }, ticks: { color: ink, callback: (v) => formatNumber(Number(v)) } },
      },
    },
  });
};

watch(tab, (newTab) => {
  if (newTab === "stats") nextTick(initCharts);
});
watch(dashboardData, (newData) => {
  if (newData && tab.value === "stats") nextTick(initCharts);
});

onMounted(async () => {
  generateWeeks();
  await fetchDashboardData();
});

onBeforeUnmount(() => usersChart?.destroy());
</script>

<script lang="ts">
export default {
  name: "SupportDash",
};
</script>

<style scoped>
/* Layout and type follow the rest of the app; colors come from the theme. */
.support-page {
  width: 100%;
}
.support {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 16px 48px;
  font-family: "Poppins", sans-serif;
  color: rgb(var(--v-theme-on-surface));
}
@media (max-width: 959px) {
  .support {
    padding-top: 72px;
  }
}

.support-kicker {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-accent));
}

/* Header */
.support-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.support-head h1 {
  font-family: "Cinzel", serif;
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  line-height: 1.2;
}
.support-head p {
  margin: 4px 0 0;
  font-size: 0.85rem;
  font-weight: 600;
}
.support-head__vs {
  margin-left: 6px;
  font-weight: 500;
  opacity: 0.6;
}
.support-head__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.support-head__week {
  width: 260px;
  max-width: 70vw;
}

.support-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px 0;
  opacity: 0.8;
}

/* Tabs */
.support-tabs {
  display: inline-flex;
  gap: 4px;
  margin-bottom: 18px;
  padding: 4px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 12px;
}
.support-tabs button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 9px;
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.7;
  transition: background 0.15s ease, opacity 0.15s ease;
}
.support-tabs button.active {
  background: rgb(var(--v-theme-surface));
  opacity: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Panels */
.panel {
  padding: 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 16px;
}
.panel__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}
.panel__head h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 800;
}
.panel__head small {
  font-size: 0.72rem;
  opacity: 0.6;
}
.panel__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0;
  padding: 20px 0;
  font-size: 0.85rem;
  opacity: 0.6;
  text-align: center;
}

.overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Status: reserved colors, always with an icon and a word */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}
.status-pill--good,
.signal--good .signal__icon {
  color: #4cc27a;
}
.status-pill--warning,
.signal--warning .signal__icon {
  color: #f0b23a;
}
.status-pill--critical,
.signal--critical .signal__icon {
  color: #ef6a5e;
}
.status-pill--good { background: rgba(76, 194, 122, 0.14); }
.status-pill--warning { background: rgba(240, 178, 58, 0.14); }
.status-pill--critical { background: rgba(239, 106, 94, 0.14); }

.signals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.signal {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  border-left: 3px solid currentColor;
  border-radius: 10px;
}
.signal--good { border-left-color: #4cc27a; }
.signal--warning { border-left-color: #f0b23a; }
.signal--critical { border-left-color: #ef6a5e; }
.signal > div {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.signal strong {
  font-size: 0.85rem;
}
.signal span {
  font-size: 0.78rem;
  opacity: 0.7;
}
.signal__value {
  font-size: 1rem !important;
  font-weight: 800;
  opacity: 1 !important;
  white-space: nowrap;
}

/* KPIs */
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 12px;
}
@media (max-width: 599px) {
  .kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  .kpi {
    padding: 12px;
  }
  .kpi__value {
    font-size: 1.5rem;
  }
  .kpi__delta em {
    display: none;
  }
}
.kpi {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  text-align: left;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 14px;
  color: inherit;
  cursor: default;
}
.kpi--link {
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.kpi--link:hover {
  border-color: rgb(var(--v-theme-accent));
}
.kpi__label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0.7;
}
.kpi__value {
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1.1;
}
.kpi__delta {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.75rem;
  font-weight: 700;
}
.kpi__delta em {
  margin-left: 4px;
  font-style: normal;
  font-weight: 500;
  opacity: 0.6;
  color: rgb(var(--v-theme-on-surface));
}
.delta--up { color: #4cc27a; }
.delta--down { color: #ef6a5e; }
.delta--flat { opacity: 0.6; }
.kpi__target {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
}
.kpi__target small {
  font-size: 0.68rem;
  opacity: 0.6;
}
.kpi__bar,
.bar {
  display: block;
  height: 6px;
  overflow: hidden;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 999px;
}
.kpi__bar > span,
.bar > span {
  display: block;
  height: 100%;
  background: rgb(var(--v-theme-accent));
  border-radius: 999px;
}

/* Overview grid */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.panel--wide {
  grid-column: 1 / -1;
}
@media (max-width: 899px) {
  .overview-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
.chart-box {
  position: relative;
  height: 240px;
}
.mini-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px;
  margin-top: 14px;
}
.mini-stats > div,
.tile {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  border-radius: 10px;
}
.mini-stats strong,
.tile strong {
  font-size: 1.15rem;
  font-weight: 800;
}
.mini-stats span,
.tile span {
  font-size: 0.72rem;
  opacity: 0.65;
}
.tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

/* Ranked bars */
.bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bars__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 0.82rem;
}
.bars__row > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bars__row strong {
  font-weight: 800;
  white-space: nowrap;
}
.bars__row em {
  font-style: normal;
  font-weight: 500;
  opacity: 0.6;
}
.bars small {
  display: block;
  margin-top: 4px;
  font-size: 0.7rem;
  opacity: 0.55;
}
.rank {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(var(--v-theme-on-surface), 0.08);
  font-size: 0.68rem;
  font-weight: 800;
}

/* Segmented control */
.seg {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 9px;
}
.seg button {
  padding: 4px 10px;
  border-radius: 7px;
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0.7;
}
.seg button.active {
  background: rgb(var(--v-theme-surface));
  opacity: 1;
}

/* Retailers */
.filters {
  display: grid;
  grid-template-columns: minmax(220px, 2fr) repeat(5, minmax(140px, 1fr));
  gap: 8px;
}
@media (max-width: 1199px) {
  .filters {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  .filters__search {
    grid-column: 1 / -1;
  }
}
.filters__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 8px;
  font-size: 0.8rem;
}
.filters__bar > span {
  opacity: 0.7;
}
.table-scroll {
  overflow-x: auto;
}
.retailers-table {
  min-width: 760px;
  background: transparent !important;
}
.retailers-table :deep(th) {
  font-size: 0.7rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.6;
  white-space: nowrap;
}
.retailers-table :deep(td) {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  vertical-align: middle;
}
.retailers-table :deep(tbody tr:hover) {
  background: rgba(var(--v-theme-on-surface), 0.03);
}
.cell-main {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.88rem;
  font-weight: 700;
}
.cell-sub {
  font-size: 0.74rem;
  opacity: 0.65;
}
.inactive--warning {
  color: #f0b23a;
  opacity: 1;
}
.inactive--critical {
  color: #ef6a5e;
  opacity: 1;
}
.onboarding-chip {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--chip) 18%, transparent);
  color: var(--chip);
  font-size: 0.74rem;
  font-weight: 700;
  white-space: nowrap;
}
/* Phones: each retailer is a card with labelled facts. */
@media (max-width: 699px) {
  .retailers-table {
    min-width: 0;
  }
  .retailers-table :deep(thead) {
    display: none;
  }
  .retailers-table :deep(tbody tr) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 12px;
    margin-bottom: 10px;
    padding: 12px;
    background: rgba(var(--v-theme-on-surface), 0.04);
    border-radius: 12px;
  }
  .retailers-table :deep(tbody td) {
    height: auto !important;
    padding: 0 !important;
    border: none !important;
    text-align: left !important;
  }
  .retailers-table :deep(td[data-label])::before {
    content: attr(data-label);
    display: block;
    margin-bottom: 2px;
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.5;
  }
  .retailers-table :deep(td.cell--title),
  .retailers-table :deep(td.cell--action) {
    grid-column: 1 / -1;
  }
  .retailers-table :deep(td.cell--title)::before {
    display: none;
  }
  .retailers-table :deep(td.cell--action .v-btn) {
    width: 100%;
  }
}
.count-btn {
  min-width: 36px;
  padding: 3px 10px;
  border-radius: 8px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  font-weight: 800;
  transition: background 0.15s ease;
}
.count-btn:hover:not(:disabled) {
  background: rgba(var(--v-theme-accent), 0.25);
}
.count-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

/* Dialogs */
.support-dialog {
  background: rgb(var(--v-theme-surface)) !important;
  font-family: "Poppins", sans-serif;
}
.support-dialog__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 8px 14px 20px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.support-dialog__head > div {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.support-dialog__head small {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-accent));
}
.support-dialog__head strong {
  font-family: "Cinzel", serif;
  font-size: 1.2rem;
}
.support-dialog__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 20px !important;
}
.support-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px 16px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.validation {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
}
.validation > div {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
}
.validation strong {
  font-size: 0.9rem;
}
.validation span {
  font-size: 0.78rem;
  opacity: 0.75;
}
.validation--ok {
  background: rgba(76, 194, 122, 0.12);
  color: #4cc27a;
}
.validation--bad {
  background: rgba(239, 106, 94, 0.12);
  color: #ef6a5e;
}
.validation--ok > div,
.validation--bad > div {
  color: rgb(var(--v-theme-on-surface));
}
.dlg-section h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}
.facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;
  margin: 0;
}
.facts__wide {
  grid-column: 1 / -1;
}
.facts dt {
  font-size: 0.7rem;
  opacity: 0.6;
}
.facts dd {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.facts a {
  color: rgb(var(--v-theme-accent));
  text-decoration: none;
}
.dlg-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
@media (max-width: 559px) {
  .dlg-fields,
  .facts,
  .tiles {
    grid-template-columns: minmax(0, 1fr);
  }
}
.mini-chip {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 1;
}
.mini-chip--ok {
  background: rgba(76, 194, 122, 0.16);
  color: #4cc27a;
}
.mini-chip--warn {
  background: rgba(240, 178, 58, 0.16);
  color: #f0b23a;
}
.store-map {
  width: 100%;
  height: 180px;
  margin-top: 12px;
  border: 0;
  border-radius: 12px;
}
</style>
