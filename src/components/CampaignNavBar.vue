<template>
  <!-- PC: back on the left, the campaign's sections in the middle, Save on the right. Phones use the bottom bar. -->
  <v-container max-width="1400" class="campaign-nav d-none d-md-flex">
    <v-btn icon="mdi-arrow-left" class="campaign-nav__back" title="Back to campaigns" aria-label="Back to campaigns" @click="router.push('/campaign-tracker/')" />

    <v-card color="primary" rounded="lg" elevation="3" class="campaign-nav__card" role="tablist">
      <v-btn
        v-for="tab in TABS"
        :key="tab.value"
        rounded
        role="tab"
        :aria-selected="modelValue === tab.value"
        class="campaign-nav__tab"
        :class="{ active: modelValue === tab.value }"
        :prepend-icon="tab.icon"
        @click="emit('update:modelValue', tab.value)"
      >
        {{ tab.label }}
      </v-btn>
    </v-card>

    <v-btn class="campaign-nav__save" prepend-icon="mdi-content-save-outline" :loading="saving" @click="emit('save')">Save</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

defineProps<{ modelValue: string; saving?: boolean }>();
const emit = defineEmits<{ (e: "update:modelValue", value: string): void; (e: "save"): void }>();
const router = useRouter();

const TABS = [
  { value: "heroes", label: "Heroes", icon: "mdi-account-group" },
  { value: "keywords", label: "Keywords", icon: "mdi-book-search-outline" },
  { value: "tharmagar", label: "Tharmagar", icon: "mdi-comment-question-outline" },
  { value: "manage", label: "Manage", icon: "mdi-cog-outline" },
];
</script>

<style scoped>
.campaign-nav {
  align-items: center;
  gap: 12px;
  padding-top: 8px;
  padding-bottom: 8px;
}
.campaign-nav__back {
  flex-shrink: 0;
  background: rgb(var(--v-theme-primary)) !important;
}
.campaign-nav__card {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
}
.campaign-nav__tab {
  letter-spacing: 1px;
}
.campaign-nav__tab.active {
  background: rgb(var(--v-theme-terciary)) !important;
  color: rgb(var(--v-theme-on-terciary)) !important;
}
.campaign-nav__save {
  flex-shrink: 0;
  height: 48px !important;
  background: rgb(var(--v-theme-accent)) !important;
  color: #141414 !important;
  font-weight: 800;
  letter-spacing: 1px;
}
</style>
