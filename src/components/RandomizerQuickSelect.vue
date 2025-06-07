<script setup lang="ts">
import ConfigurationContentMonster from "./ConfigurationContentMonster.vue";
import ConfigurationVariant from "./ConfigurationVariant.vue";
</script>

<template>
  <v-container max-width="660">
  <v-expansion-panels >
    <v-expansion-panel
      dark
      :title="$t('randomizer.enabled-content')"
      class="px-4"
    >
      <v-expansion-panel-text>
        <ConfigurationContentMonster />
        <ConfigurationContentHero/>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</v-container>
  
</template>

<style scoped></style>
