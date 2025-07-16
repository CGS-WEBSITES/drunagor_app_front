<template>
  <v-card
    color="primary"
    class="profile-card mx-auto py-0"
    rounded="0"
    elevation="3"
    style="
      overflow: visible;
      position: relative;
      text-align: center;
      width: 100%;
    "
  >
    <div class="position-relative">
      <v-img
        :key="reloadKey"
        :src="
          user.background_hash
            ? assets + '/Profile/' + user.background_hash
            : assets + '/Profile/profile-bg-warriors-transparent.png'
        "
        :alt="user.picture_hash"
        max-height="529px"
        max-width="100%"
        cover
      >
        <p
          class="user-join-date"
          style="
            position: absolute;
            bottom: 4px;
            left: 4px;
            font-size: 0.7rem;
            color: #ddd;
            margin: 0;
          "
        >
          Joined: {{ formattedJoinDate }}
        </p>

        <v-btn
          icon
          class="position-absolute bottom-0 right-0 ma-1"
          color="rgba(0, 0, 0, 0.6)"
          elevation="3"
          rounded="xl"
          size="x-small"
        >
          <v-icon>mdi-pencil</v-icon>
          <profile-background-dialog /> </v-btn
      ></v-img>

      <!-- <v-btn icon="mdi-pencil" class="position-absolute top-0 right-0 ma-2" color="rgba(0, 0, 0, 0.6)" elevation="3"
        :to="'/perfil/perfil-image'"></v-btn> -->
    </div>

    <v-img
      :key="reloadKey"
      :src="
        user.picture_hash
          ? assets + '/Profile/' + user.picture_hash
          : assets + '/Profile/user.png'
      "
      :alt="user.picture_hash"
      max-width="118"
      style="
        top: -30px;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 0.5px solid white;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        background-color: black;
      "
    >
      <v-btn
        icon
        class="position-absolute bottom-0 right-0 ma-1"
        color="rgba(0, 0, 0, 0.6)"
        elevation="3"
        rounded="xl"
        size="x-small"
      >
        <v-icon>mdi-pencil</v-icon>
        <profile-pic-dialog></profile-pic-dialog>
      </v-btn>
    </v-img>

    <v-card-text>
      <div class="user-info" style="margin-top: -80px">
        <p class="user-name" style="font-weight: bold; font-size: 1.4rem">
          {{ user.user_name }}
        </p>
        <!-- <p class="user-points" style="font-size: 1.1rem;">
          {{ points }} pts
        </p>
        <p class="user-ranking" style="font-size: 1.1rem;">
          {{ ranking }}°
        </p> -->
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { inject, computed } from "vue";
import { useUserStore } from "@/store/UserStore";

const reloadKey = ref(0);
const user = computed(() => useUserStore().user); // Inicializa a store
const assets = inject<string>("assets");

const formattedJoinDate = computed(() => {
  if (!user.value.join_date) return "Unknown";
  return new Date(user.value.join_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
});
</script>

<style scoped>
/* Estilos para o card (ajuste conforme necessário) */
.product-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
