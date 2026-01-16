<template>
  <v-card color="primary" class="fill-height d-flex flex-column w-100">
    <div class="px-4 pt-4 pb-2">
      <h3 class="text-h5 font-weight-bold">MY UPCOMING EVENTS</h3>
    </div>

    <div class="flex-grow-1 mt-2 content-scroll" style="overflow-y: auto">
      <div class="px-2 py-3 fill-height d-flex flex-column">
        <div
          v-if="loading"
          class="d-flex justify-center align-center"
          style="height: 200px"
        >
          <v-progress-circular indeterminate color="primary" />
        </div>

        <div v-else class="d-flex flex-column flex-grow-1">
          <div v-if="upcomingRetailerEventsPreview.length > 0">
            <v-row dense class="mx-n1">
              <v-col
                cols="12"
                md="6"
                v-for="event in upcomingRetailerEventsPreview"
                :key="event.events_pk"
                class="px-1"
              >
                <v-card
                  color="terciary"
                  class="pt-0 pb-2 event-card"
                  @click="openManageDialog(event)"
                >
                  <v-img
                    v-if="getSeasonInfo(event.seasons_fk).flag"
                    :src="getSeasonInfo(event.seasons_fk).flag"
                    class="season-flag"
                  />
                  <v-row no-gutters align="center">
                    <v-col cols="3" class="d-flex justify-center">
                      <div
                        class="text-center"
                        style="width: 70px; color: black"
                      >
                        <p class="pt-3 text-caption font-weight-bold">
                          {{
                            new Date(event.event_date)
                              .toLocaleDateString("en-US", { month: "short" })
                              .toUpperCase()
                          }}
                        </p>
                        <p class="cinzel-text text-h3 font-weight-bold">
                          {{
                            String(event.event_date).split("T")[0].split("-")[2]
                          }}
                        </p>
                        <p class="text-caption font-weight-bold">
                          {{
                            new Date(event.event_date).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              },
                            )
                          }}
                        </p>
                      </div>
                    </v-col>
                    <v-col
                      cols="9"
                      class="pt-2"
                      :class="display.xs.value ? 'pl-4' : ''"
                    >
                      <h3 class="pb-1">
                        <v-icon class="pr-1" size="small" color="black">
                          mdi-chess-rook
                        </v-icon>
                        {{ event.store_name }}
                      </h3>
                      <p class="text-caption text-truncate">
                        <v-icon color="red">mdi-map-marker</v-icon>
                        {{ event.address }}
                      </p>
                      <p class="text-caption" v-if="event.scenario">
                        <v-icon color="red">mdi-sword-cross</v-icon>
                        {{ event.scenario }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col cols="12" md="6" class="px-1">
                <v-card
                  color="transparent"
                  class="event-card d-flex align-center justify-center create-event-card"
                  @click="goToEventsPageAndCreate"
                  style="
                    border: 2px dashed rgba(255, 255, 255, 0.3);
                    min-height: 120px;
                  "
                >
                  <div class="d-flex flex-column align-center">
                    <v-icon size="large" color="white" class="mb-1">
                      mdi-plus
                    </v-icon>
                    <span class="text-caption font-weight-bold">
                      Create New Event
                    </span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <div v-else class="d-flex fill-height align-center justify-center">
            <v-card
              color="transparent"
              flat
              class="text-center pa-5 fill-height d-flex align-center justify-center flex-column"
            >
              <p class="mb-4">You have no upcoming events.</p>
              <v-btn
                color="white"
                class="text-black"
                @click="goToEventsPageAndCreate"
              >
                Create New Event
              </v-btn>
            </v-card>
          </div>
        </div>
      </div>
    </div>

    <ManageEventDialog
      v-model="manageDialog"
      :event="selectedEvent"
      @refresh="fetchUserCreatedEvents"
    />

    <v-dialog v-model="createStoreDialog" max-width="600" persistent>
      <v-card>
        <div v-if="creatingStore" class="dialog-overlay">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>
        <v-card-title class="text-h5 font-weight-bold">
          Create Your Store
        </v-card-title>
        <v-card-text>
          <p class="mb-4 text-grey">
            You need a store to create events. Let's set it up quickly.
          </p>
          <v-form ref="storeForm" v-model="isStoreFormValid">
            <v-text-field
              label="Store Name"
              variant="outlined"
              v-model="newStore.storename"
              :rules="[(v) => !!v || 'Store name is required']"
            ></v-text-field>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Street Number"
                  variant="outlined"
                  v-model="newStore.streetNumber"
                  :rules="[(v) => !!v || 'Required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Street Name"
                  variant="outlined"
                  v-model="newStore.address"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="City"
                  variant="outlined"
                  v-model="newStore.city"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="newStore.country"
                  :items="countriesList"
                  item-title="name"
                  item-value="countries_pk"
                  variant="outlined"
                  label="Country"
                  :rules="[(v) => !!v || 'Required']"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-text-field
              label="Zip Code"
              variant="outlined"
              v-model="newStore.zipcode"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>

            <v-file-input
              label="Store Image (Optional)"
              accept="image/*"
              @change="handleStoreImageUpload"
              variant="outlined"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="createStoreDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" variant="elevated" @click="saveNewStore"
            >Create & Continue</v-btn
          >
        </v-card-actions>
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
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";

const router = useRouter();
const userStore = useUserStore();
const axios = inject("axios");
const display = useDisplay();
const loading = ref(true);
const userCreatedEvents = ref([]);
const selectedEvent = ref(null);
const manageDialog = ref(false);

// Store Creation Vars
const createStoreDialog = ref(false);
const creatingStore = ref(false);
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
});
const tutorialStore = useTutorialStore();
const showTutorialPrompt = ref(false);

const upcomingRetailerEventsPreview = computed(() => {
  const now = new Date();
  return userCreatedEvents.value
    .filter((event) => new Date(event.event_date) > now)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 3);
});

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
      createStoreDialog.value = true;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      fetchCountries();
      createStoreDialog.value = true;
    } else {
      console.error("Error checking stores:", error);
      alert("Unable to verify store status.");
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

const handleStoreImageUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
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
  const { valid } = await storeForm.value.validate();
  if (!valid) return;

  creatingStore.value = true;
  const store = newStore.value;
  const countryName = getCountryNameFromId(store.country);
  const fullAddress = `${store.streetNumber}, ${store.address}, ${store.complement}, ${store.city}, ${store.state}, ${countryName}`;

  const payload = {
    web_site: store.site,
    name: store.storename,
    zip_code: store.zipcode,
    countries_fk: store.country,
    users_fk: userStore.user?.users_pk,
    address: fullAddress,
    picture_hash: store.storeImage,
    merchant_id: store.MerchantID,
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

    createStoreDialog.value = false;
    router.push({ path: "/events", query: { action: "create" } });
  } catch (error) {
    console.error("Error creating store:", error);
    alert("Failed to create store. Please try again.");
  } finally {
    creatingStore.value = false;
  }
};

onMounted(async () => {
  await fetchUserCreatedEvents();
});
</script>

<style scoped>
.event-card {
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}
.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  left: auto;
  right: 0;
  width: 60px;
  height: 60px;
  z-index: 2;
}
.content-scroll {
  padding-bottom: 12px;
}
.create-event-card {
  cursor: pointer;
  border: 2px dashed rgba(255, 255, 255, 0.3) !important;
  transition: all 0.2s ease-in-out;
}
.create-event-card:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
  transform: translateY(-4px);
}
</style>
