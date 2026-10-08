<template>
  <v-card color="primary" class="home-feed fill-height d-flex flex-column w-100">
    <div class="home-scroll">
      <div v-if="loading" class="home-skeleton" aria-label="Loading">
        <span class="home-skeleton__hero"></span>
        <span class="home-skeleton__grid"><i></i><i></i><i></i><i></i></span>
        <span class="home-skeleton__row"></span>
        <span class="home-skeleton__row"></span>
      </div>

      <template v-else>
        <!-- Your next event, with what you do before and during it. -->
        <section class="home-section">
          <h3 class="home-label">My events</h3>
          <div v-if="nextEvent" class="next-event">
            <button class="next-event__info" @click="openManageDialog(nextEvent)">
              <span class="date-chip">
                <small>{{ extractMonth(nextEvent.event_date, userTimezone) }}</small>
                <strong>{{ extractDay(nextEvent.event_date, userTimezone) }}</strong>
              </span>
              <span class="event-text">
                <strong>{{ nextEvent.store_name }}</strong>
                <small>{{ extractTime(nextEvent.event_date, userTimezone) }} · {{ nextEvent.scenario }}</small>
              </span>
            </button>
            <div class="next-event__actions">
              <button @click="openManageDialog(nextEvent)"><v-icon size="18">mdi-account-group</v-icon> Manage</button>
              <button @click="router.push('/assembly-tutorial')"><v-icon size="18">mdi-table-furniture</v-icon> Table</button>
            </div>
          </div>
          <button v-else class="host-card" @click="goToEventsPageAndCreate">
            <v-icon size="30">mdi-calendar-star</v-icon>
            <span class="event-text">
              <strong>Host your Drunagor Nights</strong>
              <small>No events scheduled. Create your first one.</small>
            </span>
            <v-icon>mdi-plus-circle</v-icon>
          </button>
          <div v-if="laterEvents.length" class="mt-2">
          <div class="event-list">
            <button v-for="event in laterEvents" :key="event.events_pk" class="event-row" @click="openManageDialog(event)">
              <span class="date-chip">
                <small>{{ extractMonth(event.event_date, userTimezone) }}</small>
                <strong>{{ extractDay(event.event_date, userTimezone) }}</strong>
              </span>
              <span class="event-text">
                <strong>{{ event.store_name }}</strong>
                <small>{{ extractTime(event.event_date, userTimezone) }} · {{ event.scenario }}</small>
              </span>
              <img v-if="getSeasonInfo(event.seasons_fk).flag" :src="getSeasonInfo(event.seasons_fk).flag || undefined" alt="" class="event-row__flag" />
            </button>
            <!-- One more event, blurred, as the way to the full list. -->
            <button v-if="teaserEvent" class="event-row event-row--teaser" @click="router.push('/events')">
              <span class="event-row__blur">
                <span class="date-chip">
                  <small>{{ extractMonth(teaserEvent.event_date, userTimezone) }}</small>
                  <strong>{{ extractDay(teaserEvent.event_date, userTimezone) }}</strong>
                </span>
                <span class="event-text">
                  <strong>{{ teaserEvent.store_name }}</strong>
                  <small>{{ teaserEvent.scenario }}</small>
                </span>
              </span>
              <span class="event-row__more">See all your events <v-icon size="18">mdi-arrow-right</v-icon></span>
            </button>
          </div>
          </div>
        </section>

        <!-- Retailers can play too. -->
        <section class="home-section">
          <h3 class="home-label">Play</h3>
          <div class="play-row">
            <button class="play-card play-card--join" @click="showJoinTable = true">
              <v-icon size="24">mdi-qrcode-scan</v-icon>
              <span><strong>Join a table</strong><small>QR or table code</small></span>
            </button>
            <button class="play-card" @click="router.push('/campaign-tracker/')">
              <v-icon size="24">mdi-book-open-page-variant</v-icon>
              <span><strong>My campaigns</strong><small>Your heroes</small></span>
            </button>
          </div>
        </section>

        <!-- Quick actions -->
        <section class="home-section">
          <div class="shortcuts">
            <button v-for="item in shortcuts" :key="item.label" class="shortcut" @click="item.action()">
              <v-icon size="24">{{ item.icon }}</v-icon>
              <span>{{ item.label }}</span>
            </button>
          </div>
        </section>

        <section class="home-section">
          <h3 class="home-label">Events</h3>
          <div v-if="otherEvents.length" class="event-list">
            <button v-for="event in otherEvents" :key="event.events_pk" class="event-row" @click="router.push('/events')">
              <span class="date-chip">
                <small>{{ extractMonth(event.event_date, userTimezone) }}</small>
                <strong>{{ extractDay(event.event_date, userTimezone) }}</strong>
              </span>
              <span class="event-text">
                <strong>{{ event.store_name }}</strong>
                <small>{{ extractTime(event.event_date, userTimezone) }} · {{ event.scenario }}</small>
                <small class="event-text__muted">{{ event.address }}</small>
              </span>
              <img v-if="getSeasonInfo(event.seasons_fk).flag" :src="getSeasonInfo(event.seasons_fk).flag || undefined" alt="" class="event-row__flag" />
            </button>
            <button v-if="otherTeaser" class="event-row event-row--teaser" @click="router.push('/events')">
              <span class="event-row__blur">
                <span class="date-chip">
                  <small>{{ extractMonth(otherTeaser.event_date, userTimezone) }}</small>
                  <strong>{{ extractDay(otherTeaser.event_date, userTimezone) }}</strong>
                </span>
                <span class="event-text">
                  <strong>{{ otherTeaser.store_name }}</strong>
                  <small>{{ otherTeaser.scenario }}</small>
                </span>
              </span>
              <span class="event-row__more">See more events <v-icon size="18">mdi-arrow-right</v-icon></span>
            </button>
          </div>
          <p v-else class="home-empty">No other upcoming events right now.</p>
        </section>
      </template>
    </div>
    <HUB v-model="showJoinTable" />

    <ManageEventDialog
      v-model="manageDialog"
      :event="selectedEvent"
      @refresh="fetchUserCreatedEvents"
    />

    <v-dialog v-model="createStoreDialog" max-width="600" persistent>
      <v-card class="dark-dialog-card elevation-24" color="secundary">
        <div v-if="creatingStore" class="dialog-overlay">
          <v-progress-circular indeterminate size="80" color="#118D8E" />
        </div>

        <!-- Form State -->
        <div v-if="!showStoreSuccess">
          <div class="px-6 pt-6 pb-2 d-flex align-center">
            <v-icon size="32" color="#118D8E" class="mr-3">mdi-store-plus</v-icon>
            <h3 class="text-h5 font-weight-black text-white cinzel-text">
              CREATE YOUR STORE
            </h3>
          </div>
          <v-card-text class="px-6">
            <p class="mb-6 text-grey-lighten-1">
              You need a store registered to create events. Let's set it up quickly.
            </p>
            <v-form ref="storeForm" v-model="isStoreFormValid">
              <v-text-field
                label="Store Name"
                variant="outlined"
                v-model="newStore.storename"
                :rules="[(v) => !!v || 'Store name is required']"
                color="#118D8E"
                density="comfortable"
                class="mb-4"
              ></v-text-field>

              <v-row dense>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Number"
                    variant="outlined"
                    v-model="newStore.streetNumber"
                    :rules="[(v) => !!v || 'Required']"
                    color="#118D8E"
                    density="comfortable"
                    class="mb-4"
                  />
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field
                    label="Street Address"
                    variant="outlined"
                    v-model="newStore.address"
                    :rules="[(v) => !!v || 'Required']"
                    color="#118D8E"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="City"
                    variant="outlined"
                    v-model="newStore.city"
                    :rules="[(v) => !!v || 'Required']"
                    color="#118D8E"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="State"
                    variant="outlined"
                    v-model="newStore.state"
                    :rules="[(v) => !!v || 'Required']"
                    color="#118D8E"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="newStore.country"
                    :items="countriesList"
                    item-title="name"
                    item-value="countries_pk"
                    variant="outlined"
                    label="Country"
                    :rules="[(v) => !!v || 'Required']"
                    color="#118D8E"
                    density="comfortable"
                    class="mb-4"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Zip Code"
                    variant="outlined"
                    v-model="newStore.zipcode"
                    :rules="[(v) => !!v || 'Required']"
                    color="#118D8E"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Website (Optional)"
                    variant="outlined"
                    v-model="newStore.site"
                    placeholder="https://example.com"
                    color="#118D8E"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Phone Number (Optional)"
                    variant="outlined"
                    v-model="newStore.phone"
                    color="#118D8E"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-file-input
                label="Store Image (Optional)"
                accept="image/*"
                @update:modelValue="handleStoreImageUpload"
                variant="outlined"
                color="#118D8E"
                density="comfortable"
                prepend-icon=""
                prepend-inner-icon="mdi-camera"
              ></v-file-input>

              <v-img
                v-if="newStore.storeImage"
                :src="
                  newStore.storeImage.startsWith('http')
                    ? newStore.storeImage
                    : `https://assets.drunagor.app/${newStore.storeImage}`
                "
                height="100"
                class="rounded mb-4"
                contain
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="px-6 pb-6">
            <v-spacer></v-spacer>
            <v-btn color="grey-lighten-1" variant="text" @click="createStoreDialog = false" class="font-weight-bold"
              >Cancel</v-btn
            >
            <v-btn
              color="#118D8E"
              variant="elevated"
              class="text-white font-weight-black px-6"
              @click="saveNewStore"
              >Create & Continue</v-btn
            >
          </v-card-actions>
        </div>

        <!-- Success State -->
        <div v-else class="pa-8 text-center d-flex flex-column align-center justify-center">
          <div class="success-icon-container mb-6">
            <div class="success-pulse-ring"></div>
            <v-icon size="80" color="#118D8E" class="success-checkmark">mdi-checkbox-marked-circle</v-icon>
          </div>
          <h3 class="text-h4 font-weight-black text-white mb-2 cinzel-text">
            STORE CREATED!
          </h3>
          <p class="text-body-1 text-grey-lighten-1 mb-8">
            Your store <strong>{{ newStore.storename }}</strong> was successfully registered. Let's create your first event!
          </p>
          <v-btn
            color="#118D8E"
            size="large"
            variant="elevated"
            class="fancy-btn text-white font-weight-black px-12"
            elevation="12"
            @click="handleSuccessContinue"
          >
            Continue to Event Creation
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-card>

  <TutorialPromptDialog v-model="showTutorialPrompt" />
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import { useDisplay } from "vuetify";
import { useTutorialStore } from "@/store/TutorialStore";
import TutorialPromptDialog from "@/components/dialogs/TutorialPromptDialog.vue";
import ManageEventDialog from "@/components/dialogs/ManageEventDialog.vue";
import HUB from "@/components/HUB.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import { extractMonth, extractDay, extractTime } from "@/utils/dateHelpers";
const isBeforeJulyFirst2026 = () => {
  return false;
};

const router = useRouter();
const userStore = useUserStore();
const axios = inject("axios");
const display = useDisplay();
const loading = ref(true);
const userCreatedEvents = ref([]);
const selectedEvent = ref(null);
const manageDialog = ref(false);

const createStoreDialog = ref(false);
const creatingStore = ref(false);
const showStoreSuccess = ref(false);
const isStoreFormValid = ref(false);
const storeForm = ref(null);
const countriesList = ref([]);
const newStore = ref({
  storename: "",
  site: "",
  country: null,
  zipcode: "",
  MerchantID: "",
  storeImage: "",
  complement: "",
  address: "",
  streetNumber: "",
  city: "",
  state: "",
  phone: "",
});
const tutorialStore = useTutorialStore();
const showTutorialPrompt = ref(false);

const trimValue = (value) => value?.trim?.() || "";

const sanitizeStoreForm = () => {
  newStore.value.storename = trimValue(newStore.value.storename);
  newStore.value.site = trimValue(newStore.value.site);
  newStore.value.zipcode = trimValue(newStore.value.zipcode);
  newStore.value.MerchantID = trimValue(newStore.value.MerchantID);
  newStore.value.complement = trimValue(newStore.value.complement);
  newStore.value.address = trimValue(newStore.value.address);
  newStore.value.streetNumber = trimValue(newStore.value.streetNumber);
  newStore.value.city = trimValue(newStore.value.city);
  newStore.value.state = trimValue(newStore.value.state);
  newStore.value.phone = trimValue(newStore.value.phone);
};

const userTimezone = computed(() => userStore.userIanaTimezone());

const upcomingRetailerEventsPreview = computed(() => {
  const now = new Date();
  return userCreatedEvents.value
    .filter((event) => new Date(event.event_date) > now)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 3);
});

const nextEvent = computed(() => upcomingRetailerEventsPreview.value[0] || null);
const laterEvents = computed(() => upcomingRetailerEventsPreview.value.slice(1, 4));
const teaserEvent = computed(() => upcomingRetailerEventsPreview.value[4] || null);

// Quick actions for running Drunagor Nights.
const shortcuts = [
  { label: "Guides", icon: "mdi-compass-outline", action: () => router.push("/FAQforRetailers") },
  { label: "Friends", icon: "mdi-account-group", action: () => router.push("/socialhub") },
  { label: "Library", icon: "mdi-bookshelf", action: () => router.push("/library") },
  { label: "Keywords", icon: "mdi-book-search-outline", action: () => router.push("/campaign-tracker/keyword") },
];

// Every upcoming event (other stores' too), for retailers who play.
const showJoinTable = ref(false);
const allEvents = ref([]);
const fetchAllEvents = async () => {
  try {
    const { data } = await axios.get("/events/list_events/", {
      params: { past_events: "false", player_fk: userStore.user.users_pk },
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
    allEvents.value = data.events || [];
  } catch {
    allEvents.value = [];
  }
};
const othersUpcoming = computed(() => {
  const mine = new Set(userCreatedEvents.value.map((event) => event.events_pk));
  const now = new Date();
  return allEvents.value
    .filter((event) => !mine.has(event.events_pk) && new Date(event.event_date) >= now)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
});
const otherEvents = computed(() => othersUpcoming.value.slice(0, 3));
const otherTeaser = computed(() => othersUpcoming.value[3] || null);

const getSeasonInfo = (fk) => {
  if (fk == 2) return { flag: s1flag, name: "Season 1" };
  if (fk == 3) return { flag: s2flag, name: "Season 2" };
  return { flag: null, name: "" };
};

const fetchUserCreatedEvents = async () => {
  loading.value = true;
  try {
    const params = {
      retailer_fk: userStore.user.users_pk,
      active: "true",
      past_events: false,
    };
    const { data } = await axios.get("/events/my_events/retailer", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    userCreatedEvents.value = data.events || [];
  } catch (error) {
    console.error("Error fetching retailer events:", error);
    userCreatedEvents.value = [];
  } finally {
    loading.value = false;
  }
};

const openManageDialog = (event) => {
  selectedEvent.value = event;
  manageDialog.value = true;
};

const goToEventsPageAndCreate = async () => {
  if (isBeforeJulyFirst2026()) {
    router.push({ name: "NightsCommunication" });
    return;
  }

  try {
    const { data } = await axios.get("/stores/list", {
      params: { users_fk: userStore.user.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const stores = data.stores || [];

    if (stores.length > 0) {
      router.push({ path: "/events", query: { action: "create" } });
    } else {
      fetchCountries();
      showStoreSuccess.value = false;
      createStoreDialog.value = true;
    }
  } catch (error) {
    console.error("Error checking stores:", error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      alert("Session expired. Please log in again.");
      router.push({ path: "/" });
    } else {
      fetchCountries();
      showStoreSuccess.value = false;
      createStoreDialog.value = true;
    }
  }
};

const fetchCountries = () => {
  if (countriesList.value.length > 0) return;
  axios
    .get("countries/search")
    .then((response) => {
      countriesList.value = response.data.countries.map((country) => ({
        countries_pk: country.countries_pk,
        name: country.name,
      }));
    })
    .catch(console.error);
};

const handleStoreImageUpload = async (files) => {
  const file = Array.isArray(files) ? files[0] : files;
  if (!file) {
    newStore.value.storeImage = "";
    return;
  }
  const formData = new FormData();
  formData.append("file", file);
  try {
    const { data } = await axios.post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    newStore.value.storeImage = data.image_key;
  } catch (e) {
    console.error(e);
  }
};

const getCountryNameFromId = (id) => {
  const c = countriesList.value.find((c) => c.countries_pk === id);
  return c ? c.name : "";
};

const saveNewStore = async () => {
  sanitizeStoreForm();
  const { valid } = await storeForm.value.validate();
  if (!valid) return;

  creatingStore.value = true;
  const store = newStore.value;
  const countryName = getCountryNameFromId(store.country);
  const fullAddress = `${store.streetNumber}, ${store.address}, ${store.complement}, ${store.city}, ${store.state}, ${countryName}`;

  const payload = {
    web_site: store.site || null,
    name: store.storename,
    zip_code: store.zipcode,
    countries_fk: store.country,
    users_fk: userStore.user?.users_pk,
    address: fullAddress,
    picture_hash: store.storeImage || null,
    merchant_id: store.MerchantID || null,
    phone: store.phone || null,
  };

  try {
    const response = await axios.post("/stores/cadastro", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const newStorePk =
      response.data.store?.stores_pk || response.data.stores_pk;

    if (newStorePk) {
      await axios.get(`/stores/${newStorePk}/verify`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    }

    showStoreSuccess.value = true;
  } catch (error) {
    console.error("Error creating store:", error);
    const errMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error";
    alert(`Failed to create store: ${errMsg}`);
  } finally {
    creatingStore.value = false;
  }
};

const handleSuccessContinue = () => {
  createStoreDialog.value = false;
  showStoreSuccess.value = false;
  if (isBeforeJulyFirst2026()) {
    router.push({ name: "NightsCommunication" });
  } else {
    router.push({ path: "/events", query: { action: "create" } });
  }
};

onMounted(async () => {
  fetchAllEvents();
  await fetchUserCreatedEvents();
});
</script>

<style scoped>
.event-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  border-radius: 8px;
  min-height: 115px;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.highlight-card {
  height: 100%;
  min-height: 115px;
  background-color: #118d8e !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 8px 20px rgba(17, 141, 142, 0.4) !important;
}

.glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 100%
  );
  pointer-events: none;
}

.floating-icon {
  animation: float 3s ease-in-out infinite;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.letter-spacing-1 {
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.z-index-2 {
  position: relative;
  z-index: 2;
}

/* ESTADO VAZIO */
.icon-circle-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid #118d8e;
  border-radius: 50%;
  animation: ring-pulse 2s infinite;
  opacity: 0;
}

@keyframes ring-pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.fancy-btn {
  border-radius: 50px !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fancy-btn:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 10px 30px rgba(17, 141, 142, 0.5) !important;
}

.cinzel-text {
  font-family: "Cinzel", serif;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(21, 21, 21, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.season-flag {
  position: absolute;
  top: 0;
  right: 0;
  width: 45px;
  height: 45px;
  z-index: 2;
}

.content-scroll {
  padding-bottom: 12px;
}

/* Success State Styles */
.success-icon-container {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid #118D8E;
  border-radius: 50%;
  animation: success-ring-pulse 2s infinite;
  opacity: 0;
}

@keyframes success-ring-pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.success-checkmark {
  animation: success-pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes success-pop-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
/* Retailer home feed (same look as the player home) */
.home-feed {
  background: transparent !important;
  box-shadow: none !important;
}
.home-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 0 16px;
  font-family: "Poppins", sans-serif;
}
.home-loading {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}
.home-section {
  margin-bottom: 16px;
}
.home-label {
  margin: 0 0 8px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  opacity: 0.7;
}
/* Every card shares one look, from the theme. */
.continue-card,
.next-event,
.shortcut,
.event-row {
  background: rgb(var(--v-theme-primary));
  border: 1px solid rgba(var(--v-theme-on-primary), 0.1);
  border-radius: 14px;
}
/* Continue */
.continue-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  text-align: left;
  transition: transform 0.15s ease;
}
.continue-card:active {
  transform: scale(0.99);
}
.continue-card__media {
  position: relative;
  display: block;
}
.continue-card__art {
  display: block;
  width: 100%;
  height: 104px;
  object-fit: cover;
  object-position: center 30%;
}
/* The party's heroes stand on the art. */
.continue-card__heroes {
  position: absolute;
  right: 10px;
  bottom: 8px;
  display: flex;
}
.continue-card__heroes img {
  width: 44px;
  height: 44px;
  margin-left: -8px;
  object-fit: cover;
  background: rgb(var(--v-theme-surface));
  border: 2px solid rgb(var(--v-theme-primary));
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}
.continue-card__body {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}
.continue-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.continue-card__text strong {
  overflow: hidden;
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.continue-card__text small {
  overflow: hidden;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.7;
}
.continue-card__go {
  flex-shrink: 0;
  color: rgb(var(--v-theme-playbutton));
  font-size: 32px !important;
}
.continue-card--empty {
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-style: dashed;
}
.continue-card--empty .continue-card__text small {
  white-space: normal;
}
/* Next event */
.next-event {
  display: flex;
  overflow: hidden;
}
.next-event__info {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 10px 12px;
  text-align: left;
}
.next-event__join {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0 16px;
  background: rgb(var(--v-theme-playbutton));
  color: rgb(var(--v-theme-on-playbutton));
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}
.date-chip {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 52px;
  background: rgb(var(--v-theme-terciary));
  border-radius: 10px;
  color: rgb(var(--v-theme-on-terciary));
  line-height: 1;
}
.date-chip small {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
}
.date-chip strong {
  font-family: "Cinzel", serif;
  font-size: 1.35rem;
}
.event-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.event-text strong,
.event-text small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.event-text strong {
  font-size: 0.92rem;
}
.event-text small {
  font-size: 0.72rem;
  opacity: 0.75;
}
.event-text__muted {
  opacity: 0.5 !important;
}
.event-status {
  display: flex;
  align-items: center;
  gap: 3px;
}
/* Shortcuts */
.shortcuts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
.shortcut {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 66px;
  min-width: 0;
  padding: 0 4px;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
}
.shortcut .v-icon {
  color: rgb(var(--v-theme-terciary));
}
/* Event list */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.event-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 44px 10px 10px;
  text-align: left;
}
.event-row__flag {
  position: absolute;
  top: 0;
  right: 10px;
  width: 22px;
}
/* The blurred teaser that leads to every event. */
.event-row--teaser {
  overflow: hidden;
  padding-right: 10px;
}
.event-row__blur {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  filter: blur(2px);
  opacity: 0.55;
}
.event-row__more {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
}
.event-row--empty {
  height: 64px;
  border-style: dashed;
}
.next-event {
  flex-direction: column;
}
.next-event__actions {
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.next-event__actions button {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}
.next-event__actions button + button {
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}
.next-event__actions button:first-child {
  background: rgb(var(--v-theme-playbutton));
  color: rgb(var(--v-theme-on-playbutton));
}
.host-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: rgb(var(--v-theme-primary));
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  text-align: left;
}
.host-card .v-icon:last-child {
  color: rgb(var(--v-theme-playbutton));
  font-size: 30px !important;
}
/* Play */
.play-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 8px;
}
.play-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  height: 100%;
  min-height: 72px;
  background: rgb(var(--v-theme-primary));
  border: 1px solid rgba(var(--v-theme-on-primary), 0.1);
  border-radius: 14px;
  text-align: left;
}
.play-card > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.play-card strong {
  white-space: nowrap;
  font-size: 0.85rem;
}
.play-card small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.68rem;
  opacity: 0.7;
}
.play-card--join {
  background: rgb(var(--v-theme-playbutton));
  color: rgb(var(--v-theme-on-playbutton));
}
.home-empty {
  padding: 16px;
  font-size: 0.85rem;
  text-align: center;
  opacity: 0.6;
}
/* Loading: grey shapes where the cards will be. */
.home-skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.home-skeleton span {
  display: block;
  background: linear-gradient(90deg, rgba(var(--v-theme-on-surface), 0.06) 0%, rgba(var(--v-theme-on-surface), 0.12) 50%, rgba(var(--v-theme-on-surface), 0.06) 100%);
  background-size: 200% 100%;
  border-radius: 14px;
  animation: home-shimmer 1.4s ease-in-out infinite;
}
.home-skeleton__hero {
  height: 190px;
}
.home-skeleton__row {
  height: 66px;
}
.home-skeleton__grid {
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  background: none !important;
  animation: none !important;
}
.home-skeleton__grid i {
  display: block;
  height: 66px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 14px;
}
@keyframes home-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
</style>
