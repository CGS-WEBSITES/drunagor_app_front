<template>
  <v-row no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn
        variant="elevated"
        color="primary"
        @click="saveAndGoBack"
        :disabled="!isLoaded"
      >
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>

  <HeroSavePut
    ref="heroSavePutRef"
    :campaign-id="campaignId"
    :hero-id="heroId"
    @success="onSaveSuccess"
    @fail="onSaveFail"
    style="display: none"
  />

  <!-- Loading State -->
  <v-row v-if="!isLoaded" no-gutters>
    <v-col
      cols="12"
      class="d-flex justify-center align-center"
      style="min-height: 400px"
    >
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-col>
  </v-row>

  <v-row v-else no-gutters>
    <v-col cols="12" class="d-flex align-center justify-center">
      <v-card
        elevation="16"
        rounded
        style="background-color: #1f2937"
        width="800px"
        class="hero-list-item rounded-t-xl"
      >
        <v-img :src="hero?.images?.trackerInfo" class="rounded-0" contain />

        <v-card-actions>
          <v-row no-gutters class="px-6">
            <v-col cols="12">
              <v-divider></v-divider>

              <div class="text-center text-h5">
                {{ t("label.equipment") }}
              </div>
              <CampaignHeroItems
                :campaign-id="campaignId"
                :hero-id="heroId"
                :repository="repository"
                :hero="hero"
                @stash="onStash"
              />
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>

              <div class="text-center text-h5">
                {{ t("label.stash") }}
              </div>
              <CampaignHeroStash
                :campaign-id="campaignId"
                :repository="repository"
                :hero-id="heroId"
                :key="stash"
                class="px-2"
              />
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>

              <div class="text-center text-h5">
                {{ t("label.skills") }}
              </div>
              <CampaignHeroSkills
                :campaign-id="campaignId"
                :hero-id="heroId"
                :campaign="campaign"
                :hero="hero"
              ></CampaignHeroSkills>
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
              <div class="text-center text-h5 pt-4 pb-2">
                {{ t("label.class-abilities", "Class Abilities") }}
              </div>
              <div
                class="d-flex flex-wrap justify-center align-center pa-2 mb-2"
                style="gap: 8px"
              >
                <v-chip
                  v-for="n in 8"
                  :key="n"
                  @click="setAbilityCount(n)"
                  :variant="
                    n <= localClassAbilityCount ? 'elevated' : 'outlined'
                  "
                  :color="
                    n <= localClassAbilityCount ? 'amber-darken-2' : 'default'
                  "
                  size="large"
                  style="cursor: pointer"
                >
                  <v-icon
                    :icon="
                      n <= localClassAbilityCount
                        ? 'mdi-star-circle'
                        : 'mdi-circle-outline'
                    "
                  ></v-icon>
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-row v-if="isLoaded" no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn variant="elevated" color="primary" @click="saveAndGoBack">
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>

  <!-- Snackbar para feedback -->
  <v-snackbar
    v-model="snackbarVisible"
    :timeout="snackbarTimeout"
    :color="snackbarColor"
    location="top"
  >
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup lang="ts">
import type { HeroData } from "@/data/repository/HeroData";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { useRoute, useRouter } from "vue-router";
import CampaignHeroItems from "@/components/CampaignHeroItems.vue";
import CampaignHeroStash from "@/components/CampaignHeroStash.vue";
import CampaignHeroSkills from "@/components/CampaignHeroSkills.vue";
import HeroSavePut from "@/components/HeroSavePut.vue";
import { ref, onMounted } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import { UnderKeepItemDataRepository } from "@/data/repository/campaign/underkeep/UnderKeepItemDataRepository";
import { UnderKeep2ItemDataRepository } from "@/data/repository/campaign/underkeep2/UnderKeep2ItemDataRepository";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import { ApocalypseItemDataRepository } from "@/data/repository/campaign/apocalypse/ApocalypseItemDataRepository";
import { AwakeningsItemDataRepository } from "@/data/repository/campaign/awakenings/AwakeningsItemDataRepository";
import { useI18n } from "vue-i18n";
import { HeroStore } from "@/store/HeroStore";
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";
import type { Campaign } from "@/store/Campaign";

const route = useRoute();
const router = useRouter();
const heroDataRepository = new HeroDataRepository();
const { t } = useI18n();
const heroSavePutRef = ref();

const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();

const campaignStore = CampaignStore();
const heroStore = HeroStore();

const isLoaded = ref(false);

const campaign = ref<Campaign | null>(null);
const hero = ref<HeroData | null>(null);
const campaignHeroRef = ref<any>(null);
const repository = ref<ItemDataRepository | null>(null);

const localClassAbilityCount = ref(0);
const stash = ref(0);

const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const snackbarTimeout = ref(3000);

function getRepository(campaignType: string): ItemDataRepository {
  switch (campaignType) {
    case "core":
      return new CoreItemDataRepository();
    case "apocalypse":
      return new ApocalypseItemDataRepository();
    case "awakenings":
      return new AwakeningsItemDataRepository();
    case "underkeep":
      return new UnderKeepItemDataRepository();
    case "underkeep2":
      return new UnderKeep2ItemDataRepository();
    default:
      throw new Error(`Unknown campaign type: ${campaignType}`);
  }
}

function setAbilityCount(count: number) {
  if (localClassAbilityCount.value === count) {
    localClassAbilityCount.value = count - 1;
  } else {
    localClassAbilityCount.value = count;
  }
}

function onStash() {
  stash.value += 1;
}

const getInstructionStateKey = () => `campaign_${campaignId}_instruction_state`;
const getInstructionStepKey = (tab: string) =>
  `campaign_${campaignId}_instruction_step_${tab}`;

const getInstructionState = () => {
  if (typeof window !== "undefined") {
    try {
      const stateStr = localStorage.getItem(getInstructionStateKey());

      if (stateStr) {
        const state = JSON.parse(stateStr);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        if (now - state.timestamp < thirtyMinutes) {
          const stepStr = localStorage.getItem(
            getInstructionStepKey(state.tab),
          );
          return {
            expanded: state.expanded,
            tab: state.tab,
            step: stepStr ? parseInt(stepStr) : undefined,
          };
        } else {
          localStorage.removeItem(getInstructionStateKey());
          localStorage.removeItem(getInstructionStepKey("load"));
          localStorage.removeItem(getInstructionStepKey("save"));
        }
      }
    } catch (error) {
      console.error("Erro ao obter estado das instruções:", error);
    }
  }
  return null;
};

const onSaveSuccess = () => {
  snackbarText.value = "Equipment and skills saved successfully!";
  snackbarColor.value = "success";
  snackbarVisible.value = true;

  setTimeout(() => {
    navigateBack();
  }, 1000);
};

const onSaveFail = () => {
  snackbarText.value = "Failed to save equipment and skills.";
  snackbarColor.value = "error";
  snackbarVisible.value = true;
};

function navigateBack() {
  const instructionState = getInstructionState();
  const query: any = {};

  if (instructionState && instructionState.expanded) {
    query.instructions = "open";
    query.tab = instructionState.tab;
  }

  router.push({
    name: "Campaign",
    params: { id: campaignId },
    query: query,
  });
}

function syncStateToStore() {
  if (campaignHeroRef.value) {
    campaignHeroRef.value.classAbilityCount =
      Number(localClassAbilityCount.value) || 0;
  }
}

function saveAndGoBack() {
  syncStateToStore();

  if (heroSavePutRef.value && heroSavePutRef.value.save) {
    heroSavePutRef.value.save().catch((error: any) => {
      console.error("Error saving:", error);
      onSaveFail();
    });
  } else {
    navigateBack();
  }
}

onMounted(async () => {
  try {
    const loader = new CampaignLoadFromStorage();
    await loader.loadCampaignComplete(campaignId);

    const foundCampaign = campaignStore.find(campaignId);
    if (!foundCampaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }
    campaign.value = foundCampaign;

    repository.value = getRepository(foundCampaign.campaign);

    const updatedHero = heroStore.findInCampaignOptional(heroId, campaignId);

    if (updatedHero) {
      campaignHeroRef.value = updatedHero;

      if (!updatedHero.equipment) {
        updatedHero.equipment = {
          weaponId: "",
          offHandId: "",
          armorId: "",
          trinketId: "",
          bagOneId: "",
          bagTwoId: "",
        };
      }
      if (!updatedHero.stashedCardIds) {
        updatedHero.stashedCardIds = [];
      }
      if (!updatedHero.skillIds) {
        updatedHero.skillIds = [];
      }
      if (typeof updatedHero.classAbilityCount === "undefined") {
        updatedHero.classAbilityCount = 0;
      }

      localClassAbilityCount.value = updatedHero.classAbilityCount || 0;

      hero.value = heroDataRepository.find(heroId) ?? null;
    } else {
      console.error(`Hero ${heroId} not found in campaign ${campaignId}`);
      snackbarText.value = "Hero not found in this campaign.";
      snackbarColor.value = "error";
      snackbarVisible.value = true;
    }
  } catch (error) {
    console.error("Error loading hero data:", error);
    snackbarText.value = "Error loading hero data.";
    snackbarColor.value = "error";
    snackbarVisible.value = true;
  } finally {
    isLoaded.value = true;
  }
});
</script>

<style scoped>
#hero-card {
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
}
</style>
