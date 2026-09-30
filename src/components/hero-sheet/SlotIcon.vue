<template>
  <!-- An equipment slot / item type icon: the design icon when there is one. -->
  <img v-if="entry.image" :src="entry.image" alt="" class="slot-icon" :style="{ height: `${size}px` }" />
  <v-icon v-else :size="size">{{ entry.mdi }}</v-icon>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { SLOT_ICONS } from "@/data/heroMeta";

const props = withDefaults(defineProps<{ type: string; size?: number }>(), { size: 18 });
const entry = computed(() => SLOT_ICONS[props.type] ?? SLOT_ICONS.Bag);
</script>

<style scoped>
.slot-icon {
  width: auto;
  object-fit: contain;
}
</style>
