<template>
  <div v-if="!isUnderkeep2" class="classic-mode">
    <v-snackbar v-model="snackbarVisible" :timeout="snackbarTimeout" :color="snackbarColor" location="top" elevation="24" rounded="lg" multi-line class="global-snackbar">
      <div class="d-flex align-center">
        <v-icon :color="snackbarIconColor" class="mr-3">{{ snackbarIcon }}</v-icon>
        <div>
          <div v-if="snackbarTitle" class="font-weight-bold">{{ snackbarTitle }}</div>
          <div>{{ snackbarText }}</div>
        </div>
      </div>
    </v-snackbar>

    <v-dialog v-model="playerListDialogVisible" max-width="600px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Player List</span>
          <v-btn icon="mdi-close" variant="text" @click="playerListDialogVisible = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <CampaignPlayerList ref="campaignPlayerListRef" :campaign-id="campaignId" :show-remove-button="showSaveCampaignButton" @player-removed="onPlayerRemoved" density="compact" />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex flex-wrap justify-space-around pa-4">
          <v-btn @click="shareCampaignRef?.openDialog?.()" variant="elevated" rounded prepend-icon="mdi-account-plus-outline" class="my-2">Invite Player</v-btn>
          <v-btn v-if="showSaveCampaignButton" class="my-2" @click="openTransferDialog" variant="elevated" rounded prepend-icon="mdi-account-switch-outline">Transfer Drunagor Master</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="transferDialogVisible" max-width="500px">
      <v-card>
        <v-card-title><span class="text-h5">Transfer Drunagor Master</span></v-card-title>
        <v-card-text>
          <v-container>
            <v-alert v-if="transferAlertVisible" :type="transferAlertType" class="mb-4" closable @click:close="transferAlertVisible = false">{{ transferAlertText }}</v-alert>
            <div v-if="transferLoading" class="text-center py-8"><v-progress-circular indeterminate color="primary" /><p class="mt-4">Loading players...</p></div>
            <div v-else-if="!confirmingTransfer">
              <p class="mb-4">Select the player who will become the new Drunagor Master:</p>
              <v-list>
                <v-list-item v-for="player in players.filter((p) => p.party_roles_fk !== 1)" :key="player.rl_campaigns_users_pk" @click="initTransfer(player)" class="mb-2" rounded color="primary">
                  <v-list-item-title>{{ player.user_name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ player.role_name }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
            <div v-else>
              <v-alert type="warning" class="mb-4"><strong>Confirm Transfer</strong><p class="mt-2">Are you sure?</p></v-alert>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="!confirmingTransfer" color="grey" variant="text" @click="closeTransferDialog">Cancel</v-btn>
          <template v-else>
            <v-btn color="grey" variant="text" @click="cancelTransfer" :disabled="transferLoading">Cancel</v-btn>
            <v-btn color="error" variant="elevated" @click="confirmTransfer" :loading="transferLoading">Confirm Transfer</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-speed-dial v-model="speedDialOpen" transition="fade-transition" class="d-none d-md-flex">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" :color="speedDialOpen ? 'red' : 'green'" size="large" icon class="speed-dial-activator d-none d-md-flex" elevation="14">
          <v-icon>{{ speedDialOpen ? "mdi-close" : "mdi-script-text-outline" }}</v-icon>
        </v-btn>
      </template>
      <v-btn v-if="showSaveCampaignButton" key="save" size="small" color="success" icon class="speed-dial-item" @click="handleSpeedDialAction('save')"><v-icon>mdi-content-save-outline</v-icon></v-btn>
      <v-btn v-if="campaign && ['underkeep', 'underkeep2'].includes(campaign.campaign) && showLoadInstructions" key="load-instructions" size="small" color="info" icon class="speed-dial-item" @click="handleSpeedDialAction('load-instructions')"><v-icon>mdi-lightbulb-on-outline</v-icon></v-btn>
      <v-btn key="export" size="small" color="orange" icon class="speed-dial-item" :disabled="!showSaveCampaignButton" @click="handleSpeedDialAction('export')"><v-icon>mdi-export</v-icon></v-btn>
      <v-btn key="qrcode" size="large" color="purple" icon class="speed-dial-item-qr" @click="handleSpeedDialAction('qrcode')"><v-icon size="large">mdi-qrcode</v-icon></v-btn>
      <v-btn key="player-list" size="small" color="secondary" icon class="speed-dial-item" @click="openPlayerListDialog"><v-icon>mdi-account-group</v-icon></v-btn>
      <v-btn v-if="showSaveCampaignButton" key="remove" size="small" color="error" icon class="speed-dial-item" @click="handleSpeedDialAction('remove')"><v-icon>mdi-delete-outline</v-icon></v-btn>
    </v-speed-dial>

    <v-bottom-navigation v-model="bottomNavValue" class="d-md-none mobile-bottom-nav" bg-color="surface" grow elevation="8" height="65">
      <v-btn v-if="showSaveCampaignButton" value="save" @click="handleBottomNavAction('save')" class="bottom-nav-btn"><v-icon>mdi-content-save-outline</v-icon><span class="bottom-nav-label">Save</span></v-btn>
      <v-btn v-if="campaign && ['underkeep', 'underkeep2'].includes(campaign.campaign) && showLoadInstructions" value="load-instructions" @click="handleBottomNavAction('load-instructions')" class="bottom-nav-btn"><v-icon>mdi-lightbulb-on-outline</v-icon><span class="bottom-nav-label">Guide</span></v-btn>
      <v-btn value="export" :disabled="!showSaveCampaignButton" @click="handleBottomNavAction('export')" class="bottom-nav-btn"><v-icon>mdi-export</v-icon><span class="bottom-nav-label">Export</span></v-btn>
      <v-btn value="qrcode" @click="handleBottomNavAction('qrcode')" class="bottom-nav-btn-qr"><v-icon size="x-large">mdi-qrcode</v-icon><span class="bottom-nav-label-qr">QR Code</span></v-btn>
      <v-btn value="player-list" @click="handleBottomNavAction('player-list')" class="bottom-nav-btn"><v-icon>mdi-account-group</v-icon><span class="bottom-nav-label">Players</span></v-btn>
      <v-btn v-if="showSaveCampaignButton" value="remove" @click="handleBottomNavAction('remove')" class="bottom-nav-btn"><v-icon>mdi-delete-outline</v-icon><span class="bottom-nav-label">Remove</span></v-btn>
    </v-bottom-navigation>

    <div class="campaign-content" :class="{ 'with-bottom-nav': true }">
      <v-container fluid>
        <template v-if="campaign">
          <v-row justify="center" no-gutters>
            <v-col cols="12" lg="9" xl="8">
              <v-card-text v-if="!showSaveCampaignButton && !['underkeep', 'underkeep2'].includes(campaign.campaign)" class="pa-2">
                <BaseAlert :modelValue="true" type="warning" text border="start" variant="tonal" :closable="true">Players can only view information.</BaseAlert>
              </v-card-text>

              <template v-if="['underkeep', 'underkeep2'].includes(campaign.campaign)">
                <v-card-text v-if="!showSaveCampaignButton" class="pa-2">
                  <BaseAlert :modelValue="true" type="warning" text border="start" variant="tonal" :closable="true">Players can only view information.</BaseAlert>
                </v-card-text>

                <v-tabs v-model="currentTab" density="compact" grow bg-color="surface" class="mb-3 rounded shepherd-campaign-tabs" slider-color="white">
                  <v-tab value="normal" class="text-caption"><v-icon size="small" class="mr-1">mdi-clipboard-text-outline</v-icon>Log</v-tab>
                  <v-tab value="book" class="text-caption"><v-icon size="small" class="mr-1">mdi-book-open-variant</v-icon>Book</v-tab>
                </v-tabs>

                <v-window v-model="currentTab">
                  <v-window-item value="normal">
                    <v-card class="mb-3" color="primary">
                      <v-card-text class="pa-2">
                        <v-row align="center">
                          <v-col class="pb-0" cols="12" sm="6"><CampaignName :campaign-id="campaignId" class="mb-0 shepherd-campaign-name" /></v-col>
                          <v-col cols="12" sm="6">
                            <div class="d-flex justify-start justify-sm-end align-center mb-4">
                              <div class="mx-1 my-1= d-flex align-center">
                                <span class="text-caption font-weight-bold mr-1">CAMPAIGN ID:</span>
                                <v-chip v-if="partyCode" label size="large">{{ partyCode }}</v-chip>
                                <v-chip v-else label size="large">Generating...</v-chip>
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>

                    <v-row no-gutters>
                      <v-col cols="12" md="6" class="pr-md-2">
                        <SelectDoor :campaign-id="campaignId" :campaign-type="campaign.campaign" class="mb-3 shepherd-select-door" />
                        <CampaignRunes v-if="isSequentialAdventure" :campaign-id="campaignId" class="mb-0 shepherd-runes" />
                        <v-row v-if="campaign && campaign.campaign === 'underkeep2'" no-gutters class="mt-0">
                          <v-col cols="12"><SelectCompanion :campaign-id="campaignId" :is-admin="showSaveCampaignButton" /></v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" md="6" class="pl-md-2">
                        <CampaignRuneCards v-if="isSequentialAdventure" :campaign-id="campaignId" :campaign-type="campaign.campaign" class="mb-3 shepherd-rune-cards" />
                      </v-col>
                    </v-row>

                    <v-row class="my-3" no-gutters v-if="showSaveCampaignButton">
                      <v-col cols="12">
                        <v-card class="pa-2 shepherd-hero-actions" color="primary">
                          <div class="d-flex justify-center flex-wrap gap-2">
                            <CampaignLogAddHero :campaign-id="campaignId" class="mx-1 my-1" />
                            <CampaignLogImportHero :campaign-id="campaignId" class="mx-1 my-1" />
                            <CampaignLogRemoveHero :campaign-id="campaignId" class="mx-1 my-1" />
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-row no-gutters>
                      <v-col cols="12">
                        <v-sheet rounded border="md" class="text-white pa-2 shepherd-heroes-list">
                          <div v-if="heroStore.findAllInCampaign(campaignId).length === 0" class="text-center pa-4">No heroes added yet.</div>
                          <div v-for="hero in heroStore.findAllInCampaign(campaignId)" :key="hero.heroId" class="mb-2">
                            <CampaignLog :campaign-id="campaignId" :hero-id="hero.heroId" :is-sequential-adventure="isSequentialAdventure" :class="`shepherd-hero-${hero.heroId}`" />
                          </div>
                        </v-sheet>
                      </v-col>
                    </v-row>
                  </v-window-item>
                  <v-window-item value="book">
                    <CampaignBook ref="campaignBookRef" :campaign-id="campaignId" />
                  </v-window-item>
                </v-window>
              </template>

              <template v-else>
                <CampaignName :campaign-id="campaignId" />
                <v-row class="my-3" no-gutters v-if="showSaveCampaignButton">
                   <v-col cols="12">
                      <v-card class="pa-2" color="primary">
                         <div class="d-flex justify-center flex-wrap gap-2">
                            <CampaignLogAddHero :campaign-id="campaignId" class="mx-1 my-1" />
                            <CampaignLogImportHero :campaign-id="campaignId" class="mx-1 my-1" />
                            <CampaignLogRemoveHero :campaign-id="campaignId" class="mx-1 my-1" />
                         </div>
                      </v-card>
                   </v-col>
                </v-row>
                <v-row no-gutters>
                   <v-col cols="12">
                      <v-sheet rounded border="md" class="text-white pa-2">
                         <div v-for="hero in heroStore.findAllInCampaign(campaignId)" :key="hero.heroId" class="mb-2">
                            <CampaignLog :campaign-id="campaignId" :hero-id="hero.heroId" :is-sequential-adventure="isSequentialAdventure" />
                         </div>
                      </v-sheet>
                   </v-col>
                </v-row>
              </template>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </div>
  </div>

  <div v-else class="game-board">
    
    <div class="orientation-warning">
      <v-icon size="64" class="mb-4">mdi-phone-rotate-landscape</v-icon>
      <div class="text-h5 font-weight-bold">Please Rotate Your Device</div>
      <p>This experience is designed for landscape mode.</p>
    </div>

    <div 
      class="map-container" 
      @mousedown="startDrag" 
      @mousemove="onDrag" 
      @mouseup="stopDrag" 
      @mouseleave="stopDrag"
      @touchstart="startTouch"
      @touchmove="onTouch"
      @touchend="stopDrag"
      @wheel.prevent="onWheel"
    >
      <div 
        class="map-layer" 
        :style="{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }"
      >
        <img 
          v-if="currentBackgroundUrl" 
          :src="currentBackgroundUrl" 
          class="background-image"
          draggable="false"
        />
        <div v-else class="d-flex align-center justify-center fill-height bg-black">
          <span class="text-white">Loading: {{ currentFilename }}</span>
        </div>
      </div>
    </div>

    <div class="ui-overlay">
      
      <div class="ui-group top-left">
        <div class="d-flex flex-column gap-2">
          <v-btn color="purple-darken-4" variant="elevated" class="nav-btn" @click="handleSpeedDialAction('qrcode')">
            <v-icon start>mdi-qrcode</v-icon> Scan QR
          </v-btn>
          <v-btn color="brown-darken-4" variant="elevated" class="nav-btn" @click="openBook">
            <v-icon start>mdi-book-open-page-variant</v-icon> Campaign Book
          </v-btn>
          <v-btn color="deep-purple-darken-4" variant="elevated" class="nav-btn" @click="openInteractions">
            <v-icon start>mdi-eye</v-icon> Interactions
          </v-btn>
          <v-btn color="teal-darken-4" variant="elevated" class="nav-btn" @click="openKeywords">
            <v-icon start>mdi-book-search</v-icon> Keywords
          </v-btn>
          <v-btn color="grey-darken-3" variant="elevated" class="nav-btn mt-2" @click="$router.push({ name: 'Campaigns' })">
            <v-icon start>mdi-arrow-left</v-icon> Voltar
          </v-btn>
        </div>
      </div>

      <div class="ui-group top-right">
        <div class="d-flex gap-2">
           <v-btn v-if="isAdmin" color="grey-darken-3" variant="elevated" class="game-btn icon-only" @click="debugDialogVisible = true">
             <v-icon>mdi-cog</v-icon>
          </v-btn>

          <v-btn color="success" variant="elevated" class="game-btn" @click="dialogSaveConfirm = true">
            <v-icon start>mdi-content-save</v-icon> Save
          </v-btn>
          <v-btn color="black" variant="elevated" class="game-btn" @click="dialogDeleteConfirm = true">
            <v-icon color="red" start>mdi-delete</v-icon> Delete
          </v-btn>
        </div>
      </div>

      <div class="ui-group bottom-left">
        <div class="d-flex gap-2 align-end">
          <v-btn color="black" variant="elevated" class="game-btn square-btn" @click="campaignExportRef?.export?.()">
            <div class="d-flex flex-column align-center">
              <v-icon class="mb-1">mdi-export</v-icon>
              <span class="text-caption font-weight-bold">EXPORT</span>
            </div>
          </v-btn>
          <v-btn color="black" variant="elevated" class="game-btn square-btn" @click="openPlayerListDialog">
            <div class="d-flex flex-column align-center">
              <v-icon class="mb-1">mdi-account-group</v-icon>
              <span class="text-caption font-weight-bold">PLAYERS</span>
            </div>
          </v-btn>
        </div>
      </div>

      <div class="ui-group bottom-center">
        <div class="heroes-container">
          <div 
            v-for="hero in heroStore.findAllInCampaign(campaignId)" 
            :key="hero.heroId"
            class="hero-flag-wrapper"
            @click="openHeroMenu(hero)"
          >
            <div class="hero-full-image-container">
               <img :src="hero.images?.avatar" class="hero-full-img" />
            </div>
            <img src="@/assets/hero/flag-bg-red.webp" class="hero-flag" />
          </div>
          
          <div v-if="heroStore.findAllInCampaign(campaignId).length < 4 && isAdmin" class="d-flex align-center">
             <v-btn icon="mdi-plus" color="white" variant="tonal" size="large" @click="openPlayerListDialog"></v-btn>
          </div>
        </div>
      </div>

      <div class="ui-group bottom-right">
        <div class="d-flex flex-column gap-2 align-end">
           <v-btn color="blue-grey-darken-3" variant="elevated" class="game-btn scene-btn" @click="openSceneInBook">
            Read The Scene
          </v-btn>

          <v-btn color="red-darken-4" variant="elevated" class="game-btn next-door-btn" :disabled="!canAdvance" @click="dialogNextDoorConfirm = true" v-if="isAdmin">
            <div class="d-flex flex-column align-center w-100">
              <span class="text-button font-weight-black text-uppercase">Open Next Door</span>
              <span class="text-caption" v-if="nextDoorName">{{ nextDoorName }}</span>
            </div>
          </v-btn>
        </div>
      </div>
    </div>

    <v-dialog v-model="debugDialogVisible" max-width="400">
      <v-card title="Debug: Select Location">
        <v-card-text>
           <v-select v-model="overrideWing" label="Wing" :items="['WING 3 - ADVANCED', 'WING 4 - ADVANCED']" variant="outlined"></v-select>
           <v-select v-model="overrideDoor" label="Door" :items="debugDoorList" variant="outlined"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="debugDialogVisible = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="heroMenuVisible" max-width="500">
      <v-card class="pa-0 bg-grey-darken-4 rounded-lg border-md">
        <div class="position-relative">
           <v-img 
             v-if="selectedHero" 
             :src="selectedHero.images?.trackerInfo || selectedHero.images?.background" 
             cover 
             height="300"
             class="align-end"
           >
             <v-card-title class="text-white font-weight-bold text-h4 text-shadow" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
               {{ selectedHero.name }}
             </v-card-title>
           </v-img>
           <v-btn icon="mdi-close" variant="text" color="white" style="position:absolute; top: 5px; right: 5px;" @click="heroMenuVisible = false"></v-btn>
        </div>

        <v-card-text class="pa-4">
           <div class="d-flex flex-column gap-3">
            <v-btn color="secondary" size="x-large" block prepend-icon="mdi-flash" @click="navigateToHeroSequentialState">
              Manage Resources
            </v-btn>
            <v-btn color="primary" size="x-large" block prepend-icon="mdi-shield-sword" @click="navigateToHeroEquipmentSkills">
              Equipment & Skills
            </v-btn>
             
             <v-divider class="my-3"></v-divider>
             <v-btn v-if="isAdmin" color="error" variant="outlined" block prepend-icon="mdi-delete" @click="confirmRemoveHero">
               Remove Hero
             </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSaveConfirm" max-width="400">
      <v-card title="Save Campaign?">
        <v-card-text>Are you sure you want to save the current progress?</v-card-text>
        <v-card-actions><v-spacer /><v-btn color="grey" variant="text" @click="dialogSaveConfirm = false">No</v-btn><v-btn color="success" variant="elevated" @click="confirmSave">Yes</v-btn></v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDeleteConfirm" max-width="400">
      <v-card title="Delete Campaign?" color="error">
        <v-card-text class="text-white">Are you sure? This action cannot be undone.</v-card-text>
        <v-card-actions><v-spacer /><v-btn color="white" variant="text" @click="dialogDeleteConfirm = false">Cancel</v-btn><v-btn color="white" variant="outlined" @click="confirmDelete">Delete</v-btn></v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogNextDoorConfirm" max-width="400">
      <v-card title="Open Next Door">
        <v-card-text>Are you sure you want to proceed to <strong>{{ nextDoorName }}</strong>?<br><br>Ensure all players are ready.</v-card-text>
        <v-card-actions><v-spacer /><v-btn color="grey" variant="text" @click="dialogNextDoorConfirm = false">Wait</v-btn><v-btn color="red-darken-1" variant="elevated" @click="confirmNextDoor">Open Door</v-btn></v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="bookDialogVisible" fullscreen transition="dialog-bottom-transition">
      <v-card color="black">
        <v-toolbar dark color="brown-darken-4">
          <v-btn icon dark @click="bookDialogVisible = false"><v-icon>mdi-close</v-icon></v-btn>
          <v-toolbar-title>Campaign Book</v-toolbar-title>
        </v-toolbar>
        <CampaignBook ref="campaignBookRef" :campaign-id="campaignId" />
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" :timeout="3000">{{ snackbarText }}</v-snackbar>
  </div>

  <div style="display: none">
    <CampaignSavePut ref="savePutRef" :campaign-id="campaignId" @success="onSaveSuccess" @fail="onSaveFail" />
    <CampaignRemove ref="campaignRemoveRef" :campaign-id="campaignId" @removed="onCampaignRemoved" />
    <CampaignExport ref="campaignExportRef" :campaign-id="campaignId" />
    <ShareCampaignButton ref="shareCampaignRef" :campaignId="campaignId" :inviteCode="partyCode" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch, nextTick, onBeforeUnmount, computed } from "vue";
import { ref as vueRef } from "vue";
import axios from "axios";

import CampaignLogAddHero from "@/components/CampaignLogAddHero.vue";
import CampaignLogRemoveHero from "@/components/CampaignLogRemoveHero.vue";
import CampaignLog from "@/components/CampaignLog.vue";
import CampaignRemove from "@/components/CampaignRemove.vue";
import CampaignExport from "@/components/CampaignExport.vue";
import CampaignSavePut from "@/components/CampaignSavePut.vue";
import CampaignName from "@/components/CampaignName.vue";
import CampaignRunes from "@/components/CampaignRunes.vue";
import CampaignBook from "@/components/CampaignBook.vue";
import SelectDoor from "@/components/SelectDoor.vue";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import CampaignPlayerList from "@/components/CampaignPlayerList.vue";
import ShareCampaignButton from "./ShareCampaignButton.vue";
import CampaignLogImportHero from "@/components/CampaignLogImportHero.vue";
import CampaignRuneCards from "@/components/CampaignRuneCards.vue";
import SelectCompanion from "@/components/SelectCompanion.vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { type Campaign } from "@/store/Campaign";
import { useSaveCampaignTour } from "@/components/Composable/useSaveCampaignTour";
import { useLoadCampaignTour } from "@/components/Composable/useLoadCampaignTour";

const campaignStore = CampaignStore();
const heroStore = HeroStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const campaignId = (route.params as { id: string }).id.toString();

const campaign = ref<Campaign | null>(null);
const showSaveCampaignButton = ref(false);
const isAdmin = ref(false);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarTitle = ref("");
const snackbarIcon = ref("mdi-check");
const snackbarColor = ref("success");
const snackbarIconColor = ref("white");
const snackbarTimeout = ref(3000);
const partyCode = ref<string | null>(null);

const savePutRef = vueRef<InstanceType<typeof CampaignSavePut>>();
const campaignRemoveRef = vueRef<InstanceType<typeof CampaignRemove> | null>(null);
const campaignExportRef = vueRef<InstanceType<typeof CampaignExport> | null>(null);
const campaignPlayerListRef = vueRef<InstanceType<typeof CampaignPlayerList> | null>(null);
const shareCampaignRef = vueRef<InstanceType<typeof ShareCampaignButton> | null>(null);
const campaignBookRef = vueRef<InstanceType<typeof CampaignBook> | null>(null);

const isUnderkeep2 = computed(() => {
   return campaign.value && campaign.value.campaign === 'underkeep2';
});

// --- Old Logic Vars (Copy from your original) ---
const currentTab = ref("normal");
const playerListDialogVisible = ref(false);
const isSequentialAdventure = ref(true);
const showLoadInstructions = ref(false);
const speedDialOpen = ref(true);
const bottomNavValue = ref<string | null>(null);
const transferDialogVisible = ref(false);
const transferLoading = ref(false);
const players = ref<any[]>([]);
const selectedUser = ref<any>(null);
const confirmingTransfer = ref(false);
const originalMaster = ref<any>(null);
const transferAlertVisible = ref(false);
const transferAlertText = ref("");
const transferAlertType = ref<"success" | "error">("success");
const { startSaveTour, destroyTour: destroySaveTour, isActive: saveTourActive, pauseTourForNavigation, tryAutoResume, hasPausedTour } = useSaveCampaignTour({ onSaveClick: handleSave, onManageResourcesClick: handleManageResourcesAction, onEquipmentSkillsClick: handleEquipmentSkillsAction, campaignId });
const { startLoadTour, destroyTour: destroyLoadTour, isActive: loadTourActive } = useLoadCampaignTour({ onManageResourcesClick: handleManageResourcesAction, onEquipmentSkillsClick: handleEquipmentSkillsAction, campaignId });

// --- New Logic Vars ---
const dialogSaveConfirm = ref(false);
const dialogDeleteConfirm = ref(false);
const dialogNextDoorConfirm = ref(false);
const heroMenuVisible = ref(false);
const bookDialogVisible = ref(false);
const selectedHero = ref<any>(null);
const debugDialogVisible = ref(false);
const overrideWing = ref("");
const overrideDoor = ref("");
const scale = ref(1);
const pan = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const lastPos = ref({ x: 0, y: 0 });

// --- Computed ---
const currentWing = computed(() => overrideWing.value || campaign.value?.wing || "");
const currentDoor = computed(() => overrideDoor.value || campaign.value?.door || "");

const underkeep2Doors = {
  "WING 3 - ADVANCED": ["FIRST SETUP","DUNGEON FOYER", "QUEEN'S HALL", "THE FORGE", "ARTISAN'S GALLERY", "PROVING GROUNDS", "MAIN HALL"],
  "WING 4 - ADVANCED": ["FIRST SETUP", "DRACONIC CHAPEL", "CRYPTS", "LIBRARY", "LABORATORY"],
};

const currentDoorList = computed(() => {
  if (!currentWing.value || !isUnderkeep2.value) return [];
  return underkeep2Doors[currentWing.value as keyof typeof underkeep2Doors] || [];
});

const debugDoorList = computed(() => {
  if(!overrideWing.value) return [];
  return underkeep2Doors[overrideWing.value as keyof typeof underkeep2Doors] || [];
});

const nextDoorName = computed(() => {
  const list = currentDoorList.value;
  const idx = list.indexOf(currentDoor.value);
  if (idx === -1 || idx >= list.length - 1) return null;
  return list[idx + 1];
});

const canAdvance = computed(() => !!nextDoorName.value);

// Mapping Logic
const currentFilename = computed(() => {
  if (!currentWing.value || !currentDoor.value) return null;
  const wingMatch = currentWing.value.match(/WING\s*(\d+)/i);
  const wingPrefix = wingMatch ? `wing${wingMatch[1]}` : 'wing';
  
  const list = currentDoorList.value;
  const idx = list.indexOf(currentDoor.value);
  
  // idx 0 = setup, idx 1 = first_door...
  let doorSuffix = 'setup';
  const map = ['setup', 'first_door', 'second_door', 'third_door', 'fourth_door', 'fifth_door', 'sixth_door', 'seventh_door'];
  if (idx >= 0 && idx < map.length) { doorSuffix = map[idx]; }
  return `${wingPrefix}.${doorSuffix}.png`;
});

const currentBackgroundUrl = computed(() => {
  if (!currentFilename.value) return null;
  const wingMatch = currentWing.value.match(/WING\s*(\d+)/i);
  const wingFolder = wingMatch ? `wing${wingMatch[1]}` : 'wing';
  return new URL(`/src/assets/campaign_background/${wingFolder}/${currentFilename.value}`, import.meta.url).href;
});


// --- Actions ---
function setAlert(icon: string, title: string, text: string, type: "success" | "info" | "warning" | "error" | undefined, duration: number = 3000) {
  snackbarIcon.value = icon; snackbarTitle.value = title; snackbarText.value = text; snackbarColor.value = ({ success: "success", info: "info", warning: "warning", error: "error" } as any)[type || "info"]; snackbarTimeout.value = duration; snackbarVisible.value = true;
}

const checkUserRole = async () => {
  try {
    const { data } = await axios.get("rl_campaigns_users/search", { params: { users_fk: userStore.user.users_pk, campaigns_fk: campaignId } });
    showSaveCampaignButton.value = data.campaigns[0]?.party_role === "Admin";
    isAdmin.value = showSaveCampaignButton.value;
  } catch { showSaveCampaignButton.value = false; }
};

async function handleSave() {
  if (savePutRef.value) { try { await savePutRef.value.save(); } catch (error) { console.error(error); } }
}

const onSaveSuccess = () => { setAlert("mdi-check", "Success", "Campaign Saved!", "success"); };
const onSaveFail = () => setAlert("mdi-alert-circle", "Error", "Save failed.", "error");
const onCampaignRemoved = () => { setAlert("mdi-check", "Success", "Campaign removed", "success"); router.push({ name: "Campaigns" }); };
const onPlayerRemoved = async () => { setAlert("mdi-check", "Success", "Player removed", "success"); campaignPlayerListRef.value?.fetchPlayers(); };

const generatePartyCode = () => { partyCode.value = `${Math.floor(1000 + Math.random() * 9000)}${campaignId}`; };
const handleSpeedDialAction = (action: string) => { executeAction(action); speedDialOpen.value = false; };
const handleBottomNavAction = (action: string) => { setTimeout(() => bottomNavValue.value = null, 100); executeAction(action); };

const executeAction = (action: string) => {
  if (action === 'save') isUnderkeep2.value ? (dialogSaveConfirm.value = true) : handleSave();
  else if (action === 'qrcode') isUnderkeep2.value ? openInteractions() : handleQRCodeAction();
  else if (action === 'player-list') openPlayerListDialog();
  else if (action === 'remove') isUnderkeep2.value ? (dialogDeleteConfirm.value = true) : campaignRemoveRef.value?.openDialog?.();
  else if (action === 'export') campaignExportRef.value?.export?.();
  else if (action === 'load-instructions') startLoadTour();
};

const openPlayerListDialog = async () => { campaignPlayerListRef.value?.fetchPlayers(); playerListDialogVisible.value = true; };
const openTransferDialog = () => { transferDialogVisible.value = true; axios.get("/rl_campaigns_users/list_players", { params: { campaigns_fk: campaignId } }).then(({ data }) => { players.value = data.Users; originalMaster.value = players.value.find((u) => u.party_roles_fk === 1) || null; }); };
const initTransfer = (u: any) => { selectedUser.value = u; confirmingTransfer.value = true; };
const confirmTransfer = () => { transferLoading.value = true; setTimeout(() => { transferLoading.value = false; confirmingTransfer.value = false; transferDialogVisible.value = false; setAlert('mdi-check', 'Success', 'Master role transferred', 'success'); router.push({name: 'Campaigns'}); }, 1000); };
const closeTransferDialog = () => { transferDialogVisible.value = false; };
const cancelTransfer = () => { confirmingTransfer.value = false; selectedUser.value = null; };

// --- Old Methods ---
function scrollToHeroSection() { document.querySelector(".v-sheet.rounded.border-md")?.scrollIntoView({ behavior: "smooth", block: "start" }); }
function showHeroSelectionAlert(action: string, heroes: any[]) { setAlert("mdi-account-multiple", "Multiple Heroes", "Select hero below", "info"); setTimeout(scrollToHeroSection, 500); }
function navigateToHeroSequentialStateLegacy(heroId: string) { router.push({ name: "HeroSequentialState", params: { campaignId, heroId } }); }
function navigateToHeroEquipmentSkillsLegacy(heroId: string) { router.push({ name: "Hero", params: { campaignId, heroId } }); }
function handleManageResourcesAction() { const heroes = heroStore.findAllInCampaign(campaignId); if(heroes.length === 1) navigateToHeroSequentialStateLegacy(heroes[0].heroId); else showHeroSelectionAlert("manage", heroes); }
function handleEquipmentSkillsAction() { const heroes = heroStore.findAllInCampaign(campaignId); if(heroes.length === 1) navigateToHeroEquipmentSkillsLegacy(heroes[0].heroId); else showHeroSelectionAlert("equip", heroes); }
async function checkAndResumeTour() { await nextTick(); if(hasPausedTour()) tryAutoResume(); }
function handleQRCodeAction() { if(campaign.value && ['underkeep', 'underkeep2'].includes(campaign.value.campaign)) { currentTab.value = 'book'; nextTick(() => campaignBookRef.value?.forceNavigateToInteract()); } else { setAlert("mdi-info", "Info", "Underkeep only", "info"); } }

// --- New Logic Methods ---
const onWheel = (e: WheelEvent) => { const zoomIntensity = 0.1; const newScale = scale.value + (e.deltaY > 0 ? -1 : 1) * zoomIntensity; scale.value = Math.min(Math.max(0.5, newScale), 4); };
const startDrag = (e: MouseEvent) => { isDragging.value = true; lastPos.value = { x: e.clientX, y: e.clientY }; };
const onDrag = (e: MouseEvent) => { if (!isDragging.value) return; pan.value = { x: pan.value.x + (e.clientX - lastPos.value.x), y: pan.value.y + (e.clientY - lastPos.value.y) }; lastPos.value = { x: e.clientX, y: e.clientY }; };
const stopDrag = () => isDragging.value = false;
const startTouch = (e: TouchEvent) => { if (e.touches.length === 1) { isDragging.value = true; lastPos.value = { x: e.touches[0].clientX, y: e.touches[0].clientY }; } };
const onTouch = (e: TouchEvent) => { if (!isDragging.value || e.touches.length !== 1) return; pan.value = { x: pan.value.x + (e.touches[0].clientX - lastPos.value.x), y: pan.value.y + (e.touches[0].clientY - lastPos.value.y) }; lastPos.value = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };

const openHeroMenu = (hero: any) => { selectedHero.value = hero; heroMenuVisible.value = true; };
const navigateToHeroSequentialState = () => { if(selectedHero.value) { heroMenuVisible.value = false; router.push({ name: "HeroSequentialState", params: { campaignId, heroId: selectedHero.value.heroId } }); } };
const navigateToHeroEquipmentSkills = () => { if(selectedHero.value) { heroMenuVisible.value = false; router.push({ name: "Hero", params: { campaignId, heroId: selectedHero.value.heroId } }); } };

const confirmRemoveHero = async () => {
  if (selectedHero.value) {
     try {
       await axios.delete(`/rl_campaigns_heroes`, { data: { campaigns_fk: campaignId, heroes_fk: selectedHero.value.heroId } });
       setAlert("mdi-check", "Success", "Hero removed", "success");
       heroMenuVisible.value = false;
       campaignPlayerListRef.value?.fetchPlayers(); // Refresh logic
       heroStore.fetchByCampaign(campaignId); // Refresh store
     } catch(e) {
       setAlert("mdi-alert", "Error", "Failed to remove hero", "error");
     }
  }
};

const confirmSave = async () => { dialogSaveConfirm.value = false; await handleSave(); };
const confirmDelete = () => { dialogDeleteConfirm.value = false; campaignRemoveRef.value?.openDialog?.(); };
const confirmNextDoor = () => { 
  if (nextDoorName.value) { 
    campaignStore.updateCampaignProperty(campaignId, 'door', nextDoorName.value); 
    dialogNextDoorConfirm.value = false; 
    pan.value = { x: 0, y: 0 }; 
    scale.value = 1; 
  } 
};
const openBook = () => { bookDialogVisible.value = true; };
const openInteractions = () => { bookDialogVisible.value = true; setTimeout(() => campaignBookRef.value?.navigateToInteract(), 300); };
const openKeywords = () => { bookDialogVisible.value = true; setTimeout(() => campaignBookRef.value?.navigateToKeywords(), 300); };
const openSceneInBook = () => { openBook(); };

// Watchers
watch(campaign, (c) => { if (c) { isSequentialAdventure.value = c.isSequentialAdventure ?? false; if (!['underkeep', 'underkeep2'].includes(c.campaign)) currentTab.value = "normal"; } }, { deep: true });
watch(() => route.path, async (newPath, oldPath) => { if (oldPath && (oldPath.includes("/hero") && newPath.includes(`/campaign/${campaignId}`))) { await checkAndResumeTour(); } });

onMounted(async () => {
  if (!campaignId) { setAlert("mdi-alert-circle", "Error", "Missing ID", "error"); return; }
  const found = campaignStore.find(campaignId);
  if (found) { campaign.value = found; if (!campaign.value.isSequentialAdventure) campaign.value.isSequentialAdventure = true; }
  else setAlert("mdi-alert", "Error", "Campaign not found", "error");
  
  await checkUserRole();
  generatePartyCode();
  const isUnderkeep = campaign.value && ['underkeep', 'underkeep2'].includes(campaign.value.campaign);
  if(isUnderkeep) { 
      // logic for old underkeep tour 
      if(route.query.openInstructions === 'load') { await nextTick(); setTimeout(startLoadTour, 300); }
  }
});
</script>

<style scoped>
/* GLOBAL & CLASSIC STYLES (Mantidos do original) */
.global-snackbar { z-index: 9999 !important; }
:deep(.v-snackbar__wrapper) { min-width: 344px; max-width: 500px; }
.campaign-content { position: relative; overflow-x: hidden; padding-bottom: 16px; }
.campaign-content.with-bottom-nav { padding-bottom: 80px; }
.speed-dial-activator { position: fixed; right: 10px; bottom: 80px; z-index: 2000; }
.mobile-bottom-nav { position: fixed !important; bottom: 0 !important; z-index: 1999 !important; }
.bottom-nav-btn-qr { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; }
.bottom-nav-btn { flex-direction: column !important; min-width: 60px !important; padding: 8px 12px !important; height: 100% !important; }
.bottom-nav-btn .v-icon { margin-bottom: 4px !important; font-size: 24px !important; }
.bottom-nav-label { font-size: 0.75rem !important; line-height: 1 !important; margin-top: 2px !important; }
.bottom-nav-btn-qr .v-icon { margin-bottom: 4px !important; font-size: 32px !important; }
.bottom-nav-label-qr { font-size: 0.8rem !important; font-weight: 700 !important; }

/* GAME BOARD STYLES (NEW - Underkeep 2) */
.game-board { width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; background-color: #000; overflow: hidden; z-index: 1; }
.map-container { width: 100%; height: 100%; overflow: hidden; cursor: grab; touch-action: none; }
.map-container:active { cursor: grabbing; }
.map-layer { transform-origin: center center; transition: transform 0.1s ease-out; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.background-image { height: 100%; width: auto; object-fit: contain; box-shadow: 0 0 50px rgba(0,0,0,0.8); pointer-events: none; }
.ui-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10; padding: 16px; }
.ui-group { position: absolute; pointer-events: auto; }

/* Positions */
.top-left { top: 16px; left: 16px; }
.top-right { top: 16px; right: 16px; }
.bottom-left { bottom: 16px; left: 16px; }
.bottom-right { bottom: 16px; right: 16px; }
.bottom-center { bottom: 0px; left: 50%; transform: translateX(-50%); width: auto; padding-bottom: 0; }

/* Buttons Standard */
.game-btn { text-transform: none; font-family: "Cinzel Decorative", serif; letter-spacing: 1px; border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
.nav-btn { text-transform: none; font-family: "Roboto", sans-serif !important; letter-spacing: 0.5px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 10px rgba(0,0,0,0.6); }
.square-btn { min-width: 80px; width: 80px; border-radius: 8px; }
.scene-btn { font-weight: bold; min-width: 200px; }
.next-door-btn { min-width: 220px; border: 2px solid #ffb300; }
.icon-only { min-width: 48px; padding: 0; }

/* Heroes */
.heroes-container { display: flex; align-items: flex-end; gap: 16px; }
.hero-flag-wrapper { position: relative; width: 100px; height: 120px; cursor: pointer; transition: transform 0.2s; display: flex; justify-content: center; }
.hero-flag-wrapper:hover { transform: translateY(-10px); }
.hero-flag { position: absolute; bottom: 0; width: 100%; height: auto; z-index: 1; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8)); }
.hero-full-image-container { position: absolute; bottom: 25px; z-index: 2; height: 150px; display: flex; align-items: flex-end; justify-content: center; }
.hero-full-img { max-height: 100%; width: auto; filter: drop-shadow(0 0 5px rgba(0,0,0,0.5)); }

/* Orientation Check */
.orientation-warning { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(10, 10, 10, 0.95); z-index: 9999; flex-direction: column; align-items: center; justify-content: center; color: white; text-align: center; }

@media screen and (orientation: portrait) and (max-width: 960px) {
  .orientation-warning { display: flex; }
  .ui-overlay, .map-container { display: none; }
}

/* Mobile Adjustments (Celular Deitado) */
@media (max-width: 960px) {
  .ui-overlay { padding: 4px; }
  
  .top-left { top: 4px; left: 4px; }
  .top-right { top: 4px; right: 4px; }
  .bottom-left { bottom: 4px; left: 4px; }
  .bottom-right { bottom: 4px; right: 4px; }
  
  /* Scale down buttons dramatically */
  .nav-btn, .game-btn { 
    font-size: 0.65rem !important; 
    height: 28px !important; 
    padding: 0 8px !important; 
    min-width: auto !important;
  }
  .nav-btn .v-icon, .game-btn .v-icon { font-size: 16px !important; margin-right: 4px; }
  
  .square-btn { min-width: 45px !important; width: 45px !important; height: 45px !important; }
  .square-btn .v-icon { font-size: 20px !important; margin-bottom: 0 !important; }
  .square-btn span { font-size: 0.5rem !important; display: none; } /* Hide text on small screens */

  .scene-btn { min-width: 100px !important; }
  .next-door-btn { min-width: 120px !important; height: 35px !important; }
  .next-door-btn span { font-size: 0.7rem !important; }
  
  /* Heroes Mobile */
  .hero-flag-wrapper { width: 60px; height: 80px; }
  .hero-full-image-container { height: 90px; bottom: 15px; }
  .heroes-container { gap: 8px; }
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>