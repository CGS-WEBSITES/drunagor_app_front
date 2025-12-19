<template>
  <v-main class="lobby-page bg-black h-screen w-screen overflow-hidden">
    
    <div class="lobby-bg"></div>

    <div class="responsive-container d-flex flex-column fill-height position-relative" style="z-index: 1;">
      
      <div class="px-4 pt-4 pb-2 flex-shrink-0 w-100">
        <div class="d-flex align-center justify-space-between mb-2">
           <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="leaveLobby"></v-btn>
           
           <div class="d-flex flex-column align-center">
               <span class="text-h6 font-weight-bold text-white cinzel-text text-truncate">
                   {{ eventDetails?.store_name || 'Lobby' }}
               </span>
               <span v-if="eventDateObj.day" class="text-caption text-grey">
                   {{ eventDateObj.month }} {{ eventDateObj.day }} - {{ eventDateObj.time }}
               </span>
           </div>
           
           <div style="width: 40px;"></div>
        </div>

        <div v-if="selectedCampaign" class="text-center mt-2">
             <v-chip color="purple-accent-2" variant="flat" :closable="isLeader" @click:close="clearCampaign" class="font-weight-bold w-100 justify-center">
                <v-icon start size="small">mdi-book-open-page-variant</v-icon>
                {{ selectedCampaignName }}
             </v-chip>
        </div>
        <div v-else class="text-center mt-2">
            <v-chip color="grey-darken-3" variant="flat" class="font-weight-bold w-100 justify-center text-grey">
                <v-icon start size="small">mdi-help-circle-outline</v-icon>
                No Campaign Selected
             </v-chip>
        </div>
      </div>

      <div class="flex-grow-1 w-100 px-4 overflow-y-auto d-flex flex-column justify-center">
        <v-row dense class="w-100 ma-0 justify-center">
          <v-col
            cols="6" 
            v-for="(slot, index) in lobbySlots"
            :key="index"
            class="pa-3 d-flex justify-center"
          >
            <v-card 
              class="player-slot-card d-flex flex-column align-center justify-center elevation-10"
              :color="slot.player ? '#1e1e1e' : 'rgba(255,255,255,0.05)'"
              :variant="slot.player ? 'elevated' : 'outlined'"
              rounded="xl"
              @click="handleSlotClick(index)"
              v-ripple="!!slot.player"
              style="width: 100%; max-width: 220px; aspect-ratio: 0.76; position: relative; overflow: hidden;"
            >
              <template v-if="!slot.player">
                <div class="d-flex flex-column align-center justify-center fill-height" style="opacity: 0.3">
                  <v-icon size="40" color="white">mdi-plus</v-icon>
                  <span class="text-caption text-grey mt-2 font-weight-bold">EMPTY</span>
                </div>
              </template>

              <template v-else>
                  <div class="player-overlay-header">
                      <v-avatar size="24" class="mr-2 border-sm">
                          <v-img :src="slot.player.avatar"></v-img>
                      </v-avatar>
                      
                      <span class="text-caption text-white font-weight-bold text-truncate" style="max-width: 80px;">
                          {{ slot.player.name }}
                      </span>

                      <v-icon v-if="index === 0" color="amber" size="small" class="ml-1" title="Drunagor Master">
                          mdi-crown
                      </v-icon>
                  </div>

                  <template v-if="slot.hero">
                      <v-img 
                        :src="slot.hero.image" 
                        cover
                        class="w-100 h-100"
                      ></v-img>
                  </template>

                  <template v-else>
                      <div class="d-flex flex-column align-center justify-center fill-height w-100 bg-grey-darken-4 border-dashed pt-6">
                        <v-progress-circular v-if="slot.loadingHero" indeterminate color="white" size="24"></v-progress-circular>
                        <v-icon v-else color="grey-lighten-1" size="x-large" class="mb-2">mdi-shield-account-outline</v-icon>
                        <span class="text-caption text-grey-lighten-1 font-weight-bold text-uppercase mt-2">
                            {{ slot.loadingHero ? 'Loading...' : 'Select Hero' }}
                        </span>
                      </div>
                  </template>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div class="flex-shrink-0 pa-6 w-100 bg-grey-darken-4 elevation-24 rounded-t-xl z-index-10">
        <v-btn 
            block 
            :color="mainButtonConfig.color"
            height="64"
            class="font-weight-bold text-white text-h6 rounded-lg elevation-4"
            :loading="loadingStart"
            @click="handleMainAction"
            :disabled="mainButtonConfig.disabled"
        >
            <v-icon start size="large">{{ mainButtonConfig.icon }}</v-icon> 
            {{ mainButtonConfig.text }}
        </v-btn>
        
        <div v-if="mainButtonConfig.subtext" class="text-center text-caption text-grey mt-3 font-weight-medium">
            {{ mainButtonConfig.subtext }}
        </div>
      </div>
    
    </div>

    <v-dialog v-model="heroDialog" max-width="600" scrollable>
      <v-card color="#1e1e1e" class="rounded-lg">
        <v-card-title class="text-white text-center pt-4 pb-2 cinzel-text">
           {{ heroDialogTab === 'mine' ? 'Choose your Hero' : 'Create New Hero' }}
        </v-card-title>
        
        <v-card-text class="pa-2" style="max-height: 600px;">
          <div v-if="heroDialogTab === 'mine'" class="d-flex flex-column gap-3">
              <div v-if="loadingHeroes" class="text-center py-6">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              <template v-else>
                  <div v-if="myHeroes.length === 0" class="text-center text-grey py-4">
                      No heroes found.
                  </div>
                  <div 
                    v-for="hero in myHeroes" 
                    :key="hero.pk" 
                    class="hero-selection-card rounded-lg elevation-6 overflow-hidden position-relative my-1"
                    @click="selectHero(hero)"
                  >
                     <v-img 
                        :src="hero.trackerImage" 
                        width="100%"
                        aspect-ratio="5.52" 
                        cover
                     ></v-img>
                  </div>
                  <v-btn 
                    block 
                    variant="outlined" 
                    color="grey-lighten-1" 
                    class="mt-4 border-dashed py-6" 
                    @click="heroDialogTab = 'new'"
                  >
                     <v-icon start>mdi-plus-circle-outline</v-icon> Create New Hero
                  </v-btn>
              </template>
          </div>

          <div v-else class="d-flex flex-column gap-3">
              <div v-if="loadingHeroes" class="text-center py-6">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              <template v-else>
                  <div 
                    v-for="heroData in availableHeroesToCreate" 
                    :key="heroData.id" 
                    class="hero-selection-card rounded-lg elevation-6 overflow-hidden"
                    @click="createNewHero(heroData.id)"
                  >
                     <v-img 
                        :src="heroData.images.trackerimage" 
                        width="100%"
                        aspect-ratio="5.52"
                        cover
                     ></v-img>
                  </div>
              </template>
              <v-btn 
                block 
                variant="text" 
                color="white" 
                class="mt-2" 
                @click="heroDialogTab = 'mine'"
              >
                <v-icon start>mdi-arrow-left</v-icon> Back to My Heroes
              </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showCampaignDialog" max-width="340">
      <v-card color="#1e1e1e" class="rounded-lg pa-2">
         <v-card-title class="text-white d-flex justify-space-between align-center">
            <span class="text-body-1 font-weight-bold">Select Campaign</span>
            <v-btn icon variant="text" size="small" @click="showCampaignDialog = false"><v-icon>mdi-close</v-icon></v-btn>
         </v-card-title>
         <v-card-text class="d-flex flex-column ga-3 pt-2">
            <div class="text-caption text-grey mb-2 text-center">
              You must select a campaign before choosing heroes.
            </div>
            <v-btn block color="success" size="large" variant="flat" :loading="loadingCampaignAction" @click="handleNewCampaign">
                <v-icon start>mdi-plus-box</v-icon> New Underkeep 2
            </v-btn>
            <div class="d-flex align-center">
                <v-divider></v-divider><span class="px-2 text-caption text-grey">OR</span><v-divider></v-divider>
            </div>
            <v-btn block color="blue-darken-2" size="large" variant="flat" @click="fetchAndShowLoadDialog">
                <v-icon start>mdi-folder-open</v-icon> Load Campaign
            </v-btn>
         </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showLoadDialog" max-width="400">
        <v-card color="#1e1e1e" class="rounded-lg">
            <v-card-title class="text-white">Select Campaign</v-card-title>
            <v-card-text>
                <v-select
                  v-model="selectedLoadCampaignId"
                  :items="availableCampaigns"
                  item-title="party_name"
                  item-value="campaigns_fk"
                  label="Select a campaign"
                  variant="outlined"
                  bg-color="grey-darken-4"
                  color="white"
                  :loading="loadingCampaigns"
                  no-data-text="No campaigns found"
                ></v-select>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="showLoadDialog = false">Cancel</v-btn>
                <v-btn color="success" @click="confirmLoadCampaign" :disabled="!selectedLoadCampaignId">Load</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showStartConfirmDialog" max-width="340">
       <v-card color="#1e1e1e" class="rounded-lg">
          <v-card-title class="text-white">Wait!</v-card-title>
          <v-card-text class="text-grey-lighten-1">
             You have less than 4 players. Do you want to proceed with <b>{{ currentPlayersCount }} players</b>?
          </v-card-text>
          <v-card-actions>
             <v-spacer></v-spacer>
             <v-btn color="grey" variant="text" @click="showStartConfirmDialog = false">No, Wait</v-btn>
             <v-btn color="warning" @click="confirmStartLobbyFinal">Yes, Proceed</v-btn>
          </v-card-actions>
       </v-card>
    </v-dialog>

  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, inject, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/UserStore';
import { usePlayableHeroStore } from '@/store/PlayableHeroStore';
import { CampaignStore } from '@/store/CampaignStore';
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { Campaign } from "@/store/Campaign";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const playableHeroStore = usePlayableHeroStore();
const campaignStore = CampaignStore();
const axios: any = inject('axios');
const socket: any = inject('socket');
const heroDataRepository = new HeroDataRepository();

const eventDetails = ref<any>(null);
const loadingStart = ref(false);
const loadingCampaignAction = ref(false);
const eventId = route.params.id;
const tablePk = computed(() => route.query.table_pk);
const pollingTimer = ref<any>(null);

// Cache para guardar IDs de heróis de outros jogadores
// Mapeia: playable_heroes_pk (int) -> hero_id (string, ex: 'warrior')
const otherPlayersHeroCache = ref<Record<number, string>>({}); 

const lobbySlots = ref<any[]>([
    { player: null, hero: null, loadingHero: false }, 
    { player: null, hero: null, loadingHero: false }, 
    { player: null, hero: null, loadingHero: false }, 
    { player: null, hero: null, loadingHero: false }
]);

const currentUserSlot = computed(() => {
    return lobbySlots.value.find(s => s.player && s.player.users_fk === userStore.user.users_pk) || { player: null, hero: null };
}); 

const isLeader = computed(() => {
    const leaderSlot = lobbySlots.value[0];
    if (!leaderSlot.player || !currentUserSlot.value.player) return false;
    return leaderSlot.player.users_fk === currentUserSlot.value.player.users_fk;
});

const currentPlayersCount = computed(() => {
    return lobbySlots.value.filter(s => s.player !== null).length;
});

const heroDialog = ref(false);
const heroDialogTab = ref<'mine'|'new'>('mine');
const loadingHeroes = ref(false);

const myHeroes = computed(() => {
    return playableHeroStore.heroes.map(h => {
        const staticData = heroDataRepository.find(h.heroId);
        return {
            pk: h.pk,
            heroId: h.heroId,
            name: staticData?.name || 'Unknown',
            image: staticData?.images?.avatar || staticData?.images?.token, 
            trackerImage: staticData?.images?.trackerimage
        }
    });
});

const availableHeroesToCreate = computed(() => {
    const allHeroes = heroDataRepository.findAll();
    const existingIds = playableHeroStore.heroes.map(h => h.heroId);
    return allHeroes.filter(h => !existingIds.includes(h.id));
});

function generateCampaignHash(campaign: Campaign): string {
  const data = {
    campaignData: JSON.parse(JSON.stringify(campaign)),
    heroes: [], 
  };
  return btoa(JSON.stringify(data));
}

const joinTable = async () => {
    if (!eventId || !tablePk.value) return;
    try {
        await axios.post('/rl_events_users/cadastro', null, {
            params: {
                users_fk: userStore.user.users_pk,
                events_fk: eventId,
                event_tables_fk: tablePk.value, 
                status: 2,
                active: true
            }
        });
    } catch (e) {
        console.error("Error joining table:", e);
    }
};

const checkActiveCampaign = async () => {
    try {
        const { data } = await axios.get("/rl_campaigns_users/search", { 
            params: { 
                users_fk: userStore.user.users_pk,
                active: true
            } 
        });

        if (data.campaigns && data.campaigns.length > 0) {
            const camp = data.campaigns[0];
            if (!camp.party_name) camp.party_name = "Adventure " + camp.campaigns_fk;
            
            if (!selectedCampaign.value || selectedCampaign.value.campaigns_fk !== camp.campaigns_fk) {
                 selectedCampaign.value = camp;
            }
        }
    } catch (e) { }
}

// === FUNÇÃO MÁGICA: RESOLVE O HERÓI (API ou Cache) ===
const resolveHeroForSlot = async (slotIndex: number, playableHeroFk: number, slotObj: any, userPk: number) => {
    // 1. Tenta achar na minha store local (rápido se for eu)
    let heroInfo: any = playableHeroStore.heroes.find(h => h.pk === playableHeroFk);
    
    // 2. Se não achou (é outro player), tenta resolver
    if (!heroInfo) {
        // Verifica cache local
        if (otherPlayersHeroCache.value[playableHeroFk]) {
             heroInfo = { heroId: otherPlayersHeroCache.value[playableHeroFk] };
        } else {
             // 3. Busca na API do Backend (PlayableHeroSearch)
             try {
                slotObj.loadingHero = true; // Mostra loader
                const { data } = await axios.get('/playable_heroes/search', { params: { users_fk: userPk } });
                const found = data.playable_heroes.find((h:any) => h.playable_heroes_pk === playableHeroFk);
                
                if(found && found.hero_hash) {
                    // DECODE: Backend manda hero_hash (base64). Precisamos extrair o ID string.
                    try {
                        const decodedData = JSON.parse(atob(found.hero_hash));
                        // Assumindo que o JSON do herói tem a propriedade "id" (ex: "ranger")
                        if (decodedData.id) {
                            otherPlayersHeroCache.value[playableHeroFk] = decodedData.id;
                            heroInfo = { heroId: decodedData.id };
                        }
                    } catch(decodeError) {
                        console.error("Failed to decode hero hash", decodeError);
                    }
                }
             } catch(e) {
                console.warn(`Could not resolve hero for user ${userPk}`);
             } finally {
                slotObj.loadingHero = false;
             }
        }
    }

    // 4. Se conseguiu o ID string (ex: "warrior"), busca a imagem no repositório estático
    if (heroInfo && heroInfo.heroId) {
         const staticData = heroDataRepository.find(heroInfo.heroId);
         if (staticData) {
             slotObj.hero = {
                 name: staticData.name,
                 image: staticData.images.trackerimage
             };
         }
    }
};

const fetchTablePlayers = async () => {
    if (!eventId || !tablePk.value) return;

    try {
        const tableRes = await axios.get(`/rl_events_users/table_players/${eventId}/${tablePk.value}`);
        
        let campaignPlayers: any[] = [];
        if (selectedCampaign.value) {
            try {
                const campRes = await axios.get("/rl_campaigns_users/list_players", { 
                    params: { campaigns_fk: selectedCampaign.value.campaigns_fk } 
                });
                campaignPlayers = campRes.data.Users || [];
            } catch(e) {}
        }

        const newSlots = [
            { player: null, hero: null, loadingHero: false }, 
            { player: null, hero: null, loadingHero: false }, 
            { player: null, hero: null, loadingHero: false }, 
            { player: null, hero: null, loadingHero: false }
        ];

        if (tableRes.data.players && Array.isArray(tableRes.data.players)) {
            for (let i = 0; i < tableRes.data.players.length && i < 4; i++) {
                const p = tableRes.data.players[i];
                
                newSlots[i].player = {
                    users_fk: p.users_pk,
                    name: p.user_name,
                    avatar: p.picture_hash ? `https://assets.drunagor.app/Profile/${p.picture_hash}` : 'https://assets.drunagor.app/Profile/user.png',
                };

                let heroFk = p.playable_heroes_fk;

                // Merge com dados da campanha se a mesa falhar
                if (!heroFk && selectedCampaign.value) {
                    try {
                        const searchRes = await axios.get("/rl_campaigns_users/search", { 
                            params: { 
                                users_fk: p.users_pk, 
                                campaigns_fk: selectedCampaign.value.campaigns_fk,
                                active: true
                            } 
                        });
                        
                        if(searchRes.data.campaigns && searchRes.data.campaigns.length > 0) {
                            const userCamp = searchRes.data.campaigns[0];
                            if(userCamp.playable_heroes_fk) {
                                heroFk = userCamp.playable_heroes_fk;
                            }
                        }
                    } catch(e) { }
                }

                if (heroFk) {
                    await resolveHeroForSlot(i, heroFk, newSlots[i], p.users_pk);
                }
            }
        }
        
        // Mantém estado visual se não houve mudança (anti-flicker)
        newSlots.forEach((slot, i) => {
             const oldSlot = lobbySlots.value[i];
             if (slot.player && !slot.hero && oldSlot.player && oldSlot.hero && 
                 slot.player.users_fk === oldSlot.player.users_fk) {
                 slot.hero = oldSlot.hero;
             }
        });

        lobbySlots.value = newSlots;

        if (!isLeader.value && !selectedCampaign.value) {
            checkActiveCampaign();
        }

    } catch (error) {
        console.error("Error fetching table players:", error);
    }
};

const openHeroSelection = async () => {
    if (!selectedCampaign.value) {
        alert("A Campaign must be selected before choosing a hero.");
        if (isLeader.value) showCampaignDialog.value = true;
        return;
    }

    heroDialog.value = true;
    heroDialogTab.value = 'mine';
    loadingHeroes.value = true;
    if (!playableHeroStore.loaded && userStore.user?.users_pk) {
        await playableHeroStore.fetchHeroes(userStore.user.users_pk);
    }
    loadingHeroes.value = false;
};

const selectHero = async (hero: any) => {
    const mySlotIndex = lobbySlots.value.findIndex(s => s.player && s.player.users_fk === userStore.user.users_pk);
    if (mySlotIndex !== -1) {
        lobbySlots.value[mySlotIndex].hero = hero;
    }
    heroDialog.value = false;

    try {
        await axios.post('/rl_campaigns_users/upsert-hero', {
            campaigns_fk: selectedCampaign.value?.campaigns_fk, 
            playable_heroes_fk: hero.pk,
            events_fk: Number(eventId),
        });
        
        // Não precisa esperar timeout, o socket deve confirmar, mas fazemos polling rápido por garantia
        setTimeout(() => fetchTablePlayers(), 200);
    } catch (e) {
        console.error("Error saving hero:", e);
    }
};

const handleSlotClick = (index: number) => {
    const slot = lobbySlots.value[index];
    if (slot.player && slot.player.users_fk === userStore.user.users_pk) {
        openHeroSelection();
    }
};

const createNewHero = async (heroId: string) => {
    loadingHeroes.value = true;
    try {
        await playableHeroStore.createHero(heroId, userStore.user.users_pk);
        await playableHeroStore.fetchHeroes(userStore.user.users_pk);
        
        const createdHeroFormatted = myHeroes.value.find(h => h.heroId === heroId);
        if(createdHeroFormatted) {
            selectHero(createdHeroFormatted);
        }
        heroDialogTab.value = 'mine';
        heroDialog.value = false;
    } catch(e) {
        console.error("Error creating hero", e);
        alert("Failed to create hero. Please try again.");
    } finally {
        loadingHeroes.value = false;
    }
};

const showCampaignDialog = ref(false);
const showLoadDialog = ref(false);
const showStartConfirmDialog = ref(false);
const loadingCampaigns = ref(false);
const availableCampaigns = ref([]);
const selectedLoadCampaignId = ref(null);
const selectedCampaign = ref<any>(null); 

const selectedCampaignName = computed(() => {
    if (!selectedCampaign.value) return 'Unknown';
    return selectedCampaign.value.party_name || 
           (selectedCampaign.value.campaign_type ? selectedCampaign.value.campaign_type : 'Campaign') + 
           ` #${selectedCampaign.value.campaigns_fk}`;
});

const linkPlayersToCampaign = async (campaignFk: number, boxId: number) => {
    const players = lobbySlots.value
        .filter(s => s.player && s.player.users_fk !== userStore.user.users_pk) 
        .map(s => s.player.users_fk);

    for (const playerPk of players) {
        try {
            await axios.post("/rl_campaigns_users/cadastro", null, {
                params: {
                     users_fk: playerPk,
                     campaigns_fk: Number(campaignFk),
                     skus_fk: boxId,
                     active: true
                }
            });
        } catch (e: any) { }
    }
};

const handleNewCampaign = async () => {
    if(!eventDetails.value || !eventDetails.value.seasons_fk) {
        await fetchEventDetails();
        if(!eventDetails.value) {
            alert("Error: Could not load event data.");
            return;
        }
    }

    loadingCampaignAction.value = true;
    
    const seasonFk = eventDetails.value.seasons_fk;
    const campaignType = seasonFk == 2 ? 'underkeep' : 'underkeep2';
    const SKU_ID = 19; 

    try {
        const usersPk = userStore.user?.users_pk;
        
        let boxId = SKU_ID;
        try {
             const skuRes = await axios.get("/skus/search", { params: { users_fk: usersPk } });
             const skuList = Array.isArray(skuRes.data.skus) ? skuRes.data.skus : Object.values(skuRes.data.skus);
             const foundSku: any = skuList.find((s:any) => s.skus_pk === SKU_ID);
             if (foundSku) boxId = foundSku.skus_pk;
        } catch(e) { }

        try {
             const { data } = await axios.get("/rl_campaigns_users/check-duplicate", {
                  params: { users_fk: usersPk, skus_fk: boxId }
             });
             if (data.exists && data.existing_relationship) {
                  const confirmReset = confirm("Already have a campaign. Reset?");
                  if(confirmReset) {
                      await axios.delete(`/rl_campaigns_users/${data.existing_relationship.rl_campaigns_users_pk}/delete/`);
                  } else {
                      loadingCampaignAction.value = false;
                      return;
                  }
             }
        } catch(e) {}

        const tempCampaign = new Campaign("temp", campaignType);
        const initialHash = generateCampaignHash(tempCampaign);

        const createRes = await axios.post("/campaigns/cadastro", {
             tracker_hash: initialHash,
             conclusion_percentage: 0,
             party_name: "New Adventure",
             box: boxId,
             active: true
        });

        const campaignFk = createRes.data.campaign.campaigns_pk;
        const realCampaignId = String(campaignFk);

        const realCampaign = new Campaign(realCampaignId, campaignType);
        const finalHash = generateCampaignHash(realCampaign);

        await axios.put(`/campaigns/alter/${campaignFk}`, {
            tracker_hash: finalHash,
            party_name: "New Adventure"
        });

        campaignStore.add(realCampaign);

        await axios.post("/rl_campaigns_users/cadastro", null, {
            params: {
                 users_fk: usersPk,
                 campaigns_fk: Number(campaignFk),
                 skus_fk: boxId,
                 active: true
            }
        });

        await linkPlayersToCampaign(campaignFk, boxId);

        selectedCampaign.value = { 
            campaigns_fk: campaignFk, 
            campaign_type: campaignType, 
            boxSku: boxId,
            party_name: 'New Adventure' 
        };
        showCampaignDialog.value = false;
        
        checkPlayersAndProceed();

    } catch (e:any) {
        console.error("New Campaign Error", e);
        alert("Error: " + (e.response?.data?.message || e.message || "Failed to create campaign"));
    } finally {
        loadingCampaignAction.value = false;
    }
};

const fetchAndShowLoadDialog = async () => {
    loadingCampaigns.value = true;
    showLoadDialog.value = true;
    try {
         const res = await axios.get("/rl_campaigns_users/search", { params: { users_fk: userStore.user?.users_pk } });
         availableCampaigns.value = res.data.campaigns;
    } catch(e) { console.error(e); } 
    finally { loadingCampaigns.value = false; }
};

const confirmLoadCampaign = async () => {
    const camp: any = availableCampaigns.value.find((c:any) => c.campaigns_fk === selectedLoadCampaignId.value);
    if(camp) {
        selectedCampaign.value = camp;
        await linkPlayersToCampaign(camp.campaigns_fk, camp.box || 19);
        checkPlayersAndProceed();
    }
    showLoadDialog.value = false;
    showCampaignDialog.value = false;
};

const clearCampaign = () => {
    if(isLeader.value) selectedCampaign.value = null;
};

const eventDateObj = computed(() => {
  if(!eventDetails.value) return { month: '', day: '', time: '' };
  const d = new Date(eventDetails.value.event_date);
  return {
    month: d.toLocaleDateString('en-US',{month:'short'}).toUpperCase(),
    day: d.getDate(),
    time: d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true})
  }
});

const mainButtonConfig = computed(() => {
    if (isLeader.value && !selectedCampaign.value) {
        return {
            text: 'SELECT CAMPAIGN',
            color: 'deep-purple-darken-1',
            icon: 'mdi-map-marker-path',
            subtext: 'Leader must select a campaign first'
        };
    }

    if (!currentUserSlot.value.hero) {
        const canSelect = !!selectedCampaign.value;
        return {
            text: 'SELECT HERO',
            color: canSelect ? 'blue-darken-3' : 'grey-darken-3',
            icon: 'mdi-shield-account',
            subtext: canSelect ? 'Choose a hero to join the party' : 'Waiting for Leader to select campaign...',
            disabled: !canSelect
        };
    } 
    
    return {
        text: 'START GAME',
        color: 'green-darken-1',
        icon: 'mdi-play-circle',
        subtext: isLeader.value ? 'Start the adventure for everyone' : 'Waiting for Leader to start...',
        disabled: !isLeader.value 
    };
});

const checkPlayersAndProceed = () => {
    if (isLeader.value && currentPlayersCount.value < 4) {
        showStartConfirmDialog.value = true;
    } else {
        if (!currentUserSlot.value.hero) {
            openHeroSelection();
        }
    }
}

const confirmStartLobbyFinal = () => {
     showStartConfirmDialog.value = false;
     const everyoneHasHero = !lobbySlots.value.some(slot => slot.player && !slot.hero);
     if (everyoneHasHero && selectedCampaign.value) {
         startGame();
     } else if (!currentUserSlot.value.hero) {
         openHeroSelection();
     }
}

const handleMainAction = () => {
    if (isLeader.value && !selectedCampaign.value) {
        showCampaignDialog.value = true;
        return;
    }

    if (!currentUserSlot.value.hero) {
        if (!selectedCampaign.value) {
             alert("Waiting for leader to select campaign.");
             return;
        }
        openHeroSelection();
        return;
    } 

    const playersWithoutHero = lobbySlots.value.some(slot => slot.player && !slot.hero);
    if (playersWithoutHero) {
        alert("All players in the lobby must select a hero before starting.");
        return;
    }

    if (isLeader.value) {
        if (currentPlayersCount.value < 4) {
             showStartConfirmDialog.value = true;
             return; 
        }
        startGame();
    }
};

const startGame = () => {
    loadingStart.value = true;

    if (socket && eventId) {
        socket.emit('table:broadcast', {
            event: 'start_game',
            payload: { 
                campaignId: selectedCampaign.value.campaigns_fk,
                sku: selectedCampaign.value.boxSku || '19'
            },
            table_id: tablePk.value
        });
    }

    setTimeout(() => {
        router.push({
            path: `/campaign-tracker/campaign/${selectedCampaign.value.campaigns_fk}`,
            query: { sku: String(selectedCampaign.value.boxSku || '19') } 
        });
    }, 800);
};

const fetchEventDetails = async () => {
    if (!eventId) return;
    const userPk = userStore.user?.users_pk;
    try {
        const res = await axios.get('/events/list_events/', { 
            params: { 
                player_fk: userPk, 
                past_events: 'false'
            },
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const events = res.data.events || [];
        const found = events.find((e:any) => String(e.events_pk) === String(eventId));
        if(found) eventDetails.value = found;
    } catch(e) {
        console.error("Failed to load event details", e);
    }
}

const leaveLobby = () => router.go(-1);

onMounted(async () => {
    await fetchEventDetails();
    if(tablePk.value) {
        await joinTable();
    }
    
    await checkActiveCampaign();
    await fetchTablePlayers();
    
    if (socket) {
        // === ESCUTA O EVENTO EM TEMPO REAL ===
        socket.on('table:hero_selected', async (payload: any) => {
            console.log("Socket received hero update:", payload);
            
            const slotIndex = lobbySlots.value.findIndex(s => s.player && s.player.users_fk === payload.users_fk);
            
            if (slotIndex !== -1) {
                 // Usa nossa função de resolução inteligente para buscar a imagem imediatamente
                 await resolveHeroForSlot(
                    slotIndex, 
                    payload.playable_heroes_fk, 
                    lobbySlots.value[slotIndex], 
                    payload.users_fk
                 );
            } else {
                fetchTablePlayers(); // Fallback se não achar o slot
            }
        });

        socket.on('start_game', (payload: any) => {
            console.log("Game started by leader!", payload);
            if (payload && payload.campaignId) {
                 router.push({
                    path: `/campaign-tracker/campaign/${payload.campaignId}`,
                    query: { sku: String(payload.sku || '19') } 
                });
            }
        });
    }
});

onBeforeUnmount(() => {
    if (socket) {
        socket.off('table:hero_selected');
        socket.off('start_game');
    }
    if (pollingTimer.value) {
        clearInterval(pollingTimer.value);
    }
});

// Polling continua existindo como backup
const intervalo = setInterval(() => {
    fetchTablePlayers();
}, 4000)

</script>

<style scoped>
.cinzel-text { font-family: "Cinzel", serif; }

.lobby-bg {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at center, #1f2430 0%, #000000 100%);
    z-index: 0;
}

.responsive-container {
    margin: 0 auto;
    background: rgba(0,0,0,0.2);
}

@media (min-width: 960px) {
    .responsive-container {
        max-width: 480px;
        box-shadow: 0 0 50px rgba(0,0,0,0.5);
    }
}

@media (max-width: 959px) {
    .responsive-container {
        max-width: 100%;
        width: 100%;
    }
}

.hero-selection-card {
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
    border: 1px solid rgba(255,255,255,0.2);
}
.hero-selection-card:active {
    transform: scale(0.98);
}

.border-dashed {
    border: 2px dashed rgba(255,255,255,0.2) !important;
}

.player-slot-card {
    border-color: rgba(255,255,255,0.1);
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden; 
}
.player-slot-card:active {
    transform: scale(0.96);
}

.player-overlay-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
    display: flex;
    align-items: center;
    padding: 8px;
}

.z-index-10 {
    z-index: 10;
}
</style>