<template>
  <v-container max-width="776" class="pa-0">
    <v-card rounded="lg" elevation="7" class="pa-2">
      <!-- Barra de Busca -->
      <v-text-field
        v-model="searchQuery"
        label="Search User ID"
        variant="solo-filled"
        class="pb-0"
        @input="fetchUser"
      ></v-text-field>

      <!-- Usuário encontrado -->
      <v-card 
       @click="item.user_pk ? goToProfile(item.user_pk) : console.warn('Usuário sem user_pk')"
  v-if="user" 
  class="pa-1 mt-3 position-relative" 
  rounded="lg" 
  elevation="10"
  
>
  <!-- Background Overlay -->
  <div 
    class="background-overlay"
    :style="{
      backgroundImage: user.background_hash 
        ? `url(https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${user.background_hash})` 
        : 'url(https://druna-assets.s3.us-east-2.amazonaws.com/Profile/profile-bg-warriors-transparent.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '8px',
      zIndex: 0,
     
    }"
  ></div>

  <v-row class="position-relative" style="z-index: 1;">
    <!-- Imagem -->
    <v-col cols="4" lg="2" class="d-flex align-center justify-center pl-6">
      <v-img
        :src="user.picture_hash"
        alt="User Profile Image"
        max-width="90"
        max-height="90"
        class="rounded-lg bg-background"

      ></v-img>
    </v-col>

    <!-- Informações -->
    <v-col cols="7">
      <p class="font-weight-bold text-truncate">{{ user.user_name }}</p>
      <p class="text-body-2 grey--text">{{ user.name }}</p>
      <p class="text-caption grey--text"> User since: {{ user.join_date }}</p>
    </v-col>
  </v-row>
</v-card>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref, inject,computed } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();

const goToProfile = (user_pk) => {
  router.push({ name: 'UserProfile', params: { user_pk } });
};

// Obtém a instância do axios e a URL base da API
const axios = inject("axios");
const apiUrl = inject("apiUrl") || "http://ec2-18-189-52-115.us-east-2.compute.amazonaws.com:5002";

// Variáveis
const user = ref(null);
const searchQuery = ref("");

// Função para buscar usuário pela user_pk
const fetchUser = async () => {
  if (!searchQuery.value) return;

  try {
    console.log("🔍 Buscando usuário com ID:", searchQuery.value);
    const response = await axios.get(`${apiUrl}/users/${searchQuery.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    // Atualiza o usuário encontrado
    user.value = {
      user_pk: user.users_pk || user.user_pk, // Se um dos dois existir, pega o correto
      name: response.data.name,
      join_date: response.data.join_date,
      user_name: response.data.user_name,
      picture_hash: response.data.picture_hash
        ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${response.data.picture_hash}`
        : "https://druna-assets.s3.us-east-2.amazonaws.com/Profile/user.png",
        background_hash: response.data.background_hash,
    };

  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    user.value = null;
  }
};
</script>
