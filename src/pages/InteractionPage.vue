<template>
  <!-- Opened by a QR code printed in the Tutorial book PDF: no login, no campaign. -->
  <div class="interaction-page">
    <InteractViewNew
      current-door="The Barricaded Path"
      wing="Wing 1 Tutorial"
      :start-with="interactionKey"
      @close="router.push('/')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import InteractViewNew from "@/components/InteractViewNew.vue";
import { interactionFromCode } from "@/utils/roomInteractions";

const route = useRoute();
const router = useRouter();
const interactionKey = computed(() => interactionFromCode(`/interaction/${(route.params as { code: string }).code}`));
</script>

<style scoped>
.interaction-page {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgb(var(--v-theme-background));
  overflow: auto;
}
</style>
