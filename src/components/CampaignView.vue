<template>
  <template v-if="isImmersiveMode">
    <CampaignImmersiveView
      :campaign-id="campaignId"
      :campaign="campaign"
      :hero-store="heroStore"
      :user-store="userStore"
      :show-save-campaign-button="showSaveCampaignButton"
      @refresh-campaign="fetchRole"
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
          :show-remove-button="showSaveCampaignButton"
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
        <v-btn
          v-if="showSaveCampaignButton"
          class="my-2"
          @click="openTransferDialog"
          variant="elevated"
          rounded
          prepend-icon="mdi-account-switch-outline"
        >
          Transfer Drunagor Master
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="transferDialogVisible" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Transfer Drunagor Master</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-alert
            v-if="transferAlertVisible"
            :type="transferAlertType"
            class="mb-4"
            closable
            @click:close="transferAlertVisible = false"
          >
            {{ transferAlertText }}
          </v-alert>
          <div v-if="transferLoading" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" />
            <p class="mt-4">Loading players...</p>
          </div>
          <div v-else-if="!confirmingTransfer">
            <p class="mb-4">
              Select the player who will become the new Drunagor Master:
            </p>
            <v-list>
              <v-list-item
                v-for="player in players.filter((p) => p.party_roles_fk !== 1)"
                :key="player.rl_campaigns_users_pk"
                @click="initTransfer(player)"
                class="mb-2"
                rounded
                color="primary"
              >
                <v-list-item-title>{{ player.user_name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  player.role_name
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
          <div v-else>
            <v-alert type="warning" class="mb-4">
              <strong>Confirm Transfer</strong>
              <p class="mt-2">
                Are you sure you want to transfer Drunagor Master role to
                <strong>{{ selectedUser?.user_name }}</strong
                >?
              </p>
              <p class="mt-2 text-caption">
                You will become a regular player and lose editing privileges.
              </p>
            </v-alert>
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="!confirmingTransfer"
          color="grey"
          variant="text"
          @click="closeTransferDialog"
        >
          Cancel
        </v-btn>
        <template v-else>
          <v-btn
            color="grey"
            variant="text"
            @click="cancelTransfer"
            :disabled="transferLoading"
          >
            Cancel
          </v-btn>
          <template v-else>
            <v-btn
              color="grey"
              variant="text"
              @click="cancelTransfer"
              :disabled="transferLoading"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              variant="elevated"
              @click="confirmTransfer"
              :loading="transferLoading"
            >
              Confirm Transfer
            </v-btn>
          </template>
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

  <!-- Desktop: Speed Dial (oculto em mobile/tablet) -->
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
        v-if="showSaveCampaignButton"
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
      :disabled="!showSaveCampaignButton"
      @click="handleSpeedDialAction('export')"
    >
      <v-icon>mdi-export</v-icon>
      <v-tooltip activator="parent" location="start">
        Export Campaign
      </v-tooltip>
    </v-btn>

    <v-btn
      key="qrcode"
      size="large"
      color="purple"
      icon
      class="speed-dial-item-qr"
      @click="handleSpeedDialAction('qrcode')"
    >
      <v-icon size="large">mdi-qrcode</v-icon>
      <v-tooltip activator="parent" location="start"> QR Code </v-tooltip>
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
      v-if="showSaveCampaignButton"
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

  <!-- Mobile/Tablet: Bottom Navigation (visível apenas em mobile/tablet) -->
  <v-bottom-navigation
    v-model="bottomNavValue"
    class="d-md-none mobile-bottom-nav"
    bg-color="surface"
    grow
    elevation="8"
    height="65"
  >
    <v-btn
      v-if="showSaveCampaignButton"
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
      :disabled="!showSaveCampaignButton"
      @click="handleBottomNavAction('export')"
      class="bottom-nav-btn"
    >
      <v-icon>mdi-export</v-icon>
      <span class="bottom-nav-label">Export</span>
    </v-btn>

    <v-btn
      value="qrcode"
      @click="handleBottomNavAction('qrcode')"
      class="bottom-nav-btn-qr"
    >
      <v-icon size="x-large">mdi-qrcode</v-icon>
      <span class="bottom-nav-label-qr">QR Code</span>
    </v-btn>

    <v-btn
      value="player-list"
      @click="handleBottomNavAction('player-list')"
      class="bottom-nav-btn"
    >
      <v-icon>mdi-account-group</v-icon>
      <span class="bottom-nav-label">Players</span>
    </v-btn>

    <v-btn
      v-if="showSaveCampaignButton"
      value="remove"
      @click="handleBottomNavAction('remove')"
      class="bottom-nav-btn"
    >
      <v-icon>mdi-delete-outline</v-icon>
      <span class="bottom-nav-label">Remove</span>
    </v-btn>
  </v-bottom-navigation>

  <div class="campaign-content" :class="{ 'with-bottom-nav': true }">
    <v-container fluid>
      <template v-if="campaign">
        <v-row justify="center" no-gutters>
          <v-col cols="12" lg="9" xl="8">
            <v-card-text
              v-if="
                !showSaveCampaignButton &&
                !['underkeep', 'underkeep2'].includes(campaign.campaign)
              "
              class="pa-2"
            >
              <BaseAlert
                :modelValue="true"
                type="warning"
                text
                border="start"
                variant="tonal"
                :closable="true"
              >
                Players can only view information for this campaign. Only a
                Dunagor Master can save, edit, or delete a campaign.
              </BaseAlert>
            </v-card-text>

            <template
              v-if="['underkeep', 'underkeep2'].includes(campaign.campaign)"
            >
              <v-card-text v-if="!showSaveCampaignButton" class="pa-2">
                <BaseAlert
                  :modelValue="true"
                  type="warning"
                  text
                  border="start"
                  variant="tonal"
                  :closable="true"
                >
                  Players can only view information for this campaign. Only a
                  Drunagor Master can save, edit, or delete a campaign.
                </BaseAlert>
              </v-card-text>

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

              <v-window v-model="currentTab">
                <v-window-item value="normal">
                  <v-card class="mb-3" color="primary">
                    <v-card-text class="pa-2">
                      <v-row align="center">
                        <v-col class="pb-0" cols="12" sm="6">
                          <CampaignName
                            :campaign-id="campaignId"
                            class="mb-0 shepherd-campaign-name"
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div
                            class="d-flex justify-start justify-sm-end align-center mb-4"
                          >
                            <div class="mx-1 my-1= d-flex align-center">
                              <div class="mr-3">
                                <div class="d-flex align-center">
                                  <span
                                    class="text-caption font-weight-bold mr-1"
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
                                      >Use this code to invite your
                                      friends</span
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
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <div>
                    <v-row no-gutters>
                      <v-col cols="12" md="6" class="pr-md-2">
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
                        <v-row
                          v-if="campaign && campaign.campaign === 'underkeep2'"
                          no-gutters
                          class="mt-0"
                        >
                          <v-col cols="12">
                            <SelectCompanion
                              :campaign-id="campaignId"
                              :is-admin="showSaveCampaignButton"
                            />
                          </v-col>
                          <v-col cols="12" sm="6">
                            <div
                              class="d-flex justify-start justify-sm-end align-center mb-4"
                            >
                              <div class="mx-1 my-1 d-flex align-center">
                                <div class="mr-3">
                                  <div class="d-flex align-center">
                                    <span
                                      class="text-caption font-weight-bold mr-1"
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
                                        >Use this code to invite your
                                        friends</span
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
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-col cols="12" md="6" class="pl-md-2">
                        <CampaignRuneCards
                          v-if="isSequentialAdventure"
                          :campaign-id="campaignId"
                          :campaign-type="campaign.campaign"
                          class="mb-3 shepherd-rune-cards"
                        />
                      </v-col>
                    </v-card>

                    <v-row
                      class="my-3"
                      no-gutters
                      v-if="showSaveCampaignButton"
                    >
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

                    <v-row no-gutters>
                      <v-col cols="12">
                        <v-sheet
                          rounded
                          border="md"
                          class="text-white pa-2 shepherd-heroes-list"
                        >
                          <div
                            v-if="
                              campaignStore.findAllHeroes(campaignId).length ===
                              0
                            "
                            class="text-center pa-4"
                          >
                            No heroes added to this campaign yet.
                          </div>
                          <div
                            v-for="hero in campaignStore.findAllHeroes(
                              campaignId,
                            )"
                            :key="hero.heroId"
                            class="mb-2"
                          >
                            <v-col cols="12">
                              <SelectCompanion
                                :campaign-id="campaignId"
                                :is-admin="showSaveCampaignButton"
                              />
                            </v-col>
                          </div>
                        </v-sheet>
                        <v-col cols="12" md="6" class="pl-md-2">
                          <CampaignRuneCards
                            v-if="isSequentialAdventure"
                            :campaign-id="campaignId"
                            :campaign-type="campaign.campaign"
                            class="mb-3 shepherd-rune-cards"
                          />
                        </v-col>
                      </v-col>
                    </v-row>

                    <v-row
                      class="my-3"
                      no-gutters
                      v-if="showSaveCampaignButton"
                    >
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

                    <v-row no-gutters>
                      <v-col cols="12">
                        <v-sheet
                          rounded
                          border="md"
                          class="text-white pa-2 shepherd-heroes-list"
                        >
                          <div
                            v-if="
                              heroStore.findAllInCampaign(campaignId).length ===
                              0
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
                              :class="`shepherd-hero-${hero.heroId}`"
                            />
                          </div>
                        </v-sheet>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <v-window-item value="book">
                    <CampaignBook
                      ref="campaignBookRef"
                      :campaign-id="campaignId"
                    />
                  </v-window-item>
                </v-window>
              </template>

              <template v-else>
                <div>
                  <v-row no-gutters align="center" class="mb-3">
                    <v-col cols="12" sm="8">
                      <CampaignName :campaign-id="campaignId" />
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div
                        class="d-flex justify-start justify-sm-end align-center"
                      >
                        <div
                          v-if="showSaveCampaignButton"
                          class="mx-1 my-1 d-flex align-center"
                        >
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
                                <span>Use this code to invite your friends</span>
                              </v-tooltip>
                            </div>
                          </div>
                          <v-chip v-if="partyCode" label size="large">{{
                            partyCode
                          }}</v-chip>
                          <v-chip v-else label size="large">Generating...</v-chip>
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row class="my-3" no-gutters v-if="showSaveCampaignButton">
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
                      <v-sheet rounded border="md" class="text-white pa-2">
                        <div
                          v-if="
                            heroStore.findAllInCampaign(campaignId).length === 0
                          "
                          class="text-center pa-4"
                        >
                          No heroes added to this campaign yet.
                        </div>
                        <div
                          v-for="hero in heroStore.findAllInCampaign(campaignId)"
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
  </template>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
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
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { type Campaign } from "@/store/Campaign";
import { useSaveCampaignTour } from "@/components/Composable/useSaveCampaignTour";
import { useLoadCampaignTour } from "@/components/Composable/useLoadCampaignTour";
import SelectCompanion from "@/components/SelectCompanion.vue";
import CampaignImmersiveView from "@/components/CampaignImmersiveView.vue"; // Import the new component
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";

const campaignStore = CampaignStore();
const heroStore = HeroStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const campaignId = (route.params as { id: string }).id.toString();

const playerListDialogVisible = ref(false);
const partyCode = ref<string | null>(null);
const isSequentialAdventure = ref(true);
const campaign = ref<Campaign | null>(null);
const currentTab = ref("normal");
const showSaveCampaignButton = ref(false);
const showLoadInstructions = ref(false);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarTitle = ref("");
const snackbarIcon = ref("mdi-check");
const snackbarColor = ref("success");
const snackbarIconColor = ref("white");
const snackbarTimeout = ref(3000);
const speedDialOpen = ref(true);
const bottomNavValue = ref<string | null>(null);

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

const transferLoading = ref(false);
const transferDialogVisible = ref(false);
const players = ref<
  Array<{
    rl_campaigns_users_pk: number;
    user_name: string;
    role_name: string;
    party_roles_fk: number;
    users_fk: number;
  }>
>([]);
const selectedUser = ref<(typeof players.value)[0] | null>(null);
const confirmingTransfer = ref(false);
const originalMaster = ref<(typeof players.value)[0] | null>(null);
const transferAlertVisible = ref(false);
const transferAlertText = ref("");
const transferAlertType = ref<"success" | "error">("success");

const {
  startSaveTour,
  destroyTour: destroySaveTour,
  isActive: saveTourActive,
  pauseTourForNavigation,
  shouldResumeAfterNav,
  consumeResumeFlag,
  tryAutoResume,
  hasPausedTour,
} = useSaveCampaignTour({
  onSaveClick: handleSave,
  onManageResourcesClick: handleManageResourcesAction,
  onEquipmentSkillsClick: handleEquipmentSkillsAction,
  campaignId,
});

const {
  startLoadTour,
  destroyTour: destroyLoadTour,
  isActive: loadTourActive,
} = useLoadCampaignTour({
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

  if (type === "success" && duration >= 1500) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
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
  if (!showSaveCampaignButton.value) {
    setAlert(
      "mdi-alert-circle",
      "Access Denied",
      "Only the Drunagor Master can access this feature.",
      "error",
    );
    return;
  }

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
  if (!showSaveCampaignButton.value) {
    setAlert(
      "mdi-alert-circle",
      "Access Denied",
      "Only the Drunagor Master can access this feature.",
      "error",
    );
    return;
  }

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
      if (
        campaign.value &&
        ["underkeep", "underkeep2"].includes(campaign.value.campaign)
      ) {
        startSaveTour();
      } else {
        handleSave();
      }
      break;
    case "load-instructions":
      startLoadTour();
      break;
    case "qrcode":
      handleQRCodeAction();
      break;
    case "export":
      campaignExportRef.value?.export?.();
      break;
    case "player-list":
      openPlayerListDialog();
      break;
    case "remove":
      campaignRemoveRef.value?.openDialog?.();
      break;
  }
};

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
  setAlert(
    "mdi-check",
    "Success",
    "The campaign was saved successfully!",
    "success",
    4000,
  );

  if (saveTourActive.value) {
    setTimeout(() => {
      destroySaveTour();
    }, 500);
  }
};

const onSaveFail = () => {
  setAlert(
    "mdi-alert-circle",
    "Error",
    "The campaign could not be saved.",
    "error",
    4000,
  );
};

const initTransfer = (user: (typeof players.value)[0]) => {
  selectedUser.value = user;
  confirmingTransfer.value = true;
};

const openTransferDialog = () => {
  transferDialogVisible.value = true;
  transferLoading.value = true;
  axios
    .get("/rl_campaigns_users/list_players", {
      params: { campaigns_fk: campaignId },
    })
    .then(({ data }) => {
      players.value = data.Users;
      originalMaster.value =
        players.value.find((u) => u.party_roles_fk === 1) || null;
    })
    .catch((err) => console.error("Error fetching players:", err))
    .finally(() => (transferLoading.value = false));
};

const confirmTransfer = () => {
  if (!selectedUser.value || !originalMaster.value) return;
  transferLoading.value = true;
  const promote = axios.put("/rl_campaigns_users/alter", {
    rl_campaigns_users_pk: selectedUser.value.rl_campaigns_users_pk,
    party_roles_fk: 1,
  });
  const demote = axios.put("/rl_campaigns_users/alter", {
    rl_campaigns_users_pk: originalMaster.value.rl_campaigns_users_pk,
    party_roles_fk: 2,
  });
  Promise.all([promote, demote])
    .then(() => {
      transferAlertText.value = "Transfer successful!";
      transferAlertType.value = "success";
      transferAlertVisible.value = true;
      setTimeout(() => {
        transferAlertVisible.value = false;
        closeTransferDialog();
        router.push({ name: "Campaigns" });
      }, 1500);
    })
    .catch((err) => {
      const payload = err.response?.data;
      transferAlertText.value =
        payload?.message || JSON.stringify(payload?.errors || {});
      transferAlertType.value = "error";
      transferAlertVisible.value = true;
      setTimeout(() => (transferAlertVisible.value = false), 1500);
    })
    .finally(() => {
      transferLoading.value = false;
      confirmingTransfer.value = false;
      selectedUser.value = null;
    });
};

const cancelTransfer = () => {
  confirmingTransfer.value = false;
  selectedUser.value = null;
};

const closeTransferDialog = () => {
  transferDialogVisible.value = false;
  confirmingTransfer.value = false;
  selectedUser.value = null;
};

const onCampaignRemoved = () => {
  setAlert("mdi-check", "Success", "Campaign removed successfully", "success");
  router.push({ name: "Campaigns" });
};

const fetchRole = async () => {
  try {
    const { data } = await axios.get("rl_campaigns_users/search", {
      params: { users_fk: userStore.user.users_pk, campaigns_fk: campaignId },
    });
    showSaveCampaignButton.value = data.campaigns[0]?.party_role === "Admin";
  } catch {
    showSaveCampaignButton.value = false;
  }
};

const onPlayerRemoved = async () => {
  setAlert("mdi-check", "Success", "Player successfully removed", "success");
  if (campaignPlayerListRef.value) {
    await campaignPlayerListRef.value.fetchPlayers();
  }
};

watch(transferAlertVisible, (v) => {
  if (!v && transferAlertType.value === "success") closeTransferDialog();
});

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
      await loader.loadCampaignComplete(campaignId);
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
  } else {
    setAlert(
      "mdi-alert-circle",
      "Error",
      `Campaign with ID ${campaignId} not found.`,
      "error",
    );
    return;
  }

  await fetchRole();
  generatePartyCode();

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
</style>