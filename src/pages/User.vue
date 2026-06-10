<template>
  <div>
    <v-card color="primary" class="profile-card mx-auto py-0 mt-16" rounded="0" elevation="3" style="
      overflow: visible;
      position: relative;
      text-align: center;
      width: 100%;
    ">
    <div class="position-relative bg-grey-darken-4" style="min-height: 120px; width: 100%;">
      <v-img
        :src="
          user.background_hash
            ? assets + '/Profile/' + user.background_hash
            : assets + '/Profile/profile-bg-warriors-transparent.png'
        "
        alt="Background Image"
        max-height="529px"
        cover
        position="center center"
      ></v-img>

      <v-btn icon="mdi-arrow-left" class="position-absolute top-0 left-0 ma-2 d-none d-md-flex" color="rgba(0, 0, 0, 0.6)" style="z-index: 10;"
        elevation="3" @click="$router.go(-1)"></v-btn>


      <v-menu v-if="isFriend" open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-account-check" class="position-absolute top-0 right-0 ma-2" style="z-index: 10;"
            color="rgba(0, 0, 0, 0.6)" elevation="3"></v-btn>
        </template>
        <!-- <v-list class="ma-2">
          <v-list-item @click="removeFriend">
            <v-list-item-icon>
              <v-icon>mdi-account-remove</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list> -->
      </v-menu>

      <v-btn v-else icon="mdi-account-plus" class="position-absolute top-0 right-0 ma-2" color="rgba(0, 0, 0, 0.6)" style="z-index: 10;"
        elevation="3" @click="addFriend"></v-btn>


      <p class="user-join-date"
        style="position: absolute; bottom: 4px; right: 4px; font-size: 0.7rem; color: #ddd; margin: 0; z-index: 10; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
        Joined: {{ formattedJoinDate }}
      </p>
    </div>

    <div class="d-flex justify-center" style="margin-top: -59px; position: relative; z-index: 20;">
      <v-img :key="reloadKey" :src="user.picture_hash
          ? assets + '/Profile/' + user.picture_hash
          : assets + '/Profile/user.png'
        " :alt="user.picture_hash" width="118" height="118" cover style="
          border: 2px solid white;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
          background-color: black;
          flex-grow: 0;
          flex-shrink: 0;
      ">
      </v-img>
    </div>

    <v-card-text>
      <div class="user-info text-center mt-2">
        <div class="user-name d-flex justify-center align-center" style="font-weight: bold; font-size: 1.4rem; gap: 8px;">
          <span>{{ user.user_name }}</span>

          <v-tooltip location="top" v-if="user?.roles_fk === 3">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                color="primary"
                class="ml-1"
                size="22"
              >
                mdi-store
              </v-icon>
            </template>
            <span>Retailer Account</span>
          </v-tooltip>

          <div class="d-none d-md-flex justify-center align-center">
            <v-menu v-if="isFriend" open-on-hover>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-account-check" color="rgba(0, 0, 0, 0.0)" elevation="0"
                  size="small"></v-btn>
              </template>
              <!-- <v-list>
              <v-list-item @click="removeFriend">
                <v-list-item-icon>
                  <v-icon >mdi-account-remove</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Remove Friend</v-list-item-title>
              </v-list-item>
            </v-list> -->
            </v-menu>

            <v-btn v-else icon="mdi-account-plus" color="rgba(0, 0, 0, 0.6)" elevation="3" size="small"
              @click="addFriend"></v-btn>
          </div>
        </div>

        <BaseAlert
          v-model="showAlert"
          type="success"
          text
          class="custom-alert"
        >
          Friend request sent!
        </BaseAlert>

        <BaseAlert
          v-model="showErrorAlert"
          type="error"
          class="custom-alert"
        >
          {{ errorMessage }}
        </BaseAlert>
      </div>
    </v-card-text>

  </v-card>

  <BadgesUser />

  <!-- Retailer Stores Section for another player -->
  <v-container v-if="user?.roles_fk === 3" max-width="800" class="pa-4 pt-0">
    <v-card rounded="lg" elevation="3" color="primary" class="pl-1 pt-1 pr-1 pb-5">
      <v-card-title class="d-flex justify-space-between pb-0 px-3">
        <span class="text-uppercase font-weight-black text-bold text-h5 mb-2 pb-0 text-white">
          STORES
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
          <p class="text-caption text-grey-lighten-1">This retailer has no stores registered.</p>
        </v-card>
      </div>
    </v-card>
  </v-container>

  <RecentCampaignWidget v-if="user.users_pk" :userId="user.users_pk" />

  <UserLibraryWidget v-if="user.users_pk" :userId="user.users_pk" :userName="user.user_name" />

  <!-- Store Detail Dialog -->
  <v-dialog v-model="storeDialog.show" max-width="500px" transition="dialog-bottom-transition">
    <v-card v-if="storeDialog.store" color="#151515" class="rounded-lg overflow-hidden" style="border: 1px solid rgba(255, 255, 255, 0.1);">
      <!-- Banner and Header -->
      <div class="position-relative">
        <v-img
          :src="
            user.background_hash
              ? assets + '/Profile/' + user.background_hash
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

  </div>
</template>

<script lang="ts" setup>
import { inject, computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/store/UserStore";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import UserLibraryWidget from "@/components/UserLibraryWidget.vue";
import RecentCampaignWidget from "@/components/RecentCampaignWidget.vue";

const assets = inject<string>("assets");
const route = useRoute();
const user = ref<any>({});

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

const fetchStoresAndStats = async (targetUserId: number) => {
  if (!targetUserId) return;
  try {
    // 1. Fetch stores
    const response = await axios.get("/stores/list", {
      params: { users_fk: targetUserId },
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
    const mapped = (response.data.stores || []).map(mapStoreFromApi);

    // 2. Fetch events
    const [activeEventsRes, pastEventsRes] = await Promise.all([
      axios.get("/events/my_events/retailer", {
        params: { retailer_fk: targetUserId, active: "true", past_events: "false" },
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      }).catch(() => ({ data: { events: [] } })),
      axios.get("/events/my_events/retailer", {
        params: { retailer_fk: targetUserId, active: "true", past_events: "true" },
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

// Buscar perfil do usuário sem expor URL
const fetchUserProfile = async () => {
  try {
    const encodedId = route.params.id;
    const userId = atob(encodedId);
    const response = await axios.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    user.value = response.data;

    // Se for um retailer, buscar as lojas e estatísticas dele!
    if (user.value.roles_fk === 3) {
      await fetchStoresAndStats(parseInt(userId));
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};

// Formatar a data de entrada do usuário
const formattedJoinDate = computed(() => {
  if (!user.value.join_date) return "Unknown";
  return new Date(user.value.join_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
});

onMounted(async () => {
  await fetchCountries();
  await fetchUserProfile();
});

const userStore = useUserStore();
const showAlert = ref(false);
const showErrorAlert = ref(false);
const errorMessage = ref("");

// Send friend request
const addFriend = async () => {
  try {
    const invite_users_fk = userStore.user?.users_pk;
    const recipient_users_fk = user?.value?.users_pk;

    if (!invite_users_fk || !recipient_users_fk) {
      console.error("❌ Error: User IDs are undefined.");
      return;
    }

    await axios.post(
      "/friends/register",
      {
        invite_users_fk,
        recipient_users_fk,
        active: "true",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    showAlert.value = true;
    setTimeout(() => {
      showAlert.value = false;
    }, 1500);
  } catch (error) {
    showErrorAlert.value = true;
    errorMessage.value =
      error.response?.data?.message || "Error sending friend request.";
    setTimeout(() => (showErrorAlert.value = false), 1500);
  }
};

// Check if the user is already a friend
const isFriend = ref(false);

const checkFriendStatus = async () => {
  try {
    const encodedId = route.params.id;
    const userId = parseInt(atob(encodedId));

    const response = await axios.get("/friends/list_friends", {
      params: { invite_users_fk: userStore.user?.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const friendData = response.data.friends || [];

    const friend = friendData.find(
      (f) =>
        (f.invite_users_fk === userStore.user?.users_pk &&
          f.recipient_users_fk === userId) ||
        (f.invite_users_fk === userId &&
          f.recipient_users_fk === userStore.user?.users_pk)
    );

    isFriend.value = friend?.accepted === true;
  } catch (error) {
    console.error("❌ Error checking friendship status:", error);
  }
};

checkFriendStatus();
</script>

<style scoped>
.user-info {
  /* margin controlled by layout now */
}

.user-name {
  font-weight: bold;
  font-size: 1.4rem;
}

.user-join-date {
  font-size: 1rem;
  color: #ddd;
}

.product-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
}

.custom-alert {
  top: 50%;
  left: 50%;
  transform: translate(-50%, 10%);
  /* Centraliza na tela */
  width: 300px;
  /* Defina um tamanho adequado */
  height: 44px;
  z-index: 9999;
  padding: 10px;
  transition: opacity 0.5s ease-in-out;
}
</style>