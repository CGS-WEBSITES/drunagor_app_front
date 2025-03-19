<script setup lang="ts">
const props = defineProps<{
  id?: string;
  class?: string;
  value?: string;
}>();

const emit = defineEmits<{
  (e: "search", keyword: string): void;
}>();

function search(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("search", target.value || "");
}
</script>

<template>
  <v-row no-gutters :id="props.id" :class="props.class">
    <v-col cols="12">
      <v-text-field
        clearable
        name="search"
        label="Search"
        variant="outlined"
        :v-model="props.value"
        @input="(event) => search(event)"
        append-icon="mdi-magnify"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<style scoped></style>
