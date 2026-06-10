<template>
  <v-container max-width="660" class="pa-0">
    <v-expansion-panels>
      <v-expansion-panel
        color="primary"
        :title="$t('randomizer.enabled-content')"
      >
        <v-expansion-panel-text class="pa-2">
          <ConfigurationContentMonster no-card />
          <ConfigurationContentHero no-card />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
import ConfigurationContentMonster from "./ConfigurationContentMonster.vue";
import ConfigurationVariant from "./ConfigurationVariant.vue";
</script>

<style scoped></style>
