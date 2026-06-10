<template>
    <Badges />

    <!-- Retailer Stores Section -->
    <v-container v-if="userStore.user?.roles_fk === 3" max-width="800" class="pa-4 pt-0">
      <v-card rounded="lg" elevation="3" color="primary" class="pl-1 pt-1 pr-1 pb-5">
        <v-card-title class="d-flex justify-space-between pb-0 px-3">
          <span class="text-uppercase font-weight-black text-bold text-h5 mb-2 pb-0 text-white">
            MY STORES
          </span>
        </v-card-title>

        <div v-if="stores.length > 0" class="px-2">
          <v-card
            v-for="store in (isAllStoresExpanded ? stores : stores.slice(0, 1))"
            :key="store.stores_pk"
            color="secundary"
            class="mb-4 store-profile-card overflow-hidden"
            ripple
            @click="openStoreDetails(store)"
            style="border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; cursor: pointer;"
          >
            <!-- Top Section: Photo & Address Info (Darker) -->
            <div class="pa-4" style="background-color: rgba(0, 0, 0, 0.35);">
              <v-row align="center" no-gutters>
                <!-- Store Photo -->
                <v-col cols="auto" class="mr-4">
                  <v-avatar size="80" rounded="lg" class="checkerboard-bg" style="border: 1px solid rgba(255, 255, 255, 0.1);">
                    <v-img
                      :src="
                        store.storeImage
                          ? (store.storeImage.startsWith('http') ? store.storeImage : `https://assets.drunagor.app/${store.storeImage}`)
                          : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'
                      "
                      cover
                    />
                  </v-avatar>
                </v-col>

                <!-- Store Info -->
                <v-col class="flex-grow-1" style="min-width: 0;">
                  <h4 class="text-h6 font-weight-bold text-white mb-1 text-truncate">
                    {{ store.storename }}
                  </h4>
                  <p class="text-caption text-grey-lighten-1 mb-0">
                    {{ store.addressLine1 }}{{ store.complement ? ', ' + store.complement : '' }}
                  </p>
                  <p class="text-caption text-grey-lighten-1 mb-0">
                    {{ store.city }} - {{ store.state }}, {{ store.zipcode }}
                  </p>
                </v-col>
              </v-row>
            </div>

            <!-- Bottom Section: Statistics (Lighter / Standard Card Color) -->
            <div class="pa-4">
              <!-- Store Simple Stats -->
              <v-row no-gutters justify="space-between">
                <v-col cols="6">
                  <div class="text-caption text-grey-lighten-1 font-weight-bold text-uppercase">Events done</div>
                  <div class="text-body-1 font-weight-bold text-white">
                    {{ storeStats[store.stores_pk!]?.eventsCount || 0 }} events
                  </div>
                </v-col>
                <v-col cols="6" class="pl-2">
                  <div class="text-caption text-grey-lighten-1 font-weight-bold text-uppercase">Players hosted</div>
                  <div class="text-body-1 font-weight-bold text-white">
                    {{ storeStats[store.stores_pk!]?.playersCount || 0 }} players
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <!-- Expand/Collapse Button -->
          <div v-if="stores.length > 1" class="d-flex justify-center mt-2">
            <v-btn
              variant="text"
              color="white"
              class="font-weight-bold"
              @click="isAllStoresExpanded = !isAllStoresExpanded"
            >
              {{ isAllStoresExpanded ? 'Show Less' : `Show all stores (${stores.length})` }}
              <v-icon right class="ml-1">
                {{ isAllStoresExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </v-btn>
          </div>
        </div>

        <div v-else class="px-2">
          <v-card color="secondary" class="pa-6 text-center" style="border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;">
            <v-icon size="48" color="grey-darken-1" class="mb-2">mdi-store-outline</v-icon>
            <div class="text-h6 text-white font-weight-bold mb-1">No Stores Registered</div>
            <p class="text-caption text-grey-lighten-1 mb-4">You need to register a store to host events.</p>
            <v-btn color="primary" class="text-white font-weight-bold" @click="router.push('/profile/store-settings')">
              Manage Stores
            </v-btn>
          </v-card>
        </div>
      </v-card>
    </v-container>

    <RecentCampaignWidget v-if="userStore.user?.users_pk" :userId="userStore.user?.users_pk" />
    <UserLibraryWidget v-if="userStore.user?.users_pk" :userId="userStore.user?.users_pk" :userName="userStore.user?.user_name" />

    <!-- Store Detail Dialog -->
    <v-dialog v-model="storeDialog.show" max-width="500px" transition="dialog-bottom-transition">
      <v-card v-if="storeDialog.store" color="#151515" class="rounded-lg overflow-hidden" style="border: 1px solid rgba(255, 255, 255, 0.1);">
        <!-- Banner and Header -->
        <div class="position-relative">
          <v-img
            :src="
              currentBackgroundHash
                ? assets + '/Profile/' + currentBackgroundHash + '?t=' + userStore.cacheBuster
                : assets + '/Profile/profile-bg-warriors-transparent.png'
            "
            height="180px"
            cover
          >
            <!-- Close Button -->
            <v-btn
              icon
              variant="flat"
              color="rgba(0, 0, 0, 0.5)"
              class="position-absolute top-0 left-0 ma-2 text-white"
              size="small"
              @click="storeDialog.show = false"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-img>

          <!-- Store Logo -->
          <v-avatar
            size="88"
            rounded="lg"
            class="checkerboard-bg position-absolute"
            style="
              bottom: 0;
              left: 50%;
              transform: translate(-50%, 50%);
              border: 2px solid white;
              box-shadow: 0px 4px 8px rgba(0,0,0,0.3);
            "
          >
            <v-img
              :src="
                storeDialog.store.storeImage
                  ? (storeDialog.store.storeImage.startsWith('http') ? storeDialog.store.storeImage : `https://assets.drunagor.app/${storeDialog.store.storeImage}`)
                  : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'
              "
              cover
            />
          </v-avatar>
        </div>

        <!-- Store Name -->
        <v-card-text class="pt-14 text-center pb-4">
          <h3 class="text-h5 font-weight-black text-white px-4">
            {{ storeDialog.store.storename }}
          </h3>
        </v-card-text>

        <v-card-text class="px-6 text-body-1 text-white">
          <!-- Map and Address Card -->
          <v-card
            color="#1E1E1E"
            class="mb-4 overflow-hidden"
            style="border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;"
            ripple
            @click="openInGoogleMaps(storeDialog.store)"
          >
            <!-- Google Maps Embed -->
            <v-responsive
              style="width: 100%; height: 140px"
              aspect-ratio="16/9"
            >
              <iframe
                :src="storeDialogMapUrl"
                frameborder="0"
                style="border: 0; width: 100%; height: 100%"
                allowfullscreen
                loading="lazy"
              />
            </v-responsive>

            <!-- Address overlay at bottom -->
            <div class="pa-4 text-white" style="background-color: rgb(var(--v-theme-primary));">
              <div class="font-weight-bold text-body-1 mb-1">
                {{ storeDialog.store.addressLine1 }}
              </div>
              <div class="text-caption" style="opacity: 0.9;">
                {{ storeDialog.store.complement ? storeDialog.store.complement + ', ' : '' }}{{ storeDialog.store.city }} - {{ storeDialog.store.state }}, {{ storeDialog.store.zipcode }}
              </div>
              <div class="text-caption mt-1" v-if="storeDialog.store.phone" style="opacity: 0.9;">
                <v-icon size="14" class="mr-1">mdi-phone</v-icon>
                {{ storeDialog.store.phone }}
              </div>
            </div>
          </v-card>

          <!-- Statistics Card -->
          <v-card color="primary" class="pa-4 mb-6 text-white" style="border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;">
            <h4 class="text-h6 font-weight-bold text-uppercase mb-4">
              STATISTICS
            </h4>

            <div class="mb-3">
              <div class="font-weight-bold text-body-1">Events done</div>
              <div class="text-caption text-grey-lighten-2">
                Total events created: {{ storeStats[storeDialog.store.stores_pk!]?.eventsCount || 0 }}
              </div>
            </div>

            <div class="mb-3">
              <div class="font-weight-bold text-body-1">Players hosted</div>
              <div class="text-caption text-grey-lighten-2">
                Unique attendees: {{ storeStats[storeDialog.store.stores_pk!]?.playersCount || 0 }}
              </div>
            </div>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, inject } from "vue";
import { useRouter } from "vue-router";
import Badges from "@/components/Badges.vue";
import UserLibraryWidget from "@/components/UserLibraryWidget.vue";
import RecentCampaignWidget from "@/components/RecentCampaignWidget.vue";
import { useUserStore } from "@/store/UserStore";

const userStore = useUserStore();
const router = useRouter();
const axios: any = inject("axios");
const assets = inject<string>("assets");

const stores = ref<any[]>([]);
const storeStats = ref<Record<number, { eventsCount: number, playersCount: number }>>({});
const countriesList = ref<any[]>([]);
const isAllStoresExpanded = ref(false);

const storeDialog = ref({
  show: false,
  store: null as any
});

const storeDialogMapUrl = computed(() => {
  if (!storeDialog.value.store) return "";
  const store = storeDialog.value.store;
  if (store.latitude && store.longitude) {
    return `https://maps.google.com/maps?q=${store.latitude},${store.longitude}&z=15&output=embed`;
  }
  // Fallback to text address query
  const query = store.address || `${store.addressLine1 || ""}, ${store.city || ""} - ${store.state || ""}, ${store.zipcode || ""}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
});

const currentBackgroundHash = computed(() => userStore.user?.background_hash);

const formattedJoinDate = computed(() => {
  if (!userStore.user?.join_date) return "Unknown";
  return new Date(userStore.user.join_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
});

const openStoreDetails = (store: any) => {
  storeDialog.value = {
    show: true,
    store: store
  };
};

const openInGoogleMaps = (store: any) => {
  if (!store) return;
  let query = "";
  if (store.latitude && store.longitude) {
    query = `${store.latitude},${store.longitude}`;
  } else {
    query = store.address || `${store.addressLine1 || ""}, ${store.city || ""} - ${store.state || ""}, ${store.zipcode || ""}`;
  }
  if (!query) return;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  window.open(mapsUrl, "_blank");
};

const fetchCountries = async () => {
  try {
    const response = await axios.get("countries/search");
    countriesList.value = response.data.countries || [];
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

const mapStoreFromApi = (apiStore: any) => {
  const addressParts = apiStore.address?.split(",").map((s: any) => s.trim()) || [];
  const [streetNumber, address, complement, city, state, countryName] = addressParts;

  const countryObject = countriesList.value.find(
    (c: any) => c.name.toLowerCase() === (countryName || "").toLowerCase()
  );
  const countryId = countryObject ? countryObject.countries_pk : null;
  const addressLine1 = [streetNumber, address].filter(Boolean).join(" ");

  return {
    stores_pk: apiStore.stores_pk,
    storename: apiStore.name || apiStore.storename || "",
    site: apiStore.web_site || apiStore.site || "",
    zipcode: apiStore.zip_code || apiStore.zipcode || "",
    country: countryId,
    state: state || "",
    city: city || "",
    complement: complement || "",
    addressLine1: addressLine1,
    MerchantID: apiStore.merchant_id || apiStore.MerchantID || "",
    storeImage: apiStore.picture_hash || apiStore.storeImage || "",
    verified: apiStore.verified,
    phone: apiStore.phone || "",
    address: apiStore.address || "",
    latitude: apiStore.latitude || apiStore.lat || null,
    longitude: apiStore.longitude || apiStore.lng || null
  };
};

const fetchStoresAndStats = async () => {
  if (!userStore.user?.users_pk) return;
  try {
    // 1. Fetch stores
    const response = await axios.get("/stores/list", {
      params: { users_fk: userStore.user?.users_pk },
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
    const mapped = (response.data.stores || []).map(mapStoreFromApi);

    // 2. Fetch events
    const [activeEventsRes, pastEventsRes] = await Promise.all([
      axios.get("/events/my_events/retailer", {
        params: { retailer_fk: userStore.user.users_pk, active: "true", past_events: "false" },
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      }).catch(() => ({ data: { events: [] } })),
      axios.get("/events/my_events/retailer", {
        params: { retailer_fk: userStore.user.users_pk, active: "true", past_events: "true" },
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      }).catch(() => ({ data: { events: [] } }))
    ]);

    const allEvents = [
      ...(activeEventsRes.data.events || []),
      ...(pastEventsRes.data.events || [])
    ];

    // 3. Fetch players count for all stores concurrently
    await Promise.all(mapped.map(async (store) => {
      const storeEvents = allEvents.filter(
        e => e.stores_fk === store.stores_pk || e.store_name === store.storename
      );

      const playerPromises = storeEvents.map(event =>
        axios.get("/rl_events_users/list_players", {
          params: { events_fk: event.events_pk },
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }).then(res => res.data.players || []).catch(() => [])
      );

      const playersLists = await Promise.all(playerPromises);
      const uniquePlayers = new Set(playersLists.flat().map((p: any) => p.users_pk));

      storeStats.value[store.stores_pk] = {
        eventsCount: storeEvents.length,
        playersCount: uniquePlayers.size
      };
    }));

    // 4. Sort mapped stores by events count descending
    mapped.sort((a, b) => {
      const countA = storeStats.value[a.stores_pk]?.eventsCount || 0;
      const countB = storeStats.value[b.stores_pk]?.eventsCount || 0;
      return countB - countA;
    });

    // 5. Update stores.value with sorted list
    stores.value = mapped;
  } catch (error) {
    console.error("Error fetching stores and stats:", error);
  }
};

onMounted(async () => {
  await fetchCountries();
  if (userStore.user?.roles_fk === 3) {
    await fetchStoresAndStats();
  }
});
</script>

<style scoped>
.checkerboard-bg {
  background-color: #2c2c2c;
  background-image: 
    linear-gradient(45deg, #1e1e1e 25%, transparent 25%), 
    linear-gradient(-45deg, #1e1e1e 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #1e1e1e 75%), 
    linear-gradient(-45deg, transparent 75%, #1e1e1e 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
.store-profile-card {
  transition: all 0.3s ease;
}
.store-profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
