<template>
  <v-row no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn variant="elevated" color="primary" @click="saveAndGoBack">
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>
  <CampaignSavePut
    ref="savePutRef"
    :campaign-id="campaignId"
    style="display: none"
  />
  <v-row no-gutters>
    <v-col cols="12" class="d-flex align-center justify-center">
      <v-card
        elevation="16"
        rounded
        style="background-color: #1f2937"
        width="800px"
        class="hero-list-item rounded-t-xl"
      >
        <v-img :src="hero.images.trackerInfo" class="rounded-0" contain />

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
  :campaign="campaign"  :hero="hero"          ></CampaignHeroSkills>
            </v-col>
             <v-col cols="12">
              <v-divider></v-divider>
              <div class="text-center text-h5 pt-4 pb-2">
                {{ t("label.class-abilities", "Class Abilities") }}
              </div>
              <div class="d-flex flex-wrap justify-center align-center pa-2 mb-2" style="gap: 8px">
                <v-chip
                  v-for="n in 8"
                  :key="n"
                  @click="setAbilityCount(n)"
                  :variant="n <= localClassAbilityCount ? 'elevated' : 'outlined'"
                  :color="n <= localClassAbilityCount ? 'amber-darken-2' : 'default'"
                  size="large"
                  style="cursor: pointer"
                >
                  <v-icon
                    :icon="n <= localClassAbilityCount ? 'mdi-star-circle' : 'mdi-circle-outline'"
                  ></v-icon>
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-row no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn variant="elevated" color="primary" @click="saveAndGoBack">
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { HeroData } from "@/data/repository/HeroData";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { useRoute } from "vue-router";
import CampaignHeroItems from "@/components/CampaignHeroItems.vue";
import CampaignHeroStash from "@/components/CampaignHeroStash.vue";
import CampaignHeroSkills from "@/components/CampaignHeroSkills.vue";
import { ref, watch } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import { UnderKeepItemDataRepository } from "@/data/repository/campaign/underkeep/UnderKeepItemDataRepository";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import { ApocalypseItemDataRepository } from "@/data/repository/campaign/apocalypse/ApocalypseItemDataRepository";
import { AwakeningsItemDataRepository } from "@/data/repository/campaign/awakenings/AwakeningsItemDataRepository";
import { useI18n } from "vue-i18n";
import CampaignSavePut from "@/components/CampaignSavePut.vue";
import { useRouter } from "vue-router";
import { HeroStore } from "@/store/HeroStore";

const route = useRoute();
const heroDataRepository = new HeroDataRepository();
const { t } = useI18n();
const router = useRouter();
const savePutRef = ref();

const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();
const campaignStore = CampaignStore();
const campaign = campaignStore.find(campaignId);
let repository: ItemDataRepository;

if (campaign.campaign === "core") {
  repository = new CoreItemDataRepository();
} else if (campaign.campaign === "apocalypse") {
  repository = new ApocalypseItemDataRepository();
} else if (campaign.campaign === "awakenings") {
  repository = new AwakeningsItemDataRepository();
} else if (campaign.campaign === "underkeep") {
  repository = new UnderKeepItemDataRepository();
} else {
  throw new Error("Unknown campaign");
}

const hero = heroDataRepository.find(heroId) ?? ({} as HeroData);

const heroStore = HeroStore();
const campaignHero = heroStore.findInCampaign(heroId, campaignId);

if (typeof campaignHero.classAbilityCount === "undefined") {
  campaignHero.classAbilityCount = 0;
}

const localClassAbilityCount = ref(campaignHero.classAbilityCount);

watch(localClassAbilityCount, (newCount) => {
  // A lógica de watch continua a mesma e é confiável
  campaignHero.classAbilityCount = Number(newCount) || 0;
});

// NOVA FUNÇÃO PARA A INTERFACE VISUAL
function setAbilityCount(count: number) {
  // Se o usuário clicar no mesmo chip que já está selecionado,
  // interpretamos como um desejo de "desmarcar", voltando ao estado anterior.
  if (localClassAbilityCount.value === count) {
    localClassAbilityCount.value = count - 1;
  } else {
    localClassAbilityCount.value = count;
  }
}

let stash = ref(0);
function onStash() {
  stash.value += 1;
}

function saveAndGoBack() {
  if (savePutRef.value && savePutRef.value.save) {
    savePutRef.value.save().then(() => {
      router.go(-1);
    });
  } else {
    router.go(-1);
  }
}
</script>

<style scoped>
#hero-card {
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
}
</style>