<template>
  <v-container max-width="660">
    <v-expansion-panels>
      <v-expansion-panel
        color="primary"
        :title="$t('randomizer.enabled-content')"
        class="px-"
      >
        <v-expansion-panel-text>
          <ConfigurationContentMonster />
          <ConfigurationContentHero />
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
