<template>
  <v-card
    color="primary"
    class="profile-card mx-auto py-0 mt-16 mt-md-0"
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
          currentBackgroundHash
            ? assets + '/Profile/' + currentBackgroundHash + '?t=' + userStore.cacheBuster
            : assets + '/Profile/profile-bg-warriors-transparent.png'
        "
        :alt="currentBackgroundHash || 'profile background'"
        max-height="529px"
        max-width="100%"
        cover
        position="top center"
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
          v-if="!isEditPage"
          icon
          class="position-absolute bottom-0 right-0 ma-1"
          color="rgba(0, 0, 0, 0.6)"
          elevation="3"
          rounded="xl"
          size="x-small"
          @click="router.push('/profile/edit')"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-img>
    </div>

    <v-img
      :key="reloadKey"
      :src="
        currentPictureHash
          ? assets + '/Profile/' + currentPictureHash + '?t=' + userStore.cacheBuster
          : assets + '/Profile/user.png'
      "
      :alt="currentPictureHash || 'profile picture'"
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
        v-if="!isEditPage"
        icon
        class="position-absolute bottom-0 right-0 ma-1"
        color="rgba(0, 0, 0, 0.6)"
        elevation="3"
        rounded="xl"
        size="x-small"
        @click="router.push('/profile/edit')"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-img>

    <v-card-text>
      <div class="user-info" style="margin-top: -80px">
        <p class="user-name" style="font-weight: bold; font-size: 1.4rem">
          {{ user.user_name }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, inject, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const reloadKey = ref(0);
const user = computed(() => userStore.user);
const assets = inject<string>("assets");

const currentPictureHash = computed(() => userStore.editingPictureHash || user.value.picture_hash);
const currentBackgroundHash = computed(() => userStore.editingBackgroundHash || user.value.background_hash);
const isEditPage = computed(() => route.path === "/profile/edit");

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
.product-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
