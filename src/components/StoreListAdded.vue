<template>
  <v-container max-width="776" class="pa-4">
    <v-card color="primary" rounded="lg" elevation="6" class="pa-4">
      <v-col cols="12" class="d-flex justify-center pa-0">
        <v-tabs v-model="activeTab" class="mb-4 overflow-visible-tabs">
          <v-tab :value="'friends'" class="text-h5 text-bold">Friends</v-tab>

          <v-badge
            :model-value="requests.length > 0"
            color="red"
            dot
            location="top end"
            offset-x="8"
            offset-y="8"
          >
            <v-tab :value="'requests'" class="text-h5 text-bold"
              >Requests</v-tab
            >
          </v-badge>
        </v-tabs>
      </v-col>

      <v-text-field
        v-model="searchQuery"
        label="Search"
        variant="solo-filled"
        class="pb-0"
      ></v-text-field>

      <v-virtual-scroll :items="filteredList" :item-height="100">
        <template #default="{ item }">
          <v-card
            class="pa-1 mb-3 cursor-pointer"
            rounded="lg"
            elevation="10"
            @click="navigateToUser(item.friends_id)"
          >
            <div
              class="background-overlay"
              :style="{
                backgroundImage: item.background_hash
                  ? `url(https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${item.background_hash})`
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
            <v-row>
              <v-col cols="4" lg="2" class="d-flex align-center justify-center">
                <v-img
                  :src="item.image"
                  alt="User Image"
                  max-width="90"
                  max-height="90"
                  class="rounded-lg"
                ></v-img>
              </v-col>

              <v-col cols="6">
                <p class="font-weight-bold text-truncate">
                  {{ item.user_name }}
                </p>
              </v-col>

              <v-col
                v-if="!item.accepted"
                cols="2"
                md="4"
                class="d-flex justify-end align-center"
              >
                <v-btn
                  class="ma-2"
                  color="green"
                  :loading="processingRequest === item.friends_pk"
                  :disabled="!!processingRequest"
                  @click.stop="acceptFriend(item)"
                  >ACCEPT</v-btn
                >
                <v-btn
                  class="ma-2"
                  color="red"
                  :loading="processingRequest === item.friends_pk"
                  :disabled="!!processingRequest"
                  @click.stop="declineFriend(item.friends_pk)"
                  >DECLINE</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </template>
      </v-virtual-scroll>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";

const axios = inject("axios");
const apiUrl = inject("apiUrl");
const userStore = useUserStore();
const userId = userStore.user.users_pk;
const router = useRouter();

// Estados
const activeTab = ref("friends");
const searchQuery = ref("");
const friends = ref([]);
const requests = ref([]);
const processingRequest = ref(null); // Controla o estado de loading

const filteredList = computed(() => {
  const list = activeTab.value === "friends" ? friends.value : requests.value;
  if (!searchQuery.value) return list;
  return list.filter((item) =>
    item.user_name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const navigateToUser = (userId) => {
  try {
    if (!userId) throw new Error("ID do usuário não encontrado!");
    const encodedId = btoa(userId.toString());
    router.push({ name: "User", params: { id: encodedId } });
  } catch (error) {
    console.error("Erro ao navegar:", error.message);
  }
};

const fetchFriends = async () => {
  try {
    const userStore = useUserStore();
    const userId = userStore.user?.users_pk;

    if (!userId) {
      console.error("❌ Erro: Usuário não identificado.");
      return;
    }

    const response = await axios.get(`${apiUrl}/friends/list_friends`, {
      params: { invite_users_fk: userId, accepted: true },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const friendData = response.data.friends;

    friends.value = friendData.map((friend) => ({
      friends_pk: friend.friends_pk,
      user_name: friend.user_name,
      friends_id:
        friend.invite_users_fk === userId
          ? friend.recipient_users_fk
          : friend.invite_users_fk,
      image: friend.picture_hash
        ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${friend.picture_hash}`
        : `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/user.png`,
      background_hash: friend.background_hash,
      accepted: true,
    }));
  } catch (error) {
    console.error(
      "❌ Erro ao buscar amigos:",
      error.response?.data || error.message,
    );
  }
};

const fetchRequests = async () => {
  try {
    const response = await axios.get(`${apiUrl}/friends/list_requests`, {
      params: { recipient_users_fk: userId, accepted: false, active: true },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const friendRequests = response.data.friends || [];

    requests.value = friendRequests.map((friend) => ({
      friends_pk: friend.friends_pk,
      user_name: friend.user_name,
      friends_id: friend.invite_users_fk,
      image: friend.picture_hash
        ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${friend.picture_hash}`
        : `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/user.png`,
      background_hash: friend.background_hash,
      accepted: false,
    }));
  } catch (error) {
    console.error(
      "❌ Erro ao buscar solicitações:",
      error.response?.data || error.message,
    );
  }
};

const acceptFriend = async (requestItem) => {
  if (!requestItem || !requestItem.friends_pk) {
    console.error("❌ Erro: Item de solicitação inválido.");
    return;
  }

  const { friends_pk } = requestItem;
  processingRequest.value = friends_pk;

  const requestIndex = requests.value.findIndex(
    (r) => r.friends_pk === friends_pk,
  );
  if (requestIndex > -1) {
    requests.value.splice(requestIndex, 1);
  }

  const newFriend = { ...requestItem, accepted: true };
  friends.value.unshift(newFriend);

  try {
    await axios.put(
      `${apiUrl}/friends/accept/${friends_pk}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    await fetchFriends();
  } catch (error) {
    console.error(
      "❌ Erro ao aceitar amizade:",
      error.response?.data || error.message,
    );
    await fetchFriends();
    await fetchRequests();
  } finally {
    processingRequest.value = null;
  }
};

const declineFriend = async (friends_pk) => {
  if (!friends_pk) {
    console.error("❌ Erro: ID do pedido (friends_pk) não fornecido.");
    return;
  }

  processingRequest.value = friends_pk;

  const requestIndex = requests.value.findIndex(
    (r) => r.friends_pk === friends_pk,
  );
  if (requestIndex > -1) {
    requests.value.splice(requestIndex, 1);
  }

  try {
    await axios.delete(`${apiUrl}/friends/${friends_pk}/delete`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  } catch (error) {
    console.error(
      "❌ Erro ao recusar amizade:",
      error.response?.data || error.message,
    );
    await fetchRequests();
  } finally {
    processingRequest.value = null;
  }
};

onMounted(() => {
  fetchRequests();
  fetchFriends();
});

watch(activeTab, (newTab) => {
  if (newTab === "friends") {
    fetchFriends();
  } else if (newTab === "requests") {
    fetchRequests();
  }
});
</script>

<style scoped>
/* REGRA DE CSS MAIS FORTE PARA GARANTIR QUE NADA SEJA CORTADO */
.overflow-visible-tabs :deep(.v-slide-group__container),
.overflow-visible-tabs :deep(.v-slide-group__content) {
  overflow: visible !important;
}

.cursor-pointer {
  cursor: pointer;
}
.background-overlay {
  filter: brightness(0.8);
}
</style>
