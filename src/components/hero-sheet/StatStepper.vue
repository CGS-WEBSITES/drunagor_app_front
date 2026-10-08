<template>
  <!-- A number with − and + on each side. -->
  <div class="stepper">
    <span class="stepper__label">
      <v-icon v-if="icon" size="16" class="mr-1" :color="iconColor">{{ icon }}</v-icon>{{ label }}
    </span>
    <div class="stepper__controls">
      <button class="stepper__btn stepper__btn--minus" :disabled="modelValue <= min" :aria-label="`Less ${label}`" @click="set(modelValue - 1)">
        <v-icon size="18">mdi-minus</v-icon>
      </button>
      <span class="stepper__value">{{ modelValue }}</span>
      <button class="stepper__btn stepper__btn--plus" :disabled="max != null && modelValue >= max" :aria-label="`More ${label}`" @click="set(modelValue + 1)">
        <v-icon size="18">mdi-plus</v-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{ modelValue: number; label: string; icon?: string; iconColor?: string; min?: number; max?: number | null }>(),
  { min: 0, max: null, icon: undefined, iconColor: undefined },
);
const emit = defineEmits<{ (e: "update:modelValue", value: number): void }>();

const set = (value: number) => {
  const clamped = Math.max(props.min, props.max != null ? Math.min(props.max, value) : value);
  emit("update:modelValue", clamped);
};
</script>

<style scoped>
.stepper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stepper__label {
  display: flex;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.8;
}
.stepper__controls {
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  overflow: hidden;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
}
.stepper__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  color: #fff;
  transition: filter 0.15s ease;
}
.stepper__btn--minus {
  background: #b04a4a;
}
.stepper__btn--plus {
  background: #4f9a4b;
}
.stepper__btn:hover:not(:disabled) {
  filter: brightness(1.15);
}
.stepper__btn:disabled {
  opacity: 0.35;
  cursor: default;
}
.stepper__value {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
</style>
