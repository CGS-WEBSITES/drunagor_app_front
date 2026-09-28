<template>
  <!-- Inline flags: emoji flags do not render on Windows. -->
  <svg class="language-flag" viewBox="0 0 30 20" role="img" :aria-label="label">
    <template v-if="language === 'en'">
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0 30 20M30 0 0 20" stroke="#fff" stroke-width="4" />
      <path d="M0 0 30 20M30 0 0 20" stroke="#C8102E" stroke-width="1.6" />
      <path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6" />
      <path d="M15 0v20M0 10h30" stroke="#C8102E" stroke-width="3.6" />
    </template>
    <template v-else-if="language === 'it'">
      <rect width="10" height="20" fill="#009246" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#CE2B37" />
    </template>
    <template v-else-if="language === 'pl'">
      <rect width="30" height="10" fill="#fff" />
      <rect y="10" width="30" height="10" fill="#DC143C" />
    </template>
    <template v-else-if="language === 'pt'">
      <rect width="30" height="20" fill="#009C3B" />
      <path d="M15 2.5 27.5 10 15 17.5 2.5 10Z" fill="#FFDF00" />
      <circle cx="15" cy="10" r="4.4" fill="#002776" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import type { LanguageCode } from "@/data/library";

defineProps<{ language: LanguageCode; label?: string }>();
</script>

<style scoped>
.language-flag {
  width: 20px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
}
</style>
