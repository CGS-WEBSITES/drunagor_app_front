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
              :src="form.storeImage"
              height="100"
              class="rounded-lg mb-3"
            ></v-img>

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
            ></v-text-field>
            <v-text-field
              label="Street Name"
              variant="outlined"
              v-model="form.address"
            ></v-text-field>
            <v-text-field
              label="Number"
              variant="outlined"
              v-model="form.streetNumber"
            ></v-text-field>
            <v-text-field
              label="Complement"
              variant="outlined"
              v-model="form.complement"
            ></v-text-field>
            <v-text-field
              label="City"
              variant="outlined"
              v-model="form.city"
            ></v-text-field>
            <v-autocomplete
              v-model="form.country"
              :items="countriesList"
              item-title="name"
              item-value="countries_pk"
              variant="solo-filled"
              label="Select or type a country"
              class="mb-0"
            ></v-autocomplete>
            <v-text-field
              v-if="isUnitedStates"
              label="Zip Code"
              variant="outlined"
              v-model="form.zipcode"
            ></v-text-field>
            <v-autocomplete
  v-if="isUnitedStates"
  v-model="form.state"
  :items="StateList"
  item-title="name"
  variant="outlined"
  label="Select State"
  class="mb-0"
/>
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
                <v-col cols="3" lg="2">
                  <v-img
                    v-if="store.storeImage"
                    :src="store.storeImage"
                    class="event-img"
                  ></v-img>
                </v-col>

                <!-- Informações da Loja -->
                <v-col cols="7" class="pa-2">
                  <h3 class="text-subtitle-1 font-weight-bold">
                    {{ store.storename }}
                  </h3>
                  <p class="text-caption">
                    <v-icon color="red">mdi-map-marker</v-icon>
                    {{ store.address }}, {{ store.streetNumber }} - {{ store.city }}, {{ store.state }}
                  </p>
                  <p class="text-caption">
                    🏛️ Merchant ID: {{ store.MerchantID }}
                  </p>
                </v-col>

                <v-col
                  cols="2"
                  class="d-flex flex-row align-center justify-center pr-2 gap-2"
                >
                  <v-btn
                    color="terciary"
                    icon
                    @click="openEditDialog(store, index)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn color="red" icon @click="removeStore(index)">
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
                label="Street Name"
                outlined
                v-model="editableStore.address"
              ></v-text-field>
              <v-text-field
                label="Street Number"
                outlined
                v-model="editableStore.streetNumber"
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
                @change="handleEditImageUpload"
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
  { name: "Wyoming" }
])



// Exemplo de controle de país
const selectedCountry = ref("United States")

// Interface para o formulário de Store
interface StoreForm {
  site: string;
  storename: string;
  country: string | null;
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


const countriesList = ref([
{ name: "Afghanistan" },
  { name: "Albania" },
  { name: "Algeria" },
  { name: "Andorra" },
  { name: "Angola" },
  { name: "Antigua and Barbuda" },
  { name: "Argentina" },
  { name: "Armenia" },
  { name: "Australia" },
  { name: "Austria" },
  { name: "Azerbaijan" },
  { name: "Bahamas" },
  { name: "Bahrain" },
  { name: "Bangladesh" },
  { name: "Barbados" },
  { name: "Belarus" },
  { name: "Belgium" },
  { name: "Belize" },
  { name: "Benin" },
  { name: "Bhutan" },
  { name: "Bolivia" },
  { name: "Bosnia and Herzegovina" },
  { name: "Botswana" },
  { name: "Brazil" },
  { name: "Brunei" },
  { name: "Bulgaria" },
  { name: "Burkina Faso" },
  { name: "Burundi" },
  { name: "Cabo Verde" },
  { name: "Cambodia" },
  { name: "Cameroon" },
  { name: "Canada" },
  { name: "Central African Republic" },
  { name: "Chad" },
  { name: "Chile" },
  { name: "China" },
  { name: "Colombia" },
  { name: "Comoros" },
  { name: "Congo (Congo-Brazzaville)" },
  { name: "Costa Rica" },
  { name: "Croatia" },
  { name: "Cuba" },
  { name: "Cyprus" },
  { name: "Czech Republic" },
  { name: "Democratic Republic of the Congo" },
  { name: "Denmark" },
  { name: "Djibouti" },
  { name: "Dominica" },
  { name: "Dominican Republic" },
  { name: "Ecuador" },
  { name: "Egypt" },
  { name: "El Salvador" },
  { name: "Equatorial Guinea" },
  { name: "Eritrea" },
  { name: "Estonia" },
  { name: "Eswatini" },
  { name: "Ethiopia" },
  { name: "Fiji" },
  { name: "Finland" },
  { name: "France" },
  { name: "Gabon" },
  { name: "Gambia" },
  { name: "Georgia" },
  { name: "Germany" },
  { name: "Ghana" },
  { name: "Greece" },
  { name: "Grenada" },
  { name: "Guatemala" },
  { name: "Guinea" },
  { name: "Guinea-Bissau" },
  { name: "Guyana" },
  { name: "Haiti" },
  { name: "Honduras" },
  { name: "Hungary" },
  { name: "Iceland" },
  { name: "India" },
  { name: "Indonesia" },
  { name: "Iran" },
  { name: "Iraq" },
  { name: "Ireland" },
  { name: "Israel" },
  { name: "Italy" },
  { name: "Ivory Coast" },
  { name: "Jamaica" },
  { name: "Japan" },
  { name: "Jordan" },
  { name: "Kazakhstan" },
  { name: "Kenya" },
  { name: "Kiribati" },
  { name: "Kuwait" },
  { name: "Kyrgyzstan" },
  { name: "Laos" },
  { name: "Latvia" },
  { name: "Lebanon" },
  { name: "Lesotho" },
  { name: "Liberia" },
  { name: "Libya" },
  { name: "Liechtenstein" },
  { name: "Lithuania" },
  { name: "Luxembourg" },
  { name: "Madagascar" },
  { name: "Malawi" },
  { name: "Malaysia" },
  { name: "Maldives" },
  { name: "Mali" },
  { name: "Malta" },
  { name: "Marshall Islands" },
  { name: "Mauritania" },
  { name: "Mauritius" },
  { name: "Mexico" },
  { name: "Micronesia" },
  { name: "Moldova" },
  { name: "Monaco" },
  { name: "Mongolia" },
  { name: "Montenegro" },
  { name: "Morocco" },
  { name: "Mozambique" },
  { name: "Myanmar (Burma)" },
  { name: "Namibia" },
  { name: "Nauru" },
  { name: "Nepal" },
  { name: "Netherlands" },
  { name: "New Zealand" },
  { name: "Nicaragua" },
  { name: "Niger" },
  { name: "Nigeria" },
  { name: "North Korea" },
  { name: "North Macedonia" },
  { name: "Norway" },
  { name: "Oman" },
  { name: "Pakistan" },
  { name: "Palau" },
  { name: "Palestine State" },
  { name: "Panama" },
  { name: "Papua New Guinea" },
  { name: "Paraguay" },
  { name: "Peru" },
  { name: "Philippines" },
  { name: "Poland" },
  { name: "Portugal" },
  { name: "Qatar" },
  { name: "Romania" },
  { name: "Russia" },
  { name: "Rwanda" },
  { name: "Saint Kitts and Nevis" },
  { name: "Saint Lucia" },
  { name: "Saint Vincent and the Grenadines" },
  { name: "Samoa" },
  { name: "San Marino" },
  { name: "Sao Tome and Principe" },
  { name: "Saudi Arabia" },
  { name: "Senegal" },
  { name: "Serbia" },
  { name: "Seychelles" },
  { name: "Sierra Leone" },
  { name: "Singapore" },
  { name: "Slovakia" },
  { name: "Slovenia" },
  { name: "Solomon Islands" },
  { name: "Somalia" },
  { name: "South Africa" },
  { name: "South Korea" },
  { name: "South Sudan" },
  { name: "Spain" },
  { name: "Sri Lanka" },
  { name: "Sudan" },
  { name: "Suriname" },
  { name: "Sweden" },
  { name: "Switzerland" },
  { name: "Syria" },
  { name: "Taiwan" },
  { name: "Tajikistan" },
  { name: "Tanzania" },
  { name: "Thailand" },
  { name: "Timor-Leste" },
  { name: "Togo" },
  { name: "Tonga" },
  { name: "Trinidad and Tobago" },
  { name: "Tunisia" },
  { name: "Turkey" },
  { name: "Turkmenistan" },
  { name: "Tuvalu" },
  { name: "Uganda" },
  { name: "Ukraine" },
  { name: "United Arab Emirates" },
  { name: "United Kingdom" },
  { name: "United States" },
  { name: "Uruguay" },
  { name: "Uzbekistan" },
  { name: "Vanuatu" },
  { name: "Vatican City" },
  { name: "Venezuela" },
  { name: "Vietnam" },
  { name: "Yemen" },
  { name: "Zambia" },
  { name: "Zimbabwe" }

])




const stores = ref<any[]>(JSON.parse(localStorage.getItem("stores") || "[]"));




const saveStoresToLocalStorage = () => {
  localStorage.setItem("stores", JSON.stringify(stores.value));
};

const handleImageUpload = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      form.value.storeImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const saveStore = () => {
  if (!form.value.storename.trim()) {
    alert("Preencha todos os campos!");
    return;
  }

  stores.value.push({ ...form.value }); // Adiciona à lista
  saveStoresToLocalStorage(); // Salva no LocalStorage

  // Resetar Formulário
  form.value = {
    storename: "",
    description: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    MerchantID: "",
    storeImage: "",
  };

  isExpanded.value = false;
};




const cancelForm = () => {
  form.value = {
    site: "",
    storename: "",
    country: null,
    zipcode: "",
    MerchantID: "",
    storeImage: "",
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
  country: string | null;
  zipcode: string;
  MerchantID: string;
  storeImage: string;
  address: string;
  streetNumber: string;
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
  city: "",
  state: "",
});
const selectedStoreIndex = ref<number | null>(null);

const openEditDialog = (store: any, index: number) => {
  editableStore.value = {
    stores_pk: store.stores_pk,
    site: store.site,
    storename: store.storename,
    country: store.country,
    zipcode: store.zipcode,
    MerchantID: store.MerchantID,
    storeImage: store.storeImage || "",
    address: store.address,
    streetNumber: store.streetNumber,
    city: store.city,
    state: store.state,
  };
  selectedStoreIndex.value = index;
  editDialog.value = true;
};

const handleEditImageUpload = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      editableStore.value.storeImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const saveEditedStore = () => {
  if (selectedStoreIndex.value !== null) {
    stores.value[selectedStoreIndex.value] = { ...editableStore.value };
  }
  editDialog.value = false;
};

const removeStore = (index: any) => {
  stores.value.splice(index, 1);
  localStorage.setItem("stores", JSON.stringify(stores.value));
};

const isUnitedStates = computed(() => {
  const selectedCountry = form.value.country;
  return selectedCountry === "United States";
});

const accountData = ref(null)

const getMerchantAccount = () => {
  const merchantId = '136699508';
  const token = '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';

  axios.get(
    `https://shoppingcontent.googleapis.com/content/v2.1/${merchantId}/accounts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  .then((response: any) => {
    console.log('Dados da conta:', response.data);
    accountData.value = response.data;
  })
  .catch((error: any) => {
    console.error('Erro ao buscar dados da conta:', error)
  })
}

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
