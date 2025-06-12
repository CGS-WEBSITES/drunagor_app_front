<template>
  <v-col class="d-flex justify-center mb-4">
    <v-btn
      color="secundary"
      @click="toggleForm"
      class="text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase mb-0"
      min-width="378px"
      min-height="60px"
    >
      <v-icon class="pr-3"> mdi-store-plus </v-icon>
      ADD STORE
    </v-btn>
  </v-col>
  <v-alert
    v-if="showVerificationMessage"
    type="info"
    color="warning"
    class="my-4"
    icon="mdi-alert-octagram-outline"
  >
    Your store is under review and cannot create events yet. The verification
    process may take up to 3 business days.
  </v-alert>

  <v-col cols="12" class="d-flex justify-center pa-0">
    <v-container max-width="800" style="min-width: 360px" class="pa-4">
      <v-card class="pl-2 pr-2 pb-2 pt-2" rounded="lg" elevation="3">
        <!-- Formulário de Criação da Loja -->
        <v-card-text v-if="isExpanded">
          <v-form ref="storeForm">
            <!-- Upload de Imagem -->
            <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Store Image</p>
            <v-file-input
              label="Upload Store Image (Recommended square images)"
              accept="image/*"
              @change="handleImageUpload"
              variant="outlined"
              class="mb-3"
            ></v-file-input>

            <!-- Preview da Imagem -->
            <v-img
              v-if="form.storeImage"
              :src="
                form.storeImage.startsWith('http')
                  ? form.storeImage
                  : `http://druna-user-pic.s3.us-east-2.amazonaws.com/${form.storeImage}`
              "
              height="100"
              class="rounded-lg mb-3"
            />

            <!-- Campos do Formulário -->
            <v-text-field
              label="Website"
              variant="outlined"
              v-model="form.site"
            ></v-text-field>
            <v-text-field
              label="Store Name"
              variant="outlined"
              v-model="form.storename"
              :rules="[(v) => !!v || 'Store name is required']"
            ></v-text-field>
            <v-text-field
              label="Street Number"
              variant="outlined"
              v-model="form.streetNumber"
              :rules="[(v) => !!v || 'Street Number is required']"
              type="text"
              @keypress="onlyAllowAlphanumeric"
            />
            <v-text-field
              label="Street Name"
              variant="outlined"
              v-model="form.address"
              :rules="[(v) => !!v || 'Street name is required']"
            ></v-text-field>
            <v-text-field
              label="Apt, suite, etc."
              variant="outlined"
              v-model="form.complement"
            ></v-text-field>
            <v-text-field
              label="City"
              variant="outlined"
              v-model="form.city"
              :rules="[(v) => !!v || 'City name is required']"
            ></v-text-field>
            <v-autocomplete
              v-model="form.country"
              :items="countriesList"
              item-title="name"
              item-value="countries_pk"
              variant="solo-filled"
              label="Select or type a country"
              :rules="[(v) => !!v || 'country is required']"
              class="mb-0"
            ></v-autocomplete>
            <v-autocomplete
              v-if="isUnitedStates"
              v-model="form.state"
              :items="StateList"
              item-title="name"
              variant="outlined"
              label="Select State"
              :rules="[(v) => !!v || 'State is required']"
              class="mb-0"
            />
            <v-text-field
              v-if="isUnitedStates"
              label="Zip Code"
              variant="outlined"
              v-model="form.zipcode"
              :rules="[(v) => !!v || 'Zipcode is required']"
            ></v-text-field>
            <v-text-field
              label="Google Merchant ID"
              variant="outlined"
              v-model="form.MerchantID"
            ></v-text-field>
          </v-form>

          <!-- Botões de Ação -->
          <v-card-actions>
            <v-btn color="green" @click="saveStore">Save Store</v-btn>
            <v-btn color="red" text="true" @click="cancelForm">Cancel</v-btn>
          </v-card-actions>
        </v-card-text>

        <v-divider class="my-4"></v-divider>

        <!-- Lista de Lojas Salvas -->
        <v-row v-if="stores.length > 0" no-gutters class="d-flex flex-column">
          <v-col
            v-for="(store, index) in stores"
            :key="store.stores_pk"
            class="pr-4"
            cols="12"
          >
            <v-card color="primary" min-height="130px" class="mb-4 event-card">
              <v-row no-gutters>
                <!-- Imagem da Loja -->
                <v-col cols="2" lg="2">
                  <v-img
                    :src="
                      store.picture_hash
                        ? `https://druna-assets.s3.us-east-2.amazonaws.com/${store.picture_hash}`
                        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'
                    "
                    class="event-img"
                  />
                </v-col>

                <!-- Informações da Loja -->
                <v-col cols="8" lg="9" class="pa-2">
                  <h3 class="text-subtitle-1 font-weight-bold">
                    {{ store.name }}
                    <v-tooltip location="top">
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
                            ? "Your store has been verified and is eligible to create events."
                            : "Your store is under review and cannot create events yet. The verification process may take up to 3 business days."
                        }}
                      </span>
                    </v-tooltip>
                  </h3>
                  <p class="text-caption">
                    <v-icon color="red">mdi-map-marker</v-icon>
                    {{ store.address }}, {{ store.streetNumber }} -
                    {{ store.city }}, {{ store.state }}
                  </p>
                  <p class="text-caption">
                    🏛️ Merchant ID: {{ store.merchant_id }}
                  </p>
                </v-col>
                <v-col
                  cols="2"
                  lg="1"
                  class="d-flex flex-column align-center justify-center gap-2"
                >
                  <v-btn
                    color="terciary"
                    icon
                    class="mb-4"
                    size="small"
                    @click="openEditDialog(store, index)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    color="red"
                    size="small"
                    icon
                    @click="removeStore(store.stores_pk)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dialog para Editar Store -->
        <v-dialog v-model="editDialog" max-width="500">
          <v-card>
            <v-card-title class="text-h5 font-weight-bold">
              Edit Store
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Site"
                outlined
                v-model="editableStore.site"
              ></v-text-field>
              <v-text-field
                label="Store Name"
                outlined
                v-model="editableStore.storename"
              ></v-text-field>
              <v-text-field
                label="Street Number"
                outlined
                v-model="editableStore.streetNumber"
                @keypress="onlyAllowAlphanumeric"
              ></v-text-field>
              <v-text-field
                label="Street Name"
                outlined
                v-model="editableStore.address"
              ></v-text-field>
              <v-text-field
                label="Apt, suite, etc."
                outlined
                v-model="editableStore.complement"
              ></v-text-field>
              <v-text-field
                label="City"
                outlined
                v-model="editableStore.city"
              ></v-text-field>
              <v-text-field
                label="State"
                outlined
                v-model="editableStore.state"
              ></v-text-field>
              <v-autocomplete
                v-model="editableStore.country"
                :items="countriesList"
                item-title="name"
                item-value="countries_pk"
                variant="solo-filled"
                label="Select or type a country"
                class="mb-0"
              ></v-autocomplete>
              <v-text-field
                label="Zip Code"
                outlined
                v-model="editableStore.zipcode"
              ></v-text-field>
              <v-text-field
                label="Merchant ID"
                outlined
                v-model="editableStore.MerchantID"
              ></v-text-field>

              <!-- Upload de Imagem -->
              <v-file-input
                label="Upload Store Image"
                accept="image/*"
                @change="handleImageUpload"
              ></v-file-input>
              <v-img
                v-if="editableStore.storeImage"
                :src="editableStore.storeImage"
                height="100"
                class="mt-2 rounded"
              ></v-img>
            </v-card-text>

            <v-card-actions class="d-flex justify-space-between">
              <v-btn color="red" @click="editDialog = false">Cancel</v-btn>
              <v-btn color="green" @click="saveEditedStore">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-container>
  </v-col>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, inject } from "vue";

const StateList = ref([
  { name: "Alabama" },
  { name: "Alaska" },
  { name: "Arizona" },
  { name: "Arkansas" },
  { name: "California" },
  { name: "Colorado" },
  { name: "Connecticut" },
  { name: "Delaware" },
  { name: "Florida" },
  { name: "Georgia" },
  { name: "Hawaii" },
  { name: "Idaho" },
  { name: "Illinois" },
  { name: "Indiana" },
  { name: "Iowa" },
  { name: "Kansas" },
  { name: "Kentucky" },
  { name: "Louisiana" },
  { name: "Maine" },
  { name: "Maryland" },
  { name: "Massachusetts" },
  { name: "Michigan" },
  { name: "Minnesota" },
  { name: "Mississippi" },
  { name: "Missouri" },
  { name: "Montana" },
  { name: "Nebraska" },
  { name: "Nevada" },
  { name: "New Hampshire" },
  { name: "New Jersey" },
  { name: "New Mexico" },
  { name: "New York" },
  { name: "North Carolina" },
  { name: "North Dakota" },
  { name: "Ohio" },
  { name: "Oklahoma" },
  { name: "Oregon" },
  { name: "Pennsylvania" },
  { name: "Rhode Island" },
  { name: "South Carolina" },
  { name: "South Dakota" },
  { name: "Tennessee" },
  { name: "Texas" },
  { name: "Utah" },
  { name: "Vermont" },
  { name: "Virginia" },
  { name: "Washington" },
  { name: "West Virginia" },
  { name: "Wisconsin" },
  { name: "Wyoming" },
]);

// Exemplo de controle de país
const selectedCountry = ref(250);

// Interface para o formulário de Store
interface StoreForm {
  site: string;
  storename: string;
  country: string | number | null; // Alterado para aceitar number
  zipcode: string;
  MerchantID: string;
  storeImage: string;
  complement: string;
  address: string;
  streetNumber: string;
  city: string;
  state: string;
}

const form = ref<StoreForm>({
  site: "",
  storename: "",
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

// Obtendo o axios injetado
const axios: any = inject("axios");

// Obter usuário logado
const storedUser = localStorage.getItem("app_user");
const appUser = storedUser ? JSON.parse(storedUser).users_pk : null;

// Interface para País
interface Country {
  countries_pk: number;
  name: string;
  abbreviation: string;
}

const countriesList = ref<Country[]>([]);

const fetchCountries = () => {
  axios
    .get("countries/search")
    .then((response: any) => {
      countriesList.value = response.data.countries.map((country: any) => ({
        countries_pk: country.countries_pk,
        name: country.name,
        abbreviation: country.abbreviation,
      }));
    })
    .catch((error: any) => {
      console.error("Erro ao buscar países:", error);
    });
};

onMounted(() => {
  fetchCountries();
});

const stores = ref<any[]>([]);

const fetchStores = async () => {
  try {
    const response = await axios.get("/stores/list", {
      params: { users_fk: userStore.user?.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    stores.value = [...response.data.stores];
  } catch (error) {
    console.error(
      "❌ Erro ao buscar lojas:",
      (error as any)?.response?.data || (error as any)?.message,
    );
    stores.value = [];
  }
};

onMounted(() => {
  fetchStores();
});

import { useUserStore } from "@/store/UserStore";

const storeForm = ref(null);

const onlyAllowAlphanumeric = (event: KeyboardEvent) => {
  const char = event.key;
  // permite apenas letras e números
  if (!/^[a-zA-Z0-9]$/.test(char)) {
    event.preventDefault();
  }
};

const userStore = useUserStore();
const showVerificationMessage = ref(false);

const getCountryNameFromId = (id: string | number | null): string => {
  if (typeof id === 'string') {
    // Se o id for string (ex: 'Belgium'), tenta encontrar na lista. Isso é um fallback.
    const matchByName = countriesList.value.find(c => c.name.toLowerCase() === id.toLowerCase());
    if(matchByName) return matchByName.name;
  }
  if (typeof id === 'number') {
    // Se for número, procura pelo PK
    const matchById = countriesList.value.find((c) => c.countries_pk === id);
    if(matchById) return matchById.name;
  }
  return "";
};


const saveStore = async () => {
  const { valid } = await storeForm.value.validate();

  if (!valid) {
    console.warn("❌ Formulário inválido. Corrija os erros.");
    return;
  }

  const store = form.value;

  const countryName = getCountryNameFromId(store.country);
  const fullAddress = `${store.streetNumber}, ${store.address}, ${store.complement}, ${store.city}, ${store.state}, ${countryName}`;

  const payload = {
    web_site: store.site,
    name: store.storename,
    zip_code: store.zipcode,
    countries_fk: store.country,
    users_fk: userStore.user?.users_pk,
    address: fullAddress,
    picture_hash: form.value.storeImage,
    merchant_id: store.MerchantID,
  };

  try {
    const response = await axios.post("/stores/cadastro", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    form.value = {
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
    };

    isExpanded.value = false;

    showVerificationMessage.value = true;

    await fetchStores();

    setTimeout(() => {
      showVerificationMessage.value = false;
    }, 1500);
  } catch (error) {
    console.error(
      "❌ Erro ao cadastrar a loja:",
      error.response?.data || error.message,
    );
  }
};

const cancelForm = () => {
  form.value = {
    site: "",
    storename: "",
    country: null,
    zipcode: "",
    MerchantID: "",
    storeImage: "",
    complement: "",
    address: "",
    streetNumber: "",
    city: "",
    state: "",
  };
  isExpanded.value = false;
};

const isExpanded = ref(false);
const toggleForm = () => {
  isExpanded.value = !isExpanded.value;
};

const editDialog = ref(false);

interface EditableStore {
  stores_pk?: number;
  site: string;
  storename: string;
  country: number | null; // Alterado para number
  zipcode: string;
  MerchantID: string;
  storeImage: string;
  address: string;
  streetNumber: string;
  complement: string;
  city: string;
  state: string | null;
}

const editableStore = ref<EditableStore>({
  site: "",
  storename: "",
  country: null,
  zipcode: "",
  MerchantID: "",
  storeImage: "",
  address: "",
  streetNumber: "",
  complement: "",
  city: "",
  state: "",
});
const selectedStoreIndex = ref<number | null>(null);

// ===================================================================
// AQUI ESTÁ A FUNÇÃO CORRIGIDA
// ===================================================================
const openEditDialog = (store: any, index: number) => {
  // Separa o endereço em partes
  const addressParts = store.address?.split(",").map((s) => s.trim()) || [];
  const [streetNumber, address, complement, city, state, countryName] = addressParts;

  // Encontra o objeto do país na sua lista 'countriesList' usando o nome do país
  const countryObject = countriesList.value.find(
    (c) => c.name.toLowerCase() === (countryName || "").toLowerCase()
  );

  // Pega o ID (countries_pk) do objeto encontrado. Se não encontrar, usa null.
  const countryId = countryObject ? countryObject.countries_pk : null;

  editableStore.value = {
    stores_pk: store.stores_pk,
    storename: store.name || store.storename,
    site: store.web_site || store.site || "",
    zipcode: store.zip_code || store.zipcode || "",
    country: countryId, // Usa o ID do país aqui, em vez do nome!
    state: state || "",
    city: city || "",
    complement: complement || "",
    address: address || "",
    streetNumber: streetNumber || "",
    MerchantID: store.MerchantID || store.merchant_id,
    storeImage: store.picture_hash || store.storeImage,
  };

  selectedStoreIndex.value = index;
  editDialog.value = true;
};

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  await axios
    .post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((response) => {
      if (editDialog.value) {
        editableStore.value.storeImage = response.data.image_key;
      } else {
        form.value.storeImage = response.data.image_key;
      }
    })
    .catch((error) => {
      console.error("❌ Error uploading image:", error.response?.data || error);
    });
};

const saveEditedStore = async () => {
  const store = editableStore.value;

  const countryName = getCountryNameFromId(store.country);

  const fullAddress = `${store.streetNumber}, ${store.address}, ${store.complement}, ${store.city}, ${store.state}, ${countryName}`;

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

  try {
    await axios.put(`/stores/alter`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    await fetchStores();

    editDialog.value = false;
  } catch (error) {
    console.error(
      "❌ Erro ao atualizar a loja:",
      error.response?.data || error.message,
    );
  }
};

const removeStore = async (stores_pk) => {
  try {
    const token = localStorage.getItem("accessToken");

    await axios.delete(`/stores/${stores_pk}/delete/`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Atualiza a lista após excluir
    await fetchStores();
  } catch (error) {
    console.error(
      "❌ Erro ao excluir a loja:",
      error.response?.data || error.message,
    );
  }
};

const isUnitedStates = computed(() => {
  const selectedCountry = form.value.country;
  if(typeof selectedCountry === 'number'){
    return selectedCountry === 250;
  }
  const countryObject = countriesList.value.find(c => c.name.toLowerCase() === (selectedCountry || "").toLowerCase());
  return countryObject?.countries_pk === 250;
});

const accountData = ref(null);

const getMerchantAccount = () => {
  const merchantId = "136699508";
  const token = "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";

  axios
    .get(
      `https://shoppingcontent.googleapis.com/content/v2.1/${merchantId}/accounts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((response: any) => {
      console.log("Dados da conta:", response.data);
      accountData.value = response.data;
    })
    .catch((error: any) => {
      console.error("Erro ao buscar dados da conta:", error);
    });
};

onMounted(() => {
  getMerchantAccount();
});

</script>

<style scoped>
.v-autocomplete {
  width: 100%;
}
.event-card {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  margin-left: 18px;
  background-color: #292929;
}
.event-img {
  width: 110px;
  height: 110px;
  border-radius: 4px;
}
</style>

<style>
.event-card {
  cursor: pointer;
  transition: 0.2s ease-in-out;
}
.event-card:hover {
  transform: scale(1.02);
}
.event-dialog-img {
  border-radius: 8px;
}
</style>
