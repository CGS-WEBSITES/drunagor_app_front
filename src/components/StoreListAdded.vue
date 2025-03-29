<template>
  <v-container max-width="776" class="pa-4">
    <v-card rounded="lg" elevation="6" class="pa-4">
      <!-- Seleção de Abas -->
      <v-col cols="12" class="d-flex justify-center pa-0">
        <v-tabs v-model="activeTab" class="mb-4">
          <v-tab :value="'friends'" class="text-h5 text-bold">Friends</v-tab>
          <v-tab :value="'requests'" class="text-h5 text-bold">Requests</v-tab>
        </v-tabs>
      </v-col>

      <!-- Barra de Busca -->
      <v-text-field
        v-model="searchQuery"
        label="Search"
        variant="solo-filled"
        class="pb-0"
      ></v-text-field>

      <!-- Lista Virtual -->
      <v-virtual-scroll :items="filteredList" :item-height="100">
        <template #default="{ item }">
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-card
                class="pa-1 mb-3 cursor-pointer"
                rounded="lg"
                elevation="10"
                v-bind="props"
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
                  <!-- Imagem -->
                  <v-col
                    cols="4"
                    lg="2"
                    class="d-flex align-center justify-center"
                  >
                    <v-img
                      :src="item.image"
                      alt="User Image"
                      max-width="90"
                      max-height="90"
                      class="rounded-lg"
                    ></v-img>
                  </v-col>

                  <!-- Informações -->
                  <v-col cols="6">
                    <p class="font-weight-bold text-truncate">
                      {{ item.user_name }}
                    </p>
                  </v-col>

                  <!-- Botões de Aceitar/Recusar Amizade -->
                  <v-col
                    v-if="!item.accepted"
                    cols="2"
                    md="4"
                    class="d-flex justify-end align-center"
                  >
                    <v-btn
                      class="ma-2"
                      color="green"
                      @click.stop="acceptFriend(item.friends_pk)"
                      >ACCEPT</v-btn
                    >
                    <v-btn
                      class="ma-2"
                      color="red"
                      @click.stop="declineFriend(item.friends_pk)"
                      >DECLINE</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card>
            </template>
          </v-menu>
        </template>
      </v-virtual-scroll>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";



const axios = inject("axios");
const apiUrl = inject("apiUrl") || "https://api.drunagor.app/test/system";
const userStore = useUserStore();
const userId = userStore.user.users_pk;
const router = useRouter();

// **Estados**
const activeTab = ref("friends");
const searchQuery = ref("");
const friends = ref([]);
const requests = ref([]);

const navigateToUser = (userId) => {
  try {
    if (!userId) throw new Error("ID do usuário não encontrado!");
    
    const encodedId = btoa(userId.toString());
    console.log("Navegando para ID codificado:", encodedId);

    router.push({ name: "User", params: { id: encodedId } });
  } catch (error) {
    console.error("Erro ao navegar:", error.message);
  }
};

const fetchFriends = async () => {
  try {
    const userStore = useUserStore();
    const userId = userStore.user?.users_pk; // Obtém o ID do usuário logado

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

    console.log("🔍 Dados dos amigos recebidos:", friendData);

    // Processa os amigos e define `friends_id` corretamente
    friends.value = friendData.map((friend) => ({
      friends_pk: friend.friends_pk,
      user_name: friend.user_name,
      friends_id:
        friend.invite_users_fk === userId
          ? friend.recipient_users_fk // Se o usuário logado foi quem enviou o pedido, pega o recebedor
          : friend.invite_users_fk, // Caso contrário, pega quem enviou
      image: friend.picture_hash
        ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${friend.picture_hash}`
        : `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/user.png`,
      background_hash: friend.background_hash,
      accepted: true,
    }));
  } catch (error) {
    console.error("❌ Erro ao buscar amigos:", error.response?.data || error.message);
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
  } catch (error) {}
};

const acceptFriend = async (friends_pk) => {
  if (!friends_pk) {
    console.error(
      "❌ Erro: O ID do pedido de amizade (friends_pk) não foi fornecido."
    );
    return;
  }

  try {
    // Fazendo o PUT na API para aceitar a amizade
    await axios.put(
      `${apiUrl}/friends/accept/${friends_pk}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    // 🔄 Atualiza a lista após aceitar
    await fetchFriends();
    await fetchRequests();
  } catch (error) {
    console.error(
      "❌ Erro ao aceitar amizade:",
      error.response?.data || error.message
    );
  }
};

// **Recusar amizade após buscar friends_pk**
const declineFriend = async (recipientId) => {
  try {
    // 1️⃣ Busca o `friends_pk` com base no recipient_users_fk
    const response = await axios.get(`${apiUrl}/friends/list`, {
      params: { invite_users_fk: userId, accepted: false },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const request = response.data.friends.find(
      (friend) => friend.invite_users_fk === recipientId
    );

    if (!request) {
      console.error(
        "❌ Nenhuma solicitação de amizade encontrada para este usuário."
      );
      return;
    }

    const friends_pk = request.friends_pk; // Obtém o ID do pedido

    // 2️⃣ Recusa a amizade passando o `friends_pk`
    await axios.delete(`${apiUrl}/friends/${friends_pk}/delete`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    // 🔄 Atualiza a lista após recusar
    await fetchRequests();
  } catch (error) {
    console.error(
      "❌ Erro ao recusar amizade:",
      error.response?.data || error.message
    );
  }
};

// **Lista filtrada**
const filteredList = computed(() => {
  const list = activeTab.value === "friends" ? friends.value : requests.value;
  if (!searchQuery.value) return list;
  return list.filter((item) =>
    item.user_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

watch(activeTab, (newTab) => {
  if (newTab === "friends") {
    fetchFriends();
  } else if (newTab === "requests") {
    fetchRequests();
  }
});

onMounted(fetchRequests);
onMounted(fetchFriends);
</script>
