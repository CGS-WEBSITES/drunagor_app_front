<template>
  <!-- Same friends panel as the profile's Friends tab. -->
  <div class="social">
    <div class="social__inner">
      <StoreListAdded />
    </div>
  </div>
</template>

<script setup lang="ts">
import StoreListAdded from "@/components/StoreListAdded.vue";
</script>

<style scoped>
.social {
  width: 100%;
  align-self: flex-start;
}
/* Clears the fixed 56px app bar (the root gets an inline padding from the layout). */
.social__inner {
  padding: 72px 16px 0;
}
</style>
