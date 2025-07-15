<template>
  <v-alert
    v-model="visible"
    :type="type"
    :icon="icon"
    :title="title"
    :text="text"
    :border="border"
    :variant="variant"
    :color="color"
    :closable="closable"
    v-bind="$attrs"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <!-- Se você passar conteúdo via slot, ele aparece aqui -->
    <template v-if="$slots.default">
      <slot />
    </template>
  </v-alert>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  type: {
    type: String as () => "success" | "error" | "warning" | "info",
    required: true,
  },
  icon: { type: String, default: undefined },
  title: { type: String, default: undefined },
  text: { type: Boolean, default: false },
  border: { type: String, default: undefined },
  variant: { type: String, default: undefined },
  color: { type: String, default: undefined },
  closable: { type: Boolean, default: true },
});
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

// Controle interno de visibilidade, espelhando `modelValue`
const visible = ref(props.modelValue);
watch(
  () => props.modelValue,
  (v) => (visible.value = v),
);
watch(visible, (v) => emit("update:modelValue", v));
</script>
