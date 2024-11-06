<script setup lang="ts">
import type { VariantId } from "@/data/type/VariantId";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { VariantStore } from "@/store/VariantStore.js";
import { watch, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

const toast = useToast();
const { t } = useI18n();

const variantStore = VariantStore();
const configurationStore = ConfigurationStore();
const variantSettings = ref([] as VariantId[]);

configurationStore.enabledVariants.forEach((enabledVariant) => {
  variantSettings.value.push(enabledVariant);
});
watch(variantSettings, async (newSettings) => {
  if (newSettings.length > 0) {
    configurationStore.$patch({ enabledVariants: newSettings });
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
  <v-card class="my-4">
    <v-card-title>
      {{ $t("configuration.enabled-variant") }} 
    </v-card-title>
    <v-card-text>
      <v-checkbox dense v-for="variant in variantStore.getAll()" :key="variant.id"
        :label="$t(variant.translation_key)" v-model="variantSettings" :value="variant.id" >
      </v-checkbox>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
