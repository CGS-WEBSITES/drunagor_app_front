<template>
  <v-container max-width="680">
    <div v-if="loadingErrors.length > 0" class="mb-4">
      <BaseAlert
        v-for="(error, index) in loadingErrors"
        :key="error.id"
        :model-value="true"
        type="error"
        title="Loading Error"
        variant="elevated"
        closable
        class="mb-3"
        @update:modelValue="() => loadingErrors.splice(index, 1)"
      >
        {{ error.text }}
      </BaseAlert>
    </div>

    <v-card
      color="primary"
      class="d-none d-md-flex justify-center pa-3 elevation-0"
    >
      <v-card-actions>
        <CampaignNew />

        <CampaignImport />

        <v-btn variant="elevated" rounded @click="onJoinCampaign">
          Join Campaign
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="d-md-none justify-center pa-3 elevation-0">
      <v-card-actions class="d-flex justify-center flex-wrap ga-2">
        <CampaignNew />

        <CampaignImport />

        <v-btn variant="elevated" rounded @click="onJoinCampaign">
          Join Campaign
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="mt-3 pa-3 elevation-0 d-flex align-center justify-space-between flex-wrap ga-3">
      <v-checkbox
        v-model="showAllCampaigns"
        label="Other Campaigns"
        color="primary"
        hide-details
        @update:modelValue="onFilterChange"
      ></v-checkbox>

      <v-select
        v-model="sortOrder"
        :items="[{title: 'Newest First', value: 'desc'}, {title: 'Oldest First', value: 'asc'}]"
        label="Sort By"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 200px; min-width: 150px;"
      ></v-select>
    </v-card>

    <div id="campaigns" class="grid gap-4 pt-4 place-items-center">
      <v-row v-if="loading" class="justify-center" no-gutters>
        <v-card width="100%" class="d-flex justify-center pa-16">
          <v-progress-circular
            indeterminate
            :size="80"
            :width="7"
            color="primary"
          ></v-progress-circular>
        </v-card>
      </v-row>

      <v-row v-else no-gutters>
        <v-col
          cols="12"
          class="py-3"
          v-for="campaign in allCampaigns"
          :key="campaign.campaignId"
        >
          <v-card
            color="primary"
            elevation="16"
            width="100%"
            @click="goToCampaign(campaign.campaignId)"
          >
            <v-img
              v-if="campaign.campaign === 'core'"
              src="https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"
              max-height="200"
              cover
            ></v-img>

            <v-img
              v-else-if="campaign.campaign === 'apocalypse'"
              src="https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp"
              max-height="200"
              cover
            ></v-img>

            <v-img
              v-else-if="campaign.campaign === 'awakenings'"
              src="https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp"
              max-height="200"
              cover
            ></v-img>

            <v-img
              v-else-if="campaign.campaign === 'underkeep'"
              src="@/assets/underkeep.png"
              max-height="200"
              cover
            ></v-img>

            <v-img
              v-else-if="campaign.campaign === 'underkeep2'"
              src="@/assets/underkeep2.png"
              max-height="200"
              cover
            ></v-img>

            <v-card-title class="d-flex flex-column text-uppercase">
              <span class="text-h5 font-weight-bold mb-0">{{
                campaign.name || "Unnamed Campaign"
              }}</span>

              <span v-if="campaign.wing" class="text-subtitle-1 mt-0">{{
                campaign.wing
              }}</span>
            </v-card-title>

            <v-card-text>
              <v-row no-gutters>
                <v-col
                  v-for="hero in heroAvatars(campaign.campaignId)"
                  :key="hero.heroId"
                  :cols="avatarCols(campaign.campaignId)"
                  class="d-flex"
                >
                  <v-avatar
                    class="my-1"
                    rounded="0"
                    :image="hero.images.avatar"
                    :size="avatarSize"
                  ></v-avatar>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="showJoinCampaignDialog" max-width="400" persistent>
      <v-card style="position: relative">
        <div v-if="joiningCampaign" class="dialog-overlay">
          <v-progress-circular
            indeterminate
            size="80"
            width="7"
            color="primary"
          ></v-progress-circular>
        </div>

        <v-card-title class="d-flex justify-space-between align-center pa-0">
          <span class="text-h6 ml-4">Enter Campaign ID</span>

          <v-card-actions class="pa-0">
            <v-btn icon @click="showJoinCampaignDialog = false">
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="joinCampaignId"
            label="Campaign ID"
            hide-details
            dense
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn
            block
            color="green"
            elevation="4"
            class="mt-4"
            :disabled="!parsedCampaignFk"
            @click="confirmJoinCampaign"
          >
            Join
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import CampaignNew from "@/components/CampaignNew.vue";
import CampaignImport from "@/components/CampaignImport.vue";
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import type { HeroData } from "@/data/repository/HeroData";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { useToast } from "primevue/usetoast";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const campaignStore = CampaignStore();
const toast = useToast();

const loading = ref(true);
const joiningCampaign = ref(false);
const loadingErrors = ref<{ id: number; text: string }[]>([]);
const showJoinCampaignDialog = ref(false);
const joinCampaignId = ref("");
const showAllCampaigns = ref(false);
const sortOrder = ref('desc');

const BOX_ID = 38;

const allCampaigns = computed(() => {
  const campaigns = [...campaignStore.findAll()];
  return campaigns.sort((a, b) => {
    if (sortOrder.value === 'desc') {
      return Number(b.campaignId) - Number(a.campaignId);
    }
    return Number(a.campaignId) - Number(b.campaignId);
  });
});

const avatarSize = computed(() => (route.meta.mdAndUp ? 120 : 70));
const parsedCampaignFk = computed(() => {
  return joinCampaignId.value.length > 4 ? joinCampaignId.value.slice(4) : null;
});

const getBoxName = (boxId: number) => {
  const map: Record<number, string> = {
    22: "Corebox",
    23: "Apocalypse",
    34: "Awakenings",
    38: "Underkeep Drunagor Nights",
    39: "Underkeep Drunagor Nights Season 2",
  };

  return map[boxId] || `Unknown Box (ID: ${boxId})`;
};

const addLoadingError = (text: string) => {
  const id = Date.now();

  loadingErrors.value.push({ id, text });

  setTimeout(() => {
    loadingErrors.value = loadingErrors.value.filter((e) => e.id !== id);
  }, 5000);
};

const loadCampaignFromHash = (trackerHash: string, campaignPk: string, partyName: string) => {
  try {
    const data = JSON.parse(atob(trackerHash));

    if (!data.campaignData) return;

    const camp = data.campaignData;
    camp.campaignId = campaignPk;
    camp.name = partyName || camp.name || "Unnamed Campaign";
    camp.heroes = [];

    campaignStore.add(camp);
  } catch (error) {
    console.error("Error loading campaign from hash:", error);
    throw error;
  }
};

const loadCampaignWithHeroes = async (campaignData: any) => {
  try {
    const campaignPk = String(campaignData.campaigns_fk);
    loadCampaignFromHash(campaignData.tracker_hash, campaignPk, campaignData.party_name);
    return true;
  } catch (error) {
    console.error("Error loading campaign:", error);
    const boxName = getBoxName(campaignData.box);
    const partyName = campaignData.party_name || "Unnamed Party";

    addLoadingError(
      `Could not load the campaign "${partyName}" from the "${boxName}". ` +
        `Data seems corrupted. Please contact support.`,
    );
    return false;
  }
};

const loadCampaigns = async () => {
  loading.value = true;
  campaignStore.reset();
  loadingErrors.value = [];

  try {
    const campaignsResponse = await axios.get("/rl_campaigns_users/search", {
      params: {
        users_fk: userStore.user!.users_pk,
        show_season2: showAllCampaigns.value,
      },
    });

    for (const campaignData of campaignsResponse.data.campaigns) {
      await loadCampaignWithHeroes(campaignData);
    }
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    addLoadingError("Error fetching campaigns. Please try again later.");
  } finally {
    loading.value = false;
  }
};

const onFilterChange = () => {
  loadCampaigns();
};

const goToCampaign = (id: string) => {
  router.push({ name: "Campaign", params: { id } });
};

const heroAvatars = (campId: string): HeroData[] => {
  const repo = new HeroDataRepository();
  const heroes = campaignStore.findAllHeroes(campId);

  if (heroes.length === 0) {
    return [];
  }

  return heroes
    .map((h) => repo.find(h.heroId))
    .filter((h): h is HeroData => !!h);
};

const avatarCols = (campId: string) => {
  const count = heroAvatars(campId).length;

  return route.meta.mdAndUp && count <= 4 ? 3 : undefined;
};

const onJoinCampaign = () => {
  showJoinCampaignDialog.value = true;
};

const confirmJoinCampaign = async () => {
  if (!parsedCampaignFk.value) return;

  joiningCampaign.value = true;
  const usersPk = userStore.user.users_pk;
  const campaignId = parsedCampaignFk.value;

  try {
    await axios.post(
      "/rl_campaigns_users/cadastro",
      {
        users_fk: usersPk,
        campaigns_fk: campaignId,
        party_roles_fk: 2,
        skus_fk: BOX_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );

    const campaignResponse = await axios.get("/rl_campaigns_users/search", {
      params: {
        users_fk: usersPk,
        campaigns_fk: campaignId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const campaignData = campaignResponse.data.campaigns[0];

    if (campaignData && campaignData.tracker_hash) {
      await loadCampaignWithHeroes(campaignData);

      router.push({
        path: `/campaign-tracker/campaign/${campaignId}`,
        query: { sku: String(BOX_ID) },
      });

      toast.add({
        severity: "success",
        summary: "Success",
        detail: "You have successfully joined the campaign!",
      });
    } else {
      throw new Error("Failed to retrieve campaign data after joining.");
    }
  } catch (err: any) {
    console.error("Error during join process:", err);
    let errorMessage = "Error joining campaign.";
    let severity = "error";

    if (
      err.response?.data?.message?.includes("already exists") ||
      err.response?.data?.message?.includes("já existe")
    ) {
      errorMessage = "You are already part of this campaign!";
      severity = "info";

      router.push({
        path: `/campaign-tracker/campaign/${campaignId}`,
        query: { sku: String(BOX_ID) },
      });
    }

    toast.add({
      severity: severity,
      summary: severity === "info" ? "Info" : "Error",
      detail: errorMessage,
    });
  } finally {
    joiningCampaign.value = false;
    joinCampaignId.value = "";
    showJoinCampaignDialog.value = false;
  }
};

onBeforeMount(async () => {
  await loadCampaigns();
});
</script>

<style scoped>
.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
</style>