<template>
  <ItemCardSelect
    @clear="onClear"
    :items="offHandCards"
    item-type="Off Hand"
    :sub-type-list="subTypeList"
    :value="offHandId"
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
import type { OffHandItemData } from "@/data/repository/ItemData";
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
const offHandId = heroView?.state.equipment?.offHandId ?? "";
const offHandCards = computed(() =>
  props.cardsDataRepository
    .findByType("Off Hand", null)
    .filter(
      (item) => !props.filterProficiencies || heroCanUse(props.heroData, item),
    )
    .map((card) => card as OffHandItemData),
);

function subTypeList(item: OffHandItemData) {
  return item.offHandTypes?.join(" | ") ?? "";
}

function onClear() {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (hero?.state.equipment) {
    hero.state.equipment.offHandId = "";
  }
}

function onSelect(selectedId: string) {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (hero?.state.equipment) {
    hero.state.equipment.offHandId = selectedId;
  }
}

function onStash() {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (!hero?.state.equipment?.offHandId) return;
  if (!hero.state.stashedCardIds) {
    hero.state.stashedCardIds = [];
  }
  hero.state.stashedCardIds.push(hero.state.equipment.offHandId);
  emit("stash");
}
</script>

<style scoped></style>