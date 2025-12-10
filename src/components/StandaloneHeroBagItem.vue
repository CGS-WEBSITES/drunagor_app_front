<template>
  <ItemCardSelectCategorized
    @clear="onClear"
    :categories="itemCardCategories"
    :sub-type-list="subTypeList"
    :value="itemId"
    :bagSlot="bagSlot"
    @selected="onSelect"
    @stash="onStash"
    :repository="cardsDataRepository"
  ></ItemCardSelectCategorized>
</template>

<script setup lang="ts">
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import ItemCardSelectCategorized from "@/components/ItemCardSelectCategorized.vue";
import type { ItemData } from "@/data/repository/ItemData";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";

const playableHeroStore = usePlayableHeroStore();

const emit = defineEmits(["stash"]);
const props = defineProps<{
  playableHeroesPk: number;
  cardsDataRepository: ItemDataRepository;
  bagSlot: number;
}>();

const heroView = playableHeroStore.findByPk(props.playableHeroesPk);

const slotItem =
  props.bagSlot === 1
    ? heroView?.state.equipment?.bagOneId
    : heroView?.state.equipment?.bagTwoId;
const itemId = slotItem ?? "";

const itemCards: ItemData[] = props.cardsDataRepository.findAll();
const itemCardCategories = [
  {
    name: "Treasure Deck",
    items: itemCards.filter((item) => item.cardType === "Chest"),
  },
  {
    name: "Misc",
    items: itemCards.filter((item) => item.cardType !== "Chest"),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subTypeList(item: ItemData) {
  return "";
}

function onClear() {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (!hero?.state.equipment) return;
  
  if (props.bagSlot === 1) {
    hero.state.equipment.bagOneId = "";
    return;
  }
  hero.state.equipment.bagTwoId = "";
}

function onSelect(selectedId: string) {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (!hero?.state.equipment) return;
  
  if (props.bagSlot === 1) {
    hero.state.equipment.bagOneId = selectedId;
    return;
  }
  hero.state.equipment.bagTwoId = selectedId;
}

function onStash() {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (!hero?.state.equipment) return;
  if (!hero.state.stashedCardIds) {
    hero.state.stashedCardIds = [];
  }
  
  if (props.bagSlot === 1) {
    if (!hero.state.equipment.bagOneId) return;
    hero.state.stashedCardIds.push(hero.state.equipment.bagOneId);
    emit("stash");
    return;
  }

  if (!hero.state.equipment.bagTwoId) return;
  hero.state.stashedCardIds.push(hero.state.equipment.bagTwoId);
  emit("stash");
}
</script>

<style scoped></style>