<template>
  <v-container class="support-dashboard-container pa-4" fluid>
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h4 font-weight-black cinzel-text text-uppercase text-white">Support & Analytics</h1>
          <p class="text-subtitle-2 text-grey-lighten-1">Real-time metrics and retailer administration</p>
        </div>
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-refresh"
          @click="fetchDashboardData"
          :loading="loading"
          class="font-weight-bold"
        >
          Refresh Data
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <div v-if="loading && !dashboardData" class="d-flex flex-column justify-center align-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="6"
        class="mb-4"
      ></v-progress-circular>
      <span class="text-body-1 text-grey-lighten-1">Retrieving database metrics...</span>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      title="Error Loading Data"
      :text="error"
      variant="tonal"
      class="mb-6"
    ></v-alert>

    <!-- Dashboard Content -->
    <div v-else-if="dashboardData">
      <!-- Tabs Navigation -->
      <v-tabs
        v-model="tab"
        bg-color="transparent"
        color="white"
        align-tabs="center"
        grow
        class="mb-6"
      >
        <v-tab value="stats" class="text-h6 font-weight-bold cinzel-text">
          <v-icon start>mdi-chart-bar</v-icon>
          Statistics
        </v-tab>
        <v-tab value="retailers" class="text-h6 font-weight-bold cinzel-text">
          <v-icon start>mdi-storefront-outline</v-icon>
          Retailers ({{ dashboardData.retailers.length }})
        </v-tab>
      </v-tabs>

      <!-- Windows -->
      <v-window v-model="tab">
        <!-- TAB 1: STATISTICS -->
        <v-window-item value="stats">
          <!-- KPI Row -->
          <v-row class="mb-6">
            <!-- Total Users -->
            <v-col cols="12" sm="6" md="3">
              <v-card color="primary" elevation="2" rounded="lg" class="pa-4 h-100 d-flex flex-column justify-space-between">
                <div>
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="text-overline text-grey-lighten-1">Total Users</span>
                    <v-icon color="grey-lighten-1">mdi-account-group</v-icon>
                  </div>
                  <div class="text-h3 font-weight-black text-white">{{ dashboardData.saude_geral.total_users }}</div>
                </div>
                <div class="text-caption text-grey-lighten-1 mt-2">Historical registrations</div>
              </v-card>
            </v-col>

            <!-- Active Users (12M) -->
            <v-col cols="12" sm="6" md="3">
              <v-card color="primary" elevation="2" rounded="lg" class="pa-4 h-100 d-flex flex-column justify-space-between">
                <div>
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="text-overline text-grey-lighten-1">Active Users (12M)</span>
                    <v-icon color="success">mdi-account-check</v-icon>
                  </div>
                  <div class="text-h3 font-weight-black text-white">{{ dashboardData.saude_geral.ativos_12m }}</div>
                </div>
                <div class="text-caption text-success mt-2">
                  {{ ((dashboardData.saude_geral.ativos_12m / dashboardData.saude_geral.total_users) * 100).toFixed(1) }}% activity rate
                </div>
              </v-card>
            </v-col>

            <!-- Weekly / Monthly Active -->
            <v-col cols="12" sm="6" md="3">
              <v-card color="primary" elevation="2" rounded="lg" class="pa-4 h-100 d-flex flex-column justify-space-between">
                <div>
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="text-overline text-grey-lighten-1">Active (7d / 30d)</span>
                    <v-icon color="warning">mdi-run-fast</v-icon>
                  </div>
                  <div class="text-h3 font-weight-black text-white">
                    {{ dashboardData.saude_geral.ativos_7d }} <span class="text-h5 text-grey">/ {{ dashboardData.saude_geral.ativos_30d }}</span>
                  </div>
                </div>
                <div class="text-caption text-grey-lighten-1 mt-2">Unique users performing actions</div>
              </v-card>
            </v-col>

            <!-- Registered Retailers -->
            <v-col cols="12" sm="6" md="3">
              <v-card color="primary" elevation="2" rounded="lg" class="pa-4 h-100 d-flex flex-column justify-space-between">
                <div>
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="text-overline text-grey-lighten-1">Retailers</span>
                    <v-icon color="blue">mdi-store</v-icon>
                  </div>
                  <div class="text-h3 font-weight-black text-white">{{ dashboardData.saude_geral.total_retailers }}</div>
                </div>
                <div class="text-caption text-grey-lighten-1 mt-2">Local stores & organizers</div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Executive Summary & Geographic -->
          <v-row class="mb-6">
            <!-- Growth & Engagement -->
            <v-col cols="12" md="6">
              <v-card color="primary" elevation="2" rounded="lg" class="h-100 pa-4">
                <v-card-title class="cinzel-text text-h6 text-white px-0 border-b pb-2 mb-4">
                  <v-icon start color="warning">mdi-bulletin-board</v-icon> GROWTH & ENGAGEMENT
                </v-card-title>
                <div class="text-body-2 text-white">
                  <div class="d-flex align-start mb-3">
                    <v-icon color="success" class="mr-2 mt-1" size="small">mdi-checkbox-blank-circle</v-icon>
                    <span>
                      <strong>Onboarding Spike:</strong> Out of the <strong>{{ dashboardData.saude_geral.novos_usuarios_30d }}</strong> new signups in the last 30 days, <strong>{{ dashboardData.saude_geral.novos_usuarios_7d }} ({{ ((dashboardData.saude_geral.novos_usuarios_7d / dashboardData.saude_geral.novos_usuarios_30d) * 100 || 0).toFixed(1) }}%)</strong> registered in the last 7 days.
                    </span>
                  </div>

                  <div class="d-flex align-start mb-3">
                    <v-icon color="warning" class="mr-2 mt-1" size="small">mdi-checkbox-blank-circle</v-icon>
                    <span>
                      <strong>Weekly Community:</strong> <strong>{{ dashboardData.saude_geral.ativos_7d }}</strong> users active in the last week, matching <strong>{{ ((dashboardData.saude_geral.ativos_7d / dashboardData.saude_geral.ativos_12m) * 100 || 0).toFixed(1) }}%</strong> of the yearly active base.
                    </span>
                  </div>

                  <div class="d-flex align-start mb-4">
                    <v-icon color="blue" class="mr-2 mt-1" size="small">mdi-checkbox-blank-circle</v-icon>
                    <span>
                      <strong>Campaign Expansion:</strong> <strong>{{ dashboardData.saude_geral.campanhas_novas_7d }}</strong> new campaigns created in the last 7 days (out of <strong>{{ dashboardData.saude_geral.campanhas_novas_30d }}</strong> in the last month).
                    </span>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="d-flex justify-space-between align-center bg-black-opacity rounded pa-3">
                    <div class="text-center flex-grow-1">
                      <div class="text-caption text-grey-lighten-1">ACTIVE CAMPAIGNS</div>
                      <div class="text-h6 font-weight-black text-white">{{ dashboardData.saude_geral.campanhas_ativas }}</div>
                    </div>
                    <v-divider vertical class="mx-3"></v-divider>
                    <div class="text-center flex-grow-1">
                      <div class="text-caption text-grey-lighten-1">ACTIVE EVENTS</div>
                      <div class="text-h6 font-weight-black text-white">{{ dashboardData.saude_geral.eventos_ativos }}</div>
                    </div>
                    <v-divider vertical class="mx-3"></v-divider>
                    <div class="text-center flex-grow-1">
                      <div class="text-caption text-grey-lighten-1">COMPLETED EVENTS</div>
                      <div class="text-h6 font-weight-black text-white">{{ dashboardData.saude_geral.eventos_passados_total }}</div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Top Countries -->
            <v-col cols="12" md="6">
              <v-card color="primary" elevation="2" rounded="lg" class="h-100 pa-4">
                <v-card-title class="cinzel-text text-h6 text-white px-0 border-b pb-2 mb-4">
                  <v-icon start color="warning">mdi-earth</v-icon> GEOGRAPHIC DISTRIBUTION
                </v-card-title>
                <v-list bg-color="transparent" class="pa-0">
                  <v-list-item
                    v-for="(country, idx) in dashboardData.saude_geral.countries.slice(0, 6)"
                    :key="country.country"
                    class="px-2 py-1 rounded mb-2 hover-bg"
                  >
                    <template v-slot:prepend>
                      <div class="rank-badge mr-3 d-flex justify-center align-center font-weight-black">
                        {{ idx + 1 }}
                      </div>
                    </template>
                    <v-list-item-title class="font-weight-medium text-white">{{ country.country }}</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="primary" class="font-weight-black">
                        {{ country.count }} users
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>

          <!-- Feature Adoption & Profile Customizations -->
          <v-row class="mb-6">
            <!-- Feature Tracking -->
            <v-col cols="12" md="6">
              <v-card color="primary" elevation="2" rounded="lg" class="h-100 pa-4">
                <v-card-title class="cinzel-text text-h6 text-white px-0 border-b pb-2 mb-4">
                  <v-icon start color="warning">mdi-chart-line</v-icon> FEATURE ADOPTION & USE
                </v-card-title>
                <div class="px-2">
                  <!-- Library Usage -->
                  <div class="mb-4">
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span class="text-body-2 font-weight-bold text-white">
                        <v-icon start size="18" color="blue-lighten-2">mdi-library-shelves</v-icon> Library (Collections)
                      </span>
                      <span class="text-caption text-grey">{{ dashboardData.feature_usage.library_users }} users</span>
                    </div>
                    <v-progress-linear color="blue" height="6" :model-value="(dashboardData.feature_usage.library_users / dashboardData.saude_geral.total_users) * 100" rounded></v-progress-linear>
                    <div class="d-flex justify-space-between text-caption text-grey-lighten-2 mt-1">
                      <span>Total items added: {{ dashboardData.feature_usage.library_items }}</span>
                      <span>Average: {{ dashboardData.feature_usage.library_avg }} per collection</span>
                    </div>
                  </div>

                  <!-- Custom Heroes -->
                  <div class="mb-4">
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span class="text-body-2 font-weight-bold text-white">
                        <v-icon start size="18" color="amber-lighten-2">mdi-shield-sword</v-icon> Playable Heroes (Custom)
                      </span>
                      <span class="text-caption text-grey">{{ dashboardData.feature_usage.heroes_creators }} users</span>
                    </div>
                    <v-progress-linear color="amber" height="6" :model-value="(dashboardData.feature_usage.heroes_creators / dashboardData.saude_geral.total_users) * 100" rounded></v-progress-linear>
                    <div class="d-flex justify-space-between text-caption text-grey-lighten-2 mt-1">
                      <span>Total heroes: {{ dashboardData.feature_usage.heroes_count }}</span>
                      <span>Average: {{ dashboardData.feature_usage.heroes_avg }} per creator</span>
                    </div>
                  </div>

                  <!-- Local Events -->
                  <div>
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span class="text-body-2 font-weight-bold text-white">
                        <v-icon start size="18" color="purple-lighten-2">mdi-map-marker-radius</v-icon> Local Events & Mesas
                      </span>
                      <span class="text-caption text-grey">{{ dashboardData.feature_usage.events_participants }} participants</span>
                    </div>
                    <v-progress-linear color="purple" height="6" :model-value="(dashboardData.feature_usage.events_participants / dashboardData.saude_geral.total_users) * 100" rounded></v-progress-linear>
                    <div class="d-flex justify-space-between text-caption text-grey-lighten-2 mt-1">
                      <span>Active mesas: {{ dashboardData.feature_usage.events_tables }}</span>
                      <span>Active QR codes: {{ dashboardData.feature_usage.events_qrs }}</span>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Customizations & Social -->
            <v-col cols="12" md="6">
              <v-card color="primary" elevation="2" rounded="lg" class="h-100 pa-4">
                <v-card-title class="cinzel-text text-h6 text-white px-0 border-b pb-2 mb-4">
                  <v-icon start color="warning">mdi-account-cog</v-icon> CUSTOMIZATION & SOCIALS
                </v-card-title>
                <v-row dense>
                  <v-col cols="6" class="pb-2 pr-1">
                    <div class="stat-inner pa-3 rounded text-center">
                      <div class="text-caption text-grey-lighten-2 mb-1">PROFILE PICTURES</div>
                      <div class="text-h5 font-weight-bold text-white">{{ dashboardData.feature_usage.profile_pic }}</div>
                      <div class="text-caption text-grey">users customized</div>
                    </div>
                  </v-col>
                  <v-col cols="6" class="pb-2 pl-1">
                    <div class="stat-inner pa-3 rounded text-center">
                      <div class="text-caption text-grey-lighten-2 mb-1">PROFILE BACKGROUNDS</div>
                      <div class="text-h5 font-weight-bold text-white">{{ dashboardData.feature_usage.profile_bg }}</div>
                      <div class="text-caption text-grey">users customized</div>
                    </div>
                  </v-col>
                  <v-col cols="6" class="pt-2 pr-1">
                    <div class="stat-inner pa-3 rounded text-center">
                      <div class="text-caption text-grey-lighten-2 mb-1">ADDRESS ZIPCODES</div>
                      <div class="text-h5 font-weight-bold text-white">{{ dashboardData.feature_usage.profile_zip }}</div>
                      <div class="text-caption text-grey">profiles filled</div>
                    </div>
                  </v-col>
                  <v-col cols="6" class="pt-2 pl-1">
                    <div class="stat-inner pa-3 rounded text-center">
                      <div class="text-caption text-grey-lighten-2 mb-1">ACTIVE FRIENDSHIPS</div>
                      <div class="text-h5 font-weight-bold text-white">{{ dashboardData.feature_usage.friends_friendships }}</div>
                      <div class="text-caption text-grey">{{ dashboardData.feature_usage.friends_interacted }} users interacted</div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- SKU analysis section -->
          <v-row>
            <!-- Campaigns by SKU -->
            <v-col cols="12" md="4">
              <v-card color="primary" elevation="2" rounded="lg" class="pa-4 h-100">
                <v-card-title class="cinzel-text text-subtitle-1 text-white px-0 border-b pb-2 mb-3">
                  <v-icon start color="warning">mdi-television-play</v-icon> ACTIVE CAMPAIGNS BY SKU
                </v-card-title>
                <v-list bg-color="transparent" class="pa-0">
                  <v-list-item v-for="item in dashboardData.sku_analysis.campaigns" :key="item.sku" class="hover-bg py-1">
                    <v-list-item-title class="font-weight-medium text-white">{{ item.sku }}</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="primary" class="font-weight-black">{{ item.count }}</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <!-- Owned by SKU -->
            <v-col cols="12" md="4">
              <v-card color="primary" elevation="2" rounded="lg" class="pa-4 h-100">
                <v-card-title class="cinzel-text text-subtitle-1 text-white px-0 border-b pb-2 mb-3">
                  <v-icon start color="warning">mdi-package-variant-closed</v-icon> OWNED BY SKU
                </v-card-title>
                <v-list bg-color="transparent" class="pa-0 overflow-y-auto" max-height="300">
                  <v-list-item v-for="item in dashboardData.sku_analysis.owned" :key="item.sku" class="hover-bg py-1">
                    <v-list-item-title class="font-weight-medium text-white">{{ item.sku }}</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="success" class="font-weight-black">{{ item.count }}</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <!-- Wishlist by SKU -->
            <v-col cols="12" md="4">
              <v-card color="primary" elevation="2" rounded="lg" class="pa-4 h-100">
                <v-card-title class="cinzel-text text-subtitle-1 text-white px-0 border-b pb-2 mb-3">
                  <v-icon start color="warning">mdi-heart</v-icon> WISHLIST BY SKU
                </v-card-title>
                <v-list bg-color="transparent" class="pa-0 overflow-y-auto" max-height="300">
                  <v-list-item v-for="item in dashboardData.sku_analysis.wishlist" :key="item.sku" class="hover-bg py-1">
                    <v-list-item-title class="font-weight-medium text-white">{{ item.sku }}</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="warning" class="font-weight-black">{{ item.count }}</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- TAB 2: RETAILERS -->
        <v-window-item value="retailers">
          <v-card color="primary" elevation="2" rounded="lg" class="pa-4">
            <!-- Search & Filters -->
            <v-row class="mb-4" align="center">
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Search lojistas..."
                  variant="solo-filled"
                  hide-details
                  color="warning"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="storeStatusFilter"
                  :items="storeStatusOptions"
                  label="Store Status"
                  variant="solo-filled"
                  hide-details
                  color="warning"
                ></v-select>
              </v-col>
            </v-row>

            <!-- Lojistas Table -->
            <v-table class="retailers-table bg-transparent text-white">
              <thead>
                <tr class="border-b">
                  <th class="text-left font-weight-black text-warning py-3 cinzel-text">Retailer (Account)</th>
                  <th class="text-left font-weight-black text-warning py-3 cinzel-text">Associated Store</th>
                  <th class="text-left font-weight-black text-warning py-3 cinzel-text">Store Status</th>
                  <th class="text-center font-weight-black text-warning py-3 cinzel-text">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredRetailers" :key="item.users_pk" class="border-b hover-row">
                  <td class="py-3">
                    <div class="font-weight-bold text-white text-subtitle-1">{{ item.name }}</div>
                    <div class="text-caption text-grey-lighten-2">Nickname: {{ item.user_name }}</div>
                    <div class="text-caption text-grey-lighten-2">{{ item.email }}</div>
                  </td>
                  <td class="py-3">
                    <div class="font-weight-medium text-white">{{ item.store_name }}</div>
                    <div class="text-caption text-grey-lighten-2" v-if="item.store_site !== '-'">
                      {{ item.store_site }}
                    </div>
                  </td>
                  <td class="py-3">
                    <div v-if="item.stores_pk" class="d-flex flex-wrap gap-1">
                      <v-chip size="small" :color="item.store_verified ? 'success' : 'warning'" class="mr-1 mb-1 font-weight-black">
                        {{ item.store_verified ? 'Verified' : 'Unverified' }}
                      </v-chip>
                      <v-chip size="small" :color="item.store_active ? 'blue' : 'grey'" class="mb-1 font-weight-black">
                        {{ item.store_active ? 'Active' : 'Inactive' }}
                      </v-chip>
                    </div>
                    <div v-else>
                      <v-chip size="small" color="red" class="font-weight-black">No Store Created</v-chip>
                    </div>
                  </td>
                  <td class="py-3 text-center">
                    <v-btn
                      color="warning"
                      variant="flat"
                      size="small"
                      prepend-icon="mdi-eye"
                      class="font-weight-bold"
                      @click="showRetailerDetails(item)"
                    >
                      View Info
                    </v-btn>
                  </td>
                </tr>
                <tr v-if="filteredRetailers.length === 0">
                  <td colspan="4" class="text-center py-8 text-grey-lighten-1">
                    No retailers match the current filters.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-window-item>
      </v-window>
    </div>

    <!-- Retailer Details Modal Dialog -->
    <v-dialog v-model="detailsDialog" max-width="700" scrollable v-if="selectedRetailer">
      <v-card color="primary" class="text-white rounded-lg">
        <v-card-title class="d-flex justify-space-between align-center border-b pb-3 mb-4 pt-4 px-6">
          <span class="text-h5 font-weight-black cinzel-text text-warning text-uppercase">
            Retailer Details
          </span>
          <v-btn icon @click="detailsDialog = false" variant="text" color="grey">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="px-6 pb-6 pt-0">
          <v-row dense>
            <!-- Account Details Card -->
            <v-col cols="12" class="mb-4">
              <v-card color="surface" rounded="lg" class="pa-4">
                <div class="text-overline text-warning mb-2 font-weight-black cinzel-text">ACCOUNT INFO</div>
                <v-row dense>
                  <v-col cols="6" class="pb-2">
                    <div class="text-caption text-grey-lighten-2">NAME</div>
                    <div class="text-body-1 font-weight-bold">{{ selectedRetailer.name }}</div>
                  </v-col>
                  <v-col cols="6" class="pb-2">
                    <div class="text-caption text-grey-lighten-2">NICKNAME</div>
                    <div class="text-body-1 font-weight-bold">{{ selectedRetailer.user_name }}</div>
                  </v-col>
                  <v-col cols="12" class="pb-2">
                    <div class="text-caption text-grey-lighten-2">EMAIL</div>
                    <div class="text-body-1 font-weight-bold">
                      <a :href="'mailto:' + selectedRetailer.email" class="text-warning text-decoration-none">
                        {{ selectedRetailer.email }}
                      </a>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-caption text-grey-lighten-2">JOIN DATE</div>
                    <div class="text-body-1">{{ formatDate(selectedRetailer.join_date) }}</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-caption text-grey-lighten-2">USER ID</div>
                    <div class="text-body-1">#{{ selectedRetailer.users_pk }}</div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Store Details Card -->
            <v-col cols="12">
              <v-card color="surface" rounded="lg" class="pa-4" v-if="selectedRetailer.stores_pk">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-overline text-warning font-weight-black cinzel-text">STORE INFO</span>
                  <div class="d-flex gap-1">
                    <v-chip size="small" :color="selectedRetailer.store_verified ? 'success' : 'warning'" class="mr-1 font-weight-black">
                      {{ selectedRetailer.store_verified ? 'Verified' : 'Unverified' }}
                    </v-chip>
                    <v-chip size="small" :color="selectedRetailer.store_active ? 'blue' : 'grey'" class="font-weight-black">
                      {{ selectedRetailer.store_active ? 'Active' : 'Inactive' }}
                    </v-chip>
                  </div>
                </div>

                <v-progress-circular v-if="loadingStoreDetails" indeterminate color="warning" class="my-4 d-block mx-auto"></v-progress-circular>

                <v-row dense v-else-if="storeDetails">
                  <v-col cols="12" class="pb-2">
                    <div class="text-caption text-grey-lighten-2">STORE NAME</div>
                    <div class="text-body-1 font-weight-black">{{ storeDetails.name }}</div>
                  </v-col>
                  <v-col cols="12" class="pb-2">
                    <div class="text-caption text-grey-lighten-2">ADDRESS</div>
                    <div class="text-body-2">{{ storeDetails.address }}</div>
                  </v-col>
                  <v-col cols="6" class="pb-2">
                    <div class="text-caption text-grey-lighten-2">ZIPCODE</div>
                    <div class="text-body-2">{{ storeDetails.zip_code }}</div>
                  </v-col>
                  <v-col cols="6" class="pb-2">
                    <div class="text-caption text-grey-lighten-2">STATE</div>
                    <div class="text-body-2">{{ storeDetails.state || '-' }}</div>
                  </v-col>
                  <v-col cols="12" class="pb-2" v-if="storeDetails.web_site">
                    <div class="text-caption text-grey-lighten-2">WEBSITE</div>
                    <div class="text-body-2">
                      <a :href="storeDetails.web_site" target="_blank" class="text-warning text-decoration-none font-weight-bold">
                        {{ storeDetails.web_site }}
                      </a>
                    </div>
                  </v-col>
                  <v-col cols="6" class="pb-2">
                    <div class="text-caption text-grey-lighten-2">COORDINATES</div>
                    <div class="text-body-2 text-grey">Lat: {{ storeDetails.latitude || '-' }} | Lng: {{ storeDetails.longitude || '-' }}</div>
                  </v-col>
                  <v-col cols="6" class="pb-2">
                    <div class="text-caption text-grey-lighten-2">MERCHANT ID</div>
                    <div class="text-body-2 text-grey-lighten-1">{{ storeDetails.merchant_id || '-' }}</div>
                  </v-col>

                  <!-- Map section -->
                  <v-col cols="12" class="mt-3" v-if="storeDetails.latitude">
                    <v-responsive aspect-ratio="16/9" style="width: 100%; height: 180px;" class="rounded border">
                      <iframe
                        :src="`https://www.google.com/maps?q=${storeDetails.latitude},${storeDetails.longitude}&z=15&output=embed`"
                        frameborder="0"
                        style="border: 0; width: 100%; height: 100%"
                        allowfullscreen
                        loading="lazy"
                      />
                    </v-responsive>
                  </v-col>
                </v-row>
              </v-card>

              <!-- No store registered message -->
              <v-card color="surface" rounded="lg" class="pa-4 text-center py-6" v-else>
                <v-icon size="40" color="grey" class="mb-2">mdi-store-off</v-icon>
                <div class="text-body-1 font-weight-bold text-grey-lighten-1">No store registered</div>
                <div class="text-caption text-grey">This retailer has not set up their store profile yet.</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-6 pb-4 pt-0 justify-end">
          <v-btn color="warning" class="font-weight-bold px-4" @click="detailsDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject, watch } from "vue";
import { useRoute } from "vue-router";

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
const storeStatusFilter = ref("All");
const loading = ref(false);
const error = ref<string | null>(null);
const dashboardData = ref<any>(null);

// Retailer Details dialog
const detailsDialog = ref(false);
const selectedRetailer = ref<any>(null);
const storeDetails = ref<any>(null);
const loadingStoreDetails = ref(false);

const storeStatusOptions = [
  "All",
  "With Store",
  "No Store",
  "Verified Store",
  "Unverified Store",
  "Active Store",
  "Inactive Store"
];

const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get("/analytics/dashboard");
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
        name: retailer.store_name,
        address: "-",
        zip_code: "-",
        web_site: retailer.store_site !== "-" ? retailer.store_site : null,
      };
    } finally {
      loadingStoreDetails.value = false;
    }
  }
};

const filteredRetailers = computed(() => {
  if (!dashboardData.value) return [];
  
  let result = dashboardData.value.retailers;

  // Search filter
  const searchLower = search.value.toLowerCase().trim();
  if (searchLower) {
    result = result.filter((item: any) => {
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.user_name.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.store_name.toLowerCase().includes(searchLower)
      );
    });
  }

  // Store status filter
  if (storeStatusFilter.value !== "All") {
    result = result.filter((item: any) => {
      const hasStore = !!item.stores_pk;
      if (storeStatusFilter.value === "With Store") return hasStore;
      if (storeStatusFilter.value === "No Store") return !hasStore;
      if (storeStatusFilter.value === "Verified Store") return hasStore && item.store_verified;
      if (storeStatusFilter.value === "Unverified Store") return hasStore && !item.store_verified;
      if (storeStatusFilter.value === "Active Store") return hasStore && item.store_active;
      if (storeStatusFilter.value === "Inactive Store") return hasStore && !item.store_active;
      return true;
    });
  }

  return result;
});

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === "None") return "-";
  try {
    const d = new Date(dateStr);
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

onMounted(() => {
  fetchDashboardData();
});
</script>

<script lang="ts">
export default {
  name: "SupportDash",
};
</script>

<style scoped>
.support-dashboard-container {
  max-width: 1200px !important;
  margin: 0 auto;
}

.cinzel-text {
  font-family: "Cinzel", serif !important;
}

.text-warning {
  color: #FB8C00 !important;
}

.bg-black-opacity {
  background-color: rgba(0, 0, 0, 0.4);
}

.stat-inner {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(251, 140, 0, 0.15);
  color: #FB8C00;
  border: 1px solid rgba(251, 140, 0, 0.3);
  font-size: 11px;
}

.hover-bg {
  transition: background-color 0.15s ease;
}
.hover-bg:hover {
  background-color: rgba(255, 255, 255, 0.03) !important;
}

.hover-row:hover {
  background-color: rgba(255, 255, 255, 0.02) !important;
}

.gap-1 {
  gap: 4px;
}
</style>
