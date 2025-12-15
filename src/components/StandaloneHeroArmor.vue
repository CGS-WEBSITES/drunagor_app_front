<template>
  <ItemCardSelect
    @clear="onClear"
    :items="armorCards"
    item-type="Armor"
    :sub-type-list="subTypeList"
    :value="armorId"
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
import type { ArmorItemData } from "@/data/repository/ItemData";
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
const armorId = heroView?.state.equipment?.armorId ?? "";
const armorCards = computed(() =>
  props.cardsDataRepository
    .findByType("Armor", null)
    .filter(
      (item) => !props.filterProficiencies || heroCanUse(props.heroData, item),
    )
    .map((card) => card as ArmorItemData),
);

function subTypeList(item: ArmorItemData) {
  if (typeof item.armorTypes === "undefined") {
    return "";
  }
  return item.armorTypes.join(" | ");
}

function onClear() {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (hero?.state.equipment) {
    hero.state.equipment.armorId = "";
  }
}

function onSelect(selectedId: string) {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (hero?.state.equipment) {
    hero.state.equipment.armorId = selectedId;
  }
}

function onStash() {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (!hero?.state.equipment?.armorId) return;
  if (!hero.state.stashedCardIds) {
    hero.state.stashedCardIds = [];
  }
  hero.state.stashedCardIds.push(hero.state.equipment.armorId);
  emit("stash");
}
</script>

<style scoped></style>