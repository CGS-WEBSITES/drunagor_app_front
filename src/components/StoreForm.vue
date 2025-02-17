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
        <v-container max-width="800" style="min-width: 360px;" class="pa-4">
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
          <v-text-field label="Store Name" variant="outlined" v-model="form.storename"></v-text-field>
          <v-text-field label="Store Description" variant="outlined" v-model="form.description"></v-text-field>
          <v-text-field label="Address Line 1" variant="outlined" v-model="form.address1"></v-text-field>
          <v-text-field label="Address Line 2" variant="outlined" v-model="form.address2"></v-text-field>
          <v-text-field label="City" variant="outlined" v-model="form.city"></v-text-field>
          <v-text-field label="State" variant="outlined" v-model="form.state"></v-text-field>
          <v-text-field label="Zip Code" variant="outlined" v-model="form.zipcode"></v-text-field>
          <v-text-field label="Country" variant="outlined" v-model="form.country"></v-text-field>
          <v-text-field label="Merchant ID" variant="outlined" v-model="form.MerchantID"></v-text-field>
        </v-form>

        <!-- Botões de Ação -->
        <v-card-actions>
          <v-btn color="green" @click="saveStore">Save Store</v-btn>
          <v-btn color="red" text @click="cancelForm">Cancel</v-btn>
        </v-card-actions>
      </v-card-text>

      <v-divider class="my-4"></v-divider>

      <!-- Lista de Lojas Salvas -->
      <v-row v-if="stores.length > 0" no-gutters class="d-flex flex-column">
    <v-col v-for="(store, index) in stores" :key="index" cols="12">
      <v-card color="primary" min-height="130px" class="mb-4 event-card">
        <v-row no-gutters>
          <!-- Imagem da Loja -->
          <v-col cols="3" lg="2">
            <v-img v-if="store.storeImage" :src="store.storeImage" class="event-img"></v-img>
          </v-col>

          <!-- Informações da Loja -->
          <v-col cols="7" class="pa-2">
            <h3 class="text-subtitle-1 font-weight-bold">{{ store.storename }}</h3>
            <p class="text-caption">
              <v-icon color="red">mdi-map-marker</v-icon> {{ store.address1 }}, {{ store.city }}
            </p>
            <p class="text-caption">🏛️ Merchant ID: {{ store.MerchantID }}</p>
          </v-col>

          
          <v-col cols="2" class="d-flex flex-row align-center justify-center pr-2 gap-2">
  <v-btn  color="terciary" icon @click="openEditDialog(store, index)">
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
      <v-card-title class="text-h5 font-weight-bold">Edit Store</v-card-title>
      <v-card-text>
        <v-text-field v-model="editableStore.storename" label="Store Name" outlined></v-text-field>
        <v-text-field v-model="editableStore.description" label="Store Description" outlined></v-text-field>
        <v-text-field v-model="editableStore.address1" label="Address Line 1" outlined></v-text-field>
        <v-text-field v-model="editableStore.city" label="City" outlined></v-text-field>
        <v-text-field v-model="editableStore.state" label="State" outlined></v-text-field>
        <v-text-field v-model="editableStore.zipcode" label="Zip Code" outlined></v-text-field>
        <v-text-field v-model="editableStore.MerchantID" label="Merchant ID" outlined></v-text-field>

        <!-- Upload de Imagem -->
        <v-file-input label="Upload Store Image" accept="image/*" @change="handleEditImageUpload"></v-file-input>
        <v-img v-if="editableStore.storeImage" :src="editableStore.storeImage" height="100" class="mt-2 rounded"></v-img>
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
  import { ref, onMounted } from "vue";



// Estado do Formulário da Loja
const form = ref({
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

// Carregar lojas do LocalStorage ao iniciar
onMounted(() => {
  const savedStores = localStorage.getItem("stores");
  if (savedStores) {
    stores.value = JSON.parse(savedStores);
  }
});

// Salvar lojas no LocalStorage
const saveStoresToLocalStorage = () => {
  localStorage.setItem("stores", JSON.stringify(stores.value));
};

// Função para fazer upload de imagem
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      form.value.storeImage = reader.result; // Salva a URL da imagem
    };
    reader.readAsDataURL(file);
  }
};

// Adicionar nova loja
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



// Resetar Formulário
const cancelForm = () => {
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

// Alternar exibição do formulário
const isExpanded = ref(false);
const toggleForm = () => {
  isExpanded.value = !isExpanded.value;
};

  


const editDialog = ref(false);
const editableStore = ref({});
const selectedStoreIndex = ref(null);

const openEditDialog = (store, index) => {
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



const handleEditImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      editableStore.value.storeImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
};


// Recupera as lojas do localStorage ao iniciar
const stores = ref(JSON.parse(localStorage.getItem("stores") || "[]"));

// Função para adicionar uma nova loja
const addStore = () => {
  if (form.value.storename) {
    stores.value.push({ ...form.value });

    // Salva no localStorage
    localStorage.setItem("stores", JSON.stringify(stores.value));

    // Limpa o formulário
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
  }
};

// Função para remover loja
const removeStore = (index) => {
  stores.value.splice(index, 1);

  // Atualiza o localStorage
  localStorage.setItem("stores", JSON.stringify(stores.value));
};
  
 
  </script>


<style scoped>
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