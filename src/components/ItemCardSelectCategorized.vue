<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { ItemData } from "@/data/repository/ItemData";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import { useI18n } from "vue-i18n";
import { sortBy } from "lodash-es";

const props = defineProps<{
  categories: { name: string; items: ItemData[] }[];
  subTypeList: Function;
  bagSlot: number;
  value: string;
  repository: ItemDataRepository;
}>();
const emit = defineEmits(["clear", "selected", "stash"]);

const placeholder = "Select Bag Slot " + props.bagSlot;
const selectedId = ref(props.value);
const { t } = useI18n();

let items = computed(() => {
  let globalItems: string[] = []
  
  props.categories.map((category) => {
    const translatedItems = category.items.map((item) => {
      return {
        ...item,
        name: t(item.translation_key),
      };
    });

    sortBy(translatedItems, ["name"]).map((sortedItem)=>{
      globalItems.push(sortedItem)
    });
  });

  return globalItems
});

function onStash() {
  emit("stash");
  selectedId.value = "";
}

watch(selectedId, (newSelectedId) => {
  emit("selected", newSelectedId);
});
</script>

<template>
  <v-autocomplete
    clearable
    v-model="selectedId"
    :items="items"
    item-title="name"
    item-value="id"
    :label="placeholder"
    :hint="$t('label.stash')"
    variant="outlined"
    @input="onStash"
  ></v-autocomplete>
</template>

<style scoped></style>
