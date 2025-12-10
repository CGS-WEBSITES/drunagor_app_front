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
             <v-chip color="purple-accent-2" variant="flat" closable @click:close="clearCampaign" class="font-weight-bold w-100 justify-center">
                <v-icon start size="small">mdi-book-open-page-variant</v-icon>
                {{ selectedCampaignName }}
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
                        <v-icon color="grey-lighten-1" size="x-large" class="mb-2">mdi-shield-account-outline</v-icon>
                        <span class="text-caption text-grey-lighten-1 font-weight-bold text-uppercase">Select Hero</span>
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
      <v-card color="#121212" class="rounded-lg">
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
            <span class="text-body-1 font-weight-bold">Campaign Options</span>
            <v-btn icon variant="text" size="small" @click="showCampaignDialog = false"><v-icon>mdi-close</v-icon></v-btn>
         </v-card-title>
         <v-card-text class="d-flex flex-column ga-3 pt-2">
            <v-btn block color="success" size="large" variant="flat" :loading="loadingCampaignAction" @click="handleNewCampaign">
                <v-icon start>mdi-plus-box</v-icon> New Campaign
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

  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue';
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
const heroDataRepository = new HeroDataRepository();

const eventDetails = ref<any>(null);
const loadingStart = ref(false);
const loadingCampaignAction = ref(false);
const eventId = route.params.id;

const lobbySlots = ref<any[]>([
    { player: null, hero: null }, 
    { player: null, hero: null }, 
    { player: null, hero: null }, 
    { player: null, hero: null }
]);

const currentUserSlot = computed(() => lobbySlots.value[0]); 

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

const openHeroSelection = async () => {
    heroDialog.value = true;
    heroDialogTab.value = 'mine';
    loadingHeroes.value = true;
    if (!playableHeroStore.loaded && userStore.user?.users_pk) {
        await playableHeroStore.fetchHeroes(userStore.user.users_pk);
    }
    loadingHeroes.value = false;
};

const selectHero = (hero: any) => {
    lobbySlots.value[0].hero = hero; 
    heroDialog.value = false;
};

const handleSlotClick = (index: number) => {
    if (index === 0) {
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
const loadingCampaigns = ref(false);
const availableCampaigns = ref([]);
const selectedLoadCampaignId = ref(null);
const selectedCampaign = ref<any>(null); 

const selectedCampaignName = computed(() => 
    selectedCampaign.value?.party_name || selectedCampaign.value?.campaign_type || 'Unknown'
);

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
    if (!currentUserSlot.value.hero) {
        return {
            text: 'SELECT HERO',
            color: 'blue-darken-3',
            icon: 'mdi-shield-account',
            subtext: 'Choose a hero to join the party'
        };
    } else {
        return {
            text: 'PLAY',
            color: 'green-darken-1',
            icon: 'mdi-play-circle',
            subtext: !selectedCampaign.value ? 'Tap Play to select Campaign' : ''
        };
    }
});

const handleMainAction = () => {
    if (!currentUserSlot.value.hero) {
        openHeroSelection();
    } else {
        const playersWithoutHero = lobbySlots.value.some(slot => slot.player && !slot.hero);
        if (playersWithoutHero) {
            alert("All players in the lobby must select a hero before starting.");
            return;
        }

        if (!selectedCampaign.value) {
            showCampaignDialog.value = true;
        } else {
            startGame();
        }
    }
};

const startGame = () => {
    loadingStart.value = true;
    setTimeout(() => {
        router.push({
            path: `/campaign-tracker/campaign/${selectedCampaign.value.campaigns_fk}`,
            query: { sku: String(selectedCampaign.value.boxSku || '38') }
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
    let campaignType = seasonFk == 2 ? 'underkeep' : (seasonFk == 3 ? 'underkeep2' : null);
    
    if (!campaignType) {
        alert(`Invalid Season ID (${seasonFk}).`);
        loadingCampaignAction.value = false;
        return;
    }

    try {
        const usersPk = userStore.user?.users_pk;
        const skuRes = await axios.get("/skus/search", { params: { users_fk: usersPk } });
        const skuList = Array.isArray(skuRes.data.skus) ? skuRes.data.skus : Object.values(skuRes.data.skus);
        const selectedSku:any = skuList.find((s:any) => s.name?.toLowerCase() === campaignType?.toLowerCase());
        
        if (!selectedSku) throw new Error(`SKU for '${campaignType}' not found.`);

        const createRes = await axios.post("/campaigns/cadastro", {
             tracker_hash: "eyJjYW1wYWlnbkRhdGEiOnsiY2FtcGFpZ25JZCI6IiIsImNhbXBhaWduIjoidW5kZXJrZWVwIiwibmFtZSI6IiIsImRvb3IiOiIiLCJ3aW5nIjoiIiwic3RhdHVzSWRzIjpbXSwib3V0Y29tZUlkcyI6W10sImZvbGxvd2VySWRzIjpbXSwidW5mb2xkaW5nSWRzIjpbXSwiYmFja2dyb3VuZEFuZFRyYWl0SWRzIjpbXSwibGVnYWN5VHJhaWwiOnsicGVyc2V2ZXJhbmNlIjowLCJ0cmFnZWR5IjowLCJkb29tIjowLCJoZXJvaXNtIjowfSwiaXNTZXF1ZW50aWFsQWR2ZW50dXJlIjpmYWxzZSwic2VxdWVudGlhbEFkdmVudHVyZVJ1bmVzIjowfSwiaGVyb2VzIjpbXX0=",
             conclusion_percentage: 0,
             box: selectedSku.skus_pk,
        });

        const campaignFk = createRes.data.campaign.campaigns_pk;
        const newCamp = new Campaign(String(campaignFk), campaignType);
        campaignStore.add(newCamp);

        await axios.post("/rl_campaigns_users/cadastro", {
             users_fk: usersPk,
             campaigns_fk: campaignFk,
             party_roles_fk: 1, 
             skus_fk: selectedSku.skus_pk,
        });

        selectedCampaign.value = { 
            campaigns_fk: campaignFk, 
            campaign_type: campaignType, 
            boxSku: selectedSku.skus_pk,
            party_name: 'New Adventure' 
        };
        showCampaignDialog.value = false;

    } catch (e:any) {
        console.error("New Campaign Error", e);
        alert("Error: " + (e.message || "Failed to create campaign"));
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

const confirmLoadCampaign = () => {
    const camp = availableCampaigns.value.find((c:any) => c.campaigns_fk === selectedLoadCampaignId.value);
    if(camp) selectedCampaign.value = camp;
    showLoadDialog.value = false;
    showCampaignDialog.value = false;
};

const clearCampaign = () => selectedCampaign.value = null;
const leaveLobby = () => router.go(-1);

onMounted(() => {
    fetchEventDetails();
    const user = userStore.user;
    if(user) {
        lobbySlots.value[0].player = {
            name: user.user_name || 'You',
            avatar: user.picture_hash ? `https://assets.drunagor.app/Profile/${user.picture_hash}` : 'https://assets.drunagor.app/Profile/user.png',
        };
    }
});
</script>

<style scoped>
.cinzel-text { font-family: "Cinzel", serif; }

.lobby-bg {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at center, #1f2430 0%, #000000 100%);
    z-index: 0;
}

/* CONTAINER RESPONSIVO */
.responsive-container {
    margin: 0 auto;
    background: rgba(0,0,0,0.2);
}

/* Desktop: Simula Mobile Centralizado */
@media (min-width: 960px) {
    .responsive-container {
        max-width: 480px;
        box-shadow: 0 0 50px rgba(0,0,0,0.5);
    }
}

/* Mobile/Tablet: Fullscreen (Corrige visualização tablet) */
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

/* CARD DE SLOT DE JOGADOR */
.player-slot-card {
    border-color: rgba(255,255,255,0.1);
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden; 
}
.player-slot-card:active {
    transform: scale(0.96);
}

/* Header do Player sobreposto à imagem */
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