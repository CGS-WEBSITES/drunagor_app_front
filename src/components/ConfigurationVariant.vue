<template>
  <v-container max-width="660" class="pa-0">
    <v-card color="primary" class="my-4 pa-3 custom-card">
      <v-card-title class="text-uppercase font-weight-bold text-left mb-4">Variants</v-card-title>
      <v-card-text>
        <v-row class="variant-container">
          <v-col
            v-for="(variant, index) in variantStore.getAll()"
            :key="variant.id"
            cols="4"
            class="d-flex justify-center px-1"
          >
            <v-btn
              class="variant-button px-1"
              :class="{ active: variantSettings.includes(variant.id) }"
              @click="toggleVariant(variant.id)"
            >
              {{ $t(variant.translation_key) }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

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

watch(
  variantSettings,
  async (newSettings) => {
    configurationStore.$patch({ enabledVariants: newSettings });
  },
  { deep: true }
);

const toggleVariant = (variantId: VariantId) => {
  if (variantSettings.value.includes(variantId)) {
    variantSettings.value = variantSettings.value.filter((id) => id !== variantId);
  } else {
    variantSettings.value = [...variantSettings.value, variantId];
  }
};
</script>

<style scoped>
.custom-card {
  border-radius: 8px;
  padding: 12px;
}

.variant-button {
  flex: 1;
  background-color: #666;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  text-transform: uppercase;
  transition: background 0.2s ease-in-out;
  width: 100%;
  max-width: 220px;
  font-size: clamp(0.6rem, 1.8vw, 0.85rem) !important;
}

/* Botão ativo */
.variant-button.active {
  background-color: #008C8C;
  color: white;
}
</style>
