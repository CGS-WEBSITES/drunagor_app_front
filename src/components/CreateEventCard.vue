<template>
  <!-- An empty, blurred event with the Create event button over it. -->
  <div class="create-event-card">
    <EventListCard :event="placeholder" timezone="UTC" class="create-event-card__ghost" aria-hidden="true" />
    <div class="create-event-card__overlay">
      <v-btn color="accent" size="large" class="font-weight-bold" prepend-icon="mdi-plus-thick" :loading="loading" @click="emit('create')">
        Create event
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import EventListCard from "@/components/EventListCard.vue";

defineProps<{ loading?: boolean }>();
const emit = defineEmits<{ (e: "create"): void }>();

const placeholder = {
  store_name: "Your next Drunagor Night",
  address: "Your store",
  scenario: "Pick a wing",
  event_date: new Date().toISOString(),
  seasons_fk: null,
};
</script>

<style scoped>
.create-event-card {
  position: relative;
  min-height: 104px;
  overflow: hidden;
  border-radius: 6px;
}
.create-event-card__ghost {
  height: 100%;
  filter: blur(2.5px);
  opacity: 0.55;
  pointer-events: none;
}
.create-event-card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(var(--v-theme-accent), 0.8);
  border-radius: 6px;
}
</style>
