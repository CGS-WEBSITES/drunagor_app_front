<script setup lang="ts">
import { ref, watch } from "vue";
import { HeroStore } from "@/store/HeroStore";
import type { ItemData } from "@/data/repository/ItemData";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import { useI18n } from "vue-i18n";
import * as _ from "lodash-es";

const heroStore = HeroStore();

const props = defineProps<{
  heroId: string;
  campaignId: string;
  repository: ItemDataRepository;
}>();
let items = props.repository.findAll();
const stashedItemIds = ref([] as string[]);
const hero = heroStore.findInCampaign(props.heroId, props.campaignId);
const { t } = useI18n();

if (typeof hero.stashedCardIds === "undefined") {
  hero.stashedCardIds = [];
}
stashedItemIds.value = hero.stashedCardIds;

items = items.map((item) => {
  return {
    ...item,
    name: t(item.translation_key),
  };
});

items = _.sortBy(items, ["name"]);

function findItemCards(stashedItemIds: string[]): ItemData[] {
  const itemCards: ItemData[] = [];
  stashedItemIds.forEach((stashedItemId) => {
    let itemCard = props.repository.find(stashedItemId);
    if (itemCard) {
      itemCards.push(itemCard);
    }
  });

  return itemCards;
}

watch(stashedItemIds, (newStashedItemCardIds) => {
  heroStore.findInCampaign(props.heroId, props.campaignId).stashedCardIds =
    newStashedItemCardIds;
});
</script>

<template>
  <div>
    <v-select
      v-model="stashedItemIds"
      clearable
      chips
      :label="$t('text.add-or-remove-stashed-items')"
      hint="Cannot be used during a scenario"
      :items="items"
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

<style scoped></style>
