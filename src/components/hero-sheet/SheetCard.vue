<template>
  <!-- A hero sheet card that folds down to its title. The choice is remembered. -->
  <section class="sheet-card sheet-fold" :class="{ 'sheet-fold--collapsed': collapsed }">
    <button
      class="sheet-fold__toggle"
      :aria-expanded="!collapsed"
      :aria-label="collapsed ? 'Show section' : 'Hide section'"
      @click="collapsed = !collapsed"
    >
      <v-icon size="20">{{ collapsed ? "mdi-chevron-down" : "mdi-chevron-up" }}</v-icon>
    </button>
    <div class="sheet-fold__content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";

const props = defineProps<{ id: string }>();
const collapsed = useStorage(`heroSheet.${props.id}.collapsed`, false);
</script>

<style scoped>
.sheet-fold {
  position: relative;
}
.sheet-fold__toggle {
  position: absolute;
  top: 14px;
  right: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgb(var(--v-theme-secondary));
  transition: filter 0.15s ease;
}
.sheet-fold__toggle:hover {
  filter: brightness(1.2);
}
/* Room for the button next to each card's title. */
.sheet-fold__content :deep(.sheet-title-row),
.sheet-fold__content > :deep(.sheet-title),
.sheet-fold__content :deep(.effects-card > .sheet-title-row) {
  padding-right: 40px;
}
/* Folded: only the title line shows. */
.sheet-fold--collapsed .sheet-fold__content {
  max-height: 30px;
  overflow: hidden;
}
</style>
