<template>
  <v-expansion-panels variant="accordion" class="mb-2">
    <v-expansion-panel elevation="16" rounded style="background-color: #1f2937">
      <v-expansion-panel-title class="pa-3">
        <div class="d-flex align-center w-100">
          <v-avatar
            :image="hero.images?.avatar"
            size="48"
            class="mr-3"
            rounded="sm"
          />
          <div class="text-left">
            <h3 class="text-h6 font-weight-bold text-white mb-0">
              {{ hero.name }}
            </h3>
            <p class="text-caption text-grey-400 mb-0">
              {{ hero.class }} - Level {{ hero.level || 1 }}
            </p>
          </div>
        </div>
      </v-expansion-panel-title>

      <v-expansion-panel-text class="pa-0">
        <v-card-text class="px-0 pt-0 position-relative">
          <v-row no-gutters>
            <v-col cols="12" class="position-relative">
              <v-img :src="hero.images.trackerInfo" contain />

              <!-- Botão Manage Resources sobreposto -->
              <v-btn
                v-if="isSequentialAdventure && isAdmin && !loading"
                @click.stop="openSequentialStateEditor"
                variant="elevated"
                color="secondary"
                rounded
                class="manage-resources-btn"
                size="small"
              >
                {{ t("Manage Resources") }}
              </v-btn>

              <!-- Botão Equipment Skills sobreposto -->
              <v-btn
                v-if="
                  (campaign.campaign == 'core' ||
                    campaign.campaign == 'awakenings' ||
                    campaign.campaign == 'apocalypse' ||
                    campaign.campaign == 'underkeep') &&
                  isAdmin &&
                  !loading
                "
                @click.stop="openHeroEquipmentSkills"
                variant="elevated"
                color="primary"
                rounded
                class="equipment-skills-btn"
                size="small"
              >
                {{ t("label.equipment-skills") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-row no-gutters>
            <v-col cols="12">
              <CampaignLogSequentialAdventure
                v-if="isSequentialAdventure"
                :hero="hero"
                :campaign-id="campaignId"
                :hide-manage-button="true"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogCore
                v-if="campaign.campaign == 'core'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
                :hide-equipment-button="true"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogAwakenings
                v-if="campaign.campaign == 'awakenings'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
                :hide-equipment-button="true"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogApocalypse
                v-if="campaign.campaign == 'apocalypse'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
                :hide-equipment-button="true"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogUnderKeep
                v-if="campaign.campaign == 'underkeep'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
                :hide-equipment-button="true"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import CampaignLogCore from "./CampaignLogCore.vue";
import CampaignLogUnderKeep from "./CampaignLogUnderKeep.vue";
import CampaignLogAwakenings from "./CampaignLogAwakenings.vue";
import CampaignLogApocalypse from "./CampaignLogApocalypse.vue";
import CampaignLogSequentialAdventure from "@/components/CampaignLogSequentialAdventure.vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  isSequentialAdventure: boolean;
}>();

const heroDataRepository = new HeroDataRepository();
const campaignStore = CampaignStore();
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const isAdmin = ref(false);
const loading = ref(true);

const campaign = campaignStore.find(props.campaignId);
const hero = heroDataRepository.find(props.heroId) ?? ({} as HeroData);

const checkUserRole = async () => {
  try {
    const response = await axios.get("rl_campaigns_users/search", {
      params: {
        users_fk: userStore.user?.users_pk,
        campaigns_fk: props.campaignId,
      },
    });

    isAdmin.value = response.data.campaigns[0]?.party_role === "Admin";
  } catch (error) {
    console.error("CampaignLog - Error fetching user role:", error);
    isAdmin.value = false;
  } finally {
    loading.value = false;
  }
};

function openSequentialStateEditor() {
  if (!isAdmin.value) {
    console.log("CampaignLog - Cannot navigate - not admin");
    return;
  }

  router.push({
    name: "HeroSequentialState",
    params: { campaignId: props.campaignId, heroId: props.heroId },
  });
}

function openHeroEquipmentSkills() {
  if (!isAdmin.value) {
    console.log("CampaignLog - Cannot navigate - not admin");
    return;
  }

  router.push({
    name: "Hero",
    params: { campaignId: props.campaignId, heroId: props.heroId },
  });
}

onMounted(async () => {
  await checkUserRole();
});
</script>

<style scoped>
.hero-list-item {
  padding: 0px 16px 16px 16px;
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
  background-origin: content-box;
}

.position-relative {
  position: relative;
}

.manage-resources-btn {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

.equipment-skills-btn {
  position: absolute;
  bottom: 16px;
  left: 190px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

/* Customizar o painel de expansão */
:deep(.v-expansion-panel-title) {
  min-height: 72px;
}

:deep(.v-expansion-panel-title__overlay) {
  background-color: rgba(31, 41, 55, 0.8);
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

:deep(.v-expansion-panel) {
  background-color: #1f2937 !important;
}

:deep(.v-expansion-panel-title) {
  background-color: #1f2937 !important;
  color: white !important;
}

:deep(.v-expansion-panel-title:hover) {
  background-color: #374151 !important;
}
</style>
