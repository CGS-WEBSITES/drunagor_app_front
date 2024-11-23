<script setup lang="ts">
import CampaignHeroWeapon from "@/components/CampaignHeroWeapon.vue";
import CampaignHeroOffHand from "@/components/CampaignHeroOffHand.vue";
import CampaignHeroArmor from "@/components/CampaignHeroArmor.vue";
import CampaignHeroTrinket from "@/components/CampaignHeroTrinket.vue";
import CampaignHeroBagItem from "@/components/CampaignHeroBagItem.vue";
import { HeroStore } from "@/store/HeroStore";
import { HeroEquipment } from "@/store/Hero";
import type { HeroData } from "@/data/repository/HeroData";
import { ref } from "vue";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const heroStore = HeroStore();

const props = defineProps<{
  heroId: string;
  hero: HeroData;
  campaignId: string;
  repository: ItemDataRepository;
}>();

const filterProficiencies = ref(true);

const campaignHero = heroStore.findInCampaign(props.heroId, props.campaignId);
if (typeof campaignHero.equipment === "undefined") {
  campaignHero.equipment = new HeroEquipment();
}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12" class="px-6 py-1">
      <v-label>
        <v-switch
          v-model="filterProficiencies"
          color="primary"
          hide-details
          inset
          class="mr-3"
        ></v-switch>
        {{ t("label.filter-by-proficiency") }}
      </v-label>
    </v-col>

    <v-col cols="12" class="px-6 py-1">
      <div class="pb-3">
        <span>{{ t("label.weapon") }}</span>
      </div>
      <CampaignHeroWeapon
        :campaign-id="campaignId"
        :hero-id="heroId"
        :hero-data="hero"
        :cards-data-repository="repository"
        :filter-proficiencies="filterProficiencies"
        @stash="$emit('stash')"
      />
    </v-col>

    <v-col cols="12" class="px-6 py-1">
      <div class="pb-3">
        <span>{{ t("label.off-hand") }}</span>
      </div>
      <CampaignHeroOffHand
        :campaign-id="campaignId"
        :hero-id="heroId"
        :hero-data="hero"
        :cards-data-repository="repository"
        :filter-proficiencies="filterProficiencies"
        @stash="$emit('stash')"
      >
      </CampaignHeroOffHand>
    </v-col>

    <v-col cols="12" class="px-6 py-1">
      <div class="pb-3">
        <span>{{ t("label.armor") }}</span>
      </div>
      <CampaignHeroArmor
        :campaign-id="campaignId"
        :hero-id="heroId"
        :hero-data="hero"
        :cards-data-repository="repository"
        :filter-proficiencies="filterProficiencies"
        @stash="$emit('stash')"
      >
      </CampaignHeroArmor>
    </v-col>
    <v-col cols="12" class="px-6 py-1">
      <div class="pb-3">
        <span>{{ t("label.trinket") }}</span>
      </div>
      <CampaignHeroTrinket
        :campaign-id="campaignId"
        :hero-id="heroId"
        :cards-data-repository="repository"
        @stash="$emit('stash')"
      >
      </CampaignHeroTrinket>
    </v-col>
  </v-row>
  <v-col cols="12" class="px-6 py-1">
    <div class="">
      <span>{{ t("label.bag-slot") }} 1</span>
    </div>
    <CampaignHeroBagItem
      :campaign-id="campaignId"
      :hero-id="heroId"
      :cards-data-repository="repository"
      :bagSlot="1"
      @stash="$emit('stash')"
    >
    </CampaignHeroBagItem>
  </v-col>
  <div class="mt-8">
    <v-col cols="12" class="px-6 py-1">
      <div class="pb-3">
        <span>{{ t("label.bag-slot") }} 2</span>
      </div>
      <CampaignHeroBagItem
        :campaign-id="campaignId"
        :hero-id="heroId"
        :cards-data-repository="repository"
        :bagSlot="2"
        @stash="$emit('stash')"
      >
      </CampaignHeroBagItem>
    </v-col>
  </div>
</template>

<style scoped></style>
