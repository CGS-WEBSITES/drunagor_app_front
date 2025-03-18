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

import { ref } from "vue";



// Alterna o estado da variante ao clicar
const toggleVariant = (variantId) => {
  if (variantSettings.value.includes(variantId)) {
    variantSettings.value = variantSettings.value.filter((id) => id !== variantId);
  } else {
    variantSettings.value = [variantId]; // Permite apenas um selecionado por vez
  }
};

</script>

<template>
  <v-container max-width="680">
    <v-card class="my-4 pa-3 custom-card">
      <v-card-title class="text-uppercase font-weight-bold">Variants</v-card-title>
      <v-card-text>
        <v-row class="variant-container">
          <v-col
            v-for="(variant, index) in variantStore.getAll()"
            :key="variant.id"
            cols="12"
            md="4"
            class="d-flex justify-center"
            :class="{ 'sm-single': variantStore.getAll().length % 2 !== 0 && index === variantStore.getAll().length - 2 }"
          >
            <v-btn
              class="variant-button"
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

<style scoped>
.custom-card {
  background-color: #2C2C2C;
  border-radius: 8px;
  padding: 12px;
}

/* Ajuste de botão */
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
}

/* Botão ativo */
.variant-button.active {
  background-color: #008C8C;
  color: white;
}

</style>

