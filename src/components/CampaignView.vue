<template>
  <template v-if="isImmersiveMode">
    <CampaignImmersiveView
      :campaign-id="campaignId"
      :campaign="campaign"
      :hero-store="heroStore"
      :user-store="userStore"
      :show-save-campaign-button="true"
      @refresh-campaign="() => {}"
    />
  </template>

  <template v-else>
    <v-snackbar
      v-model="snackbarVisible"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      location="top"
      elevation="24"
      rounded="lg"
      multi-line
      class="global-snackbar"
    >
      <div class="d-flex align-center">
        <v-icon :color="snackbarIconColor" class="mr-3">{{
          snackbarIcon
        }}</v-icon>
        <div>
          <div v-if="snackbarTitle" class="font-weight-bold">
            {{ snackbarTitle }}
          </div>
          <div>{{ snackbarText }}</div>
        </div>
      </div>
    </v-snackbar>

    <v-dialog v-model="playerListDialogVisible" max-width="600px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Player List</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="playerListDialogVisible = false"
          ></v-btn>
        </v-card-title>
        <v-card-text>
          <CampaignPlayerList
            ref="campaignPlayerListRef"
            :campaign-id="campaignId"
            :show-remove-button="true"
            @player-removed="onPlayerRemoved"
            density="compact"
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex flex-wrap justify-space-around pa-4">
          <v-btn
            @click="shareCampaignRef?.openDialog?.()"
            variant="elevated"
            rounded
            prepend-icon="mdi-account-plus-outline"
            class="my-2"
          >
            Invite Player
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-speed-dial
      v-model="speedDialOpen"
      transition="fade-transition"
      class="d-none d-md-flex"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          :color="speedDialOpen ? 'red' : 'green'"
          size="large"
          icon
          class="speed-dial-activator d-none d-md-flex"
          elevation="14"
        >
          <v-icon>{{
            speedDialOpen ? "mdi-close" : "mdi-script-text-outline"
          }}</v-icon>
        </v-btn>
      </template>

      <v-btn
        key="save"
        size="small"
        color="success"
        icon
        class="speed-dial-item"
        @click="handleSpeedDialAction('save')"
      >
        <v-icon>mdi-content-save-outline</v-icon>
        <v-tooltip activator="parent" location="start">
          {{ t("label.save-campaign-put") || "Save Campaign" }}
        </v-tooltip>
      </v-btn>

      <v-btn
        v-if="
          campaign &&
          ['underkeep', 'underkeep2'].includes(campaign.campaign) &&
          showLoadInstructions
        "
        key="load-instructions"
        size="small"
        color="info"
        icon
        class="speed-dial-item"
        @click="handleSpeedDialAction('load-instructions')"
      >
        <v-icon>mdi-lightbulb-on-outline</v-icon>
        <v-tooltip activator="parent" location="start">
          Load Instructions
        </v-tooltip>
      </v-btn>

      <v-btn
        key="export"
        size="small"
        color="orange"
        icon
        class="speed-dial-item"
        @click="handleSpeedDialAction('export')"
      >
        <v-icon>mdi-export</v-icon>
        <v-tooltip activator="parent" location="start">
          Export Campaign
        </v-tooltip>
      </v-btn>

      <v-btn
        key="player-list"
        size="small"
        color="secondary"
        icon
        class="speed-dial-item"
        @click="openPlayerListDialog"
      >
        <v-icon>mdi-account-group</v-icon>
        <v-tooltip activator="parent" location="start"> Player List </v-tooltip>
      </v-btn>

      <v-btn
        key="tharmagar"
        size="small"
        color="amber-darken-2"
        icon
        class="speed-dial-item"
        @click="handleSpeedDialAction('tharmagar')"
      >
        <v-icon>mdi-comment-question-outline</v-icon>
        <v-tooltip activator="parent" location="start">Ask Tharmagar</v-tooltip>
      </v-btn>

      <v-btn
        key="remove"
        size="small"
        color="error"
        icon
        class="speed-dial-item"
        @click="handleSpeedDialAction('remove')"
      >
        <v-icon>mdi-delete-outline</v-icon>
        <v-tooltip activator="parent" location="start">
          Remove Campaign
        </v-tooltip>
      </v-btn>
    </v-speed-dial>

    <v-bottom-navigation
      v-model="bottomNavValue"
      class="d-md-none mobile-bottom-nav"
      bg-color="surface"
      grow
      elevation="8"
      height="65"
    >
      <v-btn
        value="save"
        @click="handleBottomNavAction('save')"
        class="bottom-nav-btn"
      >
        <v-icon>mdi-content-save-outline</v-icon>
        <span class="bottom-nav-label">Save</span>
      </v-btn>

      <v-btn
        v-if="
          campaign &&
          ['underkeep', 'underkeep2'].includes(campaign.campaign) &&
          showLoadInstructions
        "
        value="load-instructions"
        @click="handleBottomNavAction('load-instructions')"
        class="bottom-nav-btn"
      >
        <v-icon>mdi-lightbulb-on-outline</v-icon>
        <span class="bottom-nav-label">Guide</span>
      </v-btn>

      <v-btn
        value="export"
        @click="handleBottomNavAction('export')"
        class="bottom-nav-btn"
      >
        <v-icon>mdi-export</v-icon>
        <span class="bottom-nav-label">Export</span>
      </v-btn>

      <v-btn
        value="qrcode"
        @click="handleBottomNavAction('qrcode')"
        class="bottom-nav-btn"
      >
        <v-icon>mdi-qrcode-scan</v-icon>
        <span class="bottom-nav-label">Interactions</span>
      </v-btn>

      <v-btn
        value="keywords"
        @click="handleBottomNavAction('keywords')"
        class="bottom-nav-btn"
      >
        <v-icon>mdi-book-search-outline</v-icon>
        <span class="bottom-nav-label">Keywords</span>
      </v-btn>

      <v-btn
        value="tharmagar"
        @click="handleBottomNavAction('tharmagar')"
        class="bottom-nav-btn"
      >
        <v-icon>mdi-comment-question-outline</v-icon>
        <span class="bottom-nav-label">Tharmagar</span>
      </v-btn>
    </v-bottom-navigation>

    <div class="campaign-content" :class="{ 'with-bottom-nav': true }">
      <v-container fluid>
        <template v-if="campaign">
          <v-row justify="center" no-gutters>
            <v-col cols="12" lg="9" xl="8">
              <template
                v-if="['underkeep', 'underkeep2'].includes(campaign.campaign)"
              >
                <v-card class="mb-4" variant="outlined" style="border: 1px solid rgba(255, 255, 255, 0.12); background-color: rgba(255, 255, 255, 0.02)">
                  <v-card-text class="pa-4">
                    <v-row align="center" no-gutters>
                      <v-col cols="12" sm="8" class="pr-sm-4">
                        <CampaignName
                          :campaign-id="campaignId"
                          :is-admin="isAdminUser"
                          class="mb-0 shepherd-campaign-name"
                        />
                      </v-col>
                      <v-col cols="12" sm="4" class="d-flex align-center justify-start justify-sm-end mt-3 mt-sm-0">
                         <div class="d-flex align-center bg-grey-darken-4 px-3 py-2 rounded-lg border-thin">
                           <span class="text-caption font-weight-bold text-grey-lighten-1 mr-1">CAMPAIGN ID:</span>
                           <v-tooltip location="top">
                             <template v-slot:activator="{ props }">
                               <v-icon
                                 v-bind="props"
                                 size="small"
                                 color="grey-lighten-1"
                                 class="cursor-pointer mr-2"
                               >
                                 mdi-information-outline
                               </v-icon>
                             </template>
                             <span>Use this code to invite your friends</span>
                           </v-tooltip>
                           <v-chip v-if="partyCode" label size="small" color="amber-darken-2" variant="flat" class="font-weight-bold">{{
                             partyCode
                           }}</v-chip>
                           <v-chip v-else label size="small" color="grey" variant="flat" class="font-weight-bold"
                             >Generating...</v-chip
                           >
                           <v-btn
                             icon
                             variant="text"
                             density="comfortable"
                             color="grey-lighten-1"
                             class="ml-2"
                             @click="openPlayerListDialog"
                           >
                             <v-icon>mdi-account-group</v-icon>
                             <v-tooltip activator="parent" location="top">Player List</v-tooltip>
                           </v-btn>
                         </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <v-tabs
                  v-model="currentTab"
                  density="compact"
                  grow
                  bg-color="surface"
                  class="mb-3 rounded shepherd-campaign-tabs"
                  slider-color="white"
                >
                  <v-tab value="normal" class="text-caption">
                    <v-icon size="small" class="mr-1"
                      >mdi-clipboard-text-outline</v-icon
                    >
                    <span class="d-none d-sm-inline">Campaign Log</span>
                    <span class="d-sm-none">Log</span>
                  </v-tab>
                  <v-tab value="book" class="text-caption">
                    <v-icon size="small" class="mr-1"
                      >mdi-book-open-variant</v-icon
                    >
                    <span class="d-none d-sm-inline">Campaign Book</span>
                    <span class="d-sm-none">Book</span>
                  </v-tab>
                </v-tabs>

                <div v-show="currentTab === 'normal'">

                    <v-row no-gutters class="mt-3 px-2">
                      <v-col cols="12" md="6" class="pr-md-2">
                        <v-card color="primary" class="pa-4 mb-3">
                          <v-card-title class="text-h6 pa-0 mb-4">
                            Campaign Progress
                          </v-card-title>
                          <SelectDoor
                            :campaign-id="campaignId"
                            :campaign-type="campaign.campaign"
                            class="mb-3 shepherd-select-door"
                          />
                          <CampaignRunes
                            v-if="isSequentialAdventure"
                            :campaign-id="campaignId"
                            class="mb-0 shepherd-runes"
                          />
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6" class="pl-md-2">
                        <CampaignRuneCards
                          v-if="isSequentialAdventure"
                          :campaign-id="campaignId"
                          :campaign-type="campaign.campaign"
                          class="mb-3 shepherd-rune-cards"
                        />
                      </v-col>
                    </v-row>

                    <v-row class="my-3 px-2" no-gutters>
                      <v-col cols="12">
                        <v-card
                          class="pa-2 shepherd-hero-actions"
                          color="primary"
                        >
                          <div class="d-flex justify-center flex-wrap gap-2">
                            <CampaignLogAddHero
                              :campaign-id="campaignId"
                              class="mx-1 my-1"
                            />
                            <CampaignLogImportHero
                              :campaign-id="campaignId"
                              class="mx-1 my-1"
                            />
                            <CampaignLogRemoveHero
                              :campaign-id="campaignId"
                              class="mx-1 my-1"
                            />
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-row class="px-2 mt-2" no-gutters>
                      <v-col cols="12" class="shepherd-heroes-list">
                        <div
                          v-if="
                            heroStore.findAllInCampaign(campaignId).length ===
                            0
                          "
                          class="text-center pa-4 text-white"
                        >
                          No heroes added to this campaign yet.
                        </div>
                        <div
                          v-else
                          v-for="hero in heroStore.findAllInCampaign(
                            campaignId,
                          )"
                          :key="hero.heroId"
                          class="mb-4"
                        >
                          <CampaignLog
                            :campaign-id="campaignId"
                            :hero-id="hero.heroId"
                            :is-sequential-adventure="isSequentialAdventure"
                            :class="`shepherd-hero-${hero.heroId}`"
                          />
                        </div>
                      </v-col>
                    </v-row>
                    <div class="d-flex justify-center mt-6 mb-4">
                      <v-btn
                        color="error"
                        variant="outlined"
                        rounded="pill"
                        size="small"
                        prepend-icon="mdi-delete-outline"
                        class="px-4"
                        @click="executeAction('remove')"
                      >
                        Delete Campaign
                      </v-btn>
                    </div>
                </div>

                <div v-show="currentTab === 'book'">
                  <CampaignBook
                    ref="campaignBookRef"
                    :campaign-wing="campaign?.wing || ''"
                    :campaign-type="campaign?.campaign || ''"
                  />
                </div>
              </template>

              <template v-else>
                <div>
                  <v-row no-gutters align="center" class="mb-3">
                    <v-col cols="12" sm="8">
                      <CampaignName
                        :campaign-id="campaignId"
                        :is-admin="isAdminUser"
                      />
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div
                        class="d-flex justify-start justify-sm-end align-center"
                      >
                        <div class="mx-1 my-1 d-flex align-center">
                          <div class="mr-3">
                            <div class="d-flex align-center">
                              <span class="text-caption font-weight-bold mr-1"
                                >CAMPAIGN ID:</span
                              >
                              <v-tooltip location="top">
                                <template v-slot:activator="{ props }">
                                  <v-icon
                                    v-bind="props"
                                    size="small"
                                    color="info"
                                    class="cursor-pointer"
                                  >
                                    mdi-information-outline
                                  </v-icon>
                                </template>
                                <span
                                  >Use this code to invite your friends</span
                                >
                              </v-tooltip>
                            </div>
                          </div>
                          <v-chip v-if="partyCode" label size="large">{{
                            partyCode
                          }}</v-chip>
                          <v-chip v-else label size="large"
                            >Generating...</v-chip
                          >
                          <v-btn
                             icon
                             variant="text"
                             density="comfortable"
                             color="grey-lighten-1"
                             class="ml-2"
                             @click="openPlayerListDialog"
                           >
                             <v-icon>mdi-account-group</v-icon>
                             <v-tooltip activator="parent" location="top">Player List</v-tooltip>
                           </v-btn>
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row
                    no-gutters
                    class="d-flex justify-center mb-3"
                    v-if="
                      campaign.campaign == 'awakenings' ||
                      campaign.campaign == 'apocalypse'
                    "
                  >
                    <v-col cols="12" class="px-2">
                      <StoryRecord :campaign-id="campaignId" />
                    </v-col>
                  </v-row>

                  <v-row
                    no-gutters
                    class="d-flex justify-center mb-3"
                    v-if="campaign.campaign == 'apocalypse'"
                  >
                    <v-col cols="12" class="px-2">
                      <v-sheet
                        rounded
                        border="md"
                        class="pa-6 text-white bg-surface"
                      >
                        <StoryRecordLegacyTrail :campaign-id="campaignId" />
                        <StoryRecordBackgroundAndTrait
                          :campaign-id="campaignId"
                        />
                      </v-sheet>
                    </v-col>
                  </v-row>
                  <v-row class="my-3" no-gutters>
                    <v-col cols="12">
                      <v-card class="pa-2" color="primary">
                        <div class="d-flex justify-center flex-wrap gap-2">
                          <CampaignLogAddHero
                            :campaign-id="campaignId"
                            class="mx-1 my-1"
                          />
                          <CampaignLogImportHero
                            :campaign-id="campaignId"
                            class="mx-1 my-1"
                          />
                          <CampaignLogRemoveHero
                            :campaign-id="campaignId"
                            class="mx-1 my-1"
                          />
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-sheet
                        rounded
                        border="md"
                        class="text-white pa-2 shepherd-heroes-list"
                      >
                        <div
                          v-if="
                            heroStore.findAllInCampaign(campaignId).length === 0
                          "
                          class="text-center pa-4"
                        >
                          No heroes added to this campaign yet.
                        </div>
                        <div
                          v-for="hero in heroStore.findAllInCampaign(
                            campaignId,
                          )"
                          :key="hero.heroId"
                          class="mb-2"
                        >
                          <CampaignLog
                            :campaign-id="campaignId"
                            :hero-id="hero.heroId"
                            :is-sequential-adventure="isSequentialAdventure"
                          />
                        </div>
                      </v-sheet>
                    </v-col>
                  </v-row>
                  <div class="d-flex justify-center mt-6 mb-4">
                    <v-btn
                      color="error"
                      variant="outlined"
                      rounded="pill"
                      size="small"
                      prepend-icon="mdi-delete-outline"
                      class="px-4"
                      @click="executeAction('remove')"
                    >
                      Delete Campaign
                    </v-btn>
                  </div>
                </div>
              </template>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </div>

    <div style="display: none">
      <CampaignSavePut
        ref="savePutRef"
        :campaign-id="campaignId"
        :is-admin="true"
        @saving="onSaving"
        @success="onSaveSuccess"
        @fail="onSaveFail"
      />
      <CampaignRemove
        ref="campaignRemoveRef"
        :campaign-id="campaignId"
        @removed="onCampaignRemoved"
      />
      <CampaignExport ref="campaignExportRef" :campaign-id="campaignId" />
      <ShareCampaignButton
        ref="shareCampaignRef"
        :campaignId="campaignId"
        :inviteCode="partyCode"
      />
    </div>

    <v-dialog
      v-model="tharmagarDialogVisible"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card color="black" class="position-relative">
        <v-btn
          icon="mdi-close"
          variant="flat"
          color="rgba(255,255,255,0.1)"
          class="text-white"
          style="position: absolute; top: 16px; right: 16px; z-index: 100"
          @click="tharmagarDialogVisible = false"
        ></v-btn>
        <TharmagarChat />
      </v-card>
    </v-dialog>

    <!-- BADGE DIALOG FOR SEASON 1 WINGS -->
    <v-dialog v-model="newBadgeDialog.visible" max-width="500" persistent transition="dialog-bottom-transition">
      <v-card color="#1e1e1e" class="text-center d-flex flex-column align-center pa-6 rounded-lg" style="border: 2px solid #ffab00;">
        <v-icon color="amber-accent-4" size="80" class="mb-4">mdi-star-four-points</v-icon>
        <div class="text-h5 font-weight-black text-amber-accent-4 mb-4" style="text-shadow: 0 0 10px #ffab00;">
          NEW BADGE UNLOCKED!
        </div>

        <v-card
          v-if="newBadgeDialog.reward"
          rounded="lg"
          elevation="10"
          width="100%"
          class="py-3 px-2 mb-6"
          color="secundary"
          style="border: 1px solid rgba(255, 255, 255, 0.1);"
        >
          <v-row class="align-center">
            <v-col cols="3" class="d-flex align-center justify-center pl-4">
              <v-img
                :src="`https://assets.drunagor.app/${newBadgeDialog.reward.picture_hash}`"
                alt="Reward Icon"
                max-height="80"
                contain
              ></v-img>
            </v-col>

            <v-col cols="9" class="pl-2 d-flex flex-column justify-center text-left">
              <p class="font-weight-black text-h6 text-amber-accent-4 ma-0 pb-1" style="line-height: 1.2;">
                {{ newBadgeDialog.reward.name }}
              </p>
              <p class="text-body-2 text-white ma-0 font-weight-medium">
                {{ newBadgeDialog.reward.description }}
              </p>
            </v-col>
          </v-row>
        </v-card>
        
        <v-btn 
          color="amber-accent-4" 
          class="text-black font-weight-black px-8" 
          rounded="pill" 
          size="large"
          @click="newBadgeDialog.visible = false"
        >
          GREAT!
        </v-btn>
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
  </template>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  ref,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
  computed,
  inject,
} from "vue";
import { ref as vueRef } from "vue";
import CampaignLogAddHero from "@/components/CampaignLogAddHero.vue";
import CampaignLogRemoveHero from "@/components/CampaignLogRemoveHero.vue";
import CampaignLog from "@/components/CampaignLog.vue";
import CampaignRemove from "@/components/CampaignRemove.vue";
import CampaignExport from "@/components/CampaignExport.vue";
import CampaignSavePut from "@/components/CampaignSavePut.vue";
import CampaignName from "@/components/CampaignName.vue";
import CampaignBook from "@/components/CampaignBookNew.vue";
import CampaignPlayerList from "@/components/CampaignPlayerList.vue";
import ShareCampaignButton from "./ShareCampaignButton.vue";
import CampaignLogImportHero from "@/components/CampaignLogImportHero.vue";
import CampaignRuneCards from "@/components/CampaignRuneCards.vue";
import CampaignRunes from "@/components/CampaignRunes.vue";
import SelectDoor from "@/components/SelectDoor.vue";
import StoryRecord from "@/components/StoryRecord.vue";
import StoryRecordLegacyTrail from "@/components/StoryRecordLegacyTrail.vue";
import StoryRecordBackgroundAndTrait from "@/components/StoryRecordBackgroundAndTrait.vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { type Campaign } from "@/store/Campaign";
import { useSaveCampaignTour } from "@/components/Composable/useSaveCampaignTour";
import { useLoadCampaignTour } from "@/components/Composable/useLoadCampaignTour";
import SelectCompanion from "@/components/SelectCompanion.vue";
import CampaignImmersiveView from "@/components/CampaignImmersiveView.vue";
import TharmagarChat from "@/components/TharmagarChat.vue";
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";

const campaignStore = CampaignStore();
const heroStore = HeroStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const axios: any = inject("axios");
const { t } = useI18n();
const campaignId = (route.params as { id: string }).id.toString();

const isImmersiveMode = computed(() => {
  return campaign.value && campaign.value.campaign === "underkeep2";
});

const playerListDialogVisible = ref(false);
const partyCode = ref<string | null>(null);
const isSequentialAdventure = ref(true);
const campaign = ref<Campaign | null>(null);
const currentTab = ref("normal");

watch(currentTab, () => {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
});

const isAdminUser = ref(true);
const isSyncingFromServer = ref(false);
let pollingTimer: ReturnType<typeof setInterval> | null = null;
let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;

const checkUserRole = async () => {
  isAdminUser.value = true;
};

const triggerAutoSave = () => {
  if (!isAdminUser.value) return;
  if (isSyncingFromServer.value) return;

  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(async () => {
    console.log("[CampaignView] Auto-saving campaign state...");
    await handleSave();
  }, 1500);
};

const startPollingForUpdates = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
  }

  pollingTimer = setInterval(async () => {
    try {
      if (!userStore.user?.users_pk) {
        userStore.restoreFromStorage();
      }
      if (!userStore.user?.users_pk) {
        console.warn("[CampaignView] Polling skipped: users_pk is missing");
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const skuStr = urlParams.get('sku');
      
      let showSeason2 = false;
      const existingCampaign = campaignStore.findOptional(campaignId);
      if (existingCampaign) {
        showSeason2 = existingCampaign.campaign === 'underkeep2';
      } else if (skuStr) {
        showSeason2 = Number(skuStr) === 39;
      }

      let response = await axios.get("/rl_campaigns_users/search", {
        params: {
          users_fk: userStore.user.users_pk,
          campaigns_fk: campaignId,
          show_season2: showSeason2
        },
      });

      if (!response.data?.campaigns?.length) {
        response = await axios.get("/rl_campaigns_users/search", {
          params: {
            users_fk: userStore.user.users_pk,
            campaigns_fk: campaignId,
            show_season2: !showSeason2
          },
        });
      }

      if (response.data?.campaigns?.length > 0) {
        const campaignData = response.data.campaigns[0];
        if (campaignData.tracker_hash) {
          const currentLocalHash = localStorage.getItem(`campaign_hash_${campaignId}`);
          
          if (campaignData.tracker_hash !== currentLocalHash) {
            console.log("[CampaignView] New tracker hash detected! Reloading campaign in real-time...");
            
            isSyncingFromServer.value = true;
            const loader = new CampaignLoadFromStorage();
            await loader.loadCampaignComplete(campaignId);

            const updatedCampaign = campaignStore.findOptional(campaignId);
            if (updatedCampaign) {
              campaign.value = updatedCampaign;
            }
            isSyncingFromServer.value = false;
          }
        }
      }
    } catch (err) {
      console.error("[CampaignView] Error polling for campaign updates:", err);
    }
  }, 4000);
};

// Deep watch on campaign state for auto-saving modifications
watch(
  campaign,
  (newVal) => {
    if (newVal && !isSyncingFromServer.value) {
      triggerAutoSave();
    }
  },
  { deep: true }
);
const showLoadInstructions = ref(false);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarTitle = ref("");
const snackbarIcon = ref("mdi-check");
const snackbarColor = ref("success");
const snackbarIconColor = ref("white");
const snackbarTimeout = ref(3000);
const speedDialOpen = ref(true);
const tharmagarDialogVisible = ref(false);
const bottomNavValue = ref<string | null>(null);

const savingState = ref<"idle" | "saving" | "saved" | "error">("idle");
let savingStateTimeout: ReturnType<typeof setTimeout> | null = null;

const onSaving = () => {
  savingState.value = "saving";
  if (savingStateTimeout) clearTimeout(savingStateTimeout);
};

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
  }
};

const newBadgeDialog = ref({ visible: false, reward: null as any });

const savePutRef = vueRef<InstanceType<typeof CampaignSavePut>>();
const campaignBookRef = vueRef<any>(null);
const campaignPlayerListRef = vueRef<InstanceType<
  typeof CampaignPlayerList
> | null>(null);
const campaignRemoveRef = vueRef<InstanceType<typeof CampaignRemove> | null>(
  null,
);
const campaignExportRef = vueRef<InstanceType<typeof CampaignExport> | null>(
  null,
);
const shareCampaignRef = vueRef<InstanceType<
  typeof ShareCampaignButton
> | null>(null);

const {
  startSaveTour,
  destroyTour: destroySaveTour,
  isActive: saveTourActive,
  pauseTourForNavigation,
  tryAutoResume,
  hasPausedTour,
} = useSaveCampaignTour({
  onSaveClick: handleSave,
  onManageResourcesClick: handleManageResourcesAction,
  onEquipmentSkillsClick: handleEquipmentSkillsAction,
  campaignId,
});

const { startLoadTour, destroyTour: destroyLoadTour } = useLoadCampaignTour({
  onManageResourcesClick: handleManageResourcesAction,
  onEquipmentSkillsClick: handleEquipmentSkillsAction,
  campaignId,
});

const checkAndResumeTour = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (hasPausedTour()) {
    await tryAutoResume();
  }
};

function setAlert(
  icon: string,
  title: string,
  text: string,
  type: "success" | "info" | "warning" | "error" | undefined,
  duration: number = 3000,
) {
  const colorMap = {
    success: { bg: "success", icon: "white" },
    info: { bg: "info", icon: "white" },
    warning: { bg: "warning", icon: "black" },
    error: { bg: "error", icon: "white" },
  };
  const colors = colorMap[type || "info"];

  snackbarIcon.value = icon;
  snackbarTitle.value = title;
  snackbarText.value = text;
  snackbarColor.value = colors.bg;
  snackbarIconColor.value = colors.icon;
  snackbarTimeout.value = duration;
  snackbarVisible.value = true;
}

function scrollToHeroSection() {
  const heroSection = document.querySelector(
    ".v-sheet.rounded.border-md",
  ) as HTMLElement | null;
  if (!heroSection) return;
  heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
  heroSection.style.transition = "box-shadow 0.3s ease";
  heroSection.style.boxShadow = "0 0 20px rgba(var(--v-theme-primary), 0.5)";
  setTimeout(() => (heroSection.style.boxShadow = ""), 2000);
}

function showHeroSelectionAlert(action: string, heroes: any[]) {
  const heroList = heroes.map((h) => h.name || `Hero ${h.heroId}`).join(", ");
  const actionText =
    action === "manage-resources" ? "Manage Resources" : "Equipment & Skills";
  setAlert(
    "mdi-account-multiple-outline",
    "Multiple Heroes Found",
    `Multiple heroes found in this campaign: ${heroList}. Please scroll down to select the "${actionText}" button for the specific hero you want to manage.`,
    "info",
    5000,
  );
  setTimeout(() => scrollToHeroSection(), 500);
}

function navigateToHeroSequentialState(heroId: string) {
  if (saveTourActive.value) {
    console.log(
      "[CampaignView] Pausando tour para navegação - manage resources",
    );
    pauseTourForNavigation("manage-resources");
  }

  router.push({
    name: "HeroSequentialState",
    params: { campaignId: campaignId, heroId },
  });
}

function navigateToHeroEquipmentSkills(heroId: string) {
  if (saveTourActive.value) {
    console.log(
      "[CampaignView] Pausando tour para navegação - equipment skills",
    );
    pauseTourForNavigation("equipment-skills");
  }

  router.push({ name: "Hero", params: { campaignId: campaignId, heroId } });
}

function handleManageResourcesAction() {
  const heroes = campaignStore.findAllHeroes(campaignId);
  if (heroes.length === 0) {
    setAlert(
      "mdi-information-outline",
      "Info",
      "No heroes found in this campaign. Please add heroes first.",
      "info",
    );
    return;
  }
  if (heroes.length === 1) {
    navigateToHeroSequentialState(heroes[0].heroId);
    return;
  }
  showHeroSelectionAlert("manage-resources", heroes);
}

function handleEquipmentSkillsAction() {
  const heroes = campaignStore.findAllHeroes(campaignId);
  if (heroes.length === 0) {
    setAlert(
      "mdi-information-outline",
      "Info",
      "No heroes found in this campaign. Please add heroes first.",
      "info",
    );
    return;
  }
  if (heroes.length === 1) {
    navigateToHeroEquipmentSkills(heroes[0].heroId);
    return;
  }
  showHeroSelectionAlert("equipment-skills", heroes);
}

function handleQRCodeAction() {
  if (
    campaign.value &&
    ["underkeep", "underkeep2"].includes(campaign.value.campaign)
  ) {
    currentTab.value = "book";

    nextTick(() => {
      if (
        campaignBookRef.value &&
        typeof campaignBookRef.value.forceNavigateToInteract === "function"
      ) {
        campaignBookRef.value.forceNavigateToInteract();
      }
    });
  } else {
    setAlert(
      "mdi-information-outline",
      "Info",
      "QR Code interactions are only available for Underkeep campaigns.",
      "info",
    );
  }
}

const generatePartyCode = () => {
  const prefix = Math.floor(1000 + Math.random() * 9000).toString();
  partyCode.value = `${prefix}${campaignId}`;
};

const openPlayerListDialog = async () => {
  if (campaignPlayerListRef.value) {
    await campaignPlayerListRef.value.fetchPlayers();
  }
  playerListDialogVisible.value = true;
};

const handleSpeedDialAction = (action: string) => {
  executeAction(action);
  speedDialOpen.value = false;
};

const handleBottomNavAction = (action: string) => {
  setTimeout(() => {
    bottomNavValue.value = null;
  }, 100);

  executeAction(action);
};

const executeAction = (action: string) => {
  switch (action) {
    case "save":
      // Bypassing Shepherd step-by-step tour as requested by user to save directly and instantly!
      handleSave();
      break;
    case "load-instructions":
      startLoadTour();
      break;
    case "qrcode":
      handleQRCodeAction();
      break;
    case "keywords":
      handleKeywordsAction();
      break;
    case "export":
      campaignExportRef.value?.export?.();
      break;
    case "player-list":
      openPlayerListDialog();
      break;
    case "tharmagar":
      tharmagarDialogVisible.value = true;
      break;
    case "remove":
      campaignRemoveRef.value?.openDialog?.();
      break;
  }
};

function handleKeywordsAction() {
  if (
    campaign.value &&
    ["underkeep", "underkeep2"].includes(campaign.value.campaign)
  ) {
    currentTab.value = "book";

    nextTick(() => {
      if (
        campaignBookRef.value &&
        typeof campaignBookRef.value.navigateToKeywords === "function"
      ) {
        campaignBookRef.value.navigateToKeywords();
      }
    });
  } else {
    setAlert(
      "mdi-information-outline",
      "Info",
      "Keywords are only available for Underkeep campaigns.",
      "info",
    );
  }
}

async function handleSave() {
  if (!savePutRef.value) {
    console.error("savePutRef não está disponível");
    setAlert(
      "mdi-alert-circle",
      "Error",
      "Save component not initialized. Please try again.",
      "error",
    );
    return;
  }

  try {
    await savePutRef.value.save();
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
}

const onSaveSuccess = () => {
  savingState.value = "saved";
  if (savingStateTimeout) clearTimeout(savingStateTimeout);
  savingStateTimeout = setTimeout(() => {
    savingState.value = "idle";
  }, 2000);

  if (saveTourActive.value) {
    setTimeout(() => {
      destroySaveTour();
    }, 500);
  }
};

const onSaveFail = () => {
  savingState.value = "error";
  if (savingStateTimeout) clearTimeout(savingStateTimeout);
  savingStateTimeout = setTimeout(() => {
    savingState.value = "idle";
  }, 4000);
};

const onCampaignRemoved = () => {
  setAlert("mdi-check", "Success", "Campaign removed successfully", "success");
  router.push({ name: "Campaigns" });
};

const onPlayerRemoved = async () => {
  setAlert("mdi-check", "Success", "Player successfully removed", "success");
  if (campaignPlayerListRef.value) {
    await campaignPlayerListRef.value.fetchPlayers();
  }
};

watch(
  campaign,
  (c) => {
    if (c) {
      isSequentialAdventure.value = c.isSequentialAdventure ?? false;
      if (!["underkeep", "underkeep2"].includes(c.campaign)) {
        currentTab.value = "normal";
      }
    }
  },
  { deep: true },
);

watch(
  () => route.path,
  async (newPath, oldPath) => {
    const isReturningFromHero =
      oldPath &&
      (oldPath.includes("/hero-sequential-state/") ||
        oldPath.includes("/hero/")) &&
      newPath.includes(`/campaign/${campaignId}`);

    if (isReturningFromHero) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await checkAndResumeTour();
    }
  },
  { immediate: false },
);

onBeforeUnmount(() => {
  window.removeEventListener("pageshow", () => {});

  destroySaveTour({ keepProgress: true });
  destroyLoadTour({ keepProgress: true });

  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
});

onMounted(async () => {
  if (!campaignId) {
    setAlert("mdi-alert-circle", "Error", "Campaign ID is missing.", "error");
    return;
  }

  try {
    const existingCampaign = campaignStore.findOptional(campaignId);
    const heroCount = existingCampaign?.heroes?.length || 0;

    if (!existingCampaign || heroCount === 0) {
      const loader = new CampaignLoadFromStorage();
      const success = await loader.loadCampaignComplete(campaignId);
      if (!success) {
        throw new Error("loadCampaignComplete failed to find or load the campaign");
      }
    } else {
      console.log(
        `[CampaignView] Campaign already in store with ${heroCount} heroes, skipping load`,
      );
    }
  } catch (error) {
    console.error("[CampaignView] Error loading campaign from backend:", error);
    setAlert(
      "mdi-alert-circle",
      "Error",
      "Failed to load campaign data. Please try again.",
      "error",
    );
    return;
  }

  const found = campaignStore.find(campaignId);
  if (found) {
    campaign.value = found;
    if (!campaign.value.isSequentialAdventure) {
      campaign.value.isSequentialAdventure = true;
      campaign.value.sequentialAdventureRunes = 0;
    }
    checkAndAwardSeason1Achievements();
  } else {
    setAlert(
      "mdi-alert-circle",
      "Error",
      "Campaign with ID ${campaignId} not found.",
      "error",
    );
    return;
  }

  // fetchRole removido. Acesso é total por padrão agora.
  generatePartyCode();

  await checkUserRole();
  startPollingForUpdates();

  const openInstructions = route.query.openInstructions;
  showLoadInstructions.value = openInstructions === "load";

  const isUnderkeepCampaign =
    campaign.value &&
    ["underkeep", "underkeep2"].includes(campaign.value.campaign);

  window.addEventListener("pageshow", async (event) => {
    if (isUnderkeepCampaign && hasPausedTour()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await checkAndResumeTour();
    }
  });

  if (isUnderkeepCampaign && openInstructions === "load") {
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await startLoadTour();
  } else if (isUnderkeepCampaign) {
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await checkAndResumeTour();
  }

  if (openInstructions === "load") {
    router.replace({
      path: route.path,
      query: { ...route.query, openInstructions: undefined },
    });
  }
});

const checkAndAwardSeason1Achievements = async () => {
  if (!campaign.value || campaign.value.campaign !== "underkeep" || !userStore.user?.users_pk) return;
  
  try {
    const { data: relationData } = await axios.get("/rl_campaigns_users/search", {
      params: {
        users_fk: userStore.user.users_pk,
        campaigns_fk: campaignId,
      },
    });
    
    if (relationData?.campaigns?.length > 0) {
      const relation = relationData.campaigns[0];
      if (relation.events_fk) {
        const wingStr = (campaign.value.wing || "").toUpperCase();
        let rewardPk = null;
        if (wingStr.includes("TUTORIAL") || wingStr.includes("WING 1 TUTORIAL")) {
          rewardPk = 2;
        } else if (wingStr.includes("WING 2 ADVANCED") || wingStr.includes("WING 2")) {
          rewardPk = 3;
        }
        
        if (rewardPk) {
          const { data: rewardData } = await axios.get("/rl_users_rewards/list_rewards", {
            params: { users_fk: userStore.user.users_pk }
          });
          const userRewards = rewardData.rewards || [];
          const hasReward = userRewards.some((r: any) => r.rewards_pk === rewardPk);
          
          if (!hasReward) {
            await axios.post("/rl_users_rewards/cadastro", {
              users_fk: userStore.user.users_pk,
              rewards_fk: rewardPk
            });
            
            newBadgeDialog.value = {
              visible: true,
              reward: REWARDS_DATA[rewardPk]
            };
          }
        }
      }
    }
  } catch (error) {
    console.error("Error checking or awarding Season 1 achievements:", error);
  }
};
</script>

<style scoped>
/* Global Snackbar */
.global-snackbar {
  z-index: 9999 !important;
}

:deep(.v-snackbar__wrapper) {
  min-width: 344px;
  max-width: 500px;
}

:deep(.v-snackbar__content) {
  padding: 16px !important;
}

@media (max-width: 960px) {
  .global-snackbar {
    z-index: 10000 !important;
  }

  :deep(.v-snackbar__wrapper) {
    bottom: 80px !important;
  }
}

.info-text {
  font-size: 0.6rem !important;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
}

.v-btn--slim {
  padding: 0 15px !important;
}

.text-caption {
  font-size: 0.85rem !important;
  font-weight: 400;
  line-height: 1.667;
  letter-spacing: 0.0333333333em !important;
  font-family: "Roboto", sans-serif;
  text-transform: none !important;
}

.campaign-content {
  position: relative;
  overflow-x: hidden;
  padding-bottom: 16px;
}

.campaign-content.with-bottom-nav {
  padding-bottom: 80px;
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.action-btn {
  margin: 2px;
}

.mx-1 {
  margin-left: 4px !important;
  margin-right: 4px !important;
}

.my-1 {
  margin-top: 4px !important;
  margin-bottom: 4px !important;
}

.speed-dial-activator {
  position: fixed;
  right: 10px;
  bottom: 80px;
  z-index: 2000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  width: 56px !important;
  height: 56px !important;
}

.speed-dial-activator:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4) !important;
}

.speed-dial-item {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  margin-bottom: 12px !important;
  transition: all 0.2s ease !important;
  width: 48px !important;
  height: 48px !important;
}

.speed-dial-item:hover {
  transform: scale(1.15) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3) !important;
}

.speed-dial-item:disabled {
  opacity: 0.5 !important;
  transform: none !important;
}

.speed-dial-item-qr {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3) !important;
  margin-bottom: 16px !important;
  transition: all 0.2s ease !important;
  width: 64px !important;
  height: 64px !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.speed-dial-item-qr:hover {
  transform: scale(1.2) !important;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5) !important;
}

.speed-dial-item-qr .v-icon {
  font-size: 36px !important;
}

.mobile-bottom-nav {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1999 !important;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3) !important;
}

.bottom-nav-btn {
  flex-direction: column !important;
  min-width: 60px !important;
  padding: 8px 12px !important;
  height: 100% !important;
}

.bottom-nav-btn .v-icon {
  margin-bottom: 4px !important;
  font-size: 24px !important;
}

.bottom-nav-label {
  font-size: 0.75rem !important;
  line-height: 1 !important;
  text-transform: none !important;
  font-weight: 500 !important;
  margin-top: 2px !important;
}

.bottom-nav-btn-qr {
  flex-direction: column !important;
  min-width: 80px !important;
  padding: 6px 12px !important;
  height: 100% !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  position: relative;
}

.bottom-nav-btn-qr::before {
  content: "";
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.bottom-nav-btn-qr .v-icon {
  margin-bottom: 4px !important;
  font-size: 32px !important;
}

.bottom-nav-label-qr {
  font-size: 0.8rem !important;
  line-height: 1 !important;
  text-transform: none !important;
  font-weight: 700 !important;
  margin-top: 2px !important;
  letter-spacing: 0.5px;
}

.hero-highlight {
  transition: box-shadow 0.3s ease;
}

.hero-highlight.highlighted {
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.5) !important;
}

:deep(.action-buttons-container) {
  position: relative;
  z-index: 10;
}

:deep(.action-btn) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.2s ease;
}

:deep(.action-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
}

.v-tabs .v-tab--selected {
  background-color: rgb(var(--v-theme-secondary)) !important;
  color: white !important;
}

.v-sheet {
  max-height: none;
}

.v-container {
  max-width: 100%;
}

.v-speed-dial .v-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

@media (max-width: 960px) {
  .action-group {
    min-width: 45%;
  }

  .campaign-content.with-bottom-nav {
    padding-bottom: 80px;
  }
}

@media (max-width: 600px) {
  .action-group {
    justify-content: center;
    width: 100%;
  }

  .campaign-content {
    padding-top: 0.5rem;
  }

  .campaign-content.with-bottom-nav {
    padding-bottom: 85px;
  }

  .v-tab {
    min-width: 80px;
  }

  .bottom-nav-label {
    font-size: 0.7rem !important;
  }

  .bottom-nav-btn .v-icon {
    font-size: 22px !important;
  }

  .bottom-nav-label-qr {
    font-size: 0.75rem !important;
  }

  .bottom-nav-btn-qr .v-icon {
    font-size: 30px !important;
  }
}

.d-contents {
  display: contents;
}

.gap-2 {
  gap: 8px;
}

.player-view {
  pointer-events: none;
}

/* Subtle Game-like Saving Indicator styles */
.saving-indicator-bubble {
  position: fixed;
  bottom: 85px; /* Above the bottom navigation bar on mobile */
  left: 20px;   /* Bottom-left corner, out of the way of the bottom-right speed-dial */
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
</style>
