<template>
  <v-row no-gutters>
    <v-col cols="12" class="py-1">
      <v-label>
        <v-switch
          v-model="filterProficiencies"
          color="success"
          hide-details
          inset
          class="mr-3"
        ></v-switch>
        {{ t("label.filter-by-proficiency") }}
      </v-label>
    </v-col>

    <v-col cols="12" class="py-1">
      <div class="pb-3">
        <span>{{ t("label.weapon") }}</span>
      </div>
      <StandaloneHeroWeapon
        :playable-heroes-pk="playableHeroesPk"
        :hero-data="hero"
        :cards-data-repository="repository"
        :filter-proficiencies="filterProficiencies"
        @stash="$emit('stash')"
      />
    </v-col>

    <v-col cols="12" class="py-1">
      <div class="pb-3">
        <span>{{ t("label.off-hand") }}</span>
      </div>
      <StandaloneHeroOffHand
        :playable-heroes-pk="playableHeroesPk"
        :hero-data="hero"
        :cards-data-repository="repository"
        :filter-proficiencies="filterProficiencies"
        @stash="$emit('stash')"
      />
    </v-col>

    <v-col cols="12" class="py-1">
      <div class="pb-3">
        <span>{{ t("label.armor") }}</span>
      </div>
      <StandaloneHeroArmor
        :playable-heroes-pk="playableHeroesPk"
        :hero-data="hero"
        :cards-data-repository="repository"
        :filter-proficiencies="filterProficiencies"
        @stash="$emit('stash')"
      />
    </v-col>

    <v-col cols="12" class="py-1">
      <div class="pb-3">
        <span>{{ t("label.trinket") }}</span>
      </div>
      <StandaloneHeroTrinket
        :playable-heroes-pk="playableHeroesPk"
        :cards-data-repository="repository"
        @stash="$emit('stash')"
      />
    </v-col>
  </v-row>

  <v-col cols="12" class="py-1">
    <div class="pb-3">
      <span>{{ t("label.bag-slot") }} 1</span>
    </div>
    <StandaloneHeroBagItem
      :playable-heroes-pk="playableHeroesPk"
      :cards-data-repository="repository"
      :bagSlot="1"
      @stash="$emit('stash')"
    />
  </v-col>

  <v-col cols="12" class="py-1">
    <div class="pb-3">
      <span>{{ t("label.bag-slot") }} 2</span>
    </div>
    <StandaloneHeroBagItem
      :playable-heroes-pk="playableHeroesPk"
      :cards-data-repository="repository"
      :bagSlot="2"
      @stash="$emit('stash')"
    />
  </v-col>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import { HeroEquipment } from "@/store/Hero";
import type { HeroData } from "@/data/repository/HeroData";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import StandaloneHeroWeapon from "@/components/StandaloneHeroWeapon.vue";
import StandaloneHeroOffHand from "@/components/StandaloneHeroOffHand.vue";
import StandaloneHeroArmor from "@/components/StandaloneHeroArmor.vue";
import StandaloneHeroTrinket from "@/components/StandaloneHeroTrinket.vue";
import StandaloneHeroBagItem from "@/components/StandaloneHeroBagItem.vue";

const { t } = useI18n();
const playableHeroStore = usePlayableHeroStore();

const props = defineProps<{
  playableHeroesPk: number;
  hero: HeroData;
  repository: ItemDataRepository;
}>();

defineEmits<{
  (e: "stash"): void;
}>();

const filterProficiencies = ref(true);

const heroView = playableHeroStore.findByPk(props.playableHeroesPk);
if (heroView && typeof heroView.state.equipment === "undefined") {
  heroView.state.equipment = new HeroEquipment();
}
</script>

<style scoped></style>
