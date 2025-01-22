<script setup lang="ts">
import { ContentDataStore } from "@/data/store/ContentDataStore";
import type { ContentId } from "@/data/type/ContentId";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { watch, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

const toast = useToast();
const { t } = useI18n();

const contentStore = ContentDataStore();
const configurationStore = ConfigurationStore();
const heroContentSettings = ref([] as ContentId[]);

configurationStore.enabledHeroContent.forEach((enabledContent) => {
  heroContentSettings.value.push(enabledContent);
});

watch(heroContentSettings, async (newSettings) => {
  if (newSettings.length > 0) {
    configurationStore.$patch({ enabledHeroContent: newSettings });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: t("configuration.error.atleast-one-selected"),
      life: 3000,
    });
  }
});
</script>

<template>
  <v-container max-width="680">
    <v-card class="my-4">
      <v-card-title>
        {{ $t("configuration.hero-content") }}
      </v-card-title>
      <v-card-text>
        <v-checkbox
          dense
          v-for="content in contentStore.getAllWithHeroes()"
          :key="content.id"
          :label="$t(content.translation_key)"
          v-model="heroContentSettings"
          :data-testid="'configuration-content-monster-' + content.id"
          :value="content.id"
        >
        </v-checkbox>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style>
