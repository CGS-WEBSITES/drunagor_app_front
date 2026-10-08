<template>
  <div class="friends">
    <nav class="friends__views">
      <button
        v-for="item in views"
        :key="item.value"
        class="friends__view"
        :class="{ active: view === item.value }"
        @click="view = item.value"
      >
        <v-icon size="20">{{ item.icon }}</v-icon>
        <span>{{ item.label }}</span>
        <span
          v-if="item.count"
          class="friends__count"
          :class="{ 'friends__count--alert': item.highlight }"
        >{{ item.count }}</span>
      </button>
    </nav>

    <v-text-field
      v-model="searchQuery"
      :placeholder="view === 'search' ? 'Search players by name...' : 'Filter by name...'"
      prepend-inner-icon="mdi-magnify"
      :loading="view === 'search' && searching"
      variant="solo-filled"
      density="comfortable"
      flat
      hide-details
      clearable
      class="friends__search"
    />

    <!-- Friends and requests -->
    <template v-if="view !== 'search'">
      <div v-if="filteredFriendsList.length" class="friends__list">
        <div
          v-for="item in filteredFriendsList"
          :key="item.friends_pk"
          class="friend-row"
          role="button"
          tabindex="0"
          @click="navigateToUser(item.friends_id)"
          @keydown.enter="navigateToUser(item.friends_id)"
        >
          <div class="friend-row__bg" :style="getBackgroundStyle(item.background_hash)"></div>
          <v-avatar size="48" rounded="lg" class="friend-row__avatar">
            <v-img :src="item.image" cover />
          </v-avatar>
          <div class="friend-row__info">
            <strong class="text-truncate">{{ item.user_name }}</strong>
            <span>{{ item.accepted ? "Friend" : "Wants to be your friend" }}</span>
          </div>
          <div v-if="!item.accepted" class="friend-row__actions">
            <v-btn
              size="small"
              color="success"
              variant="flat"
              :loading="processingRequest === item.friends_pk"
              @click.stop="acceptFriend(item)"
            >
              Accept
            </v-btn>
            <v-btn
              size="small"
              variant="text"
              :disabled="processingRequest === item.friends_pk"
              @click.stop="declineFriend(item.friends_pk)"
            >
              Decline
            </v-btn>
          </div>
          <v-icon v-else class="friend-row__chevron">mdi-chevron-right</v-icon>
        </div>
      </div>

      <div v-else class="friends__empty">
        <v-icon size="44">{{ view === "friends" ? "mdi-account-group-outline" : "mdi-account-clock-outline" }}</v-icon>
        <p v-if="friendSearchQuery">No one matches "{{ friendSearchQuery }}".</p>
        <template v-else-if="view === 'friends'">
          <p>You have no friends here yet.</p>
          <v-btn color="secondary" variant="flat" prepend-icon="mdi-account-search" @click="view = 'search'">
            Find players
          </v-btn>
        </template>
        <p v-else>No pending friend requests.</p>
      </div>
    </template>

    <!-- Player search -->
    <template v-else>
      <div v-if="filteredGlobalUsers.length" class="friends__list">
        <div
          v-for="user in filteredGlobalUsers"
          :key="user.users_pk"
          class="friend-row"
          role="button"
          tabindex="0"
          @click="navigateToUser(user.users_pk)"
          @keydown.enter="navigateToUser(user.users_pk)"
        >
          <div class="friend-row__bg" :style="getBackgroundStyle(user.background_hash)"></div>
          <v-avatar size="48" rounded="lg" class="friend-row__avatar">
            <v-img :src="user.picture_hash" cover />
          </v-avatar>
          <div class="friend-row__info">
            <strong class="text-truncate">{{ user.user_name }}</strong>
            <span>Joined {{ user.join_date }}</span>
          </div>
          <v-icon class="friend-row__chevron">mdi-chevron-right</v-icon>
        </div>
      </div>

      <div v-else class="friends__empty">
        <v-icon size="44">mdi-account-search-outline</v-icon>
        <p v-if="!globalSearchQuery">Type a name to find other players.</p>
        <p v-else-if="!searching">No players found for "{{ globalSearchQuery }}".</p>
      </div>
    </template>
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

// One view at a time: the friends list, pending requests or player search.
const view = ref("friends");
const processingRequest = ref(null);
let pollingInterval = null;

const friends = ref([]);
const requests = ref([]);
const users = ref([]);
const friendSearchQuery = ref("");
const globalSearchQuery = ref("");

const views = computed(() => [
  { value: "friends", label: "Friends", icon: "mdi-account-group", count: friends.value.length },
  { value: "requests", label: "Requests", icon: "mdi-account-clock", count: requests.value.length, highlight: true },
  { value: "search", label: "Find players", icon: "mdi-account-search" },
]);

// The search box filters friends, or searches all players in Find players.
const searchQuery = computed({
  get: () => (view.value === "search" ? globalSearchQuery.value : friendSearchQuery.value),
  set: (value) => {
    if (view.value === "search") globalSearchQuery.value = value ?? "";
    else friendSearchQuery.value = value ?? "";
  },
});

const filteredFriendsList = computed(() => {
  const list = view.value === "friends" ? friends.value : requests.value;
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
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0
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

const searching = ref(false);
let searchTimer = null;

const fetchUsers = async () => {
  if (!globalSearchQuery.value) { users.value = []; return; }
  searching.value = true;
  try {
    const response = await axios.get(`${apiUrl}/users/search`, { params: { user_name: globalSearchQuery.value } });
    users.value = (response.data.users || []).map(u => ({
      ...u,
      picture_hash: u.picture_hash ? `https://assets.drunagor.app/Profile/${u.picture_hash}` : "https://assets.drunagor.app/Profile/user.png"
    }));
  } catch (e) { users.value = []; }
  finally { searching.value = false; }
};

// Search players once typing pauses.
watch(globalSearchQuery, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(fetchUsers, 300);
});

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
  pollingInterval = setInterval(() => { if (view.value !== "search") fetchFriendsData(); }, 8000);
});

onBeforeUnmount(() => {
  if (pollingInterval) clearInterval(pollingInterval);
  clearTimeout(searchTimer);
});
watch(view, (val) => { if (val !== "search") fetchFriendsData(); });
</script>

<style scoped>
.friends {
  max-width: 800px;
  margin: 0 auto 32px;
  padding: 16px;
  background: rgb(var(--v-theme-primary));
  border-radius: 12px;
  font-family: "Poppins", sans-serif;
}
.friends__views {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  padding: 4px;
  background: rgba(var(--v-theme-background), 0.5);
  border-radius: 10px;
}
.friends__view {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 6px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  opacity: 0.7;
  transition: background 0.2s ease, opacity 0.2s ease;
}
.friends__view.active {
  background: rgb(var(--v-theme-secondary));
  opacity: 1;
}
.friends__count {
  min-width: 20px;
  padding: 0 6px;
  background: rgba(var(--v-theme-on-surface), 0.15);
  border-radius: 999px;
  font-size: 0.7rem;
  line-height: 20px;
}
.friends__count--alert {
  background: rgb(var(--v-theme-error));
  color: rgb(var(--v-theme-on-error));
}
.friends__search {
  margin-bottom: 12px;
}
.friends__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  max-height: 60vh;
  overflow-y: auto;
}
.friend-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 72px;
  padding: 12px;
  overflow: hidden;
  background: rgba(var(--v-theme-background), 0.6);
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.friend-row:hover {
  transform: translateY(-2px);
}
.friend-row__bg {
  opacity: 0.35;
  transition: opacity 0.2s ease;
}
.friend-row:hover .friend-row__bg {
  opacity: 0.55;
}
.friend-row__avatar,
.friend-row__info,
.friend-row__actions,
.friend-row__chevron {
  position: relative;
}
.friend-row__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.friend-row__info span {
  font-size: 0.75rem;
  opacity: 0.75;
}
.friend-row__actions {
  display: flex;
  gap: 4px;
}
.friends__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 16px;
  text-align: center;
  opacity: 0.85;
}
.friends__empty p {
  margin: 0;
}
@media (max-width: 599px) {
  .friends {
    margin: 0 12px 24px;
    padding: 12px;
  }
  .friends__view {
    flex-direction: column;
    gap: 2px;
    font-size: 0.7rem;
  }
  .friends__list {
    grid-template-columns: 1fr;
  }
  .friend-row {
    flex-wrap: wrap;
  }
  .friend-row__actions {
    justify-content: flex-end;
    width: 100%;
  }
}
</style>
