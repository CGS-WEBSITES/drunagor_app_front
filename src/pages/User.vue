<template>
  <v-card
    color="primary"
    class="profile-card mx-auto py-0"
    rounded="0"
    elevation="3"
    style="overflow: visible; position: relative; text-align: center; width: 100%"
  >
    <!-- Background Dinâmico -->
    <div class="position-relative">
      <v-img
        :src="
          user.background_hash
            ? assets + '/Profile/' + user.background_hash
            : 'https://druna-assets.s3.us-east-2.amazonaws.com/Profile/profile-bg-warriors-transparent.png'
        "
        alt="Background Image"
        max-height="529px"
        max-width="100%"
        cover
      ></v-img>
    </div>

    <!-- Imagem do Usuário -->
    <v-img
      :key="reloadKey"
      :src="
        user.picture_hash
          ? assets + '/Profile/' + user.picture_hash
          : assets + '/Profile/user.png'
      "
      :alt="user.picture_hash"
      min-height="118"
      style="
        position: absolute;
        top: 240px;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 2px solid white;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        background-color: black;
        border-radius: 50%;
      "
    ></v-img>

    <v-card-text>
      <div class="user-info" style="margin-top: 50px">
        <p class="user-name" style="font-weight: bold; font-size: 1.4rem">
          {{ user.user_name }}
        </p>
        <p class="user-join-date" style="font-size: 1.1rem; color: #ddd">
          Joined: {{ formattedJoinDate }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { inject, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const assets = inject<string>("assets");
const route = useRoute();
const user = ref({});

// Buscar usuário da API
const fetchUserProfile = async () => {
  try {
    const userId = route.params.id;
    console.log("🔍 Buscando perfil do usuário ID:", userId);

    const response = await axios.get(`https://api.drunagor.app/test/system/users/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });

    console.log("✅ Usuário encontrado:", response.data);
    user.value = response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
  }
};

// Formatar a data de entrada do usuário
const formattedJoinDate = computed(() => {
  if (!user.value.join_date) return "Unknown";
  return new Date(user.value.join_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

fetchUserProfile();
</script>

<style scoped>
.user-info {
  margin-top: 50px;
}

.user-name {
  font-weight: bold;
  font-size: 1.4rem;
}

.user-join-date {
  font-size: 1rem;
  color: #ddd;
}
</style>
