<template>
  <v-container max-width="850" class="pa-4 pt-0 mt-0 social-wrapper">
    
    <v-row justify="center" class="ma-0">
      <v-col cols="12" class="pa-0 pt-2">
        <h1 class="text-h4 font-weight-bold mb-4 text-center text-white">Social Hub</h1>
      </v-col>
    </v-row>

    <v-card color="transparent" flat>
      <v-tabs
        v-model="mainTab"
        grow
        bg-color="secondary"
        rounded="lg"
        class="mb-6 elevation-4"
        indicator-color="white"
      >
        <v-tab value="network">
          <v-icon start>mdi-account-group</v-icon>
          My Network
          <v-badge v-if="requests.length > 0" color="red" dot offset-x="-10" offset-y="-10"></v-badge>
        </v-tab>
        <v-tab value="search">
          <v-icon start>mdi-magnify</v-icon>
          Find Players
        </v-tab>
      </v-tabs>

      <v-window v-model="mainTab" class="overflow-visible">
        
        <v-window-item value="network">
          <v-card color="primary" rounded="lg" elevation="6" class="pa-4 fixed-main-card">
            <v-tabs v-model="activeTab" class="mb-4 overflow-visible-tabs" centered>
              <v-tab value="friends" class="text-h6">Friends</v-tab>
              <v-badge
                :model-value="requests.length > 0"
                color="red"
                :content="requests.length"
                location="top end"
                offset-x="8"
                offset-y="8"
              >
                <v-tab value="requests" class="text-h6">Requests</v-tab>
              </v-badge>
            </v-tabs>

            <div class="search-bar-center mb-4">
              <v-text-field
                v-model="friendSearchQuery"
                placeholder="Filter list..."
                variant="solo-filled"
                prepend-inner-icon="mdi-filter"
                hide-details
                density="compact"
                class="max-width-search"
              ></v-text-field>
            </div>

            <div class="scroll-area">
              <v-virtual-scroll 
                :items="filteredFriendsList" 
                height="100%"
                item-height="110" 
                class="rounded-lg"
              >
                <template #default="{ item }">
                  <v-card class="pa-1 mb-3 cursor-pointer position-relative" rounded="lg" elevation="10" @click="navigateToUser(item.friends_id)">
                    <div class="background-overlay" :style="getBackgroundStyle(item.background_hash)"></div>
                    <v-row align="center" class="ma-0 fill-height position-relative" style="z-index: 1">
                      <v-col cols="3" sm="2" class="d-flex justify-center">
                        <v-avatar size="60" rounded="lg" class="elevation-4 bg-black-alpha">
                          <v-img :src="item.image"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col cols="5" sm="6">
                        <div class="text-subtitle-1 font-weight-bold text-truncate text-white">{{ item.user_name }}</div>
                      </v-col>
                      <v-col cols="4" class="d-flex justify-end pr-2" v-if="!item.accepted">
                        <v-btn icon="mdi-check" color="green" size="x-small" class="mr-1" @click.stop="acceptFriend(item)"></v-btn>
                        <v-btn icon="mdi-close" color="red" size="x-small" @click.stop="declineFriend(item.friends_pk)"></v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </template>
              </v-virtual-scroll>
              
              <div v-if="filteredFriendsList.length === 0" class="d-flex justify-center align-center h-100 opacity-50">
                <p>No players found here.</p>
              </div>
            </div>
          </v-card>
        </v-window-item>

        <v-window-item value="search">
          <v-card color="primary" rounded="lg" elevation="6" class="pa-4 fixed-main-card">
            
            <div class="tabs-placeholder mb-4"></div>

            <div class="search-bar-center mb-4">
              <v-text-field
                v-model="globalSearchQuery"
                placeholder="Search players..."
                variant="solo-filled"
                append-inner-icon="mdi-magnify"
                @input="fetchUsers"
                hide-details
                density="compact"
                class="max-width-search"
              ></v-text-field>
            </div>

            <div class="scroll-area">
              <div class="results-wrapper">
                <v-card 
                  v-for="user in filteredGlobalUsers" 
                  :key="user.users_pk" 
                  class="pa-1 mb-3 cursor-pointer position-relative" 
                  rounded="lg" 
                  elevation="10" 
                  @click="navigateToUser(user.users_pk)"
                >
                  <div class="background-overlay" :style="getBackgroundStyle(user.background_hash)"></div>
                  <v-row align="center" class="ma-0 fill-height position-relative" style="z-index: 1">
                    <v-col cols="3" sm="2" class="d-flex justify-center pl-4">
                      <v-avatar size="60" rounded="lg" class="elevation-4 bg-black-alpha">
                        <v-img :src="user.picture_hash"></v-img>
                      </v-avatar>
                    </v-col>
                    <v-col cols="9">
                      <div class="text-subtitle-1 font-weight-bold text-white">{{ user.user_name }}</div>
                      <div class="text-caption text-grey-lighten-1">Joined: {{ user.join_date }}</div>
                    </v-col>
                  </v-row>
                </v-card>

                <v-alert v-if="globalSearchQuery && filteredGlobalUsers.length === 0" type="info" variant="tonal">
                  No players found.
                </v-alert>
              </div>
            </div>
          </v-card>
        </v-window-item>

      </v-window>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, inject } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";

const axios = inject("axios");
const apiUrl = inject("apiUrl");
const userStore = useUserStore();
const router = useRouter();
const userId = userStore.user?.users_pk;

const mainTab = ref("network");
const activeTab = ref("friends");
const processingRequest = ref(null);
let pollingInterval = null;

const friends = ref([]);
const requests = ref([]);
const users = ref([]);
const friendSearchQuery = ref("");
const globalSearchQuery = ref("");

const filteredFriendsList = computed(() => {
  const list = activeTab.value === "friends" ? friends.value : requests.value;
  if (!friendSearchQuery.value) return list;
  return list.filter((item) => item.user_name.toLowerCase().includes(friendSearchQuery.value.toLowerCase()));
});

const filteredGlobalUsers = computed(() => {
  if (!globalSearchQuery.value) return users.value;
  return users.value.filter((user) => user.user_name.toLowerCase().startsWith(globalSearchQuery.value.toLowerCase()));
});

const getBackgroundStyle = (hash) => ({
  backgroundImage: hash ? `url(https://assets.drunagor.app/Profile/${hash})` : 'url(https://assets.drunagor.app/Profile/profile-bg-warriors-transparent.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
  borderRadius: '8px', zIndex: 0, filter: 'brightness(0.4)'
});

const navigateToUser = (id) => {
  if (!id) return;
  const encodedId = btoa(id.toString());
  router.push({ name: "User", params: { id: encodedId } });
};

const fetchFriendsData = async () => {
  if (!userId) return;
  try {
    const [friendsRes, requestsRes] = await Promise.all([
      axios.get(`${apiUrl}/friends/list_friends`, { params: { invite_users_fk: userId, accepted: true } }),
      axios.get(`${apiUrl}/friends/list_requests`, { params: { recipient_users_fk: userId, accepted: false, active: true } })
    ]);
    friends.value = (friendsRes.data.friends || []).map(f => ({
      ...f,
      friends_id: f.invite_users_fk === userId ? f.recipient_users_fk : f.invite_users_fk,
      image: f.picture_hash ? `https://assets.drunagor.app/Profile/${f.picture_hash}` : `https://assets.drunagor.app/Profile/user.png`,
      accepted: true
    }));
    requests.value = (requestsRes.data.friends || []).map(r => ({
      ...r,
      friends_id: r.invite_users_fk,
      image: r.picture_hash ? `https://assets.drunagor.app/Profile/${r.picture_hash}` : `https://assets.drunagor.app/Profile/user.png`,
      accepted: false
    }));
  } catch (e) { console.error(e); }
};

const fetchUsers = async () => {
  if (!globalSearchQuery.value) { users.value = []; return; }
  try {
    const response = await axios.get(`${apiUrl}/users/search`, { params: { user_name: globalSearchQuery.value } });
    users.value = (response.data.users || []).map(u => ({
      ...u,
      picture_hash: u.picture_hash ? `https://assets.drunagor.app/Profile/${u.picture_hash}` : "https://assets.drunagor.app/Profile/user.png"
    }));
  } catch (e) { users.value = []; }
};

const acceptFriend = async (item) => {
  processingRequest.value = item.friends_pk;
  try { await axios.put(`${apiUrl}/friends/accept/${item.friends_pk}`); await fetchFriendsData(); }
  finally { processingRequest.value = null; }
};

const declineFriend = async (pk) => {
  processingRequest.value = pk;
  try { await axios.delete(`${apiUrl}/friends/${pk}/delete`); await fetchFriendsData(); }
  finally { processingRequest.value = null; }
};

onMounted(() => {
  fetchFriendsData();
  pollingInterval = setInterval(() => { if (mainTab.value === 'network') fetchFriendsData(); }, 8000);
});

onBeforeUnmount(() => { if (pollingInterval) clearInterval(pollingInterval); });
watch(mainTab, (val) => { if (val === 'network') fetchFriendsData(); });
</script>

<style scoped>
.social-wrapper {
  align-self: flex-start !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
}

/* O CARD PRINCIPAL AGORA TEM ALTURA FIXA BASEADA NA TELA */
.fixed-main-card {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 220px) !important; /* Trava a altura do card */
  min-height: 500px;
}

/* ÁREA DE SCROLL: Ocupa todo o resto do card */
.scroll-area {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 4px; /* Espaço para a scrollbar não colar no card */
}

/* Garante que o scrollbar fique bonitinho */
.scroll-area::-webkit-scrollbar {
  width: 6px;
}
.scroll-area::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* Placeholder para compensar a falta das abas na aba de busca */
.tabs-placeholder {
  height: 48px; /* Mesma altura de um v-tabs */
}

.search-bar-center {
  width: 100%;
  display: flex;
  justify-content: center;
}

.max-width-search {
  max-width: 340px;
}

.background-overlay {
  z-index: 0;
  transition: filter 0.3s;
}

.cursor-pointer:hover .background-overlay {
  filter: brightness(0.6) !important;
}

.bg-black-alpha {
  background-color: rgba(0,0,0,0.5) !important;
}

.overflow-visible-tabs :deep(.v-slide-group__container) {
  overflow: visible !important;
}

.results-wrapper {
  width: 100%;
}
</style>