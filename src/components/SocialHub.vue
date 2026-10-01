<template>
  <div class="social">
    <!-- Friends · Requests · Find players -->
    <div class="social-seg">
      <button v-for="tab in tabs" :key="tab.value" :class="{ active: view === tab.value }" @click="view = tab.value">
        <v-icon size="18">{{ tab.icon }}</v-icon>
        <span>{{ tab.label }}</span>
        <span v-if="tab.count" class="social-seg__count" :class="{ 'social-seg__count--alert': tab.value === 'requests' }">{{ tab.count }}</span>
      </button>
    </div>

    <v-text-field
      v-if="view === 'search'"
      v-model="globalSearchQuery"
      placeholder="Search players by name"
      variant="solo-filled"
      prepend-inner-icon="mdi-magnify"
      clearable
      hide-details
      density="comfortable"
      class="social__search"
      autofocus
      @update:model-value="searchSoon"
    />
    <v-text-field
      v-else-if="currentList.length > 6 || friendSearchQuery"
      v-model="friendSearchQuery"
      placeholder="Filter"
      variant="solo-filled"
      prepend-inner-icon="mdi-filter-variant"
      clearable
      hide-details
      density="comfortable"
      class="social__search"
    />

    <!-- Friends and requests -->
    <div v-if="view !== 'search'" class="social-list">
      <div
        v-for="item in filteredFriendsList"
        :key="item.friends_pk"
        class="person"
        role="button"
        tabindex="0"
        @click="navigateToUser(item.friends_id)"
        @keydown.enter="navigateToUser(item.friends_id)"
      >
        <div class="person__bg" :style="getBackgroundStyle(item.background_hash)"></div>
        <v-avatar size="48" rounded="lg" class="person__avatar">
          <v-img :src="item.image" />
        </v-avatar>
        <div class="person__text">
          <strong>{{ item.user_name }}</strong>
          <small v-if="!item.accepted">Wants to be your friend</small>
        </div>
        <template v-if="!item.accepted">
          <v-btn
            size="small"
            color="green"
            variant="flat"
            :loading="processingRequest === item.friends_pk"
            @click.stop="acceptFriend(item)"
          >
            Accept
          </v-btn>
          <v-btn size="small" icon="mdi-close" variant="text" title="Decline" @click.stop="declineFriend(item.friends_pk)" />
        </template>
        <v-icon v-else class="person__go">mdi-chevron-right</v-icon>
      </div>

      <div v-if="!loaded" class="social-empty"><v-progress-circular indeterminate /></div>
      <div v-else-if="!filteredFriendsList.length" class="social-empty">
        <v-icon size="44">{{ view === "friends" ? "mdi-account-multiple-outline" : "mdi-email-open-outline" }}</v-icon>
        <p v-if="friendSearchQuery">Nobody here matches "{{ friendSearchQuery }}".</p>
        <p v-else-if="view === 'friends'">No friends yet. Find the people you play with.</p>
        <p v-else>No pending requests.</p>
        <v-btn v-if="!friendSearchQuery" color="accent" variant="flat" prepend-icon="mdi-account-search" @click="view = 'search'">
          Find players
        </v-btn>
      </div>
    </div>

    <!-- Find players -->
    <div v-else class="social-list">
      <div
        v-for="user in filteredGlobalUsers"
        :key="user.users_pk"
        class="person"
        role="button"
        tabindex="0"
        @click="navigateToUser(user.users_pk)"
        @keydown.enter="navigateToUser(user.users_pk)"
      >
        <div class="person__bg" :style="getBackgroundStyle(user.background_hash)"></div>
        <v-avatar size="48" rounded="lg" class="person__avatar">
          <v-img :src="user.picture_hash" />
        </v-avatar>
        <div class="person__text">
          <strong>{{ user.user_name }}</strong>
          <small v-if="user.join_date">Joined {{ user.join_date }}</small>
        </div>
        <v-chip v-if="friendIds.has(user.users_pk)" size="small" color="green" variant="tonal">Friend</v-chip>
        <v-icon class="person__go">mdi-chevron-right</v-icon>
      </div>

      <div v-if="!globalSearchQuery" class="social-empty">
        <v-icon size="44">mdi-account-search-outline</v-icon>
        <p>Type a name to find players, then open their profile to add them.</p>
      </div>
      <div v-else-if="!filteredGlobalUsers.length" class="social-empty">
        <p>No players found.</p>
      </div>
    </div>
  </div>
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

// friends | requests | search
const view = ref("friends");
const loaded = ref(false);
const processingRequest = ref(null);
let pollingInterval = null;

const friends = ref([]);
const requests = ref([]);
const users = ref([]);
const friendSearchQuery = ref("");
const globalSearchQuery = ref("");

const tabs = computed(() => [
  { value: "friends", label: "Friends", icon: "mdi-account-multiple", count: friends.value.length },
  { value: "requests", label: "Requests", icon: "mdi-account-clock", count: requests.value.length },
  { value: "search", label: "Find", icon: "mdi-account-search", count: 0 },
]);
const currentList = computed(() => (view.value === "requests" ? requests.value : friends.value));
const friendIds = computed(() => new Set(friends.value.map((friend) => friend.friends_id)));

const filteredFriendsList = computed(() => {
  const query = (friendSearchQuery.value || "").toLowerCase();
  if (!query) return currentList.value;
  return currentList.value.filter((item) => item.user_name.toLowerCase().includes(query));
});

const filteredGlobalUsers = computed(() => {
  if (!globalSearchQuery.value) return [];
  return users.value.filter((user) => user.user_name.toLowerCase().includes(globalSearchQuery.value.toLowerCase()));
});

const getBackgroundStyle = (hash) => ({
  backgroundImage: hash ? `url(https://assets.drunagor.app/Profile/${hash})` : 'url(https://assets.drunagor.app/Profile/profile-bg-warriors-transparent.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
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
  finally { loaded.value = true; }
};

// Search once the typing pauses.
let searchTimer = null;
const searchSoon = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(fetchUsers, 300);
};

const fetchUsers = async () => {
  if (!globalSearchQuery.value) { users.value = []; return; }
  const query = globalSearchQuery.value;
  try {
    const response = await axios.get(`${apiUrl}/users/search`, { params: { user_name: globalSearchQuery.value } });
    if (query !== globalSearchQuery.value) return;
    users.value = (response.data.users || []).map(u => ({
      ...u,
      picture_hash: u.picture_hash ? `https://assets.drunagor.app/Profile/${u.picture_hash}` : "https://assets.drunagor.app/Profile/user.png"
    }));
  } catch (e) { users.value = []; }
};

const acceptFriend = async (item) => {
  processingRequest.value = item.friends_pk;
  try {
    await axios.put(`${apiUrl}/friends/accept/${item.friends_pk}`);
    await fetchFriendsData();
    if (userId) {
      try {
        await axios.post(`${apiUrl}/rl_users_rewards/cadastro`, { users_fk: userId, rewards_fk: 10 });
      } catch (e) {}
    }
  }
  finally { processingRequest.value = null; }
};

const declineFriend = async (pk) => {
  processingRequest.value = pk;
  try { await axios.delete(`${apiUrl}/friends/${pk}/delete`); await fetchFriendsData(); }
  finally { processingRequest.value = null; }
};

onMounted(() => {
  fetchFriendsData();
  pollingInterval = setInterval(() => { if (view.value !== 'search') fetchFriendsData(); }, 8000);
});

onBeforeUnmount(() => { if (pollingInterval) clearInterval(pollingInterval); clearTimeout(searchTimer); });
watch(view, (val) => { friendSearchQuery.value = ""; if (val !== 'search') fetchFriendsData(); });
</script>

<style scoped>
.social {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 16px 16px 32px;
  font-family: "Poppins", sans-serif;
}
/* Pill tabs, like the heroes filters. */
.social-seg {
  display: flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 14px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
}
.social-seg button {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 42px;
  padding: 0 8px;
  border-radius: 9px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0.65;
  transition: background 0.2s ease, opacity 0.2s ease;
}
.social-seg button.active {
  background: rgb(var(--v-theme-terciary));
  color: rgb(var(--v-theme-on-terciary));
  opacity: 1;
}
.social-seg__count {
  min-width: 20px;
  padding: 1px 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  font-size: 0.7rem;
  text-align: center;
}
.social-seg__count--alert {
  background: #e05353;
  color: #fff;
}
.social__search {
  margin-bottom: 12px;
}
.social-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
/* A person: their profile background, faded, behind avatar and name. */
.person {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 68px;
  padding: 10px 8px 10px 10px;
  overflow: hidden;
  background: rgb(var(--v-theme-primary));
  border-radius: 12px;
  cursor: pointer;
}
.person > :not(.person__bg) {
  position: relative;
}
.person__bg {
  position: absolute;
  inset: 0;
  opacity: 0.25;
  transition: opacity 0.2s ease;
}
.person:hover .person__bg {
  opacity: 0.4;
}
.person__avatar {
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.5);
}
.person__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.person__text strong {
  overflow: hidden;
  font-size: 0.95rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.person__text small {
  font-size: 0.72rem;
  opacity: 0.65;
}
.person__go {
  opacity: 0.5;
}
.social-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 16px;
  text-align: center;
  opacity: 0.8;
}
.social-empty p {
  margin: 0;
  font-size: 0.9rem;
}
/* Phones: icon over label, the count as a corner badge. */
@media (max-width: 420px) {
  .social-seg button {
    flex-direction: column;
    gap: 2px;
    min-height: 52px;
    font-size: 0.68rem;
  }
  .social-seg__count {
    position: absolute;
    top: 4px;
    right: 8px;
  }
}
</style>
