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
      @click="navigateToUser(user.users_pk)"
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
import { useRouter } from "vue-router";

const router = useRouter();

const navigateToUser = (userId) => {
  if (!userId) {
    console.warn("⚠ Nenhum userId fornecido!");
    return;
  }
  console.log("🔗 Redirecionando para o perfil do usuário:", userId);
  router.push({ name: "User", params: { id: userId } });
};

// Obtém a instância do axios e a URL base da API
const axios = inject("axios");
const apiUrl = inject("apiUrl") || "http://ec2-18-189-52-115.us-east-2.compute.amazonaws.com:5002";

// Variáveis
const user = ref(null);
const searchQuery = ref("");

const fetchUser = async () => {
  if (!searchQuery.value) return;

  try {
    console.log("🔍 ID enviado para API:", searchQuery.value);
    const response = await axios.get(`${apiUrl}/users/${searchQuery.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    console.log("📡 Resposta da API:", response.data); // Veja a resposta da API no console

    if (!response.data || Object.keys(response.data).length === 0) {
      console.warn("⚠ Nenhum usuário encontrado!");
      return;
    }

    // Atualiza os dados do usuário corretamente
    user.value = {
      users_pk: response.data.users_pk, // Agora incluindo o ID
      name: response.data.name || "Nome não disponível",
      join_date: response.data.join_date || "Data não disponível",
      user_name: response.data.user_name || "Usuário não encontrado",
      picture_hash: response.data.picture_hash
        ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${response.data.picture_hash}`
        : "https://druna-assets.s3.us-east-2.amazonaws.com/Profile/user.png",
      background_hash: response.data.background_hash,
    };

    console.log("✅ Usuário carregado:", user.value);
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
    console.warn("⚠ Erro ao buscar usuário! Verifique o ID.");
  }
};
</script>
