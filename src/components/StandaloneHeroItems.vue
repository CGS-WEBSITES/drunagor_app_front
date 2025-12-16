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
        :cards-data-repository="combinedRepository"
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
        :cards-data-repository="combinedRepository"
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
        :cards-data-repository="combinedRepository"
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
        :cards-data-repository="combinedRepository"
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
      :cards-data-repository="combinedRepository"
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
      :cards-data-repository="combinedRepository"
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
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import { UnderKeepItemDataRepository } from "@/data/repository/campaign/underkeep/UnderKeepItemDataRepository";
import { UnderKeep2ItemDataRepository } from "@/data/repository/campaign/underkeep2/UnderKeep2ItemDataRepository";
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

class CombinedItemRepository implements ItemDataRepository {
  private repos: ItemDataRepository[];

  constructor() {
    this.repos = [
      new CoreItemDataRepository(),
      new UnderKeepItemDataRepository(),
      new UnderKeep2ItemDataRepository(),
    ];
  }

  find(id: string) {
    for (const repo of this.repos) {
      const item = repo.find(id);
      if (item) return item;
    }
    return null;
  }

  findByType(type: string, subType: string | null) {
    const allItems = this.repos.flatMap((repo) =>
      repo.findByType(type, subType)
    );
    
    const uniqueItemsMap = new Map();
    for (const item of allItems) {
      if (item && item.id) {
        if (!uniqueItemsMap.has(item.id)) {
          uniqueItemsMap.set(item.id, item);
        }
      }
    }

    return Array.from(uniqueItemsMap.values());
  }
}

const combinedRepository = new CombinedItemRepository();
</script>

<style scoped></style>