<template>
  <!-- Campaign actions on PC, in the same style as the Companion menu. Phones use the bottom bar. -->
  <v-container max-width="1100" class="campaign-nav d-none d-md-flex">
    <v-card color="primary" rounded="lg" elevation="3" class="campaign-nav__card">
      <v-btn icon="mdi-arrow-left" size="small" class="campaign-nav__back" title="Back to campaigns" aria-label="Back to campaigns" @click="router.push('/campaign-tracker/')" />
      <span class="campaign-nav__divider" />
      <v-btn
        v-for="action in visibleActions"
        :key="action.value"
        rounded
        class="campaign-nav__btn"
        :class="{ 'campaign-nav__btn--save': action.value === 'save', 'campaign-nav__btn--danger': action.value === 'remove' }"
        :prepend-icon="action.icon"
        @click="emit('action', action.value)"
      >
        {{ action.label }}
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{ showLoadInstructions?: boolean }>();
const emit = defineEmits<{ (e: "action", value: string): void }>();
const router = useRouter();

// Remove first and Save last, where the eye ends.
const ACTIONS = [
  { value: "remove", label: "Remove", icon: "mdi-delete-outline" },
  { value: "load-instructions", label: "Instructions", icon: "mdi-lightbulb-on-outline" },
  { value: "player-list", label: "Players", icon: "mdi-account-group" },
  { value: "keywords", label: "Keywords", icon: "mdi-book-search-outline" },
  { value: "export", label: "Export", icon: "mdi-export" },
  { value: "tharmagar", label: "Tharmagar", icon: "mdi-comment-question-outline" },
  { value: "save", label: "Save", icon: "mdi-content-save-outline" },
];

const visibleActions = computed(() =>
  ACTIONS.filter((action) => action.value !== "load-instructions" || props.showLoadInstructions),
);
</script>

<style scoped>
.campaign-nav {
  justify-content: center;
  padding-top: 8px;
  padding-bottom: 8px;
}
.campaign-nav__card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
}
.campaign-nav__btn {
  letter-spacing: 1px;
}
.campaign-nav__btn--save {
  background: rgb(var(--v-theme-accent)) !important;
  color: #141414 !important;
}
.campaign-nav__btn--danger {
  color: #ff8a80 !important;
}
.campaign-nav__back {
  background: rgb(var(--v-theme-secondary)) !important;
}
.campaign-nav__divider {
  width: 1px;
  height: 28px;
  margin: 0 4px;
  background: rgba(255, 255, 255, 0.2);
}
</style>
