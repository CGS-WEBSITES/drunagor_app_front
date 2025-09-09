<template>
  <v-expansion-panels variant="accordion" class="mb-2">
    <v-expansion-panel elevation="16" rounded style="background-color: #1f2937">
      <v-expansion-panel-title class="pa-3 hero-background-title" :style="heroBackgroundStyle">
      <!--  <div class="d-flex align-center w-100">
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
        </div> -->
      </v-expansion-panel-title>

      <v-expansion-panel-text class="pa-0">
        <v-card-text class="px-0 pt-0 position-relative">
          <v-row no-gutters>
            <v-col cols="12" class="position-relative">
              <!-- <v-img :src="hero.images.trackerInfo" contain /> -->

              <div v-if="isAdmin && !loading" class="action-buttons-container">
                <v-btn
                  v-if="isSequentialAdventure"
                  @click.stop="openSequentialStateEditor"
                  variant="elevated"
                  color="secondary"
                  rounded
                  class="action-btn manage-btn"
                  size="small"
                >
                  {{ t("Manage Resources") }}
                </v-btn>

                <v-btn
                  v-if="
                    (campaign.campaign == 'core' ||
                      campaign.campaign == 'awakenings' ||
                      campaign.campaign == 'apocalypse' ||
                      campaign.campaign == 'underkeep')
                  "
                  @click.stop="openHeroEquipmentSkills"
                  variant="elevated"
                  color="primary"
                  rounded
                  class="action-btn equipment-btn ml-2"
                  size="small"
                >
                  {{ t("label.equipment-skills") }}
                </v-btn>
              </div>
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
import { ref, onMounted, computed } from "vue";
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

const heroBackgroundStyle = computed(() => ({
  backgroundImage: `url(${hero.images?.trackerInfo || hero.images?.background})`,
  backgroundSize: 'auto 100%',       
  backgroundPosition: 'left center', 
  backgroundRepeat: 'no-repeat'
}));

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
.action-buttons-container {
  margin-top: 10px;
  display: flex;
  flex-direction: row; 
  align-items: flex-start;
  flex-wrap: wrap;
  margin-left: 15px;
}

.action-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  min-width: auto !important;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex: 0 0 auto; 
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
}

@media (max-width: 360px) {
  .action-buttons-container {
    flex-direction: row;
    justify-content: flex-start;
    width: calc(100% - 8px);
    gap: 4px;
  }
  
  .action-btn {
    flex: 0 0 auto;
    max-width: 85px;
    font-size: 0.65rem !important;
    padding: 2px 4px !important;
    height: 24px !important;
    min-width: 60px !important;
  }
}

@media (min-width: 361px) and (max-width: 480px) {
  .action-btn {
    font-size: 0.7rem !important;
    padding: 2px 6px !important;
    height: 26px !important;
    min-width: 80px !important;
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .action-btn {
    font-size: 0.75rem !important;
    padding: 4px 8px !important;
    height: 28px !important;
    min-width: 90px !important;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .action-btn {
    font-size: 0.8rem !important;
    padding: 4px 8px !important;
    height: 30px !important;
    min-width: 100px !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .action-btn {
    font-size: 0.85rem !important;
    padding: 6px 12px !important;
    height: 32px !important;
  }
}

.hero-list-item {
  padding: 0px 16px 16px 16px;
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
  background-origin: content-box;
}

.position-relative {
  position: relative;
}

.hero-background-title {
  position: relative;
  overflow: hidden;
  min-height: 100px !important;
}

.hero-background-title > .d-flex {
  position: relative;
  z-index: 2;
}

:deep(.v-expansion-panel-title) {
  min-height: 80px;
  position: relative;
  overflow: hidden;
}

:deep(.v-expansion-panel-title__overlay) {
  background-color: transparent !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

:deep(.v-expansion-panel) {
  background-color: #1f2937 !important;
}

:deep(.v-expansion-panel-title) {
  background-color: transparent !important;
  color: white !important;
}

.hero-background-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg, 
    rgba(0, 0, 0, 0.2) 0%,      
    rgba(0, 0, 0, 0.3) 30%,     
    rgba(0, 0, 0, 0.6) 70%,    
    rgba(0, 0, 0, 0.8) 100%     
  );
  z-index: 1;
}

:deep(.v-expansion-panel-title:hover .hero-background-title::before) {
  background: linear-gradient(
    90deg, 
    rgba(0, 0, 0, 0.1) 0%,      
    rgba(0, 0, 0, 0.2) 30%, 
    rgba(0, 0, 0, 0.5) 70%,
    rgba(0, 0, 0, 0.7) 100%
  );
}
</style>