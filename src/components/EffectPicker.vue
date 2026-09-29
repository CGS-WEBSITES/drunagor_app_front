<template>
  <!-- A list of effects (aura, statuses, outcomes): search to add, cards that open to show the text. -->
  <div class="effects">
    <h3 class="effects__title">{{ title }}</h3>

    <v-autocomplete
      v-if="editable"
      :model-value="null"
      :items="available"
      item-title="name"
      item-value="id"
      :placeholder="placeholder"
      :loading="loading"
      variant="solo"
      density="compact"
      flat
      hide-details
      append-inner-icon="mdi-magnify"
      menu-icon=""
      class="effects__search"
      @update:model-value="add"
    />

    <div v-if="selected.length" class="effects__list">
      <div v-for="effect in selected" :key="effect.id" class="effect-card" :class="{ open: openId === effect.id }">
        <button class="effect-card__head" @click="openId = openId === effect.id ? null : effect.id">
          <span>{{ effect.name }}</span>
          <v-icon v-if="editable" size="18" class="effect-card__remove" :title="`Remove ${effect.name}`" @click.stop="remove(effect.id)">
            mdi-close
          </v-icon>
          <v-icon size="20">{{ openId === effect.id ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </button>
        <v-expand-transition>
          <p v-if="openId === effect.id && effect.effect" class="effect-card__text">{{ effect.effect }}</p>
        </v-expand-transition>
      </div>
    </div>
    <p v-else-if="!editable" class="effects__empty">{{ emptyText }}</p>

    <p v-if="hint" class="effects__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface Effect {
  id: string;
  name: string;
  effect?: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    items: Effect[];
    modelValue: string[];
    multiple?: boolean;
    editable?: boolean;
    loading?: boolean;
    placeholder?: string;
    hint?: string;
    emptyText?: string;
  }>(),
  { multiple: true, editable: true, loading: false, placeholder: "Add", hint: "", emptyText: "None" },
);
const emit = defineEmits<{ (e: "update:modelValue", value: string[]): void }>();

const openId = ref<string | null>(null);

const selected = computed(() =>
  props.modelValue.map((id) => props.items.find((item) => item.id === id)).filter((item): item is Effect => !!item),
);
const available = computed(() => props.items.filter((item) => !props.modelValue.includes(item.id)));

function add(id: string | null) {
  if (!id) return;
  emit("update:modelValue", props.multiple ? [...props.modelValue, id] : [id]);
  openId.value = id;
}
function remove(id: string) {
  emit("update:modelValue", props.modelValue.filter((value) => value !== id));
}
</script>

<style scoped>
.effects {
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif;
  color: #fff;
}
.effects__title {
  margin-bottom: 6px;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.effects__search {
  margin-bottom: 8px;
}
.effects__search :deep(.v-field) {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-size: 0.85rem;
}
.effects__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.effect-card {
  overflow: hidden;
  background: #3a3a3a;
  border-radius: 6px;
}
.effect-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: left;
}
.effect-card__head span {
  flex: 1;
}
.effect-card__remove {
  opacity: 0.6;
}
.effect-card__remove:hover {
  opacity: 1;
}
.effect-card__text {
  margin: 0;
  padding: 0 12px 12px;
  font-size: 0.8rem;
  line-height: 1.45;
  opacity: 0.9;
}
.effects__hint,
.effects__empty {
  margin: 6px 0 0;
  font-size: 0.72rem;
  opacity: 0.6;
}
</style>
