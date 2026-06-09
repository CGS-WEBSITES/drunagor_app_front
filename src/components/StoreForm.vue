<template>
  <v-container class="pa-0 py-4" max-width="800">
    <!-- Save All Changes Button -->
    <v-btn
      color="#4CAF50"
      block
      class="text-white font-weight-black mb-4 fancy-btn"
      size="x-large"
      elevation="8"
      :loading="saving"
      @click="saveAllChanges"
    >
      <v-icon left class="mr-2">mdi-content-save-all</v-icon>
      SAVE ALL CHANGES
    </v-btn>

    <!-- Add Store Bar -->
    <v-card
      color="#212121"
      class="mb-6 add-store-bar"
      ripple
      @click="addStore"
      style="border: 2px solid rgba(255, 255, 255, 0.1); cursor: pointer; border-radius: 8px"
    >
      <div class="d-flex align-center justify-space-between px-4 py-4">
        <div class="d-flex align-center justify-center flex-grow-1">
          <v-icon size="24" color="white" class="mr-2">mdi-store-plus</v-icon>
          <span class="text-button font-weight-black text-white text-h6 cinzel-text">
            ADD STORE
          </span>
        </div>
        <v-icon color="white">mdi-menu</v-icon>
      </div>
    </v-card>

    <!-- Alert Message -->
    <v-alert
      v-if="successAlert.show"
      type="success"
      class="mb-4"
      closable
      @click:close="successAlert.show = false"
    >
      {{ successAlert.message }}
    </v-alert>

    <!-- Collapsible Stores List -->
    <div v-if="stores.length > 0">
      <v-card
        v-for="(store, index) in stores"
        :key="index"
        class="mb-4 store-card"
        color="#151515"
        style="border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; overflow: hidden"
      >
        <!-- Header -->
        <div
          class="d-flex align-center justify-space-between px-4 py-4 cursor-pointer select-none card-header"
          @click="store.isExpanded = !store.isExpanded"
          style="background-color: rgba(255, 255, 255, 0.02)"
        >
          <div class="d-flex align-center">
            <span class="cinzel-text font-weight-black text-white text-h6 text-uppercase">
              STORE {{ index + 1 }} {{ store.storename ? `- ${store.storename}` : '' }}
            </span>
            <v-chip
              v-if="store.isNew"
              color="success"
              size="x-small"
              class="ml-2 font-weight-bold"
            >
              NEW
            </v-chip>
            <v-chip
              v-else-if="store.isDirty"
              color="warning"
              size="x-small"
              class="ml-2 font-weight-bold"
            >
              EDITED
            </v-chip>
            
            <v-tooltip location="top" v-if="store.stores_pk">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  :color="store.verified ? 'green' : 'yellow'"
                  size="20"
                  class="ml-2"
                >
                  {{
                    store.verified
                      ? "mdi-check-decagram-outline"
                      : "mdi-alert-octagram-outline"
                  }}
                </v-icon>
              </template>
              <span>
                {{
                  store.verified
                    ? "Verified & eligible to host events"
                    : "Under review (may take up to 3 business days)"
                }}
              </span>
            </v-tooltip>
          </div>

          <div class="d-flex align-center">
            <v-btn
              icon
              variant="text"
              color="red-lighten-1"
              size="small"
              class="mr-2"
              @click.stop="markForDeletion(index)"
            >
              <v-icon size="20">mdi-delete-outline</v-icon>
            </v-btn>
            <v-icon color="white">
              {{ store.isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </div>
        </div>

        <v-divider></v-divider>

        <!-- Body -->
        <v-expand-transition>
          <div v-show="store.isExpanded" class="pa-6">
            <!-- Image Selector & Preview -->
            <v-row align="center" class="mb-6 no-gutters">
              <v-col cols="auto" class="d-flex flex-column align-center justify-center">
                <span class="text-caption text-grey-lighten-1 mb-2 font-weight-bold text-uppercase tracking-wider">
                  Store Photo/Logo
                </span>
                <v-btn
                  color="#4CAF50"
                  class="text-white font-weight-black px-6"
                  style="border-radius: 4px"
                  :loading="store.uploadingImage"
                  @click="triggerFileInput(index)"
                >
                  UPLOAD
                </v-btn>
                <input
                  type="file"
                  :ref="el => { if (el) fileInputs[index] = el }"
                  accept="image/*"
                  style="display: none"
                  @change="onFileChanged($event, index)"
                />
              </v-col>

              <v-col cols="auto" class="pl-6">
                <v-avatar size="100" rounded="lg" class="border-grey" style="border: 2px solid rgba(255, 255, 255, 0.1)">
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
            </v-row>

            <!-- Store Form Fields -->
            <v-form :ref="el => { if (el) storeFormsRefs[index] = el }">
              <v-text-field
                label="Shop Name"
                variant="outlined"
                color="#118D8E"
                v-model="store.storename"
                :rules="[(v) => !!v || 'Store name is required']"
                @input="markAsDirty(index)"
                class="mb-3"
                density="comfortable"
              ></v-text-field>

              <v-text-field
                label="Address Line 1"
                variant="outlined"
                color="#118D8E"
                v-model="store.addressLine1"
                placeholder="e.g. 12345 Street Name"
                :rules="[(v) => !!v || 'Address Line 1 is required']"
                @input="markAsDirty(index)"
                class="mb-3"
                density="comfortable"
              ></v-text-field>

              <v-text-field
                label="Address Line 2"
                variant="outlined"
                color="#118D8E"
                v-model="store.complement"
                placeholder="Apartment, suite, unit, building, floor, etc."
                @input="markAsDirty(index)"
                class="mb-3"
                density="comfortable"
              ></v-text-field>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="City"
                    variant="outlined"
                    color="#118D8E"
                    v-model="store.city"
                    :rules="[(v) => !!v || 'City is required']"
                    @input="markAsDirty(index)"
                    class="mb-3"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="State"
                    variant="outlined"
                    color="#118D8E"
                    v-model="store.state"
                    :rules="[(v) => !!v || 'State is required']"
                    @input="markAsDirty(index)"
                    class="mb-3"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="ZIP Code"
                    variant="outlined"
                    color="#118D8E"
                    v-model="store.zipcode"
                    :rules="[(v) => !!v || 'ZIP Code is required']"
                    @input="markAsDirty(index)"
                    class="mb-3"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="store.country"
                    :items="countriesList"
                    item-title="name"
                    item-value="countries_pk"
                    variant="outlined"
                    color="#118D8E"
                    label="Country"
                    :rules="[(v) => !!v || 'Country is required']"
                    @update:modelValue="markAsDirty(index)"
                    class="mb-3"
                    density="comfortable"
                  ></v-autocomplete>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Phone Number (optional)"
                    variant="outlined"
                    color="#118D8E"
                    v-model="store.phone"
                    @input="markAsDirty(index)"
                    class="mb-3"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Google Merchant ID (optional)"
                    variant="outlined"
                    color="#118D8E"
                    v-model="store.MerchantID"
                    @input="markAsDirty(index)"
                    class="mb-3"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                label="Website (optional)"
                variant="outlined"
                color="#118D8E"
                v-model="store.site"
                placeholder="https://example.com"
                @input="markAsDirty(index)"
                class="mb-3"
                density="comfortable"
              ></v-text-field>
            </v-form>

            <v-btn
              v-if="store.site"
              block
              color="#7B1FA2"
              class="text-white font-weight-black mt-4 py-3"
              style="border-radius: 4px"
              @click="goToStorePage(store.site)"
            >
              GO TO STORE'S PAGE
            </v-btn>
          </div>
        </v-expand-transition>
      </v-card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <v-icon size="64" color="grey-darken-1" class="mb-4">mdi-store-outline</v-icon>
      <h3 class="text-h6 text-grey-lighten-1 mb-2">No Stores Registered</h3>
      <p class="text-body-2 text-grey-darken-1 mb-6">
        Click "+ ADD STORE" above to register your first store.
      </p>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";

interface Store {
  stores_pk?: number;
  storename: string;
  site: string;
  zipcode: string;
  country: number | null;
  streetNumber: string;
  addressLine1: string;
  complement: string;
  city: string;
  state: string;
  MerchantID: string;
  storeImage: string;
  phone: string;
  verified?: boolean;
  isExpanded: boolean;
  isDirty: boolean;
  isNew: boolean;
  uploadingImage?: boolean;
}

interface Country {
  countries_pk: number;
  name: string;
  abbreviation: string;
}

const userStore = useUserStore();
const router = useRouter();
const axios: any = inject("axios");

const stores = ref<Store[]>([]);
const countriesList = ref<Country[]>([]);
const fileInputs = ref<any>({});
const storeFormsRefs = ref<any>({});
const pendingDeletions = ref<number[]>([]);
const saving = ref(false);
const successAlert = ref({ show: false, message: "" });

const parseAddressLine1 = (line: string) => {
  const cleanLine = (line || "").trim();
  const parts = cleanLine.split(/\s+/);
  const firstWord = parts[0];
  if (/^\d+[a-zA-Z]*$/.test(firstWord) || /^\d+$/.test(firstWord)) {
    return {
      streetNumber: firstWord,
      address: parts.slice(1).join(" ")
    };
  }
  return {
    streetNumber: "S/N",
    address: cleanLine
  };
};

const mapStoreFromApi = (apiStore: any): Store => {
  const addressParts = apiStore.address?.split(",").map((s: any) => s.trim()) || [];
  const [streetNumber, address, complement, city, state, countryName] = addressParts;

  const countryObject = countriesList.value.find(
    (c) => c.name.toLowerCase() === (countryName || "").toLowerCase()
  );
  const countryId = countryObject ? countryObject.countries_pk : null;

  // Address Line 1 in Form shows streetNumber + address
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
    streetNumber: streetNumber || "",
    MerchantID: apiStore.merchant_id || apiStore.MerchantID || "",
    storeImage: apiStore.picture_hash || apiStore.storeImage || "",
    phone: "",
    verified: apiStore.verified,
    isExpanded: false,
    isDirty: false,
    isNew: false
  };
};

const fetchCountries = async () => {
  try {
    const response = await axios.get("countries/search");
    countriesList.value = response.data.countries.map((country: any) => ({
      countries_pk: country.countries_pk,
      name: country.name,
      abbreviation: country.abbreviation,
    }));
  } catch (error) {
    console.error("Erro ao buscar países:", error);
  }
};

const fetchStores = async () => {
  try {
    const response = await axios.get("/stores/list", {
      params: { users_fk: userStore.user?.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    stores.value = (response.data.stores || []).map(mapStoreFromApi);
  } catch (error) {
    console.error("❌ Erro ao buscar lojas:", error);
    stores.value = [];
  }
};

const getCountryNameFromId = (id: number | null): string => {
  if (!id) return "";
  const match = countriesList.value.find((c) => c.countries_pk === id);
  return match ? match.name : "";
};

const addStore = () => {
  stores.value.push({
    storename: "",
    site: "",
    country: null,
    zipcode: "",
    MerchantID: "",
    storeImage: "",
    complement: "",
    addressLine1: "",
    streetNumber: "",
    city: "",
    state: "",
    phone: "",
    isExpanded: true,
    isDirty: false,
    isNew: true
  });
};

const markAsDirty = (index: number) => {
  stores.value[index].isDirty = true;
};

const markForDeletion = (index: number) => {
  const store = stores.value[index];
  if (confirm(`Are you sure you want to delete "${store.storename || 'this store'}"? This action cannot be undone until you save changes.`)) {
    if (store.stores_pk) {
      pendingDeletions.value.push(store.stores_pk);
    }
    stores.value.splice(index, 1);
  }
};

const triggerFileInput = (index: number) => {
  const el = fileInputs.value[index];
  if (el) {
    el.click();
  }
};

const onFileChanged = async (event: any, index: number) => {
  const files = event.target.files;
  const file = files?.[0];
  if (!file) return;

  stores.value[index].uploadingImage = true;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    stores.value[index].storeImage = response.data.image_key;
    stores.value[index].isDirty = true;
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Failed to upload image.");
  } finally {
    stores.value[index].uploadingImage = false;
  }
};

const saveAllChanges = async () => {
  let allValid = true;
  for (let i = 0; i < stores.value.length; i++) {
    const formRef = storeFormsRefs.value[i];
    if (formRef) {
      const { valid } = await formRef.validate();
      if (!valid) {
        allValid = false;
        stores.value[i].isExpanded = true;
      }
    }
  }

  if (!allValid) {
    alert("Please fix the validation errors in your store forms before saving.");
    return;
  }

  saving.value = true;

  try {
    // 1. Deletions
    for (const storePk of pendingDeletions.value) {
      await axios.delete(`/stores/${storePk}/delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    }
    pendingDeletions.value = [];

    // 2. Creations and Updates
    for (const store of stores.value) {
      const parsed = parseAddressLine1(store.addressLine1);
      const countryName = getCountryNameFromId(store.country);
      const fullAddress = `${parsed.streetNumber}, ${parsed.address}, ${store.complement || ""}, ${store.city}, ${store.state}, ${countryName}`;

      if (store.isNew) {
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

        const response = await axios.post("/stores/cadastro", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const newStorePk = response.data.store?.stores_pk || response.data.stores_pk;
        if (newStorePk) {
          await axios.get(`/stores/${newStorePk}/verify`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
        }
      } else if (store.isDirty) {
        const payload = {
          stores_pk: store.stores_pk,
          name: store.storename,
          web_site: store.site,
          zip_code: store.zipcode,
          countries_fk: store.country,
          users_fk: userStore.user?.users_pk,
          address: fullAddress,
          picture_hash: store.storeImage,
          merchant_id: store.MerchantID,
        };

        await axios.put(`/stores/alter`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      }
    }

    await fetchStores();

    successAlert.value = {
      show: true,
      message: "All changes saved successfully!"
    };
    setTimeout(() => {
      successAlert.value.show = false;
    }, 4000);
  } catch (error) {
    console.error("Error saving all store changes:", error);
    alert("An error occurred while saving your store changes.");
  } finally {
    saving.value = false;
  }
};

const goToStorePage = (url: string) => {
  if (!url) return;
  const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
  window.open(formattedUrl, "_blank");
};

onMounted(async () => {
  await fetchCountries();
  await fetchStores();
});
</script>

<style scoped>
.fancy-btn {
  border-radius: 6px !important;
  font-family: "Cinzel", serif;
  letter-spacing: 1.5px;
  transition: all 0.3s ease;
}

.fancy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4) !important;
}

.add-store-bar {
  transition: all 0.2s ease;
}

.add-store-bar:hover {
  border-color: rgba(255, 255, 255, 0.3) !important;
  background-color: #2a2a2a !important;
}

.store-card {
  transition: box-shadow 0.3s ease;
}

.store-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
}

.card-header {
  transition: background-color 0.2s ease;
}

.card-header:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.cinzel-text {
  font-family: "Cinzel", serif;
}

.border-grey {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.tracking-wider {
  letter-spacing: 1px;
}
</style>
