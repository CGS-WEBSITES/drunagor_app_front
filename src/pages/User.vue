<template>
  <v-card color="primary" class="profile-card mx-auto py-0" rounded="0" elevation="3" style="
    overflow: visible;
    position: relative;
    text-align: center;
    width: 100%;
  ">
    <div class="position-relative">
      <v-img :src="user.background_hash
          ? assets + '/Profile/' + user.background_hash
          : 'https://assets.drunagor.app/Profile/profile-bg-warriors-transparent.png'
        " alt="Background Image" max-height="529px" max-width="100%" cover style="position: relative;">

        <v-btn icon="mdi-arrow-left" class="position-absolute top-0 left-0 ma-2" color="rgba(0, 0, 0, 0.6)"
          elevation="3" @click="$router.go(-1)"></v-btn>


        <v-menu v-if="isFriend" open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-account-check" class="position-absolute top-0 right-0 ma-2"
              color="rgba(0, 0, 0, 0.6)" elevation="3"></v-btn>
          </template>
          <!-- <v-list class="ma-2">
            <v-list-item @click="removeFriend">
              <v-list-item-icon>
                <v-icon>mdi-account-remove</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list> -->
        </v-menu>

        <v-btn v-else icon="mdi-account-plus" class="position-absolute top-0 right-0 ma-2" color="rgba(0, 0, 0, 0.6)"
          elevation="3" @click="addFriend"></v-btn>


        <p class="user-join-date"
          style="position: absolute; bottom: 4px; right: 4px; font-size: 0.7rem; color: #ddd; margin: 0;">
          Joined: {{ formattedJoinDate }}
        </p>
      </v-img>
    </div>

    <v-img :key="reloadKey" :src="user.picture_hash
        ? assets + '/Profile/' + user.picture_hash
        : assets + '/Profile/user.png'
      " :alt="user.picture_hash" max-width="118" style="
          top: -30px;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 0.5px solid white;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          background-color: black;
      ">
    </v-img>

    <v-card-text>
      <div class="user-info" style="margin-top: -80px ">
        <p class="user-name" style="font-weight: bold; font-size: 1.4rem">
          {{ user.user_name }}

          <div class="d-none d-md-inline justify-center align-center">
            <v-menu v-if="isFriend" open-on-hover>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-account-check" color="rgba(0, 0, 0, 0.0)" elevation="0"
                  size="small"></v-btn>
              </template>
              <!-- <v-list>
              <v-list-item @click="removeFriend">
                <v-list-item-icon>
                  <v-icon >mdi-account-remove</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Remove Friend</v-list-item-title>
              </v-list-item>
            </v-list> -->
            </v-menu>

            <v-btn v-else icon="mdi-account-plus" color="rgba(0, 0, 0, 0.6)" elevation="3" size="small"
              @click="addFriend"></v-btn>
          </div>

          <BaseAlert
            v-model="showAlert"
            type="success"
            text
            class="custom-alert"
          >
            Friend request sent!
          </BaseAlert>

          <BaseAlert
            v-model="showErrorAlert"
            type="error"
            class="custom-alert"
          >
            {{ errorMessage }}
          </BaseAlert>
        </p>
      </div>
    </v-card-text>

  </v-card>

  <BadgesUser />

  <favorite-campaign-card />

</template>

<script lang="ts" setup>
import { inject, computed, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/store/UserStore";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";

const assets = inject<string>("assets");
const route = useRoute();
const user = ref({});

// Buscar perfil do usuário sem expor URL
const fetchUserProfile = async () => {
  try {
    const encodedId = route.params.id;
    const userId = atob(encodedId);
    const response = await axios.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    user.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar o perfil:", error);
  }
};

// Formatar a data de entrada do usuário
const formattedJoinDate = computed(() => {
  if (!user.value.join_date) return "Unknown";
  return new Date(user.value.join_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
});

fetchUserProfile();

const userStore = useUserStore();
const showAlert = ref(false);
const showErrorAlert = ref(false);
const errorMessage = ref("");

// Enviar pedido de amizade
const addFriend = async () => {
  try {
    const invite_users_fk = userStore.user?.users_pk;
    const recipient_users_fk = user?.value?.users_pk;

    if (!invite_users_fk || !recipient_users_fk) {
      console.error("❌ Erro: IDs dos usuários estão indefinidos.");
      return;
    }

    await axios.post(
      "/friends/register",
      {
        invite_users_fk,
        recipient_users_fk,
        active: "true",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    showAlert.value = true;
    setTimeout(() => {
      showAlert.value = false;
    }, 1500);
  } catch (error) {
    showErrorAlert.value = true;
    errorMessage.value =
      error.response?.data?.message || "Erro ao enviar o pedido de amizade.";
    setTimeout(() => (showErrorAlert.value = false), 1500);
  }
};

// Verifica se o usuário já é amigo
const isFriend = ref(false);

const checkFriendStatus = async () => {
  try {
    const encodedId = route.params.id;
    const userId = parseInt(atob(encodedId));

    const response = await axios.get("/friends/list_friends", {
      params: { invite_users_fk: userStore.user?.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const friendData = response.data.friends || [];

    const friend = friendData.find(
      (f) =>
        (f.invite_users_fk === userStore.user?.users_pk &&
          f.recipient_users_fk === userId) ||
        (f.invite_users_fk === userId &&
          f.recipient_users_fk === userStore.user?.users_pk)
    );

    isFriend.value = friend?.accepted === true;
  } catch (error) {
    console.error("❌ Erro ao verificar status de amizade:", error);
  }
};

checkFriendStatus();
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

.product-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
}

.custom-alert {
  top: 50%;
  left: 50%;
  transform: translate(-50%, 10%);
  /* Centraliza na tela */
  width: 300px;
  /* Defina um tamanho adequado */
  height: 44px;
  z-index: 9999;
  padding: 10px;
  transition: opacity 0.5s ease-in-out;
}
</style>