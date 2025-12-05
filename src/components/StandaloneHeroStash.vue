<template>
  <div>
    <v-select
      v-model="stashedItemIds"
      clearable
      chips
      :label="$t('text.add-or-remove-stashed-items')"
      hint="Cannot be used during a scenario"
      :items="sortedItems"
      item-title="name"
      item-value="id"
      multiple
      variant="outlined"
    ></v-select>
    <v-sheet
      v-if="stashedItemIds.length > 0"
      rounded
      border="md"
      class="mb-6 pa-6 text-white"
      style="background-color: #1f2937 !important"
    >
      <ul>
        <li
          class="py-1"
          v-for="itemCard in findItemCards(stashedItemIds)"
          :key="itemCard.id"
        >
          {{ t(itemCard.translation_key) }}
        </li>
      </ul>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import type { ItemData } from "@/data/repository/ItemData";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import * as _ from "lodash-es";

const { t } = useI18n();
const playableHeroStore = usePlayableHeroStore();

const props = defineProps<{
  playableHeroesPk: number;
  repository: ItemDataRepository;
}>();

const heroView = playableHeroStore.findByPk(props.playableHeroesPk);

if (heroView && typeof heroView.state.stashedCardIds === "undefined") {
  heroView.state.stashedCardIds = [];
}

const stashedItemIds = ref<string[]>(heroView?.state.stashedCardIds ?? []);

const sortedItems = computed(() => {
  const items = props.repository.findAll().map((item) => ({
    ...item,
    name: t(item.translation_key),
  }));
  return _.sortBy(items, ["name"]);
});

function findItemCards(stashedItemIds: string[]): ItemData[] {
  const itemCards: ItemData[] = [];
  stashedItemIds.forEach((stashedItemId) => {
    const itemCard = props.repository.find(stashedItemId);
    if (itemCard) {
      itemCards.push(itemCard);
    }
  });
  return itemCards;
}

watch(stashedItemIds, (newStashedItemCardIds) => {
  const hero = playableHeroStore.findByPk(props.playableHeroesPk);
  if (hero) {
    hero.state.stashedCardIds = newStashedItemCardIds;
  }
});
</script>

<style scoped></style>
