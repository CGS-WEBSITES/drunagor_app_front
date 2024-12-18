<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t, locale } = useI18n();
const router = useRouter();

const items = ref(getMenuItems());

function getMenuItems() {
  return [
    {
      label: t("menu.random-monster"),
      icon: "mdi-help",
      command: () => {
        router.push({ name: "CampaignTracker" });
      },
    },
    {
      label: t("menu.campaign"),
      icon: "mdi-account-group",
      command: () => {
        router.push({ name: "Campaign Overview" });
      },
    },
    {
      label: t("menu.keyword"),
      icon: "mdi-magnify",
      command: () => {
        router.push({ name: "Keyword" });
      },
    },
    {
      label: t("menu.settings"),
      icon: "mdi-cog",
      command: () => {
        router.push({ name: "Configuration" });
      },
    },
  ];
}

watch(locale, () => {
  items.value = getMenuItems();
});
</script>

<template>
  <div class="card sticky top-0 z-20">
    <v-tool-bar density="compact" class="d-flex justify-center">
      <v-btn
        color="blue"
        class="mx-4 elevation-4"
        v-for="(item, i) in items"
        :key="i"
        @click="item.command()"
        :prepend-icon="item.icon"
        >{{ item.label }}
      </v-btn>
    </v-tool-bar>
  </div>
</template>
