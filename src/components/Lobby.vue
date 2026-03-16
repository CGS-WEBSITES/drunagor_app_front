<template>
  <v-main class="lobby-page bg-black h-screen w-screen overflow-hidden">
    <div class="lobby-bg"></div>

    <div class="responsive-container d-flex flex-column fill-height position-relative" style="z-index: 1;">
      
      <div class="px-4 pt-4 pb-2 flex-shrink-0 w-100">
        <div class="d-flex align-center justify-space-between mb-2">
           <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="leaveLobby" :disabled="isReconnecting"></v-btn>
           
           <div class="d-flex flex-column align-center">
               <span class="text-h6 font-weight-bold text-white cinzel-text text-truncate">
                   {{ eventDetails?.store_name || 'Lobby' }}
               </span>
               <span v-if="eventDateObj.day" class="text-caption text-grey">
                   {{ eventDateObj.month }} {{ eventDateObj.day }} - {{ eventDateObj.time }}
               </span>
               <span v-if="eventDetails?.scenario" class="text-caption text-amber-accent-2 font-weight-bold">
                   {{ eventDetails.scenario }}
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
                        position="top center"
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
            :loading="loadingStart || isReconnecting"
            @click="handleMainAction"
            :disabled="mainButtonConfig.disabled || isReconnecting"
        >
            <v-icon start size="large">{{ mainButtonConfig.icon }}</v-icon> 
            {{ mainButtonConfig.text }}
        </v-btn>
        
        <div v-if="mainButtonConfig.subtext" class="text-center text-caption text-grey mt-3 font-weight-medium">
            {{ mainButtonConfig.subtext }}
        </div>
      </div>
    </div>

    <v-overlay 
      v-model="overlayVisible" 
      class="align-center justify-center" 
      persistent
      opacity="0.95"
      scrim="black"
    >
      <div class="d-flex flex-column align-center justify-center text-center">
        <v-img src="@/assets/logo/underkeep.png" width="200" class="mb-6"></v-img>
        <v-progress-circular indeterminate color="amber-accent-4" size="64" width="6" class="mb-4"></v-progress-circular>
        <h2 class="text-h5 font-weight-bold text-white cinzel-text mb-2">
            {{ isReconnecting ? 'Resuming Adventure...' : 'Gathering the Party...' }}
        </h2>
        <p class="text-grey-lighten-1 text-body-2">
            {{ isReconnecting ? 'Returning you to the dungeon.' : 'Preparing the dungeon for your arrival.' }}
        </p>
      </div>
    </v-overlay>

    <v-dialog v-model="heroDialog" max-width="600" scrollable persistent>
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
                      No available heroes found (or all taken).
                  </div>
                  <div 
                    v-for="hero in myHeroes" 
                    :key="hero.pk" 
                    class="hero-selection-card rounded-lg elevation-6 overflow-hidden position-relative my-1"
                    @click="selectHero(hero)"
                  >
                      <v-img :src="hero.trackerImage" width="100%" aspect-ratio="5.52" cover></v-img>
                  </div>
                  <v-btn block variant="outlined" color="grey-lighten-1" class="mt-4 border-dashed py-6" @click="heroDialogTab = 'new'">
                      <v-icon start>mdi-plus-circle-outline</v-icon> Create New Hero
                  </v-btn>
              </template>
          </div>
          <div v-else class="d-flex flex-column gap-3">
              <div v-if="loadingHeroes" class="text-center py-6">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              <template v-else>
                  <div v-for="heroData in availableHeroesToCreate" :key="heroData.id" class="hero-selection-card rounded-lg elevation-6 overflow-hidden" @click="createNewHero(heroData.id)">
                      <v-img :src="heroData.images.trackerimage" width="100%" aspect-ratio="5.52" cover></v-img>
                  </div>
              </template>
              <v-btn block variant="text" color="white" class="mt-2" @click="heroDialogTab = 'mine'">
                <v-icon start>mdi-arrow-left</v-icon> Back to My Heroes
              </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showCampaignDialog" max-width="340">
      <v-card color="#1e1e1e" class="rounded-lg pa-2">
         <v-card-title class="text-white d-flex justify-space-between align-center">
            <span class="text-body-1 font-weight-bold">Start Game</span>
            <v-btn icon variant="text" size="small" @click="showCampaignDialog = false"><v-icon>mdi-close</v-icon></v-btn>
         </v-card-title>
         <v-card-text class="d-flex flex-column ga-3 pt-2">
            <div class="text-caption text-grey mb-2 text-center">How do you want to start this adventure?</div>
            <v-btn block color="success" size="large" variant="flat" @click="openTutorialChoice">
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

    <v-dialog v-model="tutorialChoiceDialog" max-width="400" persistent>
      <v-card color="#1e1e1e" class="rounded-lg border-thin border-amber">
        <v-card-title class="text-center text-amber-accent-2 cinzel-text pt-4">
          New Adventure Setup
        </v-card-title>
        <v-card-text class="text-center text-grey-lighten-1 pb-4">
          <v-text-field
            v-model="newCampaignName"
            label="Campaign Name"
            variant="outlined"
            bg-color="grey-darken-4"
            color="amber-accent-2"
            hide-details
            class="mb-4 text-left"
          ></v-text-field>

          <v-divider class="mb-4"></v-divider>
          
          <div class="text-body-2 mb-2">
            The <strong>"Start Here"</strong> feature is a <strong>guided gameplay introduction</strong> designed to teach you the basics of Drunagor.
          </div>
          <div class="text-body-2 font-weight-bold text-white">
            Would you like to enable it?
          </div>
        </v-card-text>
        <v-card-actions class="d-flex flex-column gap-2 px-4 pb-4">
          <v-btn block color="success" variant="elevated" size="large" @click="handleTutorialChoice(true)" :disabled="!newCampaignName.trim()">
            <v-icon start>mdi-school</v-icon> Yes, Guide Me
          </v-btn>
          <v-btn block color="grey-darken-3" variant="flat" size="large" @click="handleTutorialChoice(false)" :disabled="!newCampaignName.trim()">
            No, I know how to play
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showLoadDialog" max-width="500" scrollable>
        <v-card color="#1e1e1e" class="rounded-lg">
            <v-card-title class="text-white d-flex justify-space-between align-center">
                <span class="text-body-1 font-weight-bold">Select Campaign to Load</span>
                <v-btn icon variant="text" size="small" @click="showLoadDialog = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            
            <v-card-text class="pa-3" style="max-height: 60vh;">
                <div v-if="loadingCampaigns" class="text-center py-8">
                    <v-progress-circular indeterminate color="amber-accent-4"></v-progress-circular>
                </div>
                <div v-else-if="availableCampaigns.length === 0" class="text-center py-8 text-grey">
                    No matching campaigns found for this Wing.
                </div>
                <div v-else class="d-flex flex-column gap-3">
                    <v-card
                        v-for="campaign in availableCampaigns"
                        :key="campaign.campaigns_fk"
                        class="campaign-load-card position-relative overflow-hidden bg-grey-darken-4"
                        :class="{ 'finished-campaign': extraCampaignData[campaign.campaigns_fk]?.isFinished }"
                        @click="handleSelectCampaign(campaign)"
                    >
                        <v-img v-if="campaign.box === 22 || campaign.campaign === 'core'" src="https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp" height="120" cover></v-img>
                        <v-img v-else-if="campaign.box === 23 || campaign.campaign === 'apocalypse'" src="https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp" height="120" cover></v-img>
                        <v-img v-else-if="campaign.box === 34 || campaign.campaign === 'awakenings'" src="https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp" height="120" cover></v-img>
                        <v-img v-else-if="campaign.box === 38 || campaign.campaign === 'underkeep'" src="@/assets/underkeep.png" height="120" cover></v-img>
                        <v-img v-else src="@/assets/underkeep2.png" height="120" cover></v-img>

                        <div class="overlay-gradient w-100 pa-2 pt-8 d-flex flex-column position-absolute bottom-0">
                            <div class="d-flex justify-space-between align-center w-100 mb-1">
                                <span class="text-subtitle-1 font-weight-bold text-white text-truncate" style="max-width: 80%;">
                                    {{ campaign.party_name || 'Unnamed Campaign' }}
                                </span>
                                <v-chip v-if="extraCampaignData[campaign.campaigns_fk]?.isFinished" color="red-darken-4" size="x-small" variant="flat" class="font-weight-bold">
                                    FINISHED
                                </v-chip>
                            </div>
                            
                            <div v-if="extraCampaignData[campaign.campaigns_fk]?.lastDoorName" class="text-caption text-amber-accent-2 font-weight-bold mb-2">
                                Last Door: <span class="text-white">{{ extraCampaignData[campaign.campaigns_fk].lastDoorName }}</span>
                            </div>

                            <div v-if="extraCampaignData[campaign.campaigns_fk]?.players?.length" class="d-flex flex-wrap gap-2">
                                <v-chip
                                    v-for="player in extraCampaignData[campaign.campaigns_fk].players"
                                    :key="player.rl_campaigns_users_pk"
                                    size="small"
                                    class="bg-black text-white pl-1 pr-2"
                                >
                                    <v-avatar start class="mr-1 border-sm">
                                        <v-img :src="getUserProfileImage(player.picture_hash)" cover></v-img>
                                    </v-avatar>
                                    <span class="text-caption font-weight-medium">{{ player.user_name }}</span>
                                </v-chip>
                            </div>
                        </div>
                    </v-card>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-snackbar 
      v-model="snackbar.show" 
      :color="snackbar.color" 
      timeout="4000" 
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" icon="mdi-close" @click="snackbar.show = false"></v-btn>
      </template>
    </v-snackbar>

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
const heroDataRepository = new HeroDataRepository();

const PLAYING_STATUS_ID = 4;
const DEFAULT_SKU = 39; 

const ALLOWED_HEROES = ['Vorn', 'Elros', 'Lorelai', 'Maya', 'Jaheen'];

const eventDetails = ref<any>(null);
const loadingStart = ref(false);
const isReconnecting = ref(false);
const loadingCampaignAction = ref(false);
const eventId = route.params.id;
const tablePk = computed(() => route.query.table_pk);
const pollingTimer = ref<any>(null);
const heroCache = ref<Record<number, any>>({}); 

const lobbySlots = ref<any[]>([
    { player: null, hero: null, loadingHero: false }, 
    { player: null, hero: null, loadingHero: false }, 
    { player: null, hero: null, loadingHero: false }, 
    { player: null, hero: null, loadingHero: false }
]);

const heroDialog = ref(false);
const heroDialogTab = ref<'mine'|'new'>('mine');
const loadingHeroes = ref(false);
const showCampaignDialog = ref(false);
const tutorialChoiceDialog = ref(false);
const showLoadDialog = ref(false);
const loadingCampaigns = ref(false);
const availableCampaigns = ref<any[]>([]);
const extraCampaignData = ref<Record<string, { lastDoorName: string, isFinished: boolean, players: any[] }>>({});
const selectedCampaign = ref<any>(null); 
const newCampaignName = ref('');
const overlayVisible = computed(() => loadingStart.value || isReconnecting.value);

const snackbar = ref({
  show: false,
  text: '',
  color: 'error'
});

const showAppAlert = (text: string, color: string = 'error') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

const currentUserSlot = computed(() => {
    return lobbySlots.value.find(s => s.player && s.player.users_fk === userStore.user.users_pk) || { player: null, hero: null };
}); 

const isLeader = computed(() => {
    const leaderSlot = lobbySlots.value[0];
    if (!leaderSlot || !leaderSlot.player || !userStore.user) return false;
    return leaderSlot.player.users_fk === userStore.user.users_pk;
});

const allPlayersHaveHero = computed(() => {
    const players = lobbySlots.value.filter(s => s.player !== null);
    if (players.length === 0) return false;
    return players.every(s => s.hero !== null);
});

const mainButtonConfig = computed(() => {
    if (isReconnecting.value) {
        return { text: 'ENTERING GAME...', color: 'amber-darken-4', icon: 'mdi-loading mdi-spin', disabled: true };
    }
    if (isLeader.value) {
        return {
            text: 'START GAME',
            color: allPlayersHaveHero.value ? 'green-darken-1' : 'grey-darken-2',
            icon: 'mdi-play-circle',
            subtext: allPlayersHaveHero.value ? 'Ready to explore Drunagor' : 'Waiting for heroes...',
            disabled: !allPlayersHaveHero.value
        };
    }
    if (!currentUserSlot.value.hero) {
        return { text: 'SELECT YOUR HERO', color: 'blue-darken-3', icon: 'mdi-shield-account', disabled: false };
    }
    return {
        text: 'WAITING FOR LEADER',
        color: 'grey-darken-3',
        icon: 'mdi-check-all',
        subtext: 'You are ready. Leader will start soon.',
        disabled: true
    };
});

const takenHeroNames = computed(() => {
    return lobbySlots.value
        .filter(s => s.hero && s.player && s.player.users_fk !== userStore.user.users_pk)
        .map(s => s.hero.name);
});

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
    })
    .filter(h => ALLOWED_HEROES.includes(h.name))
    .filter(h => !takenHeroNames.value.includes(h.name));
});

const availableHeroesToCreate = computed(() => {
    const allHeroes = heroDataRepository.findAll();
    const existingIds = playableHeroStore.heroes.map(h => h.heroId);
    return allHeroes
        .filter(h => !existingIds.includes(h.id))
        .filter(h => ALLOWED_HEROES.includes(h.name))
        .filter(h => !takenHeroNames.value.includes(h.name));
});

const selectedCampaignName = computed(() => {
    if (!selectedCampaign.value) return 'Unknown';
    return selectedCampaign.value.party_name || `Campaign #${selectedCampaign.value.campaigns_fk}`;
});

const eventDateObj = computed(() => {
  if(!eventDetails.value) return { month: '', day: '', time: '' };
  const d = new Date(eventDetails.value.event_date);
  return {
    month: d.toLocaleDateString('en-US',{month:'short'}).toUpperCase(),
    day: d.getDate(),
    time: d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true})
  }
});

const getUserProfileImage = (pictureHash: string | null) => {
    if (pictureHash) {
        return `https://assets.drunagor.app/Profile/${pictureHash}`;
    }
    return '/assets/hero/avatar/default.webp';
};

const loadExtraData = async (campaignId: string) => {
    try {
        const [doorsRes, playersRes] = await Promise.all([
            axios.get("/rl_campaigns_doors/search", { params: { campaign_fk: campaignId } }),
            axios.get("/rl_campaigns_users/list_players", { params: { campaigns_fk: campaignId } })
        ]);
        
        const doors = doorsRes.data.campaign_doors || [];
        let lastDoorName = "None";
        let isFinished = false;

        if (doors.length > 0) {
            doors.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const latest = doors[0];
            lastDoorName = latest.door_name;
            
            if (latest.doors_fk === 7 || latest.doors_fk === 12 || latest.door_name === "END GAME") {
                isFinished = true;
            }
        }

        const players = playersRes.data.Users || [];

        extraCampaignData.value[campaignId] = {
            lastDoorName,
            isFinished,
            players
        };
    } catch (e) {
        console.error(`Error loading extra info for campaign ${campaignId}:`, e);
    }
};

const clearMyLobbySelection = async () => {
    if (!userStore.user?.users_pk) return;
    heroCache.value = {}; 
    
    try {
        const res = await axios.get("/rl_campaigns_users/search", { 
            params: { users_fk: userStore.user.users_pk } 
        });
        const campaigns = res.data.campaigns || [];
        
        const lobbyEntries = campaigns.filter((c: any) => c.campaigns_fk === null || c.campaigns_fk === undefined || c.campaigns_fk === "null");

        for (const entry of lobbyEntries) {
            await axios.delete(`/rl_campaigns_users/${entry.rl_campaigns_users_pk}/delete/`);
        }
    } catch (e) {
        console.warn("Could not clear previous lobby hero", e);
    }
};

const checkAndRecoverActiveCampaign = async (myPlayerStatus: number) => {
    if (isReconnecting.value || selectedCampaign.value) return;

    if (myPlayerStatus === PLAYING_STATUS_ID) {
        try {
            const searchRes = await axios.get("/rl_campaigns_users/search", { 
                params: { users_fk: userStore.user.users_pk } 
            });
            
            const allCampaigns = searchRes.data.campaigns || [];
            
            const activeCampaigns = allCampaigns
                .filter((c: any) => c.active === true || c.active === 1 || c.active === 'true')
                .sort((a: any, b: any) => b.campaigns_fk - a.campaigns_fk);

            if (activeCampaigns.length > 0) {
                const target = activeCampaigns[0];
                isReconnecting.value = true;
                selectedCampaign.value = target;
                
                setTimeout(() => goToCampaign(), 500);
                return true;
            }
        } catch (e) {
            console.error(e);
        }
    }
    return false;
}

const fetchTablePlayers = async () => {
    if (!eventId || !tablePk.value || isReconnecting.value) return;
    try {
        const tableRes = await axios.get(`/rl_events_users/table_players/${eventId}/${tablePk.value}`);
        const players = tableRes.data.players || [];
        
        const me = players.find((p: any) => p.users_pk === userStore.user.users_pk);
        
        if (me) {
            await checkAndRecoverActiveCampaign(me.event_status_fk);
        }

        const newSlots = [
            { player: null, hero: null, loadingHero: false }, 
            { player: null, hero: null, loadingHero: false }, 
            { player: null, hero: null, loadingHero: false }, 
            { player: null, hero: null, loadingHero: false }
        ];

        for (let i = 0; i < players.length && i < 4; i++) {
            const p = players[i];
            newSlots[i].player = {
                users_fk: p.users_pk,
                name: p.user_name,
                avatar: p.picture_hash ? `https://assets.drunagor.app/Profile/${p.picture_hash}` : 'https://assets.drunagor.app/Profile/user.png',
            };
            
            let heroFk = p.playable_heroes_fk;
            
            if (heroFk) {
                await resolveHeroForSlot(i, heroFk, newSlots[i]);
            }
        }
        
        lobbySlots.value = newSlots;

    } catch (error) { 
        console.error(error);
    }
};

const resolveHeroForSlot = async (slotIndex: number, playableHeroFk: number, slotObj: any) => {
    if (!playableHeroFk) return;
    
    if (heroCache.value[playableHeroFk]) {
        slotObj.hero = heroCache.value[playableHeroFk];
        return;
    }

    try {
        slotObj.loadingHero = true;
        const { data } = await axios.get(`/playable_heroes/${playableHeroFk}`);
        
        if (data && data.hero_hash) {
            const jsonString = atob(data.hero_hash);
            const decodedState = JSON.parse(jsonString);
            const staticId = decodedState.heroId || decodedState.id;

            if (staticId) {
                const staticData = heroDataRepository.find(staticId);
                if (staticData) {
                    const heroData = { 
                        pk: playableHeroFk,
                        name: staticData.name, 
                        image: staticData.images.avatar || staticData.images.token 
                    };
                    heroCache.value[playableHeroFk] = heroData;
                    slotObj.hero = heroData;
                }
            }
        }
    } catch(e) {
        slotObj.hero = { 
            pk: playableHeroFk, 
            name: 'Selected Hero', 
            image: '/assets/hero/avatar/default.webp' 
        };
    } finally {
        slotObj.loadingHero = false;
    }
};

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
        const tableRes = await axios.get(`/rl_events_users/table_players/${eventId}/${tablePk.value}`);
        const players = tableRes.data.players || [];
        const me = players.find((p: any) => p.users_pk === userStore.user.users_pk);

        if (me && me.event_status_fk === PLAYING_STATUS_ID) {
            return;
        }

        // Limpa o cache visual e na api das seleções vazias de herói
        await clearMyLobbySelection(); 

        // Destrói ativamente a conexão antiga de evento deste usuário
        try {
            const checkEvent = await axios.get("/rl_events_users/check-duplicate", {
                params: { users_fk: userStore.user.users_pk, events_fk: eventId, event_tables_fk: tablePk.value }
            });
            if (checkEvent.data.exists && checkEvent.data.existing_relationship) {
                 await axios.delete(`/rl_events_users/${checkEvent.data.existing_relationship.rl_events_users_pk}/delete/`);
            }
        } catch(e) { console.error("Failed clear event relationship", e); }

        // Entra no evento sem enviar a chave playable_heroes_fk para o DB assumir null
        await axios.post('/rl_events_users/cadastro', null, {
            params: {
                users_fk: userStore.user.users_pk,
                events_fk: eventId,
                event_tables_fk: tablePk.value, 
                status: 1, 
                active: true
            }
        });

        // E cria a campanha null sem heroi
        await axios.post('/rl_campaigns_users/cadastro', null, {
            params: {
                users_fk: userStore.user.users_pk,
                skus_fk: DEFAULT_SKU,
                active: true
            }
        });

    } catch (e) { console.error(e); }
};

const selectHero = async (hero: any) => {
    const mySlotIndex = lobbySlots.value.findIndex(s => s.player && s.player.users_fk === userStore.user.users_pk);
    if (mySlotIndex !== -1) lobbySlots.value[mySlotIndex].hero = hero;
    heroDialog.value = false;

    const usersPk = userStore.user.users_pk;

    try {
        await clearMyLobbySelection(); 

        await axios.post('/rl_campaigns_users/cadastro', null, {
            params: {
                users_fk: usersPk,
                skus_fk: DEFAULT_SKU,
                active: true,
                playable_heroes_fk: hero.pk
            }
        });

        // Atualiza a tabela de evento tbm pro endpoint de list_players enxergar
        try {
            const checkEvent = await axios.get("/rl_events_users/check-duplicate", {
                params: { users_fk: usersPk, events_fk: eventId, event_tables_fk: tablePk.value }
            });
            if (checkEvent.data.exists && checkEvent.data.existing_relationship) {
                 await axios.delete(`/rl_events_users/${checkEvent.data.existing_relationship.rl_events_users_pk}/delete/`);
            }
            await axios.post('/rl_events_users/cadastro', null, {
                params: {
                    users_fk: usersPk,
                    events_fk: eventId,
                    event_tables_fk: tablePk.value, 
                    status: 1, 
                    active: true,
                    playable_heroes_fk: hero.pk
                }
            });
        } catch(e) {}

        fetchTablePlayers(); 
    } catch (e) { console.error(e); }
};

const handleMainAction = () => {
    if (!currentUserSlot.value.hero) {
        openHeroSelection();
        return;
    }
    if (isLeader.value && allPlayersHaveHero.value) {
        showCampaignDialog.value = true;
    }
};

const openTutorialChoice = () => {
    showCampaignDialog.value = false;
    newCampaignName.value = eventDetails.value?.store_name || "New Adventure";
    tutorialChoiceDialog.value = true;
}

const handleTutorialChoice = async (wantsTutorial: boolean) => {
    tutorialChoiceDialog.value = false;
    await handleNewCampaign(wantsTutorial);
}

const handleNewCampaign = async (wantsTutorial: boolean) => {
    loadingCampaignAction.value = true;
    const SKU_ID = 39; 
    const CAMPAIGN_TYPE = 'underkeep2';

    try {
        const tempCampaign = new Campaign("temp", CAMPAIGN_TYPE);
        let scenarioName = eventDetails.value?.scenario || 'Wing 04';
        const isWing3 = scenarioName.toLowerCase().includes('wing 03') || scenarioName.toLowerCase().includes('wing 3');
        tempCampaign.wing = isWing3 ? 'Wing 3' : 'Wing 4';
        
        tempCampaign.door = 'First Setup';
        
        const initialHash = generateCampaignHash(tempCampaign);
        const createRes = await axios.post("/campaigns/cadastro", {
             tracker_hash: initialHash,
             conclusion_percentage: 0,
             party_name: newCampaignName.value || "New Adventure",
             box: SKU_ID,
             active: true,
             doors_fk: 1
        });

        const campaignFk = createRes.data.campaign.campaigns_pk;
        const realCampaign = new Campaign(String(campaignFk), CAMPAIGN_TYPE);
        realCampaign.wing = tempCampaign.wing;
        realCampaign.door = 'First Setup';
        const finalHash = generateCampaignHash(realCampaign);

        await axios.put(`/campaigns/alter/${campaignFk}`, {
            tracker_hash: finalHash,
            party_name: newCampaignName.value || "New Adventure"
        });

        // Força a gravação da porta inicial 1 na tabela de histórico de portas
        try {
            await axios.post("/rl_campaigns_doors/cadastro", {
                doors_fk: 1,
                campaign_fk: campaignFk
            });
        } catch (errDoor) {
            console.warn("Failed to insert first setup door", errDoor);
        }

        campaignStore.add(realCampaign);
        await executeStartGameFlow(campaignFk, wantsTutorial, false);

    } catch (e:any) {
        showAppAlert("Error creating campaign: " + (e.response?.data?.message || e.message));
        loadingCampaignAction.value = false;
    } 
};

// ====================================================================================
// NOVA LÓGICA DE FILTRO DE LOAD PELA WING EXATA DO EVENTO
// ====================================================================================
const fetchAndShowLoadDialog = async () => {
    loadingCampaigns.value = true;
    showLoadDialog.value = true;
    try {
         const res = await axios.get("/rl_campaigns_users/search", { params: { users_fk: userStore.user?.users_pk } });
         let camps = res.data.campaigns || [];
         
         // Descobre qual wing o evento que a mesa está usando
         let scenarioName = eventDetails.value?.scenario || 'Wing 04';
         const isWing3 = scenarioName.toLowerCase().includes('wing 03') || scenarioName.toLowerCase().includes('wing 3');
         const expectedWing = isWing3 ? 'Wing 3' : 'Wing 4';

         const filteredCampaigns = [];
         
         for (const camp of camps) {
             try {
                 let campWing = camp.wing;
                 
                 if (!campWing && camp.tracker_hash) {
                     const data = JSON.parse(atob(camp.tracker_hash));
                     campWing = data.campaignData?.wing;
                 }

                 if (campWing && (
                     (isWing3 && campWing.toLowerCase().includes('wing 3')) ||
                     (!isWing3 && campWing.toLowerCase().includes('wing 4'))
                 )) {
                     filteredCampaigns.push(camp);
                 }
             } catch (e) {
                 console.error("Error parsing tracker_hash for campaign", camp.campaigns_fk);
             }
         }

         availableCampaigns.value = filteredCampaigns.sort((a: any, b: any) => b.campaigns_fk - a.campaigns_fk);

         await Promise.allSettled(
             availableCampaigns.value.map((c:any) => loadExtraData(c.campaigns_fk))
         );
    } catch(e) { 
        console.error(e);
    } finally { 
        loadingCampaigns.value = false; 
    }
};

const handleSelectCampaign = async (campaign: any) => {
    if (extraCampaignData.value[campaign.campaigns_fk]?.isFinished) {
        showAppAlert("This campaign is finished and cannot be loaded to play.", "info");
        return;
    }

    loadingCampaignAction.value = true; 
    showLoadDialog.value = false;
    showCampaignDialog.value = false;
    
    await executeStartGameFlow(campaign.campaigns_fk, null, true);
};

const executeStartGameFlow = async (campaignFk: number, wantsTutorial: boolean | null, isLoad: boolean = false) => {
    loadingStart.value = true; 
    showCampaignDialog.value = false;

    if (wantsTutorial !== null) {
        const storageKey = `tutorial_shown_${campaignFk}`;
        if (wantsTutorial === false) {
            sessionStorage.setItem(storageKey, 'true');
        } else {
            sessionStorage.removeItem(storageKey);
        }
    }

    try {
        const currentPlayers = lobbySlots.value.filter(s => s.player !== null && s.hero !== null);
        
        if (isLoad) {
            const playerListStr = currentPlayers.map(slot => {
                return `${slot.player.users_fk},${DEFAULT_SKU},${slot.hero.pk},${eventId}`;
            }).join(';');

            await axios.post('/campaigns/load', null, {
                params: {
                    campaign_pk: campaignFk,
                    player_list: playerListStr,
                    active: true
                }
            });
        } else {
            const linkPromises = currentPlayers.map(async (slot) => {
                const pUserFk = slot.player.users_fk;
                try {
                    const check = await axios.get("/rl_campaigns_users/search", {
                        params: { users_fk: pUserFk, skus_fk: DEFAULT_SKU, active: true }
                    });
                    if (check.data.campaigns && check.data.campaigns.length > 0) {}
                } catch(ignore) {}

                const heroFk = slot.hero?.pk; 
                
                return axios.post('/rl_campaigns_users/cadastro', null, {
                    params: {
                        users_fk: pUserFk,
                        campaigns_fk: campaignFk,
                        skus_fk: DEFAULT_SKU,
                        playable_heroes_fk: heroFk, 
                        active: true
                    }
                });
            });

            await Promise.all(linkPromises);
        }
        
        const statusPromises = currentPlayers.map(async (slot) => {
            const pUserFk = slot.player.users_fk;
            try {
                try {
                    const checkEvent = await axios.get("/rl_events_users/check-duplicate", {
                        params: { 
                            users_fk: pUserFk, 
                            events_fk: eventId, 
                            event_tables_fk: tablePk.value 
                        }
                    });
                    if (checkEvent.data.exists && checkEvent.data.existing_relationship) {
                         await axios.delete(`/rl_events_users/${checkEvent.data.existing_relationship.rl_events_users_pk}/delete/`);
                    }
                } catch (errCheck) { console.warn(errCheck); }

                await axios.post("/rl_events_users/cadastro", null, {
                    params: {
                        users_fk: pUserFk,
                        events_fk: Number(eventId),
                        event_tables_fk: Number(tablePk.value),
                        status: PLAYING_STATUS_ID,
                        active: true
                    }
                });
            } catch (err) { console.error(err); }
        });
        
        await Promise.all(statusPromises);
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        selectedCampaign.value = { campaigns_fk: campaignFk, boxSku: DEFAULT_SKU };
        goToCampaign();

    } catch (e: any) {
        showAppAlert("Failed to start game: " + (e.response?.data?.message || e.message || 'Unknown error'));
        console.error(e);
        loadingStart.value = false;
        loadingCampaignAction.value = false;
    }
}

const goToCampaign = () => {
    if (pollingTimer.value) clearInterval(pollingTimer.value);
    router.push({
        path: `/campaign-tracker/campaign/${selectedCampaign.value.campaigns_fk}`,
        query: { sku: String(selectedCampaign.value.boxSku || DEFAULT_SKU) } 
    });
};

const openHeroSelection = async () => {
    heroDialog.value = true;
    heroDialogTab.value = 'mine';
    loadingHeroes.value = true;
    if (!playableHeroStore.loaded && userStore.user?.users_pk) {
        await playableHeroStore.fetchHeroes(userStore.user.users_pk);
    }
    loadingHeroes.value = false;
};

const createNewHero = async (heroId: string) => {
    loadingHeroes.value = true;
    try {
        await playableHeroStore.createHero(heroId, userStore.user.users_pk);
        await playableHeroStore.fetchHeroes(userStore.user.users_pk);
        const createdHero = myHeroes.value.find(h => h.heroId === heroId);
        if(createdHero) selectHero(createdHero);
        heroDialogTab.value = 'mine';
        heroDialog.value = false;
    } catch(e) { } finally { loadingHeroes.value = false; }
};

const fetchEventDetails = async () => {
    if (!eventId) return;
    try {
        const res = await axios.get('/events/list_events/', { 
            params: { player_fk: userStore.user?.users_pk, past_events: 'false' },
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const found = res.data.events?.find((e:any) => String(e.events_pk) === String(eventId));
        if(found) eventDetails.value = found;
    } catch(e) { }
}

const handleSlotClick = (index: number) => {
    const slot = lobbySlots.value[index];
    if (slot.player?.users_fk === userStore.user.users_pk) openHeroSelection();
};

const clearCampaign = () => { if(isLeader.value) selectedCampaign.value = null; };
const leaveLobby = () => router.go(-1);

onMounted(async () => {
    await fetchEventDetails();
    await clearMyLobbySelection(); 
    if(tablePk.value) await joinTable();
    await fetchTablePlayers(); 
    pollingTimer.value = setInterval(() => fetchTablePlayers(), 3000);
});

onBeforeUnmount(() => {
    if (pollingTimer.value) clearInterval(pollingTimer.value);
});
</script>

<style scoped>
.cinzel-text { font-family: "Cinzel", serif; }
.lobby-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at center, #1f2430 0%, #000000 100%); z-index: 0; }
.responsive-container { margin: 0 auto; background: rgba(0,0,0,0.2); }
@media (min-width: 960px) { .responsive-container { max-width: 480px; box-shadow: 0 0 50px rgba(0,0,0,0.5); } }
@media (max-width: 959px) { .responsive-container { max-width: 100%; width: 100%; } }
.hero-selection-card { cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; border: 1px solid rgba(255,255,255,0.2); }
.hero-selection-card:active { transform: scale(0.98); }
.border-dashed { border: 2px dashed rgba(255,255,255,0.2) !important; }
.player-slot-card { border-color: rgba(255,255,255,0.1); cursor: pointer; transition: all 0.2s; overflow: hidden; }
.player-slot-card:active { transform: scale(0.96); }
.player-overlay-header { position: absolute; top: 0; left: 0; width: 100%; z-index: 2; background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%); display: flex; align-items: center; padding: 8px; }
.z-index-10 { z-index: 10; }

.campaign-load-card {
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.2s, border-color 0.2s;
}
.campaign-load-card:hover {
    border-color: #ffd740;
    transform: scale(0.98);
}
.finished-campaign {
    filter: grayscale(80%) brightness(0.7);
    cursor: not-allowed !important;
}
.finished-campaign:hover {
    transform: none !important;
    border-color: rgba(255,255,255,0.1) !important;
}
.overlay-gradient {
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 60%, transparent 100%);
}
</style>