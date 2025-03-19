<template>
  <v-snackbar v-model="props" :timeout="timeout">
    {{ text }}

    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const props = defineProps({
  summary: String,
  detail: Error,
  life: Number,
});
</script>
