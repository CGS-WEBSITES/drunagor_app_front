<template>
  <!-- A hero sheet card that folds down to its title. The choice is remembered. -->
  <section class="sheet-card sheet-fold" :class="{ 'sheet-fold--collapsed': collapsed }">
    <button
      class="sheet-fold__toggle"
      :aria-expanded="!collapsed"
      :aria-label="collapsed ? 'Show section' : 'Hide section'"
      @click="collapsed = !collapsed"
    >
      <v-icon size="22" class="sheet-fold__chevron">mdi-chevron-up</v-icon>
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
  transition: padding 0.2s ease;
}
.sheet-fold__toggle {
  position: absolute;
  top: 12px;
  right: 10px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  opacity: 0.55;
  transition: background 0.15s ease, opacity 0.15s ease;
}
.sheet-fold__toggle:hover {
  background: rgba(255, 255, 255, 0.08);
  opacity: 1;
}
.sheet-fold__chevron {
  transition: transform 0.2s ease;
}
.sheet-fold--collapsed .sheet-fold__chevron {
  transform: rotate(180deg);
}
/* Room for the button next to each card title. */
.sheet-fold__content :deep(.sheet-title-row),
.sheet-fold__content > :deep(.sheet-title),
.sheet-fold__content :deep(.effects-card > .sheet-title-row) {
  padding-right: 40px;
}
/* Folded: a slim bar with just the title. */
.sheet-fold--collapsed {
  padding-top: 14px !important;
  padding-bottom: 14px !important;
}
.sheet-fold--collapsed .sheet-fold__toggle {
  top: 8px;
}
.sheet-fold--collapsed .sheet-fold__content {
  max-height: 24px;
  overflow: hidden;
}
</style>
