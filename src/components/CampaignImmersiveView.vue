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

            <v-tooltip text="Rune Mechanics" location="right" v-if="isWing1Or2">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="props"
                  class="bookmark-tab left-side"
                  @click.stop="runesDialogVisible = true"
                >
                  <v-icon
                    icon="mdi-cards-variant"
                    size="28"
                  ></v-icon>
                  <span
                    class="d-none d-md-inline font-weight-bold text-caption text-label ml-2"
                    >RUNES</span
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

            <v-tooltip text="Ask Tharmagar" location="right">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="props"
                  class="bookmark-tab left-side blue-border-tab"
                  @click.stop="tharmagarDialogVisible = true"
                >
                  <v-icon
                    icon="mdi-comment-question-outline"
                    size="28"
                  ></v-icon>
                  <span
                    class="d-none d-md-inline font-weight-bold text-caption text-label ml-2"
                    >THARMAGAR</span
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
                class="monster-card cursor-pointer"
                :class="{ 'placeholder-card': monster.startsWith('PLACEHOLDER_') }"
                @click.stop="handleMonsterClick(monster, index)"
              >
                <template v-if="monster.startsWith('PLACEHOLDER_')">
                  <div class="d-flex flex-column align-center justify-center fill-height monster-placeholder-inner">
                    <v-icon color="amber-accent-2" size="24" class="mb-1">mdi-skull-outline</v-icon>
                    <span class="text-caption font-weight-bold text-amber-accent-2 text-center uppercase-tracking px-1" style="font-size: 0.62rem !important; line-height: 1.1;">
                      DRAW {{ getPlaceholderType(monster).toUpperCase() }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <img
                    :src="getMonsterImageSrc(monster)"
                    @error="onMonsterImgError"
                    :alt="monster"
                  />
                </template>
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

            <v-tooltip text="Save Game" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-content-save"
                  class="square-hud-btn"
                  color="success"
                  @click.stop="manualSave"
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

    <v-dialog v-model="finishCampaignDialog.visible" max-width="450" persistent>
      <v-card class="bg-grey-darken-4 border-xl border-amber rounded-lg">
        <v-card-title class="text-center text-uppercase font-weight-bold pt-4 text-h5 text-amber">
          <v-icon start size="small">mdi-check-bold</v-icon> Finish Campaign
        </v-card-title>
        <v-card-text class="text-center py-4 text-body-1">
          Are you ready to finalize this adventure?<br/><br/>
          <span class="text-red-accent-2 font-weight-bold">Warning: You will not be able to return to this campaign view once finished.</span>
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
        <CampaignBookNew ref="campaignBookRef" :campaign-wing="bookContext" :campaign-type="campaign?.campaign || ''" />
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
            <v-col v-for="(monster, index) in currentMonsters" :key="monster + index" cols="12" sm="6" md="4" class="d-flex justify-center">
              <div class="d-flex flex-column align-center w-100">
                <template v-if="monster.startsWith('PLACEHOLDER_')">
                  <div class="monster-group-placeholder-card d-flex flex-column align-center justify-center pa-6 rounded-lg cursor-pointer border-dashed" @click="handleMonsterClick(monster, index)">
                    <v-icon color="amber-accent-2" size="48" class="mb-2">mdi-skull-outline</v-icon>
                    <div class="text-subtitle-1 font-weight-bold text-amber-accent-2 text-uppercase mb-2">Draw {{ getPlaceholderType(monster).toUpperCase() }}</div>
                    <v-btn size="small" color="amber-accent-3" variant="flat" class="font-weight-bold text-black">SELECT CARD</v-btn>
                  </div>
                </template>
                <template v-else>
                  <img :src="getMonsterImageSrc(monster)" class="monster-group-img elevation-10 rounded-lg" style="max-width: 100%; height: auto;" />
                  <v-btn
                    v-if="isSlotSelectable(index)"
                    size="small"
                    color="grey-darken-3"
                    variant="flat"
                    class="mt-2 font-weight-bold text-amber-accent-2"
                    @click="openMonsterSelectorForIndex(index)"
                  >
                    <v-icon start size="14">mdi-refresh</v-icon>
                    REDRAW
                  </v-btn>
                </template>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="doorScannerDialog.visible" max-width="500" persistent>
      <v-card class="bg-grey-darken-4 rounded-xl border-thin overflow-hidden">
        <v-toolbar color="black" density="compact">
          <v-toolbar-title class="text-white cinzel-font font-weight-bold">
            <v-icon start color="amber-darken-2">mdi-door-open</v-icon>
            DOOR NAVIGATION
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" color="white" @click="doorScannerDialog.visible = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-6 text-center">
          <template v-if="isWing1Or2">
            <div class="text-subtitle-1 text-grey-lighten-1 mb-6 font-weight-medium">
              You are currently at:
              <div class="text-h6 text-amber font-weight-bold mt-1">
                {{ activeCampaignData.door || "FIRST SETUP" }}
              </div>
            </div>
            <div class="d-flex flex-column" style="gap: 12px;">
              <v-btn
                block
                color="amber-darken-3"
                height="64"
                class="rounded-lg text-body-1 font-weight-bold py-2"
                @click="handleManualAdvance"
              >
                <v-icon start size="26">mdi-door-open</v-icon>
                NEXT DOOR
              </v-btn>
              <v-btn
                block
                color="grey-darken-3"
                height="64"
                class="rounded-lg text-body-1 font-weight-bold py-2"
                @click="handlePreviousActionInDialog"
              >
                <v-icon start size="26" class="text-grey-lighten-2">mdi-arrow-left-bold</v-icon>
                PREVIOUS DOOR
              </v-btn>
            </div>
          </template>
          <NextDoorQRScanner v-else-if="doorScannerDialog.visible" @scanned="handleDoorScanned" @manual-advance="handleManualAdvance" />
        </v-card-text>
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
                        A new Story Scene is unlocked!
                    </div>

                    <v-btn
                        color="brown-darken-3"
                        variant="elevated"
                        size="x-large"
                        class="px-8 font-weight-bold"
                        @click="openSceneFromDoor(currentDoorData.scene.target)"
                    >
                        READ "{{ currentDoorData.scene.title.toUpperCase() }}" IN BOOK
                        <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
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
      <CampaignSavePut ref="savePutRef" :campaign-id="campaignId" @saving="onSaving" @success="onSaveSuccess" @fail="onSaveFail" />
      <CampaignExport ref="campaignExportRef" :campaign-id="campaignId" />
      <CampaignRemove ref="campaignRemoveRef" :campaign-id="campaignId" />
      <ShareCampaignButton ref="shareCampaignRef" :campaignId="campaignId" :inviteCode="partyCode" />
    </div>
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" location="top">{{ snackbar.text }}</v-snackbar>

    <!-- NOVO DIALOG DE BADGE COM FRUFRUZADA -->
    <v-dialog v-model="newBadgeDialog.visible" max-width="500" persistent transition="dialog-bottom-transition">
      <v-card color="transparent" elevation="0" class="text-center d-flex flex-column align-center overflow-visible">
        
        <div class="badge-glow-container">
          <v-icon color="amber-accent-4" size="120" class="badge-star-icon">mdi-star-four-points</v-icon>
          <div class="text-h4 font-weight-black text-amber-accent-4 mb-4 badge-title-anim" style="text-shadow: 0 0 15px #ffab00, 0 0 30px #ffab00;">
            NEW BADGE UNLOCKED!
          </div>
        </div>

        <v-card
          v-if="newBadgeDialog.reward"
          rounded="lg"
          elevation="10"
          width="100%"
          class="py-3 px-2 mb-8 badge-card-anim"
          color="secundary"
          style="border: 2px solid #ffab00; position: relative; z-index: 2;"
        >
          <v-row class="align-center">
            <v-col
              cols="3"
              class="d-flex align-center justify-center pl-4"
            >
              <v-img
                :src="`https://assets.drunagor.app/${newBadgeDialog.reward.picture_hash}`"
                alt="Reward Icon"
                max-height="90"
                class="rounded-lg badge-img-anim"
              ></v-img>
            </v-col>

            <v-col cols="9" class="pl-2 d-flex flex-column justify-center text-left">
              <p class="font-weight-black text-h6 text-amber-accent-4 ma-0 pb-1" style="line-height: 1.2; text-shadow: 0px 2px 4px rgba(0,0,0,0.5);">
                {{ newBadgeDialog.reward.name }}
              </p>
              <p class="text-body-1 text-white ma-0 font-weight-medium">
                {{ newBadgeDialog.reward.description }}
              </p>
            </v-col>
          </v-row>
        </v-card>
        
        <v-btn 
          color="amber-accent-4" 
          class="text-black font-weight-black px-8 badge-btn-anim" 
          variant="elevated" 
          size="x-large" 
          rounded="pill" 
          elevation="8"
          @click="closeBadgeDialogAndExit"
        >
          RETURN TO DASHBOARD
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog v-model="runesDialogVisible" max-width="500">
      <v-card class="bg-grey-darken-4 rounded-xl border-thin overflow-hidden">
        <v-toolbar color="black" density="compact" class="px-2">
          <v-toolbar-title class="text-white cinzel-font font-weight-bold">
            <v-icon start color="amber-darken-2" class="mr-2">mdi-cards-variant</v-icon>
            RUNE MECHANICS
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" color="white" @click="runesDialogVisible = false"></v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-3 bg-grey-darken-4 d-flex flex-column gap-3" style="max-height: 80vh; overflow-y: auto;">
          <!-- Runes Tracker -->
          <div class="pa-1 bg-grey-darken-3 rounded-lg border-thin">
            <div class="text-caption px-3 pt-2 text-grey-lighten-1 font-weight-bold text-uppercase d-flex align-center">
              <v-icon start class="mr-2" size="small">mdi-counter</v-icon>
              Runes Tracker
            </div>
            <div class="pa-2">
              <CampaignRunes :campaign-id="campaignId" />
            </div>
          </div>
          
          <!-- Rune Cards -->
          <div class="pa-1 bg-grey-darken-3 rounded-lg border-thin">
            <div class="text-caption px-3 pt-2 text-grey-lighten-1 font-weight-bold text-uppercase d-flex align-center mb-1">
              <v-icon start class="mr-2" size="small">mdi-cards-outline</v-icon>
              Rune & Game State Cards
            </div>
            <div class="pa-2">
              <CampaignRuneCards :campaign-id="campaignId" :campaign-type="activeCampaignData.campaign || 'underkeep'" />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="monsterSelectorDialog.visible" max-width="500">
      <v-card class="bg-grey-darken-4 rounded-xl border-gold">
        <v-toolbar color="black" density="compact">
          <v-toolbar-title class="text-white cinzel-font font-weight-bold">
            <v-icon start color="amber-accent-2">mdi-skull-outline</v-icon>
            DRAW {{ monsterSelectorDialog.titleDisplay }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" color="white" @click="monsterSelectorDialog.visible = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-6 text-center">
          <div class="text-subtitle-2 text-grey-lighten-1 mb-4">
            Select the card you physically drew from the monster deck:
          </div>
          <div class="d-flex flex-wrap justify-center gap-4 py-2">
            <div
              v-for="option in monsterSelectorDialog.pool"
              :key="option"
              class="selector-monster-card"
              @click="selectMonsterOption(option)"
            >
              <v-img
                :src="getMonsterImageSrc(option)"
                cover
                class="rounded-lg selector-monster-img"
                width="110"
                height="165"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
                    <v-progress-circular indeterminate color="white" size="20"></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="tharmagarDialogVisible" fullscreen transition="dialog-bottom-transition">
      <v-card color="black" class="position-relative">
        <v-btn
          icon="mdi-close"
          variant="flat"
          color="rgba(255,255,255,0.1)"
          class="text-white"
          style="position: absolute; top: 16px; right: 16px; z-index: 100;"
          @click="tharmagarDialogVisible = false"
        ></v-btn>
        <TharmagarChat />
      </v-card>
    </v-dialog>

    <!-- Small subtle Game-like Saving Indicator in the Corner -->
    <div 
      v-if="savingState !== 'idle'" 
      class="saving-indicator-bubble d-flex align-center pa-2 px-3 rounded-pill"
      :class="savingState"
    >
      <template v-if="savingState === 'saving'">
        <v-progress-circular
          indeterminate
          size="16"
          width="2"
          class="mr-2 text-white"
        ></v-progress-circular>
        <span class="text-caption font-weight-bold text-white uppercase-tracking">Saving...</span>
      </template>
      <template v-else-if="savingState === 'saved'">
        <v-icon size="16" color="green-lighten-2" class="mr-2">mdi-check-circle</v-icon>
        <span class="text-caption font-weight-bold text-green-lighten-2 uppercase-tracking">Saved</span>
      </template>
      <template v-else-if="savingState === 'error'">
        <v-icon size="16" color="red-lighten-2" class="mr-2">mdi-alert-circle</v-icon>
        <span class="text-caption font-weight-bold text-red-lighten-2 uppercase-tracking">Save Error</span>
      </template>
    </div>
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

import CampaignRunes from "@/components/CampaignRunes.vue";
import CampaignRuneCards from "@/components/CampaignRuneCards.vue";
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
import TharmagarChat from "@/components/TharmagarChat.vue";

const REWARDS_DATA: Record<number, any> = {
  2: {
    name: "Tutorial Completed",
    picture_hash: "badges%26achievements/Tutorial%20Complete.png",
    description: "complete wing 1 tutorial"
  },
  3: {
    name: "Season 1 Completed",
    picture_hash: "badges%26achievements/Season%201%20Complete%20(4)-min.png",
    description: "complete wing 2 advanced"
  },
  5: {
    name: "Wing 3 Completed",
    picture_hash: "badges%26achievements/Tutorial%20Complete.png",
    description: "complete wing 3"
  },
  6: {
    name: "Season 2 Completed",
    picture_hash: "badges%26achievements/Season%201%20Complete%20(4)-min.png",
    description: "complete wing 4"
  }
};

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
const newBadgeDialog = ref({ visible: false, reward: null as any });
const dashboardExitDialog = ref({ visible: false }); 
const tharmagarDialogVisible = ref(false);
const runesDialogVisible = ref(false);
const snackbar = ref({ visible: false, text: "", color: "success" });
const showMonstersPanel = ref(true);

const savingState = ref<"idle" | "saving" | "saved" | "error">("idle");
let savingStateTimeout: ReturnType<typeof setTimeout> | null = null;

const onSaving = () => {
  savingState.value = "saving";
  if (savingStateTimeout) clearTimeout(savingStateTimeout);
};

const tutorialPromptDialog = ref({ visible: false, dontShowAgain: false });
const bookContext = ref('');

const partyCode = ref<string | null>(null);
const forcedDoorInstruction = ref<string | null>(null);

const allDoors = ref<Door[]>([]);
const openedDoors = ref<Set<string>>(new Set());
let pollingInterval: number | null = null;
let lastManualActionTime = 0;

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

const isWing1Or2 = computed(() => {
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  return wing.includes("WING 1") || wing.includes("WING 2") || wing.includes("WING 01") || wing.includes("WING 02") || wing.includes("TUTORIAL");
});

const isWing3Start = computed(() => {
    const wing = (activeCampaignData.value.wing || '').toUpperCase();
    const door = (activeCampaignData.value.door || '').toUpperCase();
    if (wing.includes("WING 3")) {
        return ["FIRST SETUP", "DUNGEON FOYER"].includes(door);
    }
    if (wing.includes("WING 1") || wing.includes("WING 01") || wing.includes("TUTORIAL")) {
        return door === "FIRST SETUP";
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
  
  if (!sectionData) {
    if (isWing1Or2.value) {
      return {
        title: currentDoor,
        body: `You have arrived at ${currentDoor}. Use the Campaign Book to read the narrative and instructions.`,
        instruction: `All rules, narrative texts, and setups for ${wing} are accessible by clicking the <strong>BOOKS</strong> button on the sidebar.`,
      };
    }
    return null;
  }
  
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
                  sceneObj = { 
                      title: item.title, 
                      target: item.id || titleTarget 
                  };
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

interface MonsterSlot {
  type: string;
  isRandom: boolean;
  fixedValue?: string;
  pool?: string[];
}

const selectedRandomMonsters = ref<Record<string, string>>({});

const monsterSelectorDialog = ref({
  visible: false,
  titleDisplay: "",
  typeDisplay: "",
  pool: [] as string[],
  slotIndex: -1,
  doorName: ""
});

function getMonsterStorageKey(doorName: string, index: number) {
  return `campaign_${props.campaignId}_door_${doorName.replace(/\s+/g, '_')}_slot_${index}`;
}

function getMonsterConfigForCurrentDoor(wing: string, doorName: string): MonsterSlot[] {
  const isWing1 = wing.includes("WING 1") || wing.includes("TUTORIAL") || wing.includes("WING 01");
  const isWing2 = wing.includes("WING 2") || wing.includes("WING 02");
  
  if (isWing1) {
    switch (doorName) {
      case "FIRST SETUP":
        return [
          { type: "gm rookie", isRandom: true, pool: ["gm_rookie1", "gm_rookie2", "gm_rookie3"] },
          { type: "wm rookie", isRandom: true, pool: ["wm_rookie1", "wm_rookie2"] }
        ];
      case "THE BARRICADED PATH":
      case "THE BARRICADED PATH (TUTORIAL)":
        return [
          { type: "gm rookie", isRandom: true, pool: ["gm_rookie1", "gm_rookie2", "gm_rookie3"] },
          { type: "wm rookie", isRandom: true, pool: ["wm_rookie1", "wm_rookie2"] }
        ];
      case "THE KEEP'S COURTYARD":
      case "THE KEEP'S COURTYARD (TUTORIAL)":
        return [
          { type: "cm1", isRandom: false, fixedValue: "cm1" },
          { type: "bm rookie", isRandom: true, pool: ["bm_rookie1", "bm_rookie2"] }
        ];
      case "THE GREAT HALL":
      case "THE GREAT HALL (TUTORIAL)":
        return [
          { type: "gm fighter", isRandom: true, pool: ["gm_fighter1", "gm_fighter2", "gm_fighter3"] },
          { type: "wm fighter", isRandom: true, pool: ["wm_fighter1", "wm_fighter2"] },
          { type: "bm fighter", isRandom: true, pool: ["bm_fighter1", "bm_fighter2"] }
        ];
      default:
        return [];
    }
  }

  if (isWing2) {
    switch (doorName) {
      case "THE GREAT CISTERN":
        return [
          { type: "wm veteran", isRandom: true, pool: ["wm_veteran1", "wm_veteran2"] },
          { type: "gm fighter", isRandom: true, pool: ["gm_fighter1", "gm_fighter2", "gm_fighter3"] }
        ];
      case "THE DUNGEONS":
        return [
          { type: "gm_veteran1", isRandom: false, fixedValue: "gm_veteran1" },
          { type: "wm_veteran1", isRandom: false, fixedValue: "wm_veteran1" }
        ];
      case "THE ALCHEMY LAB":
        return [
          { type: "bm_veteran2", isRandom: false, fixedValue: "bm_veteran2" },
          { type: "cm2", isRandom: false, fixedValue: "cm2" },
          { type: "wm veteran", isRandom: true, pool: ["wm_veteran1", "wm_veteran2"] },
          { type: "gm veteran", isRandom: true, pool: ["gm_veteran1", "gm_veteran2", "gm_veteran3"] }
        ];
      case "THERE AND BACK AGAIN":
        return [
          { type: "boss", isRandom: false, fixedValue: "boss" }
        ];
      default:
        return [];
    }
  }

  return [];
}

function loadMonsterSelections() {
  const selections: Record<string, string> = {};
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const doorName = (activeCampaignData.value.door || "").toUpperCase();
  
  if (wing.includes("WING 1") || wing.includes("TUTORIAL") || wing.includes("WING 2") || wing.includes("WING 01") || wing.includes("WING 02")) {
    const config = getMonsterConfigForCurrentDoor(wing, doorName);
    config.forEach((monster, index) => {
      if (monster.isRandom) {
        const key = getMonsterStorageKey(doorName, index);
        const stored = localStorage.getItem(key);
        if (stored) {
          selections[key] = stored;
        }
      }
    });
  }
  selectedRandomMonsters.value = selections;
}

function openMonsterSelectorForIndex(index: number) {
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const doorName = (activeCampaignData.value.door || "").toUpperCase();
  const config = getMonsterConfigForCurrentDoor(wing, doorName);
  const slot = config[index];
  if (slot && slot.isRandom && slot.pool) {
    monsterSelectorDialog.value = {
      visible: true,
      titleDisplay: slot.type.toUpperCase(),
      typeDisplay: slot.type,
      pool: slot.pool,
      slotIndex: index,
      doorName: doorName
    };
  }
}

function selectMonsterOption(option: string) {
  const slotIndex = monsterSelectorDialog.value.slotIndex;
  const doorName = monsterSelectorDialog.value.doorName;
  if (slotIndex >= 0 && doorName) {
    const key = getMonsterStorageKey(doorName, slotIndex);
    localStorage.setItem(key, option);
    selectedRandomMonsters.value[key] = option;
  }
  monsterSelectorDialog.value.visible = false;
}

function handleMonsterClick(monster: string, index: number) {
  if (monster.startsWith("PLACEHOLDER_")) {
    openMonsterSelectorForIndex(index);
  } else {
    openMonsterGroupDialog();
  }
}

function getPlaceholderType(monster: string) {
  const parts = monster.split("_");
  return parts[1] || "Monster";
}

function isSlotSelectable(index: number) {
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const doorName = (activeCampaignData.value.door || "").toUpperCase();
  const config = getMonsterConfigForCurrentDoor(wing, doorName);
  return config[index]?.isRandom ?? false;
}

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

  if (wing.includes("WING 1") || wing.includes("TUTORIAL") || wing.includes("WING 2") || wing.includes("WING 01") || wing.includes("WING 02")) {
    const config = getMonsterConfigForCurrentDoor(wing, location);
    return config.map((slot, index) => {
      if (slot.isRandom) {
        const key = getMonsterStorageKey(location, index);
        const selected = selectedRandomMonsters.value[key] || localStorage.getItem(key);
        if (selected) {
          return selected;
        }
        return `PLACEHOLDER_${slot.type}_${index}`;
      }
      return slot.fixedValue || slot.type;
    });
  }

  return [];
});

const currentBackgroundImage = computed(() => {
  const wing = (activeCampaignData.value.wing || '').toUpperCase();
  const door = (activeCampaignData.value.door || '').toUpperCase();
  if (!wing) return '';
  let wingFolder = '';
  if (wing.includes('WING 3')) {
    wingFolder = 'wing3';
  } else if (wing.includes('WING 4')) {
    wingFolder = 'wing4';
  } else if (wing.includes('WING 1') || wing.includes('WING 01') || wing.includes('TUTORIAL')) {
    wingFolder = 'wing1';
  } else if (wing.includes('WING 2') || wing.includes('WING 02')) {
    wingFolder = 'wing2';
  }
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
  } else if (wingFolder === 'wing1') {
    let idx = 0;
    if (door.includes("BARRICADED")) idx = 1;
    else if (door.includes("COURTYARD")) idx = 2;
    else if (door.includes("ENTRY HALL")) idx = 3;
    else if (door.includes("GREAT HALL")) idx = 4;
    else if (door.includes("END GAME")) idx = 4;

    const doorMap = [
      "setup",
      "first_door",
      "second_door",
      "third_door",
      "fourth_door",
    ];
    doorFile = doorMap[idx] || "setup";
  } else if (wingFolder === 'wing2') {
    let idx = 0;
    if (door.includes("GREAT CISTERN")) idx = 1;
    else if (door.includes("DUNGEONS")) idx = 2;
    else if (door.includes("ALCHEMY")) idx = 3;
    else if (door.includes("BURIED ARMORY")) idx = 4;
    else if (door.includes("THERE AND BACK AGAIN")) idx = 5;
    else if (door.includes("END GAME")) idx = 5;

    const doorMap = [
      "setup",
      "first_door",
      "second_door",
      "third_door",
      "fourth_door",
      "fifth_door",
    ];
    doorFile = doorMap[idx] || "setup";
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
  if (door === "END GAME") return true;
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
  if (wing.includes("WING 1") || wing.includes("TUTORIAL")) {
    return door.includes("THE ENTRY HALL");
  }
  if (wing.includes("WING 2")) {
    return door.includes("THE GREAT CISTERN") || door.includes("THE BURIED ARMORY") || door.includes("FIRST SETUP");
  }
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
  if (Date.now() - lastManualActionTime < 4000) {
    return;
  }
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
        b.rl_campaigns_doors_pk - a.rl_campaigns_doors_pk
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

      const isNewDoorOpened = previousSize > 0 && newOpenedDoors.size > previousSize;
      if (isNewDoorOpened) {
         if (currentDoor !== incomingDoor) {
           campaignStore.updateCampaignProperty(props.campaignId, "door", incomingDoor);
           if (props.campaign) props.campaign.door = incomingDoor;
         }
         
         forcedDoorInstruction.value = incomingDoor;
         openNarrativeDialog();

         snackbar.value = {
           visible: true,
           text: `Sync: Area updated to ${incomingDoor}`,
           color: "info",
         };
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
    } else if (scenario.includes("TUTORIAL")) {
      wingToSet = "Wing 1 Tutorial";
    } else if (scenario.includes("WING 02") || scenario.includes("WING 2")) {
      wingToSet = "Wing 2 Advanced";
    } else if (scenario.includes("WING 01") || scenario.includes("WING 1")) {
      wingToSet = "Wing 1 Advanced";
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

let isFirstLoad = true;

watch(
    () => [activeCampaignData.value.wing, activeCampaignData.value.door],
    (newVal, oldVal) => {
        const [newWing, newDoor] = newVal || [];
        const [oldWing, oldDoor] = oldVal || [];
        if (!bookDialog.value.visible) {
            bookContext.value = newWing as string;
        }
        checkTutorialTrigger();
        loadMonsterSelections();

        if (newDoor && (newDoor as string).toUpperCase() === "END GAME") {
            const isTransition = oldDoor && (oldDoor as string).toUpperCase() !== "END GAME";
            if (isTransition) {
                confirmFinishCampaign();
            }
        }
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

function openSceneFromDoor(sceneTarget: string) {
    instructionsDialogVisible.value = false;
    handleOpenScene(sceneTarget);
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

async function confirmFinishCampaign() {
  finishCampaignDialog.value.visible = false;
  let showBadgeAnimation = false;

  try {
    const wingStr = (activeCampaignData.value.wing || "").toUpperCase();
    let rewardPk = null;
    if (wingStr.includes("WING 1") || wingStr.includes("TUTORIAL")) rewardPk = 2;
    else if (wingStr.includes("WING 2 ADVANCED") || wingStr.includes("WING 2")) rewardPk = 3;
    else if (wingStr.includes("WING 3")) rewardPk = 5;
    else if (wingStr.includes("WING 4")) rewardPk = 6;

    if (rewardPk && props.userStore.user?.users_pk) {
      const { data } = await axios.get("/rl_users_rewards/list_rewards", {
        params: { users_fk: props.userStore.user.users_pk }
      });
      const userRewards = data.rewards || [];
      const hasReward = userRewards.some((r: any) => r.rewards_pk === rewardPk);

      if (!hasReward) {
        await axios.post("/rl_users_rewards/cadastro", {
          users_fk: props.userStore.user.users_pk,
          rewards_fk: rewardPk
        });
      }

      if (REWARDS_DATA[rewardPk]) {
        newBadgeDialog.value = {
          visible: true,
          reward: REWARDS_DATA[rewardPk]
        };
        showBadgeAnimation = true;
      }
    }
  } catch(e) {
    console.warn("Could not handle end-of-campaign rewards", e);
  }
  
  if (savePutRef.value) savePutRef.value.save();
  
  snackbar.value = {
    visible: true,
    text: "Campaign Finalized successfully!",
    color: "success",
  };
  
  if (!showBadgeAnimation) {
    router.push({ name: "Dashboard" });
  }
}

function closeBadgeDialogAndExit() {
  newBadgeDialog.value.visible = false;
  router.push({ name: "Dashboard" });
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
  savingState.value = "saved";
  if (savingStateTimeout) clearTimeout(savingStateTimeout);
  savingStateTimeout = setTimeout(() => {
    savingState.value = "idle";
  }, 2000);
}

function onSaveFail() {
  savingState.value = "error";
  if (savingStateTimeout) clearTimeout(savingStateTimeout);
  savingStateTimeout = setTimeout(() => {
    savingState.value = "idle";
  }, 4000);
}

function readTheScene() {
  openBookDialog();
}

function handleImageError() {
  console.warn("bg error");
}

function getMonsterImageSrc(m: string) {
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  let folder = "wing3";
  if (wing.includes("WING 4")) {
    folder = "wing4";
  } else if (wing.includes("WING 1") || wing.includes("TUTORIAL") || wing.includes("WING 01")) {
    folder = "wing1";
  } else if (wing.includes("WING 2") || wing.includes("WING 02")) {
    folder = "wing2";
  }
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

  // 1. Bloqueia porta de outra Wing ou QR totalmente inválido
  if (newIndex === -1) return false;

  // 2. Bloqueia voltar para uma porta anterior ou escanear a atual de novo
  if (newIndex <= currentIndex) return false;

  // 3. Bloqueia pular portas (você só pode ir para as portas estritamente adjacentes)
  if (wing.includes("WING 4")) {
    if (currentDoor === "FIRST SETUP") {
      if (newDoor !== "DRACONIC CHAPEL" && newDoor !== "CRYPTS") return false;
    } else if (currentDoor === "DRACONIC CHAPEL" || currentDoor === "CRYPTS") {
      if (newDoor !== "BOTH OPEN") return false;
    } else if (currentDoor === "BOTH OPEN") {
      if (newDoor !== "LIBRARY" && newDoor !== "LABORATORY") return false;
    } else if (currentDoor === "LIBRARY" || currentDoor === "LABORATORY") {
      if (newDoor !== "DRAGON BOSS") return false;
    }
  } else {
    // Regra geral da Wing 3: a próxima porta tem que ser exatamente o índice atual + 1
    if (newIndex !== currentIndex + 1) return false;
  }

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
      snackbar.value = { visible: true, text: "Invalid Door Code!", color: "error" };
      doorScannerDialog.value.visible = false;
      return;
  }

  if (!isProgressionValid(targetDoor) && targetDoor !== "BOTH OPEN") {
      snackbar.value = { visible: true, text: "Invalid sequence! You cannot skip, go back, or open doors from another Wing.", color: "warning" };
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
  } else if (wing.includes("TUTORIAL")) {
    const list = [
      "FIRST SETUP",
      "THE BARRICADED PATH (TUTORIAL)",
      "THE KEEP'S COURTYARD (TUTORIAL)",
      "THE ENTRY HALL (TUTORIAL)",
      "THE GREAT HALL (TUTORIAL)",
      "END GAME",
    ];
    const idx = list.indexOf(currentDoor);
    if (idx >= 0 && idx < list.length - 1) commitNextDoor(list[idx + 1]);
    else
      snackbar.value = { visible: true, text: "End of Wing", color: "warning" };
  } else if (wing.includes("WING 1") || wing.includes("WING 01")) {
    const list = [
      "FIRST SETUP",
      "THE BARRICADED PATH",
      "THE KEEP'S COURTYARD",
      "THE ENTRY HALL",
      "THE GREAT HALL",
      "END GAME",
    ];
    const idx = list.indexOf(currentDoor);
    if (idx >= 0 && idx < list.length - 1) commitNextDoor(list[idx + 1]);
    else
      snackbar.value = { visible: true, text: "End of Wing", color: "warning" };
  } else if (wing.includes("WING 2") || wing.includes("WING 02")) {
    const list = [
      "FIRST SETUP",
      "THE GREAT CISTERN",
      "THE DUNGEONS",
      "THE ALCHEMY LAB",
      "THE BURIED ARMORY",
      "THERE AND BACK AGAIN",
      "END GAME",
    ];
    const idx = list.indexOf(currentDoor);
    if (idx >= 0 && idx < list.length - 1) commitNextDoor(list[idx + 1]);
    else
      snackbar.value = { visible: true, text: "End of Wing", color: "warning" };
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

function handlePreviousAction() {
  const wing = (activeCampaignData.value.wing || "").toUpperCase();
  const currentDoor = (activeCampaignData.value.door || "").toUpperCase();
  let list: string[] = [];

  if (wing.includes("TUTORIAL")) {
    list = [
      "FIRST SETUP",
      "THE BARRICADED PATH (TUTORIAL)",
      "THE KEEP'S COURTYARD (TUTORIAL)",
      "THE ENTRY HALL (TUTORIAL)",
      "THE GREAT HALL (TUTORIAL)",
      "END GAME",
    ];
  } else if (wing.includes("WING 1") || wing.includes("WING 01")) {
    list = [
      "FIRST SETUP",
      "THE BARRICADED PATH",
      "THE KEEP'S COURTYARD",
      "THE ENTRY HALL",
      "THE GREAT HALL",
      "END GAME",
    ];
  } else if (wing.includes("WING 2") || wing.includes("WING 02")) {
    list = [
      "FIRST SETUP",
      "THE GREAT CISTERN",
      "THE DUNGEONS",
      "THE ALCHEMY LAB",
      "THE BURIED ARMORY",
      "THERE AND BACK AGAIN",
      "END GAME",
    ];
  }

  if (list.length > 0) {
    const idx = list.indexOf(currentDoor);
    if (idx > 0) {
      commitNextDoor(list[idx - 1]);
    } else {
      snackbar.value = { visible: true, text: "Already at the First Setup", color: "warning" };
    }
  }
}

function handlePreviousActionInDialog() {
  handlePreviousAction();
  doorScannerDialog.value.visible = false;
}

function commitWing4Choice(choice: string) {
  wing4ChoiceDialog.value.visible = false;
  saveWing4Path(choice);
  commitNextDoor(choice);
}

async function commitNextDoor(doorName: string, instructionOverride?: string) {
  lastManualActionTime = Date.now();
  campaignStore.updateCampaignProperty(props.campaignId, "door", doorName);
  if (props.campaign) props.campaign.door = doorName;
  forcedDoorInstruction.value = instructionOverride || doorName;
  if (savePutRef.value) savePutRef.value.save();

  const doorObj = allDoors.value.find(
    (d) => d.name.toUpperCase() === doorName.toUpperCase()
  );
  if (doorObj) {
    try {
      await axios.post("/rl_campaigns_doors/cadastro", {
        doors_fk: doorObj.doors_pk,
        campaign_fk: parseInt(props.campaignId),
      });
      if (doorObj.code) {
        openedDoors.value.add(doorObj.code.toLowerCase());
      }
    } catch (error: any) {
      if (error.response?.status !== 409) {
        console.error("Error committing manual door transition to database:", error);
      }
    }
  }

  setTimeout(() => openNarrativeDialog(), 500);
}

function manualSave() {
  if (savePutRef.value) {
    savePutRef.value.save();
  }
}

watch(
  () => activeCampaignData.value?.sequentialAdventureRunes,
  (newVal, oldVal) => {
    if (oldVal !== undefined && newVal !== oldVal) {
      console.log("[ImmersiveView] Runes changed, saving immediately...");
      if (savePutRef.value) {
        savePutRef.value.save();
      }
    }
  }
);

watch(
  () => activeCampaignData.value?.runeCardIds,
  (newVal, oldVal) => {
    if (oldVal !== undefined && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      console.log("[ImmersiveView] Rune cards changed, saving immediately...");
      if (savePutRef.value) {
        savePutRef.value.save();
      }
    }
  },
  { deep: true }
);
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

.bookmark-tab.red-border-tab {
  border-left-color: #d32f2f;
}

.bookmark-tab.red-border-tab:hover {
  border-left-color: #f44336;
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
    display: block !important;
    padding: 0 !important;
  }

  .top-left {
    position: absolute;
    top: 12px;
    left: max(12px, env(safe-area-inset-left));
    z-index: 20;
  }

  .top-right {
    position: absolute;
    top: 12px;
    right: max(12px, env(safe-area-inset-right));
    z-index: 20;
  }

  .bottom-left {
    position: absolute;
    bottom: max(16px, env(safe-area-inset-bottom));
    left: max(12px, env(safe-area-inset-left));
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
    z-index: 25;
  }

  .bottom-right {
    position: absolute;
    bottom: max(16px, env(safe-area-inset-bottom));
    right: max(0px, env(safe-area-inset-right));
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
    z-index: 25;
  }

  .bottom-center {
    position: absolute;
    bottom: max(12px, env(safe-area-inset-bottom));
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
    z-index: 20;
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
    width: 40px !important;
    height: 40px !important;
    font-size: 0.9rem;
  }

  .bookmark-tab {
    padding: 6px 8px;
    min-width: 36px;
    margin-bottom: 4px !important;
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
    margin-bottom: 6px !important;
  }
}

@media (max-height: 450px) {
  .bookmark-tab {
    padding: 4px 6px;
    margin-bottom: 2px !important;
  }

  .square-hud-btn {
    width: 36px !important;
    height: 36px !important;
  }

  .right-tab-btn {
    height: 38px !important;
    margin-bottom: 4px !important;
  }

  .objective-panel {
    padding: 2px 6px;
    margin-bottom: 4px !important;
  }

  .heroes-rack {
    transform: scale(0.85);
    transform-origin: bottom center;
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

@keyframes badgePop {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes starReveal {
  0% { transform: translateY(30px) scale(0.5) rotate(-45deg); opacity: 0; }
  60% { transform: translateY(-10px) scale(1.2) rotate(10deg); opacity: 1; }
  100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.8; }
}

@keyframes glowCard {
  0% { box-shadow: 0 0 10px rgba(255, 171, 0, 0.3); }
  100% { box-shadow: 0 0 30px rgba(255, 171, 0, 0.8); }
}

.badge-glow-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.badge-star-icon {
  position: absolute;
  top: -50px;
  z-index: 0;
  animation: starReveal 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.badge-title-anim {
  animation: badgePop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  z-index: 1;
}

.badge-card-anim {
  animation: badgePop 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) both, glowCard 1.5s infinite alternate;
  animation-delay: 0.2s, 0.9s;
}

.badge-img-anim {
  animation: badgePop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation-delay: 0.5s;
}

.badge-btn-anim {
  animation: badgePop 0.5s ease-out both;
  animation-delay: 1s;
}

/* Subtle Game-like Saving Indicator styles */
.saving-indicator-bubble {
  position: fixed;
  bottom: 85px; /* Above the bottom navigation bar on mobile */
  left: 20px;   /* Bottom-left corner */
  background: rgba(18, 18, 18, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  transition: all 0.3s ease;
  pointer-events: none; /* Let clicks pass through */
}

@media (min-width: 960px) {
  .saving-indicator-bubble {
    bottom: 24px; /* On desktop, place it lower */
    left: 24px;
  }
}

.saving-indicator-bubble.saved {
  border-color: rgba(76, 175, 80, 0.3);
}

.saving-indicator-bubble.error {
  border-color: rgba(244, 67, 54, 0.3);
}

.uppercase-tracking {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem !important;
}

.placeholder-card {
  border: 2px dashed #ffab00 !important;
  background: rgba(255, 171, 0, 0.08) !important;
  box-shadow: inset 0 0 10px rgba(255, 171, 0, 0.2), 0 0 5px rgba(255, 171, 0, 0.1) !important;
  animation: pulseBorder 1.5s infinite alternate ease-in-out;
}
.placeholder-card:hover {
  border-color: #ffab00 !important;
  background: rgba(255, 171, 0, 0.15) !important;
  box-shadow: inset 0 0 15px rgba(255, 171, 0, 0.3), 0 0 10px rgba(255, 171, 0, 0.3) !important;
}
@keyframes pulseBorder {
  0% {
    border-color: rgba(255, 171, 0, 0.4);
    box-shadow: inset 0 0 5px rgba(255, 171, 0, 0.1), 0 0 2px rgba(255, 171, 0, 0.05);
  }
  100% {
    border-color: rgba(255, 171, 0, 1);
    box-shadow: inset 0 0 15px rgba(255, 171, 0, 0.3), 0 0 8px rgba(255, 171, 0, 0.2);
  }
}
.monster-placeholder-inner {
  height: 100%;
}
.monster-group-placeholder-card {
  width: 200px;
  height: 280px;
  background: rgba(255, 171, 0, 0.08);
  border: 3px dashed #ffab00;
  box-shadow: inset 0 0 15px rgba(255, 171, 0, 0.2), 0 0 8px rgba(255, 171, 0, 0.1);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: pulseBorder 1.5s infinite alternate ease-in-out;
}
.monster-group-placeholder-card:hover {
  transform: scale(1.03);
  border-color: #ffab00;
  background: rgba(255, 171, 0, 0.15);
  box-shadow: inset 0 0 20px rgba(255, 171, 0, 0.3), 0 0 15px rgba(255, 171, 0, 0.3);
}
.selector-monster-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 4px;
}
.selector-monster-card:hover {
  transform: scale(1.08);
  border-color: #ffb300;
  box-shadow: 0 0 15px rgba(255, 179, 0, 0.6);
}
.border-gold {
  border: 1px solid #ffb300 !important;
}
</style>