<template>
  <div
    class="immersive-container"
    :class="{ 'desktop-layout': $vuetify.display.mdAndUp }"
  >
    <div
      class="map-viewport"
      ref="mapContainerRef"
      @mousedown="startDrag"
      @touchstart.prevent="handleTouchStart"
      @touchmove.prevent="handleTouchMove"
      @touchend="handleTouchEnd"
      @wheel.prevent="handleZoom"
    >
      <div class="map-content" :style="mapTransformStyle">
        <img
          v-if="currentBackgroundImage"
          ref="mapImageRef"
          :src="currentBackgroundImage"
          class="map-image"
          alt="Campaign Map"
          @error="handleImageError"
          @load="updateBounds"
        />
        <div
          v-else
          class="d-flex align-center justify-center fill-height text-grey bg-black"
        >
          <v-progress-circular indeterminate color="white" />
        </div>
      </div>
    </div>

    <div class="hud-layer">
      <div class="hud-area top-left">
        <div class="interactive-content d-flex flex-column align-start">
          <div class="objective-panel mb-2">
            <div
              class="objective-label text-uppercase text-caption font-weight-bold text-blue-lighten-3"
            >
              Current Objective:
            </div>
            <div class="objective-text text-white font-weight-bold text-shadow">
              {{ currentLocationDisplay }}
            </div>
          </div>

          <div class="d-flex flex-column gap-2 mt-1">
            <v-tooltip text="Read Tutorial" location="right" v-if="isWing3Start">
              <template v-slot:activator="{ props }">
                <div 
                   v-bind="props" 
                   class="bookmark-tab left-side start-here-tab mb-2" 
                   @click.stop="openStartHere"
                >
                   <v-icon icon="mdi-school" color="amber-accent-2"></v-icon>
                   <span class="d-none d-md-inline font-weight-bold text-caption text-label ml-2 text-amber-accent-2">START HERE</span>
                </div>
              </template>
            </v-tooltip>

            <v-tooltip text="Campaign Book" location="right">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="props"
                  class="bookmark-tab left-side"
                  @click.stop="openBookDialog"
                >
                  <v-icon icon="mdi-book-open-variant"></v-icon>
                  <span
                    class="d-none d-md-inline font-weight-bold text-caption text-label ml-2"
                    >BOOKS</span
                  >
                </div>
              </template>
            </v-tooltip>

            <v-tooltip text="Keywords" location="right">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="props"
                  class="bookmark-tab left-side"
                  @click.stop="openKeywordsDialog"
                >
                  <v-icon icon="mdi-book-search-outline"></v-icon>
                  <span
                    class="d-none d-md-inline font-weight-bold text-caption text-label ml-2"
                    >KEYWORDS</span
                  >
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
                  <img
                    src="@/assets/door.png"
                    alt="Door"
                    class="tab-icon-img"
                    style="width: 24px; height: 24px"
                  />
                  <span
                    class="d-none d-md-inline font-weight-bold text-caption text-label ml-2"
                    >RULES</span
                  >
                </div>
              </template>
            </v-tooltip>
          </div>
        </div>
      </div>

      <div class="hud-area top-right">
        <div class="interactive-content d-flex flex-column align-end gap-2">
          <div class="d-flex flex-row align-center gap-2 mb-1">
            <v-tooltip text="Exit to Dashboard" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-exit-to-app"
                  class="square-hud-btn"
                  color="error"
                  variant="flat"
                  @click="dashboardExitDialog.visible = true"
                ></v-btn>
              </template>
            </v-tooltip>
          </div>

          <div
            v-if="currentMonsters.length > 0"
            class="d-flex flex-column align-end mt-2 w-100"
          >
            <div
              class="bookmark-tab right-side mb-1"
              @click="showMonstersPanel = !showMonstersPanel"
            >
              <span
                class="text-caption font-weight-bold mr-2 text-grey-lighten-1 d-none d-md-inline"
                >MONSTERS</span
              >
              <v-icon size="small">{{
                showMonstersPanel ? "mdi-eye-off" : "mdi-skull"
              }}</v-icon>
            </div>

            <transition-group
              name="slide-fade"
              tag="div"
              class="d-flex flex-row gap-2 align-center justify-end monster-list-container"
              v-if="showMonstersPanel"
            >
              <div
                v-for="(monster, index) in currentMonsters"
                :key="monster + index"
                class="monster-card"
                @click.stop="openMonsterGroupDialog"
              >
                <img
                  :src="getMonsterImageSrc(monster)"
                  @error="onMonsterImgError"
                  :alt="monster"
                />
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
                <v-btn
                  v-bind="props"
                  icon="mdi-account-group"
                  class="square-hud-btn"
                  @click.stop="playerListDialogVisible = true"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip
              text="Leave Campaign"
              location="top"
              v-if="showSaveCampaignButton"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete-forever"
                  class="square-hud-btn"
                  color="grey-darken-3"
                  @click.stop="confirmLeave"
                ></v-btn>
              </template>
            </v-tooltip>
          </div>
        </div>
      </div>

      <div class="hud-area bottom-center">
        <div class="heroes-rack interactive-content">
          <div
            v-for="hero in enrichedHeroes"
            :key="hero.heroId"
            class="hero-token-wrapper"
            @click.stop="openHeroCard(hero)"
          >
            <div class="hero-token">
              <v-img
                :src="
                  hero.images?.avatar ||
                  hero.images?.trackerimage ||
                  '/assets/hero/avatar/default.webp'
                "
                cover
                class="hero-token-img"
                @error="onImgError"
              ></v-img>
            </div>
            <div class="hero-name-tag">{{ hero.name }}</div>
          </div>
        </div>
      </div>

      <div class="hud-area bottom-right">
        <div class="interactive-content d-flex flex-column align-end gap-3">
          <v-tooltip
            text="Interactions"
            location="left"
            v-if="showInteractionsButton"
          >
            <template v-slot:activator="{ props }">
              <div
                v-bind="props"
                class="right-tab-btn interaction-tab"
                @click.stop="openInteractionsDialog"
              >
                <img
                  src="@/assets/interaction.png"
                  alt="icon"
                  class="tab-icon-img"
                />
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
                <v-icon size="large" color="#e0e0e0"
                  >mdi-book-open-page-variant</v-icon
                >
              </div>
            </template>
          </v-tooltip>

          <v-tooltip :text="nextButtonLabel" location="left" v-if="showSaveCampaignButton">
            <template v-slot:activator="{ props }">
              <div
                v-bind="props"
                class="right-tab-btn primary-tab"
                style="
                  width: auto !important;
                  padding-left: 16px;
                  padding-right: 12px;
                  justify-content: flex-end;
                "
                @click.stop="handleNextAction"
              >
                <v-icon size="large" color="white">{{ nextButtonIcon }}</v-icon>
              </div>
            </template>
          </v-tooltip>
        </div>
      </div>
    </div>

    <v-dialog v-model="dashboardExitDialog.visible" max-width="400">
        <v-card class="bg-grey-darken-3 rounded-lg border-thin">
            <v-card-title class="text-center text-white pt-4">Return to Dashboard?</v-card-title>
            <v-card-text class="text-center text-grey-lighten-1 pb-4">
                You will leave the campaign view. Your game state is saved automatically.
            </v-card-text>
            <v-card-actions class="d-flex justify-center pb-4 gap-3">
                <v-btn color="grey" variant="text" @click="dashboardExitDialog.visible = false">Cancel</v-btn>
                <v-btn color="error" variant="elevated" @click="exitToDashboard">Exit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="enterBossDialog.visible" max-width="400" persistent>
        <v-card class="bg-red-darken-4 border-xl border-white rounded-lg">
            <v-card-title class="text-center text-uppercase font-weight-bold pt-4 text-h5">
                <v-icon start size="small">mdi-skull</v-icon> Enter Dragon's Lair
                <v-icon end size="small">mdi-skull</v-icon>
            </v-card-title>
            <v-card-text class="text-center py-4 text-body-1">
                Are you prepared to face the Dragon?<br />There is no turning back.
            </v-card-text>
            <v-card-actions class="justify-center pb-4">
                <v-btn color="white" variant="text" @click="enterBossDialog.visible = false">Not Yet</v-btn>
                <v-btn color="black" class="text-red-accent-2 font-weight-bold" variant="elevated" @click="confirmEnterBossRoom">FIGHT!</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="finishCampaignDialog.visible" max-width="400" persistent>
      <v-card class="bg-grey-darken-4 border-xl border-amber rounded-lg">
        <v-card-title class="text-center text-uppercase font-weight-bold pt-4 text-h5 text-amber">
          <v-icon start size="small">mdi-check-bold</v-icon> Finish Campaign
        </v-card-title>
        <v-card-text class="text-center py-4 text-body-1">
          Are you ready to mark this adventure as complete?<br/><br/>
          <span class="text-grey text-caption">Don't worry, you can still access the campaign log and books after finishing.</span>
        </v-card-text>
        <v-card-actions class="justify-center pb-4">
          <v-btn color="white" variant="text" @click="finishCampaignDialog.visible = false">Not Yet</v-btn>
          <v-btn color="amber-accent-4" class="text-black font-weight-bold" variant="elevated" @click="confirmFinishCampaign">FINISH</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="tutorialPromptDialog.visible" max-width="400" persistent>
        <v-card class="bg-grey-darken-4 border-xl border-amber-accent-4 rounded-lg elevation-20">
            <v-card-title class="text-center text-uppercase font-weight-bold pt-6 text-h5 text-amber-accent-2" style="font-family: 'Cinzel', serif;">
                <v-icon start icon="mdi-school" class="mr-2"></v-icon> Tutorial Available
            </v-card-title>
            <v-card-text class="py-4 px-6 text-body-1">
                <p class="text-center">Welcome to <strong>Drunagor Nights</strong>.</p>
                <p class="mt-2 text-center text-grey-lighten-1">Would you like to open the <strong>"Start Here"</strong> guide to learn the basics and setup your heroes?</p>
                
                <v-checkbox
                  v-model="tutorialPromptDialog.dontShowAgain"
                  label="Don't ask me again"
                  color="amber-accent-4"
                  density="compact"
                  class="mt-4"
                  hide-details
                ></v-checkbox>
            </v-card-text>
            <v-card-actions class="justify-center pb-6 gap-4">
                <v-btn color="grey" variant="text" @click="declineTutorial">Maybe Later</v-btn>
                <v-btn color="amber-accent-4" variant="flat" class="text-black font-weight-bold px-6" @click="acceptTutorial">Read Now</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="interactionsDialog.visible" fullscreen transition="dialog-bottom-transition" :scrim="false">
      <v-card color="black">
        <InteractViewNew
          v-if="interactionsDialog.visible"
          :current-door="activeCampaignData.door"
          :wing="activeCampaignData.wing"
          @close="interactionsDialog.visible = false"
          @open-scene="handleOpenScene"
        />
      </v-card>
    </v-dialog>

    <v-dialog v-model="bookDialog.visible" fullscreen transition="dialog-bottom-transition" :scrim="false">
      <v-card color="black" class="book-dialog-card">
        <v-toolbar color="primary" density="compact" class="d-none d-md-block">
          <v-btn icon="mdi-close" @click="bookDialog.visible = false"></v-btn>
          <v-toolbar-title>{{ bookDialog.title }}</v-toolbar-title>
        </v-toolbar>
        <v-btn
            v-if="$vuetify.display.smAndDown"
            icon="mdi-close"
            color="red"
            variant="elevated"
            size="small"
            class="mobile-close-book-btn"
            elevation="8"
            @click="bookDialog.visible = false"
        ></v-btn>
        <CampaignBookNew ref="campaignBookRef" :campaign-wing="bookContext" />
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
        <NextDoorQRScanner v-if="doorScannerDialog.visible" @scanned="handleDoorScanned" @manual-advance="handleManualAdvance" />
      </v-card>
    </v-dialog>

    <v-dialog v-model="leaveDialog.visible" max-width="400">
      <v-card title="Leave Campaign" class="bg-grey-darken-3">
        <v-card-text class="pa-4 text-body-1">Are you sure you want to permanently leave this campaign?</v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="leaveDialog.visible = false">Cancel</v-btn>
            <v-btn color="error" variant="elevated" @click="leaveDialog.onConfirm">Leave</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="narrativeDialogVisible" max-width="800" scrollable persistent>
      <v-card class="book-style-card rounded-xl overflow-hidden">
        <v-toolbar color="#10594f" density="compact" class="px-2">
          <v-toolbar-title class="text-white font-weight-bold pl-2" style="font-family: serif">{{ currentDoorData?.title?.toUpperCase() }} - STORY</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" color="white" @click="narrativeDialogVisible = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-4" style="max-height: 80vh; overflow-y: auto">
          <v-container fluid v-if="currentDoorData">
            <v-row>
              <v-col cols="12" class="pt-4 mt-3">
                <div v-html="currentDoorData.body" class="narrative-text"></div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-center py-4" style="background-color: #eee8e0">
          <v-btn color="brown-darken-3" variant="flat" size="large" class="px-6 font-weight-bold" @click="proceedToInstructions">CONTINUE TO INSTRUCTIONS <v-icon end>mdi-arrow-right</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="instructionsDialogVisible" max-width="900" scrollable>
      <v-card class="book-style-card rounded-xl overflow-hidden">
        <v-toolbar color="#10594f" density="compact" class="px-2">
          <v-toolbar-title class="text-white font-weight-bold pl-2" style="font-family: serif">{{ currentDoorData?.title?.toUpperCase() }} - RULES</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" color="white" @click="instructionsDialogVisible = false"></v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-4" style="max-height: 80vh; overflow-y: auto; overflow-x: hidden;">
          <v-container fluid v-if="currentDoorData">
            
            <v-row>
                <v-col cols="12">
                    <div v-if="currentDoorData.instruction" v-html="currentDoorData.instruction" class="instruction-box"></div>
                    <div v-else class="text-center pa-10 text-grey font-italic">No specific rules required at this time.</div>
                </v-col>
            </v-row>

            <v-row v-if="currentDoorData.scene" class="mt-6 mb-4">
                <v-col cols="12" class="d-flex flex-column align-center">
                    <v-divider class="w-100 mb-6 border-opacity-50" color="black"></v-divider>
                    
                    <div class="text-center font-italic text-brown-darken-4 mb-4 font-weight-bold" style="font-family: 'Cinzel', serif;">
                        <v-icon start color="brown-darken-4">mdi-book-open-page-variant</v-icon>
                        Note: This Scene can also be found in the Campaign Books.
                    </div>

                    <div class="book-page w-100 mx-auto shadow-lg mt-2">
                         <div class="content-block pb-6">
                             <div class="header-banner" :style="{ backgroundImage: `url(${booktops2Img})` }">
                                 <div class="d-flex align-center justify-space-between pa-0 pb-0">
                                     <h4 class="section-title">{{ currentDoorData.scene.sectionTitle }}</h4>
                                 </div>
                                 <h2 class="chapter-title-banner">{{ currentDoorData.scene.title }}</h2>
                             </div>
                             
                             <div class="body-text mt-6 px-4 px-md-8" v-html="currentDoorData.scene.body"></div>
                         </div>
                     </div>
                </v-col>
            </v-row>

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
            <CampaignLogSequentialAdventure :campaign-id="campaignId" :hero-id="heroCardDialog.hero.heroId || heroCardDialog.hero.id" :hero="heroCardDialog.hero" :hide-manage-button="true" />
          </v-container>
        </v-card-text>
        <v-card-actions class="bg-grey-darken-3 pa-4 d-flex justify-space-between gap-4">
          <v-btn color="amber-accent-4" variant="elevated" class="flex-grow-1 text-black font-weight-bold" prepend-icon="mdi-sack" @click="openResources(heroCardDialog.hero.heroId || heroCardDialog.hero.id)">Resources</v-btn>
          <v-btn color="light-blue-accent-3" variant="elevated" class="flex-grow-1 text-black font-weight-bold" prepend-icon="mdi-shield-sword" @click="openEquipment(heroCardDialog.hero.heroId || heroCardDialog.hero.id)">Equipment</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="playerListDialogVisible" max-width="600">
        <v-card title="Player List" class="bg-grey-darken-3">
            <v-card-text>
              <CampaignPlayerList :campaign-id="campaignId" :show-remove-button="showSaveCampaignButton" /> 
            </v-card-text>
            <v-card-actions class="d-flex flex-wrap justify-space-around pa-4">
                <v-btn @click="openInviteDialog" variant="elevated" rounded color="primary">Invite Player</v-btn>
                <v-btn variant="text" @click="playerListDialogVisible = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="addHeroDialogVisible" max-width="500">
        <v-card title="Add Hero" class="bg-grey-darken-3">
            <v-card-text>
              <CampaignLogAddHero :campaign-id="campaignId" @hero-added="addHeroDialogVisible = false" />
              <CampaignLogImportHero :campaign-id="campaignId" @hero-added="addHeroDialogVisible = false" /> 
            </v-card-text>
            <v-card-actions><v-btn block @click="addHeroDialogVisible = false">Close</v-btn></v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="wing4ChoiceDialog.visible" max-width="400">
      <v-card class="bg-grey-darken-3 pa-4 text-center">
        <v-card-title>Select Path</v-card-title>
        <v-card-text>Which door are you opening?</v-card-text>
        <v-card-actions class="justify-center flex-column gap-2">
          <v-btn block color="purple-accent-2" variant="elevated" class="text-black font-weight-bold" @click="commitWing4Choice('DRACONIC CHAPEL')"><v-icon start>mdi-church</v-icon> Door 1</v-btn>
          <v-btn block color="cyan-accent-2" variant="elevated" class="text-black font-weight-bold" @click="commitWing4Choice('CRYPTS')"><v-icon start>mdi-grave-stone</v-icon> Door 2</v-btn>
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
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { CampaignStore } from "@/store/CampaignStore";
import { useTutorialStore } from "@/store/TutorialStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import axios from "axios";

import doorInstructionsData from "@/data/door/DoorInstructions.json";
import bookPagesData from "@/data/book/bookPages.json";
import booktops2Img from "@/assets/booktops2.png"; 

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

interface Door {
  doors_pk: number;
  name: string;
  code: string | null;
}

interface OpenedDoorRecord {
  rl_campaigns_doors_pk: number;
  doors_fk: number;
  campaign_fk: number;
  date: string;
  door_name: string;
  door_code: string;
}

const props = defineProps<{
  campaignId: string;
  campaign: any;
  heroStore: any;
  userStore: any;
  showSaveCampaignButton: boolean;
}>();

const emit = defineEmits<{
  (e: "refresh-campaign"): void;
}>();

const router = useRouter();
const campaignStore = CampaignStore();
const tutorialStore = useTutorialStore();
const heroDataRepository = new HeroDataRepository();

const campaignBookRef = ref<any>(null);

const savePutRef = ref<any>(null);
const campaignRemoveRef = ref<any>(null);
const campaignExportRef = ref<any>(null);
const shareCampaignRef = ref<any>(null);
const mapContainerRef = ref<HTMLElement | null>(null);
const mapImageRef = ref<HTMLImageElement | null>(null);

const playerListDialogVisible = ref(false);
const addHeroDialogVisible = ref(false);
const bookDialog = ref({ visible: false, title: "Campaign Book" });
const keywordsDialog = ref({ visible: false });
const doorScannerDialog = ref({ visible: false });
const narrativeDialogVisible = ref(false);
const instructionsDialogVisible = ref(false);
const interactionsDialog = ref({ visible: false });
const leaveDialog = ref({ visible: false, onConfirm: () => {} });
const wing4ChoiceDialog = ref({ visible: false });
const heroCardDialog = ref({ visible: false, hero: null as any });
const monsterGroupDialog = ref({ visible: false });
const enterBossDialog = ref({ visible: false });
const finishCampaignDialog = ref({ visible: false });
const dashboardExitDialog = ref({ visible: false }); 
const snackbar = ref({ visible: false, text: "", color: "success" });
const showMonstersPanel = ref(true);

const tutorialPromptDialog = ref({ visible: false, dontShowAgain: false });
const bookContext = ref('');

const partyCode = ref<string | null>(null);
const forcedDoorInstruction = ref<string | null>(null);

const allDoors = ref<Door[]>([]);
const openedDoors = ref<Set<string>>(new Set());
let pollingInterval: number | null = null;

const WING3_ORDER = [
    "FIRST SETUP",
    "DUNGEON FOYER",
    "QUEEN'S HALL",
    "THE FORGE",
    "ARTISAN'S GALLERY",
    "PROVING GROUNDS",
    "MAIN HALL"
];

const WING4_ORDER = [
    "FIRST SETUP",
    "DRACONIC CHAPEL", 
    "CRYPTS", 
    "BOTH OPEN", 
    "LIBRARY", 
    "LABORATORY", 
    "DRAGON BOSS" 
];

const enrichedHeroes = computed(() => {
  const heroes = props.heroStore.findAllInCampaign(props.campaignId) || [];
  return heroes.map((h: any) => ({
    ...heroDataRepository.find(h.heroId || h.id),
    ...h,
  }));
});

const activeCampaignData = computed(
  () => campaignStore.find(props.campaignId) || props.campaign || {},
);

const currentLocationDisplay = computed(
  () =>
    `${activeCampaignData.value.wing || "Unknown"} - ${activeCampaignData.value.door || "Setup"}`,
);

const isWing3Start = computed(() => {
    const wing = (activeCampaignData.value.wing || '').toUpperCase();
    const door = (activeCampaignData.value.door || '').toUpperCase();
    if (wing.includes("WING 3")) {
        return ["FIRST SETUP", "DUNGEON FOYER"].includes(door);
    }
    return false;
});

const currentDoorData = computed(() => {
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const currentDoor = (activeCampaignData.value.door || "").toUpperCase();
  
  const sectionData = doorInstructionsData.find((s: any) => {
    if (wing.includes("WING 3")) return s.section === "WING 3 - DOORS";
    if (wing.includes("WING 4")) return s.section === "WING 4 - DOORS";
    return false;
  });
  
  if (!sectionData) return null;
  
  let doorData = null;
  if (forcedDoorInstruction.value) {
    doorData = sectionData.content.find((c: any) => c.title === forcedDoorInstruction.value);
  } else {
    if (wing.includes("WING 4") && currentDoor === "BOTH OPEN") return null;
    doorData = sectionData.content.find((c: any) => c.title === currentDoor);
  }

  if (!doorData) return null;

  let sceneObj = null;
  const sceneMatch = doorData.instruction?.match(/read '(scene\s*[-–]\s*[^']+)'/i) || 
                     doorData.instruction?.match(/read (scene\s*[-–]\s*[^<]+)/i);

  if (sceneMatch) {
      const rawMatch = sceneMatch[1];
      
      let sceneIdTarget = rawMatch
          .toLowerCase()
          .replace(/scene\s*[-–]\s*/, "scene-")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-");

      let titleTarget = rawMatch
          .toLowerCase()
          .replace(/scene\s*[-–]\s*/, "")
          .trim();

      for (const bSection of bookPagesData) {
          if (!bSection.content) continue;
          for (const item of bSection.content) {
              const itemTitle = (item.title || "").toLowerCase().trim();
              if (item.id === sceneIdTarget || itemTitle === titleTarget) {
                  sceneObj = { ...item, sectionTitle: bSection.section };
                  break;
              }
          }
          if (sceneObj) break;
      }
  }

  return {
      ...doorData,
      scene: sceneObj
  };
});

const currentMonsters = computed(() => {
  const location = (
    forcedDoorInstruction.value ||
    activeCampaignData.value.door ||
    ""
  ).toUpperCase();
  const wing = (activeCampaignData.value.wing || "").toUpperCase();

  if (wing.includes("WING 3")) {
    switch (location) {
      case "FIRST SETUP":
        return ["MarksmanChampion", "CryptGuardian"];
      case "DUNGEON FOYER":
        return ["DarknessWraith", "PredatorVeteran"];
      case "THE FORGE":
        return ["HulkChampion", "FanaticChampion"];
      case "ARTISAN'S GALLERY":
        return [];
      case "PROVING GROUNDS":
        return ["MarksmanChampion", "HeadhunterChampion", "ComanderPlage"];
      case "MAIN HALL":
        return ["ShadowArmor"];
      default:
        return [];
    }
  }

  if (wing.includes("WING 4")) {
    switch (location) {
      case "DRACONIC CHAPEL":
        return ["MarksmanChampion", "HeadhunterChampion"];
      case "CRYPTS":
        return ["FanaticChampion", "GhoulChampion"];
      case "LIBRARY":
        return ["Hunter", "Mauler", "Phantom"];
      case "LABORATORY":
        return ["Hunter", "Mauler", "Phantom"];
      case "DRAGON BOSS":
        return ["Dragon"];
      default:
        return [];
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
    const doorsList = [
      "FIRST SETUP",
      "DUNGEON FOYER",
      "QUEEN'S HALL",
      "THE FORGE",
      "ARTISAN'S GALLERY",
      "PROVING GROUNDS",
      "MAIN HALL",
    ];
    const idx = doorsList.indexOf(door);
    const doorMap = [
      "setup",
      "first_door",
      "second_door",
      "third_door",
      "fourth_door",
      "fifth_door",
      "sixth_door",
      "seventh_door",
    ];
    doorFile = doorMap[idx] || "setup";
  }
  try {
    return new URL(
      `../assets/campaign_background/${wingFolder}/${wingFolder}.${doorFile}.png`,
      import.meta.url,
    ).href;
  } catch {
    return "";
  }
});

const isBossBattle = computed(() => {
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const door = (activeCampaignData.value.door || "").toUpperCase();
  if (wing.includes("WING 3") && door === "MAIN HALL") return true;
  if (wing.includes("WING 4") && door === "DRAGON BOSS") return true;
  return false;
});

const showInteractionsButton = computed(() => {
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const door = (activeCampaignData.value.door || "").toUpperCase();
  if (isBossBattle.value) return false;
  if (wing.includes("WING 3"))
    return [
      "FIRST SETUP",
      "DUNGEON FOYER",
      "QUEEN'S HALL",
      "THE FORGE",
      "ARTISAN'S GALLERY",
      "PROVING GROUNDS",
    ].includes(door);
  if (wing.includes("WING 4"))
    return [
      "FIRST SETUP",
      "DRACONIC CHAPEL",
      "CRYPTS",
      "BOTH OPEN",
      "LIBRARY",
      "LABORATORY",
    ].includes(door);
  return false;
});

const nextButtonLabel = computed(() => {
    if (isBossBattle.value) return "FINISH CAMPAIGN";
    const wing = (activeCampaignData.value.wing || "").toUpperCase();
    const door = (activeCampaignData.value.door || "").toUpperCase();
    if (wing.includes("WING 4") && (door === "LIBRARY" || door === "LABORATORY")) {
        return "ENTER BOSS ROOM";
    }
    return "OPEN NEXT DOOR";
});

const nextButtonIcon = computed(() => {
    if (isBossBattle.value) return "mdi-check-bold";
    const wing = (activeCampaignData.value.wing || "").toUpperCase();
    const door = (activeCampaignData.value.door || "").toUpperCase();
    if (wing.includes("WING 4") && (door === "LIBRARY" || door === "LABORATORY")) {
        return "mdi-sword-cross";
    }
    return "mdi-door-open";
});

const transform = ref({ x: 0, y: 0, scale: 1 });
let isDragging = false;
let startPos = { x: 0, y: 0 };
let initialPinchDistance = 0;
let initialScale = 1;
const MIN_SCALE = 1;
const MAX_SCALE = 4;

const mapTransformStyle = computed(() => ({
  transform: `translate(${transform.value.x}px, ${transform.value.y}px) scale(${transform.value.scale})`,
  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
}));

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function updateBounds() {
  if (!mapContainerRef.value || !mapImageRef.value) return;
  const container = mapContainerRef.value.getBoundingClientRect();
  const scaledWidth = mapImageRef.value.naturalWidth * transform.value.scale;
  const scaledHeight = mapImageRef.value.naturalHeight * transform.value.scale;
  
  if (scaledWidth <= container.width) {
      transform.value.x = 0;
  } else {
      const overflowX = (scaledWidth - container.width) / 2;
      transform.value.x = clamp(transform.value.x, -overflowX, overflowX);
  }
  
  if (scaledHeight <= container.height) {
      transform.value.y = 0;
  } else {
      const overflowY = (scaledHeight - container.height) / 2;
      transform.value.y = clamp(transform.value.y, -overflowY, overflowY);
  }
}

function handleZoom(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  const newScale = clamp(transform.value.scale + delta, MIN_SCALE, MAX_SCALE);
  transform.value.scale = newScale;
  nextTick(() => updateBounds());
}

function getDistance(touches: TouchList) {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
}

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    isDragging = true;
    startPos = { 
        x: e.touches[0].clientX - transform.value.x, 
        y: e.touches[0].clientY - transform.value.y 
    };
  } else if (e.touches.length === 2) {
    isDragging = false;
    initialPinchDistance = getDistance(e.touches);
    initialScale = transform.value.scale;
  }
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length === 1 && isDragging) {
    const newX = e.touches[0].clientX - startPos.x;
    const newY = e.touches[0].clientY - startPos.y;
    transform.value.x = newX;
    transform.value.y = newY;
  } else if (e.touches.length === 2) {
    const currentDistance = getDistance(e.touches);
    if (initialPinchDistance > 0) {
        const pinchRatio = currentDistance / initialPinchDistance;
        const newScale = clamp(initialScale * pinchRatio, MIN_SCALE, MAX_SCALE);
        transform.value.scale = newScale;
    }
  }
}

function handleTouchEnd(e: TouchEvent) {
  isDragging = false;
  initialPinchDistance = 0;
  updateBounds();
}

function startDrag(e: MouseEvent) {
  isDragging = true;
  startPos = { x: e.clientX - transform.value.x, y: e.clientY - transform.value.y };
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", stopDrag);
}

function onDrag(e: MouseEvent) {
  if (!isDragging) return;
  transform.value.x = e.clientX - startPos.x;
  transform.value.y = e.clientY - startPos.y;
  updateBounds();
}

function stopDrag() {
  isDragging = false;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);
  updateBounds();
}

const generatePartyCode = () => {
  partyCode.value = `${Math.floor(1000 + Math.random() * 9000)}${props.campaignId}`;
};

const fetchAllDoors = async () => {
  try {
    const response = await axios.get("/doors/search");
    allDoors.value = response.data.doors || [];
  } catch (error) {
    console.error("Error fetching doors:", error);
  }
};

const fetchOpenedDoors = async () => {
  try {
    const response = await axios.get("/rl_campaigns_doors/search", {
      params: { campaign_fk: parseInt(props.campaignId) },
    });

    const doors = response.data.campaign_doors || [];
    const newOpenedDoors = new Set<string>();

    doors.forEach((record: OpenedDoorRecord) => {
      if (record.door_code) {
        newOpenedDoors.add(record.door_code.toLowerCase());
      }
    });

    const previousSize = openedDoors.value.size;
    openedDoors.value = newOpenedDoors;

    if (doors.length > 0) {
      const sortedDoors = doors.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestDoor = sortedDoors[0];
      const wing = (activeCampaignData.value.wing || "").toUpperCase();
      const currentDoor = (activeCampaignData.value.door || "").toUpperCase();
      let incomingDoor = latestDoor.door_name.toUpperCase();

      if (wing.includes("WING 4")) {
        const hasChapel = doors.some((d: any) => d.door_name === 'DRACONIC CHAPEL');
        const hasCrypts = doors.some((d: any) => d.door_name === 'CRYPTS');
        const hasLaterStags = doors.some((d: any) => ['LIBRARY', 'LABORATORY', 'DRAGON BOSS'].includes(d.door_name));

        if (hasChapel && hasCrypts && !hasLaterStags) {
          incomingDoor = "BOTH OPEN";
        }
      }

      if (currentDoor === "DRAGON BOSS") {
          return;
      }

      if (currentDoor !== incomingDoor) {
         campaignStore.updateCampaignProperty(props.campaignId, "door", incomingDoor);
         if (props.campaign) props.campaign.door = incomingDoor;
         
         forcedDoorInstruction.value = incomingDoor;
         openNarrativeDialog();

         if (newOpenedDoors.size > previousSize && previousSize > 0) {
           snackbar.value = {
             visible: true,
             text: `Sync: Area updated to ${incomingDoor}`,
             color: "info",
           };
         }
      }
    }
  } catch (error) {
    console.error("Error fetching opened doors:", error);
  }
};

const startPolling = () => {
  pollingInterval = window.setInterval(() => {
    fetchOpenedDoors();
  }, 5000);
};

const stopPolling = () => {
  if (pollingInterval !== null) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

const saveDoorOpening = async (doorCode: string): Promise<boolean> => {
  const doorObj = allDoors.value.find((d) => d.code === doorCode);

  if (!doorObj) {
    console.warn(`[ImmersiveView] Door not found for code: ${doorCode}`);
    return false;
  }

  try {
    await axios.post("/rl_campaigns_doors/cadastro", {
      doors_fk: doorObj.doors_pk,
      campaign_fk: parseInt(props.campaignId),
    });

    openedDoors.value.add(doorCode.toLowerCase());

    return true;
  } catch (error: any) {
    if (error.response?.status === 409) {
      openedDoors.value.add(doorCode.toLowerCase());
      return true;
    }
    console.error("Error saving door opening:", error);
    return false;
  }
};

const syncEventScenario = async () => {
  if (activeCampaignData.value.wing) {
    console.log("[ImmersiveView] Wing already set, skipping event sync");
    return;
  }

  try {
    const campaignResponse = await axios.get(`/campaigns/${props.campaignId}`);
    const campaign = campaignResponse.data;
    
    if (!campaign.event_fk) {
      console.log("[ImmersiveView] Campaign not associated with event, skipping sync");
      return;
    }

    const eventResponse = await axios.get("/events/search", {
      params: { events_pk: campaign.event_fk }
    });

    const event = eventResponse.data?.events?.[0];
    
    if (!event) return;
    if (!event.scenario) return;

    const scenario = event.scenario.toUpperCase();
    let wingToSet = null;
    
    if (scenario.includes("WING 04") || scenario.includes("WING 4")) {
      wingToSet = "Wing 4";
    } else if (scenario.includes("WING 03") || scenario.includes("WING 3")) {
      wingToSet = "Wing 3";
    }

    if (wingToSet) {
      campaignStore.updateCampaignProperty(props.campaignId, "wing", wingToSet);
      campaignStore.updateCampaignProperty(props.campaignId, "door", "FIRST SETUP");
      
      if (savePutRef.value) {
        savePutRef.value.save();
      }
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.error(`[ImmersiveView] Campaign ${props.campaignId} not found`);
      return;
    }
    console.error("[ImmersiveView] Error syncing event scenario:", error);
  }
};

onMounted(async () => {
  generatePartyCode();
  tutorialStore.loadPreferences(); 
  await syncEventScenario();
  
  await fetchAllDoors();
  await fetchOpenedDoors();
  startPolling();
});

onUnmounted(() => {
  stopPolling();
});

function openBookDialog() { 
    bookContext.value = activeCampaignData.value.wing;
    bookDialog.value = { visible: true, title: activeCampaignData.value.wing || 'Campaign Book' }; 
}

function openStartHere() {
    bookContext.value = "START HERE";
    bookDialog.value = { visible: true, title: "Start Here - Tutorial" };
}

function acceptTutorial() {
    if (tutorialPromptDialog.value.dontShowAgain) {
        tutorialStore.setStartHerePreference(true); 
    }
    tutorialPromptDialog.value.visible = false;
    openStartHere();
}

function declineTutorial() {
    if (tutorialPromptDialog.value.dontShowAgain) {
        tutorialStore.setStartHerePreference(true);
    }
    tutorialPromptDialog.value.visible = false;
    snackbar.value = { 
        visible: true, 
        text: 'You can access the tutorial later via the "Start Here" button or the Book menu.', 
        color: 'info' 
    };
}

function checkTutorialTrigger() {
    const wing = (activeCampaignData.value.wing || '').toUpperCase();
    const door = (activeCampaignData.value.door || '').toUpperCase();
    
    if (tutorialStore.shouldShowStartHere && wing.includes("WING 3") && door === "FIRST SETUP") {
        if (!sessionStorage.getItem(`tutorial_shown_${props.campaignId}`)) {
            tutorialPromptDialog.value.visible = true;
            sessionStorage.setItem(`tutorial_shown_${props.campaignId}`, 'true');
        }
    }
}

watch(
    () => [activeCampaignData.value.wing, activeCampaignData.value.door],
    ([newWing, newDoor]) => {
        if (!bookDialog.value.visible) {
            bookContext.value = newWing as string;
        }
        checkTutorialTrigger();
    },
    { immediate: true }
);

function openKeywordsDialog() {
  keywordsDialog.value = { visible: true };
}

function openInteractionsDialog() {
  interactionsDialog.value.visible = true;
}

function handleOpenScene(sceneTarget: string) {
    interactionsDialog.value.visible = false;
    
    bookContext.value = activeCampaignData.value.wing;
    bookDialog.value = { visible: true, title: activeCampaignData.value.wing || 'Campaign Book' };
    
    nextTick(() => {
        setTimeout(() => {
            if (campaignBookRef.value) {
                campaignBookRef.value.openSceneByTarget(sceneTarget);
            }
        }, 150);
    });
}

function openOnlyInstructions() {
  if (activeCampaignData.value.door !== "BOTH OPEN")
    forcedDoorInstruction.value = null;
  instructionsDialogVisible.value = true;
}

function openNarrativeDialog() {
  narrativeDialogVisible.value = true;
}

function proceedToInstructions() {
  narrativeDialogVisible.value = false;
  setTimeout(() => (instructionsDialogVisible.value = true), 200);
}

function openNextDoorScanner() {
  doorScannerDialog.value.visible = true;
}

function handleNextAction() {
  if (isBossBattle.value) {
    finishCampaignDialog.value.visible = true;
    return;
  }

  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const door = (activeCampaignData.value.door || "").toUpperCase();
  
  if (wing.includes("WING 4") && (door === "LIBRARY" || door === "LABORATORY")) {
      enterBossDialog.value.visible = true;
      return;
  }

  openNextDoorScanner();
}

async function confirmEnterBossRoom() {
    enterBossDialog.value.visible = false;
    
    try {
        await axios.post("/rl_campaigns_doors/cadastro", {
            doors_fk: 12, 
            campaign_fk: parseInt(props.campaignId),
        });
        openedDoors.value.add("dragon boss"); 
    } catch (e) {
        console.error("Error forcing Dragon Boss door save:", e);
    }

    commitNextDoor("DRAGON BOSS");
}

function confirmFinishCampaign() {
  finishCampaignDialog.value.visible = false;
  if (savePutRef.value) savePutRef.value.save();
  snackbar.value = {
    visible: true,
    text: "Campaign Finalized! You can still explore the books.",
    color: "success",
  };
}

function confirmLeave() {
  leaveDialog.value = {
    visible: true,
    onConfirm: () => {
      campaignRemoveRef.value?.openDialog();
      leaveDialog.value.visible = false;
    },
  };
}

function openHeroCard(h: any) {
  setTimeout(() => {
    heroCardDialog.value = { visible: true, hero: h };
  }, 150);
}

function openMonsterGroupDialog() {
  monsterGroupDialog.value.visible = true;
}

function onImgError(e: any) {
  e.target.src = "/assets/hero/avatar/default.webp";
}

function onMonsterImgError(e: any) {
  e.target.style.display = "none";
}

function openResources(id: string) {
  heroCardDialog.value.visible = false;
  router.push({
    name: "HeroSequentialState",
    params: { campaignId: props.campaignId, heroId: id },
  });
}

function openEquipment(id: string) {
  heroCardDialog.value.visible = false;
  router.push({
    name: "Hero",
    params: { campaignId: props.campaignId, heroId: id },
  });
}

function exitToDashboard() {
    router.push({ name: "Dashboard" });
}

function openInviteDialog() {
  shareCampaignRef.value?.openDialog();
}

function onSaveSuccess() {
  snackbar.value = { visible: true, text: "Saved!", color: "success" };
}

function onSaveFail() {
  snackbar.value = { visible: true, text: "Error saving.", color: "error" };
}

function readTheScene() {
  openBookDialog();
}

function handleImageError() {
  console.warn("bg error");
}

function getMonsterImageSrc(m: string) {
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const folder = wing.includes("WING 4") ? "wing4" : "wing3";
  try {
    return new URL(
      `../assets/campaign_monsters/${folder}/${m}.jpg`,
      import.meta.url,
    ).href;
  } catch {
    return "";
  }
}

function saveWing4Path(choice: string) {
  localStorage.setItem(`campaign_${props.campaignId}_w4_choice`, choice);
}

const qrToDoorMap: Record<string, string> = {
  "door02.01": "DUNGEON FOYER",
  "door02.02": "QUEEN'S HALL",
  "door02.03": "THE FORGE",
  "door02.04": "ARTISAN'S GALLERY",
  "door02.05": "PROVING GROUNDS",
  "door02.06": "MAIN HALL",
  "door02.07": "DRACONIC CHAPEL",
  "door02.08": "CRYPTS",
  "door02.09": "LIBRARY",
  "door02.10": "LABORATORY",
  
  "book02.01": "DUNGEON FOYER",
  "book02.02": "QUEEN'S HALL",
  "book02.03": "THE FORGE",
  "book02.04": "ARTISAN'S GALLERY",
  "book02.05": "PROVING GROUNDS",
  "book02.06": "MAIN HALL",
  "book02.07": "DRACONIC CHAPEL",
  "book02.08": "CRYPTS",
  "book02.09": "LIBRARY",
  "book02.10": "LABORATORY"
};

function isProgressionValid(newDoor: string): boolean {
    const wing = (activeCampaignData.value.wing || "").toUpperCase();
    const currentDoor = (activeCampaignData.value.door || "").toUpperCase();
    let order: string[] = [];

    if (wing.includes("WING 3")) order = WING3_ORDER;
    else if (wing.includes("WING 4")) order = WING4_ORDER;
    else return true;

    const currentIndex = order.indexOf(currentDoor);
    const newIndex = order.indexOf(newDoor.toUpperCase());

    if (newIndex === -1) return true;
    if (newIndex <= currentIndex) return false;

    return true;
}

async function handleDoorScanned(code: string) {
  const normalized = code.toLowerCase().trim();
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const currentDoor = (activeCampaignData.value.door || "").toUpperCase();

  let targetDoor = "";

  if (wing.includes("WING 4")) {
    if (normalized.includes("book02.07") || normalized.includes("door02.07")) {
        targetDoor = (currentDoor === "CRYPTS") ? "BOTH OPEN" : "DRACONIC CHAPEL";
    } else if (normalized.includes("book02.08") || normalized.includes("door02.08")) {
        targetDoor = (currentDoor === "DRACONIC CHAPEL") ? "BOTH OPEN" : "CRYPTS";
    } else if (normalized.includes("book02.09") || normalized.includes("door02.09")) targetDoor = "LIBRARY";
    else if (normalized.includes("book02.10") || normalized.includes("door02.10")) targetDoor = "LABORATORY";
    else targetDoor = qrToDoorMap[normalized];
  } else {
    targetDoor = qrToDoorMap[normalized];
  }

  if (!targetDoor) {
      snackbar.value = { visible: true, text: "Invalid Door Code", color: "error" };
      doorScannerDialog.value.visible = false;
      return;
  }

  if (!isProgressionValid(targetDoor) && targetDoor !== "BOTH OPEN") {
      snackbar.value = { visible: true, text: "You cannot go back to a previous area!", color: "warning" };
      doorScannerDialog.value.visible = false;
      return;
  }

  await saveDoorOpening(normalized);

  if (wing.includes("WING 4")) {
      if (targetDoor === "BOTH OPEN") {
          commitNextDoor("BOTH OPEN", targetDoor === "DRACONIC CHAPEL" ? "CRYPTS" : "DRACONIC CHAPEL");
      } else if (targetDoor === "DRACONIC CHAPEL") {
          saveWing4Path("DRACONIC CHAPEL");
          commitNextDoor("DRACONIC CHAPEL");
      } else if (targetDoor === "CRYPTS") {
          saveWing4Path("CRYPTS");
          commitNextDoor("CRYPTS");
      } else {
          commitNextDoor(targetDoor);
      }
  } else {
      commitNextDoor(targetDoor);
  }
  
  doorScannerDialog.value.visible = false;
}

function handleManualAdvance() {
  doorScannerDialog.value.visible = false;
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const currentDoor = (activeCampaignData.value.door || "").toUpperCase();

  if (wing.includes("WING 4")) {
    if (currentDoor === "FIRST SETUP") wing4ChoiceDialog.value.visible = true;
    else if (currentDoor === "DRACONIC CHAPEL") {
      saveWing4Path("DRACONIC CHAPEL");
      commitNextDoor("BOTH OPEN", "CRYPTS");
    } else if (currentDoor === "CRYPTS") {
      saveWing4Path("CRYPTS");
      commitNextDoor("BOTH OPEN", "DRACONIC CHAPEL");
    } else if (currentDoor === "BOTH OPEN") commitNextDoor("LIBRARY");
  } else {
    const list = [
      "FIRST SETUP",
      "DUNGEON FOYER",
      "QUEEN'S HALL",
      "THE FORGE",
      "ARTISAN'S GALLERY",
      "PROVING GROUNDS",
      "MAIN HALL",
    ];
    const idx = list.indexOf(currentDoor);
    if (idx >= 0 && idx < list.length - 1) commitNextDoor(list[idx + 1]);
    else
      snackbar.value = { visible: true, text: "End of Wing", color: "warning" };
  }
}

function commitWing4Choice(choice: string) {
  wing4ChoiceDialog.value.visible = false;
  saveWing4Path(choice);
  commitNextDoor(choice);
}

function commitNextDoor(doorName: string, instructionOverride?: string) {
  campaignStore.updateCampaignProperty(props.campaignId, "door", doorName);
  forcedDoorInstruction.value = instructionOverride || doorName;
  if (savePutRef.value) savePutRef.value.save();
  setTimeout(() => openNarrativeDialog(), 500);
}
</script>

<style scoped>
.immersive-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background-color: #000;
  color: white;
  font-family: "Cinzel", serif;
  touch-action: none; 
}

.map-viewport {
  width: 100%;
  height: 100%;
  background: #050505;
  overflow: hidden;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-viewport:active {
  cursor: grabbing;
}

.map-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  will-change: transform;
}

.map-image {
  max-width: none; 
  max-height: none;
  width: 100%;
  height: 100%;
  object-fit: contain; 
  pointer-events: none;
  filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.8));
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
}

.hud-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  padding: 24px;
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: auto 1fr auto;
  z-index: 10;
}

.hud-area {
  pointer-events: none;
}

.interactive-content,
.bookmark-tab,
.square-hud-btn,
.monster-card,
.right-tab-btn {
  pointer-events: auto;
}

.top-left {
  grid-area: 1 / 1;
  display: flex;
  flex-direction: column;
}

.top-right {
  grid-area: 1 / 3;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

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
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

.bookmark-tab:hover,
.bookmark-tab.active {
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

.bookmark-tab.right-side:hover,
.bookmark-tab.right-side.active {
  transform: translateX(-5px);
  border-right-color: #ffc107;
}

.start-here-tab {
  border-left-color: #ffd740 !important;
  background: rgba(40, 30, 10, 0.95);
  box-shadow: 0 0 10px rgba(255, 215, 64, 0.2);
}

.start-here-tab:hover {
  border-left-color: #ffab00 !important;
  background: rgba(60, 45, 10, 1);
  box-shadow: 0 0 15px rgba(255, 215, 64, 0.4);
}

.bookmark-tab.blue-border-tab {
  border-left-color: #1565c0;
}

.bookmark-tab.blue-border-tab:hover {
  border-left-color: #1565c0;
}

.text-label {
  text-align: center;
}

.monster-list-container {
  max-height: 150px;
  overflow-y: hidden;
  overflow-x: auto;
  padding-right: 4px;
  pointer-events: auto;
}

.monster-card {
  width: 90px;
  height: 135px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s;
  cursor: pointer;
}

.monster-card:hover {
  transform: scale(1.05);
  z-index: 50;
  border-color: #b71c1c;
}

.monster-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.monster-group-img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border: 2px solid #555;
}

.square-hud-btn {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: rgba(20, 20, 20, 0.9) !important;
  border: 1px solid #444;
  color: white !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
}

.square-hud-btn:hover {
  background: rgba(40, 40, 40, 0.95) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
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
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 80px;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.hero-token.empty {
  height: 80px;
  border-radius: 50%;
  border: 2px dashed #666;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.hero-token-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-name-tag {
  margin-top: 4px;
  background: rgba(0, 0, 0, 0.8);
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

.mobile-close-book-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  opacity: 0.8;
}

.monster-card-large {
  width: 120px;
  cursor: pointer;
  text-align: center;
}

.monster-card-large img {
  width: 100%;
  border-radius: 8px;
  border: 2px solid #444;
}

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
  box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.6);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%) !important;
  border: 1px solid #1976d2;
}

.grey-tab {
  background: rgba(40, 40, 40, 0.95) !important;
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

.book-style-card {
  background-color: #eee8e0 !important;
  color: #212121;
  border: 1px solid #1e1e1e;
}

.narrative-text {
  font-family: 'EB Garamond', serif;
  font-size: 1.15rem;
  line-height: 1.6;
  color: #212121;
}

.narrative-text :deep(p) {
  text-indent: 1.5em;
  margin-bottom: 1.2em;
  color: inherit;
}

.instruction-box {
  font-family: sans-serif;
  color: #1a120f;
}

.book-page {
    background-color: #ffffff;
    color: #212121;
    border: 1px solid #1e1e1e;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    border-radius: 8px;
    width: 100%;
    max-width: 800px;
    overflow: hidden;
}

.header-banner {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top center;
    padding: 10px 14px;
    position: relative;
    z-index: 1;
    color: #212121;
}

.section-title {
    font-size: 0.7rem;
    color: white;
    padding: 10px 155px 15px;
    margin: 0;
    text-transform: uppercase;
    font-weight: bold;
}

.chapter-title-banner {
    font-family: "Cinzel Decorative", cursive;
    font-size: 1.8rem;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
    margin-top: 1px;
    margin-bottom: 60px;
    padding-left: 156px;
    padding-right: 44px;
    text-align: left;
}

.body-text {
    color: #212121;
}

.body-text :deep(p) {
    font-family: "EB Garamond", serif;
    font-size: 1.15rem;
    line-height: 1.6;
    text-indent: 1.5em; 
    margin-bottom: 1.2rem;
    color: inherit; 
}

.body-text :deep(strong) {
    font-style: normal;
    font-weight: bold;
}

.body-text :deep(div) {
    color: inherit;
}

.shadow-lg {
    box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
}

@media (max-width: 960px) {
  .hud-layer {
    padding: 8px 8px 8px 8px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr auto;
    box-sizing: border-box;
  }

  .top-left {
    grid-area: 1 / 1;
  }

  .top-right {
    grid-area: 1 / 2;
  }

  .bottom-left {
    grid-area: 3 / 1;
    margin-bottom: 0 !important;
    padding-bottom: 0px !important;
    justify-content: flex-end !important;
    align-items: flex-start !important;
    z-index: 25;
    pointer-events: none;
  }

  .bottom-left > * {
    pointer-events: auto;
  }

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

  .bottom-right > * {
    pointer-events: auto;
  }

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

  .hero-token {
    width: 50px;
    height: 75px;
  }

  .hero-name-tag {
    display: none;
  }

  .square-hud-btn {
    width: 36px !important;
    height: 36px !important;
    font-size: 0.9rem;
  }

  .bookmark-tab {
    padding: 6px 8px;
    min-width: 36px;
  }

  .objective-panel {
    padding: 2px 6px;
  }

  .objective-label {
    font-size: 0.5rem !important;
  }

  .objective-text {
    font-size: 0.7rem !important;
  }

  .monster-card {
    width: 55px;
    height: 82px;
  }

  .right-tab-btn {
    width: 50px !important;
    height: 45px !important;
  }
}

@media (max-width: 480px) {
    .header-banner {
        padding: 8px 10px 6px;
        background-position: left;
    }
    
    .chapter-title-banner {
        font-size: 1.25rem;
        padding-left: 0;
        margin-left: 130px;
        margin-top: 5px;
        padding-right: 20px;
        margin-bottom: 40px;
    }
    
    .section-title {
        font-size: 0.6rem;
        padding: 8px 0px 15px;
        margin-left: 130px;
    }
    
    .body-text :deep(p) {
        font-size: 1.05rem; 
        text-indent: 1em; 
    }
}
</style>