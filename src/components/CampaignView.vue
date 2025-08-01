<template>
  <v-row class="ml-0 justify-center">
    <v-col cols="12" md="12" lg="6" xl="8">
      <v-card-text v-if="!showSaveCampaignButton" class="pa-2">
        <BaseAlert
          :modelValue="true"
          type="warning"
          text
          border="start"
          variant="tonal"
          :closable="false"
        >
          Players can only view this campaign. Only a Drunagor Master can save
          or delete a campaign.
        </BaseAlert>
      </v-card-text>
      <v-card class="mb-2 pa-1" color="primary" style="width: 100%">
        <v-card-actions class="d-flex justify-space-between">
          <v-row no-gutters>
            <v-card style="width: 100%">
              <v-card-actions
                class="d-flex flex-wrap justify-space-around pa-2"
              >
                <CampaignRemove
                  v-if="showSaveCampaignButton"
                  :campaign-id="campaignId"
                  class="mx-1 my-1"
                />
                <fieldset
                  :disabled="!showSaveCampaignButton"
                  class="d-contents"
                >
                  <CampaignExport :campaign-id="campaignId" class="mx-1 my-1" />
                  <SequentialAdventureButton
                    :campaign-id="campaignId"
                    @sequential-adventure="onSequentialAdventure"
                    :disabled="isSequentialAdventure"
                    class="mx-1 my-1"
                  />
                  <CampaignCampPhase
                    :campaign-id="campaignId"
                    @camp-phase="onCampPhase"
                    class="mx-1 my-1"
                    :disabled="!isSequentialAdventure"
                  />
                </fieldset>
                <CampaignSavePut
                  ref="savePutRef"
                  v-if="showSaveCampaignButton"
                  :campaign-id="campaignId"
                  class="mx-1 my-1"
                  @open-save-panel="openSavePanel"
                />
              </v-card-actions>
            </v-card>
          </v-row>
        </v-card-actions>
      </v-card>
      <v-card class="mb-2 pa-1" color="primary" style="width: 100%">
        <v-row class="ml-0 mt-2 justify-center">
          <v-col cols="12" md="12" lg="12" xl="12">
            <CampaignPlayerList
              ref="campaignPlayerListRef"
              :campaign-id="campaignId"
              class="mb-0"
            />
          </v-col>
        </v-row>
        <v-card-text v-if="showAlert" class="pa-2">
          <BaseAlert
            v-model="showAlert"
            :icon="alertIcon"
            :title="alertTitle"
            :type="alertType"
            text
            density="compact"
            class="ma-2"
          >
            {{ alertText }}
          </BaseAlert>
        </v-card-text>
        <v-row class="ml-0 justify-center">
          <v-col cols="12" md="12" lg="12" xl="12">
            <v-expansion-panels
              v-model="expandedPanel"
              accordion
              class="w-100 mb-4"
            >
              <v-expansion-panel>
                <v-expansion-panel-title
                  class="d-flex align-center justify-space-between"
                >
                  <span class="text-h6">Instructions</span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-tabs
                    v-model="instructionTab"
                    background-color="surface"
                    grow
                  >
                    <v-tab v-if="showSaveCampaignButton" value="save">Save Campaign</v-tab>
                    <v-tab value="load">Load Campaign</v-tab>
                  </v-tabs>

                  <SaveInstructions
                    v-if="instructionTab === 'save'"
                    @save="handleSave"
                  />
                  <LoadInstructions v-else />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <v-row class="ml-0 justify-center mb-2">
    <v-col cols="12" md="12" lg="9" xl="8" class="d-flex justify-end">
      <v-btn
        block
        color="error"
        class="ma-0 pa-2"
        v-if="showSaveCampaignButton"
        @click="removeDialog = true"
      >
        <v-icon left class="mr-2">mdi-account-remove</v-icon>
        Remove Players
      </v-btn>
    </v-col>
  </v-row>

  <v-dialog v-model="removeDialog" max-width="400">
    <v-card>
      <v-card-title>Remove Players</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="player in players"
            :key="player.rl_campaigns_users_pk"
            @click="confirmPlayerRemoval(player)"
            class="cursor-pointer"
          >
            <v-list-item-avatar>
              <v-img
                :src="
                  player.picture_hash ? `/images/${player.picture_hash}` : ''
                "
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ player.user_name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="removeDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="confirmRemoveDialog" max-width="300">
    <v-card>
      <v-card-title class="headline">Confirmation</v-card-title>
      <v-card-text>
        Do you want to delete the player
        <strong>{{ playerToRemove?.user_name }}</strong
        >?
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="confirmRemoveDialog = false">No</v-btn>
        <v-spacer />
        <v-btn
          color="success"
          :loading="removingLoading"
          :disabled="removingLoading"
          @click="removePlayer"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row class="ml-0 justify-center mb-4">
    <v-col cols="12" md="12" lg="9" xl="8">
      <v-btn block color="secondary" class="ma-0 pa-2" @click="openModal">
        <v-icon left class="mr-2">mdi-share-variant</v-icon>
        Share Campaign
      </v-btn>
    </v-col>
  </v-row>

  <v-dialog v-model="visible" max-width="500">
    <v-card>
      <v-card-title>Share Campaign</v-card-title>
      <v-card-text>
        <p class="py-2">Copy this token to share your campaign:</p>
        <v-textarea readonly auto-grow v-model="token" class="ma-0" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeModal">Cancel</v-btn>
        <v-btn @click="copyToClipboard">Copy to clipboard</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <template v-if="campaign">
    <template v-if="campaign.campaign === 'underkeep'">
      <v-row class="ml-0 justify-center">
        <v-col cols="12" md="12" lg="9" xl="8">
          <v-tabs
            v-model="currentTab"
            centered
            grow
            bg-color="surface"
            density="compact"
            class="mb-2"
            style="border-radius: 4px"
            active-class="custom-active-tab"
            slider-color="white"
          >
            <v-tab value="normal" prepend-icon="mdi-clipboard-text-outline">
              Campaign Log
            </v-tab>
            <v-tab value="book" prepend-icon="mdi-book-open-variant">
              Campaign Book
            </v-tab>
          </v-tabs>
          <v-window v-model="currentTab">
            <v-window-item value="normal" class="pa-3">
              <fieldset :disabled="!showSaveCampaignButton">
                <CampaignName :campaign-id="campaignId" class="mb-4" />
                <v-row no-gutters class="d-flex justify-center mb-4">
                  <v-col cols="12">
                    <SelectDoor :campaign-id="campaignId" />
                  </v-col>
                </v-row>
                <v-row
                  v-if="isSequentialAdventure"
                  no-gutters
                  class="d-flex justify-center mb-4"
                >
                  <v-col cols="12">
                    <CampaignRunes :campaign-id="campaignId" />
                  </v-col>
                </v-row>
                <v-row no-gutters class="justify-center pa-6">
                  <v-col cols="12" sm="12" md="6" lg="4">
                    <div
                      class="d-flex align-center justify-center flex-wrap flex-sm-nowrap"
                      style="gap: 12px"
                    >
                      <CampaignLogAddHero :campaign-id="campaignId" />
                      <CampaignLogImportHero :campaign-id="campaignId" />
                      <CampaignLogRemoveHero :campaign-id="campaignId" />
                    </div>
                  </v-col>
                </v-row>
                <v-row no-gutters class="d-flex justify-center">
                  <v-sheet
                    rounded
                    border="md"
                    class="text-white pa-2"
                    width="100%"
                  >
                    <div
                      v-if="
                        heroStore.findAllInCampaign(campaignId).length === 0
                      "
                      class="text-center pa-4"
                    >
                      No heroes added to this campaign yet.
                    </div>
                    <v-col
                      cols="12"
                      v-for="hero in heroStore.findAllInCampaign(campaignId)"
                      :key="hero.heroId"
                      class="pa-1"
                    >
                      <CampaignLog
                        :campaign-id="campaignId"
                        :hero-id="hero.heroId"
                        :is-sequential-adventure="isSequentialAdventure"
                      />
                    </v-col>
                  </v-sheet>
                </v-row>
              </fieldset>
            </v-window-item>

            <v-window-item value="book" class="pa-0">
              <CampaignBook :campaign-id="campaignId" />
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <fieldset :disabled="!showSaveCampaignButton">
        <v-row class="ml-0 justify-center">
          <v-col cols="12" md="12" lg="12" xl="8" class="pa-3">
            <CampaignName :campaign-id="campaignId" class="mb-4" />
            <v-row
              v-if="isSequentialAdventure"
              no-gutters
              class="d-flex justify-center mb-4"
            >
              <v-col cols="12">
                <CampaignRunes :campaign-id="campaignId" />
              </v-col>
            </v-row>
            <v-row
              no-gutters
              class="d-flex justify-center mb-4"
              v-if="
                campaign.campaign === 'awakenings' ||
                campaign.campaign === 'apocalypse'
              "
            >
              <v-col cols="12">
                <StoryRecord :campaign-id="campaignId" />
              </v-col>
            </v-row>
            <v-row
              no-gutters
              class="d-flex justify-center mb-4"
              v-if="campaign.campaign === 'apocalypse'"
            >
              <v-col cols="12">
                <v-sheet rounded border="md" class="pa-4 text-white">
                  <p class="text-center">
                    Apocalypse campaign specific content (e.g., Legacy Trail,
                    Background & Trait) would appear here.
                  </p>
                </v-sheet>
              </v-col>
            </v-row>
            <v-row no-gutters class="justify-center pa-2 mb-4">
              <v-col
                cols="12"
                sm="12"
                md="8"
                lg="6"
                class="d-flex flex-row justify-space-around"
              >
                <CampaignLogAddHero :campaign-id="campaignId" />
                <CampaignLogRemoveHero :campaign-id="campaignId" />
              </v-col>
            </v-row>
            <v-row no-gutters class="d-flex justify-center">
              <v-sheet rounded border="md" class="text-white pa-2" width="100%">
                <div
                  v-if="heroStore.findAllInCampaign(campaignId).length === 0"
                  class="text-center pa-4"
                >
                  No heroes added to this campaign yet.
                </div>
                <v-col
                  cols="12"
                  v-for="hero in heroStore.findAllInCampaign(campaignId)"
                  :key="hero.heroId"
                  class="pa-1"
                >
                  <CampaignLog
                    :campaign-id="campaignId"
                    :hero-id="hero.heroId"
                    :is-sequential-adventure="isSequentialAdventure"
                  />
                </v-col>
              </v-sheet>
            </v-row>
          </v-col>
        </v-row>
      </fieldset>
    </template>
  </template>

  <template v-else-if="!campaign && !showAlert">
    <v-row class="justify-center">
      <v-col cols="12" md="8" class="text-center pa-5">
        <p>Loading campaign data...</p>
        <v-progress-circular
          indeterminate
          color="primary"
          class="mt-4"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </template>
</template>

<script setup lang="ts">
import CampaignLogAddHero from "@/components/CampaignLogAddHero.vue";
import CampaignLogRemoveHero from "@/components/CampaignLogRemoveHero.vue";
import CampaignLog from "@/components/CampaignLog.vue";
import { useRoute, useRouter } from "vue-router";
import { HeroStore } from "@/store/HeroStore";
import CampaignRemove from "@/components/CampaignRemove.vue";
import CampaignExport from "@/components/CampaignExport.vue";
import CampaignSavePut from "@/components/CampaignSavePut.vue";
import StoryRecord from "@/components/StoryRecord.vue";
import CampaignName from "@/components/CampaignName.vue";
import { CampaignStore } from "@/store/CampaignStore";
import { type Campaign } from "@/store/Campaign";
import CampaignCampPhase from "@/components/CampaignCampPhase.vue";
import { ref, onMounted, watch } from "vue";
import CampaignRunes from "@/components/CampaignRunes.vue";
import SequentialAdventureButton from "@/components/SequentialAdventureButton.vue";
import CampaignBook from "@/components/CampaignBook.vue";
import SelectDoor from "@/components/SelectDoor.vue";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import { ref as vueRef } from "vue";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import CampaignPlayerList from "@/components/CampaignPlayerList.vue";
import SaveInstructions from "./SaveInstructions.vue";
import LoadInstructions from "./LoadInstructions.vue";

const campaignStore = CampaignStore();
const heroStore = HeroStore();
const toast = useToast();
const userStore = useUserStore();

const route = useRoute();
const campaignId = (route.params as { id: string }).id.toString();

const isSequentialAdventure = ref(false);
const campaign = ref<Campaign | null>(null);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref<"success" | "info" | "warning" | "error" | undefined>(
  undefined,
);
const showAlert = ref(false);
const currentTab = ref("normal");
const visible = ref(false);
const token = ref("");
const savePutRef = vueRef<InstanceType<typeof CampaignSavePut>>();
const showLoading = ref(false);
const players = ref<
  Array<{
    rl_campaigns_users_pk: number;
    user_name: string;
    picture_hash: string | null;
  }>
>([]);
const removeDialog = ref(false);
const confirmRemoveDialog = ref(false);
const playerToRemove = ref<null | {
  rl_campaigns_users_pk: number;
  user_name: string;
}>(null);
const showSaveCampaignButton = ref(false);
const campaignPlayerListRef = vueRef<InstanceType<
  typeof CampaignPlayerList
> | null>(null);
const removingLoading = ref(false);
const expandedPanel = ref<number[]>([]);
const instructionTab = ref<"save" | "load">("save");

const handleSave = () => {
  savePutRef
    .value!.save()
    .then(() => {
      setAlert(
        "mdi-check",
        "Success",
        "The campaign was saved successfully!",
        "success",
      );
    })
    .catch(() => {
      setAlert(
        "mdi-alert-circle",
        "Error",
        "The campaign could not be saved.",
        "error",
      );
    });
};

const fetchRlCampaignsUsersListPlayers = async () => {
  await axios
    .get("rl_campaigns_users/list_players", {
      params: { campaigns_fk: campaignId },
    })
    .then((response) => {
      players.value = response.data.Users;
      console.log("Fetched players:", response.data.Users);
    })
    .catch(() => {
      showSaveCampaignButton.value = false;
    });
};

const confirmPlayerRemoval = (player: {
  rl_campaigns_users_pk: number;
  user_name: string;
}) => {
  playerToRemove.value = player;
  confirmRemoveDialog.value = true;
};

const openSavePanel = () => {
  expandedPanel.value = [0];
  instructionTab.value = "save";
};

const removePlayer = async () => {
  if (!playerToRemove.value) return;

  removingLoading.value = true;

  await axios
    .delete(
      `rl_campaigns_users/${playerToRemove.value.rl_campaigns_users_pk}/delete/`,
    )
    .then(async () => {
      setAlert(
        "mdi-check",
        "Sucesso",
        "Player successfully removed",
        "success",
      );

      await campaignPlayerListRef.value?.fetchPlayers();
    })
    .catch(() => {
      setAlert("mdi-alert-circle", "Erro", "Failed to remove player", "error");
      alertIcon.value = "mdi-alert-circle";
      alertTitle.value = "Erro";
      alertText.value = "Failed to remove player";
      alertType.value = "error";
    })
    .finally(async () => {
      removingLoading.value = false;
      confirmRemoveDialog.value = false;
      removeDialog.value = false;
      await campaignPlayerListRef.value?.fetchPlayers();

      await nextTick();
      setAlert(
        alertIcon.value,
        alertTitle.value,
        alertText.value || "Player successfully removed",
        alertType.value,
      );
    });
};

const fetchRole = async () => {
  axios
    .get("rl_campaigns_users/search", {
      params: { users_fk: userStore.user.users_pk, campaigns_fk: campaignId },
    })
    .then((response) => {
      showSaveCampaignButton.value = true
        ? response.data.campaigns[0].party_role === "Admin"
        : false;
    });
};

const setAlert = (
  icon: string,
  title: string,
  text: string,
  type: "success" | "info" | "warning" | "error" | undefined,
) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;

  setTimeout(() => {
    showAlert.value = false;
  }, 1500);
};

const onCampPhase = () => {
  isSequentialAdventure.value = false;

  setTimeout(() => {
    savePutRef.value?.save();
  }, 0);
};

const onSequentialAdventure = () => {
  isSequentialAdventure.value = true;

  setTimeout(() => {
    savePutRef.value?.save();
  }, 0);
};

const openModal = () => {
  const prefix = Math.floor(1000 + Math.random() * 9000).toString();
  token.value = `${prefix}${campaignId}`;
  visible.value = true;
};

const copyToClipboard = () => {
  navigator.clipboard
    .writeText(token.value)
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Token copied to clipboard",
        life: 3000,
      });
      closeModal();
    })
    .catch(() => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to copy token",
        life: 3000,
      });
    });
};

const closeModal = () => {
  visible.value = false;
};

const router = useRouter();

onMounted(() => {
  const foundCampaign = campaignStore.find(campaignId);
  if (foundCampaign) {
    campaign.value = foundCampaign;
    isSequentialAdventure.value = foundCampaign.isSequentialAdventure ?? false;
  } else {
    console.error(`Campaign with ID ${campaignId} not found.`);
    setAlert(
      "mdi-alert-circle",
      "Error",
      `Campaign with ID ${campaignId} not found.`,
      "error",
    );
  }
  fetchRole();
  fetchRlCampaignsUsersListPlayers();

  if (route.query.dialog) {
    showLoading.value = true;
  }

  if (route.query.openInstructions === "load") {
    expandedPanel.value = [0];
    instructionTab.value = "load";

    router.replace({ query: {} });
  }
});

watch(
  campaign,
  (newCampaign) => {
    if (newCampaign) {
      isSequentialAdventure.value = newCampaign.isSequentialAdventure ?? false;
      if (newCampaign.campaign !== "underkeep") {
        currentTab.value = "normal";
      }
    }
  },
  { deep: true },
);
</script>

<style scoped>
.d-contents {
  display: contents;
}

.v-textarea textarea[readonly] {
  background-color: #f5f5f5;
}

.mx-1 {
  margin-left: 4px !important;
  margin-right: 4px !important;
}

.my-1 {
  margin-top: 4px !important;
  margin-bottom: 4px !important;
}

/* ESTILO PARA A ABA ATIVA PERSONALIZADA */
.v-tabs .custom-active-tab {
  background-color: rgb(var(--v-theme-secondary)) !important;
  color: white !important;
}

fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

fieldset:disabled {
  pointer-events: none;
}
</style>
