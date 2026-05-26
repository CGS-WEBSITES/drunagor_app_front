<template>
  <div class="w-100">
    <!-- OWNED SECTION -->
    <v-container max-width="800" class="pa-4">
      <v-card rounded="lg" elevation="3" color="primary" class="pl-1 pt-1 pr-1 pb-0">
        <v-card-title class="d-flex justify-space-between pb-0 px-3">
          <span class="text-uppercase font-weight-black text-bold text-h5 mb-2 pb-0 text-white">
            {{ isOwner ? 'MY LIBRARY' : `${userName}'S LIBRARY` }}
          </span>
        </v-card-title>

        <div v-if="loading" class="d-flex justify-center pa-8">
          <v-progress-circular indeterminate color="#0E7576"></v-progress-circular>
        </div>
        <div v-else-if="ownedGames.length === 0" class="text-center pa-6 text-grey">
          This user hasn't added any games to their collection yet.
        </div>
        <div v-else class="px-2 pb-4">
          <div class="d-flex overflow-x-auto pb-2 scroll-container">
            <v-card v-for="game in ownedGames" :key="game.id" class="ma-2 d-flex flex-column cursor-pointer profile-game-card flex-shrink-0" width="160" color="secundary" elevation="2" rounded="lg" @click="goToLink(game.link)">
              <div :style="{ backgroundColor: game.color || '#1A1A1A' }" style="height: 140px; position: relative;" class="d-flex align-center justify-center">
                 <div style="position: absolute; top:0; left:0; right:0; bottom:0; opacity: 0.2; background-size: cover; background-position: center;" :style="{ backgroundImage: `url(${game.cardbg})` }"></div>
                 <v-img :src="game.image || require('@/assets/defalt-box.png')" max-height="120" contain style="z-index: 1;"></v-img>
              </div>
              <v-card-text class="pa-3 d-flex flex-column justify-center" style="min-height: 50px;">
                <span class="font-weight-bold text-white text-body-2" style="line-height: 1.2;">{{ game.name }}</span>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card>
    </v-container>

    <!-- WISHLIST SECTION -->
    <v-container max-width="800" class="pa-4 pt-0">
      <v-card rounded="lg" elevation="3" color="primary" class="pl-1 pt-1 pr-1 pb-0">
        <v-card-title class="d-flex justify-space-between pb-0 px-3">
          <span class="text-uppercase font-weight-black text-bold text-h5 mb-2 pb-0 text-white">
            {{ isOwner ? 'MY WISHLIST' : `${userName}'S WISHLIST` }}
          </span>
        </v-card-title>

        <div v-if="loading" class="d-flex justify-center pa-8">
          <v-progress-circular indeterminate color="#947A11"></v-progress-circular>
        </div>
        <div v-else-if="wishlistGames.length === 0" class="text-center pa-6 text-grey">
          This user doesn't have any games on their wishlist.
        </div>
        <div v-else class="px-2 pb-4">
          <div class="d-flex overflow-x-auto pb-2 scroll-container">
            <v-card v-for="game in wishlistGames" :key="game.id" class="ma-2 d-flex flex-column cursor-pointer profile-game-card flex-shrink-0" width="160" color="secundary" elevation="2" rounded="lg" @click="goToLink(game.link)">
              <div :style="{ backgroundColor: game.color || '#1A1A1A' }" style="height: 140px; position: relative;" class="d-flex align-center justify-center">
                 <div style="position: absolute; top:0; left:0; right:0; bottom:0; opacity: 0.2; background-size: cover; background-position: center;" :style="{ backgroundImage: `url(${game.cardbg})` }"></div>
                 <v-img :src="game.image || require('@/assets/defalt-box.png')" max-height="120" contain style="z-index: 1;"></v-img>
              </div>
              <v-card-text class="pa-3 d-flex flex-column justify-center" style="min-height: 50px;">
                <span class="font-weight-bold text-white text-body-2" style="line-height: 1.2;">{{ game.name }}</span>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, inject, computed } from 'vue';
import { useUserStore } from "@/store/UserStore";

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  },
  userName: {
    type: String,
    default: "USER"
  }
});

const userStore = useUserStore();
const isOwner = computed(() => {
  return String(userStore.user?.users_pk) === String(props.userId);
});

const axios: any = inject('axios');
const url: string = inject('apiUrl') || '';

const loading = ref(false);

const ownedGames = ref<any[]>([]);
const wishlistGames = ref<any[]>([]);

const fetchLibrary = async () => {
  if (!props.userId) return;
  
  loading.value = true;
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(url + "skus/search", {
      params: {
        users_fk: props.userId,
        limit: 100
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const skus = response.data.skus || [];
    
    const validSkus = skus.filter((s: any) => {
      const name = s.name?.toLowerCase() || '';
      return !['underkeep', 'underkeep2'].includes(name);
    });

    const uniqueMap = new Map();
    validSkus.forEach((s: any) => {
      if (!uniqueMap.has(s.skus_pk)) {
        uniqueMap.set(s.skus_pk, {
          id: s.skus_pk,
          name: s.name,
          image: s.picture_hash,
          link: s.link,
          color: s.color,
          cardbg: s.background,
          owned: s.owned,
          wish: s.wish
        });
      }
    });

    const uniqueProducts = Array.from(uniqueMap.values());
    
    ownedGames.value = uniqueProducts.filter((p: any) => p.owned === true);
    wishlistGames.value = uniqueProducts.filter((p: any) => p.wish === true);
  } catch (error) {
    console.error("Error fetching user library:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLibrary);

watch(() => props.userId, fetchLibrary);

const goToLink = (link: string) => {
  if (link) {
    window.open(link, "_blank");
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.profile-game-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.profile-game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.6) !important;
}

.scroll-container {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
.scroll-container::-webkit-scrollbar {
  height: 6px;
}
.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
</style>
