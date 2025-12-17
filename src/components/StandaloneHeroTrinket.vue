<template>
  <ItemCardSelect
    @clear="onClear"
    :items="trinketCards"
    item-type="Trinket"
    :sub-type-list="subTypeList"
    :value="trinketId"
    @selected="onSelect"
    @stash="onStash"
    :repository="cardsDataRepository"
  ></ItemCardSelect>
</template>

<script setup lang="ts">
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import ItemCardSelect from "@/components/ItemCardSelect.vue";
import type { ItemData } from "@/data/repository/ItemData";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";

const playableHeroStore = usePlayableHeroStore();

const emit = defineEmits(["stash"]);
const props = defineProps<{
  playableHeroesPk: number;
  cardsDataRepository: ItemDataRepository;
}>();

const heroView = playableHeroStore.findByPk(props.playableHeroesPk);
const trinketId = heroView?.state.equipment?.trinketId ?? "";
const trinketCards: ItemData[] = props.cardsDataRepository.findByType(
  "Trinket",
  null,
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subTypeList(item: ItemData) {
  return "";
}

function onClear() {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (hero?.state.equipment) {
    hero.state.equipment.trinketId = "";
  }
}

function onSelect(selectedId: string) {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (hero?.state.equipment) {
    hero.state.equipment.trinketId = selectedId;
  }
}

function onStash() {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (!hero?.state.equipment?.trinketId) return;
  if (!hero.state.stashedCardIds) {
    hero.state.stashedCardIds = [];
  }
  hero.state.stashedCardIds.push(hero.state.equipment.trinketId);
  emit("stash");
}
</script>

<style scoped></style>