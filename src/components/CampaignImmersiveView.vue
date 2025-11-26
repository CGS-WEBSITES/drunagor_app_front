<template>
  <div class="immersive-container" :class="{ 'desktop-layout': $vuetify.display.mdAndUp }">
    
    <div 
      class="map-viewport"
      ref="mapContainerRef"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @wheel.prevent="handleZoom"
    >
      <div class="map-content" :style="mapTransformStyle">
        <img
          v-if="currentBackgroundImage"
          :src="currentBackgroundImage"
          class="map-image"
          alt="Campaign Map"
          @error="handleImageError"
        />
        <div v-else class="d-flex align-center justify-center fill-height text-grey bg-black">
          <v-progress-circular indeterminate color="white" />
        </div>
      </div>
    </div>

    <div class="hud-layer">
      
      <div class="hud-area top-left">
        <div class="interactive-content">
          <div class="objective-panel mb-2">
            <div class="objective-label text-uppercase text-caption font-weight-bold text-blue-lighten-3">Current Objective:</div>
            <div class="objective-text text-white font-weight-bold text-shadow">
               {{ currentLocationDisplay }}
            </div>
          </div>

          <v-menu :close-on-content-click="false" v-if="showSaveCampaignButton">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-cog" variant="text" density="compact" color="white" class="opacity-50 hud-icon-btn ml-1"></v-btn>
            </template>
            <v-card min-width="300" class="pa-4 bg-grey-darken-4 border-thin">
              <SelectDoor :campaign-id="campaignId" :campaign-type="campaign.campaign" density="compact" />
            </v-card>
          </v-menu>

          <div class="bookmarks-container mt-4 d-flex flex-column align-start gap-2 pl-1">
             <v-tooltip text="Campaign Book" location="right">
               <template v-slot:activator="{ props }">
                 <div v-bind="props" class="bookmark-tab left-side" @click.stop="openBookDialog('book')">
                    <v-icon icon="mdi-book-open-variant" class="mr-2"></v-icon>
                    <span class="d-none d-md-inline font-weight-bold text-caption">BOOKS</span>
                 </div>
               </template>
             </v-tooltip>

             <v-tooltip text="Interactions / QR" location="right">
               <template v-slot:activator="{ props }">
                 <div v-bind="props" class="bookmark-tab left-side" @click.stop="handleQRCodeAction">
                    <v-icon icon="mdi-qrcode" class="mr-2"></v-icon>
                    <span class="d-none d-md-inline font-weight-bold text-caption">INTERACT</span>
                 </div>
               </template>
             </v-tooltip>

             <v-tooltip text="Keywords" location="right">
               <template v-slot:activator="{ props }">
                 <div v-bind="props" class="bookmark-tab left-side" @click.stop="openBookDialog('book')">
                    <v-icon icon="mdi-book-search-outline" class="mr-2"></v-icon>
                    <span class="d-none d-md-inline font-weight-bold text-caption">KEYWORDS</span>
                 </div>
               </template>
             </v-tooltip>
          </div>
        </div>
      </div>

      <div class="hud-area top-right">
        <div class="interactive-content d-flex flex-column align-end gap-2">
          
          <div class="d-flex flex-row align-center gap-2 mb-1">
            <v-tooltip text="Back to Dashboard" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  icon="mdi-arrow-left" 
                  class="square-hud-btn" 
                  @click="goBack"
                ></v-btn>
              </template>
            </v-tooltip>

            <template v-if="showSaveCampaignButton">
              <v-tooltip text="Save Game" location="bottom">
                 <template v-slot:activator="{ props }">
                    <v-btn 
                      v-bind="props" 
                      icon="mdi-content-save" 
                      class="square-hud-btn" 
                      color="success"
                      @click.stop="confirmSave"
                    ></v-btn>
                 </template>
              </v-tooltip>
              
              <v-tooltip text="Delete Campaign" location="bottom">
                 <template v-slot:activator="{ props }">
                    <v-btn 
                      v-bind="props" 
                      icon="mdi-delete" 
                      class="square-hud-btn" 
                      color="error"
                      @click.stop="confirmDelete"
                    ></v-btn>
                 </template>
              </v-tooltip>
            </template>
          </div>

          <div class="bookmarks-container-right mt-2 d-flex flex-column align-end gap-2 pr-1">
              
              <div v-if="currentMonsters.length > 0" class="d-flex flex-column align-end gap-2">
                  
                  <v-tooltip text="Show/Hide Monsters" location="left">
                    <template v-slot:activator="{ props }">
                        <div 
                            v-bind="props" 
                            class="bookmark-tab right-side" 
                            :class="{ 'active': showMonsters }"
                            @click="showMonsters = !showMonsters"
                        >
                            <span class="d-none d-md-inline font-weight-bold text-caption mr-2">MONSTERS</span>
                            <v-icon :icon="showMonsters ? 'mdi-eye-off' : 'mdi-skull'"></v-icon>
                        </div>
                    </template>
                  </v-tooltip>

                  <transition name="slide-fade">
                    <div v-if="showMonsters" class="monster-panel-right">
                        <div class="monster-cards-container d-flex flex-wrap gap-2 justify-center">
                            <div 
                                v-for="(monster, index) in currentMonsters" 
                                :key="index"
                                class="monster-card"
                                @click.stop="openMonsterZoom(monster)"
                            >
                                <img :src="getMonsterImage(monster)" @error="onMonsterImgError" :alt="monster" />
                            </div>
                        </div>
                    </div>
                  </transition>
              </div>

          </div>

        </div>
      </div>

      <div class="hud-area bottom-left d-flex gap-4 align-end">
         <div class="interactive-content d-flex gap-4">
           <v-tooltip text="Player List" location="top">
              <template v-slot:activator="{ props }">
                 <v-btn v-bind="props" icon="mdi-account-group" class="square-hud-btn" @click.stop="playerListDialogVisible = true"></v-btn>
              </template>
           </v-tooltip>
           <v-tooltip text="Export Campaign" location="top" v-if="showSaveCampaignButton">
              <template v-slot:activator="{ props }">
                 <v-btn v-bind="props" icon="mdi-export" class="square-hud-btn" @click.stop="exportCampaign"></v-btn>
              </template>
           </v-tooltip>
         </div>
      </div>

      <div class="hud-area bottom-center">
        <div class="heroes-rack interactive-content">
           <div 
              v-for="hero in enrichedHeroes" 
              :key="hero.heroId"
              class="hero-token-wrapper"
              @click.stop="openHeroCard(hero)"
              @touchstart.stop="openHeroCard(hero)"
           >
              <div class="hero-token">
                 <v-img 
                    :src="hero.images?.avatar || hero.images?.trackerimage || '/assets/hero/avatar/default.webp'" 
                    cover
                    class="hero-token-img"
                    @error="onImgError"
                 >
                    <template v-slot:placeholder>
                       <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
                          <v-icon icon="mdi-account" color="grey"></v-icon>
                       </div>
                    </template>
                 </v-img>
              </div>
              <div class="hero-name-tag">{{ hero.name }}</div>
           </div>

           <div 
              v-if="showSaveCampaignButton && enrichedHeroes.length < 4"
              class="hero-token-wrapper add-hero"
              @click.stop="addHeroDialogVisible = true"
           >
              <div class="hero-token empty">
                 <v-icon icon="mdi-plus" size="32" color="grey-lighten-1"></v-icon>
              </div>
              <div class="hero-name-tag">Add</div>
           </div>
        </div>
      </div>

      <div class="hud-area bottom-right d-flex flex-column align-end">
         <div class="interactive-content d-flex flex-column align-end">
           <v-btn 
             class="big-action-btn secondary-action mb-2"
             variant="flat"
             @click.stop="readTheScene"
           >
             <v-icon start>mdi-book-open-page-variant</v-icon>
             <span class="d-none d-sm-inline">READ SCENE</span>
             <span class="d-inline d-sm-none">READ</span>
           </v-btn>

           <v-btn 
             v-if="showSaveCampaignButton"
             class="big-action-btn primary-action"
             variant="flat"
             @click.stop="confirmNextDoor"
           >
             <span class="d-none d-sm-inline">OPEN NEXT DOOR</span>
             <span class="d-inline d-sm-none">NEXT</span>
             <v-icon end>mdi-arrow-right-bold</v-icon>
           </v-btn>
         </div>
      </div>
    </div>

    <v-dialog v-model="monsterZoomDialog.visible" max-width="800" class="align-center justify-center">
        <div class="position-relative">
            <v-btn icon="mdi-close" variant="text" color="white" class="position-absolute top-0 right-0 z-index-10" @click="monsterZoomDialog.visible = false"></v-btn>
            <img 
                v-if="monsterZoomDialog.image" 
                :src="monsterZoomDialog.image" 
                class="monster-zoom-img" 
                alt="Monster Zoom" 
            />
        </div>
    </v-dialog>

    <v-dialog v-model="heroCardDialog.visible" max-width="600" scrollable>
       <v-card class="bg-grey-darken-4 rounded-xl hero-detail-card" v-if="heroCardDialog.hero">
        <v-toolbar color="rgba(0,0,0,0.6)" density="compact" theme="dark" class="px-2">
           <v-spacer></v-spacer>
           <v-btn icon="mdi-close" @click="heroCardDialog.visible = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-0 dialog-content-area" style="max-height: 80vh; overflow-y: auto;">
           <div class="hero-tracker-header">
              <v-img v-if="heroCardDialog.hero.images?.trackerInfo || heroCardDialog.hero.images?.background"
                 :src="heroCardDialog.hero.images.trackerInfo || heroCardDialog.hero.images.background"
                 width="100%" max-height="300" cover class="align-end"
                 gradient="to bottom, rgba(0,0,0,0) 60%, rgba(30,30,30,1) 100%">
              </v-img>
              <v-sheet v-else height="100" color="grey-darken-3" class="d-flex align-center justify-center">
                 <span class="text-grey">No Tracker Image</span>
              </v-sheet>
           </div>
           <v-container fluid class="pa-4">
              <HeroDetailSummary :campaign-id="campaignId" :hero-id="heroCardDialog.hero.heroId || heroCardDialog.hero.id" class="mb-4" />
              <v-divider class="my-4 border-opacity-25"></v-divider>
              <CampaignLogSequentialAdventure :campaign-id="campaignId" :hero="heroCardDialog.hero" :hide-manage-button="true" />
           </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="bg-grey-darken-3 pa-4 d-flex justify-space-between">
            <v-btn color="primary" prepend-icon="mdi-heart-pulse" variant="elevated" class="px-6" @click="openResources(heroCardDialog.hero.heroId || heroCardDialog.hero.id)">Resources</v-btn>
            <v-btn color="primary" prepend-icon="mdi-shield-sword" variant="elevated" class="px-6" @click="openEquipment(heroCardDialog.hero.heroId || heroCardDialog.hero.id)">Equipment</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="playerListDialogVisible" max-width="600">
      <v-card title="Player List" class="bg-grey-darken-3">
         <v-card-text>
           <CampaignPlayerList :campaign-id="campaignId" :show-remove-button="showSaveCampaignButton" />
         </v-card-text>
         <v-divider></v-divider>
         <v-card-actions class="d-flex flex-wrap justify-space-around pa-4">
             <v-btn @click="openInviteDialog" variant="elevated" rounded prepend-icon="mdi-account-plus-outline" class="my-2" color="primary">Invite Player</v-btn>
             <v-btn variant="text" @click="playerListDialogVisible = false">Close</v-btn>
         </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="bookDialog.visible" fullscreen transition="dialog-bottom-transition" :scrim="false">
       <v-card color="black">
          <v-toolbar color="primary" density="compact">
             <v-btn icon="mdi-close" @click="bookDialog.visible = false"></v-btn>
             <v-toolbar-title>{{ bookDialog.title }}</v-toolbar-title>
          </v-toolbar>
          <CampaignBook ref="campaignBookRef" :campaign-id="campaignId" />
       </v-card>
    </v-dialog>

    <v-dialog v-model="addHeroDialogVisible" max-width="500">
       <v-card title="Add Hero" class="bg-grey-darken-3">
          <v-card-text class="d-flex flex-wrap justify-center gap-2">
             <CampaignLogAddHero :campaign-id="campaignId" @hero-added="addHeroDialogVisible = false" />
             <CampaignLogImportHero :campaign-id="campaignId" @hero-added="addHeroDialogVisible = false" />
          </v-card-text>
          <v-card-actions><v-btn block @click="addHeroDialogVisible = false">Close</v-btn></v-card-actions>
       </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog.visible" max-width="400">
       <v-card :title="confirmDialog.title" :text="confirmDialog.text" class="bg-grey-darken-3">
          <v-card-actions>
             <v-spacer></v-spacer>
             <v-btn color="grey" @click="confirmDialog.visible = false">Cancel</v-btn>
             <v-btn color="primary" variant="elevated" @click="confirmDialog.onConfirm">Confirm</v-btn>
          </v-card-actions>
       </v-card>
    </v-dialog>

    <v-dialog v-model="wing4ChoiceDialog.visible" max-width="400">
      <v-card class="bg-grey-darken-3 pa-4 text-center">
        <v-card-title class="text-h6 mb-2">Select Path</v-card-title>
        <v-card-text class="mb-4">Which door are you opening?</v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" variant="elevated" class="mx-2" @click="commitWing4Choice('DRACONIC CHAPEL')">Door 1</v-btn>
          <v-btn color="secondary" variant="elevated" class="mx-2" @click="commitWing4Choice('CRYPTS')">Door 2</v-btn>
        </v-card-actions>
        <v-card-actions>
            <v-btn block variant="text" size="small" color="grey" @click="wing4ChoiceDialog.visible = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="visually-hidden">
       <CampaignSavePut 
          ref="savePutRef" 
          :campaign-id="campaignId" 
          @success="onSaveSuccess" 
          @fail="onSaveFail" 
       />
       <CampaignExport ref="campaignExportRef" :campaign-id="campaignId" />
       <CampaignRemove ref="campaignRemoveRef" :campaign-id="campaignId" />
       <ShareCampaignButton ref="shareCampaignRef" :campaignId="campaignId" :inviteCode="partyCode" />
    </div>

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" location="top">{{ snackbar.text }}</v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { CampaignStore } from "@/store/CampaignStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";

// Imports
import CampaignBook from "@/components/CampaignBook.vue";
import CampaignSavePut from "@/components/CampaignSavePut.vue";
import CampaignExport from "@/components/CampaignExport.vue";
import CampaignRemove from "@/components/CampaignRemove.vue";
import CampaignPlayerList from "@/components/CampaignPlayerList.vue";
import CampaignLogAddHero from "@/components/CampaignLogAddHero.vue";
import CampaignLogImportHero from "@/components/CampaignLogImportHero.vue";
import SelectDoor from "@/components/SelectDoor.vue";
import CampaignLogSequentialAdventure from "@/components/CampaignLogSequentialAdventure.vue";
import HeroDetailSummary from "@/components/HeroDetailSummary.vue";
import ShareCampaignButton from "./ShareCampaignButton.vue";

const props = defineProps<{
  campaignId: string;
  campaign: any;
  heroStore: any;
  userStore: any;
  showSaveCampaignButton: boolean;
}>();

const router = useRouter();
const campaignStore = CampaignStore();
const heroDataRepository = new HeroDataRepository();

const campaignBookRef = ref<any>(null);
const savePutRef = ref<InstanceType<typeof CampaignSavePut> | null>(null); // Tipagem correta
const campaignExportRef = ref<any>(null);
const campaignRemoveRef = ref<any>(null);
const shareCampaignRef = ref<any>(null);
const mapContainerRef = ref<HTMLElement | null>(null);

const playerListDialogVisible = ref(false);
const addHeroDialogVisible = ref(false);
const confirmDialog = ref({ visible: false, title: '', text: '', onConfirm: () => {} });
const wing4ChoiceDialog = ref({ visible: false });
const snackbar = ref({ visible: false, text: '', color: 'success' });
const bookDialog = ref({ visible: false, title: 'Campaign Book' });
const heroCardDialog = ref<{ visible: boolean; hero: any | null }>({ visible: false, hero: null });
const partyCode = ref<string | null>(null);

// Estado para controle dos monstros
const showMonsters = ref(true);
const monsterZoomDialog = ref({ visible: false, image: '' });

const enrichedHeroes = computed(() => {
  const heroes = props.heroStore.findAllInCampaign(props.campaignId) || [];
  return heroes.map((h: any) => {
    const id = h.heroId || h.id;
    const staticData = heroDataRepository.find(id) || {};
    return {
      ...staticData,
      ...h,
      images: { ...(staticData.images || {}), ...(h.images || {}) }
    };
  });
});

const heroesInCampaign = enrichedHeroes;

const underkeep2Doors = {
  "WING 3 - ADVANCED": ["FIRST SETUP","DUNGEON FOYER", "QUEEN'S HALL", "THE FORGE", "ARTISAN'S GALLERY", "PROVING GROUNDS", "MAIN HALL"],
  "WING 4 - ADVANCED": ["FIRST SETUP", "DRACONIC CHAPEL", "CRYPTS", "BOTH OPEN", "LIBRARY", "LABORATORY"],
};

const activeCampaignData = computed(() => {
    return campaignStore.find(props.campaignId) || props.campaign || {};
});

const currentLocationDisplay = computed(() => {
  const wing = activeCampaignData.value.wing || 'Unknown Wing';
  const door = activeCampaignData.value.door || 'Setup';
  return `${wing} - ${door}`;
});

// LOGICA DOS MONSTROS
const currentMonsters = computed(() => {
    const data = activeCampaignData.value;
    const wing = (data.wing || '').toUpperCase();
    const door = (data.door || '').toUpperCase();

    if (!wing.includes("WING 3")) return [];

    switch(door) {
        case "FIRST SETUP": return ['archer', 'executioner'];
        case "DUNGEON FOYER": return ['cultist', 'vampire'];
        case "QUEEN'S HALL": return []; 
        case "THE FORGE": return ['cultist', 'abomination'];
        case "ARTISAN'S GALLERY": return []; 
        case "PROVING GROUNDS": return ['archer', 'executioner'];
        case "MAIN HALL": return ['boss']; 
        default: return [];
    }
});

function getMonsterImage(monsterName: string) {
    try {
       return new URL(`../assets/campaign_monsters/wing3/${monsterName}.png`, import.meta.url).href;
    } catch (e) {
       console.error(`Erro imagem monstro: ${monsterName}`, e);
       return '';
    }
}

function onMonsterImgError(e: any) {
    e.target.style.display = 'none';
}

function openMonsterZoom(monsterName: string) {
    monsterZoomDialog.value.image = getMonsterImage(monsterName);
    monsterZoomDialog.value.visible = true;
}

// LÓGICA DO MAPA
const currentBackgroundImage = computed(() => {
  const data = activeCampaignData.value;
  const wing = (data.wing || '').toUpperCase();
  const door = (data.door || '').toUpperCase();
  
  if (!wing) return '';

  let wingFolder = '';
  if (wing.includes('WING 3')) wingFolder = 'wing3';
  if (wing.includes('WING 4')) wingFolder = 'wing4';
  if (!wingFolder) return '';

  let doorFile = 'setup';
  
  if (wingFolder === 'wing4') {
     if (door.includes('FIRST SETUP')) doorFile = 'setup';
     else if (door === 'DRACONIC CHAPEL') doorFile = 'first_door'; 
     else if (door === 'CRYPTS') doorFile = 'first_door2'; 
     else if (door === 'BOTH OPEN') doorFile = 'second_door';
     else if (door === 'LIBRARY') doorFile = 'third_door';
     else if (door === 'LABORATORY') doorFile = 'fourth_door';
     else doorFile = 'setup';
  } else {
     if (door.includes('FIRST SETUP')) {
         doorFile = 'setup';
     } else {
         const doorsList = underkeep2Doors["WING 3 - ADVANCED"];
         const index = doorsList.indexOf(door);
         const doorMap = ['setup', 'first_door', 'second_door', 'third_door', 'fourth_door', 'fifth_door', 'sixth_door', 'seventh_door'];
         doorFile = doorMap[index] || 'setup';
     }
  }

  try {
      return new URL(`../assets/campaign_background/${wingFolder}.${doorFile}.png`, import.meta.url).href;
  } catch (e) {
      console.error(`Erro ao carregar imagem: ${wingFolder}.${doorFile}.png`, e);
      return '';
  }
});

const transform = ref({ x: 0, y: 0, scale: 1 });
let isDragging = false;
let startPos = { x: 0, y: 0 };

const mapTransformStyle = computed(() => ({
  transform: `translate(${transform.value.x}px, ${transform.value.y}px) scale(${transform.value.scale})`,
  transformOrigin: 'center center',
  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
}));

const generatePartyCode = () => {
  const prefix = Math.floor(1000 + Math.random() * 9000).toString();
  partyCode.value = `${prefix}${props.campaignId}`;
};

onMounted(() => {
  generatePartyCode();
});

function handleZoom(e: WheelEvent) {
  const zoomSpeed = 0.1;
  const newScale = transform.value.scale + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed);
  transform.value.scale = Math.min(Math.max(1, newScale), 3);
}

function startDrag(e: MouseEvent | TouchEvent) {
  isDragging = true;
  const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
  startPos = { x: cx - transform.value.x, y: cy - transform.value.y };
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('touchmove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchend', stopDrag);
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging) return;
  const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
  transform.value.x = cx - startPos.x;
  transform.value.y = cy - startPos.y;
}

function stopDrag() {
  isDragging = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchend', stopDrag);
}

function handleImageError(e: Event) {
   console.warn('Erro ao carregar imagem de fundo do mapa.');
}

function openHeroCard(hero: any) {
  if (!hero) return;
  const id = hero.heroId || hero.id;
  if (!id) {
    snackbar.value = { visible: true, text: 'Error: Invalid Hero Data', color: 'error' };
    return;
  }
  heroCardDialog.value = { visible: true, hero: hero };
}

function onImgError(e: any) {
   e.target.src = '/assets/hero/avatar/default.webp'; 
}

function handleQRCodeAction() {
   openBookDialog('interactions');
}

function openBookDialog(mode: 'book' | 'interactions') {
  bookDialog.value = { visible: true, title: mode === 'book' ? 'Campaign Book' : 'Interactions' };
  nextTick(() => {
     if (campaignBookRef.value) {
        if (mode === 'interactions') campaignBookRef.value.navigateToInteract?.();
        else campaignBookRef.value.goBackToBooks?.();
     }
  });
}

function openInviteDialog() {
  if (shareCampaignRef.value && typeof shareCampaignRef.value.openDialog === 'function') {
    shareCampaignRef.value.openDialog();
  }
}

function openResources(heroId: string | undefined) {
   if (!heroId) return;
   heroCardDialog.value.visible = false;
   router.push({ name: "HeroSequentialState", params: { campaignId: props.campaignId, heroId } });
}

function openEquipment(heroId: string | undefined) {
   if (!heroId) return;
   heroCardDialog.value.visible = false;
   router.push({ name: "Hero", params: { campaignId: props.campaignId, heroId } });
}

function exportCampaign() {
   campaignExportRef.value?.export();
}

function goBack() {
  router.push({ name: 'Campaign Overview' });
}

// FUNÇÃO DE SALVAR CORRIGIDA
async function confirmSave() {
   confirmDialog.value = {
      visible: true, title: 'Save Campaign', text: 'Save current progress?',
      onConfirm: async () => { 
        confirmDialog.value.visible = false; 
        
        // Verificação extra de segurança e Log para debug
        if (savePutRef.value) {
            try {
                console.log("Tentando salvar...");
                await savePutRef.value.save();
            } catch (error) {
                console.error("Erro ao chamar save() no componente filho:", error);
                onSaveFail();
            }
        } else {
            console.error("Referência savePutRef não encontrada ou nula.");
            snackbar.value = { visible: true, text: 'Internal Error: Save component not loaded.', color: 'error' };
        }
      }
   };
}

function confirmDelete() {
   confirmDialog.value = {
      visible: true, title: 'Delete Campaign', text: 'This action cannot be undone. Are you sure?',
      onConfirm: () => { 
        campaignRemoveRef.value?.openDialog(); 
        confirmDialog.value.visible = false; 
      }
   };
}

function onSaveSuccess() { 
    snackbar.value = { visible: true, text: 'Campaign saved successfully!', color: 'success' }; 
}

function onSaveFail() { 
    snackbar.value = { visible: true, text: 'Error saving campaign.', color: 'error' }; 
}

function readTheScene() {
   openBookDialog('book');
}

function confirmNextDoor() {
   confirmDialog.value = {
      visible: true, title: 'Next Door', text: 'Advance to the next stage of the campaign?',
      onConfirm: () => { 
        nextDoorLogic(); 
        confirmDialog.value.visible = false; 
      }
   };
}

function commitWing4Choice(choice: string) {
    campaignStore.updateCampaignProperty(props.campaignId, 'door', choice);
    wing4ChoiceDialog.value.visible = false;
    snackbar.value = { visible: true, text: `Path chosen`, color: 'success' };
}

function nextDoorLogic() {
    const data = activeCampaignData.value;
    const wing = (data.wing || '').toUpperCase();
    const currentDoor = (data.door || '').toUpperCase();
    
    if (!wing || !currentDoor) return;

    if (wing === "WING 4 - ADVANCED") {
        if (currentDoor === "FIRST SETUP") {
            wing4ChoiceDialog.value.visible = true;
            return;
        }

        if (currentDoor === "DRACONIC CHAPEL" || currentDoor === "CRYPTS") {
            campaignStore.updateCampaignProperty(props.campaignId, 'door', "BOTH OPEN");
            snackbar.value = { visible: true, text: 'Both paths are now accessible!', color: 'success' };
            return;
        }
        
        if (currentDoor === "BOTH OPEN") {
             campaignStore.updateCampaignProperty(props.campaignId, 'door', "LIBRARY");
             snackbar.value = { visible: true, text: 'Opened the Library!', color: 'success' };
             return;
        }
    }

    const doorsList = underkeep2Doors[wing as keyof typeof underkeep2Doors];
    if (!doorsList) return;
    const idx = doorsList.indexOf(currentDoor);
    
    if (idx >= 0 && idx < doorsList.length - 1) {
        campaignStore.updateCampaignProperty(props.campaignId, 'door', doorsList[idx + 1]);
        snackbar.value = { visible: true, text: 'Advanced to next stage!', color: 'success' };
    } else {
        snackbar.value = { visible: true, text: 'End of Wing: No more doors to open!', color: 'warning' };
    }
}
</script>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ESTILOS BASE */
.immersive-container {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  overflow: hidden;
  background-color: #000;
  color: white;
  font-family: 'Cinzel', serif;
}

.immersive-container.desktop-layout {
  top: 64px;
  height: calc(100vh - 64px);
}

@media (orientation: portrait) {
  .immersive-container {
     width: 100vh;
     height: 100vw;
     position: fixed;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%) rotate(90deg);
     z-index: 0;
  }
}

.map-viewport {
  width: 100%; height: 100%;
  background: #050505;
  overflow: hidden;
  cursor: grab;
}
.map-viewport:active { cursor: grabbing; }
.map-content {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}
.map-image {
  max-width: none; width: 100%; height: 100%;
  object-fit: contain;
  pointer-events: none; 
  filter: drop-shadow(0 0 20px rgba(0,0,0,0.8));
}

.hud-layer {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  padding: 24px;
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: 100px 1fr 120px;
  z-index: 10;
}

.hud-area { pointer-events: none; }
.interactive-content, .bookmark-tab, .admin-buttons-group, .heroes-rack, .big-action-btn, .square-hud-btn, .monster-card, .monster-toggle-btn {
  pointer-events: auto;
}

.top-left { grid-area: 1 / 1; display: flex; flex-direction: column; }
.top-right { grid-area: 1 / 3; display: flex; flex-direction: column; align-items: flex-end; }
.bottom-left { grid-area: 3 / 1; display: flex; align-items: flex-end; }
.bottom-center { 
  grid-area: 3 / 2; 
  display: flex; align-items: flex-end; justify-content: center;
  z-index: 20;
}
.bottom-right { grid-area: 3 / 3; display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-end; }

/* BOOKMARK TABS */
.bookmark-tab {
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid #444;
  color: #ccc;
  padding: 8px 12px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  min-width: 40px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
}

.bookmark-tab:hover, .bookmark-tab.active {
  background: rgba(40, 40, 40, 1);
  color: white;
}

.bookmark-tab.left-side {
  border-left: 3px solid #d4af37;
  border-radius: 0 8px 8px 0;
  margin-left: 0;
}
.bookmark-tab.left-side:hover {
  transform: translateX(5px);
  border-left-color: #ffc107;
}

.bookmark-tab.right-side {
  border-right: 3px solid #d4af37;
  border-radius: 8px 0 0 8px; 
  margin-right: 0;
  justify-content: flex-end; 
}
.bookmark-tab.right-side:hover, .bookmark-tab.right-side.active {
  transform: translateX(-5px); 
  border-right-color: #ffc107;
}

/* CSS DOS MONSTROS */
.monster-panel-right {
    margin-top: 4px;
    padding-right: 4px;
}

/* Container limitado a 2 cards de largura aprox (60+gap) para forçar quebra se houver muitos, mas centralizado */
.monster-cards-container {
    max-width: 150px; 
}

.monster-card {
    width: 60px;
    height: 90px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    background: rgba(0, 0, 0, 0.6);
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 6px rgba(0,0,0,0.5);
    transition: transform 0.2s;
    cursor: zoom-in;
}

.monster-card:hover {
    transform: scale(1.1);
    z-index: 50;
    border-color: #b71c1c;
}

.monster-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ZOOM */
.monster-zoom-img {
    max-width: 90vw;
    max-height: 80vh;
    border-radius: 8px;
    box-shadow: 0 0 30px rgba(0,0,0,0.8);
    border: 2px solid #333;
}
.z-index-10 { z-index: 10; }

/* Transições */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* BOTOES */
.square-hud-btn {
  width: 48px; height: 48px;
  border-radius: 8px;
  background: rgba(20, 20, 20, 0.9) !important;
  border: 1px solid #444;
  color: white !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
  transition: all 0.2s ease;
}
.square-hud-btn:hover {
  background: rgba(40, 40, 40, 0.95) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.7);
}

.objective-panel {
  background: rgba(0, 0, 0, 0.7);
  border-left: 4px solid #42a5f5;
  padding: 8px 12px;
  backdrop-filter: blur(4px);
  border-radius: 0 8px 8px 0;
}

.heroes-rack {
  display: flex;
  gap: 16px;
  padding: 10px;
  background: none;
  box-shadow: none;
}

.hero-token-wrapper {
  display: flex; flex-direction: column; align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  position: relative;
  z-index: 30;
}
.hero-token-wrapper:hover { 
  transform: translateY(-5px); 
  filter: brightness(1.2);
}

.hero-token {
  width: 80px; height: 120px;
  border-radius: 6px;
  overflow: hidden;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

.hero-token.empty {
  height: 80px;
  border-radius: 50%;
  border: 2px dashed #666;
  display: flex; align-items: center; justify-content: center;
  opacity: 0.6;
}

.hero-token-img {
  width: 100%; height: 100%;
  object-fit: cover;
}

.hero-name-tag {
  margin-top: 4px;
  background: rgba(0,0,0,0.8);
  color: #ddd;
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.big-action-btn {
  font-family: 'Cinzel', sans-serif;
  font-weight: bold;
  letter-spacing: 1px;
  height: 56px !important;
  min-width: 200px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

.primary-action {
  background: linear-gradient(135deg, #b71c1c 0%, #880e4f 100%);
  color: white;
  font-size: 1.1rem;
}

.secondary-action {
  background: rgba(40, 40, 40, 0.9);
  color: #ccc;
  border: 1px solid #555;
}

@media (max-width: 960px) {
  .hud-layer {
    padding: 8px;
    grid-template-columns: 1fr 1fr; 
    grid-template-rows: auto 1fr auto;
  }

  .top-left { grid-area: 1 / 1; }
  .top-right { grid-area: 1 / 2; }
  
  .bottom-left { 
    grid-area: 3 / 1; 
    align-self: flex-end !important; 
    margin-bottom: 4px;
    z-index: 25;
  }
  
  .bottom-right {
    grid-area: 3 / 2; 
    align-self: flex-end !important; 
    justify-content: flex-end;
    padding-right: 4px;
    margin-bottom: 4px;
    z-index: 25;
  }

  .bottom-center {
    grid-area: 3 / 1 / 4 / 3;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 0;
    z-index: 20; 
  }
  
  .heroes-rack {
    padding: 5px;
    gap: 10px;
  }
  
  .hero-token {
    width: 50px; height: 75px;
    border-radius: 4px;
  }
  
  .hero-name-tag { display: none; }

  .square-hud-btn {
    width: 36px !important;
    height: 36px !important;
    font-size: 0.9rem;
  }
  
  .bookmark-tab {
      padding: 6px 8px;
      min-width: 36px;
  }
  
  .objective-panel { padding: 2px 6px; }
  .objective-label { font-size: 0.5rem !important; }
  .objective-text { font-size: 0.7rem !important; }

  .big-action-btn {
    height: 36px !important;
    min-width: unset;
    padding: 0 10px;
    font-size: 0.75rem;
  }

  .monster-card {
      width: 40px;
      height: 60px;
  }
}
</style>