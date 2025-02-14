<template>
    <v-col cols="12" class="d-flex justify-center pa-0">
      <v-container max-width="804" class="py-4">
        <!-- Card com funcionalidade de colapsar -->
        <v-card   min-width="378px" elevation="2" rounded="lg">
          <!-- Cabeçalho com título e seta -->
          <v-card-title
            class="d-flex justify-space-between align-center"
            @click="toggleForm"
          >
            <span class="text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase"
              >MY STORE</span
            >
  
            <v-icon>{{
              isExpanded ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
          </v-card-title>
  
          <!-- Conteúdo do formulário (visível apenas se expandido) -->
          <v-expand-transition>
            <v-card-text v-if="isExpanded">
  <v-alert closable v-model="showAlert" :icon="alertIcon" :title="alertTitle" :text="alertText" :type="alertType"></v-alert>
  
  <v-form ref="userForm">
    
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

    <!-- Store Name -->
    <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Store Name</p>
    <v-text-field label="" variant="solo-filled" v-model="form.storename" class="mb-0"></v-text-field>

    <!-- Store Description -->
    <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Store Description</p>
    <v-text-field label="" variant="solo-filled" v-model="form.description" class="mb-0"></v-text-field>

    <!-- Address Fields -->
    <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Address Line 1</p>
    <v-text-field label="" variant="solo-filled" v-model="form.address1" class="mb-0"></v-text-field>

    <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Address Line 2</p>
    <v-text-field label="" variant="solo-filled" v-model="form.address2" class="mb-0"></v-text-field>

    <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">City</p>
    <v-text-field label="" variant="solo-filled" v-model="form.city" class="mb-0"></v-text-field>

    <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">State</p>
    <v-text-field label="" variant="solo-filled" v-model="form.state" class="mb-0"></v-text-field>

    <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Zip Code</p>
    <v-text-field label="" variant="solo-filled" v-model="form.zipcode" class="mb-0"></v-text-field>

    <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Country</p>
    <v-text-field label="" variant="solo-filled" v-model="form.country" class="mb-0"></v-text-field>

    <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Merchant ID</p>
    <v-text-field label="" variant="solo-filled" v-model="form.MerchantID" class="mb-0"></v-text-field>

  </v-form>

  <!-- Botões de Ação -->
  <v-card-actions>
    <v-btn color="green" @click="saveForm">Save</v-btn>
    <v-btn color="red" text @click="cancelForm">Cancel</v-btn>
  </v-card-actions>
</v-card-text>
          </v-expand-transition>
        </v-card>
      </v-container>
    </v-col>
  </template>
  
  <script lang="ts" setup>
  import { ref, inject } from "vue";
  
  import { useUserStore } from "@/store/UserStore";
  import type { VForm } from "vuetify/components";
  import { getToken } from "@/service/AccessToken";
  
  const userForm = ref<VForm>();
  const userStore = useUserStore();
  const user = userStore.user;
  // Estado de expansão
  const isExpanded = ref(false);
  // Alternar abertura/fechamento
  const toggleForm = () => {
    isExpanded.value = !isExpanded.value;
  };
  

// Formulário da Loja
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
  storeImage: "", // Armazena a imagem da loja
});

// Função para lidar com o upload de imagem
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      form.value.storeImage = reader.result; // Converte para URL temporária
    };
    reader.readAsDataURL(file);
  }
};

const saveForm = () => {
  console.log("Store data saved:", form.value);
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
    country: "",
    MerchantID: "",
    storeImage: "",
  };
};


  
  
 
  </script>