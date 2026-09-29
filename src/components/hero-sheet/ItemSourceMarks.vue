<template>
  <!-- The boxes an item comes in: box logos, or the Drunagor Nights season flags. -->
  <span class="item-marks">
    <img
      v-for="source in sources"
      :key="source"
      :src="ITEM_SOURCE_MARKS[source].image"
      :alt="ITEM_SOURCE_MARKS[source].label"
      :title="ITEM_SOURCE_MARKS[source].label"
      class="item-marks__mark"
      :class="{ 'item-marks__mark--flag': ITEM_SOURCE_MARKS[source].flag }"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ITEM_SOURCE_MARKS } from "@/data/heroMeta";
import { allItemsRepository } from "@/data/repository/AllItemsRepository";

const props = defineProps<{ itemId: string }>();
const sources = computed(() => allItemsRepository.sourcesOf(props.itemId));
</script>

<style scoped>
.item-marks {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 3px;
}
.item-marks__mark {
  width: auto;
  max-width: 44px;
  height: 18px;
  object-fit: contain;
}
.item-marks__mark--flag {
  width: 14px;
  height: 22px;
}
</style>
