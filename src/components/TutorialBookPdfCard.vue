<template>
  <!-- The Wing 1 Tutorial can be played with the printed book alone: offer its PDF. -->
  <div class="tbpdf" :class="{ 'tbpdf--compact': compact }">
    <div class="tbpdf__icon">
      <v-icon :size="compact ? 22 : 28">mdi-book-open-page-variant-outline</v-icon>
    </div>
    <div class="tbpdf__text">
      <strong>{{ title }}</strong>
      <span v-if="!compact">{{ text }}</span>
    </div>
    <v-btn
      class="tbpdf__btn"
      color="warning"
      variant="flat"
      :size="compact ? 'small' : 'default'"
      prepend-icon="mdi-download"
      @click="confirmOpen = true"
    >
      Download PDF
    </v-btn>
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
  gap: 16px;
  width: 100%;
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-warning), 0.45);
  background: rgba(var(--v-theme-warning), 0.1);
  color: rgb(var(--v-theme-on-surface));
}
.tbpdf__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 12px;
  background: rgba(var(--v-theme-warning), 0.18);
  color: rgb(var(--v-theme-warning));
}
.tbpdf__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  line-height: 1.45;
  opacity: 0.92;
}
.tbpdf__text strong {
  font-size: 1rem;
  opacity: 1;
}
.tbpdf__btn {
  flex-shrink: 0;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: none;
}
.tbpdf--compact {
  gap: 12px;
  padding: 10px 14px;
}
.tbpdf--compact .tbpdf__icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
}
@media (max-width: 600px) {
  .tbpdf {
    flex-wrap: wrap;
    padding: 16px;
  }
  .tbpdf__btn {
    width: 100%;
  }
}
</style>
