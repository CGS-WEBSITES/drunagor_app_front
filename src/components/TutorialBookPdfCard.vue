<template>
  <!-- The Wing 1 Tutorial can be played with the printed book alone: offer its PDF. -->
  <div>
  <button type="button" class="tbpdf" :class="{ 'tbpdf--compact': compact }" @click="confirmOpen = true">
    <v-icon class="tbpdf__icon" :size="compact ? 26 : 36">mdi-printer-outline</v-icon>
    <span class="tbpdf__text">
      <strong>{{ title }}</strong>
      <span v-if="!compact">{{ text }}</span>
    </span>
    <v-icon class="tbpdf__go" size="20">mdi-download</v-icon>
  </button>
  <TutorialPdfConfirm v-model="confirmOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TutorialPdfConfirm from "@/components/TutorialPdfConfirm.vue";

withDefaults(defineProps<{ compact?: boolean; title?: string; text?: string }>(), {
  compact: false,
  title: "Tutorial book (PDF)",
  text: "Print it and the Wing 1 Tutorial can be played with the book alone. Its QR code opens the Interaction.",
});

const confirmOpen = ref(false);
</script>

<style scoped>
.tbpdf {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-warning), 0.55);
  background: rgba(var(--v-theme-warning), 0.12);
  color: rgb(var(--v-theme-on-surface));
  text-align: left;
  transition: background 0.15s ease;
}
.tbpdf:hover {
  background: rgba(var(--v-theme-warning), 0.22);
}
.tbpdf__icon,
.tbpdf__go {
  color: rgb(var(--v-theme-warning));
  flex-shrink: 0;
}
.tbpdf__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  font-size: 0.85rem;
  line-height: 1.3;
}
.tbpdf__text strong {
  font-size: 0.95rem;
}
.tbpdf--compact {
  padding: 8px 12px;
}
</style>
