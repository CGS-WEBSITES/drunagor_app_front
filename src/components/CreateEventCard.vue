<template>
  <!-- A blank, blurred event with the Create event button over it. -->
  <div class="create-event-card">
    <div class="create-event-card__ghost" aria-hidden="true">
      <div class="create-event-card__date">
        <span></span>
        <span class="create-event-card__day"></span>
        <span></span>
      </div>
      <div class="create-event-card__lines">
        <span class="w-60"></span>
        <span class="w-80"></span>
        <span class="w-40"></span>
      </div>
    </div>
    <div class="create-event-card__overlay">
      <v-btn color="accent" size="large" class="font-weight-bold" prepend-icon="mdi-plus-thick" :loading="loading" @click="emit('create')">
        Create event
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ loading?: boolean }>();
const emit = defineEmits<{ (e: "create"): void }>();
</script>

<style scoped>
.create-event-card {
  position: relative;
  min-height: 104px;
  overflow: hidden;
  border-radius: 6px;
}
/* Same shape as an event card, with empty placeholder bars. */
.create-event-card__ghost {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  min-height: 104px;
  padding: 12px;
  background: #fff;
  opacity: 0.35;
  filter: blur(2px);
}
.create-event-card__date {
  display: flex;
  flex: 0 0 56px;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.create-event-card__date span,
.create-event-card__lines span {
  display: block;
  height: 8px;
  background: #9e9e9e;
  border-radius: 4px;
}
.create-event-card__date span {
  width: 32px;
}
.create-event-card__date .create-event-card__day {
  width: 44px;
  height: 28px;
}
.create-event-card__lines {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
}
.create-event-card__lines .w-60 {
  width: 60%;
  height: 12px;
}
.create-event-card__lines .w-80 {
  width: 80%;
}
.create-event-card__lines .w-40 {
  width: 40%;
}
.create-event-card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
