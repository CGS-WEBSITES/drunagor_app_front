<template>
  <div :id="props.id">
    <header>
      <slot name="header"></slot>
    </header>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id?: string;
}>();
</script>

<style scoped></style>
