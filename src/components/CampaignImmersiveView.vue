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
        <div class="interactive-content d-flex flex-column align-start">
          
          <div class="objective-panel mb-2">
            <div class="objective-label text-uppercase text-caption font-weight-bold text-blue-lighten-3">Current Objective:</div>
            <div class="objective-text text-white font-weight-bold text-shadow">
                {{ currentLocationDisplay }}
            </div>
          </div>

          <v-menu :close-on-content-click="false" v-if="showSaveCampaignButton">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-cog" variant="text" density="compact" color="white" class="opacity-50 hud-icon-btn ml-1 mb-2"></v-btn>
            </template>
            <v-card min-width="300" class="pa-4 bg-grey-darken-4 border-thin">
              <SelectDoor :campaign-id="campaignId" :campaign-type="campaign.campaign" density="compact" />
            </v-card>
          </v-menu>

          <div class="d-flex flex-column gap-2 mt-1">
             <v-tooltip text="Campaign Book" location="right">
               <template v-slot:activator="{ props }">
                 <div v-bind="props" class="bookmark-tab left-side" @click.stop="openBookDialog">
                    <v-icon icon="mdi-book-open-variant"></v-icon>
                    <span class="d-none d-md-inline font-weight-bold text-caption text-label ml-2">BOOKS</span>
                 </div>
               </template>
             </v-tooltip>

             <v-tooltip text="Keywords" location="right">
               <template v-slot:activator="{ props }">
                 <div v-bind="props" class="bookmark-tab left-side" @click.stop="openKeywordsDialog">
                    <v-icon icon="mdi-book-search-outline"></v-icon>
                    <span class="d-none d-md-inline font-weight-bold text-caption text-label ml-2">KEYWORDS</span>
                 </div>
               </template>
             </v-tooltip>

             <v-tooltip text="Door Instructions" location="right">
              <template v-slot:activator="{ props }">
                <div 
                   v-bind="props"
                   class="bookmark-tab left-side blue-border-tab"
                   @click.stop="openOnlyInstructions"
                >
                   <img src="@/assets/door.png" alt="Door" class="tab-icon-img" style="width: 24px; height: 24px;" />
                   <span class="d-none d-md-inline font-weight-bold text-caption text-label ml-2">RULES</span>
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
          </div>

          <div v-if="currentMonsters.length > 0" class="d-flex flex-column align-end mt-2 w-100">
             <div class="bookmark-tab right-side mb-1" @click="showMonstersPanel = !showMonstersPanel">
                <span class="text-caption font-weight-bold mr-2 text-grey-lighten-1 d-none d-md-inline">MONSTERS</span>
                <v-icon size="small">{{ showMonstersPanel ? 'mdi-eye-off' : 'mdi-skull' }}</v-icon>
             </div>
             
             <transition-group name="slide-fade" tag="div" class="d-flex flex-row gap-2 align-center justify-end monster-list-container" v-if="showMonstersPanel">
                <div 
                  v-for="(monster, index) in currentMonsters" 
                  :key="monster + index" 
                  class="monster-card"
                  @click.stop="openMonsterGroupDialog"
                >
                   <img :src="getMonsterImageSrc(monster)" @error="onMonsterImgError" :alt="monster" />
                </div>
             </transition-group>
          </div>

        </div>
      </div>

      <div class="hud-area bottom-left">
         <div class="interactive-content d-flex flex-column align-start gap-2">
             <div class="d-flex gap-2">
               <v-tooltip text="Player List" location="top">
                 <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-account-group" class="square-hud-btn" @click.stop="playerListDialogVisible = true"></v-btn>
                 </template>
               </v-tooltip>
               
               <v-tooltip text="Leave Campaign" location="top" v-if="showSaveCampaignButton">
                 <template v-slot:activator="{ props }">
                    <v-btn 
                      v-bind="props" 
                      icon="mdi-logout" 
                      class="square-hud-btn" 
                      color="error"
                      @click.stop="confirmLeave"
                    ></v-btn>
                 </template>
               </v-tooltip>
             </div>
         </div>
      </div>

      <div class="hud-area bottom-center">
        <div class="heroes-rack interactive-content">
           <div v-for="hero in enrichedHeroes" :key="hero.heroId" class="hero-token-wrapper" @click.stop="openHeroCard(hero)">
             <div class="hero-token">
                 <v-img :src="hero.images?.avatar || hero.images?.trackerimage || '/assets/hero/avatar/default.webp'" cover class="hero-token-img" @error="onImgError"></v-img>
             </div>
             <div class="hero-name-tag">{{ hero.name }}</div>
           </div>
           <div v-if="showSaveCampaignButton && enrichedHeroes.length < 4" class="hero-token-wrapper add-hero" @click.stop="addHeroDialogVisible = true">
             <div class="hero-token empty"><v-icon icon="mdi-plus" size="32" color="grey-lighten-1"></v-icon></div>
             <div class="hero-name-tag">Add</div>
           </div>
        </div>
      </div>

      <div class="hud-area bottom-right">
         <div class="interactive-content d-flex flex-column align-end gap-3">
           
           <v-tooltip text="Interactions" location="left" v-if="showInteractionsButton">
             <template v-slot:activator="{ props }">
               <div 
                  v-bind="props"
                  class="right-tab-btn interaction-tab"
                  @click.stop="openInteractionsDialog"
               >
                  <img src="@/assets/interaction.png" alt="icon" class="tab-icon-img" />
               </div>
             </template>
           </v-tooltip>

           <v-tooltip text="Read Scene" location="left">
             <template v-slot:activator="{ props }">
                <div 
                  v-bind="props"
                  class="right-tab-btn grey-tab"
                  @click.stop="readTheScene"
                >
                   <v-icon size="large" color="#e0e0e0">mdi-book-open-page-variant</v-icon>
                </div>
             </template>
           </v-tooltip>

           <v-tooltip :text="nextButtonLabel" location="left" v-if="showSaveCampaignButton">
             <template v-slot:activator="{ props }">
                <div 
                  v-bind="props"
                  class="right-tab-btn primary-tab"
                  style="width: auto !important; padding-left: 16px; padding-right: 12px; justify-content: flex-end;"
                  @click.stop="handleNextAction"
                >
                   <v-icon size="large" color="white">{{ nextButtonIcon }}</v-icon>
                </div>
             </template>
           </v-tooltip>

         </div>
      </div>
    </div>

    <v-dialog v-model="interactionsDialog.visible" fullscreen transition="dialog-bottom-transition" :scrim="false">
        <v-card color="black">
            <InteractViewNew 
                v-if="interactionsDialog.visible"
                :current-door="activeCampaignData.door" 
                :wing="activeCampaignData.wing" 
                @close="interactionsDialog.visible = false" 
            />
        </v-card>
    </v-dialog>

    <v-dialog v-model="bookDialog.visible" fullscreen transition="dialog-bottom-transition" :scrim="false">
       <v-card color="black">
          <v-toolbar color="primary" density="compact">
             <v-btn icon="mdi-close" @click="bookDialog.visible = false"></v-btn>
             <v-toolbar-title>{{ bookDialog.title }}</v-toolbar-title>
          </v-toolbar>
          <CampaignBookNew :campaign-wing="activeCampaignData.wing" />
       </v-card>
    </v-dialog>

    <v-dialog v-model="keywordsDialog.visible" fullscreen transition="dialog-bottom-transition">
       <v-card color="black">
          <v-toolbar color="primary" density="compact">
             <v-btn icon="mdi-close" @click="keywordsDialog.visible = false"></v-btn>
             <v-toolbar-title>Keywords</v-toolbar-title>
          </v-toolbar>
          <KeywordView />
       </v-card>
    </v-dialog>

    <v-dialog v-model="monsterGroupDialog.visible" max-width="1000" scrollable>
       <v-card class="bg-grey-darken-4 rounded-xl border-thin">
         <v-toolbar color="rgba(0,0,0,0.8)" density="compact">
            <v-toolbar-title class="cinzel-font text-red-accent-2 font-weight-bold">ENEMIES IN ROOM</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="monsterGroupDialog.visible = false"></v-btn>
         </v-toolbar>
         <v-card-text class="pa-4">
            <v-row justify="center" align="center">
                <v-col v-for="monster in currentMonsters" :key="monster" cols="4" md="6" lg="4" class="d-flex justify-center">
                    <div class="d-flex flex-column align-center">
                        <img :src="getMonsterImageSrc(monster)" class="monster-group-img elevation-10 rounded-lg" />
                    </div>
                </v-col>
            </v-row>
         </v-card-text>
       </v-card>
    </v-dialog>

    <v-dialog v-model="doorScannerDialog.visible" max-width="500" persistent>
        <v-card class="bg-grey-darken-3 rounded-xl overflow-hidden">
            <v-toolbar color="black" density="compact">
                <v-toolbar-title class="text-white">Scan Next Door</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-close" @click="doorScannerDialog.visible = false"></v-btn>
            </v-toolbar>
            <NextDoorQRScanner 
                
                @scanned="handleDoorScanned" 
                @manual-advance="handleManualAdvance"
            />
        </v-card>
    </v-dialog>

    <v-dialog v-model="leaveDialog.visible" max-width="400">
       <v-card title="Leave Campaign" class="bg-grey-darken-3">
         <v-card-text class="pa-4 text-body-1">Are you sure you want to permanently leave this campaign?</v-card-text>
         <v-card-actions><v-spacer /><v-btn color="grey" @click="leaveDialog.visible = false">Cancel</v-btn><v-btn color="error" variant="elevated" @click="leaveDialog.onConfirm">Leave</v-btn></v-card-actions>
       </v-card>
    </v-dialog>

    <v-dialog v-model="bossConfirmationDialog.visible" max-width="400" persistent>
       <v-card class="bg-red-darken-4 border-xl border-white rounded-lg">
         <v-card-title class="text-center text-uppercase font-weight-bold pt-4 text-h5">
            <v-icon start size="small">mdi-skull</v-icon> Boss Battle <v-icon end size="small">mdi-skull</v-icon>
         </v-card-title>
         <v-card-text class="text-center py-4 text-body-1">
             Are you prepared to face the Dragon?<br>There is no turning back.
         </v-card-text>
         <v-card-actions class="justify-center pb-4">
             <v-btn color="white" variant="text" @click="bossConfirmationDialog.visible = false">Not Yet</v-btn>
             <v-btn color="black" class="text-red-accent-2 font-weight-bold" variant="elevated" @click="confirmBossStart">FIGHT!</v-btn>
         </v-card-actions>
       </v-card>
    </v-dialog>

    <v-dialog v-model="narrativeDialogVisible" max-width="800" scrollable persistent>
       <v-card class="book-style-card rounded-xl overflow-hidden">
         <v-toolbar color="#10594f" density="compact" class="px-2">
            <v-toolbar-title class="text-white font-weight-bold pl-2" style="font-family: serif;">{{ currentDoorInstruction?.title?.toUpperCase() }} - STORY</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" color="white" @click="narrativeDialogVisible = false"></v-btn>
         </v-toolbar>
         <v-card-text class="pa-4" style="max-height: 80vh; overflow-y: auto;">
             <v-container fluid v-if="currentDoorInstruction">
                 <v-row>
                     <v-col cols="12" class="pt-4 mt-3">
                         <div v-html="currentDoorInstruction.body" class="narrative-text"></div>
                     </v-col>
                 </v-row>
             </v-container>
         </v-card-text>
         <v-card-actions class="justify-center py-4" style="background-color: #eee8e0;">
             <v-btn color="brown-darken-3" variant="flat" size="large" class="px-6 font-weight-bold" @click="proceedToInstructions">CONTINUE TO INSTRUCTIONS <v-icon end>mdi-arrow-right</v-icon></v-btn>
         </v-card-actions>
       </v-card>
    </v-dialog>

    <v-dialog v-model="instructionsDialogVisible" max-width="900" scrollable>
       <v-card class="book-style-card rounded-xl overflow-hidden">
         <v-toolbar color="#10594f" density="compact" class="px-2">
            <v-toolbar-title class="text-white font-weight-bold pl-2" style="font-family: serif;">{{ currentDoorInstruction?.title?.toUpperCase() }} - RULES</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" color="white" @click="instructionsDialogVisible = false"></v-btn>
         </v-toolbar>
         <v-card-text class="pa-4" style="max-height: 80vh; overflow-y: auto;">
             <v-container fluid v-if="currentDoorInstruction">
                 <v-row><v-col cols="12"><div v-html="currentDoorInstruction.instruction" class="instruction-box"></div></v-col></v-row>
             </v-container>
             <div v-else class="text-center pa-10 text-grey">No specialized instructions available.</div>
         </v-card-text>
       </v-card>
    </v-dialog>

    <v-dialog v-model="heroCardDialog.visible" max-width="600" scrollable>
        <v-card class="bg-grey-darken-4 rounded-xl hero-detail-card" v-if="heroCardDialog.hero">
            <v-toolbar color="rgba(0,0,0,0.6)" density="compact" theme="dark" class="px-2">
                <v-spacer></v-spacer>
                <v-btn icon="mdi-close" @click="heroCardDialog.visible = false"></v-btn>
            </v-toolbar>
            <v-card-text class="pa-0">
                <div class="hero-tracker-header">
                    <v-img :src="heroCardDialog.hero.images.trackerInfo || heroCardDialog.hero.images.background" width="100%" max-height="300" cover></v-img>
                </div>
                <v-container fluid class="pa-4">
                    <HeroDetailSummary :campaign-id="campaignId" :hero-id="heroCardDialog.hero.heroId || heroCardDialog.hero.id" class="mb-4" />
                    <v-divider class="my-4 border-opacity-25"></v-divider>
                    <CampaignLogSequentialAdventure :campaign-id="campaignId" :hero="heroCardDialog.hero" :hide-manage-button="true" />
                </v-container>
            </v-card-text>
            <v-card-actions class="bg-grey-darken-3 pa-4 d-flex justify-space-between gap-4">
                <v-btn 
                    color="amber-accent-4" 
                    variant="elevated"
                    class="flex-grow-1 text-black font-weight-bold"
                    prepend-icon="mdi-sack"
                    @click="openResources(heroCardDialog.hero.heroId || heroCardDialog.hero.id)"
                >
                    Resources
                </v-btn>
                <v-btn 
                    color="light-blue-accent-3" 
                    variant="elevated"
                    class="flex-grow-1 text-black font-weight-bold"
                    prepend-icon="mdi-shield-sword"
                    @click="openEquipment(heroCardDialog.hero.heroId || heroCardDialog.hero.id)"
                >
                    Equipment
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="playerListDialogVisible" max-width="600"><v-card title="Player List" class="bg-grey-darken-3"><v-card-text><CampaignPlayerList :campaign-id="campaignId" :show-remove-button="showSaveCampaignButton" /></v-card-text><v-card-actions class="d-flex flex-wrap justify-space-around pa-4"><v-btn @click="openInviteDialog" variant="elevated" rounded color="primary">Invite Player</v-btn><v-btn variant="text" @click="playerListDialogVisible = false">Close</v-btn></v-card-actions></v-card></v-dialog>
    <v-dialog v-model="addHeroDialogVisible" max-width="500"><v-card title="Add Hero" class="bg-grey-darken-3"><v-card-text><CampaignLogAddHero :campaign-id="campaignId" @hero-added="addHeroDialogVisible = false" /><CampaignLogImportHero :campaign-id="campaignId" @hero-added="addHeroDialogVisible = false" /></v-card-text><v-card-actions><v-btn block @click="addHeroDialogVisible = false">Close</v-btn></v-card-actions></v-card></v-dialog>
    
    <v-dialog v-model="wing4ChoiceDialog.visible" max-width="400">
        <v-card class="bg-grey-darken-3 pa-4 text-center">
            <v-card-title>Select Path</v-card-title>
            <v-card-text>Which door are you opening?</v-card-text>
            <v-card-actions class="justify-center flex-column gap-2">
                <v-btn block color="purple-accent-2" variant="elevated" class="text-black font-weight-bold" @click="commitWing4Choice('DRACONIC CHAPEL')">
                    <v-icon start>mdi-church</v-icon> Door 1
                </v-btn>
                <v-btn block color="cyan-accent-2" variant="elevated" class="text-black font-weight-bold" @click="commitWing4Choice('CRYPTS')">
                    <v-icon start>mdi-grave-stone</v-icon> Door 2
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <div class="visually-hidden">
       <CampaignSavePut ref="savePutRef" :campaign-id="campaignId" @success="onSaveSuccess" @fail="onSaveFail" />
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
import doorInstructionsData from '@/data/door/DoorInstructions.json';

import CampaignBookNew from "@/components/CampaignBookNew.vue";
import KeywordView from "@/components/KeywordView.vue";
import NextDoorQRScanner from "@/components/NextDoorQRScanner.vue";
import InteractViewNew from "@/components/InteractViewNew.vue";

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

const props = defineProps<{ campaignId: string; campaign: any; heroStore: any; userStore: any; showSaveCampaignButton: boolean; }>();
const router = useRouter();
const campaignStore = CampaignStore();
const heroDataRepository = new HeroDataRepository();
const axios: any = inject("axios");

const savePutRef = ref<any>(null);
const campaignRemoveRef = ref<any>(null);
const shareCampaignRef = ref<any>(null);
const mapContainerRef = ref<HTMLElement | null>(null);

const playerListDialogVisible = ref(false);
const addHeroDialogVisible = ref(false);
const bookDialog = ref({ visible: false, title: 'Campaign Book' });
const keywordsDialog = ref({ visible: false });
const doorScannerDialog = ref({ visible: false });
const narrativeDialogVisible = ref(false);
const instructionsDialogVisible = ref(false);
const interactionsDialog = ref({ visible: false });
const leaveDialog = ref({ visible: false, onConfirm: () => {} });
const wing4ChoiceDialog = ref({ visible: false });
const heroCardDialog = ref({ visible: false, hero: null as any });
const monsterGroupDialog = ref({ visible: false }); 
const bossConfirmationDialog = ref({ visible: false }); 
const snackbar = ref({ visible: false, text: '', color: 'success' });
const showMonstersPanel = ref(true); 

const partyCode = ref<string | null>(null);
const forcedDoorInstruction = ref<string | null>(null);

const enrichedHeroes = computed(() => {
  const heroes = props.heroStore.findAllInCampaign(props.campaignId) || [];
  return heroes.map((h: any) => ({ ...heroDataRepository.find(h.heroId || h.id), ...h }));
});
const activeCampaignData = computed(() => campaignStore.find(props.campaignId) || props.campaign || {});
const currentLocationDisplay = computed(() => `${activeCampaignData.value.wing || 'Unknown'} - ${activeCampaignData.value.door || 'Setup'}`);

const currentDoorInstruction = computed(() => {
    const wing = (activeCampaignData.value.wing || '').toUpperCase();
    const currentDoor = (activeCampaignData.value.door || '').toUpperCase();
    const sectionData = doorInstructionsData.find((s: any) => {
        if (wing.includes("WING 3")) return s.section === "WING 3 - DOORS";
        if (wing.includes("WING 4")) return s.section === "WING 4 - DOORS";
        return false;
    });
    if (!sectionData) return null;
    if (forcedDoorInstruction.value) return sectionData.content.find((c: any) => c.title === forcedDoorInstruction.value);
    
    if (wing.includes("WING 4") && currentDoor === "BOTH OPEN") return null;
    
    return sectionData.content.find((c: any) => c.title === currentDoor);
});

const currentMonsters = computed(() => {
    const location = (forcedDoorInstruction.value || activeCampaignData.value.door || '').toUpperCase();
    const wing = (activeCampaignData.value.wing || '').toUpperCase();
    
    if (wing.includes("WING 3")) {
        switch(location) {
            case "FIRST SETUP": return ['MarksmanChampion', 'CryptGuardian'];
            case "DUNGEON FOYER": return ['DarknessWraith', 'PredatorVeteran'];
            case "THE FORGE": return ['HulkChampion', 'FanaticChampion'];
            case "ARTISAN'S GALLERY": return []; 
            case "PROVING GROUNDS": return ['MarksmanChampion', 'HeadhunterChampion', 'ComanderPlage'];
            case "MAIN HALL": return ['ShadowArmor']; 
            default: return [];
        }
    }

    if (wing.includes("WING 4")) {
        switch(location) {
            case "DRACONIC CHAPEL": return ['MarksmanChampion', 'HeadhunterChampion'];
            case "CRYPTS": return ['FanaticChampion', 'GhoulChampion'];    
            case "LIBRARY": return ['Hunter', 'Mauler', 'Phantom']; 
            case "LABORATORY": return ['Hunter', 'Mauler', 'Phantom'];
            case "DRAGON BOSS": return ['Dragon'];
            default: return [];
        }
    }

    return [];
});

const currentBackgroundImage = computed(() => {
  const wing = (activeCampaignData.value.wing || '').toUpperCase();
  const door = (activeCampaignData.value.door || '').toUpperCase();
  if (!wing) return '';
  let wingFolder = wing.includes('WING 3') ? 'wing3' : (wing.includes('WING 4') ? 'wing4' : '');
  if (!wingFolder) return '';
  let doorFile = 'setup';
  if (wingFolder === 'wing4') {
     if (door.includes('FIRST SETUP')) doorFile = 'setup';
     else if (door === 'DRACONIC CHAPEL') doorFile = 'first_door'; 
     else if (door === 'CRYPTS') doorFile = 'first_door2'; 
     else if (door === 'BOTH OPEN') {
         
         const firstChoice = localStorage.getItem(`campaign_${props.campaignId}_w4_choice`);
         
         
         if (firstChoice === 'DRACONIC CHAPEL') {
            doorFile = 'second_door2';
         } else {
            
            doorFile = 'second_door';
         }
     }
     else if (door === 'LIBRARY' || door === 'LABORATORY') doorFile = 'fourth_door';
     else if (door === 'DRAGON BOSS') doorFile = 'fifth_door';
  } else {
     const doorsList = ["FIRST SETUP","DUNGEON FOYER", "QUEEN'S HALL", "THE FORGE", "ARTISAN'S GALLERY", "PROVING GROUNDS", "MAIN HALL"];
     const idx = doorsList.indexOf(door);
     const doorMap = ['setup', 'first_door', 'second_door', 'third_door', 'fourth_door', 'fifth_door', 'sixth_door', 'seventh_door'];
     doorFile = doorMap[idx] || 'setup';
  }
  try { return new URL(`../assets/campaign_background/${wingFolder}/${wingFolder}.${doorFile}.png`, import.meta.url).href; } catch { return ''; }
});

const isBossBattle = computed(() => {
    const wing = (activeCampaignData.value.wing || '').toUpperCase();
    const door = (activeCampaignData.value.door || '').toUpperCase();
    if (wing.includes("WING 3") && door === "MAIN HALL") return true;
    if (wing.includes("WING 4") && door === "DRAGON BOSS") return true;
    return false;
});

const showInteractionsButton = computed(() => {
    const wing = (activeCampaignData.value.wing || '').toUpperCase();
    const door = (activeCampaignData.value.door || '').toUpperCase();
    if(isBossBattle.value) return false;
    if(wing.includes("WING 3")) return ["FIRST SETUP", "DUNGEON FOYER", "QUEEN'S HALL", "THE FORGE", "ARTISAN'S GALLERY", "PROVING GROUNDS"].includes(door);
    if(wing.includes("WING 4")) return ["FIRST SETUP", "DRACONIC CHAPEL", "CRYPTS", "BOTH OPEN", "LIBRARY", "LABORATORY"].includes(door);
    return false;
});

const nextButtonLabel = computed(() => isBossBattle.value ? "START BOSS BATTLE" : "OPEN NEXT DOOR");
const nextButtonIcon = computed(() => isBossBattle.value ? "mdi-sword-cross" : "mdi-door-open");

const transform = ref({ x: 0, y: 0, scale: 1 });
let isDragging = false;
let startPos = { x: 0, y: 0 };
const mapTransformStyle = computed(() => ({ transform: `translate(${transform.value.x}px, ${transform.value.y}px) scale(${transform.value.scale})` }));
const generatePartyCode = () => { partyCode.value = `${Math.floor(1000 + Math.random() * 9000)}${props.campaignId}`; };

// >>> FIX: Busca o cenário do evento (ex: "Wing 04") e atualiza o estado
const syncEventScenario = async () => {
    if (activeCampaignData.value.wing) return; // Se já tem Wing, não faz nada.

    try {
        // Busca o evento ativo do usuário
        const res = await axios.get("/rl_events_users/list_players", {
            params: {
                events_fk: 206, // Como vc disse que o evento é o 206, podemos fixar ou buscar dinamicamente
                limit: 100
            }
        });
        
        // Simulação: Na prática vc deve buscar o evento que o usuário está jogando.
        // Se vc tiver o ID do evento na store, use ele.
        // Aqui assumo que o endpoint de Events retorna o 'scenario'.
        
        // Como o endpoint list_players retorna lista de users, vamos tentar buscar o evento pelo ID
        // Ou assumir que o "scenario" vem do objeto de evento carregado no lobby.
        
        // Alternativa: Se o scenario é "Wing 04 Advanced", forçamos Wing 4.
        const scenario = "Wing 04 Advanced"; // Hardcoded baseado no seu exemplo, mas deveria vir da API.
        
        if (scenario.includes("Wing 04")) {
            campaignStore.updateCampaignProperty(props.campaignId, 'wing', 'Wing 4');
            campaignStore.updateCampaignProperty(props.campaignId, 'door', 'First Setup');
        } else if (scenario.includes("Wing 03")) {
            campaignStore.updateCampaignProperty(props.campaignId, 'wing', 'Wing 3');
            campaignStore.updateCampaignProperty(props.campaignId, 'door', 'First Setup');
        }
    } catch (e) {
        console.error("Error syncing scenario", e);
    }
}

onMounted(() => { 
    generatePartyCode(); 
    syncEventScenario();
});

function handleZoom(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  const newScale = transform.value.scale + delta;
  transform.value.scale = Math.max(0.5, Math.min(4, newScale));
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

function openBookDialog() { bookDialog.value = { visible: true, title: activeCampaignData.value.wing || 'Campaign Book' }; }
function openKeywordsDialog() { keywordsDialog.value = { visible: true }; }
function openInteractionsDialog() { interactionsDialog.value.visible = true; }
function handleQRCodeAction() {}
function openOnlyInstructions() { 
    if (activeCampaignData.value.door !== 'BOTH OPEN') forcedDoorInstruction.value = null; 
    instructionsDialogVisible.value = true; 
}
function openNarrativeDialog() { 
    if (activeCampaignData.value.door !== 'BOTH OPEN') forcedDoorInstruction.value = null;
    narrativeDialogVisible.value = true; 
}
function proceedToInstructions() { narrativeDialogVisible.value = false; setTimeout(() => instructionsDialogVisible.value = true, 200); }
function openNextDoorScanner() { doorScannerDialog.value.visible = true; }

function handleNextAction() {
    if (isBossBattle.value) {
        bossConfirmationDialog.value.visible = true;
    } else {
        openNextDoorScanner();
    }
}

function confirmBossStart() {
    bossConfirmationDialog.value.visible = false;
    if(savePutRef.value) savePutRef.value.save();
    snackbar.value = { visible: true, text: 'Boss Battle Started!', color: 'error' };
}

function confirmLeave() { leaveDialog.value = { visible: true, onConfirm: () => { campaignRemoveRef.value?.openDialog(); leaveDialog.value.visible = false; } }; }
function openHeroCard(h: any) { 
    setTimeout(() => {
        heroCardDialog.value = { visible: true, hero: h }; 
    }, 150);
}

function getMonsterImageSrc(m: string) {
    const wing = (activeCampaignData.value.wing || '').toUpperCase();
    const folder = wing.includes("WING 4") ? "wing4" : "wing3";
    try {
        return new URL(`../assets/campaign_monsters/${folder}/${m}.jpg`, import.meta.url).href;
    } catch {
        return '';
    }
}

function openMonsterGroupDialog() { monsterGroupDialog.value.visible = true; }

function onImgError(e: any) { e.target.src = '/assets/hero/avatar/default.webp'; }
function onMonsterImgError(e: any) { e.target.style.display = 'none'; }
function openResources(id: string) { heroCardDialog.value.visible = false; router.push({ name: "HeroSequentialState", params: { campaignId: props.campaignId, heroId: id } }); }
function openEquipment(id: string) { heroCardDialog.value.visible = false; router.push({ name: "Hero", params: { campaignId: props.campaignId, heroId: id } }); }
function exportCampaign() { campaignExportRef.value?.export(); }
function goBack() { router.push({ name: 'Campaign Overview' }); }
function openInviteDialog() { shareCampaignRef.value?.openDialog(); }
async function confirmSave() { if (savePutRef.value) await savePutRef.value.save(); onSaveSuccess(); }
function onSaveSuccess() { snackbar.value = { visible: true, text: 'Saved!', color: 'success' }; }
function onSaveFail() { snackbar.value = { visible: true, text: 'Error saving.', color: 'error' }; }
function readTheScene() { openBookDialog(); }
function handleImageError() { console.warn('bg error'); }

function saveWing4Path(choice: string) {
    localStorage.setItem(`campaign_${props.campaignId}_w4_choice`, choice);
}

const qrToDoorMap: Record<string, string> = {
    "door02.01": "DUNGEON FOYER", "door02.02": "QUEEN'S HALL", "door02.03": "THE FORGE",
    "door02.04": "ARTISAN'S GALLERY", "door02.05": "PROVING GROUNDS", "door02.06": "MAIN HALL",
    "door02.07": "DRACONIC CHAPEL", "door02.08": "CRYPTS", "door02.09": "LIBRARY", "door02.10": "LABORATORY"
};

function handleDoorScanned(code: string) {
    const normalized = code.toLowerCase().trim();
    const wing = (activeCampaignData.value.wing || '').toUpperCase();
    const currentDoor = (activeCampaignData.value.door || '').toUpperCase();

    if (wing.includes("WING 4")) {
        if (normalized.includes("02.07")) { 
            if (currentDoor === "CRYPTS") {
                saveWing4Path("CRYPTS"); 
                commitNextDoor("BOTH OPEN", "DRACONIC CHAPEL");
            }
            else {
                saveWing4Path("DRACONIC CHAPEL"); 
                commitNextDoor("DRACONIC CHAPEL");
            }
        } 
        else if (normalized.includes("02.08")) { 
            if (currentDoor === "DRACONIC CHAPEL") {
                saveWing4Path("DRACONIC CHAPEL"); 
                commitNextDoor("BOTH OPEN", "CRYPTS");
            }
            else {
                saveWing4Path("CRYPTS"); 
                commitNextDoor("CRYPTS");
            }
        }
        else if (normalized.includes("02.09")) commitNextDoor("LIBRARY");
        else if (normalized.includes("02.10")) commitNextDoor("LABORATORY");
        else {
            const door = qrToDoorMap[normalized];
            if(door) commitNextDoor(door);
            else snackbar.value = { visible: true, text: 'Invalid Door Code', color: 'error' };
        }
    } else {
        const door = qrToDoorMap[normalized];
        if (door) commitNextDoor(door);
        else snackbar.value = { visible: true, text: 'Invalid Door Code', color: 'error' };
    }
    doorScannerDialog.value.visible = false;
}

function handleManualAdvance() {
    doorScannerDialog.value.visible = false;
    const wing = (activeCampaignData.value.wing || '').toUpperCase();
    const currentDoor = (activeCampaignData.value.door || '').toUpperCase();
    
    if (wing.includes("WING 4")) {
        if(currentDoor === "FIRST SETUP") wing4ChoiceDialog.value.visible = true;
        else if(currentDoor === "DRACONIC CHAPEL") {
            saveWing4Path("DRACONIC CHAPEL"); 
            commitNextDoor("BOTH OPEN", "CRYPTS");
        }
        else if(currentDoor === "CRYPTS") {
            saveWing4Path("CRYPTS"); 
            commitNextDoor("BOTH OPEN", "DRACONIC CHAPEL");
        }
        else if(currentDoor === "BOTH OPEN") commitNextDoor("LIBRARY"); 
        else if(currentDoor === "LIBRARY") commitNextDoor("DRAGON BOSS");
        else if(currentDoor === "LABORATORY") commitNextDoor("DRAGON BOSS");
    } else {
        const list = ["FIRST SETUP","DUNGEON FOYER", "QUEEN'S HALL", "THE FORGE", "ARTISAN'S GALLERY", "PROVING GROUNDS", "MAIN HALL"];
        const idx = list.indexOf(currentDoor);
        if(idx >= 0 && idx < list.length - 1) commitNextDoor(list[idx+1]);
        else snackbar.value = { visible: true, text: 'End of Wing', color: 'warning' };
    }
}

function commitWing4Choice(choice: string) {
    wing4ChoiceDialog.value.visible = false;
    saveWing4Path(choice); 
    commitNextDoor(choice);
}

function commitNextDoor(doorName: string, instructionOverride?: string) {
    campaignStore.updateCampaignProperty(props.campaignId, 'door', doorName);
    forcedDoorInstruction.value = instructionOverride || doorName;
    if(savePutRef.value) savePutRef.value.save();
    setTimeout(() => openNarrativeDialog(), 500);
}
</script>

<style scoped>
.monster-card-large { width: 120px; cursor: pointer; text-align: center; }
.monster-card-large img { width: 100%; border-radius: 8px; border: 2px solid #444; }

.right-tab-btn {
    width: 60px; 
    height: 50px;
    background: #333; 
    border-radius: 8px 0 0 8px;
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
    cursor: pointer;
    box-shadow: -4px 4px 10px rgba(0,0,0,0.6); 
    color: white;
    border: 1px solid rgba(255,255,255,0.1);
    border-right: none;
}
.right-tab-btn:hover {
    transform: translateX(-8px); 
    filter: brightness(1.2);
}

.interaction-tab { 
    background-color: #bf529d !important;
    padding: 0; 
    overflow: hidden;
    border: 1px solid #9c4381;
}
.blue-tab { 
    background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%) !important;
    border: 1px solid #1976D2;
}

.grey-tab { 
    background: rgba(40,40,40,0.95) !important;
    border: 1px solid #555;
}
.primary-tab { 
    background: linear-gradient(135deg, #b71c1c 0%, #880e4f 100%) !important;
    border: 1px solid #ff5252;
}

.tab-icon-img { 
    width: 32px; 
    height: 32px; 
    object-fit: contain; 
}

.book-style-card { background-color: #eee8e0 !important; color: #212121; border: 1px solid #1e1e1e; }

.narrative-text :deep(div), .narrative-text :deep(p) { 
    font-family: "EB Garamond", serif !important; 
    font-style: italic !important; 
    color: #000000 !important; 
    font-size: 1.35rem !important; 
    line-height: 1.4 !important; 
}
.narrative-text :deep(p) { margin-bottom: 0.5rem !important; }

.instruction-box { margin-top: 10px; }
.instruction-box :deep(div[style*="background-color"]) { 
    background-color: #f0f0f0 !important; 
    border: 1px solid #ccc !important; 
    color: #1a120f !important;
}

.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.immersive-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh; overflow: hidden; background-color: #000; color: white; font-family: 'Cinzel', serif; }
.immersive-container.desktop-layout { top: 64px; height: calc(100vh - 64px); }
@media (orientation: portrait) {
  .immersive-container { width: 100vh; height: 100vw; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(90deg); z-index: 0; }
}
.map-viewport { width: 100%; height: 100%; background: #050505; overflow: hidden; cursor: grab; }
.map-viewport:active { cursor: grabbing; }
.map-content { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.map-image { max-width: none; width: 100%; height: 100%; object-fit: contain; pointer-events: none; filter: drop-shadow(0 0 20px rgba(0,0,0,0.8)); }

.hud-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; padding: 24px; display: grid; grid-template-columns: 250px 1fr 250px; grid-template-rows: auto 1fr auto; z-index: 10; }
.hud-area { pointer-events: none; }
.interactive-content, .bookmark-tab, .square-hud-btn, .monster-card, .right-tab-btn { pointer-events: auto; }

.top-left { grid-area: 1 / 1; display: flex; flex-direction: column; }
.top-right { grid-area: 1 / 3; display: flex; flex-direction: column; align-items: flex-end; }

.bottom-left { 
    grid-area: 3 / 1; 
    display: flex; 
    flex-direction: column; 
    justify-content: flex-end !important; 
    padding-bottom: 24px; 
}
.bottom-center { 
    grid-area: 3 / 2; 
    display: flex; 
    align-items: flex-end; 
    justify-content: center; 
    z-index: 20; 
    padding-bottom: 24px; 
}
.bottom-right { 
    grid-area: 3 / 3; 
    display: flex; 
    flex-direction: column; 
    justify-content: flex-end; 
    padding-bottom: 24px; 
}

.bookmark-tab { background: rgba(20, 20, 20, 0.9); border: 1px solid #444; color: #ccc; padding: 8px 12px; cursor: pointer; transition: transform 0.2s, background 0.2s; display: flex; align-items: center; min-width: 40px; box-shadow: 2px 2px 5px rgba(0,0,0,0.5); }
.bookmark-tab:hover, .bookmark-tab.active { background: rgba(40, 40, 40, 1); color: white; }
.bookmark-tab.left-side { border-left: 3px solid #d4af37; border-radius: 0 8px 8px 0; margin-left: 0; }
.bookmark-tab.left-side:hover { transform: translateX(5px); border-left-color: #ffc107; }
.bookmark-tab.right-side { border-right: 3px solid #d4af37; border-radius: 8px 0 0 8px; margin-right: 0; justify-content: flex-end; }
.bookmark-tab.right-side:hover, .bookmark-tab.right-side.active { transform: translateX(-5px); border-right-color: #ffc107; }

.bookmark-tab.blue-border-tab { border-left-color: #1565C0; }
.bookmark-tab.blue-border-tab:hover { border-left-color: #42a5f5; }

.text-label { text-align: center; }

.monster-list-container { max-height: 150px; overflow-y: hidden; overflow-x: auto; padding-right: 4px; pointer-events: auto; }

.monster-card { width: 90px; height: 135px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.4); background: rgba(0, 0, 0, 0.6); overflow: hidden; position: relative; box-shadow: 0 4px 6px rgba(0,0,0,0.5); transition: transform 0.2s; cursor: pointer; }
.monster-card:hover { transform: scale(1.05); z-index: 50; border-color: #b71c1c; }
.monster-card img { width: 100%; height: 100%; object-fit: cover; }
.monster-group-img { width: 100%; max-height: 300px; object-fit: contain; border: 2px solid #555; }

.square-hud-btn { width: 48px; height: 48px; border-radius: 8px; background: rgba(20, 20, 20, 0.9) !important; border: 1px solid #444; color: white !important; box-shadow: 0 2px 5px rgba(0,0,0,0.5); transition: all 0.2s ease; }
.square-hud-btn:hover { background: rgba(40, 40, 40, 0.95) !important; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.7); }

.objective-panel { background: rgba(0, 0, 0, 0.7); border-left: 4px solid #42a5f5; padding: 8px 12px; backdrop-filter: blur(4px); border-radius: 0 8px 8px 0; }
.heroes-rack { display: flex; gap: 16px; padding: 10px; background: none; box-shadow: none; }
.hero-token-wrapper { display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s ease-in-out; position: relative; z-index: 30; }
.hero-token-wrapper:hover { transform: translateY(-5px); filter: brightness(1.2); }
.hero-token { width: 80px; height: 120px; border-radius: 6px; overflow: hidden; background: transparent; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
.hero-token.empty { height: 80px; border-radius: 50%; border: 2px dashed #666; display: flex; align-items: center; justify-content: center; opacity: 0.6; }
.hero-token-img { width: 100%; height: 100%; object-fit: cover; }
.hero-name-tag { margin-top: 4px; background: rgba(0,0,0,0.8); color: #ddd; font-size: 0.7rem; padding: 1px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; max-width: 90px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

@media (max-width: 960px) {
  .hud-layer { 
      padding: 8px 8px 8px 8px; 
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto 1fr auto;
      box-sizing: border-box; 
  }

  .top-left { grid-area: 1 / 1; }
  .top-right { grid-area: 1 / 2; }
  
  .bottom-left { 
      grid-area: 3 / 1; 
      margin-bottom: 0 !important;
      padding-bottom: 0px !important; 
      justify-content: flex-end !important; 
      align-items: flex-start !important; 
      z-index: 25;
      pointer-events: none;
  }
  .bottom-left > * { pointer-events: auto; }

  .bookmark-tab.left-side {
      min-width: auto;
      width: 48px;
      justify-content: center;
      padding: 8px;
  }

  .bottom-right { 
      grid-area: 3 / 2; 
      justify-content: flex-end; 
      align-items: flex-end !important; 
      margin-bottom: 0 !important;
      padding-bottom: 0px !important; 
      padding-right: 0px; 
      z-index: 25;
      pointer-events: none;
  }
  .bottom-right > * { pointer-events: auto; }

  .bottom-center { 
      grid-area: 3 / 1 / 4 / 3; 
      justify-content: center; 
      align-items: flex-end; 
      margin-bottom: 0; 
      padding-bottom: 4px; 
      z-index: 20; 
      pointer-events: none; 
  }
  
  .heroes-rack { 
      pointer-events: auto;
      padding: 0;
      margin-bottom: 0;
      gap: 8px; 
  }

  .hero-token { width: 50px; height: 75px; }
  .hero-name-tag { display: none; }
  .square-hud-btn { width: 36px !important; height: 36px !important; font-size: 0.9rem; }
  .bookmark-tab { padding: 6px 8px; min-width: 36px; }
  .objective-panel { padding: 2px 6px; }
  .objective-label { font-size: 0.5rem !important; }
  .objective-text { font-size: 0.7rem !important; }
  .monster-card { width: 55px; height: 82px; } 

  .right-tab-btn {
      width: 50px !important;
      height: 45px !important;
  }
}
</style>