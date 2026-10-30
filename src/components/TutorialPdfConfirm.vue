<template>
  <!-- Opening the PDF leaves the app: ask first. -->
  <v-dialog v-model="open" max-width="380">
    <v-card class="pdf-confirm" rounded="xl">
      <div class="pdf-confirm__icon"><v-icon size="34">mdi-printer-outline</v-icon></div>
      <h3 class="pdf-confirm__title">Open the Tutorial book PDF?</h3>
      <p class="pdf-confirm__text">
        The PDF opens in a new tab, outside the app. Print it and the Wing 1 Tutorial can be played with the book alone.
      </p>
      <div class="pdf-confirm__actions">
        <v-btn variant="text" @click="open = false">Stay here</v-btn>
        <v-btn color="playbutton" variant="flat" prepend-icon="mdi-open-in-new" @click="go">Open PDF</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { TUTORIAL_BOOK_PDF } from "@/utils/tutorialBook";

const open = defineModel<boolean>({ default: false });

function go() {
  open.value = false;
  window.open(TUTORIAL_BOOK_PDF, "_blank", "noopener");
}
</script>

<style scoped>
.pdf-confirm {
  padding: 22px 20px 14px;
  background: rgb(var(--v-theme-surface)) !important;
  font-family: "Poppins", sans-serif;
  text-align: center;
}
.pdf-confirm__icon {
  display: inline-grid;
  place-items: center;
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
  border-radius: 50%;
  background: rgba(var(--v-theme-warning), 0.15);
  color: rgb(var(--v-theme-warning));
}
.pdf-confirm__title {
  margin: 0 0 6px;
  font-family: "Cinzel", serif;
  font-size: 1.15rem;
}
.pdf-confirm__text {
  margin: 0 0 16px;
  font-size: 0.85rem;
  line-height: 1.45;
  opacity: 0.8;
}
.pdf-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
