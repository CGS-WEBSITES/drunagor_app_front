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
              label="Store Name"
              variant="outlined"
              v-model="form.storename"
            ></v-text-field>
            <v-text-field
              label="Store Description"
              variant="outlined"
              v-model="form.description"
            ></v-text-field>
            <v-text-field
              label="Address Line 1"
              variant="outlined"
              v-model="form.address1"
            ></v-text-field>
            <v-text-field
              label="Address Line 2"
              variant="outlined"
              v-model="form.address2"
            ></v-text-field>
            <v-text-field
              label="City"
              variant="outlined"
              v-model="form.city"
            ></v-text-field>
            <v-text-field
              label="State"
              variant="outlined"
              v-model="form.state"
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
            <v-text-field
              label="Merchant ID"
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
                    {{ store.name }}
                  </h3>
                  <p class="text-caption">
                    <v-icon color="red">mdi-map-marker</v-icon>
                    {{ store.site }}, {{ store.site }}
                  </p>
                  <p class="text-caption">
                    🏛️ Merchant ID: {{ store.google_id }}
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
            <v-card-title class="text-h5 font-weight-bold"
              >Edit Store</v-card-title
            >
            <v-card-text>
              <v-text-field
                v-model="editableStore.storename"
                label="Store Name"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="editableStore.description"
                label="Store Description"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="editableStore.address1"
                label="Address Line 1"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="editableStore.city"
                label="City"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="editableStore.state"
                label="State"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="editableStore.zipcode"
                label="Zip Code"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="editableStore.MerchantID"
                label="Merchant ID"
                outlined
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
import { get } from "node_modules/axios/index.cjs";
import { ref, onMounted, computed } from "vue";

interface StoreForm {
  storename: string;
  description: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  country: string | null;
  MerchantID: string;
  storeImage: string;
}

const form = ref<StoreForm>({
  storename: "",
  description: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zipcode: "",
  country: null,
  MerchantID: "",
  storeImage: "",
});

const axios: any = inject("axios");

const storedUser = localStorage.getItem("app_user");
const appUser = storedUser ? JSON.parse(storedUser).users_pk : null;
console.log('appUser', appUser)

interface Country {
  countries_pk: number;
  name: string;
  abbreviation: string;
}

const countriesList = ref<Country[]>([]);

const fetchCountries = () => {
  axios.get("countries/search")
    .then((response: any) => {
      countriesList.value = response.data.countries.map((country: any) => ({
        countries_pk: country.countries_pk,
        name: country.name,
        abbreviation: country.abbreviation,
      }));
      // console.log("Países carregados:", countriesList.value);
    })
    .catch((error: any) => {
      console.error("Erro ao buscar países:", error);
    });
};

const fetchStores = () => {
  axios.get('stores/list', { params: { users_fk: appUser } })
    .then((response: any) => {
      stores.value = response.data.stores;
      console.log("Lojas carregadas:", stores.value);
    })
    .catch((error: any) => {
      console.error("Erro ao buscar lojas:", error);
    });
};

onMounted(() => {
  fetchCountries();
})

onMounted(() => {
  fetchStores();
})

onMounted(() => {
  const savedStores = localStorage.getItem("stores");
  if (savedStores) {
    stores.value = JSON.parse(savedStores);
  }
});

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

  const storeData = {
    site: form.value.storename,
    name: form.value.storename,
    google_id: form.value.MerchantID,
    zip_code: form.value.zipcode || 1,
    countries_fk: form.value.country,
    users_fk: appUser,
  };

  axios
    .post("stores/cadastro", storeData)
    .then((response: any) => {
      console.log("Loja cadastrada com sucesso:", response.data);

      stores.value.push({ ...form.value });
      saveStoresToLocalStorage();

      form.value = {
        storename: "",
        description: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipcode: "",
        country: null,
        MerchantID: "",
        storeImage: "",
      };
      isExpanded.value = false;
      fetchStores();
    })
    .catch((error: any) => {
      console.error("Erro ao cadastrar loja:", error);
      alert("Erro ao cadastrar loja. Tente novamente.");
    });
};

const cancelForm = () => {
  form.value = {
    storename: "",
    description: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    country: null,
    MerchantID: "",
    storeImage: "",
  };
  isExpanded.value = false;
};

const isExpanded = ref(false);
const toggleForm = () => {
  isExpanded.value = !isExpanded.value;
};

const editDialog = ref(false);
const editableStore = ref({
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
});
const selectedStoreIndex = ref(null);

const openEditDialog = (store: any, index: any) => {
  editableStore.value = { ...store };
  selectedStoreIndex.value = index;
  editDialog.value = true;
};

const saveEditedStore = () => {
  if (selectedStoreIndex.value !== null) {
    stores.value[selectedStoreIndex.value] = { ...editableStore.value };
  }
  editDialog.value = false;
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

const stores = ref(JSON.parse(localStorage.getItem("stores") || "[]"));

const addStore = () => {
  if (form.value.storename) {
    stores.value.push({ ...form.value });

    localStorage.setItem("stores", JSON.stringify(stores.value));

    form.value = {
      storename: "",
      description: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
      country: null,
      MerchantID: "",
      storeImage: "",
    };
  }
};

const removeStore = async (index: number) => {
  const store = stores.value[index];
  const stores_pk = store.stores_pk;

  try {
    await axios.delete(`stores/${stores_pk}/delete/`);
    stores.value.splice(index, 1);
  } catch (error) {
    console.error("Erro ao remover loja:", error);
    alert("Erro ao remover loja. Tente novamente.");
  }
};

const isUnitedStates = computed(() => {
  const selectedCountry = form.value.country;

  return Number(selectedCountry) === 250;
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

/* Event Image */
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