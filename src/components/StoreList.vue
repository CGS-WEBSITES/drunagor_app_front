<template>
  <v-container max-width="776" class="pa-0 pb-8">
    <v-card color="primary" rounded="lg" elevation="7" class="pa-2">
      <!-- Barra de Busca -->
      <v-text-field
        v-model="searchQuery"
        label="Search User"
        variant="solo-filled"
        class="pb-0"
        @input="fetchUsers"
      ></v-text-field>

      <!-- Lista de Usuários Encontrados -->
      <v-card
        v-for="user in filteredUsers"
        :key="user.users_pk"
        @click="navigateToUser(user.users_pk)"
        class="pa-1 mt-3 position-relative"
        rounded="lg"
        elevation="10"
      >
        <!-- Background Overlay -->
        <div
          class="background-overlay"
          :style="{
            backgroundImage: user.background_hash
              ? `url(https://assets.drunagor.app/Profile/${user.background_hash})`
              : 'url(https://assets.drunagor.app/Profile/profile-bg-warriors-transparent.png)',
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

        <v-row class="position-relative" style="z-index: 1">
          <!-- Imagem -->
          <v-col
            cols="4"
            lg="2"
            class="d-flex align-center justify-center pl-6"
          >
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
            <p class="text-caption grey--text">
              User since: {{ user.join_date }}
            </p>
          </v-col>
        </v-row>
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Obtém a instância do axios e a URL base da API
const axios = inject("axios");
const apiUrl = inject("apiUrl") || "https://api.drunagor.app/test/system";

// Variáveis
const users = ref([]);
const searchQuery = ref("");

// Computed para garantir que apenas os usuários cujo `user_name` começa com o termo sejam exibidos
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  return users.value.filter((user) =>
    user.user_name.toLowerCase().startsWith(searchQuery.value.toLowerCase()),
  );
});

const navigateToUser = (userId) => {
  if (!userId) return;
  const encodedId = btoa(userId.toString());
  router.push({ name: "User", params: { id: encodedId } });
};

// Busca usuários pelo nome digitado
const fetchUsers = async () => {
  if (!searchQuery.value) return;

  try {
    const response = await axios.get(`${apiUrl}/users/search`, {
      params: { user_name: searchQuery.value }, // Busca pelo nome de usuário
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.data.users || response.data.users.length === 0) {
      users.value = [];
      return;
    }

    users.value = response.data.users.map((user) => ({
      users_pk: user.users_pk, // ID do usuário
      name: user.nome || "Name not available",
      user_name: user.user_name || "User not found",
      join_date: user.join_date || "Date not available",
      picture_hash: user.picture_hash
        ? `https://assets.drunagor.app/Profile/${user.picture_hash}`
        : "https://assets.drunagor.app/Profile/user.png",
      background_hash: user.background_hash,
    }));
  } catch (error) {
    users.value = [];
  }
};
</script>
