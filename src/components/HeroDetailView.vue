<script setup lang="ts">
import type { HeroData } from "@/data/repository/HeroData";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { useRoute } from "vue-router";
import CampaignHeroItems from "@/components/CampaignHeroItems.vue";
import CampaignHeroStash from "@/components/CampaignHeroStash.vue";
import CampaignHeroSkills from "@/components/CampaignHeroSkills.vue";
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import { ApocalypseItemDataRepository } from "@/data/repository/campaign/apocalypse/ApocalypseItemDataRepository";
import { AwakeningsItemDataRepository } from "@/data/repository/campaign/awakenings/AwakeningsItemDataRepository";
import { useI18n } from "vue-i18n";

const route = useRoute();
const heroDataRepository = new HeroDataRepository();
const { t } = useI18n();

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
} else {
  throw new Error("Unknown campaign");
}

const hero = heroDataRepository.find(heroId) ?? ({} as HeroData);

let stash = ref(0);
function onStash() {
  stash.value += 1;
}
</script>

<template>
  <v-row no-gutters class="py-6"
    ><v-col cols="12">
      <v-btn variant="elevated" @click="$router.go(-1)">{{
        t("label.back")
      }}</v-btn>
    </v-col></v-row
  >
  <v-row no-gutters
    ><v-col cols="12">
      <v-card
        elevation="16"
        rounded
        style="background-color: #1f2937"
        width="100%"
        class="hero-list-item"
      >
        <v-card-title class="text-h5 px-2">
          {{ hero.name }}
          <v-divider></v-divider>
        </v-card-title>
        <v-card-text class="px-2">
          <v-row no-gutters>
            <v-col cols="2">
              <v-avatar :image="hero.images.avatar" size="65" />
            </v-col>
            <v-col cols="10">
              <p>
                {{ t("label." + hero.race.toLowerCase()) }}
                {{ t("label." + hero.class.toLowerCase().replace(" ", "-")) }}
              </p>
              <p>
                {{ t("text.path-of") }}
                {{ t("label." + hero.path.toLowerCase()) }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row no-gutters class="px-6"
            ><v-col cols="12">
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
              /> </v-col
            ><v-col cols="12">
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
              /> </v-col
            ><v-col cols="12">
              <v-divider></v-divider>

              <div class="text-center text-h5">
                {{ t("label.skills") }}
              </div>
              <CampaignHeroSkills
                :campaign-id="campaignId"
                :hero-id="heroId"
              ></CampaignHeroSkills> </v-col
          ></v-row>
        </v-card-actions>
      </v-card> </v-col
  ></v-row>
</template>

<style scoped>
#hero-card {
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
}
</style>
