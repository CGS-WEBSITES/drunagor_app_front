<template>
  <!-- The boxes an item comes in, as small labels. Drunagor Nights shows its season flag. -->
  <span class="item-marks">
    <span
      v-for="source in sources"
      :key="source"
      class="item-mark"
      :style="{ background: ITEM_SOURCE_MARKS[source].color }"
      :title="ITEM_SOURCE_MARKS[source].label"
    >
      <img v-if="ITEM_SOURCE_MARKS[source].flag" :src="ITEM_SOURCE_MARKS[source].flag" alt="" class="item-mark__flag" />
      {{ ITEM_SOURCE_MARKS[source].short }}
    </span>
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
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 3px;
}
.item-mark {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 18px;
  padding: 0 6px;
  border-radius: 4px;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
}
.item-mark__flag {
  height: 14px;
}
</style>
