<template>
  <v-container max-width="776" class="pa-4">
    <!-- Caixa por trás -->
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
                class="pa-1 mb-3"
                rounded="lg"
                elevation="10"
                v-bind="props"
                @click="setSelectedItem(item)"
              >
                <v-row>
                  <!-- Imagem -->
                  <v-col cols="4" lg="2" class="d-flex align-center justify-center">
                    <v-img
                      :src="item.image"
                      alt="Item Image"
                      max-width="90"
                      max-height="90"
                      class="rounded-lg"
                    ></v-img>
                  </v-col>

                  <!-- Informações -->
                  <v-col cols="6">
                    <p class="font-weight-bold text-truncate">{{ item.name }}</p>
                    <p class="text-body-2 grey--text">{{ item.details }}</p>
                  </v-col>
                  <v-btn v-if="item.friend === false" class="ma-2 mt-6" color="green"> ACCEPT </v-btn>
                  <v-btn v-if="item.friend === false" class="ma-2 mt-6" color="red"> DECLINE </v-btn>

                  <!-- Botões de Aceitar/Recusar Amizade -->
                  <v-col v-if="!item.accepted" cols="2" md="4" class="d-flex justify-end align-center">
                    <v-btn class="ma-2" color="green" @click.stop="acceptFriend(item.friends_pk)">ACCEPT</v-btn>
                    <v-btn class="ma-2" color="red" @click.stop="declineFriend(item.friend_pk)">DECLINE</v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </template>

            <!-- Conteúdo do menu -->
            <!-- <v-card class="pa-4">
              <p class="text-h6 text-bold mb-2">{{ selectedItem?.name }}</p>
              <p class="text-body-2">{{ selectedItem?.details }}</p>
              <p class="text-body-2">Points: {{ selectedItem?.points }}</p>
              <v-btn text color="primary" class="mt-2" @click="closeMenu">
                Fechar
              </v-btn>
            </v-card> -->
          </v-menu>
        </template>
      </v-virtual-scroll>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

// Dados simulados
const friends = ref([
  {
    image: 'https://druna-assets.s3.us-east-2.amazonaws.com/CampaignTracker/hero-lorien-mage.png',
    name: 'Lorien',
    details: 'Generic Information',
    points: '946338°',
    friend: true
  },
  {
    image: 'https://druna-assets.s3.us-east-2.amazonaws.com/CampaignTracker/hero-vorn-warrior.png',
    name: 'Vorn Store',
    details: 'Generic Location, USA 00000-0000',
    points: '946338°',
    friend: true,
  },
]);

const requests = ref([
  {
    image: 'https://druna-assets.s3.us-east-2.amazonaws.com/CampaignTracker/hero-flavian-bard.png',
    name: 'Flavian Store',
    details: 'Pending Approval',
    points: '--',
    friend: false,
  },
  {
    image: 'https://druna-assets.s3.us-east-2.amazonaws.com/CampaignTracker/hero-katarina-barbarian.png',
    name: 'Katarina',
    details: 'Pending Approval',
    points: '--',
   friend: false,    
  },
]);

// Abas ativas
const activeTab = ref('friends');

// Campo de busca
const searchQuery = ref('');

    const friendData = response.data.friends;

    // Filtra amigos aceitos e pedidos pendentes
    friends.value = friendData
      .filter((friend) => friend.accepted === true)
      .map((friend) => ({
        friends_pk: friend.friends_pk,
        user_name: friend.user_name,
        image: friend.picture_hash
  ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${friend.picture_hash}`
  : `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/user.png`, 
        accepted: true,
      }));

  } catch (error) {
    console.error("Erro ao buscar amigos:", error);
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
      image: friend.picture_hash
        ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${friend.picture_hash}`
        : `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/user.png`,
      accepted: false,
    }));

  } catch (error) {
  }
};




const acceptFriend = async (friends_pk) => {
  if (!friends_pk) {
    console.error("❌ Erro: O ID do pedido de amizade (friends_pk) não foi fornecido.");
    return;
  }

  try {


    // Fazendo o PUT na API para aceitar a amizade
    await axios.put(
      `${apiUrl}/friends/accept/${friends_pk}`, 
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
    );



    // 🔄 Atualiza a lista após aceitar
    await fetchFriends();
    await fetchRequests();
  } catch (error) {
    console.error("❌ Erro ao aceitar amizade:", error.response?.data || error.message);
  }
};

// **Recusar amizade após buscar friends_pk**
const declineFriend = async (recipientId) => {
  try {
;

    // 1️⃣ Busca o `friends_pk` com base no recipient_users_fk
    const response = await axios.get(`${apiUrl}/friends/list`, {
      params: { invite_users_fk: userId, accepted: false   },
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });

    const request = response.data.friends.find((friend) => friend.invite_users_fk === recipientId);

    if (!request) {
      console.error("❌ Nenhuma solicitação de amizade encontrada para este usuário.");
      return;
    }

    const friends_pk = request.friends_pk; // Obtém o ID do pedido



    // 2️⃣ Recusa a amizade passando o `friends_pk`
    await axios.delete(`${apiUrl}/friends/${friends_pk}/delete`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });


    
    // 🔄 Atualiza a lista após recusar
    await fetchRequests();
  } catch (error) {
    console.error("❌ Erro ao recusar amizade:", error.response?.data || error.message);
  }
};

// **Lista filtrada**
const filteredList = computed(() => {
  const list = activeTab.value === 'friends' ? friends.value : requests.value;
  if (!searchQuery.value) return list;
  return list.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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

// Define o item selecionado
const setSelectedItem = (item) => {
  selectedItem.value = item;
};

// Fecha o menu (limpa a seleção)
const closeMenu = () => {
  selectedItem.value = null;
};
</script>
