<template>
  <ItemCardSelect
    @clear="onClear"
    :items="weaponCards"
    item-type="Weapon"
    :sub-type-list="subTypeList"
    :value="selectedId"
    @selected="onSelect"
    @stash="onStash"
    :repository="cardsDataRepository"
  ></ItemCardSelect>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import ItemCardSelect from "@/components/ItemCardSelect.vue";
import type { HeroData } from "@/data/repository/HeroData";
import { heroCanUse } from "@/data/repository/HeroData";
import type { WeaponItemData } from "@/data/repository/ItemData";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";

const playableHeroStore = usePlayableHeroStore();

const emit = defineEmits(["stash"]);
const props = defineProps<{
  playableHeroesPk: number;
  heroData: HeroData;
  cardsDataRepository: ItemDataRepository;
  filterProficiencies: boolean;
}>();

const heroView = playableHeroStore.findByPk(props.playableHeroesPk);
const weaponCards = computed(() =>
  props.cardsDataRepository
    .findByType("Weapon", null)
    .filter(
      (item) => !props.filterProficiencies || heroCanUse(props.heroData, item),
    )
    .map((item) => item as WeaponItemData),
);

let selectedId = heroView?.state.equipment?.weaponId ?? "";

function subTypeList(item: WeaponItemData) {
  return item.weaponTypes?.join(" | ") ?? "";
}

function onClear() {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (hero?.state.equipment) {
    hero.state.equipment.weaponId = "";
  }
}

function onSelect(selectedId: string) {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (hero?.state.equipment) {
    hero.state.equipment.weaponId = selectedId;
  }
}

function onStash() {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (!hero?.state.equipment?.weaponId) return;
  if (!hero.state.stashedCardIds) {
    hero.state.stashedCardIds = [];
  }
  hero.state.stashedCardIds.push(hero.state.equipment.weaponId);
  emit("stash");
}
</script>

<style scoped></style>